"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator2";

export default function P5Sketch({ add, animSpd, actionExicutable }) {
  const sketchRef = useRef(null);
  const addRef = useRef(add);
  const animSpdRef = useRef(animSpd);

  useEffect(() => {
    // Dynamically import p5 only on the client
    import("p5").then((p5Module) => {
      const p5 = p5Module.default;

      const sketch = (P) => {
        class MinHeap {
          constructor() {
            this.heap = [];
          }

          // Swap two elements in the heap array
          swap(i, j) {
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
          }

          // Get parent index
          parent(i) {
            return Math.floor((i - 1) / 2);
          }

          // Get left child index
          left(i) {
            return 2 * i + 1;
          }

          // Get right child index
          right(i) {
            return 2 * i + 2;
          }

          // Add a new value to the heap
          add(value) {
            this.heap.push(value);
            this.heapifyUp(this.heap.length - 1);
          }

          // Move the value up to maintain heap property
          heapifyUp(i) {
            let current = i;
            while (
              current > 0 &&
              this.heap[current] < this.heap[this.parent(current)]
            ) {
              this.swap(current, this.parent(current));
              current = this.parent(current);
            }
          }

          // Remove and return the minimum value (root)
          delete() {
            if (this.heap.length === 0) return null;
            if (this.heap.length === 1) return this.heap.pop();

            const min = this.heap[0];
            this.heap[0] = this.heap.pop();
            this.heapifyDown(0);
            return min;
          }

          // Move the root value down to maintain heap property
          heapifyDown(i) {
            let smallest = i;
            const left = this.left(i);
            const right = this.right(i);

            if (
              left < this.heap.length &&
              this.heap[left] < this.heap[smallest]
            ) {
              smallest = left;
            }
            if (
              right < this.heap.length &&
              this.heap[right] < this.heap[smallest]
            ) {
              smallest = right;
            }

            if (smallest !== i) {
              this.swap(i, smallest);
              this.heapifyDown(smallest);
            }
          }

          // Search for a value in the heap
          search(value) {
            return this.heap.indexOf(value); // returns -1 if not found
          }

          // Utility to print the heap
          print() {
            console.log(this.heap);
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
        let arrows = [];

        const heap = new MinHeap();

        P.setup = () => {
          P.createCanvas(1000, 500);
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
            actionExicutable(false);
          } else {
            actionExicutable(true);
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
    animSpdRef.current = animSpd;
  }, [add, animSpd]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
