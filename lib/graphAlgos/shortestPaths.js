// Shortest path algorithms: Dijkstra, Bellman-Ford, Floyd-Warshall, Johnson.

import {
  INF,
  SAMPLE_ALL_PAIRS,
  SAMPLE_NEGATIVE,
  SAMPLE_WEIGHTED,
  edgeList,
  ekey,
  outEdges,
  randomGraph,
} from "./common";

const fmt = (v) => (v === INF ? "∞" : String(Math.round(v * 100) / 100));

/** Directed edge list; an undirected edge counts both ways. */
function arcs(matrix, directed) {
  const out = [];
  edgeList(matrix, directed).forEach(([u, v, w]) => {
    out.push([u, v, w]);
    if (!directed) out.push([v, u, w]);
  });
  return out;
}

function treeColors(prev, directed, color = "good") {
  const ec = {};
  prev.forEach((p, v) => {
    if (p >= 0) ec[ekey(p, v, directed)] = color;
  });
  return ec;
}

function pathTo(prev, s, v) {
  const out = [];
  let cur = v;
  let guard = 0;
  while (cur !== -1 && guard++ < prev.length + 1) {
    out.unshift(cur);
    if (cur === s) return out;
    cur = prev[cur];
  }
  return null;
}

/* ================================================================== */
/*  Dijkstra                                                           */
/* ================================================================== */

export const DIJKSTRA_CODE = [
  "dist[s] ← 0, every other dist ← ∞",
  "while some vertex is not finished:",
  "  u ← the unfinished vertex with the smallest dist",
  "  if dist[u] = ∞: stop   // the rest can't be reached",
  "  mark u finished          // its dist can't get smaller now",
  "  for each edge u → v (weight w) to an unfinished v:",
  "    if dist[u] + w < dist[v]:",
  "      dist[v] ← dist[u] + w;  prev[v] ← u",
];

export function dijkstraSteps(matrix, { start = 0, directed = false }) {
  const n = matrix.length;
  const s = Math.min(start, n - 1);
  const dist = Array(n).fill(INF);
  const prev = Array(n).fill(-1);
  const done = Array(n).fill(false);
  const stats = { finished: 0, relaxed: 0 };
  const steps = [];
  const snap = (x = {}) => ({
    dist: [...dist],
    prev: [...prev],
    finished: [...done],
    source: s,
    nodeColor: dist.map((d, v) => (done[v] ? "good" : d < INF ? "frontier" : "white")),
    nodeLabel: dist.map((d) => fmt(d)),
    edgeColor: treeColors(prev, directed),
    lines: [],
    ...x,
    stats: { ...stats },
  });

  if (arcs(matrix, directed).some(([, , w]) => w < 0)) {
    steps.push(snap({ hint: "this graph has a negative edge" }));
    steps.push(
      snap({
        done: true,
        miss: true,
        result: "Dijkstra needs non-negative weights. Use Bellman-Ford for negative edges.",
      })
    );
    return steps;
  }

  dist[s] = 0;
  steps.push(snap({ lines: [0], current: s, hint: `start at ${s}: its distance is 0` }));

  for (;;) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!done[v] && (u === -1 || dist[v] < dist[u])) u = v;
    if (u === -1) break;
    steps.push(snap({ lines: [1, 2], current: u, hint: `smallest unfinished distance: ${u} (${fmt(dist[u])})` }));
    if (dist[u] === INF) {
      steps.push(snap({ lines: [3], hint: "every remaining vertex is unreachable" }));
      break;
    }
    done[u] = true;
    stats.finished++;
    steps.push(snap({ lines: [4], current: u, hint: `${u} is finished: ${fmt(dist[u])} is its shortest distance`, slow: true }));
    for (const [v, w] of outEdges(matrix, u)) {
      if (!directed || matrix[u][v]) {
        if (done[v]) continue;
        const nd = dist[u] + w;
        if (nd < dist[v]) {
          const old = dist[v];
          dist[v] = nd;
          prev[v] = u;
          stats.relaxed++;
          steps.push(
            snap({
              lines: [5, 6, 7],
              current: u,
              focus: [u, v],
              focusColor: "good",
              hint: `${fmt(dist[u])} + ${w} = ${fmt(nd)} < ${fmt(old)}: update dist[${v}]`,
            })
          );
        } else {
          steps.push(
            snap({
              lines: [5, 6],
              current: u,
              focus: [u, v],
              focusColor: "bad",
              focusDash: true,
              fast: true,
              hint: `${fmt(dist[u])} + ${w} = ${fmt(nd)} is not shorter than ${fmt(dist[v])}`,
            })
          );
        }
      }
    }
  }
  const missed = dist.map((d, v) => (d === INF ? v : -1)).filter((v) => v >= 0);
  steps.push(
    snap({
      done: true,
      result:
        `Shortest distances from ${s} found` + (missed.length ? ` (${missed.join(", ")} unreachable)` : ""),
      showPaths: true,
    })
  );
  return steps;
}

