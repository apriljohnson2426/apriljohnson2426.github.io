class _colliders {
	constructor(colliderset=[]) {
		this.colliderset = colliderset
		this.instance = function() {return new _colliders(this.colliderset.map((collider) => collider.instance()))}
	}
}

class _collider {
	constructor(location=new _location(),width=1,height=1,layer="enemy") {
		this.location = location
		this.width = width
		this.height = height
		this.layer = layer
		this.instance = function() {return new _collider(this.location.instance(), this.width, this.height, this.layer)}
	}
	Update() {
		
	}
}

class _hitbox extends _collider {
	constructor(location=new _location(),width=1,height=1,layer="enemy",multiplier=1) {
		super(location,width,height,layer)
		this.multiplier = multiplier
		this.instance = function() {return new _hitbox(this.location.instance(), this.width, this.height, this.layer, this.multiplier)}
	}
	Update() {
		for (let i=0;i<game.objects.length;i++) {
			for (let j=0;j<game.objects[i].colliders.colliderset.length;j++) {
				let hurtCollider = game.objects[i].colliders.colliderset[j]
				if (hurtCollider.constructor.name != "_hurtbox") {continue}
				var x1 = this.location.x
				var y1 = this.location.y
				var x2 = hurtCollider.location.x
				var y2 = hurtCollider.location.y
				var xd = Math.abs(x2-x1)
				var yd = Math.abs(y2-y1)
				var xgap = this.width/2 + hurtCollider.width/2
				var ygap = this.height/2 + hurtCollider.height/2
				if (xd < xgap && yd < ygap) {
					game.objects[i].GetHit(this.multiplier*hurtCollider.multiplier)
				}
			}
		}
	}
}

class _hurtbox extends _collider {
	constructor(location=new _location(),width=1,height=1,layer="enemy",multiplier=1) {
		super(location,width,height,layer)
		this.multiplier = multiplier
		this.instance = function() {return new _hurtbox(this.location.instance(), this.width, this.height, this.layer, this.multiplier)}
	}
}