class _object {
	constructor(
		uid=game.uid.NewUID(),
		location=new _location(),
		movements=new _movements(),
		triggers=new _triggers(),
		actions=new _actions(),
		colliders=new _colliders(),
		destroyOnCollision=false,
		f=0,
		isPaused=false
	) {
		this.uid = uid
		this.location = location
		this.movements = movements
		this.triggers = triggers
		this.actions = actions
		this.colliders = colliders
		this.destroyOnCollision = destroyOnCollision
		this.f = f
		this.isPaused = isPaused
		this.instance = function() {return new _object(game.uid.NewUID(0), this.location.instance(), this.movements.instance(), this.triggers.instance(), this.actions.instance(), this.colliders.instance(), this.destroyOnCollision, this.f, this.isPaused)}
	}
	Update() {
		var movediff = this.movements.Update()
		this.location.Move(this.movements.movement())
		
		//New Collider Update
		this.colliders.Update()
		
		this.triggers.triggerset.forEach((trigger) => trigger.Update())
		this.f++
	}
	GetHit(dmg) {
		//console.log(dmg)
	}
}

class _shot extends _object {
	constructor(
		uid=game.uid.NewUID(true),
		location=new _location(),
		movements=new _movements(),
		triggers=new _triggers(),
		actions=new _actions(),
		colliders=[],
		destroyOnCollision=false,
		atk=0
	) {
		super(uid, location, movements, triggers, actions, colliders, destroyOnCollision, f, isPaused)
		this.atk = atk
	}
	Update() {
		
	}
}

class _player extends _object {
	constructor(
		uid=game.uid.NewUID(true),
		location=new _location(),
		movements=new _movements(),
		triggers=new _triggers(),
		actions=new _actions(),
		colliders=[],
		destroyOnCollision=false,
		playerID=1,
		f=0,
		isPaused=false
	) {
		super(uid, location, movements, triggers, actions, colliders, destroyOnCollision, f, isPaused)
		this.playerID = playerID
	}
}

class _viewport extends _object {
	constructor(
		uid=game.uid.NewUID(true),
		location=new _location(),
		movements=new _movements(),
		triggers=new _triggers(),
		actions=new _actions(),
		colliders=new _colliders(),
		destroyOnCollision=false,
		f=0,
		isPaused=false
	) {
		super(uid, location, movements, triggers, actions, colliders, destroyOnCollision, f, isPaused)
		this.instance = function() {return new _viewport(this.uid, this.location.instance(), this.movement.instance(), this.triggers.instance(), this.actions.instance(), this.colliders.instance(), this.destroyOnCollision)}
	}
}