"use client";

import { useRef, useEffect } from "react";
import { BOARD, CHALK } from "@/lib/boardPalette";
import { createMatrixBoard } from "@/lib/graphBoard";
import { countEdges, sumWeights } from "@/lib/graphModel";
import {
  drawGraphEdges,
  drawHeading,
  drawNodes,
  drawStats,
} from "@/lib/graphDraw";

const HINT =
  "type a weight in any cell, 0 means no edge \u00b7 negative weights are allowed \u00b7 right click clears";

export default function P5Sketch() {
  const sketchRef = useRef(null);

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let boardRef = null;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let board = null;

        P.setup = () => {
          const cnv = P.createCanvas(1000, 500);
          board = createMatrixBoard(P, { directed: true, weighted: true });
          board.attach(cnv);
          boardRef = board;
          P.mousePressed = () => board.press(P.mouseX, P.mouseY);
          P.windowResized = () => board.handleResize();
        };

        P.draw = () => {
          P.background(...BOARD);

          const { matrix, size, nodes } = board;

          drawHeading(P, "Weighted Adjacency Matrix", 20, 90);
          drawHeading(P, HINT, 20, 108, { size: 12, color: CHALK });
          board.drawHeaders();

          const hover = board.hover;
          drawGraphEdges(P, {
            matrix,
            nodes,
            radius: board.radius(),
            directed: true,
            weighted: true,
            hover,
          });
          drawNodes(P, nodes, { highlight: hover ? [hover.i, hover.j] : [] });

          drawHeading(P, "Graph", 690, 62, { align: P.CENTER, size: 18 });
          drawStats(
            P,
            [
              `${size} vertices \u00b7 ${countEdges(matrix)} edges`,
              `total weight ${sumWeights(matrix)}`,
              "weighted directed graph",
            ],
            440,
            430
          );
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);
      p5Instance = myP5;
    });
    return () => {
      cancelled = true;
      boardRef?.destroy();
      p5Instance?.remove();
    };
  }, []);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
