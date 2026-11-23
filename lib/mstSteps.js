// Minimum spanning tree algorithms, recorded as a list of steps for the
// visualizations. No p5 or React here: every step is a plain snapshot that the
// sketch can draw, so playing forwards, backwards or jumping is just an index.
//
// Every step looks like:
//   {
//     kind:   short name of what happened ("pick", "add", "reject", ...)
//     title:  one line headline
//     body:   plain-English explanation of this step
//     lines:  pseudocode line numbers to highlight
//     edges:  { "a-b": state }  state = idle | candidate | considering |
//                                       mst | rejected | dead | skipped | checking
//     focus:  { key, kind: "grow" | "reject" | "consider", from }  edge to animate
//     total, mstCount: running MST weight / edge count
//     ...plus algorithm-specific fields for the side panel
//   }

import { trimNumber } from "./graphModel";

export const edgeKey = (a, b) => (a < b ? `${a}-${b}` : `${b}-${a}`);

const fmt = (w) => (w === Infinity ? "∞" : trimNumber(w));

/** Undirected, weighted edges of the matrix (upper triangle, no self loops). */
export function undirectedEdges(matrix) {
  const edges = [];
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (matrix[i][j] !== 0) edges.push({ from: i, to: j, weight: matrix[i][j] });
    }
  }
  return edges;
}

function hasSelfLoops(matrix) {
  return matrix.some((row, i) => row[i] !== 0);
}

const round = (x) => Math.round(x * 1000) / 1000;

/* ------------------------------------------------------------------ */
/*  Prim's algorithm (the O(V²) adjacency matrix version)              */
/* ------------------------------------------------------------------ */

export const PRIM_CODE = [
  "key[start] ← 0, every other key ← ∞",
  "while some vertex is not in the tree:",
  "  u ← vertex outside the tree with smallest key",
  "  if key[u] = ∞: graph is disconnected, stop",
  "  add u to the tree (with edge parent[u]–u)",
  "  for each neighbour v of u outside the tree:",
  "    if weight(u, v) < key[v]:",
  "      key[v] ← weight(u, v), parent[v] ← u",
];

/**
 * @param {number[][]} matrix symmetric weighted adjacency matrix
 * @param {number} start start vertex
 */
