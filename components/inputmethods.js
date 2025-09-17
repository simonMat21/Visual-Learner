/**
 * Input Method Classes for Graph Visualization
 *
 * This file contains three specialized input method classes for different types of graph adjacency matrices:
 * - inputMethod_directedAdjMatrix: For directed graphs with 0/1 values
 * - inputMethod_undirectedAdjMatrix: For undirected graphs with symmetric matrix updates
 * - inputMethod_weightedAdjMatrix: For weighted graphs with numeric input fields
 *
 * Each class provides:
 * - Sliding panel interface with input/done buttons
 * - Matrix size configuration
 * - Random graph generation
 * - Interactive matrix editing
 * - Complete panel animation and visibility management
 */

export class inputMethod_directedAdjMatrix {
  constructor(P, callbacks) {
    this.P = P;
    this.callbacks = callbacks;
    this.sizeInput = null;
    this.generateButton = null;
    this.randomButton = null;
    this.doneButton = null;
    this.sizeLabel = null;
    this.matrixLabel = null;
    this.inputButton = null;
    this.cnv = null;
    this.baseX = 0;

    // Matrix data
    this.matrix = [];
    this.matrixButtons = [];
    this.matrixSize = 3;

    // Panel state
    this.isInputPanelVisible = false;
    this.panelOffset = -400; // Start off-screen
    this.targetPanelOffset = -400;
    this.animationSpeed = 0.15;
  }

  createInputElements(cnv) {
    this.cnv = cnv;
    this.baseX = cnv.position().x;

    // Create main Input button
    this.inputButton = this.P.createButton("Input Matrix");
    this.inputButton.style("font-size", "16px");
    this.inputButton.style("padding", "10px 20px");
    this.inputButton.style("color", "white");
    this.inputButton.style("background-color", "#6c757d");
    this.inputButton.style("border", "2px solid #6c757d");
    this.inputButton.style("border-radius", "8px");
    this.inputButton.style("cursor", "pointer");
    this.inputButton.style("font-weight", "bold");
    this.inputButton.mousePressed(() => this.showInputPanel());
    this.inputButton.position(80, 50);

    // Create Done button
    this.doneButton = this.P.createButton("Done");
    this.doneButton.style("font-size", "14px");
    this.doneButton.style("padding", "8px 16px");
    this.doneButton.style("color", "white");
    this.doneButton.style("background-color", "#dc3545");
    this.doneButton.style("border", "2px solid #dc3545");
    this.doneButton.style("border-radius", "6px");
    this.doneButton.style("cursor", "pointer");
    this.doneButton.style("font-weight", "bold");
    this.doneButton.mousePressed(() => this.hideInputPanel());
    this.doneButton.position(this.baseX + 20, this.P.height - 50);

    // Create size input label
    this.sizeLabel = this.P.createP("Matrix Size:");
    this.sizeLabel.style("font-size", "14px");
    this.sizeLabel.style("color", "black");
    this.sizeLabel.style("font-weight", "bold");
    this.sizeLabel.style("margin", "0");
    this.sizeLabel.position(this.baseX + 20, 30);

    // Create size input
    this.sizeInput = this.P.createInput("5");
    this.sizeInput.attribute("type", "number");
    this.sizeInput.attribute("min", "1");
    this.sizeInput.attribute("max", "8");
    this.sizeInput.style("width", "50px");
    this.sizeInput.style("font-size", "14px");
    this.sizeInput.style("-moz-appearance", "textfield");
    this.sizeInput.style("appearance", "textfield");
    this.sizeInput.style("font-weight", "bold");
    this.sizeInput.style("border", "2px solid #666");
    this.sizeInput.style("background-color", "#ffffff");
    this.sizeInput.style("color", "#000");
    this.sizeInput.position(this.baseX + 130, cnv.position().y + 70);

    // Create generate button
    this.generateButton = this.P.createButton("Generate Matrix");
    this.generateButton.style("font-size", "14px");
    this.generateButton.style("padding", "8px 16px");
    this.generateButton.style("color", "white");
    this.generateButton.style("background-color", "#007bff");
    this.generateButton.style("border", "2px solid #007bff");
    this.generateButton.style("border-radius", "6px");
    this.generateButton.style("cursor", "pointer");
    this.generateButton.style("font-weight", "bold");
    this.generateButton.mousePressed(() => this.generateMatrix());
    this.generateButton.position(this.baseX + 20, cnv.position().y + 110);

    // Create random button
    this.randomButton = this.P.createButton("Random Graph");
    this.randomButton.style("font-size", "14px");
    this.randomButton.style("padding", "8px 16px");
    this.randomButton.style("color", "white");
    this.randomButton.style("background-color", "#28a745");
    this.randomButton.style("border", "2px solid #28a745");
    this.randomButton.style("border-radius", "6px");
    this.randomButton.style("cursor", "pointer");
    this.randomButton.style("font-weight", "bold");
    this.randomButton.mousePressed(() => this.generateRandomGraph());
    this.randomButton.position(this.baseX + 180, cnv.position().y + 110);

    // Create matrix label
    this.matrixLabel = this.P.createP("Adjacency Matrix:");
    this.matrixLabel.style("font-size", "16px");
    this.matrixLabel.style("color", "black");
    this.matrixLabel.style("font-weight", "bold");
    this.matrixLabel.style("margin", "0");
    this.matrixLabel.position(this.baseX + 20, cnv.position().y + 145);

    // Initially hide all elements
    this.setVisibility(false);
  }

