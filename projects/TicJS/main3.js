const BeamDirection = Object.freeze({LEFT: "LEFT", BOTH: "BOTH", RIGHT: "RIGHT", NONE: "NONE"});
const GeneratorType = Object.freeze({RANDOM_FILL: "RANDOM_FILL", INTEGER_FILL: "INTEGER_FILL"});
const IteratorType = Object.freeze({INTEGER: "INTEGER", RANDOM: "RANDOM"});
const IteratorCondition = Object.freeze({SOLVABLE: "SOLVABLE", MAX_INTEGER: "MAX_INTEGER"});
const SolverCondition = Object.freeze({ANY_SOLUTION: "ANY_SOLUTION", ALL_SOLUTIONS: "ALL_SOLUTIONS"});
const LoadSaverType = Object.freeze({LEVEL_CODE: "LEVEL_CODE", GENERATOR_OUTPUT: "GENERATOR_OUTPUT"});
const Facing = Object.freeze({SOUTH: "SOUTH", WEST: "WEST", NORTH: "NORTH", EAST: "EAST", VERTICAL: "VERTICAL", HORIZONTAL: "HORIZONTAL", NONE: "NONE"});
const BeamOrientation = Object.freeze({VERTICAL: "VERTICAL", HORIZONTAL: "HORIZONTAL", NONE: "NONE"});
const ButtonType = Object.freeze({SQUARE: "SQUARE", EMITTER: "EMITTER", NONE: "NONE"});
const InputFieldType = Object.freeze({TEXT: "TEXT", NUMBER: "NUMBER", CHECKBOX: "CHECKBOX"});
const FormActionType = Object.freeze({GENERATE: "GENERATE", SOLVE: "SOLVE", ITERATE: "ITERATE", SAVE: "SAVE", LOAD: "LOAD", NONE: "NONE"});
const Colors = Object.freeze({
	SQUARE_ACTIVE: "hsl(0,0%,90%)", 
	SQUARE_INACTIVE: "hsl(0,0%,10%)", 
	SQUARE_LEFT: "hsl(0,50%,75%)", 
	SQUARE_BOTH: "hsl(120,50%,75%)", 
	SQUARE_RIGHT: "hsl(240,50%,75%)", 
	EMITTER_DEFAULT: "hsl(0,0%,75%)", 
	EMITTER_LEFT: "hsl(0,50%,50%)", 
	EMITTER_BOTH: "hsl(120,50%,50%)", 
	EMITTER_RIGHT: "hsl(240,50%,50%)", 
	EMITTER_NONE: "hsl(300,100%,50%)"});
var game;

