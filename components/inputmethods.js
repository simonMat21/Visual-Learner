/**
 * Input methods for the graph pages.
 *
 * All three are thin wrappers around the shared GraphInputPanel, which owns the
 * panel, the edge list box and the matrix grid. Each wrapper only picks the
 * graph flavour and keeps the old callback names working:
 *
 * - inputMethod_directedAdjMatrix   directed, 0/1
 * - inputMethod_undirectedAdjMatrix undirected, symmetric 0/1
 * - inputMethod_weightedAdjMatrix   directed, numeric weights
 */

import { GraphInputPanel } from "./graphInput";

function bridgeCallbacks(callbacks) {
  let lastSize = null;

  return (matrix, size) => {
    if (size !== lastSize) {
      lastSize = size;
      if (callbacks.onMatrixGenerate) callbacks.onMatrixGenerate(size);
      return;
    }
    if (callbacks.onMatrixUpdate) callbacks.onMatrixUpdate(matrix);
  };
}

class AdjMatrixInput extends GraphInputPanel {
  constructor(P, callbacks = {}, flavour = {}) {
    super(P, { ...flavour, defaultSize: 5 });
    this.callbacks = {
      ...callbacks,
      onChange: bridgeCallbacks(callbacks),
    };
  }
}

export class inputMethod_directedAdjMatrix extends AdjMatrixInput {
  constructor(P, callbacks) {
    super(P, callbacks, {
      directed: true,
      weighted: false,
      title: "Directed Graph",
    });
  }
}

export class inputMethod_undirectedAdjMatrix extends AdjMatrixInput {
  constructor(P, callbacks) {
    super(P, callbacks, {
      directed: false,
      weighted: false,
      title: "Undirected Graph",
    });
  }
}

export class inputMethod_weightedAdjMatrix extends AdjMatrixInput {
  constructor(P, callbacks) {
    super(P, callbacks, {
      directed: true,
      weighted: true,
      title: "Weighted Graph",
    });
  }
}
