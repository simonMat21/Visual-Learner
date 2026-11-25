"use client";

import { useEffect, useRef, useState } from "react";

import NumberInput from "@/components/NumberInput";
import SortNarration from "@/components/SortNarration";
import { PlaybackButtons, StepProgress, ghostBtn, solidBtn } from "@/components/PlaybackBar";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { createPlayer } from "@/lib/mstVisual";
import {
  MAX_HEAP,
  buildSteps,
  extractSteps,
  heapCode,
  insertSteps,
  peekSteps,
  randomHeap,
} from "@/lib/heapSteps";

const W = 1000;
const ARR_Y = 44; // array strip row
const CELL = 46;
const TREE_TOP = 132;
const GAP = 64; // between tree levels
const TILE = 40;
const EDGE = [120, 138, 128];

const stepDuration = (step) => {
  if (!step) return 900;
  if (step.done) return 1500;
  if (step.kind === "swap") return 950;
  if (step.kind === "add" || step.kind === "remove" || step.kind === "move") return 1000;
  return 900;
};

const levelsFor = (n) => (n <= 0 ? 1 : Math.floor(Math.log2(n)) + 1);

/** Tree spot of array index i: depth from the index, spread evenly across the level. */
function treePos(i) {
  const d = Math.floor(Math.log2(i + 1));
  const k = i - (2 ** d - 1);
  const slots = 2 ** d;
  return { x: 80 + ((k + 0.5) / slots) * (W - 160), y: TREE_TOP + d * GAP };
}

/**
 * Heap visualizer: the same values shown as the array the heap really is and
 * as the tree that array describes.  type "min" | "max"
 */
