// Borůvka's MST, connected components, strongly connected components
// (Kosaraju, Tarjan) and topological sorting (Kahn).

import {
  SAMPLE_DAG,
  SAMPLE_PIECES,
  SAMPLE_SCC,
  SAMPLE_WEIGHTED,
  edgeList,
  ekey,
  randomDag,
  randomGraph,
  randomPieces,
  randomScc,
} from "./common";

const neighbours = (m, u) => {
  const out = [];
  for (let v = 0; v < m.length; v++) if (v !== u && m[u][v]) out.push(v);
  return out;
};
const reversedNeighbours = (m, u) => {
  const out = [];
  for (let v = 0; v < m.length; v++) if (v !== u && m[v][u]) out.push(v);
  return out;
};

function chipRow(h, items, x0, y, fill, w = 30, gap = 6) {
  items.forEach((t, i) => h.chip(t, x0 + w / 2 + i * (w + gap), y, typeof fill === "function" ? fill(t, i) : fill, w));
}

function groupsSide(h, groups, x0, y, title, colorFor) {
  h.label(title, x0, y, "white", 11, h.P.LEFT);
  groups.forEach((g, i) => {
    const yy = y + 24 + i * 28;
    if (yy > h.SIDE.y + h.SIDE.h - 10) return;
    h.chip(`{ ${g.members.join(", ")} }`, x0 + 6 + (g.members.length * 22 + 30) / 2, yy, colorFor(g, i), g.members.length * 22 + 30, 22, 12);
    if (g.note) h.label(g.note, x0 + g.members.length * 22 + 48, yy, "dim", 11, h.P.LEFT, false);
  });
}

/* ================================================================== */
/*  Borůvka                                                            */
/* ================================================================== */

export const BORUVKA_CODE = [
  "every vertex starts as its own component",
  "while more than one component is left:",
  "  for each component C:",
  "    find the cheapest edge leaving C",
  "  add all those edges to the MST (skip one if its ends are already joined)",
  "  merge the components they connect",
];

export function boruvkaSteps(matrix) {
  const n = matrix.length;
  const parent = [...Array(n).keys()];
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent[Math.max(ra, rb)] = Math.min(ra, rb); // smaller id stays the name, so colours stay put
    return true;
  };
  const edges = edgeList(matrix, false);
  const better = (a, b) =>
    !b || a[2] < b[2] || (a[2] === b[2] && (Math.min(a[0], a[1]) < Math.min(b[0], b[1]) || (Math.min(a[0], a[1]) === Math.min(b[0], b[1]) && Math.max(a[0], a[1]) < Math.max(b[0], b[1]))));
  const mst = new Set();
  let total = 0;
  const stats = { round: 0, components: n };
  const steps = [];
  const comps = () => {
    const g = {};
    for (let v = 0; v < n; v++) (g[find(v)] = g[find(v)] || []).push(v);
    return Object.entries(g).map(([root, members]) => ({ root: Number(root), members }));
  };
  const snap = (x = {}) => {
    const ec = {};
    mst.forEach((k) => (ec[k] = "good"));
    (x.chosen || []).forEach((e) => {
      const k = ekey(e[0], e[1], false);
      if (!mst.has(k)) ec[k] = "active";
    });
    return {
      groups: comps(),
      mstList: [...mst],
      total,
      nodeColor: Array.from({ length: n }, (_, v) => `set:${find(v)}`),
      edgeColor: ec,
      lines: [],
      ...x,
      stats: { ...stats, components: comps().length },
    };
  };

  steps.push(snap({ lines: [0], hint: "every vertex is a component of its own" }));
  for (let round = 1; comps().length > 1; round++) {
    stats.round = round;
    steps.push(snap({ lines: [1], hint: `round ${round}: ${comps().length} components`, slow: true }));
    const chosen = [];
    for (const c of comps()) {
      let best = null;
      for (const e of edges) {
        const inside = find(e[0]) === c.root;
        const other = find(e[1]) === c.root;
        if (inside !== other && better(e, best)) best = e;
      }
      if (best) {
        chosen.push(best);
        steps.push(
          snap({
            lines: [2, 3],
            chosen,
            focus: [best[0], best[1]],
            focusColor: "active",
            hint: `cheapest edge leaving {${c.members.join(", ")}}: ${best[0]}–${best[1]} (${best[2]})`,
          })
        );
      } else {
        steps.push(snap({ lines: [2, 3], chosen, hint: `nothing leaves {${c.members.join(", ")}}`, fast: true }));
      }
    }
    if (!chosen.length) break;
    let added = 0;
    for (const e of chosen) {
      const k = ekey(e[0], e[1], false);
      if (mst.has(k)) continue;
      if (union(e[0], e[1])) {
        mst.add(k);
        total += e[2];
        added++;
        steps.push(snap({ lines: [4, 5], chosen, focus: [e[0], e[1]], focusColor: "good", hint: `add ${e[0]}–${e[1]} (${e[2]}) and merge the two components` }));
      } else {
        steps.push(snap({ lines: [4], chosen, focus: [e[0], e[1]], focusColor: "bad", focusDash: true, hint: `${e[0]} and ${e[1]} were already joined this round: skip` }));
      }
    }
    if (!added) break;
  }
  const left = comps().length;
  steps.push(
    snap({
      done: true,
      result:
        left === 1
          ? `Minimum spanning tree found: total weight ${total} in ${stats.round} round${stats.round === 1 ? "" : "s"}`
          : `The graph is disconnected: a minimum spanning forest of ${left} trees, weight ${total}`,
    })
  );
  return steps;
}

