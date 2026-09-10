var dc = {c:0,ctx:0};
var p = [];
var c = {u:"w",d:"s",l:"a",r:"d"}
var k = {u:0,d:0,l:0,r:0}
var anim = {
	fps:30,
	fpsInterval:1000/30,
	f:0,
	now:0,
	then:0,
	elapsed:0,
	stop:"false"
}
var anims = {
	idleL:{ft:15*anim.fps/30},
	idleR:{ft:15*anim.fps/30},
	runL:{ft:13*anim.fps/30},
	runR:{ft:13*anim.fps/30}
}
var xhttp = new XMLHttpRequest();
var d;
var userID;
var userIndex;
var access = {uid:0,button:0};

function activateControls() {
	document.addEventListener("keydown", keyDownHandler);
	document.addEventListener("keyup", keyUpHandler);
}
function keyDownHandler(e) {
	if(e.key==c.l) {p[2].anim="runL";k.l=1;}
	if(e.key==c.r) {p[2].anim="runR";k.r=1}
}
function keyUpHandler(e) {
	if(e.key==c.l) {if(k.r!=1){p[2].anim="idleL";}k.l=0;}
	if(e.key==c.r) {if(k.l!=1){p[2].anim="idleR";}k.r=0;}
}


window.onload = function() {
	createAccess();
	createDisplay();
	loadPlayer();
	startAnimating();
}

function createAccess() {
	access.uid = document.createElement("INPUT");
	access.uid.setAttribute("type", "text");
	access.button = document.createElement("BUTTON");
	access.button.setAttribute("onclick", "evaluateAccess()");
	access.button.innerHTML = "Join";
	document.body.appendChild(access.uid);
	document.body.appendChild(access.button);
}

function evaluateAccess() {
	if(access.uid.value==="p") {access.uid.value="Error";return;};
	if(access.uid.value.includes(";")) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes("{")) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes("}")) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes("\\")) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes("(")) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes(")")) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes("'")) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes('"')) {access.uid.value="Ay!";return;};
	if(access.uid.value.includes("`")) {access.uid.value="Ay!";return;};
	if(access.uid.value.length>30) {access.uid.value="< 30 Characters"; return;};
	createPlayer();
}

function createDisplay() {
	dc.c = document.createElement("canvas");
	document.body.appendChild(dc.c);
	dc.ctx = dc.c.getContext("2d");
}

function createPlayer() {
	activateControls();
	userID = access.uid.value;
	access.uid.style.display = "none";
	access.button.style.display = "none";
	userIndex = p.length;
	p.push({
		id:userID,
		x:150,
		y:120,
		a:0,
		width:100,
		height:100,
		scale: 1,
		anim:"idleL",
		lastAnim:"idleR",
		f:0,
		b:0,
		w:0
	});
	var index = p.length - 1;
	p[index].b = [
		{p:"h",x:0,y:0,r:15*p[index].scale},
		{p:"t",x:0,y:0,r:25*p[index].scale},
		{p:"lh",x:0,y:0,r:10*p[index].scale},
		{p:"rh",x:0,y:0,r:10*p[index].scale},
		{p:"lf",x:0,y:0,r:10*p[index].scale},
		{p:"rf",x:0,y:0,r:10*p[index].scale},
	]
	p[index].b.h = p[index].b[0];
	p[index].b.t = p[index].b[1];
	p[index].b.lh = p[index].b[2];
	p[index].b.rh = p[index].b[3];
	p[index].b.lf = p[index].b[4];
	p[index].b.rf = p[index].b[5];
}

function loadPlayer() {
	xhttp.onload = function() {
		d = JSON.parse(this.responseText);
		setPlayerData();
	}
	xhttp.open("get", "users/p.json"+"?i="+Math.random().toString(), true);
	xhttp.send();
}

function savePlayer() {
	$.ajax({
		url: "users/p.php",
		data: {pData: JSON.stringify(p[userIndex])},
		type: "POST",
		success: function(response) {
			alert(response);
		}
	});
	//var xhr = new XMLHttpRequest();
	//xhr.open("POST", "p.php"
	//xhr.onload
}

