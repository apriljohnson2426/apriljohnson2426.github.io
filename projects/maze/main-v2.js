var c = {c:0, ctx:0}
var rooms = [];
var variables = {roomChance: 0.5, chanceSubtract: 0.1, scale: 50}
var start;
var currentRoom = "M";
var nVisited = 1;
var touchCoord = {start: {x: 0, y: 0}, end: {x: 0, y: 0}, difference: {x: 0, y: 0}}
var mouseCoord = {down: {x: 0, y: 0}, up: {x: 0, y: 0}, difference: {x: 0, y: 0}}

class room {
	constructor(id, up, down, left, right, x, y) {
		this.id = id;
		if (up == null) {
			this.up = Math.random();
		} else {
			this.up = up;
		}
		if (down == null) {
			this.down = Math.random();
		} else {
			this.down = down;
		}
		if (left == null) {
			this.left = Math.random();
		} else {
			this.left = left;
		}
		if (right == null) {
			this.right = Math.random();
		} else {
			this.right = right;
		}
		this.x = x;
		this.y = y;
		this.visited = false;
	}
}

window.onload = function() {
	start = new room("M", null, null, null, null, 0, 0);
	start.visited = true;
	rooms.push(start);
	for (let i=0; i<32; i++) {
		generatePath();
	}
	console.log(rooms.length);
	createCanvas();
	window.addEventListener('keydown', (event) => {handleKeydown(event)}, false);
	window.addEventListener('touchstart', handleTouchStart);
	window.addEventListener('touchend', handleTouchEnd);
	window.addEventListener('mousedown', (event) => {handleMouseDown(event)});
	window.addEventListener('mouseup', (event) => {handleMouseUp(event)});
	drawCurrentRoom();
}

function generatePath() {
	let n = rooms.length;
	for (let i=0; i<n; i++) {
		if (rooms[i].up    < variables.roomChance) {
			rooms.push(new room(rooms[i].id+"U", null, rooms[i].id, null, null, rooms[i].x, rooms[i].y-1));
			rooms[i].up = rooms[i].id+"U";
		} else {
			//rooms[i].up = "block";
		}
		if (rooms[i].down  < variables.roomChance) {
			rooms.push(new room(rooms[i].id+"D", rooms[i].id, null, null, null, rooms[i].x, rooms[i].y+1));
			rooms[i].down = rooms[i].id+"D";
		} else {
			//rooms[i].down = "block";
		}
		if (rooms[i].left  < variables.roomChance) {
			rooms.push(new room(rooms[i].id+"L", null, null, null, rooms[i].id, rooms[i].x-1, rooms[i].y));
			rooms[i].left = rooms[i].id+"L";
		} else {
			//rooms[i].left = "block";
		}
		if (rooms[i].right < variables.roomChance) {
			rooms.push(new room(rooms[i].id+"R", null, null, rooms[i].id, null, rooms[i].x+1, rooms[i].y));
			rooms[i].right = rooms[i].id+"R";
		} else {
			//rooms[i].right = "block";
		}
	}
}

function countLayers() {
	var nRoomsPerLayer = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	for (let i=0;i<rooms.length;i++) {
		nRoomsPerLayer[rooms[i].id.length]++;
	}
	return nRoomsPerLayer;
}

function createCanvas() {
	c.c = document.createElement("canvas");
	c.ctx = c.c.getContext("2d");
	document.body.appendChild(c.c);
	c.c.width = window.innerWidth;
	c.c.height = window.innerHeight;
	document.body.style.padding = "0px";
	document.body.style.margin = "0px";
	document.body.style.overflow = "hidden";
}

