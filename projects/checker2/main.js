var c;
var t;
var v = {squareSize: 50, squareXYoffset: 0, refreshRate: 60, nSquaresX: 0, nSquaresY: 0, hOffset: 270, hRange: 30, sOffset: 50, sRange: 25, lOffset: 50, lRange: 25};
var squareArray;

class Array2D {
	constructor(x,y) {
		this.items = [];
		for (let i=0; i<x; i++) {this.items.push([]);}
	}
}

class canvasObject {
	constructor(width, height) {
		this.c = document.createElement("canvas");
		document.body.appendChild(this.c);
		this.ctx = this.c.getContext("2d");
		this.c.width = width;
		this.c.height = height;
	}
}

class square {
	constructor(h, s, l, offsetX, offsetY, hOffset, hPos, hSpeed, hRange, sOffset, sPos, sSpeed, sRange, lOffset, lPos, lSpeed, lRange) {
		this.h = h;
		this.s = s;
		this.l = l;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		
		this.hOffset = hOffset;
		this.hPos = hPos;
		this.hSpeed = hSpeed;
		this.hRange = hRange;
		
		this.sOffset = sOffset;
		this.sPos = sPos;
		this.sSpeed = sSpeed;
		this.sRange = sRange;
		
		this.lOffset = lOffset;
		this.lPos = lPos;
		this.lSpeed = lSpeed;
		this.lRange = lRange;
	}
	Update() {
		this.hPos += this.hPos < 1 ? this.hSpeed: this.hSpeed - 1;
		this.sPos += this.sPos < 1 ? this.sSpeed: this.sSpeed - 1;
		this.lPos += this.lPos < 1 ? this.lSpeed: this.lSpeed - 1;
		
		this.h = this.hOffset + Math.sin(this.hPos*2*Math.PI)*this.hRange;
		this.s = this.sOffset + Math.sin(this.sPos*2*Math.PI)*this.sRange;
		this.l = this.lOffset + Math.sin(this.lPos*2*Math.PI)*this.lRange;
	}
}

class animation {
	constructor(fps) {
		this.fps = fps;
		this.fpsInterval = 1000/fps;
		this.now = 0;
		this.then = 0;
		this.elapsed = 0;
		this.stop = false;
	}
	SetFPS(fps) {
		this.fps = fps;
		this.fpsInterval = 1000 / fps;
	}
}

window.onload = function() {
	document.body.style.padding = '0px';
	document.body.style.margin = '0px';
	c = new canvasObject(window.innerWidth, window.innerHeight);
	t = new animation(v.refreshRate);
	v.nSquaresX = Math.floor(window.innerWidth/v.squareSize) + 1;
	v.nSquaresY = Math.floor(window.innerHeight/v.squareSize) + 1;
	squareArray = new Array2D(v.nSquaresX, v.nSquaresY);
	colorSquares();
	startAnimation();
}

function startAnimation() {
	requestAnimationFrame(update);
}

function update() {
	t.now = performance.now();
	t.elapsed = t.now - t.then;
	if (t.elapsed > t.fpsInterval) {
		c.ctx.fillStyle = "#000000";
		c.ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
		updateSquares();
		drawSquares();
		t.then = t.now;
	}
	if (t.stop != true) {requestAnimationFrame(update);}
}

function updateSquares() {
	for (let i=0; i<squareArray.items.length; i++) {
		for (let j=0; j<squareArray.items[i].length; j++) {
			squareArray.items[i][j].Update();
		}
	}
}

function colorSquares() {
	for (let i=0; i<v.nSquaresX; i++) {
		for (let j=0; j<v.nSquaresY; j++) {
			let h = Math.random()*v.hRange + v.hOffset;
			let s = Math.random()*v.sRange + v.sOffset;
			let l = Math.random()*v.lRange + v.lOffset;
			let xOffset = Math.random()*v.squareXYoffset - v.squareXYoffset/2;
			let yOffset = Math.random()*v.squareXYoffset - v.squareXYoffset/2;
			let hOffset = v.hOffset + Math.random()*v.hRange;
			let sOffset = v.sOffset + Math.random()*v.sRange;
			let lOffset = v.lOffset + Math.random()*v.lRange;
			let hPos = Math.random()*2-1;
			let sPos = Math.random()*2-1;
			let lPos = Math.random()*2-1;
			let hSpeed = 0.001;
			let sSpeed = 0.001;
			let lSpeed = 0.001;
			let hRange = v.hRange;
			let sRange = v.sRange;
			let lRange = v.lRange;
			squareArray.items[i][j] = new square(h, s, l, xOffset, yOffset, hOffset, hPos, hSpeed, hRange, sOffset, sPos, sSpeed, sRange, lOffset, lPos, lSpeed, lRange);
			/*
			c.ctx.fillStyle = "#FF00FF";
			c.ctx.fillRect(i*20, j*20, 10, 10);
			c.ctx.fillStyle = "#000000";
			c.ctx.fillRect(i*20+10, j*20, 10, 10);
			c.ctx.fillStyle = "#000000";
			c.ctx.fillRect(i*20, j*20+10, 10, 10);
			c.ctx.fillStyle = "#00FFFF";
			c.ctx.fillRect(i*20+10, j*20+10, 10, 10);*/
			
			//let randomMax = 2;
			//let color1 = randomHSL(180,120,50,50,50,0);
			//let color2 = randomHSL(180,120,50,50,50,0);
			//let color3 = randomHSL(180,120,50,50,50,0);
			//let color4 = randomHSL(180,120,50,50,50,0);
			//console.log(color1);
			//c.ctx.fillStyle = color1;//"#FF00FF";
			//let x = i*v.squareSize + Math.random()*v.squareXYoffset - v.squareXYoffset/2;
			//let y = j*v.squareSize + Math.random()*v.squareXYoffset - v.squareXYoffset/2;
			//c.ctx.fillRect(x, y, v.squareSize, v.squareSize);
			//c.ctx.fillStyle = color2;
			//c.ctx.fillRect(i*20+10 + Math.random()*randomMax-randomMax/2, j*20 + Math.random()*randomMax-randomMax/2, 10, 10);
			//c.ctx.fillStyle = color3;
			//c.ctx.fillRect(i*20 + Math.random()*randomMax-randomMax/2, j*20+10 + Math.random()*randomMax-randomMax/2, 10, 10);
			//c.ctx.fillStyle = color4;
			//c.ctx.fillRect(i*20+10 + Math.random()*randomMax-randomMax/2, j*20+10 + Math.random()*randomMax-randomMax/2, 10, 10);
		}
	}
}

function drawSquares() {
	for (let i=0; i<squareArray.items.length; i++) {
		for (let j=0; j<squareArray.items[i].length; j++) {
			let square = squareArray.items[i][j]
			let x = i*v.squareSize + Math.random()*v.squareXYoffset - v.squareXYoffset/2;
			let y = j*v.squareSize + Math.random()*v.squareXYoffset - v.squareXYoffset/2;
			c.ctx.fillStyle = 'hsl('+square.h+' '+square.s+'% '+square.l+'%)';
			c.ctx.fillRect(x, y, v.squareSize, v.squareSize);
		}
	}
}

function randomHSL(hOffset, hRange, sOffset, sRange, lOffset, lRange) {
	let h = Math.random()*hRange + hOffset;
	let s = Math.random()*sRange + sOffset;
	let l = Math.random()*lRange + lOffset;
	return 'hsl('+h+' '+s+'% '+l+'%)';
}