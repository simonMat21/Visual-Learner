"use client";

import React, { useRef, useEffect } from "react";
import { Animator, a2o } from "@/components/Tideon";

export default function P5Sketch_mergeSort({
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
            P.fill(
              P.map(this.val, Box.minVal, Box.maxVal, 255, 50),
              this.opacity
            );
            P.rect(this.x, this.y, 40);
            P.fill(255, 105, 0, this.opacity);
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
                  changes: { y: d == 1 ? -70 : -90 },
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
              y: d == 1 ? 70 : 90,
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
          function mergeSort(arr, depth = 1) {
            if (arr.length <= 1) return arr;

            animator.addStage({
              funcName: "div",
              Args: [arr, depth],
            });

            const mid = Math.floor(arr.length / 2);
            const left = arr.slice(0, mid);
            const right = arr.slice(mid);

            const sortedLeft = mergeSort(left, depth + 1);
            const sortedRight = mergeSort(right, depth + 1);

            const merged = merge(sortedLeft, sortedRight);
            animator.addStage({
              funcName: "merge",
              Args: [depth, merged],
            });

            return merged;
          }

          function merge(left, right) {
            // Just concatenate indices for visualization — no actual sorting
            return [...left, ...right];
          }

          mergeSort(Arr);
          animator.addStage({
            funcName: "end",
          });
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let animator;

        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            div: div,
            merge: merge,
            end: end,
          };
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

          if (addRef.current.start && addRef.current.val.length != 0) {
            boxes = [];
            const liveInput = addRef.current.val;
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
