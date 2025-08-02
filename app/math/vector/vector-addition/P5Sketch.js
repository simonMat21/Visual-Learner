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

        let mPos1;
        let mPos2;

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
          mPos1 = new MovablePoint(100, 100, 30);
          mPos2 = new MovablePoint(200, 100, 30);
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(80);

          // Check clicks BEFORE translating the coordinate system
          checkClicked([mPos1, mPos2]);

          // Now translate for drawing
          P.translate(P.width / 2, P.height / 2);

          Scale(scaleParameters, true);
          let pos1 = getMathPosition(mPos1.x, mPos1.y, scaleParameters);
          let pos2 = getMathPosition(mPos2.x, mPos2.y, scaleParameters);

          // Draw original vectors from origin
          drawVector(
            [[0, 0], pos1],
            scaleParameters,
            [255, 255, 0, 255],
            3,
            12
          );

          drawVector(
            [[0, 0], pos2],
            scaleParameters,
            [0, 255, 255, 255],
            3,
            12
          );

          // Draw parallelogram law vectors
          // Vector from end of first vector to sum (parallel to second vector)
          drawVector(
            [pos1, [pos1[0] + pos2[0], pos1[1] + pos2[1]]],
            scaleParameters,
            [0, 255, 255, 150], // Cyan with transparency
            2,
            8
          );

          // Vector from end of second vector to sum (parallel to first vector)
          drawVector(
            [pos2, [pos1[0] + pos2[0], pos1[1] + pos2[1]]],
            scaleParameters,
            [255, 255, 0, 150], // Yellow with transparency
            2,
            8
          );

          // Draw the resultant vector (diagonal of parallelogram)
          drawVector(
            [
              [0, 0],
              [pos1[0] + pos2[0], pos1[1] + pos2[1]],
            ],
            scaleParameters,
            [255, 0, 255, 255], // Magenta for resultant
            4,
            15
          );

          // Draw parallelogram outline
          P.push();
          P.stroke(255, 255, 255, 100); // White with low opacity
          P.strokeWeight(1);
          P.noFill();

          // Convert coordinates to screen space for parallelogram
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } =
            scaleParameters;
          const [posX, posY] = position;
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          let origin_screen = [posX, posY];
          let pos1_screen = [
            posX + ((pos1[0] - origin) / div[0]) * xSpacing,
            posY - ((pos1[1] - origin) / div[1]) * ySpacing,
          ];
          let pos2_screen = [
            posX + ((pos2[0] - origin) / div[0]) * xSpacing,
            posY - ((pos2[1] - origin) / div[1]) * ySpacing,
          ];
          let sum_screen = [
            posX + ((pos1[0] + pos2[0] - origin) / div[0]) * xSpacing,
            posY - ((pos1[1] + pos2[1] - origin) / div[1]) * ySpacing,
          ];

          // Draw parallelogram
          P.beginShape();
          P.vertex(origin_screen[0], origin_screen[1]);
          P.vertex(pos1_screen[0], pos1_screen[1]);
          P.vertex(sum_screen[0], sum_screen[1]);
          P.vertex(pos2_screen[0], pos2_screen[1]);
          P.endShape(P.CLOSE);
          P.pop();

          // Display vector representations in top-left corner
          P.push();

          // Reset transformation to work in screen coordinates
          P.translate(-P.width / 2, -P.height / 2);

          // Calculate vector components and resultant
          let x1 = pos1[0],
            y1 = pos1[1];
          let x2 = pos2[0],
            y2 = pos2[1];
          let sumX = x1 + x2,
            sumY = y1 + y2;
          let magnitude1 = Math.sqrt(x1 * x1 + y1 * y1);
          let magnitude2 = Math.sqrt(x2 * x2 + y2 * y2);
          let magnitudeSum = Math.sqrt(sumX * sumX + sumY * sumY);

          // Background for the text
          P.fill(0, 0, 0, 180);
          P.noStroke();
          P.rect(15, 20, 320, 180);

          // Text styling
          P.textAlign(P.LEFT, P.TOP);
          P.textSize(16);
          P.textStyle(P.BOLD);
          P.fill(255, 255, 255);
          P.text("Vector Addition - Parallelogram Law:", 20, 25);

          P.textStyle(P.NORMAL);
          P.textSize(12);

          // Vector A (yellow)
          P.fill(255, 255, 0);
          P.text(
            `Vector A: (${x1.toFixed(2)}, ${y1.toFixed(
              2
            )}) |A| = ${magnitude1.toFixed(2)}`,
            20,
            50
          );

          // Vector B (cyan)
          P.fill(0, 255, 255);
          P.text(
            `Vector B: (${x2.toFixed(2)}, ${y2.toFixed(
              2
            )}) |B| = ${magnitude2.toFixed(2)}`,
            20,
            70
          );

          // Resultant (magenta)
          P.fill(255, 0, 255);
          P.text(
            `A + B: (${sumX.toFixed(2)}, ${sumY.toFixed(
              2
            )}) |A+B| = ${magnitudeSum.toFixed(2)}`,
            20,
            90
          );

          // Formula
          P.fill(255, 255, 255);
          P.text("Parallelogram Law:", 20, 115);
          P.text("• Draw vectors A and B from origin", 20, 135);
          P.text("• Complete parallelogram with parallel sides", 20, 150);
          P.text("• Diagonal from origin is vector sum A + B", 20, 165);
          P.text("• |A + B|² = |A|² + |B|² + 2|A||B|cos(θ)", 20, 180);

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
