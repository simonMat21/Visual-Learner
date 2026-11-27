"use client";

import { useEffect, useRef, useState } from "react";

import MstToolbar from "@/components/MstToolbar";
import SortNarration from "@/components/SortNarration";
import { MatrixDrawer } from "@/components/matrixDrawer";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { drawArrow, drawSelfLoop, drawWeightLabel, EDGE_MUTED, layoutRing, nodeDiameter, nodeRadius } from "@/lib/graphDraw";
import { trimNumber } from "@/lib/graphModel";
import { createPlayer, drawMstNodes, panel, placeLabels, SET_COLORS } from "@/lib/mstVisual";
import { GRAPH_ALGOS } from "@/lib/graphAlgos";

export const GW = 1000;
export const GH = 440;
const RING = { cx: 300, cy: 215, radius: 165 };
export const SIDE = { x: 596, y: 14, w: 390, h: 412 };

/** Named colours a step can use for vertices and edges. */
export const COLORS = {
  good: GOOD,
  active: HIGHLIGHT,
  frontier: [252, 232, 178],
  blue: [168, 214, 255],
  bad: BAD,
  dim: [84, 102, 94],
  white: [255, 255, 255],
  edge: EDGE_MUTED,
  check: [140, 196, 245],
};
const colorOf = (c, fallback) => {
  if (!c) return fallback;
  if (Array.isArray(c)) return c;
  if (c.startsWith("set:")) return SET_COLORS[Number(c.slice(4)) % SET_COLORS.length];
  return COLORS[c] || fallback;
};

export const ekey = (u, v, directed) => (directed || u < v ? `${u}-${v}` : `${v}-${u}`);

const stepDuration = (step) => {
  if (!step) return 900;
  if (step.done) return 1800;
  if (step.slow) return 1400;
  if (step.fast) return 450;
  return 900;
};

/**
 * Shared board for the graph algorithm pages. Everything algorithm-specific
 * (engine, side panel, pseudocode) comes from lib/graphAlgos via `algo`.
 */