function boruvkaSide(h, step) {
  const { SIDE } = h;
  const x0 = SIDE.x + 14;
  groupsSide(h, step.groups, x0, SIDE.y + 18, "COMPONENTS", (g) => `set:${g.root}`);
  const y = SIDE.y + 48 + Math.min(step.groups.length, 7) * 28;
  h.label(`MST EDGES   total weight ${step.total}`, x0, y, "white", 11, h.P.LEFT);
  step.mstList.forEach((k, i) => h.chip(k.replace("-", "–"), x0 + 26 + (i % 6) * 58, y + 26 + Math.floor(i / 6) * 28, "good", 50, 22, 12));
}

/* ================================================================== */
/*  Connected components                                               */
/* ================================================================== */

export const COMPONENTS_CODE = [
  "comp ← 0;  label[v] ← none for every vertex",
  "for each vertex s:",
  "  if label[s] is none:",
  "    comp ← comp + 1",
  "    flood fill from s (DFS): label[v] ← comp for every vertex reached",
  "// vertices with the same label are connected to each other",
];

export function componentsSteps(matrix) {
  const n = matrix.length;
  const label = Array(n).fill(-1);
  let comp = 0;
  const stats = { components: 0, labelled: 0 };
  const steps = [];
  const snap = (x = {}) => {
    const ec = {};
    edgeList(matrix, false).forEach(([u, v]) => {
      if (label[u] >= 0 && label[u] === label[v]) ec[ekey(u, v, false)] = `set:${label[u]}`;
    });
    const groups = [];
    for (let c = 0; c < comp; c++) groups.push({ root: c, members: label.map((l, v) => (l === c ? v : -1)).filter((v) => v >= 0) });
    return {
      label: [...label],
      groups,
      nodeColor: label.map((l) => (l >= 0 ? `set:${l}` : "white")),
      nodeLabel: label.map((l) => (l >= 0 ? `#${l + 1}` : null)),
      edgeColor: ec,
      lines: [],
      ...x,
      stats: { ...stats },
    };
  };
  steps.push(snap({ lines: [0], hint: "no vertex has a label yet" }));
  for (let s = 0; s < n; s++) {
    if (label[s] >= 0) {
      steps.push(snap({ lines: [1, 2], current: s, fast: true, hint: `${s} already belongs to component #${label[s] + 1}` }));
      continue;
    }
    const c = comp++;
    stats.components = comp;
    label[s] = c;
    stats.labelled++;
    steps.push(snap({ lines: [2, 3], current: s, slow: true, hint: `${s} has no label: start component #${c + 1} here` }));
    const stack = [s];
    while (stack.length) {
      const u = stack.pop();
      for (const v of neighbours(matrix, u).reverse()) {
        if (label[v] >= 0) continue;
        label[v] = c;
        stats.labelled++;
        stack.push(v);
        steps.push(snap({ lines: [4], current: v, focus: [u, v], focusColor: `set:${c}`, hint: `${v} is reachable from ${s}: label it #${c + 1}` }));
      }
    }
  }
  steps.push(snap({ lines: [5], done: true, result: `${comp} connected component${comp === 1 ? "" : "s"}` }));
  return steps;
}

