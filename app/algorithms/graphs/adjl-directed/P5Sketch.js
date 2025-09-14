"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch() {
  const sketchRef = useRef(null);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        let graphSize = 3;
        let adjacencyList = {};
        let listElements = [];
        let sizeInput;
        let generateButton;
        let randomButton;
        let toggleButton;
        let isDirected = true;
        let nodes = [];

        function generateGraph() {
          let newSize = parseInt(sizeInput.value());
          if (newSize < 1 || newSize > 8) {
            alert("Please enter a size between 1 and 8");
            return;
          }

          graphSize = newSize;
          clearListElements();

          // Initialize adjacency list
          adjacencyList = {};
          for (let i = 0; i < graphSize; i++) {
            adjacencyList[i] = [];
          }

          createAdjacencyListDisplay();
          generateNodePositions();
        }

        function generateRandomGraph() {
          // Clear existing lists
          for (let i = 0; i < graphSize; i++) {
            adjacencyList[i] = [];
          }

          // Generate random edges
          if (isDirected) {
            for (let i = 0; i < graphSize; i++) {
              for (let j = 0; j < graphSize; j++) {
                if (i !== j && P.random() < 0.3) {
                  adjacencyList[i].push(j);
                }
              }
            }
          } else {
            // For undirected graphs, only generate edges once
            for (let i = 0; i < graphSize; i++) {
              for (let j = i + 1; j < graphSize; j++) {
                if (P.random() < 0.3) {
                  adjacencyList[i].push(j);
                  adjacencyList[j].push(i);
                }
              }
            }
          }
          updateListDisplay();
        }

        function toggleGraphType() {
          isDirected = !isDirected;
          updateToggleButtonText();

          // If switching to undirected, make adjacency list symmetric
          if (!isDirected) {
            makeGraphUndirected();
          }
          updateListDisplay();
        }

        function makeGraphUndirected() {
          // Make the adjacency list symmetric
          for (let i = 0; i < graphSize; i++) {
            for (let neighbor of adjacencyList[i]) {
              if (!adjacencyList[neighbor].includes(i)) {
                adjacencyList[neighbor].push(i);
              }
            }
          }
        }

        function updateToggleButtonText() {
          if (toggleButton) {
            toggleButton.html(
              isDirected ? "Switch to Undirected" : "Switch to Directed"
            );
          }
        }

        function generateNodePositions() {
          nodes = [];
          let centerX = 700;
          let centerY = 250;
          let radius = 120;

          for (let i = 0; i < graphSize; i++) {
            let angle = (P.TWO_PI / graphSize) * i - P.PI / 2;
            let x = centerX + P.cos(angle) * radius;
            let y = centerY + P.sin(angle) * radius;
            nodes.push({ x: x, y: y, label: i });
          }
        }

        function clearListElements() {
          listElements.forEach((element) => {
            if (element && element.remove) {
              element.remove();
            }
          });
          listElements = [];
        }

        function createAdjacencyListDisplay() {
          listElements = [];
          let startX = 50;
          let startY = 180;
          let lineHeight = 25;

          for (let i = 0; i < graphSize; i++) {
            // Create vertex label
            let vertexLabel = P.createDiv(`${i}:`);
            vertexLabel.style("position", "absolute");
            vertexLabel.style("font-weight", "bold");
            vertexLabel.style("font-size", "14px");
            vertexLabel.style("color", "#000");
            vertexLabel.position(startX + 20, startY + i * lineHeight);
            listElements.push(vertexLabel);

            // Create input field for adjacency list
            let listInput = P.createInput(adjacencyList[i].join(", "));
            listInput.style("width", "200px");
            listInput.style("font-size", "12px");
            listInput.style("border", "2px solid #666");
            listInput.style("padding", "4px");
            listInput.style("margin-left", "20px");
            listInput.position(startX + 25, startY + i * lineHeight - 5);

            // Add event listener to update adjacency list
            listInput.input(createInputHandler(i));
            listElements.push(listInput);
          }
        }

        function createInputHandler(vertex) {
          return function () {
            let input = this.value();
            let oldNeighbors = [...adjacencyList[vertex]]; // Store old neighbors
            adjacencyList[vertex] = [];

            if (input.trim() !== "") {
              let neighbors = input
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "");
              for (let neighbor of neighbors) {
                let n = parseInt(neighbor);
                if (!isNaN(n) && n >= 0 && n < graphSize) {
                  adjacencyList[vertex].push(n);
                }
              }
            }

            // If undirected graph, update the reverse connections
            if (!isDirected) {
              // Remove old reverse connections
              for (let oldNeighbor of oldNeighbors) {
                let index = adjacencyList[oldNeighbor].indexOf(vertex);
                if (index > -1) {
                  adjacencyList[oldNeighbor].splice(index, 1);
                }
              }

              // Add new reverse connections
              for (let neighbor of adjacencyList[vertex]) {
                if (!adjacencyList[neighbor].includes(vertex)) {
                  adjacencyList[neighbor].push(vertex);
                }
              }

              // Update all displays
              updateListDisplay();
            }
          };
        }

        function updateListDisplay() {
          for (let i = 0; i < graphSize; i++) {
            if (listElements[i * 2 + 1]) {
              listElements[i * 2 + 1].value(adjacencyList[i].join(", "));
            }
          }
        }

        function drawGraph() {
          P.fill(0);
          P.textSize(16);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text("Adjacency List (Edit values):", 50, 80);

          P.textAlign(P.CENTER);
          P.text("Graph Visualization", 700, 80);

          // Draw edges based on adjacency list
          let drawnEdges = new Set(); // To avoid drawing duplicate edges for undirected graphs

          for (let vertex in adjacencyList) {
            let from = parseInt(vertex);
            for (let to of adjacencyList[vertex]) {
              if (from === to) {
                // Draw self-loop
                drawSelfLoop(nodes[from].x, nodes[from].y, from);
              } else if (to < graphSize) {
                // For undirected graphs, avoid drawing the same edge twice
                if (!isDirected) {
                  let edgeId = from < to ? `${from}-${to}` : `${to}-${from}`;
                  if (drawnEdges.has(edgeId)) continue;
                  drawnEdges.add(edgeId);
                  // Draw undirected edge (line without arrow)
                  drawUndirectedEdge(
                    nodes[from].x,
                    nodes[from].y,
                    nodes[to].x,
                    nodes[to].y
                  );
                } else {
                  // Draw directed arrow
                  drawArrow(
                    nodes[from].x,
                    nodes[from].y,
                    nodes[to].x,
                    nodes[to].y
                  );
                }
              }
            }
          }

          // Draw nodes
          for (let i = 0; i < graphSize; i++) {
            P.fill(255);
            P.stroke(0);
            P.strokeWeight(2);
            let nodeSize = P.min(35, 250 / graphSize);
            P.circle(nodes[i].x, nodes[i].y, nodeSize);

            P.fill(0);
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
          for (let vertex in adjacencyList) {
            edgeCount += adjacencyList[vertex].length;
          }

          // For undirected graphs, each edge is counted twice, so divide by 2
          if (!isDirected) {
            edgeCount = edgeCount / 2;
          }

          P.text("Nodes: " + graphSize, 600, 420);
          P.text("Edges: " + edgeCount, 600, 440);
          P.text(isDirected ? "Directed Graph" : "Undirected Graph", 600, 460);

          // Draw adjacency list structure
          P.fill(0);
          P.textSize(12);
          P.text("Format: vertex1, vertex2, vertex3...", 50, 100);
          P.text("(Enter comma-separated neighbor vertices)", 50, 115);
          if (!isDirected) {
            P.text("Note: Adding edge A→B automatically adds B→A", 50, 130);
          }
        }

        function drawArrow(x1, y1, x2, y2) {
          let nodeRadius = P.min(17, 125 / graphSize);
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

        function drawUndirectedEdge(x1, y1, x2, y2) {
          let nodeRadius = P.min(17, 125 / graphSize);
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
          let nodeRadius = P.min(17, 125 / graphSize);
          let loopRadius = nodeRadius + 12;

          P.push();
          P.stroke(100);
          P.strokeWeight(2);
          P.noFill();

          let offsetAngle = (nodeIndex * P.PI) / 4;
          let loopCenterX =
            x + P.cos(offsetAngle - P.PI / 2) * (nodeRadius + loopRadius / 2.5);
          let loopCenterY =
            y + P.sin(offsetAngle - P.PI / 2) * (nodeRadius + loopRadius / 2.5);

          let startAngle = offsetAngle + P.PI / 1.4;
          let endAngle = startAngle + (3 * P.PI) / 2;

          P.arc(
            loopCenterX,
            loopCenterY,
            loopRadius,
            loopRadius,
            startAngle,
            endAngle
          );

          let arrowAngle = endAngle;
          let arrowX = loopCenterX + P.cos(arrowAngle) * (loopRadius / 2.5);
          let arrowY = loopCenterY + P.sin(arrowAngle) * (loopRadius / 2.5);

          P.push();
          P.translate(arrowX, arrowY);
          P.rotate(arrowAngle + P.PI / 1.6);
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

          generateButton = P.createButton("Generate Graph");
          generateButton.style("font-size", "14px");
          generateButton.style("padding", "8px 16px");
          generateButton.style("color", "white");
          generateButton.style("background-color", "#007bff");
          generateButton.style("border", "2px solid #007bff");
          generateButton.style("border-radius", "6px");
          generateButton.style("cursor", "pointer");
          generateButton.style("font-weight", "bold");
          generateButton.mousePressed(generateGraph);
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

          toggleButton = P.createButton("Switch to Undirected");
          toggleButton.style("font-size", "14px");
          toggleButton.style("padding", "8px 16px");
          toggleButton.style("color", "white");
          toggleButton.style("background-color", "#dc3545");
          toggleButton.style("border", "2px solid #dc3545");
          toggleButton.style("border-radius", "6px");
          toggleButton.style("cursor", "pointer");
          toggleButton.style("font-weight", "bold");
          toggleButton.mousePressed(toggleGraphType);
          toggleButton.position(cnv.position().x + 480, cnv.position().y + 18);

          generateGraph();
          generateNodePositions();
        };

        P.draw = () => {
          P.background(220, 34, 72);

          P.fill(0);
          P.textSize(14);
          P.textAlign(P.LEFT);
          P.text("Graph Size:", 20, 15);

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