  updatePosition(offset) {
    if (this.doneButton)
      this.doneButton.position(this.baseX + offset + 160, this.P.height - 40);
    if (this.sizeLabel) this.sizeLabel.position(this.baseX + offset + 20, 55);
    if (this.sizeInput) this.sizeInput.position(this.baseX + offset + 130, 55);
    if (this.generateButton)
      this.generateButton.position(this.baseX + offset + 20, 110);
    if (this.randomButton)
      this.randomButton.position(this.baseX + offset + 180, 110);
    if (this.matrixLabel)
      this.matrixLabel.position(
        this.baseX + offset + 20,
        this.cnv.position().y + 145
      );
  }

  setVisibility(visible) {
    const display = visible ? "block" : "none";
    if (this.doneButton) this.doneButton.style("display", display);
    if (this.sizeLabel) this.sizeLabel.style("display", display);
    if (this.sizeInput) this.sizeInput.style("display", display);
    if (this.generateButton) this.generateButton.style("display", display);
    if (this.randomButton) this.randomButton.style("display", display);
    if (this.matrixLabel) this.matrixLabel.style("display", display);
  }

  setInputButtonVisibility(visible) {
    const display = visible ? "block" : "none";
    if (this.inputButton) this.inputButton.style("display", display);
  }

  // Matrix generation logic
  handleMatrixGenerate(newSize) {
    this.matrixSize = newSize;
    this.clearMatrixButtons();

    this.matrix = [];
    for (let i = 0; i < this.matrixSize; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < this.matrixSize; j++) {
        this.matrix[i][j] = 0;
      }
    }

