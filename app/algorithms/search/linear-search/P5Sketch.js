"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";

export default function P5Sketch({ add, srch, animSpd, actionExicutable }) {
  const sketchRef = useRef(null);
  const searchRef = useRef(srch);
  const addRef = useRef(add);
  const animSpdRef = useRef(animSpd);
  const actionExicutableRef = useRef(actionExicutable);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        class box {
          static maxVal = 100;
          static minVal = 0;
          constructor(x = 0, y = 0, val = P.floor(P.random() * 255)) {
            this.x = x;
            this.y = y;
            this.val = val;
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.fill(
              P.map(this.val, box.minVal, box.maxVal, 255, 50),
              this.opacity
            );
            P.rect(this.x, this.y, 60);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x + 30, this.y + 30);
          }
        }

        class arrow {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(0, 0, 255, this.opacity);
            P.rect(this.x, this.y, 60);
            P.pop();
          }
        }
        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [a2o(a, 0, -50, 0)]),
            animator.animate(20, [a2o(a, 0, 50, 255)]),
          ]);
        }

        function check([a]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(70, [a2o(arrows[0], a.x, a.y, 255)]),
          ]);
        }

        function found([a]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(30, [
              a2o(a, 0, -100, 0),
              a2o(arrows[0], 0, -100, 0),
            ]),
            animator.delay(10),
            animator.animate(30, [
              a2o(a, 0, 100, 0),
              a2o(arrows[0], 0, 100, 0),
            ]),
            animator.animate(30, [a2o(arrows[0], 0, 0, -255)]),
            animator.delay(10),
            animator.animateFunc(1, () => {
              arrows[0].x = P.width / 2;
              arrows[0].y = 120;
              arrows[0].opacity = 255;
            }),
          ]);
        }
        function notFound() {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(30, [a2o(arrows[0], 0, -100, 0)]),
            animator.delay(10),
            animator.animate(30, [a2o(arrows[0], 0, 0, -255)]),
            animator.delay(10),
            animator.animateFunc(1, () => {
              arrows[0].x = P.width / 2;
              arrows[0].y = 120;
              arrows[0].opacity = 255;
            }),
          ]);
        }

        function Sort(arr) {
          const pos = arr
            .map((item, i) => animator.initialVal(item.x, i))
            .sort((a, b) => a - b);
          return animator.animationSequence([
            animator.to(
              40,
              arr
                .sort((a, b) => a.val - b.val)
                .map((item, index) => {
                  return a2o(item, pos[index], item.y, item.opacity);
                })
            ),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        function getLinearSearchSteps(arr, searchValue) {
          const steps = [];
          let found = false;

          for (let i = 0; i < arr.length; i++) {
            const crt = arr[i];

            // Add the step to "check" this element
            animator.addStage({ funcName: "check", Args: [crt] });

            if (crt.val === searchValue) {
              // Indicate that we found it
              animator.addStage({ funcName: "found", Args: [crt] });
              found = true;
              break;
            }
          }

          // Optional: indicate not found
          if (!found) {
            animator.addStage({ funcName: "notFound" });
          }

          return steps;
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];
        let animator;

        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            sort: Sort,
            found: found,
            notFound: notFound,
          };
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);
          animator.mainAnimationSequence();
          animator.setDelayMult(animSpdRef.current);

          if (animator.executing) {
            actionExicutableRef.current(false);
          } else {
            actionExicutableRef.current(true);
          }

          if (addRef.current.start && addRef.current.val.length != 0) {
            boxes = [];
            const liveInput = addRef.current.val;
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new box(
                500 - 40 * liveInput.length + i * 80,
                220,
                liveInput[i]
              );
              animator.addStage({
                funcName: "insert",
                Args: [boxes[i]],
              });
            }

            box.maxVal = boxes.reduce((max, obj) =>
              obj.val > max.val ? obj : max
            ).val;
            box.minVal = boxes.reduce((max, obj) =>
              obj.val < max.val ? obj : max
            ).val;

            arrows[0] = new arrow(P.width / 2, 120);
            animator.addStage({
              funcName: "insert",
              Args: [arrows[0]],
            });

            addRef.current.start = false;
          }

          if (searchRef.current.start && boxes.length != 0) {
            animator.standAloneFunc(1, () => {
              getLinearSearchSteps(boxes, searchRef.current.val);
            });
            searchRef.current.start = false;
          }

          boxes.forEach((b) => {
            b.show();
          });
          arrows.forEach((b) => {
            b.show();
          });
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      return () => {
        myP5.remove(); // Clean up on unmount
      };
    });
  }, []);

  useEffect(() => {
    addRef.current = add;
    searchRef.current = srch;
    actionExicutableRef.current = actionExicutable;
    animSpdRef.current = animSpd;
  }, [add, srch, animSpd, actionExicutable]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
