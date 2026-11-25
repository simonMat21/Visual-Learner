/**
 * Minimal slide-out adjacency matrix editor.
 *
 * A slimmer cousin of GraphInputPanel: matrix only, no tabs or edge list. It
 * stays off the board until it is opened, then slides in from the right edge
 * so the graph on the left stays visible (and updates live) while you type.
 *
 *   const drawer = new MatrixDrawer(P, { directed: false, weighted: true, ... });
 *   drawer.attach(canvas);
 *   // in draw(): drawer.update(); ...draw your scene...; drawer.draw();
 *   // in mousePressed(): if (drawer.press(x, y)) return;
 */

import { emptyMatrix, resizeMatrix, countEdges } from "@/lib/graphModel";
import { drawMatrixHeaders, hitHeader } from "@/lib/graphDraw";
import { CHALK_TEXT, MatrixGrid, makeButton, makeLabel, makeStepper } from "@/lib/graphDom";
import { BOARD_LIGHT, CHALK, HIGHLIGHT } from "@/lib/boardPalette";

const GRID = { x: 48, y: 134 };
// cells shrink so the grid always ends above the buttons at the bottom
const cellFor = (size, height = 500) =>
  Math.min(34, 300 / Math.max(1, size), (height - GRID.y - 70) / Math.max(1, size) - 4);

export class MatrixDrawer {
  /**
   * @param P p5 instance
   * @param {{directed?:boolean, weighted?:boolean, maxSize?:number, defaultSize?:number,
   *          width?:number, height?:number, canvasWidth?:number, title?:string, subtitle?:string,
   *          random?:(n:number)=>number[][], example?:()=>number[][],
   *          onChange?:(matrix:number[][], size:number)=>void, onToggle?:(open:boolean)=>void}} opts
   */
  constructor(P, opts = {}) {
    this.P = P;
    this.opts = { directed: false, weighted: true, maxSize: 8, width: 400, height: 500, ...opts };
    this.size = this.opts.defaultSize ?? 5;
    this.matrix = emptyMatrix(this.size);
    this.isOpen = false;
    this.right = this.opts.canvasWidth ?? P.width;
    this.offset = this.opts.width + 12; // 0 = fully open, width = fully hidden
    this.baseX = 0;
    this.baseY = 0;
    this.headerRegions = [];
    this.el = {};
    this.onKey = this.onKey.bind(this);
  }

  get x() {
    return this.right - this.opts.width + this.offset;
  }

  // ------------------------------------------------------------ lifecycle

  attach(cnv) {
    const P = this.P;
    this.cnv = cnv;
    this.right = cnv.width;
    this.baseX = cnv.position().x;
    this.baseY = cnv.position().y;

    this.el.title = makeLabel(P, this.opts.title ?? "Edit graph", { size: 17, color: CHALK_TEXT });
    this.el.subtitle = makeLabel(P, this.opts.subtitle ?? "type a weight in a cell · 0 = no edge · it is mirrored for you", {
      size: 12,
      weight: "normal",
      color: "#b4beb8",
    });
    this.el.count = makeLabel(P, "", { size: 13, weight: "normal", color: "#b4beb8" });
    this.el.close = makeButton(P, "✕", {
      kind: "ghost",
      width: 30,
      height: 30,
      padding: "0",
      title: "Close (Esc)",
      onPress: () => this.close(),
    });
    this.el.sizeLabel = makeLabel(P, "Vertices", { size: 14, color: CHALK_TEXT });
    this.el.stepper = makeStepper(P, {
      value: this.size,
      min: 1,
      max: this.opts.maxSize,
      onChange: (value) => this.setSize(value),
    });

    const small = { kind: "ghost", height: 32, padding: "0", size: 13 };
    this.el.random = makeButton(P, "Random", { ...small, width: 82, onPress: () => this.random() });
    if (this.opts.example)
      this.el.example = makeButton(P, "Example", { ...small, width: 82, onPress: () => this.load(this.opts.example()) });
    this.el.clear = makeButton(P, "Clear", { ...small, width: 70, onPress: () => this.clear() });
    this.el.done = makeButton(P, "Done", { kind: "accent", width: 80, height: 32, padding: "0", onPress: () => this.close() });

    this.grid = new MatrixGrid(P, {
      size: this.size,
      matrix: this.matrix,
      weighted: this.opts.weighted,
      directed: this.opts.directed,
      cell: (size) => cellFor(size, this.opts.height),
      originX: GRID.x,
      originY: GRID.y,
      gutter: 26,
      onChange: () => this.changed(),
    });
    this.grid.mount();

    this.setVisible(false);
    this.refreshSubtitle();
    this.layout();
  }

  destroy() {
    window.removeEventListener("keydown", this.onKey);
    if (this.grid) this.grid.destroy();
    Object.values(this.el).forEach((e) => {
      if (e && e.remove) e.remove();
    });
    if (this.el.stepper) this.el.stepper.setVisible(false);
    this.el = {};
  }

  // ------------------------------------------------------------ open / close

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.setVisible(true);
    window.addEventListener("keydown", this.onKey);
    this.opts.onToggle?.(true);
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    window.removeEventListener("keydown", this.onKey);
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    this.opts.onToggle?.(false);
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  onKey(event) {
    if (event.key === "Escape") this.close();
  }