    this.createMatrixGrid();
    this.setMatrixVisibility(this.isInputPanelVisible);
    this.callbacks.onMatrixGenerate(newSize);
  }

  handleRandomGenerate() {
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (i !== j) {
          this.matrix[i][j] = this.P.random() < 0.3 ? 1 : 0;
        } else {
          this.matrix[i][j] = 0;
        }
      }
    }
    this.updateButtonColors();
    this.callbacks.onMatrixUpdate();
  }

  generateMatrix() {
    let newSize = parseInt(this.sizeInput.value());
    if (newSize < 1 || newSize > 8) {
      alert("Please enter a size between 1 and 8");
      return;
    }

    this.handleMatrixGenerate(newSize);
  }

  generateRandomGraph() {
    this.handleRandomGenerate();
  }

  // Getters for external access
  getMatrix() {
    return this.matrix;
  }

  getMatrixSize() {
    return this.matrixSize;
  }

  // Matrix manipulation functions
  clearMatrixButtons() {
    this.matrixButtons.forEach((row) => {
      row.forEach((button) => {
        if (button && button.remove) {
          button.remove();
        }
      });
    });
    this.matrixButtons = [];
  }

  createMatrixGrid(startX = 80, startY = 200) {
    this.matrixButtons = [];
    let buttonSize = this.P.min(30, 250 / this.matrixSize);

    for (let i = 0; i < this.matrixSize; i++) {
      this.matrixButtons[i] = [];
      for (let j = 0; j < this.matrixSize; j++) {
        let button = this.P.createButton("0");
        button.style("width", buttonSize + "px");
        button.style("height", buttonSize + "px");
        button.style("font-size", this.P.min(12, buttonSize / 2.5) + "px");
        button.style("font-weight", "bold");
        button.style("border", "2px solid #666");
        button.style("background-color", "#ffffff");
        button.style("color", "#000");
        button.style("cursor", "pointer");
        button.style("margin", "0");
        button.style("padding", "0");
        button.style("border-radius", "4px");

        button.mousePressed(this.createToggleHandler(i, j));

        let x = startX + j * (buttonSize + 2);
        let y = startY + i * (buttonSize + 2);
        button.position(x, y);

        this.matrixButtons[i][j] = button;
      }
    }
  }

  updateMatrixButtonPositions(offset) {
    let buttonSize = this.P.min(30, 250 / this.matrixSize);
    let startX = offset + 80;
    let startY = 200;

    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (this.matrixButtons[i] && this.matrixButtons[i][j]) {
          let x = startX + j * (buttonSize + 2);
          let y = startY + i * (buttonSize + 2);
          this.matrixButtons[i][j].position(x, y);
        }
      }
    }
  }

  setMatrixVisibility(visible) {
    const display = visible ? "block" : "none";
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (this.matrixButtons[i] && this.matrixButtons[i][j]) {
          this.matrixButtons[i][j].style("display", display);
        }
      }
    }
  }

  // Matrix interaction functions
  createToggleHandler(row, col) {
    return () => {
      this.matrix[row][col] = this.matrix[row][col] === 0 ? 1 : 0;
      this.updateButtonAppearance(row, col);
      this.callbacks.onMatrixUpdate();
    };
  }

  updateButtonAppearance(row, col) {
    let button = this.matrixButtons[row][col];
    if (this.matrix[row][col] === 1) {
      button.html("1");
      button.style("background-color", "#4CAF50");
      button.style("color", "white");
    } else {
      button.html("0");
      button.style("background-color", "#ffffff");
      button.style("color", "#000");
    }
  }

  updateButtonColors() {
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        this.updateButtonAppearance(i, j);
      }
    }
  }

  // Panel visibility functions
  showInputPanel() {
    this.isInputPanelVisible = true;
    this.targetPanelOffset = 0;
    this.setVisibility(true);
    this.setMatrixVisibility(true);
    this.setInputButtonVisibility(false); // Hide input button
  }

  hideInputPanel() {
    this.isInputPanelVisible = false;
    this.targetPanelOffset = -400;
    this.setInputButtonVisibility(true); // Show input button
    setTimeout(() => {
      if (!this.isInputPanelVisible) {
        this.setVisibility(false);
        this.setMatrixVisibility(false);
      }
    }, 300); // Hide elements after animation completes
  }

  // Panel animation update
  updatePanelAnimation() {
    this.panelOffset = this.P.lerp(
      this.panelOffset,
      this.targetPanelOffset,
      this.animationSpeed
    );
    this.updatePosition(this.panelOffset);

    // Update matrix button positions during animation
    if (this.isInputPanelVisible || this.panelOffset > -390) {
      this.updateMatrixButtonPositions(this.panelOffset);
    }
  }

  // Panel background drawing
  drawPanelBackground() {
    if (this.isInputPanelVisible || this.panelOffset > -390) {
      this.P.push();
      this.P.fill(240, 240, 240, 200);
      this.P.stroke(100);
      this.P.strokeWeight(2);
      this.P.rect(this.panelOffset, 0, 400, 500);
      this.P.pop();
    }
  }

  // Getters for panel state
  getIsInputPanelVisible() {
    return this.isInputPanelVisible;
  }

  getPanelOffset() {
    return this.panelOffset;
  }
}

export class inputMethod_undirectedAdjMatrix {
  constructor(P, callbacks) {
    this.P = P;
    this.callbacks = callbacks;
    this.sizeInput = null;
    this.generateButton = null;
    this.randomButton = null;
    this.doneButton = null;
    this.sizeLabel = null;
    this.matrixLabel = null;
    this.inputButton = null;
    this.cnv = null;
    this.baseX = 0;

    // Matrix data
    this.matrix = [];
    this.matrixButtons = [];
    this.matrixSize = 3;

    // Panel state
    this.isInputPanelVisible = false;
    this.panelOffset = -400; // Start off-screen
    this.targetPanelOffset = -400;
    this.animationSpeed = 0.15;
  }

