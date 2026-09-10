var dc = {c:0,ctx:0}
var x = window.innerWidth/2
var y = window.innerHeight/2
var length = 10
var iterations = 1000

window.onload = function() {
  createDisplay()
  drawPath()
}

function drawPath() {
  dc.ctx.beginPath()
  dc.ctx.moveTo(x,y)
  for (let i=0;i<iterations;i++) {
    moveRandomWay()
  }
  dc.ctx.stroke()
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
  dc.ctx.lineTo(x+length*dx,y+length*dy)
  x = x+length*dx
  y = y+length*dy
}

function refresh() {
  x = window.innerWidth/2
  y = window.innerHeight/2
  dc.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
  drawPath()
}