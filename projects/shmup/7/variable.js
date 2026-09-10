class _variable {
	constructor(value=0) {
		this.value = value
		this.instance = function() {return new _variable(this.value)}
	}
	Value() {
		return this.value
	}
}

class _objectLocationX extends _variable {
	constructor(uid="p1", value=0) {
		super(value)
		this.uid = uid
		this.instance = function() {return new _ObjectLocationX(this.uid, this.value)}
	}
	Value() {
		this.value = game.objects.find((object) => object.uid == this.uid).location.x
		return this.value
	}
}

class _objectLocationY extends _variable {
	constructor(uid="p1", value=0) {
		super(value)
		this.uid = uid
		this.instance = function() {return new _ObjectLocationY(this.uid, this.value)}
	}
	Value() {
		this.value = game.objects.find((object) => object.uid == this.uid).location.y
		return this.value
	}
}

class _objectF extends _variable {
	constructor(uid="p1", value=0) {
		super(value)
		this.uid = uid
		this.instance = function() {return new _objectF(this.uid, this.value)}
	}
	Value() {
		let object = game.objects.find((object) => object.uid == this.uid)
		if (object != undefined) {this.value = object.f}
		return this.value
	}
}