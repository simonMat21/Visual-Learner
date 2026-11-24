"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";
import { createNarrator } from "@/lib/sortNarration";
import { BOARD, CHALK, GOOD, HIGHLIGHT, INK, tileColor } from "@/lib/boardPalette";

export default function P5Sketch({
  onNarrate,
  dlt,
  add,
  srch,
  animSpd,
  actionExicutable,
}) {
  const sketchRef = useRef(null);
  const onNarrateRef = useRef(onNarrate);
  const deleteRef = useRef(dlt);
  const searchRef = useRef(srch);
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

            if (this.done) P.fill(GOOD[0], GOOD[1], GOOD[2], this.opacity);
            else P.fill(tileColor(P, P.map(this.val, Box.minVal, Box.maxVal, 0, 1), this.opacity));
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40);
            P.fill(...INK, this.opacity);
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
            P.stroke(...CHALK, this.opacity);

            P.fill(200, this.opacity);
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 30, 60);
            //---------text---------
            P.fill(...INK, this.opacity);
            P.strokeWeight(1);
            P.textAlign(P.CENTER);
            P.textSize(15);
            P.noStroke();
            P.text(this.val, this.x, this.y - 10);
            if (this.count > 0) {
              P.fill(...HIGHLIGHT, this.opacity);
            }
            P.text(this.count, this.x, this.y + 20);
            P.stroke(...CHALK, this.opacity);
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
            for (let i = 0; i < 100; i++) {
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

        // Every state change goes through narr.run, so the counts and the
        // written values change exactly when the animation reaches them.
        function countSort(arr, ht) {
          const vals = arr.map((b) => b.val);
          const max = Math.max(...vals);
          const tally = Array(100).fill(0);

          narr.say([], `Counting sort never compares items. It counts how many times each value appears, then writes the values back in order.`);
          narr.pause(50);
          narr.say(0, `Every possible value 0–99 gets a counter (the grid above), all starting at 0.`);
          narr.pause(40);

          narr.run(() => {
            checkers[0].x = arr[0].x;
            checkers[0].y = arr[0].y;
            checkers[0].col = [...HIGHLIGHT];
          });
          animator.addStage({
            funcName: "insert",
            Args: [checkers[0]],
          });
          for (let i = 0; i < arr.length; i++) {
            const x = vals[i];
            const c = ++tally[x];
            narr.say(1, `Read a[${i}] = ${x} → count[${x}] goes up to ${c}.`, { counted: 1 });
            animator.addStage({
              funcName: "check",
              Args: [arr[i], checkers[0], [10, 10]],
            });
            narr.run(() => ht.table[x].count++);
          }

          animator.addStage({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(10, () => {
                  checkers[0].col = [...GOOD];
                }),
                animator.animate(40, [a2o(checkers[0], 0, 0, -255)]),
              ]);
            },
          });

          narr.say([2, 3], `Everything is counted. Now walk the counters from 0 up to ${max} and write each value back as many times as it was counted.`);
          narr.pause(40);
          narr.run(() => {
            checkers[0].x = arr[0].x;
            checkers[0].y = arr[0].y;
            checkers[0].col = [...HIGHLIGHT];
            checkers[1].x = ht.table[0].x;
            checkers[1].y = ht.table[0].y;
            checkers[1].col = [...HIGHLIGHT];
          });
          animator.addStage({
            funcName: "insert",
            Args: [checkers[0]],
          });
          animator.addStage({
            funcName: "insert",
            Args: [checkers[1]],
          });

          let k = 0;
          for (let v = 0; v <= max; v++) {
            animator.addStage({
              funcName: "check",
              Args: [ht.table[v], checkers[1], [2, 2]],
            });
            for (let j = 0; j < tally[v]; j++) {
              const slot = arr[k];
              const pos = k;
              narr.say(4, `count[${v}] = ${tally[v] - j}: write ${v} into a[${pos}] and lower the count.`, { written: 1 });
              animator.addStage({
                funcName: "check",
                Args: [slot, checkers[0], [5, 5]],
              });
              narr.run(() => {
                slot.val = v;
                slot.done = true;
                ht.table[v].count--;
              });
              k++;
            }
          }

          animator.addStage({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(10, () => {
                  checkers[1].col = [...GOOD];
                  checkers[0].col = [...GOOD];
                }),
                animator.animate(40, [
                  a2o(checkers[0], 0, 0, -255),
                  a2o(checkers[1], 0, 0, -255),
                ]),
                animator.animateFunc(1, () => {
                  checkers[1].col = [...HIGHLIGHT];
                  checkers[0].col = [...HIGHLIGHT];
                }),
              ]);
            },
          });
          narr.say([], `Done! The array is sorted: ${[...vals].sort((a, b) => a - b).join(", ")}.`, {}, { done: true });
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
        let narr;
        P.setup = () => {
          P.createCanvas(1000, 370);
          animator = new Animator();
          narr = createNarrator(animator, onNarrateRef, { stats: { counted: 0, written: 0 } });
          animator.functionsDictionary = {
            insert: insert,
            check: check,
          };
          HT.setUp();

          checkers[0] = new checker();
          checkers[0].col = [...HIGHLIGHT];
          checkers[0].shape = [40, 40];
          checkers[1] = new checker();
          checkers[1].col = [...HIGHLIGHT];
          checkers[1].shape = [30, 60];
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

          if (addRef.current.start && addRef.current.val.length != 0) {
            boxes = [];
            const liveInput = addRef.current.val;
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new Box(
                P.width / 2 - 20 * liveInput.length + i * 40,
                335,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }

            HT.reset();
            narr.reset();
            countSort(boxes, HT);
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
    deleteRef.current = dlt;
    searchRef.current = srch;
    actionExicutableRef.current = actionExicutable;
    animSpdRef.current = animSpd;
  }, [dlt, add, srch, animSpd, actionExicutable, onNarrate]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
