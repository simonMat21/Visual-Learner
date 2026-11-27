// AVL and red-black trees, recorded as steps for the visualizer.
//
// Tree: { root, nodes: { id: { val, left, right, parent, h, color } }, nextId }
//   h      AVL height (a leaf has height 1)
//   color  "R" | "B" for red-black trees
// Every operation returns { tree, steps }. A step:
//   { tree, focus, path, found, tags, lines, hint, stats, result, done, miss, op }

export const AVL_CODE = {
  insert: [
    "insert v like in a normal binary search tree",
    "walk back up from the new node towards the root:",
    "  update height;  balance ← height(left) − height(right)",
    "  balance > 1 and balance(left) ≥ 0:   rotate right              // LL",
    "  balance > 1 and balance(left) < 0:   rotate left at left, then right   // LR",
    "  balance < −1 and balance(right) ≤ 0: rotate left               // RR",
    "  balance < −1 and balance(right) > 0: rotate right at right, then left // RL",
  ],
  delete: [
    "delete v like in a normal BST (two children: copy the successor, delete it)",
    "walk back up from the removed spot towards the root:",
    "  update height;  balance ← height(left) − height(right)",
    "  balance > 1 and balance(left) ≥ 0:   rotate right              // LL",
    "  balance > 1 and balance(left) < 0:   rotate left at left, then right   // LR",
    "  balance < −1 and balance(right) ≤ 0: rotate left               // RR",
    "  balance < −1 and balance(right) > 0: rotate right at right, then left // RL",
  ],
  search: [
    "node ← root",
    "while node is not null:",
    "  if v == node.val: found",
    "  node ← (v < node.val) ? node.left : node.right",
    "not found",
  ],
};

export const RB_CODE = {
  insert: [
    "insert v like in a normal BST and colour it RED",
    "while v's parent is red:",
    "  uncle ← the parent's sibling",
    "  uncle red: parent and uncle → black, grandparent → red;  v ← grandparent",
    "  v is an inner child: rotate at the parent so v becomes an outer child",
    "  rotate at the grandparent; swap the colours of parent and grandparent",
    "colour the root black",
  ],
  delete: [
    "delete like in a normal BST; x ← the node that takes the removed spot",
    "if the removed colour was black: x carries an extra black, fix it:",
    "  sibling w red: recolour w and parent, rotate at parent           (case 1)",
    "  w's children both black: w → red, move the extra black up      (case 2)",
    "  w's far child black: recolour, rotate at w                      (case 3)",
    "  w's far child red: recolour, rotate at parent, done             (case 4)",
    "colour x black",
  ],
  search: [
    "node ← root",
    "while node is not null:",
    "  if v == node.val: found",
    "  node ← (v < node.val) ? node.left : node.right",
    "not found",
  ],
};

export const MAX_BAL_NODES = 31;

export function emptyTree() {
  return { root: null, nodes: {}, nextId: 1 };
}

const clone = (t) => {
  const nodes = {};
  Object.entries(t.nodes).forEach(([k, n]) => (nodes[k] = { ...n }));
  return { root: t.root, nodes, nextId: t.nextId };
};

export const size = (t) => Object.keys(t.nodes).length;

export function heightOf(t, id = t.root) {
  return id == null ? 0 : 1 + Math.max(heightOf(t, t.nodes[id].left), heightOf(t, t.nodes[id].right));
}

export function inorder(t, id = t.root, out = []) {
  if (id == null) return out;
  inorder(t, t.nodes[id].left, out);
  out.push(t.nodes[id].val);
  inorder(t, t.nodes[id].right, out);
  return out;
}

const H = (t, id) => (id == null ? 0 : t.nodes[id].h);
const fixH = (t, id) => {
  if (id != null) t.nodes[id].h = 1 + Math.max(H(t, t.nodes[id].left), H(t, t.nodes[id].right));
};
export const balanceOf = (t, id) => (id == null ? 0 : H(t, t.nodes[id].left) - H(t, t.nodes[id].right));
const colorOf = (t, id) => (id == null ? "B" : t.nodes[id].color);

function replaceChild(t, parent, oldId, newId) {
  if (parent == null) t.root = newId;
  else if (t.nodes[parent].left === oldId) t.nodes[parent].left = newId;
  else t.nodes[parent].right = newId;
  if (newId != null) t.nodes[newId].parent = parent;
}