function drawRooms() {
	for (let i=0;i<rooms.length;i++) {
		let roomX = window.innerWidth/2 + variables.scale*rooms[i].x + rooms[i].id.length;
		let roomY = window.innerHeight/2 + variables.scale*rooms[i].y + rooms[i].id.length;
		let scale = variables.scale;
		let depth = rooms[i].id.length;
		c.ctx.strokeStyle = "hsl("+depth*10+",100%,50%)";
		c.ctx.beginPath();
		//c.ctx.strokeRect(roomX - scale/2, roomY - scale/2, scale, scale);
		if (typeof rooms[i].up === 'string' && rooms[i].up.length > rooms[i].id.length) {
			c.ctx.beginPath();
			c.ctx.moveTo(roomX,roomY);
			c.ctx.lineTo(roomX,roomY-scale);
			c.ctx.stroke();
		}
		if (typeof rooms[i].down === 'string' && rooms[i].down.length > rooms[i].id.length) {
			c.ctx.beginPath();
			c.ctx.moveTo(roomX,roomY);
			c.ctx.lineTo(roomX,roomY+scale);
			c.ctx.stroke();
		}
		if (typeof rooms[i].left === 'string' && rooms[i].left.length > rooms[i].id.length) {
			c.ctx.beginPath();
			c.ctx.moveTo(roomX,roomY);
			c.ctx.lineTo(roomX-scale,roomY);
			c.ctx.stroke();
		}
		if (typeof rooms[i].right === 'string' && rooms[i].right.length > rooms[i].id.length) {
			c.ctx.beginPath();
			c.ctx.moveTo(roomX,roomY);
			c.ctx.lineTo(roomX+scale,roomY);
			c.ctx.stroke();
		}
	}
}

function drawCurrentRoom() {
	for (let i=0;i<rooms.length;i++) {
		if (rooms[i].id == currentRoom) {
			let roomX = window.innerWidth/2 + variables.scale*rooms[i].x + rooms[i].id.length;
			let roomY = window.innerHeight/2 + variables.scale*rooms[i].y + rooms[i].id.length;
			let scale = variables.scale;
			let depth = rooms[i].id.length;
			c.ctx.strokeStyle = "hsl("+depth*360/24+",100%,50%)";
			c.ctx.beginPath();
			c.ctx.strokeRect(roomX - scale/2, roomY - scale/2, scale, scale);
			if (typeof rooms[i].up === 'string') {
				c.ctx.beginPath();
				c.ctx.moveTo(roomX,roomY);
				c.ctx.lineTo(roomX,roomY-scale);
				c.ctx.stroke();
			}
			if (typeof rooms[i].down === 'string') {
				c.ctx.beginPath();
				c.ctx.moveTo(roomX,roomY);
				c.ctx.lineTo(roomX,roomY+scale);
				c.ctx.stroke();
			}
			if (typeof rooms[i].left === 'string') {
				c.ctx.beginPath();
				c.ctx.moveTo(roomX,roomY);
				c.ctx.lineTo(roomX-scale,roomY);
				c.ctx.stroke();
			}
			if (typeof rooms[i].right === 'string') {
				c.ctx.beginPath();
				c.ctx.moveTo(roomX,roomY);
				c.ctx.lineTo(roomX+scale,roomY);
				c.ctx.stroke();
			}
		}
	}
}

//DOES NOT WORK
function drawNeighbourRooms() {
	var neighbours = [];
	for (let i=0;i<rooms.length;i++) {
		if (rooms[i].id == currentRoom) {
			if (typeof rooms[i].up === 'string') {neighbours.push(rooms[i].up);}
		}
		if (rooms[i].id == currentRoom) {
			if (typeof rooms[i].down === 'string') {neighbours.push(rooms[i].down);}
		}
		if (rooms[i].id == currentRoom) {
			if (typeof rooms[i].left === 'string') {neighbours.push(rooms[i].left);}
		}
		if (rooms[i].id == currentRoom) {
			if (typeof rooms[i].right === 'string') {neighbours.push(rooms[i].right);}
		}
	}
	for (let i=0;i<neighbours.length;i++) {
		for (let j=0;j<rooms.length;j++) {
			if (neighbours[i].id == rooms[j].id) {
				let roomX = window.innerWidth/2 + variables.scale*rooms[j].x + rooms[j].id.length;
				let roomY = window.innerHeight/2 + variables.scale*rooms[j].y + rooms[j].id.length;
				let scale = variables.scale;
				let depth = rooms[i].id.length;
				c.ctx.strokeStyle = "hsl("+depth*30+",100%,50%)";
				c.ctx.beginPath();
				c.ctx.strokeRect(roomX - scale/2, roomY - scale/2, scale, scale);
				if (typeof rooms[i].up === 'string') {
					c.ctx.beginPath();
					c.ctx.moveTo(roomX,roomY);
					c.ctx.lineTo(roomX,roomY-scale);
					c.ctx.stroke();
				}
				if (typeof rooms[i].down === 'string') {
					c.ctx.beginPath();
					c.ctx.moveTo(roomX,roomY);
					c.ctx.lineTo(roomX,roomY+scale);
					c.ctx.stroke();
				}
				if (typeof rooms[i].left === 'string') {
					c.ctx.beginPath();
					c.ctx.moveTo(roomX,roomY);
					c.ctx.lineTo(roomX-scale,roomY);
					c.ctx.stroke();
				}
				if (typeof rooms[i].right === 'string') {
					c.ctx.beginPath();
					c.ctx.moveTo(roomX,roomY);
					c.ctx.lineTo(roomX+scale,roomY);
					c.ctx.stroke();
				}
			}
		}
	}
}

