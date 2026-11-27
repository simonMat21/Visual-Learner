"use client";

import { useEffect, useRef, useState } from "react";

import SortNarration from "@/components/SortNarration";
import { PlaybackButtons, StepProgress, ghostBtn } from "@/components/PlaybackBar";
import { BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { parseEdgeList } from "@/lib/graphModel";
import { createPlayer, panel } from "@/lib/mstVisual";
import {
  DIAMETER_CODE,
  LCA_CLIMB_CODE,
  LCA_LIFT_CODE,
  SAMPLE_TREE,
  diameterSteps,
  lcaClimbSteps,
  lcaLiftSteps,
  randomTree,
  rooted,
  validateTree,
} from "@/lib/treeAlgoSteps";

const W = 1000;
const H = 440;
const TREE = { x0: 30, x1: 570, top: 46, bottom: 400 };
const SIDE = { x: 596, y: 14, w: 390, h: 412 };
const BLUE = [168, 214, 255];
const EDGE = [130, 146, 138];

const stepDuration = (s) => (!s ? 900 : s.done ? 1700 : s.slow ? 1300 : s.fast ? 600 : 1000);

const edgesText = (t) => t.edges.map(([a, b]) => `${a}-${b}`).join(", ");

/** Lowest common ancestor or tree diameter.  mode "lca" | "diameter" */
export default function TreeAlgoVisualizer({ mode = "lca" }) {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0 });
  const [panelState, setPanelState] = useState(null);
  const [n, setN] = useState(12);
  const [uv, setUv] = useState({ u: 10, v: 8 });
  const [method, setMethod] = useState("climb");
  const [text, setText] = useState(edgesText(SAMPLE_TREE()));
  const [error, setError] = useState("");
  const isLca = mode === "lca";

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let tree = SAMPLE_TREE();
        let u = 10;
        let v = 8;
        let lift = false;
        const disp = {};
        let player = null;

        player = createPlayer(
          P,
          (s) => {
            setUi((x) => ({ ...x, ...s }));
            const st = player?.step;
            if (st) setPanelState({ lines: st.lines, stats: st.stats, result: st.result, done: st.done });
          },
          { duration: stepDuration }
        );

        function rebuild() {
          u = Math.min(u, tree.n - 1);
          v = Math.min(v, tree.n - 1);
          setN(tree.n);
          setUv({ u, v });
          const steps = isLca ? (lift ? lcaLiftSteps(tree, u, v) : lcaClimbSteps(tree, u, v)) : diameterSteps(tree);
          player.setSteps(steps);
        }

        api.current = {
          ...player,
          setTree(t) {
            tree = t;
            Object.keys(disp).forEach((k) => delete disp[k]);
            setText(edgesText(t));
            rebuild();
          },
          setUV(a, b) {
            u = a;
            v = b;
            rebuild();
          },
          setLift(on) {
            lift = on;
            rebuild();
          },
        };

        cleanup = () => player.destroy();

        P.setup = () => {
          P.createCanvas(W, H);
          rebuild();
        };

        function layout() {
          const { parent, depth } = rooted(tree);
          const kids = Array.from({ length: tree.n }, () => []);
          parent.forEach((p, x) => p >= 0 && kids[p].push(x));
          const xs = Array(tree.n).fill(0);
          let slot = 0;
          const place = (x) => {
            if (!kids[x].length) {
              xs[x] = slot++;
              return;
            }
            kids[x].forEach(place);
            xs[x] = (xs[kids[x][0]] + xs[kids[x][kids[x].length - 1]]) / 2;
          };
          place(0);
          const maxD = Math.max(...depth);
          const spacing = Math.min(80, (TREE.x1 - TREE.x0) / Math.max(1, slot));
          const left = (TREE.x0 + TREE.x1) / 2 - ((slot - 1) * spacing) / 2;
          const gap = maxD ? Math.min(70, (TREE.bottom - TREE.top - 30) / maxD) : 70;
          return { pos: xs.map((x, i) => ({ x: left + x * spacing, y: TREE.top + depth[i] * gap })), parent, depth, r: Math.max(13, Math.min(18, spacing / 2 - 4, gap / 2 - 6)) };
        }

        function label(t, x, y, color, size = 12, align = P.CENTER, bold = true) {
          P.push();
          P.noStroke();
          P.fill(...color);
          P.textAlign(align, P.CENTER);
          P.textSize(size);
          if (bold) P.textStyle(P.BOLD);
          P.text(String(t), x, y);
          P.pop();
        }

        function cellBox(x, y, w, h, fill) {
          P.push();
          P.noStroke();
          P.fill(...fill);
          P.rect(x, y, w, h, 4);
          P.pop();
        }

        function drawSide(step, depth, parent) {
          panel(P, SIDE.x, SIDE.y, SIDE.w, SIDE.h);
          const x0 = SIDE.x + 14;
          const nn = tree.n;
          if (isLca && !lift) {
            label("vertex / depth / parent", x0, SIDE.y + 18, CHALK, 11, P.LEFT);
            const cw = Math.min(34, (SIDE.w - 70) / nn);
            ["vertex", "depth", "parent"].forEach((h, row) => label(h, x0 + 22, SIDE.y + 48 + row * 32, [190, 198, 192], 11));
            for (let x = 0; x < nn; x++) {
              const cx = x0 + 52 + x * cw + cw / 2;
              const hot = step && (step.marks[x] || step.focus === x);
              if (hot) cellBox(cx - cw / 2 + 1, SIDE.y + 34, cw - 2, 90, [92, 84, 50]);
              label(String(x), cx, SIDE.y + 48, step && step.marks[x] ? HIGHLIGHT : CHALK, 12);
              label(String(depth[x]), cx, SIDE.y + 80, CHALK, 12, P.CENTER, false);
              label(parent[x] < 0 ? "–" : String(parent[x]), cx, SIDE.y + 112, CHALK, 12, P.CENTER, false);
            }
          } else if (isLca && lift) {
            const tb = step && step.table;
            label("up[k][x] = the 2ᵏ-th ancestor of x  (– = none)", x0, SIDE.y + 18, CHALK, 11, P.LEFT);
            const cw = Math.min(30, (SIDE.w - 70) / nn);
            const gx = x0 + 52;
            for (let x = 0; x < nn; x++) label(String(x), gx + x * cw + cw / 2, SIDE.y + 44, step && step.marks[x] ? HIGHLIGHT : [190, 198, 192], 11);
            const rows = tb ? tb.up.length : 0;
            for (let k = 0; k < rows; k++) {
              const y = SIDE.y + 66 + k * 28;
              label(`k=${k}`, x0 + 22, y, step.row === k ? HIGHLIGHT : [190, 198, 192], 11);
              for (let x = 0; x < nn; x++) {
                const val = tb.up[k][x];
                const isCell = step.cell && step.cell[0] === k && step.cell[1] === x;
                cellBox(gx + x * cw + 1, y - 11, cw - 2, 22, isCell ? GOOD : step.row === k ? [92, 84, 50] : [51, 68, 61]);
                label(val < 0 ? "–" : String(val), gx + x * cw + cw / 2, y, isCell ? INK : CHALK, 11, P.CENTER, false);
              }
            }
            const y = SIDE.y + 80 + rows * 28;
            label("depth", x0 + 22, y, [190, 198, 192], 11);
            for (let x = 0; x < nn; x++) label(String(depth[x]), gx + x * cw + cw / 2, y, CHALK, 11, P.CENTER, false);
          } else {
            label("BFS distance from the current start", x0, SIDE.y + 18, CHALK, 11, P.LEFT);
            const cw = Math.min(30, (SIDE.w - 70) / nn);
            const gx = x0 + 52;
            label("vertex", x0 + 22, SIDE.y + 48, [190, 198, 192], 11);
            label("dist", x0 + 22, SIDE.y + 78, [190, 198, 192], 11);
            for (let x = 0; x < nn; x++) {
              const d = step && step.dist ? step.dist[x] : -1;
              const wave = step && step.wave && step.wave.includes(x);
              label(String(x), gx + x * cw + cw / 2, SIDE.y + 48, step && step.marks[x] ? HIGHLIGHT : CHALK, 12);
              cellBox(gx + x * cw + 1, SIDE.y + 67, cw - 2, 22, wave ? [92, 84, 50] : [51, 68, 61]);
              label(d < 0 ? "–" : String(d), gx + x * cw + cw / 2, SIDE.y + 78, CHALK, 12, P.CENTER, false);
            }
            label("why two searches work:", x0, SIDE.y + 128, CHALK, 11, P.LEFT);
            [
              "The vertex farthest from ANY start is always",
              "one end of some longest path. So the first BFS",
              "finds an end b, and the farthest vertex from b",
              "is the other end c.",
            ].forEach((line, i) => label(line, x0, SIDE.y + 152 + i * 18, [190, 198, 192], 12, P.LEFT, false));
          }
        }

        P.draw = () => {
          player.update(P.deltaTime || 16);
          const step = player.step;
          const { pos, parent, depth, r } = layout();
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);
          pos.forEach((p, i) => {
            if (!disp[i]) disp[i] = { x: p.x, y: p.y };
            disp[i].x += (p.x - disp[i].x) * 0.2;
            disp[i].y += (p.y - disp[i].y) * 0.2;
          });
          P.background(...BOARD);
          const hot = new Set(step ? step.hot : []);
          const pathSet = new Set(step ? step.path : []);

          tree.edges.forEach(([a, b]) => {
            const key = a < b ? `${a}-${b}` : `${b}-${a}`;
            const on = hot.has(key);
            P.push();
            P.stroke(...(on ? (step.done && !isLca ? GOOD : HIGHLIGHT) : EDGE));
            P.strokeWeight(on ? 4 : 2);
            P.line(disp[a].x, disp[a].y, disp[b].x, disp[b].y);
            P.pop();
          });

          pos.forEach((_, i) => {
            const d = disp[i];
            let fill = [255, 255, 255];
            if (pathSet.has(i)) fill = isLca ? [252, 232, 178] : GOOD;
            if (step && step.wave && step.wave.includes(i)) fill = BLUE;
            if (step && step.answer === i) fill = GOOD;
            P.push();
            if (step && step.focus === i) {
              P.noFill();
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 120 + 120 * pulse);
              P.strokeWeight(4);
              P.circle(d.x, d.y, r * 2 + 12 + pulse * 3);
            }
            P.stroke(...INK);
            P.strokeWeight(2);
            P.fill(...fill);
            P.circle(d.x, d.y, r * 2);
            P.noStroke();
            P.fill(...INK);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(Math.min(15, r * 0.9));
            P.text(String(i), d.x, d.y + 0.5);
            P.pop();
            const mark = step && step.marks[i];
            if (mark) label(mark, d.x + r + 10, d.y - r + 2, HIGHLIGHT, 13, P.LEFT);
            if (!isLca && step && step.dist && step.dist[i] >= 0) label(String(step.dist[i]), d.x - r - 9, d.y - r + 2, BLUE, 11, P.RIGHT);
          });

          if (step) {
            drawSide(step, depth, parent);
            if (step.hint) label(step.hint, 20, H - 16, HIGHLIGHT, 13, P.LEFT);
          }
          label(isLca ? "rooted at 0" : "", TREE.x0, 18, [150, 165, 158], 11, P.LEFT, false);
        };
      };

      p5Instance = new p5(sketch, sketchRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      p5Instance?.remove();
    };
  }, [isLca]);

  const apply = () => {
    const { edges, errors, maxVertex } = parseEdgeList(text);
    if (errors.length) return setError(errors[0]);
    const count = maxVertex + 1;
    if (count > 16) return setError("use at most 16 vertices (0–15)");
    const list = edges.map((e) => [e.from, e.to]);
    const bad = validateTree(count, list);
    if (bad) return setError(bad);
    setError("");
    api.current?.setTree({ n: count, edges: list });
  };

  const select = "h-9 rounded-lg border border-rule-strong bg-card px-2 font-mono text-sm text-ink hover:cursor-pointer";
  return (
    <div>
      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
        {isLca && (
          <>
            <label className="flex items-center gap-1.5 text-sm text-ink-2">
              u
              <select className={select} value={uv.u} onChange={(e) => api.current?.setUV(Number(e.target.value), uv.v)}>
                {Array.from({ length: n }, (_, x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-sm text-ink-2">
              v
              <select className={select} value={uv.v} onChange={(e) => api.current?.setUV(uv.u, Number(e.target.value))}>
                {Array.from({ length: n }, (_, x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </label>
            <select
              className={select}
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                api.current?.setLift(e.target.value === "lift");
              }}
            >
              <option value="climb">Climb up</option>
              <option value="lift">Binary lifting</option>
            </select>
          </>
        )}
          <button type="button" className={ghostBtn} onClick={() => api.current?.setTree(randomTree(9 + Math.floor(Math.random() * 5)))}>
            Random tree
          </button>
        </div>
        <PlaybackButtons ui={ui} api={api} />
      </div>

      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center gap-2">
        <span className="text-sm text-ink-2">Tree edges:</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
          className="inpbox h-9 min-w-0 flex-1 font-mono"
          aria-label="Tree edges, for example 0-1, 0-2, 1-3"
        />
        <button type="button" className={ghostBtn} onClick={apply}>
          Apply
        </button>
        <button type="button" className={ghostBtn} onClick={() => api.current?.setTree(SAMPLE_TREE())}>
          Example
        </button>
        {error && <span className="w-full text-sm font-semibold text-pen-rust">{error}</span>}
      </div>

      <StepProgress ui={ui} api={api} label={isLca ? (method === "lift" ? "LCA · binary lifting" : "LCA · climb up") : "Diameter"} />

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration
        state={panelState}
        guide={{
          code: isLca ? (method === "lift" ? LCA_LIFT_CODE : LCA_CLIMB_CODE) : DIAMETER_CODE,
          stats: isLca ? { moves: "Pointer moves" } : { moves: "BFS layers", length: "Diameter" },
          legend: isLca
            ? [
                { kind: "tag", text: "u / v", label: "the two pointers" },
                { kind: "tag", text: "path", label: "where they climbed (pale yellow)" },
                { kind: "box-good", label: "the lowest common ancestor" },
              ]
            : [
                { kind: "tag", text: "2", label: "BFS distance (blue)" },
                { kind: "tag", text: "b / c", label: "ends of the diameter" },
                { kind: "box-good", label: "the longest path" },
              ],
        }}
      />
    </div>
  );
}