/** Left rotation at x: x's right child y moves up. Returns y. */
function rotateLeft(t, x) {
  const y = t.nodes[x].right;
  const b = t.nodes[y].left;
  replaceChild(t, t.nodes[x].parent, x, y);
  t.nodes[y].left = x;
  t.nodes[x].parent = y;
  t.nodes[x].right = b;
  if (b != null) t.nodes[b].parent = x;
  fixH(t, x);
  fixH(t, y);
  return y;
}

/** Right rotation at x: x's left child y moves up. Returns y. */
function rotateRight(t, x) {
  const y = t.nodes[x].left;
  const b = t.nodes[y].right;
  replaceChild(t, t.nodes[x].parent, x, y);
  t.nodes[y].right = x;
  t.nodes[x].parent = y;
  t.nodes[x].left = b;
  if (b != null) t.nodes[b].parent = x;
  fixH(t, x);
  fixH(t, y);
  return y;
}

/* ------------------------------------------------------------------ */
/*  Recorder                                                           */
/* ------------------------------------------------------------------ */

function recorder(start, kind, op) {
  const t = clone(start);
  const steps = [];
  const stats = { comparisons: 0, rotations: 0 };
  let path = [];
  let tags = {};
  const blackHeight = () => {
    let bh = 0;
    for (let id = t.root; id != null; id = t.nodes[id].left) if (t.nodes[id].color === "B") bh++;
    return bh;
  };
  const snap = (x = {}) => ({
    tree: clone(t),
    kind,
    op,
    focus: null,
    found: null,
    path: [...path],
    tags: { ...tags },
    lines: [],
    ...x,
    stats: { ...stats, nodes: size(t), height: heightOf(t), ...(kind === "rb" ? { blackHeight: blackHeight() } : {}) },
  });
  return {
    t,
    stats,
    setPath: (p) => (path = p),
    addPath: (id) => path.push(id),
    setTags: (x) => (tags = x),
    push: (x) => steps.push(snap(x)),
    finish: (result, x = {}) => {
      steps.push(snap({ result, done: true, ...x }));
      return { tree: t, steps };
    },
  };
}

/** Walk down comparing; returns { parent, side, found } and records each comparison. */
function descend(r, v, line) {
  const t = r.t;
  let cur = t.root;
  let parent = null;
  let side = null;
  while (cur != null) {
    const n = t.nodes[cur];
    r.addPath(cur);
    r.stats.comparisons++;
    if (v === n.val) {
      r.push({ lines: [line], focus: cur, hint: `${v} = ${n.val}` });
      return { found: cur, parent, side };
    }
    side = v < n.val ? "left" : "right";
    r.push({ lines: [line], focus: cur, hint: `${v} ${side === "left" ? "<" : ">"} ${n.val}: go ${side}` });
    parent = cur;
    cur = n[side];
  }
  return { found: null, parent, side };
}

function attach(r, v, parent, side, color) {
  const t = r.t;
  const id = t.nextId++;
  t.nodes[id] = { val: v, left: null, right: null, parent, h: 1, color };
  if (parent == null) t.root = id;
  else t.nodes[parent][side] = id;
  return id;
}

/* ------------------------------------------------------------------ */
/*  Search (both)                                                      */
/* ------------------------------------------------------------------ */

export function searchSteps(tree, kind, v) {
  const r = recorder(tree, kind, "search");
  r.push({ lines: [0], focus: tree.root, hint: `look for ${v}` });
  const { found } = descend(r, v, 3);
  if (found != null) return r.finish(`Found ${v}`, { found, lines: [2] });
  return r.finish(`${v} is not in the tree`, { miss: true, lines: [4] });
}

/* ------------------------------------------------------------------ */
/*  AVL                                                                */
/* ------------------------------------------------------------------ */

