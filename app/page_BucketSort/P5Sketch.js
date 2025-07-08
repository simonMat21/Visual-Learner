"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

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
            let idx = this.hash(val);
            // Check if val already exists (optional)
            for (let box of this.table[idx]) {
              if (box.val === val) return; // avoid duplicates
            }
            let chainLen = this.table[idx].length;
            this.table[idx].push(
              new HT_box(val, 300 + chainLen * 50, 50 + 45 * idx, 255)
            );
          }

          search(val) {
            let idx = this.hash(val);
            for (let box of this.table[idx]) {
              if (box.val === val) return true;
            }
            return false;
          }

          delete(val) {
            let idx = this.hash(val);
            this.table[idx] = this.table[idx].filter((box) => box.val !== val);
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

        //-----------------------------------------------------------------------------------------------

        function check(_, [a, ckr]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(40, [[ckr, a.x, a.y, 255]]),
          ]);
        }

        function insert(_, [a]) {
          return animator.animationSequence([
            animator.animate(1, [[a, 0, -50, 0]]),
            animator.animate(20, [[a, 0, 50, 255]]),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        let ht = new HashTable();
        let listOfActions = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            check: check,
          };
          ht.setUp();
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          animator.mainAnimationSequence(listOfActions);
          animator.setDelayMult(animSpdRef.current);

          if (animator.executing) {
            actionExicutable(false);
          } else {
            actionExicutable(true);
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
            ht.search(deleteRef.current.val);

            searchRef.current.start = false;
          }
          ht.show();
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
