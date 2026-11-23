// Shared p5 drawing for the graph pages. Keeps the chalkboard look in one place
// so every page draws nodes, edges and matrix headers the same way.

import { CHALK, INK, HIGHLIGHT } from "./boardPalette";

export const EDGE = [178, 192, 184];
export const EDGE_MUTED = [120, 138, 128];

export function nodeRadius(size) {
  return Math.min(17, 125 / Math.max(1, size));
}

export function nodeDiameter(size) {
  return Math.min(35, 250 / Math.max(1, size));
}

/**
 * Vertices on a circle, starting at the top and going clockwise.
 */
export function layoutRing(P, size, opts = {}) {
  const cx = opts.cx ?? 700;
  const cy = opts.cy ?? 250;
  const radius = opts.radius ?? 120;
  const nodes = [];

  for (let i = 0; i < size; i++) {
    const angle = (P.TWO_PI / size) * i - P.PI / 2;
    nodes.push({
      x: cx + P.cos(angle) * radius,
      y: cy + P.sin(angle) * radius,
      angle, // outward direction, used to point self loops away from the ring
      label: i,
    });
  }

  return nodes;
}

function arrowHead(P, x, y, angle, size, color) {
  P.push();
  P.translate(x, y);
  P.rotate(angle);
  P.fill(color[0], color[1], color[2], color[3] ?? 255);
  P.noStroke();
  P.triangle(0, 0, -size, size / 2, -size, -size / 2);
  P.pop();
}

/**
 * Edge between two node centres, trimmed by the node radius.
 * opts.bend > 0 bows it into a curve (used when both directions exist, so the
 * pair never sits on top of each other), opts.dash draws it dashed.
 */
export function drawArrow(P, x1, y1, x2, y2, r, opts = {}) {
  const color = opts.color || EDGE;
  const headSize = opts.headSize ?? 10;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length <= r * 2) return;

  const ux = dx / length;
  const uy = dy / length;
  const bend = opts.bend || 0;
  // control point on the left of the travel direction
  const cx = (x1 + x2) / 2 - uy * bend;
  const cy = (y1 + y2) / 2 + ux * bend;

  const towards = (fx, fy, tx, ty) => {
    const l = Math.hypot(tx - fx, ty - fy) || 1;
    return [fx + ((tx - fx) / l) * r, fy + ((ty - fy) / l) * r];
  };
  const [startX, startY] = bend ? towards(x1, y1, cx, cy) : [x1 + ux * r, y1 + uy * r];
  const [endX, endY] = bend ? towards(x2, y2, cx, cy) : [x2 - ux * r, y2 - uy * r];
  const directed = opts.directed !== false;
  const headAngle = bend ? Math.atan2(endY - cy, endX - cx) : Math.atan2(dy, dx);
  // stop the line under the arrow head so the tip stays sharp
  const trim = directed ? headSize * 0.7 : 0;
  const lineEndX = endX - Math.cos(headAngle) * trim;
  const lineEndY = endY - Math.sin(headAngle) * trim;

  P.push();
  P.stroke(color[0], color[1], color[2], opts.alpha ?? 255);
  P.strokeWeight(opts.weight ?? 2);
  P.noFill();
  const ctx = P.drawingContext;
  if (opts.dash && ctx) ctx.setLineDash(opts.dash);
  if (bend && ctx) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(cx, cy, lineEndX, lineEndY);
    ctx.stroke();
  } else {
    P.line(startX, startY, lineEndX, lineEndY);
  }
  if (ctx) ctx.setLineDash([]);
  P.pop();

  if (directed) {
    const headColor = opts.alpha != null ? [...color, opts.alpha] : color;
    arrowHead(P, endX, endY, headAngle, headSize, headColor);
  }

  return bend
    ? { x: (startX + 2 * cx + endX) / 4, y: (startY + 2 * cy + endY) / 4 }
    : { x: (startX + endX) / 2, y: (startY + endY) / 2 };
}

/**
 * Self loop: a circle sitting just outside the node, pointing away from the
 * middle of the graph (pass opts.angle, layoutRing gives every node one), with
 * the arrow head landing exactly on the node's edge.
 * Returns the point at the top of the loop, for a weight label.
 */
