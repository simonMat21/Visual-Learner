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
        let rowsA = 3;
        let colsA = 2;

        let matrixA = [];
        let matrixInputsA = [];

        // UI elements
        let rowsAInput, colsAInput;
        let generateButton;
        let calculateButton;

        // SVD Results
        let svdResults = null;
        let errorMessage = null;

        // Simplified SVD using power iteration and deflation
        function computeSVD(mat) {
          const m = mat.length; // rows
          const n = mat[0].length; // cols
          
          // Create A^T A (Gram matrix)
          const AT = transposeMatrix(mat);
          const ATA = multiplyMatrices(AT, mat);
          
          // Find eigenvalues and eigenvectors of A^T A
          const eigenpairs = findEigendecomposition(ATA, n);
          
          // Singular values are sqrt of eigenvalues
          const singularValues = eigenpairs.map(pair => ({
            value: Math.sqrt(Math.max(0, pair.value)),
            vector: pair.vector
          }));
          
          // V matrix (eigenvectors of A^T A)
          const V = [];
          for (let j = 0; j < n; j++) {
            V[j] = [];
            for (let i = 0; i < n; i++) {
              V[j][i] = singularValues[i].vector[j][0];
            }
          }
          
          // U matrix (computed from A = U Σ V^T)
          const U = [];
          for (let i = 0; i < m; i++) {
            U[i] = [];
            for (let j = 0; j < Math.min(m, n); j++) {
              if (singularValues[j].value > 0.0001) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                  sum += mat[i][k] * V[k][j];
                }
                U[i][j] = sum / singularValues[j].value;
              } else {
                U[i][j] = 0;
              }
            }
          }
          
          // Σ matrix (diagonal matrix with singular values)
          const Sigma = [];
          for (let i = 0; i < m; i++) {
            Sigma[i] = [];
            for (let j = 0; j < n; j++) {
              if (i === j) {
                Sigma[i][j] = singularValues[i] ? singularValues[i].value : 0;
              } else {
                Sigma[i][j] = 0;
              }
            }
          }
          
          return {
            U: U.slice(0, m),
            Sigma: Sigma,
            V: V,
            singularValues: singularValues.map(p => p.value)
          };
        }

        function findEigendecomposition(mat, n) {
          const eigenpairs = [];
          let matCopy = [];
          for (let i = 0; i < n; i++) {
            matCopy[i] = [];
            for (let j = 0; j < n; j++) {
              matCopy[i][j] = mat[i][j];
            }
          }
          
          for (let k = 0; k < n; k++) {
            const pair = powerIteration(matCopy, n, 50);
            eigenpairs.push(pair);
            
            // Deflate matrix
            if (pair.value > 0.0001) {
              for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                  let outer = 0;
                  for (let l = 0; l < n; l++) {
                    outer += pair.vector[i][0] * pair.vector[l][0];
                  }
                  matCopy[i][j] -= pair.value * outer;
                }
              }
            }
          }
          
          return eigenpairs;
        }

        function powerIteration(mat, n, iterations) {
          let v = [];
          for (let i = 0; i < n; i++) {
            v[i] = [Math.random() + 0.1];
          }
          
          let eigenvalue = 0;
          for (let iter = 0; iter < iterations; iter++) {
            // Av
            let Av = [];
            for (let i = 0; i < n; i++) {
              Av[i] = 0;
              for (let j = 0; j < n; j++) {
                Av[i] += mat[i][j] * v[j][0];
              }
            }
            
            // Find norm
            let norm = 0;
            for (let i = 0; i < n; i++) {
              norm += Av[i] * Av[i];
            }
            norm = Math.sqrt(norm);
            
            if (norm < 0.0001) {
              norm = 0.0001;
            }
            
            // Normalize
            for (let i = 0; i < n; i++) {
              v[i][0] = Av[i] / norm;
            }
            
            eigenvalue = norm;
          }
          
          return { value: eigenvalue, vector: v };
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

        function calculateSVD() {
          // Read values from Matrix A inputs
          for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsA; j++) {
              const val = parseFloat(matrixInputsA[i][j].value());
              matrixA[i][j] = isNaN(val) ? 0 : val;
            }
          }

          // Calculate SVD
          svdResults = computeSVD(matrixA);
          if (!svdResults) {
            errorMessage = "Cannot compute SVD";
          } else {
            errorMessage = null;
          }

          P.redraw();
        }

        function generateMatrices() {
          let newRowsA = parseInt(rowsAInput.value());
          let newColsA = parseInt(colsAInput.value());

          if (
            newRowsA < 1 ||
            newRowsA > 5 ||
            newColsA < 1 ||
            newColsA > 5
          ) {
            alert("Please enter dimensions between 1 and 5");
            return;
          }

          rowsA = newRowsA;
          colsA = newColsA;

          clearMatrixInputs();

          // Reset results
          svdResults = null;
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
          let inputSize = P.min(40, 140 / maxDim);

          let startXA = 10;
          let startY = 130;

          for (let i = 0; i < rowsA; i++) {
            matrixInputsA[i] = [];
            for (let j = 0; j < colsA; j++) {
              let input = P.createInput(String(matrixA[i][j]));
              input.attribute("type", "number");
              input.style("width", inputSize + "px");
              input.style("height", inputSize + "px");
              input.style("font-size", P.min(10, inputSize / 3) + "px");
              input.style("font-weight", "bold");
              input.style("border", "2px solid #666");
              input.style("background-color", "#ffffff");
              input.style("color", "#000");
              input.style("text-align", "center");
              input.style("margin", "0");
              input.style("padding", "0");
              input.style("border-radius", "4px");

              let x = startXA + j * (inputSize + 2);
              let y = startY + i * (inputSize + 2);
              input.position(x, y);

              matrixInputsA[i][j] = input;
            }
          }
        }

        function drawMatrixDisplay(mat, x, y, title, rows, cols, decimals = 2) {
          if (!mat) return;

          P.fill(255);
          P.textSize(9);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text(title, x, y - 10);

          let maxDim = P.max(rows, cols);
          let cellSize = P.min(40, 140 / maxDim);
          let fontSize = P.min(8, cellSize / 3);

          // Draw matrix border
          P.stroke(150);
          P.strokeWeight(1.5);
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
              P.strokeWeight(0.5);
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
          P.textSize(9);
          P.textAlign(P.LEFT);
          P.noStroke();

          // Matrix A label
          P.text(`A (${rowsA}×${colsA}):`, 5, 115);

          // Show result or error
          if (errorMessage) {
            P.fill(255, 100, 100);
            P.textSize(12);
            P.textAlign(P.CENTER);
            P.text(errorMessage, P.width / 2, P.height / 2);
          } else if (svdResults) {
            // Layout: U | Σ | V^T
            // with A = U Σ V^T shown at bottom
            
            let cellSize = P.min(40, 140 / P.max(rowsA, colsA));
            
            // U matrix position
            let uX = 10;
            let uY = 130;
            drawMatrixDisplay(
              svdResults.U,
              uX,
              uY,
              `U (${rowsA}×${Math.min(rowsA, colsA)}):`,
              rowsA,
              Math.min(rowsA, colsA),
              1
            );
            
            // Σ matrix position
            let sigmaX = uX + Math.min(rowsA, colsA) * cellSize + 40;
            let sigmaY = uY;
            drawMatrixDisplay(
              svdResults.Sigma,
              sigmaX,
              sigmaY,
              `Σ (${rowsA}×${colsA}):`,
              rowsA,
              colsA,
              1
            );
            
            // V^T matrix position (transpose of V for display)
            let vT = transposeMatrix(svdResults.V);
            let vtX = sigmaX + colsA * cellSize + 40;
            let vtY = uY;
            drawMatrixDisplay(
              vT,
              vtX,
              vtY,
              `V^T (${colsA}×${colsA}):`,
              colsA,
              colsA,
              2
            );
            
            // Show equation at bottom
            P.fill(200, 255, 200);
            P.textSize(10);
            P.textAlign(P.CENTER);
            P.text(
              `A = U Σ V^T`,
              P.width / 2,
              P.height - 20
            );
            
            // Show singular values
            P.fill(255, 220, 150);
            P.textSize(8);
            let svText = "Singular Values: ";
            for (let i = 0; i < svdResults.singularValues.length; i++) {
              svText += svdResults.singularValues[i].toFixed(2);
              if (i < svdResults.singularValues.length - 1) svText += ", ";
            }
            P.text(svText, P.width / 2, P.height - 8);
          }
        }

        P.setup = () => {
          let cnv = P.createCanvas(1000, 600);

          let labelRowsA = P.createDiv("Rows:");
          labelRowsA.style("color", "white");
          labelRowsA.style("font-weight", "bold");
          labelRowsA.style("font-size", "12px");
          labelRowsA.position(cnv.position().x + 10, cnv.position().y + 25);

          rowsAInput = P.createInput("3");
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
          rowsAInput.position(cnv.position().x + 50, cnv.position().y + 20);

          let labelColsA = P.createDiv("Cols:");
          labelColsA.style("color", "white");
          labelColsA.style("font-weight", "bold");
          labelColsA.style("font-size", "12px");
          labelColsA.position(cnv.position().x + 95, cnv.position().y + 25);

          colsAInput = P.createInput("2");
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
          colsAInput.position(cnv.position().x + 145, cnv.position().y + 20);

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
          generateButton.position(cnv.position().x + 200, cnv.position().y + 15);

          calculateButton = P.createButton("Compute SVD");
          calculateButton.style("font-size", "12px");
          calculateButton.style("padding", "6px 12px");
          calculateButton.style("color", "white");
          calculateButton.style("background-color", "#28a745");
          calculateButton.style("border", "2px solid #28a745");
          calculateButton.style("border-radius", "6px");
          calculateButton.style("cursor", "pointer");
          calculateButton.style("font-weight", "bold");
          calculateButton.mousePressed(calculateSVD);
          calculateButton.position(cnv.position().x + 370, cnv.position().y + 15);

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

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
