"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "../components/Tideon";

export default function P5Sketch_quickSort({
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
            P.rect(this.x, this.y, 60);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(25);
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

        class pointer {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.push();
            P.fill(0, 0, 255, this.opacity);
            P.strokeWeight(3);
            P.stroke(0, 0, 255, this.opacity);
            P.triangle(
              this.x,
              this.y - 5,
              this.x - 5,
              this.y - 15,
              this.x + 5,
              this.y - 15
            );
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

        function check([a, b, ar1, ar2]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(70, [a2o(ar1, a.x, a.y, 255), a2o(ar2, b.x, b.y, 255)]),
          ]);
        }

        function swap([a, b]) {
          return animator.animationSequence([
            animator.animate(15, [a2o(a, 0, 40, 0), a2o(b, 0, -40, 0)]),
            animator.animate(10, [
              a2o(a, P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(b, -P.abs(animator.initialVal(a.x - b.x)), 0, 0),
            ]),
            animator.animate(15, [a2o(a, 0, -40, 0), a2o(b, 0, 40, 0)]),
          ]);
        }
        function depth(arr) {
          return animator.animationSequence([
            animator.animate(
              20,
              arr.map((item) => a2o(item, 0, 60, 0))
            ),
          ]);
        }

        function comeBack(arr) {
          return animator.animationSequence([
            animator.to(
              40,
              arr.map((item) => a2o(item, item.x, 200, item.opacity))
            ),
          ]);
        }

        function pointTo([a, ptr]) {
          return animator.animationSequence([
            animator.to(20, [a2o(ptr, a.x + 30, a.y - 25, 255)]),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        function getQuickSortInstructions(arr) {
          let yt = [];

          function partition(arr, start, end) {
            animator.addStage({
              funcName: "depth",
              Args: arr.slice(start, end + 1),
            });
            let i = start;
            animator.addStage({
              funcName: "pointTo",
              Args: [arr[i], pointers[0]],
            });

            for (let j = start; j < end; j++) {
              animator.addStage({
                funcName: "check",
                Args: [arr[j], arr[end], arrows[0], arrows[1]],
              });

              if (arr[j].val < arr[end].val) {
                animator.addStage({
                  funcName: "swap",
                  Args: [arr[i], arr[j]],
                });

                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
                animator.addStage({
                  funcName: "pointTo",
                  Args: [arr[i], pointers[0]],
                });
              }
            }

            // Final pivot swap
            animator.addStage({
              funcName: "swap",
              Args: [arr[i], arr[end]],
            });
            [arr[i], arr[end]] = [arr[end], arr[i]];

            return i;
          }

          function quick_sort(arr, start = 0, end = arr.length - 1) {
            if (start < end) {
              const p = partition(arr, start, end);
              quick_sort(arr, start, p - 1);
              quick_sort(arr, p + 1, end);
            }
          }
          quick_sort(arr);
          console.log(arr);
          animator.addStage({
            funcName: "comeBack",
            Args: [...arr, arrows[0], arrows[1], pointers[0]],
          });
          return yt;
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];
        let pointers = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          // animator.delayMult = 0.5;
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
            depth: depth,
            comeBack: comeBack,
            pointTo: pointTo,
          };
        };

        let start = false;
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
                500 - 40 * liveInput.length + i * 80,
                50,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }

            Box.maxVal = boxes.reduce((max, obj) =>
              obj.val > max.val ? obj : max
            ).val;
            Box.minVal = boxes.reduce((max, obj) =>
              obj.val < max.val ? obj : max
            ).val;

            arrows[0] = new arrow(500 - 40 * liveInput.length, 50);
            arrows[1] = new arrow(500 - 40 * liveInput.length + 80, 50);
            pointers[0] = new pointer(500 - 40 * liveInput.length + 40, 20);
            animator.addStage({ funcName: "insert", Args: [arrows[0]] });
            animator.addStage({ funcName: "insert", Args: [arrows[1]] });
            animator.addStage({ funcName: "insert", Args: [pointers[0]] });
            animator.standAloneFunc(1, () => {
              getQuickSortInstructions(boxes);
            });
            addRef.current.start = false;
          }

          boxes.forEach((i) => {
            i.show();
          });
          arrows.forEach((i) => {
            i.show();
          });
          pointers.forEach((i) => {
            i.show();
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