  createInputElements(cnv) {
    this.cnv = cnv;
    this.baseX = cnv.position().x;

    // Create main Input button
    this.inputButton = this.P.createButton("Input Matrix");
    this.inputButton.style("font-size", "16px");
    this.inputButton.style("padding", "10px 20px");
    this.inputButton.style("color", "white");
    this.inputButton.style("background-color", "#6c757d");
    this.inputButton.style("border", "2px solid #6c757d");
    this.inputButton.style("border-radius", "8px");
    this.inputButton.style("cursor", "pointer");
    this.inputButton.style("font-weight", "bold");
    this.inputButton.mousePressed(() => this.showInputPanel());
    this.inputButton.position(80, 50);

    // Create Done button
    this.doneButton = this.P.createButton("Done");
    this.doneButton.style("font-size", "14px");
    this.doneButton.style("padding", "8px 16px");
    this.doneButton.style("color", "white");
    this.doneButton.style("background-color", "#dc3545");
    this.doneButton.style("border", "2px solid #dc3545");
    this.doneButton.style("border-radius", "6px");
    this.doneButton.style("cursor", "pointer");
    this.doneButton.style("font-weight", "bold");
    this.doneButton.mousePressed(() => this.hideInputPanel());
    this.doneButton.position(this.baseX + 20, this.P.height - 50);

    // Create size input label
    this.sizeLabel = this.P.createP("Matrix Size:");
    this.sizeLabel.style("font-size", "14px");
    this.sizeLabel.style("color", "black");
    this.sizeLabel.style("font-weight", "bold");
    this.sizeLabel.style("margin", "0");
    this.sizeLabel.position(this.baseX + 20, 30);

    // Create size input
    this.sizeInput = this.P.createInput("5");
    this.sizeInput.attribute("type", "number");
    this.sizeInput.attribute("min", "1");
    this.sizeInput.attribute("max", "8");
    this.sizeInput.style("width", "50px");
    this.sizeInput.style("font-size", "14px");
    this.sizeInput.style("-moz-appearance", "textfield");
    this.sizeInput.style("appearance", "textfield");
    this.sizeInput.style("font-weight", "bold");
    this.sizeInput.style("border", "2px solid #666");
    this.sizeInput.style("background-color", "#ffffff");
    this.sizeInput.style("color", "#000");
    this.sizeInput.position(this.baseX + 130, cnv.position().y + 70);

    // Create generate button
    this.generateButton = this.P.createButton("Generate Matrix");
    this.generateButton.style("font-size", "14px");
    this.generateButton.style("padding", "8px 16px");
    this.generateButton.style("color", "white");
    this.generateButton.style("background-color", "#007bff");
    this.generateButton.style("border", "2px solid #007bff");
    this.generateButton.style("border-radius", "6px");
    this.generateButton.style("cursor", "pointer");
    this.generateButton.style("font-weight", "bold");
    this.generateButton.mousePressed(() => this.generateMatrix());
    this.generateButton.position(this.baseX + 20, cnv.position().y + 110);

    // Create random button
    this.randomButton = this.P.createButton("Random Graph");
    this.randomButton.style("font-size", "14px");
    this.randomButton.style("padding", "8px 16px");
    this.randomButton.style("color", "white");
    this.randomButton.style("background-color", "#28a745");
    this.randomButton.style("border", "2px solid #28a745");
    this.randomButton.style("border-radius", "6px");
    this.randomButton.style("cursor", "pointer");
    this.randomButton.style("font-weight", "bold");
    this.randomButton.mousePressed(() => this.generateRandomGraph());
    this.randomButton.position(this.baseX + 180, cnv.position().y + 110);

    // Create matrix label
    this.matrixLabel = this.P.createP("Adjacency Matrix:");
    this.matrixLabel.style("font-size", "16px");
    this.matrixLabel.style("color", "black");
    this.matrixLabel.style("font-weight", "bold");
    this.matrixLabel.style("margin", "0");
    this.matrixLabel.position(this.baseX + 20, cnv.position().y + 145);

    // Initially hide all elements
    this.setVisibility(false);
  }

  updatePosition(offset) {
    if (this.doneButton)
      this.doneButton.position(this.baseX + offset + 160, this.P.height - 40);
    if (this.sizeLabel) this.sizeLabel.position(this.baseX + offset + 20, 55);
    if (this.sizeInput) this.sizeInput.position(this.baseX + offset + 130, 55);
    if (this.generateButton)
      this.generateButton.position(this.baseX + offset + 20, 110);
    if (this.randomButton)
      this.randomButton.position(this.baseX + offset + 180, 110);
    if (this.matrixLabel)
      this.matrixLabel.position(
        this.baseX + offset + 20,
        this.cnv.position().y + 145
      );
  }

  setVisibility(visible) {
    const display = visible ? "block" : "none";
    if (this.doneButton) this.doneButton.style("display", display);
    if (this.sizeLabel) this.sizeLabel.style("display", display);
    if (this.sizeInput) this.sizeInput.style("display", display);
    if (this.generateButton) this.generateButton.style("display", display);
    if (this.randomButton) this.randomButton.style("display", display);
    if (this.matrixLabel) this.matrixLabel.style("display", display);
  }

  setInputButtonVisibility(visible) {
    const display = visible ? "block" : "none";
    if (this.inputButton) this.inputButton.style("display", display);
  }

