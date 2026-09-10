function createCanvas() {
  let c = { c: 0, ctx: 0 };
  c.c = document.createElement("canvas");
  c.c.className = "canvas";
  c.ctx = c.c.getContext("2d");
  variables.set("canvasWidth", 640);
  variables.set("canvasHeight", 480);
  c.c.width = 640;
  c.c.height = 480;
  return c;
}

function _cSetCanvasSize(widthInput, heightInput) {
  let width = checkValue(widthInput);
  let height = checkValue(heightInput);
  variables.set("canvasWidth", width);
  variables.set("canvasHeight", height);
  c.c.width = variables.get("canvasWidth");
  c.c.height = variables.get("canvasHeight");
}

function _cLine(aInput, bInput, relative = false, rt = false, line = true) {
  let a = checkValue(aInput);
  let b = checkValue(bInput);
  let x = a;
  let y = b;
  if (rt) {
    x = a * Math.sin(b);
    y = a * Math.cos(b);
  }
  if (relative) {
    x = x + checkValue("x");
    y = y + checkValue("y");
  }
  variables.set("x", x);
  variables.set("y", y);
  if (line) {
    c.ctx.lineTo(x, y);
  } else {
    c.ctx.moveTo(x, y);
  }
}

function _cMXYA(xInput, yInput) {
  let x = checkValue(xInput);
  variables.set("x", x);
  let y = checkValue(yInput);
  variables.set("y", y);
  c.ctx.moveTo(x, y);
}

function _cMXYR(xInput, yInput) {
  let x = checkValue("x") + checkValue(xInput);
  variables.set("x", x);
  let y = checkValue("y") + checkValue(yInput);
  variables.set("y", y);
  c.ctx.moveTo(x, y);
}

function _cClear() {
  c.ctx.clearRect(0, 0, c.c.width, c.c.height);
}

function _cBegin() {
  c.ctx.beginPath();
}

function _cStroke(width) {
  if (width != undefined) {
    c.ctx.lineWidth = checkValue(width);
  }
  c.ctx.stroke();
}

function _cFill() {
  c.ctx.fill();
}

function _cRGBA(rInput = 0, gInput = 0, bInput = 0, aInput = 1.0) {
  let r = checkValue(rInput);
  let g = checkValue(gInput);
  let b = checkValue(bInput);
  let a = checkValue(aInput);
  c.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
  c.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
}

function _cHSLA(hInput = 0, sInput = 0, lInput = 0, aInput = 1.0) {
  let h = checkValue(hInput);
  let s = checkValue(sInput);
  let l = checkValue(lInput);
  let a = checkValue(aInput);
  c.ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
  c.ctx.fillStyle = `hsla(${h}, ${s}%, ${l}%, ${a})`;
}
