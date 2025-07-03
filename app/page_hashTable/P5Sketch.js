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
            if (checkers[1].x !== node.x && checkers[1].y !== node.y) {
              listOfActions.push({
                funcName: "check",
                othArgs: [node, checkers[1]],
              });
            }
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

        function getMax(node) {
          if (checkers[1] === undefined) {
            checkers[1] = new checker(node.x, node.y);
            checkers[1].col = [200, 150, 255];
            listOfActions.push({
              funcName: "insert",
              othArgs: [checkers[1]],
            });
          }
          while (node.rchild != null) {
            if (checkers[1].x !== node.x && checkers[1].y !== node.y) {
              listOfActions.push({
                funcName: "check",
                othArgs: [node, checkers[1]],
              });
            }
            node = node.rchild;
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

        function addNodeN(val, rootN) {
          if (!rootN) {
            root = new Node(val, P.width / 2, 50, P.width / 2);
            root.opacity = 0;
            listOfActions.push({
              funcName: "qq",
              othArgs: [root],
            });
            return;
          }
          let nNode = new Node(val);
          while (rootN != null) {
            if (rootN.val > val) {
              if (rootN.lchild != null) {
                rootN = rootN.lchild;
              } else {
                rootN.lchild = nNode;
                nNode.parent = rootN;
                nNode.opacity = 0;
                nNode.setPosition(
                  rootN.x - rootN.wd / 2,
                  rootN.y + 100,
                  rootN.wd / 2
                );
                listOfActions.push({
                  funcName: "qq",
                  othArgs: [nNode],
                });
                return;
              }
            } else {
              if (rootN.rchild != null) {
                rootN = rootN.rchild;
              } else {
                rootN.rchild = nNode;
                nNode.parent = rootN;
                nNode.opacity = 0;
                nNode.setPosition(
                  rootN.x + rootN.wd / 2,
                  rootN.y + 100,
                  rootN.wd / 2
                );
                listOfActions.push({
                  funcName: "qq",
                  othArgs: [nNode],
                });
                return;
              }
            }
          }
        }

        //-----------------------------------------------------------------------------------------------

        function qq(_, [node]) {
          const parentX = node.parent ? node.parent.x : P.width / 2;
          const parentY = node.parent ? node.parent.y : 50;
          return animator.animationSequence([
            animator.to(1, [[node, parentX, parentY, 0]]),
            animator.animate(40, [
              [
                node,
                animator.initialDiffSeq(node.x, parentX, 0),
                animator.initialDiffSeq(node.y, parentY, 1),
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
          animator = new Animator();
          animator.functionsDictionary = {
            insert: insert,
            search: searchNode,
            check: check,
            qq: qq,
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
            root = null;
            addRef.current.val.forEach((val) => {
              listOfActions.push({
                func: function () {
                  return animator.animationSequence([
                    animator.animateFunc(1, () => {
                      addNodeN(val, root);
                    }),
                  ]);
                },
              });
            });
            addRef.current.start = false;
          }

          if (deleteRef.current.start) {
            getMin(root);
            deleteRef.current.start = false;
          }

          if (searchRef.current.start) {
            getMax(root);
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
  }, [dlt, add, srch, animSpd]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