function distanceSide(h, step, { n }, extraTitle) {
  const { SIDE } = h;
  const x0 = SIDE.x + 14;
  h.label(extraTitle || `FROM VERTEX ${step.source}`, x0, SIDE.y + 18, "white", 11, h.P.LEFT);
  const cols = [
    { title: "vertex", x: x0 + 26 },
    { title: "dist", x: x0 + 100 },
    { title: "prev", x: x0 + 170 },
    { title: step.finished ? "finished" : "", x: x0 + 250 },
  ];
  const rows = step.dist.map((d, v) => [
    String(v),
    { t: fmt(d), c: d === INF ? "dim" : "white", b: true },
    step.prev[v] < 0 ? "–" : String(step.prev[v]),
    step.finished ? { t: step.finished[v] ? "✔" : "–", c: step.finished[v] ? "good" : "dim" } : "",
  ]);
  const pitch = Math.min(24, 190 / Math.max(1, n));
  h.table({ y: SIDE.y + 44, cols, rows, pitch, highlight: step.current ?? -1 });

  // the actual paths, once known
  const py = SIDE.y + 66 + n * pitch + 10;
  h.label(step.showPaths ? "SHORTEST PATHS" : "PREV[] GIVES THE PATHS", x0, py, "white", 11, h.P.LEFT);
  if (step.showPaths) {
    const rowsAvail = Math.floor((SIDE.y + SIDE.h - py - 14) / 20);
    step.dist.slice(0, rowsAvail).forEach((d, v) => {
      const p = d < INF ? pathTo(step.prev, step.source, v) : null;
      h.label(
        p ? `${v}: ${p.join(" → ")}  (${fmt(d)})` : `${v}: unreachable`,
        x0,
        py + 22 + v * 20,
        p ? "white" : "dim",
        12,
        h.P.LEFT,
        false
      );
    });
  }
}

/* ================================================================== */
/*  Bellman-Ford                                                       */
/* ================================================================== */

export const BELLMAN_CODE = [
  "dist[s] ← 0, every other dist ← ∞",
  "repeat V − 1 times:",
  "  for each edge u → v with weight w:",
  "    if dist[u] + w < dist[v]:  dist[v] ← dist[u] + w;  prev[v] ← u",
  "  if nothing changed in this pass: stop early",
  "for each edge u → v with weight w:     // one extra pass",
  "  if dist[u] + w < dist[v]: there is a negative cycle",
];

