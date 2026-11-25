// Binary search tree operations, recorded as steps for the visualizer.
//
// The tree is plain data: { root, nodes: { id: { val, left, right } }, nextId }.
// Every operation returns { tree, steps }, where `tree` is the tree after the
// operation and each step is a snapshot the board can draw on its own:
//
//   { tree, lines, focus, path, found, tags, visited, gone, output, queue,
//     stats, result, done, kind }
//
// Duplicates are ignored on insert, the same as the code on the pages.

export const MAX_NODES = 31;

export function emptyTree() {
  return { root: null, nodes: {}, nextId: 1 };
}

function clone(tree) {
  const nodes = {};
  Object.entries(tree.nodes).forEach(([id, n]) => {
    nodes[id] = { ...n };
  });
  return { root: tree.root, nodes, nextId: tree.nextId };
}

export function size(tree) {
  return Object.keys(tree.nodes).length;
}

export function height(tree) {
  const h = (id) => (id == null ? 0 : 1 + Math.max(h(tree.nodes[id].left), h(tree.nodes[id].right)));
  return h(tree.root);
}

export function values(tree) {
  const out = [];
  const walk = (id) => {
    if (id == null) return;
    walk(tree.nodes[id].left);
    out.push(tree.nodes[id].val);
    walk(tree.nodes[id].right);
  };
  walk(tree.root);
  return out;
}

/** Plain insert with no steps, used to build trees quickly. */
function insertQuiet(tree, v) {
  const t = tree;
  const id = t.nextId++;
  t.nodes[id] = { val: v, left: null, right: null };
  if (t.root == null) {
    t.root = id;
    return id;
  }
  let cur = t.root;
  for (;;) {
    const n = t.nodes[cur];
    if (v === n.val) {
      delete t.nodes[id];
      t.nextId--;
      return null;
    }
    const side = v < n.val ? "left" : "right";
    if (n[side] == null) {
      n[side] = id;
      return id;
    }
    cur = n[side];
  }
}

export function treeFrom(vals) {
  const t = emptyTree();
  vals.forEach((v) => insertQuiet(t, v));
  return t;
}

/** A pleasant random tree: unique values, inserted in an order that keeps it bushy. */
export function randomTree(count = 9) {
  const pool = new Set();
  while (pool.size < count) pool.add(5 + Math.floor(Math.random() * 90));
  const sorted = [...pool].sort((a, b) => a - b);
  const order = [];
  const pick = (lo, hi) => {
    if (lo > hi) return;
    const mid = Math.floor((lo + hi + (Math.random() < 0.5 ? 0 : 1)) / 2);
    order.push(sorted[mid]);
    pick(lo, mid - 1);
    pick(mid + 1, hi);
  };
  pick(0, sorted.length - 1);
  return treeFrom(order);
}

/* ------------------------------------------------------------------ */
/*  Recorder                                                           */
/* ------------------------------------------------------------------ */

