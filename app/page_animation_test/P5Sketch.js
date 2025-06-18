"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "../components/Animator";

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

          getPosition() {
            return [this.x, this.y];
          }

          setPosition(x = this.x, y = this.y, wd = this.wd) {
            this.wd = wd;
            this.x = x;
            this.y = y;
          }

          hilight() {
            P.push();
            P.stroke(42, 161, 152);
            P.strokeWeight(4);
            P.noFill();
            P.rectMode(P.CENTER);
            P.rect(this.x, this.y, 80, 50, 10);
            P.pop();
          }
        }
        //-----------------------------------------------------------------------------------------------

        function getMin(node) {
          if (checkers[1] === undefined) {
            checkers.push(new checker(node.x, node.y));
            listOfActions.push({
              funcName: "insert",
              othArgs: [checkers[1]],
            });
          }
          while (node.lchild != null) {
            node = node.lchild;
          }
          return node;
        }

        function addNodeN(val, root) {
          checkers.push(new checker(root.x, root.y));
          listOfActions.push({
            funcName: "insert",
            // func: insert,
            othArgs: [checkers[0]],
          });
          while (root != null) {
            listOfActions.push({
              funcName: "check",
              othArgs: [root, checkers[0]],
            });
            if (root.val > val) {
              if (root.lchild != null) {
                root = root.lchild;
              } else {
                listOfActions.push({
                  funcName: "addNode",
                  othArgs: [root, "l", val],
                });
                console.log(listOfActions);
                return;
              }
            } else {
              if (root.rchild != null) {
                root = root.rchild;
              } else {
                listOfActions.push({
                  funcName: "addNode",
                  othArgs: [root, "r", val],
                });
                return;
              }
            }
          }
        }

        function deleteNodeN(val, root) {
          if (root == null) return null;
          if (checkers[0] === undefined) {
            checkers.push(new checker(root.x, root.y));
            listOfActions.push({
              funcName: "insert",
              othArgs: [checkers[0]],
            });
          }
          listOfActions.push({
            funcName: "check",
            othArgs: [root, checkers[0]],
          });
          if (val < root.val) {
            root.lchild = deleteNodeN(val, root.lchild);
          } else if (val > root.val) {
            root.rchild = deleteNodeN(val, root.rchild);
          } else {
            // Node to delete found

            // Case 1: No children

            if (root.lchild == null && root.rchild == null) {
              return null;
            }

            // Case 2: Only one child
            if (root.lchild == null) return root.rchild;
            if (root.rchild == null) return root.lchild;

            // Case 3: Two children – find in-order successor
            let minNode = getMin(root.rchild);
            root.val = minNode.val;
            root.rchild = deleteNode(minNode.val, root.rchild);
          }

          return root;
        }
        //-----------------------------------------------------------------------------------------------

        function addNode(_, [parent, RorL, val]) {
          let nNode = RorL === "r" ? parent.rchild : parent.lchild;
          if (nNode === null) {
            nNode = parent;
          }
          return animator.animationSequence([
            animator.animateFunc(1, () => {
              nNode = new Node(val, parent.x, parent.y);
              nNode.parent = parent;
              nNode.opacity = 0;
              if (RorL === "r") {
                console.log("hi");
                parent.rchild = nNode;
                nNode.setPosition(
                  parent.x + parent.wd / 2,
                  parent.y + 100,
                  parent.wd / 2
                );
              } else {
                parent.lchild = nNode;
                nNode.setPosition(
                  parent.x - parent.wd / 2,
                  parent.y + 100,
                  parent.wd / 2
                );
              }
            }),
            animator.animate(15, [[checkers[0], 0, 0, -255]]),
            animator.animateFunc(1, () => {
              checkers = [];
            }),
            animator.to(1, [[nNode, parent.x, parent.y, 0]]),
            animator.animate(70, [
              [
                nNode,
                animator.initialDiffSeq(nNode.x, parent.x, 0),
                animator.initialDiffSeq(nNode.y, parent.y, 1),
                255,
              ],
            ]),
          ]);
        }

        function deleteNode(val, root) {
          if (root == null) return null;
          if (val < root.val) {
            root.lchild = deleteNode(val, root.lchild);
          } else if (val > root.val) {
            root.rchild = deleteNode(val, root.rchild);
          } else {
            // Node to delete found

            // Case 1: No children

            if (root.lchild == null && root.rchild == null) {
              return null;
            }

            // Case 2: Only one child
            if (root.lchild == null) return root.rchild;
            if (root.rchild == null) return root.lchild;

            // Case 3: Two children – find in-order successor
            let minNode = getMin(root.rchild);
            root.val = minNode.val;
            root.rchild = deleteNode(minNode.val, root.rchild);
          }

          return root;
        }

        function check(_, [a, ckr]) {
          return animator.animationSequence([
            animator.delay(10),
            animator.to(40, [[ckr, a.x, a.y, 255]]),
          ]);
        }

        function insert(_, [a]) {
          return animator.animationSequence([
            animator.animate(1, [[a, 0, -50, 0]]),
            animator.animate(20, [[a, 0, 50, 255]]),
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
        let root;

        let listOfActions = [];

        let animator;
        P.setup = () => {
          P.createCanvas(1000, 500);
          root = new Node();
          root.setPosition(P.width / 2, 50, P.width / 2);
          root.show();
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            addNode: addNode,
            search: searchNode,
            delete: deleteNode,
            check: check,
          };
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          animator.mainAnimationSequence(listOfActions);
          animator.setDelayMult(animSpdRef.current);

          if (animator.executing) {
            actionExicutable(false);
          } else {
            actionExicutable(true);
          }

          if (addRef.current.start) {
            addNodeN(addRef.current.val, root);
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            listOfActions.push({
              funcName: "delete",
              othArgs: [deleteRef.current.pos],
            });
            addRef.current.add = false;
          }

          if (searchRef.current.start) {
            listOfActions.push({
              funcName: "search",
              othArgs: [searchRef.current.val],
            });
            addRef.current.add = false;
          }

          root.show();
          checkers.forEach((i) => i.show());
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