export function bellmanFordSteps(matrix, { start = 0, directed = true }) {
  const n = matrix.length;
  const s = Math.min(start, n - 1);
  const E = arcs(matrix, directed);
  const dist = Array(n).fill(INF);
  const prev = Array(n).fill(-1);
  const stats = { pass: 0, relaxed: 0 };
  const steps = [];
  let cycle = null;
  const snap = (x = {}) => ({
    dist: [...dist],
    prev: [...prev],
    source: s,
    edges: E,
    nodeColor: dist.map((d, v) => (cycle && cycle.includes(v) ? "bad" : d < INF ? "frontier" : "white")),
    nodeLabel: dist.map((d) => fmt(d)),
    edgeColor: cycle ? cycleColors(cycle, directed) : treeColors(prev, directed),
    lines: [],
    ...x,
    stats: { ...stats },
  });

  dist[s] = 0;
  steps.push(snap({ lines: [0], current: s, hint: `start at ${s}: its distance is 0` }));
  let lastPass = 0;
  for (let pass = 1; pass <= n - 1; pass++) {
    stats.pass = pass;
    lastPass = pass;
    steps.push(snap({ lines: [1], hint: `pass ${pass} of ${n - 1}: try every edge once` }));
    let changed = false;
    E.forEach(([u, v, w], idx) => {
      if (dist[u] === INF) {
        steps.push(snap({ lines: [2, 3], edgeIdx: idx, focus: [u, v], focusColor: "dim", focusDash: true, fast: true, hint: `dist[${u}] is ∞: nothing to relax yet` }));
        return;
      }
      const nd = dist[u] + w;
      if (nd < dist[v]) {
        const old = dist[v];
        dist[v] = nd;
        prev[v] = u;
        stats.relaxed++;
        changed = true;
        steps.push(snap({ lines: [3], edgeIdx: idx, current: v, focus: [u, v], focusColor: "good", hint: `${fmt(dist[u])} + (${w}) = ${fmt(nd)} < ${fmt(old)}: update dist[${v}]` }));
      } else {
        steps.push(snap({ lines: [2, 3], edgeIdx: idx, focus: [u, v], focusColor: "bad", focusDash: true, fast: true, hint: `${fmt(dist[u])} + (${w}) = ${fmt(nd)} is not shorter than ${fmt(dist[v])}` }));
      }
    });
    if (!changed) {
      steps.push(snap({ lines: [4], hint: `nothing changed in pass ${pass}: the distances are final` }));
      break;
    }
  }

  // extra pass: anything that still improves sits on (or after) a negative cycle
  steps.push(snap({ lines: [5], hint: "one more pass: if anything still improves, there is a negative cycle" }));
  for (let idx = 0; idx < E.length; idx++) {
    const [u, v, w] = E[idx];
    if (dist[u] !== INF && dist[u] + w < dist[v]) {
      // walk back V times to land inside the cycle, then collect it
      let x = v;
      prev[v] = u;
      for (let k = 0; k < n; k++) x = prev[x];
      cycle = [x];
      for (let y = prev[x]; y !== x && y >= 0; y = prev[y]) cycle.unshift(y);
      steps.push(snap({ lines: [6], edgeIdx: idx, focus: [u, v], focusColor: "bad", hint: `edge ${u} → ${v} can still be relaxed`, slow: true }));
      steps.push(
        snap({
          done: true,
          miss: true,
          lines: [6],
          result: `Negative cycle: ${[...cycle, cycle[0]].join(" → ")}. Shortest paths are not defined.`,
        })
      );
      return steps;
    }
  }
  steps.push(
    snap({
      done: true,
      showPaths: true,
      result: `No negative cycle. Shortest distances from ${s} found after ${lastPass} pass${lastPass === 1 ? "" : "es"}.`,
    })
  );
  return steps;
}

function cycleColors(cycle, directed) {
  const ec = {};
  cycle.forEach((v, i) => {
    ec[ekey(v, cycle[(i + 1) % cycle.length], directed)] = "bad";
  });
  return ec;
}

function bellmanSide(h, step, ctx) {
  const { SIDE } = h;
  const x0 = SIDE.x + 14;
  h.label(`FROM VERTEX ${step.source}   ·   pass ${step.stats.pass || 0} of ${ctx.n - 1}`, x0, SIDE.y + 18, "white", 11, h.P.LEFT);
  const cols = [
    { title: "vertex", x: x0 + 26 },
    { title: "dist", x: x0 + 100 },
    { title: "prev", x: x0 + 170 },
  ];
  const rows = step.dist.map((d, v) => [String(v), { t: fmt(d), c: d === INF ? "dim" : "white", b: true }, step.prev[v] < 0 ? "–" : String(step.prev[v])]);
  const pitch = Math.min(22, 170 / Math.max(1, ctx.n));
  h.table({ y: SIDE.y + 42, cols, rows, pitch, highlight: step.current ?? -1 });

  // the fixed order every pass goes through
  const y0 = SIDE.y + 70 + ctx.n * pitch;
  h.label("EDGES (same order every pass)", x0, y0, "white", 11, h.P.LEFT);
  const perRow = 4;
  step.edges.forEach(([u, v, w], i) => {
    const x = x0 + 40 + (i % perRow) * 88;
    const y = y0 + 22 + Math.floor(i / perRow) * 24;
    if (y > SIDE.y + SIDE.h - 12) return;
    h.chip(`${u}→${v} ${fmt(w)}`, x, y, i === step.edgeIdx ? "active" : [196, 204, 198], 80, 20, 11);
  });
}

/* ================================================================== */
/*  Floyd-Warshall                                                     */
/* ================================================================== */

export const FLOYD_CODE = [
  "dist[i][j] ← weight of edge i → j  (0 if i = j, ∞ if no edge)",
  "for k ← 0 to V − 1:           // now allow k as a stop-over",
  "  for i ← 0 to V − 1:",
  "    for j ← 0 to V − 1:",
  "      if dist[i][k] + dist[k][j] < dist[i][j]:",
  "        dist[i][j] ← dist[i][k] + dist[k][j]",
  "if some dist[i][i] < 0: there is a negative cycle",
];