class _game {
	constructor() {
		this.level = new _level( //_level
			"APR", //name string
			5, //nX int
			5, //nY int
			1, //nLeft int
			1, //nBoth int
			1); //nRight int
		this.levelState = {
			emitters: [], //_emitter[]
			activeEmitters: [], //_emitter[]
			currentDirection: BeamDirection.LEFT, //BeamDirection
			squares: [], //_square[]
			score: 0, //int
			solved: false, //bool
			get nLeft() {let n=0; game.levelState.activeEmitters.forEach((emitter) => {n += emitter.beamDirection == BeamDirection.LEFT ? 1 : 0}); return n;},
			get nBoth() {let n=0; game.levelState.activeEmitters.forEach((emitter) => {n += emitter.beamDirection == BeamDirection.BOTH ? 1 : 0}); return n;},
			get nRight() {let n=0; game.levelState.activeEmitters.forEach((emitter) => {n += emitter.beamDirection == BeamDirection.RIGHT ? 1 : 0}); return n;}
		};
		for (let i=0; i<2*32+2*32; i++) {
			this.levelState.emitters[i] = new _emitter(i, Facing.NONE, BeamDirection.NONE);
		}
		for (let i=0; i<32*32; i++) {
			this.levelState.squares[i] = new _square( //_square
			i, //position int
			0, //score int
			BeamDirection.NONE, //BeamDirection
			BeamOrientation.NONE, //BeamOrientation
			Facing.NONE) //Facing
		}
		this.buttons = []; //_button[]
		for (let i=0; i<32*32; i++) {
			this.buttons.push(new _button(ButtonType.SQUARE, i, 0, 0, 0, 0));
		}
		for (let i=0; i<2*32+2*32; i++) {
			this.buttons.push(new _button(ButtonType.EMITTER, i, 0, 0, 0, 0));
		}
		this.iterator = {
			type: IteratorType.INTEGER, //IteratorType
			minInteger: 0, //int
			maxInteger: 0, //int
			stopConditions: [IteratorCondition.SOLVABLE] //IteratorCondition[]
		};
		this.generator = {
			type: GeneratorType.RANDOM_FILL, //_GeneratorType
			level: new _level( //_level
				"GEN", //name string
				5, //nX int
				5, //nY int
				1, //nLeft int
				0, //nBoth int
				1), //nRight int
			integerFillInteger: 0, //int
			randomFillChance: 0.5 //float
		};
		this.solver = {
			solutions: [], //_solution[]
			stopCondition: SolverCondition.ANY_SOLUTION, //
			emitterDirectionPermutations: [], //[BeamDirection[]]
			emitterPositionCombinationPermutations: [] //[int[]]
		};
		this.loadSaver = {
			type: LoadSaverType.LEVEL_CODE,
			code: "" //string
		};
		this.forms = []; //_form[]
		
		this.Generate = this._Generate.bind(this);
		this.Load = this._Load.bind(this);
		this.ButtonUpdate = this._ButtonUpdate.bind(this);
		this.ToggleGridPosition = this._ToggleGridPosition.bind(this);
		this.AddEmitter = this._AddEmitter.bind(this);
		this.PlayActiveEmitters = this._PlayActiveEmitters.bind(this);
		this.PlayBeamSquares = this._PlayBeamSquares.bind(this);
		this.RefaceEmitters = this._RefaceEmitters.bind(this);
		this.ResetEmitterBeamDirections = this._ResetEmitterBeamDirections.bind(this);
		this.ResetEmitterBeamDirection = this._ResetEmitterBeamDirection.bind(this);
		this.RemoveEmitter = this._RemoveEmitter.bind(this);
		this.RemoveNewestOpposingActiveEmitters = this._RemoveNewestOpposingActiveEmitters.bind(this);
		this.RemoveActiveEmitters = this._RemoveActiveEmitters.bind(this);
		this.ResetSquare = this._ResetSquare.bind(this);
		this.ResetSquares = this._ResetSquares.bind(this);
		this.ChangeCurrentDirection = this._ChangeCurrentDirection.bind(this);
		this.CheckSolved = this._CheckSolved.bind(this);
		this.PlayUpdate = this._PlayUpdate.bind(this);
	}
	_Generate() {
		let level = this.generator.level;
		level.name = level.name;
		level.nX = level.nX;
		level.nY = level.nY;
		level.nLeft = level.nLeft;
		level.nBoth = level.nBoth;
		level.nX = level.nX;
		level.grid.length = 0;
		level.grid.length = level.nX * level.nY;
		if (this.generator.type === GeneratorType.RANDOM_FILL) {
			for (let i=0; i<level.grid.length; i++) {level.grid[i] = Math.random() < this.generator.randomFillChance ? true : false;}
		}
		if (this.generator.type === GeneratorType.INTEGER_FILL) {
			for (let i=0; i<level.grid.length; i++) {level.grid[i] = getBit(this.generator.integerFillInteger,i) === 1 ? true : false;}
		}
	}
	_Load() {
		let loadSaver = this.loadSaver;
		let level = this.level;
		if (loadSaver.type === LoadSaverType.GENERATOR_OUTPUT) {
			let source = this.generator.level;
			level.name = source.name;
			level.nX = source.nX;
			level.nY = source.nY;
			level.nLeft = source.nLeft;
			level.nBoth = source.nBoth;
			level.nRight = source.nRight;
			level.grid = source.grid;
		}
		this.ButtonUpdate();
	}
	_ButtonUpdate() {
		let nSquares = this.level.grid.length;
		let nEmitters = this.level.nX*2 + this.level.nY*2;
		let buttonArea = document.querySelector("#buttonArea");
		let buttonAreaRect = buttonArea.getBoundingClientRect();
		for (let i=0; i<this.buttons.length; i++) {
			let button = this.buttons[i];
			if ((button.type === ButtonType.SQUARE && button.position >= nSquares)
				||(button.type === ButtonType.EMITTER && button.position >= nEmitters)) {
				button.visible = false;
				continue;
			}
			
			let width = buttonAreaRect.width / (this.level.nX+2);
			let height = buttonAreaRect.height / (this.level.nY+2);
			if (button.type === ButtonType.SQUARE) {
				button.x = buttonAreaRect.x + width * ((button.position % this.level.nX) + 1);
				button.y = buttonAreaRect.y + height * (Math.floor(button.position / this.level.nX) + 1);
				let squarePosition = button.position;
				let square = this.levelState.squares[squarePosition];
				if (square != null) {
					button.button.innerText = square.score;
				}
			}
			if (button.type === ButtonType.EMITTER) {
				if (button.position < this.level.nX) {
					button.x = buttonAreaRect.x + width * ((button.position % this.level.nX) + 1);
					button.y = buttonAreaRect.y;
				} else if (button.position < this.level.nX + this.level.nY) {
					button.x = buttonAreaRect.right - width;
					button.y = buttonAreaRect.y + height * ((button.position - this.level.nX) + 1);
				} else if (button.position < 2*this.level.nX + this.level.nY) {
					button.x = buttonAreaRect.right - width * ((button.position - this.level.nX - this.level.nY) + 2);
					button.y = buttonAreaRect.bottom - height;
				} else {
					button.x = buttonAreaRect.x;
					button.y = buttonAreaRect.bottom - height * ((button.position - 2*this.level.nX - this.level.nY) + 2);
				}
			}
			button.width = width;
			button.height = height;
			button.visible = true;
		}
	}
	_ToggleGridPosition(position) {
		let gridSquare = this.level.grid[position];
		if (gridSquare != null) {this.level.grid[position] = !this.level.grid[position];}
	}
	_AddEmitter(position, beamDirection) {
		//throw if position or beamDirection is null or wrong type
		if (!Number.isInteger(position) || position < 0) {throw new Error("position is not a valid Position");}
		if (!Object.hasOwn(BeamDirection, beamDirection)) {throw new Error("beamDirection is not a valid BeamDirection");}
		//Return if beamDirection is NONE
		if (beamDirection === BeamDirection.NONE) {return;}
		//Remove any existing emitter in position, Play Active Emitters and then return if removed
		let existingEmitter = this.levelState.activeEmitters.find((emitter) => emitter.position === position);
		if (existingEmitter != null) {
			let position = existingEmitter.position;
			this.RemoveEmitter(position);
			this.PlayUpdate();
			return;
		}
		//Return if levelState nDirection >= level nDirection
		if (beamDirection === BeamDirection.LEFT && this.levelState.nLeft >= this.level.nLeft) {return;}
		if (beamDirection === BeamDirection.BOTH && this.levelState.nBoth >= this.level.nBoth) {return;}
		if (beamDirection === BeamDirection.RIGHT && this.levelState.nRight >= this.level.nRight) {return;}
		//Return if entrySquare is inactive
		let emitter = this.levelState.emitters[position];
		let entrySquarePosition = emitter.nthSquarePositionInLine(0);
		if (!this.level.grid[entrySquarePosition]) {return;}
		//Throw if emitter is null or not of class _emitter
		if (emitter == null) {throw new Error("emitter is null");}
		if (emitter.constructor.name != "_emitter") {throw new Error("emitter is not of class _emitter");}
		//Add emitter to activeEmitters
		emitter.beamDirection = beamDirection;
		this.levelState.activeEmitters.push(emitter);
		//Play active emitters
		this.PlayUpdate();
	}
	_PlayActiveEmitters() {
		//Iterate over active emitters
		for (let i=0; i<this.levelState.activeEmitters.length; i++) {
			let emitter = this.levelState.activeEmitters[i];
			for (let j=0; j<emitter.maxLength; j++) {
				let squarePosition = emitter.nthSquarePositionInLine(j);
				let square = this.levelState.squares[squarePosition];
				let opposingOrientation = emitter.facing === Facing.SOUTH || emitter.facing === Facing.NORTH ? BeamOrientation.HORIZONTAL : BeamOrientation.VERTICAL;
				if (this.level.grid[squarePosition] && this.levelState.squares[squarePosition].beamOrientation != opposingOrientation) {
					square.beamOrientation = emitter.facing === Facing.SOUTH || emitter.facing === Facing.NORTH ? BeamOrientation.VERTICAL
					: emitter.facing === Facing.WEST || emitter.facing === Facing.EAST ? BeamOrientation.HORIZONTAL : BeamOrientation.NONE;
					square.setFacingFromEmitterDirectionAndFacing(emitter.beamDirection, emitter.facing);
					square.beamDirection = emitter.beamDirection;
				} else {
					break;
				}
			}
		}
	}
	_PlayBeamSquares() {
		let nX = this.level.nX;
		let nY = this.level.nY;
		//Iterate over squares
		for (let i=0; i<this.levelState.squares.length; i++) {
			let square = this.levelState.squares[i];
			//Continue if square is not part of a beam
			if (square.beamOrientation != BeamOrientation.VERTICAL && square.beamOrientation != BeamOrientation.HORIZONTAL) {continue;}
			//Iterate over rays
			if (square.beamDirection === BeamDirection.LEFT || square.beamDirection === BeamDirection.RIGHT) {
				for (let i=0; i<Math.max(nX,nY); i++) {
					let nthPosition = square.nthSquarePositionInLine(i);
					//Break if next square is not valid
					if (nthPosition == -1) {break;}
					let nthSquare = this.levelState.squares[nthPosition];
					//Break if next next square is inactive
					if (!nthSquare.active) {break;}
					nthSquare.score++;
					if (square.beamDirection === BeamDirection.LEFT) {nthSquare.rays.left = true;}
					if (square.beamDirection === BeamDirection.RIGHT) {nthSquare.rays.right = true;}
				}
			} else if (square.beamDirection === BeamDirection.BOTH) {
				//Temporarily change facing to one sided
				if (square.facing === Facing.VERTICAL) {
					square.facing = Facing.SOUTH;
				} else if (square.facing === Facing.HORIZONTAL) {
					square.facing = Facing.WEST;
				}
				//Iterate over south/west rays i=0 for including beam score
				for (let i=0; i<Math.max(nX,nY); i++) {
					let nthPosition = square.nthSquarePositionInLine(i);
					//Break if next square is not valid
					if (nthPosition == -1) {break;}
					let nthSquare = this.levelState.squares[nthPosition];
					//Break if next next square is inactive
					if (!nthSquare.active) {break;}
					nthSquare.score++;
					nthSquare.rays.both = true;
				}
				//Temporarily switch facing
				if (square.facing === Facing.SOUTH) {
					square.facing = Facing.NORTH;
				} else if (square.facing === Facing.WEST) {
					square.facing = Facing.EAST;
				}
				//Iterate over north/east rays i=1 for excluding duplicate beam score
				for (let i=1; i<Math.max(nX,nY); i++) {
					let nthPosition = square.nthSquarePositionInLine(i);
					//Break if next square is not valid
					if (nthPosition == -1) {break;}
					let nthSquare = this.levelState.squares[nthPosition];
					//Break if next next square is inactive
					if (!nthSquare.active) {break;}
					nthSquare.score++;
					nthSquare.rays.both = true;
				}
				//Set facing back to original
				if (square.facing === Facing.NORTH) {
					square.facing = Facing.VERTICAL;
				} else if (square.facing === Facing.EAST) {
					square.facing = Facing.HORIZONTAL;
				}
			}
		}
	}
	_RemoveEmitter(position) {
		//Throw if position is not an integer, negative, or above maximumPosition
		if (!Number.isInteger(position)) {throw new Error("position is not an integer");}
		if (position < 0) {throw new Error("position is negative");}
		if (position > 2*32+2*32) {throw new Error("position is above maximumPosition");}
		
		this.ResetEmitterBeamDirection(position);
		let index = this.levelState.activeEmitters.findIndex((emitter) => emitter.position === position);
		if (index != -1) {this.levelState.activeEmitters.splice(index, 1);}
	}
	_RemoveNewestOpposingActiveEmitters() {
		for (let i=0; i<this.levelState.activeEmitters.length; i++) {
			let emitter = this.levelState.activeEmitters[i];
			let opposingEmitterPosition = emitter.OpposingEmitterPosition();
			let opposingIndex = this.levelState.activeEmitters.findIndex((emitter) => emitter.position == opposingEmitterPosition);
			if (opposingIndex != -1) {this.levelState.activeEmitters.splice(opposingIndex, 1);}
		}
		this.ButtonUpdate();
	}
	_RemoveActiveEmitters() {
		for (let i=0; i<this.levelState.activeEmitters.length; i++) {
			let emitter = this.levelState.activeEmitters[i];
			this.RemoveEmitter(emitter.position);
			i--;
		};
	}
	_RefaceEmitters() {
		this.levelState.emitters.forEach((emitter) => {
			emitter.facing = emitter.position < this.level.nX ? Facing.SOUTH
				: emitter.position < this.level.nX + this.level.nY ? Facing.WEST
				: emitter.position < 2*this.level.nX + this.level.nY ? Facing.NORTH
				: emitter.position < 2*this.level.nX + 2*this.level.nY ? Facing.EAST
				: Facing.NONE;
		})
	}
	_ResetEmitterBeamDirections() {
		this.levelState.emitters.forEach((emitter) => {
			this.ResetEmitterBeamDirection(emitter.position);
		})
	}
	_ResetEmitterBeamDirection(position) {
		//Throw if position is not an integer, negative, or above maximumPosition
		if (!Number.isInteger(position)) {throw new Error("position is not an integer");}
		if (position < 0) {throw new Error("position is negative");}
		if (position > 2*32+2*32) {throw new Error("position is above maximumPosition");}
		
		let emitter = this.levelState.emitters[position];
		//Throw if emitter not found or is not of class _emitter
		if (emitter == null) {throw new Error("emitter not found");}
		if (emitter.constructor.name !== "_emitter") {throw new Error("emitter not _emitter");}
		
		emitter.beamDirection = BeamDirection.NONE;
	}
	_ResetSquare(position) {
		//Throw if position is not an integer, negative, or above maximumPosition
		if (!Number.isInteger(position)) {throw new Error("position is not an integer");}
		if (position < 0) {throw new Error("position is negative");}
		if (position > 32*32) {throw new Error("position is above maximumPosition");}
		
		let square = this.levelState.squares[position];
		//Throw if square not found or is not of class _square
		if (square == null) {throw new Error("square not found");}
		if (square.constructor.name !== "_square") {throw new Error("square not _square");}
		
		square.beamDirection = BeamDirection.NONE;
		square.beamOrientation = BeamOrientation.NONE;
		square.facing = Facing.NONE;
		square.score = 0;
		square.rays = {left: false, both: false, right: false};
	}
	_ResetSquares() {
		for (let i=0; i<this.levelState.squares.length; i++) {
			this.ResetSquare(i);
		}
	}
	_ChangeCurrentDirection(beamDirection) {
		//Throw if beamDirection is null or is not of BeamDirection
		if (beamDirection == null) {throw new Error("beamDirection is null");}
		if (!Object.hasOwn(BeamDirection, beamDirection)) {throw new Error("beamDirection is not of BeamDirection");}
		game.levelState.currentDirection = beamDirection;
	}
	_PlayUpdate() {
		this.ResetSquares();
		this.PlayActiveEmitters();
		this.PlayBeamSquares();
		this.CheckSolved();
		this.ButtonUpdate();
	}
	_CheckSolved() {
		let solved = true;
		let score = 0;
		for (let i=0; i<this.levelState.squares.length; i++) {
			let square = this.levelState.squares[i];
			//Continue if square is inactive
			if (!square.active) {continue;}
			solved = solved && square.score > 0;
			score += square.score;
		}
		this.levelState.solved = solved;
		this.levelState.score = score;
	}
}