function componentsSide(h, step) {
  const { SIDE } = h;
  const x0 = SIDE.x + 14;
  groupsSide(h, step.groups, x0, SIDE.y + 18, "COMPONENTS FOUND", (g) => `set:${g.root}`);
  const y = SIDE.y + 60 + Math.max(1, step.groups.length) * 28;
  h.label("label[v]", x0, y, "white", 11, h.P.LEFT);
  step.label.forEach((l, v) => {
    const x = x0 + 22 + v * 44;
    h.label(String(v), x, y + 22, "dim", 11);
    h.chip(l >= 0 ? `#${l + 1}` : "–", x, y + 44, l >= 0 ? `set:${l}` : [196, 204, 198], 38, 22, 12);
  });
}

/* ================================================================== */
/*  Kosaraju                                                           */
/* ================================================================== */

export const KOSARAJU_CODE = [
  "// pass 1: DFS on the original graph",
  "for each vertex v that is not visited: dfs1(v)",
  "  dfs1(u): visit u, call dfs1 on unvisited out-neighbours, then push u on a stack",
  "// pass 2: reverse every edge",
  "while the stack is not empty:  v ← pop",
  "  if v has no component yet: dfs2(v) on the reversed graph",
  "    every vertex dfs2 reaches is one strongly connected component",
];

export function kosarajuSteps(matrix) {
  const n = matrix.length;
  const visited = Array(n).fill(false);
  const finished = Array(n).fill(false);
  const stack = [];
  const comp = Array(n).fill(-1);
  let count = 0;
  let pass = 1;
  const stats = { pass: 1, sccs: 0 };
  const steps = [];
  const snap = (x = {}) => {
    const ec = {};
    if (pass === 2)
      edgeList(matrix, true).forEach(([u, v]) => {
        if (comp[u] >= 0 && comp[u] === comp[v]) ec[ekey(v, u, true)] = `set:${comp[u]}`;
      });
    const groups = [];
    for (let c = 0; c < count; c++) groups.push({ root: c, members: comp.map((l, v) => (l === c ? v : -1)).filter((v) => v >= 0) });
    return {
      stack: [...stack],
      groups,
      reverse: pass === 2,
      nodeColor: Array.from({ length: n }, (_, v) =>
        pass === 2 ? (comp[v] >= 0 ? `set:${comp[v]}` : "white") : finished[v] ? "frontier" : visited[v] ? "blue" : "white"
      ),
      edgeColor: ec,
      lines: [],
      ...x,
      stats: { ...stats },
    };
  };

  const dfs1 = (u) => {
    visited[u] = true;
    steps.push(snap({ lines: [1, 2], current: u, hint: `dfs1(${u})` }));
    for (const v of neighbours(matrix, u)) {
      if (visited[v]) continue;
      steps.push(snap({ lines: [2], current: u, focus: [u, v], focusColor: "active", fast: true, hint: `${u} → ${v}: go deeper` }));
      dfs1(v);
    }
    finished[u] = true;
    stack.push(u);
    steps.push(snap({ lines: [2], current: u, hint: `${u} is finished: push it on the stack` }));
  };

  steps.push(snap({ lines: [0], hint: "pass 1 records the order in which vertices finish" }));
  for (let v = 0; v < n; v++) if (!visited[v]) dfs1(v);

  pass = 2;
  stats.pass = 2;
  steps.push(snap({ lines: [3], slow: true, hint: "pass 2: reverse every edge and pop vertices off the stack" }));
  while (stack.length) {
    const v = stack.pop();
    if (comp[v] >= 0) {
      steps.push(snap({ lines: [4, 5], current: v, fast: true, hint: `pop ${v}: it already has a component` }));
      continue;
    }
    const c = count++;
    stats.sccs = count;
    comp[v] = c;
    steps.push(snap({ lines: [4, 5], current: v, slow: true, hint: `pop ${v}: start strongly connected component #${c + 1}` }));
    const todo = [v];
    while (todo.length) {
      const u = todo.pop();
      for (const w of reversedNeighbours(matrix, u)) {
        if (comp[w] >= 0) continue;
        comp[w] = c;
        todo.push(w);
        steps.push(snap({ lines: [6], current: w, focus: [u, w], focusColor: `set:${c}`, hint: `reversed edge ${u} → ${w}: ${w} joins #${c + 1}` }));
      }
    }
  }
  steps.push(snap({ done: true, result: `${count} strongly connected component${count === 1 ? "" : "s"}` }));
  return steps;
}

