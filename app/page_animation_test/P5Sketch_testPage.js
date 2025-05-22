"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

export default function P5Sketch_testPage({ inputArray }) {
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

        class arrow {
          constructor(p, x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.opacity = 255;
            this.hide = false;
            this.p = p;
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(0, 0, 255, this.opacity);
            P.line(this.p.x, this.p.y + 20, this.x, this.y);
            P.line(this.p.x, this.p.y + 20, this.p.x - 10, this.p.y + 30);
            P.line(this.p.x, this.p.y + 20, this.p.x - 10, this.p.y + 10);
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

        function add(arr) {
          const a = arr.shift();
          const oth = arr;
          console.log(a);
          return animator.animationSequence([
            // animator.animate(1, [[a, 0, 0, -255]]),
            // animator.delay(10),
            animator.animate(
              70,
              arr.map((item) => [item, 80, 0, 0])
            ),
            animator.animate(70, [[a, 100, 100, 255]]),

            // animator.animate(70, [
            //   [arr[0], 80, 0, 0],
            //   [arr[1], 80, 0, 0],
            //   [arr[2], 80, 0, 0],
            // ]),
          ]);
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
            add: add,
          };
        };

        let start = false;
        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);
          const liveInput = [5, 7, 2]; //inputRef.current;
          if (liveInput.length > 0) {
            if (!start) {
              console.log(getMergeSortInstructions(liveInput.length));
              for (let i = 0; i < liveInput.length; i++) {
                boxes[i] = new box(
                  490 - 20 * liveInput.length + i * 60,
                  50,
                  liveInput[i]
                );
                arrows[i] = new arrow(boxes[i], 100, 100);
                animator.objectIdArray[i] = boxes[i];
                listOfActions.push({ funcName: "insert", objArgs: [i] });
              }

              box.maxVal = boxes.reduce((max, obj) =>
                obj.val > max.val ? obj : max
              ).val;
              box.minVal = boxes.reduce((max, obj) =>
                obj.val < max.val ? obj : max
              ).val;

              // listOfActions.push(...getMergeSortInstructions(liveInput.length));

              console.log(listOfActions);

              boxes.push(new box(0, 0, 8));
              animator.objectIdArray[3] = boxes[3];
              listOfActions.push({ funcName: "add", objArgs: [3, 0, 1, 2] });
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
