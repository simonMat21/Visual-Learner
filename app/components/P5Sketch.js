"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch({ inputArray }) {
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
        function animate(no_frame, func) {
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
        function animationSequence(a) {
          if (w < a.length && a[w]()) {
            n = 0;
            w++;
            if (w == a.length) {
              w++;
              return 1;
            }
          }
          return 0;
        }

        //------------------------------------------------------------------------------------------------

        function insert(a) {
          return animationSequence([
            () => {
              return animate(1 * delayMult, () => {
                a.opacity = 0;
                a.y -= 50 / (1 * delayMult);
              });
            },
            () => {
              return animate(20 * delayMult, () => {
                a.opacity += 255 / (20 * delayMult);
                a.y += 50 / (20 * delayMult);
              });
            },
          ]);
        }

        function check(a, b) {
          return animationSequence([
            () => {
              return animate(10 * delayMult, () => {});
            },
            () => {
              return animate(70 * delayMult, () => {
                arrows[0].x += initialVal(a, arrows[0], 1) / (70 * delayMult);
                arrows[1].x += initialVal(b, arrows[1], 2) / (70 * delayMult);
              });
            },
          ]);
        }

        function swap(a, b) {
          return animationSequence([
            () => {
              return animate(15 * delayMult, () => {
                a.y += 40 / (15 * delayMult);
                b.y -= 40 / (15 * delayMult);
                arrows[0].y += 40 / (15 * delayMult);
                arrows[1].y -= 40 / (15 * delayMult);
              });
            },
            () => {
              return animate(10 * delayMult, () => {
                a.x += P.abs(initialVal(a, b)) / (10 * delayMult);
                b.x -= P.abs(initialVal(a, b)) / (10 * delayMult);
                arrows[0].x += P.abs(initialVal(a, b)) / (10 * delayMult);
                arrows[1].x -= P.abs(initialVal(a, b)) / (10 * delayMult);
              });
            },
            () => {
              return animate(15 * delayMult, () => {
                a.y -= 40 / (15 * delayMult);
                b.y += 40 / (15 * delayMult);
                arrows[0].y -= 40 / (15 * delayMult);
                arrows[1].y += 40 / (15 * delayMult);
              });
            },
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
                boxes[i] = new box(150 + i * 80, 220, liveInput[i]);
                listOfActions.push(["insert", i]);
              }
              arrows[0] = new arrow(150, 220);
              arrows[1] = new arrow(230, 220);
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
