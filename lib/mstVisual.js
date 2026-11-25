// Shared drawing and playback for the minimum spanning tree pages (Prim's and
// Kruskal's). The algorithms themselves live in mstSteps.js; this file turns a
// recorded step into pixels and owns the Play / Back / Step / Reset controls.

import { BOARD_LIGHT, CHALK, GOOD, BAD, HIGHLIGHT, INK } from "./boardPalette";
import { EDGE_MUTED } from "./graphDraw";
import { trimNumber } from "./graphModel";
import { edgeKey } from "./mstSteps";

export const CHECK = [140, 196, 245]; // chalk blue: edges being examined
const DEAD = [84, 102, 94];

/** Pastel set colours for Kruskal's disjoint sets, indexed by set root. */
export const SET_COLORS = [
  [255, 183, 178],
  [168, 214, 255],
  [255, 214, 153],
  [205, 190, 255],
  [170, 236, 196],
  [255, 245, 160],
  [228, 196, 160],
  [168, 232, 232],
];

const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/* ------------------------------------------------------------------ */
/*  Edges and weight labels                                            */
/* ------------------------------------------------------------------ */

/**
 * Where to put each weight badge. Badges sit in the middle of their edge, but
 * slide along it when that spot is taken (diagonals of a ring all cross in the
 * middle), so labels never stack on top of each other.
 */
export function placeLabels(nodes, edges) {
  const placed = [];
  const out = {};
  const tries = [0.5, 0.38, 0.62, 0.3, 0.7, 0.44, 0.56];
  edges.forEach(({ from, to }) => {
    const a = nodes[from];
    const b = nodes[to];
    if (!a || !b) return;
    let best = null;
    for (const t of tries) {
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const clash = placed.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < 22 * 22);
      if (!clash) {
        best = { x, y };
        break;
      }
      if (!best) best = { x, y };
    }
    placed.push(best);
    out[edgeKey(from, to)] = best;
  });
  return out;
}

function line(P, a, b, r, color, weight, opts = {}) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len <= r * 2) return;
  const ux = dx / len;
  const uy = dy / len;
  const sx = a.x + ux * r;
  const sy = a.y + uy * r;
  const fullX = b.x - ux * r;
  const fullY = b.y - uy * r;
  const part = opts.part ?? 1;
  const ex = sx + (fullX - sx) * part;
  const ey = sy + (fullY - sy) * part;

  P.push();
  P.stroke(color[0], color[1], color[2], opts.alpha ?? 255);
  P.strokeWeight(weight);
  P.strokeCap(P.ROUND);
  if (opts.dash && P.drawingContext) P.drawingContext.setLineDash(opts.dash);
  P.line(sx, sy, ex, ey);
  if (P.drawingContext) P.drawingContext.setLineDash([]);
  P.pop();
}

function weightBadge(P, pos, weight, state) {
  const label = trimNumber(weight);
  const faded = state === "dead" || state === "skipped" || state === "rejected";
  const fills = {
    mst: GOOD,
    considering: HIGHLIGHT,
    candidate: [252, 232, 178],
    checking: CHECK,
    rejected: BAD,
  };
  const fill = fills[state] || [246, 242, 233];
  P.push();
  P.textSize(11);
  const w = Math.max(20, P.textWidth(label) + 10);
  P.fill(fill[0], fill[1], fill[2], faded ? 110 : 255);
  P.stroke(INK[0], INK[1], INK[2], faded ? 90 : 255);
  P.strokeWeight(1);
  P.rect(pos.x - w / 2, pos.y - 9, w, 18, 9);
  P.noStroke();
  P.fill(INK[0], INK[1], INK[2], faded ? 120 : 255);
  P.textAlign(P.CENTER, P.CENTER);
  P.textStyle(state === "mst" ? P.BOLD : P.NORMAL);
  P.text(label, pos.x, pos.y + 0.5);
  P.pop();
}

/**
 * Draw every edge in the colour of its state, plus the animation of the edge
 * this step is about (an edge growing into the tree, a pulse, a red flash).
 *
 * @param elapsed ms since the step began, drives the animations
 */
