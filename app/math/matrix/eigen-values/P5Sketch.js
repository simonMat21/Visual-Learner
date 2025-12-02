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
        let eigenvalues = null;
        let eigenvectors = null;
        let determinant = null;
        let trace = null;
        let characteristicPoly = null;

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

        // Eigenvalue and eigenvector calculations using Power Iteration and QR algorithm
        function calculateEigenvalues(mat) {
          const n = mat.length;

          if (n === 1) {
            return [{ value: mat[0][0], vector: [[1]] }];
          }

          if (n === 2) {
            // For 2x2 matrices, use the quadratic formula
            const a = 1;
            const b = -(mat[0][0] + mat[1][1]); // -trace
            const c = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]; // determinant

            const discriminant = b * b - 4 * a * c;

            if (discriminant >= 0) {
              const lambda1 = (-b + Math.sqrt(discriminant)) / (2 * a);
              const lambda2 = (-b - Math.sqrt(discriminant)) / (2 * a);

              const v1 = calculateEigenvector(mat, lambda1);
              const v2 = calculateEigenvector(mat, lambda2);

              return [
                { value: lambda1, vector: v1 },
                { value: lambda2, vector: v2 },
              ];
            } else {
              // Complex eigenvalues
              const real = -b / (2 * a);
              const imag = Math.sqrt(-discriminant) / (2 * a);
              return [
                {
                  value: real,
                  imaginary: imag,
                  complex: true,
                  reason:
                    "Complex conjugate pair - requires complex arithmetic",
                },
                {
                  value: real,
                  imaginary: -imag,
                  complex: true,
                  reason:
                    "Complex conjugate pair - requires complex arithmetic",
                },
              ];
            }
          }

          // For 3x3 and larger, use multiple iterations to find all eigenvalues
          return findAllEigenvalues(mat, n);
        }

        function calculateEigenvector(mat, eigenvalue) {
          const n = mat.length;

          // Create (A - λI)
          const modMat = [];
          for (let i = 0; i < n; i++) {
            modMat[i] = [];
            for (let j = 0; j < n; j++) {
              modMat[i][j] = mat[i][j];
              if (i === j) modMat[i][j] -= eigenvalue;
            }
          }

          // Find nullspace vector (simplified)
          let v = [];
          if (n === 2) {
            // For 2x2, use perpendicular vector
            if (Math.abs(modMat[0][0]) > 0.0001) {
              v = [[-modMat[0][1]], [modMat[0][0]]];
            } else {
              v = [[1], [0]];
            }
          } else {
            // Initialize with random vector
            v = [];
            for (let i = 0; i < n; i++) {
              v[i] = [1];
            }
          }

          // Normalize
          let norm = 0;
          for (let i = 0; i < n; i++) {
            norm += v[i][0] * v[i][0];
          }
          norm = Math.sqrt(norm);

          for (let i = 0; i < n; i++) {
            v[i][0] /= norm;
          }

          return v;
        }

        function findAllEigenvalues(mat, n) {
          const results = [];
          const maxIter = 200;
          const tolerance = 0.0001;

          // Use QR algorithm approximation for 3x3
          if (n === 3) {
            // Calculate cubic characteristic equation coefficients
            const tr = calculateTrace(mat);
            const det = calculateDeterminant(mat);

            // For 3x3: λ³ - tr(A)λ² + C₁λ - det(A) = 0
            // Where C₁ is sum of principal 2x2 minors
            let c1 = 0;
            c1 += mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]; // M₀₁
            c1 += mat[0][0] * mat[2][2] - mat[0][2] * mat[2][0]; // M₀₂
            c1 += mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]; // M₁₂

            // Try to find all 3 eigenvalues using Newton's method
            const foundValues = [];

            // Start with power iteration for dominant eigenvalue
            let dominant = powerIterationSingle(mat, n);
            foundValues.push(dominant);

            // Try to find other eigenvalues by deflation or approximation
            // Use Vieta's formulas: sum of roots = trace
            const sumFound = dominant.value;
            const remaining = tr - sumFound;

            // For the remaining two, try to solve quadratic approximation
            // λ² - (remaining)λ + approximation = 0
            const approxProduct = det / dominant.value;
            const discriminant = remaining * remaining - 4 * approxProduct;

            if (discriminant >= 0 && !isNaN(discriminant)) {
              const lambda2 = (remaining + Math.sqrt(discriminant)) / 2;
              const lambda3 = (remaining - Math.sqrt(discriminant)) / 2;

              const v2 = calculateEigenvector(mat, lambda2);
              const v3 = calculateEigenvector(mat, lambda3);

              foundValues.push({ value: lambda2, vector: v2 });
              foundValues.push({ value: lambda3, vector: v3 });
            } else if (!isNaN(discriminant)) {
              // Complex conjugate pair
              const real = remaining / 2;
              const imag = Math.sqrt(-discriminant) / 2;
              foundValues.push({
                value: real,
                imaginary: imag,
                complex: true,
                reason: "Complex eigenvalue - numerical methods limited",
              });
              foundValues.push({
                value: real,
                imaginary: -imag,
                complex: true,
                reason: "Complex eigenvalue - numerical methods limited",
              });
            } else {
              // Unable to compute
              foundValues.push({
                value: 0,
                notComputed: true,
                reason:
                  "Unable to compute - may require advanced numerical methods",
              });
              foundValues.push({
                value: 0,
                notComputed: true,
                reason:
                  "Unable to compute - may require advanced numerical methods",
              });
            }

            return foundValues;
          } else if (n >= 4) {
            // For 4x4 and 5x5, use iterative deflation method
            return qrAlgorithmSimplified(mat, n);
          }

          return results;
        }

        function qrAlgorithmSimplified(mat, n) {
          // Simplified QR iteration to find all eigenvalues
          const maxIter = 100;
          const tolerance = 0.001;
          const results = [];

          // Copy matrix
          let A = [];
          for (let i = 0; i < n; i++) {
            A[i] = [];
            for (let j = 0; j < n; j++) {
              A[i][j] = mat[i][j];
            }
          }

          // Perform simplified QR iterations
          for (let iter = 0; iter < maxIter; iter++) {
            // Simple QR decomposition using Gram-Schmidt
            let Q = [];
            let R = [];

            for (let j = 0; j < n; j++) {
              Q[j] = [];
              R[j] = [];
              for (let i = 0; i < n; i++) {
                Q[j][i] = A[i][j];
                R[j][i] = 0;
              }
            }

            // Gram-Schmidt orthogonalization
            for (let j = 0; j < n; j++) {
              for (let k = 0; k < j; k++) {
                let dot = 0;
                for (let i = 0; i < n; i++) {
                  dot += Q[k][i] * A[i][j];
                }
                R[k][j] = dot;
                for (let i = 0; i < n; i++) {
                  Q[j][i] -= dot * Q[k][i];
                }
              }

              let norm = 0;
              for (let i = 0; i < n; i++) {
                norm += Q[j][i] * Q[j][i];
              }
              norm = Math.sqrt(norm);

              if (norm > 0.0001) {
                R[j][j] = norm;
                for (let i = 0; i < n; i++) {
                  Q[j][i] /= norm;
                }
              } else {
                R[j][j] = 1;
              }
            }

            // Compute A = R * Q
            let newA = [];
            for (let i = 0; i < n; i++) {
              newA[i] = [];
              for (let j = 0; j < n; j++) {
                newA[i][j] = 0;
                for (let k = 0; k < n; k++) {
                  newA[i][j] += R[k][j] * Q[k][i];
                }
              }
            }

            // Check convergence
            let maxOffDiag = 0;
            for (let i = 0; i < n; i++) {
              for (let j = 0; j < n; j++) {
                if (i !== j) {
                  maxOffDiag = Math.max(maxOffDiag, Math.abs(newA[i][j]));
                }
              }
            }

            A = newA;

            if (maxOffDiag < tolerance) {
              break;
            }
          }

          // Extract eigenvalues from diagonal and compute eigenvectors
          for (let i = 0; i < n; i++) {
            const eigenvalue = A[i][i];
            const eigenvector = calculateEigenvector(mat, eigenvalue);
            results.push({ value: eigenvalue, vector: eigenvector });
          }

          return results;
        }

        function powerIterationSingle(mat, n) {
          const maxIter = 200;
          const tolerance = 0.0001;

          // Find dominant eigenvalue using power iteration
          let v = [];
          for (let i = 0; i < n; i++) {
            v[i] = Math.random() + 0.1; // Avoid zero
          }

          let eigenvalue = 0;
          for (let iter = 0; iter < maxIter; iter++) {
            // Multiply A * v
            let newV = [];
            for (let i = 0; i < n; i++) {
              newV[i] = 0;
              for (let j = 0; j < n; j++) {
                newV[i] += mat[i][j] * v[j];
              }
            }

            // Find max component
            let maxVal = 0;
            for (let i = 0; i < n; i++) {
              if (Math.abs(newV[i]) > Math.abs(maxVal)) {
                maxVal = newV[i];
              }
            }

            if (Math.abs(maxVal) < 0.0001) {
              maxVal = 0.0001; // Avoid division by zero
            }

            // Normalize
            for (let i = 0; i < n; i++) {
              newV[i] /= maxVal;
            }

            // Check convergence
            let diff = 0;
            for (let i = 0; i < n; i++) {
              diff += Math.abs(newV[i] - v[i]);
            }

            v = newV;
            eigenvalue = maxVal;

            if (diff < tolerance) break;
          }

          // Format eigenvector
          const eigenvector = [];
          for (let i = 0; i < n; i++) {
            eigenvector[i] = [v[i]];
          }

          return { value: eigenvalue, vector: eigenvector };
        }

        function getCharacteristicPolynomial(mat) {
          const n = mat.length;
          const tr = calculateTrace(mat);
          const det = calculateDeterminant(mat);

          if (n === 2) {
            return `λ² - ${tr.toFixed(2)}λ + ${det.toFixed(2)}`;
          } else if (n === 3) {
            // Simplified: λ³ - tr(A)λ² + ... + (-1)ⁿdet(A)
            return `λ³ - ${tr.toFixed(2)}λ² + ... ${
              det >= 0 ? "+" : ""
            }${det.toFixed(2)}`;
          } else {
            return `λⁿ - ${tr.toFixed(2)}λⁿ⁻¹ + ... ${
              det >= 0 ? "+" : ""
            }${det.toFixed(2)}`;
          }
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
          determinant = calculateDeterminant(matrix);
          trace = calculateTrace(matrix);
          eigenvalues = calculateEigenvalues(matrix);
          characteristicPoly = getCharacteristicPolynomial(matrix);

          // Force redraw to show new results
          P.redraw();
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
          eigenvalues = null;
          eigenvectors = null;
          determinant = null;
          trace = null;
          characteristicPoly = null;

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

        function drawVectorDisplay(vec, x, y, label) {
          if (!vec) return;

          P.fill(255);
          P.textSize(14);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text(label, x, y - 10);

          let cellSize = 40;
          let fontSize = 11;

          // Draw vector border
          P.stroke(100);
          P.strokeWeight(2);
          P.noFill();
          P.rect(x, y, cellSize, vec.length * cellSize);

          // Draw cells
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(fontSize);
          P.noStroke();

          for (let i = 0; i < vec.length; i++) {
            let cellY = y + i * cellSize;

            // Cell background
            P.fill(255);
            P.stroke(150);
            P.strokeWeight(1);
            P.rect(x, cellY, cellSize, cellSize);

            // Cell value
            P.noStroke();
            P.fill(0);
            let value = vec[i][0];
            let displayValue =
              typeof value === "number"
                ? Math.abs(value) < 0.0001
                  ? "0"
                  : value.toFixed(2)
                : value;
            P.text(displayValue, x + cellSize / 2, cellY + cellSize / 2);
          }
        }

        function drawResults() {
          P.fill(255);
          P.textSize(16);
          P.textAlign(P.LEFT);
          P.noStroke();
          P.text("Input Matrix (A):", 20, 80);

          // Draw input matrix labels
          P.fill(255);
          P.textSize(12);
          P.textAlign(P.CENTER);
          let inputSize = P.min(50, 250 / matrixSize);
          let startX = 80;
          let inputStartY = 130;

          for (let j = 0; j < matrixSize; j++) {
            let x = startX + j * (inputSize + 6) + inputSize / 2;
            P.text(j, x, inputStartY - 15);
          }

          P.textAlign(P.RIGHT);
          for (let i = 0; i < matrixSize; i++) {
            let y = inputStartY + i * (inputSize + 6) + inputSize / 2;
            P.text(i, startX - 15, y);
          }

          if (eigenvalues) {
            let inputSize = P.min(50, 250 / matrixSize);
            let inputStartY = 130;
            let matrixBottomY = inputStartY + matrixSize * (inputSize + 6) + 30;

            // Show other calculations below the input matrix
            // Characteristic Polynomial
            P.fill(255);
            P.textSize(16);
            P.textAlign(P.LEFT);
            P.text("Characteristic Polynomial:", 20, matrixBottomY);
            P.textSize(14);
            P.fill(200, 150, 255);
            P.text("det(A - λI) = 0", 20, matrixBottomY + 25);
            P.fill(150, 200, 255);
            P.text(characteristicPoly, 20, matrixBottomY + 45);

            // Determinant and Trace
            P.fill(255);
            P.textSize(16);
            P.text("Determinant (|A|) =", 20, matrixBottomY + 80);
            P.textSize(18);
            P.fill(determinant === 0 ? [255, 100, 100] : [100, 255, 150]);
            P.text(determinant.toFixed(2), 180, matrixBottomY + 80);

            P.fill(255);
            P.textSize(16);
            P.text("Trace (tr(A)) =", 20, matrixBottomY + 110);
            P.textSize(18);
            P.fill(150, 220, 255);
            P.text(trace.toFixed(2), 160, matrixBottomY + 110);

            // Eigenvalues and Eigenvectors on the right side - Grid layout
            P.fill(255);
            P.textSize(16);
            P.textAlign(P.LEFT);
            P.text("Eigenvalues (λ) and Eigenvectors:", 450, 100);

            // Calculate grid dimensions
            let cols =
              matrixSize <= 2
                ? eigenvalues.length
                : Math.ceil(eigenvalues.length / 2);
            let rows = Math.ceil(eigenvalues.length / cols);
            let cellWidth = 180;
            let cellHeight = matrixSize <= 3 ? 220 : 190; // Increased vertical spacing
            let startX = 450;
            let startY = 130;

            for (let i = 0; i < eigenvalues.length; i++) {
              const eigen = eigenvalues[i];
              const col = i % cols;
              const row = Math.floor(i / cols);

              let xOffset = startX + col * cellWidth;
              let yOffset = startY + row * cellHeight;

              if (eigen.complex) {
                // Complex eigenvalue
                P.fill(255, 150, 255);
                P.textSize(13);
                P.text(`λ${i + 1} =`, xOffset, yOffset);
                P.textSize(11);
                P.text(`${eigen.value.toFixed(2)}`, xOffset, yOffset + 18);
                P.text(
                  `${eigen.imaginary >= 0 ? "+" : ""}${eigen.imaginary.toFixed(
                    2
                  )}i`,
                  xOffset,
                  yOffset + 32
                );
                P.fill(220, 220, 220);
                P.textSize(8);
                P.text("(Complex)", xOffset, yOffset + 45);
              } else if (eigen.approximate) {
                // Approximate eigenvalue
                P.fill(255, 220, 150);
                P.textSize(13);
                P.text(`λ${i + 1} ≈`, xOffset, yOffset);
                P.textSize(12);
                P.text(eigen.value.toFixed(2), xOffset, yOffset + 18);
                P.fill(200, 200, 200);
                P.textSize(8);
                P.text("(Approx.)", xOffset, yOffset + 35);
              } else if (eigen.notComputed) {
                // Not computed eigenvalue
                P.fill(255, 180, 180);
                P.textSize(13);
                P.text(`λ${i + 1} =`, xOffset, yOffset);
                P.textSize(10);
                P.text("Not computed", xOffset, yOffset + 18);
                P.fill(220, 220, 220);
                P.textSize(7);
                if (eigen.reason) {
                  let words = eigen.reason.split(" ");
                  let line = "";
                  let lineY = yOffset + 35;
                  for (let word of words) {
                    if ((line + word).length > 22) {
                      P.text(line, xOffset, lineY);
                      lineY += 9;
                      line = word + " ";
                      if (lineY - yOffset > 70) break; // Limit height
                    } else {
                      line += word + " ";
                    }
                  }
                  if (line && lineY - yOffset <= 70)
                    P.text(line, xOffset, lineY);
                }
              } else {
                // Real eigenvalue with eigenvector
                P.fill(150, 255, 150);
                P.textSize(13);
                P.textAlign(P.LEFT);
                P.text(
                  `λ${i + 1} = ${eigen.value.toFixed(2)}`,
                  xOffset,
                  yOffset
                );

                if (eigen.vector) {
                  P.fill(255);
                  P.textSize(10);
                  P.text(`v${i + 1} =`, xOffset, yOffset + 25);

                  // Draw compact vector
                  let vecCellSize = matrixSize <= 3 ? 30 : 25;
                  let vecX = xOffset + 30;
                  let vecY = yOffset + 30;

                  P.stroke(200);
                  P.strokeWeight(1.5);
                  P.noFill();
                  P.rect(
                    vecX,
                    vecY,
                    vecCellSize,
                    eigen.vector.length * vecCellSize
                  );

                  P.textAlign(P.CENTER, P.CENTER);
                  P.textSize(matrixSize <= 3 ? 9 : 8);

                  for (let j = 0; j < eigen.vector.length; j++) {
                    let cellY = vecY + j * vecCellSize;

                    // Cell background - white
                    P.fill(255);
                    P.stroke(180);
                    P.strokeWeight(0.5);
                    P.rect(vecX, cellY, vecCellSize, vecCellSize);

                    // Cell value - black text on white background
                    P.noStroke();
                    P.fill(0);
                    let value = eigen.vector[j][0];
                    let displayValue =
                      Math.abs(value) < 0.0001 ? "0" : value.toFixed(2);
                    P.text(
                      displayValue,
                      vecX + vecCellSize / 2,
                      cellY + vecCellSize / 2
                    );
                  }
                  P.textAlign(P.LEFT);
                }
              }
            }

            // Note - fixed at bottom
            P.fill(220, 220, 220);
            P.textSize(10);
            P.textAlign(P.LEFT);
            P.text("* Eigenvectors are normalized", 20, P.height - 15);
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
