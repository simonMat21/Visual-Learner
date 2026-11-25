"use client";

import { useEffect, useRef, useState } from "react";

import SortNarration from "@/components/SortNarration";
import { PlaybackButtons, StepProgress, ghostBtn, solidBtn } from "@/components/PlaybackBar";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { createPlayer } from "@/lib/mstVisual";
import {
  CAPACITY,
  SQ_CODE,
  bracketSteps,
  dequeueSteps,
  emptyState,
  enqueueSteps,
  peekQueueSteps,
  peekStackSteps,
  popSteps,
  pushSteps,
  randomState,
  sizeOf,
} from "@/lib/stackQueueSteps";

const W = 1000;
const HEIGHT = { stack: 392, queue: 236, circular: 380 };
const DIM = [120, 138, 128];

// stack column
const ST_X = 300;
const ST_BASE = 350;
const ST_PITCH = 44;
// straight queue row
const Q_Y = 118;
const Q_PITCH = 80;
// circular queue
const RING = { x: 290, y: 192, r: 128 };
const ARR = { x: 590, y: 120, pitch: 50 };

const stepDuration = (step) => {
  if (!step) return 900;
  if (step.done) return 1500;
  if (step.kind === "add") return 950;
  return 900;
};

const OPS = {
  stack: { push: "Push", pop: "Pop", peek: "Peek", brackets: "Check brackets" },
  queue: { enqueue: "Enqueue", dequeue: "Dequeue", peek: "Peek" },
  circular: { enqueue: "Enqueue", dequeue: "Dequeue", peek: "Peek" },
};

/**
 * Array-backed stack, queue and circular queue.  kind "stack" | "queue" | "circular"
 */
