"use client";

import { useEffect, useRef, useState } from "react";

import NumberInput from "@/components/NumberInput";
import { PlaybackButtons, StepProgress, ghostBtn as ghost, solidBtn as solid } from "@/components/PlaybackBar";
import SortNarration from "@/components/SortNarration";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { createPlayer } from "@/lib/mstVisual";
import {
  BST_CODE,
  buildSteps,
  deleteSteps,
  emptyTree,
  height,
  insertSteps,
  maxSteps,
  minSteps,
  neighbourSteps,
  randomTree,
  searchSteps,
  size,
  traversalSteps,
} from "@/lib/bstSteps";

const W = 1000;
const TOP = 46;
const MAX_TREE_H = 330;
const STRIP = 58;
const VISITED = [172, 214, 236];

const TAG_TEXT = {
  min: "min",
  max: "max",
  pred: "predecessor",
  succ: "successor",
  best: "candidate",
  x: "x",
  delete: "to delete",
  successor: "successor",
  remove: "remove",
};

const GUIDE_STATS = {
  basic: { comparisons: "Comparisons", nodes: "Nodes", height: "Height" },
  advanced: { comparisons: "Comparisons", nodes: "Nodes", height: "Height" },
  traversal: { visits: "Visited", nodes: "Nodes", height: "Height" },
};

const LEGEND = {
  basic: [
    { kind: "box-outline", label: "node being compared" },
    { kind: "box-good", label: "found / inserted" },
  ],
  advanced: [
    { kind: "box-outline", label: "node being looked at" },
    { kind: "box-good", label: "answer" },
  ],
  traversal: [
    { kind: "box-outline", label: "current node" },
    { kind: "tag", text: "1 2 3", label: "visit order" },
  ],
};

const OP_NAMES = {
  insert: "Insert",
  search: "Search",
  delete: "Delete",
  min: "Find min",
  max: "Find max",
  pred: "Predecessor",
  succ: "Successor",
  inorder: "In-order",
  preorder: "Pre-order",
  postorder: "Post-order",
  level: "Level-order",
  build: "Build",
};

const stepDuration = (step) => {
  if (!step) return 900;
  if (step.done) return 1600;
  if (step.kind === "add" || step.kind === "copy") return 1100;
  if (step.kind === "remove") return 1000;
  if (step.kind === "visit") return 800;
  return 850;
};


/**
 * One visualizer for all three BST pages.
 *   mode "basic"      insert / search / delete one value at a time
 *   mode "advanced"   build from an array, min, max, predecessor, successor
 *   mode "traversal"  build from an array, in/pre/post/level-order
 */
