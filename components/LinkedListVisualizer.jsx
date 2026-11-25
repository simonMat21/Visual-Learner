"use client";

import { useEffect, useRef, useState } from "react";

import SortNarration from "@/components/SortNarration";
import { PlaybackButtons, StepProgress, ghostBtn, solidBtn } from "@/components/PlaybackBar";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { createPlayer } from "@/lib/mstVisual";
import {
  LIST_CODE,
  MAX_LIST,
  deleteSteps,
  emptyList,
  insertSteps,
  length,
  randomList,
  reverseSteps,
  rotateSteps,
  searchSteps,
} from "@/lib/linkedListSteps";

const W = 1000;
const H = 236;
const ROW = 104; // centre of the node row
const LIFT = 82; // how far below the row a node being added / removed sits
const TW = 50; // node tile width
const TH = 38;
const NEXT = [178, 192, 184];
const PREV = [140, 196, 245];

const OP_NAMES = { insert: "Insert", delete: "Delete", search: "Search", reverse: "Reverse", rotate: "Rotate" };

const stepDuration = (step) => {
  if (!step) return 900;
  if (step.done) return 1500;
  if (step.hot && step.hot.length) return 1150; // a pointer changes: give it a moment
  if (step.kind === "add" || step.kind === "remove") return 1000;
  return 750;
};

/**
 * Visualizer for the linked list pages.
 *   kind "single" | "double" | "circular"
 */
