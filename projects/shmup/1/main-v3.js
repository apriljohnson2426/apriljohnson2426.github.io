var c;
var t = {f: 0, fps: 120, fpsInterval: 0, now: 0, then: 0, elapsed: 0, stop: false, realFPS: 0, modeinit: 0}
var player1 = {x: 16*7.5, y: 16*17, w: 8, h: 8, speed: 200, fireRate: 16, fireRateInterval: 0, fireReady: true, fireNow: 0, fireThen: 0, fireElapsed: 0}
var input = {left: false, right: false, up: false, down: false, shoot: false, shield: false, vertical: false, horizontal: false}
var inputdown = {left: false, right: false, up: false, down: false, shoot: false, shield: false}
var shots = []
var enemies = []
var info = {score: 0, shotsTaken: 0, shotsHit: 0, accuracy: 100}
var particles = [[],[],[],[],[],[],[]]
var mode = "start"
var highscore = 1000

class canvasObject {
	constructor(c,ctx) {
		this.c = c
		this.ctx = ctx
	}
}

class enemy {
	constructor(x,y,w,h,xv,yv,HP,MaxHP,fireRate) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.xv = xv
		this.yv = yv
		this.HP = HP
		this.MaxHP = MaxHP
		this.fireRate = fireRate
		this.fireRateInterval = 1000 / this.fireRate
		this.fireRateTime = 0
	}
}

class shot {
	constructor(x,y,w,h,xv,yv,lifetime,life,damage,target) {
		this.x = x
		this.y = y
		this.w = w
		this.h = h
		this.xv = xv
		this.yv = yv
		this.lifetime = lifetime
		this.life = life
		this.damage = damage
		this.target = target
	}
}

class particle {
	constructor(x,y,xv,yv) {
		this.x = x
		this.y = y
		this.xv = xv
		this.yv = yv
	}
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

window.onkeydown = function(e) {
	//console.log("key")
	switch(e.keyCode) {
		case 38:
			if (input.up==false) {inputdown.up=true}
			input.up = true;
			break;
		case 37:
			if (input.left==false) {inputdown.left=true}
			input.left = true;
			break;
		case 40:
			if (input.down==false) {inputdown.down=true}
			input.down = true;
			break;
		case 39:
			if (input.right==false) {inputdown.right=true}
			input.right = true;
			break;
		case 87:
			if (input.up==false) {inputdown.up=true}
			input.up = true;
			break;
		case 65:
			if (input.left==false) {inputdown.left=true}
			input.left = true;
			break;
		case 83:
			if (input.down==false) {inputdown.down=true}
			input.down = true;
			break;
		case 68:
			if (input.right==false) {inputdown.right=true}
			input.right = true;
			break;
		case 90:
			if (input.shoot==false) {inputdown.shoot=true}
			input.shoot = true;
			break;
		case 88:
			if (input.shield==false) {inputdown.shield=true}
			input.shield = true;
			break;
		case 188:
			if (input.shoot==false) {inputdown.shoot=true}
			input.shoot = true;
			break;
		case 190:
			if (input.shield==false) {inputdown.shield=true}
			input.shield = true;
			break;
		default:
	}
	input.vertical = input.up || input.down
	input.horizontal = input.right || input.left
}

window.onkeyup = function(e) {
	switch(e.keyCode) {
		case 38:
			input.up = false;
			break;
		case 37:
			input.left = false;
			break;
		case 40:
			input.down = false;
			break;
		case 39:
			input.right = false;
			break;
		case 87:
			input.up = false;
			break;
		case 65:
			input.left = false;
			break;
		case 83:
			input.down = false;
			break;
		case 68:
			input.right = false;
			break;
		case 90:
			input.shoot = false;
			break;
		case 88:
			input.shield = false;
			break;
		case 188:
			input.shoot = false;
			break;
		case 190:
			input.shield = false;
			break;
		default:
	}
	input.vertical = input.up || input.down
	input.horizontal = input.right || input.left
}

window.onload = function() {
	document.body.style.margin = 0
	document.body.style.padding = 0
	document.body.style.overflow = "hidden"
	c = createCanvas(240, 320)
	document.body.appendChild(c.c)
	
	setupPlayer()
	//setupEnemies()
	setupParticles()
	
	startTime()
}

function setupPlayer() {
	player1.fireRateInterval = 1000 / player1.fireRate;
}

function setupEnemies() {
	enemies.push(new enemy(16*2, 16*4, 0, 50, 3, 3))
	enemies.push(new enemy(16*4, 16*4, 0, 50, 3, 3))
	enemies.push(new enemy(16*6, 16*4, 0, 50, 3, 3))
	enemies.push(new enemy(16*8, 16*4, 0, 50, 3, 3))
	enemies.push(new enemy(16*10, 16*4, 0, 50, 3, 3))
	enemies.push(new enemy(16*12, 16*4, 0, 50, 3, 3))
}

function setupParticles() {
	for (i=0;i<5;i++) {
		var speed1 = 100 / t.fps
		var speed2 = 200 / t.fps
		particles[0].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed1))
		particles[1].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed1))
		particles[2].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed1))
		particles[3].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed1))
		particles[4].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed1))
		particles[5].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed1))
		particles[6].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed1))
		particles[0].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed2))
		particles[1].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed2))
		particles[2].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed2))
		particles[3].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed2))
		particles[4].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed2))
		particles[5].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed2))
		particles[6].push(new particle(getRandomInt(240), getRandomInt(320), 0, speed2))
	}
}

