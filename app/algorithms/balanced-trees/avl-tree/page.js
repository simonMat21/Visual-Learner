"use client";

import Link from "next/link";
import AlgoPage, { B, M } from "@/components/AlgoPage";
import BalancedTreeVisualizer from "@/components/BalancedTreeVisualizer";

const code = {
  js: `class Node {
  constructor(val) { this.val = val; this.left = this.right = null; this.height = 1; }
}
const h = (n) => (n ? n.height : 0);
const update = (n) => { n.height = 1 + Math.max(h(n.left), h(n.right)); };
const balance = (n) => (n ? h(n.left) - h(n.right) : 0);

function rotateRight(y) {           //     y          x
  const x = y.left;                 //    / \\        / \\
  y.left = x.right;                 //   x   C  =>  A   y
  x.right = y;                      //  / \\            / \\
  update(y); update(x);             // A   B          B   C
  return x;
}
function rotateLeft(x) {
  const y = x.right;
  x.right = y.left;
  y.left = x;
  update(x); update(y);
  return y;
}

function rebalance(n) {
  update(n);
  const b = balance(n);
  if (b > 1) {                                   // left side too tall
    if (balance(n.left) < 0) n.left = rotateLeft(n.left);    // LR -> LL
    return rotateRight(n);                                   // LL
  }
  if (b < -1) {                                  // right side too tall
    if (balance(n.right) > 0) n.right = rotateRight(n.right); // RL -> RR
    return rotateLeft(n);                                     // RR
  }
  return n;
}

function insert(n, val) {
  if (!n) return new Node(val);
  if (val < n.val) n.left = insert(n.left, val);
  else if (val > n.val) n.right = insert(n.right, val);
  else return n;                                // no duplicates
  return rebalance(n);                          // fix on the way back up
}

function remove(n, val) {
  if (!n) return null;
  if (val < n.val) n.left = remove(n.left, val);
  else if (val > n.val) n.right = remove(n.right, val);
  else {
    if (!n.left || !n.right) return n.left || n.right;
    let s = n.right;
    while (s.left) s = s.left;                  // successor
    n.val = s.val;
    n.right = remove(n.right, s.val);
  }
  return rebalance(n);
}`,
  py: `class Node:
    def __init__(self, val):
        self.val, self.left, self.right, self.height = val, None, None, 1

def h(n): return n.height if n else 0
def update(n): n.height = 1 + max(h(n.left), h(n.right))
def balance(n): return h(n.left) - h(n.right) if n else 0

def rotate_right(y):
    x = y.left
    y.left, x.right = x.right, y
    update(y); update(x)
    return x

def rotate_left(x):
    y = x.right
    x.right, y.left = y.left, x
    update(x); update(y)
    return y

def rebalance(n):
    update(n)
    b = balance(n)
    if b > 1:
        if balance(n.left) < 0:
            n.left = rotate_left(n.left)      # LR
        return rotate_right(n)                # LL
    if b < -1:
        if balance(n.right) > 0:
            n.right = rotate_right(n.right)   # RL
        return rotate_left(n)                 # RR
    return n

def insert(n, val):
    if n is None:
        return Node(val)
    if val < n.val:
        n.left = insert(n.left, val)
    elif val > n.val:
        n.right = insert(n.right, val)
    else:
        return n
    return rebalance(n)`,
  cpp: `struct Node {
    int val, height = 1;
    Node *left = nullptr, *right = nullptr;
    Node(int v) : val(v) {}
};
int h(Node* n) { return n ? n->height : 0; }
void update(Node* n) { n->height = 1 + max(h(n->left), h(n->right)); }
int balance(Node* n) { return n ? h(n->left) - h(n->right) : 0; }

Node* rotateRight(Node* y) { Node* x = y->left; y->left = x->right; x->right = y; update(y); update(x); return x; }
Node* rotateLeft(Node* x)  { Node* y = x->right; x->right = y->left; y->left = x; update(x); update(y); return y; }

Node* rebalance(Node* n) {
    update(n);
    int b = balance(n);
    if (b > 1)  { if (balance(n->left) < 0)  n->left = rotateLeft(n->left);   return rotateRight(n); }
    if (b < -1) { if (balance(n->right) > 0) n->right = rotateRight(n->right); return rotateLeft(n); }
    return n;
}

Node* insert(Node* n, int val) {
    if (!n) return new Node(val);
    if (val < n->val) n->left = insert(n->left, val);
    else if (val > n->val) n->right = insert(n->right, val);
    else return n;
    return rebalance(n);
}`,
  idea: `An AVL tree is a binary search tree that keeps itself balanced:
for every node, the heights of its two subtrees differ by at most 1.

Balance factor = height(left) - height(right), always -1, 0 or +1.

After an insert or delete, walk back up to the root. The first
node whose balance becomes +2 or -2 is fixed with rotations:

  LL  (left child leans left or is flat):  rotate right
  RR  (mirror):                            rotate left
  LR  (left child leans right):  rotate left at the child, then right
  RL  (mirror):                  rotate right at the child, then left

A rotation moves a child up and its parent down while keeping
the in-order (sorted) order. Height stays about 1.44 log n.`,
};

