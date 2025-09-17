"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch() {
  const sketchRef = useRef(null);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        let matrixSize = 3;
        let matrix = [];
        let matrixButtons = [];
        let sizeInput;
        let generateButton;
        let randomButton;
        let nodes = [];

        function generateMatrix() {
          let newSize = parseInt(sizeInput.value());
          if (newSize < 1 || newSize > 8) {
            alert("Please enter a size between 1 and 8");
            return;
          }

          matrixSize = newSize;
          clearMatrixButtons();

          matrix = [];
          for (let i = 0; i < matrixSize; i++) {
            matrix[i] = [];
            for (let j = 0; j < matrixSize; j++) {
              matrix[i][j] = 0;
            }
          }

          createMatrixGrid();
          generateNodePositions();
        }

        function generateRandomGraph() {
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              if (i !== j) {
                if (P.random() < 0.3) {
                  // Generate random weight between 1 and 10
                  matrix[i][j] = Math.floor(P.random() * 10) + 1;
                } else {
                  matrix[i][j] = 0;
                }
              } else {
                matrix[i][j] = 0;
              }
            }
          }
          updateButtonColors();
        }

        function generateNodePositions() {
          nodes = [];
          let centerX = 700;
          let centerY = 250;
          // let radius = P.min(120, 400 / matrixSize);
          let radius = 120;

          for (let i = 0; i < matrixSize; i++) {
            let angle = (P.TWO_PI / matrixSize) * i - P.PI / 2;
            let x = centerX + P.cos(angle) * radius;
            let y = centerY + P.sin(angle) * radius;
            nodes.push({ x: x, y: y, label: i });
          }
        }

        function clearMatrixButtons() {
          matrixButtons.forEach((row) => {
            row.forEach((button) => {
              if (button && button.remove) {
                button.remove();
              }
            });
          });
          matrixButtons = [];
        }

        function createMatrixGrid() {
          matrixButtons = [];

          let buttonSize = P.min(40, 300 / matrixSize);
          let startX = 130;
          let startY = 160;

          for (let i = 0; i < matrixSize; i++) {
            matrixButtons[i] = [];
            for (let j = 0; j < matrixSize; j++) {
              // Create input field instead of button
              let input = P.createInput("0");
              input.style("width", buttonSize + "px");
              input.style("height", buttonSize + "px");
              input.style("font-size", P.min(12, buttonSize / 3) + "px");
              input.style("font-weight", "bold");
              input.style("border", "2px solid #666");
              input.style("background-color", "#ffffff");
              input.style("color", "#000");
              input.style("margin", "0");
              input.style("padding", "2px");
              input.style("border-radius", "4px");
              input.style("text-align", "center");

              // Add event listener for input changes
              input.input(createInputHandler(i, j));

              let x = startX + j * (buttonSize + 4);
              let y = startY + i * (buttonSize + 4);
              input.position(x, y);

              matrixButtons[i][j] = input;
            }
          }
        }

        function createInputHandler(row, col) {
          return function () {
            let value = parseFloat(this.value());
            // Allow negative values, only default to 0 if NaN
            if (isNaN(value)) {
              value = 0;
            }
            matrix[row][col] = value;
            updateInputAppearance(row, col);
          };
        }

        function updateInputAppearance(row, col) {
          let input = matrixButtons[row][col];
          let weight = matrix[row][col];

          if (weight === 0) {
            input.style("background-color", "#ffffff");
            input.style("color", "#000");
          } else if (weight < 0) {
            input.style("background-color", "#ff6b6b"); // Red for negative weights
            input.style("color", "white");
          } else {
            input.style("background-color", "#4CAF50"); // Green for positive weights
            input.style("color", "white");
          }
          input.value(weight.toString());
        }

        function updateButtonColors() {
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              updateInputAppearance(i, j);
            }
          }
        }

        function drawGraph() {
          P.fill(0);
          P.textSize(16);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text("Weighted Adjacency Matrix (Click to set weights):", 20, 70);

          P.textAlign(P.CENTER);
          P.text("Weighted Graph Visualization", 700, 80);

          // Draw edges with weights (including negative weights)
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              if (matrix[i][j] !== 0) {
                // Changed from > 0 to !== 0 to include negative weights
                if (i === j) {
                  // Draw self-loop with weight
                  drawSelfLoop(nodes[i].x, nodes[i].y, i, matrix[i][j]);
                } else {
                  // Check if there's a reverse edge
                  let hasReverse = matrix[j][i] !== 0; // Changed from > 0 to !== 0

                  if (hasReverse) {
                    // Draw curved edge for this direction
                    drawWeightedArrow(
                      nodes[i].x,
                      nodes[i].y,
                      nodes[j].x,
                      nodes[j].y,
                      matrix[i][j],
                      true,
                      false
                    );
                  } else {
                    // Draw straight edge for single direction
                    drawWeightedArrow(
                      nodes[i].x,
                      nodes[i].y,
                      nodes[j].x,
                      nodes[j].y,
                      matrix[i][j],
                      false,
                      false
                    );
                  }
                }
              }
            }
          }

          // Draw nodes on top of edges
          for (let i = 0; i < matrixSize; i++) {
            P.fill(255);
            P.stroke(0);
            P.strokeWeight(2);
            let nodeSize = P.min(35, 250 / matrixSize);
            P.circle(nodes[i].x, nodes[i].y, nodeSize);

            P.fill(0);
            P.noStroke();
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(P.min(16, nodeSize / 2));
            P.text(i, nodes[i].x, nodes[i].y);
          }

          // Display graph statistics
          P.noStroke();
          P.fill(0);
          P.textSize(14);
          P.textAlign(P.LEFT);
          let edgeCount = 0;
          let totalWeight = 0;
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              if (matrix[i][j] !== 0) {
                // Changed from > 0 to !== 0
                edgeCount++;
                totalWeight += matrix[i][j];
              }
            }
          }

          P.text("Nodes: " + matrixSize, 600, 420);
          P.text("Edges: " + edgeCount, 600, 440);
          P.text("Total Weight: " + totalWeight.toFixed(2), 600, 460); // Added toFixed for better display
          P.text("Weighted Directed Graph", 600, 480);

          // Draw matrix labels
          P.fill(0);
          P.textSize(12);
          P.textAlign(P.CENTER);
          let buttonSize = P.min(40, 300 / matrixSize);
          let startX = 80;
          let startY = 130;

          for (let j = 0; j < matrixSize; j++) {
            let x = startX + j * (buttonSize + 4) + buttonSize / 2;
            P.text(j, x, startY - 10);
          }

          P.textAlign(P.RIGHT);
          for (let i = 0; i < matrixSize; i++) {
            let y = startY + i * (buttonSize + 4) + buttonSize / 2 + 5;
            P.text(i, startX - 10, y);
          }
        }

        function drawArrow(x1, y1, x2, y2) {
          let nodeRadius = P.min(17, 125 / matrixSize);
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

        function drawWeightedArrow(
          x1,
          y1,
          x2,
          y2,
          weight,
          hasBidirectional,
          isReverse
        ) {
          let nodeRadius = P.min(17, 125 / matrixSize);
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

            // Use different colors for negative weights
            let edgeColor = weight < 0 ? [255, 100, 100] : [100, 100, 100]; // Red for negative, gray for positive
            P.stroke(edgeColor[0], edgeColor[1], edgeColor[2]);
            P.strokeWeight(2);
            P.noFill();

            if (hasBidirectional) {
              // Draw curved lines for bidirectional edges with better separation
              let midX = (startX + endX) / 2;
              let midY = (startY + endY) / 2;

              // Calculate perpendicular offset for curves (increased for better visibility)
              let perpX = -dy * 35; // Increased from 20 to 35
              let perpY = dx * 35;

              // Create distinct curves for each direction
              if (isReverse) {
                // Reverse direction gets a different curve shape
                perpX = -perpX * 0.7; // Different curve intensity
                perpY = -perpY * 0.7;
              }

              let controlX = midX + perpX;
              let controlY = midY + perpY;

              // Use different curve styles for better distinction
              if (isReverse) {
                // Draw with dashed pattern for reverse edge
                P.drawingContext.setLineDash([5, 5]);
              } else {
                // Solid line for forward edge
                P.drawingContext.setLineDash([]);
              }

              // Draw curve using bezier
              P.bezier(
                startX,
                startY,
                controlX,
                controlY,
                controlX,
                controlY,
                endX,
                endY
              );

              // Reset line dash
              P.drawingContext.setLineDash([]);

              // Calculate better arrowhead angle for curves
              let t = 0.9; // Position along curve for tangent calculation
              let curveX = P.bezierPoint(startX, controlX, controlX, endX, t);
              let curveY = P.bezierPoint(startY, controlY, controlY, endY, t);
              let tangentX = P.bezierTangent(
                startX,
                controlX,
                controlX,
                endX,
                t
              );
              let tangentY = P.bezierTangent(
                startY,
                controlY,
                controlY,
                endY,
                t
              );
              let arrowAngle = P.atan2(tangentY, tangentX);

              // Draw arrowhead at the end of the curve
              P.push();
              P.translate(endX, endY);
              P.rotate(arrowAngle);
              P.fill(isReverse ? 150 : 100); // Different colors for distinction
              P.noStroke();
              let arrowSize = 8;
              P.triangle(
                0,
                0,
                -arrowSize,
                arrowSize / 2,
                -arrowSize,
                -arrowSize / 2
              );
              P.pop();

              // Draw weight label on the curve with better positioning
              let labelT = 0.5; // Middle of the curve
              let labelX = P.bezierPoint(
                startX,
                controlX,
                controlX,
                endX,
                labelT
              );
              let labelY = P.bezierPoint(
                startY,
                controlY,
                controlY,
                endY,
                labelT
              );

              // Background circle for weight
              P.fill(255);
              P.stroke(0);
              P.strokeWeight(1);
              P.circle(labelX, labelY, 18);

              // Weight text with different colors for negative weights
              P.fill(
                weight < 0 ? 255 : isReverse ? 200 : 0,
                weight < 0 ? 100 : isReverse ? 0 : 100,
                weight < 0 ? 100 : 200
              );
              P.noStroke();
              P.textAlign(P.CENTER, P.CENTER);
              P.textSize(10);
              P.text(weight, labelX, labelY);
            } else {
              // Draw straight line for single direction
              P.line(startX, startY, endX, endY);

              // Draw arrowhead with appropriate color
              let arrowAngle = P.atan2(dy, dx);
              P.push();
              P.translate(endX, endY);
              P.rotate(arrowAngle);
              P.fill(edgeColor[0], edgeColor[1], edgeColor[2]);
              P.noStroke();
              let arrowSize = 8;
              P.triangle(
                0,
                0,
                -arrowSize,
                arrowSize / 2,
                -arrowSize,
                -arrowSize / 2
              );
              P.pop();

              // Draw weight label on the line
              let labelX = (startX + endX) / 2;
              let labelY = (startY + endY) / 2;

              // Background circle for weight
              P.fill(255);
              P.stroke(0);
              P.strokeWeight(1);
              P.circle(labelX, labelY, 16);

              // Weight text with color based on sign
              P.fill(
                weight < 0 ? 255 : 0,
                weight < 0 ? 100 : 100,
                weight < 0 ? 100 : 200
              );
              P.noStroke();
              P.textAlign(P.CENTER, P.CENTER);
              P.textSize(10);
              P.text(weight, labelX, labelY);
            }
          }
        }

        function drawSelfLoop(x, y, nodeIndex, weight) {
          let nodeRadius = P.min(17, 125 / matrixSize);
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

          // Draw weight label on the loop with background
          P.fill(255);
          P.stroke(0);
          P.strokeWeight(1);
          P.circle(loopCenterX, loopCenterY, 16);

          P.fill(0, 100, 200);
          P.noStroke();
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(10);
          P.text(weight, loopCenterX, loopCenterY);

          P.pop();
        }

        P.setup = () => {
          let cnv = P.createCanvas(1000, 500);

          sizeInput = P.createInput("5");
          sizeInput.attribute("type", "number");
          sizeInput.attribute("min", "1");
          sizeInput.attribute("max", "8");
          sizeInput.style("width", "50px");
          sizeInput.style("font-size", "14px");
          sizeInput.style("-moz-appearance", "textfield");
          sizeInput.style("appearance", "textfield");
          sizeInput.style("font-weight", "bold");
          sizeInput.style("border", "2px solid #666");
          sizeInput.style("background-color", "#ffffff");
          sizeInput.style("color", "#000");
          sizeInput.position(cnv.position().x + 50, cnv.position().y + 30);

          generateButton = P.createButton("Generate Matrix");
          generateButton.style("font-size", "14px");
          generateButton.style("padding", "8px 16px");
          generateButton.style("color", "white");
          generateButton.style("background-color", "#007bff");
          generateButton.style("border", "2px solid #007bff");
          generateButton.style("border-radius", "6px");
          generateButton.style("cursor", "pointer");
          generateButton.style("font-weight", "bold");
          generateButton.mousePressed(generateMatrix);
          generateButton.position(
            cnv.position().x + 150,
            cnv.position().y + 18
          );

          randomButton = P.createButton("Random Graph");
          randomButton.style("font-size", "14px");
          randomButton.style("padding", "8px 16px");
          randomButton.style("color", "white");
          randomButton.style("background-color", "#28a745");
          randomButton.style("border", "2px solid #28a745");
          randomButton.style("border-radius", "6px");
          randomButton.style("cursor", "pointer");
          randomButton.style("font-weight", "bold");
          randomButton.mousePressed(generateRandomGraph);
          randomButton.position(cnv.position().x + 320, cnv.position().y + 18);

          generateMatrix();
          generateNodePositions();
        };

        P.draw = () => {
          P.background(220, 34, 72);

          P.fill(0);
          P.textSize(14);
          P.textAlign(P.LEFT);
          P.text("Matrix Size:", 20, 15);

          drawGraph();
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
