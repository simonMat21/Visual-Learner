"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import BalancedTreeVisualizer from "@/components/BalancedTreeVisualizer";

const code = {
  js: `// Red-black tree insertion (left/right mirror cases written out once).
const RED = 1, BLACK = 0;
class Node {
  constructor(val, parent = null) {
    this.val = val; this.parent = parent;
    this.left = this.right = null; this.color = RED;   // new nodes are red
  }
}
const isRed = (n) => n !== null && n.color === RED;

class RedBlackTree {
  constructor() { this.root = null; }

  rotateLeft(x) {
    const y = x.right;
    x.right = y.left; if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.left) x.parent.left = y; else x.parent.right = y;
    y.left = x; x.parent = y;
  }
  rotateRight(x) { /* mirror of rotateLeft */ }

  insert(val) {
    let p = null, cur = this.root;
    while (cur) { p = cur; cur = val < cur.val ? cur.left : cur.right; }
    const z = new Node(val, p);
    if (!p) this.root = z; else if (val < p.val) p.left = z; else p.right = z;
    this.fixInsert(z);
  }

  fixInsert(z) {
    while (isRed(z.parent)) {
      const p = z.parent, g = p.parent;
      if (p === g.left) {
        const u = g.right;                         // uncle
        if (isRed(u)) {                            // case 1: recolour
          p.color = u.color = BLACK; g.color = RED; z = g;
        } else {
          if (z === p.right) { z = p; this.rotateLeft(z); }   // case 2
          z.parent.color = BLACK;                              // case 3
          z.parent.parent.color = RED;
          this.rotateRight(z.parent.parent);
        }
      } else { /* same with left and right swapped */ }
    }
    this.root.color = BLACK;
  }
}`,
  py: `RED, BLACK = True, False

class Node:
    def __init__(self, val, parent=None):
        self.val, self.parent = val, parent
        self.left = self.right = None
        self.color = RED

def is_red(n): return n is not None and n.color == RED

class RedBlackTree:
    def __init__(self):
        self.root = None

    def _rotate(self, x, left):
        y = x.right if left else x.left
        inner = y.left if left else y.right
        if left: x.right = inner
        else:    x.left = inner
        if inner: inner.parent = x
        y.parent = x.parent
        if x.parent is None: self.root = y
        elif x is x.parent.left: x.parent.left = y
        else: x.parent.right = y
        if left: y.left = x
        else:    y.right = x
        x.parent = y

    def insert(self, val):
        p, cur = None, self.root
        while cur:
            p, cur = cur, (cur.left if val < cur.val else cur.right)
        z = Node(val, p)
        if p is None: self.root = z
        elif val < p.val: p.left = z
        else: p.right = z
        while is_red(z.parent):
            p, g = z.parent, z.parent.parent
            left = p is g.left
            u = g.right if left else g.left
            if is_red(u):                                  # case 1
                p.color = u.color = BLACK; g.color = RED; z = g
            else:
                if z is (p.right if left else p.left):     # case 2
                    z = p; self._rotate(z, left)
                z.parent.color = BLACK                     # case 3
                z.parent.parent.color = RED
                self._rotate(z.parent.parent, not left)
        self.root.color = BLACK`,
  cpp: `// std::map and std::set are red-black trees in most standard libraries:
#include <map>
#include <set>
#include <iostream>

int main() {
    std::set<int> s = {50, 20, 70};
    s.insert(10);          // O(log n), the tree rebalances itself
    s.erase(20);           // O(log n)
    std::cout << (s.count(70) ? "found" : "missing") << "\\n";

    std::map<std::string, int> ages;
    ages["ada"] = 36;      // ordered map backed by a red-black tree
    for (auto& [name, age] : ages) std::cout << name << " " << age << "\\n";
}`,
  idea: `A red-black tree is a BST where every node is red or black and:
  1. the root is black
  2. a red node never has a red child
  3. every path from a node down to an empty leaf passes
     through the same number of black nodes (black height)

Together these keep the longest path at most twice the
shortest, so the height stays O(log n).

Insert: add the value as a RED leaf (black height unchanged).
If its parent is red too, fix it:
  uncle red   -> recolour parent, uncle, grandparent; move up
  uncle black -> one or two rotations plus a colour swap

Delete: if a black node disappears, one path is short of a
black. Four cases (sibling colour, sibling's children) recolour
and rotate until that extra black is absorbed.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="Red-Black Tree"
      whatTitle="What is a Red-Black Tree?"
      meta={[
        { color: "green", text: "Search / Insert / Delete: O(log n)" },
        { color: "blue", text: "Height ≤ 2 log₂(n + 1)" },
        { color: "rust", text: "Self-balancing BST" },
      ]}
      visualizer={<BalancedTreeVisualizer kind="rb" />}
      intro={
        <>
          <p>
            A <B>red-black tree</B> is a{" "}
            <Link href="/algorithms/bst/basic" className="text-pen-blue font-semibold underline">
              binary search tree
            </Link>{" "}
            where every node is coloured <span className="font-semibold text-[#d65448]">red</span> or{" "}
            <span className="font-semibold">black</span>, and the colours follow a few rules: the root is black, a red
            node never has a red child, and every path down to an empty leaf has the same number of black nodes (the{" "}
            <B c="plum">black height</B>).
          </p>
          <p>
            Those rules guarantee the longest path is at most twice the shortest, so the tree stays O(log n) tall. It is
            a little less strictly balanced than an{" "}
            <Link href="/algorithms/balanced-trees/avl-tree" className="text-pen-blue font-semibold underline">
              AVL tree
            </Link>
            , but needs fewer rotations, which is why it powers <M>std::map</M>, Java&apos;s <M>TreeMap</M> and the
            Linux scheduler.
          </p>
        </>
      }
      keyIdea="New nodes are red; fix any red-red pair by recolouring or rotating."
      usage={[
        <>Insert a value: it arrives red. Tags (<M>parent</M>, <M>uncle</M>, <M>grand</M>) show the nodes the fix-up looks at.</>,
        <>A red uncle means only recolouring; a black uncle means one or two rotations.</>,
        <>Press <B c="plum">Insert in order</B> to watch 10, 20, …, 80 stay balanced.</>,
        <>Delete a black node to see the four double-black cases.</>,
      ]}
      steps={[
        { title: "Insert: add a red leaf", color: "plum", body: <>Red doesn&apos;t change any black height, so only rule 2 (no red-red) can break.</> },
        { title: "Red uncle: recolour", color: "rust", body: <>Parent and uncle turn black, grandparent turns red; continue from the grandparent.</> },
        { title: "Black uncle: rotate", color: "gold", body: <>Inner child: rotate at the parent first. Then rotate at the grandparent and swap colours.</> },
        { title: "Delete: extra black", color: "blue", body: <>Removing a black node leaves a path short of one black; four sibling cases recolour and rotate to repair it.</> },
      ]}
      code={code}
      codeHeight="620px"
      time={[<><B>Search, insert, delete:</B> O(log n) worst case</>, <><B>Rotations:</B> at most 2 per insert, 3 per delete</>]}
      space={[<><B c="blue">Space:</B> O(n), one colour bit per node</>, <><B c="blue">Height:</B> at most 2·log₂(n + 1)</>]}
      uses={[
        <><B>C++ std::map / std::set</B>, Java TreeMap / TreeSet</>,
        <><B>Linux kernel:</B> the CFS scheduler and memory areas</>,
        <><B>Databases</B> and in-memory ordered indexes</>,
      ]}
      limits={[
        <><span className="text-pen-gold">Complex delete</span> with many cases</>,
        <><span className="text-pen-gold">Slightly taller</span> than AVL trees, so lookups can be a bit slower</>,
      ]}
    />
  );
}
