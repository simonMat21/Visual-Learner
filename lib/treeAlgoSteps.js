// Algorithms on general (not binary-search) trees: lowest common ancestor
// (climbing and binary lifting) and tree diameter (two BFS passes).
//
// A tree is { n, edges: [[a, b], ...] } with n - 1 edges, rooted at 0.
// Step: { marks: {v: "u" | "v" | ...}, focus, path: [ids], hot: ["a-b"],
//         answer, dist, table, lines, hint, stats, result, done }

export const LCA_CLIMB_CODE = [
  "depth[], parent[] ← a DFS from the root",
  "while depth[u] > depth[v]:  u ← parent[u]",
  "while depth[v] > depth[u]:  v ← parent[v]",
  "while u ≠ v:  u ← parent[u];  v ← parent[v]",
  "return u                     // the first common ancestor",
];

export const LCA_LIFT_CODE = [
  "up[0][x] ← parent[x];  up[k][x] ← up[k−1][ up[k−1][x] ]   // the 2ᵏ-th ancestor",
  "make u the deeper one;  diff ← depth[u] − depth[v]",
  "for each bit k set in diff:  u ← up[k][u]       // jump to v's depth",
  "if u == v: return u",
  "for k from the highest down to 0:",
  "  if up[k][u] ≠ up[k][v]:  u ← up[k][u];  v ← up[k][v]",
  "return parent[u]",
];

export const DIAMETER_CODE = [
  "a ← any vertex (here the root)",
  "BFS from a;  b ← the vertex farthest from a",
  "BFS from b;  c ← the vertex farthest from b",
  "the path from b to c is a longest path: the diameter",
];

const ek = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

export function adjacency(tree) {
  const adj = Array.from({ length: tree.n }, () => []);
  tree.edges.forEach(([a, b]) => {
    adj[a].push(b);
    adj[b].push(a);
  });
  adj.forEach((l) => l.sort((x, y) => x - y));
  return adj;
}

/** parent[] and depth[] from a DFS rooted at 0 (neighbours in increasing order). */
export function rooted(tree) {
  const adj = adjacency(tree);
  const parent = Array(tree.n).fill(-1);
  const depth = Array(tree.n).fill(0);
  const seen = Array(tree.n).fill(false);
  const stack = [0];
  seen[0] = true;
  while (stack.length) {
    const u = stack.pop();
    for (const v of [...adj[u]].reverse()) {
      if (seen[v]) continue;
      seen[v] = true;
      parent[v] = u;
      depth[v] = depth[u] + 1;
      stack.push(v);
    }
  }
  return { parent, depth, adj };
}

/** Is it really a tree on 0..n-1 (n - 1 edges, connected, no repeats)? */
export function validateTree(n, edges) {
  if (n < 1) return "add at least one vertex";
  if (edges.length !== n - 1) return `a tree with ${n} vertices needs exactly ${n - 1} edges (you gave ${edges.length})`;
  const seenE = new Set();
  for (const [a, b] of edges) {
    if (a === b) return `${a}-${b} is a loop`;
    if (a >= n || b >= n) return `vertices must be 0–${n - 1}`;
    const k = ek(a, b);
    if (seenE.has(k)) return `${a}-${b} appears twice`;
    seenE.add(k);
  }
  const { parent } = rooted({ n, edges });
  for (let v = 1; v < n; v++) if (parent[v] === -1) return `${v} is not connected to 0`;
  return null;
}

export function randomTree(n = 11) {
  const edges = [];
  for (let v = 1; v < n; v++) {
    // prefer recent vertices a little, for some depth
    const lo = Math.max(0, v - 4);
    edges.push([lo + Math.floor(Math.random() * (v - lo)), v]);
  }
  return { n, edges };
}

export const SAMPLE_TREE = () => ({
  n: 12,
  edges: [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 7],
    [4, 8],
    [6, 9],
    [7, 10],
    [9, 11],
  ],
});

function recorder(tree) {
  const steps = [];
  const stats = { moves: 0 };
  return {
    stats,
    steps,
    push(x) {
      steps.push({ tree, marks: {}, path: [], hot: [], lines: [], ...x, stats: { ...stats, ...(x.extraStats || {}) } });
    },
  };
}

