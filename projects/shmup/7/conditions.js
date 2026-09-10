class _conditions {
	constructor(conditionset = [], comparison = "and", state = true) {
		this.conditionset = conditionset
		this.comparison = comparison
		this.state = state
		this.instance = function() {return new _conditions(this.conditionset.map((condition) => condition.instance()))}
	}
	State() {
		if (this.conditionset.length == 0) {return true}
		var numTrue = 0
		var numTotal = this.conditionset.length;
		var state = false
		for (let i=0;i<numTotal;i++) {
			if (this.conditionset[i].State()) {numTrue++}
		}
		switch(this.comparison) {
			case "and": if (numTrue==numTotal) {state = true}; break;
			case "or": if (numTrue>0) {state = true}; break;
			case "xor": if (numTrue==1) {state = true}; break;
		}
		this.state = state
		return this.state
	}
}

class _condition {
	constructor(state=true) {
		this.state = state
		this.instance = function() {return new _condition(this.state)}
	}
}

class _variableLessThanVariable extends _condition {
	constructor(variable1, variable2, state=false) {
		super(state)
		this.variable1 = variable1
		this.variable2 = variable2
		this.instance = function() {return new _variableLessThanVariable(this.variable1.instance(), this.variable2.instance(), this.state)}
	}
	State() {
		this.state = this.variable1.Value() < this.variable2.Value()
		return this.state
	}
}

class _variableMoreThanVariable extends _condition {
	constructor(variable1, variable2, state=false) {
		super(state)
		this.variable1 = variable1
		this.variable2 = variable2
		this.instance = function() {return new _variableLessThanVariable(this.variable1.instance(), this.variable2.instance(), this.state)}
	}
	State() {
		this.state = this.variable1.Value() > this.variable2.Value()
		return this.state
	}
}

class _variableEqualToVariable extends _condition {
	constructor(variable1, variable2, state=false) {
		super(state)
		this.variable1 = variable1
		this.variable2 = variable2
		this.instance = function() {return new _variableEqualToVariable(this.variable1.instance(), this.variable2.instance(), this.state)}
	}
	State() {
		this.state = this.variable1.Value() == this.variable2.State()
		return this.state
	}
}