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
        // Matrix dimensions
        let rowsA = 2;
        let colsA = 3;
        let rowsB = 3;
        let colsB = 2;

        let matrixA = [];
        let matrixB = [];
        let matrixInputsA = [];
        let matrixInputsB = [];

        // UI elements
        let rowsAInput, colsAInput;
        let rowsBInput, colsBInput;
        let generateButton;
        let multiplyButton;

        // Result
        let productMatrix = null;
        let errorMessage = null;
        let animationProgress = 0;
        let showAnimation = false;

        // Matrix multiplication function
        function multiplyMatrices(A, B) {
          const rowsA = A.length;
          const colsA = A[0].length;
          const rowsB = B.length;
          const colsB = B[0].length;

          // Check if multiplication is possible
          if (colsA !== rowsB) {
            return null;
          }

          // Initialize result matrix
          const result = [];
          for (let i = 0; i < rowsA; i++) {
            result[i] = [];
            for (let j = 0; j < colsB; j++) {
              result[i][j] = 0;
              // Compute dot product of row i of A and column j of B
              for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
              }
            }
          }

          return result;
        }

        // Get highlighted cells for animation
        function getHighlightedCells(resultRow, resultCol) {
          const cells = {
            rowA: resultRow,
            colA: null,
            rowB: null,
            colB: resultCol,
          };
          return cells;
        }

        function calculateMultiplication() {
          // Read values from Matrix A inputs
          for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsA; j++) {
              const val = parseFloat(matrixInputsA[i][j].value());
              matrixA[i][j] = isNaN(val) ? 0 : val;
            }
          }

          // Read values from Matrix B inputs
          for (let i = 0; i < rowsB; i++) {
            for (let j = 0; j < colsB; j++) {
              const val = parseFloat(matrixInputsB[i][j].value());
              matrixB[i][j] = isNaN(val) ? 0 : val;
            }
          }

          // Check if multiplication is valid
          if (colsA !== rowsB) {
            errorMessage = `Cannot multiply: columns of A (${colsA}) ≠ rows of B (${rowsB})`;
            productMatrix = null;
          } else {
            errorMessage = null;
            productMatrix = multiplyMatrices(matrixA, matrixB);
            animationProgress = 0;
            showAnimation = true;
          }

          P.redraw();
        }

        function generateMatrices() {
          let newRowsA = parseInt(rowsAInput.value());
          let newColsA = parseInt(colsAInput.value());
          let newRowsB = parseInt(rowsBInput.value());
          let newColsB = parseInt(colsBInput.value());

          if (
            newRowsA < 1 ||
            newRowsA > 5 ||
            newColsA < 1 ||
            newColsA > 5 ||
            newRowsB < 1 ||
            newRowsB > 5 ||
            newColsB < 1 ||
            newColsB > 5
          ) {
            alert("Please enter dimensions between 1 and 5");
            return;
          }

          rowsA = newRowsA;
          colsA = newColsA;
          rowsB = newRowsB;
          colsB = newColsB;

          clearMatrixInputs();

          // Reset results
          productMatrix = null;
          errorMessage = null;
          showAnimation = false;

          // Initialize matrices with random values
          matrixA = [];
          for (let i = 0; i < rowsA; i++) {
            matrixA[i] = [];
            for (let j = 0; j < colsA; j++) {
              matrixA[i][j] = Math.floor(Math.random() * 10);
            }
          }

          matrixB = [];
          for (let i = 0; i < rowsB; i++) {
            matrixB[i] = [];
            for (let j = 0; j < colsB; j++) {
              matrixB[i][j] = Math.floor(Math.random() * 10);
            }
          }

          createMatrixGrids();
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

          matrixInputsB.forEach((row) => {
            row.forEach((input) => {
              if (input && input.remove) {
                input.remove();
              }
            });
          });
          matrixInputsB = [];
        }

        function createMatrixGrids() {
          matrixInputsA = [];
          matrixInputsB = [];

          let inputSize = P.min(40, 180 / P.max(rowsA, colsA, rowsB, colsB));

          // Create Matrix A inputs
          let startXA = 50;
          let startY = 150;

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

          // Create Matrix B inputs
          let startXB = startXA + colsA * (inputSize + 4) + 100;

          for (let i = 0; i < rowsB; i++) {
            matrixInputsB[i] = [];
            for (let j = 0; j < colsB; j++) {
              let input = P.createInput(String(matrixB[i][j]));
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

              let x = startXB + j * (inputSize + 4);
              let y = startY + i * (inputSize + 4);
              input.position(x, y);

              matrixInputsB[i][j] = input;
            }
          }
        }

        function drawMatrixDisplay(
          mat,
          x,
          y,
          title,
          rows,
          cols,
          decimals = 2,
          highlightCells = null
        ) {
          if (!mat) return;

          P.fill(255);
          P.textSize(14);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text(title, x, y - 15);

          let cellSize = P.min(50, 200 / P.max(rows, cols));
          let fontSize = P.min(12, cellSize / 3.5);

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

              // Check if cell should be highlighted
              let isHighlighted = false;
              if (highlightCells) {
                if (
                  (highlightCells.rowA === i && highlightCells.colA === j) ||
                  (highlightCells.rowB === i && highlightCells.colB === j)
                ) {
                  isHighlighted = true;
                }
              }

              // Cell background
              if (isHighlighted) {
                P.fill(255, 255, 100);
              } else {
                P.fill(255);
              }
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
          P.textSize(14);
          P.textAlign(P.LEFT);
          P.noStroke();

          // Matrix A label
          P.text(`Matrix A (${rowsA}×${colsA}):`, 20, 100);

          // Draw multiplication sign
          let inputSize = P.min(40, 180 / P.max(rowsA, colsA, rowsB, colsB));
          let signX = 50 + colsA * (inputSize + 4) + 30;
          let signY = 150 + (rowsA * (inputSize + 4)) / 2;
          P.textSize(32);
          P.textAlign(P.CENTER, P.CENTER);
          P.fill(220, 34, 72);
          P.text("×", signX, signY);

          // Matrix B label
          P.textSize(14);
          P.textAlign(P.LEFT);
          let startXB = 50 + colsA * (inputSize + 4) + 100;
          P.fill(255);
          P.text(`Matrix B (${rowsB}×${colsB}):`, startXB - 30, 100);

          // Show result or error
          if (errorMessage) {
            P.fill(255, 100, 100);
            P.textSize(16);
            P.textAlign(P.CENTER);
            P.text(errorMessage, P.width / 2, 450);

            P.fill(255, 150, 150);
            P.textSize(12);
            P.text(
              `For multiplication to be valid: columns of A must equal rows of B`,
              P.width / 2,
              475
            );
            P.text(`Currently: ${colsA} ≠ ${rowsB}`, P.width / 2, 495);
          } else if (productMatrix) {
            // Draw equals sign
            let equalsX = P.width / 2;
            let equalsY = 150 + (rowsA * (inputSize + 4)) / 2;
            P.fill(220, 34, 72);
            P.textSize(32);
            P.textAlign(P.CENTER, P.CENTER);
            P.text("=", equalsX, equalsY);

            // Draw result matrix
            let resultX = equalsX + 60;
            let resultY = 150;
            drawMatrixDisplay(
              productMatrix,
              resultX,
              resultY,
              `Result (${rowsA}×${colsB}):`,
              rowsA,
              colsB
            );

            // Show dimensions info
            P.fill(200, 255, 200);
            P.textSize(12);
            P.textAlign(P.CENTER);
            P.text(
              `(${rowsA}×${colsA}) × (${rowsB}×${colsB}) = (${rowsA}×${colsB})`,
              P.width / 2,
              P.height - 20
            );
          }
        }

        P.setup = () => {
          let cnv = P.createCanvas(1000, 600);

          // Labels for inputs
          let labelRowsA = P.createDiv("Rows A:");
          labelRowsA.style("color", "white");
          labelRowsA.style("font-weight", "bold");
          labelRowsA.style("font-size", "12px");
          labelRowsA.position(cnv.position().x + 10, cnv.position().y + 25);

          rowsAInput = P.createInput("2");
          rowsAInput.attribute("type", "number");
          rowsAInput.attribute("min", "1");
          rowsAInput.attribute("max", "5");
          rowsAInput.style("width", "35px");
          rowsAInput.style("font-size", "12px");
          rowsAInput.style("font-weight", "bold");
          rowsAInput.style("border", "2px solid #666");
          rowsAInput.style("background-color", "#ffffff");
          rowsAInput.style("color", "#000");
          rowsAInput.style("text-align", "center");
          rowsAInput.position(cnv.position().x + 60, cnv.position().y + 20);

          let labelColsA = P.createDiv("Cols A:");
          labelColsA.style("color", "white");
          labelColsA.style("font-weight", "bold");
          labelColsA.style("font-size", "12px");
          labelColsA.position(cnv.position().x + 105, cnv.position().y + 25);

          colsAInput = P.createInput("3");
          colsAInput.attribute("type", "number");
          colsAInput.attribute("min", "1");
          colsAInput.attribute("max", "5");
          colsAInput.style("width", "35px");
          colsAInput.style("font-size", "12px");
          colsAInput.style("font-weight", "bold");
          colsAInput.style("border", "2px solid #666");
          colsAInput.style("background-color", "#ffffff");
          colsAInput.style("color", "#000");
          colsAInput.style("text-align", "center");
          colsAInput.position(cnv.position().x + 160, cnv.position().y + 20);

          let labelRowsB = P.createDiv("Rows B:");
          labelRowsB.style("color", "white");
          labelRowsB.style("font-weight", "bold");
          labelRowsB.style("font-size", "12px");
          labelRowsB.position(cnv.position().x + 210, cnv.position().y + 25);

          rowsBInput = P.createInput("3");
          rowsBInput.attribute("type", "number");
          rowsBInput.attribute("min", "1");
          rowsBInput.attribute("max", "5");
          rowsBInput.style("width", "35px");
          rowsBInput.style("font-size", "12px");
          rowsBInput.style("font-weight", "bold");
          rowsBInput.style("border", "2px solid #666");
          rowsBInput.style("background-color", "#ffffff");
          rowsBInput.style("color", "#000");
          rowsBInput.style("text-align", "center");
          rowsBInput.position(cnv.position().x + 260, cnv.position().y + 20);

          let labelColsB = P.createDiv("Cols B:");
          labelColsB.style("color", "white");
          labelColsB.style("font-weight", "bold");
          labelColsB.style("font-size", "12px");
          labelColsB.position(cnv.position().x + 305, cnv.position().y + 25);

          colsBInput = P.createInput("2");
          colsBInput.attribute("type", "number");
          colsBInput.attribute("min", "1");
          colsBInput.attribute("max", "5");
          colsBInput.style("width", "35px");
          colsBInput.style("font-size", "12px");
          colsBInput.style("font-weight", "bold");
          colsBInput.style("border", "2px solid #666");
          colsBInput.style("background-color", "#ffffff");
          colsBInput.style("color", "#000");
          colsBInput.style("text-align", "center");
          colsBInput.position(cnv.position().x + 360, cnv.position().y + 20);

          generateButton = P.createButton("Generate Matrices");
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
            cnv.position().x + 420,
            cnv.position().y + 15
          );

          multiplyButton = P.createButton("Calculate Product");
          multiplyButton.style("font-size", "12px");
          multiplyButton.style("padding", "6px 12px");
          multiplyButton.style("color", "white");
          multiplyButton.style("background-color", "#28a745");
          multiplyButton.style("border", "2px solid #28a745");
          multiplyButton.style("border-radius", "6px");
          multiplyButton.style("cursor", "pointer");
          multiplyButton.style("font-weight", "bold");
          multiplyButton.mousePressed(calculateMultiplication);
          multiplyButton.position(
            cnv.position().x + 630,
            cnv.position().y + 15
          );

          generateMatrices();
        };

        P.draw = () => {
          P.background(220, 34, 72);

          // Update animation
          if (showAnimation) {
            animationProgress += 0.02;
            if (animationProgress > 1) {
              animationProgress = 1;
              showAnimation = false;
            }
          }

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
