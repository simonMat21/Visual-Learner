"use client";

import React, { useRef, useEffect } from "react";
import { Animator } from "@/components/Animator";

export default function P5Sketch({
  add,
  inorder,
  preorder,
  postorder,
  lvlorder,
  animSpd,
  actionExicutable,
}) {
  const sketchRef = useRef(null);
  const inorderRef = useRef(inorder);
  const preorderRef = useRef(preorder);
  const postorderRef = useRef(postorder);
  const lvlorderRef = useRef(lvlorder);
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
              P.line(this.x, this.y - 21, this.x + 3, this.y - 21 - 3);
              P.line(this.x, this.y - 21, this.x - 3, this.y - 21 - 3);
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

        //-----------------------------------------------------------------------------------------------

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
                  rootN.y + 60,
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
                  rootN.y + 60,
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

        function getPreorder(rt) {
          checkers.push(new checker(rt.x, rt.y));
          const id = checkers.length - 1;
          checkers[id].col = [200, 150, 255];
          listOfActions.push({
            funcName: "insert",
            othArgs: [checkers[id]],
          });

          boxes.push(new Box(100 + boxes.length * 50, 400, rt.val));
          listOfActions.push({
            funcName: "insert",
            othArgs: [boxes[boxes.length - 1]],
          });
          listOfActions.push({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(1, () => {
                  checkers[id].col = [0, 255, 0];
                }),
                animator.animate(40, [[checkers[id], 0, 0, -255]]),
              ]);
            },
          });
          if (rt.lchild) getPreorder(rt.lchild);
          if (rt.rchild) getPreorder(rt.rchild);
        }

        function getPostorder(rt) {
          checkers.push(new checker(rt.x, rt.y));
          const id = checkers.length - 1;
          checkers[id].col = [200, 150, 255];
          listOfActions.push({
            funcName: "insert",
            othArgs: [checkers[id]],
          });

          if (rt.lchild) getPostorder(rt.lchild);
          if (rt.rchild) getPostorder(rt.rchild);

          boxes.push(new Box(100 + boxes.length * 50, 400, rt.val));
          listOfActions.push({
            funcName: "insert",
            othArgs: [boxes[boxes.length - 1]],
          });
          listOfActions.push({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(1, () => {
                  checkers[id].col = [0, 255, 0];
                }),
                animator.animate(40, [[checkers[id], 0, 0, -255]]),
              ]);
            },
          });
        }

        function getInorder(rt) {
          checkers.push(new checker(rt.x, rt.y));
          const id = checkers.length - 1;
          checkers[id].col = [200, 150, 255];
          listOfActions.push({
            funcName: "insert",
            othArgs: [checkers[id]],
          });

          if (rt.lchild) getInorder(rt.lchild);
          boxes.push(new Box(100 + boxes.length * 50, 400, rt.val));
          listOfActions.push({
            funcName: "insert",
            othArgs: [boxes[boxes.length - 1]],
          });
          listOfActions.push({
            func: function () {
              return animator.animationSequence([
                animator.animateFunc(1, () => {
                  checkers[id].col = [0, 255, 0];
                }),
                animator.animate(40, [[checkers[id], 0, 0, -255]]),
              ]);
            },
          });
          if (rt.rchild) getInorder(rt.rchild);
        }

        function getLevelOrder(rt) {
          if (!rt) return;

          const queue = [rt];

          while (queue.length > 0) {
            const node = queue.shift();

            // VISIT CURRENT NODE
            checkers.push(new checker(node.x, node.y));
            const id = checkers.length - 1;
            checkers[id].col = [200, 150, 255];
            listOfActions.push({
              funcName: "insert",
              othArgs: [checkers[id]],
            });

            boxes.push(new Box(100 + boxes.length * 50, 400, node.val));
            listOfActions.push({
              funcName: "insert",
              othArgs: [boxes[boxes.length - 1]],
            });

            listOfActions.push({
              func: function () {
                return animator.animationSequence([
                  animator.animateFunc(1, () => {
                    checkers[id].col = [0, 255, 0];
                  }),
                  animator.animate(40, [[checkers[id], 0, 0, -255]]),
                ]);
              },
            });

            // Add children to queue
            if (node.lchild) queue.push(node.lchild);
            if (node.rchild) queue.push(node.rchild);
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

        function insert(_, [a]) {
          return animator.animationSequence([
            animator.animate(1, [[a, 0, -50, 0]]),
            animator.animate(20, [[a, 0, 50, 255]]),
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
            boxes = [];
            checkers = [];
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

          if (inorderRef.current.start) {
            checkers = [];
            boxes = [];
            getInorder(root);
            inorderRef.current.start = false;
          }

          if (preorderRef.current.start) {
            checkers = [];
            boxes = [];
            getPreorder(root);
            preorderRef.current.start = false;
          }

          if (postorderRef.current.start) {
            checkers = [];
            boxes = [];
            getPostorder(root);
            postorderRef.current.start = false;
          }

          if (lvlorderRef.current.start) {
            checkers = [];
            boxes = [];
            getLevelOrder(root);
            lvlorderRef.current.start = false;
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
    inorderRef.current = inorder;
    preorderRef.current = preorder;
    animSpdRef.current = animSpd;
    postorderRef.current = postorder;
    actionExicutableRef.current = actionExicutable;
    lvlorderRef.current = lvlorder;
  }, [inorder, add, preorder, animSpd, postorder, lvlorder, actionExicutable]);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
