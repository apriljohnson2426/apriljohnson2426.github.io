var c = {c:0, ctx: 0};
var time = {stop: "false", f: 0, fps: 60, fpsInterval: 0, now: 0, then: 0, since: 0}
var angleOffset = 0.00001
var angleSearchMult = 1
var zoomSearchMult = 1
var speedChangeMult = 1
var zoom = 1
var n = 1000
var speed = 1

window.addEventListener("keydown", function(e) {
	console.log(e.key);
	if (e.key == "w") {angleOffset += 0.001 * angleSearchMult}
	if (e.key == "q") {angleOffset -= 0.001 * angleSearchMult}
	if (e.key == "2") {angleSearchMult *= 10}
	if (e.key == "1") {angleSearchMult *= 0.1}
	
	if (e.key == "x") {zoom *= Math.pow(2, zoomSearchMult)}
	if (e.key == "z") {zoom *= Math.pow(0.5, zoomSearchMult)}
	if (e.key == "s") {zoomSearchMult *= 2}
	if (e.key == "a") {zoomSearchMult *= 0.5}
	
	if (e.key == "r") {n *= 2}
	if (e.key == "e") {n *= 0.5}
	
	if (e.key == "v") {speed += 1 * speedChangeMult}
	if (e.key == "c") {speed -= 1 * speedChangeMult}
	if (e.key == "f") {speedChangeMult *= 10}
	if (e.key == "d") {speedChangeMult *= 0.1}
});

window.onload = function() {
	createCanvas(window.innerWidth, window.innerHeight)
	c.ctx.strokeStyle = "white"
	startTime()
}

function createCanvas(w,h) {
	c.c = document.createElement("canvas")
	c.ctx = c.c.getContext("2d")
	document.body.appendChild(c.c)
	c.c.setAttribute("width", w)
	c.c.setAttribute("height", h)
}

function startTime() {
	time.fpsInterval = 1000 / time.fps
	time.now = performance.now()
	time.then = time.now
	requestAnimationFrame(timing)
}

function timing() {
	if (time.stop == "true") {return 0}
	time.now = performance.now()
	time.since = time.now - time.then
	if (time.since > time.fpsInterval) {
		console.log("frame")
		loop()
		time.then = time.now
	}
	requestAnimationFrame(timing)
}

function loop() {
	c.ctx.clearRect(0,0,c.c.width, c.c.height)
	draw(angleOffset)
	angleOffset += 0.000001 * speed
}

function draw(var1) {
	var length = 1
	var angle = 2 * Math.PI / 3 + var1
	var x = window.innerWidth / 2
	var y = window.innerHeight / 2
	
	c.ctx.beginPath()
	c.ctx.moveTo(x,y);
	for (let i = 0; i < n; i++) {
		x += length * Math.sin(angle * i)
		y += length * Math.cos(angle * i)
		c.ctx.lineTo(x,y)
		length += 1 * zoom
	}
	c.ctx.stroke()
}