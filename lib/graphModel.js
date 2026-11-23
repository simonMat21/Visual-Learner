// Graph data helpers shared by the graph pages: edge-list text <-> adjacency
// matrix. No p5 or React here, so it can be reasoned about (and reused) on its own.
//
// Edge-list syntax (accepted in one text box):
//   "0-1, 0-2, 1-3"        unweighted
//   "0->1, 0 -> 2"         arrows are fine too (- -> => → : = space all work)
//   "0-1:4, 2->3:-2"       weight after a colon, may be negative
//   "0-1; 0 2"             commas, semicolons and newlines separate edges, and so
//                          does a space as long as every space separated part
//                          reads as an edge ("0-1 2-3", but "0 1" is one edge)

const EDGE_SPLIT = /[,;\n]+/;
const EDGE_RE = /^\s*([A-Za-z0-9]+)\s*(?:<->|<-->|<->|->|-->|=>|→|➜|-|=|:|\s)\s*(.+?)\s*$/;
const WEIGHT_RE = /^([A-Za-z0-9]+)\s*[:=@]\s*(-?\d+(?:\.\d+)?)$/;

export function isDirectedDash(directed) {
  return directed ? "->" : "-";
}

export function emptyMatrix(size) {
  const matrix = [];
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) matrix[i][j] = 0;
  }
  return matrix;
}

/**
 * Read one edge token, or explain why it is not one.
 * @returns {{edge?:{from:number,to:number,weight:number,raw:string}, error?:string}}
 */
function readEdge(token, weighted) {
  const match = token.match(EDGE_RE);
  if (!match) return { error: `"${token}" is not an edge` };

  let fromRaw = match[1];
  let toRaw = match[2];
  let weight = 1;

  const weightMatch = weighted ? toRaw.match(WEIGHT_RE) : null;
  if (weightMatch) {
    toRaw = weightMatch[1];
    weight = parseFloat(weightMatch[2]);
  } else if (weighted) {
    const stray = toRaw.match(/[:=@]\s*(-?\d+(?:\.\d+)?)\s*$/);
    if (stray) {
      toRaw = toRaw.slice(0, toRaw.length - stray[0].length).trim();
      weight = parseFloat(stray[1]);
    }
  }

  const from = Number(fromRaw);
  const to = Number(toRaw);

  if (!Number.isInteger(from) || from < 0) {
    return { error: `"${fromRaw}" is not a vertex number` };
  }
  if (!Number.isInteger(to) || to < 0) {
    return { error: `"${toRaw}" is not a vertex number` };
  }

  return { edge: { from, to, weight, raw: token } };
}

/**
 * Parse an edge list into edges plus human readable problems.
 * @param {string} text
 * @param {{weighted?: boolean}} [opts]
 * @returns {{edges: {from:number,to:number,weight:number,raw:string}[], errors: string[], maxVertex:number}}
 */
export function parseEdgeList(text, opts = {}) {
  const weighted = !!opts.weighted;
  const edges = [];
  const errors = [];
  let maxVertex = -1;

  const take = (edge) => {
    edges.push(edge);
    maxVertex = Math.max(maxVertex, edge.from, edge.to);
  };

  const tokens = String(text ?? "")
    .split(EDGE_SPLIT)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  tokens.forEach((token) => {
    // "0-1 2-3" is two edges, "0 1" is one, so try the parts before the token.
    const parts = token.split(/\s+/);
    if (parts.length > 1) {
      const read = parts.map((part) => readEdge(part, weighted));
      if (read.every((result) => result.edge)) {
        read.forEach((result) => take(result.edge));
        return;
      }
    }

    const result = readEdge(token, weighted);
    if (result.edge) take(result.edge);
    else errors.push(result.error);
  });

  return { edges, errors, maxVertex };
}

export function formatEdge(edge, opts = {}) {
  const dash = isDirectedDash(opts.directed !== false);
  const label = `${edge.from}${dash}${edge.to}`;
  return opts.weighted ? `${label}:${trimNumber(edge.weight)}` : label;
}

export function trimNumber(value) {
  if (!Number.isFinite(value)) return "0";
  return String(Math.round(value * 1000) / 1000);
}

/**
 * Read the edges out of an adjacency matrix.
 */