function startTime() {
	t.fpsInterval = 1000 / t.fps
	requestAnimationFrame(animation)
}

function animation() {
	if (t.stop) {return}
	requestAnimationFrame(animation)
	t.now = performance.now()
	t.elapsed = t.now - t.then
	if (t.elapsed > t.fpsInterval) {
		t.then = t.now
		main()
	}
}

function main() {
	t.f += 1
	switch(mode) {
		case "play":
		playUpdate()
		break;
		
		case "gameover":
		gameoverUpdate()
		break;
		
		case "start":
		startUpdate()
		break;
		
		default:
		
	}
	
	switch(mode) {
		case "play":
		playDraw()
		break;
		
		case "gameover":
		gameoverDraw()
		break;
		
		case "start":
		startDraw()
		break;
		
		default:
		
	}
	
	//console.log(mode)
}

function playUpdate() {
	movePlayer()
	playerFireTimer()
	moveShots()
	moveEnemies()
	enemyFire()
	checkShotEnemyCollision()
	checkShotPlayerCollision()
	shotTimeout()
	enemyHPCheck()
	if (t.f%(t.fps*0.5)==0) {enemies.push(new enemy(16*(getRandomInt(13)+1), 16*-2, 16, 8, 0, 120, 5, 5, 1))}
	checkInputDown()
	if (info.score > highscore) {highscore = info.score}
}

function playDraw() {
	c.ctx.clearRect(0,0,240,320)
	moveParticles()
	drawParticles()
	drawPlayer()
	drawShots()
	drawEnemies()
	drawInfo()
	drawBorder()
}

function gameoverUpdate() {
	if (checkInputDown()&&t.now-t.modeinit>1000) {
		mode = "start"
		t.modeinit = t.now
		player1.x = 16*7.5
		player1.y = 16*17
	}
}

function gameoverDraw() {
	c.ctx.clearRect(0,0,240,320)
	drawParticles()
	drawPlayer()
	drawShots()
	drawEnemies()
	drawInfo()
	drawBorder()
	c.ctx.font = "32px Consolas"
	c.ctx.textAlign = "center"
	c.ctx.fillText("GAME OVER", 240*0.5, 320*0.5)
	c.ctx.font = "16px Consolas"
	c.ctx.textAlign = "center"
	if (t.f%t.fps/t.fps>0.5) {c.ctx.fillText("PRESS ANY KEY", 240*0.5, 320*0.5 + 32)}
}

