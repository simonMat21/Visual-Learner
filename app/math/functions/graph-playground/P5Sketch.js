"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch({ functionStr }) {
  const sketchRef = useRef(null);
  const myP5Ref = useRef(null);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        let p = [];
        let showGrid = true; // Toggle variable for grid visibility

        const scaleParameters = {
          position: [0, 0],
          scaleLenX: [500, 500],
          scaleLenY: [250, 250],
          origin: 0,
          xVal: [-10, 10],
          yVal: [-5, 5],
          div: [1, 1],
        };

        let f1;

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
            for (let i = 1; i <= P.floor((xVal[1] - origin) / div[0]); i++) {
              let x = posX + i * gridSpacingX;
              P.line(x, posY - scaleLenY[0], x, posY + scaleLenY[1]);
            }
            gridSpacingX = (scaleLenX[0] - 20) / ((origin - xVal[0]) / div[0]);
            for (let i = 1; i <= P.floor((origin - xVal[0]) / div[0]); i++) {
              let x = posX - i * gridSpacingX;
              P.line(x, posY - scaleLenY[0], x, posY + scaleLenY[1]);
            }

            // Horizontal grid lines (parallel to x-axis)
            let gridSpacingY = scaleLenY[0] / ((yVal[1] - origin) / div[1]);
            for (let i = 1; i <= P.floor((yVal[1] - origin) / div[1]); i++) {
              let y = posY + i * gridSpacingY;
              P.line(posX - scaleLenX[0], y, posX + scaleLenX[1], y);
            }
            gridSpacingY = scaleLenY[1] / ((origin - yVal[0]) / div[1]);
            for (let i = 1; i <= P.floor((origin - yVal[0]) / div[1]); i++) {
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
          for (let i = origin; i <= P.floor((xVal[1] - origin) / div[0]); i++) {
            P.text(n, posX + i * q + q, posY + 20);
            n += div[0];
          }

          // negative x-axis
          n = origin - div[0];
          q = (scaleLenX[0] - 20) / ((origin - xVal[0]) / div[0]);
          for (let i = origin; i <= P.floor((origin - xVal[0]) / div[0]); i++) {
            P.text(n, posX - i * q - q, posY + 20);
            n -= div[0];
          }

          //negative y-axis
          n = origin - div[1];
          q = scaleLenY[0] / ((yVal[1] - origin) / div[0]);
          for (let i = origin; i <= P.floor((yVal[1] - origin) / div[0]); i++) {
            P.text(n, posY - 20, posX + i * q + q);
            n -= div[0];
          }

          //positive y-axis
          n = origin + div[1];
          q = scaleLenY[0] / ((origin - yVal[0]) / div[0]);
          for (let i = origin; i <= P.floor((origin - yVal[0]) / div[0]); i++) {
            P.text(n, posY - 20, posX - i * q - q);
            n += div[0];
          }

          P.pop();
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
              // Check for NaN values before drawing
              if (
                Number.isFinite(screenPoints[i][0]) &&
                Number.isFinite(screenPoints[i][1]) &&
                Number.isFinite(screenPoints[i + 1][0]) &&
                Number.isFinite(screenPoints[i + 1][1])
              ) {
                P.line(
                  screenPoints[i][0],
                  screenPoints[i][1],
                  screenPoints[i + 1][0],
                  screenPoints[i + 1][1]
                );
              }
            }
          }

          // Draw points
          if (plotType === "points" || plotType === "both") {
            P.noStroke();
            P.fill(color[0], color[1], color[2]);
            for (let i = 0; i < screenPoints.length; i++) {
              // Check for NaN values before drawing
              if (
                Number.isFinite(screenPoints[i][0]) &&
                Number.isFinite(screenPoints[i][1])
              ) {
                P.circle(screenPoints[i][0], screenPoints[i][1], pointSize);
              }
            }
          }

          P.pop();
        }

        // Function to convert mathematical coordinates to screen pixel positions
        function getScreenPosition(x, y, scaleParams) {
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } =
            scaleParams;
          const [posX, posY] = position;

          // Use the same spacing logic as other functions
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          // Convert mathematical coordinates to screen coordinates (same as plotPoints and drawVector)
          let screenX = posX + ((x - origin) / div[0]) * xSpacing;
          let screenY = posY - ((y - origin) / div[1]) * ySpacing; // Negative to match other functions

          return [screenX, screenY];
        }

        // Function to convert screen pixel positions back to mathematical coordinates
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

        function getFunCordinates(func, [start, stop], div) {
          let points = [];
          for (let x = start; x <= stop; x += div) {
            let y = func(x);
            // Only add points with valid y values
            if (Number.isFinite(y)) {
              points.push([x, y]);
            }
          }
          return points;
        }

        P.updateFunction = (newStr) => {
          try {
            f1 = makeFunction(newStr);
            p = getFunCordinates(
              f1,
              [scaleParameters.xVal[0], scaleParameters.xVal[1]],
              0.01
            );
          } catch (e) {
            // Silently handle invalid function input
            // Clear points array to prevent drawing with invalid data
            p = [];
            // Set f1 to a safe default function
            f1 = () => NaN;
          }
        };

        P.setup = () => {
          P.createCanvas(1000, 500);

          scaleParameters.scaleLenX = [P.width / 2, P.width / 2];
          scaleParameters.scaleLenY = [P.height / 2, P.height / 2];

          // Initial function
          f1 = makeFunction("sin(x)");

          p = getFunCordinates(
            f1,
            [scaleParameters.xVal[0], scaleParameters.xVal[1]],
            0.01
          );
        };

        P.draw = () => {
          P.translate(P.width / 2, P.height / 2);
          P.background(80);

          // Draw scale using the scale parameters
          Scale(scaleParameters, showGrid);

          // Plot the sine function
          plotPoints(p, scaleParameters, "line", [255, 100, 100], 2, 4);

          // Hover effect
          let adjustedMouseX = P.mouseX - P.width / 2;
          let adjustedMouseY = P.mouseY - P.height / 2;

          // Check if mouse is inside canvas roughly
          if (
            P.mouseX >= 0 &&
            P.mouseX <= P.width &&
            P.mouseY >= 0 &&
            P.mouseY <= P.height
          ) {
            let [mathX, _] = getMathPosition(
              adjustedMouseX,
              adjustedMouseY,
              scaleParameters
            );

            try {
              let mathY = f1(mathX);
              if (Number.isFinite(mathY)) {
                let [screenX, screenY] = getScreenPosition(
                  mathX,
                  mathY,
                  scaleParameters
                );

                // Verify screen coordinates are valid before drawing
                if (Number.isFinite(screenX) && Number.isFinite(screenY)) {
                  // Draw point on graph
                  P.push();
                  P.stroke(255);
                  P.strokeWeight(2);
                  P.fill(255, 0, 0);
                  P.circle(screenX, screenY, 8);

                  // Draw dashed line to x-axis
                  P.stroke(255, 255, 255, 100);
                  P.strokeWeight(1);
                  P.drawingContext.setLineDash([5, 5]);
                  let [xAxisX, xAxisY] = getScreenPosition(
                    mathX,
                    0,
                    scaleParameters
                  );
                  if (Number.isFinite(xAxisX) && Number.isFinite(xAxisY)) {
                    P.line(screenX, screenY, xAxisX, xAxisY);
                  }
                  P.drawingContext.setLineDash([]);

                  // Draw text
                  P.noStroke();
                  P.fill(255);
                  P.textAlign(P.LEFT, P.BOTTOM);
                  P.textSize(12);
                  P.text(
                    `(${mathX.toFixed(2)}, ${mathY.toFixed(2)})`,
                    screenX + 10,
                    screenY - 10
                  );
                  P.pop();
                }
              }
            } catch (e) {
              // ignore errors during hover calculation
            }
          }
        };
      };

      const myp5 = new p5(sketch, sketchRef.current);
      myP5Ref.current = myp5;

      // Initial update if prop is provided
      if (functionStr && myp5.updateFunction) {
        myp5.updateFunction(functionStr);
      }

      return () => {
        myp5.remove();
      };
    });
  }, []);

  useEffect(() => {
    if (myP5Ref.current && myP5Ref.current.updateFunction && functionStr) {
      myP5Ref.current.updateFunction(functionStr);
    }
  }, [functionStr]);

  return <div ref={sketchRef} />;
}
