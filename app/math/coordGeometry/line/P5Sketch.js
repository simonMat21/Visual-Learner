"use client";

import React, { useRef, useEffect } from "react";
import { BOARD } from "@/lib/boardPalette";

export default function P5Sketch({ k1, k2, t }) {
  const sketchRef = useRef(null);

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        let p = [];
        let showGrid = true;

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
          const mathFuncs = [
            "abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh",
            "cbrt", "ceil", "clz32", "cos", "cosh", "exp", "expm1", "floor",
            "fround", "hypot", "imul", "log", "log10", "log1p", "log2", "max",
            "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt",
            "tan", "tanh", "trunc",
          ];
          const mathScope = `const { ${mathFuncs.join(", ")} } = Math;`;
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
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } = scaleParams;
          const [posX, posY] = position;

          P.push();
          P.stroke(200);
          P.strokeWeight(5);
          P.line(posX - scaleLenX[0], posY, posX + scaleLenX[1], posY);
          P.line(posX, posY - scaleLenY[0], posX, posY + scaleLenY[1]);
          P.pop();

          if (drawGrid) {
            P.push();
            P.stroke(255, 255, 255, 50);
            P.strokeWeight(1);

            let gridSpacingX = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
            for (let i = 1; i <= P.floor((xVal[1] - origin) / div[0]); i++) {
              let x = posX + i * gridSpacingX;
              P.line(x, posY - scaleLenY[0], x, posY + scaleLenY[1]);
            }
            gridSpacingX = (scaleLenX[0] - 20) / ((origin - xVal[0]) / div[0]);
            for (let i = 1; i <= P.floor((origin - xVal[0]) / div[0]); i++) {
              let x = posX - i * gridSpacingX;
              P.line(x, posY - scaleLenY[0], x, posY + scaleLenY[1]);
            }

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

          let n = origin + div[0];
          let q = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          for (let i = origin; i <= P.floor((xVal[1] - origin) / div[0]); i++) {
            P.text(n, posX + i * q + q, posY + 20);
            n += div[0];
          }

          n = origin - div[0];
          q = (scaleLenX[0] - 20) / ((origin - xVal[0]) / div[0]);
          for (let i = origin; i <= P.floor((origin - xVal[0]) / div[0]); i++) {
            P.text(n, posX - i * q - q, posY + 20);
            n -= div[0];
          }

          n = origin - div[1];
          q = scaleLenY[0] / ((yVal[1] - origin) / div[0]);
          for (let i = origin; i <= P.floor((yVal[1] - origin) / div[0]); i++) {
            P.text(n, posY - 20, posX + i * q + q);
            n -= div[0];
          }

          n = origin + div[1];
          q = scaleLenY[0] / ((origin - yVal[0]) / div[0]);
          for (let i = origin; i <= P.floor((origin - yVal[0]) / div[0]); i++) {
            P.text(n, posY - 20, posX - i * q - q);
            n += div[0];
          }
          P.pop();
        }

        function drawOnScaleX(value, [posX, posY], scaleLenX, scaleLenY, origin, xVal, yVal, div) {
          P.push();
          P.strokeWeight(3);
          P.stroke(255, 100, 100);

          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          let x1 = posX + ((value[0][0] - origin) / div[0]) * xSpacing;
          let y1 = posY + ((-1 * value[0][1] - origin) / div[1]) * ySpacing;

          for (let i = 1; i < value.length; i++) {
            let x2 = posX + ((value[i][0] - origin) / div[0]) * xSpacing;
            let y2 = posY + ((-1 * value[i][1] - origin) / div[1]) * ySpacing;
            P.line(x1, y1, x2, y2);
            x1 = x2;
            y1 = y2;
          }
          P.pop();
        }

        function plotPoints(coordinates, scaleParams, plotType = "line", color = [255, 255, 255], strokeW = 2, pointSize = 4) {
          if (coordinates.length === 0) return;
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } = scaleParams;
          const [posX, posY] = position;

          P.push();
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          let screenPoints = [];
          for (let i = 0; i < coordinates.length; i++) {
            let x = posX + ((coordinates[i][0] - origin) / div[0]) * xSpacing;
            let y = posY - ((coordinates[i][1] - origin) / div[1]) * ySpacing;
            screenPoints.push([x, y]);
          }

          if (plotType === "line" || plotType === "both") {
            P.stroke(color[0], color[1], color[2]);
            P.strokeWeight(strokeW);
            P.noFill();
            for (let i = 0; i < screenPoints.length - 1; i++) {
              P.line(screenPoints[i][0], screenPoints[i][1], screenPoints[i + 1][0], screenPoints[i + 1][1]);
            }
          }

          if (plotType === "points" || plotType === "both") {
            P.noStroke();
            P.fill(color[0], color[1], color[2]);
            for (let i = 0; i < screenPoints.length; i++) {
              P.circle(screenPoints[i][0], screenPoints[i][1], pointSize);
            }
          }
          P.pop();
        }

        function drawVector(vectorData, scaleParams, color = [255, 255, 0], strokeW = 2, arrowSize = 10, isDirection = false) {
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } = scaleParams;
          const [posX, posY] = position;

          P.push();
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          let startX = vectorData[0][0];
          let startY = vectorData[0][1];
          let endX, endY;

          if (isDirection) {
            endX = startX + vectorData[1][0];
            endY = startY + vectorData[1][1];
          } else {
            endX = vectorData[1][0];
            endY = vectorData[1][1];
          }

          let screenStartX = posX + ((startX - origin) / div[0]) * xSpacing;
          let screenStartY = posY - ((startY - origin) / div[1]) * ySpacing;
          let screenEndX = posX + ((endX - origin) / div[0]) * xSpacing;
          let screenEndY = posY - ((endY - origin) / div[1]) * ySpacing;

          P.stroke(color[0], color[1], color[2]);
          P.strokeWeight(strokeW);
          P.fill(color[0], color[1], color[2]);

          P.line(screenStartX, screenStartY, screenEndX, screenEndY);

          let angle = P.atan2(screenEndY - screenStartY, screenEndX - screenStartX);
          let arrowLength = arrowSize;
          let arrowAngle = P.PI / 6;

          let arrowX1 = screenEndX - arrowLength * P.cos(angle - arrowAngle);
          let arrowY1 = screenEndY - arrowLength * P.sin(angle - arrowAngle);
          let arrowX2 = screenEndX - arrowLength * P.cos(angle + arrowAngle);
          let arrowY2 = screenEndY - arrowLength * P.sin(angle + arrowAngle);

          P.noStroke();
          P.triangle(screenEndX, screenEndY, arrowX1, arrowY1, arrowX2, arrowY2);
          P.pop();
        }

        function getScreenPosition(x, y, scaleParams) {
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } = scaleParams;
          const [posX, posY] = position;
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);
          let screenX = posX + ((x - origin) / div[0]) * xSpacing;
          let screenY = posY - ((y - origin) / div[1]) * ySpacing;
          return [screenX, screenY];
        }

        function getFunCordinates(func, [start, stop], div) {
          let points = [];
          for (let x = start; x <= stop; x += div) {
            let y = func(x);
            points.push([x, y]);
          }
          return points;
        }

        P.setup = () => {
          P.createCanvas(1000, 500);
          scaleParameters.scaleLenX = [P.width / 2, P.width / 2];
          scaleParameters.scaleLenY = [P.height / 2, P.height / 2];
          
          f1 = makeFunction("floor(x)");
          p = getFunCordinates(f1, [scaleParameters.xVal[0], scaleParameters.xVal[1]], 0.01);
        };

        P.draw = () => {
          P.translate(P.width / 2, P.height / 2);
          P.background(...BOARD);

          Scale(scaleParameters, showGrid);
          plotPoints(p, scaleParameters, "line", [255, 100, 100], 2, 4);

          drawVector([[0, 0], [2, 3]], scaleParameters, [255, 255, 0], 3, 12);

          let [screenX, screenY] = getScreenPosition(3, 2, scaleParameters);
          P.push();
          P.fill(0, 255, 255);
          P.noStroke();
          P.circle(screenX, screenY, 8);
          P.pop();

          let [textX, textY] = getScreenPosition(-3, -2, scaleParameters);
          P.push();
          P.fill(255, 255, 255);
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(12);
          P.text("(-3, -2)", textX, textY);
          P.pop();
        };
      };

      const myp5 = new p5(sketch, sketchRef.current);
      p5Instance = myp5;
    });
    return () => {
      cancelled = true;
      p5Instance?.remove();
    };
  }, []);

  return <div ref={sketchRef} />;
}
