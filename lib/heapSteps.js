// Binary heap operations (min or max), recorded as steps for the visualizer.
//
// The heap is an array of { id, val }; the id follows a value as it moves, so
// the board can slide it from slot to slot. Each step:
//   { arr, compare: [i, j], swapped: [i, j], focus, found, gone, lines, hint,
//     stats, result, done, extracted, kind }

export const MAX_HEAP = 15;

let nextId = 1;
const item = (val) => ({ id: nextId++, val });

export function heapFrom(vals, type) {
  const r = buildSteps(vals, type);
  return r.heap;
}

export function randomHeap(count, type) {
  const vals = [];
  while (vals.length < count) {
    const v = 1 + Math.floor(Math.random() * 98);
    if (!vals.includes(v)) vals.push(v);
  }
  return heapFrom(vals, type);
}

export const parent = (i) => Math.floor((i - 1) / 2);

/* ------------------------------------------------------------------ */
/*  Pseudocode                                                         */
/* ------------------------------------------------------------------ */

export function heapCode(type) {
  const bad = type === "min" ? ">" : "<";
  const pick = type === "min" ? "smaller" : "larger";
  const ok = type === "min" ? "≤" : "≥";
  return {
    insert: [
      "a.append(v)              // new value goes in the last slot",
      "i ← last index",
      `while i > 0 and a[parent(i)] ${bad} a[i]:   // parent(i) = (i − 1) / 2`,
      "  swap a[i], a[parent(i)]",
      "  i ← parent(i)            // sift up",
    ],
    extract: [
      "top ← a[0]",
      "a[0] ← a[last];  remove the last slot",
      "i ← 0",
      "while i has a child:     // children: 2i + 1, 2i + 2",
      `  c ← the ${pick} child of i`,
      `  if a[i] ${ok} a[c]: stop`,
      "  swap a[i], a[c];  i ← c   // sift down",
      "return top",
    ],
    peek: [`return a[0]   // the ${type === "min" ? "smallest" : "largest"} value is always at the root`],
    build: [
      "a ← the values in the order given",
      "for i ← n/2 − 1 down to 0:   // every node that has a child",
      "  sift a[i] down (as in extract)",
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  Recorder                                                           */
/* ------------------------------------------------------------------ */

function recorder(heap) {
  let arr = heap.map((x) => ({ ...x }));
  const steps = [];
  const stats = { comparisons: 0, swaps: 0 };
  const snap = (step) => ({
    arr: arr.map((x) => ({ ...x })),
    compare: null,
    swapped: null,
    focus: null,
    found: null,
    gone: null,
    lines: [],
    ...step,
    stats: { ...stats, size: arr.length },
  });
  return {
    get arr() {
      return arr;
    },
    set arr(a) {
      arr = a;
    },
    stats,
    push(step) {
      steps.push(snap(step));
    },
    swap(i, j, lines) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      stats.swaps++;
      steps.push(snap({ lines, swapped: [i, j], focus: j, kind: "swap" }));
    },
    finish(result, extra = {}) {
      steps.push(snap({ result, done: true, kind: "done", ...extra }));
      return { heap: arr, steps };
    },
  };
}

const before = (type, a, b) => (type === "min" ? a < b : a > b); // a should sit above b

/** Sift a[i] down within the first n slots, recording steps on `lines`. */
function siftDown(r, type, i, lines) {
  const a = () => r.arr;
  const n = a().length;
  for (;;) {
    const l = 2 * i + 1;
    const rr = 2 * i + 2;
    if (l >= n) {
      r.push({ lines: [lines.loop], focus: i, hint: `index ${i} has no children: done` });
      return i;
    }
    let c = l;
    if (rr < n) {
      r.stats.comparisons++;
      if (before(type, a()[rr].val, a()[l].val)) c = rr;
      r.push({
        lines: [lines.pick],
        compare: [l, rr],
        focus: i,
        hint: `children ${a()[l].val} and ${a()[rr].val}: ${type === "min" ? "smaller" : "larger"} is ${a()[c].val}`,
      });
    } else {
      r.push({ lines: [lines.pick], compare: [l], focus: i, hint: `only child: ${a()[l].val}` });
    }
    r.stats.comparisons++;
    const fine = !before(type, a()[c].val, a()[i].val);
    r.push({
      lines: [lines.check],
      compare: [i, c],
      focus: i,
      hint: fine
        ? `${a()[i].val} ${type === "min" ? "≤" : "≥"} ${a()[c].val}: in order, stop`
        : `${a()[i].val} ${type === "min" ? ">" : "<"} ${a()[c].val}: swap`,
    });
    if (fine) return i;
    r.swap(i, c, [lines.swap]);
    i = c;
  }
}

/* ------------------------------------------------------------------ */
/*  Operations                                                         */
/* ------------------------------------------------------------------ */

export function insertSteps(heap, type, v) {
  const r = recorder(heap);
  if (r.arr.length >= MAX_HEAP) return r.finish(`The board holds ${MAX_HEAP} values at most`, { miss: true });
  const it = item(v);
  r.arr.push(it);
  let i = r.arr.length - 1;
  r.push({ lines: [0], focus: i, found: i, kind: "add" });
  r.push({ lines: [1], focus: i, hint: `i = ${i}` });
  while (i > 0) {
    const p = parent(i);
    r.stats.comparisons++;
    const wrong = before(type, r.arr[i].val, r.arr[p].val);
    r.push({
      lines: [2],
      compare: [p, i],
      focus: i,
      hint: wrong
        ? `parent(${i}) = ${p}: ${r.arr[p].val} ${type === "min" ? ">" : "<"} ${r.arr[i].val}, swap`
        : `parent(${i}) = ${p}: ${r.arr[p].val} ${type === "min" ? "≤" : "≥"} ${r.arr[i].val}, stop`,
    });
    if (!wrong) break;
    r.swap(i, p, [3]);
    i = p;
    r.push({ lines: [4], focus: i, hint: `i = ${i}` });
  }
  const at = r.arr.findIndex((x) => x.id === it.id);
  return r.finish(`Inserted ${v} at index ${at}`, { found: at });
}

export function extractSteps(heap, type) {
  const r = recorder(heap);
  const name = type === "min" ? "minimum" : "maximum";
  if (r.arr.length === 0) return r.finish("The heap is empty", { miss: true });
  const top = r.arr[0];
  r.push({ lines: [0], focus: 0, found: 0, hint: `top = ${top.val}` });
  if (r.arr.length === 1) {
    r.push({ lines: [1], gone: 0, kind: "remove" });
    r.arr = [];
    return r.finish(`Extracted the ${name}: ${top.val}`, { extracted: top.val });
  }
  r.push({ lines: [1], gone: 0, kind: "remove" });
  const last = r.arr.pop();
  r.arr[0] = last;
  r.push({ lines: [1], focus: 0, hint: `${last.val} moved from the last slot to the root`, extracted: top.val, kind: "move" });
  r.push({ lines: [2], focus: 0, extracted: top.val });
  siftDown(r, type, 0, { loop: 3, pick: 4, check: 5, swap: 6 });
  return r.finish(`Extracted the ${name}: ${top.val}`, { extracted: top.val, lines: [7] });
}

export function peekSteps(heap, type) {
  const r = recorder(heap);
  if (r.arr.length === 0) return r.finish("The heap is empty", { miss: true });
  r.push({ lines: [0], focus: 0, found: 0 });
  return r.finish(`The ${type === "min" ? "minimum" : "maximum"} is ${r.arr[0].val} (no changes)`, { found: 0, lines: [0] });
}

export function buildSteps(vals, type) {
  const r = recorder([]);
  r.arr = vals.slice(0, MAX_HEAP).map(item);
  r.push({ lines: [0], kind: "add" });
  for (let i = Math.floor(r.arr.length / 2) - 1; i >= 0; i--) {
    r.push({ lines: [1], focus: i, hint: `i = ${i}` });
    siftDown(r, type, i, { loop: 2, pick: 2, check: 2, swap: 2 });
  }
  const extra = vals.length > MAX_HEAP ? ` (kept the first ${MAX_HEAP})` : "";
  return r.finish(`Built a ${type}-heap from ${r.arr.length} values${extra}`);
}
