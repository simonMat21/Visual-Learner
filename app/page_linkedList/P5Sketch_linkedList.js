"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

export default function P5Sketch_linkedList({ dlt, add, srch, animSpd }) {
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
            P.rect(this.x, this.y, 40);
            P.pop();
          }
        }

        class arrow {
          constructor(tail, head, x = 100, y = 100) {
            this.opacity = 0;
            this.hide = false;
            this.head = head;
            this.tail = tail;
            this.x = head.x || x;
            this.y = head.y || y;
            this.lockToHead = false;
          }

          show() {
            if (this.lockToHead) {
              this.x = this.head.x;
              this.y = this.head.y;
            }
            P.push();
            P.noFill();
            P.strokeWeight(3);
            P.stroke(0, 0, 255, this.opacity);
            P.bezier(
              this.tail.x + 40,
              this.tail.y + 20,
              this.x,
              this.tail.y + 20,
              this.tail.x + 40,
              this.y + 20,
              this.x,
              this.y + 20
            );
            P.line(this.x, this.y + 20, this.x - 5, this.y + 25);
            P.line(this.x, this.y + 20, this.x - 5, this.y + 15);
            P.pop();
          }

          resetToTail() {
            this.x = this.tail.x + 40;
            this.y = this.tail.y;
          }
        }
        //-----------------------------------------------------------------------------------------------

        function insert([a]) {
          return animator.animationSequence([
            animator.animate(1, [[a, 0, -50, 0]]),
            animator.animate(20, [[a, 0, 50, 255]]),
          ]);
        }

        function addArrow(_, [ar]) {
          return animator.animationSequence([
            animator.to(
              1,
              ar.map((item) => [item, item.tail.x + 40, item.tail.y, 0])
            ),
            animator.to(
              30,
              ar.map((item) => [item, item.head.x, item.head.y, 255])
            ),
            animator.animateFunc(1, () => {
              ar.forEach((item) => {
                item.lockToHead = true;
              });
            }),
          ]);
        }

        function addNode(__, [arr, [ind, val]]) {
          let NewBox = boxes[ind];
          let arToAdd = animator.iV(undefined, 0) || [];
          const pos = [
            animator.initialDiffSeq(arr[0].x, 0, 0),
            animator.initialDiffSeq(arr[0].y, 0, 1),
          ];
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              box.maxVal = box.maxVal > val ? box.maxVal : val;
              box.minVal = box.minVal < val ? box.minVal : val;
              arr.splice(ind, 0, new box(0, 0, val));
              animator.objectIdArray.push(boxes[ind]);
              NewBox = boxes[ind];
              NewBox.x = pos[0];
              NewBox.y = pos[1];
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
                arrows.push(new arrow(boxes[ind - 1], boxes[ind]));
                arToAdd.push(arrows[arrows.length - 1]);
              } else {
                arrows.splice(ind, 0, new arrow(boxes[ind], boxes[ind + 1]));
                arToAdd.push(arrows[ind]);

                if (ind > 0) {
                  arrows[ind - 1].head = boxes[ind];
                  arrows[ind - 1].lockToHead = false;
                  arrows[ind - 1].resetToTail();
                  arrows[ind - 1].opacity = 0;
                  arToAdd.unshift(arrows[ind - 1]);
                }
              }

              animator.iV(arToAdd, 0);
            }),
            ...arToAdd.flatMap((ar) => [
              animator.to(1, [[ar, ar.tail.x + 40, ar.tail.y, 0]]),
              animator.to(30, [[ar, ar.head.x, ar.head.y, 255]]),
              animator.animateFunc(1, () => {
                ar.lockToHead = true;
              }),
            ]),
            animator.animate(40, [[NewBox, 0, 50, 0]]),
          ]);
        }

        function searchNode(_, [val]) {
          let ckr = checkers[0];
          const index = boxes.findIndex((obj) => obj.val === val);
          const result =
            index !== -1
              ? boxes.slice(0, index)
              : boxes.slice(0, boxes.length - 1);
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              checkers.push(new checker(boxes[0].x, boxes[0].y));
              ckr = checkers[0];
            }),
            animator.animate(1, [[ckr, 0, -50, 0]]),
            animator.animate(20, [[ckr, 0, 50, 255]]),
            animator.delay(10),
            ...result.flatMap(() => [
              animator.animate(30, [[ckr, 80, 0, 0]]),
              animator.delay(20),
            ]),
            animator.animateFunc(40, () => {
              if (index !== -1) {
                ckr.col = [0, 255, 0];
              } else {
                ckr.col = [255, 0, 0];
              }
            }),
            animator.animate(20, [[ckr, 0, 0, -255]]),
            animator.animateFunc(1, () => {
              checkers = [];
            }),
          ]);
        }

        function deleteNode(__, [pos]) {
          const lastPos = animator.iV(boxes.length - 1);
          let ckr = checkers[0];
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              checkers.push(new checker(boxes[0].x, boxes[0].y));
              ckr = checkers[0];
            }),
            animator.animate(1, [[ckr, 0, -50, 0]]),
            animator.animate(20, [[ckr, 0, 50, 255]]),
            animator.delay(10),
            ...Array.from(Array(pos).keys()).flatMap(() => [
              animator.animate(30, [[ckr, 80, 0, 0]]),
              animator.delay(20),
            ]),
            animator.animate(30, [
              [ckr, 0, -50, 0],
              [boxes[pos], 0, -50, 0],
            ]),
            animator.animate(20, [
              [ckr, 0, 0, -255],
              ...(pos !== boxes.length - 1 ? [[arrows[pos], 0, 0, -255]] : []),
            ]),
            animator.animateFunc(1, () => {
              arrows.splice(pos, 1);
              if (pos !== 0) {
                arrows[pos - 1].head = boxes[pos + 1];
                arrows[pos - 1].lockToHead = false;
              }

              checkers = [];
            }),
            ...(pos !== lastPos
              ? [
                  animator.to(
                    30,
                    pos !== 0 && pos !== lastPos
                      ? [
                          [
                            arrows[pos - 1],
                            arrows[pos - 1].head.x,
                            arrows[pos - 1].head.y,
                            255,
                          ],
                        ]
                      : []
                  ),
                  animator.animateFunc(1, () => {
                    if (pos !== 0) {
                      arrows[pos - 1].lockToHead = true;
                    }
                  }),
                ]
              : [animator.animate(20, [[arrows[pos - 1], 0, 0, -255]])]),
            animator.animate(10, [[boxes[pos], 0, 0, -255]]),
            animator.animate(
              50,
              boxes.filter((_, i) => i >= pos).map((item) => [item, -80, 0, 0])
            ),
            animator.animateFunc(1, () => {
              if (pos == lastPos) {
                arrows.splice(pos - 1, 1);
              }
              boxes.splice(pos, 1);
            }),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let arrows = [];
        let checkers = [];

        let listOfActions = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            add: addNode,
            addArrow: addArrow,
            search: searchNode,
            delete: deleteNode,
          };
        };

        let start = false;
        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          animator.setDelayMult(animSpdRef.current);

          if (addRef.current.start) {
            listOfActions.push({
              funcName: "add",
              objArgs: boxes.map((_, i) => i),
              othArgs: [boxes, [addRef.current.pos, addRef.current.val]],
            });
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            listOfActions.push({
              funcName: "delete",
              othArgs: [deleteRef.current.pos],
            });
            addRef.current.start = false;
          }

          if (searchRef.current.start) {
            listOfActions.push({
              funcName: "search",
              othArgs: [searchRef.current.val],
            });
            addRef.current.start = false;
          }

          const liveInput = [5, 7, 2, 6, 9]; //inputRef.current;
          if (liveInput.length > 0) {
            if (!start) {
              for (let i = 0; i < liveInput.length; i++) {
                boxes[i] = new box(100 + i * 80, 200, liveInput[i]);
                animator.objectIdArray[i] = boxes[i];
                listOfActions.push({ funcName: "insert", objArgs: [i] });
              }

              for (let i = 1; i < boxes.length; i++) {
                arrows[i - 1] = new arrow(boxes[i - 1], boxes[i]);
              }
              listOfActions.push({
                funcName: "addArrow",
                othArgs: [arrows],
              });

              box.maxVal = boxes.reduce((max, obj) =>
                obj.val > max.val ? obj : max
              ).val;
              box.minVal = boxes.reduce((max, obj) =>
                obj.val < max.val ? obj : max
              ).val;

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
            checkers.forEach((i) => i.show());
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
    addRef.current = add;
    deleteRef.current = dlt;
    searchRef.current = srch;
    animSpdRef.current = animSpd;
  }, [dlt, add, srch, animSpd]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
