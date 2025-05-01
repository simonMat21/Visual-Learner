"use client";

import React, { useRef, useEffect } from "react";

export default function P5Sketch() {
  const sketchRef = useRef(null);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (p) => {
        class box {
          constructor(x = 0, y = 0, col = 200) {
            this.x = x;
            this.y = y;
            this.col = col;
          }

          show() {
            p.fill(this.col);
            p.rect(this.x, this.y, 60);
            p.fill(255, 105, 0);
            p.strokeWeight(3);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(20);
            p.text(255 - this.col, this.x + 30, this.y + 30);
          }
        }

        class arrow {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
          }

          show() {
            p.push();
            p.noFill();
            p.strokeWeight(3);
            p.stroke(0, 0, 255);
            p.rect(this.x, this.y, 60);
            p.pop();
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
                a.x += p.abs(initialVal(a, b)) / (10 * delayMult);
                b.x -= p.abs(initialVal(a, b)) / (10 * delayMult);
                arrows[0].x += p.abs(initialVal(a, b)) / (10 * delayMult);
                arrows[1].x -= p.abs(initialVal(a, b)) / (10 * delayMult);
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

        let P = 0;
        function mainAnimationSequence(arr) {
          if (P < arr.length && arr[P][2] == "check") {
            if (P < arr.length && check(boxes[arr[P][0]], boxes[arr[P][1]])) {
              w = 0;
              P++;
            }
          } else if (P < arr.length && arr[P][2] == "swap") {
            if (P < arr.length && swap(boxes[arr[P][0]], boxes[arr[P][1]])) {
              w = 0;
              P++;
            }
          }
        }

        //------------------------------------------------------------------------------------------------

        function bubbleSort(arr) {
          let yt = [];
          let n = arr.length;
          for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - 1 - i; j++) {
              yt.push([arr[j].id, arr[j + 1].id, "check"]);
              if (arr[j].ele < arr[j + 1].ele) {
                yt.push([arr[j].id, arr[j + 1].id, "swap"]);
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              }
            }
          }
          return yt;
        }

        function insertionSort(arr) {
          let yt = [];
          let n = arr.length;

          for (let i = 1; i < n; i++) {
            let j = i;

            // Compare with previous elements
            while (j > 0) {
              yt.push([arr[j].id, arr[j - 1].id, "check"]);

              if (arr[j - 1].ele < arr[j].ele) {
                yt.push([arr[j - 1].id, arr[j].id, "swap"]);
                // Actual data swap
                [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
                j--; // Continue checking further left
              } else {
                break; // No more moves needed
              }
            }
          }

          return yt;
        }

        function selectionSort(arr) {
          let yt = [];
          let n = arr.length;

          for (let i = 0; i < n - 1; i++) {
            let maxIdx = i;

            for (let j = i + 1; j < n; j++) {
              yt.push([arr[j].id, arr[maxIdx].id, "check"]);
              if (arr[j].ele > arr[maxIdx].ele) {
                maxIdx = j;
              }
            }

            if (maxIdx !== i) {
              yt.push([arr[i].id, arr[maxIdx].id, "check"]);
              yt.push([arr[i].id, arr[maxIdx].id, "swap"]);
              [arr[i], arr[maxIdx]] = [arr[maxIdx], arr[i]];
            }
          }

          return yt;
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];

        p.setup = () => {
          p.createCanvas(1000, 500);
          for (let i = 0; i < 8; i++) {
            boxes[i] = new box(150 + i * 80, 150, p.floor(p.random() * 255));
          }
          arrows[0] = new arrow(150, 150);
          arrows[1] = new arrow(230, 150);

          console.log(
            selectionSort(
              boxes.map((item, index) => {
                return { ele: item.col, id: index };
              })
            )
          );
        };

        let x = 0;
        let y = 0;
        p.draw = () => {
          p.frameRate(60);
          mainAnimationSequence(
            bubbleSort(
              boxes.map((item, index) => {
                return { ele: item.col, id: index };
              })
            )
          );

          p.background(220);

          boxes.forEach((i) => {
            i.show();
          });
          arrows.forEach((i) => {
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

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