export function drawMstEdges(P, nodes, edges, step, elapsed, radius, labels) {
  const states = step ? step.edges : {};
  const focus = step && step.focus;
  const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 160);
  const order = ["skipped", "dead", "idle", "rejected", "checking", "candidate", "mst", "considering"];

  const sortedEdges = [...edges].sort(
    (e1, e2) =>
      order.indexOf(states[edgeKey(e1.from, e1.to)] || "idle") -
      order.indexOf(states[edgeKey(e2.from, e2.to)] || "idle")
  );

  sortedEdges.forEach(({ from, to }) => {
    const key = edgeKey(from, to);
    const state = states[key] || "idle";
    const a = nodes[from];
    const b = nodes[to];
    if (!a || !b) return;
    const isFocus = focus && focus.key === key;

    if (isFocus && focus.kind === "grow") {
      const start = nodes[focus.from ?? from];
      const end = start === a ? b : a;
      const p = ease(elapsed / 700);
      line(P, a, b, radius, EDGE_MUTED, 2, { alpha: 160 });
      line(P, start, end, radius, GOOD, 14, { part: p, alpha: 60 * (1 - p) + 30 });
      line(P, start, end, radius, GOOD, 5, { part: p });
      return;
    }

    if (isFocus && focus.kind === "reject") {
      const blink = elapsed < 900 ? Math.floor(elapsed / 150) % 2 === 0 : false;
      if (blink || elapsed < 900) {
        line(P, a, b, radius, BAD, blink ? 6 : 3);
        // a cross on the middle of the edge
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        P.push();
        P.stroke(...BAD);
        P.strokeWeight(3);
        P.line(mx - 7, my - 7 - 16, mx + 7, my + 7 - 16);
        P.line(mx + 7, my - 7 - 16, mx - 7, my + 7 - 16);
        P.pop();
      } else {
        line(P, a, b, radius, BAD, 2, { dash: [6, 6], alpha: 170 });
      }
      return;
    }

    switch (state) {
      case "mst":
        line(P, a, b, radius, GOOD, 5);
        break;
      case "considering":
        line(P, a, b, radius, HIGHLIGHT, 12 + pulse * 6, { alpha: 70 });
        line(P, a, b, radius, HIGHLIGHT, 5);
        break;
      case "candidate":
        line(P, a, b, radius, HIGHLIGHT, 3, { dash: [8, 6] });
        break;
      case "checking":
        line(P, a, b, radius, CHECK, 4);
        break;
      case "rejected":
        line(P, a, b, radius, BAD, 2, { dash: [6, 6], alpha: 150 });
        break;
      case "dead":
      case "skipped":
        line(P, a, b, radius, DEAD, 1.5, { alpha: 200 });
        break;
      default:
        line(P, a, b, radius, EDGE_MUTED, 2);
    }
  });

  sortedEdges.forEach(({ from, to, weight }) => {
    const key = edgeKey(from, to);
    if (labels[key]) weightBadge(P, labels[key], weight, states[key] || "idle");
  });
}

/**
 * Vertices with a fill colour each, and a pulsing ring around the current one.
 */
export function drawMstNodes(P, nodes, opts = {}) {
  const d = opts.diameter ?? 34;
  const fills = opts.fills || [];
  const current = [].concat(opts.current ?? -1);
  const pulse = 0.5 + 0.5 * Math.sin(P.millis() / 180);

  P.push();
  nodes.forEach((node, i) => {
    if (current.includes(i)) {
      P.noFill();
      P.stroke(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 120 + 120 * pulse);
      P.strokeWeight(4);
      P.circle(node.x, node.y, d + 10 + pulse * 4);
    }
    const fill = fills[i] || [255, 255, 255];
    P.fill(fill[0], fill[1], fill[2]);
    P.stroke(...INK);
    P.strokeWeight(2);
    P.circle(node.x, node.y, d);
    P.noStroke();
    P.fill(...INK);
    P.textAlign(P.CENTER, P.CENTER);
    P.textStyle(P.BOLD);
    P.textSize(Math.min(16, d / 2));
    P.text(String(i), node.x, node.y + 0.5);
  });
  P.pop();
}

/* ------------------------------------------------------------------ */
/*  Text panels                                                        */
/* ------------------------------------------------------------------ */

export function panel(P, x, y, w, h) {
  P.push();
  P.noStroke();
  P.fill(...BOARD_LIGHT);
  P.rect(x, y, w, h, 8);
  P.pop();
}

