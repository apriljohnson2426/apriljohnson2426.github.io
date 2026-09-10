var game = {
  newClaimTime: 0,
  lastClaimTime: 0,
  stack: 0,
  stackMult: 0.05,
  players: new Map(),
  recentKey: "z",
};
var time = { f: 0, stop: true };
var c = { c: 0, ctx: 0 };
var conditions = {
  self: { divisorAdd: 0, divisorMult: 1.5 },
  other: { divisorAdd: 0, divisorMult: 0.7 },
};
var colorPalette = new Map([
  ["0", "hsl(0,0%,0%)"],
  ["1", "hsl(0,100%,50%)"],
  ["2", "hsl(45,100%,50%)"],
  ["3", "hsl(90,100%,50%)"],
  ["4", "hsl(135,100%,50%)"],
  ["5", "hsl(180,100%,50%)"],
  ["6", "hsl(225,100%,50%)"],
  ["7", "hsl(270,100%,50%)"],
  ["8", "hsl(315,100%,50%)"],
  ["9", "hsl(0,0%,100%)"],
]);

class _player {
  constructor(key = "z") {
    this.key = key;
    this.scores = [];
    this.scoreDivisor = 1;
    this.color = colorPalette.get("0");
  }
  keyPress() {
    if (time.stop) {
      return;
    }
    this.scores.push(0 + game.stack / this.scoreDivisor);
    game.lastClaimTime = performance.now();
    this.scoreDivisor += conditions.self.divisorAdd;
    this.scoreDivisor *= conditions.self.divisorMult;
    for (const [playerKey, playerData] of game.players) {
      if (playerData.key == this.key) {
        continue;
      }
      playerData.scoreDivisor += conditions.other.divisorAdd;
      playerData.scoreDivisor *= conditions.other.divisorMult;
    }
    game.stack = 0;
  }
  get scoreTotal() {
    let n = 0;
    this.scores.forEach((score) => {
      n += Number(score);
    });
    return n;
  }
}

function start() {
  document.body.style.backgroundColor = colorPalette.get("9");
  document.body.style.margin = "0px";
  document.body.style.padding = "0px";
  document.body.style.overflow = "hidden";
  createCanvas(window.innerWidth, window.innerHeight);
  c.ctx.font = '24px "Courier New", Courier, serif, monospace';
  c.ctx.fillText("Press a letter to add a player", 50, 50);
  c.ctx.fillText("Press a number to pick a colour", 50, 100);
  c.ctx.fillText("Press space to start/stop/reset", 50, 150);
}

function update() {
  if (!time.stop) {
    requestAnimationFrame(update);
  }
  for (const [playerKey, playerData] of game.players) {
    if (playerData.scoreTotal >= 500) {
      time.stop = true;
    }
  }
  game.newClaimTime = performance.now();
  game.stack = (game.newClaimTime - game.lastClaimTime) * game.stackMult;
  draw();
}

function createCanvas(width = 640, height = 480) {
  c.c = document.createElement("canvas");
  c.ctx = c.c.getContext("2d");
  c.c.width = width;
  c.c.height = height;
  document.body.appendChild(c.c);
}

function handleKeypress(e) {
  if (e.key == " ") {
    if (time.stop) {
      game.stack = 0;
      for (const [playerKey, playerData] of game.players) {
        playerData.scores = [];
        playerData.scoreDivisor = 1;
      }
      time.stop = false;
      game.lastClaimTime = performance.now();
      requestAnimationFrame(update);
    } else {
      time.stop = true;
    }
    return;
  }
  if (isLetter(e.key)) {
    game.recentKey = e.key;
    if (game.players.has(e.key)) {
      game.players.get(e.key).keyPress();
      return;
    } else {
      game.players.set(e.key, new _player(e.key));
      draw();
      return;
    }
  }
  if (isNumber(e.key)) {
    if (game.players.has(game.recentKey)) {
      game.players.get(game.recentKey).color = colorPalette.get(e.key);
      draw();
    }
  }
}

function isLetter(str) {
  return /^[a-z]$/.test(str);
}

function isNumber(str) {
  return /^[0-9]$/.test(str);
}

function draw() {
  c.ctx.clearRect(0, 0, c.c.width, c.c.height);
  c.ctx.fillRect(0, 0, game.stack, 20);
  let i = 1;
  for (const [playerKey, playerData] of game.players) {
    c.ctx.fillStyle = playerData.color;
    c.ctx.fillText(
      playerData.key + "/" + playerData.scoreDivisor + ": ",
      20,
      i * 30 + 20,
    );
    c.ctx.fillRect(100, i * 30, Math.min(playerData.scoreTotal, 500), 20);
    let leadX = 100 + Math.min(playerData.scoreTotal, 500);
    let leadY = i * 30 + 15;
    let leadW = Math.min(
      game.stack / playerData.scoreDivisor,
      500 - playerData.scoreTotal,
    );
    let leadH = 5;
    c.ctx.fillRect(leadX, leadY, leadW, leadH);
    c.ctx.lineWidth = 2;
    drawFish(leadX + leadW, leadY - 5, 5);
    c.ctx.lineWidth = 1;
    c.ctx.fillStyle = "hsl(0,0%,0%)";
    c.ctx.strokeRect(100, i * 30, 500, 20);
    i++;
  }
}

function drawFish(x, y, size) {
  c.ctx.beginPath();
  c.ctx.moveTo(x - size * 2, y);
  c.ctx.lineTo(x - size * 3, y + size);
  c.ctx.lineTo(x - size * 3, y - size);
  c.ctx.lineTo(x - size, y + size);
  c.ctx.lineTo(x, y);
  c.ctx.lineTo(x - size, y - size);
  c.ctx.lineTo(x - size * 2, y);
  c.ctx.stroke();
  c.ctx.fill();
}

window.onload = start;
window.addEventListener("keypress", function (e) {
  handleKeypress(e);
});
