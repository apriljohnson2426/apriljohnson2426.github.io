class _input {
	constructor(
		p0={keyBind:{left:37,right:39,up:38,down:40,a:90,b:88,start:67,select:86},keyState:{left:false,right:false,up:false,down:false,a:false,b:false,start:false,select:false}},
		p1={keyBind:{left:37,right:39,up:38,down:40,a:90,b:88,start:67,select:86},keyState:{left:false,right:false,up:false,down:false,a:false,b:false,start:false,select:false}},
		p2={keyBind:{left:71,right:74,up:89,down:72,a:65,b:83,start:68,select:70},keyState:{left:false,right:false,up:false,down:false,a:false,b:false,start:false,select:false}},
		p3={keyBind:{left:75,right:59,up:79,down:76,a:81,b:87,start:69,select:82},keyState:{left:false,right:false,up:false,down:false,a:false,b:false,start:false,select:false}},
		p4={keyBind:{left:97,right:99,up:101,down:98,a:49,b:50,start:51,select:52},keyState:{left:false,right:false,up:false,down:false,a:false,b:false,start:false,select:false}}
		) {
		this.p = [p0,p1,p2,p3,p4]
	}
	Update() {
		
	}
	GetKeyState(playerID, key) {
		switch(key) {
			case "left": return this.p[playerID].keyState.left;
			case "right": return this.p[playerID].keyState.right;
			case "up": return this.p[playerID].keyState.up;
			case "down": return this.p[playerID].keyState.down;
			case "a": return this.p[playerID].keyState.a;
			case "b": return this.p[playerID].keyState.b;
			case "start": return this.p[playerID].keyState.start;
			case "selec": return this.p[playerID].keyState.selec;
		}
	}
	KeyDown(e) {
		switch(e.keyCode) {
			case this.p[0].keyBind.left: this.p[0].keyState.left = true; break;
			case this.p[0].keyBind.right: this.p[0].keyState.right = true; break;
			case this.p[0].keyBind.up: this.p[0].keyState.up = true; break;
			case this.p[0].keyBind.down: this.p[0].keyState.down = true; break;
			case this.p[0].keyBind.a: this.p[0].keyState.a = true; break;
			case this.p[0].keyBind.b: this.p[0].keyState.b = true; break;
			case this.p[0].keyBind.start: this.p[0].keyState.start = true; break;
			case this.p[0].keyBind.select: this.p[0].keyState.select = true; break;
		}
		switch(e.keyCode) {
			case this.p[1].keyBind.left: this.p[1].keyState.left = true; break;
			case this.p[1].keyBind.right: this.p[1].keyState.right = true; break;
			case this.p[1].keyBind.up: this.p[1].keyState.up = true; break;
			case this.p[1].keyBind.down: this.p[1].keyState.down = true; break;
			case this.p[1].keyBind.a: this.p[1].keyState.a = true; break;
			case this.p[1].keyBind.b: this.p[1].keyState.b = true; break;
			case this.p[1].keyBind.select: this.p[1].keyState.select = true; break;
			case this.p[1].keyBind.start: this.p[1].keyState.start = true; break;
		}
		switch(e.keyCode) {
			case this.p[2].keyBind.left: this.p[2].keyState.left = true; break;
			case this.p[2].keyBind.right: this.p[2].keyState.right = true; break;
			case this.p[2].keyBind.up: this.p[2].keyState.up = true; break;
			case this.p[2].keyBind.down: this.p[2].keyState.down = true; break;
			case this.p[2].keyBind.a: this.p[2].keyState.a = true; break;
			case this.p[2].keyBind.b: this.p[2].keyState.b = true; break;
			case this.p[2].keyBind.start: this.p[2].keyState.start = true; break;
			case this.p[2].keyBind.select: this.p[2].keyState.select = true; break;
		}
		switch(e.keyCode) {
			case this.p[3].keyBind.left: this.p[3].keyState.left = true; break;
			case this.p[3].keyBind.right: this.p[3].keyState.right = true; break;
			case this.p[3].keyBind.up: this.p[3].keyState.up = true; break;
			case this.p[3].keyBind.down: this.p[3].keyState.down = true; break;
			case this.p[3].keyBind.a: this.p[3].keyState.a = true; break;
			case this.p[3].keyBind.b: this.p[3].keyState.b = true; break;
			case this.p[3].keyBind.start: this.p[3].keyState.start = true; break;
			case this.p[3].keyBind.select: this.p[3].keyState.select = true; break;
		}
		switch(e.keyCode) {
			case this.p[4].keyBind.left: this.p[4].keyState.left = true; break;
			case this.p[4].keyBind.right: this.p[4].keyState.right = true; break;
			case this.p[4].keyBind.up: this.p[4].keyState.up = true; break;
			case this.p[4].keyBind.down: this.p[4].keyState.down = true; break;
			case this.p[4].keyBind.a: this.p[4].keyState.a = true; break;
			case this.p[4].keyBind.b: this.p[4].keyState.b = true; break;
			case this.p[4].keyBind.start: this.p[4].keyState.start = true; break;
			case this.p[4].keyBind.select: this.p[4].keyState.select = true; break;
		}
	}
	KeyUp(e) {
		switch(e.keyCode) {
			case this.p[0].keyBind.left: this.p[0].keyState.left = false; break;
			case this.p[0].keyBind.right: this.p[0].keyState.right = false; break;
			case this.p[0].keyBind.up: this.p[0].keyState.up = false; break;
			case this.p[0].keyBind.down: this.p[0].keyState.down = false; break;
			case this.p[0].keyBind.a: this.p[0].keyState.a = false; break;
			case this.p[0].keyBind.b: this.p[0].keyState.b = false; break;
			case this.p[0].keyBind.start: this.p[0].keyState.start = false; break;
			case this.p[0].keyBind.select: this.p[0].keyState.select = false; break;
		}
		switch(e.keyCode) {
			case this.p[1].keyBind.left: this.p[1].keyState.left = false; break;
			case this.p[1].keyBind.right: this.p[1].keyState.right = false; break;
			case this.p[1].keyBind.up: this.p[1].keyState.up = false; break;
			case this.p[1].keyBind.down: this.p[1].keyState.down = false; break;
			case this.p[1].keyBind.a: this.p[1].keyState.a = false; break;
			case this.p[1].keyBind.b: this.p[1].keyState.b = false; break;
			case this.p[1].keyBind.select: this.p[1].keyState.select = false; break;
			case this.p[1].keyBind.start: this.p[1].keyState.start = false; break;
		}
		switch(e.keyCode) {
			case this.p[2].keyBind.left: this.p[2].keyState.left = false; break;
			case this.p[2].keyBind.right: this.p[2].keyState.right = false; break;
			case this.p[2].keyBind.up: this.p[2].keyState.up = false; break;
			case this.p[2].keyBind.down: this.p[2].keyState.down = false; break;
			case this.p[2].keyBind.a: this.p[2].keyState.a = false; break;
			case this.p[2].keyBind.b: this.p[2].keyState.b = false; break;
			case this.p[2].keyBind.start: this.p[2].keyState.start = false; break;
			case this.p[2].keyBind.select: this.p[2].keyState.select = false; break;
		}
		switch(e.keyCode) {
			case this.p[3].keyBind.left: this.p[3].keyState.left = false; break;
			case this.p[3].keyBind.right: this.p[3].keyState.right = false; break;
			case this.p[3].keyBind.up: this.p[3].keyState.up = false; break;
			case this.p[3].keyBind.down: this.p[3].keyState.down = false; break;
			case this.p[3].keyBind.a: this.p[3].keyState.a = false; break;
			case this.p[3].keyBind.b: this.p[3].keyState.b = false; break;
			case this.p[3].keyBind.start: this.p[3].keyState.start = false; break;
			case this.p[3].keyBind.select: this.p[3].keyState.select = false; break;
		}
		switch(e.keyCode) {
			case this.p[4].keyBind.left: this.p[4].keyState.left = false; break;
			case this.p[4].keyBind.right: this.p[4].keyState.right = false; break;
			case this.p[4].keyBind.up: this.p[4].keyState.up = false; break;
			case this.p[4].keyBind.down: this.p[4].keyState.down = false; break;
			case this.p[4].keyBind.a: this.p[4].keyState.a = false; break;
			case this.p[4].keyBind.b: this.p[4].keyState.b = false; break;
			case this.p[4].keyBind.start: this.p[4].keyState.start = false; break;
			case this.p[4].keyBind.select: this.p[4].keyState.select = false; break;
		}
	}
}
/*
window.onkeydown = function(e) {
	game.input.KeyDown(e)
}

window.onkeyup = function(e) {
	game.input.KeyUp(e)
}
*/