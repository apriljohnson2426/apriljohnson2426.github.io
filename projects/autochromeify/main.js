c = {c:0,ctx:0}
tc = {c:0,ctx:0}
img = new Image(4000,3000)
img.src = "img.jpg"

window.onload = function() {
  document.body.style.margin = 0
  document.body.style.padding = 0
  //document.body.style.overflow = "hidden"
  createCanvas()
  createTempCanvas()
  c.ctx.fillStyle = "000000"
  c.ctx.fillRect(0,0,4000,3000)
  createPSD(5000000,5,5)
  c.ctx.globalCompositeOperation = "multiply"
  c.ctx.drawImage(img,0,0)
  c.ctx.globalCompositeOperation = "source-over"
  //c.ctx.drawImage(c.c,0,0,400,300)
}

function createCanvas() {
  c.c = document.createElement("canvas")
  c.ctx = c.c.getContext("2d")
  document.body.appendChild(c.c)
  c.c.width = 4000
  c.c.height = 3000
}

function createTempCanvas() {
  tc.c = document.createElement("canvas")
  tc.ctx = tc.c.getContext("2d")
  tc.c.width = 4000
  tc.c.height = 3000
}

function createPSD(length,min,max) {
  for (let i=0;i<length;i++) {
    c.ctx.beginPath()
    c.ctx.fillStyle = "#FF0000"
    if ((i+1)%3==0) {c.ctx.fillStyle = "#00FF00"}
    if ((i+2)%3==0) {c.ctx.fillStyle = "#0000FF"}
    let x = 4000*Math.random()
    let y = 3000*Math.random()
    let size = min + Math.random()*(max-min)
    c.ctx.arc(x,y,size,0,Math.PI*2)
    c.ctx.fill()
  }
}