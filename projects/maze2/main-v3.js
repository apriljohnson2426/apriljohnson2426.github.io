var c = {c: 0, ctx: 0};
var rooms = [];
var parameters = {pathChance: 1.0, maxLength: 32, scale: 50, lineWidth: 2, subChancePerRoom: 0.012, maxNRooms: 100};
var player = {currentRoomID: "M", currentRoomIndex: 0, nRoomsVisited: 0};
var timer = {start: 0, finish: 0, elapsed: 0}

class newRoom {
	constructor(id, upID, downID, leftID, rightID, upIndex, downIndex, leftIndex, rightIndex, x, y) {
		this.id = id;
		this.upChance = Math.random() + rooms.length * parameters.subChancePerRoom;
		this.downChance = Math.random() + rooms.length * parameters.subChancePerRoom;
		this.leftChance = Math.random() + rooms.length * parameters.subChancePerRoom;
		this.rightChance = Math.random() + rooms.length * parameters.subChancePerRoom;
		this.upID = upID;
		this.downID = downID;
		this.leftID = leftID;
		this.rightID = rightID;
		this.upIndex = upIndex;
		this.downIndex = downIndex;
		this.leftIndex = leftIndex;
		this.rightIndex = rightIndex;
		this.x = x;
		this.y = y;
		this.visited = false;
	}
}

window.onload = function() {
	rooms.push(new newRoom("M", null, null, null, null, null, null, null, null, 0, 0));
	for (let i=0;i<parameters.maxLength;i++) {
		generatePath();
	}
	window.addEventListener('keydown', (event) => {handleKeydown(event)});
	createCanvas();
	c.ctx.lineWidth = parameters.lineWidth;
	console.log(rooms.length);
	update();
}

function update() {
	if (rooms[player.currentRoomIndex].visited == false) {rooms[player.currentRoomIndex].visited = true; player.nRoomsVisited++;}
	c.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	//c.ctx.fillStyle = "hsla(0, 0%, 100%, 75%)";
	//c.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
	drawRoom(rooms[player.currentRoomIndex]);
	drawNeighbourRooms(rooms[player.currentRoomIndex]);
	//drawPath(rooms[player.currentRoomIndex]);
	drawWalls(rooms[player.currentRoomIndex], "black");
	drawNeighbourWalls(rooms[player.currentRoomIndex]);
	drawProgress();
	if (player.nRoomsVisited == 2 && timer.start == 0) {timer.start = performance.now();}
	if (player.nRoomsVisited > 1) {timer.elapsed = performance.now() - timer.start};
	if (player.nRoomsVisited == rooms.length && timer.finish == 0) {timer.finish = timer.elapsed;}
	drawTimer();
	requestAnimationFrame(update);
}

function regenerate() {
	rooms = []
	player = {currentRoomID: "M", currentRoomIndex: 0, nRoomsVisited: 0};
	timer = {start: 0, finish: 0, elapsed: 0}
	rooms.push(new newRoom("M", null, null, null, null, null, null, null, null, 0, 0));
	for (let i=0;i<parameters.maxLength;i++) {
		generatePath();
	}
	c.ctx.lineWidth = parameters.lineWidth;
	update();
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

function generatePath() {
	let nRooms = rooms.length;
	for (let i=0;i<nRooms;i++) {
		const room = rooms[i];
		if (room.upChance < parameters.pathChance && room.upID == null && rooms.length < parameters.maxNRooms) {
			rooms.push(new newRoom(room.id + "U", null, room.id, null, null, null, i, null, null, room.x, room.y+1));
			room.upID = room.id + "U";
			room.upIndex = rooms.length - 1;
		}
		if (room.downChance < parameters.pathChance && room.downID == null && rooms.length < parameters.maxNRooms) {
			rooms.push(new newRoom(room.id + "D", room.id, null, null, null, i, null, null, null, room.x, room.y-1));
			room.downID = room.id + "D";
			room.downIndex = rooms.length - 1;
		}
		if (room.leftChance < parameters.pathChance && room.leftID == null && rooms.length < parameters.maxNRooms) {
			rooms.push(new newRoom(room.id + "L", null, null, null, room.id, null, null, null, i, room.x-1, room.y));
			room.leftID = room.id + "L";
			room.leftIndex = rooms.length - 1;
		}
		if (room.rightChance < parameters.pathChance && room.rightID == null && rooms.length < parameters.maxNRooms) {
			rooms.push(new newRoom(room.id + "R", null, null, room.id, null, null, null, i, null, room.x+1, room.y));
			room.rightID = room.id + "R";
			room.rightIndex = rooms.length - 1;
		}
	}
}

function drawRoom(room) {
	if (room.visited) {c.ctx.fillStyle = "hsl(120, 50%, 75%)";} else {c.ctx.fillStyle = "hsl(0, 50%, 75%)";}
	const scale = parameters.scale;
	const roomX = window.innerWidth/2 + room.x*scale;
	const roomY = window.innerHeight/2 - room.y*scale;
	c.ctx.fillRect(roomX - scale/2, roomY - scale/2, scale, scale);
}

function drawPath(room) {
	const scale = parameters.scale;
	const roomX = window.innerWidth/2 + room.x*scale;
	const roomY = window.innerHeight/2 - room.y*scale;
	if (room.upID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX, roomY);
		c.ctx.lineTo(roomX, roomY - scale);
		c.ctx.stroke();
	}
	if (room.downID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX, roomY);
		c.ctx.lineTo(roomX, roomY + scale);
		c.ctx.stroke();
	}
	if (room.leftID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX, roomY);
		c.ctx.lineTo(roomX - scale, roomY);
		c.ctx.stroke();
	}
	if (room.rightID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX, roomY);
		c.ctx.lineTo(roomX + scale, roomY);
		c.ctx.stroke();
	}
}

