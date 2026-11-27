// Shared bits for the graph algorithm engines: graph builders, samples and
// a few helpers. Engines return plain step objects the board can draw:
//
//   { lines, hint, stats, result, done, miss,
//     current, nodeColor[v], nodeLabel[v], edgeColor{key}, focus:[u,v],
//     focusColor, focusDash, weights[u][v], reverse, fadeEdges, slow, fast,
//     ...anything the algorithm's own side panel reads }

export const ekey = (u, v, directed) => (directed || u < v ? `${u}-${v}` : `${v}-${u}`);

export const INF = Infinity;

export function emptyMatrix(n) {
  return Array.from({ length: n }, () => Array(n).fill(0));
}

export function fromEdges(n, edges, directed) {
  const m = emptyMatrix(n);
  edges.forEach(([a, b, w = 1]) => {
    m[a][b] = w;
    if (!directed) m[b][a] = w;
  });
  return m;
}

/** Edges as [u, v, w]; undirected graphs list each edge once (u < v). */
export function edgeList(matrix, directed) {
  const out = [];
  const n = matrix.length;
  for (let u = 0; u < n; u++)
    for (let v = 0; v < n; v++) {
      if (u === v || !matrix[u][v]) continue;
      if (!directed && v < u) continue;
      out.push([u, v, matrix[u][v]]);
    }
  return out;
}

/** Edges as seen from u (both directions when undirected). */
export function outEdges(matrix, u) {
  const out = [];
  for (let v = 0; v < matrix.length; v++) if (v !== u && matrix[u][v]) out.push([v, matrix[u][v]]);
  return out;
}

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

/** Connected random graph (a random spanning tree plus extra edges). */
export function randomGraph(n, { directed = false, weighted = false, negative = false, extra = 0.18 } = {}) {
  const m = emptyMatrix(n);
  // potentials make negative edges possible without creating a negative cycle
  const pot = Array.from({ length: n }, () => (negative ? rnd(0, 8) : 0));
  const w = (u, v) => {
    if (!weighted) return 1;
    let x = rnd(1, 12) + (negative ? pot[u] - pot[v] : 0);
    if (x === 0) x = 1;
    return x;
  };
  const add = (u, v) => {
    if (m[u][v] || m[v][u]) return;
    m[u][v] = w(u, v);
    if (!directed) m[v][u] = m[u][v];
  };
  const order = shuffle([...Array(n).keys()]);
  for (let i = 1; i < n; i++) {
    const a = order[rnd(0, i - 1)];
    const b = order[i];
    if (directed && Math.random() < 0.5) add(b, a);
    else add(a, b);
  }
  for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) if (u !== v && Math.random() < extra) add(u, v);
  return m;
}

/** Random DAG: edges only go forward in a random order. */
export function randomDag(n) {
  const m = emptyMatrix(n);
  const order = shuffle([...Array(n).keys()]);
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) if (Math.random() < (j === i + 1 ? 0.55 : 0.22)) m[order[i]][order[j]] = 1;
  return m;
}

/** Random graph with a few separate pieces. */
export function randomPieces(n, directed = false) {
  const m = emptyMatrix(n);
  const groups = Math.max(2, Math.min(4, Math.round(n / 3)));
  const label = shuffle([...Array(n).keys()].map((i) => i % groups));
  for (let u = 0; u < n; u++)
    for (let v = 0; v < n; v++) {
      if (u === v || label[u] !== label[v] || m[u][v] || m[v][u]) continue;
      if (Math.random() < 0.55) {
        m[u][v] = 1;
        if (!directed) m[v][u] = 1;
      }
    }
  return m;
}

/** Directed graph with some cycles, good for strongly connected components. */
export function randomScc(n) {
  const m = emptyMatrix(n);
  const groups = Math.max(2, Math.min(4, Math.round(n / 2.5)));
  const label = shuffle([...Array(n).keys()].map((i) => i % groups));
  for (let g = 0; g < groups; g++) {
    const members = shuffle([...Array(n).keys()].filter((v) => label[v] === g));
    for (let i = 0; i < members.length && members.length > 1; i++) m[members[i]][members[(i + 1) % members.length]] = 1;
  }
  for (let u = 0; u < n; u++)
    for (let v = 0; v < n; v++) if (u !== v && label[u] < label[v] && Math.random() < 0.15) m[u][v] = 1;
  return m;
}

/* ------------------------------------------------------------------ */
/*  Samples                                                            */
/* ------------------------------------------------------------------ */

/** Weighted undirected graph used by Dijkstra and Borůvka. */
export const SAMPLE_WEIGHTED = () =>
  fromEdges(7, [
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
  ]);

/** Directed graph with negative edges but no negative cycle (CLRS 24.4). */
export const SAMPLE_NEGATIVE = () =>
  fromEdges(
    5,
    [
      [0, 1, 6],
      [0, 3, 7],
      [1, 2, 5],
      [1, 3, 8],
      [1, 4, -4],
      [2, 1, -2],
      [3, 2, -3],
      [3, 4, 9],
      [4, 0, 2],
      [4, 2, 7],
    ],
    true
  );

/** All-pairs example (CLRS 25.1), also used for Johnson. */
export const SAMPLE_ALL_PAIRS = () =>
  fromEdges(
    5,
    [
      [0, 1, 3],
      [0, 2, 8],
      [0, 4, -4],
      [1, 3, 1],
      [1, 4, 7],
      [2, 1, 4],
      [3, 0, 2],
      [3, 2, -5],
      [4, 3, 6],
    ],
    true
  );

export const SAMPLE_PIECES = () =>
  fromEdges(8, [
    [0, 1],
    [1, 2],
    [0, 2],
    [3, 4],
    [5, 6],
    [6, 7],
  ]);

export const SAMPLE_SCC = () =>
  fromEdges(
    8,
    [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 3],
      [6, 5],
      [6, 7],
      [7, 6],
    ],
    true
  );

export const SAMPLE_DAG = () =>
  fromEdges(
    7,
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [2, 5],
      [5, 4],
      [6, 5],
    ],
    true
  );
