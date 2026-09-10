var dc = {c:0,ctx:0}
var x = window.innerWidth/2
var y = window.innerHeight/2
var length = 1
var iterations = 1000000
var density = 4
var jump = false

window.onload = function() {
  iterations = density*window.innerHeight*window.innerWidth
  createDisplay()
  drawPath()
}

function drawPath() {
  dc.ctx.beginPath()
  dc.ctx.moveTo(x,y)
  for (let i=0;i<iterations;i++) {
    moveRandomWay()
    //drawBox()
  }
  dc.ctx.stroke()
}

function drawBox() {
  dc.ctx.lineTo(x-length,y+length)
  dc.ctx.lineTo(x,y+2*length)
  dc.ctx.lineTo(x+length,y+length)
  dc.ctx.lineTo(x,y)
}

function createDisplay() {
  document.body.style.margin = 0
  document.body.style.padding = 0
  document.body.style.overflow = "hidden"
  dc.c = document.createElement("canvas")
  dc.ctx = dc.c.getContext("2d")
  document.body.appendChild(dc.c)
  dc.c.width = window.innerWidth
  dc.c.height = window.innerHeight
  dc.c.onclick = refresh
}

function moveRandomWay() {
  var dx = Math.random()
  if (dx<0.5) {dx = -1} else {dx = 1}
  var dy = Math.random()
  if (dy<0.5) {dy = -1} else {dy = 1}
  x = x+length*dx
  y = y+length*dy
  dc.ctx.lineTo(x,y)
  wrapAround()
  dc.ctx.moveTo(x,y)
}

function wrapAround() {
  if (x>window.innerWidth) {x = x - window.innerWidth}
  if (x<0) {x = x + window.innerWidth}
  if (y>window.innerHeight) {y = y - window.innerHeight}
  if (y<0) {y = y + window.innerHeight}
}

function refresh() {
  x = window.innerWidth/2
  y = window.innerHeight/2
  length = 1
  dc.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
  drawPath()
  console.log(window.innerHeight)
  console.log(window.innerWidth)
}