class _action {
  constructor(parent) {
    this.parent = parent;
    this.object = document.createElement("div");
    this.commandTextbox = document.createElement("input");
    this.commandTextbox.className = "commandTextbox";
    this.commandTextbox.type = "text";
    this.commandTextbox.addEventListener("keydown", (e) => this.handleTextboxKeydown(e));
    this.object.appendChild(this.commandTextbox);
    this.runButton = document.createElement("button");
    this.runButton.className = "runButton";
    this.runButton.type = "button";
    this.runButton.innerText = ">";
    this.runButton.addEventListener("click", () => this.update());
    this.object.appendChild(this.runButton);
    this.removeButton = document.createElement("button");
    this.removeButton.className = "actionRemoveButton";
    this.removeButton.type = "button";
    this.removeButton.innerText = "x";
    this.object.appendChild(this.removeButton);

    this.update = this._update.bind(this);
    this.addStepBelow = this._addStepBelow.bind(this);
    this.handleTextboxKeydown = this._handleTextboxKeydown.bind(this);
  }
  _update() {
    parseCommand(this.commandTextbox.value);
  }
  _addStepBelow(loop = false) {
    let steps = this.parent.steps;
    let currentIndex = steps.findIndex(step => step == this);
    if (loop) {
      this.parent.addStep(true, currentIndex + 1);
    } else {
      this.parent.addStep(false, currentIndex + 1);
    }
  }
  _handleTextboxKeydown(e) {
    if (e.key == "Enter") {
      if (e.shiftKey) {
        this.addStepBelow(true);
      } else {
        this.addStepBelow(false);
      }
    }
  }
  get stepIndex() {
    return this.parent.steps.findIndex(step => step == this);
  }
}

class _loop {
  constructor(parent, steps = []) {
    this.parent = parent;
    this.steps = steps;

    this.object = document.createElement("div");
    this.object.className = "loop";
    this.nLoopTextbox = document.createElement("input");
    this.nLoopTextbox.className = "nLoopTextbox";
    this.nLoopTextbox.type = "text";
    this.nLoopTextbox.value = "1";
    this.object.appendChild(this.nLoopTextbox);
    this.runButton = document.createElement("button");
    this.runButton.className = "runButton";
    this.runButton.type = "button";
    this.runButton.innerText = ">";
    this.runButton.addEventListener("click", () => this.update());
    this.object.appendChild(this.runButton);
    this.removeButton = document.createElement("button");
    this.removeButton.className = "loopRemoveButton";
    this.removeButton.type = "button";
    this.removeButton.innerText = "x";
    this.object.appendChild(this.removeButton);

    this.stepsBox = document.createElement("div");
    this.stepsBox.className = "stepsBox";
    this.object.appendChild(this.stepsBox);

    this.addBox = document.createElement("div");
    this.addBox.className = "addBox";
    this.object.appendChild(this.addBox);
    this.addActionButton = document.createElement("button");
    this.addActionButton.className = "addActionButton";
    this.addActionButton.type = "button";
    this.addActionButton.innerText = "Add Action";
    this.addActionButton.addEventListener("click", () => this.addStep(false));
    this.addBox.appendChild(this.addActionButton);
    this.addLoopButton = document.createElement("button");
    this.addLoopButton.className = "addLoopButton";
    this.addLoopButton.type = "button";
    this.addLoopButton.innerText = "Add Loop";
    this.addLoopButton.addEventListener("click", () => this.addStep(true));
    this.addBox.appendChild(this.addLoopButton);

    this.update = this._update.bind(this);
    this.addStep = this._addStep.bind(this);
  }
  _update() {
    let nLoops = checkValue(this.nLoopTextbox.value);
    for (let i = 0; i < nLoops; i++) {
      this.steps.forEach(step => step.update());
    }
  }
  _addStep(loop, positionInput) {
    let position = this.steps.length;
    if (positionInput != undefined) { position = positionInput; }
    let step;
    if (loop) {
      step = new _loop(this);
    } else {
      step = new _action(this);
    }
    this.steps.splice(position, 0, step);
    //this.stepsBox.appendChild(action.object);
    this.stepsBox.innerHTML = "";
    this.steps.forEach(step => this.stepsBox.appendChild(step.object));
  }
  /*_addLoop() {
    let loop = new _loop(this);
    this.steps.push(loop);
    this.stepsBox.appendChild(loop.object);
    }*/
  get stepIndex() {
    return this.parent.steps.findIndex(step => step == this);
  }
}

var variables = new Map();
var game;
var c;

window.onload = start;
function start() {
  game = new _loop();
  document.getElementById("programBox").appendChild(game.object);
  c = createCanvas();
  document.getElementById("canvasBox").appendChild(c.c);
}

window.addEventListener("keydown", e => keyHandler(e));

function keyHandler(e) {
  let key = e.key;
  switch (key) {
    case "\\":
      game.update();
      break;
  }
}

function checkValue(inputValue) {
  if (isNumeric(inputValue)) {
    return Number(inputValue)
  }
  if (typeof inputValue == "number") {
    return inputValue;
  }
  if (typeof inputValue == "string") {
    if (variables.has(inputValue)) {
      return variables.get(inputValue);
    } else {
      variables.set(inputValue, 0);
      return variables.get(inputValue);
    }
  }
}

function isNumeric(str) {
  return str.trim() !== "" && !isNaN(str);
}
