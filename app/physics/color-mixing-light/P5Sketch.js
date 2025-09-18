"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";

export default function P5Sketch({
  redIntensity = 120,
  greenIntensity = 120,
  blueIntensity = 120,
}) {
  const sketchRef = useRef(null);
  const redIntensityRef = useRef(null);
  const greenIntensityRef = useRef(null);
  const blueIntensityRef = useRef(null);

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
        let lightSize = 200;

        P.setup = () => {
          P.createCanvas(1000, 500);
          P.noStroke();
          c1 = new MovablePoint(P.width / 2, P.height / 2 - 50, 100);
          c2 = new MovablePoint(P.width / 2 - 50, P.height / 2 + 50, 100);
          c3 = new MovablePoint(P.width / 2 + 50, P.height / 2 + 50, 100);
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(0); // Black background for better light visualization
          checkClicked([c1, c2, c3]);

          // Set blend mode for additive color mixing
          P.blendMode(P.ADD);

          // Red light with adjustable intensity
          P.fill(redIntensityRef.current, 0, 0, redIntensityRef.current);
          P.noStroke();
          P.ellipse(c1.x, c1.y, lightSize);

          // Green light with adjustable intensity
          P.fill(0, greenIntensityRef.current, 0, greenIntensityRef.current);
          P.noStroke();
          P.ellipse(c2.x, c2.y, lightSize);

          // Blue light with adjustable intensity
          P.fill(0, 0, blueIntensityRef.current, blueIntensityRef.current);
          P.noStroke();
          P.ellipse(c3.x, c3.y, lightSize);

          // Reset blend mode for UI elements
          P.blendMode(P.BLEND);

          // Draw light source centers (visible handles)
          P.stroke(255);
          P.strokeWeight(2);
          P.fill(255, redIntensityRef.current / 2, redIntensityRef.current / 2);
          P.ellipse(c1.x, c1.y, 20);

          P.fill(
            greenIntensityRef.current / 2,
            255,
            greenIntensityRef.current / 2
          );
          P.ellipse(c2.x, c2.y, 20);

          P.fill(
            blueIntensityRef.current / 2,
            blueIntensityRef.current / 2,
            255
          );
          P.ellipse(c3.x, c3.y, 20);

          // Add labels with intensity indicators
          P.noStroke();
          P.fill(255);
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(12);
          P.text(
            `RED (${Math.round(redIntensityRef.current / 2.55)}%)`,
            c1.x,
            c1.y - 120
          );
          P.text(
            `GREEN (${Math.round(greenIntensityRef.current / 2.55)}%)`,
            c2.x,
            c2.y - 120
          );
          P.text(
            `BLUE (${Math.round(blueIntensityRef.current / 2.55)}%)`,
            c3.x,
            c3.y - 120
          );

          // Instructions
          P.textAlign(P.LEFT, P.TOP);
          P.textSize(16);
          P.fill(255, 255, 255);
          P.text("Drag the colored circles to mix light colors", 20, 20);
          P.textSize(12);
          P.text("• Red + Green = Yellow", 20, 45);
          P.text("• Red + Blue = Magenta", 20, 65);
          P.text("• Green + Blue = Cyan", 20, 85);
          P.text("• Red + Green + Blue = White", 20, 105);

          // Show current mixed color in top right
          let mixedR = Math.min(255, redIntensityRef.current);
          let mixedG = Math.min(255, greenIntensityRef.current);
          let mixedB = Math.min(255, blueIntensityRef.current);

          P.fill(mixedR, mixedG, mixedB);
          P.stroke(255);
          P.strokeWeight(1);
          P.rect(P.width - 150, 20, 100, 40);
          P.fill(255);
          P.noStroke();
          P.textAlign(P.LEFT, P.TOP);
          P.text("Mixed Color:", P.width - 150, 70);
          P.text(
            `RGB(${Math.round(mixedR)}, ${Math.round(mixedG)}, ${Math.round(
              mixedB
            )})`,
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
    redIntensityRef.current = redIntensity;
    greenIntensityRef.current = greenIntensity;
    blueIntensityRef.current = blueIntensity;
  }, [redIntensity, greenIntensity, blueIntensity]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