class _level {
	constructor(name, nX, nY, nLeft, nBoth, nRight) {
		this.name = name; //string
		this.nX = nX; //int
		this.nY = nY; //int
		this.nLeft = nLeft; //int
		this.nBoth = nBoth; //int
		this.nRight = nRight; //int
		this.grid = new Array(this.nX * this.nY).fill(true); //bool[]
	}
}

class _emitter {
	constructor(position, facing, beamDirection) {
		this.position = position; //int
		this.facing = facing; //Facing
		this.beamDirection = beamDirection; //BeamDirection
	}
	nthSquarePositionInLine(n) {
		//Throw if n is null, not an integer, or is negative
		if (n == null) {throw new Error("n is null");}
		if (!Number.isInteger(n)) {throw new Error("n is not an integer");}
		if (n < 0) {throw new Error("n is negative");}
		
		let nX = game.level.nX;
		let nY = game.level.nY;
		//Return -1 if n >= nY and facing south/north, or if n >= nX and facing west/east
		if (n >= nY && (this.facing === Facing.SOUTH || this.facing === Facing.NORTH)) {return -1;}
		if (n >= nX && (this.facing === Facing.WEST || this.facing === Facing.EAST)) {return -1;}
		
		if (this.facing === Facing.SOUTH) {
			let squarePosition = this.position + n * nX;
			return squarePosition;
		} else if (this.facing === Facing.WEST) {
			let squarePosition = (this.position - nX + 1) * nX - 1 - n;
			return squarePosition;
		} else if (this.facing === Facing.NORTH) {
			let squarePosition = nX*nY - (this.position - nX - nY) - n * nX - 1;
			return squarePosition;
		} else if (this.facing === Facing.EAST) {
			let squarePosition = nX*nY - nX * (this.position + 1 - 2*nX - nY) + n;
			return squarePosition;
		}
	}
	get maxLength() {return (this.facing === Facing.SOUTH || this.facing === Facing.NORTH) ? game.level.nY :
		(this.facing === Facing.WEST || this.facing === Facing.EAST) ? game.level.nX : 0;}
	OpposingEmitterPosition() {
		if (this.facing === Facing.SOUTH || this.facing === Facing.NORTH)  {
			return 2 * game.level.nX + game.level.nY - this.position - 1;
		}
		if (this.facing === Facing.WEST || this.facing === Facing.EAST) {
			return 3 * game.level.nX + 2 * game.level.nY - this.position - 1;
		}
		return -1;
	}
}

