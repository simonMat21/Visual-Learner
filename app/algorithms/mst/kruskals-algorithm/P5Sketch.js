"use client";

import { useRef, useEffect, useState } from "react";
import { BOARD, CHALK, GOOD, HIGHLIGHT, BAD, INK } from "@/lib/boardPalette";
import { drawHeading, EDGE_MUTED, layoutRing, nodeDiameter, nodeRadius } from "@/lib/graphDraw";
import { trimNumber } from "@/lib/graphModel";
import {
  KRUSKAL_CODE,
  kruskalSteps,
  randomConnectedMatrix,
  sampleMstMatrix,
  undirectedEdges,
} from "@/lib/mstSteps";
import {
  createPlayer,
  drawLegend,
  drawMstEdges,
  drawMstNodes,
  drawPseudocode,
  panel,
  placeLabels,
  SET_COLORS,
} from "@/lib/mstVisual";
import { MatrixDrawer } from "@/components/matrixDrawer";
import MstToolbar from "@/components/MstToolbar";

const W = 1000;
const H = 500;
const RING = { cx: 300, cy: 232, radius: 165 };
const SIDE = { x: 600, y: 16, w: 384, h: 296 };
const CODE = { x: 600, y: 324, w: 384, h: 146 };
const PAPER = [246, 242, 233];

export default function P5Sketch() {
  const sketchRef = useRef(null);
  const api = useRef(null);
  const [ui, setUi] = useState({ playing: false, speed: 1, index: 0, count: 0, drawerOpen: false });

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let cleanup = null;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let drawer = null;
        let nodes = [];
        const player = createPlayer(P, (state) => setUi((u) => ({ ...u, ...state })));

        function rebuild() {
          nodes = layoutRing(P, drawer.size, RING);
          player.setSteps(kruskalSteps(drawer.matrix));
        }

        api.current = { ...player, toggleDrawer: () => drawer.toggle() };

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
            drawer.press(P.mouseX, P.mouseY);
          };
          P.windowResized = () => drawer.follow();
        };

        cleanup = () => {
          player.destroy();
          drawer?.destroy();
        };

        const colorOfSet = (set) =>
          set && set.members.length > 1 ? SET_COLORS[set.root % SET_COLORS.length] : [255, 255, 255];

        function drawSide(step) {
          panel(P, SIDE.x, SIDE.y, SIDE.w, SIDE.h);
          const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 160);
          P.push();
          P.noStroke();
          P.textAlign(P.LEFT, P.CENTER);
          P.textSize(11);
          P.textStyle(P.BOLD);
          P.fill(...CHALK);
          P.text("EDGES, CHEAPEST FIRST", SIDE.x + 14, SIDE.y + 18);

          // sorted edge list as chips, read left to right, top to bottom
          const cols = 4;
          const chipW = 80;
          const chipH = 20;
          const gapX = (SIDE.w - 28 - cols * chipW) / (cols - 1);
          const pitch = 25;
          P.textAlign(P.CENTER, P.CENTER);
          step.sorted.forEach((e, idx) => {
            const x = SIDE.x + 14 + (idx % cols) * (chipW + gapX);
            const y = SIDE.y + 34 + Math.floor(idx / cols) * pitch;
            const s = step.status[idx];
            const fill = { considering: HIGHLIGHT, mst: GOOD, rejected: BAD }[s] || PAPER;
            const faded = s === "rejected" || s === "skipped";
            if (idx === step.cursor) {
              P.noFill();
              P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 120 + 120 * pulse);
              P.strokeWeight(3);
              P.rect(x - 3, y - 3, chipW + 6, chipH + 6, 6);
              P.noStroke();
            }
            P.fill(fill[0], fill[1], fill[2], faded ? 90 : 255);
            P.rect(x, y, chipW, chipH, 4);
            P.fill(INK[0], INK[1], INK[2], faded ? 140 : 255);
            P.textSize(12);
            P.textStyle(s === "mst" ? P.BOLD : P.NORMAL);
            P.text(`${e.from}–${e.to}  :  ${trimNumber(e.weight)}`, x + chipW / 2, y + chipH / 2 + 0.5);
            if (s === "rejected") {
              P.stroke(INK[0], INK[1], INK[2], 160);
              P.strokeWeight(1.5);
              P.line(x + 6, y + chipH / 2, x + chipW - 6, y + chipH / 2);
              P.noStroke();
            }
          });

          // disjoint sets
          const rows = Math.max(1, Math.ceil(step.sorted.length / cols));
          const sy = SIDE.y + 40 + rows * pitch;
          P.stroke(CHALK[0], CHALK[1], CHALK[2], 40);
          P.line(SIDE.x + 12, sy, SIDE.x + SIDE.w - 12, sy);
          P.noStroke();
          P.textAlign(P.LEFT, P.CENTER);
          P.textStyle(P.BOLD);
          P.textSize(11);
          P.fill(...CHALK);
          P.text("SETS  (vertices already connected)", SIDE.x + 14, sy + 16);

          let cx = SIDE.x + 14;
          let cy = sy + 30;
          P.textSize(12);
          P.textAlign(P.CENTER, P.CENTER);
          step.sets.forEach((set) => {
            const label = `{${set.members.join(", ")}}`;
            const w = P.textWidth(label) + 14;
            if (cx + w > SIDE.x + SIDE.w - 12) {
              cx = SIDE.x + 14;
              cy += 24;
            }
            P.fill(...colorOfSet(set));
            P.rect(cx, cy, w, 20, 10);
            P.fill(...INK);
            P.textStyle(P.BOLD);
            P.text(label, cx + w / 2, cy + 10.5);
            cx += w + 6;
          });

          const ty = SIDE.y + SIDE.h - 20;
          P.textAlign(P.LEFT, P.CENTER);
          P.textStyle(P.NORMAL);
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
          P.text(`${step.mstCount} / ${Math.max(0, drawer.size - 1)}`, SIDE.x + 272, ty);
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
            const fills = nodes.map((_, v) => colorOfSet(step.sets.find((s) => s.root === step.root[v])));
            const focus = step.cursor >= 0 && step.kind === "consider" ? step.sorted[step.cursor] : null;
            drawMstNodes(P, nodes, {
              diameter: nodeDiameter(drawer.size),
              fills,
              current: focus ? [focus.from, focus.to] : -1,
            });
            drawSide(step);
            drawPseudocode(P, CODE, KRUSKAL_CODE, step.lines);
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
            { label: "considering", color: HIGHLIGHT, weight: 6 },
            { label: "skipped (cycle)", color: BAD, dash: [6, 4], weight: 2 },
            { label: "not looked at", color: EDGE_MUTED, weight: 2 },
          ]);
          drawLegend(P, 20, 484, [
            { label: "on its own", color: [255, 255, 255], node: true },
            { label: "same colour = same set", color: SET_COLORS[1], node: true },
            { label: "never needed", color: [84, 102, 94], weight: 2 },
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
      <MstToolbar ui={ui} api={api} />
      <div ref={sketchRef} className="canvas-wrapper"></div>
    </div>
  );
}