export default function BstVisualizer({ mode = "basic" }) {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0 });
  const [op, setOp] = useState(mode === "traversal" ? "inorder" : mode === "advanced" ? "min" : "insert");
  const [panel, setPanel] = useState(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let tree = randomTree(mode === "basic" ? 7 : 9); // the tree after the last operation
        let steps = [];
        let boardH = 300;
        const disp = {}; // id -> drawn {x, y, a, val}
        let player = null;

        player = createPlayer(
          P,
          (s) => {
            setUi((u) => ({ ...u, ...s }));
            const st = player?.step;
            if (st)
              setPanel({
                lines: st.lines,
                stats: st.stats,
                result: st.result,
                done: st.done,
                miss: !!st.result && /not in the tree|already in|is empty|has no|at most/.test(st.result),
              });
          },
          { duration: stepDuration }
        );

        const hasStrip = mode !== "basic";

        function fitHeight() {
          const levels = Math.max(1, ...steps.map((s) => height(s.tree)), height(tree));
          const gap = levels > 1 ? Math.min(72, MAX_TREE_H / (levels - 1)) : 72;
          const h = TOP + (levels - 1) * gap + 44 + (hasStrip ? STRIP : 0);
          if (Math.abs(h - boardH) > 1) {
            boardH = h;
            P.resizeCanvas(W, Math.round(h));
          }
          return gap;
        }

        /** Counters for a tree with no operation running yet. */
        function showIdle() {
          setPanel({ lines: [], stats: { comparisons: 0, visits: 0, nodes: size(tree), height: height(tree) } });
        }

        /** A brand new tree reuses node ids, so forget what was drawn before. */
        function forgetDrawn() {
          Object.keys(disp).forEach((k) => delete disp[k]);
        }

        function run(name, result) {
          if (name === "build") forgetDrawn();
          tree = result.tree;
          steps = result.steps;
          setOp(name);
          player.setSteps(steps);
          player.play();
        }

        api.current = {
          ...player,
          run(name, arg) {
            const base = tree;
            const make = {
              insert: () => insertSteps(base, arg),
              search: () => searchSteps(base, arg),
              delete: () => deleteSteps(base, arg),
              min: () => minSteps(base),
              max: () => maxSteps(base),
              pred: () => neighbourSteps(base, arg, "pred"),
              succ: () => neighbourSteps(base, arg, "succ"),
              inorder: () => traversalSteps(base, "inorder"),
              preorder: () => traversalSteps(base, "preorder"),
              postorder: () => traversalSteps(base, "postorder"),
              level: () => traversalSteps(base, "level"),
              build: () => buildSteps(arg),
            }[name];
            if (make) run(name, make());
          },
          random() {
            tree = randomTree(mode === "basic" ? 7 : 9);
            forgetDrawn();
            steps = [];
            player.setSteps([]);
            showIdle();
          },
          clear() {
            tree = emptyTree();
            forgetDrawn();
            steps = [];
            player.setSteps([]);
            showIdle();
          },
          get tree() {
            return tree;
          },
        };

        P.setup = () => {
          P.createCanvas(W, boardH);
          fitHeight();
          showIdle();
        };

        cleanup = () => player.destroy();

        /** x from in-order rank, y from depth. Never overlaps, however deep. */
        function layout(t, gap) {
          const pos = {};
          const order = [];
          const walk = (id, d) => {
            if (id == null) return;
            walk(t.nodes[id].left, d + 1);
            order.push([id, d]);
            walk(t.nodes[id].right, d + 1);
          };
          walk(t.root, 0);
          const n = order.length;
          const spacing = Math.min(64, (W - 80) / Math.max(1, n));
          order.forEach(([id, d], i) => {
            pos[id] = { x: W / 2 + (i - (n - 1) / 2) * spacing, y: TOP + d * gap };
          });
          return { pos, tile: Math.max(22, Math.min(40, spacing - 6)) };
        }

        function parentMap(t) {
          const parent = {};
          Object.entries(t.nodes).forEach(([id, n]) => {
            if (n.left != null) parent[n.left] = Number(id);
            if (n.right != null) parent[n.right] = Number(id);
          });
          return parent;
        }

        P.draw = () => {
          player.update(P.deltaTime || 16);
          const gap = fitHeight();
          const step = player.step;
          const t = step ? step.tree : tree;
          const { pos, tile } = layout(t, gap);
          const parents = parentMap(t);
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);

          // ease every drawn node towards its place; new nodes grow out of their parent
          Object.entries(t.nodes).forEach(([key, n]) => {
            const id = Number(key);
            const target = pos[id];
            if (!disp[id]) {
              const from = disp[parents[id]] || target;
              disp[id] = { x: from.x, y: from.y, a: 0, val: n.val };
            }
            const d = disp[id];
            d.x += (target.x - d.x) * 0.18;
            d.y += (target.y - d.y) * 0.18;
            d.a += (255 - d.a) * 0.18;
            d.val = n.val;
            d.live = true;
          });
          Object.keys(disp).forEach((key) => {
            if (t.nodes[key]) return;
            disp[key].a *= 0.8;
            disp[key].live = false;
            if (disp[key].a < 4) delete disp[key];
          });

          P.background(...BOARD);

          const path = step ? step.path : [];
          const onPath = (a, b) => path.includes(a) && path.includes(b);

          // edges
          P.push();
          P.strokeCap(P.ROUND);
          Object.entries(t.nodes).forEach(([key, n]) => {
            const id = Number(key);
            [n.left, n.right].forEach((c) => {
              if (c == null || !disp[c]) return;
              const hot = onPath(id, c);
              P.stroke(...(hot ? HIGHLIGHT : [120, 138, 128]), Math.min(disp[id].a, disp[c].a));
              P.strokeWeight(hot ? 3.5 : 2);
              P.line(disp[id].x, disp[id].y, disp[c].x, disp[c].y);
            });
          });
          P.pop();

          // nodes
          const visitedOrder = step ? step.visited : [];
          Object.entries(disp).forEach(([key, d]) => {
            const id = Number(key);
            const isFocus = step && step.focus === id;
            const isFound = step && step.found === id;
            const isGone = step && step.gone === id;
            const visitIdx = visitedOrder.indexOf(id);
            let fill = CHALK;
            if (visitIdx >= 0) fill = VISITED;
            if (isFound) fill = GOOD;
            if (isGone || !d.live) fill = BAD;

            P.push();
            P.rectMode(P.CENTER);
            if (isFocus) {
              P.noFill();
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 120 + 120 * pulse);
              P.strokeWeight(4);
              P.rect(d.x, d.y, tile + 12 + pulse * 3, tile + 12 + pulse * 3, 9);
            } else if (path.includes(id)) {
              P.noFill();
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], d.a * 0.7);
              P.strokeWeight(2);
              P.rect(d.x, d.y, tile + 6, tile + 6, 7);
            }
            P.noStroke();
            P.fill(fill[0], fill[1], fill[2], d.a);
            P.rect(d.x, d.y, tile, tile, 6);
            P.fill(INK[0], INK[1], INK[2], d.a);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(Math.min(18, tile * 0.45));
            P.text(String(d.val), d.x, d.y + 0.5);

            const tag = step && step.tags[id];
            if (tag) {
              P.fill(...HIGHLIGHT);
              P.textSize(12);
              P.textAlign(P.CENTER, P.BOTTOM);
              P.text(TAG_TEXT[tag] || tag, d.x, d.y - tile / 2 - 7);
            }
            if (visitIdx >= 0) {
              P.fill(...HIGHLIGHT);
              P.circle(d.x + tile / 2, d.y - tile / 2, 17);
              P.fill(...INK);
              P.textSize(10);
              P.textAlign(P.CENTER, P.CENTER);
              P.text(String(visitIdx + 1), d.x + tile / 2, d.y - tile / 2 + 0.5);
            }
            P.pop();
          });

          // the comparison being made, next to the current node
          if (step && step.hint && step.focus != null && disp[step.focus]) {
            const d = disp[step.focus];
            P.push();
            P.noStroke();
            P.fill(...HIGHLIGHT);
            P.textSize(13);
            P.textStyle(P.BOLD);
            P.textAlign(P.LEFT, P.CENTER);
            P.text(step.hint, d.x + tile / 2 + 12, d.y - 2);
            P.pop();
          }

          if (size(t) === 0 && Object.keys(disp).length === 0) {
            P.push();
            P.noStroke();
            P.fill(...CHALK);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(14);
            P.text("The tree is empty — add a value to start", W / 2, TOP + 20);
            P.pop();
          }

          // output strip: visit order, queue, or the answer
          if (hasStrip) {
            const y0 = boardH - STRIP + 10;
            P.push();
            P.stroke(CHALK[0], CHALK[1], CHALK[2], 40);
            P.line(20, y0 - 6, W - 20, y0 - 6);
            P.noStroke();
            P.fill(CHALK[0], CHALK[1], CHALK[2], 170);
            P.textSize(12);
            P.textAlign(P.LEFT, P.CENTER);
            const out = step ? step.output : [];
            const label = mode === "traversal" ? "Visit order" : "Answer";
            P.text(label, 24, y0 + 18);
            out.forEach((v, i) => {
              const x = 120 + i * 40;
              P.fill(...(mode === "traversal" ? VISITED : GOOD));
              P.rectMode(P.CENTER);
              P.rect(x, y0 + 18, 34, 30, 5);
              P.fill(...INK);
              P.textAlign(P.CENTER, P.CENTER);
              P.textStyle(P.BOLD);
              P.textSize(14);
              P.text(String(v), x, y0 + 18.5);
              P.textStyle(P.NORMAL);
            });
            if (step && step.queue) {
              const qx = Math.max(140 + out.length * 40, 560);
              P.fill(CHALK[0], CHALK[1], CHALK[2], 170);
              P.textSize(12);
              P.textAlign(P.LEFT, P.CENTER);
              P.text("Queue", qx, y0 + 18);
              step.queue.forEach((v, i) => {
                const x = qx + 60 + i * 38;
                P.noFill();
                P.stroke(...HIGHLIGHT);
                P.strokeWeight(2);
                P.rectMode(P.CENTER);
                P.rect(x, y0 + 18, 32, 28, 5);
                P.noStroke();
                P.fill(...CHALK);
                P.textAlign(P.CENTER, P.CENTER);
                P.textSize(13);
                P.text(String(v), x, y0 + 18.5);
              });
            }
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
  }, [mode]);

  const num = () => {
    const v = Number(value);
    return value.trim() !== "" && Number.isFinite(v) ? Math.round(v) : null;
  };
  const runWithValue = (name) => {
    const v = num();
    if (v == null) return;
    api.current?.run(name, v);
  };

  const valueBox = (placeholder) => (
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && mode === "basic") runWithValue("insert");
      }}
      placeholder={placeholder}
      className="inpbox h-9 w-28"
    />
  );

  return (
    <div>
      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {mode === "basic" && (
            <>
              {valueBox("value")}
              <button type="button" className={solid} onClick={() => runWithValue("insert")}>Insert</button>
              <button type="button" className={ghost} onClick={() => runWithValue("search")}>Search</button>
              <button type="button" className={ghost} onClick={() => runWithValue("delete")}>Delete</button>
              <span className="mx-1 h-6 w-px bg-rule-strong" />
              <button type="button" className={ghost} onClick={() => api.current?.random()}>Random tree</button>
              <button type="button" className={ghost} onClick={() => api.current?.clear()}>Clear</button>
            </>
          )}
          {mode !== "basic" && (
            <NumberInput
              btnName="Build"
              className=""
              onSubmit={(arr) => arr.length && api.current?.run("build", arr)}
            />
          )}
          {mode === "advanced" && (
            <>
              <span className="mx-1 h-6 w-px bg-rule-strong" />
              <button type="button" className={ghost} onClick={() => api.current?.run("min")}>Min</button>
              <button type="button" className={ghost} onClick={() => api.current?.run("max")}>Max</button>
              {valueBox("value")}
              <button type="button" className={ghost} onClick={() => runWithValue("pred")}>Predecessor</button>
              <button type="button" className={ghost} onClick={() => runWithValue("succ")}>Successor</button>
            </>
          )}
          {mode === "traversal" && (
            <>
              <span className="mx-1 h-6 w-px bg-rule-strong" />
              {["inorder", "preorder", "postorder", "level"].map((o) => (
                <button key={o} type="button" className={ghost} onClick={() => api.current?.run(o)}>
                  {OP_NAMES[o]}
                </button>
              ))}
            </>
          )}
        </div>

        <PlaybackButtons ui={ui} api={api} />
      </div>

      <StepProgress ui={ui} api={api} label={OP_NAMES[op]} />

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration
        state={panel}
        guide={{ code: BST_CODE[op], stats: GUIDE_STATS[mode], legend: LEGEND[mode] }}
      />
    </div>
  );
}