export function edgesFromMatrix(matrix, opts = {}) {
  const directed = opts.directed !== false;
  const size = matrix.length;
  const edges = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = matrix[i][j];
      if (value === 0) continue;
      if (!directed && i > j) continue;
      edges.push({ from: i, to: j, weight: value });
    }
  }

  return edges;
}

export function edgeListFromMatrix(matrix, opts = {}) {
  return edgesFromMatrix(matrix, opts).map((e) => formatEdge(e, opts)).join(", ");
}

/**
 * Build a matrix from edges, sized to fit the largest vertex used.
 */
export function matrixFromEdges(edges, opts = {}) {
  const directed = opts.directed !== false;
  const weighted = !!opts.weighted;
  let maxVertex = 0;
  edges.forEach((e) => {
    maxVertex = Math.max(maxVertex, e.from, e.to);
  });

  const size = Math.max(opts.minSize || 1, maxVertex + 1);
  const matrix = emptyMatrix(size);

  edges.forEach((e) => {
    const value = weighted ? e.weight : 1;
    matrix[e.from][e.to] = value;
    if (!directed && e.from !== e.to) matrix[e.to][e.from] = value;
  });

  return matrix;
}

/**
 * Grow or shrink a matrix, keeping the values that still fit.
 */
export function resizeMatrix(matrix, size, weighted) {
  const next = emptyMatrix(size);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i < matrix.length && j < matrix.length) {
        next[i][j] = matrix[i][j];
      }
    }
  }
  if (!weighted) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) next[i][j] = next[i][j] ? 1 : 0;
    }
  }
  return next;
}

export function countEdges(matrix, opts = {}) {
  const directed = opts.directed !== false;
  const size = matrix.length;
  let count = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrix[i][j] === 0) continue;
      if (i === j) count += 1;
      else if (directed || i < j) count += 1;
    }
  }
  return count;
}

export function sumWeights(matrix) {
  let total = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) total += matrix[i][j];
  }
  return Math.round(total * 1000) / 1000;
}

export function degreeOf(matrix, vertex) {
  const size = matrix.length;
  let degree = 0;
  for (let j = 0; j < size; j++) if (matrix[vertex][j] !== 0) degree += 1;
  return degree;
}

/**
 * Random graph matrix. Undirected fills only the upper triangle, so the matrix
 * stays symmetric and every edge is generated once.
 */
export function randomMatrix(size, opts = {}, rand = Math.random) {
  const directed = opts.directed !== false;
  const weighted = !!opts.weighted;
  const density = opts.density ?? 0.3;
  const maxWeight = opts.maxWeight ?? 10;
  const matrix = emptyMatrix(size);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === j && !opts.selfLoops) continue;
      if (!directed && j < i) continue;
      if (rand() >= density) continue;
      const weight = weighted ? Math.floor(rand() * maxWeight) + 1 : 1;
      matrix[i][j] = weight;
      if (!directed && i !== j) matrix[j][i] = weight;
    }
  }

  return matrix;
}

/**
 * Named shapes, so a graph can be typed in one click.
 */
export const PRESETS = [
  { id: "path", label: "Path", build: presetPath },
  { id: "star", label: "Star", build: presetStar },
  { id: "cycle", label: "Cycle", build: presetCycle },
  { id: "complete", label: "Complete", build: presetComplete },
  { id: "empty", label: "Empty", build: () => [] },
];

function pairsOf(size, opts) {
  const directed = opts.directed !== false;
  const edges = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === j) continue;
      if (!directed && j < i) continue;
      edges.push({ from: i, to: j, weight: 1 });
    }
  }
  return edges;
}

function presetPath(size) {
  const edges = [];
  for (let i = 0; i + 1 < size; i++) edges.push({ from: i, to: i + 1, weight: 1 });
  return edges;
}

function presetStar(size) {
  const edges = [];
  for (let j = 1; j < size; j++) edges.push({ from: 0, to: j, weight: 1 });
  return edges;
}

function presetCycle(size) {
  const edges = presetPath(size);
  if (size > 2) edges.push({ from: size - 1, to: 0, weight: 1 });
  return edges;
}

function presetComplete(size, opts) {
  return pairsOf(size, opts);
}
