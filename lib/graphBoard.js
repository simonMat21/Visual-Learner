// Shared controller for the matrix graph pages: owns the adjacency matrix, the
// DOM matrix grid, the header numbers and the small controls above the grid, so
// each page only has to draw its own graph.

import { emptyMatrix, randomMatrix, resizeMatrix } from "./graphModel";
import {
  drawMatrixHeaders,
  hitHeader,
  layoutRing,
  nodeDiameter,
  nodeRadius,
} from "./graphDraw";
import { CHALK_TEXT, MatrixGrid, makeButton, makeLabel, makeStepper } from "./graphDom";

export const MAX_VERTICES = 8;

const LAYOUT = {
  sizeLabel: { x: 20, y: 56 },
  stepper: { x: 96, y: 42 },
  random: { x: 224, y: 42 },
  clear: { x: 332, y: 42 },
  heading: { x: 20, y: 90 },
  hint: { x: 20, y: 108 },
  grid: { x: 76, y: 140 },
};

const cellFor = (size) => Math.min(34, 290 / Math.max(1, size));

/**
 * @param P p5 instance
 * @param {{directed?:boolean, weighted?:boolean, maxSize?:number, defaultSize?:number,
 *          center?:{x:number,y:number,r:number}, onChange?:Function}} opts
 */
export function createMatrixBoard(P, opts = {}) {
  const directed = opts.directed !== false;
  const weighted = !!opts.weighted;
  const maxSize = opts.maxSize ?? MAX_VERTICES;
  const center = opts.center ?? { x: 690, y: 250, r: 130 };
  const ring = { cx: center.x, cy: center.y, radius: center.r };

  let size = opts.defaultSize ?? 5;
  let matrix = emptyMatrix(size);
  let nodes = layoutRing(P, size, ring);
  let baseX = 0;
  let baseY = 0;
  let canvas = null;
  let headerRegions = [];
  const controls = {};

  const grid = new MatrixGrid(P, {
    size,
    matrix,
    weighted,
    directed,
    cell: cellFor,
    originX: LAYOUT.grid.x,
    originY: LAYOUT.grid.y,
    gutter: 26,
    onChange: () => changed(),
  });

  function changed() {
    if (opts.onChange) opts.onChange(matrix, size);
  }

  function layoutGraph() {
    nodes = layoutRing(P, size, ring);
  }

  function setSize(next, { grow = false } = {}) {
    const clamped = Math.min(maxSize, Math.max(1, next));
    if (clamped === size) return;
    size = clamped;
    matrix = grow ? resizeMatrix(matrix, size, weighted) : emptyMatrix(size);
    grid.size = size;
    grid.matrix = matrix;
    grid.focus = { i: 0, j: 0 };
    grid.mount();
    if (controls.stepper) controls.stepper.set(size, true);
    layoutGraph();
    layout();
    changed();
  }

  function randomize() {
    matrix = randomMatrix(size, {
      directed,
      weighted,
      density: opts.density ?? 0.3,
    });
    grid.matrix = matrix;
    grid.refresh();
    changed();
  }

  function clear() {
    matrix = emptyMatrix(size);
    grid.matrix = matrix;
    grid.refresh();
    changed();
  }

  /** Header numbers, drawn on the canvas next to the DOM grid. */
  function drawHeaders() {
    const { pitch, cell } = grid.layout();
    headerRegions = drawMatrixHeaders(P, {
      size,
      originX: LAYOUT.grid.x,
      originY: LAYOUT.grid.y,
      pitch,
      cell,
      gutter: 26,
    });
  }

  /** Clicking a row or column number fills or clears that whole line. */
  function press(x, y) {
    const region = hitHeader(headerRegions, x, y);
    if (!region) return false;
    let filled = false;
    for (let k = 0; k < size; k++) {
      const i = region.kind === "row" ? region.index : k;
      const j = region.kind === "row" ? k : region.index;
      if (matrix[i][j] !== 0) {
        filled = true;
        break;
      }
    }
    grid.setLine(region.kind, region.index, filled ? 0 : 1);
    return true;
  }

  function attach(cnv) {
    canvas = cnv;
    baseX = cnv.position().x;
    baseY = cnv.position().y;
    grid.setBase(baseX, baseY);
    grid.mount();
    grid.setVisible(true);
    controls.sizeLabel = makeLabel(P, "Vertices", { size: 14, color: CHALK_TEXT });
    controls.stepper = makeStepper(P, {
      value: size,
      min: 1,
      max: maxSize,
      onChange: (value) => setSize(value, { grow: true }),
    });
    controls.random = makeButton(P, "Random", {
      kind: "ghost",
      width: 100,
      height: 30,
      onPress: () => randomize(),
    });
    controls.clear = makeButton(P, "Clear", {
      kind: "ghost",
      width: 88,
      height: 30,
      onPress: () => clear(),
    });

    layout();
  }

  function layout() {
    grid.setBase(baseX, baseY);
    grid.position();
    if (controls.sizeLabel)
      controls.sizeLabel.position(baseX + LAYOUT.sizeLabel.x, baseY + LAYOUT.sizeLabel.y);
    controls.stepper.layout(baseX + LAYOUT.stepper.x, baseY + LAYOUT.stepper.y);
    if (controls.random)
      controls.random.position(baseX + LAYOUT.random.x, baseY + LAYOUT.random.y);
    if (controls.clear)
      controls.clear.position(baseX + LAYOUT.clear.x, baseY + LAYOUT.clear.y);
  }

  /** The wrapper is centred, so a resize moves the canvas under the grid. */
  function handleResize() {
    if (canvas) {
      baseX = canvas.position().x;
      baseY = canvas.position().y;
    }
    layout();
  }

  function destroy() {
    grid.destroy();
    Object.values(controls).forEach((control) => {
      if (control && control.remove) control.remove();
    });
  }

  return {
    attach,
    layout,
    layoutGraph,
    drawHeaders,
    press,
    handleResize,
    setSize,
    randomize,
    clear,
    destroy,
    directed,
    weighted,
    get size() {
      return size;
    },
    get matrix() {
      return matrix;
    },
    get nodes() {
      return nodes;
    },
    radius: () => nodeRadius(size),
    diameter: () => nodeDiameter(size),
    gridBottom: () => {
      const { pitch } = grid.layout();
      return LAYOUT.grid.y + size * pitch;
    },
    positions: LAYOUT,
  };
}
