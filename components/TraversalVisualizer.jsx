"use client";

import { useEffect, useRef, useState } from "react";

import MstToolbar from "@/components/MstToolbar";
import SortNarration from "@/components/SortNarration";
import { MatrixDrawer } from "@/components/matrixDrawer";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK } from "@/lib/boardPalette";
import { drawArrow, drawSelfLoop, EDGE_MUTED, layoutRing, nodeDiameter, nodeRadius } from "@/lib/graphDraw";
import { createPlayer, drawMstNodes, panel } from "@/lib/mstVisual";
import { BFS_CODE, DFS_CODE, bfsSteps, dfsSteps, ekey, randomGraph, sampleGraph } from "@/lib/traversalSteps";

const W = 1000;
const H = 440;
const RING = { cx: 300, cy: 205, radius: 160 };
const SIDE = { x: 600, y: 14, w: 384, h: 392 };
const PALE_YELLOW = [252, 232, 178];
const PALE_BLUE = [168, 214, 255];

const stepDuration = (step) => {
  if (!step) return 900;
  if (step.done) return 1800;
  if (step.edgeKind === "tree") return 1100;
  if (step.edgeKind) return 900;
  return 850;
};

/** BFS or DFS on a graph you build in the slide-out matrix.  algo "bfs" | "dfs" */
export default function TraversalVisualizer({ algo = "bfs" }) {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0, drawerOpen: false });
  const [graph, setGraph] = useState({ size: 8, start: 0, directed: false });
  const [panelState, setPanelState] = useState(null);
  const isBfs = algo === "bfs";

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
        let directed = false;
        let nodes = [];
        let player = null;

        player = createPlayer(
          P,
          (s) => {
            setUi((u) => ({ ...u, ...s }));
            const st = player?.step;
            if (st) setPanelState({ lines: st.lines, stats: st.stats, result: st.result, done: st.done });
          },
          { duration: stepDuration }
        );

        function rebuild() {
          const size = drawer.size;
          if (start > size - 1) start = size - 1;
          nodes = layoutRing(P, size, RING);
          setGraph({ size, start, directed });
          const make = isBfs ? bfsSteps : dfsSteps;
          player.setSteps(make(drawer.matrix, start, directed));
        }

        function makeDrawer(matrix) {
          const wasOpen = drawer?.isOpen;
          drawer?.destroy();
          drawer = new MatrixDrawer(P, {
            directed,
            weighted: false,
            defaultSize: 8,
            height: H,
            title: "Edit graph",
            subtitle: directed
              ? "click a cell to add / remove the edge row → column"
              : "click a cell to add / remove an edge · it is mirrored for you",
            random: (n) => randomGraph(n, directed),
            example: () => sampleGraph(),
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
              // undirected: an edge either way becomes an edge both ways
              for (let i = 0; i < m.length; i++)
                for (let j = 0; j < m.length; j++) if (m[i][j] || m[j][i]) m[i][j] = m[j][i] = 1;
            }
            directed = d;
            makeDrawer(m);
          },
        };

        P.setup = () => {
          canvas = P.createCanvas(W, H);
          makeDrawer(sampleGraph());
          P.mousePressed = () => {
            if (drawer.press(P.mouseX, P.mouseY)) return;
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

        function chip(v, x, y, fill, w = 30) {
          P.push();
          P.rectMode(P.CENTER);
          P.noStroke();
          P.fill(...fill);
          P.rect(x, y, w, 26, 5);
          P.fill(...INK);
          P.textAlign(P.CENTER, P.CENTER);
          P.textStyle(P.BOLD);
          P.textSize(13);
          P.text(String(v), x, y + 0.5);
          P.pop();
        }

        function drawSide(step) {
          panel(P, SIDE.x, SIDE.y, SIDE.w, SIDE.h);
          const x0 = SIDE.x + 14;

          // queue or call stack
          if (isBfs) {
            label("QUEUE   front → rear", x0, SIDE.y + 18, CHALK, 11, P.LEFT);
            if (!step.frontier.length) label("empty", x0, SIDE.y + 48, [150, 165, 158], 12, P.LEFT, false);
            step.frontier.forEach((v, i) => chip(v, x0 + 16 + i * 36, SIDE.y + 48, PALE_YELLOW));
          } else {
            label("CALL STACK   (top on the right)", x0, SIDE.y + 18, CHALK, 11, P.LEFT);
            if (!step.frontier.length) label("empty", x0, SIDE.y + 48, [150, 165, 158], 12, P.LEFT, false);
            step.frontier.forEach((v, i) => {
              const top = i === step.frontier.length - 1;
              chip(`dfs(${v})`, x0 + 30 + i * 62, SIDE.y + 48, top ? HIGHLIGHT : PALE_BLUE, 56);
            });
          }

          // visit order
          label("VISIT ORDER", x0, SIDE.y + 84, CHALK, 11, P.LEFT);
          step.order.forEach((v, i) => chip(v, x0 + 16 + i * 36, SIDE.y + 112, GOOD));

          // table
          const cols = [x0 + 26, x0 + 110, x0 + 196, x0 + 290];
          const head = ["vertex", "visited", "parent", isBfs ? "distance" : "found #"];
          head.forEach((h, i) => label(h, cols[i], SIDE.y + 148, [190, 198, 192], 11));
          const n = step.visited.length;
          const pitch = Math.min(26, 220 / Math.max(1, n));
          for (let v = 0; v < n; v++) {
            const y = SIDE.y + 172 + v * pitch;
            if (v === step.current) {
              P.push();
              P.noStroke();
              P.fill(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 60);
              P.rect(SIDE.x + 8, y - pitch / 2 + 1, SIDE.w - 16, pitch - 2, 4);
              P.pop();
            }
            label(String(v), cols[0], y, CHALK, 13);
            label(step.visited[v] ? "✔" : "–", cols[1], y, step.visited[v] ? GOOD : EDGE_MUTED, 13, P.CENTER, false);
            label(step.parent[v] < 0 ? "–" : String(step.parent[v]), cols[2], y, CHALK, 13, P.CENTER, false);
            label(step.number[v] == null ? "–" : String(step.number[v]), cols[3], y, CHALK, 13, P.CENTER, false);
          }
        }

        P.draw = () => {
          drawer.follow();
          drawer.update();
          player.update(P.deltaTime || 16);
          P.background(...BOARD);
          const step = player.step;
          const m = drawer.matrix;
          const n = m.length;
          const radius = nodeRadius(n);
          const tree = new Set(step ? step.tree : []);

          // edges
          for (let u = 0; u < n; u++) {
            for (let v = 0; v < n; v++) {
              if (!m[u][v] || !nodes[u] || !nodes[v]) continue;
              if (!directed && v < u) continue;
              if (u === v) {
                drawSelfLoop(P, nodes[u].x, nodes[u].y, u, radius, { angle: nodes[u].angle, directed });
                continue;
              }
              const key = ekey(u, v, directed);
              const isCur =
                step &&
                step.edge &&
                ((step.edge[0] === u && step.edge[1] === v) || (!directed && step.edge[0] === v && step.edge[1] === u));
              let color = EDGE_MUTED;
              let weight = 2;
              if (tree.has(key)) {
                color = GOOD;
                weight = 4;
              }
              if (isCur) {
                color = step.edgeKind === "skip" ? BAD : step.edgeKind === "tree" ? GOOD : HIGHLIGHT;
                weight = 5;
              }
              const from = isCur && !directed ? step.edge[0] : u;
              const to = from === u ? v : u;
              drawArrow(P, nodes[from].x, nodes[from].y, nodes[to].x, nodes[to].y, radius, {
                color,
                weight,
                // undirected edges get an arrow head only while being followed
                directed: Boolean(directed || (isCur && step.edgeKind !== "skip")),
                bend: directed && m[v][u] ? 18 : 0,
                dash: isCur && step.edgeKind === "skip" ? [6, 5] : null,
              });
            }
          }

          // vertices
          if (step) {
            const fills = nodes.map((_, v) => {
              const s = step.state[v];
              if (s === "done") return GOOD;
              if (s === "frontier") return isBfs ? PALE_YELLOW : PALE_BLUE;
              if (s === "active") return isBfs ? PALE_YELLOW : PALE_BLUE;
              return [255, 255, 255];
            });
            drawMstNodes(P, nodes, { diameter: nodeDiameter(n), fills, current: step.current ?? -1 });

            // distance / discovery number next to each vertex
            nodes.forEach((node, v) => {
              if (step.number[v] == null) return;
              const dx = node.x - RING.cx;
              const dy = node.y - RING.cy;
              const len = Math.hypot(dx, dy) || 1;
              const text = isBfs ? `d = ${step.number[v]}` : `#${step.number[v] + 1}`;
              label(text, node.x + (dx / len) * 36, node.y + (dy / len) * 30, HIGHLIGHT, 12);
            });

            drawSide(step);
            if (step.hint) label(step.hint, 24, H - 18, HIGHLIGHT, 13, P.LEFT);
          }

          if (step && step.done && step.missed && step.missed.length)
            label(`not reachable: ${step.missed.join(", ")}`, RING.cx, H - 42, BAD, 12);

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
  }, [isBfs]);

  return (
    <div>
      <MstToolbar ui={ui} api={api}>
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
        <label className="ml-2 flex cursor-pointer items-center gap-2 text-sm text-ink-2">
          <input
            type="checkbox"
            checked={graph.directed}
            onChange={(e) => api.current?.setDirected(e.target.checked)}
            className="h-4 w-4 accent-[#25332d]"
          />
          Directed
        </label>
      </MstToolbar>

      <div ref={sketchRef} className="canvas-wrapper"></div>

      <SortNarration
        state={panelState}
        guide={{
          code: isBfs ? BFS_CODE : DFS_CODE,
          stats: { visited: "Visited", checked: "Edges checked" },
          legend: isBfs
            ? [
                { kind: "box-outline", label: "vertex being processed" },
                { kind: "tag", text: "queue", label: "waiting in the queue" },
                { kind: "box-good", label: "finished / tree edge" },
              ]
            : [
                { kind: "box-outline", label: "vertex being explored" },
                { kind: "tag", text: "stack", label: "on the call stack" },
                { kind: "box-good", label: "finished / tree edge" },
              ],
        }}
      />
    </div>
  );
}
