"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";

export default function P5Sketch({
  dlt,
  add,
  srch,
  animSpd,
  actionExicutable,
}) {
  const sketchRef = useRef(null);
  const deleteRef = useRef(dlt);
  const searchRef = useRef(srch);
  const addRef = useRef(add);
  const animSpdRef = useRef(animSpd);
  const actionExicutableRef = useRef(actionExicutable);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        class checker {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.opacity = 0;
            this.hide = false;
            this.col = [0, 0, 255];
            this.shape = [20, 200];
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(this.col[0], this.col[1], this.col[2], this.opacity);
            P.rectMode(P.CORNER);
            P.rect(this.x, this.y, this.shape[0], this.shape[1]);
            P.pop();
          }
        }

        class Box {
          static maxVal = 100;
          static minVal = 0;
          constructor(x = 0, y = 0, val = P.floor(P.random() * 255)) {
            this.x = x;
            this.y = y;
            this.val = val;
            this.digits = val.toString().padStart(3, "0").split("").map(Number);
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.fill(
              P.map(this.val, Box.minVal, Box.maxVal, 255, 50),
              this.opacity
            );
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 100, 30);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.digits[0], this.x - 30, this.y);
            P.text(this.digits[1], this.x, this.y);
            P.text(this.digits[2], this.x + 30, this.y);
          }
        }

        //-----------------------------------------------------------------------------------------------
        function radixSort(arr) {
          for (let i = 0; i < 3; i++) {
            animator.addStage({
              funcName: "check",
            });
            animator.addStage({
              funcName: "sort",
              Args: [arr, 2 - i],
            });
          }
          animator.addStage({
            func: function () {
              return animator.animationSequence([
                animator.to(20, [
                  a2o(checkers[0], checkers[0].x, checkers[0].y - 50, 0),
                ]),
              ]);
            },
          });
        }

        //-----------------------------------------------------------------------------------------------

        function check() {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(50, [a2o(checkers[0], -30, 0, 0)]),
          ]);
        }

        function insert([a]) {
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              a.y -= 50;
            }),
            animator.animate(20, [a2o(a, 0, 50, 255)]),
          ]);
        }

        function swap([a, b]) {
          return animator.animationSequence([
            animator.animate(15, [
              a2o(a, 0, 40, 0),
              a2o(b, 0, -40, 0),
              a2o(checkers[0], 0, 40, 0),
              a2o(checkers[1], 0, -40, 0),
            ]),
            animator.animate(10, [
              a2o(a, P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(b, -P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(checkers[0], P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(checkers[1], -P.abs(animator.initialVal(a.x - b.x)), 0, 0),
            ]),
            animator.animate(15, [
              a2o(a, 0, -40, 0),
              a2o(b, 0, 40, 0),
              a2o(checkers[0], 0, -40, 0),
              a2o(checkers[1], 0, 40, 0),
            ]),
          ]);
        }

        function Sort([arr, id]) {
          const pos = arr
            .map((item, i) => animator.initialVal(item.y, i))
            .sort((a, b) => a - b);
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              console.log(arr);
            }),
            animator.to(
              80,
              arr
                .sort((a, b) => a.digits[id] - b.digits[id])
                .map((item, index) => {
                  return a2o(item, item.x, pos[index], item.opacity);
                })
            ),
            animator.delay(20),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let checkers = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
            sort: Sort,
          };
          checkers[0] = new checker();
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
            checkers[0].x = 550;
            const liveInput = addRef.current.val;
            console.log(liveInput);
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new Box(
                P.width / 2,
                P.height / 2 - 20 * liveInput.length + i * 40,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }
            Box.maxVal = boxes.reduce((max, current) =>
              current.val > max.val ? current : max
            ).val;
            Box.minVal = boxes.reduce((max, current) =>
              current.val < max.val ? current : max
            ).val;

            checkers[0].y = boxes[0].y - 20;
            checkers[0].shape[1] = boxes.length * 40;
            animator.addStage({ funcName: "insert", Args: [checkers[0]] });

            radixSort(boxes);

            addRef.current.start = false;
          }

          boxes.forEach((b) => {
            b.show();
          });
          checkers.forEach((b) => {
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
    deleteRef.current = dlt;
    searchRef.current = srch;
    actionExicutableRef.current = actionExicutable;
    animSpdRef.current = animSpd;
  }, [dlt, add, srch, animSpd, actionExicutable]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