class _square {
	constructor(position, score, beamOrientation, facing) {
		this.position = position; //int
		this.score = score; //int
		this.beamDirection = BeamDirection.NONE; //BeamDirection
		this.beamOrientation = BeamOrientation.NONE; //BeamOrientation
		this.facing = Facing.NONE; //Facing
		this.rays = {left: false, both: false, right: false};
		this.setFacingFromEmitterDirectionAndFacing = this._setFacingFromEmitterDirectionAndFacing.bind(this);
	}
	get active() {
		return game.level.grid[this.position] ?? false;
	}
	_setFacingFromEmitterDirectionAndFacing(emitterBeamDirection, emitterFacing) {
		//Throw if emitterBeamDirection is null or is not BeamDirection
		if (emitterBeamDirection == null) {throw new Error("emitterBeamDirection is null");}
		if (!Object.hasOwn(BeamDirection, emitterBeamDirection)) {throw new Error("emitterBeamDirection is not BeamDirection");}
		//Throw if emitterFacing is null or is not Facing
		if (emitterFacing == null) {throw new Error("emitterFacing is null");}
		if (!Object.hasOwn(Facing, emitterFacing)) {throw new Error("emitterFacing is not EmitterFacing");}
		
		let squareFacing = Facing.NONE;
		if (emitterBeamDirection === BeamDirection.LEFT && emitterFacing === Facing.SOUTH) {squareFacing = Facing.EAST;}
		if (emitterBeamDirection === BeamDirection.RIGHT && emitterFacing === Facing.NORTH) {squareFacing = Facing.EAST;}
		if (emitterBeamDirection === BeamDirection.LEFT && emitterFacing === Facing.NORTH) {squareFacing = Facing.WEST;}
		if (emitterBeamDirection === BeamDirection.RIGHT && emitterFacing === Facing.SOUTH) {squareFacing = Facing.WEST;}
		if (emitterBeamDirection === BeamDirection.LEFT && emitterFacing === Facing.WEST) {squareFacing = Facing.SOUTH;}
		if (emitterBeamDirection === BeamDirection.RIGHT && emitterFacing === Facing.EAST) {squareFacing = Facing.SOUTH;}
		if (emitterBeamDirection === BeamDirection.LEFT && emitterFacing === Facing.EAST) {squareFacing = Facing.NORTH;}
		if (emitterBeamDirection === BeamDirection.RIGHT && emitterFacing === Facing.WEST) {squareFacing = Facing.NORTH;}
		if (emitterBeamDirection === BeamDirection.BOTH && emitterFacing === Facing.SOUTH) {squareFacing = Facing.HORIZONTAL;}
		if (emitterBeamDirection === BeamDirection.BOTH && emitterFacing === Facing.NORTH) {squareFacing = Facing.HORIZONTAL;}
		if (emitterBeamDirection === BeamDirection.BOTH && emitterFacing === Facing.WEST) {squareFacing = Facing.VERTICAL;}
		if (emitterBeamDirection === BeamDirection.BOTH && emitterFacing === Facing.EAST) {squareFacing = Facing.VERTICAL;}
		this.facing = squareFacing;
	}
	nthSquarePositionInLine(n) {
		//Throw if n is null, not an integer, or is negative
		if (n == null) {throw new Error("n is null");}
		if (!Number.isInteger(n)) {throw new Error("n is not an integer");}
		if (n < 0) {throw new Error("n is negative");}
		
		let nX = game.level.nX;
		let nY = game.level.nY;
		let gridXY = this.gridXYFromPosition(this.position, nX, nY);
		let facing = this.facing;
		let nthGridXY = {x: -1, y: -1};
		if (facing === Facing.SOUTH) {
			nthGridXY = {x: gridXY.x, y: gridXY.y + n};
		} else if (facing === Facing.NORTH) {
			nthGridXY = {x: gridXY.x, y: gridXY.y - n};
		} else if (facing === Facing.WEST) {
			nthGridXY = {x: gridXY.x - n, y: gridXY.y};
		} else if (facing === Facing.EAST) {
			nthGridXY = {x: gridXY.x + n, y: gridXY.y};
		}
		//Return -1 if gridXY is outside of [0,nX-1][0,nY-1]
		if (nthGridXY.x < 0 || nthGridXY.x >= nX) {return -1;}
		if (nthGridXY.y < 0 || nthGridXY.y >= nY) {return -1;}
		
		let nthPosition = this.PositionFromGridXY(nthGridXY, nX, nY);
		return nthPosition;
	}
	gridXYFromPosition(position, nX, nY) {
		//Throw if position is null, not an integer, or is negative
		if (position == null) {throw new Error("position is null");}
		if (!Number.isInteger(position)) {throw new Error("position is not an integer");}
		if (position < 0) {throw new Error("position is negative");}
		//Throw if nX is null, not an integer, or is negative
		if (nX == null) {throw new Error("nX is null");}
		if (!Number.isInteger(nX)) {throw new Error("nX is not an integer");}
		if (nX < 0) {throw new Error("nX is negative");}
		//Throw if nY is null, not an integer, or is negative
		if (nY == null) {throw new Error("nY is null");}
		if (!Number.isInteger(nY)) {throw new Error("nY is not an integer");}
		if (nY < 0) {throw new Error("nY is negative");}
		
		let x = position % nX;
		let y = Math.floor(position / nX);
		return {x: x, y: y};
	}
	PositionFromGridXY(gridXY, nX, nY) {
		//Throw if nX is null, not an integer, or is negative
		if (gridXY.x == null) {throw new Error("gridXY.x is null");}
		if (!Number.isInteger(gridXY.x)) {throw new Error("gridXY.x is not an integer");}
		if (gridXY.x < 0) {throw new Error("gridXY.x is negative");}
		//Throw if nY is null, not an integer, or is negative
		if (gridXY.y == null) {throw new Error("gridXY.y is null");}
		if (!Number.isInteger(gridXY.y)) {throw new Error("gridXY.y is not an integer");}
		if (gridXY.y < 0) {throw new Error("gridXY.y is negative");}
		//Throw if nX is null, not an integer, or is negative
		if (nX == null) {throw new Error("nX is null");}
		if (!Number.isInteger(nX)) {throw new Error("nX is not an integer");}
		if (nX < 0) {throw new Error("nX is negative");}
		//Throw if nY is null, not an integer, or is negative
		if (nY == null) {throw new Error("nY is null");}
		if (!Number.isInteger(nY)) {throw new Error("nY is not an integer");}
		if (nY < 0) {throw new Error("nY is negative");}
		
		let x = gridXY.x;
		let y = gridXY.y;
		return x + nX * y;
	}
}