export function floydSteps(matrix, { directed = true }) {
  const n = matrix.length;
  const d = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : matrix[i][j] || (!directed && matrix[j][i]) ? matrix[i][j] || matrix[j][i] : INF))
  );
  const stats = { k: "–", updates: 0 };
  const steps = [];
  const snap = (x = {}) => ({
    dist: d.map((r) => [...r]),
    lines: [],
    ...x,
    stats: { ...stats },
  });
  const marks = (k, i, j) => {
    const nc = Array(n).fill("white");
    const lab = Array(n).fill(null);
    if (k != null) {
      nc[k] = "active";
      lab[k] = "k";
    }
    if (i != null) {
      nc[i] = "blue";
      lab[i] = i === k ? "k" : "i";
    }
    if (j != null) {
      nc[j] = "blue";
      lab[j] = j === k ? "k" : lab[j] ? `${lab[j]}, j` : "j";
    }
    return { nodeColor: nc, nodeLabel: lab };
  };

  steps.push(snap({ lines: [0], hint: "start with the direct edges only", ...marks() }));
  for (let k = 0; k < n; k++) {
    stats.k = k;
    steps.push(snap({ lines: [1], k, hint: `allow paths that go through ${k}`, slow: true, ...marks(k) }));
    let any = false;
    for (let i = 0; i < n; i++) {
      if (i === k || d[i][k] === INF) continue;
      for (let j = 0; j < n; j++) {
        if (j === k || d[k][j] === INF) continue;
        const nd = d[i][k] + d[k][j];
        if (nd < d[i][j]) {
          const old = d[i][j];
          d[i][j] = nd;
          stats.updates++;
          any = true;
          steps.push(
            snap({
              lines: [4, 5],
              k,
              cell: [i, j],
              hint: `${i} → ${k} → ${j}: ${fmt(nd - d[k][j])} + ${fmt(d[k][j])} = ${fmt(nd)} < ${fmt(old)}`,
              ...marks(k, i, j),
            })
          );
        }
      }
    }
    if (!any) steps.push(snap({ lines: [2, 3, 4], k, fast: true, hint: `going through ${k} makes no path shorter`, ...marks(k) }));
  }
  const bad = [];
  for (let i = 0; i < n; i++) if (d[i][i] < 0) bad.push(i);
  if (bad.length) {
    steps.push(
      snap({
        lines: [6],
        done: true,
        miss: true,
        nodeColor: Array.from({ length: n }, (_, v) => (bad.includes(v) ? "bad" : "white")),
        result: `Negative cycle through ${bad.join(", ")}: dist[i][i] < 0`,
      })
    );
  } else {
    steps.push(snap({ lines: [6], done: true, result: `All ${n}×${n} shortest distances found` }));
  }
  return steps;
}

export function matrixSide(h, step, n, opts = {}) {
  const { SIDE, P } = h;
  const x0 = SIDE.x + 14;
  const top = opts.top ?? SIDE.y + 18;
  h.label(opts.title || "DISTANCE MATRIX   row = from, column = to", x0, top, "white", 11, P.LEFT);
  const cell = Math.min(42, (SIDE.w - 60) / n);
  const gx = x0 + 30;
  const gy = top + 36;
  const k = step.k;
  for (let j = 0; j < n; j++) h.label(String(j), gx + j * cell + cell / 2, gy - 14, j === k ? "active" : [190, 198, 192], 11);
  for (let i = 0; i < n; i++) {
    h.label(String(i), gx - 14, gy + i * (cell - 6) + (cell - 6) / 2, i === k ? "active" : [190, 198, 192], 11);
    for (let j = 0; j < n; j++) {
      const x = gx + j * cell;
      const y = gy + i * (cell - 6);
      const v = step.dist[i][j];
      let bg = [51, 68, 61];
      if (k != null && (i === k || j === k)) bg = [92, 84, 50];
      if (step.cell && step.cell[0] === i && step.cell[1] === j) bg = [127, 209, 150];
      if (opts.rowDone && opts.rowDone(i)) bg = i === opts.activeRow ? [127, 209, 150] : bg;
      P.push();
      P.noStroke();
      P.fill(...bg);
      P.rect(x + 1, y + 1, cell - 2, cell - 8, 4);
      P.pop();
      const isCell = step.cell && step.cell[0] === i && step.cell[1] === j;
      h.label(v == null ? "" : fmt(v), x + cell / 2, y + (cell - 6) / 2, isCell ? [29, 35, 32] : v === INF ? "dim" : v < 0 ? [255, 190, 175] : "white", n > 6 ? 11 : 12);
    }
  }
}