function setPlayerData() {
	for(i=0;i<d.p.length;i++) {
		p.push({
			id: d.p[i].id,
			x: d.p[i].x,
			y: d.p[i].y,
			a: d.p[i].a,
			width: d.p[i].width,
			height: d.p[i].height,
			scale: d.p[i].scale,
			anim: d.p[i].lastAnim,
			f: d.p[i].f,
			b: d.p[i].b,
			w: d.p[i].w
		});
		var index = p.length - 1;
		p[index].b = [
			{p:"h",x:0,y:0,r:15*p[index].scale},
			{p:"t",x:0,y:0,r:25*p[index].scale},
			{p:"lh",x:0,y:0,r:10*p[index].scale},
			{p:"rh",x:0,y:0,r:10*p[index].scale},
			{p:"lf",x:0,y:0,r:10*p[index].scale},
			{p:"rf",x:0,y:0,r:10*p[index].scale},
		]
		p[index].b.h = p[index].b[0];
		p[index].b.t = p[index].b[1];
		p[index].b.lh = p[index].b[2];
		p[index].b.rh = p[index].b[3];
		p[index].b.lf = p[index].b[4];
		p[index].b.rf = p[index].b[5];
	}
}

function startAnimating() {
	anim.fpsInterval = 1000/anim.fps;
	anim.now = window.performance.now();
	anim.then = anim.now;
	requestAnimationFrame(animating);
}

function animating() {
	if (anim.stop=="true") {return;}
	requestAnimationFrame(animating);
	anim.now = window.performance.now();
	anim.elapsed = anim.now - anim.then;
	if(anim.elapsed>anim.fpsInterval) {
		update();
		anim.f++;
		anim.then = window.performance.now();
	}
}

function update() {
	drawPlayers();
	if(window.performance.now()>60000) {anim.stop="true";}
}

function drawPlayers() {
	dc.ctx.clearRect(0,0,dc.c.width,dc.c.height);
	for(i=0;i<p.length;i++) {
		animate(i,p[i].anim);
		p[i].f++;
	}
}

