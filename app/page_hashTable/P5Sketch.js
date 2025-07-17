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
            this.col = [0, 255, 0];
          }

          show() {
            P.push();
            P.fill(this.col[0], this.col[1], this.col[2], this.opacity - 150);
            P.strokeWeight(3);
            P.stroke(this.col[0], this.col[1], this.col[2], this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 30, 60);
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
            this.y = 100;
            this.vgap = 90;
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
            animator.addStage({
              funcName: "insert",
              Args: [box],
            });
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
            animator.addStage({
              funcName: "insert",
              Args: [box],
            });
            if (box.count > 0) {
              box.count--;
            }
          }

          show() {
            this.table.forEach((b) => {
              b.show();
            });
          }
        }

        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.to(1, [a2o(ckr, a.x, a.y, 0)]),
            animator.animate(15, [a2o(ckr, 0, 0, 255)]),
            animator.delay(10),
            animator.animate(15, [a2o(ckr, 0, 0, -255)]),
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
            if (addRef.current.val >= 0 && addRef.current.val < 100) {
              ht.insert(addRef.current.val);
            }
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            ht.delete(deleteRef.current.val);
            deleteRef.current.start = false;
          }

          if (searchRef.current.start) {
            console.log(ht.search(searchRef.current.val));
            ht.search(deleteRef.current.val);

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
