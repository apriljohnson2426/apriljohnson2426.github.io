var item = []
var dc = {c:0,ctx:0,s:1,x:0,y:0,tracking:"false"}
var time = {fps:60,fpsInterval:0,now:0,then:0,elapsed:0,stop:"false",f:0,fsince:0,s:0,fpsr:0,fpsrset:"false"}
var mouse = {x1:0,y1:0,x2:0,y2:0,dx:0,dy:0}

function startAnimation() {
	time.fpsInterval = 1000/time.fps
	time.then = performance.now()
	requestAnimationFrame(animation)
}
function animation() {
	if (time.stop=="true") {return}
	requestAnimationFrame(animation)
	time.now = performance.now()
	time.elapsed = time.now - time.then
	time.then = time.now
	time.f++
	time.fsince++
	if (time.now/1000>time.s) {
		time.fpsr = time.fsince
		console.log(time.s + " " + time.fpsr)
		time.fsince = 0
		time.s++
	}
	if (time.fpsr>time.fps) {time.fps = time.fpsr}
	update()
}

class circle {
	constructor(mass,radius,x,y,force,acceleration,velocity) {
		if (mass) {this.mass = mass} else {this.mass = 0}
		if (radius) {this.radius = radius} else {this.radius = 0}
		if (x) {this.x = x} else {this.x = 0}
		if (y) {this.y = y} else {this.y = 0}
		if (force) {this.force = force} else {this.force = {magnitude:0,angle:0}}
		if (acceleration) {this.acceleration = acceleration} else {this.acceleration = {magnitude:0,angle:0}}
		if (velocity) {this.velocity = velocity} else {this.velocity = {magnitude:0,angle:0}}
	}
}

function getDistance(item1,item2) {
	let x1 = item1.x
	let y1 = item1.y
	let x2 = item2.x
	let y2 = item2.y
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
}
function getDirection(item1,item2) {
	let x = item2.x-item1.x
	var y = item2.y-item1.y
	if (x>0) {return Math.PI/2 - Math.atan(y/x)}
	if (x<0) {return 3*Math.PI/2 - Math.atan(y/x)}
	if (y<0) {return Math.PI}
	return 0
}
function getGravityForce(item1,item2) {
	let G = 6.674e-11
	let m1 = item1.mass
	let m2 = item2.mass
	let r = getDistance(item1,item2)
	let magnitude = G*m1*m2/(r*r)
	let angle = getDirection(item1,item2)
	return {magnitude,angle}
}
function addVectors(vector1,vector2) {
	let x1 = vector1.magnitude*Math.sin(vector1.angle)
	let y1 = vector1.magnitude*Math.cos(vector1.angle)
	let x2 = vector2.magnitude*Math.sin(vector2.angle)
	let y2 = vector2.magnitude*Math.cos(vector2.angle)
	let x = x2 + x1
	let y = y2 + y1
	let magnitude = Math.sqrt(x*x+y*y)
	if (x>0) {return {magnitude, angle: Math.PI/2 - Math.atan(y/x)}}
	if (x<0) {return {magnitude, angle: 3*Math.PI/2 - Math.atan(y/x)}}
	if (y<0) {return {magnitude, angle: Math.PI}}
	return {magnitude,angle:0}
}

window.onload = function() {
	createDisplay()
	addEventListeners()
	start()
	startAnimation()
}

function addEventListeners() {
	document.addEventListener("wheel", function(e) {
		scaleDisplayContents(e.deltaY)
	})
	dc.c.onmousedown = function(e) {
		mouse.x1 = e.x
		mouse.y1 = e.y
	}
	dc.c.onmouseup = function(e) {
		mouse.x2 = e.x
		mouse.y2 = e.y
		mouse.dx = mouse.x2 - mouse.x1
		mouse.dy = mouse.y2 - mouse.y1
		translateDisplay(mouse)
	}
}
function start() {
	item.push(new circle(1e17,158,0,0,0,0,{magnitude:180,angle:3*Math.PI/2}))
	item.push(new circle(1e16,50,0,300,0,0,{magnitude:340,angle:3*Math.PI/2}))
	item.push(new circle(1e15,16,0,370,0,0,{magnitude:443,angle:3*Math.PI/2}))
	item.push(new circle(1e18,1000,0,2000,0,0,0))
	dc.tracking = "false"
	scaleDisplayContents(1)
	scaleDisplayContents(1)
	scaleDisplayContents(1)
	dc.y = -400
	//big chungus item.push(new circle(1e23,1000000,0,1000600,0,0,0))
}