function drawWalls(room, strokeStyle) {
	const scale = parameters.scale;
	const roomX = window.innerWidth/2 + room.x*scale;
	const roomY = window.innerHeight/2 - room.y*scale;
	c.ctx.strokeStyle = strokeStyle;
	if (room.upID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX - scale/2, roomY - scale/2);
		c.ctx.lineTo(roomX - scale/3, roomY - scale/2);
		c.ctx.moveTo(roomX + scale/2, roomY - scale/2);
		c.ctx.lineTo(roomX + scale/3, roomY - scale/2);
		c.ctx.stroke();
	} else {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX - scale/2, roomY - scale/2);
		c.ctx.lineTo(roomX + scale/2, roomY - scale/2);
		c.ctx.stroke()
	}
	if (room.downID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX - scale/2, roomY + scale/2);
		c.ctx.lineTo(roomX - scale/3, roomY + scale/2);
		c.ctx.moveTo(roomX + scale/2, roomY + scale/2);
		c.ctx.lineTo(roomX + scale/3, roomY + scale/2);
		c.ctx.stroke();
	} else {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX - scale/2, roomY + scale/2);
		c.ctx.lineTo(roomX + scale/2, roomY + scale/2);
		c.ctx.stroke()
	}
	if (room.leftID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX - scale/2, roomY - scale/2);
		c.ctx.lineTo(roomX - scale/2, roomY - scale/3);
		c.ctx.moveTo(roomX - scale/2, roomY + scale/2);
		c.ctx.lineTo(roomX - scale/2, roomY + scale/3);
		c.ctx.stroke();
	} else {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX - scale/2, roomY - scale/2);
		c.ctx.lineTo(roomX - scale/2, roomY + scale/2);
		c.ctx.stroke()
	}
	if (room.rightID != null) {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX + scale/2, roomY - scale/2);
		c.ctx.lineTo(roomX + scale/2, roomY - scale/3);
		c.ctx.moveTo(roomX + scale/2, roomY + scale/2);
		c.ctx.lineTo(roomX + scale/2, roomY + scale/3);
		c.ctx.stroke();
	} else {
		c.ctx.beginPath();
		c.ctx.moveTo(roomX + scale/2, roomY - scale/2);
		c.ctx.lineTo(roomX + scale/2, roomY + scale/2);
		c.ctx.stroke()
	}
}

function drawNeighbourRooms(room) {
	if (room.upID != null) {drawRoom(rooms[room.upIndex]);}
	if (room.downID != null) {drawRoom(rooms[room.downIndex]);}
	if (room.leftID != null) {drawRoom(rooms[room.leftIndex]);}
	if (room.rightID != null) {drawRoom(rooms[room.rightIndex]);}
}

function drawNeighbourWalls(room) {
	if (room.upID != null) {drawWalls(rooms[room.upIndex], "grey");}
	if (room.downID != null) {drawWalls(rooms[room.downIndex], "grey");}
	if (room.leftID != null) {drawWalls(rooms[room.leftIndex], "grey");}
	if (room.rightID != null) {drawWalls(rooms[room.rightIndex], "grey");}
}

function drawAllRooms() {
	for (let i=0;i<rooms.length;i++) {
		drawRoom(rooms[i]);
	}
}

function drawProgress() {
	c.ctx.textAlign = "left";
	c.ctx.fillStyle = "hsla(0, 0%, 0%, 100%)";
	c.ctx.font = "50px serif";
	c.ctx.fillText(player.nRoomsVisited + " / " + rooms.length, 20, 50);
}

function drawTimer() {
	c.ctx.textAlign = "right";
	c.ctx.fillStyle = "hsla(0, 0%, 0%, 100%)";
	c.ctx.font = "50px serif";
	if (player.nRoomsVisited == rooms.length) {
		c.ctx.fillText((timer.finish/1000).toFixed(2), window.innerWidth - 20, 50);
	} else {
		c.ctx.fillText((timer.elapsed/1000).toFixed(2), window.innerWidth - 20, 50);
	}
}

function move(direction) {
	const currentRoom = rooms[player.currentRoomIndex];
	switch (direction) {
		case "up":
			if (currentRoom.upID != null) {player.currentRoomIndex = currentRoom.upIndex;}
			break;
		case "down":
			if (currentRoom.downID != null) {player.currentRoomIndex = currentRoom.downIndex;}
			break;
		case "left":
			if (currentRoom.leftID != null) {player.currentRoomIndex = currentRoom.leftIndex;}
			break;
		case "right":
			if (currentRoom.rightID != null) {player.currentRoomIndex = currentRoom.rightIndex;}
			break;
		default:
	}
	player.currentRoomID = rooms[player.currentRoomIndex].id;
	update();
}

function handleKeydown(event) {
	switch (event.key) {
		case "ArrowUp":
			move("up");
			break;
		case "ArrowDown":
			move("down");
			break;
		case "ArrowLeft":
			move("left");
			break;
		case "ArrowRight":
			move("right");
			break;
		case "r":
			regenerate();
			break;
		default:
	}
}