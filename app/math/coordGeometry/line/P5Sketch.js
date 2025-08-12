"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";

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
        /*contains the class and the checkClick function*/

        function Scale(scaleParams, drawGrid = false) {
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } =
            scaleParams;
          const [posX, posY] = position;

          P.push();
          P.stroke(200);
          P.strokeWeight(5);
          P.line(posX - scaleLenX[0], posY, posX + scaleLenX[1], posY);
          P.line(posX, posY - scaleLenY[0], posX, posY + scaleLenY[1]);
          P.pop();

          // Draw translucent grid if enabled
          if (drawGrid) {
            P.push();
            P.stroke(255, 255, 255, 50); // White with low alpha for translucency
            P.strokeWeight(1);

            // Vertical grid lines (parallel to y-axis)
            let gridSpacingX =
              (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
            for (let i = 1; i <= Math.floor((xVal[1] - origin) / div[0]); i++) {
              let x = posX + i * gridSpacingX;
              P.line(x, posY - scaleLenY[0], x, posY + scaleLenY[1]);
            }
            gridSpacingX = (scaleLenX[0] - 20) / ((origin - xVal[0]) / div[0]);
            for (let i = 1; i <= Math.floor((origin - xVal[0]) / div[0]); i++) {
              let x = posX - i * gridSpacingX;
              P.line(x, posY - scaleLenY[0], x, posY + scaleLenY[1]);
            }

            // Horizontal grid lines (parallel to x-axis)
            let gridSpacingY = scaleLenY[0] / ((yVal[1] - origin) / div[1]);
            for (let i = 1; i <= Math.floor((yVal[1] - origin) / div[1]); i++) {
              let y = posY + i * gridSpacingY;
              P.line(posX - scaleLenX[0], y, posX + scaleLenX[1], y);
            }
            gridSpacingY = scaleLenY[1] / ((origin - yVal[0]) / div[1]);
            for (let i = 1; i <= Math.floor((origin - yVal[0]) / div[1]); i++) {
              let y = posY - i * gridSpacingY;
              P.line(posX - scaleLenX[0], y, posX + scaleLenX[1], y);
            }

            P.pop();
          }

          P.push();
          P.noStroke();
          P.fill(200);
          P.textSize(10);
          P.textAlign(P.CENTER, P.TOP);
          P.text(origin, posX - 20, posY + 20);

          // positive x-axis
          let n = origin + div[0];
          let q = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          for (
            let i = origin;
            i <= Math.floor((xVal[1] - origin) / div[0]);
            i++
          ) {
            P.text(n, posX + i * q + q, posY + 20);
            n += div[0];
          }

          // negative x-axis
          n = origin - div[0];
          q = (scaleLenX[0] - 20) / ((origin - xVal[0]) / div[0]);
          for (
            let i = origin;
            i <= Math.floor((origin - xVal[0]) / div[0]);
            i++
          ) {
            P.text(n, posX - i * q - q, posY + 20);
            n -= div[0];
          }

          //negative y-axis
          n = origin - div[1];
          q = scaleLenY[0] / ((yVal[1] - origin) / div[0]);
          for (
            let i = origin;
            i <= Math.floor((yVal[1] - origin) / div[0]);
            i++
          ) {
            P.text(n, posY - 20, posX + i * q + q);
            n -= div[0];
          }

          //positive y-axis
          n = origin + div[1];
          q = scaleLenY[0] / ((origin - yVal[0]) / div[0]);
          for (
            let i = origin;
            i <= Math.floor((origin - yVal[0]) / div[0]);
            i++
          ) {
            P.text(n, posY - 20, posX - i * q - q);
            n += div[0];
          }

          P.pop();
        }

        function plotPoints(
          coordinates,
          scaleParams,
          plotType = "line", // "line", "points", or "both"
          color = [255, 255, 255, 255], // [r, g, b, a] color array
          strokeW = 2,
          pointSize = 4
        ) {
          if (coordinates.length === 0) return;

          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } =
            scaleParams;
          const [posX, posY] = position;

          P.push();

          // Use the same spacing logic as the Scale function
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          // Convert coordinates to screen positions
          let screenPoints = [];
          for (let i = 0; i < coordinates.length; i++) {
            let x = posX + ((coordinates[i][0] - origin) / div[0]) * xSpacing;
            let y = posY - ((coordinates[i][1] - origin) / div[1]) * ySpacing; // Negative for proper y-axis orientation
            screenPoints.push([x, y]);
          }

          // Draw lines between points
          if (plotType === "line" || plotType === "both") {
            P.stroke(color[0], color[1], color[2], color[3]);
            P.strokeWeight(strokeW);
            P.noFill();

            for (let i = 0; i < screenPoints.length - 1; i++) {
              P.line(
                screenPoints[i][0],
                screenPoints[i][1],
                screenPoints[i + 1][0],
                screenPoints[i + 1][1]
              );
            }
          }

          // Draw points
          if (plotType === "points" || plotType === "both") {
            P.noStroke();
            P.fill(color[0], color[1], color[2], color[3]);
            for (let i = 0; i < screenPoints.length; i++) {
              P.circle(screenPoints[i][0], screenPoints[i][1], pointSize);
            }
          }

          P.pop();
        }

        // Line equation functions
        function getLineCoordinates(A, B, C, xRange) {
          // General line equation: Ax + By + C = 0
          // Rearranged: By = -Ax - C => y = (-A/B)x - C/B
          let points = [];
          let [xStart, xEnd] = xRange;

          if (B === 0) {
            // Vertical line: x = -C/A
            if (A !== 0) {
              let x = -C / A;
              points.push([x, xStart]);
              points.push([x, xEnd]);
            }
          } else {
            // Non-vertical line
            let slope = -A / B;
            let yIntercept = -C / B;

            let y1 = slope * xStart + yIntercept;
            let y2 = slope * xEnd + yIntercept;

            points.push([xStart, y1]);
            points.push([xEnd, y2]);
          }

          return points;
        }

        function getLineInfo(A, B, C) {
          if (A === 0 && B === 0) {
            return { valid: false, message: "Invalid line (A = 0 and B = 0)" };
          }

          let slope = null;
          let yIntercept = null;
          let xIntercept = null;
          let angle = null;
          let isVertical = B === 0;
          let isHorizontal = A === 0;

          if (!isVertical) {
            slope = -A / B;
            yIntercept = -C / B;
            angle = Math.atan(slope) * (180 / Math.PI);
          }

          if (!isHorizontal) {
            xIntercept = -C / A;
          }

          // Distance from origin
          let distanceFromOrigin = Math.abs(C) / Math.sqrt(A * A + B * B);

          // Normal vector
          let normal = [A, B];
          let normalLength = Math.sqrt(A * A + B * B);
          let unitNormal = [A / normalLength, B / normalLength];

          return {
            valid: true,
            slope: slope,
            yIntercept: yIntercept,
            xIntercept: xIntercept,
            angle: angle,
            isVertical: isVertical,
            isHorizontal: isHorizontal,
            distanceFromOrigin: distanceFromOrigin,
            normal: normal,
            unitNormal: unitNormal,
          };
        }

        function getPerpendicularLine(A, B, C, pointX, pointY) {
          // Perpendicular line through point (pointX, pointY)
          // If original line is Ax + By + C = 0, perpendicular line is Bx - Ay + D = 0
          // where D is calculated to pass through the given point
          let D = -B * pointX + A * pointY;
          return { A: B, B: -A, C: D };
        }

        function getParallelLine(A, B, C, pointX, pointY) {
          // Parallel line through point (pointX, pointY)
          // Same A and B coefficients, calculate new C
          let newC = -A * pointX - B * pointY;
          return { A: A, B: B, C: newC };
        }

        let linePoints = [];
        let lineCoeffs = { A: 1, B: -1, C: 0 }; // Default: x - y = 0 (y = x)
        let showPerpendicular = false;
        let showParallel = false;
        let testPoint = [2, 1]; // Point for perpendicular/parallel lines

        const scaleParameters = {
          position: [0, 0],
          scaleLenX: [500, 500],
          scaleLenY: [250, 250],
          origin: 0,
          xVal: [-10, 10],
          yVal: [-5, 5],
          div: [1, 1],
        };

        P.setup = () => {
          P.createCanvas(1000, 500);
          scaleParameters.scaleLenX = [P.width / 2, P.width / 2];
          scaleParameters.scaleLenY = [P.height / 2, P.height / 2];
          P.noStroke();
          linePoints = getLineCoordinates(
            lineCoeffs.A,
            lineCoeffs.B,
            lineCoeffs.C,
            [scaleParameters.xVal[0], scaleParameters.xVal[1]]
          );
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(80);

          // Handle keyboard input for coefficient changes (continuous)
          if (P.keyIsPressed) {
            let changed = false;

            // A coefficient
            if (P.key === "q") {
              lineCoeffs.A += 0.1;
              changed = true;
            }
            if (P.key === "a") {
              lineCoeffs.A -= 0.1;
              changed = true;
            }

            // B coefficient
            if (P.key === "w") {
              lineCoeffs.B += 0.1;
              changed = true;
            }
            if (P.key === "s") {
              lineCoeffs.B -= 0.1;
              changed = true;
            }

            // C coefficient
            if (P.key === "e") {
              lineCoeffs.C += 0.1;
              changed = true;
            }
            if (P.key === "d") {
              lineCoeffs.C -= 0.1;
              changed = true;
            }

            // Test point coordinates
            if (P.key === "r") {
              testPoint[0] += 0.1;
              changed = true;
            }
            if (P.key === "f") {
              testPoint[0] -= 0.1;
              changed = true;
            }
            if (P.key === "t") {
              testPoint[1] += 0.1;
              changed = true;
            }
            if (P.key === "g") {
              testPoint[1] -= 0.1;
              changed = true;
            }

            if (changed) {
              linePoints = getLineCoordinates(
                lineCoeffs.A,
                lineCoeffs.B,
                lineCoeffs.C,
                [scaleParameters.xVal[0], scaleParameters.xVal[1]]
              );
            }
          }

          // Handle single key presses for toggles
          P.keyPressed = () => {
            // Toggle perpendicular line
            if (P.key === "p" || P.key === "P") {
              showPerpendicular = !showPerpendicular;
            }

            // Toggle parallel line
            if (P.key === "l" || P.key === "L") {
              showParallel = !showParallel;
            }

            // Reset
            if (P.key === " ") {
              lineCoeffs = { A: 1, B: -1, C: 0 };
              testPoint = [2, 1];
              showPerpendicular = false;
              showParallel = false;
              linePoints = getLineCoordinates(
                lineCoeffs.A,
                lineCoeffs.B,
                lineCoeffs.C,
                [scaleParameters.xVal[0], scaleParameters.xVal[1]]
              );
            }
          };

          P.translate(P.width / 2, P.height / 2);
          Scale(scaleParameters, true);

          // Draw the main line
          if (linePoints.length > 0) {
            plotPoints(
              linePoints,
              scaleParameters,
              "line",
              [100, 255, 100, 255],
              3,
              4
            );
          }

          // Draw perpendicular line if enabled
          if (showPerpendicular) {
            let perpLine = getPerpendicularLine(
              lineCoeffs.A,
              lineCoeffs.B,
              lineCoeffs.C,
              testPoint[0],
              testPoint[1]
            );
            let perpPoints = getLineCoordinates(
              perpLine.A,
              perpLine.B,
              perpLine.C,
              [scaleParameters.xVal[0], scaleParameters.xVal[1]]
            );
            plotPoints(
              perpPoints,
              scaleParameters,
              "line",
              [255, 100, 100, 255],
              2,
              4
            );
          }

          // Draw parallel line if enabled
          if (showParallel) {
            let parallelLine = getParallelLine(
              lineCoeffs.A,
              lineCoeffs.B,
              lineCoeffs.C,
              testPoint[0],
              testPoint[1]
            );
            let parallelPoints = getLineCoordinates(
              parallelLine.A,
              parallelLine.B,
              parallelLine.C,
              [scaleParameters.xVal[0], scaleParameters.xVal[1]]
            );
            plotPoints(
              parallelPoints,
              scaleParameters,
              "line",
              [100, 100, 255, 255],
              2,
              4
            );
          }

          // Draw test point
          P.push();
          let xSpacing =
            (scaleParameters.scaleLenX[1] - 20) /
            ((scaleParameters.xVal[1] - scaleParameters.origin) /
              scaleParameters.div[0]);
          let ySpacing =
            scaleParameters.scaleLenY[0] /
            ((scaleParameters.yVal[1] - scaleParameters.origin) /
              scaleParameters.div[1]);

          let testPointScreen = [
            ((testPoint[0] - scaleParameters.origin) / scaleParameters.div[0]) *
              xSpacing,
            -(
              (testPoint[1] - scaleParameters.origin) /
              scaleParameters.div[1]
            ) * ySpacing,
          ];

          P.fill(255, 255, 100);
          P.noStroke();
          P.circle(testPointScreen[0], testPointScreen[1], 8);
          P.pop();

          // Display information panel
          P.push();
          P.translate(-P.width / 2, -P.height / 2);
          P.fill(0, 0, 0, 180);
          P.noStroke();
          P.rect(5, 5, 280, 230);

          P.fill(255, 255, 255);
          P.textAlign(P.LEFT, P.TOP);
          P.textSize(16);
          P.textStyle(P.BOLD);
          P.text("Interactive Line Equation:", 20, 25);

          P.textStyle(P.NORMAL);
          P.textSize(14);
          P.text(`Ax + By + C = 0`, 20, 50);

          // Current coefficients
          P.fill(255, 255, 100);
          P.text(
            `A = ${lineCoeffs.A.toFixed(2)}\t\t B = ${lineCoeffs.B.toFixed(
              2
            )}\t\t C = ${lineCoeffs.C.toFixed(2)}`,
            20,
            75
          );

          // Test point
          P.fill(255, 255, 100);
          P.text(
            `Test Point: (${testPoint[0].toFixed(2)}, ${testPoint[1].toFixed(
              2
            )})`,
            20,
            100
          );

          // Line information
          let info = getLineInfo(lineCoeffs.A, lineCoeffs.B, lineCoeffs.C);

          if (info.valid) {
            P.fill(100, 255, 100);
            P.text("Line Properties:", 20, 135);
            P.fill(255, 255, 255);

            if (info.isVertical) {
              P.text(
                `Vertical line: x = ${info.xIntercept.toFixed(2)}`,
                20,
                155
              );
            } else if (info.isHorizontal) {
              P.text(
                `Horizontal line: y = ${info.yIntercept.toFixed(2)}`,
                20,
                155
              );
            } else {
              P.text(
                `Slope: ${info.slope.toFixed(3)}\t\tAngle: ${info.angle.toFixed(
                  1
                )}°`,
                20,
                155
              );
              P.text(
                `Y-intercept: ${info.yIntercept.toFixed(
                  2
                )}\t\tX-intercept: ${info.xIntercept.toFixed(2)}\t`,
                20,
                175
              );
            }

            P.text(
              `Distance from origin: ${info.distanceFromOrigin.toFixed(3)}`,
              20,
              195
            );

            // // Show which lines are displayed
            // P.fill(100, 255, 100);
            // P.text("Green: Main line", 20, 290);
            // if (showPerpendicular) {
            //   P.fill(255, 100, 100);
            //   P.text("Red: Perpendicular line", 20, 305);
            // }
            // if (showParallel) {
            //   P.fill(100, 100, 255);
            //   P.text("Blue: Parallel line", 20, 320);
            // }
            // P.fill(255, 255, 100);
            // P.text("Yellow: Test point", 20, 335);
          } else {
            P.fill(255, 100, 100);
            P.text(info.message, 20, 165);
          }

          // Controls
          P.fill(0, 0, 0, 180);
          P.noStroke();
          P.rect(P.width - 320, P.height - 120, 300, 100);

          P.fill(200, 200, 255);
          P.text("Controls:", P.width - 315, P.height - 115);
          P.fill(255, 255, 255);
          P.textSize(12);
          P.text(
            "Q/A: Change 'A'    W/S: Change 'B'",
            P.width - 315,
            P.height - 100
          );
          P.text(
            "E/D: Change 'C'    R/F: Test point X",
            P.width - 315,
            P.height - 85
          );
          P.text(
            "T/G: Test point Y  P: Toggle perpendicular",
            P.width - 315,
            P.height - 70
          );
          P.text(
            "L: Toggle parallel  SPACE: Reset",
            P.width - 315,
            P.height - 55
          );

          P.pop();
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      return () => {
        myP5.remove(); // Clean up on unmount
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