export function primSteps(matrix, start = 0) {
  const n = matrix.length;
  const s = Math.min(Math.max(0, start), n - 1);
  const edges = undirectedEdges(matrix);
  const steps = [];

  const inTree = Array(n).fill(false);
  const key = Array(n).fill(Infinity);
  const parent = Array(n).fill(-1);
  const mst = new Set();
  let total = 0;

  key[s] = 0;

  /** Edge colours that follow from the current state. */
  function edgeStates(extra = {}) {
    const states = {};
    edges.forEach(({ from, to }) => {
      const k = edgeKey(from, to);
      if (mst.has(k)) states[k] = "mst";
      else if (inTree[from] && inTree[to]) states[k] = "dead";
      else states[k] = "idle";
    });
    for (let v = 0; v < n; v++) {
      if (!inTree[v] && parent[v] >= 0) states[edgeKey(parent[v], v)] = "candidate";
    }
    return { ...states, ...extra };
  }

  function push(step) {
    steps.push({
      edges: edgeStates(),
      inTree: [...inTree],
      key: [...key],
      parent: [...parent],
      changed: [],
      current: -1,
      total: round(total),
      mstCount: mst.size,
      ...step,
    });
  }

  const loopNote = hasSelfLoops(matrix) ? " Self loops are ignored: they can never be part of a tree." : "";

  push({
    kind: "init",
    lines: [0],
    current: s,
    title: `Start at vertex ${s}`,
    body:
      `The tree starts as just vertex ${s}. Each vertex gets a key: the weight of the cheapest edge that ` +
      `would connect it to the tree. We know none yet, so every key is ∞, except key[${s}] = 0.` +
      loopNote,
  });

  for (let round_ = 0; round_ < n; round_++) {
    // 1. pick the cheapest vertex outside the tree
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!inTree[v] && (u === -1 || key[v] < key[u])) u = v;
    }
    if (u === -1) break;

    if (key[u] === Infinity) {
      const missing = [];
      for (let v = 0; v < n; v++) if (!inTree[v]) missing.push(v);
      push({
        kind: "disconnected",
        lines: [3],
        title: "Graph is disconnected",
        body:
          `Every vertex left outside the tree (${missing.join(", ")}) still has key ∞: no edge reaches them ` +
          `from the tree. A spanning tree is impossible, so Prim's stops with a tree for the part of the graph ` +
          `that contains vertex ${s} (total weight ${fmt(round(total))}).`,
        done: true,
      });
      return steps;
    }

    const p = parent[u];
    if (p >= 0) {
      push({
        kind: "pick",
        lines: [2],
        current: u,
        edges: edgeStates({ [edgeKey(p, u)]: "considering" }),
        focus: { key: edgeKey(p, u), kind: "consider" },
        title: `Smallest key: vertex ${u} (key ${fmt(key[u])})`,
        body:
          `Of all vertices outside the tree, ${u} has the smallest key. That means edge ${p}–${u} ` +
          `(weight ${fmt(key[u])}) is the cheapest edge crossing from the tree to the rest of the graph, ` +
          `so it is always safe to add it.`,
      });
    }

    // 2. add it to the tree
    inTree[u] = true;
    if (p >= 0) {
      mst.add(edgeKey(p, u));
      total += key[u];
    }
    push({
      kind: "add",
      lines: [4],
      current: u,
      focus: p >= 0 ? { key: edgeKey(p, u), kind: "grow", from: p } : null,
      title: p >= 0 ? `Add vertex ${u} with edge ${p}–${u}` : `Add vertex ${u} to the tree`,
      body:
        p >= 0
          ? `Vertex ${u} joins the tree through edge ${p}–${u}. The tree now has ${mst.size} ` +
            `edge${mst.size === 1 ? "" : "s"} and weighs ${fmt(round(total))}. Any edge between two tree ` +
            `vertices is now useless (it would make a cycle), so those fade out.`
          : `Vertex ${u} is the start, so it joins the tree without an edge. Now look at its neighbours.`,
    });

    // 3. update the keys of its neighbours
    const updates = [];
    const ignored = [];
    const checking = {};
    for (let v = 0; v < n; v++) {
      if (v === u || inTree[v] || matrix[u][v] === 0) continue;
      const w = matrix[u][v];
      checking[edgeKey(u, v)] = "checking";
      if (w < key[v]) {
        updates.push({ v, from: key[v], to: w, oldParent: parent[v] });
        key[v] = w;
        parent[v] = u;
      } else {
        ignored.push({ v, w, key: key[v] });
      }
    }

    if (updates.length || ignored.length) {
      const parts = [];
      if (updates.length) {
        parts.push(
          "Cheaper connections found: " +
            updates.map((x) => `key[${x.v}] ${fmt(x.from)} → ${fmt(x.to)}`).join(", ") +
            "."
        );
      }
      if (ignored.length) {
        parts.push(
          "Not better, so ignored: " +
            ignored.map((x) => `${u}–${x.v} (${fmt(x.w)} ≥ ${fmt(x.key)})`).join(", ") +
            "."
        );
      }
      const extra = {};
      ignored.forEach((x) => {
        extra[edgeKey(u, x.v)] = "checking";
      });
      push({
        kind: "update",
        lines: updates.length ? [5, 6, 7] : [5, 6],
        current: u,
        changed: updates.map((x) => x.v),
        edges: edgeStates(extra),
        title: `Look at the neighbours of ${u}`,
        body:
          `For every neighbour v outside the tree, ask: is edge ${u}–v cheaper than v's current key? ` +
          parts.join(" ") +
          " Dashed yellow edges show the best known way to reach each outside vertex.",
      });
    }
  }

  push({
    kind: "done",
    lines: [1],
    done: true,
    title: `Minimum spanning tree found — total weight ${fmt(round(total))}`,
    body:
      n === 1
        ? "A graph with one vertex is already its own spanning tree."
        : `Every vertex is in the tree. The ${mst.size} green edges connect all ${n} vertices with the ` +
          `smallest possible total weight (${fmt(round(total))}). Prim's grew one tree outwards, always ` +
          `taking the cheapest edge leaving it.`,
  });

  return steps;
}