function startUpdate() {
	if (checkInputDown()&&t.now-t.modeinit>1000) {
		mode = "play"
		t.modeinit = t.now
		enemies = []
		shots = []
		info.score = 0
		info = {score: 0, shotsTaken: 0, shotsHit: 0, accuracy: 100}
		player1 = {x: 16*7.5, y: 16*17, w: 8, h: 8, speed: 200, fireRate: 16, fireRateInterval: 0, fireReady: true, fireNow: 0, fireThen: 0, fireElapsed: 0}
		player1.fireRateInterval = 1000 / player1.fireRate;
	}
}

function startDraw() {
	c.ctx.clearRect(0,0,240,320)
	moveParticles()
	drawParticles()
	drawPlayer()
	drawInfo()
	drawBorder()
	c.ctx.font = "32px Consolas"
	c.ctx.textAlign = "center"
	c.ctx.fillText("UNTITLED", 240*0.5, 320*0.5)
	c.ctx.font = "12px Consolas"
	c.ctx.textAlign = "center"
	c.ctx.fillText("KAYTAP2426", 240*0.75, 320*0.5 + 16)
	c.ctx.font = "16px Consolas"
	c.ctx.textAlign = "center"
	if (t.f%t.fps/t.fps>0.5) {c.ctx.fillText("PRESS ANY KEY", 240*0.5, 320*0.5 + 64)}
	c.ctx.font = "16px Consolas"
	c.ctx.textAlign = "center"
	c.ctx.fillText("CONTROLS", 240*0.5, 16*3)
	c.ctx.fillText("MOVE: ARROWS OR WSAD", 240*0.5, 16*4)
	c.ctx.fillText("SHOOT: Z OR ,", 240*0.5, 16*5)
}



function checkInputDown() {
	var result = false
	if (inputdown.left==true) {inputdown.left=false; result=true}
	if (inputdown.right==true) {inputdown.right=false; result=true}
	if (inputdown.up==true) {inputdown.up=false; result=true}
	if (inputdown.down==true) {inputdown.down=false; result=true}
	if (inputdown.shoot==true) {inputdown.shoot=false; result=true}
	if (inputdown.shield==true) {inputdown.shield=false; result=true}
	return result
}

function movePlayer() {
	if (input.vertical && input.horizontal) {
		if (input.left == true) {player1.x -= player1.speed / t.fps * 0.707106}
		if (input.right == true) {player1.x += player1.speed / t.fps * 0.707106}
		if (input.up == true) {player1.y -= player1.speed * 0.75 / t.fps * 0.707106}
		if (input.down == true) {player1.y += player1.speed * 1.25 / t.fps * 0.707106}
	} else {
		if (input.left == true) {player1.x -= player1.speed / t.fps}
		if (input.right == true) {player1.x += player1.speed / t.fps}
		if (input.up == true) {player1.y -= player1.speed * 0.75 / t.fps}
		if (input.down == true) {player1.y += player1.speed * 1.25 / t.fps}
	}
	if (player1.x-player1.w*0.5<0) {player1.x = 0 + player1.w*0.5}
	if (player1.x+player1.w*0.5>240) {player1.x = 240 - player1.w*0.5}
	if (player1.y-player1.h*0.5<0) {player1.y = 0 + player1.h*0.5}
	if (player1.y+player1.h*0.5>320) {player1.y = 320 - player1.h*0.5}
}

function playerFireTimer() {
	player1.fireNow = t.now
	player1.fireElapsed = player1.fireNow - player1.fireThen
	if (player1.fireElapsed > player1.fireRateInterval) {player1.fireReady = true}
	if (input.shoot == true && player1.fireReady) {
		player1.fireThen = t.now
		playerFire()
		//console.log("fired")
		player1.fireReady = false
	}
}

