"use client";

import { useRef, useEffect } from "react";
import { BOARD, CHALK } from "@/lib/boardPalette";
import { createMatrixBoard } from "@/lib/graphBoard";
import { countEdges } from "@/lib/graphModel";
import {
  drawArrow,
  drawHeading,
  drawNodes,
  drawSelfLoop,
  drawStats,
} from "@/lib/graphDraw";

const HINT =
  "click a cell \u00b7 the lower triangle is locked \u00b7 right click clears \u00b7 click a number to fill that line";

export default function P5Sketch() {
  const sketchRef = useRef(null);

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let board = null;

        P.setup = () => {
          const cnv = P.createCanvas(1000, 500);
          board = createMatrixBoard(P, { directed: false, weighted: false });
          board.attach(cnv);
          P.mousePressed = () => board.press(P.mouseX, P.mouseY);
          P.windowResized = () => board.handleResize();
        };

        P.draw = () => {
          P.background(...BOARD);

          const { matrix, size, nodes } = board;

          drawHeading(P, "Adjacency Matrix", 20, 90);
          drawHeading(P, HINT, 20, 108, { size: 12, color: CHALK });
          board.drawHeaders();

          const radius = board.radius();
          for (let i = 0; i < size; i++) {
            for (let j = i; j < size; j++) {
              if (matrix[i][j] === 0) continue;
              if (i === j) drawSelfLoop(P, nodes[i].x, nodes[i].y, i, radius);
              else
                drawArrow(P, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, radius, {
                  directed: false,
                });
            }
          }
          drawNodes(P, nodes);

          drawHeading(P, "Graph", 690, 62, { align: P.CENTER, size: 18 });
          drawStats(
            P,
            [
              `${size} vertices \u00b7 ${countEdges(matrix, { directed: false })} edges`,
              "undirected graph",
            ],
            470,
            452
          );
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);
      p5Instance = myP5;
    });
    return () => {
      cancelled = true;
      p5Instance?.remove();
    };
  }, []);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
