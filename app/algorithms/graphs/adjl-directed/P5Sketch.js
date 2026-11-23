"use client";

import { useRef, useEffect } from "react";
import { BOARD, CHALK } from "@/lib/boardPalette";
import {
  drawGraphEdges,
  drawHeading,
  drawNodes,
  drawStats,
  layoutRing,
  nodeRadius,
} from "@/lib/graphDraw";
import {
  CHALK_TEXT,
  makeButton,
  makeLabel,
  makeStepper,
  PAPER,
  RULE,
  styleField,
} from "@/lib/graphDom";

const ROWS = { x: 24, y: 186, pitch: 30, height: 26, width: 210 };

export default function P5Sketch() {
  const sketchRef = useRef(null);

  useEffect(() => {
    let p5Instance = null;
    let cancelled = false;
    import("p5").then((p5Module) => {
      if (cancelled) return;
      const p5 = p5Module.default;

      const sketch = (P) => {
        const maxSize = 8;
        let size = 5;
        let list = [];
        let nodes = [];
        let directed = true;
        let baseX = 0;
        let baseY = 0;
        let canvas = null;
        let rowLabels = [];
        let rowInputs = [];
        const controls = {};

        const emptyList = () => Array.from({ length: size }, () => []);

        function layoutNodes() {
          nodes = layoutRing(P, size, { cx: 700, cy: 250, radius: 130 });
        }

        function edgeCount() {
          let total = 0;
          list.forEach((neighbors) => {
            total += neighbors.length;
          });
          return directed ? total : total / 2;
        }

        function setSize(next) {
          size = Math.min(maxSize, Math.max(1, next));
          list = Array.from({ length: size }, (_, i) => list[i] ?? []);
          buildRows();
          layoutNodes();
        }

        function clearRows() {
          rowLabels.forEach((el) => el.remove());
          rowInputs.forEach((el) => el.remove());
          rowLabels = [];
          rowInputs = [];
        }

        function buildRows() {
          clearRows();
          for (let i = 0; i < size; i++) {
            const label = makeLabel(P, `${i}:`, { size: 14, color: CHALK_TEXT });
            label.elt.style.width = "18px";
            label.elt.style.textAlign = "right";

            const input = P.createInput(list[i].join(", "));
            input.attribute("aria-label", `Neighbours of vertex ${i}`);
            styleField(input, { size: 13, align: "left", background: PAPER });
            input.elt.style.width = ROWS.width + "px";
            input.elt.style.height = ROWS.height + "px";
            input.elt.style.padding = "4px 8px";
            input.elt.style.border = "2px solid " + RULE;
            input.input(() => onRowEdited(i, input.elt.value));

            rowLabels.push(label);
            rowInputs.push(input);
          }
          layout();
        }

        function onRowEdited(vertex, raw) {
          const parsed = [];
          raw
            .split(",")
            .map((part) => part.trim())
            .filter((part) => part !== "")
            .forEach((part) => {
              const value = parseInt(part, 10);
              if (Number.isInteger(value) && value >= 0 && value < size) {
                parsed.push(value);
              }
            });

          const previous = list[vertex];
          list[vertex] = parsed.filter((value, index) => parsed.indexOf(value) === index);

          if (!directed) {
            previous
              .filter((v) => v !== vertex && !parsed.includes(v))
              .forEach((v) => {
                list[v] = list[v].filter((n) => n !== vertex);
              });
            parsed.forEach((v) => {
              if (v !== vertex && !list[v].includes(vertex)) list[v].push(vertex);
            });
            syncRows();
          }
        }

        function syncRows() {
          rowInputs.forEach((input, i) => {
            if (document.activeElement !== input.elt) {
              input.elt.value = list[i].join(", ");
            }
          });
        }

        function randomize() {
          list = emptyList();
          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              if (i === j) continue;
              if (!directed && j < i) continue;
              if (P.random() < 0.3) list[i].push(j);
            }
          }
          if (!directed) {
            for (let i = 0; i < size; i++) {
              for (let j = i + 1; j < size; j++) {
                if (list[i].includes(j)) {
                  list[j].push(i);
                }
              }
            }
          }
          syncRows();
        }

        function clearAll() {
          list = emptyList();
          syncRows();
        }

        function toggleDirection() {
          directed = !directed;
          controls.toggle.html(
            directed ? "Switch to undirected" : "Switch to directed"
          );
          if (!directed) {
            for (let i = 0; i < size; i++) {
              for (const neighbor of [...list[i]]) {
                if (!list[neighbor].includes(i)) list[neighbor].push(i);
              }
            }
          }
          syncRows();
        }

        function layout() {
          rowLabels.forEach((label, i) => {
            label.position(
              baseX + ROWS.x,
              baseY + ROWS.y + i * ROWS.pitch + 5
            );
          });
          rowInputs.forEach((input, i) => {
            input.position(baseX + ROWS.x + 24, baseY + ROWS.y + i * ROWS.pitch);
          });
          if (controls.sizeLabel)
            controls.sizeLabel.position(baseX + 20, baseY + 56);
          controls.stepper.layout(baseX + 96, baseY + 42);
          if (controls.random) controls.random.position(baseX + 224, baseY + 42);
          if (controls.clear) controls.clear.position(baseX + 332, baseY + 42);
          if (controls.toggle) controls.toggle.position(baseX + 20, baseY + 96);
        }

        P.setup = () => {
          const cnv = P.createCanvas(1000, 500);
          canvas = cnv;
          baseX = cnv.position().x;
          baseY = cnv.position().y;

          list = emptyList();

          controls.sizeLabel = makeLabel(P, "Vertices", { size: 14, color: CHALK_TEXT });
          controls.stepper = makeStepper(P, {
            value: size,
            min: 1,
            max: maxSize,
            onChange: (value) => setSize(value),
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
            onPress: () => clearAll(),
          });
          controls.toggle = makeButton(P, "Switch to undirected", {
            kind: "solid",
            width: 176,
            height: 30,
            onPress: () => toggleDirection(),
          });

          buildRows();
          layoutNodes();
        };

        P.windowResized = () => {
          if (canvas) {
            baseX = canvas.position().x;
            baseY = canvas.position().y;
          }
          layout();
        };

        P.draw = () => {
          // follow the canvas if the page shifted after setup
          const pos = canvas.position();
          if (pos.x !== baseX || pos.y !== baseY) {
            baseX = pos.x;
            baseY = pos.y;
            layout();
          }
          P.background(...BOARD);

          // the list drawn through the same helper as the matrix pages
          const matrix = Array.from({ length: size }, () => Array(size).fill(0));
          for (let from = 0; from < size; from++) {
            for (const to of list[from] ?? []) {
              if (to < size) matrix[from][to] = 1;
            }
          }
          const focused = rowInputs.findIndex((input) => document.activeElement === input.elt);
          drawGraphEdges(P, { matrix, nodes, radius: nodeRadius(size), directed });
          drawNodes(P, nodes, { highlight: focused >= 0 ? [focused] : [] });

          drawHeading(P, "Adjacency List", 24, 152);
          drawHeading(
            P,
            "type the neighbours of each vertex, e.g. 1, 3, 4",
            24,
            172,
            { size: 12, color: CHALK }
          );
          drawHeading(P, "Graph", 700, 62, { align: P.CENTER, size: 18 });
          drawStats(
            P,
            [
              `${size} vertices \u00b7 ${edgeCount()} edges`,
              directed ? "directed graph" : "undirected graph",
            ],
            480,
            452
          );
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);
      p5Instance = myP5;
    });
    return () => {
      cancelled = true;
      p5Instance?.remove();
    };
  }, []);

  return <div ref={sketchRef} className="canvas-wrapper"></div>;
}
