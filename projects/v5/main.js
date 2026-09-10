var dc = {c:0,ctx:0}
var tool = "select"
var nodeSelect1 = []
var nodeSelect2 = []
var items = []
var xx1
var yy1
var xx2
var yy2
var sr = 10

//AddEvents
function addEvents() {
	dc.c.addEventListener("mousedown", function(event) {
		xx1 = event.clientX
		yy1 = event.clientY
		mouseDownHandler()
	})
	dc.c.addEventListener("mouseup", function(event) {
		xx2 = event.clientX
		yy2 = event.clientY
		mouseUpHandler()
	})
	dc.c.addEventListener("touchstart", function(event) {
		xx1 = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX)
		yy1 = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY)
		mouseDownHandler()
	})
	dc.c.addEventListener("touchend", function(event) {
		xx2 = (event.targetTouches[0] ? event.targetTouches[0].pageX : event.changedTouches[event.changedTouches.length-1].pageX)
		yy2 = (event.targetTouches[0] ? event.targetTouches[0].pageY : event.changedTouches[event.changedTouches.length-1].pageY)
		mouseUpHandler()
	})
	document.addEventListener("keydown", function(e) {
		if (e.key=="s") {tool="select"}
		if (e.key=="l") {tool="line"}
		if (e.key=="c") {tool="curve"}
		if (e.key=="ArrowUp") {sr = sr + 5; update()}
		if (e.key=="ArrowDown") {
			if (sr-5<0) {sr=0} else {sr=sr-5}
			update()
		}
	})
}
function mouseDownHandler() {
	if (tool=="select") {
		checkNode(xx1,yy1,"nodeSelect1")
	}
	if (tool=="line") {
		checkNode(xx1,yy1,"nodeSelect1")
		if (nodeSelect1.length>0) {xx1=nodeSelect1[0].x,yy1=nodeSelect1[0].y}
	}
	if (tool=="curve") {
		checkNode(xx1,yy1,"nodeSelect1")
		if (nodeSelect1.length>0) {xx1=nodeSelect1[0].x,yy1=nodeSelect1[0].y}
	}
}
function mouseUpHandler() {
	if (tool=="select") {
		moveNode(nodeSelect1)
	}
	if (tool=="line") {
		checkNode(xx2,yy2,"nodeSelect2")
		if (nodeSelect2.length>0) {xx2=nodeSelect2[0].x,yy2=nodeSelect2[0].y}
		items.push(new line())
	}
	if (tool=="curve") {
		checkNode(xx2,yy2,"nodeSelect2")
		if (nodeSelect2.length>0) {xx2=nodeSelect2[0].x,yy2=nodeSelect2[0].y}
		items.push(new curve())
	}
	update()
}

//Helper Functions
function checkNode(xx,yy,nodeSelect) {
	if (nodeSelect=="nodeSelect1") {
		nodeSelect1 = []
	}
	if (nodeSelect=="nodeSelect2") {
		nodeSelect2 = []
	}
	var t = items
	for (i=0;i<t.length;i++) {
		for (j=0;j<t[i].nodes.length;j++) {
			var tt = t[i].nodes[j]
			if (tt.x-sr<xx&&xx<tt.x+sr&&tt.y-sr<yy&&yy<tt.y+sr) {
				if (nodeSelect=="nodeSelect1") {
					nodeSelect1.push(tt)
				}
				if (nodeSelect=="nodeSelect2") {
					nodeSelect2.push(tt)
				}
			}
		}
	}
	return undefined
}
function moveNode(node) {
	if (node==undefined) {return}
	for (i=0;i<node.length;i++) {
		node[i].x = xx2
		node[i].y = yy2
	}
}

//Start
window.onload = function() {
	document.body.style.overflow = "hidden"
	createDisplay()
	addEvents()
	update()
}

//Update
function update() {
	var ctx = dc.ctx
	ctx.clearRect(0,0,dc.c.width,dc.c.height)
	ctx.font = "20px Arial"
	ctx.fillText("s = select",10,20)
	ctx.fillText("l = line",10,40)
	ctx.fillText("c = curve",10,60)
	ctx.fillText("up = +snap",10,80)
	ctx.fillText("down = -snap",10,100)
	drawItems()
	drawNodes()
}

//Create
function createDisplay() {
	dc.c = document.createElement("canvas")
	document.body.appendChild(dc.c)
	dc.ctx = dc.c.getContext("2d")
	dc.c.width = window.innerWidth
	dc.c.height = window.innerHeight
}

//Constructors
function line() {
	this.id = items.length
	this.type = "line"
	this.nodes = [{x:xx1,y:yy1},{x:xx2,y:yy2}]
}
function curve() {
	this.id = items.length
	this.type = "curve"
	this.nodes = [
	{x:xx1,y:yy1},
	{x:2/3*xx1+1/3*xx2,y:2/3*yy1+1/3*yy2},
	{x:1/3*xx1+2/3*xx2,y:1/3*yy1+2/3*yy2},
	{x:xx2,y:yy2}]
}

//Draw
function drawItems() {
	var ctx = dc.ctx
	ctx.beginPath()
	for (i=0;i<items.length;i++) {
		if (items[i].type == "line") {
			let t = items[i].nodes
			ctx.moveTo(t[0].x,t[0].y)
			ctx.lineTo(t[1].x,t[1].y)
		}
		if (items[i].type == "curve") {
			let t = items[i].nodes
			ctx.moveTo(t[0].x,t[0].y)
			ctx.bezierCurveTo(t[1].x,t[1].y,t[2].x,t[2].y,t[3].x,t[3].y)
		}
	}
	ctx.stroke()
}
function drawNodes() {
	var ctx = dc.ctx
	ctx.beginPath()
	for (i=0;i<items.length;i++) {
		for (j=0;j<items[i].nodes.length;j++) {
			var t = items[i].nodes[j]
			ctx.moveTo(t.x+sr,t.y)
			ctx.arc(t.x,t.y,sr,0,2*Math.PI)
		}
	}
	ctx.stroke()
}

//thinks that when i draw a line i draw a curve???