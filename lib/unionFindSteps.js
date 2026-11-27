// Disjoint Set Union (union-find) on a parent array, recorded as steps.
// Options: union by rank, path compression (both can be switched off to
// show what goes wrong without them).
//
// Step: { parent, rank, path (ids walked), focus, root, link: [child, parent],
//         compressed (ids re-pointed), lines, hint, stats, result, done, miss }

export const UF_CODE = [
  "find(x):",
  "  if parent[x] == x: return x          // x is the root of its set",
  "  root ← find(parent[x])",
  "  parent[x] ← root                    // path compression",
  "  return root",
  "union(a, b):",
  "  ra ← find(a);  rb ← find(b)",
  "  if ra == rb: they are already in the same set",
  "  if rank[ra] < rank[rb]: swap ra and rb   // union by rank",
  "  parent[rb] ← ra;  if the ranks were equal: rank[ra] ← rank[ra] + 1",
];

export function makeSets(n) {
  return { parent: [...Array(n).keys()], rank: Array(n).fill(0) };
}

export function depthOf(parent, x) {
  let d = 0;
  while (parent[x] !== x && d <= parent.length) {
    x = parent[x];
    d++;
  }
  return d;
}

export function setCount(parent) {
  return parent.filter((p, i) => p === i).length;
}

function recorder(start, opts) {
  const parent = [...start.parent];
  const rank = [...start.rank];
  const steps = [];
  const stats = { hops: 0 };
  const snap = (x = {}) => ({
    parent: [...parent],
    rank: [...rank],
    path: [],
    focus: null,
    lines: [],
    opts,
    ...x,
    stats: { ...stats, sets: setCount(parent), height: Math.max(0, ...parent.map((_, i) => depthOf(parent, i))) },
  });
  return {
    parent,
    rank,
    stats,
    push: (x) => steps.push(snap(x)),
    finish: (result, x = {}) => {
      steps.push(snap({ result, done: true, ...x }));
      return { state: { parent, rank }, steps };
    },
  };
}

/** Walk up from x, recording each hop; then compress if enabled. */
function findWithSteps(r, x, opts, label = "") {
  const path = [x];
  r.push({ lines: [0, 1], focus: x, path: [...path], hint: `${label}find(${x}): is ${x} its own parent?` });
  let cur = x;
  while (r.parent[cur] !== cur) {
    const up = r.parent[cur];
    r.stats.hops++;
    path.push(up);
    r.push({ lines: [2], focus: up, path: [...path], hint: `parent[${cur}] = ${up}: keep climbing` });
    cur = up;
  }
  const root = cur;
  r.push({ lines: [1, 4], focus: root, root, path: [...path], hint: `${root} is its own parent: it is the root` });
  if (opts.compress) {
    const moved = path.filter((v) => v !== root && r.parent[v] !== root);
    if (moved.length) {
      moved.forEach((v) => (r.parent[v] = root));
      r.push({
        lines: [3],
        focus: root,
        root,
        compressed: moved,
        path: [...path],
        hint: `path compression: ${moved.join(", ")} now point straight at ${root}`,
        slow: true,
      });
    }
  }
  return root;
}

export function findSteps(state, x, opts) {
  const r = recorder(state, opts);
  const root = findWithSteps(r, x, opts);
  return r.finish(`find(${x}) = ${root}`, { root, focus: root });
}

export function unionSteps(state, a, b, opts) {
  const r = recorder(state, opts);
  r.push({ lines: [5, 6], hint: `union(${a}, ${b}): first find both roots` });
  let ra = findWithSteps(r, a, opts, "");
  let rb = findWithSteps(r, b, opts, "");
  if (ra === rb) {
    r.push({ lines: [7], focus: ra, root: ra, hint: `both roots are ${ra}` });
    return r.finish(`${a} and ${b} are already in the same set`, { miss: true, root: ra });
  }
  if (opts.byRank) {
    if (r.rank[ra] < r.rank[rb]) {
      [ra, rb] = [rb, ra];
      r.push({ lines: [8], focus: ra, hint: `rank[${rb}] < rank[${ra}]: hang the shorter tree (${rb}) under the taller one` });
    } else {
      r.push({ lines: [8], focus: ra, hint: `rank[${ra}] = ${r.rank[ra]} ≥ rank[${rb}] = ${r.rank[rb]}: ${rb} goes under ${ra}` });
    }
  } else {
    r.push({ lines: [8], focus: ra, hint: `union by rank is off: always put ${rb} under ${ra}` });
  }
  const equal = r.rank[ra] === r.rank[rb];
  r.parent[rb] = ra;
  if (opts.byRank && equal) r.rank[ra]++;
  r.push({ lines: [9], focus: rb, link: [rb, ra], hint: `parent[${rb}] = ${ra}${opts.byRank && equal ? `, rank[${ra}] becomes ${r.rank[ra]}` : ""}`, slow: true });
  return r.finish(`Joined the sets of ${a} and ${b} (root ${ra})`, { root: ra });
}

export function connectedSteps(state, a, b, opts) {
  const r = recorder(state, opts);
  r.push({ lines: [5, 6], hint: `are ${a} and ${b} in the same set? compare their roots` });
  const ra = findWithSteps(r, a, opts);
  const rb = findWithSteps(r, b, opts);
  return r.finish(
    ra === rb ? `Yes: ${a} and ${b} share the root ${ra}` : `No: ${a} is in set ${ra}, ${b} is in set ${rb}`,
    { miss: ra !== rb, root: ra }
  );
}

/** A few random unions done silently, to get an interesting forest. */
export function randomForest(n, count, opts) {
  let state = makeSets(n);
  for (let k = 0; k < count; k++) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    state = unionSteps(state, a, b, opts).state;
  }
  return state;
}

/** A worst case chain (unions without rank), to show why the tricks matter. */
export function chainForest(n) {
  const parent = [...Array(n).keys()];
  for (let i = 1; i < n; i++) parent[i - 1] = i;
  const rank = Array(n).fill(0);
  rank[n - 1] = n - 1; // rank is an upper bound on height
  return { parent, rank };
}
