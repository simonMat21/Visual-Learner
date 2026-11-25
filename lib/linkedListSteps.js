// Linked list operations (singly, doubly, circular), recorded as steps.
//
// The list is plain data: { nodes: { id: { val, next, prev } }, head, nextId }.
// Because pointers are rewired one at a time, a list can be "mid-surgery"
// (a new node not linked yet, an arrow already flipped), so every step also
// stores `order`: the ids in the row as they should be drawn, and `lifted`:
// nodes drawn just below the row (a node being added or removed).
//
// Step: { list, order, lifted, focus, found, gone, tags, hot, lines, stats, result, done, kind }
//   hot = pointer arrows to highlight, as "id:next" / "id:prev" / "head"

export const MAX_LIST = 12;

export function emptyList() {
  return { nodes: {}, head: null, nextId: 1 };
}

function clone(list) {
  const nodes = {};
  Object.entries(list.nodes).forEach(([id, n]) => {
    nodes[id] = { ...n };
  });
  return { nodes, head: list.head, nextId: list.nextId };
}

/** Ids from head following next (stops when it comes back round). */
export function orderOf(list) {
  const out = [];
  const seen = new Set();
  let cur = list.head;
  while (cur != null && !seen.has(cur)) {
    seen.add(cur);
    out.push(cur);
    cur = list.nodes[cur].next;
  }
  return out;
}

export function length(list) {
  return orderOf(list).length;
}

export function listFrom(vals, kind = "single") {
  const list = emptyList();
  const ids = vals.map((v) => {
    const id = list.nextId++;
    list.nodes[id] = { val: v, next: null, prev: null };
    return id;
  });
  ids.forEach((id, i) => {
    list.nodes[id].next = i + 1 < ids.length ? ids[i + 1] : kind === "circular" ? ids[0] : null;
    if (kind === "double") list.nodes[id].prev = i > 0 ? ids[i - 1] : null;
  });
  list.head = ids.length ? ids[0] : null;
  return list;
}

export function randomList(count = 5, kind = "single") {
  const vals = [];
  while (vals.length < count) {
    const v = 5 + Math.floor(Math.random() * 90);
    if (!vals.includes(v)) vals.push(v);
  }
  return listFrom(vals, kind);
}

/* ------------------------------------------------------------------ */
/*  Pseudocode                                                         */
/* ------------------------------------------------------------------ */