export function drawSelfLoop(P, x, y, nodeIndex, r, opts = {}) {
  const color = opts.color || EDGE;
  const angle = opts.angle ?? -Math.PI / 2;
  const lr = Math.max(10, r * 0.8); // loop radius
  const d = r + lr * 0.5; // node centre to loop centre
  const lx = x + Math.cos(angle) * d;
  const ly = y + Math.sin(angle) * d;

  // where the loop circle meets the node circle, seen from the loop centre
  const phi = Math.acos(Math.min(1, Math.max(-1, (d * d + lr * lr - r * r) / (2 * d * lr))));
  const back = angle + Math.PI;
  const start = back + phi;
  const end = back + Math.PI * 2 - phi;
  const directed = opts.directed !== false;
  const head = opts.headSize ?? 8;
  const trim = directed ? (head * 0.8) / lr : 0;

  P.push();
  P.stroke(color[0], color[1], color[2], opts.alpha ?? 255);
  P.strokeWeight(opts.weight ?? 2);
  P.noFill();
  if (opts.dash && P.drawingContext) P.drawingContext.setLineDash(opts.dash);
  P.arc(lx, ly, lr * 2, lr * 2, start, end - trim);
  if (P.drawingContext) P.drawingContext.setLineDash([]);
  P.pop();

  if (directed) {
    const tipX = lx + Math.cos(end) * lr;
    const tipY = ly + Math.sin(end) * lr;
    const fromA = end - head / lr;
    const fromX = lx + Math.cos(fromA) * lr;
    const fromY = ly + Math.sin(fromA) * lr;
    const headColor = opts.alpha != null ? [...color, opts.alpha] : color;
    arrowHead(P, tipX, tipY, Math.atan2(tipY - fromY, tipX - fromX), head, headColor);
  }

  return { x: lx + Math.cos(angle) * (lr + 10), y: ly + Math.sin(angle) * (lr + 10) };
}

/**
 * Weight badge sitting on top of an edge. A pill, so long or negative weights
 * still fit.
 */
export function drawWeightLabel(P, x, y, weight, opts = {}) {
  const label = String(Math.round(weight * 100) / 100);
  const fill = opts.fill || [246, 242, 233];
  P.push();
  P.textSize(10.5);
  const w = Math.max(18, P.textWidth(label) + 10);
  P.fill(fill[0], fill[1], fill[2], opts.alpha ?? 255);
  P.stroke(INK[0], INK[1], INK[2], opts.alpha ?? 255);
  P.strokeWeight(1);
  P.rect(x - w / 2, y - 9, w, 18, 9);
  P.fill(INK[0], INK[1], INK[2], opts.alpha ?? 255);
  P.noStroke();
  P.textAlign(P.CENTER, P.CENTER);
  if (opts.bold) P.textStyle(P.BOLD);
  P.text(label, x, y + 0.5);
  P.pop();
}

const NEGATIVE = [240, 128, 104];

/**
 * Weighted edge. When both directions exist the two are bowed apart so they
 * stay readable, and the lower-priority one is dashed.
 */
export function drawWeightedArrow(P, x1, y1, x2, y2, weight, r, opts = {}) {
  const color = opts.color || (weight < 0 ? NEGATIVE : EDGE);
  const mid = drawArrow(P, x1, y1, x2, y2, r, {
    color,
    weight: opts.weight,
    headSize: 9,
    bend: opts.reciprocal ? 22 : 0,
    dash: opts.dashed ? [5, 5] : opts.dash,
    directed: opts.directed,
    alpha: opts.alpha,
  });
  if (mid) drawWeightLabel(P, mid.x, mid.y, weight, { fill: opts.labelFill, alpha: opts.alpha });
}

/**
 * Every edge of an adjacency matrix in one call, shared by the graph pages:
 * self loops, curved reciprocal pairs, weights, and the edge under the mouse
 * in the matrix (hover = {i, j}) lit up, or previewed dashed when that cell
 * is still 0, so you can see what clicking it would add.
 */
export function drawGraphEdges(P, opts) {
  const { matrix, nodes, radius } = opts;
  const directed = opts.directed !== false;
  const weighted = !!opts.weighted;
  const hover = opts.hover || null;
  const size = matrix.length;

  const isHot = (i, j) =>
    hover && ((hover.i === i && hover.j === j) || (!directed && hover.i === j && hover.j === i));

  const one = (i, j, value, style) => {
    const a = nodes[i];
    const b = nodes[j];
    if (!a || !b) return;
    if (i === j) {
      const top = drawSelfLoop(P, a.x, a.y, i, radius, {
        angle: a.angle,
        directed,
        color: style.color || (weighted && value < 0 ? NEGATIVE : EDGE),
        weight: style.weight,
        dash: style.dash,
        alpha: style.alpha,
      });
      if (weighted && value !== 0) drawWeightLabel(P, top.x, top.y, value, { fill: style.labelFill, alpha: style.alpha });
      return;
    }
    const reciprocal = directed && matrix[j][i] !== 0;
    if (weighted && value !== 0) {
      drawWeightedArrow(P, a.x, a.y, b.x, b.y, value, radius, {
        reciprocal,
        directed,
        ...style,
      });
    } else {
      drawArrow(P, a.x, a.y, b.x, b.y, radius, {
        directed,
        bend: reciprocal ? 20 : 0,
        color: style.color,
        weight: style.weight,
        dash: style.dash,
        alpha: style.alpha,
      });
    }
  };

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrix[i][j] === 0 || isHot(i, j)) continue;
      if (!directed && j < i) continue;
      one(i, j, matrix[i][j], {});
    }
  }

  if (hover && hover.i < size && hover.j < size) {
    const { i, j } = hover;
    if (matrix[i][j] !== 0) {
      one(i, j, matrix[i][j], { color: HIGHLIGHT, weight: 3.5, labelFill: HIGHLIGHT });
    } else {
      one(i, j, 0, { color: HIGHLIGHT, weight: 2, dash: [5, 6], alpha: 150 });
    }
  }
}