function recorder(start, statsInit = {}) {
  let tree = clone(start);
  const steps = [];
  const stats = { comparisons: 0, ...statsInit };
  let persist = { path: [], visited: [], output: [], tags: {} };

  return {
    get tree() {
      return tree;
    },
    set tree(t) {
      tree = t;
    },
    stats,
    persist,
    push(step) {
      steps.push({
        tree: clone(tree),
        lines: [],
        focus: null,
        found: null,
        gone: null,
        queue: null,
        path: [...persist.path],
        visited: [...persist.visited],
        output: [...persist.output],
        tags: { ...persist.tags },
        ...step,
        stats: { ...stats, nodes: size(tree), height: height(tree) },
      });
    },
    finish(result, extra = {}) {
      steps.push({
        tree: clone(tree),
        lines: extra.lines || [],
        focus: null,
        found: extra.found ?? null,
        gone: null,
        queue: null,
        path: extra.keepPath ? [...persist.path] : [],
        visited: [...persist.visited],
        output: [...persist.output],
        tags: { ...persist.tags },
        result,
        done: true,
        kind: "done",
        stats: { ...stats, nodes: size(tree), height: height(tree) },
      });
      return { tree, steps };
    },
    get steps() {
      return steps;
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Pseudocode                                                         */
/* ------------------------------------------------------------------ */

export const BST_CODE = {
  insert: [
    "insert(node, v):",
    "  if node is null: return new Node(v)",
    "  if v < node.val: node.left ← insert(node.left, v)",
    "  else if v > node.val: node.right ← insert(node.right, v)",
    "  // v == node.val: already in the tree, do nothing",
    "  return node",
  ],
  search: [
    "search(node, v):",
    "  if node is null: return not found",
    "  if v == node.val: return node",
    "  if v < node.val: return search(node.left, v)",
    "  else: return search(node.right, v)",
  ],
  delete: [
    "delete(node, v):",
    "  find v: go left if v < node.val, right if v > node.val",
    "  found it:",
    "    no children → just remove it",
    "    one child → replace it with that child",
    "    two children → successor ← smallest in right subtree",
    "      copy the successor's value into this node",
    "      delete the successor from the right subtree",
  ],
  min: [
    "node ← root",
    "while node.left exists:",
    "  node ← node.left",
    "return node   // the leftmost node is the smallest",
  ],
  max: [
    "node ← root",
    "while node.right exists:",
    "  node ← node.right",
    "return node   // the rightmost node is the largest",
  ],
  pred: [
    "find the node x with value v",
    "if x has a left subtree:",
    "  return the rightmost node of x.left",
    "else walk down from the root towards v:",
    "  every time you go right, remember that node",
    "  return the last remembered node (or none)",
  ],
  succ: [
    "find the node x with value v",
    "if x has a right subtree:",
    "  return the leftmost node of x.right",
    "else walk down from the root towards v:",
    "  every time you go left, remember that node",
    "  return the last remembered node (or none)",
  ],
  inorder: [
    "inorder(node):",
    "  if node is null: return",
    "  inorder(node.left)",
    "  visit(node)",
    "  inorder(node.right)",
  ],
  preorder: [
    "preorder(node):",
    "  if node is null: return",
    "  visit(node)",
    "  preorder(node.left)",
    "  preorder(node.right)",
  ],
  postorder: [
    "postorder(node):",
    "  if node is null: return",
    "  postorder(node.left)",
    "  postorder(node.right)",
    "  visit(node)",
  ],
  level: [
    "queue ← [root]",
    "while queue is not empty:",
    "  node ← take the front of the queue",
    "  visit(node)",
    "  add node.left and node.right to the back (if they exist)",
  ],
  build: ["for each value v in the array:", "  insert(root, v)"],
};

/* ------------------------------------------------------------------ */
/*  Operations                                                         */
/* ------------------------------------------------------------------ */

export function insertSteps(tree, v) {
  const r = recorder(tree);
  if (size(r.tree) >= MAX_NODES) return r.finish(`The board holds ${MAX_NODES} nodes at most`);
  if (r.tree.root == null) {
    const id = insertQuiet(r.tree, v);
    r.push({ lines: [1], focus: id, found: id, kind: "add" });
    return r.finish(`Inserted ${v} as the root`, { found: id });
  }
  let cur = r.tree.root;
  for (;;) {
    const n = r.tree.nodes[cur];
    r.persist.path.push(cur);
    r.stats.comparisons++;
    if (v === n.val) {
      r.push({ lines: [4], focus: cur });
      return r.finish(`${v} is already in the tree`, { found: cur, keepPath: true });
    }
    const side = v < n.val ? "left" : "right";
    r.push({ lines: [side === "left" ? 2 : 3], focus: cur, hint: `${v} ${side === "left" ? "<" : ">"} ${n.val}` });
    if (n[side] == null) {
      const id = r.tree.nextId++;
      r.tree.nodes[id] = { val: v, left: null, right: null };
      n[side] = id;
      r.push({ lines: [1], focus: id, found: id, kind: "add" });
      return r.finish(`Inserted ${v}`, { found: id });
    }
    cur = n[side];
  }
}

export function searchSteps(tree, v) {
  const r = recorder(tree);
  let cur = r.tree.root;
  while (cur != null) {
    const n = r.tree.nodes[cur];
    r.persist.path.push(cur);
    r.stats.comparisons++;
    if (v === n.val) {
      r.push({ lines: [2], focus: cur, found: cur });
      return r.finish(`Found ${v}`, { found: cur, keepPath: true, lines: [2] });
    }
    const side = v < n.val ? "left" : "right";
    r.push({ lines: [side === "left" ? 3 : 4], focus: cur, hint: `${v} ${side === "left" ? "<" : ">"} ${n.val}` });
    cur = n[side];
  }
  r.push({ lines: [1] });
  return r.finish(`${v} is not in the tree`, { keepPath: true, lines: [1] });
}

function parentOf(tree, id) {
  for (const [pid, n] of Object.entries(tree.nodes)) {
    if (n.left === Number(id) || n.right === Number(id)) return Number(pid);
  }
  return null;
}

function replaceChild(tree, parent, oldId, newId) {
  if (parent == null) tree.root = newId;
  else if (tree.nodes[parent].left === oldId) tree.nodes[parent].left = newId;
  else tree.nodes[parent].right = newId;
}

export function deleteSteps(tree, v) {
  const r = recorder(tree);
  let cur = r.tree.root;
  while (cur != null && r.tree.nodes[cur].val !== v) {
    const n = r.tree.nodes[cur];
    r.persist.path.push(cur);
    r.stats.comparisons++;
    r.push({ lines: [1], focus: cur, hint: `${v} ${v < n.val ? "<" : ">"} ${n.val}` });
    cur = v < n.val ? n.left : n.right;
  }
  if (cur == null) {
    r.push({ lines: [1] });
    return r.finish(`${v} is not in the tree`, { keepPath: true });
  }
  r.persist.path.push(cur);
  r.stats.comparisons++;
  r.push({ lines: [2], focus: cur, found: cur });

  const removeSimple = (id, lineNo) => {
    const n = r.tree.nodes[id];
    const child = n.left ?? n.right;
    const parent = parentOf(r.tree, id);
    r.push({ lines: [lineNo], focus: id, gone: id, kind: "remove" });
    replaceChild(r.tree, parent, id, child);
    delete r.tree.nodes[id];
    r.persist.path = r.persist.path.filter((p) => p !== id);
    r.push({ lines: [lineNo], focus: child, kind: "move" });
  };

  const n = r.tree.nodes[cur];
  if (n.left == null && n.right == null) {
    removeSimple(cur, 3);
    return r.finish(`Deleted ${v} (it was a leaf)`, { lines: [3] });
  }
  if (n.left == null || n.right == null) {
    removeSimple(cur, 4);
    return r.finish(`Deleted ${v} (its only child moved up)`, { lines: [4] });
  }

  // two children: walk to the successor
  let s = n.right;
  r.persist.tags = { [cur]: "delete" };
  r.push({ lines: [5], focus: s });
  while (r.tree.nodes[s].left != null) {
    s = r.tree.nodes[s].left;
    r.push({ lines: [5], focus: s });
  }
  const succVal = r.tree.nodes[s].val;
  r.persist.tags = { [cur]: "delete", [s]: "successor" };
  r.push({ lines: [5], focus: s, found: s });
  r.tree.nodes[cur].val = succVal;
  r.push({ lines: [6], focus: cur, found: cur, kind: "copy", copyFrom: s });
  r.persist.tags = { [s]: "remove" };
  removeSimple(s, 7);
  r.persist.tags = {};
  return r.finish(`Deleted ${v}: its successor ${succVal} took its place`, { found: cur, lines: [7] });
}

function extremeSteps(tree, side) {
  const r = recorder(tree);
  const name = side === "left" ? "minimum" : "maximum";
  if (r.tree.root == null) return r.finish("The tree is empty");
  let cur = r.tree.root;
  r.persist.path.push(cur);
  r.push({ lines: [0], focus: cur });
  while (r.tree.nodes[cur][side] != null) {
    r.stats.comparisons++;
    r.push({ lines: [1], focus: cur });
    cur = r.tree.nodes[cur][side];
    r.persist.path.push(cur);
    r.push({ lines: [2], focus: cur });
  }
  r.persist.tags = { [cur]: side === "left" ? "min" : "max" };
  r.push({ lines: [3], focus: cur, found: cur });
  const val = r.tree.nodes[cur].val;
  r.persist.output = [val];
  return r.finish(`The ${name} is ${val}`, { found: cur, keepPath: true, lines: [3] });
}

export const minSteps = (tree) => extremeSteps(tree, "left");
export const maxSteps = (tree) => extremeSteps(tree, "right");

/** Predecessor (kind "pred") or successor ("succ") of the value v. */
export function neighbourSteps(tree, v, kind) {
  const r = recorder(tree);
  const inner = kind === "pred" ? "left" : "right";
  const outer = kind === "pred" ? "right" : "left";
  const label = kind === "pred" ? "predecessor" : "successor";

  // 1. find x
  let x = r.tree.root;
  while (x != null && r.tree.nodes[x].val !== v) {
    r.persist.path.push(x);
    r.stats.comparisons++;
    r.push({ lines: [0], focus: x, hint: `${v} ${v < r.tree.nodes[x].val ? "<" : ">"} ${r.tree.nodes[x].val}` });
    x = v < r.tree.nodes[x].val ? r.tree.nodes[x].left : r.tree.nodes[x].right;
  }
  if (x == null) {
    r.push({ lines: [0] });
    return r.finish(`${v} is not in the tree`, { keepPath: true });
  }
  r.stats.comparisons++;
  r.persist.tags = { [x]: "x" };
  r.push({ lines: [0], focus: x });

  // 2a. inside its subtree
  if (r.tree.nodes[x][inner] != null) {
    r.persist.path = [x];
    r.push({ lines: [1], focus: x });
    let c = r.tree.nodes[x][inner];
    r.persist.path.push(c);
    r.push({ lines: [2], focus: c });
    while (r.tree.nodes[c][outer] != null) {
      c = r.tree.nodes[c][outer];
      r.persist.path.push(c);
      r.push({ lines: [2], focus: c });
    }
    r.persist.tags = { [x]: "x", [c]: kind };
    r.persist.output = [r.tree.nodes[c].val];
    return r.finish(`The ${label} of ${v} is ${r.tree.nodes[c].val}`, { found: c, keepPath: true, lines: [2] });
  }

  // 2b. walk from the root, remembering turns
  r.persist.path = [];
  r.push({ lines: [3], focus: x });
  let cur = r.tree.root;
  let best = null;
  while (cur != null && cur !== x) {
    r.persist.path.push(cur);
    const goesOuterWay = kind === "pred" ? v > r.tree.nodes[cur].val : v < r.tree.nodes[cur].val;
    if (goesOuterWay) {
      best = cur;
      r.persist.tags = { [x]: "x", [best]: "best" };
      r.push({ lines: [4], focus: cur });
      cur = r.tree.nodes[cur][outer === "right" ? "right" : "left"];
    } else {
      r.push({ lines: [3], focus: cur });
      cur = r.tree.nodes[cur][outer === "right" ? "left" : "right"];
    }
  }
  if (best == null) {
    r.persist.tags = { [x]: "x" };
    return r.finish(`${v} has no ${label}: it is the ${kind === "pred" ? "smallest" : "largest"} value`, { lines: [5] });
  }
  r.persist.tags = { [x]: "x", [best]: kind };
  r.persist.output = [r.tree.nodes[best].val];
  return r.finish(`The ${label} of ${v} is ${r.tree.nodes[best].val}`, { found: best, keepPath: true, lines: [5] });
}

export function traversalSteps(tree, order) {
  const r = recorder(tree, { visits: 0 });
  if (r.tree.root == null) return r.finish("The tree is empty");
  const visit = (id, line, extra = {}) => {
    r.persist.visited.push(id);
    r.persist.output.push(r.tree.nodes[id].val);
    r.stats.visits++;
    r.push({ lines: [line], focus: id, kind: "visit", ...extra });
  };

  if (order === "level") {
    const queue = [r.tree.root];
    r.push({ lines: [0], queue: [...queue].map((id) => r.tree.nodes[id].val) });
    while (queue.length) {
      const id = queue.shift();
      r.push({ lines: [1, 2], focus: id, queue: queue.map((q) => r.tree.nodes[q].val) });
      visit(id, 3, { queue: queue.map((q) => r.tree.nodes[q].val) });
      const n = r.tree.nodes[id];
      if (n.left != null) queue.push(n.left);
      if (n.right != null) queue.push(n.right);
      if (n.left != null || n.right != null)
        r.push({ lines: [4], focus: id, queue: queue.map((q) => r.tree.nodes[q].val) });
    }
  } else {
    const lines = {
      inorder: { left: 2, visit: 3, right: 4 },
      preorder: { visit: 2, left: 3, right: 4 },
      postorder: { left: 2, right: 3, visit: 4 },
    }[order];
    const walk = (id) => {
      const n = r.tree.nodes[id];
      r.push({ lines: [0], focus: id });
      const parts = order === "preorder" ? ["visit", "left", "right"] : order === "inorder" ? ["left", "visit", "right"] : ["left", "right", "visit"];
      parts.forEach((part) => {
        if (part === "visit") visit(id, lines.visit);
        else if (n[part] != null) {
          r.push({ lines: [lines[part]], focus: id, hint: `go ${part}` });
          walk(n[part]);
        }
      });
    };
    walk(r.tree.root);
  }
  const names = { inorder: "In-order", preorder: "Pre-order", postorder: "Post-order", level: "Level-order" };
  return r.finish(`${names[order]}: ${r.persist.output.join(", ")}`, { lines: [] });
}

/** Build a tree from an array: one quick step per inserted value. */
export function buildSteps(vals) {
  const r = recorder(emptyTree());
  r.push({ lines: [0] });
  const skipped = [];
  vals.forEach((v) => {
    if (size(r.tree) >= MAX_NODES) return;
    const id = insertQuiet(r.tree, v);
    if (id == null) {
      skipped.push(v);
      return;
    }
    r.stats.comparisons += Math.max(0, depthOf(r.tree, id));
    r.push({ lines: [1], focus: id, found: id, kind: "add" });
  });
  return r.finish(
    `Built a tree from ${vals.length} values` + (skipped.length ? ` (skipped duplicates: ${skipped.join(", ")})` : "")
  );
}

function depthOf(tree, id) {
  let d = 0;
  let cur = tree.root;
  while (cur != null && cur !== id) {
    const n = tree.nodes[cur];
    cur = tree.nodes[id].val < n.val ? n.left : n.right;
    d++;
  }
  return d;
}