/** Pseudocode with the lines of the current step lit up. */
export function drawPseudocode(P, box, code, lines = []) {
  const { x, y, w, h } = box;
  panel(P, x, y, w, h);
  P.push();
  P.noStroke();
  P.textAlign(P.LEFT, P.TOP);
  P.textSize(11);
  P.textStyle(P.BOLD);
  P.fill(...CHALK);
  P.text("PSEUDOCODE", x + 12, y + 9);
  P.textFont("monospace");
  P.textStyle(P.NORMAL);
  P.textSize(12);
  const pitch = 15.5;
  code.forEach((text, i) => {
    const ly = y + 28 + i * pitch;
    const active = lines.includes(i);
    if (active) {
      P.fill(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 60);
      P.rect(x + 6, ly - 2, w - 12, pitch, 3);
      P.fill(...HIGHLIGHT);
    } else {
      P.fill(CHALK[0], CHALK[1], CHALK[2], 170);
    }
    P.text(text, x + 12, ly);
  });
  P.pop();
}

export function drawLegend(P, x, y, items) {
  P.push();
  P.textSize(12);
  P.textAlign(P.LEFT, P.CENTER);
  let cx = x;
  items.forEach(({ label, color, dash, weight = 4, node }) => {
    if (node) {
      P.fill(...color);
      P.stroke(...INK);
      P.strokeWeight(1.5);
      P.circle(cx + 9, y, 14);
    } else {
      P.stroke(...color);
      P.strokeWeight(weight);
      if (dash && P.drawingContext) P.drawingContext.setLineDash(dash);
      P.line(cx, y, cx + 22, y);
      if (P.drawingContext) P.drawingContext.setLineDash([]);
    }
    P.noStroke();
    P.fill(...CHALK);
    P.text(label, cx + 28, y);
    cx += 28 + P.textWidth(label) + 18;
  });
  P.pop();
}

/* ------------------------------------------------------------------ */
/*  Playback                                                           */
/* ------------------------------------------------------------------ */

export const SPEEDS = [0.5, 1, 2, 4];

const durationOf = (step) => {
  if (!step) return 1500;
  if (step.kind === "init") return 2200;
  if (step.kind === "update" || step.kind === "reject") return 2000;
  if (step.kind === "done" || step.kind === "disconnected") return 1800;
  return 1500;
};

/**
 * Owns the list of steps and the current position. It has no buttons of its
 * own: the page renders the controls (above the board) and calls these
 * methods; `onChange` reports what the controls need to show.
 */
export function createPlayer(P, onChange, opts = {}) {
  const stepDuration = opts.duration || durationOf;
  let steps = [];
  let index = 0;
  let playing = false;
  let speed = 1;
  let elapsed = 0;

  const emit = () =>
    onChange?.({ playing, speed, index, count: steps.length, done: !!steps[index]?.done });

  function go(next) {
    const clamped = Math.min(steps.length - 1, Math.max(0, next));
    if (clamped !== index) elapsed = 0;
    index = clamped;
    emit();
  }

  function play() {
    if (!steps.length) return;
    if (index >= steps.length - 1) go(0);
    playing = true;
    emit();
  }

  function pause() {
    if (!playing) return;
    playing = false;
    emit();
  }

  const api = {
    play,
    toggle: () => (playing ? pause() : play()),
    forward: () => {
      pause();
      go(index + 1);
    },
    back: () => {
      pause();
      go(index - 1);
    },
    reset: () => {
      pause();
      elapsed = 0;
      go(0);
    },
    go: (i) => {
      pause();
      go(i);
    },
    cycleSpeed: () => {
      speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
      emit();
    },
    setSteps(next) {
      steps = next;
      index = 0;
      elapsed = 0;
      playing = false;
      emit();
    },
    update(dt) {
      elapsed += dt * (playing ? speed : 1);
      if (!playing) return;
      if (elapsed >= stepDuration(steps[index])) {
        if (index >= steps.length - 1) pause();
        else go(index + 1);
      }
    },
  };

  /** Keyboard: space plays or pauses, arrows step, when no field has focus. */
  function onKey(event) {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const rect = P.canvas && P.canvas.getBoundingClientRect();
    if (rect && (rect.bottom < 0 || rect.top > window.innerHeight)) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      api.forward();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      api.back();
    } else if (event.key === " ") {
      event.preventDefault();
      api.toggle();
    }
  }

  window.addEventListener("keydown", onKey);

  return {
    ...api,
    destroy() {
      window.removeEventListener("keydown", onKey);
    },
    get step() {
      return steps[index];
    },
    get index() {
      return index;
    },
    get count() {
      return steps.length;
    },
    get elapsed() {
      return elapsed;
    },
  };
}
