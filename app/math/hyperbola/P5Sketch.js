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

        // General hyperbola equation: Ax² - Cy² + Dx + Ey + F = 0 (or -Ax² + Cy² + Dx + Ey + F = 0)
        // Standard form: (x-h)²/a² - (y-k)²/b² = 1 or (y-k)²/b² - (x-h)²/a² = 1
        function getGeneralHyperbolaCoordinates(A, C, D, E, F, steps = 100) {
          // Check if it's a valid hyperbola (A and C must have opposite signs)
          if (A === 0 || C === 0) return [[], []]; // Not a hyperbola if A = 0 or C = 0
          if (A * C >= 0) return [[], []]; // Not a hyperbola if A and C have same sign

          // Convert to standard form
          let h = -D / (2 * A); // center x
          let k = -E / (2 * C); // center y

          // Calculate discriminant
          let discriminant = (D * D) / (4 * A * A) + (E * E) / (4 * C * C) - F;

          if (discriminant <= 0) return [[], []]; // No real hyperbola

          let a_squared = discriminant / A;
          let b_squared = -discriminant / C; // Note the negative sign

          if (a_squared <= 0 || b_squared <= 0) return [[], []]; // Invalid hyperbola

          let a = Math.sqrt(Math.abs(a_squared));
          let b = Math.sqrt(Math.abs(b_squared));

          let branch1 = [];
          let branch2 = [];

          if (A > 0) {
            // Horizontal hyperbola: (x-h)²/a² - (y-k)²/b² = 1
            // Right branch
            for (let i = 0; i <= steps; i++) {
              let t = (i / steps) * 4 - 2; // t ranges from -2 to 2
              let x = h + a * Math.cosh(t);
              let y = k + b * Math.sinh(t);
              branch1.push([x, y]);
            }
            // Left branch
            for (let i = 0; i <= steps; i++) {
              let t = (i / steps) * 4 - 2; // t ranges from -2 to 2
              let x = h - a * Math.cosh(t);
              let y = k + b * Math.sinh(t);
              branch2.push([x, y]);
            }
          } else {
            // Vertical hyperbola: (y-k)²/b² - (x-h)²/a² = 1
            // Upper branch
            for (let i = 0; i <= steps; i++) {
              let t = (i / steps) * 4 - 2; // t ranges from -2 to 2
              let x = h + a * Math.sinh(t);
              let y = k + b * Math.cosh(t);
              branch1.push([x, y]);
            }
            // Lower branch
            for (let i = 0; i <= steps; i++) {
              let t = (i / steps) * 4 - 2; // t ranges from -2 to 2
              let x = h + a * Math.sinh(t);
              let y = k - b * Math.cosh(t);
              branch2.push([x, y]);
            }
          }

          return [branch1, branch2];
        }

        function getHyperbolaInfo(A, C, D, E, F) {
          if (A === 0 || C === 0)
            return {
              valid: false,
              message: "Not a hyperbola (A = 0 or C = 0)",
            };
          if (A * C >= 0)
            return {
              valid: false,
              message: "Not a hyperbola (A and C must have opposite signs)",
            };

          let h = -D / (2 * A);
          let k = -E / (2 * C);
          let discriminant = (D * D) / (4 * A * A) + (E * E) / (4 * C * C) - F;

          if (discriminant <= 0) {
            return {
              valid: false,
              message: "No real hyperbola (discriminant ≤ 0)",
            };
          }

          let a_squared = discriminant / A;
          let b_squared = -discriminant / C;

          if (a_squared <= 0 || b_squared <= 0) {
            return {
              valid: false,
              message: "Invalid hyperbola (negative parameters)",
            };
          }

          let a = Math.sqrt(Math.abs(a_squared));
          let b = Math.sqrt(Math.abs(b_squared));

          // Calculate eccentricity
          let eccentricity = Math.sqrt(1 + (b * b) / (a * a));

          // Determine orientation
          let orientation = A > 0 ? "horizontal" : "vertical";

          return {
            valid: true,
            center: [h, k],
            a: a,
            b: b,
            eccentricity: eccentricity,
            orientation: orientation,
            discriminant: discriminant,
          };
        }

        let hyperbolaPoints = [[], []];
        let hyperbolaCoeffs = { A: 1, C: -1, D: 0, E: 0, F: -1 }; // Default: x² - y² = 1

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
          hyperbolaPoints = getGeneralHyperbolaCoordinates(
            hyperbolaCoeffs.A,
            hyperbolaCoeffs.C,
            hyperbolaCoeffs.D,
            hyperbolaCoeffs.E,
            hyperbolaCoeffs.F,
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
              hyperbolaCoeffs.A += 0.1;
              changed = true;
            }
            if (P.key === "a") {
              hyperbolaCoeffs.A -= 0.1;
              changed = true;
            }

            // C coefficient
            if (P.key === "w") {
              hyperbolaCoeffs.C += 0.1;
              changed = true;
            }
            if (P.key === "s") {
              hyperbolaCoeffs.C -= 0.1;
              changed = true;
            }

            // D coefficient
            if (P.key === "e") {
              hyperbolaCoeffs.D += 0.1;
              changed = true;
            }
            if (P.key === "d") {
              hyperbolaCoeffs.D -= 0.1;
              changed = true;
            }

            // E coefficient
            if (P.key === "r") {
              hyperbolaCoeffs.E += 0.1;
              changed = true;
            }
            if (P.key === "f") {
              hyperbolaCoeffs.E -= 0.1;
              changed = true;
            }

            // F coefficient
            if (P.key === "t") {
              hyperbolaCoeffs.F += 0.1;
              changed = true;
            }
            if (P.key === "g") {
              hyperbolaCoeffs.F -= 0.1;
              changed = true;
            }

            // Reset
            if (P.key === "Shift" || P.keyCode === P.SHIFT) {
              hyperbolaCoeffs = { A: 1, C: -1, D: 0, E: 0, F: -1 };
              changed = true;
            }

            if (changed) {
              hyperbolaPoints = getGeneralHyperbolaCoordinates(
                hyperbolaCoeffs.A,
                hyperbolaCoeffs.C,
                hyperbolaCoeffs.D,
                hyperbolaCoeffs.E,
                hyperbolaCoeffs.F,
                100
              );
            }
          }

          P.translate(P.width / 2, P.height / 2);
          Scale(scaleParameters, true);

          // Draw the hyperbola if valid
          if (hyperbolaPoints[0].length > 0 && hyperbolaPoints[1].length > 0) {
            // Draw both branches
            plotPoints(
              hyperbolaPoints[0],
              scaleParameters,
              "line",
              [100, 255, 100, 255],
              3,
              4
            );
            plotPoints(
              hyperbolaPoints[1],
              scaleParameters,
              "line",
              [100, 255, 100, 255],
              3,
              4
            );

            // Draw center point and asymptotes
            let info = getHyperbolaInfo(
              hyperbolaCoeffs.A,
              hyperbolaCoeffs.C,
              hyperbolaCoeffs.D,
              hyperbolaCoeffs.E,
              hyperbolaCoeffs.F
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

              // Draw asymptotes
              P.stroke(255, 255, 100, 150);
              P.strokeWeight(2);
              let asympSlope = info.b / info.a;

              if (info.orientation === "horizontal") {
                // y - k = ±(b/a)(x - h)
                let x1 = scaleParameters.xVal[0];
                let x2 = scaleParameters.xVal[1];
                let y1_pos =
                  info.center[1] + asympSlope * (x1 - info.center[0]);
                let y2_pos =
                  info.center[1] + asympSlope * (x2 - info.center[0]);
                let y1_neg =
                  info.center[1] - asympSlope * (x1 - info.center[0]);
                let y2_neg =
                  info.center[1] - asympSlope * (x2 - info.center[0]);

                plotPoints(
                  [
                    [x1, y1_pos],
                    [x2, y2_pos],
                  ],
                  scaleParameters,
                  "line",
                  [255, 255, 100, 100],
                  2
                );
                plotPoints(
                  [
                    [x1, y1_neg],
                    [x2, y2_neg],
                  ],
                  scaleParameters,
                  "line",
                  [255, 255, 100, 100],
                  2
                );
              } else {
                // x - h = ±(a/b)(y - k)
                let y1 = scaleParameters.yVal[0];
                let y2 = scaleParameters.yVal[1];
                let x1_pos =
                  info.center[0] + (info.a / info.b) * (y1 - info.center[1]);
                let x2_pos =
                  info.center[0] + (info.a / info.b) * (y2 - info.center[1]);
                let x1_neg =
                  info.center[0] - (info.a / info.b) * (y1 - info.center[1]);
                let x2_neg =
                  info.center[0] - (info.a / info.b) * (y2 - info.center[1]);

                plotPoints(
                  [
                    [x1_pos, y1],
                    [x2_pos, y2],
                  ],
                  scaleParameters,
                  "line",
                  [255, 255, 100, 100],
                  2
                );
                plotPoints(
                  [
                    [x1_neg, y1],
                    [x2_neg, y2],
                  ],
                  scaleParameters,
                  "line",
                  [255, 255, 100, 100],
                  2
                );
              }

              // Draw foci
              let c = Math.sqrt(info.a * info.a + info.b * info.b);
              let focus1, focus2;

              if (info.orientation === "horizontal") {
                focus1 = [info.center[0] + c, info.center[1]];
                focus2 = [info.center[0] - c, info.center[1]];
              } else {
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

              P.fill(100, 100, 255);
              P.noStroke();
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
          P.text("Interactive Hyperbola Equation:", 20, 25);

          P.textStyle(P.NORMAL);
          P.textSize(14);
          P.text(`Ax² + Cy² + Dx + Ey + F = 0`, 20, 50);

          // Current coefficients
          P.fill(255, 255, 100);
          P.text(`A = ${hyperbolaCoeffs.A.toFixed(2)}`, 20, 75);
          P.text(`C = ${hyperbolaCoeffs.C.toFixed(2)}`, 20, 95);
          P.text(`D = ${hyperbolaCoeffs.D.toFixed(2)}`, 20, 115);
          P.text(`E = ${hyperbolaCoeffs.E.toFixed(2)}`, 20, 135);
          P.text(`F = ${hyperbolaCoeffs.F.toFixed(2)}`, 20, 155);

          // Hyperbola information
          let info = getHyperbolaInfo(
            hyperbolaCoeffs.A,
            hyperbolaCoeffs.C,
            hyperbolaCoeffs.D,
            hyperbolaCoeffs.E,
            hyperbolaCoeffs.F
          );

          if (info.valid) {
            P.fill(100, 255, 100);
            P.text("Hyperbola Properties:", 20, 180);
            P.fill(255, 255, 255);
            P.text(
              `Center: (${info.center[0].toFixed(2)}, ${info.center[1].toFixed(
                2
              )})`,
              20,
              200
            );
            P.text(`a = ${info.a.toFixed(2)}`, 20, 220);
            P.text(`b = ${info.b.toFixed(2)}`, 20, 240);
            P.text(`Eccentricity: ${info.eccentricity.toFixed(3)}`, 20, 260);
            P.text(`Orientation: ${info.orientation}`, 20, 280);
            P.fill(255, 100, 100);
            P.text("Red: Center", 20, 300);
            P.fill(100, 100, 255);
            P.text("Blue: Foci", 20, 315);
            P.fill(255, 255, 100);
            P.text("Yellow: Asymptotes", 20, 330);
          } else {
            P.fill(255, 100, 100);
            P.text(info.message, 20, 180);
          }

          // Controls
          P.fill(200, 200, 255);
          P.text("Controls:", 20, 350);
          P.fill(255, 255, 255);
          P.textSize(12);
          P.text("Q/A: Change 'A'    W/S: Change 'C'", 20, 365);
          P.text("E/D: Change 'D'    R/F: Change 'E'", 20, 380);
          P.text("T/G: Change 'F'    SHIFT: Reset", 20, 395);
          P.text("Note: A and C must have opposite signs", 20, 410);

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
