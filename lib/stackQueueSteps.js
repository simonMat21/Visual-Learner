// Stack, queue and circular queue on a fixed-size array, recorded as steps.
//
// State: { slots: [{ id, val } | null], cap, top, front, rear, count }
//   stack:    top  = index of the top item (-1 when empty)
//   queue:    front, rear (front = 0, rear = -1 when nothing was added yet);
//             front only moves right, so dequeued slots are wasted
//   circular: front, rear, count; both indexes wrap round with mod cap
//
// Step: { state, focus (slot), hot (pointer name), out (removed {id,val}),
//         lines, hint, stats, result, done, miss, brackets }

let nextId = 1;
const item = (val) => ({ id: nextId++, val });

export const CAPACITY = { stack: 7, queue: 8, circular: 8 };

export function emptyState(kind) {
  const cap = CAPACITY[kind];
  return { slots: Array(cap).fill(null), cap, top: -1, front: 0, rear: kind === "circular" ? cap - 1 : -1, count: 0 };
}

const clone = (s) => ({ ...s, slots: s.slots.map((x) => (x ? { ...x } : null)) });

export function sizeOf(kind, s) {
  if (kind === "stack") return s.top + 1;
  if (kind === "queue") return Math.max(0, s.rear - s.front + 1);
  return s.count;
}

export function randomState(kind, n = 4) {
  let s = emptyState(kind);
  for (let i = 0; i < n; i++) {
    const v = 1 + Math.floor(Math.random() * 98);
    s = (kind === "stack" ? pushSteps(s, v) : enqueueSteps(kind, s, v)).state;
  }
  if (kind === "circular") {
    // start part-way round so the wrap-around is easy to see
    for (let i = 0; i < 3; i++) {
      s = dequeueSteps(kind, s).state;
      s = enqueueSteps(kind, s, 1 + Math.floor(Math.random() * 98)).state;
    }
  }
  return s;
}

/* ------------------------------------------------------------------ */
/*  Pseudocode                                                         */
/* ------------------------------------------------------------------ */

export const SQ_CODE = {
  stack: {
    push: [
      "if top == capacity − 1: overflow (the stack is full)",
      "top ← top + 1",
      "a[top] ← v",
    ],
    pop: [
      "if top == −1: underflow (the stack is empty)",
      "v ← a[top]",
      "top ← top − 1",
      "return v",
    ],
    peek: ["if top == −1: the stack is empty", "return a[top]   // look, don't remove"],
    brackets: [
      "for each character c in the text:",
      "  if c is ( [ or {:  push(c)",
      "  else if c is ) ] or }:",
      "    if the stack is empty: not balanced",
      "    if pop() is not the partner of c: not balanced",
      "balanced only if the stack is empty at the end",
    ],
  },
  queue: {
    enqueue: [
      "if rear == capacity − 1: overflow (no room at the back)",
      "rear ← rear + 1",
      "a[rear] ← v",
    ],
    dequeue: [
      "if front > rear: underflow (the queue is empty)",
      "v ← a[front]",
      "front ← front + 1     // that slot is never used again",
      "return v",
    ],
    peek: ["if front > rear: the queue is empty", "return a[front]"],
  },
  circular: {
    enqueue: [
      "if count == capacity: overflow (the queue is full)",
      "rear ← (rear + 1) mod capacity   // wraps to 0 after the end",
      "a[rear] ← v",
      "count ← count + 1",
    ],
    dequeue: [
      "if count == 0: underflow (the queue is empty)",
      "v ← a[front]",
      "front ← (front + 1) mod capacity",
      "count ← count − 1",
      "return v",
    ],
    peek: ["if count == 0: the queue is empty", "return a[front]"],
  },
};

/* ------------------------------------------------------------------ */
/*  Recorder                                                           */
/* ------------------------------------------------------------------ */

