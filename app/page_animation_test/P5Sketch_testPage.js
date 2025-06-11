"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

export default function P5Sketch_testPage({ inputArray, add }) {
  const sketchRef = useRef(null);
  const inputRef = useRef(inputArray);
  const addRef = useRef(add);

  useEffect(() => {
    inputRef.current = inputArray;
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        class box {
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
              P.map(this.val, box.minVal, box.maxVal, 255, 50),
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

        class arrow {
          constructor(head, tail, x = 0, y = 0) {
            this.opacity = 255;
            this.hide = false;
            this.head = head;
            this.tail = tail || { x: x, y: y };
          }

          show() {
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(0, 0, 255, this.opacity);
            P.bezier(
              this.tail.x + 40,
              this.tail.y + 20,
              this.head.x,
              this.tail.y + 20,
              this.tail.x + 40,
              this.head.y + 20,
              this.head.x,
              this.head.y + 20
            );
            P.line(
              this.head.x,
              this.head.y + 20,
              this.head.x - 5,
              this.head.y + 25
            );
            P.line(
              this.head.x,
              this.head.y + 20,
              this.head.x - 5,
              this.head.y + 15
            );
            P.pop();
          }
        }
        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [[a, 0, -50, 0]]),
            animator.animate(20, [[a, 0, 50, 255]]),
          ]);
        }

        function div(arr, [d]) {
          const transformed = arr.map((val, i) => [
            val,
            i < Math.floor(arr.length / 2) ? -150 / d : 150 / d,
            d == 1 ? 70 : 90,
            0,
          ]);

          return animator.animationSequence([
            animator.delay(10),
            animator.animate(70, transformed),
            //animator.animate(70, transformed2),
          ]);
        }

        function addNode(__, [arr, [ind, val]]) {
          let NewBox = boxes[ind];
          const pos = [
            animator.initialDiffSeq(arr[0].x, 0, 0),
            animator.initialDiffSeq(arr[0].y, 0, 1),
          ];
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              box.maxVal = box.maxVal > val ? box.maxVal : val;
              box.minVal = box.minVal < val ? box.minVal : val;
              arr.splice(ind, 0, new box(0, 0, val));
              // arrows.splice(ind, 0, new arrow(boxes[ind + 1], boxes[ind]));
              animator.objectIdArray.push(boxes[ind]);
              NewBox = boxes[ind];
              NewBox.x = pos[0];
              NewBox.y = pos[1];
              console.log(arr);
            }),
            animator.animate(1, [[NewBox, 0, -100, 0]]),
            animator.animate(20, [[NewBox, 0, 50, 255]]),
            ...Array.from(Array(ind).keys()).flatMap(() => [
              animator.animate(30, [[NewBox, 80, 0, 0]]),
              animator.delay(10),
            ]),
            animator.animate(
              70,
              arr.filter((_, i) => i > ind).map((item) => [item, 80, 0, 0])
            ),
            animator.animateFunc(1, () => {
              if (ind == boxes.length - 1) {
                arrows.splice(ind, 0, new arrow(boxes[ind], boxes[ind - 1]));
                return;
              }
              arrows.splice(ind, 0, new arrow(boxes[ind + 1], boxes[ind]));
              if (ind > 0) {
                arrows[ind - 1].head = boxes[ind];
              }
            }),
            animator.animate(40, [[NewBox, 0, 50, 0]]),
          ]);
        }
        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];

        let listOfActions = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          // animator.delayMult = 0.5;
          animator.funtionsDictionary = {
            insert: insert,
            div: div,
            add: addNode,
          };
        };

        let start = false;
        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          if (addRef.current.add) {
            // boxes.unshift(new box(0, 0, 8));
            // animator.objectIdArray.push(boxes[3]);
            listOfActions.push({
              funcName: "add",
              objArgs: boxes.map((_, i) => i),
              othArgs: [boxes, [addRef.current.pos, addRef.current.val]],
            });
            console.log(addRef.current);
            addRef.current.add = false;
          }

          const liveInput = [5, 7, 2]; //inputRef.current;
          if (liveInput.length > 0) {
            if (!start) {
              for (let i = 0; i < liveInput.length; i++) {
                boxes[i] = new box(
                  100 - 20 * liveInput.length + i * 80,
                  200,
                  liveInput[i]
                );
                animator.objectIdArray[i] = boxes[i];
                listOfActions.push({ funcName: "insert", objArgs: [i] });
              }

              for (let i = 1; i < boxes.length; i++) {
                arrows[i - 1] = new arrow(boxes[i], boxes[i - 1]);
              }

              box.maxVal = boxes.reduce((max, obj) =>
                obj.val > max.val ? obj : max
              ).val;
              box.minVal = boxes.reduce((max, obj) =>
                obj.val < max.val ? obj : max
              ).val;

              // listOfActions.push(...getMergeSortInstructions(liveInput.length));

              console.log(listOfActions);

              start = true;
            }
            animator.mainAnimationSequence(listOfActions);
            boxes.forEach((i) => {
              i.show();
            });
            arrows.forEach((i) => {
              i.show();
            });
          }
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      return () => {
        myP5.remove(); // Clean up on unmount
      };
    });
  }, []);

  useEffect(() => {
    inputRef.current = inputArray;
    addRef.current = add;
  }, [inputArray, add]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