/* ================================================================== */
/*  Johnson                                                            */
/* ================================================================== */

export const JOHNSON_CODE = [
  "add a new vertex q with a 0-weight edge to every vertex",
  "h ← Bellman-Ford distances from q",
  "if Bellman-Ford finds a negative cycle: stop",
  "reweight every edge: w'(u, v) ← w(u, v) + h[u] − h[v]   // never negative",
  "for each vertex s: run Dijkstra from s using w'",
  "  dist(s, v) ← dist'(s, v) − h[s] + h[v]       // undo the shift",
];

export function johnsonSteps(matrix, { directed = true }) {
  const n = matrix.length;
  const E = arcs(matrix, directed);
  const h = Array(n).fill(0); // q reaches everything with weight 0
  const W = matrix.map((r) => [...r]);
  if (!directed) for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) if (matrix[v][u] && !W[u][v]) W[u][v] = matrix[v][u];
  const result = Array.from({ length: n }, () => Array(n).fill(null));
  const stats = { phase: 1, dijkstra: 0 };
  const steps = [];
  let shown = W.map((r) => [...r]);
  const snap = (x = {}) => ({
    h: [...h],
    dist: result.map((r) => [...r]),
    weights: shown.map((r) => [...r]),
    nodeLabel: h.map((v) => `h = ${fmt(v)}`),
    nodeLabelColor: h.map(() => "blue"),
    lines: [],
    ...x,
    stats: { ...stats },
  });

  steps.push(snap({ lines: [0], hint: "q → every vertex with weight 0, so h starts at 0 everywhere", slow: true }));
  // phase 1: Bellman-Ford from q (only improvements are shown)
  // with q there are V + 1 vertices, so V passes always suffice; a change in
  // pass V + 1 means a negative cycle
  let changed = true;
  for (let pass = 1; pass <= n + 1 && changed; pass++) {
    changed = false;
    for (const [u, v, w] of E) {
      if (h[u] + w < h[v]) {
        if (pass === n + 1) {
          steps.push(snap({ lines: [2], focus: [u, v], focusColor: "bad", hint: `edge ${u} → ${v} still improves after ${n} passes` }));
          steps.push(snap({ lines: [2], done: true, miss: true, result: "Negative cycle: Johnson's algorithm stops here." }));
          return steps;
        }
        h[v] = h[u] + w;
        changed = true;
        steps.push(snap({ lines: [1], focus: [u, v], focusColor: "good", current: v, hint: `Bellman-Ford pass ${pass}: h[${v}] ← h[${u}] + (${w}) = ${fmt(h[v])}` }));
      }
    }
  }
  steps.push(snap({ lines: [1, 2], hint: "h is final and there is no negative cycle", slow: true }));

  // phase 2: reweight
  stats.phase = 2;
  for (const [u, v, w] of edgeList(matrix, directed)) {
    const nw = w + h[u] - h[v];
    shown[u][v] = nw;
    if (!directed) shown[v][u] = w + h[v] - h[u];
    steps.push(
      snap({
        lines: [3],
        focus: [u, v],
        focusColor: "check",
        hint: `w'(${u},${v}) = ${w} + ${fmt(h[u])} − ${fmt(h[v])} = ${fmt(nw)}`,
      })
    );
  }
  steps.push(snap({ lines: [3], hint: "every reweighted edge is ≥ 0, so Dijkstra is safe now", slow: true }));

  // phase 3: Dijkstra from every vertex on w'
  stats.phase = 3;
  const Wp = shown;
  for (let s = 0; s < n; s++) {
    const dist = Array(n).fill(INF);
    const prev = Array(n).fill(-1);
    const done = Array(n).fill(false);
    dist[s] = 0;
    for (;;) {
      let u = -1;
      for (let v = 0; v < n; v++) if (!done[v] && dist[v] < INF && (u === -1 || dist[v] < dist[u])) u = v;
      if (u === -1) break;
      done[u] = true;
      for (let v = 0; v < n; v++) {
        if (v === u || !W[u][v]) continue;
        if (dist[u] + Wp[u][v] < dist[v]) {
          dist[v] = dist[u] + Wp[u][v];
          prev[v] = u;
        }
      }
    }
    for (let v = 0; v < n; v++) result[s][v] = dist[v] === INF ? INF : dist[v] - h[s] + h[v];
    stats.dijkstra++;
    steps.push(
      snap({
        lines: [4, 5],
        current: s,
        activeRow: s,
        nodeColor: dist.map((x, v) => (v === s ? "active" : x < INF ? "good" : "white")),
        edgeColor: treeColors(prev, directed),
        hint: `Dijkstra from ${s} on w', then shift back: row ${s} of the answer`,
        slow: true,
      })
    );
  }
  steps.push(snap({ done: true, result: `All ${n}×${n} shortest distances found with ${n} Dijkstra runs` }));
  return steps;
}