function kosarajuSide(h, step) {
  const { SIDE } = h;
  const x0 = SIDE.x + 14;
  h.label(`PASS ${step.stats.pass}   ·   FINISH STACK (top on the right)`, x0, SIDE.y + 18, "white", 11, h.P.LEFT);
  if (!step.stack.length) h.label("empty", x0, SIDE.y + 46, "dim", 12, h.P.LEFT, false);
  chipRow(h, step.stack, x0, SIDE.y + 46, (t, i) => (i === step.stack.length - 1 ? "active" : "frontier"), 34);
  groupsSide(h, step.groups, x0, SIDE.y + 90, "STRONGLY CONNECTED COMPONENTS", (g) => `set:${g.root}`);
}

/* ================================================================== */
/*  Tarjan                                                             */
/* ================================================================== */

export const TARJAN_CODE = [
  "tarjan(u):",
  "  index[u] ← low[u] ← counter;  counter ← counter + 1;  push u",
  "  for each edge u → v:",
  "    if v has no index: tarjan(v);  low[u] ← min(low[u], low[v])",
  "    else if v is on the stack: low[u] ← min(low[u], index[v])",
  "  if low[u] == index[u]:          // u is the root of a component",
  "    pop the stack down to u: those vertices form one SCC",
];

export function tarjanSteps(matrix) {
  const n = matrix.length;
  const index = Array(n).fill(null);
  const low = Array(n).fill(null);
  const on = Array(n).fill(false);
  const comp = Array(n).fill(-1);
  const stack = [];
  let counter = 0;
  let count = 0;
  const stats = { visited: 0, sccs: 0 };
  const steps = [];
  const snap = (x = {}) => {
    const ec = {};
    edgeList(matrix, true).forEach(([u, v]) => {
      if (comp[u] >= 0 && comp[u] === comp[v]) ec[ekey(u, v, true)] = `set:${comp[u]}`;
    });
    const groups = [];
    for (let c = 0; c < count; c++) groups.push({ root: c, members: comp.map((l, v) => (l === c ? v : -1)).filter((v) => v >= 0) });
    return {
      index: [...index],
      low: [...low],
      on: [...on],
      stack: [...stack],
      groups,
      nodeColor: Array.from({ length: n }, (_, v) => (comp[v] >= 0 ? `set:${comp[v]}` : on[v] ? "blue" : "white")),
      nodeLabel: Array.from({ length: n }, (_, v) => (index[v] == null ? null : `${index[v]}/${low[v]}`)),
      edgeColor: ec,
      lines: [],
      ...x,
      stats: { ...stats },
    };
  };

  const visit = (u) => {
    index[u] = low[u] = counter++;
    stack.push(u);
    on[u] = true;
    stats.visited++;
    steps.push(snap({ lines: [0, 1], current: u, hint: `index[${u}] = low[${u}] = ${index[u]}; push ${u}` }));
    for (const v of neighbours(matrix, u)) {
      if (index[v] == null) {
        steps.push(snap({ lines: [3], current: u, focus: [u, v], focusColor: "active", fast: true, hint: `${v} has no index yet: tarjan(${v})` }));
        visit(v);
        const before = low[u];
        low[u] = Math.min(low[u], low[v]);
        steps.push(
          snap({
            lines: [3],
            current: u,
            focus: [u, v],
            focusColor: "check",
            hint: `back in ${u}: low[${u}] = min(${before}, low[${v}] = ${low[v]}) = ${low[u]}`,
          })
        );
      } else if (on[v]) {
        const before = low[u];
        low[u] = Math.min(low[u], index[v]);
        steps.push(
          snap({
            lines: [4],
            current: u,
            focus: [u, v],
            focusColor: "check",
            hint: `${v} is on the stack: low[${u}] = min(${before}, index[${v}] = ${index[v]}) = ${low[u]}`,
          })
        );
      } else {
        steps.push(snap({ lines: [2], current: u, focus: [u, v], focusColor: "dim", focusDash: true, fast: true, hint: `${v} is already in a finished component: ignore` }));
      }
    }
    if (low[u] === index[u]) {
      const c = count++;
      stats.sccs = count;
      const members = [];
      let w;
      do {
        w = stack.pop();
        on[w] = false;
        comp[w] = c;
        members.push(w);
      } while (w !== u);
      steps.push(snap({ lines: [5, 6], current: u, slow: true, hint: `low[${u}] == index[${u}]: pop ${members.join(", ")} as one component` }));
    } else {
      steps.push(snap({ lines: [5], current: u, fast: true, hint: `low[${u}] = ${low[u]} < index[${u}] = ${index[u]}: ${u} stays on the stack` }));
    }
  };

  for (let v = 0; v < n; v++) if (index[v] == null) visit(v);
  steps.push(snap({ done: true, result: `${count} strongly connected component${count === 1 ? "" : "s"}` }));
  return steps;
}

