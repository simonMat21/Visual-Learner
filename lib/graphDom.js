// Shared HTML controls for the p5 graph sketches. The board is a canvas, but
// the inputs are real DOM elements layered on top of it, so they are styled here
// to look the same on every graph page.

import { HIGHLIGHT } from "./boardPalette";

export const PAPER = "#f6f2e9";
export const CHALK_TEXT = "#f1ede2";
export const RULE = "#7d9088";
export const INK_TEXT = "#1d2320";
export const GOOD = "#7fd196";
export const BAD = "#f08068";
export const HILITE = `rgb(${HIGHLIGHT[0]}, ${HIGHLIGHT[1]}, ${HIGHLIGHT[2]})`;

const GHOST = {
  color: CHALK_TEXT,
  background: "transparent",
  border: RULE,
};

const SOLID = {
  color: INK_TEXT,
  background: CHALK_TEXT,
  border: CHALK_TEXT,
};

const ACCENT = {
  color: INK_TEXT,
  background: HILITE,
  border: HILITE,
};

const KINDS = { ghost: GHOST, solid: SOLID, accent: ACCENT };

export function styleButton(el, kind = "ghost", opts = {}) {
  const tone = KINDS[kind] || GHOST;
  const size = opts.size || 14;
  el.style("font-size", size + "px");
  el.style("font-weight", opts.bold === false ? "normal" : "bold");
  el.style("padding", (opts.padding || "8px 14px"));
  el.style("color", tone.color);
  el.style("background-color", tone.background);
  el.style("border", "2px solid " + tone.border);
  el.style("border-radius", (opts.radius || 6) + "px");
  el.style("cursor", "pointer");
  el.style("margin", "0");
  el.style("line-height", "1.1");
  if (opts.active) {
    el.style("background-color", tone.border);
    el.style("color", tone.border === CHALK_TEXT ? INK_TEXT : CHALK_TEXT);
  }
}

export function styleField(el, opts = {}) {
  el.style("font-size", (opts.size || 13) + "px");
  el.style("font-weight", "bold");
  el.style("border", "2px solid " + (opts.border || RULE));
  el.style("border-radius", "4px");
  el.style("background-color", opts.background || PAPER);
  el.style("color", opts.color || INK_TEXT);
  el.style("padding", "2px");
  el.style("margin", "0");
  el.style("outline", "none");
  el.style("box-sizing", "border-box");
  if (opts.align) el.style("text-align", opts.align);
}

export function styleLabel(el, opts = {}) {
  el.style("font-size", (opts.size || 14) + "px");
  el.style("color", opts.color || INK_TEXT);
  el.style("font-weight", opts.weight || "bold");
  el.style("margin", "0");
  el.style("line-height", "1.2");
}

/**
 * A button plus its DOM node, so callers can set position and listeners.
 */
export function makeButton(P, label, opts = {}) {
  const el = P.createButton(label);
  styleButton(el, opts.kind || "ghost", opts);
  if (opts.width) el.style("width", opts.width + "px");
  if (opts.height) el.style("height", opts.height + "px");
  if (opts.title) el.attribute("title", opts.title);
  if (opts.onPress) el.mousePressed(opts.onPress);
  return el;
}

export function makeLabel(P, text, opts = {}) {
  const el = P.createP(text);
  styleLabel(el, opts);
  return el;
}

/**
 * − [ n ] + stepper, kept in sync with the value it owns.
 */
export function makeStepper(P, opts = {}) {
  const min = opts.min ?? 1;
  const max = opts.max ?? 8;
  let value = Math.min(max, Math.max(min, opts.value ?? 5));

  const minus = makeButton(P, "\u2212", { kind: "ghost", width: 28, height: 28, padding: "0", onPress: () => set(value - 1) });
  const valueBox = P.createP(String(value));
  styleLabel(valueBox, { size: 15 });
  valueBox.style("width", "34px");
  valueBox.style("text-align", "center");
  valueBox.style("border", "2px solid " + RULE);
  valueBox.style("border-radius", "4px");
  valueBox.style("background-color", PAPER);
  valueBox.style("padding-top", "4px");
  const plus = makeButton(P, "+", { kind: "ghost", width: 28, height: 28, padding: "0", onPress: () => set(value + 1) });

  function set(next, silent = false) {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped === value && silent) return;
    value = clamped;
    valueBox.html(String(value));
    if (!silent && opts.onChange) opts.onChange(value);
  }

  function layout(baseX, y) {
    minus.position(baseX, y);
    valueBox.position(baseX + 30, y - 1);
    plus.position(baseX + 66, y);
  }

  function setVisible(visible) {
    const display = visible ? "block" : "none";
    minus.style("display", display);
    valueBox.style("display", display);
    plus.style("display", display);
  }

  return {
    layout,
    setVisible,
    get value() {
      return value;
    },
    set,
  };
}