/* ------------------------------------------------------------------ */
/*  Kruskal's algorithm (sorted edges + union-find)                     */
/* ------------------------------------------------------------------ */

export const KRUSKAL_CODE = [
  "sort all edges by weight, smallest first",
  "put every vertex in its own set",
  "for each edge (u, v, w) in sorted order:",
  "  if find(u) ≠ find(v):      // different trees",
  "    add the edge to the MST, union(u, v)",
  "  else: skip it               // it would make a cycle",
  "  stop once the MST has V − 1 edges",
];

export function kruskalSteps(matrix) {
  const n = matrix.length;
  const sorted = undirectedEdges(matrix).sort(
    (a, b) => a.weight - b.weight || a.from - b.from || a.to - b.to
  );
  const steps = [];

  const dsu = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(1);
  const find = (x) => {
    while (dsu[x] !== x) x = dsu[x];
    return x;
  };
  const union = (a, b) => {
    let ra = find(a);
    let rb = find(b);
    if (rank[ra] < rank[rb] || (rank[ra] === rank[rb] && rb < ra)) [ra, rb] = [rb, ra];
    dsu[rb] = ra;
    rank[ra] += rank[rb];
    return ra;
  };
  const setOf = (x) => {
    const r = find(x);
    const members = [];
    for (let v = 0; v < n; v++) if (find(v) === r) members.push(v);
    return members;
  };
  const setText = (x) => `{${setOf(x).join(", ")}}`;

  const status = sorted.map(() => "idle"); // per sorted edge
  let total = 0;
  let mstCount = 0;

  function edgeStates(extra = {}) {
    const states = {};
    sorted.forEach((e, idx) => {
      const s = status[idx];
      states[edgeKey(e.from, e.to)] = s === "rejected" ? "rejected" : s;
    });
    return { ...states, ...extra };
  }

  function push(step) {
    const root = Array.from({ length: n }, (_, v) => find(v));
    const sets = [];
    const seen = new Set();
    for (let v = 0; v < n; v++) {
      if (seen.has(root[v])) continue;
      seen.add(root[v]);
      sets.push({ root: root[v], members: setOf(v) });
    }
    steps.push({
      edges: edgeStates(),
      sorted,
      status: [...status],
      cursor: -1,
      root,
      sets,
      dsu: [...dsu],
      total: round(total),
      mstCount,
      ...step,
    });
  }

  const loopNote = hasSelfLoops(matrix) ? " Self loops are ignored." : "";

  push({
    kind: "init",
    lines: [0, 1],
    title: `Sort the ${sorted.length} edges by weight`,
    body:
      `Kruskal's looks at edges from cheapest to most expensive (list on the right). Every vertex starts in ` +
      `its own set — think of each as a tiny tree on its own. Sets are shown by colour.` +
      loopNote,
  });

  const goal = n - 1;
  for (let idx = 0; idx < sorted.length && mstCount < goal; idx++) {
    const { from: a, to: b, weight: w } = sorted[idx];
    const k = edgeKey(a, b);
    const same = find(a) === find(b);

    status[idx] = "considering";
    push({
      kind: "consider",
      lines: [2, 3],
      cursor: idx,
      focus: { key: k, kind: "consider" },
      title: `Next cheapest edge: ${a}–${b} (weight ${fmt(w)})`,
      body: same
        ? `find(${a}) and find(${b}) give the same set ${setText(a)}: ${a} and ${b} are already connected.`
        : `find(${a}) gives ${setText(a)} and find(${b}) gives ${setText(b)}: two different sets.`,
    });

    if (same) {
      status[idx] = "rejected";
      push({
        kind: "reject",
        lines: [5],
        cursor: idx,
        focus: { key: k, kind: "reject" },
        title: `Skip ${a}–${b}: it would make a cycle`,
        body:
          `There is already a path between ${a} and ${b} using cheaper edges, so adding ${a}–${b} ` +
          `would close a loop. A tree can't contain a cycle, so this edge is thrown away.`,
      });
    } else {
      union(a, b);
      status[idx] = "mst";
      mstCount += 1;
      total += w;
      push({
        kind: "accept",
        lines: [4],
        cursor: idx,
        focus: { key: k, kind: "grow", from: a },
        title: `Add ${a}–${b} to the tree`,
        body:
          `It joins two separate trees, so it can't make a cycle. The two sets merge into ${setText(a)}. ` +
          `MST so far: ${mstCount} of ${goal} edges, weight ${fmt(round(total))}.`,
      });
    }
  }

  let skipped = 0;
  status.forEach((s, idx) => {
    if (s === "idle") {
      status[idx] = "skipped";
      skipped += 1;
    }
  });

  if (mstCount === goal) {
    push({
      kind: "done",
      lines: [6],
      done: true,
      title: `Minimum spanning tree found — total weight ${fmt(round(total))}`,
      body:
        n === 1
          ? "A graph with one vertex is already its own spanning tree."
          : `The tree has V − 1 = ${goal} edges, so every vertex is connected.` +
            (skipped
              ? ` The ${skipped} remaining edge${skipped === 1 ? " is" : "s are"} never looked at.`
              : "") +
            ` Kruskal's built the tree by joining small forests, always with the cheapest safe edge.`,
    });
  } else {
    const comps = new Set(Array.from({ length: n }, (_, v) => find(v))).size;
    push({
      kind: "disconnected",
      lines: [2],
      done: true,
      title: "Out of edges — the graph is disconnected",
      body:
        `Only ${mstCount} of the ${goal} edges needed were found, and ${comps} separate sets remain. ` +
        `No spanning tree exists; Kruskal's has built a minimum spanning forest (one tree per piece, ` +
        `total weight ${fmt(round(total))}).`,
    });
  }

  return steps;
}