export default function GraphAlgoVisualizer({ algo }) {
  const def = GRAPH_ALGOS[algo];
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0, drawerOpen: false });
  const [graph, setGraph] = useState({ size: 7, start: 0, directed: !!def.directed });
  const [panelState, setPanelState] = useState(null);

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;

    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let drawer = null;
        let canvas = null;
        let start = 0;
        let directed = !!def.directed;
        let nodes = [];
        let player = null;

        player = createPlayer(
          P,
          (s) => {
            setUi((u) => ({ ...u, ...s }));
            const st = player?.step;
            if (st) setPanelState({ lines: st.lines, stats: st.stats, result: st.result, done: st.done, miss: !!st.miss });
          },
          { duration: stepDuration }
        );

        function rebuild() {
          const size = drawer.size;
          if (start > size - 1) start = size - 1;
          nodes = layoutRing(P, size, RING);
          setGraph({ size, start, directed });
          player.setSteps(def.run(drawer.matrix.map((r) => [...r]), { start, directed }));
        }

        function makeDrawer(matrix) {
          const wasOpen = drawer?.isOpen;
          drawer?.destroy();
          drawer = new MatrixDrawer(P, {
            directed,
            weighted: !!def.weighted,
            defaultSize: matrix.length,
            height: GH,
            title: "Edit graph",
            subtitle: def.weighted
              ? `type a weight in a cell (0 = no edge)${def.negative ? " · negatives allowed" : ""}${directed ? " · row → column" : " · mirrored"}`
              : directed
                ? "click a cell to add / remove the edge row → column"
                : "click a cell to add / remove an edge · it is mirrored",
            random: (n) => def.random(n, directed),
            example: () => def.sample(directed),
            onChange: () => rebuild(),
            onToggle: (open) => setUi((u) => ({ ...u, drawerOpen: open })),
          });
          drawer.attach(canvas);
          drawer.load(matrix);
          if (wasOpen) drawer.open();
        }

        api.current = {
          ...player,
          toggleDrawer: () => drawer.toggle(),
          setStart(v) {
            start = Math.min(drawer.size - 1, Math.max(0, v));
            rebuild();
          },
          setDirected(d) {
            if (d === directed) return;
            const m = drawer.matrix.map((row) => [...row]);
            if (!d) {
              for (let i = 0; i < m.length; i++)
                for (let j = 0; j < m.length; j++) if (m[i][j] && !m[j][i]) m[j][i] = m[i][j];
              for (let i = 0; i < m.length; i++) for (let j = 0; j < i; j++) m[i][j] = m[j][i];
            }
            directed = d;
            makeDrawer(m);
          },
        };

        P.setup = () => {
          canvas = P.createCanvas(GW, GH);
          makeDrawer(def.sample(directed));
          P.mousePressed = () => {
            if (drawer.press(P.mouseX, P.mouseY)) return;
            if (!def.needsStart) return;
            const r = nodeDiameter(drawer.size) / 2 + 4;
            const hit = nodes.findIndex((n) => (n.x - P.mouseX) ** 2 + (n.y - P.mouseY) ** 2 <= r * r);
            if (hit >= 0) api.current.setStart(hit);
          };
          P.windowResized = () => drawer.follow();
        };

        cleanup = () => {
          player.destroy();
          drawer?.destroy();
        };

        /* ---------- helpers handed to each algorithm's side panel ---------- */
        const h = {
          P,
          SIDE,
          COLORS,
          colorOf,
          label(t, x, y, color = CHALK, size = 12, align = P.CENTER, bold = true) {
            P.push();
            P.noStroke();
            P.fill(...colorOf(color, CHALK));
            P.textAlign(align, P.CENTER);
            P.textSize(size);
            if (bold) P.textStyle(P.BOLD);
            P.text(String(t), x, y);
            P.pop();
          },
          chip(t, x, y, fill = GOOD, w = 30, hgt = 24, size = 13) {
            P.push();
            P.rectMode(P.CENTER);
            P.noStroke();
            P.fill(...colorOf(fill, GOOD));
            P.rect(x, y, w, hgt, 5);
            P.fill(...INK);
            P.textAlign(P.CENTER, P.CENTER);
            P.textStyle(P.BOLD);
            P.textSize(size);
            P.text(String(t), x, y + 0.5);
            P.pop();
          },
          box(x, y, w, hgt, color, alpha = 60) {
            P.push();
            P.noStroke();
            const c = colorOf(color, HIGHLIGHT);
            P.fill(c[0], c[1], c[2], alpha);
            P.rect(x, y, w, hgt, 4);
            P.pop();
          },
          num: (v) => (v === Infinity ? "∞" : v === -Infinity ? "−∞" : v == null ? "–" : trimNumber(v)),
          /** rows of cells; cols = [{ title, x }] ; rowColor(i) optional highlight colour */
          table({ y, cols, rows, pitch = 24, highlight = -1, rowColor }) {
            cols.forEach((c) => h.label(c.title, c.x, y, [190, 198, 192], 11));
            rows.forEach((row, i) => {
              const ry = y + 22 + i * pitch;
              const hc = i === highlight ? "active" : rowColor ? rowColor(i) : null;
              if (hc) h.box(SIDE.x + 8, ry - pitch / 2 + 1, SIDE.w - 16, pitch - 2, hc, 60);
              row.forEach((cell, j) => {
                const isObj = cell && typeof cell === "object";
                h.label(isObj ? cell.t : cell, cols[j].x, ry, isObj ? cell.c : CHALK, 13, P.CENTER, j === 0 || (isObj && cell.b));
              });
            });
          },
        };

        P.draw = () => {
          drawer.follow();
          drawer.update();
          player.update(P.deltaTime || 16);
          P.background(...BOARD);
          const step = player.step;
          const m = drawer.matrix;
          const n = m.length;
          const radius = nodeRadius(n);
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 170);
          const rev = step && step.reverse; // draw the transposed graph (Kosaraju)
          const edgeColor = (step && step.edgeColor) || {};
          const focus = step && step.focus;

          /* ---------- edges ---------- */
          const list = [];
          for (let u = 0; u < n; u++)
            for (let v = 0; v < n; v++) {
              if (!m[u][v] || !nodes[u] || !nodes[v]) continue;
              if (!directed && v < u) continue;
              list.push(rev ? { from: v, to: u, w: m[u][v] } : { from: u, to: v, w: m[u][v] });
            }
          const labels = def.weighted ? placeLabels(nodes, list.filter((e) => !(directed && m[e.to][e.from]))) : {};
          const fadeAll = step && step.fadeEdges;

          list.forEach(({ from: u, to: v, w }) => {
            if (u === v) {
              drawSelfLoop(P, nodes[u].x, nodes[u].y, u, radius, { angle: nodes[u].angle, directed });
              return;
            }
            const key = ekey(u, v, directed);
            const isFocus =
              focus && ((focus[0] === u && focus[1] === v) || (!directed && focus[0] === v && focus[1] === u));
            let color = colorOf(edgeColor[key], fadeAll ? COLORS.dim : EDGE_MUTED);
            let weight = edgeColor[key] ? 4 : 2;
            // "dim" means used up / removed: faint and dashed, thinner than a normal edge
            const gone = edgeColor[key] === "dim" && !isFocus;
            if (gone) weight = 1.5;
            if (isFocus) {
              color = colorOf(step.focusColor, HIGHLIGHT);
              weight = 5 + pulse;
            }
            const reciprocal = directed && (rev ? m[u][v] : m[v][u]);
            const from = isFocus && !directed ? focus[0] : u;
            const to = from === u ? v : u;
            const mid = drawArrow(P, nodes[from].x, nodes[from].y, nodes[to].x, nodes[to].y, radius, {
              color,
              weight,
              directed: Boolean(directed || isFocus),
              bend: reciprocal ? 18 : 0,
              dash: isFocus && step.focusDash ? [6, 5] : gone ? [3, 6] : null,
              alpha: gone ? 130 : undefined,
            });
            if (def.weighted) {
              const k = `${Math.min(u, v)}-${Math.max(u, v)}`;
              const pos = reciprocal ? mid : labels[k] || mid;
              const wv = step && step.weights ? step.weights[u]?.[v] ?? w : w;
              if (pos) drawWeightLabel(P, pos.x, pos.y, wv, { fill: isFocus ? HIGHLIGHT : wv < 0 ? [255, 190, 175] : undefined });
            }
          });

          /* ---------- vertices ---------- */
          const fills = nodes.map((_, v) => colorOf(step && step.nodeColor ? step.nodeColor[v] : null, COLORS.white));
          drawMstNodes(P, nodes, { diameter: nodeDiameter(n), fills, current: step && step.current != null ? step.current : -1 });

          if (step) {
            nodes.forEach((node, v) => {
              const text = step.nodeLabel && step.nodeLabel[v];
              if (text != null) {
                const dx = node.x - RING.cx;
                const dy = node.y - RING.cy;
                const len = Math.hypot(dx, dy) || 1;
                h.label(text, node.x + (dx / len) * 40, node.y + (dy / len) * 32, step.nodeLabelColor?.[v] || HIGHLIGHT, 12);
              }
            });
            panel(P, SIDE.x, SIDE.y, SIDE.w, SIDE.h);
            def.side(h, step, { n, directed, matrix: m });
            if (step.hint) h.label(step.hint, 20, GH - 16, HIGHLIGHT, 13, P.LEFT);
            if (rev) h.label("showing the REVERSED graph", RING.cx, 16, "blue", 12);
          }

          drawer.draw();
        };
      };

      p5Instance = new p5(sketch, sketchRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
      p5Instance?.remove();
    };
  }, [algo, def]);

  return (
    <div>
      <MstToolbar ui={ui} api={api}>
        {def.needsStart && (
          <label className="flex items-center gap-2 text-sm text-ink-2">
            Start
            <select
              className="h-9 rounded-lg border border-rule-strong bg-card px-2 font-mono text-sm text-ink hover:cursor-pointer"
              value={graph.start}
              onChange={(e) => api.current?.setStart(Number(e.target.value))}
            >
              {Array.from({ length: graph.size }, (_, v) => (
                <option key={v} value={v}>
                  vertex {v}
                </option>
              ))}
            </select>
          </label>
        )}
        {def.directedToggle && (
          <label className="ml-2 flex cursor-pointer items-center gap-2 text-sm text-ink-2">
            <input
              type="checkbox"
              checked={graph.directed}
              onChange={(e) => api.current?.setDirected(e.target.checked)}
              className="h-4 w-4 accent-[#25332d]"
            />
            Directed
          </label>
        )}
      </MstToolbar>

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration state={panelState} guide={{ code: def.code, stats: def.stats, legend: def.legend }} />
    </div>
  );
}
