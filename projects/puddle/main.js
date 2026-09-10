var t = {f:0}
var c = {c:0, ctx:0}
var v = {maxLife: 0};
var ripples = [];

window.onload = function() {
	c = createCanvas(window.innerWidth, window.innerHeight);
	c.c.addEventListener('click', function(event) {createRipple(event)}, false);
	c.ctx.strokeRect(10, 10, window.innerWidth - 20, window.innerHeight - 20);
	c.ctx.globalCompositeOperation='difference';
	v.maxLife = Math.sqrt(window.innerWidth*window.innerWidth+window.innerHeight*window.innerHeight);
	requestAnimationFrame(update);
}

function update() {
	t.f++;
	requestAnimationFrame(update);
	if (t.f%1==0) {
		c.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
		for (let i=0; i<ripples.length; i++) {
			ripples[i].update();
			if (ripples[i].life>=ripples[i].maxLife) {
				ripples.splice(i, 1);
			}
		};
	};
}

function createCanvas(width, height) {
	var canvas = {c:0, ctx:0};
	canvas.c = document.createElement("canvas");
	canvas.ctx = canvas.c.getContext("2d");
	canvas.c.width = width;
	canvas.c.height = height;
	document.body.appendChild(canvas.c);
	return canvas;
}

function createRipple(e) {
	ripples.push(new ripple(e.clientX, e.clientY, 0, 0, v.maxLife));
}

class ripple {
	constructor(x,y,r,life,maxLife) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.life = life;
		this.maxLife = maxLife;
	}
	update() {
		this.r++;
		this.life++;
		this.draw();
	}
	draw() {
		c.ctx.beginPath();
		c.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		//c.ctx.stroke();
		const gradient = c.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
		const opacity = 1 - this.life/this.maxLife;
		//const opacity = 1;
		const colorStopWidth = 100;
		const nColorStops = this.r / colorStopWidth;
		for (let i=0; i<nColorStops; i++) {
			gradient.addColorStop(1-i/nColorStops, "hsla(0,0%,0%,"+opacity+")");
			
			if (1-(i+0.5)/nColorStops>0) {gradient.addColorStop(1-(i+0.5)/nColorStops, "hsla(0,0%,100%,"+opacity+")")};
			if (1-(i+0.5)/nColorStops<=0) {
				const dist = (i+0.5)/nColorStops;
				const l = dist*100;
				gradient.addColorStop(0, "hsla(0,0%,"+l+"%,"+opacity+")");
				//console.log(1-(i+0.5)/nColorStops)
			}
			if (1-(i+1)/nColorStops<=0) {
				const dist = (i)/nColorStops;
				const l = 100-dist*100;
				gradient.addColorStop(0, "hsla(0,0%,"+l+"%,"+opacity+")");
				//console.log(1-(i)/nColorStops)
			}
		}
		//gradient.addColorStop(0, "hsla(0,0%,100%,"+opacity+")");
		//gradient.addColorStop(1, "hsla(0,0%,0%,"+opacity+")");
		c.ctx.fillStyle = gradient;
		c.ctx.fill()
	}
}