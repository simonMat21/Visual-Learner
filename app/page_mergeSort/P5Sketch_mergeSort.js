"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

export default function P5Sketch_mergeSort({ inputArray }) {
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
            P.rect(this.x, this.y, 40);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x + 20, this.y + 20);
          }
        }
        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [[a, 0, -50, 0]]),
            animator.animate(20, [[a, 0, 50, 255]]),
          ]);
        }

        function merge1(arr, [d]) {
          const pos = arr
            .map((item, i) =>
              i < Math.floor(arr.length / 2)
                ? animator.initialVal(item.x + 150 / d, 0, i)
                : animator.initialVal(item.x - 150 / d, 0, i)
            )
            .sort((a, b) => a - b);
          arr.sort((a, b) => a.val - b.val);
          const transformed = arr.map((item, i) => [
            item,
            i < Math.floor(arr.length / 2)
              ? animator.initialVal(pos[i], item.x, (i + 1) * 20)
              : animator.initialVal(pos[i], item.x, (i + 1) * 20),
            d == 1 ? -70 : -90,
            0,
          ]);

          return animator.animationSequence([
            animator.delay(10),
            animator.animate(70, transformed),
          ]);
        }

        let q = true;
        function merge(arr, [d]) {
          const pos = arr
            .map((item, i) =>
              i < Math.floor(arr.length / 2)
                ? animator.initialValSeq(item.x + 150 / d, 0, i)
                : animator.initialValSeq(item.x - 150 / d, 0, i)
            )
            .sort((a, b) => a - b);
          arr.sort((a, b) => a.val - b.val);
          return animator.animationSequence([
            animator.delay(10),
            ...arr.map((item, i) =>
              animator.animate(70, [
                [
                  item,
                  i < Math.floor(arr.length / 2)
                    ? animator.initialVal(pos[i], item.x, (i + 1) * 20)
                    : animator.initialVal(pos[i], item.x, (i + 1) * 20),
                  d == 1 ? -70 : -90,
                  0,
                ],
              ])
            ),
          ]);
        }

        function div(arr, [d]) {
          const transformed = arr.map((val, i) => [
            val,
            i < Math.floor(arr.length / 2) ? -150 / d : 150 / d,
            d == 1 ? 70 : 90,
            0,
          ]);

          return animator.animationSequence([
            animator.delay(10),
            animator.animate(70, transformed),
            //animator.animate(70, transformed2),
          ]);
        }

        function swap([a, b]) {
          return animator.animationSequence([
            animator.animate(15, [
              [a, 0, 40, 0],
              [b, 0, -40, 0],
              [arrows[0], 0, 40, 0],
              [arrows[1], 0, -40, 0],
            ]),
            animator.animate(10, [
              [a, P.abs(animator.initialVal(a, b)), 0, 0],
              [b, -P.abs(animator.initialVal(a, b)), 0, 0],
              [arrows[0], P.abs(animator.initialVal(a, b)), 0, 0],
              [arrows[1], -P.abs(animator.initialVal(a, b)), 0, 0],
            ]),
            animator.animate(15, [
              [a, 0, -40, 0],
              [b, 0, 40, 0],
              [arrows[0], 0, -40, 0],
              [arrows[1], 0, 40, 0],
            ]),
          ]);
        }

        //------------------------------------------------------------------------------------------------
        function getMergeSortInstructions(n) {
          const instructions = [];
          const array = Array.from({ length: n }, (_, i) => i);

          function mergeSort(arr, depth = 1) {
            if (arr.length <= 1) return arr;

            instructions.push({
              funcName: "div",
              objArgs: [...arr],
              othArgs: [depth],
            });

            const mid = Math.floor(arr.length / 2);
            const left = arr.slice(0, mid);
            const right = arr.slice(mid);

            const sortedLeft = mergeSort(left, depth + 1);
            const sortedRight = mergeSort(right, depth + 1);

            const merged = merge(sortedLeft, sortedRight);
            instructions.push({
              funcName: "merge",
              objArgs: [...merged],
              othArgs: [depth],
            });

            return merged;
          }

          function merge(left, right) {
            // Just concatenate indices for visualization — no actual sorting
            return [...left, ...right];
          }

          mergeSort(array);
          return instructions;
        }

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
            div: div,
            merge: merge,
          };
        };

        let start = false;
        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);
          const liveInput = inputRef.current; //inputRef.current;
          if (liveInput.length > 0) {
            if (!start) {
              console.log(getMergeSortInstructions(liveInput.length));
              for (let i = 0; i < liveInput.length; i++) {
                boxes[i] = new box(
                  490 - 20 * liveInput.length + i * 40,
                  50,
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
              // listOfActions.push(...generateAnimationSequence(liveInput));
              listOfActions.push(
                // {
                //   funcName: "div",
                //   objArgs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                //   othArgs: [1],
                // },
                // { funcName: "div", objArgs: [0, 1, 2, 3, 4], othArgs: [2] },
                // { funcName: "div", objArgs: [0, 1], othArgs: [3] },
                // { funcName: "merge", objArgs: [0, 1], othArgs: [3] },
                // { funcName: "div", objArgs: [2, 3, 4], othArgs: [3] },
                // { funcName: "div", objArgs: [3, 4], othArgs: [4] },
                // { funcName: "merge", objArgs: [3, 4], othArgs: [4] },
                // { funcName: "merge", objArgs: [2, 4, 3], othArgs: [3] },
                // { funcName: "merge", objArgs: [0, 1, 4, 2, 3], othArgs: [2] },
                // { funcName: "div", objArgs: [5, 6, 7, 8, 9], othArgs: [2] },
                // { funcName: "div", objArgs: [5, 6], othArgs: [3] },
                // { funcName: "merge", objArgs: [5, 6], othArgs: [3] },
                // { funcName: "div", objArgs: [7, 8, 9], othArgs: [3] },
                // { funcName: "div", objArgs: [8, 9], othArgs: [4] },
                // { funcName: "merge", objArgs: [8, 9], othArgs: [4] },
                // { funcName: "merge", objArgs: [7, 9, 8], othArgs: [3] },
                // { funcName: "merge", objArgs: [5, 6, 7, 9, 8], othArgs: [2] },
                // {
                //   funcName: "merge",
                //   objArgs: [0, 1, 4, 2, 3, 7, 5, 6, 9, 8],
                //   othArgs: [1],
                // }
                ...getMergeSortInstructions(liveInput.length)
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