  setVisible(visible) {
    const display = visible ? "block" : "none";
    Object.entries(this.el).forEach(([key, e]) => {
      if (key === "stepper") e.setVisible(visible);
      else if (e && e.style) e.style("display", display);
    });
    if (this.grid) this.grid.setVisible(visible);
    this.visible = visible;
  }

  // ------------------------------------------------------------ data

  changed() {
    this.refreshSubtitle();
    this.opts.onChange?.(this.matrix, this.size);
  }

  refreshSubtitle() {
    if (!this.el.count) return;
    const edges = countEdges(this.matrix, { directed: this.opts.directed });
    this.el.count.html(`${edges} edge${edges === 1 ? "" : "s"}`);
  }

  setSize(next) {
    const size = Math.min(this.opts.maxSize, Math.max(1, next));
    if (size === this.size) return;
    this.size = size;
    this.matrix = resizeMatrix(this.matrix, size, this.opts.weighted);
    this.remount();
    this.changed();
  }

  load(matrix) {
    this.size = Math.min(this.opts.maxSize, Math.max(1, matrix.length));
    this.matrix = resizeMatrix(matrix, this.size, this.opts.weighted);
    this.remount();
    this.changed();
  }

  random() {
    if (this.opts.random) this.load(this.opts.random(this.size));
  }

  clear() {
    this.load(emptyMatrix(this.size));
  }

  remount() {
    if (!this.grid) return;
    this.grid.size = this.size;
    this.grid.matrix = this.matrix;
    this.grid.focus = { i: 0, j: 0 };
    this.grid.mount(); // stays hidden if the drawer is closed
    this.el.stepper?.set(this.size, true);
    this.layout();
  }

  // ------------------------------------------------------------ frame

  /** Slide towards the target; call once per frame before drawing. */
  update() {
    const target = this.isOpen ? 0 : this.opts.width + 12;
    if (Math.abs(this.offset - target) < 0.5) {
      if (this.offset !== target) {
        this.offset = target;
        this.layout();
      }
      if (!this.isOpen && this.visible) this.setVisible(false);
      return;
    }
    this.offset = this.P.lerp(this.offset, target, 0.2);
    this.layout();
  }

  layout() {
    if (!this.cnv) return;
    const x = this.baseX + this.x;
    const y = this.baseY;
    const at = (e, lx, ly) => e && e.position(x + lx, y + ly);
    at(this.el.title, 22, 16);
    at(this.el.subtitle, 22, 40);
    at(this.el.close, this.opts.width - 44, 16);
    at(this.el.sizeLabel, 22, 74);
    this.el.stepper?.layout(x + 100, y + 62);
    at(this.el.count, 206, 74);
    let bx = 22;
    ["random", "example", "clear"].forEach((name) => {
      const b = this.el[name];
      if (!b) return;
      at(b, bx, this.opts.height - 52);
      bx += parseFloat(b.elt.style.width) + 6;
    });
    at(this.el.done, this.opts.width - 102, this.opts.height - 52);
    if (this.grid) {
      this.grid.setBase(x, y);
      this.grid.position();
    }
  }

  /** The canvas can move under the controls (resize, layout shift). */
  follow() {
    if (!this.cnv) return;
    const { x, y } = this.cnv.position();
    if (x !== this.baseX || y !== this.baseY) {
      this.baseX = x;
      this.baseY = y;
      this.layout();
    }
  }

  /** Drawer background and the row / column numbers; call after the scene. */
  draw() {
    if (!this.visible) {
      this.headerRegions = [];
      return;
    }
    const P = this.P;
    const x = this.x;
    const { width, height } = this.opts;
    P.push();
    P.noStroke();
    P.fill(0, 0, 0, 70);
    P.rect(x - 8, 0, 8, height);
    P.fill(BOARD_LIGHT[0] + 4, BOARD_LIGHT[1] + 6, BOARD_LIGHT[2] + 5);
    P.rect(x, 0, width + 12, height, 12, 0, 0, 12);
    P.fill(...HIGHLIGHT);
    P.rect(x, 0, 4, height, 2);
    P.stroke(CHALK[0], CHALK[1], CHALK[2], 40);
    P.line(x + 20, 104, x + width - 20, 104);
    P.pop();

    const { pitch, cell } = this.grid.layout();
    this.headerRegions = drawMatrixHeaders(P, {
      size: this.size,
      originX: x + GRID.x,
      originY: GRID.y,
      pitch,
      cell,
      highlight: this.grid.active ? { row: this.grid.active.i, col: this.grid.active.j } : null,
      gutter: 26,
    });
  }

  /** Clicks inside the drawer belong to it (header numbers fill a line). */
  press(px, py) {
    if (!this.visible) return false;
    if (px < this.x) return false;
    const region = hitHeader(this.headerRegions, px, py);
    if (region) {
      let filled = false;
      for (let k = 0; k < this.size; k++) {
        const i = region.kind === "row" ? region.index : k;
        const j = region.kind === "row" ? k : region.index;
        if (this.matrix[i][j] !== 0) filled = true;
      }
      this.grid.setLine(region.kind, region.index, filled ? 0 : 1);
    }
    return true;
  }
}
