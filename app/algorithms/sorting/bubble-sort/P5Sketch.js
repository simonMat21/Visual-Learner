"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";
import { createNarrator, drawBoxState } from "@/lib/sortNarration";
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
            this.shape = [60, 60];
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
            drawBoxState(P, this, { size: 60, colors: { GOOD, HIGHLIGHT, CHALK } });
            if (this.done) P.fill(GOOD[0], GOOD[1], GOOD[2], this.opacity);
            else P.fill(tileColor(P, P.map(this.val, Box.minVal, Box.maxVal, 0, 1), this.opacity));
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 60);
            P.fill(...INK, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x, this.y);
          }
        }

        //-----------------------------------------------------------------------------------------------
        function bubbleSort(arr) {
          const n = arr.length;
          const v = (b) => b.val;
          narr.say([], `Bubble sort walks along the array comparing neighbours. Big values “bubble” to the right end, one per pass.`);
          narr.pause(50);
          for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            narr.say([0, 1], `Pass ${i + 1}: walk from the left up to position ${n - 1 - i}.`, { passes: 1 });
            for (let j = 0; j < n - 1 - i; j++) {
              const a = arr[j];
              const b = arr[j + 1];
              const swap = v(a) > v(b);
              narr.say(
                [2, 3],
                swap
                  ? `Compare a[${j}] = ${v(a)} and a[${j + 1}] = ${v(b)}: ${v(a)} > ${v(b)}, so they are in the wrong order → swap.`
                  : `Compare a[${j}] = ${v(a)} and a[${j + 1}] = ${v(b)}: already in order, nothing to do.`,
                { comparisons: 1 }
              );
              animator.addStage({ funcName: "check", Args: [a, b] });
              if (swap) {
                narr.say(4, `Swap ${v(a)} and ${v(b)}.`, { swaps: 1 });
                animator.addStage({ funcName: "swap", Args: [a, b] });
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
              } else {
                narr.pause(12);
              }
            }
            const last = arr[n - 1 - i];
            narr.run(() => (last.done = true));
            if (!swapped) {
              narr.say(5, `No swaps in this pass, so every neighbour pair is in order: the array is already sorted. Stop early.`);
              break;
            }
            narr.say(6, `${v(last)} is the largest value left, so it has bubbled to position ${n - 1 - i}, its final place.`);
            narr.pause(35);
          }
          narr.run(() => arr.forEach((b) => (b.done = true)));
          narr.run(() => checkers.forEach((c) => (c.opacity = 0)));
          narr.say([], `Done! The array is sorted: ${arr.map(v).join(", ")}.`, {}, { done: true });
        }

        //-----------------------------------------------------------------------------------------------

        function check([a, b]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(50, [
              a2o(checkers[0], a.x, a.y, 255),
              a2o(checkers[1], b.x, b.y, 255),
            ]),
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

        //------------------------------------------------------------------------------------------------

        let boxes = [];

        /** Index numbers under each position, so a[j] in the pseudocode has a place to point at. */
        function drawSlots() {
          if (!boxes.length) return;
          P.push();
          P.noStroke();
          P.fill(CHALK[0], CHALK[1], CHALK[2], 140);
          P.textAlign(P.CENTER, P.CENTER);
          P.textSize(13);
          for (let i = 0; i < boxes.length; i++) {
            P.text(String(i), P.width / 2 - 40 * boxes.length + i * 80, 205);
          }
          P.pop();
        }
        let checkers = [];

        let animator;
        let narr;
        P.setup = () => {
          P.createCanvas(1000, 230);
          animator = new Animator();
          narr = createNarrator(animator, onNarrateRef, { stats: { comparisons: 0, swaps: 0, passes: 0 } });
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
          };
          checkers[0] = new checker();
          checkers[1] = new checker();
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
            const liveInput = addRef.current.val;
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new Box(
                P.width / 2 - 40 * liveInput.length + i * 80,
                110,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }
            checkers[0].x = boxes[0].x;
            checkers[0].y = boxes[0].y;
            checkers[0].opacity = 0;
            animator.addStage({ funcName: "insert", Args: [checkers[0]] });
            checkers[1].x = boxes[1].x;
            checkers[1].y = boxes[1].y;
            checkers[1].opacity = 0;
            animator.addStage({ funcName: "insert", Args: [checkers[1]] });

            bubbleSort(boxes);

            addRef.current.start = false;
          }

          drawSlots();
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
    animSpdRef.current = animSpd;
    actionExicutableRef.current = actionExicutable;
  }, [dlt, add, srch, animSpd, actionExicutable, onNarrate]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