  // Matrix generation logic
  handleMatrixGenerate(newSize) {
    this.matrixSize = newSize;
    this.clearMatrixButtons();

    this.matrix = [];
    for (let i = 0; i < this.matrixSize; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < this.matrixSize; j++) {
        this.matrix[i][j] = 0;
      }
    }

    this.createMatrixGrid();
    this.setMatrixVisibility(this.isInputPanelVisible);
    this.callbacks.onMatrixGenerate(newSize);
  }

  handleRandomGenerate() {
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = i; j < this.matrixSize; j++) {
        // Only iterate upper triangle for undirected graph
        if (i !== j) {
          let value = this.P.random() < 0.3 ? 1 : 0;
          this.matrix[i][j] = value;
          this.matrix[j][i] = value; // Make symmetric
        } else {
          this.matrix[i][j] = 0;
        }
      }
    }
    this.updateButtonColors();
    this.callbacks.onMatrixUpdate();
  }

  generateMatrix() {
    let newSize = parseInt(this.sizeInput.value());
    if (newSize < 1 || newSize > 8) {
      alert("Please enter a size between 1 and 8");
      return;
    }

    this.handleMatrixGenerate(newSize);
  }

  generateRandomGraph() {
    this.handleRandomGenerate();
  }

  // Getters for external access
  getMatrix() {
    return this.matrix;
  }

  getMatrixSize() {
    return this.matrixSize;
  }

  // Matrix manipulation functions
  clearMatrixButtons() {
    this.matrixButtons.forEach((row) => {
      row.forEach((button) => {
        if (button && button.remove) {
          button.remove();
        }
      });
    });
    this.matrixButtons = [];
  }

  createMatrixGrid(startX = 80, startY = 200) {
    this.matrixButtons = [];
    let buttonSize = this.P.min(30, 250 / this.matrixSize);

    for (let i = 0; i < this.matrixSize; i++) {
      this.matrixButtons[i] = [];
      for (let j = 0; j < this.matrixSize; j++) {
        let button = this.P.createButton("0");
        button.style("width", buttonSize + "px");
        button.style("height", buttonSize + "px");
        button.style("font-size", this.P.min(12, buttonSize / 2.5) + "px");
        button.style("font-weight", "bold");
        button.style("border", "2px solid #666");
        button.style("background-color", "#ffffff");
        button.style("color", "#000");
        button.style("cursor", "pointer");
        button.style("margin", "0");
        button.style("padding", "0");
        button.style("border-radius", "4px");

        button.mousePressed(this.createToggleHandler(i, j));

        let x = startX + j * (buttonSize + 2);
        let y = startY + i * (buttonSize + 2);
        button.position(x, y);

        this.matrixButtons[i][j] = button;
      }
    }
  }

  updateMatrixButtonPositions(offset) {
    let buttonSize = this.P.min(30, 250 / this.matrixSize);
    let startX = offset + 80;
    let startY = 200;

    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (this.matrixButtons[i] && this.matrixButtons[i][j]) {
          let x = startX + j * (buttonSize + 2);
          let y = startY + i * (buttonSize + 2);
          this.matrixButtons[i][j].position(x, y);
        }
      }
    }
  }

  setMatrixVisibility(visible) {
    const display = visible ? "block" : "none";
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (this.matrixButtons[i] && this.matrixButtons[i][j]) {
          this.matrixButtons[i][j].style("display", display);
        }
      }
    }
  }

  // Matrix interaction functions - modified for undirected graphs
  createToggleHandler(row, col) {
    return () => {
      let newValue = this.matrix[row][col] === 0 ? 1 : 0;

      // Update both positions for undirected graph (symmetric)
      this.matrix[row][col] = newValue;
      this.matrix[col][row] = newValue;

      this.updateButtonAppearance(row, col);
      this.updateButtonAppearance(col, row); // Update symmetric button
      this.callbacks.onMatrixUpdate();
    };
  }

  updateButtonAppearance(row, col) {
    let button = this.matrixButtons[row][col];
    if (this.matrix[row][col] === 1) {
      button.html("1");
      button.style("background-color", "#4CAF50");
      button.style("color", "white");
    } else {
      button.html("0");
      button.style("background-color", "#ffffff");
      button.style("color", "#000");
    }
  }

  updateButtonColors() {
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        this.updateButtonAppearance(i, j);
      }
    }
  }

  // Panel visibility functions
  showInputPanel() {
    this.isInputPanelVisible = true;
    this.targetPanelOffset = 0;
    this.setVisibility(true);
    this.setMatrixVisibility(true);
    this.setInputButtonVisibility(false); // Hide input button
  }

  hideInputPanel() {
    this.isInputPanelVisible = false;
    this.targetPanelOffset = -400;
    this.setInputButtonVisibility(true); // Show input button
    setTimeout(() => {
      if (!this.isInputPanelVisible) {
        this.setVisibility(false);
        this.setMatrixVisibility(false);
      }
    }, 300); // Hide elements after animation completes
  }

  // Panel animation update
  updatePanelAnimation() {
    this.panelOffset = this.P.lerp(
      this.panelOffset,
      this.targetPanelOffset,
      this.animationSpeed
    );
    this.updatePosition(this.panelOffset);

    // Update matrix button positions during animation
    if (this.isInputPanelVisible || this.panelOffset > -390) {
      this.updateMatrixButtonPositions(this.panelOffset);
    }
  }

  // Panel background drawing
  drawPanelBackground() {
    if (this.isInputPanelVisible || this.panelOffset > -390) {
      this.P.push();
      this.P.fill(240, 240, 240, 200);
      this.P.stroke(100);
      this.P.strokeWeight(2);
      this.P.rect(this.panelOffset, 0, 400, 500);
      this.P.pop();
    }
  }

  // Getters for panel state
  getIsInputPanelVisible() {
    return this.isInputPanelVisible;
  }

  getPanelOffset() {
    return this.panelOffset;
  }
}