function animate(i,anim) {
	if(anim=="idleL") {
		if(p[i].lastAnim!="idleL") {p[i].f=0;p[i].lastAnim="idleL";}
		p[i].b.h.x = p[i].x - 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleL.ft);
		p[i].b.h.y = p[i].y - 0.7*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleL.ft-0.5);
		p[i].b.t.x = p[i].x - 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleL.ft);
		p[i].b.t.y = p[i].y - 0.4*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleL.ft);
		p[i].b.lh.x = p[i].x + 0.1*p[i].width - 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleL.ft);
		p[i].b.lh.y = p[i].y - 0.45*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleL.ft-0.5);
		p[i].b.rh.x = p[i].x - 0.25*p[i].width - 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleL.ft);
		p[i].b.rh.y = p[i].y - 0.45*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleL.ft-0.5);
		p[i].b.lf.x = p[i].x + 0.15*p[i].width;
		p[i].b.lf.y = p[i].y - 0.1*p[i].height;
		p[i].b.rf.x = p[i].x - 0.15*p[i].width;
		p[i].b.rf.y = p[i].y - 0.1*p[i].height;
	}
	if(anim=="idleR") {
		if(p[i].lastAnim!="idleR") {p[i].f=0;p[i].lastAnim="idleR";}
		p[i].b.h.x = p[i].x + 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleL.ft);
		p[i].b.h.y = p[i].y - 0.7*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleR.ft-0.5);
		p[i].b.t.x = p[i].x + 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleR.ft);
		p[i].b.t.y = p[i].y - 0.4*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleR.ft);
		p[i].b.lh.x = p[i].x + 0.25*p[i].width + 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleR.ft);
		p[i].b.lh.y = p[i].y - 0.45*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleR.ft-0.5);
		p[i].b.rh.x = p[i].x - 0.1*p[i].width + 0.02*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.idleR.ft);
		p[i].b.rh.y = p[i].y - 0.45*p[i].height - 0.02*p[i].width*Math.cos(2*Math.PI*2*p[i].f/anims.idleR.ft-0.5);
		p[i].b.lf.x = p[i].x - 0.15*p[i].width;
		p[i].b.lf.y = p[i].y - 0.1*p[i].height;
		p[i].b.rf.x = p[i].x + 0.15*p[i].width;
		p[i].b.rf.y = p[i].y - 0.1*p[i].height;
	}
	if(anim=="runL") {
		if(p[i].lastAnim!="runL") {p[i].f=0;p[i].lastAnim="runL";}
		p[i].b.h.x = p[i].x;
		p[i].b.h.y = p[i].y - 0.75*p[i].height - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runL.ft-2);
		p[i].b.t.x = p[i].x;
		p[i].b.t.y = p[i].y - 0.45*p[i].height - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runL.ft-1.5);
		p[i].b.lh.x = p[i].x + 0.1*p[i].width - 0.04*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runL.ft+Math.PI);
		p[i].b.lh.y = p[i].y - 0.5*p[i].height - 0.04*p[i].height*Math.sin(2*Math.PI*p[i].f/anims.runL.ft+Math.PI) - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runL.ft-1.5);
		p[i].b.rh.x = p[i].x - 0.2*p[i].width - 0.04*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runL.ft);
		p[i].b.rh.y = p[i].y - 0.5*p[i].height - 0.04*p[i].height*Math.sin(2*Math.PI*p[i].f/anims.runL.ft) - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runL.ft-1.5);
		p[i].b.lf.x = p[i].x +0.05*p[i].width - 0.2*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runL.ft);
		p[i].b.lf.y = p[i].y - 0.2*p[i].height - 0.1*p[i].height*Math.cos(2*Math.PI*p[i].f/anims.runL.ft);
		p[i].b.rf.x = p[i].x +0.05*p[i].width - 0.2*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runL.ft+Math.PI);
		p[i].b.rf.y = p[i].y - 0.2*p[i].height - 0.1*p[i].height*Math.cos(2*Math.PI*p[i].f/anims.runL.ft+Math.PI);
	}
	if(anim=="runR") {
		if(p[i].lastAnim!="runR") {p[i].f=0;p[i].lastAnim="runR";}
		p[i].b.h.x = p[i].x;
		p[i].b.h.y = p[i].y - 0.75*p[i].height - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runR.ft-2);
		p[i].b.t.x = p[i].x;
		p[i].b.t.y = p[i].y - 0.45*p[i].height - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runR.ft-1.5);
		p[i].b.lh.x = p[i].x + 0.2*p[i].width - 0.04*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runR.ft);
		p[i].b.lh.y = p[i].y - 0.5*p[i].height - 0.04*p[i].height*Math.sin(2*Math.PI*p[i].f/anims.runR.ft+Math.PI) - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runR.ft-1.5);
		p[i].b.rh.x = p[i].x - 0.1*p[i].width - 0.04*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runR.ft+Math.PI);
		p[i].b.rh.y = p[i].y - 0.5*p[i].height - 0.04*p[i].height*Math.sin(2*Math.PI*p[i].f/anims.runR.ft) - 0.02*p[i].height*Math.cos(2*Math.PI*2*p[i].f/anims.runR.ft-1.5);
		p[i].b.lf.x = p[i].x -0.05*p[i].width - 0.2*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runR.ft+Math.PI);
		p[i].b.lf.y = p[i].y - 0.2*p[i].height - 0.1*p[i].height*Math.cos(2*Math.PI*p[i].f/anims.runR.ft);
		p[i].b.rf.x = p[i].x -0.05*p[i].width - 0.2*p[i].width*Math.sin(2*Math.PI*p[i].f/anims.runR.ft);
		p[i].b.rf.y = p[i].y - 0.2*p[i].height - 0.1*p[i].height*Math.cos(2*Math.PI*p[i].f/anims.runR.ft+Math.PI);
	}
	for(j=0;j<p[i].b.length;j++) {
		dc.ctx.beginPath();
		dc.ctx.arc(p[i].b[j].x,p[i].b[j].y,p[i].b[j].r,0,2*Math.PI);
		dc.ctx.stroke();
		dc.ctx.closePath();
	}
	dc.ctx.fillText(p[i].id,p[i].x-dc.ctx.measureText(p[i].id).width/2,p[i].y-p[i].height);
}