export default function StackQueueVisualizer({ kind = "stack" }) {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0 });
  const [op, setOp] = useState(kind === "stack" ? "push" : "enqueue");
  const [panel, setPanel] = useState(null);
  const [value, setValue] = useState("");
  const [text, setText] = useState("{[()()]}");

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        const H = HEIGHT[kind];
        let state = randomState(kind, 4);
        const disp = {};
        let player = null;

        const idleStats = () => {
          const size = sizeOf(kind, state);
          return {
            size,
            free: kind === "queue" ? state.cap - 1 - state.rear : state.cap - size,
            wasted: state.front,
          };
        };
        const showIdle = () => setPanel({ lines: [], stats: idleStats() });

        player = createPlayer(
          P,
          (s) => {
            setUi((u) => ({ ...u, ...s }));
            const st = player?.step;
            if (st) setPanel({ lines: st.lines, stats: st.stats, result: st.result, done: st.done, miss: !!st.miss });
          },
          { duration: stepDuration }
        );

        const forget = () => Object.keys(disp).forEach((k) => delete disp[k]);

        function run(name, result) {
          state = result.state;
          setOp(name);
          player.setSteps(result.steps);
          player.play();
        }

        api.current = {
          ...player,
          run(name, arg) {
            const make = {
              push: () => pushSteps(state, arg),
              pop: () => popSteps(state),
              brackets: () => {
                forget();
                return bracketSteps(arg);
              },
              enqueue: () => enqueueSteps(kind, state, arg),
              dequeue: () => dequeueSteps(kind, state),
              peek: () => (kind === "stack" ? peekStackSteps(state) : peekQueueSteps(kind, state)),
            }[name];
            if (make) run(name, make());
          },
          random() {
            state = randomState(kind, 4);
            forget();
            player.setSteps([]);
            showIdle();
          },
          clear() {
            state = emptyState(kind);
            forget();
            player.setSteps([]);
            showIdle();
          },
        };

        cleanup = () => player.destroy();

        P.setup = () => {
          P.createCanvas(W, H);
          showIdle();
        };

        /* ---------- positions ---------- */

        const stackPos = (i) => ({ x: ST_X, y: ST_BASE - i * ST_PITCH });
        const queueX = (i, cap) => W / 2 + (i - (cap - 1) / 2) * Q_PITCH;
        const ringPos = (i, cap) => {
          const a = -Math.PI / 2 + (i / cap) * Math.PI * 2;
          return { x: RING.x + Math.cos(a) * RING.r, y: RING.y + Math.sin(a) * RING.r };
        };
        const arrX = (i) => ARR.x + i * ARR.pitch;
        const OUT = {
          stack: { x: 560, y: 120 },
          queue: { x: 70, y: Q_Y },
          circular: { x: RING.x, y: RING.y },
        }[kind];

        function target(i, cap) {
          if (kind === "stack") return stackPos(i);
          if (kind === "queue") return { x: queueX(i, cap), y: Q_Y };
          return ringPos(i, cap);
        }

        /* ---------- drawing helpers ---------- */

        function label(t, x, y, color, size = 12, align = P.CENTER, bold = true) {
          P.push();
          P.noStroke();
          P.fill(...color);
          P.textAlign(align, P.CENTER);
          P.textSize(size);
          if (bold) P.textStyle(P.BOLD);
          P.text(t, x, y);
          P.pop();
        }

        function arrow(x1, y1, x2, y2, color, weight = 2) {
          P.push();
          P.stroke(...color);
          P.strokeWeight(weight);
          P.line(x1, y1, x2, y2);
          P.translate(x2, y2);
          P.rotate(Math.atan2(y2 - y1, x2 - x1));
          P.noStroke();
          P.fill(...color);
          P.triangle(0, 0, -9, 4.5, -9, -4.5);
          P.pop();
        }

        function slotBox(x, y, w, h, opts = {}) {
          P.push();
          P.rectMode(P.CENTER);
          P.noFill();
          P.stroke(...(opts.color || DIM));
          P.strokeWeight(1.5);
          if (opts.dash) P.drawingContext.setLineDash([4, 4]);
          P.rect(x, y, w, h, 6);
          P.drawingContext.setLineDash([]);
          if (opts.hatch) {
            const ctx = P.drawingContext;
            ctx.save();
            ctx.beginPath();
            ctx.rect(x - w / 2, y - h / 2, w, h);
            ctx.clip();
            P.stroke(DIM[0], DIM[1], DIM[2], 90);
            for (let k = -w; k < w + h; k += 9) P.line(x - w / 2 + k - h, y + h / 2, x - w / 2 + k, y - h / 2);
            ctx.restore();
          }
          P.pop();
        }

        function tile(x, y, w, h, val, fill, a, ring) {
          P.push();
          P.rectMode(P.CENTER);
          if (ring) {
            P.noFill();
            P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], ring);
            P.strokeWeight(4);
            P.rect(x, y, w + 10, h + 10, 9);
          }
          P.noStroke();
          P.fill(fill[0], fill[1], fill[2], a);
          P.rect(x, y, w, h, 6);
          P.fill(INK[0], INK[1], INK[2], a);
          P.textAlign(P.CENTER, P.CENTER);
          P.textStyle(P.BOLD);
          P.textSize(17);
          P.text(String(val), x, y + 0.5);
          P.pop();
        }

        P.draw = () => {
          player.update(P.deltaTime || 16);
          const step = player.step;
          const s = step ? step.state : state;
          const cap = s.cap;
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);
          const out = step && step.out;
          const present = new Set();

          // ease every value to its slot (and the removed one to the "out" spot)
          s.slots.forEach((it, i) => {
            if (!it) return;
            present.add(String(it.id));
            const t = target(i, cap);
            if (!disp[it.id]) {
              const from = kind === "stack" ? { x: t.x, y: 20 } : kind === "queue" ? { x: t.x + 60, y: t.y } : { x: t.x, y: t.y };
              disp[it.id] = { x: from.x, y: from.y, ax: arrX(i), a: 0 };
            }
            const d = disp[it.id];
            d.x += (t.x - d.x) * 0.2;
            d.y += (t.y - d.y) * 0.2;
            d.ax += (arrX(i) - d.ax) * 0.2;
            d.a += (255 - d.a) * 0.2;
            d.val = it.val;
            d.slot = i;
            d.out = false;
          });
          if (out) {
            present.add(String(out.id));
            const d = disp[out.id] || (disp[out.id] = { x: OUT.x, y: OUT.y, ax: arrX(0), a: 255 });
            d.x += (OUT.x - d.x) * 0.2;
            d.y += (OUT.y - d.y) * 0.2;
            d.a += (255 - d.a) * 0.2;
            d.val = out.val;
            d.slot = -1;
            d.out = true;
          }
          Object.keys(disp).forEach((k) => {
            if (present.has(k)) return;
            disp[k].a *= 0.8;
            if (disp[k].a < 4) delete disp[k];
          });

          P.background(...BOARD);
          const focus = step ? step.focus : null;
          const found = step ? step.found : null;
          const hot = step ? step.hot : null;

          /* ---------- empty slots and pointers ---------- */
          if (kind === "stack") {
            // the container
            P.push();
            P.noFill();
            P.stroke(...CHALK);
            P.strokeWeight(3);
            const left = ST_X - 46;
            const right = ST_X + 46;
            const bottom = ST_BASE + ST_PITCH / 2 + 4;
            const topY = ST_BASE - (cap - 1) * ST_PITCH - ST_PITCH / 2 - 4;
            P.line(left, topY, left, bottom);
            P.line(left, bottom, right, bottom);
            P.line(right, bottom, right, topY);
            P.pop();
            for (let i = 0; i < cap; i++) {
              const p = stackPos(i);
              slotBox(p.x, p.y, 76, 36, { dash: true });
              label(String(i), ST_X - 66, p.y, DIM, 11, P.CENTER, false);
            }
            const ty = s.top >= 0 ? stackPos(s.top).y : ST_BASE + ST_PITCH;
            const c = hot === "top" ? HIGHLIGHT : CHALK;
            arrow(ST_X + 120, ty, ST_X + 52, ty, c, hot === "top" ? 3.5 : 2);
            label(`top = ${s.top}`, ST_X + 128, ty, c, 13, P.LEFT);
            label(`capacity ${cap}`, ST_X, ST_BASE - (cap - 1) * ST_PITCH - ST_PITCH / 2 - 18, DIM, 11, P.CENTER, false);
          } else if (kind === "queue") {
            for (let i = 0; i < cap; i++) {
              const x = queueX(i, cap);
              const wasted = i < s.front && !s.slots[i];
              slotBox(x, Q_Y, 64, 40, { dash: !wasted, hatch: wasted });
              label(String(i), x, Q_Y + 34, DIM, 11, P.CENTER, false);
            }
            if (s.front > 0) {
              label(`${s.front} slot${s.front > 1 ? "s" : ""} wasted`, (queueX(0, cap) + queueX(s.front - 1, cap)) / 2, Q_Y + 54, DIM, 11);
            }
            const fx = queueX(Math.min(s.front, cap - 1), cap) + (s.front >= cap ? Q_PITCH : 0);
            const fc = hot === "front" ? HIGHLIGHT : CHALK;
            arrow(fx, Q_Y - 60, fx, Q_Y - 28, fc, hot === "front" ? 3.5 : 2);
            label(`front = ${s.front}`, fx, Q_Y - 70, fc, 13);
            const rx = s.rear >= 0 ? queueX(s.rear, cap) : queueX(0, cap) - Q_PITCH;
            const rc = hot === "rear" ? HIGHLIGHT : CHALK;
            arrow(rx, Q_Y + 84, rx, Q_Y + 50, rc, hot === "rear" ? 3.5 : 2);
            label(`rear = ${s.rear}`, rx, Q_Y + 96, rc, 13);
          } else {
            // ring of slots
            P.push();
            P.noFill();
            P.stroke(DIM[0], DIM[1], DIM[2], 120);
            P.strokeWeight(1.5);
            P.circle(RING.x, RING.y, RING.r * 2);
            P.pop();
            for (let i = 0; i < cap; i++) {
              const p = ringPos(i, cap);
              slotBox(p.x, p.y, 54, 40, { dash: true });
              const a = -Math.PI / 2 + (i / cap) * Math.PI * 2;
              label(String(i), RING.x + Math.cos(a) * (RING.r - 44), RING.y + Math.sin(a) * (RING.r - 44), DIM, 11, P.CENTER, false);
              // the same slots as a plain array
              slotBox(arrX(i), ARR.y, 42, 36, { dash: true });
              label(String(i), arrX(i), ARR.y + 30, DIM, 11, P.CENTER, false);
            }
            label("the same array, laid out flat", ARR.x - 21, ARR.y - 62, DIM, 11, P.LEFT, false);
            // wrap-around hint on the flat array
            arrow(arrX(cap - 1) + 26, ARR.y + 48, arrX(0) - 26, ARR.y + 48, [DIM[0], DIM[1], DIM[2]], 1);
            label("after the last slot comes slot 0 again", (arrX(0) + arrX(cap - 1)) / 2, ARR.y + 60, DIM, 11, P.CENTER, false);

            const pointer = (name, idx, side) => {
              const c = hot === name ? HIGHLIGHT : CHALK;
              const a = -Math.PI / 2 + (idx / cap) * Math.PI * 2;
              const off = side * 0.16;
              const ox = RING.x + Math.cos(a + off) * (RING.r + 62);
              const oy = RING.y + Math.sin(a + off) * (RING.r + 62);
              const tx = RING.x + Math.cos(a) * (RING.r + 28);
              const ty = RING.y + Math.sin(a) * (RING.r + 28);
              arrow(ox, oy, tx, ty, c, hot === name ? 3.5 : 2);
              label(name, ox + Math.cos(a + off) * 18, oy + Math.sin(a + off) * 12, c, 12);
              // and on the flat array
              const y = name === "front" ? ARR.y - 44 : ARR.y - 44;
              const dx = name === "front" ? -9 : 9;
              arrow(arrX(idx) + dx, y, arrX(idx) + dx, ARR.y - 22, c, hot === name ? 3 : 1.5);
              label(name === "front" ? "F" : "R", arrX(idx) + dx, y - 9, c, 11);
            };
            pointer("front", s.front, -1);
            pointer("rear", s.rear, 1);
            label(`front = ${s.front}   rear = ${s.rear}   count = ${s.count}`, ARR.x - 21, ARR.y + 96, CHALK, 13, P.LEFT);
          }

          /* ---------- values ---------- */
          Object.values(disp).forEach((d) => {
            const isFocus = !d.out && focus === d.slot;
            let fill = CHALK;
            if (!d.out && found === d.slot) fill = GOOD;
            if (d.out) fill = BAD;
            const ringA = isFocus ? 120 + 120 * pulse : 0;
            const w = kind === "stack" ? 76 : kind === "queue" ? 64 : 54;
            tile(d.x, d.y, w, kind === "stack" ? 36 : 40, d.val, fill, d.a, ringA);
            if (kind === "circular" && !d.out) tile(d.ax, ARR.y, 42, 36, d.val, fill, d.a, isFocus ? ringA : 0);
          });

          if (out) {
            const word = kind === "stack" ? "popped" : "dequeued";
            const dy = kind === "circular" ? 34 : 34;
            label(word, OUT.x, OUT.y + dy, BAD, 12);
          }

          /* ---------- bracket checker ---------- */
          const br = step && step.brackets;
          if (kind === "stack" && br) {
            const chars = [...br.text];
            const x0 = 560;
            label("checking", x0, 214, DIM, 11, P.LEFT, false);
            chars.forEach((c, i) => {
              const x = x0 + i * 24;
              const done = i < br.i;
              const cur = i === br.i;
              let color = done ? [GOOD[0], GOOD[1], GOOD[2]] : CHALK;
              if (cur) color = br.bad ? BAD : HIGHLIGHT;
              if (cur) {
                P.push();
                P.noFill();
                P.stroke(...color);
                P.strokeWeight(2);
                P.rectMode(P.CENTER);
                P.rect(x + 2, 246, 22, 30, 4);
                P.pop();
              }
              label(c, x + 2, 246, color, 20, P.CENTER);
            });
            if (br.good) label("balanced ✔", x0, 292, GOOD, 15, P.LEFT);
            if (br.bad && br.i >= chars.length) label("not balanced ✘", x0, 292, BAD, 15, P.LEFT);
          }

          // what the current step is checking
          if (step && step.hint) {
            const pos = kind === "stack" ? [560, 330] : kind === "queue" ? [W / 2, 22] : [ARR.x - 21, 300];
            label(step.hint, pos[0], pos[1], HIGHLIGHT, 13, kind === "queue" ? P.CENTER : P.LEFT);
          }
        };
      };

      p5Instance = new p5(sketch, sketchRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      p5Instance?.remove();
    };
  }, [kind]);

  const addName = kind === "stack" ? "push" : "enqueue";
  const removeName = kind === "stack" ? "pop" : "dequeue";
  const doAdd = () => {
    const v = Number(value);
    if (value.trim() === "" || !Number.isFinite(v)) return;
    api.current?.run(addName, Math.round(v));
  };

  const stats =
    kind === "queue"
      ? { size: "Size", free: "Free at the back", wasted: "Wasted at the front" }
      : { size: "Size", free: "Free slots" };

  return (
    <div>
      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doAdd()}
            placeholder="value"
            className="inpbox h-9 w-24"
            title={`Capacity ${CAPACITY[kind]}`}
          />
          <button type="button" className={solidBtn} onClick={doAdd}>
            {OPS[kind][addName]}
          </button>
          <button type="button" className={ghostBtn} onClick={() => api.current?.run(removeName)}>
            {OPS[kind][removeName]}
          </button>
          <button type="button" className={ghostBtn} onClick={() => api.current?.run("peek")}>
            Peek
          </button>
          <span className="mx-1 h-6 w-px bg-rule-strong" />
          <button type="button" className={ghostBtn} onClick={() => api.current?.random()}>
            Random
          </button>
          <button type="button" className={ghostBtn} onClick={() => api.current?.clear()}>
            Clear
          </button>
        </div>
        <PlaybackButtons ui={ui} api={api} />
      </div>

      {kind === "stack" && (
        <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center gap-2">
          <span className="text-sm text-ink-2">Use a stack to check brackets:</span>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && api.current?.run("brackets", text)}
            placeholder="e.g. {[()()]}"
            maxLength={24}
            className="inpbox h-9 w-56 font-mono"
          />
          <button type="button" className={ghostBtn} onClick={() => api.current?.run("brackets", text)}>
            Check brackets
          </button>
        </div>
      )}

      <StepProgress ui={ui} api={api} label={OPS[kind][op]} />

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration
        state={panel}
        guide={{
          code: SQ_CODE[kind][op],
          stats,
          legend: [
            { kind: "box-outline", label: "slot being used" },
            { kind: "box-good", label: "peeked value" },
            { kind: "tag", text: kind === "stack" ? "top" : "front / rear", label: "index pointer being changed" },
          ],
        }}
      />
    </div>
  );
}
