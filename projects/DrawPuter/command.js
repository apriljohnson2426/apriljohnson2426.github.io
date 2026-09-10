function parseCommand(commandInput) {
  if (commandInput.includes("=") || commandInput.includes("++") || commandInput.includes("--")) {
    math.evaluate(commandInput, variables);
    return;
  }
  let command = commandInput.split(" ");
  if (command[0] == "LAXY") {
    _cLine(command[1], command[2], false, false, true);
  }
  if (command[0] == "LRXY") {
    _cLine(command[1], command[2], true, false, true);
  }
  if (command[0] == "LART") {
    _cLine(command[1], command[2], false, true, true);
  }
  if (command[0] == "LRRT") {
    _cLine(command[1], command[2], true, true, true);
  }
  if (command[0] == "MAXY") {
    _cLine(command[1], command[2], false, false, false);
  }
  if (command[0] == "MRXY") {
    _cLine(command[1], command[2], true, false, false);
  }
  if (command[0] == "MART") {
    _cLine(command[1], command[2], false, true, false);
  }
  if (command[0] == "MRRT") {
    _cLine(command[1], command[2], true, true, false);
  }
  if (command[0] == "Clear") {
    _cClear();
  }
  if (command[0] == "Begin") {
    _cBegin();
    _cLine("x", "y", false, false, false);
  }
  if (command[0] == "Stroke") {
    _cStroke(command[1]);
  }
  if (command[0] == "Fill") {
    _cFill();
  }
  if (command[0] == "RGBA") {
    _cRGBA(command[1], command[2], command[3], command[4]);
  }
  if (command[0] == "HSLA") {
    _cHSLA(command[1], command[2], command[3], command[4]);
  }
  if (command[0] == "CanvasSize") {
    _cSetCanvasSize(command[1], command[2]);
  }
}
