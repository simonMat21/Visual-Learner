"use client";

import React, { useRef, useEffect } from "react";
import { inputMethod_directedAdjMatrix } from "../../../../components/inputmethods";

export default function P5Sketch({ k1, k2, t }) {
  const sketchRef = useRef(null);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        let nodes = [];
        let inputHandler;

        function generateNodePositions() {
          nodes = [];
          let centerX = 700;
          let centerY = 250;
          let radius = 120;

          for (let i = 0; i < inputHandler.getMatrixSize(); i++) {
            let angle =
              (P.TWO_PI / inputHandler.getMatrixSize()) * i - P.PI / 2;
            let x = centerX + P.cos(angle) * radius;
            let y = centerY + P.sin(angle) * radius;
            nodes.push({ x: x, y: y, label: i });
          }
        }

        function drawArrow(x1, y1, x2, y2) {
          let nodeRadius = P.min(17, 125 / inputHandler.getMatrixSize());
          let dx = x2 - x1;
          let dy = y2 - y1;
          let length = P.sqrt(dx * dx + dy * dy);

          if (length > nodeRadius * 2) {
            dx /= length;
            dy /= length;

            let startX = x1 + dx * nodeRadius;
            let startY = y1 + dy * nodeRadius;
            let endX = x2 - dx * nodeRadius;
            let endY = y2 - dy * nodeRadius;

            P.stroke(100);
            P.line(startX, startY, endX, endY);

            let arrowSize = 10;
            let angle = P.atan2(dy, dx);

            P.push();
            P.translate(endX, endY);
            P.rotate(angle);
            P.fill(100);
            P.noStroke();
            P.triangle(
              0,
              0,
              -arrowSize,
              arrowSize / 2,
              -arrowSize,
              -arrowSize / 2
            );
            P.pop();
          }
        }

        function drawSelfLoop(x, y, nodeIndex) {
          let nodeRadius = P.min(17, 125 / inputHandler.getMatrixSize());
          let loopRadius = nodeRadius + 12;

          P.push();
          P.stroke(100);
          P.strokeWeight(2);
          P.noFill();

          // Calculate position for the loop center (offset outward from node)
          let offsetAngle = (nodeIndex * P.PI) / 4; // Distribute loops around different positions
          let loopCenterX =
            x + P.cos(offsetAngle - P.PI / 2) * (nodeRadius + loopRadius / 2.5);
          let loopCenterY =
            y + P.sin(offsetAngle - P.PI / 2) * (nodeRadius + loopRadius / 2.5);

          // Draw partial arc (270 degrees) instead of full circle
          let startAngle = offsetAngle + P.PI / 1.4;
          let endAngle = startAngle + (3 * P.PI) / 2; // 270 degrees

          P.arc(
            loopCenterX,
            loopCenterY,
            loopRadius,
            loopRadius,
            startAngle,
            endAngle
          );

          // Calculate arrowhead position at the end of the arc
          let arrowAngle = endAngle;
          let arrowX = loopCenterX + P.cos(arrowAngle) * (loopRadius / 2.5);
          let arrowY = loopCenterY + P.sin(arrowAngle) * (loopRadius / 2.5);

          // Draw arrowhead pointing in the direction of the arc
          P.push();
          P.translate(arrowX, arrowY);
          P.rotate(arrowAngle + P.PI / 1.6); // Tangent to the circle
          P.fill(100);
          P.noStroke();
          let arrowSize = 6;
          P.triangle(
            0,
            0,
            -arrowSize / 2,
            -arrowSize,
            arrowSize / 2,
            -arrowSize
          );
          P.pop();

          P.pop();
        }

        P.setup = () => {
          let cnv = P.createCanvas(1000, 500);

          // Initialize inputMethod class with callbacks
          inputHandler = new inputMethod_directedAdjMatrix(P, {
            onMatrixGenerate: (newSize) => {
              generateNodePositions();
            },
            onRandomGenerate: () => {
              // No additional action needed
            },
            onMatrixUpdate: () => {
              // No additional action needed - matrix is updated within the class
            },
          });

          // Create input elements
          inputHandler.createInputElements(cnv);

          inputHandler.handleMatrixGenerate(5); // Initialize with default size
          generateNodePositions();
        };

        P.draw = () => {
          P.background(220, 34, 72);

          // Update panel animation and draw background using inputMethod
          if (inputHandler) {
            inputHandler.updatePanelAnimation();
            inputHandler.drawPanelBackground();
          }

          // Always draw the graph visualization
          P.fill(0);
          P.textAlign(P.CENTER);
          P.textSize(16);
          P.text("Graph Visualization", 700, 80);

          // Get matrix data from inputHandler
          let matrix = inputHandler.getMatrix();
          let matrixSize = inputHandler.getMatrixSize();

          // Draw the graph nodes and edges
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              if (matrix[i][j] === 1) {
                if (i === j) {
                  drawSelfLoop(nodes[i].x, nodes[i].y, i);
                } else {
                  drawArrow(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                }
              }
            }
          }

          for (let i = 0; i < matrixSize; i++) {
            P.fill(255);
            P.stroke(0);
            P.strokeWeight(2);
            let nodeSize = P.min(35, 250 / matrixSize);
            P.circle(nodes[i].x, nodes[i].y, nodeSize);

            P.fill(0);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(P.min(16, nodeSize / 2));
            P.text(i, nodes[i].x, nodes[i].y);
          }

          // Draw stats
          P.noStroke();
          P.fill(0);
          P.textSize(14);
          P.textAlign(P.LEFT);
          let edgeCount = 0;
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              if (matrix[i][j] === 1) edgeCount++;
            }
          }

          P.text("Nodes: " + matrixSize, 600, 420);
          P.text("Edges: " + edgeCount, 600, 440);
          P.text("Directed Graph", 600, 460);
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      return () => {
        myP5.remove();
      };
    });
  }, []);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