function playerFire() {
	shots.push(new shot(player1.x, player1.y, 4, 4, 0, -500, 3000, 3000, 1, "enemy"))
	info.shotsTaken += 1
}

function shotTimeout() {
	for (i=0;i<shots.length;i++) {
		shots[i].life -= t.elapsed
		if (shots[i].life < 0) {shots.splice(i,1)}
	}
}

function moveShots() {
	for (i=0;i<shots.length;i++) {
		shots[i].x += shots[i].xv / t.fps
		shots[i].y += shots[i].yv / t.fps
	}
}

function moveEnemies() {
	for (i=0;i<enemies.length;i++) {
		enemies[i].x += enemies[i].xv / t.fps
		enemies[i].y += enemies[i].yv / t.fps
	}
}

function checkShotEnemyCollision() {
	for (i=0;i<enemies.length;i++) {
		for (j=0;j<shots.length;j++) {
			var xd = Math.abs(enemies[i].x - shots[j].x)
			var yd = Math.abs(enemies[i].y - shots[j].y)
			var xgap = enemies[i].w*0.5 + shots[j].w*0.5
			var ygap = enemies[i].h*0.5 + shots[j].h*0.5
			if (xd<xgap && yd<ygap && shots[j].target=="enemy") {
				enemies[i].HP -= shots[j].damage
				shots[j].life = 0
				info.shotsHit += 1
			}
		}
	}
}

function checkShotPlayerCollision() {
	for (i=0;i<shots.length;i++) {
		var xd = Math.abs(player1.x - shots[i].x)
		var yd = Math.abs(player1.y - shots[i].y)
		var xgap = player1.w*0.5 + shots[i].w*0.5
		var ygap = player1.h*0.5 + shots[i].h*0.5
		if (xd<xgap && yd<ygap && shots[i].target=="player") {
			console.log("hit")
			c.ctx.font = "16px Consolas"
			c.ctx.textAlign = "center"
			c.ctx.fillText("GAME OVER", 240*0.5, 320*0.5)
			mode = "gameover"
			t.modeinit = t.now
		}
	}
}

function enemyHPCheck() {
	for (i=0;i<enemies.length;i++) {
		if (enemies[i].HP <= 0) {
			enemies.splice(i, 1)
			info.score += 10
			}
	}
}

function enemyFire() {
	for (i=0;i<enemies.length;i++) {
		enemies[i].fireRateTime += t.elapsed
		if (enemies[i].fireRateTime > enemies[i].fireRateInterval) {
			enemies[i].fireRateTime = 0
			shots.push(new shot(enemies[i].x, enemies[i].y, 4, 4, 0, 250, 3000, 3000, 1, "player"))
		}
	}
}

function createCanvas(width, height) {
	var c = new canvasObject(0,0);
	c.c = document.createElement("canvas")
	c.ctx = c.c.getContext("2d")
	
	//Disable Smoothing
	c.ctx.webkitImageSmoothingEnabled = false;
	c.ctx.mozImageSmoothingEnabled = false;
	c.ctx.imageSmoothingEnabled = false;

	c.c.width = width
	c.c.height = height
	var iw = window.innerWidth
	var ih = window.innerHeight
	if (ih > iw * height/width) {c.c.style.width = "100%"} else {c.c.style.height = ih + "px"}
	return c
}

function drawBorder() {
	c.ctx.beginPath()
	c.ctx.lineWidth = 4;
	c.ctx.strokeStyle = "#FFFFFF"
	c.ctx.rect(0,0,16*15,16*20)
	c.ctx.stroke()
	c.ctx.closePath()
}

