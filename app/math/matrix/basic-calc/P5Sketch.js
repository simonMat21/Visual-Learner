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
        let matrixInputs = [];
        let sizeInput;
        let generateButton;
        let calculateButton;

        // Results
        let transpose = null;
        let adjoint = null;
        let determinant = null;
        let trace = null;
        let inverse = null;

        // Matrix operations functions
        function calculateDeterminant(mat) {
          const n = mat.length;

          if (n === 1) return mat[0][0];
          if (n === 2) {
            return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
          }

          let det = 0;
          for (let j = 0; j < n; j++) {
            det += mat[0][j] * getCofactor(mat, 0, j);
          }
          return det;
        }

        function getCofactor(mat, row, col) {
          const minor = getMinor(mat, row, col);
          const sign = (row + col) % 2 === 0 ? 1 : -1;
          return sign * calculateDeterminant(minor);
        }

        function getMinor(mat, row, col) {
          const n = mat.length;
          const minor = [];
          for (let i = 0; i < n; i++) {
            if (i === row) continue;
            const minorRow = [];
            for (let j = 0; j < n; j++) {
              if (j === col) continue;
              minorRow.push(mat[i][j]);
            }
            minor.push(minorRow);
          }
          return minor;
        }

        function calculateTranspose(mat) {
          const n = mat.length;
          const trans = [];
          for (let i = 0; i < n; i++) {
            trans[i] = [];
            for (let j = 0; j < n; j++) {
              trans[i][j] = mat[j][i];
            }
          }
          return trans;
        }

        function calculateTrace(mat) {
          const n = mat.length;
          let tr = 0;
          for (let i = 0; i < n; i++) {
            tr += mat[i][i];
          }
          return tr;
        }

        function calculateAdjoint(mat) {
          const n = mat.length;
          const adj = [];

          if (n === 1) {
            return [[1]];
          }

          for (let i = 0; i < n; i++) {
            adj[i] = [];
            for (let j = 0; j < n; j++) {
              adj[i][j] = getCofactor(mat, i, j);
            }
          }
          return calculateTranspose(adj);
        }

        function calculateInverse(mat, det) {
          if (Math.abs(det) < 0.0001) {
            return null; // Matrix is singular
          }

          const adj = calculateAdjoint(mat);
          const n = mat.length;
          const inv = [];

          for (let i = 0; i < n; i++) {
            inv[i] = [];
            for (let j = 0; j < n; j++) {
              inv[i][j] = adj[i][j] / det;
            }
          }
          return inv;
        }

        function calculateAll() {
          // Read values from inputs
          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              const val = parseFloat(matrixInputs[i][j].value());
              matrix[i][j] = isNaN(val) ? 0 : val;
            }
          }

          // Calculate all operations
          transpose = calculateTranspose(matrix);
          determinant = calculateDeterminant(matrix);
          trace = calculateTrace(matrix);
          adjoint = calculateAdjoint(matrix);
          inverse = calculateInverse(matrix, determinant);
        }

        function generateMatrix() {
          let newSize = parseInt(sizeInput.value());
          if (newSize < 1 || newSize > 5) {
            alert("Please enter a size between 1 and 5");
            return;
          }

          matrixSize = newSize;
          clearMatrixInputs();

          // Reset results
          transpose = null;
          adjoint = null;
          determinant = null;
          trace = null;
          inverse = null;

          matrix = [];
          for (let i = 0; i < matrixSize; i++) {
            matrix[i] = [];
            for (let j = 0; j < matrixSize; j++) {
              matrix[i][j] = 0;
            }
          }

          createMatrixGrid();
        }

        function clearMatrixInputs() {
          matrixInputs.forEach((row) => {
            row.forEach((input) => {
              if (input && input.remove) {
                input.remove();
              }
            });
          });
          matrixInputs = [];
        }

        function createMatrixGrid() {
          matrixInputs = [];

          let inputSize = P.min(50, 250 / matrixSize);
          let startX = 125;
          let startY = 150;

          for (let i = 0; i < matrixSize; i++) {
            matrixInputs[i] = [];
            for (let j = 0; j < matrixSize; j++) {
              let input = P.createInput("0");
              input.attribute("type", "number");
              input.style("width", inputSize + "px");
              input.style("height", inputSize + "px");
              input.style("font-size", P.min(16, inputSize / 3) + "px");
              input.style("font-weight", "bold");
              input.style("border", "2px solid #666");
              input.style("background-color", "#ffffff");
              input.style("color", "#000");
              input.style("text-align", "center");
              input.style("margin", "0");
              input.style("padding", "0");
              input.style("border-radius", "4px");

              let x = startX + j * (inputSize + 6);
              let y = startY + i * (inputSize + 6);
              input.position(x, y);

              matrixInputs[i][j] = input;
            }
          }
        }

        function drawMatrixDisplay(mat, x, y, title, decimals = 2) {
          if (!mat) return;

          P.fill(0);
          P.textSize(14);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text(title, x, y - 10);

          let cellSize = P.min(45, 180 / matrixSize);
          let fontSize = P.min(12, cellSize / 3.5);

          // Draw matrix border
          P.stroke(100);
          P.strokeWeight(2);
          P.noFill();
          let matWidth = matrixSize * cellSize;
          let matHeight = matrixSize * cellSize;
          P.rect(x, y, matWidth, matHeight);

          // Draw cells
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(fontSize);
          P.noStroke();

          for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
              let cellX = x + j * cellSize;
              let cellY = y + i * cellSize;

              // Cell background
              P.fill(255);
              P.stroke(150);
              P.strokeWeight(1);
              P.rect(cellX, cellY, cellSize, cellSize);

              // Cell value
              P.noStroke();
              P.fill(0);
              let value = mat[i][j];
              let displayValue =
                typeof value === "number"
                  ? Math.abs(value) < 0.0001
                    ? "0"
                    : value.toFixed(decimals)
                  : value;
              P.text(displayValue, cellX + cellSize / 2, cellY + cellSize / 2);
            }
          }
        }

        function drawResults() {
          P.fill(0);
          P.textSize(16);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text("Input Matrix (A):", 20, 80);

          // Draw input matrix labels
          P.fill(0);
          P.textSize(12);
          P.textAlign(P.CENTER);
          let inputSize = P.min(50, 250 / matrixSize);
          let startX = 80;
          let startY = 130;

          for (let j = 0; j < matrixSize; j++) {
            let x = startX + j * (inputSize + 6) + inputSize / 2;
            P.text(j, x, startY - 15);
          }

          P.textAlign(P.RIGHT);
          for (let i = 0; i < matrixSize; i++) {
            let y = startY + i * (inputSize + 6) + inputSize / 2;
            P.text(i, startX - 15, y);
          }

          if (transpose) {
            let resultStartY = 130;
            let spacing = matrixSize * P.min(45, 180 / matrixSize) + 40;

            // Transpose - with proper notation
            P.fill(0);
            P.textSize(16);
            P.textAlign(P.LEFT);
            P.text("Transpose (A", 450, resultStartY - 20);
            P.textSize(11);
            P.text("T", 552, resultStartY - 26);
            P.textSize(16);
            P.text("):", 560, resultStartY - 20);
            drawMatrixDisplay(transpose, 450, resultStartY, "", 2);

            // Adjoint
            P.fill(0);
            P.textSize(16);
            P.textAlign(P.LEFT);
            P.text("Adjoint (adj(A)):", 450 + spacing, resultStartY - 20);
            drawMatrixDisplay(adjoint, 450 + spacing, resultStartY, "", 2);

            // Determinant and Trace on same line
            P.fill(0);
            P.textSize(16);
            P.textAlign(P.LEFT);
            P.text("Determinant (|A|) =", 450, resultStartY + spacing);
            P.textSize(18);
            P.fill(determinant === 0 ? [255, 0, 0] : [0, 150, 0]);
            P.text(determinant.toFixed(2), 610, resultStartY + spacing);

            // Trace
            P.fill(0);
            P.textSize(16);
            P.text("Trace (tr(A)) =", 450, resultStartY + spacing + 30);
            P.textSize(18);
            P.fill(0, 100, 200);
            P.text(trace.toFixed(2), 590, resultStartY + spacing + 30);

            // Inverse - with proper notation
            if (inverse) {
              P.fill(0);
              P.textSize(16);
              P.textAlign(P.LEFT);
              P.text("Inverse (A", 450, resultStartY + spacing + 65);
              P.textSize(11);
              P.text("-1", 528, resultStartY + spacing + 59);
              P.textSize(16);
              P.text("):", 540, resultStartY + spacing + 65);
              drawMatrixDisplay(
                inverse,
                450,
                resultStartY + spacing + 75,
                "",
                2
              );
            } else {
              P.fill(0);
              P.textSize(16);
              P.textAlign(P.LEFT);
              P.text("Inverse (A", 450, resultStartY + spacing + 65);
              P.textSize(11);
              P.text("-1", 548, resultStartY + spacing + 59);
              P.textSize(16);
              P.text("):", 564, resultStartY + spacing + 65);
              P.fill(255, 0, 0);
              P.textSize(14);
              P.textAlign(P.LEFT);
              P.text("Does not exist", 450, resultStartY + spacing + 85);
              P.textSize(12);
              P.fill(100);
              P.text("(Determinant = 0)", 450, resultStartY + spacing + 103);
            }
          }
        }

        P.setup = () => {
          let cnv = P.createCanvas(1000, 600);

          sizeInput = P.createInput("3");
          sizeInput.attribute("type", "number");
          sizeInput.attribute("min", "1");
          sizeInput.attribute("max", "5");
          sizeInput.style("width", "50px");
          sizeInput.style("font-size", "14px");
          sizeInput.style("-moz-appearance", "textfield");
          sizeInput.style("appearance", "textfield");
          sizeInput.style("font-weight", "bold");
          sizeInput.style("border", "2px solid #666");
          sizeInput.style("background-color", "#ffffff");
          sizeInput.style("color", "#000");
          sizeInput.position(cnv.position().x + 160, cnv.position().y + 30);

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
            cnv.position().x + 210 + 50,
            cnv.position().y + 18
          );

          calculateButton = P.createButton("Calculate All");
          calculateButton.style("font-size", "14px");
          calculateButton.style("padding", "8px 16px");
          calculateButton.style("color", "white");
          calculateButton.style("background-color", "#28a745");
          calculateButton.style("border", "2px solid #28a745");
          calculateButton.style("border-radius", "6px");
          calculateButton.style("cursor", "pointer");
          calculateButton.style("font-weight", "bold");
          calculateButton.mousePressed(calculateAll);
          calculateButton.position(
            cnv.position().x + 380 + 50,
            cnv.position().y + 18
          );

          generateMatrix();
        };

        P.draw = () => {
          P.background(220, 34, 72);

          P.fill(0);
          P.textSize(14);
          P.textAlign(P.LEFT);
          P.text("Matrix Size (1-5):", 20, 45);

          drawResults();
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
