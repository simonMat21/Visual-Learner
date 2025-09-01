"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch({ k1, k2, t }) {
  const sketchRef = useRef(null);
  const k1reff = useRef(k1);
  const k2reff = useRef(k2);
  const tref = useRef(t);

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
            for (let j = i; j < matrixSize; j++) {
              // Only iterate upper triangle
              if (i !== j) {
                let value = P.random() < 0.3 ? 1 : 0;
                matrix[i][j] = value;
                matrix[j][i] = value; // Make symmetric
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
          let startX = 80;
          let startY = 130;

          for (let i = 0; i < matrixSize; i++) {
            matrixButtons[i] = [];
            for (let j = 0; j < matrixSize; j++) {
              let button = P.createButton("0");
              button.style("width", buttonSize + "px");
              button.style("height", buttonSize + "px");
              button.style("font-size", P.min(14, buttonSize / 2.5) + "px");
              button.style("font-weight", "bold");
              button.style("border", "2px solid #666");
              button.style("background-color", "#ffffff");
              button.style("color", "#000");
              button.style("cursor", "pointer");
              button.style("margin", "0");
              button.style("padding", "0");
              button.style("border-radius", "4px");

              button.mousePressed(createToggleHandler(i, j));

              let x = startX + j * (buttonSize + 4);
              let y = startY + i * (buttonSize + 4);
              button.position(x, y);

              matrixButtons[i][j] = button;
            }
          }
        }

        function createToggleHandler(row, col) {
          return function () {
            let newValue = matrix[row][col] === 0 ? 1 : 0;

            // Update both positions for undirected graph
            matrix[row][col] = newValue;
            matrix[col][row] = newValue; // Symmetric update

            updateButtonAppearance(row, col);
            updateButtonAppearance(col, row); // Update symmetric button
          };
        }

        function updateButtonAppearance(row, col) {
          let button = matrixButtons[row][col];
          if (matrix[row][col] === 1) {
            button.html("1");
            button.style("background-color", "#4CAF50");
            button.style("color", "white");
          } else {
            button.html("0");
            button.style("background-color", "#ffffff");
            button.style("color", "#000");
          }
        }

        function updateButtonColors() {
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              updateButtonAppearance(i, j);
            }
          }
        }

        function drawGraph() {
          P.fill(0);
          P.textSize(16);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text("Adjacency Matrix (Click to toggle):", 20, 70);

          P.textAlign(P.CENTER);
          P.text("Graph Visualization", 700, 80);

          // Draw edges only once for undirected graph
          let drawnEdges = new Set();

          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              if (matrix[i][j] === 1) {
                if (i === j) {
                  // Draw self-loop
                  drawSelfLoop(nodes[i].x, nodes[i].y, i);
                } else {
                  // Create edge identifier to avoid drawing same edge twice
                  let edgeId = i < j ? `${i}-${j}` : `${j}-${i}`;

                  if (!drawnEdges.has(edgeId)) {
                    drawUndirectedEdge(
                      nodes[i].x,
                      nodes[i].y,
                      nodes[j].x,
                      nodes[j].y
                    );
                    drawnEdges.add(edgeId);
                  }
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

          P.noStroke();
          P.fill(0);
          P.textSize(14);
          P.textAlign(P.LEFT);
          let edgeCount = 0;
          for (let i = 0; i < matrixSize; i++) {
            for (let j = i; j < matrixSize; j++) {
              // Count each edge only once
              if (matrix[i][j] === 1 && i !== j) edgeCount++;
              if (matrix[i][i] === 1) edgeCount++; // Count self-loops
            }
          }

          P.text("Nodes: " + matrixSize, 600, 420);
          P.text("Edges: " + edgeCount, 600, 440);
          P.text("Undirected Graph", 600, 460);

          P.fill(0);
          P.textSize(12);
          P.textAlign(P.CENTER);
          let buttonSize = P.min(40, 300 / matrixSize);
          let startX = 20;
          let startY = 70;

          for (let j = 0; j < matrixSize; j++) {
            let x = startX + j * (buttonSize + 4) + buttonSize / 2;
            P.text(j, x + 18, startY + 30);
          }

          P.textAlign(P.RIGHT);
          for (let i = 0; i < matrixSize; i++) {
            let y = startY + i * (buttonSize + 4) + buttonSize / 2 + 5;
            P.text(i, startX + 8, y + 35);
          }
        }

        function drawUndirectedEdge(x1, y1, x2, y2) {
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
            P.strokeWeight(2);
            P.line(startX, startY, endX, endY);
          }
        }

        function drawSelfLoop(x, y, nodeIndex) {
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

  useEffect(() => {
    k1reff.current = k1;
    k2reff.current = k2;
    tref.current = t;
  }, [k1, k2, t]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
