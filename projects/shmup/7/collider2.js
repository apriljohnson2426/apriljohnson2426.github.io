class _collisionSystem {
	constructor(hitboxColliders=[], hurtboxColliders=[]) {
		this.hitboxColliders = hitboxColliders
		this.hurtboxColliders = hurtboxColliders
	}
	Update() {
		this.hurtboxColliders.forEach((colliders) => colliders.colliderset.forEach((collider) => collider.Update()))
		this.hitboxColliders.forEach((colliders) => colliders.colliderset.forEach((collider) => collider.Update()))
	}
}

class _colliders {
	constructor(colliderset=[], layer="all") {
		this.colliderset = colliderset
		this.layer = layer
		this.instance = function() {return new _colliders(this.colliderset.map((collider) => collider.instance()), this.layer)}
	}
	Update() {
		this.colliderset.forEach((collider) => collider.Update())
		this.colliderset.forEach((collider) => collider.Update2())
	}
}

class _collider {
	constructor(uid=game.uid.NewUID(), parentUID=game.uid.Memory(0), offset=new _location(), location=new _location(), width=1, height=1, layer="all", isColliding=false, collisionArray=[]) {
		this.uid = uid
		this.parentUID = parentUID
		this.offset = offset
		this.location = location
		this.width = width
		this.height = height
		this.layer = layer
		this.isColliding = isColliding
		this.collisionArray = collisionArray
		this.instance = function() {return new _collider(game.uid.NewUID(), game.uid.Memory(0), this.offset.instance(), this.location.instance(), this.width, this.height, this.layer, this.isColliding, this.collisionArray)}
	}
	PushToCollisionSystem() {
		switch (this.constructor.name) {
			case "_collider":
			case "_hurtbox":
				if (game.collisionSystem.hurtboxColliders.find((colliders) => colliders.layer == this.layer) == undefined) {
					game.collisionSystem.hurtboxColliders.push(new _colliders([], this.layer))
				}
				game.collisionSystem.hurtboxColliders.find((colliders) => colliders.layer == this.layer).colliderset.push(this)
			break;
			case "_hitbox":
				if (game.collisionSystem.hitboxColliders.find((colliders) => colliders.layer == this.layer) == undefined) {
					game.collisionSystem.hitboxColliders.push(new _colliders([], this.layer))
				}
				game.collisionSystem.hitboxColliders.find((colliders) => colliders.layer == this.layer).colliderset.push(this)
			break;
		}
	}
	CopyParentLocation() {
		let parentObject = game.objects.find((object) => object.uid == this.parentUID)
		if (parentObject != undefined) {
			this.location.x = parentObject.location.x + this.offset.x
			this.location.y = parentObject.location.y + this.offset.y
		}
	}
	Update() {
		super.CopyParentLocation()
		this.isColliding = false
		this.collisionArray.length = 0
	}
	Update2() {
		
	}
}

class _hitbox extends _collider {
	constructor(uid=game.uid.NewUID(), parentUID=game.uid.saved, offset=new _location(), location=new _location(), width=1, height=1, layer="all", isColliding=false, multiplier=1, collisionArray=[]) {
		super(uid,parentUID,offset,location,width,height,layer,isColliding,collisionArray)
		this.multiplier = multiplier
		this.instance = function() {return new _hitbox(game.uid.NewUID(), game.uid.Memory(0), this.offset.instance(), this.location.instance(), this.width, this.height, this.layer, this.isColliding, this.multiplier, this.collisionArray)}
	}
	Update0() {
		super.CopyParentLocation()
		
		let hurtboxColliders = game.collisionSystem.hurtboxColliders.find((colliders) => colliders.layer == this.layer)
		if (hurtboxColliders==undefined) {return}
		for (let i=0;i<hurtboxColliders.colliderset.length;i++) {
			let hurtCollider = hurtboxColliders.colliderset[i]
			hurtCollider.isColliding = false || hurtCollider.isColliding
			var x1 = this.location.x
			var y1 = this.location.y
			var x2 = hurtCollider.location.x
			var y2 = hurtCollider.location.y
			var xd = Math.abs(x2-x1)
			var yd = Math.abs(y2-y1)
			var xgap = this.width/2 + hurtCollider.width/2
			var ygap = this.height/2 + hurtCollider.height/2
			if (xd < xgap && yd < ygap) {
				hurtCollider.isColliding = true
				let hurtObject = game.objects.find((object) => object.uid == hurtCollider.parentUID)
				hurtObject.GetHit(this.multiplier*hurtCollider.multiplier)
			}
		}
	}
	Update() {
		super.CopyParentLocation()
		this.isColliding = false
		this.collisionArray.length = 0
	}
	Update2() {
		for (let i=0;i<game.objects.length;i++) {
			let object = game.objects[i]
			for (let j=0;j<object.colliders.colliderset.length;j++) {
				let collider = object.colliders.colliderset[j]
				if (collider.layer == this.layer) {
					if (collider.constructor.name == "_hurtbox") {
						let yd = Math.abs(collider.location.y - this.location.y)
						let ygap = this.height/2 + collider.height/2
						if (yd < ygap) {
							let xd = Math.abs(collider.location.x - this.location.x)
							let xgap = this.width/2 + collider.width/2
							if (xd < xgap) {
								this.collisionArray.push(collider)
								collider.collisionArray.push(this)
							}
						}
					}
				}
			}
		}
	}
}

class _hurtbox extends _collider {
	constructor(uid=game.uid.NewUID(), parentUID=game.uid.saved, offset=new _location(), location=new _location(), width=1, height=1, layer="all", isColliding=false, multiplier=1, collisionArray=[]) {
		super(uid,parentUID,offset,location,width,height,layer,isColliding,collisionArray)
		this.multiplier = multiplier
		this.instance = function() {return new _hurtbox(game.uid.NewUID(), game.uid.Memory(0), this.offset.instance(), this.location.instance(), this.width, this.height, this.layer, this.isColliding, this.multiplier, this.collisionArray)}
	}
	Update() {
		super.CopyParentLocation()
		this.isColliding = false
		this.collisionArray.length = 0
	}
	
	Update2() {
		
	}
}