var dc = {c:0,ctx:0,mouse:{x1:0,y1:0,x2:0,y2:0}}
var voxels = []
var camera = {x:10.5,y:10,z:29}
var time = {f:0,fps:30,fpsInterval:0,now:0,then:0,elapsed:0,stop:"false"}

class voxel {
	constructor(x,y,z,r) {
		this.x = x
		this.y = y
		this.z = z
		this.points = []
		this.points.push({x:x-r,y:y,z:z})
		this.points.push({x:x+r,y:y,z:z})
		this.points.push({x:x,y:y-r,z:z})
		this.points.push({x:x,y:y+r,z:z})
		this.points.push({x:x,y:y,z:z-r})
		this.points.push({x:x,y:y,z:z+r})
	}
}

function addEventListeners() {
	dc.c.onmousedown = function(e) {
		dc.mouse.x1 = e.x
		dc.mouse.y1 = e.y
	}
	dc.c.onmouseup = function(e) {
		dc.mouse.x2 = e.x
		dc.mouse.y2 = e.y
		moveCamera()
	}
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
}

function startAnimation() {
	time.fpsInterval = time.fps/1000
	requestAnimationFrame(animating)
}

function animating() {
	if (time.stop=="true") {return}
	requestAnimationFrame(animating)
	time.now = performance.now()
	time.elapsed = time.now - time.then
	if (time.elapsed>=time.fpsInterval) {
		update()
		time.then = time.now
		time.f++
	}
}

window.onload = function() {
	createDisplay()
	addEventListeners()
	start()
	startAnimation()
}

function start() {
	voxels.push(new voxel(10,20,30,1))
	voxels.push(new voxel(12,22,30,1))
	voxels.push(new voxel(14,24,30,1))
	voxels.push(new voxel(8,22,30,1))
	voxels.push(new voxel(10,24,30,1))
	voxels.push(new voxel(12,26,30,1))
}

function update() {
	camera.x = 11+2*Math.sin(time.f/100)
	camera.z = 30+2*Math.cos(time.f/100)
	drawVoxels()
}

function moveCamera() {
	let dx = dc.mouse.x2-dc.mouse.x1
	let dy = dc.mouse.y2-dc.mouse.y1
	camera.x = camera.x-dx/window.innerWidth
	camera.z = camera.z+dy/window.innerWidth
	dc.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
	drawVoxels()
}

function drawVoxels() {
	dc.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
	for (let i=0;i<voxels.length;i++) {
		let t = voxels[i]
		drawLine(t.points[0],t.points[2])
		drawLine(t.points[0],t.points[3])
		drawLine(t.points[0],t.points[4])
		drawLine(t.points[0],t.points[5])
		drawLine(t.points[1],t.points[2])
		drawLine(t.points[1],t.points[3])
		drawLine(t.points[1],t.points[4])
		drawLine(t.points[1],t.points[5])
		drawLine(t.points[2],t.points[4])
		drawLine(t.points[2],t.points[5])
		drawLine(t.points[3],t.points[4])
		drawLine(t.points[3],t.points[5])
	}
}

function drawLine(p1,p2) {
	let Rx = window.innerWidth
	let Ry = window.innerHeight
	let x1 = Rx*(p1.x-camera.x)/(p1.y-camera.y) + window.innerWidth/2
	let x2 = Rx*(p2.x-camera.x)/(p2.y-camera.y) + window.innerWidth/2
	let y1 = -Rx*(p1.z-camera.z)/(p1.y-camera.y) + window.innerHeight/2
	let y2 = -Rx*(p2.z-camera.z)/(p2.y-camera.y) + window.innerHeight/2
	dc.ctx.beginPath()
	dc.ctx.moveTo(x1,y1)
	dc.ctx.lineTo(x2,y2)
	dc.ctx.stroke()
}