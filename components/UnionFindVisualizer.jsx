"use client";

import { useEffect, useRef, useState } from "react";

import SortNarration from "@/components/SortNarration";
import { PlaybackButtons, StepProgress, ghostBtn, solidBtn } from "@/components/PlaybackBar";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { createPlayer, SET_COLORS } from "@/lib/mstVisual";
import {
  UF_CODE,
  chainForest,
  connectedSteps,
  depthOf,
  findSteps,
  makeSets,
  randomForest,
  setCount,
  unionSteps,
} from "@/lib/unionFindSteps";

const W = 1000;
const H = 430;
const N = 10;
const TOP = 50;
const FOREST_H = 250;
const ARR_Y = 372;
const EDGE = [150, 165, 158];

const stepDuration = (s) => (!s ? 900 : s.done ? 1500 : s.slow ? 1300 : 850);

/** Forest of parent pointers + the parent / rank arrays. */
export default function UnionFindVisualizer() {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0 });
  const [panel, setPanel] = useState(null);
  const [opName, setOpName] = useState("Union");
  const [a, setA] = useState("1");
  const [b, setB] = useState("4");
  const [opts, setOpts] = useState({ byRank: true, compress: true });
  const optsRef = useRef(opts);
  optsRef.current = opts;

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let state = randomForest(N, 5, { byRank: true, compress: true });
        const disp = {};
        let player = null;
        const idle = () =>
          setPanel({
            lines: [],
            stats: { hops: 0, sets: setCount(state.parent), height: Math.max(0, ...state.parent.map((_, i) => depthOf(state.parent, i))) },
          });

        player = createPlayer(
          P,
          (s) => {
            setUi((u) => ({ ...u, ...s }));
            const st = player?.step;
            if (st) setPanel({ lines: st.lines, stats: st.stats, result: st.result, done: st.done, miss: !!st.miss });
          },
          { duration: stepDuration }
        );

        api.current = {
          ...player,
          run(name, x, y) {
            const o = optsRef.current;
            const res = name === "union" ? unionSteps(state, x, y, o) : name === "find" ? findSteps(state, x, o) : connectedSteps(state, x, y, o);
            state = res.state;
            setOpName(name === "union" ? "Union" : name === "find" ? "Find" : "Connected?");
            player.setSteps(res.steps);
            player.play();
          },
          // (not "reset": that name is the player's "back to the first step")
          resetSets(kind) {
            state = kind === "chain" ? chainForest(N) : kind === "random" ? randomForest(N, 5, optsRef.current) : makeSets(N);
            player.setSteps([]);
            idle();
          },
        };

        cleanup = () => player.destroy();

        P.setup = () => {
          P.createCanvas(W, H);
          idle();
        };

        /** Leaves get consecutive slots, parents sit above the middle of their children. */
        function layout(parent) {
          const n = parent.length;
          const kids = Array.from({ length: n }, () => []);
          const roots = [];
          parent.forEach((p, i) => (p === i ? roots.push(i) : kids[p].push(i)));
          kids.forEach((k) => k.sort((x, y) => x - y));
          const depth = Array(n).fill(0);
          const x = Array(n).fill(0);
          let slot = 0;
          let maxD = 0;
          const place = (v, d) => {
            depth[v] = d;
            maxD = Math.max(maxD, d);
            if (!kids[v].length) {
              x[v] = slot++;
              return;
            }
            kids[v].forEach((c) => place(c, d + 1));
            x[v] = (x[kids[v][0]] + x[kids[v][kids[v].length - 1]]) / 2;
          };
          roots.forEach((r) => {
            place(r, 0);
            slot += 0.6; // a little gap between trees
          });
          const span = Math.max(1, slot - 0.6);
          const spacing = Math.min(84, (W - 120) / span);
          const gap = maxD ? Math.min(66, FOREST_H / maxD) : 66;
          const left = W / 2 - ((span - 1) * spacing) / 2;
          const root = parent.map((_, i) => {
            let r = i;
            let guard = 0;
            while (parent[r] !== r && guard++ < n) r = parent[r];
            return r;
          });
          const size = Math.max(20, Math.min(36, gap - 4, spacing - 6));
          return parent.map((_, i) => ({ x: left + x[i] * spacing, y: TOP + depth[i] * gap, root: root[i], size }));
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

        function arrowUp(x1, y1, x2, y2, color, weight, r = 19) {
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.hypot(dx, dy) || 1;
          const sx = x1 + (dx / len) * r;
          const sy = y1 + (dy / len) * r;
          const ex = x2 - (dx / len) * r;
          const ey = y2 - (dy / len) * r;
          P.push();
          P.stroke(...color);
          P.strokeWeight(weight);
          P.line(sx, sy, ex, ey);
          P.translate(ex, ey);
          P.rotate(Math.atan2(dy, dx));
          P.noStroke();
          P.fill(...color);
          P.triangle(0, 0, -9, 4.5, -9, -4.5);
          P.pop();
        }

        P.draw = () => {
          player.update(P.deltaTime || 16);
          const step = player.step;
          const parent = step ? step.parent : state.parent;
          const rank = step ? step.rank : state.rank;
          const pos = layout(parent);
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);
          pos.forEach((p, i) => {
            if (!disp[i]) disp[i] = { x: p.x, y: p.y };
            disp[i].x += (p.x - disp[i].x) * 0.18;
            disp[i].y += (p.y - disp[i].y) * 0.18;
          });

          P.background(...BOARD);
          const path = step ? step.path : [];
          const compressed = (step && step.compressed) || [];
          const link = step && step.link;

          // parent pointers (child -> parent)
          parent.forEach((p, i) => {
            if (p === i) return;
            const onPath = path.includes(i) && path.includes(p) && path.indexOf(p) === path.indexOf(i) + 1;
            let color = EDGE;
            let weight = 2;
            if (onPath) {
              color = HIGHLIGHT;
              weight = 3.5;
            }
            if (compressed.includes(i)) {
              color = [127, 209, 150];
              weight = 3.5;
            }
            if (link && link[0] === i) {
              color = GOOD;
              weight = 4 + pulse;
            }
            arrowUp(disp[i].x, disp[i].y, disp[p].x, disp[p].y, color, weight, pos[i].size / 2 + 1);
          });

          // nodes, coloured by set
          parent.forEach((_, i) => {
            const d = disp[i];
            const set = pos[i].root;
            const c = SET_COLORS[set % SET_COLORS.length];
            const isRoot = parent[i] === i;
            P.push();
            if (step && step.focus === i) {
              P.noFill();
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 120 + 120 * pulse);
              P.strokeWeight(4);
              P.circle(d.x, d.y, pos[i].size + 12 + pulse * 3);
            }
            P.stroke(...INK);
            P.strokeWeight(isRoot ? 3 : 1.5);
            P.fill(...(step && step.root === i && step.done ? GOOD : c));
            P.circle(d.x, d.y, pos[i].size);
            P.noStroke();
            P.fill(...INK);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(Math.min(15, pos[i].size * 0.5));
            P.text(String(i), d.x, d.y + 0.5);
            P.pop();
            if (isRoot) label(`rank ${rank[i]}`, d.x, d.y - pos[i].size / 2 - 11, [190, 198, 192], 10, P.CENTER, false);
          });

          // parent and rank arrays
          const cell = 56;
          const x0 = W / 2 - (N * cell) / 2;
          label("index", x0 - 14, ARR_Y - 26, [150, 165, 158], 11, P.RIGHT, false);
          label("parent", x0 - 14, ARR_Y, CHALK, 12, P.RIGHT);
          label("rank", x0 - 14, ARR_Y + 30, [150, 165, 158], 11, P.RIGHT, false);
          parent.forEach((p, i) => {
            const x = x0 + i * cell + cell / 2;
            label(String(i), x, ARR_Y - 26, [150, 165, 158], 11, P.CENTER, false);
            const hot = (link && link[0] === i) || compressed.includes(i);
            P.push();
            P.rectMode(P.CENTER);
            P.noStroke();
            P.fill(...(hot ? GOOD : path.includes(i) ? HIGHLIGHT : p === i ? SET_COLORS[i % SET_COLORS.length] : [246, 242, 233]));
            P.rect(x, ARR_Y, cell - 8, 30, 5);
            P.fill(...INK);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(15);
            P.text(String(p), x, ARR_Y + 0.5);
            P.pop();
            label(String(rank[i]), x, ARR_Y + 30, [150, 165, 158], 11, P.CENTER, false);
          });

          if (step && step.hint) label(step.hint, 20, H - 12, HIGHLIGHT, 13, P.LEFT);
          if (step && step.result && step.miss) label(step.result, W - 20, 20, BAD, 13, P.RIGHT);
        };
      };

      p5Instance = new p5(sketch, sketchRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      p5Instance?.remove();
    };
  }, []);

  const num = (s) => {
    const v = Number(s);
    return s.trim() !== "" && Number.isInteger(v) && v >= 0 && v < N ? v : null;
  };
  const go = (name) => {
    const x = num(a);
    const y = num(b);
    if (x == null || (name !== "find" && y == null)) return;
    api.current?.run(name, x, y);
  };

  const box = "inpbox h-9 w-16 text-center";
  return (
    <div>
      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input type="number" min={0} max={N - 1} value={a} onChange={(e) => setA(e.target.value)} className={box} aria-label="a" />
          <input type="number" min={0} max={N - 1} value={b} onChange={(e) => setB(e.target.value)} className={box} aria-label="b" />
          <button type="button" className={solidBtn} onClick={() => go("union")}>
            Union(a, b)
          </button>
          <button type="button" className={ghostBtn} onClick={() => go("find")}>
            Find(a)
          </button>
          <button type="button" className={ghostBtn} onClick={() => go("connected")}>
            Connected?
          </button>
        </div>
        <PlaybackButtons ui={ui} api={api} />
      </div>
      <div className="mx-auto mb-3 flex w-full max-w-[1012px] flex-wrap items-center gap-3 text-sm text-ink-2">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={opts.byRank} onChange={(e) => setOpts((o) => ({ ...o, byRank: e.target.checked }))} className="h-4 w-4 accent-[#25332d]" />
          Union by rank
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={opts.compress} onChange={(e) => setOpts((o) => ({ ...o, compress: e.target.checked }))} className="h-4 w-4 accent-[#25332d]" />
          Path compression
        </label>
        <span className="mx-1 h-6 w-px bg-rule-strong" />
        <button type="button" className={ghostBtn} onClick={() => api.current?.resetSets("single")}>
          All separate
        </button>
        <button type="button" className={ghostBtn} onClick={() => api.current?.resetSets("random")}>
          Random sets
        </button>
        <button type="button" className={ghostBtn} onClick={() => api.current?.resetSets("chain")} title="What naive unions can build">
          Worst-case chain
        </button>
        <span className="text-xs text-ink-3">elements 0–{N - 1}</span>
      </div>

      <StepProgress ui={ui} api={api} label={opName} />

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration
        state={panel}
        guide={{
          code: UF_CODE,
          stats: { hops: "Parent hops", sets: "Sets", height: "Tallest tree" },
          legend: [
            { kind: "tag", text: "colour", label: "one set (tree); thick ring = root" },
            { kind: "box-outline", label: "find path being climbed" },
            { kind: "box-good", label: "pointer just changed" },
          ],
        }}
      />
    </div>
  );
}
