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
            this.shape = [40, 40];
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
            P.push();
            P.noStroke();

            P.fill(
              P.map(this.val, Box.minVal, Box.maxVal, 255, 50),
              this.opacity
            );
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x, this.y);
            P.pop();
          }
        }

        class HT_box {
          constructor(val, x, y, op) {
            this.val = val;
            this.count = 0;
            this.x = x;
            this.y = y;
            this.opacity = op;
          }
          show() {
            P.push();
            //---------rect---------
            P.stroke(0, 0, 0, this.opacity);

            P.fill(200, this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 30, 60);
            //---------text---------
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(1);
            P.textAlign(P.CENTER);
            P.textSize(15);
            P.noStroke();
            P.text(this.val, this.x, this.y - 10);
            if (this.count > 0) {
              P.fill(0, 0, 255, this.opacity);
            }
            P.text(this.count, this.x, this.y + 20);
            P.stroke(0, 0, 0, this.opacity);
            P.line(this.x - 15, this.y, this.x + 15, this.y);
            P.pop();
          }
        }

        class HashTable {
          constructor() {
            this.table = [];
            this.x = 40;
            this.y = 50;
            this.vgap = 70;
          }
          setUp() {
            for (let i = 0; i <= 100; i++) {
              if (i < 25) {
                this.table.push(
                  new HT_box(i, this.x + i * 38, this.y + this.vgap * 0, 255)
                );
              } else if (i >= 25 && i < 50) {
                this.table.push(
                  new HT_box(
                    i,
                    this.x + (i - 25) * 38,
                    this.y + this.vgap * 1,
                    255
                  )
                );
              } else if (i >= 50 && i < 75) {
                this.table.push(
                  new HT_box(
                    i,
                    this.x + (i - 50) * 38,
                    this.y + this.vgap * 2,
                    255
                  )
                );
              } else if (i >= 75 && i < 100) {
                this.table.push(
                  new HT_box(
                    i,
                    this.x + (i - 75) * 38,
                    this.y + this.vgap * 3,
                    255
                  )
                );
              }
            }
          }

          insert(val) {
            let box = this.table[val];
            box.count++;
          }
          search(val) {
            let box = this.table[val];
            if (box.count > 0) {
              return true;
            } else {
              return false;
            }
          }
          delete(val) {
            let box = this.table[val];
            if (box.count > 0) {
              box.count--;
            }
          }

          reset() {
            this.table.forEach((b) => {
              b.count = 0;
            });
          }

          show() {
            this.table.forEach((b) => {
              b.show();
            });
          }
        }

        //-----------------------------------------------------------------------------------------------

        function countSort(arr, ht) {
          animator.standAloneFunc(1, () => {
            checkers[0].x = arr[0].x;
            checkers[0].y = arr[0].y;
          });

          animator.addStage({
            funcName: "insert",
            Args: [checkers[0]],
          });
          for (let i = 0; i < arr.length; i++) {
            animator.addStage({
              funcName: "check",
              Args: [arr[i], checkers[0], [10, 10]],
            });
            animator.standAloneFunc(1, () => {
              ht.table[arr[i].val].count++;
            });
          }

          animator.addStage({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(10, () => {
                  checkers[0].col = [0, 255, 0];
                }),
                animator.animate(40, [a2o(checkers[0], 0, 0, -255)]),
              ]);
            },
          });

          animator.standAloneFunc(1, () => {
            checkers[0].x = arr[0].x;
            checkers[0].y = arr[0].y;
            checkers[0].col = [0, 0, 255];

            checkers[1].x = ht.table[0].x;
            checkers[1].y = ht.table[0].y;
            checkers[1].col = [0, 0, 255];
          });

          animator.addStage({
            funcName: "insert",
            Args: [checkers[0]],
          });

          animator.addStage({
            funcName: "insert",
            Args: [checkers[1]],
          });

          animator.standAloneFunc(1, () => {
            let index = 0;
            let index_ = 0;
            for (let i = 0; i < ht.table.length; i++) {
              animator.addStage({
                funcName: "check",
                Args: [ht.table[i], checkers[1], [2, 2]],
              });
              for (let j = 0; j < ht.table[i].count; j++) {
                animator.addStage({
                  funcName: "check",
                  Args: [arr[index_], checkers[0], [5, 5]],
                });
                index_++;
                animator.standAloneFunc(1, () => {
                  arr[index++].val = i;
                  ht.table[i].count--;
                });
              }
            }

            animator.addStage({
              func: function () {
                return animator.animationSequence([
                  animator.animateFunc(10, () => {
                    checkers[1].col = [0, 255, 0];
                    checkers[0].col = [0, 255, 0];
                  }),
                  animator.animate(40, [
                    a2o(checkers[0], 0, 0, -255),
                    a2o(checkers[1], 0, 0, -255),
                  ]),
                  animator.animateFunc(1, () => {
                    checkers[1].col = [0, 0, 255];
                    checkers[0].col = [0, 0, 255];
                  }),
                ]);
              },
            });
          });
        }

        //-----------------------------------------------------------------------------------------------

        function check([a, ckr, du]) {
          return animator.animationSequence([
            animator.delay(du[0]),
            animator.to(du[1], [a2o(ckr, a.x, a.y, 255)]),
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

        //------------------------------------------------------------------------------------------------

        let HT = new HashTable();
        let boxes = [];
        let checkers = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            check: check,
          };
          HT.setUp();

          checkers[0] = new checker();
          checkers[0].col = [0, 0, 255];
          checkers[0].shape = [40, 40];
          checkers[1] = new checker();
          checkers[1].col = [0, 0, 255];
          checkers[1].shape = [30, 60];
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
                P.width / 2 - 20 * liveInput.length + i * 40,
                400,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }

            animator.standAloneFunc(1, () => {
              countSort(boxes, HT);
            });
            addRef.current.start = false;
          }

          HT.show();
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