/**
 * The clickable adjacency matrix.
 *
 * - click a cell to toggle it, drag to paint a whole run of cells
 * - right click a cell to clear it
 * - click a row or column header to fill/clear that line
 * - arrow keys move, space toggles, delete clears
 *
 * Weighted graphs swap the cells for number inputs instead.
 */
export class MatrixGrid {
  constructor(P, opts) {
    this.P = P;
    this.opts = opts;
    this.size = opts.size;
    this.matrix = opts.matrix;
    this.weighted = !!opts.weighted;
    this.directed = opts.directed !== false;
    this.onChange = opts.onChange;
    this.baseX = opts.baseX || 0;
    this.baseY = opts.baseY || 0;
    this.originX = opts.originX ?? 0;
    this.originY = opts.originY ?? 0;
    this.gutter = opts.gutter ?? 26;
    this.cells = [];
    this.focus = { i: 0, j: 0 };
    this.cellFocused = false;
    this.painting = false;
    this.paintValue = 0;
    this.visible = false;
    this.listeners = [];

    this.onKeyDown = this.onKeyDown.bind(this);
    this.endPaint = this.endPaint.bind(this);
  }

  layout() {
    const size = this.size;
    const cell =
      typeof this.opts.cell === "function"
        ? this.opts.cell(size)
        : this.opts.cell ?? Math.min(38, 300 / Math.max(1, size));
    const pitch = this.opts.pitch ?? cell + (this.opts.gap ?? 4);
    return { cell, pitch, originX: this.originX, originY: this.originY, gutter: this.gutter, size };
  }

  setOrigin(x, y) {
    this.originX = x;
    this.originY = y;
  }

  setBase(x, y) {
    this.baseX = x;
    this.baseY = y;
  }

  setVisible(visible) {
    this.visible = visible;
    this.cells.flat().forEach((cell) => cell && cell.style("display", visible ? "block" : "none"));
  }

  destroy() {
    this.cells.flat().forEach((cell) => cell && cell.remove());
    this.cells = [];
    this.cellFocused = false;
    this.painting = false;
    this.listeners.forEach(({ target, type, handler }) =>
      target.removeEventListener(type, handler)
    );
    this.listeners = [];
  }

  on(target, type, handler) {
    target.addEventListener(type, handler);
    this.listeners.push({ target, type, handler });
  }

  isLocked(i, j) {
    if (this.weighted) return false;
    return !this.directed && j < i;
  }

  mount() {
    this.destroy();
    const { cell, pitch } = this.layout();
    const P = this.P;

    for (let i = 0; i < this.size; i++) {
      this.cells[i] = [];
      for (let j = 0; j < this.size; j++) {
        const element = this.weighted
          ? this.createWeightedCell(i, j, cell)
          : this.createToggleCell(i, j, cell);
        element.elt.tabIndex = 0;
        this.on(element.elt, "focus", () => {
          this.focus = { i, j };
          this.cellFocused = true;
        });
        this.on(element.elt, "blur", () => {
          this.cellFocused = false;
        });
        this.cells[i][j] = element;
      }
    }

    // p5 cancels the compatibility mouse events on pointerdown, so the drag has
    // to be tracked with pointer events or painting never stops.
    this.on(window, "pointerup", this.endPaint);
    this.on(window, "pointercancel", this.endPaint);
    this.on(window, "blur", this.endPaint);
    this.on(window, "keydown", this.onKeyDown);
    this.position();
    this.refresh();
    // a remount (size change) must not reveal a grid that is meant to be hidden
    if (!this.visible) this.setVisible(false);
  }

  createToggleCell(i, j, cell) {
    const P = this.P;
    const el = P.createButton("0");
    el.style("width", cell + "px");
    el.style("height", cell + "px");
    el.style("font-size", Math.min(14, cell / 2.5) + "px");
    el.style("font-weight", "bold");
    el.style("border", "2px solid " + RULE);
    el.style("border-radius", "4px");
    el.style("cursor", "pointer");
    el.style("margin", "0");
    el.style("padding", "0");
    el.style("line-height", "1");

    el.mousePressed(() => {
      // p5 cancels the default pointerdown action, so focus has to be set here
      this.focusCell(i, j);
      if (this.isLocked(i, j)) return;
      this.painting = true;
      this.paintValue = this.matrix[i][j] ? 0 : 1;
      this.setCell(i, j, this.paintValue);
    });
    el.mouseOver(() => {
      if (this.painting && !this.isLocked(i, j)) this.setCell(i, j, this.paintValue);
    });
    this.on(el.elt, "contextmenu", (event) => {
      event.preventDefault();
      this.painting = false;
      this.setCell(i, j, 0);
    });

    return el;
  }

