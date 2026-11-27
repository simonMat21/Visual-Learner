"use client";

import { useEffect, useRef, useState } from "react";

import SortNarration from "@/components/SortNarration";
import { PlaybackButtons, StepProgress, ghostBtn, solidBtn } from "@/components/PlaybackBar";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { createPlayer } from "@/lib/mstVisual";
import {
  AVL_CODE,
  RB_CODE,
  avlDeleteSteps,
  avlInsertSteps,
  balanceOf,
  emptyTree,
  heightOf,
  randomBalanced,
  rbDeleteSteps,
  rbInsertSteps,
  searchSteps,
  size,
} from "@/lib/balancedTreeSteps";

const W = 1000;
const TOP = 52;
const MAX_TREE_H = 300;
const RED = [214, 84, 72];
const BLACK = [24, 28, 26];

const stepDuration = (s) => {
  if (!s) return 900;
  if (s.done) return 1500;
  if (s.kind === "rotate") return 1400;
  if (s.slow) return 1300;
  if (s.fast) return 550;
  return 900;
};

const OP_NAMES = { insert: "Insert", delete: "Delete", search: "Search" };

/** AVL or red-black tree.  kind "avl" | "rb" */
export default function BalancedTreeVisualizer({ kind = "avl" }) {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0 });
  const [op, setOp] = useState("insert");
  const [panel, setPanel] = useState(null);
  const [value, setValue] = useState("");
  const isAvl = kind === "avl";

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let tree = randomBalanced(kind, 7);
        let steps = [];
        let boardH = 320;
        const disp = {};
        let player = null;

        const idle = () => {
          const st = { comparisons: 0, rotations: 0, nodes: size(tree), height: heightOf(tree) };
          if (!isAvl) {
            let bh = 0;
            for (let id = tree.root; id != null; id = tree.nodes[id].left) if (tree.nodes[id].color === "B") bh++;
            st.blackHeight = bh;
          }
          setPanel({ lines: [], stats: st });
        };

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
          tree = result.tree;
          steps = result.steps;
          setOp(name);
          player.setSteps(steps);
          player.play();
        }

        api.current = {
          ...player,
          run(name, v) {
            const make = {
              insert: () => (isAvl ? avlInsertSteps(tree, v) : rbInsertSteps(tree, v)),
              delete: () => (isAvl ? avlDeleteSteps(tree, v) : rbDeleteSteps(tree, v)),
              search: () => searchSteps(tree, kind, v),
            }[name];
            if (make) run(name, make());
          },
          load(which) {
            tree = which === "empty" ? emptyTree() : randomBalanced(kind, 7);
            forget();
            steps = [];
            player.setSteps([]);
            idle();
          },
          /** Insert 1..7 in order one after another, the case a plain BST handles worst. */
          sortedDemo() {
            let t = emptyTree();
            const all = [];
            const offset = { comparisons: 0, rotations: 0 };
            const vals = [10, 20, 30, 40, 50, 60, 70, 80];
            vals.forEach((v, i) => {
              const res = isAvl ? avlInsertSteps(t, v) : rbInsertSteps(t, v);
              const last = i === vals.length - 1;
              const keep = last ? res.steps : res.steps.slice(0, -1);
              // counters add up over the whole demo
              keep.forEach((st) =>
                all.push({
                  ...st,
                  stats: {
                    ...st.stats,
                    comparisons: st.stats.comparisons + offset.comparisons,
                    rotations: st.stats.rotations + offset.rotations,
                  },
                })
              );
              const end = res.steps[res.steps.length - 1].stats;
              offset.comparisons += end.comparisons;
              offset.rotations += end.rotations;
              t = res.tree;
            });
            all[all.length - 1] = {
              ...all[all.length - 1],
              result: `Inserted ${vals.join(", ")} in order: height ${heightOf(t)} (a plain BST would be ${vals.length})`,
            };
            forget();
            run("insert", { tree: t, steps: all });
          },
        };

        cleanup = () => player.destroy();

        P.setup = () => {
          P.createCanvas(W, boardH);
          idle();
        };

        function fitHeight() {
          const levels = Math.max(1, ...steps.map((s) => heightOf(s.tree)), heightOf(tree));
          const gap = levels > 1 ? Math.min(70, MAX_TREE_H / (levels - 1)) : 70;
          const h = Math.round(TOP + (levels - 1) * gap + 52);
          if (h !== boardH) {
            boardH = h;
            P.resizeCanvas(W, h);
          }
          return gap;
        }

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
          const spacing = Math.min(62, (W - 80) / Math.max(1, n));
          order.forEach(([id, d], i) => {
            pos[id] = { x: W / 2 + (i - (n - 1) / 2) * spacing, y: TOP + d * gap };
          });
          return { pos, r: Math.max(13, Math.min(20, spacing / 2 - 4)) };
        }

        function label(t, x, y, color, sz = 12, align = P.CENTER, bold = true) {
          P.push();
          P.noStroke();
          P.fill(...color);
          P.textAlign(align, P.CENTER);
          P.textSize(sz);
          if (bold) P.textStyle(P.BOLD);
          P.text(String(t), x, y);
          P.pop();
        }

        P.draw = () => {
          player.update(P.deltaTime || 16);
          const gap = fitHeight();
          const step = player.step;
          const t = step ? step.tree : tree;
          const { pos, r } = layout(t, gap);
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);

          Object.entries(t.nodes).forEach(([key, n]) => {
            const id = Number(key);
            const target = pos[id];
            if (!disp[id]) {
              const from = (n.parent != null && disp[n.parent]) || target;
              disp[id] = { x: from.x, y: from.y, a: 0 };
            }
            const d = disp[id];
            d.x += (target.x - d.x) * 0.16;
            d.y += (target.y - d.y) * 0.16;
            d.a += (255 - d.a) * 0.18;
            d.live = true;
          });
          Object.keys(disp).forEach((k) => {
            if (t.nodes[k]) return;
            disp[k].a *= 0.8;
            disp[k].live = false;
            if (disp[k].a < 4) delete disp[k];
          });

          P.background(...BOARD);
          const path = step ? step.path : [];

          // edges
          P.push();
          Object.entries(t.nodes).forEach(([key, n]) => {
            const id = Number(key);
            [n.left, n.right].forEach((c) => {
              if (c == null || !disp[c] || !disp[id]) return;
              const hot = path.includes(id) && path.includes(c);
              P.stroke(...(hot ? HIGHLIGHT : [130, 146, 138]), Math.min(disp[id].a, disp[c].a));
              P.strokeWeight(hot ? 3.5 : 2);
              P.line(disp[id].x, disp[id].y, disp[c].x, disp[c].y);
            });
          });
          P.pop();

          // nodes
          Object.entries(disp).forEach(([key, d]) => {
            const id = Number(key);
            const n = t.nodes[id];
            const isFocus = step && step.focus === id;
            const isGone = !d.live || (step && step.gone === id);
            P.push();
            if (isFocus) {
              P.noFill();
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 120 + 120 * pulse);
              P.strokeWeight(4);
              P.circle(d.x, d.y, r * 2 + 12 + pulse * 3);
            }
            let fill = CHALK;
            let text = INK;
            if (!isAvl && n) {
              fill = n.color === "R" ? RED : BLACK;
              text = [255, 255, 255];
            }
            if (isAvl && step && step.found === id) fill = GOOD;
            if (isGone) {
              fill = BAD;
              text = INK;
            }
            P.stroke(isAvl ? INK : [200, 206, 200]);
            P.strokeWeight(isAvl ? 2 : 1.5);
            P.fill(fill[0], fill[1], fill[2], d.a);
            P.circle(d.x, d.y, r * 2);
            P.noStroke();
            P.fill(text[0], text[1], text[2], d.a);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(Math.min(15, r * 0.85));
            P.text(n ? String(n.val) : "", d.x, d.y + 0.5);
            P.pop();
            if (!n) return;

            // AVL: balance factor; colour shows trouble
            if (isAvl) {
              const b = balanceOf(t, id);
              const c = Math.abs(b) > 1 ? BAD : b === 0 ? [150, 165, 158] : HIGHLIGHT;
              label(b > 0 ? `+${b}` : String(b), d.x + r + 8, d.y - r + 2, c, 11);
            }
            const tag = step && step.tags[id];
            if (tag) label(tag, d.x, d.y - r - 11, HIGHLIGHT, 12);
          });

          if (size(t) === 0 && Object.keys(disp).length === 0) label("The tree is empty — insert a value", W / 2, TOP + 10, CHALK, 14, P.CENTER, false);
          if (step && step.hint) label(step.hint, 20, boardH - 16, HIGHLIGHT, 13, P.LEFT);
          if (!isAvl) label("every path from a node down to an empty leaf has the same number of black nodes", W - 20, 18, [150, 165, 158], 11, P.RIGHT, false);
          else label("numbers beside the nodes: balance = height(left) − height(right)", W - 20, 18, [150, 165, 158], 11, P.RIGHT, false);
        };
      };

      p5Instance = new p5(sketch, sketchRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      p5Instance?.remove();
    };
  }, [kind, isAvl]);

  const go = (name) => {
    const v = Number(value);
    if (value.trim() === "" || !Number.isFinite(v)) return;
    api.current?.run(name, Math.round(v));
  };

  const code = isAvl ? AVL_CODE : RB_CODE;
  return (
    <div>
      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go("insert")}
            placeholder="value"
            className="inpbox h-9 w-24"
          />
          <button type="button" className={solidBtn} onClick={() => go("insert")}>
            Insert
          </button>
          <button type="button" className={ghostBtn} onClick={() => go("delete")}>
            Delete
          </button>
          <button type="button" className={ghostBtn} onClick={() => go("search")}>
            Search
          </button>
          <span className="mx-1 h-6 w-px bg-rule-strong" />
          <button type="button" className={ghostBtn} onClick={() => api.current?.load("random")}>
            Random tree
          </button>
          <button type="button" className={ghostBtn} onClick={() => api.current?.sortedDemo()} title="Insert 10, 20, ..., 80 in order">
            Insert in order
          </button>
          <button type="button" className={ghostBtn} onClick={() => api.current?.load("empty")}>
            Clear
          </button>
        </div>
        <PlaybackButtons ui={ui} api={api} />
      </div>

      <StepProgress ui={ui} api={api} label={OP_NAMES[op]} />

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration
        state={panel}
        guide={{
          code: code[op],
          stats: isAvl
            ? { comparisons: "Comparisons", rotations: "Rotations", height: "Height" }
            : { comparisons: "Comparisons", rotations: "Rotations", blackHeight: "Black height" },
          legend: isAvl
            ? [
                { kind: "tag", text: "+1", label: "balance factor (red when ±2)" },
                { kind: "box-outline", label: "node being checked" },
                { kind: "box-good", label: "inserted / found" },
              ]
            : [
                { kind: "tag", text: "uncle", label: "role in the current fix-up" },
                { kind: "box-outline", label: "node being checked" },
              ],
        }}
      />
    </div>
  );
}
