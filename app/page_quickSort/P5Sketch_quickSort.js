"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

export default function P5Sketch_quickSort({ inputArray }) {
  const sketchRef = useRef(null);
  const inputRef = useRef(inputArray);

  useEffect(() => {
    inputRef.current = inputArray;
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
        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [[a, 0, -50, 0]]),
            animator.animate(20, [[a, 0, 50, 255]]),
          ]);
        }

        function check([a, b, ar1, ar2]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(70, [
              [ar1, animator.initialVal(a.x, ar1.x, 1), 0, 0],
              [ar2, animator.initialVal(b.x, ar2.x, 2), 0, 0],
            ]),
          ]);
        }

        function swap([a, b]) {
          return animator.animationSequence([
            animator.animate(15, [
              [a, 0, 40, 0],
              [b, 0, -40, 0],
              // [arrows[0], 0, 40, 0],
              // [arrows[1], 0, -40, 0],
            ]),
            animator.animate(10, [
              [a, P.abs(animator.initialVal(a.x, b.x)), 0, 0],
              [b, -P.abs(animator.initialVal(a.x, b.x)), 0, 0],
              // [arrows[0], P.abs(animator.initialVal(a.x, b.x)), 0, 0],
              // [arrows[1], -P.abs(animator.initialVal(a.x, b.x)), 0, 0],
            ]),
            animator.animate(15, [
              [a, 0, -40, 0],
              [b, 0, 40, 0],
              // [arrows[0], 0, -40, 0],
              // [arrows[1], 0, 40, 0],
            ]),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        function getQuickSortInstructions(arr) {
          let yt = [];

          function partition(arr, start, end) {
            let i = start;

            for (let j = start; j < end; j++) {
              yt.push({
                funcName: "check",
                objArgs: [arr[j].id, arr[end].id, 100, 101],
              });

              if (arr[j].ele < arr[end].ele) {
                yt.push({
                  funcName: "swap",
                  objArgs: [arr[i].id, arr[j].id],
                });

                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
              }
            }

            // Final pivot swap
            yt.push({
              funcName: "swap",
              objArgs: [arr[i].id, arr[end].id],
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
          return yt;
        }
        console.log(
          getQuickSortInstructions(
            [8, 4, 7, 3, 10, 2, 1].map((item, index) => ({
              ele: item,
              id: index,
            }))
          )
        );

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];

        let listOfActions = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          // animator.delayMult = 0.5;
          animator.funtionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
          };
        };

        let start = false;
        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);
          const liveInput = inputRef.current; //inputRef.current;
          if (liveInput.length > 0) {
            if (!start) {
              for (let i = 0; i < liveInput.length; i++) {
                boxes[i] = new box(
                  500 - 40 * liveInput.length + i * 80,
                  220,
                  liveInput[i]
                );
                animator.objectIdArray[i] = boxes[i];
                listOfActions.push({ funcName: "insert", objArgs: [i] });
              }

              box.maxVal = boxes.reduce((max, obj) =>
                obj.val > max.val ? obj : max
              ).val;
              box.minVal = boxes.reduce((max, obj) =>
                obj.val < max.val ? obj : max
              ).val;

              arrows[0] = new arrow(500 - 40 * liveInput.length, 220);
              arrows[1] = new arrow(500 - 40 * liveInput.length + 80, 220);
              animator.objectIdArray[100] = arrows[0];
              animator.objectIdArray[101] = arrows[1];
              listOfActions.push({ funcName: "insert", objArgs: [100] });
              listOfActions.push({ funcName: "insert", objArgs: [101] });
              listOfActions.push(
                ...getQuickSortInstructions(
                  liveInput.map((item, index) => ({
                    ele: item,
                    id: index,
                  }))
                )
              );

              console.log(listOfActions);

              start = true;
            }
            animator.mainAnimationSequence(listOfActions);
            boxes.forEach((i) => {
              i.show();
            });
            arrows.forEach((i) => {
              i.show();
            });
          }
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      return () => {
        myP5.remove(); // Clean up on unmount
      };
    });
  }, []);

  useEffect(() => {
    inputRef.current = inputArray;
  }, [inputArray]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
