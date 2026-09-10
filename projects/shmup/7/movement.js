class _location {
	constructor(x=0,y=0) {
		this.x = x
		this.y = y
		this.instance = function() {return new _location(this.x, this.y)}
	}
	Move(movement) {
		this.x += movement.xv
		this.y += movement.yv
	}
	distanceTo(location) {
		return Math.sqrt((this.x-location.x)*(this.x-location.x)+(this.y-location.y)*(this.y-location.y))
	}
}

class _movements {
	constructor(moveset=[], xv=0, yv=0) {
		this.moveset = moveset
		this.xv = xv
		this.yv = yv
		this.movement = function() {return {xv: this.xv, yv: this.yv}}
		this.instance = function() {return new _movements(this.moveset.map((movement) => movement.instance()))}
	}
	Update() {
		this.xv = 0
		this.yv = 0
		for (let i=0;i<this.moveset.length;i++) {
			let diff = this.moveset[i].Update()
			this.xv += diff.xv
			this.yv += diff.yv
		}
		return {xv: this.xv, yv: this.yv}
	}
}

class _movement {
	constructor(xv = 0, yv = 0) {
		this.xv = xv
		this.yv = yv
		this.instance = function() {return new _movement(this.xv, this.yv)}
	}
	PolarToRect(speed,direction) {
		let xv = speed * Math.sin(direction)
		let yv = speed * Math.cos(direction)
		return {xv:xv,yv:yv}
	}
	RectToPolar(xv,yv) {
		let speed = Math.sqrt(xv*xv+yv*yv)
		let direction = Math.atan(yv,xv)
		return {speed:speed,direction:direction}
	}
}

class _linearTranslation extends _movement {
	constructor(xv = 0, yv = 0) {
		super(xv, yv)
		this.instance = function() {return new _linearTranslation(this.xv, this.yv)}
	}
	Update() {
		return {xv: this.xv, yv: this.yv}
	}
}

class _linearTranslationPolar extends _movement {
	constructor(speed,direction) {
		super()
		this.speed = speed
		this.direction = direction
		let XY = super.PolarToRect(speed,direction)
		this.xv = XY.xv
		this.yv = XY.yv
		this.instance = function() {return new _linearTranslationPolar(this.speed, this.direction)}
	}
	Update() {
		return {xv: this.xv, yv: this.yv}
	}
}

class _followObjectTranslation {
	constructor(targetObjectUID,offset=new _location(), multiplier=1) {
		this.targetObjectUID = targetObjectUID
		this.offset = offset
		this.multiplier = multiplier
		this.xv = 0
		this.yv = 0
		this.prevx = offset.x
		this.prevy = offset.y
		this.instance = function() {return new _followObjectTranslation(this.targetObjectUID, this.offset.instance(), this.multiplier)}
	}
	Update() {
		this.targetObject = game.objects.find((object) => object.uid == this.targetObjectUID)
		if (this.targetObject != undefined) {
			this.xv = (this.targetObject.location.x - this.prevx) * this.multiplier
			this.yv = (this.targetObject.location.y - this.prevy) * this.multiplier
			this.prevx = this.targetObject.location.x
			this.prevy = this.targetObject.location.y
		} else {
			this.xv = 0
			this.yv = 0
		}
		return {xv: this.xv, yv: this.yv}
	}
}

class _radialTranslation {
	constructor(speed=0,radius=0,angle=0) {
		this.speed = speed
		this.radius = radius
		this.angle = angle
		this.x = radius * Math.sin(this.angle)
		this.y = radius * Math.cos(this.angle)
		this.prevx = this.x
		this.prevy = this.y
		this.xv = 0
		this.yv = 0
		this.instance = function() {return new _radialTranslation(this.speed, this.radius, this.angle)}
	}
	Update() {
		this.angle += this.speed
		this.x = this.radius * Math.sin(this.angle)
		this.y = this.radius * Math.cos(this.angle)
		this.xv = this.x - this.prevx
		this.yv = this.y - this.prevy
		this.prevx = this.x
		this.prevy = this.y
		return {xv: this.xv, yv: this.yv}
	}
}

class _inputTranslation {
	constructor(speed=1, leftUID, rightUID, upUID, downUID) {
		this.speed = speed
		this.dspeed = this.speed / Math.sqrt(2)
		this.upUID = upUID
		this.downUID = downUID
		this.leftUID = leftUID
		this.rightUID = rightUID
		this.x = 0
		this.y = 0
		this.xv = 0
		this.yv = 0
		this.prevx = this.x
		this.prevy = this.y
		this.instance = function() {return new _inputTranslation(this.speed, this.leftUID, this.rightUID, this.upUID, this.downUID)}
	}
	Update() {
		var up = game.inputs.InputStateUID(this.upUID)
		var down = game.inputs.InputStateUID(this.downUID)
		var left = game.inputs.InputStateUID(this.leftUID)
		var right = game.inputs.InputStateUID(this.rightUID)
		var horizontal = left || right
		var vertical = up || down
		if (left) {if (vertical) {this.x -= this.dspeed} else {this.x -= this.speed}}
		if (right) {if (vertical) {this.x += this.dspeed} else {this.x += this.speed}}
		if (up) {if (horizontal) {this.y -= this.dspeed} else {this.y -= this.speed}}
		if (down) {if (horizontal) {this.y += this.dspeed} else {this.y += this.speed}}
		this.xv = this.x - this.prevx
		this.yv = this.y - this.prevy
		this.prevx = this.x
		this.prevy = this.y
		return {xv: this.xv, yv: this.yv}
	}
}