function recorder(kind, start) {
  let state = clone(start);
  const steps = [];
  const stats = {};
  const snap = (step) => {
    const size = sizeOf(kind, state);
    const extra = kind === "queue" ? { wasted: state.front } : {};
    return {
      state: clone(state),
      focus: null,
      hot: null,
      out: null,
      lines: [],
      ...step,
      stats: { ...stats, size, free: kind === "queue" ? state.cap - 1 - state.rear : state.cap - size, ...extra },
    };
  };
  return {
    get state() {
      return state;
    },
    set state(s) {
      state = s;
    },
    push(step) {
      steps.push(snap(step));
    },
    finish(result, extra = {}) {
      steps.push(snap({ result, done: true, ...extra }));
      return { state, steps };
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Stack                                                              */
/* ------------------------------------------------------------------ */

export function pushSteps(start, v) {
  const r = recorder("stack", start);
  const s = r.state;
  r.push({ lines: [0], focus: s.top, hot: "top", hint: `top = ${s.top}, capacity − 1 = ${s.cap - 1}` });
  if (s.top === s.cap - 1) return r.finish(`Stack overflow: it already holds ${s.cap} items`, { miss: true, lines: [0] });
  s.top++;
  r.push({ lines: [1], focus: s.top, hot: "top", hint: `top = ${s.top}` });
  s.slots[s.top] = item(v);
  r.push({ lines: [2], focus: s.top, kind: "add" });
  return r.finish(`Pushed ${v}`, { focus: s.top });
}

export function popSteps(start) {
  const r = recorder("stack", start);
  const s = r.state;
  r.push({ lines: [0], focus: s.top, hot: "top", hint: `top = ${s.top}` });
  if (s.top === -1) return r.finish("Stack underflow: there is nothing to pop", { miss: true, lines: [0] });
  const it = s.slots[s.top];
  r.push({ lines: [1], focus: s.top, hint: `v = ${it.val}` });
  s.slots[s.top] = null;
  s.top--;
  r.push({ lines: [2], focus: s.top, hot: "top", out: it, hint: `top = ${s.top}` });
  return r.finish(`Popped ${it.val}`, { out: it, lines: [3] });
}

export function peekStackSteps(start) {
  const r = recorder("stack", start);
  const s = r.state;
  r.push({ lines: [0], focus: s.top, hot: "top" });
  if (s.top === -1) return r.finish("The stack is empty", { miss: true });
  r.push({ lines: [1], focus: s.top, found: s.top });
  return r.finish(`The top is ${s.slots[s.top].val} (nothing removed)`, { found: s.top, lines: [1] });
}

const OPEN = { "(": ")", "[": "]", "{": "}" };
const CLOSE = { ")": "(", "]": "[", "}": "{" };

/** Check that every bracket in `text` is closed in the right order. */
export function bracketSteps(text) {
  const r = recorder("stack", emptyState("stack"));
  const s = r.state;
  const chars = [...text].slice(0, 24);
  const b = (i, extra = {}) => ({ brackets: { text: chars.join(""), i, ...extra } });
  r.push({ lines: [0], hot: "top", ...b(-1), hint: "start with an empty stack" });
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (OPEN[c]) {
      if (s.top === s.cap - 1) return r.finish(`Too deeply nested for a stack of ${s.cap}`, { miss: true, ...b(i, { bad: true }) });
      s.top++;
      s.slots[s.top] = item(c);
      r.push({ lines: [1], focus: s.top, hot: "top", kind: "add", ...b(i), hint: `${c} opens: push it` });
    } else if (CLOSE[c]) {
      r.push({ lines: [2], focus: s.top, ...b(i), hint: `${c} closes: it must match the top` });
      if (s.top === -1) {
        r.push({ lines: [3], ...b(i, { bad: true }), hint: `nothing open to match ${c}` });
        return r.finish(`Not balanced: ${c} at position ${i} has nothing to close`, { miss: true, lines: [3], ...b(i, { bad: true }) });
      }
      const it = s.slots[s.top];
      s.slots[s.top] = null;
      s.top--;
      if (it.val !== CLOSE[c]) {
        r.push({ lines: [4], hot: "top", out: it, ...b(i, { bad: true }), hint: `popped ${it.val}, but ${c} needs ${CLOSE[c]}` });
        return r.finish(`Not balanced: ${it.val} is closed by ${c}`, { miss: true, out: it, lines: [4], ...b(i, { bad: true }) });
      }
      r.push({ lines: [4], focus: s.top, hot: "top", out: it, ...b(i), hint: `popped ${it.val}: it matches ${c}` });
    } else {
      r.push({ lines: [0], ...b(i), hint: `"${c}" is not a bracket: skip it` });
    }
  }
  if (s.top !== -1) {
    r.push({ lines: [5], focus: s.top, hot: "top", ...b(chars.length, { bad: true }), hint: `${s.top + 1} bracket(s) never closed` });
    return r.finish(`Not balanced: ${s.slots.slice(0, s.top + 1).map((x) => x.val).join(" ")} never closed`, {
      miss: true,
      lines: [5],
      ...b(chars.length, { bad: true }),
    });
  }
  r.push({ lines: [5], ...b(chars.length, { good: true }), hint: "the stack is empty" });
  return r.finish("Balanced: every bracket is closed in the right order", { lines: [5], ...b(chars.length, { good: true }) });
}

/* ------------------------------------------------------------------ */
/*  Queues                                                             */
/* ------------------------------------------------------------------ */

export function enqueueSteps(kind, start, v) {
  const r = recorder(kind, start);
  const s = r.state;
  if (kind === "queue") {
    r.push({ lines: [0], focus: s.rear, hot: "rear", hint: `rear = ${s.rear}, capacity − 1 = ${s.cap - 1}` });
    if (s.rear === s.cap - 1) {
      const msg = s.front > 0 ? ` (even though ${s.front} slot${s.front > 1 ? "s" : ""} at the front are free)` : "";
      return r.finish(`Queue overflow: rear is at the last slot${msg}`, { miss: true, lines: [0] });
    }
    s.rear++;
    r.push({ lines: [1], focus: s.rear, hot: "rear", hint: `rear = ${s.rear}` });
    s.slots[s.rear] = item(v);
    r.push({ lines: [2], focus: s.rear, kind: "add" });
    return r.finish(`Enqueued ${v}`, { focus: s.rear });
  }
  r.push({ lines: [0], hint: `count = ${s.count}, capacity = ${s.cap}` });
  if (s.count === s.cap) return r.finish(`Queue overflow: all ${s.cap} slots are in use`, { miss: true, lines: [0] });
  const was = s.rear;
  s.rear = (s.rear + 1) % s.cap;
  r.push({ lines: [1], focus: s.rear, hot: "rear", hint: `rear = (${was} + 1) mod ${s.cap} = ${s.rear}${s.rear === 0 && was === s.cap - 1 ? "  (wrapped round)" : ""}` });
  s.slots[s.rear] = item(v);
  r.push({ lines: [2], focus: s.rear, kind: "add" });
  s.count++;
  r.push({ lines: [3], focus: s.rear, hint: `count = ${s.count}` });
  return r.finish(`Enqueued ${v} at slot ${s.rear}`, { focus: s.rear });
}

export function dequeueSteps(kind, start) {
  const r = recorder(kind, start);
  const s = r.state;
  const empty = kind === "queue" ? s.front > s.rear : s.count === 0;
  r.push({ lines: [0], focus: s.front, hot: "front", hint: kind === "queue" ? `front = ${s.front}, rear = ${s.rear}` : `count = ${s.count}` });
  if (empty) return r.finish("Queue underflow: there is nothing to dequeue", { miss: true, lines: [0] });
  const it = s.slots[s.front];
  r.push({ lines: [1], focus: s.front, hint: `v = ${it.val}` });
  s.slots[s.front] = null;
  const was = s.front;
  s.front = kind === "queue" ? s.front + 1 : (s.front + 1) % s.cap;
  r.push({
    lines: [2],
    focus: s.front,
    hot: "front",
    out: it,
    hint: kind === "queue" ? `front = ${s.front}` : `front = (${was} + 1) mod ${s.cap} = ${s.front}`,
  });
  if (kind === "circular") {
    s.count--;
    r.push({ lines: [3], out: it, hint: `count = ${s.count}` });
  }
  return r.finish(`Dequeued ${it.val}`, { out: it, lines: [kind === "queue" ? 3 : 4] });
}

export function peekQueueSteps(kind, start) {
  const r = recorder(kind, start);
  const s = r.state;
  const empty = kind === "queue" ? s.front > s.rear : s.count === 0;
  r.push({ lines: [0], focus: s.front, hot: "front" });
  if (empty) return r.finish("The queue is empty", { miss: true });
  r.push({ lines: [1], focus: s.front, found: s.front });
  return r.finish(`The front is ${s.slots[s.front].val} (nothing removed)`, { found: s.front, lines: [1] });
}
