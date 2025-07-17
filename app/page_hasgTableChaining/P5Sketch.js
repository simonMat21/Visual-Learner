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
  const actionExicutableRef = useRef(actionExicutable);

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
            P.fill(this.col[0], this.col[1], this.col[2], this.opacity - 150);
            P.strokeWeight(3);
            P.stroke(this.col[0], this.col[1], this.col[2], this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 30);
            P.pop();
          }

          setUp(x, y, op) {
            this.x = x;
            this.y = y;
            this.opacity = op;
          }
        }

        class HT_Index_box {
          constructor(val, x, y, op) {
            this.indexVal = val;
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
            P.rect(this.x, this.y, 30);
            //---------text---------
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(1);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(15);
            P.noStroke();
            P.text(this.indexVal, this.x, this.y);
            P.pop();
          }
        }
        class HT_box {
          constructor(val, x, y, op) {
            this.val = val;
            this.x = x;
            this.y = y;
            this.opacity = op;
          }
          show() {
            P.push();
            //---------rect---------
            P.stroke(100, this.opacity);
            P.fill(200, this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 30);
            //---------text---------
            P.fill(100, this.opacity);
            P.strokeWeight(1);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(15);
            P.noStroke();
            P.text(this.val, this.x, this.y);
            P.pop();
          }
        }

        class HashTable {
          constructor() {
            this.size = 10;
            this.table = Array(this.size)
              .fill(null)
              .map(() => []);
            this.x = 40;
            this.y = 50;
            this.vgap = 70;
          }

          setUp() {
            for (let i = 0; i < this.size; i++) {
              // Each bucket is an array of HT_box objects (to visualize chaining)
              this.table[i] = [new HT_Index_box(i, 300, 50 + 45 * i, 255)];
            }
          }

          hash(val) {
            return val % this.size;
          }

          insert(val) {
            let nbox = new HT_box(val, 100, 200, 0);
            animator.addStage({
              funcName: "insert",
              Args: [nbox],
            });
            let idx = this.hash(val);
            // Check if val already exists (optional)
            for (let box of this.table[idx]) {
              if (box.val === val) return; // avoid duplicates
            }
            let chainLen = this.table[idx].length;
            animator.addStage({
              funcName: "add",
              Args: [nbox, 310 + chainLen * 30, 50 + 45 * idx],
            });
            this.table[idx].push(nbox);
          }

          search(val) {
            ckr.setUp(100, 200, 0);
            animator.addStage({
              funcName: "insert",
              Args: [ckr],
            });
            let idx = this.hash(val);
            animator.addStage({
              funcName: "check",
              Args: [this.table[idx][0], ckr],
            });
            for (let box of this.table[idx]) {
              animator.addStage({
                funcName: "check",
                Args: [box, ckr],
              });
              if (box.val === val) {
                animator.addStage({
                  funcName: "found",
                  Args: [ckr],
                });
                return box;
              }
            }
            animator.addStage({
              funcName: "notfound",
              Args: [ckr],
            });
            return null;
          }

          delete(val) {
            let idx = this.hash(val);
            let dBox = this.search(val);
            animator.addStage({
              funcName: "remove",
              Args: [dBox],
            });
            animator.addStage({
              funcName: "reset",
              Args: [
                this.table[idx].filter(
                  (_, id) =>
                    id > this.table[idx].findIndex((item) => item.val === val)
                ),
              ],
            });
            animator.standAloneFunc(1, () => {
              this.table[idx] = this.table[idx].filter(
                (box) => box.val !== val
              );
            });
          }

          reset() {
            for (let i = 0; i < this.size; i++) {
              this.table[i] = [];
            }
          }

          show() {
            for (let chain of this.table) {
              for (let box of chain) {
                box.show();
              }
            }
          }
        }

        //-----------------------------------------------------------------------------------------------

        function check([a, ckr]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(30, [a2o(ckr, a.x, a.y, 255)]),
          ]);
        }

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [a2o(a, 0, -50, 0)]),
            animator.animate(20, [a2o(a, 0, 50, 255)]),
          ]);
        }

        function add([a, x, y]) {
          return animator.animationSequence([
            animator.delay(20),
            animator.to(20, [a2o(a, a.x, y, 255)]),
            animator.delay(20),
            animator.to(50, [a2o(a, x, a.y, 255)]),
          ]);
        }

        function reset([arr]) {
          return animator.animationSequence([
            animator.animate(
              20,
              arr.map((box) => a2o(box, -30, 0, 0))
            ),
          ]);
        }

        function remove([a]) {
          return animator.animationSequence([
            animator.animate(20, [a2o(a, 0, -50, -255)]),
          ]);
        }

        function found([ckr]) {
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              ckr.col = [0, 255, 0];
            }),
            animator.animate(40, [a2o(ckr, 0, 0, -255)]),
            animator.animateFunc(1, () => {
              ckr.col = [0, 0, 255];
            }),
          ]);
        }

        function notfound([ckr]) {
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              ckr.col = [255, 0, 0];
            }),
            animator.animate(40, [a2o(ckr, 0, 0, -255)]),
            animator.animateFunc(1, () => {
              ckr.col = [0, 0, 255];
            }),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        let ht = new HashTable();
        let ckr = new checker();
        let animator;

        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            add: add,
            reset: reset,
            remove: remove,
            found: found,
            notfound: notfound,
          };
          ht.setUp();
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          animator.mainAnimationSequence();
          animator.setDelayMult(animSpdRef.current);

          if (animator.executing) {
            actionExicutableRef.current(false);
          } else {
            actionExicutableRef.current(true);
          }

          if (addRef.current.start) {
            ht.insert(addRef.current.val);
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            ht.delete(deleteRef.current.val);
            deleteRef.current.start = false;
          }

          if (searchRef.current.start) {
            console.log(ht.search(searchRef.current.val));
            searchRef.current.start = false;
          }
          ht.show();
          ckr.show();
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
    actionExicutableRef.current = actionExicutable;
    animSpdRef.current = animSpd;
  }, [dlt, add, srch, animSpd, actionExicutable]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
