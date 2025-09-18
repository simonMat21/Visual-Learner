"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";

export default function P5Sketch({
  cyanIntensity = 120,
  magentaIntensity = 120,
  yellowIntensity = 120,
}) {
  const sketchRef = useRef(null);
  const cyanIntensityRef = useRef(null);
  const magentaIntensityRef = useRef(null);
  const yellowIntensityRef = useRef(null);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        /*contains the class and the checkClick function*/
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

        let c1, c2, c3;
        let pigmentSize = 200;

        P.setup = () => {
          P.createCanvas(1000, 500);
          P.noStroke();
          c1 = new MovablePoint(P.width / 2, P.height / 2 - 50, 100);
          c2 = new MovablePoint(P.width / 2 - 50, P.height / 2 + 50, 100);
          c3 = new MovablePoint(P.width / 2 + 50, P.height / 2 + 50, 100);
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(255); // White background for pigment visualization
          checkClicked([c1, c2, c3]);

          // Set blend mode for subtractive color mixing
          P.blendMode(P.MULTIPLY);

          // Cyan pigment with adjustable intensity
          let cyanAlpha = P.map(cyanIntensityRef.current, 0, 255, 0, 255);
          P.fill(0, 255, 255, cyanAlpha);
          P.noStroke();
          P.ellipse(c1.x, c1.y, pigmentSize);

          // Magenta pigment with adjustable intensity
          let magentaAlpha = P.map(magentaIntensityRef.current, 0, 255, 0, 255);
          P.fill(255, 0, 255, magentaAlpha);
          P.noStroke();
          P.ellipse(c2.x, c2.y, pigmentSize);

          // Yellow pigment with adjustable intensity
          let yellowAlpha = P.map(yellowIntensityRef.current, 0, 255, 0, 255);
          P.fill(255, 255, 0, yellowAlpha);
          P.noStroke();
          P.ellipse(c3.x, c3.y, pigmentSize);

          // Reset blend mode for UI elements
          P.blendMode(P.BLEND);

          // Draw pigment source centers (visible handles)
          P.stroke(100);
          P.strokeWeight(2);
          P.fill(0, 200, 200); // Cyan handle
          P.ellipse(c1.x, c1.y, 20);

          P.fill(200, 0, 200); // Magenta handle
          P.ellipse(c2.x, c2.y, 20);

          P.fill(200, 200, 0); // Yellow handle
          P.ellipse(c3.x, c3.y, 20);

          // Add labels with intensity indicators
          P.noStroke();
          P.fill(50);
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(12);
          P.text(
            `CYAN (${Math.round(cyanIntensityRef.current / 2.55)}%)`,
            c1.x,
            c1.y - 120
          );
          P.text(
            `MAGENTA (${Math.round(magentaIntensityRef.current / 2.55)}%)`,
            c2.x,
            c2.y - 120
          );
          P.text(
            `YELLOW (${Math.round(yellowIntensityRef.current / 2.55)}%)`,
            c3.x,
            c3.y - 120
          );

          // Instructions
          P.textAlign(P.LEFT, P.TOP);
          P.textSize(16);
          P.fill(50);
          P.text("Drag the colored circles to mix pigment colors", 20, 20);
          P.textSize(12);
          P.text("• Cyan + Magenta = Blue", 20, 45);
          P.text("• Cyan + Yellow = Green", 20, 65);
          P.text("• Magenta + Yellow = Red", 20, 85);
          P.text("• Cyan + Magenta + Yellow = Black", 20, 105);

          // Show current mixed color in top right
          // Simulate subtractive mixing for display
          let mixedR =
            255 -
            Math.min(
              255,
              cyanIntensityRef.current + magentaIntensityRef.current
            );
          let mixedG =
            255 -
            Math.min(
              255,
              cyanIntensityRef.current + yellowIntensityRef.current
            );
          let mixedB =
            255 -
            Math.min(
              255,
              magentaIntensityRef.current + yellowIntensityRef.current
            );

          // Ensure we don't go below 0
          mixedR = Math.max(
            0,
            255 - cyanIntensityRef.current - magentaIntensityRef.current * 0.7
          );
          mixedG =
            255 -
            Math.min(
              255,
              magentaIntensityRef.current + yellowIntensityRef.current * 0.7
            );
          mixedB =
            255 -
            Math.min(
              255,
              cyanIntensityRef.current + yellowIntensityRef.current * 0.7
            );

          P.fill(mixedR, mixedG, mixedB);
          P.stroke(100);
          P.strokeWeight(1);
          P.rect(P.width - 150, 20, 100, 40);
          P.fill(50);
          P.noStroke();
          P.textAlign(P.LEFT, P.TOP);
          P.text("Mixed Pigment:", P.width - 150, 70);
          P.text(
            `CMY(${Math.round(cyanIntensityRef.current)}, ${Math.round(
              magentaIntensityRef.current
            )}, ${Math.round(yellowIntensityRef.current)})`,
            P.width - 150,
            85
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
    cyanIntensityRef.current = cyanIntensity;
    magentaIntensityRef.current = magentaIntensity;
    yellowIntensityRef.current = yellowIntensity;
  }, [cyanIntensity, magentaIntensity, yellowIntensity]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
