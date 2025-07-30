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

        let [x, x1, y, y1] = [0, 0, 0, 0];
        let mPos;

        function dampFunc(x, y, y1, k1, k2, t) {
          y = y + t * y1;
          y1 = y1 + (t * (x - y - k1 * y1)) / k2;
          return [y, y1];
        }

        P.setup = () => {
          P.createCanvas(1000, 500);
          P.noStroke();
          mPos = new MovablePoint(P.width / 2, P.height / 2, 30);
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);
          checkClicked([mPos]);
          [x, x1] = dampFunc(
            mPos.x,
            x,
            x1,
            k1reff.current,
            k2reff.current,
            tref.current
          );
          [y, y1] = dampFunc(
            mPos.y,
            y,
            y1,
            k1reff.current,
            k2reff.current,
            tref.current
          );

          // Display the damping function equation
          P.noStroke();
          P.fill(255, 255, 255, 230); // White background with slight transparency

          P.fill(0); // Black text
          P.textAlign(P.LEFT, P.TOP);

          // Main equation
          P.textSize(18);
          P.text("Damping Function:", 30, 35);

          P.textSize(16);
          P.text("y''(t) = 1/k₂ (x(t) - y(t) - k₁y'(t))", 30, 60);

          // Expanded form
          P.textSize(14);
          P.text("Which expands to:", 30, 85);
          P.textSize(16);
          P.text("d²y/dt² = (x(t) - y(t) - k₁(dy/dt))/k₂", 30, 105);

          // Current parameter values
          P.fill(255, 255, 0); // Yellow text for parameters
          P.textSize(14);
          P.text(`k₁ = ${k1reff.current.toFixed(2)}`, 30, 130);
          P.text(`k₂ = ${k2reff.current.toFixed(2)}`, 120, 130);
          P.text(`t = ${tref.current.toFixed(2)}`, 210, 130);

          // Instructions
          P.fill(255, 150);
          P.textSize(20);
          P.textAlign(P.CENTER, P.BOTTOM);
          P.text("drag the green circle", P.width / 2, P.height - 20);

          P.fill(0, 255, 0);
          P.ellipse(mPos.x, mPos.y, 50);
          P.fill(0, 0, 255);
          P.ellipse(x, y, 40);
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
