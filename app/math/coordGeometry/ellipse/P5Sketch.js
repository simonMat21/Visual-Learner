"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";

export default function P5Sketch({ k1, k2, t }) {
  const sketchRef = useRef(null);
  // const addRef = useRef(add);
  // const animSpdRef = useRef(animSpd);
  // const actionExicutableRef = useRef(actionExicutable);
  const k1reff = useRef(k1);
  const k2reff = useRef(k2);
  const tref = useRef(t);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        /*contains the class and the checkClick function*/
        let taken = null;
        function checkClicked(points) {
          for (var p of points) {
            if (taken == p || taken == null) {
              // Adjust mouse coordinates to account for the translation
              let adjustedMouseX = P.mouseX - P.width / 2;
              let adjustedMouseY = P.mouseY - P.height / 2;

              let dis = Math.sqrt(
                (adjustedMouseX - p.x) ** 2 + (adjustedMouseY - p.y) ** 2
              );

              if (P.mouseIsPressed) {
                if (dis < p.clickableR) {
                  p.clicked = true;
                  taken = p;
                }
              } else {
                p.clicked = false;
                taken = null;
              }

              if (p.clicked) {
                p.setPos(adjustedMouseX, adjustedMouseY);
              }
            }
          }
        }

        class MovablePoint {
          constructor(
            x = P.random(width / 2),
            y = P.random(height / 2),
            r = 10
          ) {
            this.x = x;
            this.y = y;
            this.xp = x;
            this.yp = y;
            this.r = r;
            this.clickableR = this.r;
            this.clicked = false;
            this.color = [];
            this.q = 0;
          }

          show(color = [0, 0, 0], r = this.r) {
            this.color = color;
            this.r = r;
            P.noStroke();
            P.fill(color);
            P.circle(this.x, this.y, this.r * 2);
            let o = this.color.push(100);
          }

          showFade(r = this.r * 2, color = this.color.concat(100)) {
            this.clickableR = r;
            P.noStroke();
            P.fill(color);
            P.circle(this.x, this.y, r * 2);
          }

          getPos(x, y) {
            return [this.x, this.y];
          }

          setPos(x = this.x, y = this.y) {
            this.x = x;
            this.y = y;
          }
          setpPos(x = this.x, y = this.y) {
            this.xp = x;
            this.yp = y;
          }
          movealong(p) {
            if (!this.clicked) {
              this.setPos(p.x + (this.xp - p.xp), p.y + (this.yp - p.yp));
            }
          }
        }

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

        function drawVector(
          vectorData, // [[startX, startY], [endX, endY]] or [[startX, startY], [directionX, directionY], true]
          scaleParams,
          color = [255, 255, 0, 255], // [r, g, b] color array - default yellow
          strokeW = 2,
          arrowSize = 10,
          isDirection = false // if true, second array is direction vector, not end point
        ) {
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } =
            scaleParams;
          const [posX, posY] = position;

          P.push();

          // Use the same spacing logic as the Scale function
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          let startX = vectorData[0][0];
          let startY = vectorData[0][1];
          let endX, endY;

          if (isDirection) {
            // Second array is direction vector, add to start point
            endX = startX + vectorData[1][0];
            endY = startY + vectorData[1][1];
          } else {
            // Second array is end point
            endX = vectorData[1][0];
            endY = vectorData[1][1];
          }

          // Convert to screen coordinates
          let screenStartX = posX + ((startX - origin) / div[0]) * xSpacing;
          let screenStartY = posY - ((startY - origin) / div[1]) * ySpacing;
          let screenEndX = posX + ((endX - origin) / div[0]) * xSpacing;
          let screenEndY = posY - ((endY - origin) / div[1]) * ySpacing;

          P.stroke(color[0], color[1], color[2], color[3]);
          P.strokeWeight(strokeW);
          P.fill(color[0], color[1], color[2], color[3]);

          // Draw the main line of the vector
          P.line(screenStartX, screenStartY, screenEndX, screenEndY);

          // Calculate arrow head
          let angle = Math.atan2(
            screenEndY - screenStartY,
            screenEndX - screenStartX
          );
          let arrowLength = arrowSize;
          let arrowAngle = P.PI / 6; // 30 degrees

          // Calculate arrow head points
          let arrowX1 = screenEndX - arrowLength * Math.cos(angle - arrowAngle);
          let arrowY1 = screenEndY - arrowLength * Math.sin(angle - arrowAngle);
          let arrowX2 = screenEndX - arrowLength * Math.cos(angle + arrowAngle);
          let arrowY2 = screenEndY - arrowLength * Math.sin(angle + arrowAngle);

          // Draw arrow head as a triangle
          P.noStroke();
          P.triangle(
            screenEndX,
            screenEndY,
            arrowX1,
            arrowY1,
            arrowX2,
            arrowY2
          );

          P.pop();
        }

        function getMathPosition(screenX, screenY, scaleParams) {
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } =
            scaleParams;
          const [posX, posY] = position;

          // Use the same spacing logic as other functions
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          // Convert screen coordinates back to mathematical coordinates (inverse of getScreenPosition)
          let mathX = origin + ((screenX - posX) / xSpacing) * div[0];
          let mathY = origin - ((screenY - posY) / ySpacing) * div[1]; // Negative to match getScreenPosition

          return [mathX, mathY];
        }

        function makeFunction(equationStr) {
          // Whitelist of allowed Math functions
          const mathFuncs = [
            "abs",
            "acos",
            "acosh",
            "asin",
            "asinh",
            "atan",
            "atan2",
            "atanh",
            "cbrt",
            "ceil",
            "clz32",
            "cos",
            "cosh",
            "exp",
            "expm1",
            "floor",
            "fround",
            "hypot",
            "imul",
            "log",
            "log10",
            "log1p",
            "log2",
            "max",
            "min",
            "pow",
            "random",
            "round",
            "sign",
            "sin",
            "sinh",
            "sqrt",
            "tan",
            "tanh",
            "trunc",
          ];

          // Create a string like: const {sin, cos, log, ...} = Math;
          const mathScope = `const { ${mathFuncs.join(", ")} } = Math;`;

          // Construct a new function safely scoped to Math
          const fnBody = `
    "use strict";
    ${mathScope}
    return (${equationStr});
  `;

          try {
            const fn = new Function("x", fnBody);
            return fn;
          } catch (e) {
            throw new Error("Invalid equation: " + e.message);
          }
        }

        function plotPoints(
          coordinates,
          scaleParams,
          plotType = "line", // "line", "points", or "both"
          color = [255, 255, 255], // [r, g, b] color array
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
            P.stroke(color[0], color[1], color[2]);
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
            P.fill(color[0], color[1], color[2]);
            for (let i = 0; i < screenPoints.length; i++) {
              P.circle(screenPoints[i][0], screenPoints[i][1], pointSize);
            }
          }

          P.pop();
        }

        function getFunCordinates(func, [start, stop], div) {
          let points = [];
          for (let x = start; x <= stop; x += div) {
            let y = func(x);
            // Check for NaN and skip invalid points
            if (!isNaN(y) && isFinite(y)) {
              points.push([x, y]);
            }
          }
          return points;
        }

        // Circle equation: x² + y² = r²
        // Parametric form: x = r*cos(t), y = r*sin(t)
        function getCircleCoordinates(radius, steps = 100) {
          let points = [];
          for (let i = 0; i <= steps; i++) {
            let t = (i / steps) * 2 * Math.PI;
            let x = radius * Math.cos(t);
            let y = radius * Math.sin(t);
            points.push([x, y]);
          }
          return points;
        }

        // General circle equation: ax² + ay² + 2gx + 2fy + c = 0
        // Standard form: (x-h)² + (y-k)² = r²
        // Where h = -g/a, k = -f/a, r² = (g² + f² - ac)/a²
        function getGeneralCircleCoordinates(a, g, f, c, steps = 100) {
          // Check if it's a valid circle
          if (a === 0) return []; // Not a circle if a = 0

          // Convert to standard form
          let h = -g / a; // center x
          let k = -f / a; // center y
          let discriminant = g * g + f * f - a * c;

          if (discriminant <= 0) return []; // No real circle

          let radius = Math.sqrt(discriminant) / Math.abs(a);

          let points = [];
          for (let i = 0; i <= steps; i++) {
            let t = (i / steps) * 2 * Math.PI;
            let x = h + radius * Math.cos(t);
            let y = k + radius * Math.sin(t);
            points.push([x, y]);
          }
          return points;
        }

        function getCircleInfo(a, g, f, c) {
          if (a === 0) return { valid: false, message: "Not a circle (a = 0)" };

          let h = -g / a;
          let k = -f / a;
          let discriminant = g * g + f * f - a * c;

          if (discriminant <= 0) {
            return {
              valid: false,
              message: "No real circle (discriminant ≤ 0)",
            };
          }

          let radius = Math.sqrt(discriminant) / Math.abs(a);

          return {
            valid: true,
            center: [h, k],
            radius: radius,
            discriminant: discriminant,
          };
        }

        // General ellipse equation: Ax² + Cy² + Dx + Ey + F = 0
        // Standard form: (x-h)²/a² + (y-k)²/b² = 1
        // Where h = -D/(2A), k = -E/(2C), a² = (D²/(4A²) + E²/(4C²) - F)/A, b² = (D²/(4A²) + E²/(4C²) - F)/C
        function getGeneralEllipseCoordinates(A, C, D, E, F, steps = 100) {
          // Check if it's a valid ellipse
          if (A === 0 || C === 0) return []; // Not an ellipse if A = 0 or C = 0
          if (A === C) return []; // This would be a circle, not an ellipse

          // Convert to standard form
          let h = -D / (2 * A); // center x
          let k = -E / (2 * C); // center y

          // Calculate discriminant and semi-axes
          let discriminant = (D * D) / (4 * A * A) + (E * E) / (4 * C * C) - F;

          if (discriminant <= 0) return []; // No real ellipse

          let a_squared = discriminant / A;
          let b_squared = discriminant / C;

          if (a_squared <= 0 || b_squared <= 0) return []; // Invalid ellipse

          let a = Math.sqrt(Math.abs(a_squared));
          let b = Math.sqrt(Math.abs(b_squared));

          let points = [];
          for (let i = 0; i <= steps; i++) {
            let t = (i / steps) * 2 * Math.PI;
            let x = h + a * Math.cos(t);
            let y = k + b * Math.sin(t);
            points.push([x, y]);
          }
          return points;
        }

        function getEllipseInfo(A, C, D, E, F) {
          if (A === 0 || C === 0)
            return { valid: false, message: "Not an ellipse (A = 0 or C = 0)" };
          if (A === C)
            return {
              valid: false,
              message: "This is a circle (A = C), not an ellipse",
            };

          let h = -D / (2 * A);
          let k = -E / (2 * C);
          let discriminant = (D * D) / (4 * A * A) + (E * E) / (4 * C * C) - F;

          if (discriminant <= 0) {
            return {
              valid: false,
              message: "No real ellipse (discriminant ≤ 0)",
            };
          }

          let a_squared = discriminant / A;
          let b_squared = discriminant / C;

          if (a_squared <= 0 || b_squared <= 0) {
            return {
              valid: false,
              message: "Invalid ellipse (negative semi-axis)",
            };
          }

          let a = Math.sqrt(Math.abs(a_squared));
          let b = Math.sqrt(Math.abs(b_squared));

          // Determine major and minor axes
          let majorAxis = Math.max(a, b);
          let minorAxis = Math.min(a, b);
          let eccentricity = Math.sqrt(
            1 - (minorAxis * minorAxis) / (majorAxis * majorAxis)
          );

          return {
            valid: true,
            center: [h, k],
            semiMajorAxis: majorAxis,
            semiMinorAxis: minorAxis,
            a: a,
            b: b,
            eccentricity: eccentricity,
            discriminant: discriminant,
          };
        }

        let ellipsePoints = [];
        let ellipseCoeffs = { A: 1, C: 4, D: 0, E: 0, F: -4 }; // Default: x²/4 + y² = 1

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
          ellipsePoints = getGeneralEllipseCoordinates(
            ellipseCoeffs.A,
            ellipseCoeffs.C,
            ellipseCoeffs.D,
            ellipseCoeffs.E,
            ellipseCoeffs.F,
            100
          );
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(80);

          // Handle keyboard input for coefficient changes
          if (P.keyIsPressed) {
            let changed = false;

            // A coefficient
            if (P.key === "q") {
              ellipseCoeffs.A += 0.1;
              changed = true;
            }
            if (P.key === "a") {
              ellipseCoeffs.A -= 0.1;
              changed = true;
            }

            // C coefficient
            if (P.key === "w") {
              ellipseCoeffs.C += 0.1;
              changed = true;
            }
            if (P.key === "s") {
              ellipseCoeffs.C -= 0.1;
              changed = true;
            }

            // D coefficient
            if (P.key === "e") {
              ellipseCoeffs.D += 0.1;
              changed = true;
            }
            if (P.key === "d") {
              ellipseCoeffs.D -= 0.1;
              changed = true;
            }

            // E coefficient
            if (P.key === "r") {
              ellipseCoeffs.E += 0.1;
              changed = true;
            }
            if (P.key === "f") {
              ellipseCoeffs.E -= 0.1;
              changed = true;
            }

            // F coefficient
            if (P.key === "t") {
              ellipseCoeffs.F += 0.1;
              changed = true;
            }
            if (P.key === "g") {
              ellipseCoeffs.F -= 0.1;
              changed = true;
            }

            // Reset
            if (P.key === "Shift" || P.keyCode === P.SHIFT) {
              ellipseCoeffs = { A: 1, C: 4, D: 0, E: 0, F: -4 };
              changed = true;
            }

            if (changed) {
              ellipsePoints = getGeneralEllipseCoordinates(
                ellipseCoeffs.A,
                ellipseCoeffs.C,
                ellipseCoeffs.D,
                ellipseCoeffs.E,
                ellipseCoeffs.F,
                100
              );
            }
          }

          P.translate(P.width / 2, P.height / 2);
          Scale(scaleParameters, true);

          // Draw the ellipse if valid
          if (ellipsePoints.length > 0) {
            plotPoints(
              ellipsePoints,
              scaleParameters,
              "line",
              [100, 255, 100],
              3,
              4
            );

            // Draw center point and foci
            let info = getEllipseInfo(
              ellipseCoeffs.A,
              ellipseCoeffs.C,
              ellipseCoeffs.D,
              ellipseCoeffs.E,
              ellipseCoeffs.F
            );
            if (info.valid) {
              P.push();
              // Convert to screen coordinates
              let xSpacing =
                (scaleParameters.scaleLenX[1] - 20) /
                ((scaleParameters.xVal[1] - scaleParameters.origin) /
                  scaleParameters.div[0]);
              let ySpacing =
                scaleParameters.scaleLenY[0] /
                ((scaleParameters.yVal[1] - scaleParameters.origin) /
                  scaleParameters.div[1]);

              let centerScreen = [
                ((info.center[0] - scaleParameters.origin) /
                  scaleParameters.div[0]) *
                  xSpacing,
                -(
                  (info.center[1] - scaleParameters.origin) /
                  scaleParameters.div[1]
                ) * ySpacing,
              ];

              // Draw center
              P.fill(255, 100, 100);
              P.noStroke();
              P.circle(centerScreen[0], centerScreen[1], 8);

              // Draw foci
              let c = Math.sqrt(
                Math.abs(
                  info.semiMajorAxis * info.semiMajorAxis -
                    info.semiMinorAxis * info.semiMinorAxis
                )
              );
              let focus1, focus2;

              if (info.a > info.b) {
                // Major axis is horizontal
                focus1 = [info.center[0] + c, info.center[1]];
                focus2 = [info.center[0] - c, info.center[1]];
              } else {
                // Major axis is vertical
                focus1 = [info.center[0], info.center[1] + c];
                focus2 = [info.center[0], info.center[1] - c];
              }

              let focus1Screen = [
                ((focus1[0] - scaleParameters.origin) /
                  scaleParameters.div[0]) *
                  xSpacing,
                -(
                  (focus1[1] - scaleParameters.origin) /
                  scaleParameters.div[1]
                ) * ySpacing,
              ];
              let focus2Screen = [
                ((focus2[0] - scaleParameters.origin) /
                  scaleParameters.div[0]) *
                  xSpacing,
                -(
                  (focus2[1] - scaleParameters.origin) /
                  scaleParameters.div[1]
                ) * ySpacing,
              ];

              P.fill(255, 255, 100);
              P.circle(focus1Screen[0], focus1Screen[1], 6);
              P.circle(focus2Screen[0], focus2Screen[1], 6);
              P.pop();
            }
          }

          // Display information panel
          P.push();
          P.translate(-P.width / 2, -P.height / 2);
          P.fill(0, 0, 0, 180);
          P.noStroke();
          P.rect(15, 20, 400, 320);

          P.fill(255, 255, 255);
          P.textAlign(P.LEFT, P.TOP);
          P.textSize(16);
          P.textStyle(P.BOLD);
          P.text("Interactive Ellipse Equation:", 20, 25);

          P.textStyle(P.NORMAL);
          P.textSize(14);
          P.text(`Ax² + Cy² + Dx + Ey + F = 0`, 20, 50);

          // Current coefficients
          P.fill(255, 255, 100);
          P.text(`A = ${ellipseCoeffs.A.toFixed(2)}`, 20, 75);
          P.text(`C = ${ellipseCoeffs.C.toFixed(2)}`, 20, 95);
          P.text(`D = ${ellipseCoeffs.D.toFixed(2)}`, 20, 115);
          P.text(`E = ${ellipseCoeffs.E.toFixed(2)}`, 20, 135);
          P.text(`F = ${ellipseCoeffs.F.toFixed(2)}`, 20, 155);

          // Ellipse information
          let info = getEllipseInfo(
            ellipseCoeffs.A,
            ellipseCoeffs.C,
            ellipseCoeffs.D,
            ellipseCoeffs.E,
            ellipseCoeffs.F
          );

          if (info.valid) {
            P.fill(100, 255, 100);
            P.text("Ellipse Properties:", 20, 180);
            P.fill(255, 255, 255);
            P.text(
              `Center: (${info.center[0].toFixed(2)}, ${info.center[1].toFixed(
                2
              )})`,
              20,
              200
            );
            P.text(
              `Semi-major axis: ${info.semiMajorAxis.toFixed(2)}`,
              20,
              220
            );
            P.text(
              `Semi-minor axis: ${info.semiMinorAxis.toFixed(2)}`,
              20,
              240
            );
            P.text(`Eccentricity: ${info.eccentricity.toFixed(3)}`, 20, 260);
            P.fill(255, 100, 100);
            P.text("Red: Center", 20, 280);
            P.fill(255, 255, 100);
            P.text("Yellow: Foci", 20, 295);
          } else {
            P.fill(255, 100, 100);
            P.text(info.message, 20, 180);
          }

          // Controls
          P.fill(200, 200, 255);
          P.text("Controls:", 20, 320);
          P.fill(255, 255, 255);
          P.textSize(12);
          P.text("Q/A: Change 'A'    W/S: Change 'C'", 20, 335);
          P.text("E/D: Change 'D'    R/F: Change 'E'", 20, 350);
          P.text("T/G: Change 'F'    SHIFT: Reset", 20, 365);

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