/* ------------------------------------------------------------------ */
/*  LCA by climbing                                                    */
/* ------------------------------------------------------------------ */

export function lcaClimbSteps(tree, u0, v0) {
  const { parent, depth } = rooted(tree);
  const r = recorder(tree);
  let u = u0;
  let v = v0;
  const pu = [u];
  const pv = [v];
  const base = (x = {}) => ({ table: { depth, parent }, marks: { [u]: u === v ? "u, v" : "u", ...(u === v ? {} : { [v]: "v" }) }, path: [...pu, ...pv], hot: [...hotOf(pu), ...hotOf(pv)], ...x });
  function hotOf(p) {
    const out = [];
    for (let i = 1; i < p.length; i++) out.push(ek(p[i - 1], p[i]));
    return out;
  }
  r.push(base({ lines: [0], hint: `depth[${u}] = ${depth[u]}, depth[${v}] = ${depth[v]}` }));
  while (depth[u] > depth[v]) {
    u = parent[u];
    pu.push(u);
    r.stats.moves++;
    r.push(base({ lines: [1], focus: u, hint: `u is deeper: move u up to ${u} (depth ${depth[u]})` }));
  }
  while (depth[v] > depth[u]) {
    v = parent[v];
    pv.push(v);
    r.stats.moves++;
    r.push(base({ lines: [2], focus: v, hint: `v is deeper: move v up to ${v} (depth ${depth[v]})` }));
  }
  r.push(base({ lines: [3], hint: `both at depth ${depth[u]}` }));
  while (u !== v) {
    u = parent[u];
    v = parent[v];
    pu.push(u);
    pv.push(v);
    r.stats.moves += 2;
    r.push(base({ lines: [3], focus: u, hint: u === v ? `they meet at ${u}` : `different: move both up (u = ${u}, v = ${v})` }));
  }
  r.push(base({ lines: [4], answer: u, done: true, result: `LCA(${u0}, ${v0}) = ${u}` }));
  return r.steps;
}

/* ------------------------------------------------------------------ */
/*  LCA by binary lifting                                              */
/* ------------------------------------------------------------------ */

export function lcaLiftSteps(tree, u0, v0) {
  const { parent, depth } = rooted(tree);
  const n = tree.n;
  const LOG = Math.max(1, Math.ceil(Math.log2(Math.max(2, n))));
  const up = [];
  const r = recorder(tree);
  const table = () => ({ up: up.map((row) => [...row]), depth, LOG });

  // build the table one row at a time
  for (let k = 0; k < LOG; k++) {
    up[k] = Array.from({ length: n }, (_, x) => (k === 0 ? parent[x] : up[k - 1][x] === -1 ? -1 : up[k - 1][up[k - 1][x]]));
    r.push({ lines: [0], table: table(), row: k, hint: k === 0 ? "row 0: each vertex's parent (its 1st ancestor)" : `row ${k}: the 2^${k} = ${2 ** k}-th ancestor = two jumps of row ${k - 1}`, fast: k > 0 });
  }

  let u = u0;
  let v = v0;
  const pu = [u];
  const pv = [v];
  const marks = () => ({ [u]: u === v ? "u, v" : "u", ...(u === v ? {} : { [v]: "v" }) });
  const path = () => [...pu, ...pv];
  if (depth[u] < depth[v]) {
    [u, v] = [v, u];
    pu.splice(0, 1, u);
    pv.splice(0, 1, v);
  }
  const diff = depth[u] - depth[v];
  r.push({ lines: [1], table: table(), marks: marks(), path: path(), hint: `u = ${u} is deeper by ${diff} = ${diff.toString(2)} in binary` });
  for (let k = 0; k < LOG; k++) {
    if (!((diff >> k) & 1)) continue;
    u = up[k][u];
    pu.push(u);
    r.stats.moves++;
    r.push({ lines: [2], table: table(), cell: [k, pu[pu.length - 2]], focus: u, marks: marks(), path: path(), hint: `bit ${k} is set: jump 2^${k} = ${2 ** k} up to ${u}` });
  }
  if (u === v) {
    r.push({ lines: [3], table: table(), answer: u, marks: marks(), path: path(), done: true, result: `LCA(${u0}, ${v0}) = ${u}` });
    return r.steps;
  }
  r.push({ lines: [3], table: table(), marks: marks(), path: path(), hint: `same depth now, but ${u} ≠ ${v}` });
  for (let k = LOG - 1; k >= 0; k--) {
    const a = up[k][u];
    const b = up[k][v];
    if (a !== b) {
      u = a;
      v = b;
      pu.push(u);
      pv.push(v);
      r.stats.moves += 2;
      r.push({ lines: [4, 5], table: table(), cell: [k, pu[pu.length - 2]], focus: u, marks: marks(), path: path(), hint: `2^${k} up: ${a} ≠ ${b}, so jump both` });
    } else {
      r.push({ lines: [4, 5], table: table(), cell: [k, u], marks: marks(), path: path(), fast: true, hint: `2^${k} up: both land on ${a === -1 ? "nothing" : a}, that might overshoot: don't jump` });
    }
  }
  const ans = parent[u];
  r.push({ lines: [6], table: table(), answer: ans, marks: marks(), path: [...path(), ans], done: true, result: `LCA(${u0}, ${v0}) = parent[${u}] = ${ans}` });
  return r.steps;
}

