"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator2";

export default function P5Sketch({
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
          static maxVal = 100;
          static minVal = 0;
          constructor(val, parent = null) {
            this.parent = parent;
            this.val = val;

            this.x = parent ? parent.x : 0;
            this.y = parent ? parent.y : 0;

            this.opacity = 0;
            this.hide = false;
            this.wd = parent ? parent.wd / 2 : P.width / 2;
          }

          setNode(lor = true) {
            this.wd = this.parent.wd / 2;
            this.x = lor ? this.parent.x - this.wd : this.parent.x + this.wd;
            this.y = this.parent.y + 100;
          }

          show() {
            P.fill(
              P.map(this.val, Node.minVal, Node.maxVal, 255, 50),
              this.opacity
            );
            P.stroke(0, 0, 255, this.opacity);

            if (this.parent) {
              P.push();
              if (!this.hide) {
                P.noFill();
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
                P.pop();
              }
            }

            P.noStroke();
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 40);
            P.fill(255, 105, 0, this.opacity);
            P.textAlign(P.CENTER, P.CENTER);
            P.textSize(20);
            P.noStroke();
            P.text(this.val, this.x, this.y);
          }
        }

        class NodeHeap {
          constructor() {
            this.heap = [];
          }

          // Helper: Swap two boxes in the heap
          swap(i, j) {
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
            animator_2.addStage({
              funcName: "swap",
              Args: [this.heap[i], this.heap[j]],
            });
          }

          // Parent and children indices
          parent(i) {
            return Math.floor((i - 1) / 2);
          }
          left(i) {
            return 2 * i + 1;
          }
          right(i) {
            return 2 * i + 2;
          }

          // Add a new box to the heap
          add(val) {
            let item;
            if (this.heap.length > 0) {
              console.log(this.heap[this.parent(this.heap.length)]);
              item = new Node(val, this.heap[this.parent(this.heap.length)]);
              item.setNode(this.heap.length % 2 === 1);
            } else {
              item = new Node(val, null);
              item.x = P.width / 2;
              item.y = 200;
            }

            Node.maxVal =
              this.heap.length > 0
                ? this.heap.reduce((max, obj) =>
                    obj.val > max.val ? obj : max
                  ).val
                : 100;
            Node.minVal =
              this.heap.length > 0
                ? this.heap.reduce((max, obj) =>
                    obj.val < max.val ? obj : max
                  ).val
                : 0;

            animator_2.addStage({
              funcName: "insert",
              Args: [item],
            });
            this.heap.push(item);
            this.heapifyUp(this.heap.length - 1);
          }

          // Restore heap upward
          heapifyUp(i) {
            let current = i;
            while (
              current > 0 &&
              this.heap[current].val < this.heap[this.parent(current)].val
            ) {
              this.swap(current, this.parent(current));
              current = this.parent(current);
            }
          }

          // Delete root box (min)
          delete() {
            if (this.heap.length === 0) return null;
            if (this.heap.length === 1) return this.heap.pop();

            const min = this.heap[0];
            animator_2.addStage({
              funcName: "delete",
              Args: [this.heap[0]],
            });
            animator_2.addStage({
              funcName: "swap",
              Args: [this.heap[0], this.heap[this.heap.length - 1]],
            });
            animator_1.addStage({
              func: () => {
                return animator_1.animationSequence([
                  animator_1.animateFunc(1, () => {
                    this.heap[0] = this.heap.pop();
                    this.heapifyDown(0);
                  }),
                ]);
              },
            });
            // this.heap[0] = this.heap.pop();
            // this.heapifyDown(0);
            return min;
          }

          // Restore heap downward
          heapifyDown(i) {
            let smallest = i;
            const left = this.left(i);
            const right = this.right(i);

            if (
              left < this.heap.length &&
              this.heap[left].val < this.heap[smallest].val
            ) {
              smallest = left;
            }
            if (
              right < this.heap.length &&
              this.heap[right].val < this.heap[smallest].val
            ) {
              smallest = right;
            }

            if (smallest !== i) {
              this.swap(i, smallest);
              this.heapifyDown(smallest);
            }
          }

          // Search for a box by its val (returns first match or -1)
          search(val) {
            return this.heap.findIndex((b) => b.val === val);
          }

          // Optional: print val list for debug
          printVals() {
            console.log(this.heap.map((b) => b.val));
          }
        }

        class BoxHeap {
          constructor() {
            this.heap = [];
          }

          // Helper: Swap two boxes in the heap
          swap(i, j) {
            animator_1.addStage({
              funcName: "swap",
              Args: [this.heap[i], this.heap[j]],
            });
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
          }

          // Parent and children indices
          parent(i) {
            return Math.floor((i - 1) / 2);
          }
          left(i) {
            return 2 * i + 1;
          }
          right(i) {
            return 2 * i + 2;
          }

          // Add a new box to the heap
          add(item) {
            animator_1.addStage({
              funcName: "insert",
              Args: [item],
            });
            Box.maxVal =
              this.heap.length > 0
                ? this.heap.reduce((max, obj) =>
                    obj.val > max.val ? obj : max
                  ).val
                : 100;
            Box.minVal =
              this.heap.length > 0
                ? this.heap.reduce((max, obj) =>
                    obj.val < max.val ? obj : max
                  ).val
                : 0;
            this.heap.push(item);
            this.heapifyUp(this.heap.length - 1);
          }

          // Restore heap upward
          heapifyUp(i) {
            let current = i;
            while (
              current > 0 &&
              this.heap[current].val < this.heap[this.parent(current)].val
            ) {
              this.swap(current, this.parent(current));
              current = this.parent(current);
            }
          }

          // Delete root box (min)
          delete() {
            if (this.heap.length === 0) return null;
            if (this.heap.length === 1) return this.heap.pop();

            const min = this.heap[0];
            animator_1.addStage({
              funcName: "delete",
              Args: [this.heap[0]],
            });
            animator_1.addStage({
              funcName: "swap",
              Args: [this.heap[0], this.heap[this.heap.length - 1]],
            });
            animator_1.addStage({
              func: () => {
                return animator_1.animationSequence([
                  animator_1.animateFunc(1, () => {
                    this.heap[0] = this.heap.pop();
                    this.heapifyDown(0);
                  }),
                ]);
              },
            });
            // this.heap[0] = this.heap.pop();
            // this.heapifyDown(0);
            return min;
          }

          // Restore heap downward
          heapifyDown(i) {
            let smallest = i;
            const left = this.left(i);
            const right = this.right(i);

            if (
              left < this.heap.length &&
              this.heap[left].val < this.heap[smallest].val
            ) {
              smallest = left;
            }
            if (
              right < this.heap.length &&
              this.heap[right].val < this.heap[smallest].val
            ) {
              smallest = right;
            }

            if (smallest !== i) {
              this.swap(i, smallest);
              this.heapifyDown(smallest);
            }
          }

          // Search for a box by its val (returns first match or -1)
          search(val) {
            return this.heap.findIndex((b) => b.val === val);
          }

          // Optional: print val list for debug
          printVals() {
            console.log(this.heap.map((b) => b.val));
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
            if (this.head && this.tail) {
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

          setUp(a) {
            this.head = a;
            this.tail = a.parent || null;
          }
        }

        //-----------------------------------------------------------------------------------------------

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

        function delete_([a]) {
          return animator_1.animationSequence([
            animator_1.animate(20, [
              { obj: a, changes: { y: -50, opacity: -255 } },
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
            animator_2.animateFunc(1, () => {}),
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
            animator_2.animateFunc(1, () => {}),
            animator_2.delay(10),
          ]);
        }

        function deleteNode([a]) {
          return animator_2.animationSequence([
            animator_2.animate(20, [{ obj: a, changes: { opacity: -255 } }]),
          ]);
        }

        //------------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------------

        let checkers = [];
        let animator_1;
        let animator_2;

        let swapers = [];

        const heap = new BoxHeap();
        const nodeHeap = new NodeHeap();

        P.setup = () => {
          P.createCanvas(1000, 500);
          animator_1 = new Animator();
          animator_2 = new Animator();

          animator_2.functionsDictionary = {
            swap: swapNode,
            insert: insertNode,
            delete: deleteNode,
          };

          animator_1.functionsDictionary = {
            insert: insert,
            check: check,
            swap: swap,
            delete: delete_,
          };

          // swapers[0] = new arrow();
          // swapers[1] = new arrow();

          heap.add(new Box(100, 100, 12));
          heap.add(new Box(150, 100, 18));
          heap.add(new Box(200, 100, 14));
          heap.add(new Box(250, 100, 1));
          heap.delete();

          nodeHeap.add(12);
          nodeHeap.add(18);
          nodeHeap.add(14);
          nodeHeap.add(1);
          nodeHeap.delete();
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

          //--
          if (addRef.current.start) {
            heap.add(
              new Box(heap.heap.length * 50 + 100, 100, addRef.current.val)
            );
            nodeHeap.add(addRef.current.val);
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            heap.delete();
            nodeHeap.delete();
            deleteRef.current.start = false;
          }

          if (searchRef.current.start) {
            heap.search(searchRef.current.val);
            heap.printVals();

            searchRef.current.start = false;
          }

          checkers.forEach((i) => i.show());
          // swapers.forEach((i) => i.show());
          heap.heap.forEach((i) => i.show());
          nodeHeap.heap.forEach((i) => i.show());
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
