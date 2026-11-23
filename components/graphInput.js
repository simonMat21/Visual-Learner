/**
 * Graph input panel.
 *
 * Two ways in, both editing the same adjacency matrix:
 *
 *   Edge list  one text box: "0-1, 0->2, 1-3" (weights: "0-1:4"). Parsed as you
 *              type, the vertex count grows to fit, and every edge appears as a
 *              chip you can click to remove.
 *   Matrix     the classic grid, upgraded: click to toggle, drag to paint,
 *              right click to clear, click a row/column number to fill or clear
 *              that line, arrow keys to move and space to toggle.
 *
 * Plus a vertex stepper, one click shapes and a random graph. The panel slides
 * in from the left so the graph stays visible while it is being edited.
 */

import {
  countEdges,
  edgeListFromMatrix,
  emptyMatrix,
  matrixFromEdges,
  parseEdgeList,
  PRESETS,
  randomMatrix,
  resizeMatrix,
} from "@/lib/graphModel";
import { drawMatrixHeaders, hitHeader } from "@/lib/graphDraw";
import {
  INK_TEXT,
  MatrixGrid,
  makeButton,
  makeLabel,
  makeStepper,
  PAPER,
  RULE,
  styleField,
} from "@/lib/graphDom";

const PANEL_WIDTH = 430;
const PANEL_HEIGHT = 500;
const CLOSED_OFFSET = -PANEL_WIDTH - 10;
const WARN = "#b3543f";

const PANEL_PAPER = [243, 241, 235];
const GRID = { originX: 46, originY: 164 };
const FOOTER_Y = 422;

