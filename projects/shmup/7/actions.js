class _actions {
	constructor(actionset=[]) {
		this.actionset = actionset
		this.instance = function() {return new _actions(this.actionset.map((action) => action.instance()))}
	}
}

class _action {
	constructor(conditions = new _conditions()) {
		this.conditions = conditions
		this.instance = function() {return new _action(this.conditions.instance())}
	}
}



class _spawnObject extends _action {
	constructor(object = new _object(), conditions = new _conditions()) {
		super(conditions)
		this.object = object
		this.instance = function() {return new _spawnObject(this.object.instance(), this.conditions.instance())}
	}
	Update() {
		if (this.conditions.State()) {
			let object = this.object.instance()
			game.objects.push(object)
			object.colliders.colliderset.forEach((collider) => collider.PushToCollisionSystem())
		}
	}
}

class _spawnCircleDanmaku extends _action {
	constructor(
		object = new _object(),
		location = new _location(),
		n = 0,
		speed = 1,
		angle = 0,
		conditions = new _conditions()
	) {
		super(conditions)
		this.object = object
		this.n = n
		this.speed = speed
		this.angle = angle
		this.location = location
		this.instance = function() {return new _spawnCircleDanmaku(this.object.instance(), this.location.instance(), this.n, this.speed, this.angle, this.conditions.instance())}
	}
	Update() {
		if (this.conditions.State()) {
			var objectArray = []
			for (let i=0;i<this.n;i++) {
				objectArray.push(this.object.instance())
				objectArray[i].movement.moveset.push(new _linearTranslationPolar(this.speed, i*2*Math.PI/this.n + this.angle))
				
				var xdiff = this.location.x - objectArray[i].location.x
				var ydiff = this.location.y - objectArray[i].location.y
				objectArray[i].location.x += xdiff
				objectArray[i].location.y += ydiff
				objectArray[i].colliders.colliderset.forEach((collider) => collider.location.x += xdiff)
				objectArray[i].colliders.colliderset.forEach((collider) => collider.location.y += ydiff)
			}
			
			for (let i=0;i<objectArray.length;i++) {
				game.objects.push(objectArray[i])
			}
		}
	}
}

class _destroyObject extends _action {
	constructor(uid = 0, conditions = new _conditions()) {
		super(conditions)
		this.uid = uid
		this.instance = function() {return new _destroyObject(this.uid, this.conditions.instance())}
	}
	Update() {
		let objectIndex = game.objects.findIndex((object) => object.uid == this.uid)
		if (objectIndex == -1) {return}
		game.objects.splice(objectIndex,1)
		
		for (let i=0;i<game.collisionSystem.hurtboxColliders.length;i++) {
			let colliderset = game.collisionSystem.hurtboxColliders[i].colliderset
			while (colliderset.find((collider) => collider.parentUID == this.uid) != undefined) {
				let colliderIndex = colliderset.findIndex((collider) => collider.parentUID == this.uid)
				colliderset.splice(colliderIndex, 1)
			}
		}
		for (let i=0;i<game.collisionSystem.hitboxColliders.length;i++) {
			let colliderset = game.collisionSystem.hitboxColliders[i].colliderset
			while (colliderset.find((collider) => collider.parentUID == this.uid) != undefined) {
				let colliderIndex = colliderset.findIndex((collider) => collider.parentUID == this.uid)
				colliderset.splice(colliderIndex, 1)
			}
		}
	}
}

class _clearObjectMoveset extends _action {
	constructor(uid = 0, conditions = new _conditions()) {
		super(conditions)
		this.uid = uid
		this.instance = function() {return new _clearObjectMoveset(his.uid, this.conditions.instance())}
	}
	Update() {
		let object = game.objects.find((object) => object.uid == this.uid)
		if (object == undefined) {return}
		object.movements.moveset.length = 0
	}
}

class _warpObjectAbsolute extends _action {
	constructor(uid = 0, location = new _location(), conditions = new _conditions()) {
		super(conditions)
		this.uid = uid
		this.location = location
		this.instance = function() {return new _warpObjectAbsolute(this.uid, this.location.instance(), this.conditions.instance())}
	}
	Update() {
		let object = game.objects.find((object) => object.uid == this.uid)
		if (object == undefined) {return}
		object.location.x = this.location.x
		object.location.y = this.location.y
	}
}

class _warpObjectRelative extends _action {
	constructor(uid = 0, location = new _location(), conditions = new _conditions()) {
		super(conditions)
		this.uid = uid
		this.location = location
		this.instance = function() {return new _warpObjectRelative(this.uid, this.location.instance(), this.conditions.instance())}
	}
	Update() {
		let object = game.objects.find((object) => object.uid == this.uid)
		if (object == undefined) {return}
		object.location.x += this.location.x
		object.location.y += this.location.y
	}
}

class _warpObjectToObject extends _action {
	constructor(uid1 = 0, uid2 = 0, conditions = new _conditions()) {
		super(conditions)
		this.uid1 = uid1
		this.uid2 = uid2
		this.instance = function() {return new _warpObjectToObject(this.uid1, this.uid2, this.conditions.instance())}
	}
	Update() {
		let object1 = game.objects.find((object) => object.uid1 == this.uid1)
		if (object1 == undefined) {return}
		let object2 = game.objects.find((object) => object.uid2 == this.uid2)
		if (object2 == undefined) {return}
		object1.location.x = object2.location.x
		object1.location.y = object2.location.y
	}
}

class _addObjectMovement extends _actions {
	constructor(uid = 0, movement = new _movement(), conditions = new _conditions()) {
		super(conditions)
		this.uid = uid
		this.movement = movement
		this.instance = function() {return new _addObjectMovement(this.uid, this.movement.instance(), this.conditions.instance())}
	}
	Update() {
		let object = game.objects.find((object) => object.uid == this.uid)
		if (object == undefined) {return}
		object.movements.moveset.push(this.movement.instance())
	}
}