function johnsonSide(h, step, ctx) {
  const { SIDE, P } = h;
  const x0 = SIDE.x + 14;
  h.label(`PHASE ${step.stats.phase}   ·   h[v] = shortest distance from q`, x0, SIDE.y + 18, "white", 11, P.LEFT);
  step.h.forEach((v, i) => h.chip(`${i}: ${fmt(v)}`, x0 + 32 + (i % 5) * 72, SIDE.y + 44 + Math.floor(i / 5) * 26, "blue", 64, 22, 12));
  const rowsH = Math.ceil(ctx.n / 5) * 26;
  matrixSide(h, step, ctx.n, {
    top: SIDE.y + 62 + rowsH,
    title: "ANSWER  dist(s, v)",
    rowDone: (i) => i === step.activeRow,
    activeRow: step.activeRow,
  });
}

/* ================================================================== */
/*  Definitions for the board                                          */
/* ================================================================== */

export const SHORTEST_PATH_ALGOS = {
  dijkstra: {
    code: DIJKSTRA_CODE,
    weighted: true,
    directed: false,
    directedToggle: true,
    needsStart: true,
    sample: (directed) => {
      const m = SAMPLE_WEIGHTED();
      if (!directed) return m;
      for (let i = 0; i < m.length; i++) for (let j = 0; j < i; j++) m[i][j] = 0;
      return m;
    },
    random: (n, directed) => randomGraph(n, { directed, weighted: true }),
    run: dijkstraSteps,
    side: (h, step, ctx) => distanceSide(h, step, ctx),
    stats: { finished: "Finished", relaxed: "Updates" },
    legend: [
      { kind: "box-outline", label: "vertex being finished" },
      { kind: "tag", text: "∞ → 7", label: "tentative distance" },
      { kind: "box-good", label: "finished / shortest-path tree" },
    ],
  },
  "bellman-ford": {
    code: BELLMAN_CODE,
    weighted: true,
    negative: true,
    directed: true,
    directedToggle: true,
    needsStart: true,
    sample: () => SAMPLE_NEGATIVE(),
    random: (n, directed) => randomGraph(n, { directed, weighted: true, negative: directed }),
    run: bellmanFordSteps,
    side: bellmanSide,
    stats: { pass: "Pass", relaxed: "Updates" },
    legend: [
      { kind: "box-outline", label: "edge being relaxed" },
      { kind: "box-good", label: "shortest-path tree" },
      { kind: "tag", text: "cycle", label: "negative cycle (red)" },
    ],
  },
  "floyd-warshall": {
    code: FLOYD_CODE,
    weighted: true,
    negative: true,
    directed: true,
    directedToggle: true,
    sample: () => SAMPLE_ALL_PAIRS(),
    random: (n, directed) => randomGraph(Math.min(n, 7), { directed, weighted: true, negative: directed }),
    run: floydSteps,
    side: (h, step, ctx) => matrixSide(h, step, ctx.n),
    stats: { k: "Stop-over k", updates: "Updates" },
    legend: [
      { kind: "tag", text: "k", label: "allowed stop-over" },
      { kind: "box-outline", label: "i and j (blue)" },
      { kind: "box-good", label: "cell just improved" },
    ],
  },
  johnson: {
    code: JOHNSON_CODE,
    weighted: true,
    negative: true,
    directed: true,
    directedToggle: true,
    sample: () => SAMPLE_ALL_PAIRS(),
    random: (n, directed) => randomGraph(Math.min(n, 7), { directed, weighted: true, negative: directed }),
    run: johnsonSteps,
    side: johnsonSide,
    stats: { phase: "Phase", dijkstra: "Dijkstra runs" },
    legend: [
      { kind: "tag", text: "h = −5", label: "potential from Bellman-Ford" },
      { kind: "box-outline", label: "edge being reweighted" },
      { kind: "box-good", label: "Dijkstra tree from s" },
    ],
  },
};
