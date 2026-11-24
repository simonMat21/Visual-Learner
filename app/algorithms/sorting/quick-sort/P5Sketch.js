"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";
import { createNarrator, drawBoxState } from "@/lib/sortNarration";
import { BOARD, HIGHLIGHT, INK, tileColor, GOOD, CHALK } from "@/lib/boardPalette";

export default function P5Sketch_quickSort({
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
            drawBoxState(P, this, {
              size: 60,
              cx: this.x + 30,
              cy: this.y + 30,
              tagBelow: true,
              colors: { GOOD, HIGHLIGHT, CHALK },
            });
            if (this.done) P.fill(GOOD[0], GOOD[1], GOOD[2], this.opacity);
            else P.fill(tileColor(P, P.map(this.val, Box.minVal, Box.maxVal, 0, 1), this.opacity));
            P.rect(this.x, this.y, 60);
            P.fill(...INK, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(25);
            P.noStroke();
            P.text(this.val, this.x + 30, this.y + 30);
          }
        }

        class arrow {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(...HIGHLIGHT, this.opacity);
            P.rect(this.x, this.y, 60);
            P.pop();
          }
        }

        class pointer {
          constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
            this.opacity = 0;
            this.hide = false;
          }

          show() {
            P.push();
            P.fill(...HIGHLIGHT, this.opacity);
            P.strokeWeight(3);
            P.stroke(...HIGHLIGHT, this.opacity);
            P.triangle(
              this.x,
              this.y - 5,
              this.x - 5,
              this.y - 15,
              this.x + 5,
              this.y - 15
            );
            P.noStroke();
            P.textAlign(P.LEFT, P.CENTER);
            P.textSize(13);
            P.textStyle(P.BOLD);
            P.text("i", this.x + 9, this.y - 11);
            P.pop();
          }
        }
        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [a2o(a, 0, -50, 0)]),
            animator.animate(20, [a2o(a, 0, 50, 255)]),
          ]);
        }

        function check([a, b, ar1, ar2]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(70, [a2o(ar1, a.x, a.y, 255), a2o(ar2, b.x, b.y, 255)]),
          ]);
        }

        function swap([a, b]) {
          return animator.animationSequence([
            animator.animate(15, [a2o(a, 0, 40, 0), a2o(b, 0, -40, 0)]),
            animator.animate(10, [
              a2o(a, P.abs(animator.initialVal(a.x - b.x)), 0, 0),
              a2o(b, -P.abs(animator.initialVal(a.x - b.x)), 0, 0),
            ]),
            animator.animate(15, [a2o(a, 0, -40, 0), a2o(b, 0, 40, 0)]),
          ]);
        }
        function depth(arr) {
          return animator.animationSequence([
            animator.animate(
              20,
              arr.map((item) => a2o(item, 0, 46, 0))
            ),
          ]);
        }

        function comeBack(arr) {
          return animator.animationSequence([
            animator.to(
              40,
              arr.map((item) => a2o(item, item.x, 50, item.opacity))
            ),
          ]);
        }

        function pointTo([a, ptr]) {
          return animator.animationSequence([
            animator.to(20, [a2o(ptr, a.x + 30, a.y - 25, 255)]),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        function getQuickSortInstructions(arr) {
          const v = (b) => b.val;
          const list = (from, to) => arr.slice(from, to + 1).map(v).join(", ");

          narr.say([], `Quick sort picks a pivot, moves everything smaller to its left and everything else to its right, then sorts the two sides the same way.`);
          narr.pause(50);

          function partition(arr, start, end) {
            const pivot = arr[end];
            narr.run(() => (pivot.tag = "pivot"));
            narr.say([1, 2], `Partition [${list(start, end)}] around the pivot ${v(pivot)} (the last item). The pointer i marks where the next smaller item goes.`, { partitions: 1 });
            animator.addStage({
              funcName: "depth",
              Args: arr.slice(start, end + 1),
            });
            let i = start;
            animator.addStage({
              funcName: "pointTo",
              Args: [arr[i], pointers[0]],
            });

            for (let j = start; j < end; j++) {
              const item = arr[j];
              const smaller = v(item) < v(pivot);
              narr.say(
                [3, 4],
                smaller
                  ? `Is ${v(item)} < pivot ${v(pivot)}? Yes → it belongs on the left side.`
                  : `Is ${v(item)} < pivot ${v(pivot)}? No → it stays on the right side.`,
                { comparisons: 1 }
              );
              animator.addStage({
                funcName: "check",
                Args: [arr[j], arr[end], arrows[0], arrows[1]],
              });

              if (smaller) {
                narr.say(5, arr[i] === item
                  ? `${v(item)} is already at position i, so it simply stays; move i one step right.`
                  : `Swap ${v(item)} with ${v(arr[i])} (at i) to move it to the left side, then move i one step right.`, { swaps: arr[i] === item ? 0 : 1 });
                animator.addStage({
                  funcName: "swap",
                  Args: [arr[i], arr[j]],
                });

                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
                animator.addStage({
                  funcName: "pointTo",
                  Args: [arr[i], pointers[0]],
                });
              }
            }

            // Final pivot swap
            narr.say(6, `Every item left of i is smaller than ${v(pivot)}. Swap the pivot into position i: it is now in its final place.`, { swaps: arr[i] === pivot ? 0 : 1 });
            animator.addStage({
              funcName: "swap",
              Args: [arr[i], arr[end]],
            });
            [arr[i], arr[end]] = [arr[end], arr[i]];
            narr.run(() => {
              pivot.tag = null;
              pivot.done = true;
            });
            narr.pause(25);

            return i;
          }

          function quick_sort(arr, start = 0, end = arr.length - 1) {
            if (start < end) {
              const p = partition(arr, start, end);
              narr.say(7, `Now sort the left side [${list(start, p - 1) || "empty"}] and the right side [${list(p + 1, end) || "empty"}].`);
              narr.pause(30);
              quick_sort(arr, start, p - 1);
              quick_sort(arr, p + 1, end);
            } else if (start === end) {
              const only = arr[start];
              narr.say(1, `[${v(only)}] has just one item, so it is already sorted.`);
              narr.run(() => (only.done = true));
              narr.pause(20);
            }
          }
          quick_sort(arr);
          animator.addStage({
            funcName: "comeBack",
            Args: [...arr, arrows[0], arrows[1], pointers[0]],
          });
          narr.run(() => [...arrows, ...pointers].forEach((m) => (m.opacity = 0)));
          narr.say([], `Done! The array is sorted: ${arr.map(v).join(", ")}.`, {}, { done: true });
          return [];
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];

        /** How many partitions nest at most for these values (Lomuto, last item as pivot). */
        function partitionDepth(values) {
          const a = [...values];
          const go = (lo, hi) => {
            if (lo >= hi) return 0;
            const pivot = a[hi];
            let i = lo;
            for (let j = lo; j < hi; j++) {
              if (a[j] < pivot) {
                [a[i], a[j]] = [a[j], a[i]];
                i++;
              }
            }
            [a[i], a[hi]] = [a[hi], a[i]];
            return 1 + Math.max(go(lo, i - 1), go(i + 1, hi));
          };
          return go(0, a.length - 1);
        }
        let arrows = [];
        let pointers = [];

        let animator;
        let narr;
        P.setup = () => {
          P.createCanvas(1000, 290);
          animator = new Animator();
          narr = createNarrator(animator, onNarrateRef, { stats: { comparisons: 0, swaps: 0, partitions: 0 } });
          // animator.delayMult = 0.5;
          animator.functionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
            depth: depth,
            comeBack: comeBack,
            pointTo: pointTo,
          };
        };

        let start = false;
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
            // every partition moves its part 46px down, so size the board to the deepest one
            P.resizeCanvas(1000, Math.max(230, 50 + 46 * partitionDepth(liveInput) + 60 + 30));
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new Box(
                500 - 40 * liveInput.length + i * 80,
                50,
                liveInput[i]
              );
              animator.addStage({ funcName: "insert", Args: [boxes[i]] });
            }

            Box.maxVal = boxes.reduce((max, obj) =>
              obj.val > max.val ? obj : max
            ).val;
            Box.minVal = boxes.reduce((max, obj) =>
              obj.val < max.val ? obj : max
            ).val;

            arrows[0] = new arrow(500 - 40 * liveInput.length, 50);
            arrows[1] = new arrow(500 - 40 * liveInput.length + 80, 50);
            pointers[0] = new pointer(500 - 40 * liveInput.length + 40, 20);
            animator.addStage({ funcName: "insert", Args: [arrows[0]] });
            animator.addStage({ funcName: "insert", Args: [arrows[1]] });
            animator.addStage({ funcName: "insert", Args: [pointers[0]] });
            animator.standAloneFunc(1, () => {
              getQuickSortInstructions(boxes);
            });
            addRef.current.start = false;
          }

          boxes.forEach((i) => {
            i.show();
          });
          arrows.forEach((i) => {
            i.show();
          });
          pointers.forEach((i) => {
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
