"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";
import { createNarrator } from "@/lib/sortNarration";
import { BAD, BOARD, CHALK, GOOD, HIGHLIGHT, INK, tileColor } from "@/lib/boardPalette";

export default function P5Sketch({
  onNarrate, add, animSpd, actionExicutable }) {
  const sketchRef = useRef(null);
  const onNarrateRef = useRef(onNarrate);
  const addRef = useRef(add);
  const animSpdRef = useRef(animSpd);
  const actionExicutableRef = useRef(actionExicutable);

  useEffect(() => {
    // Dynamically import p5 only on the client
    let p5Instance = null;
    let cancelled = false;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        class checker {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.opacity = 0;
            this.hide = false;
            this.col = [...HIGHLIGHT];
          }

          show() {
            P.push();
            P.fill(this.col[0], this.col[1], this.col[2], this.opacity - 150);
            P.strokeWeight(3);
            P.stroke(this.col[0], this.col[1], this.col[2], this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40, 30);
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
            P.stroke(...CHALK, this.opacity);
            P.fill(200, this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40, 30);
            //---------text---------
            P.fill(...INK, this.opacity);
            P.strokeWeight(1);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(15);
            P.noStroke();
            P.text(this.indexVal, this.x, this.y);
            P.pop();
          }
        }
        class HT_box {
          static maxVal = 100;
          static minVal = 0;
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
            if (this.done) P.fill(GOOD[0], GOOD[1], GOOD[2], this.opacity);
            else P.fill(tileColor(P, P.map(this.val, HT_box.minVal, HT_box.maxVal, 0, 1), this.opacity));
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 30);
            //---------text---------
            P.fill(...INK, this.opacity);
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
            this.x = 300;
            this.y = 30;
            this.vgap = 32;
          }

          setUp() {
            for (let i = 0; i < this.size; i++) {
              // Each bucket is an array of HT_box objects (to visualize chaining)
              this.table[i] = [
                new HT_Index_box(
                  `<${(i + 1) * 10}`,
                  this.x,
                  this.y + this.vgap * i,
                  255
                ),
              ];
            }
          }

          hash(val) {
            // 0-9 -> 0, 10-19 -> 1, ... ; 100 would be bucket 10, so it joins the last one
            return Math.min(this.size - 1, Math.max(0, Math.floor(val / 10)));
          }

          insert(val) {
            let nbox = new HT_box(val, 100, 200, 0);
            let idx = this.hash(val);
            narr.say(1, `${val} goes into bucket ${idx} (values ${idx * 10}–${idx * 10 + 9}), because ⌊${val} / 10⌋ = ${idx}.`, { placed: 1 });
            animator.addStage({
              funcName: "insert",
              Args: [nbox],
            });
            // duplicates are kept: a sort must not lose items
            let chainLen = this.table[idx].length;
            animator.addStage({
              funcName: "add",
              Args: [
                nbox,
                this.x + 20 + chainLen * 30,
                this.y + this.vgap * idx,
              ],
            });
            this.table[idx].push(nbox);
          }

          sortHT() {
            narr.say(2, `Every item is in a bucket. Now sort each bucket on its own; buckets are small, so this is quick.`);
            narr.pause(40);
            ckr.setUp(100, 200, 0);
            animator.addStage({
              funcName: "insert",
              Args: [ckr],
            });
            this.table.forEach((arr, idx) => {
              const items = arr.filter((_, id) => id > 0);
              if (items.length > 0) {
                const sorted = items.map((b) => b.val).sort((a, b) => a - b);
                narr.say(
                  2,
                  items.length === 1
                    ? `Bucket ${idx} has a single item (${sorted[0]}), so it is already sorted.`
                    : `Sort bucket ${idx}: ${items.map((b) => b.val).join(", ")} → ${sorted.join(", ")}.`,
                  { sorted: 1 }
                );
              }
              animator.addStage({
                funcName: "check",
                Args: [arr[0], ckr],
              });
              animator.addStage({
                funcName: "Sort",
                Args: [items],
              });
            });
            animator.addStage({
              funcName: "found",
              Args: [ckr],
            });
          }

          bringHTdown() {
            const all = [];
            this.table.forEach((arr) => all.push(...arr.filter((_, id) => id > 0).map((b) => b.val).sort((a, b) => a - b)));
            narr.say(3, `Join the buckets in order, bucket 0 first. Each bucket is sorted and every value in a bucket is smaller than the next bucket's, so the result is sorted.`);
            let xSet = 0;
            this.table.forEach((arr) => {
              animator.addStage({
                funcName: "bringDown",
                Args: [
                  arr.filter((_, id) => id > 0).sort((a, b) => a.val - b.val),
                  300 + 40 * xSet,
                ],
              });
              xSet += arr.length - 1;
            });
            const items = this.table.flatMap((arr) => arr.filter((_, id) => id > 0));
            narr.run(() => items.forEach((b) => (b.done = true)));
            narr.say([], `Done! The array is sorted: ${all.join(", ")}.`, {}, { done: true });
          }

          reset() {
            for (let i = 0; i < this.size; i++) {
              this.table[i] = [];
            }
            this.setUp();
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
              ckr.col = [...GOOD];
            }),
            animator.animate(40, [a2o(ckr, 0, 0, -255)]),
            animator.animateFunc(1, () => {
              ckr.col = [...HIGHLIGHT];
            }),
          ]);
        }

        function notfound([ckr]) {
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              ckr.col = [...BAD];
            }),
            animator.animate(40, [a2o(ckr, 0, 0, -255)]),
            animator.animateFunc(1, () => {
              ckr.col = [...HIGHLIGHT];
            }),
          ]);
        }

        function Sort([arr]) {
          const pos = arr
            .map((item, i) => animator.initialVal(item.x, `sortPos${i}`))
            .sort((a, b) => a - b);
          return animator.animationSequence([
            animator.to(
              40,
              arr
                .sort((a, b) => a.val - b.val)
                .map((item, index) => {
                  return a2o(item, pos[index], item.y, item.opacity);
                })
            ),
          ]);
        }

        function bringDown([arr, x = 300]) {
          return animator.animationSequence([
            animator.to(
              30,
              arr.map((a, i) => {
                return a2o(a, x + 40 * i, 375, 255);
              })
            ),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        let ht = new HashTable();
        let ckr = new checker();
        let animator;
        let narr;

        P.setup = () => {
          P.createCanvas(1000, 405);
          animator = new Animator();
          narr = createNarrator(animator, onNarrateRef, { stats: { placed: 0, sorted: 0 } });
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            add: add,
            reset: reset,
            remove: remove,
            found: found,
            notfound: notfound,
            Sort: Sort,
            bringDown: bringDown,
          };
          ht.setUp();
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(...BOARD);

          animator.mainAnimationSequence();
          animator.setDelayMult(animSpdRef.current);

          if (animator.executing) {
            actionExicutableRef.current(false);
          } else {
            actionExicutableRef.current(true);
          }

          if (addRef.current.start) {
            ht.reset();
            narr.reset();
            narr.say([0], `Bucket sort spreads the numbers into 10 buckets by their tens digit, sorts each small bucket, then joins the buckets in order.`);
            narr.pause(50);
            animator.standAloneFunc(1, () => {
              addRef.current.val.forEach((element) => {
                ht.insert(element);
              });
            });
            animator.standAloneFunc(1, () => {
              ht.sortHT();
            });
            animator.standAloneFunc(1, () => {
              ht.bringHTdown();
            });
            addRef.current.start = false;
          }
          ht.show();
          ckr.show();
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);
      p5Instance = myP5;
    });
    return () => {
      cancelled = true;
      p5Instance?.remove();
    };
  }, []);

  useEffect(() => {
    // The page switches `start` back off after a few ms. If no frame ran in
    // between (slow or background tab), keep the request until draw() takes it.
    addRef.current = !add.start && addRef.current.start ? { ...add, start: true } : add;
    onNarrateRef.current = onNarrate;
    actionExicutableRef.current = actionExicutable;
    animSpdRef.current = animSpd;
  }, [add, animSpd, actionExicutable, onNarrate]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
