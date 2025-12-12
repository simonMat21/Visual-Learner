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
        // Matrix dimensions (can be non-square)
        let rowsA = 3;
        let colsA = 2;

        let matrixA = [];
        let matrixInputsA = [];

        // UI elements
        let rowsAInput, colsAInput;
        let generateButton;
        let calculateButton;

        // Result
        let pseudoInverse = null;
        let errorMessage = null;

        // Singular Value Decomposition (simplified for pseudo-inverse)
        function computePseudoInverse(mat) {
          const rows = mat.length;
          const cols = mat[0].length;

          // For pseudo-inverse, compute A+ = A^T(AA^T)^-1 if rows >= cols
          // or A+ = (A^T A)^-1 A^T if cols > rows

          if (rows >= cols) {
            // More rows than columns: A+ = (A^T A)^-1 A^T
            const AT = transposeMatrix(mat);
            const ATA = multiplyMatrices(AT, mat);
            const ATAinv = invertMatrix(ATA);
            if (!ATAinv) return null;
            return multiplyMatrices(ATAinv, AT);
          } else {
            // More columns than rows: A+ = A^T(AA^T)^-1
            const AT = transposeMatrix(mat);
            const AAT = multiplyMatrices(mat, AT);
            const AATinv = invertMatrix(AAT);
            if (!AATinv) return null;
            return multiplyMatrices(AT, AATinv);
          }
        }

        function transposeMatrix(mat) {
          const rows = mat.length;
          const cols = mat[0].length;
          const result = [];
          for (let j = 0; j < cols; j++) {
            result[j] = [];
            for (let i = 0; i < rows; i++) {
              result[j][i] = mat[i][j];
            }
          }
          return result;
        }

        function multiplyMatrices(A, B) {
          const rowsA = A.length;
          const colsA = A[0].length;
          const rowsB = B.length;
          const colsB = B[0].length;

          if (colsA !== rowsB) return null;

          const result = [];
          for (let i = 0; i < rowsA; i++) {
            result[i] = [];
            for (let j = 0; j < colsB; j++) {
              result[i][j] = 0;
              for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
              }
            }
          }
          return result;
        }

        function invertMatrix(mat) {
          const n = mat.length;
          const det = calculateDeterminant(mat);

          if (Math.abs(det) < 0.0001) {
            return null; // Singular matrix
          }

          if (n === 1) {
            return [[1 / mat[0][0]]];
          }

          if (n === 2) {
            const inv = 1 / det;
            return [
              [mat[1][1] * inv, -mat[0][1] * inv],
              [-mat[1][0] * inv, mat[0][0] * inv],
            ];
          }

          // For 3x3 and larger, use Gaussian elimination
          const copy = [];
          for (let i = 0; i < n; i++) {
            copy[i] = [];
            for (let j = 0; j < n; j++) {
              copy[i][j] = mat[i][j];
            }
          }

          const inv = [];
          for (let i = 0; i < n; i++) {
            inv[i] = [];
            for (let j = 0; j < n; j++) {
              inv[i][j] = i === j ? 1 : 0;
            }
          }

          // Gaussian elimination with partial pivoting
          for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
              if (Math.abs(copy[k][i]) > Math.abs(copy[maxRow][i])) {
                maxRow = k;
              }
            }

            // Swap rows
            [copy[i], copy[maxRow]] = [copy[maxRow], copy[i]];
            [inv[i], inv[maxRow]] = [inv[maxRow], inv[i]];

            if (Math.abs(copy[i][i]) < 0.0001) return null;

            // Scale pivot row
            const pivot = copy[i][i];
            for (let j = 0; j < n; j++) {
              copy[i][j] /= pivot;
              inv[i][j] /= pivot;
            }

            // Eliminate column
            for (let k = 0; k < n; k++) {
              if (k === i) continue;
              const factor = copy[k][i];
              for (let j = 0; j < n; j++) {
                copy[k][j] -= factor * copy[i][j];
                inv[k][j] -= factor * inv[i][j];
              }
            }
          }

          return inv;
        }

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

        function calculatePseudoInverse() {
          // Read values from Matrix A inputs
          for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsA; j++) {
              const val = parseFloat(matrixInputsA[i][j].value());
              matrixA[i][j] = isNaN(val) ? 0 : val;
            }
          }

          // Calculate pseudo-inverse
          pseudoInverse = computePseudoInverse(matrixA);
          if (!pseudoInverse) {
            errorMessage = "Cannot compute pseudo-inverse (singular matrix)";
          } else {
            errorMessage = null;
          }

          P.redraw();
        }

        function generateMatrices() {
          let newRowsA = parseInt(rowsAInput.value());
          let newColsA = parseInt(colsAInput.value());

          if (newRowsA < 1 || newRowsA > 5 || newColsA < 1 || newColsA > 5) {
            alert("Please enter dimensions between 1 and 5");
            return;
          }

          rowsA = newRowsA;
          colsA = newColsA;

          clearMatrixInputs();

          // Reset results
          pseudoInverse = null;
          errorMessage = null;

          // Initialize matrix with random values
          matrixA = [];
          for (let i = 0; i < rowsA; i++) {
            matrixA[i] = [];
            for (let j = 0; j < colsA; j++) {
              matrixA[i][j] = Math.floor(Math.random() * 10);
            }
          }

          createMatrixGrid();
        }

        function clearMatrixInputs() {
          matrixInputsA.forEach((row) => {
            row.forEach((input) => {
              if (input && input.remove) {
                input.remove();
              }
            });
          });
          matrixInputsA = [];
        }

        function createMatrixGrid() {
          matrixInputsA = [];

          let maxDim = P.max(rowsA, colsA);
          let inputSize = P.min(50, 280 / maxDim);

          let startXA = 50;
          let startY = 120;

          for (let i = 0; i < rowsA; i++) {
            matrixInputsA[i] = [];
            for (let j = 0; j < colsA; j++) {
              let input = P.createInput(String(matrixA[i][j]));
              input.attribute("type", "number");
              input.style("width", inputSize + "px");
              input.style("height", inputSize + "px");
              input.style("font-size", P.min(12, inputSize / 3) + "px");
              input.style("font-weight", "bold");
              input.style("border", "2px solid #666");
              input.style("background-color", "#ffffff");
              input.style("color", "#000");
              input.style("text-align", "center");
              input.style("margin", "0");
              input.style("padding", "0");
              input.style("border-radius", "4px");

              let x = startXA + j * (inputSize + 4);
              let y = startY + i * (inputSize + 4);
              input.position(x, y);

              matrixInputsA[i][j] = input;
            }
          }
        }

        function drawMatrixDisplay(mat, x, y, title, rows, cols, decimals = 2) {
          if (!mat) return;

          P.fill(255);
          P.textSize(11);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text(title, x, y - 15);

          let maxDim = P.max(rows, cols);
          let cellSize = P.min(50, 280 / maxDim);
          let fontSize = P.min(11, cellSize / 3);

          // Draw matrix border
          P.stroke(150);
          P.strokeWeight(2);
          P.noFill();
          let matWidth = cols * cellSize;
          let matHeight = rows * cellSize;
          P.rect(x, y, matWidth, matHeight);

          // Draw cells
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(fontSize);
          P.noStroke();

          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              let cellX = x + j * cellSize;
              let cellY = y + i * cellSize;

              // Cell background
              P.fill(255);
              P.stroke(180);
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
          P.fill(255);
          P.textSize(11);
          P.textAlign(P.LEFT);
          P.noStroke();

          // Matrix A label
          P.text(`Matrix A (${rowsA}×${colsA}):`, 15, 105);

          // Show result or error
          if (errorMessage) {
            P.fill(255, 100, 100);
            P.textSize(13);
            P.textAlign(P.CENTER);
            P.text(errorMessage, P.width / 2, P.height / 2);
          } else if (pseudoInverse) {
            // Calculate layout with maximum space usage
            let maxDim = P.max(rowsA, colsA, colsA, rowsA);
            let inputSize = P.min(50, 280 / maxDim);

            // Calculate arrow position
            let arrowX = 20 + colsA * (inputSize + 4) + 50;
            let arrowY = 120 + (rowsA * (inputSize + 4)) / 2;

            // Draw arrow
            P.fill(220, 34, 72);
            P.textSize(28);
            P.textAlign(P.CENTER, P.CENTER);
            P.text("→", arrowX, arrowY);

            // Position result matrix to maximize space
            let resultX = arrowX + 40;
            let resultY = 120;

            // Ensure result stays in bounds
            if (resultX + colsA * (inputSize + 4) > P.width - 15) {
              resultX = P.width - colsA * (inputSize + 4) - 25;
            }

            drawMatrixDisplay(
              pseudoInverse,
              resultX,
              resultY,
              `Pseudo-Inverse A⁺ (${colsA}×${rowsA}):`,
              colsA,
              rowsA
            );

            // Show dimensions info at bottom
            P.fill(200, 255, 200);
            P.textSize(10);
            P.textAlign(P.CENTER);
            P.text(
              `A (${rowsA}×${colsA}) → A⁺ (${colsA}×${rowsA})`,
              P.width / 2,
              P.height - 15
            );
          }
        }

        function HTMLNumberInput(
          P,
          defaultValue,
          [x, y],
          classN = "w-[35px] text-xs font-bold border-2 border-[#666] bg-white text-black text-center",
          range = [1, 5]
        ) {
          let input = P.createInput(String(defaultValue));
          input.attribute("type", "number");
          input.attribute("min", String(range[0]));
          input.attribute("max", String(range[1]));
          input.position(x, y);
          input.class(classN);
          return input;
        }

        P.setup = () => {
          let cnv = P.createCanvas(1000, 600);

          let labelRowsA = P.createDiv("Rows:");
          labelRowsA.style("color", "white");
          labelRowsA.style("font-weight", "bold");
          labelRowsA.style("font-size", "12px");
          labelRowsA.position(40, 20);

          rowsAInput = HTMLNumberInput(P, 3, [80, 20]);

          let labelColsA = P.createDiv("Cols:");
          labelColsA.style("color", "white");
          labelColsA.style("font-weight", "bold");
          labelColsA.style("font-size", "12px");
          labelColsA.position(125, 20);

          colsAInput = HTMLNumberInput(P, 2, [165, 20]);

          generateButton = P.createButton("Generate Matrix");
          generateButton.style("font-size", "12px");
          generateButton.style("padding", "6px 12px");
          generateButton.style("color", "white");
          generateButton.style("background-color", "#007bff");
          generateButton.style("border", "2px solid #007bff");
          generateButton.style("border-radius", "6px");
          generateButton.style("cursor", "pointer");
          generateButton.style("font-weight", "bold");
          generateButton.mousePressed(generateMatrices);
          generateButton.position(
            cnv.position().x + 250,
            cnv.position().y + 15
          );

          calculateButton = P.createButton("Compute Pseudo-Inverse");
          calculateButton.style("font-size", "12px");
          calculateButton.style("padding", "6px 12px");
          calculateButton.style("color", "white");
          calculateButton.style("background-color", "#28a745");
          calculateButton.style("border", "2px solid #28a745");
          calculateButton.style("border-radius", "6px");
          calculateButton.style("cursor", "pointer");
          calculateButton.style("font-weight", "bold");
          calculateButton.mousePressed(calculatePseudoInverse);
          calculateButton.position(
            cnv.position().x + 400,
            cnv.position().y + 15
          );

          generateMatrices();
        };

        P.draw = () => {
          P.background(220, 34, 72);

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

  return <div ref={sketchRef} className="canvas-wrapper relative"></div>;
}