export class inputMethod_weightedAdjMatrix {
  constructor(P, callbacks) {
    this.P = P;
    this.callbacks = callbacks;
    this.sizeInput = null;
    this.generateButton = null;
    this.randomButton = null;
    this.doneButton = null;
    this.sizeLabel = null;
    this.matrixLabel = null;
    this.inputButton = null;
    this.cnv = null;
    this.baseX = 0;

    // Matrix data
    this.matrix = [];
    this.matrixButtons = [];
    this.matrixSize = 3;

    // Panel state
    this.isInputPanelVisible = false;
    this.panelOffset = -400; // Start off-screen
    this.targetPanelOffset = -400;
    this.animationSpeed = 0.15;
  }

  createInputElements(cnv) {
    this.cnv = cnv;
    this.baseX = cnv.position().x;

    // Create main Input button
    this.inputButton = this.P.createButton("Input Matrix");
    this.inputButton.style("font-size", "16px");
    this.inputButton.style("padding", "10px 20px");
    this.inputButton.style("color", "white");
    this.inputButton.style("background-color", "#6c757d");
    this.inputButton.style("border", "2px solid #6c757d");
    this.inputButton.style("border-radius", "8px");
    this.inputButton.style("cursor", "pointer");
    this.inputButton.style("font-weight", "bold");
    this.inputButton.mousePressed(() => this.showInputPanel());
    this.inputButton.position(80, 50);

    // Create Done button
    this.doneButton = this.P.createButton("Done");
    this.doneButton.style("font-size", "14px");
    this.doneButton.style("padding", "8px 16px");
    this.doneButton.style("color", "white");
    this.doneButton.style("background-color", "#dc3545");
    this.doneButton.style("border", "2px solid #dc3545");
    this.doneButton.style("border-radius", "6px");
    this.doneButton.style("cursor", "pointer");
    this.doneButton.style("font-weight", "bold");
    this.doneButton.mousePressed(() => this.hideInputPanel());
    this.doneButton.position(this.baseX + 20, this.P.height - 50);

    // Create size input label
    this.sizeLabel = this.P.createP("Matrix Size:");
    this.sizeLabel.style("font-size", "14px");
    this.sizeLabel.style("color", "black");
    this.sizeLabel.style("font-weight", "bold");
    this.sizeLabel.style("margin", "0");
    this.sizeLabel.position(this.baseX + 20, 30);

    // Create size input
    this.sizeInput = this.P.createInput("5");
    this.sizeInput.attribute("type", "number");
    this.sizeInput.attribute("min", "1");
    this.sizeInput.attribute("max", "8");
    this.sizeInput.style("width", "50px");
    this.sizeInput.style("font-size", "14px");
    this.sizeInput.style("-moz-appearance", "textfield");
    this.sizeInput.style("appearance", "textfield");
    this.sizeInput.style("font-weight", "bold");
    this.sizeInput.style("border", "2px solid #666");
    this.sizeInput.style("background-color", "#ffffff");
    this.sizeInput.style("color", "#000");
    this.sizeInput.position(this.baseX + 130, cnv.position().y + 70);

    // Create generate button
    this.generateButton = this.P.createButton("Generate Matrix");
    this.generateButton.style("font-size", "14px");
    this.generateButton.style("padding", "8px 16px");
    this.generateButton.style("color", "white");
    this.generateButton.style("background-color", "#007bff");
    this.generateButton.style("border", "2px solid #007bff");
    this.generateButton.style("border-radius", "6px");
    this.generateButton.style("cursor", "pointer");
    this.generateButton.style("font-weight", "bold");
    this.generateButton.mousePressed(() => this.generateMatrix());
    this.generateButton.position(this.baseX + 20, cnv.position().y + 110);

    // Create random button
    this.randomButton = this.P.createButton("Random Graph");
    this.randomButton.style("font-size", "14px");
    this.randomButton.style("padding", "8px 16px");
    this.randomButton.style("color", "white");
    this.randomButton.style("background-color", "#28a745");
    this.randomButton.style("border", "2px solid #28a745");
    this.randomButton.style("border-radius", "6px");
    this.randomButton.style("cursor", "pointer");
    this.randomButton.style("font-weight", "bold");
    this.randomButton.mousePressed(() => this.generateRandomGraph());
    this.randomButton.position(this.baseX + 180, cnv.position().y + 110);

    // Create matrix label
    this.matrixLabel = this.P.createP("Weighted Adjacency Matrix:");
    this.matrixLabel.style("font-size", "16px");
    this.matrixLabel.style("color", "black");
    this.matrixLabel.style("font-weight", "bold");
    this.matrixLabel.style("margin", "0");
    this.matrixLabel.position(this.baseX + 20, cnv.position().y + 145);

    // Initially hide all elements
    this.setVisibility(false);
  }