class _button {
	constructor(type, position, x, y, width, height) {
		this.type = type; //ButtonType
		this.position = position; //int
		this.x = x; //float
		this.y = y; //float
		this.width = width; //float
		this.height = height; //float
		this._visible = false; //bool
		this._color = "white";
		this.button = document.createElement("button");
		this.button.innerText = this.position;
		this.button.onclick = this._click.bind(this);
		document.body.appendChild(this.button);
		Object.assign(this.button.style, this.style);
	}
	_click() {
		if (this.type == ButtonType.SQUARE) {
			game.ToggleGridPosition(this.position);
			game.ButtonUpdate();
		}
		if (this.type == ButtonType.EMITTER) {
			game.AddEmitter(this.position, game.levelState.currentDirection);
			game.ButtonUpdate();
		}
	}
	get style() {return {
		position: "absolute",
		left: this.x + "px",
		top: this.y + "px",
		width: this.width + "px",
		height: this.height + "px",
		background: this.color,
		display: this.visible ? "unset" : "none"
	}}
	get visible() {return this._visible;}
	set visible(value) {this._visible = value; this.color = ""; Object.assign(this.button.style, this.style);}
	get color() {return this._color;}
	set color(value) {
		if (this.type == ButtonType.SQUARE) {
			this._color = game.level.grid[this.position] ? "white" : "black";
			let beamDirection = game.levelState.squares[this.position].beamDirection;
			if (beamDirection === BeamDirection.LEFT) {this._color = Colors.SQUARE_LEFT;}
			if (beamDirection === BeamDirection.BOTH) {this._color = Colors.SQUARE_BOTH;}
			if (beamDirection === BeamDirection.RIGHT) {this._color = Colors.SQUARE_RIGHT;}
		}
		if (this.type == ButtonType.EMITTER) {
			let activeEmitter = game.levelState.activeEmitters.find((emitter) => emitter.position == this.position);
			let direction;
			if (activeEmitter != null) {direction = activeEmitter.beamDirection;}
			this._color = Colors.EMITTER_DEFAULT;
			if (direction == BeamDirection.LEFT) {this._color = Colors.EMITTER_LEFT;}
			if (direction == BeamDirection.BOTH) {this._color = Colors.EMITTER_BOTH;}
			if (direction == BeamDirection.RIGHT) {this._color = Colors.EMITTER_RIGHT;}
			if (direction == BeamDirection.NONE) {this._color = Colors.EMITTER_NONE;}
		}
	}
}

