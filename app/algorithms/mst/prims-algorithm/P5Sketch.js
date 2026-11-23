"use client";

import { useRef, useEffect, useState } from "react";
import { BOARD, CHALK, GOOD, HIGHLIGHT } from "@/lib/boardPalette";
import { drawHeading, EDGE_MUTED, layoutRing, nodeDiameter, nodeRadius } from "@/lib/graphDraw";
import { trimNumber } from "@/lib/graphModel";
import {
  PRIM_CODE,
  primSteps,
  randomConnectedMatrix,
  sampleMstMatrix,
  undirectedEdges,
} from "@/lib/mstSteps";
import {
  CHECK,
  createPlayer,
  drawLegend,
  drawMstEdges,
  drawMstNodes,
  drawPseudocode,
  panel,
  placeLabels,
} from "@/lib/mstVisual";
import { MatrixDrawer } from "@/components/matrixDrawer";
import MstToolbar from "@/components/MstToolbar";

const W = 1000;
const H = 500;
const RING = { cx: 300, cy: 232, radius: 165 };
const SIDE = { x: 600, y: 16, w: 384, h: 282 };
const CODE = { x: 600, y: 310, w: 384, h: 160 };

export default function P5Sketch() {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0, drawerOpen: false });
  const [graph, setGraph] = useState({ size: 7, start: 0 });

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let drawer = null;
        let start = 0;
        let nodes = [];
        const player = createPlayer(P, (state) => setUi((u) => ({ ...u, ...state })));

        function rebuild() {
          const size = drawer.size;
          if (start > size - 1) start = size - 1;
          nodes = layoutRing(P, size, RING);
          setGraph({ size, start });
          player.setSteps(primSteps(drawer.matrix, start));
        }

        function setStart(v) {
          start = Math.min(drawer.size - 1, Math.max(0, v));
          rebuild();
        }

        api.current = {
          ...player,
          toggleDrawer: () => drawer.toggle(),
          setStart,
        };

        P.setup = () => {
          const canvas = P.createCanvas(W, H);
          drawer = new MatrixDrawer(P, {
            directed: false,
            weighted: true,
            defaultSize: 7,
            height: H,
            random: (n) => randomConnectedMatrix(n),
            example: () => sampleMstMatrix(),
            onChange: () => rebuild(),
            onToggle: (open) => setUi((u) => ({ ...u, drawerOpen: open })),
          });
          drawer.attach(canvas);
          drawer.load(sampleMstMatrix());

          P.mousePressed = () => {
            if (drawer.press(P.mouseX, P.mouseY)) return;
            // clicking a vertex makes it the start
            const r = nodeDiameter(drawer.size) / 2 + 4;
            const hit = nodes.findIndex((n) => (n.x - P.mouseX) ** 2 + (n.y - P.mouseY) ** 2 <= r * r);
            if (hit >= 0) setStart(hit);
          };
          P.windowResized = () => drawer.follow();
        };

        cleanup = () => {
          player.destroy();
          drawer?.destroy();
        };

        function drawSide(step) {
          panel(P, SIDE.x, SIDE.y, SIDE.w, SIDE.h);
          const cols = [SIDE.x + 50, SIDE.x + 140, SIDE.x + 236, SIDE.x + 330];
          P.push();
          P.noStroke();
          P.textAlign(P.LEFT, P.CENTER);
          P.textSize(11);
          P.textStyle(P.BOLD);
          P.fill(...CHALK);
          P.text("PRIM'S TABLE", SIDE.x + 14, SIDE.y + 18);
          P.textAlign(P.CENTER, P.CENTER);
          P.fill(CHALK[0], CHALK[1], CHALK[2], 170);
          ["vertex", "in tree", "key", "parent"].forEach((h, i) => P.text(h, cols[i], SIDE.y + 42));

          const n = drawer.size;
          const pitch = Math.min(24, 192 / Math.max(1, n));
          for (let v = 0; v < n; v++) {
            const y = SIDE.y + 64 + v * pitch;
            const changed = step.changed.includes(v);
            if (v === step.current || changed) {
              const c = v === step.current ? HIGHLIGHT : CHECK;
              P.fill(c[0], c[1], c[2], v === step.current ? 70 : 55);
              P.rect(SIDE.x + 8, y - pitch / 2 + 1, SIDE.w - 16, pitch - 2, 4);
            }
            P.textSize(13);
            P.textStyle(P.BOLD);
            P.fill(...CHALK);
            P.text(String(v), cols[0], y);
            P.textStyle(P.NORMAL);
            P.fill(...(step.inTree[v] ? GOOD : EDGE_MUTED));
            P.text(step.inTree[v] ? "✔" : "–", cols[1], y);
            P.fill(...(changed ? CHECK : CHALK));
            P.textStyle(changed ? P.BOLD : P.NORMAL);
            P.text(step.key[v] === Infinity ? "∞" : trimNumber(step.key[v]), cols[2], y);
            P.textStyle(P.NORMAL);
            P.fill(...CHALK);
            P.text(step.parent[v] < 0 ? "–" : String(step.parent[v]), cols[3], y);
          }

          const ty = SIDE.y + SIDE.h - 22;
          P.stroke(CHALK[0], CHALK[1], CHALK[2], 40);
          P.line(SIDE.x + 12, ty - 18, SIDE.x + SIDE.w - 12, ty - 18);
          P.noStroke();
          P.textAlign(P.LEFT, P.CENTER);
          P.textSize(12);
          P.fill(...CHALK);
          P.text("MST weight", SIDE.x + 14, ty);
          P.text("edges", SIDE.x + 230, ty);
          P.textStyle(P.BOLD);
          P.textSize(17);
          P.fill(...GOOD);
          P.text(trimNumber(step.total), SIDE.x + 92, ty);
          P.textSize(14);
          P.fill(...CHALK);
          P.text(`${step.mstCount} / ${Math.max(0, n - 1)}`, SIDE.x + 272, ty);
          P.pop();
        }

        /** Each outside vertex wears its current key, so the table is on the graph too. */
        function drawKeyTags(step) {
          P.push();
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(11);
          P.noStroke();
          nodes.forEach((node, v) => {
            if (step.inTree[v]) return;
            const dx = node.x - RING.cx;
            const dy = node.y - RING.cy;
            const len = Math.hypot(dx, dy) || 1;
            const changed = step.changed.includes(v);
            P.fill(...(changed ? CHECK : CHALK));
            P.textStyle(changed ? P.BOLD : P.NORMAL);
            const key = step.key[v] === Infinity ? "∞" : trimNumber(step.key[v]);
            P.text(`key ${key}`, node.x + (dx / len) * 36, node.y + (dy / len) * 30);
          });
          P.pop();
        }

        P.draw = () => {
          drawer.follow();
          drawer.update();
          P.background(...BOARD);
          player.update(P.deltaTime || 16);
          const step = player.step;

          const edges = undirectedEdges(drawer.matrix);
          const labels = placeLabels(nodes, edges);
          drawMstEdges(P, nodes, edges, step, player.elapsed, nodeRadius(drawer.size), labels);

          if (step) {
            const fills = nodes.map((_, v) => (step.inTree[v] ? GOOD : [255, 255, 255]));
            drawMstNodes(P, nodes, { diameter: nodeDiameter(drawer.size), fills, current: step.current });
            drawKeyTags(step);
            drawSide(step);
            drawPseudocode(P, CODE, PRIM_CODE, step.lines);
          }

          if (edges.length === 0) {
            drawHeading(P, "no edges yet — press “Edit graph” to add some", RING.cx, RING.cy + 4, {
              align: P.CENTER,
              size: 14,
              color: CHALK,
            });
          }

          drawLegend(P, 20, 462, [
            { label: "in MST", color: GOOD },
            { label: "chosen", color: HIGHLIGHT, weight: 6 },
            { label: "best link to tree", color: HIGHLIGHT, dash: [6, 4], weight: 3 },
            { label: "checking", color: CHECK },
          ]);
          drawLegend(P, 20, 484, [
            { label: "in tree", color: GOOD, node: true },
            { label: "outside", color: [255, 255, 255], node: true },
            { label: "useless", color: [84, 102, 94], weight: 2 },
            { label: "click a vertex to start there", color: HIGHLIGHT, node: true },
          ]);

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
  }, []);

  return (
    <div>
      <MstToolbar ui={ui} api={api}>
        <label className="flex items-center gap-2 text-sm text-ink-2">
          Start
          <select
            className="h-9 rounded-lg border border-rule-strong bg-card px-2 font-mono text-sm text-ink hover:cursor-pointer"
            value={graph.start}
            onChange={(e) => api.current?.setStart(Number(e.target.value))}
            title="Start vertex (or click a vertex)"
          >
            {Array.from({ length: graph.size }, (_, v) => (
              <option key={v} value={v}>
                vertex {v}
              </option>
            ))}
          </select>
        </label>
      </MstToolbar>
      <div ref={sketchRef} className="canvas-wrapper"></div>
    </div>
  );
}
