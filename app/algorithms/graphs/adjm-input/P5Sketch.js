"use client";

import { useRef, useEffect } from "react";
import { inputMethod_directedAdjMatrix } from "../../../../components/inputmethods";
import { BOARD, CHALK } from "@/lib/boardPalette";
import { countEdges } from "@/lib/graphModel";
import {
  drawGraphEdges,
  drawHeading,
  drawNodes,
  drawStats,
  layoutRing,
  nodeRadius,
} from "@/lib/graphDraw";

export default function P5Sketch() {
  const sketchRef = useRef(null);

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    let inputHandler = null;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let nodes = [];

        function layoutNodes() {
          const size = inputHandler ? inputHandler.getMatrixSize() : 0;
          nodes = layoutRing(P, size, { cx: 690, cy: 250, radius: 130 });
        }

        P.setup = () => {
          let cnv = P.createCanvas(1000, 500);

          inputHandler = new inputMethod_directedAdjMatrix(P, {
            onMatrixGenerate: () => layoutNodes(),
            onMatrixUpdate: () => layoutNodes(),
          });
          inputHandler.createInputElements(cnv);
          inputHandler.handleMatrixGenerate(5);
          layoutNodes();

          P.mousePressed = () => {
            inputHandler.handleCanvasPress(P.mouseX, P.mouseY);
          };
          P.windowResized = () => inputHandler.handleResize();
        };

        P.draw = () => {
          P.background(...BOARD);

          inputHandler.drawPanelBackground();
          inputHandler.updatePanelAnimation();

          const matrix = inputHandler.getMatrix();
          const size = inputHandler.getMatrixSize();
          const radius = nodeRadius(size);
          const edges = countEdges(matrix);

          drawHeading(P, "Graph", 690, 62, { align: P.CENTER, size: 18 });

          const grid = inputHandler.grid;
          const hover =
            inputHandler.getIsInputPanelVisible() && inputHandler.tab === "matrix" && grid
              ? grid.active
              : null;
          drawGraphEdges(P, { matrix, nodes, radius, directed: true, hover });
          drawNodes(P, nodes, { highlight: hover ? [hover.i, hover.j] : [] });

          drawStats(
            P,
            [`${size} vertices \u00b7 ${edges} edges`, "directed graph"],
            470,
            452
          );

          if (edges === 0) {
            drawHeading(
              P,
              "press \u201cInput Graph\u201d to type edges like 0-1, 0-2, 1-3",
              690,
              306,
              { align: P.CENTER, size: 14, color: CHALK }
            );
          }
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);
      p5Instance = myP5;
    });
    return () => {
      cancelled = true;
      inputHandler?.destroy();
      inputHandler = null;
      p5Instance?.remove();
    };
  }, []);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