export default function LinkedListVisualizer({ kind = "single" }) {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0 });
  const [op, setOp] = useState("insert");
  const [panel, setPanel] = useState(null);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let list = randomList(5, kind);
        const disp = {};
        let player = null;

        const showIdle = () =>
          setPanel({ lines: [], stats: { hops: 0, comparisons: 0, nodes: length(list) } });

        player = createPlayer(
          P,
          (s) => {
            setUi((u) => ({ ...u, ...s }));
            const st = player?.step;
            if (st)
              setPanel({
                lines: st.lines,
                stats: { comparisons: 0, ...st.stats },
                result: st.result,
                done: st.done,
                miss: !!st.miss,
              });
          },
          { duration: stepDuration }
        );

        function forgetDrawn() {
          Object.keys(disp).forEach((k) => delete disp[k]);
        }

        function run(name, result) {
          list = result.list;
          setOp(name);
          player.setSteps(result.steps);
          player.play();
        }

        api.current = {
          ...player,
          run(name, a, b) {
            const make = {
              insert: () => insertSteps(list, kind, a, b),
              delete: () => deleteSteps(list, kind, a),
              search: () => searchSteps(list, kind, a),
              reverse: () => reverseSteps(list, kind),
              rotate: () => rotateSteps(list),
            }[name];
            if (make) run(name, make());
          },
          random() {
            list = randomList(5, kind);
            forgetDrawn();
            player.setSteps([]);
            showIdle();
          },
          clear() {
            list = emptyList();
            forgetDrawn();
            player.setSteps([]);
            showIdle();
          },
          length: () => length(list),
        };

        cleanup = () => player.destroy();

        P.setup = () => {
          P.createCanvas(W, H);
          showIdle();
        };

        /** Slot x for every id in the row; room on the right for "null". */
        function layout(order) {
          const n = order.length;
          const spacing = Math.min(108, (W - 190) / Math.max(1, n));
          const pos = {};
          order.forEach((id, i) => {
            pos[id] = W / 2 - 25 + (i - (n - 1) / 2) * spacing;
          });
          return pos;
        }

        function arrowHead(x, y, angle, color, size = 9) {
          P.push();
          P.translate(x, y);
          P.rotate(angle);
          P.noStroke();
          P.fill(...color);
          P.triangle(0, 0, -size, size / 2, -size, -size / 2);
          P.pop();
        }

        /** Polyline arrow with rounded corners. */
        function pathArrow(pts, color, weight) {
          P.push();
          P.noFill();
          P.stroke(...color);
          P.strokeWeight(weight);
          P.strokeJoin(P.ROUND);
          P.beginShape();
          pts.forEach(([x, y]) => P.vertex(x, y));
          P.endShape();
          P.pop();
          const [x1, y1] = pts[pts.length - 2];
          const [x2, y2] = pts[pts.length - 1];
          arrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1), color);
        }

        function curveArrow(x1, y1, x2, y2, color, weight, bend = 0) {
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2 + bend;
          P.push();
          P.noFill();
          P.stroke(...color);
          P.strokeWeight(weight);
          const ctx = P.drawingContext;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(mx, my, x2, y2);
          ctx.stroke();
          P.pop();
          arrowHead(x2, y2, Math.atan2(y2 - my, x2 - mx), color);
        }

        function label(text, x, y, color, size = 12, align = P.CENTER) {
          P.push();
          P.noStroke();
          P.fill(...color);
          P.textAlign(align, P.CENTER);
          P.textSize(size);
          P.textStyle(P.BOLD);
          P.text(text, x, y);
          P.pop();
        }

        /** One pointer: a → b, as "next" (on top) or "prev" (below, blue). */
        function drawPointer(a, b, field, hot, order) {
          const color = hot ? HIGHLIGHT : field === "prev" ? PREV : NEXT;
          const weight = hot ? 3.5 : 2;
          const dy = kind === "double" ? (field === "next" ? -7 : 7) : 0;
          if (b == null) {
            // null pointer: a short stub
            if (field === "prev") return;
            // the leftmost node of a longer row (mid-reverse) points its null to the left
            const leftward = order.indexOf(a.id) === 0 && order.length > 1 && !a.lifted;
            const x = leftward ? a.x - TW / 2 : a.x + TW / 2;
            const dir = leftward ? -1 : 1;
            pathArrow([[x, a.y + dy], [x + dir * 22, a.y + dy]], color, weight);
            label("null", x + dir * 42, a.y + dy, hot ? HIGHLIGHT : [150, 165, 158], 12);
            return;
          }
          if (a === b) {
            // a node pointing at itself (one-node circular list)
            const x0 = a.x + TW / 2;
            const x1 = a.x - TW / 2;
            const yb = a.y + TH / 2 + 22;
            pathArrow([[x0, a.y], [x0 + 14, a.y], [x0 + 14, yb], [x1 - 14, yb], [x1 - 14, a.y], [x1, a.y]], color, weight);
            return;
          }
          const forward = b.x > a.x;
          const sa = order.indexOf(a.id);
          const sb = order.indexOf(b.id);
          const neighbours = sa >= 0 && sb >= 0 && Math.abs(sa - sb) === 1 && !a.lifted && !b.lifted;
          if (forward) {
            if (neighbours || a.lifted || b.lifted || Math.abs(a.y - b.y) > 2) {
              curveArrow(a.x + TW / 2, a.y + dy, b.x - TW / 2, b.y + dy, color, weight, a.lifted || b.lifted ? 0 : sb - sa > 1 ? -46 : 0);
            } else {
              curveArrow(a.x + TW / 2, a.y + dy, b.x - TW / 2, b.y + dy, color, weight, -46);
            }
            return;
          }
          // pointing left: a direct neighbour gets a short arrow, anything further loops under the row
          if (neighbours || a.lifted || b.lifted) {
            curveArrow(a.x - TW / 2, a.y + dy, b.x + TW / 2, b.y + dy, color, weight, field === "next" && kind !== "double" ? -14 : 0);
            return;
          }
          if (field === "prev") {
            // a prev pointer skipping a node: arc underneath, mirroring the next arc on top
            curveArrow(a.x - TW / 2, a.y + dy, b.x + TW / 2, b.y + dy, color, weight, 46);
            return;
          }
          const yb = ROW + TH / 2 + 30;
          pathArrow(
            [
              [a.x + TW / 2, a.y + dy],
              [a.x + TW / 2 + 16, a.y + dy],
              [a.x + TW / 2 + 16, yb],
              [b.x - TW / 2 - 16, yb],
              [b.x - TW / 2 - 16, b.y + dy],
              [b.x - TW / 2, b.y + dy],
            ],
            color,
            weight
          );
        }

        P.draw = () => {
          player.update(P.deltaTime || 16);
          const step = player.step;
          const L = step ? step.list : list;
          const order = step ? step.order : orderFromList(L);
          const lifted = new Set(step ? step.lifted : []);
          const xs = layout(order);
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);

          // ease nodes towards their slot; new ones rise out of the lifted row
          order.forEach((id) => {
            if (!L.nodes[id] && !(step && step.gone === id)) return;
            const tx = xs[id];
            const ty = lifted.has(id) ? ROW + LIFT : ROW;
            if (!disp[id]) disp[id] = { x: tx, y: ty + (lifted.has(id) ? 20 : 0), a: 0 };
            const d = disp[id];
            d.x += (tx - d.x) * 0.2;
            d.y += (ty - d.y) * 0.2;
            d.a += (255 - d.a) * 0.2;
            d.val = (L.nodes[id] || {}).val ?? d.val;
            d.live = true;
          });
          Object.keys(disp).forEach((key) => {
            if (order.includes(Number(key))) return;
            disp[key].a *= 0.8;
            disp[key].y += 1.5;
            disp[key].live = false;
            if (disp[key].a < 4) delete disp[key];
          });

          P.background(...BOARD);
          const hot = new Set(step ? step.hot : []);
          const node = (id) => (disp[id] ? { id, x: disp[id].x, y: disp[id].y, lifted: lifted.has(id) } : null);

          // pointers
          Object.entries(L.nodes).forEach(([key, n]) => {
            const id = Number(key);
            const a = node(id);
            if (!a) return;
            drawPointer(a, n.next != null ? node(n.next) : null, "next", hot.has(`${id}:next`), order);
            if (kind === "double" && n.prev != null) {
              const b = node(n.prev);
              if (b) drawPointer(a, b, "prev", hot.has(`${id}:prev`), order);
            }
          });

          // head pointer
          const headHot = hot.has("head");
          if (L.head != null && disp[L.head]) {
            const h = disp[L.head];
            label("head", h.x, 34, headHot ? HIGHLIGHT : CHALK, 13);
            pathArrow([[h.x, 44], [h.x, h.y - TH / 2 - 3]], headHot ? HIGHLIGHT : CHALK, headHot ? 3.5 : 2);
          } else if (L.head == null) {
            label("head → null", 70, ROW, headHot ? HIGHLIGHT : CHALK, 14, P.LEFT);
          }

          // nodes
          Object.entries(disp).forEach(([key, d]) => {
            const id = Number(key);
            const isFocus = step && step.focus === id;
            const isFound = step && step.found === id;
            const isGone = (step && step.gone === id) || !d.live;
            let fill = CHALK;
            if (isFound) fill = GOOD;
            if (isGone) fill = BAD;
            P.push();
            P.rectMode(P.CENTER);
            if (isFocus) {
              P.noFill();
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 120 + 120 * pulse);
              P.strokeWeight(4);
              P.rect(d.x, d.y, TW + 12 + pulse * 3, TH + 12 + pulse * 3, 9);
            }
            P.noStroke();
            P.fill(fill[0], fill[1], fill[2], d.a);
            P.rect(d.x, d.y, TW, TH, 6);
            P.fill(INK[0], INK[1], INK[2], d.a);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(17);
            P.text(String(d.val), d.x, d.y + 0.5);
            P.pop();

            // index under row nodes, pointer-variable names on top
            const slot = order.indexOf(id);
            if (!lifted.has(id) && d.live && slot >= 0) label(String(slot), d.x, ROW + TH / 2 + 12, [120, 138, 128], 11);
            const tag = step && step.tags[id];
            if (tag) {
              const ty = lifted.has(id) ? d.y + TH / 2 + 14 : (L.head === id ? 16 : ROW - TH / 2 - 14);
              label(tag, d.x, ty, HIGHLIGHT, 12);
            }
          });

          if (step && step.hint && step.focus != null && disp[step.focus]) {
            const d = disp[step.focus];
            label(step.hint, d.x, ROW + LIFT, HIGHLIGHT, 13);
          }
        };

        function orderFromList(L) {
          const out = [];
          const seen = new Set();
          let cur = L.head;
          while (cur != null && !seen.has(cur)) {
            seen.add(cur);
            out.push(cur);
            cur = L.nodes[cur].next;
          }
          return out;
        }
      };

      p5Instance = new p5(sketch, sketchRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      p5Instance?.remove();
    };
  }, [kind]);

  const num = (s) => (s.trim() !== "" && Number.isFinite(Number(s)) ? Math.round(Number(s)) : null);

  const doInsert = () => {
    const v = num(value);
    if (v == null) return;
    const i = num(index);
    api.current?.run("insert", v, i == null ? undefined : i);
  };

  const guide = {
    code: LIST_CODE[kind][op] || LIST_CODE[kind].insert,
    stats: { hops: "Pointer moves", comparisons: "Comparisons", nodes: "Nodes" },
    legend: [
      { kind: "box-outline", label: "node being looked at" },
      { kind: "tag", text: "curr", label: "pointer variable" },
      { kind: "box-good", label: "found / inserted" },
    ],
  };

  return (
    <div>
      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doInsert()}
            placeholder="value"
            className="inpbox h-9 w-24"
          />
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            placeholder="index"
            min={0}
            className="inpbox h-9 w-24"
            title={`0 = front; leave empty to add at the end (max ${MAX_LIST} nodes)`}
          />
          <button type="button" className={solidBtn} onClick={doInsert} title="Insert value at index (empty index = at the end)">
            Insert
          </button>
          <button
            type="button"
            className={ghostBtn}
            onClick={() => {
              const i = num(index);
              if (i != null) api.current?.run("delete", i);
            }}
            title="Delete the node at index"
          >
            Delete at index
          </button>
          <button
            type="button"
            className={ghostBtn}
            onClick={() => {
              const v = num(value);
              if (v != null) api.current?.run("search", v);
            }}
          >
            Search value
          </button>
          {kind === "circular" ? (
            <button type="button" className={ghostBtn} onClick={() => api.current?.run("rotate")} title="Move head one node forward">
              Rotate
            </button>
          ) : (
            <button type="button" className={ghostBtn} onClick={() => api.current?.run("reverse")}>
              Reverse
            </button>
          )}
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

      <StepProgress ui={ui} api={api} label={OP_NAMES[op]} />

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration state={panel} guide={guide} />
    </div>
  );
}