function drawPlayer() {
	c.ctx.beginPath()
	c.ctx.lineWidth = 2;
	c.ctx.strokeStyle = "#FF00FF"
	c.ctx.fillStyle = "#FF00FF"
	c.ctx.rect(Math.floor(player1.x - player1.w*0.5), Math.floor(player1.y - player1.h*0.5), player1.w, player1.h)
	c.ctx.stroke()
	c.ctx.fill()
	c.ctx.closePath()
}

function drawShots() {
	for (i=0;i<shots.length;i++) {
		c.ctx.beginPath()
		c.ctx.lineWidth = 2;
		c.ctx.strokeStyle = "#00FFFF"
		c.ctx.fillStyle = "#00FFFF"
		c.ctx.rect(Math.floor(shots[i].x - shots[i].w*0.5), Math.floor(shots[i].y - shots[i].h*0.5), shots[i].w, shots[i].w)
		c.ctx.stroke()
		c.ctx.fill()
		c.ctx.closePath()
	}
}

function drawEnemies() {
	for (i=0;i<enemies.length;i++) {
		c.ctx.beginPath()
		c.ctx.lineWidth = 2;
		c.ctx.strokeStyle = "hsla("+120*enemies[i].HP/enemies[i].MaxHP+",100%,50%,1.0)";
		c.ctx.fillStyle = "hsla("+120*enemies[i].HP/enemies[i].MaxHP+",100%,50%,1.0)";
		c.ctx.rect(Math.floor(enemies[i].x - enemies[i].w*0.5), Math.floor(enemies[i].y - enemies[i].h*0.5), enemies[i].w, enemies[i].h)
		c.ctx.stroke()
		c.ctx.fill()
		c.ctx.closePath()
	}
}

function drawInfo() {
	c.ctx.font = "16px Consolas"
	c.ctx.fillStyle = "#FFFFFF"
	c.ctx.textAlign = "left"
	c.ctx.fillText(info.score, 16, 16)
	
	c.ctx.font = "16px Consolas"
	c.ctx.textAlign = "center"
	c.ctx.fillText(highscore, 240*0.5, 16)
	
	if (info.shotsTaken > 1) {info.accuracy = Math.trunc(info.shotsHit * 100 / info.shotsTaken)}
	c.ctx.textAlign = "right"
	c.ctx.fillText(info.accuracy + "%", 16*14, 16)
	
}

function moveParticles() {
	for (i=0;i<particles.length;i++) {
		for (j=0;j<particles[i].length;j++) {
			particles[i][j].x += particles[i][j].xv
			if (particles[i][j].x > 240) {particles[i][j].x -= 240}
			if (particles[i][j].x < 0) {particles[i][j].x += 240}
			particles[i][j].y += particles[i][j].yv
			if (particles[i][j].y > 320) {particles[i][j].y -= 320}
			if (particles[i][j].y < 0) {particles[i][j].y += 320}
		}
	}
}

function drawParticles() {
	c.ctx.beginPath()
	c.ctx.fillStyle = "#FF0000"
	for (i=0;i<particles.length;i++) {
		c.ctx.beginPath()
		switch(i) {
			case 0:
			c.ctx.fillStyle = "#FF0000"
			break;
			case 1:
			c.ctx.fillStyle = "#00FF00"
			break;
			case 2:
			c.ctx.fillStyle = "#0000FF"
			break;
			case 3:
			c.ctx.fillStyle = "#FFFF00"
			break;
			case 4:
			c.ctx.fillStyle = "#00FFFF"
			break;
			case 5:
			c.ctx.fillStyle = "#FF00FF"
			break;
			case 6:
			c.ctx.fillStyle = "#FFFFFF"
			break;
			default:
			c.ctx.fillStyle = "#FFFFFF"
		}
		for (j=0;j<particles[i].length;j++) {
			c.ctx.rect(Math.floor(particles[i][j].x), Math.floor(particles[i][j].y), 1, 1)
			//c.ctx.rect(particles[i][j].x, particles[i][j].y, 1, 1)
		}
		c.ctx.fill()
		c.ctx.closePath()
	}
}