export function drawNodes(P, nodes, opts = {}) {
  const size = nodes.length;
  const diameter = opts.diameter ?? nodeDiameter(size);
  const labelColor = opts.labelColor || INK;
  const fillColor = opts.fill || [255, 255, 255];
  const highlight = opts.highlight || [];

  P.push();
  for (let i = 0; i < size; i++) {
    const node = nodes[i];
    const hot = highlight.includes(i);
    if (hot) {
      P.noStroke();
      P.fill(HIGHLIGHT[0], HIGHLIGHT[1], HIGHLIGHT[2], 70);
      P.circle(node.x, node.y, diameter + 14);
    }
    P.fill(...(hot ? HIGHLIGHT : fillColor));
    P.stroke(INK[0], INK[1], INK[2]);
    P.strokeWeight(2);
    P.circle(node.x, node.y, diameter);

    P.fill(labelColor[0], labelColor[1], labelColor[2]);
    P.noStroke();
    P.textAlign(P.CENTER, P.CENTER);
    P.textStyle(P.BOLD);
    P.textSize(Math.min(16, diameter / 2));
    P.text(String(node.label), node.x, node.y + 0.5);
  }
  P.pop();
}

export function drawHeading(P, text, x, y, opts = {}) {
  P.push();
  P.noStroke();
  P.fill(...(opts.color || CHALK));
  P.textAlign(opts.align || P.LEFT, P.BASELINE);
  P.textSize(opts.size || 16);
  if (opts.weight) P.textStyle(P.BOLD);
  P.text(text, x, y);
  P.pop();
}

export function drawStats(P, lines, x, y, opts = {}) {
  P.push();
  P.noStroke();
  P.fill(...CHALK);
  P.textAlign(P.LEFT, P.BASELINE);
  P.textSize(opts.size || 14);
  lines.forEach((line, index) => {
    if (index === 0) P.textStyle(P.BOLD);
    else P.textStyle(P.NORMAL);
    P.text(line, x, y + index * (opts.gap || 20));
  });
  P.textStyle(P.NORMAL);
  P.pop();
}

/**
 * Row and column numbers around a matrix grid. The grid itself is made of HTML
 * inputs, so the labels are drawn on the canvas next to it.
 * Returns the clickable header rectangles so the sketch can hit test them.
 */
export function drawMatrixHeaders(P, opts = {}) {
  const { size, originX, originY, pitch, cell, gutter = 26, highlight = null } =
    opts;
  const regions = [];

  P.push();
  P.noStroke();
  P.textSize(Math.min(13, cell * 0.5));
  P.textAlign(P.CENTER, P.CENTER);

  for (let j = 0; j < size; j++) {
    const cx = originX + j * pitch + cell / 2;
    const cy = originY - gutter / 2;
    P.fill(...(highlight && highlight.col === j ? HIGHLIGHT : CHALK));
    P.text(String(j), cx, cy);
    regions.push({
      kind: "col",
      index: j,
      x: cx - cell / 2,
      y: originY - gutter,
      w: cell,
      h: gutter,
    });
  }

  P.textAlign(P.CENTER, P.CENTER);
  for (let i = 0; i < size; i++) {
    const cx = originX - gutter / 2;
    const cy = originY + i * pitch + cell / 2;
    P.fill(...(highlight && highlight.row === i ? HIGHLIGHT : CHALK));
    P.text(String(i), cx, cy);
    regions.push({
      kind: "row",
      index: i,
      x: originX - gutter,
      y: cy - cell / 2,
      w: gutter,
      h: cell,
    });
  }
  P.pop();

  return regions;
}

export function hitHeader(regions, x, y) {
  for (const region of regions) {
    if (
      x >= region.x &&
      x <= region.x + region.w &&
      y >= region.y &&
      y <= region.y + region.h
    ) {
      return region;
    }
  }
  return null;
}