export default function Home() {
  return (
    <AlgoPage
      title="AVL Tree"
      whatTitle="What is an AVL Tree?"
      meta={[
        { color: "green", text: "Search / Insert / Delete: O(log n)" },
        { color: "blue", text: "Height ≤ 1.44 log₂ n" },
        { color: "rust", text: "Self-balancing BST" },
      ]}
      visualizer={<BalancedTreeVisualizer kind="avl" />}
      intro={
        <>
          <p>
            An <B>AVL tree</B> (Adelson-Velsky and Landis, 1962) is a{" "}
            <Link href="/algorithms/bst/basic" className="text-pen-blue font-semibold underline">
              binary search tree
            </Link>{" "}
            that never gets lopsided. Every node keeps its <B c="plum">balance factor</B>, the height of its left
            subtree minus the height of its right subtree, at <M>−1</M>, <M>0</M> or <M>+1</M>.
          </p>
          <p>
            A plain BST built from sorted input turns into a long chain, so searches become O(n). An AVL tree checks
            the balance factors on the way back up after every insert or delete. When one reaches <M>±2</M>, it fixes
            it with one or two <B c="rust">rotations</B>, so the height and every operation stay O(log n).
          </p>
        </>
      }
      keyIdea="After every change, walk back up; any node with balance ±2 gets rotated back into shape."
      usage={[
        <>Numbers beside the nodes are balance factors; they turn red at ±2, right before a rotation.</>,
        <>Press <B c="plum">Insert in order</B> to add 10, 20, …, 80: a plain BST would become a chain, AVL rotates instead.</>,
        <>Tags like <M>LL</M>, <M>LR</M>, <M>RR</M>, <M>RL</M> show which case is being fixed.</>,
        <>Delete a value to see rebalancing on the way up after removal too.</>,
      ]}
      steps={[
        { title: "LL: rotate right", color: "plum", body: <>Node too tall on the left, and its left child is not leaning right: one right rotation.</> },
        { title: "RR: rotate left", color: "gold", body: <>The mirror image: too tall on the right, right child not leaning left.</> },
        { title: "LR: left, then right", color: "green", body: <>Left child leans right: rotate it left first (making it LL), then rotate right.</> },
        { title: "RL: right, then left", color: "blue", body: <>Right child leans left: rotate it right first (making it RR), then rotate left.</> },
      ]}
      note={
        <>
          <span className="font-semibold text-pen-blue">Rotations keep the order:</span> a rotation lifts a child above
          its parent but never changes the in-order (sorted) sequence, so the tree is still a valid BST afterwards.
        </>
      }
      code={code}
      codeHeight="640px"
      time={[<><B>Search, insert, delete:</B> O(log n) worst case</>, <><B>Rotations per insert:</B> at most 2</>, <><B>Rotations per delete:</B> up to O(log n)</>]}
      space={[<><B c="blue">Space:</B> O(n), one height per node</>, <><B c="blue">Stricter</B> balance than red-black trees: faster lookups, more rotations</>]}
      uses={[
        <><B>Lookup-heavy</B> sets and maps</>,
        <><B>Databases and indexes</B> held in memory</>,
        <><B>Teaching:</B> the classic example of a self-balancing tree</>,
      ]}
      limits={[
        <><span className="text-pen-gold">More rotations</span> than red-black trees on frequent inserts/deletes</>,
        <><span className="text-pen-gold">Extra field:</span> every node stores its height</>,
        <><span className="text-pen-gold">Disk storage:</span> B-trees are better when nodes live on disk</>,
      ]}
    />
  );
}