/* ------------------------------------------------------------------ */
/*  Diameter                                                           */
/* ------------------------------------------------------------------ */

function bfsDist(adj, s) {
  const dist = Array(adj.length).fill(-1);
  const prev = Array(adj.length).fill(-1);
  dist[s] = 0;
  const q = [s];
  const order = [];
  while (q.length) {
    const u = q.shift();
    order.push(u);
    for (const v of adj[u]) if (dist[v] === -1) {
      dist[v] = dist[u] + 1;
      prev[v] = u;
      q.push(v);
    }
  }
  return { dist, prev, order };
}

const farthest = (dist) => dist.reduce((best, d, v) => (d > dist[best] ? v : best), 0);

export function diameterSteps(tree) {
  const { adj } = rooted(tree);
  const r = recorder(tree);
  const a = 0;
  r.push({ lines: [0], marks: { [a]: "a" }, focus: a, hint: "start anywhere: here, vertex 0" });

  const runBfs = (src, line, name, extraMarks) => {
    const { dist, prev, order } = bfsDist(adj, src);
    const shown = Array(tree.n).fill(-1);
    let level = -1;
    order.forEach((x) => {
      shown[x] = dist[x];
      if (dist[x] !== level) {
        level = dist[x];
        const ring = order.filter((y) => dist[y] === level);
        ring.forEach((y) => (shown[y] = dist[y]));
        r.stats.moves++;
        r.push({ lines: [line], dist: [...shown], marks: extraMarks, focus: ring[0], wave: ring, hint: `BFS from ${src}: ${ring.length > 1 ? `vertices ${ring.join(", ")} are` : `vertex ${ring[0]} is`} ${level} edge${level === 1 ? "" : "s"} away` });
      }
    });
    const far = farthest(dist);
    r.push({ lines: [line], dist: [...dist], marks: { ...extraMarks, [far]: name }, focus: far, hint: `the farthest vertex from ${src} is ${far} (${dist[far]} edges): call it ${name}`, slow: true });
    return { dist, prev, far };
  };

  const first = runBfs(a, 1, "b", { [a]: "a" });
  const b = first.far;
  const second = runBfs(b, 2, "c", { [b]: "b" });
  const c = second.far;
  const path = [];
  for (let x = c; x !== -1; x = second.prev[x]) path.unshift(x);
  const hot = [];
  for (let i = 1; i < path.length; i++) hot.push(ek(path[i - 1], path[i]));
  r.push({
    lines: [3],
    dist: second.dist,
    marks: { [b]: "b", [c]: "c" },
    path,
    hot,
    done: true,
    result: `Diameter = ${second.dist[c]} edges: ${path.join(" – ")}`,
    extraStats: { length: second.dist[c] },
  });
  return r.steps;
}

/** Longest shortest path by brute force (for testing). */
export function diameterBrute(tree) {
  const { adj } = rooted(tree);
  let best = 0;
  for (let s = 0; s < tree.n; s++) best = Math.max(best, ...bfsDist(adj, s).dist);
  return best;
}