export class GraphInputPanel {
  constructor(P, opts = {}) {
    this.P = P;
    this.opts = {
      directed: true,
      weighted: false,
      maxSize: 8,
      density: 0.3,
      title: "Input Graph",
      ...opts,
    };
    this.callbacks = opts.callbacks || {};

    this.size = this.opts.defaultSize ?? 5;
    this.matrix = emptyMatrix(this.size);
    this.tab = "edges";
    this.isOpen = false;
    this.panelOffset = CLOSED_OFFSET;
    this.targetOffset = CLOSED_OFFSET;
    this.animationSpeed = 0.15;
    this.baseX = 0;
    this.baseY = 0;
    this.headerRegions = [];
    this.notes = [];

    this.grid = null;
    this.elements = {};

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  get directed() {
    return this.opts.directed;
  }

  get weighted() {
    return this.opts.weighted;
  }

  get modeText() {
    const shape = this.directed ? "directed" : "undirected";
    const weight = this.weighted ? "weighted " : "";
    return `${weight}${shape} graph \u00b7 vertices 0\u2013${Math.max(0, this.size - 1)}`;
  }

  get exampleText() {
    if (this.weighted) return "One edge per entry, weight after a colon: 0-1:4, 0->2:7";
    if (this.directed) return "One edge per entry: 0-1, 0->2, 1-3";
    return "One edge per entry, direction ignored: 0-1, 0-2, 1-3";
  }

  get gridHint() {
    const base = "Click to toggle \u00b7 drag to paint \u00b7 right click clears";
    const undirected = this.directed ? "" : " \u00b7 lower triangle locked";
    return this.weighted
      ? "Type a weight in any cell, 0 means no edge \u00b7 right click clears"
      : base + undirected + " \u00b7 arrow keys + space";
  }

  get matrixLegend() {
    return this.weighted
      ? "Cell = edge weight, 0 means no edge."
      : "Cell = 1 when an edge exists. Click a row or column number to fill or clear that line.";
  }

  // ---------------------------------------------------------------- elements

  createInputElements(cnv) {
    this.cnv = cnv;
    this.baseX = cnv.position().x;
    this.baseY = cnv.position().y;
    const P = this.P;

    this.elements.openButton = makeButton(P, "Input Graph", {
      kind: "ghost",
      size: 15,
      padding: "9px 18px",
      onPress: () => this.showInputPanel(),
    });

    this.elements.title = makeLabel(P, this.opts.title, { size: 16 });
    this.elements.mode = makeLabel(P, this.modeText, {
      size: 12,
      weight: "normal",
      color: RULE,
    });

    this.elements.edgeTab = makeButton(P, "Edge list", {
      kind: "solid",
      width: 118,
      height: 30,
      onPress: () => this.setTab("edges"),
    });
    this.elements.matrixTab = makeButton(P, "Matrix", {
      kind: "solid",
      width: 100,
      height: 30,
      onPress: () => this.setTab("matrix"),
    });

    this.elements.hint = makeLabel(P, this.exampleText, {
      size: 12,
      weight: "normal",
      color: RULE,
    });

    this.elements.textarea = P.createElement("textarea");
    this.elements.textarea.attribute("spellcheck", "false");
    this.elements.textarea.attribute("aria-label", "Edge list, for example 0-1, 0-2, 1-3");
    styleField(this.elements.textarea, { size: 13, align: "left" });
    const area = this.elements.textarea.elt;
    area.style.height = "84px";
    area.style.width = "390px";
    area.style.resize = "none";
    area.style.lineHeight = "1.5";
    area.style.padding = "8px 10px";
    this.elements.textarea.input(() => this.applyText());

    this.elements.status = makeLabel(P, "", {
      size: 12,
      weight: "normal",
      color: RULE,
    });

    this.elements.chipsLabel = makeLabel(P, "Edges \u2014 click to remove", {
      size: 12,
      weight: "normal",
      color: RULE,
    });

    this.elements.chipBox = P.createDiv("");
    const box = this.elements.chipBox.elt;
    box.style.position = "absolute";
    box.style.width = "390px";
    box.style.height = "80px";
    box.style.overflowY = "auto";
    box.style.overflowX = "hidden";
    box.style.display = "flex";
    box.style.flexWrap = "wrap";
    box.style.alignContent = "flex-start";
    box.style.gap = "5px";

    this.elements.presets = PRESETS.map((preset) =>
      makeButton(P, preset.label, {
        kind: "ghost",
        size: 13,
        width: 74,
        height: 28,
        padding: "0",
        title: `${preset.label} graph`,
        onPress: () => this.applyPreset(preset.id),
      })
    );

    this.elements.tip = makeLabel(
      P,
      "Tip: name a vertex above the current size and the graph grows to fit.",
      { size: 12, weight: "normal", color: RULE }
    );

    this.elements.gridHint = makeLabel(P, this.gridHint, {
      size: 12,
      weight: "normal",
      color: RULE,
    });
    this.elements.matrixLegend = makeLabel(P, this.matrixLegend, {
      size: 12,
      weight: "normal",
      color: RULE,
    });

    this.elements.sizeLabel = makeLabel(P, "Vertices", { size: 14 });
    this.elements.stepper = makeStepper(P, {
      value: this.size,
      min: 1,
      max: this.opts.maxSize,
      onChange: (value) => this.setSize(value),
    });

    this.elements.randomButton = makeButton(P, "Random", {
      kind: "ghost",
      width: 100,
      height: 32,
      onPress: () => this.generateRandomGraph(),
    });
    this.elements.clearButton = makeButton(P, "Clear all", {
      kind: "ghost",
      width: 104,
      height: 32,
      onPress: () => this.clearGraph(),
    });
    this.elements.doneButton = makeButton(P, "Done", {
      kind: "accent",
      width: 98,
      height: 32,
      onPress: () => this.hideInputPanel(),
    });

    this.buildGrid();
    this.setTab("edges");
    this.refreshAll();
    this.layout();
    this.setPanelVisible(false);
    this.elements.openButton.style("display", "block");
  }

  /** The wrapper is centred, so a resize moves the canvas under the panel. */
  handleResize() {
    if (this.cnv) {
      this.baseX = this.cnv.position().x;
      this.baseY = this.cnv.position().y;
    }
    this.layout();
  }

  buildGrid() {
    this.grid = new MatrixGrid(this.P, {
      size: this.size,
      matrix: this.matrix,
      weighted: this.weighted,
      directed: this.directed,
      cell: (size) => Math.min(28, 250 / Math.max(1, size)),
      originX: GRID.originX,
      originY: GRID.originY,
      gutter: 26,
      onChange: () => this.commit({ source: "grid" }),
    });
    this.grid.mount();
  }

  // ------------------------------------------------------------------ layout

  setPanelVisible(visible) {
    Object.entries(this.elements).forEach(([key, element]) => {
      if (key === "openButton") return;
      if (Array.isArray(element)) {
        element.forEach((item) => item && item.style("display", visible ? "block" : "none"));
        return;
      }
      if (element && element.style) element.style("display", visible ? "block" : "none");
    });
    if (this.elements.stepper) this.elements.stepper.setVisible(visible);
    if (this.grid) this.grid.setVisible(visible);
  }

  layout() {
    const { elements } = this;
    const x = this.panelOffset;
    const at = (element, localX, localY) =>
      element && element.position(this.baseX + x + localX, this.baseY + localY);

    at(elements.title, 20, 12);
    at(elements.mode, 20, 32);
    at(elements.edgeTab, 20, 56);
    at(elements.matrixTab, 144, 56);

    at(elements.hint, 20, 98);
    at(elements.textarea, 20, 116);
    at(elements.status, 20, 208);
    at(elements.chipsLabel, 20, 228);
    at(elements.chipBox, 20, 244);
    elements.presets.forEach((button, index) => at(button, 20 + index * 78, 332));
    at(elements.tip, 20, 372);

    at(elements.gridHint, 20, 100);
    at(elements.matrixLegend, 20, 120);

    // the closed state only shows this button, so it ignores the panel offset
    if (elements.openButton) {
      elements.openButton.position(this.baseX + 40, this.baseY + 438);
    }

    at(elements.sizeLabel, 20, 446);
    elements.stepper.layout(this.baseX + x + 92, this.baseY + 434);
    at(elements.randomButton, 20, 466);
    at(elements.clearButton, 126, 466);
    at(elements.doneButton, 312, 466);

    if (this.grid) {
      this.grid.setOrigin(GRID.originX, GRID.originY);
      this.grid.setBase(this.baseX + x, this.baseY);
      this.grid.position();
    }
  }

  setTab(tab) {
    this.tab = tab;
    const isEdges = tab === "edges";
    const { elements } = this;
    const show = (element, visible) =>
      element && element.style("display", visible ? "block" : "none");

    [elements.hint, elements.textarea, elements.status, elements.chipsLabel, elements.chipBox, elements.tip]
      .forEach((element) => show(element, isEdges));
    elements.presets.forEach((button) => show(button, isEdges));
    [elements.gridHint, elements.matrixLegend].forEach((element) => show(element, !isEdges));

    if (elements.edgeTab) elements.edgeTab.html(isEdges ? "\u25cf  Edge list" : "Edge list");
    if (elements.matrixTab) elements.matrixTab.html(isEdges ? "Matrix" : "\u25cf  Matrix");
    if (elements.hint) elements.hint.html(this.exampleText);
    if (elements.gridHint) elements.gridHint.html(this.gridHint);
    if (elements.matrixLegend) elements.matrixLegend.html(this.matrixLegend);
    if (this.grid) this.grid.setVisible(this.isOpen && !isEdges);
  }

  // ------------------------------------------------------------------- panel

  showInputPanel() {
    this.isOpen = true;
    this.targetOffset = 0;
    this.setPanelVisible(true);
    this.setTab(this.tab);
    this.elements.openButton.style("display", "none");
    window.addEventListener("keydown", this.onKeyDown);
    if (this.callbacks.onOpen) this.callbacks.onOpen();
  }

  hideInputPanel() {
    this.isOpen = false;
    this.targetOffset = CLOSED_OFFSET;
    if (this.grid) this.grid.setVisible(false);
    window.removeEventListener("keydown", this.onKeyDown);
    setTimeout(() => {
      if (this.isOpen) return;
      this.setPanelVisible(false);
      if (this.elements.openButton) {
        this.elements.openButton.style("display", "block");
      }
    }, 320);
    if (this.callbacks.onClose) this.callbacks.onClose();
  }

  updatePanelAnimation() {
    const animating = this.isOpen || this.panelOffset > CLOSED_OFFSET + 8;
    this.panelOffset = this.P.lerp(
      this.panelOffset,
      this.targetOffset,
      this.animationSpeed
    );
    if (animating) this.layout();

    if (this.isOpen && this.tab === "matrix" && this.grid) {
      const { size, originX, originY, pitch, cell, gutter } = this.grid.layout();
      this.headerRegions = drawMatrixHeaders(this.P, {
        size,
        originX: this.panelOffset + originX,
        originY,
        pitch,
        cell,
        gutter,
      });
    } else {
      this.headerRegions = [];
    }
  }

  drawPanelBackground() {
    if (!this.isOpen && this.panelOffset <= CLOSED_OFFSET + 8) return;
    const P = this.P;

    P.push();
    P.noStroke();
    P.fill(0, 0, 0, 55);
    P.rect(this.panelOffset + 6, 4, PANEL_WIDTH, PANEL_HEIGHT, 10);

    P.fill(PANEL_PAPER[0], PANEL_PAPER[1], PANEL_PAPER[2], 246);
    P.stroke(150, 165, 157);
    P.strokeWeight(2);
    P.rect(this.panelOffset, 0, PANEL_WIDTH, PANEL_HEIGHT, 10);

    P.noStroke();
    P.fill(242, 193, 78);
    P.rect(this.panelOffset, 0, 6, PANEL_HEIGHT, 3);

    P.stroke(198, 203, 194);
    P.strokeWeight(1);
    P.line(this.panelOffset + 20, FOOTER_Y, this.panelOffset + PANEL_WIDTH - 20, FOOTER_Y);
    P.pop();
  }

  /** Row and column numbers are drawn on the canvas, so clicks land here. */
  handleCanvasPress(x, y) {
    if (!this.isOpen || this.tab !== "matrix") return false;
    const region = hitHeader(this.headerRegions, x, y);
    if (!region) return false;

    const fill = this.lineHasEdges(region.kind, region.index) ? 0 : 1;
    this.grid.setLine(region.kind, region.index, fill);
    return true;
  }

  lineHasEdges(kind, index) {
    for (let k = 0; k < this.size; k++) {
      const i = kind === "row" ? index : k;
      const j = kind === "row" ? k : index;
      if (this.matrix[i][j] !== 0) return true;
    }
    return false;
  }

  onKeyDown(event) {
    if (event.key === "Escape") this.hideInputPanel();
  }

  // -------------------------------------------------------------------- data

  getMatrix() {
    return this.matrix;
  }

  getMatrixSize() {
    return this.size;
  }

  getIsInputPanelVisible() {
    return this.isOpen;
  }

  getPanelOffset() {
    return this.panelOffset;
  }

  setSize(size) {
    const next = Math.min(this.opts.maxSize, Math.max(1, size));
    if (next === this.size) return;
    this.size = next;
    this.matrix = resizeMatrix(this.matrix, next, this.weighted);
    this.rebuildGrid();
    this.commit({ source: "size", notifySize: true });
  }

  handleMatrixGenerate(newSize) {
    this.size = Math.min(this.opts.maxSize, Math.max(1, newSize));
    this.matrix = emptyMatrix(this.size);
    this.rebuildGrid();
    this.commit({ source: "size", notifySize: true });
  }

  clearGraph() {
    this.matrix = emptyMatrix(this.size);
    this.grid.matrix = this.matrix;
    this.commit({ source: "clear" });
  }

  generateRandomGraph() {
    this.matrix = randomMatrix(
      this.size,
      {
        directed: this.directed,
        weighted: this.weighted,
        density: this.opts.density,
      },
      () => this.P.random()
    );
    this.grid.matrix = this.matrix;
    this.commit({ source: "random" });
  }

  handleRandomGenerate() {
    this.generateRandomGraph();
  }

  applyPreset(id) {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    const edges = preset.build(this.size, { directed: this.directed });
    this.matrix = matrixFromEdges(edges, {
      directed: this.directed,
      weighted: this.weighted,
      minSize: this.size,
    });
    this.grid.matrix = this.matrix;
    this.commit({ source: "preset" });
  }

  /** Parse the text box into a matrix, growing the graph when it needs to. */
  applyText() {
    const text = this.elements.textarea.elt.value;
    const { edges, errors, maxVertex } = parseEdgeList(text, {
      weighted: this.weighted,
    });

    const notes = [...errors];
    if (maxVertex + 1 > this.opts.maxSize) {
      notes.push(`only vertices 0\u2013${this.opts.maxSize - 1} exist`);
    }

    const usable = edges.filter(
      (edge) => edge.from < this.opts.maxSize && edge.to < this.opts.maxSize
    );
    const wanted = Math.min(
      this.opts.maxSize,
      Math.max(this.size, maxVertex + 1)
    );

    this.notes = notes;
    this.matrix = matrixFromEdges(usable, {
      directed: this.directed,
      weighted: this.weighted,
      minSize: wanted,
    });

    if (wanted !== this.size) {
      this.size = wanted;
      this.rebuildGrid();
      this.notifySize();
    } else {
      this.grid.matrix = this.matrix;
      this.grid.refresh();
    }

    this.refreshStatus();
    this.refreshChips();
    this.layout();
    this.notify();
  }

  removeEdge(from, to) {
    this.matrix[from][to] = 0;
    if (!this.directed) this.matrix[to][from] = 0;
    this.notes = [];
    this.commit({ source: "chip" });
  }

  rebuildGrid() {
    this.grid.size = this.size;
    this.grid.matrix = this.matrix;
    this.grid.focus = { i: 0, j: 0 };
    this.grid.mount();
  }

  // ----------------------------------------------------------------- refresh

  commit({ source, notifySize = false } = {}) {
    if (source !== "text") this.renderEdges();
    this.refreshStatus();
    this.refreshChips();
    this.grid.refresh();
    this.layout();
    this.notify();
    if (notifySize) this.notifySize();
  }

  refreshAll() {
    this.renderEdges();
    this.refreshStatus();
    this.refreshChips();
  }

  refreshStatus() {
    const status = this.elements.status;
    if (!status) return;
    if (this.notes.length > 0) {
      status.html(this.notes[0]);
      status.elt.style.color = WARN;
      return;
    }
    const edges = countEdges(this.matrix, { directed: this.directed });
    status.html(
      `${this.size} vertex${this.size === 1 ? "" : "es"} \u00b7 ${edges} edge${edges === 1 ? "" : "s"}`
    );
    status.elt.style.color = RULE;
  }

  notify() {
    if (this.callbacks.onChange) this.callbacks.onChange(this.matrix, this.size);
  }

  notifySize() {
    this.renderMode();
    if (this.callbacks.onSizeChange) this.callbacks.onSizeChange(this.size);
  }

  renderEdges() {
    if (this.elements.textarea) {
      this.elements.textarea.elt.value = edgeListFromMatrix(this.matrix, {
        directed: this.directed,
        weighted: this.weighted,
      });
    }
    this.renderMode();
  }

  renderMode() {
    if (this.elements.mode) this.elements.mode.html(this.modeText);
  }

  refreshChips() {
    const box = this.elements.chipBox;
    if (!box) return;
    box.elt.textContent = "";

    const dash = this.directed ? "\u2192" : "\u2014";
    const list = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.matrix[i][j] === 0) continue;
        if (!this.directed && i > j) continue;
        list.push({ i, j, weight: this.matrix[i][j] });
      }
    }

    if (list.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = "No edges yet \u2014 add some above.";
      empty.style.cssText = `font-size:12px;color:${RULE};padding:6px 2px;`;
      box.elt.appendChild(empty);
      return;
    }

    list.forEach(({ i, j, weight }) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.textContent =
        (this.weighted ? `${i}${dash}${j}:${weight}` : `${i}${dash}${j}`) + "  \u00d7";
      chip.title = "Remove this edge";
      chip.style.cssText = [
        "font:600 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace",
        "padding:6px 9px",
        "border:1px solid " + RULE,
        "border-radius:999px",
        "background:" + PAPER,
        "color:" + INK_TEXT,
        "cursor:pointer",
      ].join(";");
      chip.addEventListener("mouseenter", () => {
        chip.style.background = "#f3ded6";
      });
      chip.addEventListener("mouseleave", () => {
        chip.style.background = PAPER;
      });
      chip.addEventListener("click", () => this.removeEdge(i, j));
      box.elt.appendChild(chip);
    });
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    if (this.grid) this.grid.destroy();
    Object.values(this.elements).forEach((element) => {
      if (Array.isArray(element)) {
        element.forEach((item) => item.remove());
        return;
      }
      if (element && element.remove) element.remove();
    });
    this.elements = {};
  }
}
