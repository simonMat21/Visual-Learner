"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch_bubbleSort({ inputArray }) {
  const sketchRef = useRef(null);
  const inputRef = useRef(inputArray);

  useEffect(() => {
    inputRef.current = inputArray;
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        class box {
          constructor(x = 0, y = 0, val = P.floor(P.random() * 255)) {
            this.x = x;
            this.y = y;
            this.col = P.map(val, 0, 100, 255, 0);
            this.val = val;
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.fill(this.col, this.opacity);
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
        let delayMult = 1;
        //------------------------------------------------------------------------------------------------

        let g = [0];
        function initialVal(a, b, id) {
          if (g[id] == 0 || g[id] == undefined) {
            g[id] = a.x - b.x;
          }
          return g[id];
        }

        let n = 0;
        /**
         * does the given function for the given number of frames.
         * @param {number} no_frame - Number of frames to animate for.
         * @param {function} func - Animation function to be executed.
         */
        function sub_animate(no_frame, func) {
          if (n < no_frame) {
            func();
            n++;
            return 0;
          } else {
            g = [0];
            return 1;
          }
        }

        let w = 0;
        /**
         * Takes in an array of animate functions and executes them one after the other.
         * @param {[function]} arr - Array of functions to be executed in sequence.
         */
        function animationSequence(arr) {
          if (w < arr.length && arr[w]()) {
            n = 0;
            w++;
            if (w == arr.length) {
              w++;
              return 1;
            }
          }
          return 0;
        }

        /**
         * Animates the objects in A for the given duration all at the same time.
         * @param {number} duration - Animation time in frames.
         * @param {[object, number, number, number]} A - [object, x, y, opacity].
         */
        function animate(duration, A) {
          return () => {
            return sub_animate(duration * delayMult, () => {
              A.forEach(([a, x, y, opacity]) => {
                a.opacity += opacity / (duration * delayMult);
                a.x += x / (duration * delayMult);
                a.y += y / (duration * delayMult);
              });
            });
          };
        }

        function delay(duration) {
          return () => {
            return sub_animate(duration * delayMult, () => {});
          };
        }
        //------------------------------------------------------------------------------------------------

        function insert(a) {
          return animationSequence([
            animate(1, [[a, 0, -50, 0]]),
            animate(20, [[a, 0, 50, 255]]),
          ]);
        }

        function check(a, b) {
          return animationSequence([
            delay(10),
            animate(70, [
              [arrows[0], initialVal(a, arrows[0], 1), 0, 0],
              [arrows[1], initialVal(b, arrows[1], 2), 0, 0],
            ]),
          ]);
        }

        function swap(a, b) {
          return animationSequence([
            animate(15, [
              [a, 0, 40, 0],
              [b, 0, -40, 0],
              [arrows[0], 0, 40, 0],
              [arrows[1], 0, -40, 0],
            ]),
            animate(10, [
              [a, P.abs(initialVal(a, b)), 0, 0],
              [b, -P.abs(initialVal(a, b)), 0, 0],
              [arrows[0], P.abs(initialVal(a, b)), 0, 0],
              [arrows[1], -P.abs(initialVal(a, b)), 0, 0],
            ]),
            animate(15, [
              [a, 0, -40, 0],
              [b, 0, 40, 0],
              [arrows[0], 0, -40, 0],
              [arrows[1], 0, 40, 0],
            ]),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        let aniCount = 0;
        function mainAnimationSequence(arr) {
          if (aniCount < arr.length && arr[aniCount][0] == "insert") {
            if (aniCount < arr.length && insert(boxes[arr[aniCount][1]])) {
              w = 0;
              aniCount++;
            }
          } else if (
            aniCount < arr.length &&
            arr[aniCount][0] == "insert_arrow"
          ) {
            if (aniCount < arr.length && insert(arrows[arr[aniCount][1]])) {
              w = 0;
              aniCount++;
            }
          } else if (aniCount < arr.length && arr[aniCount][0] == "check") {
            if (
              aniCount < arr.length &&
              check(boxes[arr[aniCount][1]], boxes[arr[aniCount][2]])
            ) {
              w = 0;
              aniCount++;
            }
          } else if (aniCount < arr.length && arr[aniCount][0] == "swap") {
            if (
              aniCount < arr.length &&
              swap(boxes[arr[aniCount][1]], boxes[arr[aniCount][2]])
            ) {
              w = 0;
              aniCount++;
            }
          }
        }

        //------------------------------------------------------------------------------------------------

        function bubbleSort(arr) {
          let yt = [];
          let n = arr.length;
          for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1 - i; j++) {
              yt.push(["check", arr[j].id, arr[j + 1].id]);
              if (arr[j].ele > arr[j + 1].ele) {
                yt.push(["swap", arr[j].id, arr[j + 1].id]);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              }
            }
          }
          return yt;
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];

        let listOfActions = [];

        P.setup = () => {
          P.createCanvas(1000, 500);
        };

        let start = false;
        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);
          const liveInput = inputRef.current;
          if (liveInput.length > 0) {
            if (!start) {
              for (let i = 0; i < liveInput.length; i++) {
                boxes[i] = new box(
                  500 - 40 * liveInput.length + i * 80,
                  220,
                  liveInput[i]
                );
                listOfActions.push(["insert", i]);
              }
              arrows[0] = new arrow(500 - 40 * liveInput.length, 220);
              arrows[1] = new arrow(500 - 40 * liveInput.length + 80, 220);
              listOfActions.push(["insert_arrow", 0]);
              listOfActions.push(["insert_arrow", 1]);
              listOfActions = listOfActions.concat(
                bubbleSort(
                  liveInput.map((item, index) => ({ ele: item, id: index }))
                )
              );

              console.log(listOfActions);

              start = true;
            }
            mainAnimationSequence(listOfActions);
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