function move(direction) {
	var newRoom = currentRoom;
	for (let i=0;i<rooms.length;i++) {
		if (rooms[i].id == currentRoom) {
			if (direction == "up" && typeof rooms[i].up === 'string') {
				newRoom = rooms[i].up;
			}
			if (direction == "down" && typeof rooms[i].down === 'string') {
				newRoom = rooms[i].down;
			}
			if (direction == "left" && typeof rooms[i].left === 'string') {
				newRoom = rooms[i].left;
			}
			if (direction == "right" && typeof rooms[i].right === 'string') {
				newRoom = rooms[i].right;
			}
		}
	}
	currentRoom = newRoom;
	for (let i=0;i<rooms.length;i++) {if (rooms[i].id == newRoom) {rooms[i].visited = true;}}
	c.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
	drawCurrentRoom();
	drawProgress();
}

function handleKeydown(event) {
	if (event.key == "ArrowUp") {move("up");}
	if (event.key == "ArrowDown") {move("down");}
	if (event.key == "ArrowLeft") {move("left");}
	if (event.key == "ArrowRight") {move("right");}
}

function handleTouchStart(event) {
	event.preventDefault();
	touchCoord.start.x = event.clientX;
	touchCoord.start.y = event.clientY;
}

function handleTouchEnd(event) {
	event.preventDefault();
	touchCoord.end.x = event.clientX;
	touchCoord.end.y = event.clientY;
	touchCoord.difference.x = touchCoord.end.x - touchCoord.start.x;
	touchCoord.difference.y = touchCoord.end.y - touchCoord.start.y;
	if (Math.abs(touchCoord.difference.x) > Math.abs(touchCoord.difference.y)) {
		if (touchCoord.difference.x > 0) {move("right");}
		if (touchCoord.difference.x < 0) {move("left");}
	} else {
		if (touchCoord.difference.y > 0) {move("down");}
		if (touchCoord.difference.y < 0) {move("up");}
	}
}

function handleMouseDown(event) {
	mouseCoord.down.x = event.clientX;
	mouseCoord.down.y = event.clientY;
}

function handleMouseUp(event) {
	mouseCoord.up.x = event.clientX;
	mouseCoord.up.y = event.clientY;
	mouseCoord.difference.x = mouseCoord.up.x - mouseCoord.down.x;
	mouseCoord.difference.y = mouseCoord.up.y - mouseCoord.down.y;
	if (Math.abs(mouseCoord.difference.x) > Math.abs(mouseCoord.difference.y)) {
		if (mouseCoord.difference.x > 0) {move("right");}
		if (mouseCoord.difference.x < 0) {move("left");}
	} else {
		if (mouseCoord.difference.y > 0) {move("down");}
		if (mouseCoord.difference.y < 0) {move("up");}
	}
}

function calculateVisited() {
	var n = 0;
	for (let i=0;i<rooms.length;i++) {
		if (rooms[i].visited) {n++;}
	}
	return n;
}

function drawProgress() {
	c.ctx.font = "50px serif";
	c.ctx.fillText(calculateVisited() + " / " + rooms.length, 20, 50);
}