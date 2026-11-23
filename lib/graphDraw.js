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
      label: i,
    });
  }

  return nodes;
}

function arrowHead(P, x, y, angle, size, color) {
  P.push();
  P.translate(x, y);
  P.rotate(angle);
  P.fill(color[0], color[1], color[2]);
  P.noStroke();
  P.triangle(0, 0, -size, size / 2, -size, -size / 2);
  P.pop();
}

/**
 * Straight edge between two node centres, trimmed by the node radius.
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
  const startX = x1 + ux * r;
  const startY = y1 + uy * r;
  const endX = x2 - ux * r;
  const endY = y2 - uy * r;

  P.push();
  P.stroke(color[0], color[1], color[2]);
  P.strokeWeight(opts.weight ?? 2);
  P.noFill();
  P.line(startX, startY, endX, endY);
  P.pop();

  if (opts.directed !== false) {
    arrowHead(P, endX, endY, Math.atan2(dy, dx), headSize, color);
  }
}

/**
 * Self loop: a 270 degree arc just outside the node, with the head on the end.
 */
export function drawSelfLoop(P, x, y, nodeIndex, r, opts = {}) {
  const color = opts.color || EDGE;
  const loopRadius = r + 12;
  const offsetAngle = (nodeIndex * Math.PI) / 4;
  const loopCenterX =
    x + Math.cos(offsetAngle - Math.PI / 2) * (r + loopRadius / 2.5);
  const loopCenterY =
    y + Math.sin(offsetAngle - Math.PI / 2) * (r + loopRadius / 2.5);
  const startAngle = offsetAngle + Math.PI / 1.4;
  const endAngle = startAngle + (3 * Math.PI) / 2;

  P.push();
  P.stroke(color[0], color[1], color[2]);
  P.strokeWeight(2);
  P.noFill();
  P.arc(loopCenterX, loopCenterY, loopRadius, loopRadius, startAngle, endAngle);

  const arrowAngle = endAngle;
  const arrowX = loopCenterX + Math.cos(arrowAngle) * (loopRadius / 2.5);
  const arrowY = loopCenterY + Math.sin(arrowAngle) * (loopRadius / 2.5);
  arrowHead(P, arrowX, arrowY, arrowAngle + Math.PI / 1.6, 6, color);
  P.pop();
}

/**
 * Weight badge sitting on top of an edge.
 */
export function drawWeightLabel(P, x, y, weight, opts = {}) {
  const label = String(Math.round(weight * 100) / 100);
  P.push();
  P.fill(246, 242, 233);
  P.stroke(INK[0], INK[1], INK[2]);
  P.strokeWeight(1);
  P.circle(x, y, 18);
  P.fill(...INK);
  P.noStroke();
  P.textAlign(P.CENTER, P.CENTER);
  P.textSize(10);
  P.text(label, x, y + 0.5);
  P.pop();
}

/**
 * Weighted edge. When both directions exist the two are bowed apart so they
 * stay readable, and the lower-priority one is dashed.
 */
export function drawWeightedArrow(
  P,
  x1,
  y1,
  x2,
  y2,
  weight,
  r,
  opts = {}
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length <= r * 2) return;

  const ux = dx / length;
  const uy = dy / length;
  const startX = x1 + ux * r;
  const startY = y1 + uy * r;
  const endX = x2 - ux * r;
  const endY = y2 - uy * r;
  const color = weight < 0 ? [240, 128, 104] : EDGE;
  const reciprocal = !!opts.reciprocal;

  P.push();
  P.stroke(color[0], color[1], color[2]);
  P.strokeWeight(2);
  P.noFill();

  if (reciprocal) {
    // The bow is applied in the frame of this edge, so the two directions of a
    // reciprocal pair automatically end up on opposite sides of the line.
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const bow = 26;
    const controlX = midX + -uy * bow;
    const controlY = midY + ux * bow;

    if (opts.dashed && P.drawingContext) P.drawingContext.setLineDash([5, 5]);
    P.bezier(startX, startY, controlX, controlY, controlX, controlY, endX, endY);
    if (P.drawingContext) P.drawingContext.setLineDash([]);

    const tangent = P.bezierTangent(
      startX,
      controlX,
      controlX,
      endX,
      0.9
    );
    const tangentY = P.bezierTangent(
      startY,
      controlY,
      controlY,
      endY,
      0.9
    );
    arrowHead(P, endX, endY, Math.atan2(tangentY, tangent), 8, color);
    P.pop();

    drawWeightLabel(
      P,
      P.bezierPoint(startX, controlX, controlX, endX, 0.5),
      P.bezierPoint(startY, controlY, controlY, endY, 0.5),
      weight
    );
    return;
  }

  P.line(startX, startY, endX, endY);
  P.pop();
  arrowHead(P, endX, endY, Math.atan2(dy, dx), 8, color);
  drawWeightLabel(P, (startX + endX) / 2, (startY + endY) / 2, weight);
}

export function drawNodes(P, nodes, opts = {}) {
  const size = nodes.length;
  const diameter = opts.diameter ?? nodeDiameter(size);
  const labelColor = opts.labelColor || INK;
  const fillColor = opts.fill || [255, 255, 255];

  P.push();
  for (let i = 0; i < size; i++) {
    const node = nodes[i];
    P.fill(fillColor[0], fillColor[1], fillColor[2]);
    P.stroke(INK[0], INK[1], INK[2]);
    P.strokeWeight(2);
    P.circle(node.x, node.y, diameter);

    P.fill(labelColor[0], labelColor[1], labelColor[2]);
    P.noStroke();
    P.textAlign(P.CENTER, P.CENTER);
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