function tarjanSide(h, step, ctx) {
  const { SIDE } = h;
  const x0 = SIDE.x + 14;
  const cols = [
    { title: "vertex", x: x0 + 26 },
    { title: "index", x: x0 + 96 },
    { title: "low", x: x0 + 160 },
    { title: "on stack", x: x0 + 240 },
  ];
  const rows = step.index.map((ix, v) => [
    String(v),
    ix == null ? "–" : String(ix),
    { t: step.low[v] == null ? "–" : String(step.low[v]), c: "active", b: true },
    { t: step.on[v] ? "✔" : "–", c: step.on[v] ? "blue" : "dim" },
  ]);
  const pitch = Math.min(22, 176 / Math.max(1, ctx.n));
  h.table({ y: SIDE.y + 18, cols, rows, pitch, highlight: step.current ?? -1 });
  const y = SIDE.y + 48 + ctx.n * pitch;
  h.label("STACK (top on the right)", x0, y, "white", 11, h.P.LEFT);
  if (!step.stack.length) h.label("empty", x0, y + 26, "dim", 12, h.P.LEFT, false);
  chipRow(h, step.stack, x0, y + 26, "blue", 34);
  groupsSide(h, step.groups, x0, y + 56, "COMPONENTS", (g) => `set:${g.root}`);
}

/* ================================================================== */
/*  Topological sort (Kahn)                                            */
/* ================================================================== */

export const TOPO_CODE = [
  "indeg[v] ← number of edges coming into v",
  "queue ← every vertex with indeg 0",
  "while the queue is not empty:",
  "  u ← dequeue;  append u to the order",
  "  for each edge u → v:",
  "    indeg[v] ← indeg[v] − 1;  if it is now 0: enqueue v",
  "if the order has fewer than V vertices: the graph has a cycle",
];

export function topoSteps(matrix) {
  const n = matrix.length;
  const indeg = Array(n).fill(0);
  edgeList(matrix, true).forEach(([, v]) => indeg[v]++);
  const queue = [];
  const order = [];
  const used = new Set();
  const stats = { placed: 0, edgesRemoved: 0 };
  const steps = [];
  const snap = (x = {}) => {
    const ec = {};
    used.forEach((k) => (ec[k] = "dim"));
    return {
      indeg: [...indeg],
      queue: [...queue],
      order: [...order],
      nodeColor: Array.from({ length: n }, (_, v) => (order.includes(v) ? "good" : queue.includes(v) ? "frontier" : x.cycle && x.cycle.includes(v) ? "bad" : "white")),
      nodeLabel: indeg.map((d, v) => (order.includes(v) ? null : `in ${d}`)),
      edgeColor: ec,
      lines: [],
      ...x,
      stats: { ...stats },
    };
  };
  steps.push(snap({ lines: [0], hint: "count the incoming edges of every vertex" }));
  for (let v = 0; v < n; v++) if (indeg[v] === 0) queue.push(v);
  steps.push(snap({ lines: [1], slow: true, hint: queue.length ? `nothing has to come before ${queue.join(", ")}` : "no vertex has in-degree 0" }));
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    stats.placed++;
    steps.push(snap({ lines: [2, 3], current: u, hint: `take ${u}: it is next in the order` }));
    for (let v = 0; v < n; v++) {
      if (v === u || !matrix[u][v]) continue;
      indeg[v]--;
      used.add(ekey(u, v, true));
      stats.edgesRemoved++;
      if (indeg[v] === 0) {
        queue.push(v);
        steps.push(snap({ lines: [4, 5], current: u, focus: [u, v], focusColor: "good", hint: `remove ${u} → ${v}: indeg[${v}] is now 0, enqueue it` }));
      } else {
        steps.push(snap({ lines: [4, 5], current: u, focus: [u, v], focusColor: "check", fast: true, hint: `remove ${u} → ${v}: indeg[${v}] is now ${indeg[v]}` }));
      }
    }
  }
  if (order.length < n) {
    const cycle = [...Array(n).keys()].filter((v) => !order.includes(v));
    steps.push(snap({ lines: [6], done: true, miss: true, cycle, result: `There is a cycle among ${cycle.join(", ")}: no topological order exists` }));
  } else {
    steps.push(snap({ lines: [6], done: true, result: `Topological order: ${order.join(", ")}` }));
  }
  return steps;
}

