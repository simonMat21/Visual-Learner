"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "../components/Tideon";

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
            this.shape = [60, 60];
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(this.col[0], this.col[1], this.col[2], this.opacity);
            P.rectMode(P.CENTER);
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
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.fill(
              P.map(this.val, Box.minVal, Box.maxVal, 255, 50),
              this.opacity
            );
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 60);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x, this.y);
          }
        }

        //-----------------------------------------------------------------------------------------------
        function bubbleSort(arr) {
          let yt = [];
          let n = arr.length;
          for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1 - i; j++) {
              animator.addStage({
                funcName: "check",
                Args: [arr[j], arr[j + 1]],
              });

              if (arr[j].val > arr[j + 1].val) {
                animator.addStage({
                  funcName: "swap",
                  Args: [arr[j], arr[j + 1]],
                });
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              }
            }
          }
          return yt;
        }

        //-----------------------------------------------------------------------------------------------

        function check([a, b]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(50, [
              a2o(checkers[0], a.x, a.y, 255),
              a2o(checkers[1], b.x, b.y, 255),
            ]),
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
          };
          checkers[0] = new checker();
          checkers[1] = new checker();
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          animator.mainAnimationSequence();
          animator.setDelayMult(animSpdRef.current);

          if (animator.executing) {
            actionExicutable(false);
          } else {
            actionExicutable(true);
          }

          if (addRef.current.start && addRef.current.val.length != 0) {
            boxes = [];
            const liveInput = addRef.current.val;
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new Box(
                P.width / 2 - 40 * liveInput.length + i * 80,
                220,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }
            checkers[0].x = boxes[0].x;
            checkers[0].y = boxes[0].y;
            checkers[0].opacity = 0;
            animator.addStage({ funcName: "insert", Args: [checkers[0]] });
            checkers[1].x = boxes[1].x;
            checkers[1].y = boxes[1].y;
            checkers[1].opacity = 0;
            animator.addStage({ funcName: "insert", Args: [checkers[1]] });

            bubbleSort(boxes);

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
    animSpdRef.current = animSpd;
  }, [dlt, add, srch, animSpd]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
