// Breadth-first and depth-first search on an adjacency matrix, recorded as
// steps for the visualizer. Neighbours are always tried in increasing order.
//
// Step: { visited, parent, level (BFS distance) / disc (DFS discovery number),
//         state: per vertex "new" | "frontier" | "active" | "done",
//         frontier (queue front→rear, or call stack bottom→top), order,
//         current, edge: [u, v], edgeKind: "check" | "tree" | "skip",
//         tree: ["u-v"], lines, stats, result, done }

export const BFS_CODE = [
  "visited[s] ← true;  queue ← [s]",
  "while queue is not empty:",
  "  u ← queue.dequeue();  visit(u)",
  "  for each neighbour v of u:",
  "    if not visited[v]:",
  "      visited[v] ← true;  parent[v] ← u;  queue.enqueue(v)",
];

export const DFS_CODE = [
  "dfs(u):",
  "  visited[u] ← true;  visit(u)",
  "  for each neighbour v of u:",
  "    if not visited[v]:",
  "      parent[v] ← u;  dfs(v)        // go deeper first",
  "  return                          // backtrack to the caller",
];

export const ekey = (u, v, directed) => (directed || u < v ? `${u}-${v}` : `${v}-${u}`);

function neighbours(matrix, u) {
  const out = [];
  for (let v = 0; v < matrix.length; v++) if (v !== u && matrix[u][v] !== 0) out.push(v);
  return out;
}

function recorder(n, directed) {
  const visited = Array(n).fill(false);
  const parent = Array(n).fill(-1);
  const number = Array(n).fill(null); // BFS level or DFS discovery index
  const state = Array(n).fill("new");
  const order = [];
  const tree = [];
  let frontier = [];
  const stats = { visited: 0, checked: 0 };
  const steps = [];
  return {
    visited,
    parent,
    number,
    state,
    order,
    tree,
    stats,
    get frontier() {
      return frontier;
    },
    set frontier(f) {
      frontier = f;
    },
    push(step) {
      steps.push({
        visited: [...visited],
        parent: [...parent],
        number: [...number],
        state: [...state],
        frontier: [...frontier],
        order: [...order],
        tree: [...tree],
        current: null,
        edge: null,
        edgeKind: null,
        lines: [],
        directed,
        ...step,
        stats: { ...stats },
      });
    },
    steps,
  };
}

export function bfsSteps(matrix, start, directed) {
  const n = matrix.length;
  const r = recorder(n, directed);
  const s = Math.min(Math.max(0, start), n - 1);
  r.visited[s] = true;
  r.number[s] = 0;
  r.state[s] = "frontier";
  r.frontier = [s];
  r.stats.visited = 1;
  r.push({ lines: [0], current: s, hint: `start at ${s}: mark it visited and put it in the queue` });

  while (r.frontier.length) {
    r.push({ lines: [1], hint: `queue: [${r.frontier.join(", ")}]` });
    const u = r.frontier[0];
    r.frontier = r.frontier.slice(1);
    r.state[u] = "active";
    r.order.push(u);
    r.push({ lines: [2], current: u, hint: `dequeue ${u} and visit it (distance ${r.number[u]})` });
    for (const v of neighbours(matrix, u)) {
      r.stats.checked++;
      if (!r.visited[v]) {
        r.push({ lines: [3, 4], current: u, edge: [u, v], edgeKind: "check", hint: `${v} is not visited yet` });
        r.visited[v] = true;
        r.parent[v] = u;
        r.number[v] = r.number[u] + 1;
        r.state[v] = "frontier";
        r.frontier = [...r.frontier, v];
        r.tree.push(ekey(u, v, directed));
        r.stats.visited++;
        r.push({ lines: [5], current: u, edge: [u, v], edgeKind: "tree", hint: `mark ${v}, parent ${u}, distance ${r.number[v]}, enqueue it` });
      } else {
        r.push({ lines: [3, 4], current: u, edge: [u, v], edgeKind: "skip", hint: `${v} is already visited: skip` });
      }
    }
    r.state[u] = "done";
    r.push({ lines: [1], hint: `${u} is finished` });
  }
  return finish(r, n, "BFS", s);
}

export function dfsSteps(matrix, start, directed) {
  const n = matrix.length;
  const r = recorder(n, directed);
  const s = Math.min(Math.max(0, start), n - 1);
  let counter = 0;

  const dfs = (u, from) => {
    r.frontier = [...r.frontier, u];
    r.visited[u] = true;
    r.number[u] = counter++;
    r.state[u] = "active";
    r.order.push(u);
    r.stats.visited++;
    r.push({
      lines: [0, 1],
      current: u,
      kind: "enter",
      hint: from == null ? `call dfs(${u}): visit it first` : `call dfs(${u}): visit it`,
    });
    for (const v of neighbours(matrix, u)) {
      r.stats.checked++;
      if (!r.visited[v]) {
        r.push({ lines: [2, 3], current: u, edge: [u, v], edgeKind: "check", hint: `${v} is not visited: go deeper` });
        r.parent[v] = u;
        r.tree.push(ekey(u, v, directed));
        r.state[u] = "frontier"; // waiting on the stack while v is explored
        r.push({ lines: [4], current: u, edge: [u, v], edgeKind: "tree", hint: `parent[${v}] = ${u}, call dfs(${v})` });
        dfs(v, u);
        r.state[u] = "active";
        r.push({ lines: [2], current: u, hint: `back in dfs(${u}): try its next neighbour` });
      } else {
        r.push({ lines: [2, 3], current: u, edge: [u, v], edgeKind: "skip", hint: `${v} is already visited: skip` });
      }
    }
    r.state[u] = "done";
    r.frontier = r.frontier.slice(0, -1);
    r.push({
      lines: [5],
      current: from,
      kind: "leave",
      hint: from == null ? `dfs(${u}) returns: the search is over` : `dfs(${u}) is done: backtrack to ${from}`,
    });
  };

  dfs(s, null);
  return finish(r, n, "DFS", s);
}

function finish(r, n, name, s) {
  const missed = [];
  for (let v = 0; v < n; v++) if (!r.visited[v]) missed.push(v);
  const result =
    `${name} order: ${r.order.join(", ")}` +
    (missed.length ? `. Not reachable from ${s}: ${missed.join(", ")}` : "");
  r.push({ lines: [], result, done: true, missed });
  return r.steps;
}

/* ------------------------------------------------------------------ */
/*  Graphs to start from                                               */
/* ------------------------------------------------------------------ */

export function sampleGraph() {
  const n = 8;
  const m = Array.from({ length: n }, () => Array(n).fill(0));
  [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [3, 4],
    [4, 7],
    [5, 7],
  ].forEach(([a, b]) => {
    m[a][b] = 1;
    m[b][a] = 1;
  });
  return m;
}

/** Random connected graph: a random spanning tree plus a few extra edges. */
export function randomGraph(n, directed) {
  const m = Array.from({ length: n }, () => Array(n).fill(0));
  const order = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5);
  const link = (a, b) => {
    if (directed) m[a][b] = 1;
    else {
      m[a][b] = 1;
      m[b][a] = 1;
    }
  };
  for (let i = 1; i < n; i++) link(order[Math.floor(Math.random() * i)], order[i]);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) if (i !== j && !m[i][j] && !m[j][i] && Math.random() < 0.12) link(i, j);
  return m;
}
