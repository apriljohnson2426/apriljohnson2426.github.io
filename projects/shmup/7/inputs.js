class _inputs {
	constructor(inputset=[]) {
		this.inputset = inputset
	}
	Update() {
		this.inputset.forEach((input) => input.Update())
	}
	InputStateUID(uid) {
		let input = this.inputset.find((input) => input.uid == uid)
		if (input==undefined) {return false}
		
		return input.state
	}
}

class _input {
	constructor(uid="p1a", state=false, prevState=false, nextState=false) {
		this.uid = uid
		this.state = state
		this.prevState = prevState
		this.nextState = nextState
	}
}

class _keyInput extends _input {
	constructor(uid="p1a", keyCode=90, state=false, prevState=false, nextState=false) {
		super(uid, state, prevState, nextState)
		this.state = state
		this.prevState = prevState
		this.nextState = nextState
		this.keyCode = keyCode
	}
	Update() {
		this.prevState = this.state
		this.state = this.nextState
	}
}

window.onkeydown = function(e) {
	for (let i=0;i<game.inputs.inputset.length;i++) {
		if (game.inputs.inputset[i].constructor.name == "_keyInput") {
			if (e.keyCode == game.inputs.inputset[i].keyCode) {
				game.inputs.inputset[i].nextState = true
			}
		}
	}
}

window.onkeyup = function(e) {
	for (let i=0;i<game.inputs.inputset.length;i++) {
		if (game.inputs.inputset[i].constructor.name == "_keyInput") {
			if (e.keyCode == game.inputs.inputset[i].keyCode) {
				game.inputs.inputset[i].nextState = false
			}
		}
	}
}