  createWeightedCell(i, j, cell) {
    const P = this.P;
    const el = P.createInput(String(this.matrix[i][j]));
    el.attribute("type", "number");
    el.attribute("step", "1");
    styleField(el, { size: Math.min(12, cell / 3), align: "center" });
    el.style("width", cell + "px");
    el.style("height", cell + "px");
    el.mousePressed(() => {
      this.focusCell(i, j);
      // select what is in the cell so typing replaces it instead of adding to it
      el.elt.select();
    });
    el.input(() => {
      const value = parseFloat(el.value());
      this.setCell(i, j, Number.isNaN(value) ? 0 : value, false);
    });
    this.on(el.elt, "contextmenu", (event) => {
      event.preventDefault();
      el.elt.value = "0";
      this.setCell(i, j, 0);
    });
    return el;
  }

  endPaint() {
    this.painting = false;
  }

  setCell(i, j, value, refresh = true) {
    if (this.isLocked(i, j)) return;
    this.matrix[i][j] = this.weighted ? value : value ? 1 : 0;
    if (!this.directed && i !== j) this.matrix[j][i] = this.matrix[i][j];
    if (refresh) this.refresh(i, j);
    if (this.onChange) this.onChange(this.matrix, { i, j });
  }

  /** Fill or clear a whole line, used by the header buttons. */
  setLine(kind, index, value) {
    for (let k = 0; k < this.size; k++) {
      const i = kind === "row" ? index : k;
      const j = kind === "row" ? k : index;
      this.matrix[i][j] = value ? 1 : 0;
    }
    if (!this.directed && !this.weighted) {
      for (let a = 0; a < this.size; a++) {
        for (let b = 0; b < this.size; b++) {
          if (this.matrix[a][b]) this.matrix[b][a] = 1;
        }
      }
    }
    this.refresh();
    if (this.onChange) this.onChange(this.matrix, null);
  }

  refresh(...only) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const cell = this.cells[i] && this.cells[i][j];
        if (!cell) continue;
        if (only.length && !only.includes(i) && !only.includes(j)) continue;
        this.paint(i, j, cell);
      }
    }
  }

  paint(i, j, cell) {
    const value = this.matrix[i][j];
    if (this.weighted) {
      if (document.activeElement !== cell.elt) cell.value(String(value));
      cell.style("background-color", value === 0 ? PAPER : value < 0 ? BAD : GOOD);
      cell.style("color", value === 0 ? INK_TEXT : CHALK_TEXT);
      return;
    }

    cell.html(value ? "1" : "0");
    const locked = this.isLocked(i, j);
    cell.style("background-color", value ? GOOD : PAPER);
    cell.style("color", value ? INK_TEXT : RULE);
    cell.style("cursor", locked ? "not-allowed" : "pointer");
    cell.style("border", "2px solid " + (locked && !value ? "#c8c2b4" : RULE));
  }

  position() {
    const { cell, pitch } = this.layout();
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const element = this.cells[i] && this.cells[i][j];
        if (!element) continue;
        element.position(
          this.baseX + this.originX + j * pitch,
          this.baseY + this.originY + i * pitch
        );
      }
    }
  }

  focusCell(i, j) {
    const cell = this.cells[i] && this.cells[i][j];
    if (!cell) return;
    this.focus = { i, j };
    cell.elt.focus();
  }

  onKeyDown(event) {
    if (!this.visible || !this.cellFocused) return;
    const tag = event.target && event.target.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA";
    if (typing && event.key !== "Escape") return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const { i, j } = this.focus;
    const moves = {
      ArrowUp: [i - 1, j],
      ArrowDown: [i + 1, j],
      ArrowLeft: [i, j - 1],
      ArrowRight: [i, j + 1],
    };

    if (moves[event.key]) {
      event.preventDefault();
      const [ni, nj] = moves[event.key];
      this.focusCell(
        Math.min(this.size - 1, Math.max(0, ni)),
        Math.min(this.size - 1, Math.max(0, nj))
      );
      return;
    }

    if (this.weighted) return;

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      this.setCell(i, j, this.matrix[i][j] ? 0 : 1);
    } else if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      this.setCell(i, j, 0);
    }
  }
}
