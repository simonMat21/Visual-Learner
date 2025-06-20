"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator2";

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
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(this.col[0], this.col[1], this.col[2], this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40);
            P.pop();
          }
        }

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
        function heapSort(arr) {
          const n = arr.length;

          // Heapify subtree rooted at index i
          function heapify(arr, n, i) {
            let largest = i; // Initialize largest as root
            const left = 2 * i + 1; // left child index
            const right = 2 * i + 2; // right child index

            // If left child is larger than root
            if (left < n && arr[left] > arr[largest]) {
              largest = left;
            }

            // If right child is larger than largest so far
            if (right < n && arr[right] > arr[largest]) {
              largest = right;
            }

            // If largest is not root
            if (largest !== i) {
              [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap

              animator.addStage({
                funcName: "swap",
                Args: [boxes[i], boxes[largest]],
              });
              animator.addStage({
                func: function () {
                  return animator.animationSequence([
                    animator.animateFunc(1, () => {
                      [boxes[i], boxes[largest]] = [boxes[largest], boxes[i]];
                    }),
                  ]);
                },
              });

              // Recursively heapify the affected sub-tree
              heapify(arr, n, largest);
            }
          }

          // Build max heap
          for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
          }

          // One by one extract elements from heap
          for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]]; // Swap current root with end
            animator.addStage({
              funcName: "swap",
              Args: [boxes[i], boxes[0]],
            });
            animator.addStage({
              func: function () {
                return animator.animationSequence([
                  animator.animateFunc(1, () => {
                    [boxes[i], boxes[0]] = [boxes[0], boxes[i]];
                  }),
                ]);
              },
            });
            heapify(arr, i, 0); // call max heapify on the reduced heap
          }

          return arr;
        }

        function heapSortByVal(arr) {
          const n = arr.length;

          function heapify(arr, n, i) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && arr[left].val > arr[largest].val) {
              largest = left;
            }

            if (right < n && arr[right].val > arr[largest].val) {
              largest = right;
            }

            if (largest !== i) {
              [arr[i], arr[largest]] = [arr[largest], arr[i]];
              animator.addStage({
                funcName: "swap",
                Args: [arr[i], arr[largest]],
              });
              heapify(arr, n, largest);
            }
          }

          // Build max heap
          for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
          }

          // Heap sort
          for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            animator.addStage({
              funcName: "swap",
              Args: [arr[0], arr[i]],
            });
            // animator.addStage({
            //   func: function () {
            //     return animator.animationSequence([
            //       animator.animateFunc(1, () => {
            //         [boxes[i], boxes[largest]] = [boxes[largest], boxes[i]];
            //       }),
            //     ]);
            //   },
            // });
            heapify(arr, i, 0);
          }

          return arr;
        }

        //-----------------------------------------------------------------------------------------------

        function check(_, [a, ckr]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(40, [{ obj: ckr, x: a.x, y: a.y }]),
          ]);
        }

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [{ obj: a, changes: { y: -50 } }]),
            animator.animate(20, [
              { obj: a, changes: { y: 50, opacity: 255 } },
            ]),
          ]);
        }

        function swap([a, b]) {
          return animator.animationSequence([
            animator.animate(15, [
              { obj: a, changes: { y: 40 } },
              { obj: b, changes: { y: -40 } },
              // [arrows[0], 0, 40, 0],
              // [arrows[1], 0, -40, 0],
            ]),
            animator.to(10, [
              {
                obj: a,
                changes: { x: animator.initialVal(b.x, 0) },
              },
              {
                obj: b,
                changes: { x: animator.initialVal(a.x, 1) },
              },
              // [arrows[0], P.abs(animator.initialVal(a.x, b.x)), 0, 0],
              // [arrows[1], -P.abs(animator.initialVal(a.x, b.x)), 0, 0],
            ]),
            animator.animate(15, [
              { obj: a, changes: { y: -40 } },
              { obj: b, changes: { y: 40 } },
              // [arrows[0], 0, -40, 0],
              // [arrows[1], 0, 40, 0],
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

          if (addRef.current.start) {
            const liveInput = [3, 8, 5, 7, 1, 9, 10, 7, 3, 9, 2, 6];
            for (let i = 0; i < liveInput.length; i++) {
              console.log("hi");
              boxes[i] = new box(
                P.width / 2 - 20 * liveInput.length + i * 40,
                100,
                liveInput[i]
              );
              animator.objectIdArray[i] = boxes[i];
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
              // listOfActions.push({ funcName: "insert", objArgs: [i] });
            }
            box.maxVal = boxes.reduce((max, obj) =>
              obj.val > max.val ? obj : max
            ).val;
            box.minVal = boxes.reduce((max, obj) =>
              obj.val < max.val ? obj : max
            ).val;
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            console.log(heapSortByVal(boxes));
            // console.log(
            //   heapSortByVal(boxes.map((item) => ({ val: item.val, obj: item })))
            // );
            // console.log(heapSort([3, 8, 5, 7, 1, 9, 10, 7, 3, 9, 2, 6]));
            deleteRef.current.add = false;
          }

          if (searchRef.current.start) {
            searchRef.current.add = false;
          }

          checkers.forEach((i) => i.show());
          boxes.forEach((i) => i.show());
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