class _solution {
	constructor() {
		this.emitterSteps = ""; //string
	}
}

class _form {
	constructor() {
		this.inputFields = []; //_inputField[]
		this.formActions = []; //_formAction[]
	}
}

class _inputField {
	constructor() {
		this.type = InputFieldType.TEXT; //InputFieldType
		this.value = ""; //any
		this.x = 0; //float
		this.y = 0; //float
		this.width = 0; //float
		this.height = 0; //float
	}
}

class _formAction {
	constructor() {
		this.type = FormActionType.NONE; //FormActionType
	}
}

function main() {
	game = new _game();
	game.RefaceEmitters();
	game.ButtonUpdate();
}

function handleKeyDown(e) {
	let key = e.key;
	if (key == "z") {game.ChangeCurrentDirection(BeamDirection.LEFT);}
	if (key == "x") {game.ChangeCurrentDirection(BeamDirection.BOTH);}
	if (key == "c") {game.ChangeCurrentDirection(BeamDirection.RIGHT);}
}

window.onresize = function() {
	game.ButtonUpdate();
}

window.addEventListener("keydown", (e) => handleKeyDown(e));

function getBit(number, bitPosition) {
  // Left shift 1 by bitPosition to create a mask with a 1 at the desired position
  const mask = 1 << bitPosition;
  // Perform bitwise AND. If the result is non-zero, the bit is set.
  return (number & mask) !== 0 ? 1 : 0;
}

main();