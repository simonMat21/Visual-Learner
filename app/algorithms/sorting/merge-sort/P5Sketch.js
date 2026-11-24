"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";
import { createNarrator } from "@/lib/sortNarration";
import { BOARD, INK, tileColor, GOOD, CHALK } from "@/lib/boardPalette";

export default function P5Sketch_mergeSort({
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
            if (this.done) P.fill(GOOD[0], GOOD[1], GOOD[2], this.opacity);
            else P.fill(tileColor(P, P.map(this.val, Box.minVal, Box.maxVal, 0, 1), this.opacity));
            P.rect(this.x, this.y, 40);
            P.fill(...INK, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x + 20, this.y + 20);
          }
        }
        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [a2o(a, 0, -50, 0)]),
            animator.animate(20, [a2o(a, 0, 50, 255)]),
          ]);
        }

        function merge([d, arr]) {
          const pos = arr
            .map((item, i) =>
              i < Math.floor(arr.length / 2)
                ? animator.initialValSeq(item.x + 150 / d, i)
                : animator.initialValSeq(item.x - 150 / d, i)
            )
            .sort((a, b) => a - b);
          arr.sort((a, b) => a.val - b.val);
          return animator.animationSequence([
            animator.delay(10),
            ...arr.map((item, i) =>
              animator.mix(70, [
                { tag: "to", obj: item, changes: { x: pos[i] } },
                {
                  tag: "animate",
                  obj: item,
                  changes: { y: d == 1 ? -60 : -72 },
                },
              ])
            ),
          ]);
        }

        function div([arr, d]) {
          const transformed = arr.map((b, i) => ({
            obj: b,
            changes: {
              x: i < Math.floor(arr.length / 2) ? -150 / d : 150 / d,
              y: d == 1 ? 60 : 72,
            },
          }));
          return animator.animationSequence([
            animator.delay(10),
            animator.animate(70, transformed),
          ]);
        }

        function end() {
          return animator.animationSequence([
            animator.to(
              70,
              boxes.map((b) => ({
                obj: b,
                changes: { y: P.height / 2 - 50 },
              }))
            ),
          ]);
        }

        //------------------------------------------------------------------------------------------------
        function getMergeSortInstructions(Arr) {
          const num = (a, b) => a - b;
          const show = (vals) => `[${vals.join(", ")}]`;

          narr.say([], `Merge sort splits the array in half again and again until every piece has one item, then merges the pieces back together in order.`);
          narr.pause(50);

          function mergeSort(arr, depth = 1) {
            if (arr.length <= 1) return arr;

            const mid = Math.floor(arr.length / 2);
            const left = arr.slice(0, mid);
            const right = arr.slice(mid);

            narr.say(
              2,
              `Split ${show(arr.map((b) => b.val))} into ${show(left.map((b) => b.val))} and ${show(right.map((b) => b.val))}.`,
              { splits: 1 }
            );
            animator.addStage({
              funcName: "div",
              Args: [arr, depth],
            });

            const sortedLeft = mergeSort(left, depth + 1);
            const sortedRight = mergeSort(right, depth + 1);

            // what the merge step will do, worked out here for the caption
            const L = sortedLeft.map((b) => b.val).sort(num);
            const R = sortedRight.map((b) => b.val).sort(num);
            let li = 0;
            let ri = 0;
            let comparisons = 0;
            while (li < L.length && ri < R.length) {
              comparisons++;
              if (L[li] <= R[ri]) li++;
              else ri++;
            }
            const merged = merge(sortedLeft, sortedRight);
            const mergedVals = [...L, ...R].sort(num);
            narr.say(
              [3, 4],
              `Both halves are sorted. Merge ${show(L)} and ${show(R)}: compare the front items, take the smaller one, repeat → ${show(mergedVals)}.`,
              { merges: 1, comparisons }
            );
            animator.addStage({
              funcName: "merge",
              Args: [depth, merged],
            });

            return merged;
          }

          function merge(left, right) {
            // the visual merge step (merge() above) puts them in order
            return [...left, ...right];
          }

          mergeSort(Arr);
          animator.addStage({
            funcName: "end",
          });
          narr.run(() => Arr.forEach((b) => (b.done = true)));
          narr.say([], `Done! The array is sorted: ${show(Arr.map((b) => b.val).sort(num))}.`, {}, { done: true });
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let animator;
        let narr;

        P.setup = () => {
          P.createCanvas(1000, 370);
          animator = new Animator();
          narr = createNarrator(animator, onNarrateRef, { stats: { splits: 0, merges: 0, comparisons: 0 } });
          animator.functionsDictionary = {
            insert: insert,
            div: div,
            merge: merge,
            end: end,
          };
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
            // first split moves 60px down, every deeper one 72px
            const levels = Math.ceil(Math.log2(Math.max(1, liveInput.length)));
            P.resizeCanvas(1000, Math.max(160, 50 + (levels > 0 ? 60 + 72 * (levels - 1) : 0) + 40 + 28));
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new Box(
                490 - 20 * liveInput.length + i * 40,
                50,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }
            animator.standAloneFunc(1, () => {
              getMergeSortInstructions(boxes);
            });
            addRef.current.start = false;
          }

          boxes.forEach((i) => {
            i.show();
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
