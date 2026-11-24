"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";
import { createNarrator } from "@/lib/sortNarration";
import { BOARD, HIGHLIGHT, INK, tileColor, GOOD, CHALK } from "@/lib/boardPalette";

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
            this.shape = [20, 200];
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(this.col[0], this.col[1], this.col[2], this.opacity);
            P.rectMode(P.CORNER);
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
            this.digits = val.toString().padStart(3, "0").split("").map(Number);
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            if (this.done) P.fill(GOOD[0], GOOD[1], GOOD[2], this.opacity);
            else P.fill(tileColor(P, P.map(this.val, Box.minVal, Box.maxVal, 0, 1), this.opacity));
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 100, 30);
            P.fill(...INK, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.digits[0], this.x - 30, this.y);
            P.text(this.digits[1], this.x, this.y);
            P.text(this.digits[2], this.x + 30, this.y);
          }
        }

        //-----------------------------------------------------------------------------------------------
        function radixSort(arr) {
          const names = ["ones", "tens", "hundreds"];
          narr.say([], `Radix sort never compares two numbers. It sorts by one digit at a time, starting with the ones digit, and each pass keeps ties in the order the previous pass left them.`);
          narr.pause(50);
          let order = [...arr];
          for (let i = 0; i < 3; i++) {
            const id = 2 - i;
            narr.say(0, `Pass ${i + 1}: look only at the ${names[i]} digit (highlighted column).`, { passes: 1 });
            animator.addStage({
              funcName: "check",
            });
            order = [...order].sort((a, b) => a.digits[id] - b.digits[id]);
            narr.say(
              1,
              `Reorder by the ${names[i]} digit. Items with the same digit keep their previous order (a stable sort) → ${order.map((b) => b.val).join(", ")}.`
            );
            animator.addStage({
              funcName: "sort",
              Args: [arr, id],
            });
          }
          animator.addStage({
            func: function () {
              return animator.animationSequence([
                animator.to(20, [
                  a2o(checkers[0], checkers[0].x, checkers[0].y - 50, 0),
                ]),
              ]);
            },
          });
          narr.run(() => arr.forEach((b) => (b.done = true)));
          narr.say(2, `Done! After the hundreds digit every number is in order: ${order.map((b) => b.val).join(", ")}.`, {}, { done: true });
        }

        //-----------------------------------------------------------------------------------------------

        function check() {
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(50, [a2o(checkers[0], -30, 0, 0)]),
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

        function swap([a, b]) {
          return animator.animationSequence([
            animator.animate(15, [
              a2o(a, 0, 40, 0),
              a2o(b, 0, -40, 0),
              a2o(checkers[0], 0, 40, 0),
              a2o(checkers[1], 0, -40, 0),
            ]),
            animator.animate(10, [
              a2o(a, P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(b, -P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(checkers[0], P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(checkers[1], -P.abs(animator.initialVal(a.x - b.x)), 0, 0),
            ]),
            animator.animate(15, [
              a2o(a, 0, -40, 0),
              a2o(b, 0, 40, 0),
              a2o(checkers[0], 0, -40, 0),
              a2o(checkers[1], 0, 40, 0),
            ]),
          ]);
        }

        function Sort([arr, id]) {
          const pos = arr
            .map((item, i) => animator.initialVal(item.y, `sortPos${i}`))
            .sort((a, b) => a - b);
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              console.log(arr);
            }),
            animator.to(
              80,
              arr
                .sort((a, b) => a.digits[id] - b.digits[id])
                .map((item, index) => {
                  return a2o(item, item.x, pos[index], item.opacity);
                })
            ),
            animator.delay(20),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let checkers = [];

        let animator;
        let narr;
        P.setup = () => {
          P.createCanvas(1000, 400);
          animator = new Animator();
          narr = createNarrator(animator, onNarrateRef, { stats: { passes: 0 } });
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
            sort: Sort,
          };
          checkers[0] = new checker();
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
            narr.reset();
            P.resizeCanvas(1000, Math.max(240, addRef.current.val.length * 34 + 80));
            checkers[0].x = 550;
            const liveInput = addRef.current.val;
            console.log(liveInput);
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new Box(
                P.width / 2,
                P.height / 2 - 17 * liveInput.length + i * 34 + 3,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }
            Box.maxVal = boxes.reduce((max, current) =>
              current.val > max.val ? current : max
            ).val;
            Box.minVal = boxes.reduce((max, current) =>
              current.val < max.val ? current : max
            ).val;

            checkers[0].y = boxes[0].y - 17;
            checkers[0].shape[1] = boxes.length * 34;
            animator.addStage({ funcName: "insert", Args: [checkers[0]] });

            radixSort(boxes);

            addRef.current.start = false;
          }

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
