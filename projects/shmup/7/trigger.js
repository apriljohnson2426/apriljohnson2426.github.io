class _triggers {
	constructor(triggerset = []) {
		this.triggerset = triggerset
		this.instance = function() {return new _triggers(this.triggerset.map((trigger) => trigger.instance()))}
	}
}

class _trigger {
	constructor(actions = new _actions(), cooldown = 0, cooldownTimer = 0) {
		this.actions = actions
		this.cooldown = cooldown
		this.cooldownTimer = cooldownTimer
		this.instance = function() {return new _trigger(this.actions.instance(), this.cooldown, this.cooldownTimer)}
	}
	Update() {
		if (this.cooldownTimer >= this.cooldown) {
			this.actions.actionset.forEach((action) => action.Update())
			this.cooldownTimer = 0
		} else {
			this.cooldownTimer++
		}
	}
}

class _whileInputTrigger extends _trigger {
	constructor(actions = new _actions(), cooldown = 0, cooldownTimer = 0, inputUID = "p1a", state=true) {
		super(actions, cooldown, cooldownTimer)
		this.inputUID = inputUID
		this.state = state
		this.instance = function() {return new _whileInputTrigger(this.actions.instance(), this.cooldown, this.cooldownTimer, this.inputUID, this.state)}
	}
	Update() {
		let inputState = game.inputs.inputset.find((input) => input.uid == this.inputUID).state
		if (inputState == undefined) {return}
		if (inputState && this.cooldownTimer >= this.cooldown) {
			this.actions.actionset.forEach((action) => action.Update())
			this.cooldownTimer = 0
		} else {
			this.cooldownTimer++
		}
	}
}

class _onInputTrigger extends _trigger {
	constructor(actions = new _actions(), cooldown = 0, cooldownTimer = 0, inputUID = "p1a", state=true) {
		super(actions, cooldown, cooldownTimer)
		this.inputUID = inputUID
		this.state = state
		this.instance = function() {return new _onInputTrigger(this.actions.instance(), this.cooldown, this.cooldownTimer, this.inputUID, this.state)}
	}
	Update() {
		let inputState = game.inputs.inputset.find((input) => input.uid == this.inputUID).state
		let prevInputState = game.inputs.inputset.find((input) => input.uid == this.inputUID).prevState
		if (inputState == this.state && prevInputState != inputState && this.cooldownTimer >= this.cooldown) {
			this.actions.actionset.forEach((action) => action.Update())
			this.cooldownTimer = 0
		} else {
			this.cooldownTimer++
		}
	}
}

class _whileCollidingTrigger extends _trigger {
	constructor(actions = new _actions(), cooldown = 0, cooldownTimer = 0, layer = "all", uid=0) {
		super(actions, cooldown, cooldownTimer)
		this.layer = layer
		this.uid = uid
	}
	Update() {
		let colliders = game.collisionSystem.hurtboxColliders.find((colliders) => colliders.layer == this.layer)
		let collider = colliders.colliderset.find((collider) => collider.uid == this.uid)
		if (collider == undefined) {return}
		if (collider.isColliding && this.cooldownTimer >= this.cooldown) {
			this.actions.actionset.forEach((action) => action.Update())
			this.cooldownTimer = 0
		} else {
			this.cooldownTimer++
		}
	}
}

class _variableEqualsVariable extends _trigger {
	constructor(actions = new _actions(), cooldown = 0, cooldownTimer = 0, variable1 = new _variable(), variable2 = new _variable()) {
		super(actions, cooldown, cooldownTimer)
		this.variable1 = variable1
		this.variable2 = variable2
		this.instance = function() {return new _variableEqualsVariable(this.actions.instance(), this.cooldown, this.cooldownTimer, this.variable1.instance(), this.variable2.instance())}
	}
	Update() {
		let value1 = this.variable1.Value()
		let value2 = this.variable2.Value()
		if (value1 == value2 && this.cooldownTimer >= this.cooldown) {
			this.actions.actionset.forEach((action) => action.Update())
			this.cooldownTimer = 0
		} else {
			this.cooldownTimer++
		}
	}
}