"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch({ refractiveIndex = 1.5 }) {
  const sketchRef = useRef(null);
  const refractiveIndexRef = useRef(null);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        let taken = null;
        function checkClicked(Pts) {
          for (var p of Pts) {
            if (taken == p || taken == null) {
              let dis = Math.sqrt(
                (P.mouseX - p.x) ** 2 + (P.mouseY - p.y) ** 2
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
                p.setPos(P.mouseX, P.mouseY);
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
            this.xlimit = [-Infinity, Infinity];
            this.ylimit = [-Infinity, Infinity];
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
          setPos(x = this.x, y = this.y) {
            this.x = P.constrain(x, this.xlimit[0], this.xlimit[1]);
            this.y = P.constrain(y, this.ylimit[0], this.ylimit[1]);
            this.xp = x;
            this.yp = y;
          }
          movealong(p) {
            if (!this.clicked) {
              this.setPos(p.x + (this.xp - p.xp), p.y + (this.yp - p.yp));
            }
          }
        }

        let blockX, blockY;
        let lightSource;
        let ip;

        // Physics calculations
        function calculateRefraction(incidentAngle, n1, n2) {
          // Snell's law: n1 * sin(θ1) = n2 * sin(θ2)
          const sinIncident = Math.sin(P.radians(incidentAngle));
          const sinRefracted = (n1 * sinIncident) / n2;

          // Check for total internal reflection
          if (sinRefracted > 1) {
            return null; // Total internal reflection
          }

          return P.degrees(Math.asin(sinRefracted));
        }

        const blockWidth = 550;
        const blockHeight = 120;
        P.setup = () => {
          P.createCanvas(1000, 600);
          // Fixed block size
          blockX = P.width / 2 - blockWidth / 2;
          blockY = P.height / 2 - blockHeight / 2;
          ip = new MovablePoint(P.width / 2 + 100, 100, 50);
          ip.xlimit = [50, P.width - 50];
          ip.ylimit = [50, 210];
          lightSource = ip; // Start offset from center
        };

        P.draw = () => {
          P.background(20, 30, 50); // Dark blue background
          checkClicked([ip]);

          // Fixed block dimensions
          // const blockWidth = 300;
          // const blockHeight = 120;

          // Draw the rectangular glass block
          P.fill(150, 200, 255, 100); // Semi-transparent blue
          P.stroke(255);
          P.strokeWeight(2);
          P.rect(blockX, blockY, blockWidth, blockHeight);

          // Calculate intersection point - FIXED at center of block's top surface
          const blockCenterX = blockX + blockWidth / 2;
          const intersectionX = blockCenterX; // Always hit the center
          const intersectionY = blockY;
          let intersectionPoint = { x: intersectionX, y: intersectionY };

          // Calculate incident angle from light source position to fixed intersection point
          const lightToBlock = P.createVector(
            intersectionX - lightSource.x,
            intersectionY - lightSource.y
          );
          lightToBlock.normalize();

          // Calculate incident angle from the normal
          // Normal points upward (0, -1), incident ray direction is lightToBlock
          const normal = P.createVector(0, -1);

          // Use dot product to get the angle from the normal
          const dotProduct = p5.Vector.dot(lightToBlock, normal);
          const incidentAngleMagnitude = P.degrees(
            Math.acos(Math.abs(dotProduct))
          );

          // Determine sign based on which side of normal the ray is on
          // If lightToBlock.x > 0, ray comes from left side of block (positive angle)
          // If lightToBlock.x < 0, ray comes from right side of block (negative angle)
          const incidentAngleDeg =
            lightToBlock.x > 0
              ? incidentAngleMagnitude
              : -incidentAngleMagnitude;

          // Draw guide light (what would happen without block) - dashed line
          P.stroke(255, 255, 255, 100);
          P.strokeWeight(2);
          P.drawingContext.setLineDash([10, 10]);
          // Extend the line using incident ray direction
          const incidentDirection = P.createVector(
            intersectionX - lightSource.x,
            intersectionY - lightSource.y
          );
          incidentDirection.normalize();
          const extendLength = 300;
          const extendedX = intersectionX + incidentDirection.x * extendLength;
          const extendedY = intersectionY + incidentDirection.y * extendLength;
          P.line(lightSource.x, lightSource.y, extendedX, extendedY);
          P.drawingContext.setLineDash([]); // Reset line dash

          // Draw incident ray
          P.stroke(255, 255, 100);
          P.strokeWeight(3);
          P.line(
            lightSource.x,
            lightSource.y,
            intersectionPoint.x,
            intersectionPoint.y
          );

          // Draw normal line at intersection
          P.stroke(255, 100, 100, 150);
          P.strokeWeight(2);
          P.line(
            intersectionPoint.x,
            intersectionPoint.y - 60,
            intersectionPoint.x,
            intersectionPoint.y + 60
          );

          // Calculate refracted angle
          const refractedAngle = calculateRefraction(
            incidentAngleMagnitude,
            1.0,
            refractiveIndexRef.current
          );

          if (refractedAngle !== null) {
            // Calculate refracted ray direction inside the block
            const incidentDirection = P.createVector(
              intersectionX - lightSource.x,
              intersectionY - lightSource.y
            );
            incidentDirection.normalize();

            // Calculate refracted direction using Snell's law
            // The refracted ray bends toward the normal when entering a denser medium
            const sinIncident = Math.sin(P.radians(incidentAngleMagnitude));
            const sinRefracted = sinIncident / refractiveIndexRef.current;
            const cosRefracted = Math.sqrt(1 - sinRefracted * sinRefracted);

            // Determine refracted direction based on incident direction
            // The refracted ray bends toward the normal
            const refractedDirection = P.createVector(
              Math.sign(incidentAngleDeg) * sinRefracted,
              cosRefracted
            );

            // Calculate exit point (bottom edge of block)
            const exitX =
              intersectionPoint.x +
              (refractedDirection.x * blockHeight) / refractedDirection.y;
            const exitY = blockY + blockHeight;

            P.stroke(100, 255, 100);
            P.strokeWeight(3);
            P.line(intersectionPoint.x, intersectionPoint.y, exitX, exitY);

            // Draw exiting ray (parallel to incident ray due to parallel surfaces)
            const exitDirection = incidentDirection.copy();
            P.stroke(255, 255, 100);
            P.strokeWeight(3);
            P.line(
              exitX,
              exitY,
              exitX + exitDirection.x * 200,
              exitY + exitDirection.y * 200
            );

            // Draw angle arc for incident angle
            P.stroke(255, 200, 200);
            P.strokeWeight(1);
            P.noFill();

            // Draw arc from normal to incident ray
            const normalAngle = -P.PI / 2; // Normal points up (-90 degrees)
            const incidentAngleRad = P.radians(Math.abs(incidentAngleDeg));

            if (incidentAngleDeg < 0) {
              // Ray from left side (positive angle) - arc goes clockwise from normal
              P.arc(
                intersectionPoint.x,
                intersectionPoint.y,
                80,
                80,
                normalAngle,
                normalAngle + incidentAngleRad
              );
            } else {
              // Ray from right side (negative angle) - arc goes counter-clockwise from normal
              P.arc(
                intersectionPoint.x,
                intersectionPoint.y,
                80,
                80,
                normalAngle - incidentAngleRad,
                normalAngle
              );
            }

            // Draw angle arc for refracted angle
            P.stroke(200, 255, 200);
            P.strokeWeight(1);
            P.noFill();

            // Draw arc from normal to refracted ray
            const refractedNormalAngle = P.PI / 2; // Normal points down inside block (90 degrees)
            const refractedAngleRad = P.radians(refractedAngle);

            if (incidentAngleDeg < 0) {
              // Refracted ray going right (same side as incident)
              P.arc(
                intersectionPoint.x,
                intersectionPoint.y,
                60,
                60,
                refractedNormalAngle,
                refractedNormalAngle + refractedAngleRad
              );
            } else {
              // Refracted ray going left (same side as incident)
              P.arc(
                intersectionPoint.x,
                intersectionPoint.y,
                60,
                60,
                refractedNormalAngle - refractedAngleRad,
                refractedNormalAngle
              );
            }

            // Label angles with better positioning
            P.fill(255, 200, 200);
            P.noStroke();
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(12);

            // Position incident angle label based on ray direction
            const incidentLabelX =
              intersectionPoint.x + (incidentAngleDeg < 0 ? -35 : 35);
            const incidentLabelY = intersectionPoint.y - 25;
            P.text(
              `θ₁=${incidentAngleMagnitude.toFixed(1)}°`,
              incidentLabelX,
              incidentLabelY
            );

            P.fill(200, 255, 200);
            // Position refracted angle label based on ray direction
            const refractedLabelX =
              intersectionPoint.x + (incidentAngleDeg < 0 ? -35 : 35);
            const refractedLabelY = intersectionPoint.y + 25;
            P.text(
              `θ₂=${refractedAngle.toFixed(1)}°`,
              refractedLabelX,
              refractedLabelY
            );
          }

          // Draw light source
          ip.show([255, 255, 150], 10);

          // Draw information
          P.fill(255);
          P.textAlign(P.LEFT, P.TOP);
          P.textSize(16);
          P.text("Light Refraction Through Glass Block", 20, 20);

          P.textSize(12);
          P.text(
            `Refractive Index: ${refractiveIndexRef.current.toFixed(2)}`,
            20,
            50
          );
          P.text(
            `Incident Angle: ${incidentAngleMagnitude.toFixed(1)}°`,
            20,
            70
          );

          if (refractedAngle !== null) {
            P.text(`Refracted Angle: ${refractedAngle.toFixed(1)}°`, 20, 90);
          } else {
            P.text("Total Internal Reflection", 20, 90);
          }

          // Instructions
          P.textAlign(P.RIGHT, P.TOP);
          P.text("Drag the yellow light source horizontally", P.width - 20, 20);
          P.text("Yellow: Incident & Exit rays", P.width - 20, 40);
          P.text("Green: Refracted ray inside block", P.width - 20, 60);
          P.text("White dashed: Path without block", P.width - 20, 80);
          P.text("Red: Normal line", P.width - 20, 100);

          // Show Snell's Law
          P.textAlign(P.CENTER, P.BOTTOM);
          P.textSize(14);
          P.text(
            "Snell's Law: n₁sin(θ₁) = n₂sin(θ₂)",
            P.width / 2,
            P.height - 20
          );
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      return () => {
        myP5.remove(); // Clean up on unmount
      };
    });
  }, []);

  useEffect(() => {
    refractiveIndexRef.current = refractiveIndex;
  }, [refractiveIndex]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
