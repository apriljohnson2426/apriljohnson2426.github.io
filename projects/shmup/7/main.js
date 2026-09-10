var ob
var tr
var ac

window.onload = function() {
	game = new runtime(
		new _canvas(640,480,true),
		new time(60),
		new _inputs([
			new _keyInput("p1left", 37),
			new _keyInput("p1right", 39),
			new _keyInput("p1up", 38),
			new _keyInput("p1down", 40),
			new _keyInput("p1a", 90),
			new _keyInput("p1b", 88),
			new _keyInput("p1focus", 16),
			new _keyInput("p2left", 71),
			new _keyInput("p2right", 74),
			new _keyInput("p2up", 89),
			new _keyInput("p2down", 72),
		]),
		[],
		new _collisionSystem(),
		new _viewport("viewport"),
		new _UID()
	)
	
	//game.viewport.movement.moveset.push(new _followObjectTranslation("p1", new _location(320,240), 0.5))
	//game.viewport.movement.moveset.push(new _followObjectTranslation("p2", new _location(320,240), 0.5))
	//game.viewport.movement.moveset.push(new _linearTranslation(0, -0.2))
	
	//Object Capacity Tester
	for (let i=0;i<80;i++) {
		for (let j=2;j<10;j++) {
			game.objects.push(level[0][j]())
		}
	}
	
	level[0].forEach((object) => game.objects.push(object()))
	game.objects.forEach((object) => object.colliders.colliderset.forEach((collider) => collider.PushToCollisionSystem()))
	game.objects.push(game.viewport)
}

function ClearLevel() {
	game.objects.length = 0
}

function LoadLevel(levelIndex) {
	level[levelIndex].forEach((object) => game.objects.push(object()))
	game.objects.forEach((object) => object.colliders.colliderset.forEach((collider) => collider.PushToCollisionSystem()))
}