function update() {
	applyGravity()
	applyForce()
	applyAcceleration()
	applyVelocity()
	moveTracker()
	if (time.f%1==0) {drawItems()}
}
function applyGravity() {
	//Gravity
	for (let i=0;i<item.length;i++) {
		for (let j=0;j<item.length;j++) {
			if (j==i) {continue}
			let vector1 = item[i].force
			let vector2 = getGravityForce(item[i],item[j])
			item[i].force = addVectors(vector1,vector2)
		}
	}
}
function applyForce() {
	for (let i=0;i<item.length;i++) {
		let vector1 = item[i].acceleration
		let vector2 = {
			magnitude: item[i].force.magnitude/item[i].mass,
			angle: item[i].force.angle
		}
		item[i].acceleration = addVectors(vector1,vector2)
		item[i].force = {magnitude:0,angle:0}
	}
}
function applyAcceleration() {
	for (let i=0;i<item.length;i++) {
		let vector1 = item[i].velocity
		let vector2 = {
			magnitude: item[i].acceleration.magnitude/time.fps,
			angle: item[i].acceleration.angle
		}
		item[i].velocity = addVectors(vector1,vector2)
		item[i].acceleration = {magnitude:0,angle:0}
	}
}
function applyVelocity() {
	for (let i=0;i<item.length;i++) {
		let xVelocity = item[i].velocity.magnitude*Math.sin(item[i].velocity.angle)
		let yVelocity = item[i].velocity.magnitude*Math.cos(item[i].velocity.angle)
		item[i].x = item[i].x + xVelocity/time.fps
		item[i].y = item[i].y + yVelocity/time.fps
	}
}
function applyCollision() {
	for (let i=0;i<item.length;i++) {
		for (let j=0;j<item.length;j++) {
			if (j==i) {continue}
			if (getDistance(item[i],item[j])<=item[i].radius+item[j].radius) {
				
			}
		}
	}
}
function moveTracker() {
	if (dc.tracking!=="false") {
		dc.x = item[dc.tracking].x*(-1)*dc.s
		dc.y = item[dc.tracking].y*(-1)*dc.s
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
function drawItems() {
	dc.ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
	dc.ctx.fillStyle = "#000000"
	dc.ctx.fillRect(0,0,window.innerWidth,window.innerHeight)
	dc.ctx.fillStyle = "#DDDDDD"
	dc.ctx.globalCompositeOperation = "lighter"
	for (let i=0;i<item.length;i++) {
		dc.ctx.beginPath()
		let t = item[i]
		dc.ctx.moveTo(dc.x+dc.s*t.x+dc.s*t.radius+window.innerWidth/2,dc.x+dc.s*t.y+window.innerHeight/2)
		dc.ctx.arc(dc.x+dc.s*t.x+window.innerWidth/2,dc.y+dc.s*t.y+window.innerHeight/2,dc.s*t.radius,0,2*Math.PI)
		dc.ctx.fill()
	}
}
function scaleDisplayContents(scale) {
	if (scale>0) {
		dc.s = dc.s/2
		translateDisplay({dx:dc.x/(-2),dy:dc.y/(-2)})
	}
	if (scale<0) {
		dc.s = dc.s*2
		translateDisplay({dx:dc.x,dy:dc.y})
	}
}
function translateDisplay(translate) {
	dc.x = dc.x + translate.dx
	dc.y = dc.y + translate.dy
}