export default function HeapVisualizer({ type = "min" }) {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0 });
  const [op, setOp] = useState("insert");
  const [panel, setPanel] = useState(null);
  const [value, setValue] = useState("");
  const code = heapCode(type);
  const rootName = type === "min" ? "Min" : "Max";

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let heap = randomHeap(7, type);
        let steps = [];
        let boardH = 300;
        const disp = {}; // id -> {ax, tx, ty, a, val}
        let player = null;

        const showIdle = () => setPanel({ lines: [], stats: { comparisons: 0, swaps: 0, size: heap.length } });

        player = createPlayer(
          P,
          (s) => {
            setUi((u) => ({ ...u, ...s }));
            const st = player?.step;
            if (st) setPanel({ lines: st.lines, stats: st.stats, result: st.result, done: st.done, miss: !!st.miss });
          },
          { duration: stepDuration }
        );

        function fit() {
          const n = Math.max(heap.length, ...steps.map((s) => s.arr.length));
          const h = TREE_TOP + (levelsFor(n) - 1) * GAP + 46;
          if (h !== boardH) {
            boardH = h;
            P.resizeCanvas(W, h);
          }
        }

        function run(name, result) {
          heap = result.heap;
          steps = result.steps;
          setOp(name);
          player.setSteps(steps);
          player.play();
        }

        const forget = () => Object.keys(disp).forEach((k) => delete disp[k]);

        api.current = {
          ...player,
          run(name, arg) {
            const make = {
              insert: () => insertSteps(heap, type, arg),
              extract: () => extractSteps(heap, type),
              peek: () => peekSteps(heap, type),
              build: () => buildSteps(arg, type),
            }[name];
            if (make) run(name, make());
          },
          random() {
            heap = randomHeap(7, type);
            steps = [];
            forget();
            player.setSteps([]);
            showIdle();
          },
          clear() {
            heap = [];
            steps = [];
            forget();
            player.setSteps([]);
            showIdle();
          },
        };

        cleanup = () => player.destroy();

        P.setup = () => {
          P.createCanvas(W, boardH);
          fit();
          showIdle();
        };

        function label(text, x, y, color, size = 12, align = P.CENTER, bold = true) {
          P.push();
          P.noStroke();
          P.fill(...color);
          P.textAlign(align, P.CENTER);
          P.textSize(size);
          if (bold) P.textStyle(P.BOLD);
          P.text(text, x, y);
          P.pop();
        }

        P.draw = () => {
          player.update(P.deltaTime || 16);
          fit();
          const step = player.step;
          const arr = step ? step.arr : heap;
          const n = arr.length;
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);
          const arrX = (i) => W / 2 + (i - (n - 1) / 2) * (CELL + 6);

          // targets: array slot and tree spot for every value
          arr.forEach((it, i) => {
            const t = treePos(i);
            if (!disp[it.id]) disp[it.id] = { ax: arrX(i), tx: t.x, ty: t.y + 16, a: 0 };
            const d = disp[it.id];
            d.ax += (arrX(i) - d.ax) * 0.2;
            d.tx += (t.x - d.tx) * 0.2;
            d.ty += (t.y - d.ty) * 0.2;
            d.a += (255 - d.a) * 0.2;
            d.val = it.val;
            d.idx = i;
            d.live = true;
          });
          Object.keys(disp).forEach((key) => {
            if (arr.some((it) => String(it.id) === key)) return;
            disp[key].a *= 0.82;
            disp[key].ty -= 1.2;
            disp[key].live = false;
            if (disp[key].a < 4) delete disp[key];
          });

          P.background(...BOARD);

          const compare = (step && step.compare) || [];
          const swapped = (step && step.swapped) || [];
          const focus = step ? step.focus : null;
          const found = step ? step.found : null;
          const gone = step ? step.gone : null;
          const idOf = (i) => (arr[i] ? arr[i].id : null);

          // section labels
          label("ARRAY", 24, ARR_Y, [150, 165, 158], 11, P.LEFT);
          label("TREE", 24, TREE_TOP, [150, 165, 158], 11, P.LEFT);

          // tree edges (between slots, drawn from where the values are now)
          P.push();
          for (let i = 1; i < n; i++) {
            const c = disp[idOf(i)];
            const p = disp[idOf(Math.floor((i - 1) / 2))];
            if (!c || !p) continue;
            const hot = compare.includes(i) && compare.includes(Math.floor((i - 1) / 2));
            P.stroke(...(hot ? HIGHLIGHT : EDGE));
            P.strokeWeight(hot ? 3.5 : 2);
            P.line(p.tx, p.ty, c.tx, c.ty);
          }
          P.pop();

          // focus link: the same slot in the array and in the tree
          if (focus != null && disp[idOf(focus)]) {
            const d = disp[idOf(focus)];
            P.push();
            P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 110);
            P.strokeWeight(1.5);
            P.drawingContext.setLineDash([4, 5]);
            P.line(d.ax, ARR_Y + TILE / 2 + 14, d.tx, d.ty - TILE / 2 - 4);
            P.drawingContext.setLineDash([]);
            P.pop();
          }

          const drawTile = (x, y, d, i, w, h) => {
            const isCmp = d.live && compare.includes(i);
            const isSwap = d.live && swapped.includes(i);
            let fill = CHALK;
            if (d.live && found === i) fill = GOOD;
            if (!d.live || gone === i) fill = BAD;
            P.push();
            P.rectMode(P.CENTER);
            if (d.live && (focus === i || isCmp)) {
              P.noFill();
              const a = focus === i ? 120 + 120 * pulse : 220;
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], a);
              P.strokeWeight(focus === i ? 4 : 3);
              P.rect(x, y, w + 10, h + 10, 8);
            }
            P.noStroke();
            P.fill(fill[0], fill[1], fill[2], d.a);
            if (isSwap) P.fill(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], d.a);
            P.rect(x, y, w, h, 6);
            P.fill(INK[0], INK[1], INK[2], d.a);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(17);
            P.text(String(d.val), x, y + 0.5);
            P.pop();
          };

          Object.values(disp).forEach((d) => {
            const i = d.live ? d.idx : -1;
            drawTile(d.ax, ARR_Y, d, i, CELL, TILE);
            if (d.live) label(String(i), d.ax, ARR_Y + TILE / 2 + 9, [150, 165, 158], 11, P.CENTER, false);
            drawTile(d.tx, d.ty, d, i, TILE, TILE);
            if (d.live) label(String(i), d.tx + TILE / 2 + 8, d.ty - TILE / 2 + 2, [150, 165, 158], 10, P.CENTER, false);
          });

          if (n === 0 && Object.keys(disp).length === 0) {
            label("The heap is empty — insert a value or build from an array", W / 2, TREE_TOP, CHALK, 14, P.CENTER, false);
          }

          // the comparison being made
          if (step && step.hint) {
            const d = focus != null ? disp[idOf(focus)] : null;
            const x = d ? Math.min(W - 230, d.tx + TILE / 2 + 22) : W / 2;
            const y = d ? d.ty : TREE_TOP;
            label(step.hint, x, y, HIGHLIGHT, 13, d ? P.LEFT : P.CENTER);
          }

          // the value taken out by extract
          if (step && step.extracted != null) {
            const x = W - 70;
            label("removed", x, ARR_Y - 30, [150, 165, 158], 11);
            P.push();
            P.rectMode(P.CENTER);
            P.noStroke();
            P.fill(...GOOD);
            P.rect(x, ARR_Y, CELL, TILE, 6);
            P.fill(...INK);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(17);
            P.text(String(step.extracted), x, ARR_Y + 0.5);
            P.pop();
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
  }, [type]);

  const doInsert = () => {
    const v = Number(value);
    if (value.trim() === "" || !Number.isFinite(v)) return;
    api.current?.run("insert", Math.round(v));
  };

  const opNames = { insert: "Insert", extract: `Extract ${rootName.toLowerCase()}`, peek: "Peek", build: "Build heap" };

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
            title={`Up to ${MAX_HEAP} values`}
          />
          <button type="button" className={solidBtn} onClick={doInsert}>
            Insert
          </button>
          <button type="button" className={ghostBtn} onClick={() => api.current?.run("extract")}>
            Extract {rootName.toLowerCase()}
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

      <div className="mx-auto mb-3 flex w-full max-w-[1012px] items-center justify-between gap-3">
        <NumberInput
          btnName="Build heap"
          className=""
          lenRange={[7, MAX_HEAP]}
          onSubmit={(arr) => arr.length && api.current?.run("build", arr)}
        />
        <span className="text-xs text-ink-3">
          {"parent(i) = ⌊(i − 1) / 2⌋   ·   children: 2i + 1 and 2i + 2"}
        </span>
      </div>

      <StepProgress ui={ui} api={api} label={opNames[op]} />

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration
        state={panel}
        guide={{
          code: code[op],
          stats: { comparisons: "Comparisons", swaps: "Swaps", size: "Size" },
          legend: [
            { kind: "box-outline", label: "values being compared" },
            { kind: "tag", text: "swap", label: "just swapped" },
            { kind: "box-good", label: "new / root / removed value" },
          ],
        }}
      />
    </div>
  );
}
