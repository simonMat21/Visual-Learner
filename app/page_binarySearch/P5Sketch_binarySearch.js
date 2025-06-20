"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

export default function P5Sketch_binarySearch({
  inputArray,
  searchElement,
  startBool = false,
}) {
  const sketchRef = useRef(null);
  const inputRef = useRef(inputArray);
  const searchElementRef = useRef(searchElement);
  const startAnimation = useRef(startBool);

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

        function insert([a], [b]) {
          return animator.animationSequence([
            animator.animate(1, [[b, 0, -50, 0]]),
            animator.animate(20, [[b, 0, 50, 255]]),
          ]);
        }

        function check([a, ar1]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(70, [
              [
                ar1,
                animator.initialVal(a.x, ar1.x, 1),
                animator.initialVal(a.y, ar1.y, 2),
                0,
              ],
            ]),
          ]);
        }

        function found([a, ar1]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(30, [
              [a, 0, -100, 0],
              [ar1, 0, -100, 0],
            ]),
          ]);
        }
        function notFound([ar1]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(30, [[ar1, 0, -100, 0]]),
          ]);
        }

        function Sort(arr) {
          const pos = arr
            .map((item, i) => animator.initialDiffSeq(item.x, 0, i))
            .sort((a, b) => a - b);
          // sortedArr.sort((a, b) => a.val - b.val);
          // sortedArr = sortedArr.map((item) => item.x);
          // sortedArr = animator.iV(sortedArr, 1);
          return animator.animationSequence([
            animator.to(
              40,
              arr
                .sort((a, b) => a.val - b.val)
                .map((item, index) => {
                  return [item, pos[index], item.y, item.opacity];
                })
            ),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        function getBinarySearchSteps(arr, searchValue) {
          const steps = [];
          let left = 0;
          let right = arr.length - 1;

          while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const crt = arr[mid];

            // Add the step to "check" this element
            steps.push({ funcName: "check", objArgs: [crt.id, 100] });

            if (crt.val === searchValue) {
              // Optionally, indicate that we found it
              steps.push({ funcName: "found", objArgs: [crt.id, 100] });
              break;
            } else if (crt.val < searchValue) {
              left = mid + 1;
            } else {
              right = mid - 1;
            }
          }

          // Optional: indicate not found
          if (steps.length && steps[steps.length - 1].funcName !== "found") {
            steps.push({ funcName: "notFound", objArgs: [100] });
          }

          return steps;
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];

        let listOfActions = [];

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

        let start = false;
        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);
          const liveInput = inputRef.current; // inputRef.current;
          const searchElement = searchElementRef.current; // searchElementRef.current;
          if (startAnimation.current) {
            if (!start) {
              for (let i = 0; i < liveInput.length; i++) {
                boxes[i] = new box(
                  500 - 40 * liveInput.length + i * 80,
                  220,
                  liveInput[i]
                );
                animator.objectIdArray[i] = boxes[i];
                listOfActions.push({
                  funcName: "insert",
                  objArgs: [i],
                  othArgs: [boxes[i]],
                });
              }

              box.maxVal = boxes.reduce((max, obj) =>
                obj.val > max.val ? obj : max
              ).val;
              box.minVal = boxes.reduce((max, obj) =>
                obj.val < max.val ? obj : max
              ).val;

              arrows[0] = new arrow(P.width / 2, 120);
              animator.objectIdArray[100] = arrows[0];
              listOfActions.push({
                funcName: "insert",
                objArgs: [100],
                othArgs: [arrows[0]],
              });
              listOfActions.push({
                funcName: "sort",
                objArgs: Array.from({ length: liveInput.length }, (_, i) => i),
              });

              listOfActions.push(
                ...getBinarySearchSteps(
                  boxes
                    .map((a, i) => ({
                      val: a.val,
                      id: i,
                    }))
                    .sort((a, b) => a.val - b.val),
                  searchElement
                ) // Replace 23 with searchElementRef.current
              );
              start = true;
              console.log(listOfActions);
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
    searchElementRef.current = searchElement;
    startAnimation.current = startBool;
  }, [inputArray, searchElement, startBool]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
