"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "@/components/Animator2";

export default function P5Sketch({ add, animSpd, actionExicutable }) {
  const sketchRef = useRef(null);
  const addRef = useRef(add);
  const animSpdRef = useRef(animSpd);
  const actionExicutableRef = useRef(actionExicutable);

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

        class arrow {
          constructor(head = null, tail = null) {
            this.head = { x: head.x, y: head.y };
            this.tail = { x: tail.x, y: tail.y };
            this.opacity = 255;
          }
          show() {
            P.push();
            P.stroke(0, 0, 255, this.opacity);
            P.strokeWeight(3);
            P.noFill();
            P.bezier(
              this.head.x,
              this.head.y - 20,
              this.head.x,
              this.tail.y + 20,
              this.tail.x,
              this.head.y - 20,
              this.tail.x,
              this.tail.y + 20
            );
            P.line(
              this.head.x,
              this.head.y - 21,
              this.head.x + 5,
              this.head.y - 21 - 5
            );
            P.line(
              this.head.x,
              this.head.y - 21,
              this.head.x - 5,
              this.head.y - 21 - 5
            );
            P.pop();
          }
        }

        class box_ex {
          static maxVal = 100;
          static minVal = 0;
          constructor(x = 0, y = 0, val = P.floor(P.random() * 255)) {
            this.x = x;
            this.y = y;
            this.val = val;
            this.opacity = 0;
            this.hide = false;
            this.parent = null;
            this.lchild = null;
            this.rchild = null;
            this.wd = 0;
          }

          show() {
            P.fill(
              P.map(this.val, box.minVal, box.maxVal, 255, 50),
              this.opacity
            );
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x, this.y);
          }

          setPosition(x = this.x, y = this.y, wd = this.wd) {
            this.wd = wd;
            this.x = x;
            this.y = y;
          }
        }

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
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40);
            P.fill(255, 105, 0, this.opacity);
            P.strokeWeight(3);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x, this.y);
          }
        }

        class Node {
          constructor(
            val = P.floor(P.random(100)),
            x = P.random(P.width / 2),
            y = P.random(P.height / 2),
            wd = 1000
          ) {
            this.x = x;
            this.y = y;
            this.val = val;
            this.wd = wd;
            this.opacity = 255;
            this.parent = null;
            this.rchild = null;
            this.lchild = null;
            this.hide = false;
          }

          show() {
            P.push();
            P.stroke(0, 0, 255, this.opacity);
            P.strokeWeight(3);
            P.noFill();
            if (this.parent != null) {
              P.bezier(
                this.x,
                this.y - 20,
                this.x,
                this.parent.y + 20,
                this.parent.x,
                this.y - 20,
                this.parent.x,
                this.parent.y + 20
              );
              P.line(this.x, this.y - 21, this.x + 5, this.y - 21 - 5);
              P.line(this.x, this.y - 21, this.x - 5, this.y - 21 - 5);
            }
            if (this.rchild != null) {
              this.rchild.show();
            }
            if (this.lchild != null) {
              this.lchild.show();
            }
            P.pop();

            if (!this.hide) {
              P.push();
              //---------rect---------
              P.noStroke();
              P.fill(68, 5, 97, this.opacity);
              P.rectMode(P.CENTER);
              P.rect(this.x, this.y, 40);
              //---------text---------
              P.fill(255, 105, 0, this.opacity);
              P.strokeWeight(1);
              P.textAlign(P.CENTER, P.CENTER);
              P.textSize(20);
              P.noStroke();
              P.text(this.val, this.x, this.y);
              P.pop();
            }
          }

          getPosition() {
            return [this.x, this.y];
          }

          setPosition(x = this.x, y = this.y, wd = this.wd) {
            this.wd = wd;
            this.x = x;
            this.y = y;
          }

          fixSetup(x = 100, y = 10, wd = 1000) {
            // console.log(12);
            if (this.parent != null) {
              if (this === this.parent.lchild) {
                this.x = this.parent.x + this.parent.wd / 2;
              } else {
                this.x = this.parent.x - this.parent.wd / 2;
              }
              this.y = this.parent.y + 100;
              this.wd = this.parent.wd / 2;
            } else {
              this.x = x;
              this.y = y;
              this.wd = wd;
            }
            if (this.rchild != null) {
              this.rchild.fixSetup();
            }
            if (this.lchild != null) {
              this.lchild.fixSetup();
            }
          }
        }

        //-----------------------------------------------------------------------------------------------

        function heapSortByVal(animator, arr) {
          const n = arr.length;

          function heapify(arr, n, i) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && arr[left].val > arr[largest].val) {
              largest = left;
            }

            if (right < n && arr[right].val > arr[largest].val) {
              largest = right;
            }

            if (largest !== i) {
              [arr[i], arr[largest]] = [arr[largest], arr[i]];
              animator.addStage({
                funcName: "swap",
                Args: [arr[i], arr[largest]],
              });
              heapify(arr, n, largest);
            }
          }

          // Build max heap
          for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
          }

          // Heap sort
          for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            animator.addStage({
              funcName: "swap",
              Args: [arr[0], arr[i]],
            });
            heapify(arr, i, 0);
          }

          return arr;
        }

        //-----------------------------------------------------------------------------------------------

        function check(_, [a, ckr]) {
          return animator_1.animationSequence([
            animator_1.delay(10),
            animator_1.to(40, [{ obj: ckr, x: a.x, y: a.y }]),
          ]);
        }

        function insert([a]) {
          return animator_1.animationSequence([
            animator_1.animate(1, [{ obj: a, changes: { y: -50 } }]),
            animator_1.animate(20, [
              { obj: a, changes: { y: 50, opacity: 255 } },
            ]),
          ]);
        }
        function insertNode([a]) {
          return animator_2.animationSequence([
            animator_2.animate(1, [{ obj: a, changes: { y: -50 } }]),
            animator_2.animate(20, [
              { obj: a, changes: { y: 50, opacity: 255 } },
            ]),
          ]);
        }

        function swap([a, b]) {
          return animator_1.animationSequence([
            animator_1.animate(15, [
              { obj: a, changes: { y: 40 } },
              { obj: b, changes: { y: -40 } },
            ]),
            animator_1.to(19, [
              {
                obj: a,
                changes: { x: animator_1.initialVal(b.x, 0) },
              },
              {
                obj: b,
                changes: { x: animator_1.initialVal(a.x, 1) },
              },
            ]),
            animator_1.animate(15, [
              { obj: a, changes: { y: -40 } },
              { obj: b, changes: { y: 40 } },
            ]),
          ]);
        }

        function swapNode([a, b]) {
          return animator_2.animationSequence([
            animator_2.to(40, [
              {
                obj: a,
                changes: {
                  x: animator_2.initialVal(b.x, 0),
                  y: animator_2.initialVal(b.y, 1),
                },
              },
              {
                obj: b,
                changes: {
                  x: animator_2.initialVal(a.x, 2),
                  y: animator_2.initialVal(a.y, 3),
                },
              },
            ]),
            animator_2.delay(10),
          ]);
        }

        //------------------------------------------------------------------------------------------------
        function getHeapLevels(heapArray) {
          const levels = [];
          let level = 0;
          let start = 0;

          while (start < heapArray.length) {
            const end = Math.min(heapArray.length, start + 2 ** level);
            const currentLevel = heapArray.slice(start, end);
            levels.push(currentLevel);
            start = end;
            level++;
          }

          return levels;
        }

        function linkHeapNodes(arr) {
          for (let i = 0; i < arr.length; i++) {
            const node = arr[i];

            const leftIndex = 2 * i + 1;
            const rightIndex = 2 * i + 2;
            const parentIndex = Math.floor((i - 1) / 2);

            // Link left child if exists
            if (leftIndex < arr.length) {
              node.lchild = arr[leftIndex];
            } else {
              node.lchild = null;
            }

            // Link right child if exists
            if (rightIndex < arr.length) {
              node.rchild = arr[rightIndex];
            } else {
              node.rchild = null;
            }

            // Link parent if not root
            if (i === 0) {
              node.parent = null;
            } else {
              node.parent = arr[parentIndex];
            }
          }

          return arr;
        }

        function setupArrows(arr) {
          arr.forEach((item) => {
            if (item.parent) {
              arrows.push(new arrow(item, item.parent));
            }
          });
        }

        //------------------------------------------------------------------------------------------------

        let boxes = [];
        let boxes_s = [];
        let checkers = [];
        let animator_1;
        let animator_2;
        let root;
        let arrows = [];

        P.setup = () => {
          P.createCanvas(1000, 500);
          root = new Node();
          root.val = 12;
          root.setPosition(P.width / 2, 180, P.width / 2);
          root.show();
          animator_1 = new Animator();
          animator_2 = new Animator();

          animator_2.functionsDictionary = {
            swap: swapNode,
            insert: insertNode,
          };

          animator_1.functionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
          };
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          animator_1.mainAnimationSequence();
          animator_2.mainAnimationSequence();
          animator_1.setDelayMult(animSpdRef.current);
          animator_2.setDelayMult(animSpdRef.current);

          if (animator_1.executing || animator_2.executing) {
            actionExicutableRef.current(false);
          } else {
            actionExicutableRef.current(true);
          }

          if (addRef.current.start && addRef.current.val.length != 0) {
            boxes = [];
            boxes_s = [];
            arrows = [];
            const liveInput = addRef.current.val;
            for (let i = 0; i < liveInput.length; i++) {
              boxes[i] = new box(
                P.width / 2 - 20 * liveInput.length + i * 40,
                60,
                liveInput[i]
              );
              boxes_s[i] = new box_ex(
                P.width / 2 - 20 * liveInput.length + i * 40,
                50,
                liveInput[i]
              );
              animator_1.objectIdArray[i] = boxes[i];
              animator_1.addStage({ funcName: "insert", Args: [boxes[i]] });
              animator_2.addStage({ funcName: "insert", Args: [boxes_s[i]] });
            }

            linkHeapNodes(boxes_s);
            boxes_s[0].setPosition(P.width / 2, 150, P.width / 2);
            boxes_s.forEach((item) => {
              if (item.parent) {
                if (item.parent.lchild === item) {
                  item.setPosition(
                    item.parent.x - item.parent.wd / 2,
                    item.parent.y + 100,
                    item.parent.wd / 2
                  );
                } else {
                  item.setPosition(
                    item.parent.x + item.parent.wd / 2,
                    item.parent.y + 100,
                    item.parent.wd / 2
                  );
                }
              }
            });
            setupArrows(boxes_s);
            console.log(animator_2.listOfActions);

            box.maxVal = boxes.reduce((max, obj) =>
              obj.val > max.val ? obj : max
            ).val;
            box.minVal = boxes.reduce((max, obj) =>
              obj.val < max.val ? obj : max
            ).val;
            box_ex.maxVal = box.maxVal;
            box_ex.minVal = box.minVal;
            heapSortByVal(animator_1, boxes);
            heapSortByVal(animator_2, boxes_s);
            addRef.current.start = false;
          }

          checkers.forEach((i) => i.show());
          boxes.forEach((i) => i.show());
          boxes_s.forEach((i) => i.show());
          arrows.forEach((i) => i.show());
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
    actionExicutableRef.current = actionExicutable;
    animSpdRef.current = animSpd;
  }, [add, animSpd, actionExicutable]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