/** Rebalance at x if needed (recording the case and rotations). Returns the subtree root. */
function avlFix(r, x) {
  const t = r.t;
  const b = balanceOf(t, x);
  if (b > 1) {
    const l = t.nodes[x].left;
    if (balanceOf(t, l) >= 0) {
      r.push({ lines: [3], focus: x, tags: { [x]: "LL" }, hint: `balance(${t.nodes[x].val}) = ${b}: left-left case, rotate right` });
      r.stats.rotations++;
      const top = rotateRight(t, x);
      r.push({ lines: [3], focus: top, kind: "rotate", hint: `rotated right: ${t.nodes[top].val} moved up` });
      return top;
    }
    r.push({ lines: [4], focus: x, tags: { [x]: "LR" }, hint: `balance(${t.nodes[x].val}) = ${b}, left child leans right: left-right case` });
    r.stats.rotations++;
    rotateLeft(t, l);
    r.push({ lines: [4], focus: t.nodes[x].left, kind: "rotate", hint: "first rotate left at the left child (now it is a left-left case)" });
    r.stats.rotations++;
    const top = rotateRight(t, x);
    r.push({ lines: [4], focus: top, kind: "rotate", hint: `then rotate right: ${t.nodes[top].val} moved up` });
    return top;
  }
  if (b < -1) {
    const rr = t.nodes[x].right;
    if (balanceOf(t, rr) <= 0) {
      r.push({ lines: [5], focus: x, tags: { [x]: "RR" }, hint: `balance(${t.nodes[x].val}) = ${b}: right-right case, rotate left` });
      r.stats.rotations++;
      const top = rotateLeft(t, x);
      r.push({ lines: [5], focus: top, kind: "rotate", hint: `rotated left: ${t.nodes[top].val} moved up` });
      return top;
    }
    r.push({ lines: [6], focus: x, tags: { [x]: "RL" }, hint: `balance(${t.nodes[x].val}) = ${b}, right child leans left: right-left case` });
    r.stats.rotations++;
    rotateRight(t, rr);
    r.push({ lines: [6], focus: t.nodes[x].right, kind: "rotate", hint: "first rotate right at the right child (now it is a right-right case)" });
    r.stats.rotations++;
    const top = rotateLeft(t, x);
    r.push({ lines: [6], focus: top, kind: "rotate", hint: `then rotate left: ${t.nodes[top].val} moved up` });
    return top;
  }
  return x;
}

function avlWalkUp(r, from) {
  const t = r.t;
  let x = from;
  while (x != null) {
    fixH(t, x);
    const b = balanceOf(t, x);
    r.setTags({});
    r.push({
      lines: [1, 2],
      focus: x,
      fast: Math.abs(b) <= 1,
      hint: `${t.nodes[x].val}: height ${t.nodes[x].h}, balance ${b > 0 ? "+" : ""}${b}${Math.abs(b) > 1 ? "  → too unbalanced!" : ""}`,
    });
    if (Math.abs(b) > 1) x = avlFix(r, x);
    x = t.nodes[x].parent;
  }
  r.setTags({});
}

export function avlInsertSteps(tree, v) {
  const r = recorder(tree, "avl", "insert");
  if (size(tree) >= MAX_BAL_NODES) return r.finish(`The board holds ${MAX_BAL_NODES} nodes at most`, { miss: true });
  const { found, parent, side } = descend(r, v, 0);
  if (found != null) return r.finish(`${v} is already in the tree`, { miss: true, found });
  const id = attach(r, v, parent, side, null);
  r.push({ lines: [0], focus: id, found: id, kind: "add", hint: `insert ${v} as a new leaf` });
  r.setPath([]);
  avlWalkUp(r, parent);
  return r.finish(`Inserted ${v}`, { found: id });
}

export function avlDeleteSteps(tree, v) {
  const r = recorder(tree, "avl", "delete");
  const t = r.t;
  let { found: z } = descend(r, v, 0);
  if (z == null) return r.finish(`${v} is not in the tree`, { miss: true });
  if (t.nodes[z].left != null && t.nodes[z].right != null) {
    let s = t.nodes[z].right;
    while (t.nodes[s].left != null) s = t.nodes[s].left;
    r.push({ lines: [0], focus: s, tags: { [z]: "delete", [s]: "successor" }, hint: `two children: the successor is ${t.nodes[s].val}` });
    t.nodes[z].val = t.nodes[s].val;
    r.push({ lines: [0], focus: z, found: z, kind: "copy", hint: `copy ${t.nodes[s].val} up; now delete the successor's old node` });
    z = s;
  }
  const child = t.nodes[z].left ?? t.nodes[z].right;
  const parent = t.nodes[z].parent;
  r.push({ lines: [0], gone: z, focus: z, kind: "remove", hint: child == null ? "remove the leaf" : "replace it with its only child" });
  replaceChild(t, parent, z, child);
  delete t.nodes[z];
  r.setPath([]);
  r.setTags({});
  r.push({ lines: [0], focus: child ?? parent, kind: "move" });
  avlWalkUp(r, parent);
  return r.finish(`Deleted ${v}`);
}

