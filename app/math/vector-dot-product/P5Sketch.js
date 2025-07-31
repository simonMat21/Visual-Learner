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

          // Calculate dot product and projection
          let dotProduct = pos1[0] * pos2[0] + pos1[1] * pos2[1];
          let magnitude1 = Math.sqrt(pos1[0] * pos1[0] + pos1[1] * pos1[1]);
          let magnitude2 = Math.sqrt(pos2[0] * pos2[0] + pos2[1] * pos2[1]);

          // Calculate angle between vectors
          let angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
          if (isNaN(angle)) angle = 0;

          // Calculate projection of vector A onto vector B
          let projectionScalar = dotProduct / (magnitude2 * magnitude2);
          let projectionVector = [
            pos2[0] * projectionScalar,
            pos2[1] * projectionScalar,
          ];

          // Draw projection vector
          drawVector(
            [[0, 0], projectionVector],
            scaleParameters,
            [255, 100, 100, 255], // Red for projection
            4,
            10
          );

          // Draw perpendicular line from end of vector A to projection
          drawVector(
            [pos1, projectionVector],
            scaleParameters,
            [150, 150, 150, 180], // Gray dashed line effect
            2,
            0 // No arrow for perpendicular line
          );

          // Draw angle arc
          P.push();
          const { position, scaleLenX, scaleLenY, origin, xVal, yVal, div } =
            scaleParameters;
          const [posX, posY] = position;
          let xSpacing = (scaleLenX[1] - 20) / ((xVal[1] - origin) / div[0]);
          let ySpacing = scaleLenY[0] / ((yVal[1] - origin) / div[1]);

          P.stroke(255, 255, 255, 150);
          P.strokeWeight(2);
          P.noFill();

          // Calculate angles for arc
          let angle1 = Math.atan2(-pos1[1] * ySpacing, pos1[0] * xSpacing);
          let angle2 = Math.atan2(-pos2[1] * ySpacing, pos2[0] * xSpacing);

          // Draw arc at origin
          let arcRadius = 30;
          P.arc(
            posX,
            posY,
            arcRadius * 2,
            arcRadius * 2,
            Math.min(angle1, angle2),
            Math.max(angle1, angle2)
          );

          // Add angle label
          let midAngle = (angle1 + angle2) / 2;
          let labelX = posX + Math.cos(midAngle) * (arcRadius + 15);
          let labelY = posY + Math.sin(midAngle) * (arcRadius + 15);

          P.fill(255, 255, 255);
          P.noStroke();
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(10);
          P.text(
            `θ = ${((angle * 180) / Math.PI).toFixed(1)}°`,
            labelX,
            labelY
          );
          P.pop();

          // Show projection length visually
          P.push();
          P.stroke(255, 100, 100, 255);
          P.strokeWeight(3);

          // Draw tick marks on vector B to show projection length
          let projStart = [posX, posY];
          let projEnd = [
            posX + ((projectionVector[0] - origin) / div[0]) * xSpacing,
            posY - ((projectionVector[1] - origin) / div[1]) * ySpacing,
          ];

          // Small perpendicular lines at projection endpoints
          let perpLen = 8;
          let vectorBAngle = Math.atan2(
            -pos2[1] * ySpacing,
            pos2[0] * xSpacing
          );
          let perpAngle = vectorBAngle + Math.PI / 2;

          // At origin
          P.line(
            projStart[0] - Math.cos(perpAngle) * perpLen,
            projStart[1] - Math.sin(perpAngle) * perpLen,
            projStart[0] + Math.cos(perpAngle) * perpLen,
            projStart[1] + Math.sin(perpAngle) * perpLen
          );

          // At projection end
          P.line(
            projEnd[0] - Math.cos(perpAngle) * perpLen,
            projEnd[1] - Math.sin(perpAngle) * perpLen,
            projEnd[0] + Math.cos(perpAngle) * perpLen,
            projEnd[1] + Math.sin(perpAngle) * perpLen
          );
          P.pop();

          // Display dot product information
          P.push();
          P.translate(-P.width / 2, -P.height / 2);

          // Background for the text
          P.fill(0, 0, 0, 180);
          P.noStroke();
          P.rect(15, 20, 380, 220);

          // Text styling
          P.textAlign(P.LEFT, P.TOP);
          P.textSize(16);
          P.textStyle(P.BOLD);
          P.fill(255, 255, 255);
          P.text("Vector Dot Product Visualization:", 20, 25);

          P.textStyle(P.NORMAL);
          P.textSize(12);

          // Vector A (yellow)
          P.fill(255, 255, 0);
          P.text(
            `Vector A: (${pos1[0].toFixed(2)}, ${pos1[1].toFixed(
              2
            )}) |A| = ${magnitude1.toFixed(2)}`,
            20,
            50
          );

          // Vector B (cyan)
          P.fill(0, 255, 255);
          P.text(
            `Vector B: (${pos2[0].toFixed(2)}, ${pos2[1].toFixed(
              2
            )}) |B| = ${magnitude2.toFixed(2)}`,
            20,
            70
          );

          // Dot Product
          P.fill(255, 100, 255);
          P.text(`A · B = ${dotProduct.toFixed(2)}`, 20, 95);

          // Angle
          P.fill(255, 255, 255);
          P.text(`Angle θ = ${((angle * 180) / Math.PI).toFixed(1)}°`, 20, 115);

          // Projection (red)
          P.fill(255, 100, 100);
          P.text(
            `Projection of A onto B: (${projectionVector[0].toFixed(
              2
            )}, ${projectionVector[1].toFixed(2)})`,
            20,
            135
          );
          P.text(
            `Projection magnitude: ${Math.abs(
              projectionScalar * magnitude2
            ).toFixed(2)}`,
            20,
            155
          );

          // Formula and interpretation
          P.fill(255, 255, 255);
          P.text("Dot Product Formula:", 20, 180);
          P.text("A · B = |A| × |B| × cos(θ)", 20, 195);
          P.text(
            `A · B = ${magnitude1.toFixed(2)} × ${magnitude2.toFixed(
              2
            )} × cos(${((angle * 180) / Math.PI).toFixed(1)}°)`,
            20,
            210
          );
          P.text(
            `A · B = ${(magnitude1 * magnitude2 * Math.cos(angle)).toFixed(2)}`,
            20,
            225
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