function topoSide(h, step) {
  const { SIDE } = h;
  const x0 = SIDE.x + 14;
  h.label("QUEUE   (in-degree 0, waiting)", x0, SIDE.y + 18, "white", 11, h.P.LEFT);
  if (!step.queue.length) h.label("empty", x0, SIDE.y + 46, "dim", 12, h.P.LEFT, false);
  chipRow(h, step.queue, x0, SIDE.y + 46, "frontier", 34);
  h.label("TOPOLOGICAL ORDER", x0, SIDE.y + 84, "white", 11, h.P.LEFT);
  chipRow(h, step.order, x0, SIDE.y + 112, "good", 34);
  h.label("indeg[v]", x0, SIDE.y + 152, "white", 11, h.P.LEFT);
  step.indeg.forEach((d, v) => {
    const x = x0 + 22 + v * 44;
    h.label(String(v), x, SIDE.y + 176, "dim", 11);
    const placed = step.order.includes(v);
    h.chip(placed ? "✔" : String(d), x, SIDE.y + 200, placed ? "good" : d === 0 ? "frontier" : [196, 204, 198], 38, 22, 12);
  });
  if (step.cycle) h.label(`cycle: ${step.cycle.join(", ")} can never reach in-degree 0`, x0, SIDE.y + 240, "bad", 12, h.P.LEFT);
}

/* ================================================================== */
/*  Definitions                                                        */
/* ================================================================== */

export const STRUCTURE_ALGOS = {
  boruvka: {
    code: BORUVKA_CODE,
    weighted: true,
    directed: false,
    sample: () => SAMPLE_WEIGHTED(),
    random: (n) => randomGraph(n, { weighted: true }),
    run: (m) => boruvkaSteps(m),
    side: boruvkaSide,
    stats: { round: "Round", components: "Components" },
    legend: [
      { kind: "tag", text: "colour", label: "one component" },
      { kind: "box-outline", label: "cheapest edge leaving a component" },
      { kind: "box-good", label: "in the MST" },
    ],
  },
  components: {
    code: COMPONENTS_CODE,
    directed: false,
    sample: () => SAMPLE_PIECES(),
    random: (n) => randomPieces(n),
    run: (m) => componentsSteps(m),
    side: componentsSide,
    stats: { components: "Components", labelled: "Labelled" },
    legend: [
      { kind: "box-outline", label: "vertex just reached" },
      { kind: "tag", text: "#2", label: "component number" },
    ],
  },
  kosaraju: {
    code: KOSARAJU_CODE,
    directed: true,
    sample: () => SAMPLE_SCC(),
    random: (n) => randomScc(n),
    run: (m) => kosarajuSteps(m),
    side: kosarajuSide,
    stats: { pass: "Pass", sccs: "Components" },
    legend: [
      { kind: "tag", text: "stack", label: "finished in pass 1 (yellow)" },
      { kind: "box-outline", label: "being explored" },
      { kind: "tag", text: "colour", label: "one strongly connected component" },
    ],
  },
  tarjan: {
    code: TARJAN_CODE,
    directed: true,
    sample: () => SAMPLE_SCC(),
    random: (n) => randomScc(n),
    run: (m) => tarjanSteps(m),
    side: tarjanSide,
    stats: { visited: "Visited", sccs: "Components" },
    legend: [
      { kind: "tag", text: "3/1", label: "index / low-link" },
      { kind: "tag", text: "stack", label: "on the stack (blue)" },
      { kind: "tag", text: "colour", label: "one strongly connected component" },
    ],
  },
  topo: {
    code: TOPO_CODE,
    directed: true,
    sample: () => SAMPLE_DAG(),
    random: (n) => randomDag(n),
    run: (m) => topoSteps(m),
    side: topoSide,
    stats: { placed: "Placed", edgesRemoved: "Edges removed" },
    legend: [
      { kind: "tag", text: "in 2", label: "edges still coming in" },
      { kind: "tag", text: "queue", label: "ready (yellow)" },
      { kind: "box-good", label: "placed in the order" },
    ],
  },
};