  updatePosition(offset) {
    if (this.doneButton)
      this.doneButton.position(this.baseX + offset + 160, this.P.height - 40);
    if (this.sizeLabel) this.sizeLabel.position(this.baseX + offset + 20, 55);
    if (this.sizeInput) this.sizeInput.position(this.baseX + offset + 130, 55);
    if (this.generateButton)
      this.generateButton.position(this.baseX + offset + 20, 110);
    if (this.randomButton)
      this.randomButton.position(this.baseX + offset + 180, 110);
    if (this.matrixLabel)
      this.matrixLabel.position(
        this.baseX + offset + 20,
        this.cnv.position().y + 145
      );
  }

  setVisibility(visible) {
    const display = visible ? "block" : "none";
    if (this.doneButton) this.doneButton.style("display", display);
    if (this.sizeLabel) this.sizeLabel.style("display", display);
    if (this.sizeInput) this.sizeInput.style("display", display);
    if (this.generateButton) this.generateButton.style("display", display);
    if (this.randomButton) this.randomButton.style("display", display);
    if (this.matrixLabel) this.matrixLabel.style("display", display);
  }

  setInputButtonVisibility(visible) {
    const display = visible ? "block" : "none";
    if (this.inputButton) this.inputButton.style("display", display);
  }

  // Matrix generation logic
  handleMatrixGenerate(newSize) {
    this.matrixSize = newSize;
    this.clearMatrixButtons();

    this.matrix = [];
    for (let i = 0; i < this.matrixSize; i++) {
      this.matrix[i] = [];
      for (let j = 0; j < this.matrixSize; j++) {
        this.matrix[i][j] = 0;
      }
    }

    this.createMatrixGrid();
    this.setMatrixVisibility(this.isInputPanelVisible);
    this.callbacks.onMatrixGenerate(newSize);
  }