export const LIST_CODE = {
  single: {
    insert: [
      "newNode ← Node(v)",
      "if index == 0:  newNode.next ← head;  head ← newNode",
      "else: curr ← head",
      "  repeat index − 1 times:  curr ← curr.next",
      "  newNode.next ← curr.next",
      "  curr.next ← newNode",
    ],
    delete: [
      "if index == 0:  head ← head.next",
      "else: curr ← head",
      "  repeat index − 1 times:  curr ← curr.next",
      "  target ← curr.next",
      "  curr.next ← target.next   // skip over it",
      "free(target)",
    ],
    search: [
      "curr ← head;  i ← 0",
      "while curr ≠ null:",
      "  if curr.val == v: return i",
      "  curr ← curr.next;  i ← i + 1",
      "return not found",
    ],
    reverse: [
      "prev ← null;  curr ← head",
      "while curr ≠ null:",
      "  next ← curr.next",
      "  curr.next ← prev     // flip the arrow",
      "  prev ← curr;  curr ← next",
      "head ← prev",
    ],
  },
  double: {
    insert: [
      "newNode ← Node(v)",
      "if index == 0:  newNode.next ← head;  head.prev ← newNode;  head ← newNode",
      "else: curr ← head;  move index − 1 steps",
      "  newNode.next ← curr.next;  newNode.prev ← curr",
      "  if curr.next ≠ null:  curr.next.prev ← newNode",
      "  curr.next ← newNode",
    ],
    delete: [
      "target ← head;  move index steps",
      "if target.prev ≠ null:  target.prev.next ← target.next",
      "else:  head ← target.next",
      "if target.next ≠ null:  target.next.prev ← target.prev",
      "free(target)",
    ],
    search: [
      "curr ← head;  i ← 0",
      "while curr ≠ null:",
      "  if curr.val == v: return i",
      "  curr ← curr.next;  i ← i + 1",
      "return not found",
    ],
    reverse: [
      "curr ← head",
      "while curr ≠ null:",
      "  swap curr.next and curr.prev",
      "  head ← curr;  curr ← curr.prev   // the old next",
    ],
  },
  circular: {
    insert: [
      "newNode ← Node(v)",
      "if list is empty:  newNode.next ← newNode;  head ← newNode",
      "else if index == 0:  last ← node whose next is head",
      "  newNode.next ← head;  last.next ← newNode;  head ← newNode",
      "else: curr ← head;  move index − 1 steps",
      "  newNode.next ← curr.next;  curr.next ← newNode",
    ],
    delete: [
      "if it is the only node:  head ← null",
      "else if index == 0:  last ← node whose next is head",
      "  head ← head.next;  last.next ← head",
      "else: curr ← head;  move index − 1 steps",
      "  target ← curr.next;  curr.next ← target.next",
      "free(target)",
    ],
    search: [
      "if head == null: return not found",
      "curr ← head;  i ← 0",
      "do:",
      "  if curr.val == v: return i",
      "  curr ← curr.next;  i ← i + 1",
      "while curr ≠ head      // back at the start: stop",
      "return not found",
    ],
    rotate: [
      "if head ≠ null:",
      "  head ← head.next   // no node moves, only head",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Recorder                                                           */
/* ------------------------------------------------------------------ */

function recorder(start) {
  let list = clone(start);
  let order = orderOf(list);
  const lifted = new Set();
  let tags = {};
  const steps = [];
  const stats = { hops: 0 };

  const snapshot = (step) => ({
    list: clone(list),
    order: [...order],
    lifted: [...lifted],
    tags: { ...tags },
    lines: [],
    focus: null,
    found: null,
    gone: null,
    hot: [],
    ...step,
    stats: { ...stats, nodes: order.filter((id) => list.nodes[id]).length },
  });

  return {
    get list() {
      return list;
    },
    get order() {
      return order;
    },
    set order(o) {
      order = o;
    },
    lifted,
    stats,
    setTags(t) {
      tags = t;
    },
    push(step) {
      steps.push(snapshot(step));
    },
    finish(result, extra = {}) {
      steps.push(snapshot({ result, done: true, kind: "done", ...extra }));
      return { list, steps };
    },
  };
}

/** Walk curr forward `count` times from head, one step each. */
function walk(r, count, lines, label = "curr") {
  let curr = r.list.head;
  r.setTags({ [curr]: label });
  r.push({ lines, focus: curr });
  for (let k = 0; k < count; k++) {
    r.push({ lines, focus: curr, hot: [`${curr}:next`] });
    curr = r.list.nodes[curr].next;
    r.stats.hops++;
    r.setTags({ [curr]: label });
    r.push({ lines, focus: curr });
  }
  return curr;
}

function lastNode(r, lines, keep = {}) {
  // walk until next is head; used by the circular list
  let curr = r.list.head;
  r.setTags({ ...keep, [curr]: "last?" });
  r.push({ lines, focus: curr });
  while (r.list.nodes[curr].next !== r.list.head) {
    r.push({ lines, focus: curr, hot: [`${curr}:next`] });
    curr = r.list.nodes[curr].next;
    r.stats.hops++;
    r.setTags({ ...keep, [curr]: "last?" });
    r.push({ lines, focus: curr });
  }
  return curr;
}

/* ------------------------------------------------------------------ */
/*  Operations                                                         */
/* ------------------------------------------------------------------ */

/** Insert v so that it ends up at `index` (0 = front). */
export function insertSteps(start, kind, v, index) {
  const r = recorder(start);
  const n = r.order.length;
  if (n >= MAX_LIST) return r.finish(`The board holds ${MAX_LIST} nodes at most`, { miss: true });
  const at = Math.max(0, Math.min(n, index ?? n));
  const L = r.list;

  const id = L.nextId++;
  L.nodes[id] = { val: v, next: null, prev: null };
  r.order = [...r.order.slice(0, at), id, ...r.order.slice(at)];
  r.lifted.add(id);
  r.setTags({ [id]: "newNode" });
  r.push({ lines: [0], focus: id, kind: "add" });

  const drop = (lines) => {
    r.lifted.delete(id);
    r.setTags({});
    r.push({ lines, found: id, kind: "move" });
  };

  if (kind === "circular" && n === 0) {
    L.nodes[id].next = id;
    r.push({ lines: [1], focus: id, hot: [`${id}:next`] });
    L.head = id;
    drop([1]);
    return r.finish(`Inserted ${v}; it points to itself`, { found: id });
  }

  if (at === 0) {
    if (kind === "circular") {
      const last = lastNode(r, [2], { [id]: "newNode" });
      r.setTags({ [last]: "last", [id]: "newNode" });
      r.push({ lines: [2], focus: last });
      L.nodes[id].next = L.head;
      r.push({ lines: [3], focus: id, hot: [`${id}:next`] });
      L.nodes[last].next = id;
      r.push({ lines: [3], focus: last, hot: [`${last}:next`] });
      L.head = id;
      r.push({ lines: [3], focus: id, hot: ["head"] });
      drop([3]);
      return r.finish(`Inserted ${v} at the front (and fixed the last node's pointer)`, { found: id });
    }
    L.nodes[id].next = L.head;
    r.push({ lines: [1], focus: id, hot: [`${id}:next`] });
    if (kind === "double" && L.head != null) {
      L.nodes[L.head].prev = id;
      r.push({ lines: [1], focus: L.head, hot: [`${L.head}:prev`] });
    }
    L.head = id;
    r.push({ lines: [1], focus: id, hot: ["head"] });
    drop([1]);
    return r.finish(`Inserted ${v} at the front`, { found: id });
  }

  const moveLine = kind === "single" ? [2, 3] : kind === "double" ? [2] : [4];
  const curr = walk(r, at - 1, moveLine);
  const after = L.nodes[curr].next;
  r.setTags({ [curr]: "curr", [id]: "newNode" });

  if (kind === "double") {
    L.nodes[id].next = after;
    L.nodes[id].prev = curr;
    r.push({ lines: [3], focus: id, hot: [`${id}:next`, `${id}:prev`] });
    if (after != null) {
      L.nodes[after].prev = id;
      r.push({ lines: [4], focus: after, hot: [`${after}:prev`] });
    }
    L.nodes[curr].next = id;
    r.push({ lines: [5], focus: curr, hot: [`${curr}:next`] });
    drop([5]);
  } else {
    const l1 = kind === "single" ? [4] : [5];
    L.nodes[id].next = after;
    r.push({ lines: l1, focus: id, hot: [`${id}:next`] });
    L.nodes[curr].next = id;
    r.push({ lines: kind === "single" ? [5] : [5], focus: curr, hot: [`${curr}:next`] });
    drop(kind === "single" ? [5] : [5]);
  }
  return r.finish(`Inserted ${v} at index ${at}`, { found: id });
}

/** Delete the node at `index`. */
export function deleteSteps(start, kind, index) {
  const r = recorder(start);
  const n = r.order.length;
  const L = r.list;
  if (n === 0) return r.finish("The list is empty", { miss: true });
  if (!(index >= 0 && index < n)) return r.finish(`There is no index ${index} (valid: 0–${n - 1})`, { miss: true });

  const remove = (target, lines) => {
    r.lifted.add(target);
    r.push({ lines, gone: target, kind: "remove" });
    const val = L.nodes[target].val;
    delete L.nodes[target];
    r.order = r.order.filter((x) => x !== target);
    r.lifted.delete(target);
    r.setTags({});
    r.push({ lines, kind: "move" });
    return val;
  };

  if (kind === "double") {
    const target = walk(r, index, [0], "target");
    const { prev, next } = L.nodes[target];
    if (prev != null) {
      L.nodes[prev].next = next;
      r.push({ lines: [1], focus: prev, hot: [`${prev}:next`] });
    } else {
      L.head = next;
      r.push({ lines: [2], focus: next, hot: ["head"] });
    }
    if (next != null) {
      L.nodes[next].prev = prev;
      r.push({ lines: [3], focus: next, hot: [`${next}:prev`] });
    }
    const val = remove(target, [4]);
    return r.finish(`Deleted ${val} from index ${index}`);
  }

  if (kind === "circular" && n === 1) {
    const target = L.head;
    r.setTags({ [target]: "target" });
    L.head = null;
    r.push({ lines: [0], focus: target, hot: ["head"] });
    const val = remove(target, [0]);
    return r.finish(`Deleted ${val}; the list is empty now`);
  }

  if (index === 0) {
    const target = L.head;
    if (kind === "circular") {
      const last = lastNode(r, [1], { [target]: "target" });
      r.setTags({ [last]: "last", [target]: "target" });
      r.push({ lines: [1], focus: last });
      L.head = L.nodes[target].next;
      r.push({ lines: [2], focus: L.head, hot: ["head"] });
      L.nodes[last].next = L.head;
      r.push({ lines: [2], focus: last, hot: [`${last}:next`] });
      const val = remove(target, [5]);
      return r.finish(`Deleted ${val} from the front (and fixed the last node's pointer)`);
    }
    r.setTags({ [target]: "target" });
    r.push({ lines: [0], focus: target });
    L.head = L.nodes[target].next;
    r.push({ lines: [0], focus: L.head, hot: ["head"] });
    const val = remove(target, kind === "single" ? [5] : [5]);
    return r.finish(`Deleted ${val} from the front`);
  }

  const moveLine = kind === "single" ? [1, 2] : [3];
  const curr = walk(r, index - 1, moveLine);
  const target = L.nodes[curr].next;
  r.setTags({ [curr]: "curr", [target]: "target" });
  r.push({ lines: kind === "single" ? [3] : [4], focus: target });
  L.nodes[curr].next = L.nodes[target].next;
  r.push({ lines: [4], focus: curr, hot: [`${curr}:next`] });
  const val = remove(target, [5]);
  return r.finish(`Deleted ${val} from index ${index}`);
}

export function searchSteps(start, kind, v) {
  const r = recorder(start);
  const L = r.list;
  const circ = kind === "circular";
  if (L.head == null) {
    r.push({ lines: [circ ? 0 : 1] });
    return r.finish(`${v} is not in the list (it is empty)`, { miss: true });
  }
  let curr = L.head;
  let i = 0;
  r.setTags({ [curr]: "curr" });
  r.push({ lines: [circ ? 1 : 0], focus: curr });
  do {
    r.stats.comparisons = (r.stats.comparisons || 0) + 1;
    if (L.nodes[curr].val === v) {
      r.push({ lines: [circ ? 3 : 2], focus: curr, found: curr });
      return r.finish(`Found ${v} at index ${i}`, { found: curr });
    }
    r.push({ lines: [circ ? 3 : 2], focus: curr, hint: `${L.nodes[curr].val} ≠ ${v}` });
    r.push({ lines: [circ ? 4 : 3], focus: curr, hot: [`${curr}:next`] });
    curr = L.nodes[curr].next;
    r.stats.hops++;
    i++;
    if (curr != null) {
      r.setTags({ [curr]: "curr" });
      r.push({ lines: [circ ? 5 : 1], focus: curr });
    }
  } while (curr != null && curr !== L.head);
  r.setTags(circ ? { [L.head]: "curr" } : {});
  r.push({ lines: [circ ? 6 : 4] });
  return r.finish(
    circ ? `${v} is not in the list (went all the way round back to head)` : `${v} is not in the list (reached null)`,
    { miss: true }
  );
}

export function reverseSteps(start, kind) {
  const r = recorder(start);
  const L = r.list;
  if (L.head == null) return r.finish("The list is empty", { miss: true });
  const finalOrder = [...r.order].reverse();

  if (kind === "double") {
    let curr = L.head;
    r.setTags({ [curr]: "curr" });
    r.push({ lines: [0], focus: curr });
    while (curr != null) {
      const n = L.nodes[curr];
      [n.next, n.prev] = [n.prev, n.next];
      r.push({ lines: [2], focus: curr, hot: [`${curr}:next`, `${curr}:prev`] });
      L.head = curr;
      const nxt = n.prev; // the old next
      r.stats.hops++;
      if (nxt != null) r.setTags({ [nxt]: "curr" });
      else r.setTags({});
      r.push({ lines: [3], focus: nxt, hot: ["head"] });
      curr = nxt;
    }
  } else {
    let prev = null;
    let curr = L.head;
    r.setTags({ [curr]: "curr" });
    r.push({ lines: [0], focus: curr });
    while (curr != null) {
      const next = L.nodes[curr].next;
      r.setTags({ ...(prev != null ? { [prev]: "prev" } : {}), [curr]: "curr", ...(next != null ? { [next]: "next" } : {}) });
      r.push({ lines: [2], focus: curr });
      L.nodes[curr].next = prev;
      r.push({ lines: [3], focus: curr, hot: [`${curr}:next`] });
      prev = curr;
      curr = next;
      r.stats.hops++;
      r.setTags({ ...(prev != null ? { [prev]: "prev" } : {}), ...(curr != null ? { [curr]: "curr" } : {}) });
      r.push({ lines: [4], focus: curr });
    }
    L.head = prev;
    r.setTags({ [prev]: "prev" });
    r.push({ lines: [5], focus: prev, hot: ["head"] });
  }
  r.order = finalOrder;
  r.setTags({});
  r.push({ lines: [kind === "double" ? 3 : 5], kind: "move" });
  return r.finish("Reversed the list");
}

export function rotateSteps(start) {
  const r = recorder(start);
  const L = r.list;
  if (L.head == null) return r.finish("The list is empty", { miss: true });
  r.setTags({ [L.head]: "head" });
  r.push({ lines: [0], focus: L.head });
  L.head = L.nodes[L.head].next;
  r.stats.hops++;
  r.push({ lines: [1], focus: L.head, hot: ["head"] });
  r.order = orderOf(L);
  r.setTags({});
  r.push({ lines: [1], kind: "move" });
  return r.finish("Moved head one node forward");
}