/* ------------------------------------------------------------------ */
/*  Graphs to start from                                               */
/* ------------------------------------------------------------------ */

/** A classic 7 vertex example with a unique, interesting MST. */
export function sampleMstMatrix() {
  const edges = [
    [0, 1, 7],
    [0, 3, 5],
    [1, 2, 8],
    [1, 3, 9],
    [1, 4, 7],
    [2, 4, 5],
    [3, 4, 15],
    [3, 5, 6],
    [4, 5, 8],
    [4, 6, 9],
    [5, 6, 11],
  ];
  const n = 7;
  const m = Array.from({ length: n }, () => Array(n).fill(0));
  edges.forEach(([a, b, w]) => {
    m[a][b] = w;
    m[b][a] = w;
  });
  return m;
}

/** Random connected weighted graph: a random spanning tree plus extra edges. */
export function randomConnectedMatrix(n, rand = Math.random) {
  const m = Array.from({ length: n }, () => Array(n).fill(0));
  const weight = () => Math.floor(rand() * 15) + 1;
  const order = Array.from({ length: n }, (_, i) => i).sort(() => rand() - 0.5);
  for (let i = 1; i < n; i++) {
    const a = order[i];
    const b = order[Math.floor(rand() * i)];
    const w = weight();
    m[a][b] = w;
    m[b][a] = w;
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (m[i][j] === 0 && rand() < 0.35) {
        const w = weight();
        m[i][j] = w;
        m[j][i] = w;
      }
    }
  }
  return m;
}