/* ------------------------------------------------------------------ */
/*  Red-black                                                          */
/* ------------------------------------------------------------------ */

export function rbInsertSteps(tree, v) {
  const r = recorder(tree, "rb", "insert");
  const t = r.t;
  if (size(tree) >= MAX_BAL_NODES) return r.finish(`The board holds ${MAX_BAL_NODES} nodes at most`, { miss: true });
  const { found, parent, side } = descend(r, v, 0);
  if (found != null) return r.finish(`${v} is already in the tree`, { miss: true, found });
  let z = attach(r, v, parent, side, "R");
  r.setPath([]);
  r.push({ lines: [0], focus: z, kind: "add", hint: `insert ${v} as a red leaf` });

  const P = (id) => t.nodes[id].parent;
  while (P(z) != null && colorOf(t, P(z)) === "R") {
    const p = P(z);
    const g = P(p);
    const parentIsLeft = t.nodes[g].left === p;
    const u = parentIsLeft ? t.nodes[g].right : t.nodes[g].left;
    r.setTags({ [z]: "v", [p]: "parent", [g]: "grand", ...(u != null ? { [u]: "uncle" } : {}) });
    r.push({ lines: [1, 2], focus: z, hint: `parent ${t.nodes[p].val} is red too: red-red violation` });
    if (colorOf(t, u) === "R") {
      t.nodes[p].color = "B";
      t.nodes[u].color = "B";
      t.nodes[g].color = "R";
      r.push({ lines: [3], focus: g, hint: `uncle ${t.nodes[u].val} is red: recolour, then continue from the grandparent`, slow: true });
      z = g;
      continue;
    }
    const inner = parentIsLeft ? t.nodes[p].right === z : t.nodes[p].left === z;
    if (inner) {
      r.stats.rotations++;
      if (parentIsLeft) rotateLeft(t, p);
      else rotateRight(t, p);
      r.setTags({ [p]: "v", [z]: "parent", [g]: "grand" });
      r.push({ lines: [4], focus: p, kind: "rotate", hint: `uncle is black and v is an inner child: rotate ${parentIsLeft ? "left" : "right"} at the parent` });
      z = p;
    }
    const p2 = P(z);
    r.stats.rotations++;
    if (parentIsLeft) rotateRight(t, g);
    else rotateLeft(t, g);
    t.nodes[p2].color = "B";
    t.nodes[g].color = "R";
    r.setTags({ [p2]: "parent", [g]: "grand" });
    r.push({ lines: [5], focus: p2, kind: "rotate", slow: true, hint: `rotate ${parentIsLeft ? "right" : "left"} at the grandparent and swap their colours` });
    break;
  }
  r.setTags({});
  if (t.nodes[t.root].color === "R") {
    t.nodes[t.root].color = "B";
    r.push({ lines: [6], focus: t.root, hint: "the root must be black" });
  }
  return r.finish(`Inserted ${v}`, { found: Object.keys(t.nodes).map(Number).find((k) => t.nodes[k].val === v) });
}