  handleRandomGenerate() {
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (i !== j) {
          if (this.P.random() < 0.3) {
            // Generate random weight between 1 and 10
            this.matrix[i][j] = Math.floor(this.P.random() * 10) + 1;
          } else {
            this.matrix[i][j] = 0;
          }
        } else {
          this.matrix[i][j] = 0;
        }
      }
    }
    this.updateButtonColors();
    this.callbacks.onMatrixUpdate();
  }

  generateMatrix() {
    let newSize = parseInt(this.sizeInput.value());
    if (newSize < 1 || newSize > 8) {
      alert("Please enter a size between 1 and 8");
      return;
    }

    this.handleMatrixGenerate(newSize);
  }

  generateRandomGraph() {
    this.handleRandomGenerate();
  }

  // Getters for external access
  getMatrix() {
    return this.matrix;
  }

  getMatrixSize() {
    return this.matrixSize;
  }

  // Matrix manipulation functions
  clearMatrixButtons() {
    this.matrixButtons.forEach((row) => {
      row.forEach((input) => {
        if (input && input.remove) {
          input.remove();
        }
      });
    });
    this.matrixButtons = [];
  }

  createMatrixGrid(startX = 80, startY = 200) {
    this.matrixButtons = [];
    let buttonSize = this.P.min(30, 250 / this.matrixSize);

    for (let i = 0; i < this.matrixSize; i++) {
      this.matrixButtons[i] = [];
      for (let j = 0; j < this.matrixSize; j++) {
        // Create input field instead of button for weights
        let input = this.P.createInput("0");
        input.style("width", buttonSize + "px");
        input.style("height", buttonSize + "px");
        input.style("font-size", this.P.min(10, buttonSize / 3) + "px");
        input.style("font-weight", "bold");
        input.style("border", "2px solid #666");
        input.style("background-color", "#ffffff");
        input.style("color", "#000");
        input.style("margin", "0");
        input.style("padding", "2px");
        input.style("border-radius", "4px");
        input.style("text-align", "center");

        // Add event listener for input changes
        input.input(this.createInputHandler(i, j));

        let x = startX + j * (buttonSize + 2);
        let y = startY + i * (buttonSize + 2);
        input.position(x, y);

        this.matrixButtons[i][j] = input;
      }
    }
  }

  updateMatrixButtonPositions(offset) {
    let buttonSize = this.P.min(30, 250 / this.matrixSize);
    let startX = offset + 80;
    let startY = 200;

    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (this.matrixButtons[i] && this.matrixButtons[i][j]) {
          let x = startX + j * (buttonSize + 2);
          let y = startY + i * (buttonSize + 2);
          this.matrixButtons[i][j].position(x, y);
        }
      }
    }
  }

  setMatrixVisibility(visible) {
    const display = visible ? "block" : "none";
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        if (this.matrixButtons[i] && this.matrixButtons[i][j]) {
          this.matrixButtons[i][j].style("display", display);
        }
      }
    }
  }

  // Matrix interaction functions - modified for weighted graphs
  createInputHandler(row, col) {
    return () => {
      let input = this.matrixButtons[row][col];
      let value = parseFloat(input.value());
      // Allow negative values, only default to 0 if NaN
      if (isNaN(value)) {
        value = 0;
      }
      this.matrix[row][col] = value;
      this.updateInputAppearance(row, col);
      this.callbacks.onMatrixUpdate();
    };
  }

  updateInputAppearance(row, col) {
    let input = this.matrixButtons[row][col];
    let weight = this.matrix[row][col];

    if (weight === 0) {
      input.style("background-color", "#ffffff");
      input.style("color", "#000");
    } else if (weight < 0) {
      input.style("background-color", "#ff6b6b"); // Red for negative weights
      input.style("color", "white");
    } else {
      input.style("background-color", "#4CAF50"); // Green for positive weights
      input.style("color", "white");
    }
    input.value(weight.toString());
  }

  updateButtonColors() {
    for (let i = 0; i < this.matrixSize; i++) {
      for (let j = 0; j < this.matrixSize; j++) {
        this.updateInputAppearance(i, j);
      }
    }
  }

  // Panel visibility functions
  showInputPanel() {
    this.isInputPanelVisible = true;
    this.targetPanelOffset = 0;
    this.setVisibility(true);
    this.setMatrixVisibility(true);
    this.setInputButtonVisibility(false); // Hide input button
  }

  hideInputPanel() {
    this.isInputPanelVisible = false;
    this.targetPanelOffset = -400;
    this.setInputButtonVisibility(true); // Show input button
    setTimeout(() => {
      if (!this.isInputPanelVisible) {
        this.setVisibility(false);
        this.setMatrixVisibility(false);
      }
    }, 300); // Hide elements after animation completes
  }

  // Panel animation update
  updatePanelAnimation() {
    this.panelOffset = this.P.lerp(
      this.panelOffset,
      this.targetPanelOffset,
      this.animationSpeed
    );
    this.updatePosition(this.panelOffset);

    // Update matrix button positions during animation
    if (this.isInputPanelVisible || this.panelOffset > -390) {
      this.updateMatrixButtonPositions(this.panelOffset);
    }
  }

  // Panel background drawing
  drawPanelBackground() {
    if (this.isInputPanelVisible || this.panelOffset > -390) {
      this.P.push();
      this.P.fill(240, 240, 240, 200);
      this.P.stroke(100);
      this.P.strokeWeight(2);
      this.P.rect(this.panelOffset, 0, 400, 500);
      this.P.pop();
    }
  }

  // Getters for panel state
  getIsInputPanelVisible() {
    return this.isInputPanelVisible;
  }

  getPanelOffset() {
    return this.panelOffset;
  }
}
