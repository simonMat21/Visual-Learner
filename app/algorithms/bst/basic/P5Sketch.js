"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "@/components/Animator";

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

        class box {
          constructor(val, x, y, op) {
            this.val = val;
            this.x = x;
            this.y = y;
            this.opacity = op;
          }
          show() {
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

          update() {
            if (this.parent) {
              this.wd = this.parent.wd / 2;
              if (this.parent.lchild === this) this.x = this.parent.x - this.wd;
              if (this.parent.rchild === this) this.x = this.parent.x + this.wd;
            }
            if (this.rchild) this.rchild.update();
            if (this.lchild) this.lchild.update();
          }
        }
        //-----------------------------------------------------------------------------------------------

        function getMin(node) {
          if (checkers[1] === undefined) {
            checkers[1] = new checker(node.x, node.y);
            checkers[1].col = [200, 150, 255];
            listOfActions.push({
              funcName: "insert",
              othArgs: [checkers[1]],
            });
          }
          while (node.lchild != null) {
            listOfActions.push({
              funcName: "check",
              othArgs: [node, checkers[1]],
            });
            node = node.lchild;
          }
          listOfActions.push({
            funcName: "check",
            othArgs: [node, checkers[1]],
          });
          listOfActions.push({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(10, () => {
                  checkers[1].col = [0, 255, 0];
                }),
                animator.animate(40, [[checkers[1], 0, 0, -255]]),
                animator.animateFunc(1, () => {
                  checkers.splice(1, 1);
                }),
              ]);
            },
            othArgs: [root, checkers[0]],
          });
          return node;
        }

        function addNodeN(val, rt) {
          if (rt === null) {
            root = new Node(val, null, null);
            root.setPosition(P.width / 2, 50, P.width / 2);
            root.opacity = 0;
            listOfActions.push({
              funcName: "insert",
              // func: insert,
              othArgs: [root],
            });
            return;
          }
          checkers.push(new checker(rt.x, rt.y));
          listOfActions.push({
            funcName: "insert",
            // func: insert,
            othArgs: [checkers[0]],
          });
          while (rt != null) {
            listOfActions.push({
              funcName: "check",
              othArgs: [rt, checkers[0]],
            });
            if (rt.val > val) {
              if (rt.lchild != null) {
                rt = rt.lchild;
              } else {
                listOfActions.push({
                  funcName: "addNode",
                  othArgs: [rt, "l", val],
                });
                return;
              }
            } else {
              if (rt.rchild != null) {
                rt = rt.rchild;
              } else {
                listOfActions.push({
                  funcName: "addNode",
                  othArgs: [rt, "r", val],
                });
                return;
              }
            }
          }
        }

        function searchNodeN(val, root) {
          let curr = root;
          if (checkers[0] === undefined) {
            checkers[0] = new checker(root.x, root.y);
            listOfActions.push({
              funcName: "insert",
              othArgs: [checkers[0]],
            });
          }

          while (curr) {
            listOfActions.push({
              funcName: "check",
              othArgs: [curr, checkers[0]],
            });
            if (curr.val === val) {
              listOfActions.push({
                func: function () {
                  return animator.animationSequence([
                    animator.animateFunc(10, () => {
                      checkers[0].col = [0, 255, 0];
                    }),
                    animator.animate(40, [[checkers[0], 0, 0, -255]]),
                    animator.animateFunc(1, () => {
                      checkers.splice(0, 1);
                    }),
                  ]);
                },
              });
              return curr;
            }
            if (val < curr.val) curr = curr.lchild;
            else curr = curr.rchild;
          }
          listOfActions.push({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(10, () => {
                  checkers[0].col = [0, 0, 0];
                }),
                animator.animate(40, [[checkers[0], 0, 0, -255]]),
                animator.animateFunc(1, () => {
                  checkers.splice(0, 1);
                }),
              ]);
            },
          });
          return null; // Not found
        }

        function getAllNodesWithData(curr, x, y, opacity) {
          const result = [];
          const stack = [];

          if (!curr) return result;

          stack.push(curr);

          while (stack.length > 0) {
            const node = stack.pop();
            result.push([node, x, y, opacity]);

            // Push right child first so left is processed first (like in DFS preorder)
            if (node.rchild) stack.push(node.rchild);
            if (node.lchild) stack.push(node.lchild);
          }

          return result;
        }

        function deleteNode(val, rt) {
          let curr = rt;
          if (checkers[0] === undefined) {
            checkers[0] = new checker(rt.x, rt.y);
            listOfActions.push({
              funcName: "insert",
              othArgs: [checkers[0]],
            });
          }

          while (curr) {
            listOfActions.push({
              funcName: "check",
              othArgs: [curr, checkers[0]],
            });

            if (curr.val === val) {
              // Case 1: No children
              if (curr.lchild == null && curr.rchild == null) {
                listOfActions.push({
                  func: function () {
                    return animator.animationSequence([
                      animator.animateFunc(10, () => {
                        checkers[0].col = [0, 255, 0];
                      }),
                      animator.animate(30, [
                        [curr, 0, 0, -255],
                        [checkers[0], 0, 0, -255],
                      ]),
                      animator.animateFunc(1, () => {
                        checkers.splice(0, 1);
                        if (curr.parent) {
                          if (curr.parent.rchild === curr) {
                            curr.parent.rchild = null;
                          } else {
                            curr.parent.lchild = null;
                          }
                        } else {
                          root = null; // 🔧 deleted node was root
                        }
                      }),
                    ]);
                  },
                });
              }

              // Case 2: One child (right)
              else if (curr.lchild == null) {
                listOfActions.push({
                  func: function () {
                    return animator.animationSequence([
                      animator.animateFunc(10, () => {
                        checkers[0].col = [0, 255, 0];
                      }),
                      animator.animate(30, [
                        [curr, 0, 0, -255],
                        [checkers[0], 0, 0, -255],
                      ]),
                      animator.animate(
                        30,
                        getAllNodesWithData(
                          curr.rchild,
                          animator.initialDiffSeq(curr.x, curr.rchild.x, 0),
                          animator.initialDiffSeq(curr.y, curr.rchild.y, 1),
                          0
                        )
                      ),
                      animator.animateFunc(1, () => {
                        checkers.splice(0, 1);
                        if (curr.parent) {
                          if (curr.parent.lchild === curr) {
                            curr.parent.lchild = curr.rchild;
                          } else {
                            curr.parent.rchild = curr.rchild;
                          }
                          curr.rchild.parent = curr.parent;
                        } else {
                          root = curr.rchild; // 🔧 deleted node was root
                          root.parent = null;
                          root.wd = 500;
                        }
                        root.update();
                      }),
                    ]);
                  },
                });
              }

              // Case 2: One child (left)
              else if (curr.rchild == null) {
                listOfActions.push({
                  func: function () {
                    return animator.animationSequence([
                      animator.animateFunc(10, () => {
                        checkers[0].col = [0, 255, 0];
                      }),
                      animator.animate(30, [
                        [curr, 0, 0, -255],
                        [checkers[0], 0, 0, -255],
                      ]),
                      animator.animate(
                        30,
                        getAllNodesWithData(
                          curr.lchild,
                          animator.initialDiffSeq(curr.x, curr.lchild.x, 0),
                          animator.initialDiffSeq(curr.y, curr.lchild.y, 1),
                          0
                        )
                      ),
                      animator.animateFunc(1, () => {
                        checkers.splice(0, 1);
                        if (curr.parent) {
                          if (curr.parent.lchild === curr) {
                            curr.parent.lchild = curr.lchild;
                          } else {
                            curr.parent.rchild = curr.lchild;
                          }
                          curr.lchild.parent = curr.parent;
                        } else {
                          root = curr.lchild; // 🔧 deleted node was root
                          root.parent = null;
                          root.wd = 500;
                        }
                        root.update();
                      }),
                    ]);
                  },
                });
              }

              // Case 3: Two children – swap with successor and delete recursively
              else {
                let minNode = getMin(curr.rchild);
                listOfActions.push({
                  func: function () {
                    return animator.animationSequence([
                      animator.animateFunc(1, () => {
                        checkers.splice(0, 1);
                        boxes[0] = new box(
                          curr.val,
                          curr.x,
                          curr.y,
                          curr.opacity
                        );
                        boxes[1] = new box(
                          minNode.val,
                          minNode.x,
                          minNode.y,
                          minNode.opacity
                        );
                        curr.hide = true;
                        minNode.hide = true;
                      }),
                      animator.to(90, [
                        [boxes[0], minNode.x, minNode.y, 255],
                        [boxes[1], curr.x, curr.y, 255],
                      ]),
                      animator.animateFunc(1, () => {
                        boxes = [];
                        [curr.val, minNode.val] = [minNode.val, curr.val];
                        curr.hide = false;
                        minNode.hide = false;
                        deleteNode(val, curr.rchild);
                      }),
                    ]);
                  },
                });
              }

              return curr;
            }

            curr = val < curr.val ? curr.lchild : curr.rchild;
          }

          // If node not found
          listOfActions.push({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(10, () => {
                  checkers[0].col = [0, 0, 0];
                }),
                animator.animate(40, [[checkers[0], 0, 0, -255]]),
                animator.animateFunc(1, () => {
                  checkers.splice(0, 1);
                }),
              ]);
            },
          });

          return null;
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

        //------------------------------------------------------------------------------------------------

        let boxes = [];
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
            check: check,
          };
        };

        P.draw = () => {
          P.frameRate(60);
          P.background(220, 34, 72);

          animator.mainAnimationSequence(listOfActions);
          animator.setDelayMult(animSpdRef.current);

          if (animator.executing) {
            actionExicutableRef.current(false);
          } else {
            actionExicutableRef.current(true);
          }
          if (addRef.current.start) {
            addNodeN(addRef.current.val, root);
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            deleteNode(deleteRef.current.pos, root);
            deleteRef.current.start = false;
          }

          if (searchRef.current.start) {
            searchNodeN(searchRef.current.val, root);
            searchRef.current.start = false;
          }

          if (root) {
            root.show();
          }
          checkers.forEach((i) => i.show());
          boxes.forEach((i) => i.show());
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
    actionExicutableRef.current = actionExicutable;
  }, [dlt, add, srch, animSpd, actionExicutable]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