export function rbDeleteSteps(tree, v) {
  const r = recorder(tree, "rb", "delete");
  const t = r.t;
  let { found: z } = descend(r, v, 0);
  if (z == null) return r.finish(`${v} is not in the tree`, { miss: true });
  if (t.nodes[z].left != null && t.nodes[z].right != null) {
    let s = t.nodes[z].right;
    while (t.nodes[s].left != null) s = t.nodes[s].left;
    r.push({ lines: [0], focus: s, tags: { [z]: "delete", [s]: "successor" }, hint: `two children: the successor is ${t.nodes[s].val}` });
    t.nodes[z].val = t.nodes[s].val;
    r.push({ lines: [0], focus: z, kind: "copy", hint: `copy ${t.nodes[s].val} up; now delete the successor's old node` });
    z = s;
  }
  // z has at most one child
  const removedColor = t.nodes[z].color;
  let x = t.nodes[z].left ?? t.nodes[z].right;
  let xp = t.nodes[z].parent;
  r.push({ lines: [0], gone: z, focus: z, kind: "remove", hint: `remove ${t.nodes[z].val} (${removedColor === "R" ? "red" : "black"})` });
  replaceChild(t, xp, z, x);
  delete t.nodes[z];
  r.setPath([]);
  r.setTags(x != null ? { [x]: "x" } : {});
  r.push({ lines: [0], focus: x ?? xp, kind: "move", hint: x == null ? "its place is now an empty (black) leaf" : `${t.nodes[x].val} takes its place` });

  if (removedColor === "B") {
    r.push({ lines: [1], focus: x ?? xp, hint: "a black node was removed: one path is now short of a black" });
    while (x !== t.root && colorOf(t, x) === "B") {
      const xIsLeft = t.nodes[xp].left === x;
      let w = xIsLeft ? t.nodes[xp].right : t.nodes[xp].left;
      const near = () => (xIsLeft ? t.nodes[w].left : t.nodes[w].right);
      const far = () => (xIsLeft ? t.nodes[w].right : t.nodes[w].left);
      r.setTags({ ...(x != null ? { [x]: "x" } : {}), [xp]: "parent", [w]: "w" });
      if (colorOf(t, w) === "R") {
        t.nodes[w].color = "B";
        t.nodes[xp].color = "R";
        r.stats.rotations++;
        if (xIsLeft) rotateLeft(t, xp);
        else rotateRight(t, xp);
        w = xIsLeft ? t.nodes[xp].right : t.nodes[xp].left;
        r.setTags({ ...(x != null ? { [x]: "x" } : {}), [xp]: "parent", [w]: "w" });
        r.push({ lines: [2], focus: xp, kind: "rotate", hint: "case 1: the sibling was red; recolour and rotate so it becomes black" });
      }
      if (colorOf(t, near()) === "B" && colorOf(t, far()) === "B") {
        t.nodes[w].color = "R";
        r.push({ lines: [3], focus: w, hint: "case 2: both of w's children are black: make w red and move the problem up" });
        x = xp;
        xp = t.nodes[x].parent;
        continue;
      }
      if (colorOf(t, far()) === "B") {
        const nr = near();
        t.nodes[nr].color = "B";
        t.nodes[w].color = "R";
        r.stats.rotations++;
        if (xIsLeft) rotateRight(t, w);
        else rotateLeft(t, w);
        w = xIsLeft ? t.nodes[xp].right : t.nodes[xp].left;
        r.setTags({ ...(x != null ? { [x]: "x" } : {}), [xp]: "parent", [w]: "w" });
        r.push({ lines: [4], focus: w, kind: "rotate", hint: "case 3: w's far child is black: recolour and rotate at w" });
      }
      t.nodes[w].color = t.nodes[xp].color;
      t.nodes[xp].color = "B";
      const f = far();
      if (f != null) t.nodes[f].color = "B";
      r.stats.rotations++;
      if (xIsLeft) rotateLeft(t, xp);
      else rotateRight(t, xp);
      r.push({ lines: [5], focus: w, kind: "rotate", slow: true, hint: "case 4: w's far child is red: recolour, rotate at the parent, done" });
      x = t.root;
      break;
    }
    if (x != null && t.nodes[x].color !== "B") {
      t.nodes[x].color = "B";
      r.push({ lines: [6], focus: x, hint: `colour ${t.nodes[x].val} black` });
    }
  }
  r.setTags({});
  if (t.root != null) t.nodes[t.root].color = "B";
  return r.finish(`Deleted ${v}`);
}

/* ------------------------------------------------------------------ */
/*  Building trees                                                     */
/* ------------------------------------------------------------------ */

export function buildTree(kind, vals) {
  let t = emptyTree();
  for (const v of vals) t = (kind === "avl" ? avlInsertSteps(t, v) : rbInsertSteps(t, v)).tree;
  return t;
}

export function randomBalanced(kind, count = 8) {
  const vals = [];
  while (vals.length < count) {
    const v = 1 + Math.floor(Math.random() * 98);
    if (!vals.includes(v)) vals.push(v);
  }
  return buildTree(kind, vals);
}
