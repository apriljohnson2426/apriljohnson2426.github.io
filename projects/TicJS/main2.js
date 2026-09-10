var game;
var findLevelAttempt = 0;
var findLevelAttempts = 2048;
var findLevelRate = 0;
var levelInt = 0;
//var nX = 3;
//var nY = 3;
//var fillChance = 0.5;


class _game {
	constructor(level) {
		this.level = level;
		this.levelState = new _levelState(level);
		this.solutions = [];
		this.emitterArray2 = [];
		this.positionArray = [];
		this.positionCombinationPermutations = [];
	}
	loadLevelStateFromLevel(level) {
		this.levelState.squares.forEach((square) => square.button.remove());
		this.levelState.emitters.forEach((emitter) => emitter.button.remove());
		this.levelState = new _levelState(level);
	}
	editLevelStateFromLevel(level) {
		this.levelState.squares.forEach((square) => square.button.remove());
		this.levelState.emitters.forEach((emitter) => emitter.button.remove());
		
		this.levelState.name = level.name; //string
		this.levelState.nX = level.nX; //number
		this.levelState.nY = level.nY; //number
		this.levelState.nLeft = level.nLeft; //number
		this.levelState.nBoth = level.nBoth; //number
		this.levelState.nRight = level.nRight; //number
		this.levelState.grid = level.grid; //bool[]
		
		for (let i=0; i<this.levelState.squares.length; i++) {
			//this.squares[i] = new _square(this.grid[i],i,this.nX,this.nY);
			
			this.levelState.squares[i].active = level.grid[i]; //bool
			//this.levelState.squares[i].position = position; //squares index
			//this.levelState.squares[i].nX = level.nX;
			//this.levelState.squares[i].nY = level.nY;
			this.levelState.squares[i].value = 0;
			this.levelState.squares[i].row = false;
			this.levelState.squares[i].column = false;
			this.levelState.squares[i].direction = null;
			this.levelState.squares[i].facing = null;
		}
		for (let i=0; i<this.levelState.emitters.length; i++) {
			let active = false;
			let position = i;
			let nX = this.nX;
			let nY = this.nY;
			let facing = i < nX ? "S" : i < nX + nY ? "W" : i < 2 * nX + nY ? "N" : "E";
			let direction = null;
			let length = 0;
			//this.emitters[i] = new _emitter(active,position,nX,nY,facing,direction,length);
			
			this.levelState.emitters[i].active = active; //bool
			this.levelState.emitters[i].position = position; //emitters index
			this.levelState.emitters[i].nX = nX;
			this.levelState.emitters[i].nY = nY;
			this.levelState.emitters[i].facing = facing; //S W N E
			this.levelState.emitters[i].direction = direction; //L R B
			this.levelState.emitters[i].length = length; //number
		}
		this.currentDirection = "L";
		this.activeEmitters = [];
		this.score = 0;
		
	}
	solve() {
		this.loadLevelStateFromLevel(game.level);
		let nSolutions = 0;
		let solutions = this.solutions;
		solutions.length = 0;
		
		//Emitter Permutations
		let emitterArray2 = this.emitterArray2;
		emitterArray2.length = this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight;
		let nLeft = 0;
		let nBoth = 0;
		let nRight = 0;
		for (let i=0; i<emitterArray2.length; i++) {
			if (nLeft < this.levelState.nLeft) {
				emitterArray2[i] = "L";
				nLeft++;
			} else if (nBoth < this.levelState.nBoth) {
				emitterArray2[i] = "B";
				nBoth++;
			} else if (nRight < this.levelState.nRight) {
				emitterArray2[i] = "R";
				nRight++;
			} else {
				emitterArray2[i] = "N";
			}
		}
		let emitterPermutations = getUniquePermutations(emitterArray2);
		//let emitterPermutations = permutator(emitterArray2);
		
		//Position Combinations
		let positions = new Array(this.levelState.emitters.length);
		for (let i=0; i<positions.length; i++) {positions[i] = i;}
		let positionCombinations = combinations(positions,this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight);
		
		//Position Combination Permutations
		let positionCombinationPermutations = this.positionCombinationPermutations;
		for (let i=0; i<positionCombinations.length; i++) {
			let combination = positionCombinations[i];
			let permutations = getUniquePermutations(combination);
			for (let j=0; j<permutations.length; j++) {
				positionCombinationPermutations.push(permutations[j]);
			}
		}
		
		//Information
		let nEmitterPermutations = emitterPermutations.length;
		let nPositionCombinations = positionCombinations.length;
		let nAttempts = nEmitterPermutations * nPositionCombinations;
		let nAttempt = 0;
		let nSubAttempt = 0;
		console.log("EmitterPermutations: " + nEmitterPermutations + ", PositionCombinations: " + nPositionCombinations + ", Attempts: " + nAttempts + ", FindLevelAttempts: " + findLevelAttempts);
		let then = performance.now();
		
		//Technically solvable if no squares are active
		if (this.checkSolved()) {nSolutions++;}
		
		//Iterate over active non entry point squares, no solution if all surrounding squares are inactive
		let nX = this.levelState.nX;
		let nY = this.levelState.nY;
		let unsolvable = false;
		for (let i=1; i<this.levelState.nX-1; i++) {
			for (let j=1; j<this.levelState.nY-1; j++) {
				let gridXY = {x: i, y: j};
				let squarePosition = gridXYToSquarePosition(gridXY, nX, nY);
				let square = this.levelState.squares[squarePosition];
				if (!square.active) {continue;}
				let southXY = {x: i, y: j + 1};
				let northXY = {x: i, y: j - 1};
				let westXY = {x: i - 1, y: j};
				let eastXY = {x: i + 1, y: j};
				let southSquarePosition = gridXYToSquarePosition(southXY, nX, nY);
				let northSquarePosition = gridXYToSquarePosition(northXY, nX, nY);
				let westSquarePosition = gridXYToSquarePosition(westXY, nX, nY);
				let eastSquarePosition = gridXYToSquarePosition(eastXY, nX, nY);
				let southSquare = this.levelState.squares[southSquarePosition];
				let northSquare = this.levelState.squares[northSquarePosition];
				let westSquare = this.levelState.squares[westSquarePosition];
				let eastSquare = this.levelState.squares[eastSquarePosition];
				if (!southSquare.active && !northSquare.active && !westSquare.active && !eastSquare.active) {
					unsolvable = true;
				}
			}
		}
		
		//Iterate over EmitterPermutations x positionCombinationPermutations
		if (!unsolvable) {
		for (let i=0; i<positionCombinationPermutations.length; i++) {
			let positions = positionCombinationPermutations[i];
			for (let j=0; j<emitterPermutations.length; j++) {
				let emitters = emitterPermutations[j];
				for (let k=0; k<positions.length; k++) {
					let position = positions[k];
					let emitter = emitters[k];
					this.levelState.addEmitter(position, emitter);
					nSubAttempt++;
					if (this.checkSolved()) {nSolutions++; solutions.push({positions, emitters, nSubAttempt})}
				}
				//Information
				nAttempt++;
				if (nAttempt % 100000 == 0) {
					//console.log("Attempt: " + nAttempt + "/" + nAttempts);
				}
				//Reset Level for next attempt
				this.levelState.activeEmitters = [];
				this.levelState.castBeams();
			}
		}
		}
		
		//Information
		let now = performance.now();
		let elapsed = now - then;
		console.log("nSolutions: " + nSolutions + " calculated in " + elapsed + "ms");
		if (solutions.length > 0) {console.log(solutions);}
		this.levelState.emitters.forEach((emitter) => {emitter.direction = null;});
	}
	solvable() {
		this.loadLevelStateFromLevel(this.level);
		let nSolutions = 0;
		let solutions = [];
		
		//Emitter Permutations
		let emitterArray2 = new Array(this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight)
		let nLeft = 0;
		let nBoth = 0;
		let nRight = 0;
		for (let i=0; i<emitterArray2.length; i++) {
			if (nLeft < this.levelState.nLeft) {
				emitterArray2[i] = "L";
				nLeft++;
			} else if (nBoth < this.levelState.nBoth) {
				emitterArray2[i] = "B";
				nBoth++;
			} else if (nRight < this.levelState.nRight) {
				emitterArray2[i] = "R";
				nRight++;
			} else {
				emitterArray2[i] = "N";
			}
		}
		let emitterPermutations = getUniquePermutations(emitterArray2);
		//let emitterPermutations = permutator(emitterArray2);
		
		//Position Combinations
		let positions = new Array(this.levelState.emitters.length);
		for (let i=0; i<positions.length; i++) {positions[i] = i;}
		let positionCombinations = combinations(positions,this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight)
		
		//Position Combination Permutations
		let positionCombinationPermutations = new Array();
		for (let i=0; i<positionCombinations.length; i++) {
			let combination = positionCombinations[i];
			let permutations = getUniquePermutations(combination);
			for (let j=0; j<permutations.length; j++) {
				positionCombinationPermutations.push(permutations[j]);
			}
		}
		
		//Information
		let nEmitterPermutations = emitterPermutations.length;
		let nPositionCombinations = positionCombinations.length;
		let nAttempts = nEmitterPermutations * nPositionCombinations;
		let nAttempt = 0;
		let nSubAttempt = 0;
		//console.log("EmitterPermutations: " + nEmitterPermutations + ", PositionCombinations: " + nPositionCombinations + ", Attempts: " + nAttempts + ", FindLevelAttempts: " + findLevelAttempts);
		let then = performance.now();
		
		//Technically solvable if no squares are active
		if (this.checkSolved()) {return true;}
		
		//Iterate over entry point squares, no solution if all are inactive
		let nX = this.levelState.nX;
		let nY = this.levelState.nY;
		let entryPointsInactive = 0;
		for (let i=0; i<nX-1; i++) {
			let squarePosition = i;
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		for (let i=0; i<nY-1; i++) {
			let gridXY = {x: (nX-1), y: i};
			let squarePosition = gridXYToSquarePosition(gridXY,nX,nY);
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		for (let i=0; i<nX-1; i++) {
			let gridXY = {x: (nX-1-i), y: (nY-1)};
			let squarePosition = gridXYToSquarePosition(gridXY,nX,nY);
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		for (let i=0; i<nY-1; i++) {
			let gridXY = {x: 0, y: (nY-1-i)};
			let squarePosition = gridXYToSquarePosition(gridXY,nX,nY);
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		if (entryPointsInactive == 2*nX+2*nY-4) {
			return false;
		}
		
		//Iterate over active non entry point squares, no solution if all surrounding squares are inactive
		for (let i=1; i<this.levelState.nX-1; i++) {
			for (let j=1; j<this.levelState.nY-1; j++) {
				let gridXY = {x: i, y: j};
				let squarePosition = gridXYToSquarePosition(gridXY, nX, nY);
				let square = this.levelState.squares[squarePosition];
				if (!square.active) {continue;}
				let southXY = {x: i, y: j + 1};
				let northXY = {x: i, y: j - 1};
				let westXY = {x: i - 1, y: j};
				let eastXY = {x: i + 1, y: j};
				let southSquarePosition = gridXYToSquarePosition(southXY, nX, nY);
				let northSquarePosition = gridXYToSquarePosition(northXY, nX, nY);
				let westSquarePosition = gridXYToSquarePosition(westXY, nX, nY);
				let eastSquarePosition = gridXYToSquarePosition(eastXY, nX, nY);
				let southSquare = this.levelState.squares[southSquarePosition];
				let northSquare = this.levelState.squares[northSquarePosition];
				let westSquare = this.levelState.squares[westSquarePosition];
				let eastSquare = this.levelState.squares[eastSquarePosition];
				if (!southSquare.active && !northSquare.active && !westSquare.active && !eastSquare.active) {
					return false;
				}
			}
		}
		
		//Iterate over EmitterPermutations x PositionCombinations
		for (let i=0; i<positionCombinationPermutations.length; i++) {
			let positions = positionCombinationPermutations[i];
			for (let j=0; j<emitterPermutations.length; j++) {
				let emitters = emitterPermutations[j];
				for (let k=0; k<positions.length; k++) {
					let position = positions[k];
					let emitter = emitters[k];
					this.levelState.addEmitter(position, emitter);
					nSubAttempt++;
					if (this.checkSolved()) {return true;}
				}
				//Information
				nAttempt++;
				if (nAttempt % 100000 == 0) {
					//console.log("Attempt: " + nAttempt + "/" + nAttempts);
				}
				//Reset Level for next attempt
				this.levelState.activeEmitters = [];
				this.levelState.castBeams();
			}
		}
		
		//Information
		let now = performance.now();
		let elapsed = now - then;
		//console.log("nSolutions: " + nSolutions + " calculated in " + elapsed + "ms");
		if (solutions.length > 0) {console.log(solutions);}
		this.levelState.emitters.forEach((emitter) => {emitter.direction = null;});
		return false;
	}
	solvableAllBeams() {
		this.loadLevelStateFromLevel(this.level);
		let nSolutions = 0;
		let solutions = [];
		
		//Emitter Permutations
		let emitterArray2 = new Array(this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight)
		let nLeft = 0;
		let nBoth = 0;
		let nRight = 0;
		for (let i=0; i<emitterArray2.length; i++) {
			if (nLeft < this.levelState.nLeft) {
				emitterArray2[i] = "L";
				nLeft++;
			} else if (nBoth < this.levelState.nBoth) {
				emitterArray2[i] = "B";
				nBoth++;
			} else if (nRight < this.levelState.nRight) {
				emitterArray2[i] = "R";
				nRight++;
			} else {
				emitterArray2[i] = "N";
			}
		}
		let emitterPermutations = getUniquePermutations(emitterArray2);
		//let emitterPermutations = permutator(emitterArray2);
		
		//Position Combinations
		let positions = new Array(this.levelState.emitters.length);
		for (let i=0; i<positions.length; i++) {positions[i] = i;}
		let positionCombinations = combinations(positions,this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight);
		
		//Position Combination Permutations
		let positionCombinationPermutations = new Array();
		for (let i=0; i<positionCombinations.length; i++) {
			let combination = positionCombinations[i];
			let permutations = getUniquePermutations(combination);
			for (let j=0; j<permutations.length; j++) {
				positionCombinationPermutations.push(permutations[j]);
			}
		}
		
		//Information
		let nEmitterPermutations = emitterPermutations.length;
		let nPositionCombinations = positionCombinations.length;
		let nAttempts = nEmitterPermutations * nPositionCombinations;
		let nAttempt = 0;
		let nSubAttempt = 0;
		//console.log("EmitterPermutations: " + nEmitterPermutations + ", PositionCombinations: " + nPositionCombinations + ", Attempts: " + nAttempts + ", FindLevelAttempts: " + findLevelAttempts);
		let then = performance.now();
		
		//Technically solvable if no squares are active
		if (this.checkSolved()) {return true;}
		
		//Iterate over position combination permutations, discard if contains opposing
		let nX = this.levelState.nX;
		let nY = this.levelState.nY;
		let positionCombinationPermutationsUnopposing = combinations(positionCombinationPermutations,this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight);
		for (let i=0; i<positionCombinationPermutationsUnopposing.length; i++) {
			let combination = positionCombinationPermutationsUnopposing[i];
			let opposing = false;
			for (let j=0; j<combination.length; j++) {
				let positionA = combination[j];
				for (let k=0; k<combination.length; k++) {
					let positionB = combination[k];
					if (positionA < nX && positionA + positionB == 2*nX+nY-1) {opposing = true; break;}
					if (positionB >= nX && positionA + positionB == 3*nX+2*nY-1) {opposing = true; break;}
				}
				if (opposing) {break;}
			}
			if (opposing) {
				positionCombinationPermutationsUnopposing.splice(i,1);
				i--;
			}
		}
		//console.log(positionCombinations);
		//console.log(positionCombinationsUnopposing);
		
		//Iterate over entry point squares, no solution if active entry points less than nBeams
		let entryPointsInactive = 0;
		for (let i=0; i<nX-1; i++) {
			let squarePosition = i;
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		for (let i=0; i<nY-1; i++) {
			let gridXY = {x: (nX-1), y: i};
			let squarePosition = gridXYToSquarePosition(gridXY,nX,nY);
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		for (let i=0; i<nX-1; i++) {
			let gridXY = {x: (nX-1-i), y: (nY-1)};
			let squarePosition = gridXYToSquarePosition(gridXY,nX,nY);
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		for (let i=0; i<nY-1; i++) {
			let gridXY = {x: 0, y: (nY-1-i)};
			let squarePosition = gridXYToSquarePosition(gridXY,nX,nY);
			let square = this.levelState.squares[squarePosition];
			entryPointsInactive += !square.active ? 1 : 0;
		}
		let entryPointsActive = 2*nX+2*nY-4 - entryPointsInactive;
		let nBeams = this.levelState.nLeft + this.levelState.nBoth + this.levelState.nRight;
		if (entryPointsActive < nBeams) {
			return false;
		}
		
		//Iterate over active non entry point squares, no solution if all surrounding squares are inactive
		for (let i=1; i<this.levelState.nX-1; i++) {
			for (let j=1; j<this.levelState.nY-1; j++) {
				let gridXY = {x: i, y: j};
				let squarePosition = gridXYToSquarePosition(gridXY, nX, nY);
				let square = this.levelState.squares[squarePosition];
				if (!square.active) {continue;}
				let southXY = {x: i, y: j + 1};
				let northXY = {x: i, y: j - 1};
				let westXY = {x: i - 1, y: j};
				let eastXY = {x: i + 1, y: j};
				let southSquarePosition = gridXYToSquarePosition(southXY, nX, nY);
				let northSquarePosition = gridXYToSquarePosition(northXY, nX, nY);
				let westSquarePosition = gridXYToSquarePosition(westXY, nX, nY);
				let eastSquarePosition = gridXYToSquarePosition(eastXY, nX, nY);
				let southSquare = this.levelState.squares[southSquarePosition];
				let northSquare = this.levelState.squares[northSquarePosition];
				let westSquare = this.levelState.squares[westSquarePosition];
				let eastSquare = this.levelState.squares[eastSquarePosition];
				if (!southSquare.active && !northSquare.active && !westSquare.active && !eastSquare.active) {
					return false;
				}
			}
		}
		
		//Iterate over EmitterPermutations x PositionCombinations
		for (let i=0; i<positionCombinationPermutationsUnopposing.length; i++) {
			let positions = positionCombinationPermutationsUnopposing[i];
			for (let j=0; j<emitterPermutations.length; j++) {
				let emitters = emitterPermutations[j];
				for (let k=0; k<positions.length; k++) {
					let position = positions[k];
					let emitter = emitters[k];
					this.levelState.addEmitter(position, emitter);
					nSubAttempt++;
					if (this.checkSolved()) {return true;}
				}
				//Information
				nAttempt++;
				if (nAttempt % 100000 == 0) {
					//console.log("Attempt: " + nAttempt + "/" + nAttempts);
				}
				//Reset Level for next attempt
				this.levelState.activeEmitters = [];
				this.levelState.castBeams();
			}
		}
		
		//Information
		let now = performance.now();
		let elapsed = now - then;
		//console.log("nSolutions: " + nSolutions + " calculated in " + elapsed + "ms");
		if (solutions.length > 0) {console.log(solutions);}
		this.levelState.emitters.forEach((emitter) => {emitter.direction = null;})
		return false;
	}
	checkSolved() {
		let solved = true;
		let score = 0;
		for (let i=0; i<this.levelState.squares.length; i++) {
			let square = this.levelState.squares[i];
			if (!square.active) {continue;}
			solved = solved && square.value > 0;
			score += square.value;
		}
		return solved;
	}
	solveResults() {
		let then = performance.now();
		let nX = this.levelState.nX;
		let nY = this.levelState.nY
		let results = [0,0];
		let nAttempts = Math.pow(2,nX*nY);
		for (let i=0; i<Math.pow(2,nX*nY); i++) {
			editLevelInt(this.level,i);
			this.editLevelStateFromLevel(this.level);
			//this.loadLevelStateFromLevel(this.level);
			let solvable = this.solvable();
			if (solvable) {results[1]++;} else {results[0]++;}
			console.log(i+1 + "/" + nAttempts);
		}
		console.log(results);
		let now = performance.now();
		let elapsed = now - then;
		console.log(elapsed + "ms");
	}
	findSolvable() {
		findLevelInfo.info = "Finding...";
		let then = performance.now();
		let nX = this.levelState.nX;
		let nY = this.levelState.nY;
		for (let i=0; i<findLevelAttempts; i++) {
			findLevelAttempt = i+1;
			let now = performance.now();
			let elapsed = now - then;
			let attemptRate = i * 1000 / elapsed; //s
			findLevelRate = attemptRate.toFixed(1);
			console.log("Attempt " + (i+1) + "/" + findLevelAttempts + ", " + attemptRate.toFixed(1) + " attempts/s");
			editLevelRandom(this.level);
			this.editLevelStateFromLevel(this.level);
			let solvable = this.solvable();
			if (solvable) {
				console.log("Solvable");
				findLevelInfo.info = "Solvable. Attempt: " + findLevelAttempt + "/" + findLevelAttempts + " " + findLevelRate + " attempts/s";
				this.loadLevelStateFromLevel(this.level);
				return;
			}
		}
		findLevelInfo.info = "Unsolvable. Attempt: " + findLevelAttempt + "/" + findLevelAttempts + " " + findLevelRate + " attempts/s";
		console.log("Unsolvable");
	}
	findSolvableAllBeams() {
		let then = performance.now();
		let nX = this.levelState.nX;
		let nY = this.levelState.nY;
		for (let i=0; i<findLevelAttempts; i++) {
			findLevelAttempt = i+1;
			let now = performance.now();
			let elapsed = now - then;
			let attemptRate = i * 1000 / elapsed; //s
			findLevelRate = attemptRate.toFixed(1);
			console.log("Attempt " + (i+1) + "/" + findLevelAttempts + ", " + attemptRate.toFixed(1) + " attempts/s");
			editLevelRandom(this.level);
			this.editLevelStateFromLevel(this.level);
			let solvable = this.solvableAllBeams();
			if (solvable) {
				console.log("Solvable");
				findLevelInfo.info = "Solvable. Attempt: " + findLevelAttempt + "/" + findLevelAttempts + " " + findLevelRate + " attempts/s";
				this.loadLevelStateFromLevel(this.level);
				return;
			}
		}
		console.log("Unsolvable");
		findLevelInfo.info = "Unsolvable. Attempt: " + findLevelAttempt + "/" + findLevelAttempts + " " + findLevelRate + " attempts/s";
	}
	levelCode() {
		let name = this.levelState.name;
		let nX = this.levelState.nX;
		let nY = this.levelState.nY;
		let nLeft = this.levelState.nLeft;
		let nBoth = this.levelState.nBoth;
		let nRight = this.levelState.nRight;
		let grid = this.levelState.grid;
		let nGridInts = Math.ceil(grid.length/8);
		const levelCodeArray = new Uint8Array(3+2+3+nGridInts);
		levelCodeArray[0] = name.charCodeAt(0);
		levelCodeArray[1] = name.charCodeAt(1);
		levelCodeArray[2] = name.charCodeAt(2);
		levelCodeArray[3] = nX;
		levelCodeArray[4] = nY;
		levelCodeArray[5] = nLeft;
		levelCodeArray[6] = nBoth;
		levelCodeArray[7] = nRight;
		for (let i=0; i<nGridInts; i++) {
			let gridInt = 0;
			gridInt += grid[8*i+0] ? Math.pow(2,7) : 0;
			gridInt += grid[8*i+1] ? Math.pow(2,6) : 0;
			gridInt += grid[8*i+2] ? Math.pow(2,5) : 0;
			gridInt += grid[8*i+3] ? Math.pow(2,4) : 0;
			gridInt += grid[8*i+4] ? Math.pow(2,3) : 0;
			gridInt += grid[8*i+5] ? Math.pow(2,2) : 0;
			gridInt += grid[8*i+6] ? Math.pow(2,1) : 0;
			gridInt += grid[8*i+7] ? Math.pow(2,0) : 0;
			levelCodeArray[8+i] = gridInt;
		}
		console.log(levelCodeArray);
		let levelCode = levelCodeArray.toBase64({alphabet:"base64url"});
		console.log(levelCode);
		return levelCode;
	}
	loadLevelCode(code) {
		let levelCodeArray = Uint8Array.fromBase64(code, {alphabet:"base64url"})
		console.log(levelCodeArray);
		let name = String.fromCharCode(levelCodeArray[0], levelCodeArray[1], levelCodeArray[2]);
		let nX = levelCodeArray[3];
		let nY = levelCodeArray[4];
		let nLeft = levelCodeArray[5];
		let nBoth = levelCodeArray[6];
		let nRight = levelCodeArray[7];
		let grid = [];
		let nGridInts = Math.ceil(nX*nY/8);
		for (let i=0;i<nGridInts;i++) {
			let integer = levelCodeArray[8+i];
			grid.push((integer & (1 << 7)) != 0);
			grid.push((integer & (1 << 6)) != 0);
			grid.push((integer & (1 << 5)) != 0);
			grid.push((integer & (1 << 4)) != 0);
			grid.push((integer & (1 << 3)) != 0);
			grid.push((integer & (1 << 2)) != 0);
			grid.push((integer & (1 << 1)) != 0);
			grid.push((integer & (1 << 0)) != 0);
		}
		game.level.name = name;
		game.level.nX = nX;
		game.level.nY = nY;
		game.level.nLeft = nLeft;
		game.level.nBoth = nBoth;
		game.level.nRight = nRight;
		game.level.grid = grid;
		this.loadLevelStateFromLevel(game.level);
	}
}

class _level {
	constructor(name,nX,nY,nLeft,nBoth,nRight,grid) {
		this.name = name; //string
		this.nX = nX; //number
		this.nY = nY; //number
		this.nLeft = nLeft; //number
		this.nBoth = nBoth; //number
		this.nRight = nRight; //number
		this.grid = grid; //bool[]
		this.uid = Math.random();
	}
}

class _levelState extends _level {
	constructor(level,squares,emitters) {
		super();
		this.name = level.name;
		this.nX = level.nX;
		this.nY = level.nY;
		this.nLeft = level.nLeft;
		this.nBoth = level.nBoth;
		this.nRight = level.nRight;
		this.grid = level.grid;
		
		//levelState Specific
		this.squares = new Array(this.nX*this.nY);
		for (let i=0; i<this.squares.length; i++) {this.squares[i] = new _square(this.grid[i],i,this.nX,this.nY);}
		this.emitters = new Array(2*this.nX+2*this.nY);
		for (let i=0; i<this.emitters.length; i++) {
			let active = false;
			let position = i;
			let nX = this.nX;
			let nY = this.nY;
			let facing = i < this.nX ? "S" : i < this.nX + this.nY ? "W" : i < 2 * this.nX + this.nY ? "N" : "E";
			let direction = null;
			let length = 0;
			this.emitters[i] = new _emitter(active,position,nX,nY,facing,direction,length);
		}
		this.currentDirection = "L";
		this.activeEmitters = [];
		this.score = 0;
	}
	currentNDirection(direction) {
		let n = 0;
		this.activeEmitters.forEach((emitter) => {n += emitter.direction == direction ? 1 : 0;})
		return n;
	}
	addEmitter(position, direction) {
		let facing = position < this.nX ? "S" : position < this.nX + this.nY ? "W" : position < 2*this.nX + this.nY ? "N" : "E";
		
		//Remove emitter if already exists at position, then cast beams, then return
		let existing = this.activeEmitters.find((emitter) => emitter.position == position);
		if (existing != null) {
			let index = this.activeEmitters.findIndex((emitter) => emitter.position == position);
			existing.direction = null;
			this.activeEmitters.splice(index,1);
			this.castBeams();
			return;
		}
		
		//Return if entry square is inactive
		let gridXY = emitterPositionToGridXY(position, this.nX, this.nY);
		let squarePosition = gridXYToSquarePosition(gridXY, this.nX, this.nY);
		if (!this.squares[squarePosition].active) {return;}
		
		//Return if currentNDirection >= nDirection
		if (direction == "L" && this.currentNDirection("L") >= this.nLeft) {return;}
		if (direction == "B" && this.currentNDirection("B") >= this.nBoth) {return;}
		if (direction == "R" && this.currentNDirection("R") >= this.nRight) {return;}
		
		//Return if entry square is perpendicular beam
		if (this.squares[squarePosition].row && (facing == "S" || facing == "N")) {return;}
		if (this.squares[squarePosition].column && (facing == "W" || facing == "E")) {return;}
		
		//Remove opposing emitter if entry square is parallel beam
		let removeOpposing = false;
		if (this.squares[squarePosition].column && (facing == "S" || facing == "N")) {removeOpposing = true;}
		if (this.squares[squarePosition].row && (facing == "W" || facing == "E")) {removeOpposing = true;}
		if (removeOpposing) {
			let opposingPosition = opposingEmitterPositionFromEmitterPosition(position, this.nX, this.nY);
			
			//let opposing = this.activeEmitters.find((emitter) => emitter.positon == opposingPosition);
			let opposing;
			for (let i=0; i<game.levelState.activeEmitters.length; i++) {
				let emitter = game.levelState.activeEmitters[i];
				if (emitter.position == opposingPosition) {opposing = emitter; break;}
			}
			
			opposing.direction = null;
			let index = this.activeEmitters.findIndex((emitter) => emitter.position == opposingPosition);
			this.activeEmitters.splice(index,1);
		}
		
		//Add emitter to activeEmitters
		this.emitters[position].direction = direction;
		this.activeEmitters.push(this.emitters[position]);
		
		//Cast Beams
		this.castBeams();
	}
	setCurrentDirection(direction) {
		if (direction=="L"||direction=="B"||direction=="R") {this.currentDirection = direction;}
	}
	castBeams() {
		//Reset Squares
		this.squares.forEach((square) => {
			square.value = 0;
			square.row = false;
			square.column = false;
			square.facing = null;
			square.direction = null;
		})
		//Reset Emitter Length
		this.emitters.forEach((emitter) => {
			emitter.length = 0;
		})
		//Iterate over active emitters
		this.activeEmitters.forEach((emitter) => {
			//let emitter = this.activeEmitters[j];
			//Get entry point
			let gridXY = emitterPositionToGridXY(emitter.position, this.nX, this.nY);
			let squarePosition = gridXYToSquarePosition(gridXY, this.nX, this.nY);
			let square = this.squares[squarePosition];
			//Add value, facing, direction, column/row to entry point
			square.value++;
			square.facing = squareFacingFromEmitterFacingAndDirection(emitter.facing, emitter.direction);
			square.direction = emitter.direction; //required for colouring only
			if (emitter.facing == "S" || emitter.facing == "N") {square.column = true;}
			if (emitter.facing == "W" || emitter.facing == "E") {square.row = true;}
			//Find next squares
			for (let i=0; i<Math.max(this.nX,this.nY); i++) {
				gridXY = nextGridXYInFacing(gridXY, emitter.facing, this.nX, this.nY);
				if (gridXY == null) {break;}
				squarePosition = gridXYToSquarePosition(gridXY, this.nX, this.nY);
				square = this.squares[squarePosition];
				//Break if square is inactive
				if (!square.active) {break;}
				//Break if square is perpendicular beam
				if (square.row && (emitter.facing == "S" || emitter.facing == "N")) {return;}
				if (square.column && (emitter.facing == "W" || emitter.facing == "E")) {return;}
				//Add value, direction, column/row to square
				square.value++;
				square.facing = squareFacingFromEmitterFacingAndDirection(emitter.facing, emitter.direction);
				square.direction = emitter.direction; //required for colouring only
				if (emitter.facing == "S" || emitter.facing == "N") {square.column = true;}
				if (emitter.facing == "W" || emitter.facing == "E") {square.row = true;}
				emitter.length = i+2;
			}
		});
		//Remove opposing emitters with maximum length (HOT GARBAGE)
		/*let positions = [];
		let opposingPositions = [];
		let killList = [];
		this.activeEmitters.forEach((emitter) => {
			positions.push(emitter.position);
			opposingPositions.push(opposingEmitterPositionFromEmitterPosition(emitter.position,this.nX,this.nY));
		})
		for (let i=0; i<positions.length; i++) {
			let position = positions[i];
			let emitter = this.activeEmitters[i];
			if ((emitter.facing == "S" || emitter.facing == "N") && emitter.length == this.nY && opposingPositions.includes(emitter.position)) {
				if (!killList.includes(emitter.position)) {killList.push(opposingPositions[i]);}
			}
			if ((emitter.facing == "W" || emitter.facing == "E") && emitter.length == this.nX && opposingPositions.includes(emitter.position)) {
				if (!killList.includes(emitter.position)) {killList.push(opposingPositions[i]);}
			}
		}
		for (let i=0; i<killList.length; i++) {
			let index = this.activeEmitters.findIndex((emitter) => emitter.position == killList[i]);
			this.activeEmitters[index].direction == null;
			this.activeEmitters.splice(index, 1);
			if (i == killList.length-1) {
				this.squares.forEach((square) => {
					//if (!square.column && !square.row) {square.value = 0;}
					square.value = 0;
				});
				this.castBeams();
				this.castBeams();
			}
		}*/
		this.castRays();
	}
	castRays() {
		//Iterate over squares
		for (let n=0; n<this.squares.length; n++) {
			let square = this.squares[n];
			//Continue if square is not column/row
			if (!square.row && !square.column) {continue;}
			//Get gridXY
			let gridXY = squarePositionToGridXY(square.position, this.nX, this.nY);
			//Find next squares
			let facing = square.facing;
			
			//If single facing
			if (facing == "S" || facing == "W" || facing == "N" || facing == "E") {
				for (let i=0; i<Math.max(this.nX,this.nY); i++) {
					gridXY = nextGridXYInFacing(gridXY,facing,this.nX,this.nY);
					if (gridXY == null) {break;}
					let squarePosition = gridXYToSquarePosition(gridXY,this.nX,this.nY);
					let square = this.squares[squarePosition];
					//Break if next square is inactive
					if (!square.active) {break;}
					//Add value to square
					square.value++
				}
			}
			//If dual facing
			if (facing == "V" || facing == "H") {
				let gridXYcopy = {x: gridXY.x, y: gridXY.y};
				//Face S/W first
				facing = facing == "V" ? "S" : "W";
				for (let i=0; i<Math.max(this.nX,this.nY); i++) {
					gridXY = nextGridXYInFacing(gridXY,facing,this.nX,this.nY);
					//Break if next square is null
					if (gridXY == null) {break;}
					let squarePosition = gridXYToSquarePosition(gridXY,this.nX,this.nY);
					let square = this.squares[squarePosition];
					//Break if next square is inactive
					if (!square.active) {break;}
					//Add value to square
					square.value++
				}
				//Face N/E second
				gridXY = gridXYcopy;
				facing = facing == "S" ? "N" : "E";
				for (let i=0; i<Math.max(this.nX,this.nY); i++) {
					gridXY = nextGridXYInFacing(gridXY,facing,this.nX,this.nY);
					//Break if next square is null
					if (gridXY == null) {break;}
					let squarePosition = gridXYToSquarePosition(gridXY,this.nX,this.nY);
					let square = this.squares[squarePosition];
					//Break if next square is inactive
					if (!square.active) {break;}
					//Add value to square
					square.value++
				}
			}
		}
	}
}

class _emitter {
	constructor(active, position, nX, nY, facing, direction, length) {
		this.active = active; //bool
		this.position = position; //emitters index
		this.nX = nX;
		this.nY = nY;
		this.facing = facing; //S W N E
		this.direction = direction; //L R B
		this.length = length;
		this.button = document.createElement("button");
		this.button.onclick = this.click.bind(this);
		document.querySelector("#buttonArea").appendChild(this.button);
		
		this.button.style.position = "absolute";
		//let facing = positionA < this.nX ? "S" : position < this.nX + this.nY ? "W" : position < 2 * this.nX + this.nY ? "N" : "E";
		let x = 0;
		let y = 0;
		
		if (this.facing == "S") {
			x = (this.position + 1) / (this.nX + 2);
			y = 0;
		}
		if (this.facing == "W") {
			x = 1 - 1 / (this.nX + 2);
			y = (this.position - this.nX + 1) / (this.nY + 2);
		}
		if (this.facing == "N") {
			x = 1 - (this.position - this.nX - this.nY + 1) / (this.nX + 2) - 1 / (this.nX + 2);
			y = 1 - 1 / (this.nY + 2);
		}
		if (this.facing == "E") {
			x = 0;
			y = 1 - (this.position - 2*this.nX - this.nY + 1) / (this.nY + 2) - 1 / (this.nY + 2);
		}
		let w = 1 / (this.nX + 2);
		let h = 1 / (this.nY + 2);
		let buttonArea = document.querySelector("#buttonArea");
		let buttonAreaPosition = buttonArea.getBoundingClientRect();
		let buttonAreaX = buttonAreaPosition.left;
		let buttonAreaY = buttonAreaPosition.top;
		let buttonAreaWidth = document.querySelector("#buttonArea").clientWidth;
		let buttonAreaHeight = document.querySelector("#buttonArea").clientHeight;
		this.button.style.left = buttonAreaX + buttonAreaWidth * x + "px";
		this.button.style.top = buttonAreaY + buttonAreaHeight * y + "px";
		this.button.style.width = buttonAreaWidth * w + "px";
		this.button.style.height = buttonAreaHeight * h + "px";
		this.button.style.background = "#BBBBBB";
		this.button.innerText = "E" + this.position;
	}
	click() {
		game.levelState.addEmitter(this.position, game.levelState.currentDirection);
		buttonTextIsValue();
	}
}

class _square {
	constructor(active, position, nX, nY) {
		this.active = active; //bool
		this.position = position; //squares index
		this.nX = nX;
		this.nY = nY;
		this.value = 0;
		this.row = false;
		this.column = false;
		this.direction = null;
		this.facing = null;
		this.button = document.createElement("button");
		this.button.onclick = this.click.bind(this);
		document.querySelector("#buttonArea").appendChild(this.button);
		
		this.button.style.position = "absolute";
		let x = this.position % this.nX / (this.nX + 2) + 1 / (this.nX + 2);
		let y = Math.floor(this.position / this.nX) / (this.nY+2) + 1 / (this.nY + 2);
		let w = 1 / (this.nX + 2);
		let h = 1 / (this.nY + 2);
		let buttonArea = document.querySelector("#buttonArea");
		let buttonAreaPosition = buttonArea.getBoundingClientRect();
		let buttonAreaX = buttonAreaPosition.left;
		let buttonAreaY = buttonAreaPosition.top;
		let buttonAreaWidth = document.querySelector("#buttonArea").clientWidth;
		let buttonAreaHeight = document.querySelector("#buttonArea").clientHeight;
		this.button.style.left = buttonAreaX + buttonAreaWidth * x + "px";
		this.button.style.top = buttonAreaY + buttonAreaHeight * y + "px";
		this.button.style.width = buttonAreaWidth * w + "px";
		this.button.style.height = buttonAreaHeight * h + "px";
		this.button.style.background = this.active ? "white" : "black";
		this.button.innerText = "S" + this.position;
	}
	click() {
		//Toggle square active
		this.active = !this.active;
		//Send to game
		game.level.grid[this.position] = this.active;
		game.levelState.grid[this.position] = this.active;
		//Reset game emitters/squares
		game.levelState.activeEmitters.length = 0;
		game.levelState.emitters.forEach((emitter) => {emitter.direction = null; emitter.length = 0;})
		game.levelState.squares.forEach((square) => {
			square.value = 0;
			square.row = false;
			square.column = false;
			square.facing = null;
			square.direction = null;
		})
		//Update visuals
		buttonTextIsValue();
	}
}

class _makeLevelInfo {
	constructor(name, nX, nY, nLeft, nBoth, nRight, fillChance) {
		this._name = name;
		this._nX = nX;
		this._nY = nY;
		this._nLeft = nLeft;
		this._nBoth = nBoth;
		this._nRight = nRight;
		this._fillChance = fillChance;
		this.infoText = document.querySelector("#makeLevelInfo");
		this.changeText();
	}
	changeText() {
		let nameText = 'Name: "' + this.name + '", ';
		let nXText = "nX: " + this.nX + ", ";
		let nYText = "nY: " + this.nY + ", ";
		let nLeftText = "nLeft: " + this.nLeft + ", ";
		let nBothText = "nBoth: " + this.nBoth + ", ";
		let nRightText = "nRight: " + this.nRight + ", ";
		let fillChanceText = "fillChance: " + this.fillChance.toFixed(1) + "";
		this.infoText.innerText = nameText + nXText + nYText + nLeftText + nBothText + nRightText + fillChanceText;
	}
	get name() {return this._name;}
	get nX() {return this._nX;}
	get nY() {return this._nY;}
	get nLeft() {return this._nLeft;}
	get nBoth() {return this._nBoth;}
	get nRight() {return this._nRight;}
	get fillChance() {return this._fillChance;}
	set name(value) {this._name = value; this.changeText();}
	set nX(value) {this._nX = value; this.changeText();}
	set nY(value) {this._nY = value; this.changeText();}
	set nLeft(value) {this._nLeft = value; this.changeText();}
	set nBoth(value) {this._nBoth = value; this.changeText();}
	set nRight(value) {this._nRight = value; this.changeText();}
	set fillChance(value) {this._fillChance = value; this.changeText();}
}

class _findLevelInfo {
	constructor(info) {
		this._info = info;
		this.infoText = document.querySelector("#findLevelInfo");
		this.changeText();
	}
	changeText() {
		this.infoText.innerText = this.info;
	}
	get info() {return this._info;}
	set info(value) {this._info = value; this.changeText();}
}

var makeLevelInfo = new _makeLevelInfo("APR", 5, 5, 1, 0, 1, 0.5);
var findLevelInfo = new _findLevelInfo("Press F to Find");

function main() {
	document.title = "TIC-JS";
	const urlParams = new URLSearchParams(window.location.search);
	let level = makeLevel();
	game = new _game(level);
	if (urlParams.has("levelCode")) {
		game.loadLevelCode(urlParams.get("levelCode"));
	}
}

function makeLevel() {
	let name = makeLevelInfo.name;
	let nX = makeLevelInfo.nX;
	let nY = makeLevelInfo.nY;
	let nLeft = makeLevelInfo.nLeft;
	let nBoth = makeLevelInfo.nBoth;
	let nRight = makeLevelInfo.nRight;
	let grid = new Array(nX*nY);
	for (let i=0; i<grid.length; i++) {grid[i] = Math.random() < makeLevelInfo.fillChance ? true : false;}
	return new _level(name,nX,nY,nLeft,nBoth,nRight,grid);
}

function makeLevelN(n) {
	let name = "A00";
	let nX = n;
	let nY = n;
	let nLeft = 1;
	let nBoth = 1;
	let nRight = 1;
	let grid = new Array(nX*nY);
	for (let i=0; i<grid.length; i++) {grid[i] = Math.random() > 0.5 ? true : false;}
	return new _level(name,nX,nY,nLeft,nBoth,nRight,grid);
}

function makeLevelXY(name,nX,nY,nLeft,nBoth,nRight,fillChance) {
	let _name = name;
	let _nX = nX;
	let _nY = nY;
	let _nLeft = nLeft;
	let _nBoth = nBoth;
	let _nRight = nRight;
	let grid = new Array(nX*nY);
	for (let i=0; i<grid.length; i++) {grid[i] = Math.random() < fillChance ? true : false;}
	return new _level(_name,_nX,_nY,_nLeft,_nBoth,_nRight,grid);
}

function makeLevelFromForm() {
	let name = document.querySelector("#nameInput").value;
	let nX = document.querySelector("#nXInput").valueAsNumber;
	let nY = document.querySelector("#nYInput").valueAsNumber;
	let nLeft = document.querySelector("#nLeftInput").valueAsNumber;
	let nBoth = document.querySelector("#nBothInput").valueAsNumber;
	let nRight = document.querySelector("#nRightInput").valueAsNumber;
	let fillChance = document.querySelector("#fillChanceInput").valueAsNumber;
	game.level = makeLevelXY(name,nX,nY,nLeft,nBoth,nRight,fillChance);
	game.loadLevelStateFromLevel(game.level);
}

function makeLevelInt(integer) {
	let name = "A00";
	let nX = 4;
	let nY = 4;
	let nLeft = 1;
	let nBoth = 1;
	let nRight = 1;
	let grid = new Array(nX*nY);
	for (let i=0; i<grid.length; i++) {
		grid[i] = getBit(integer,i);
	}
	return new _level(name,nX,nY,nLeft,nBoth,nRight,grid);
}

function editLevelInt(level, integer) {
	for (let i=0; i<level.grid.length; i++) {
		level.grid[i] = getBit(integer,i);
	}
	return level;
}

function editLevelRandom(level) {
	for (let i=0; i<level.grid.length; i++) {
		level.grid[i] = Math.random() > 0.5 ? true : false;
	}
}

function getBit(number, bitPosition) {
  // Left shift 1 by bitPosition to create a mask with a 1 at the desired position
  const mask = 1 << bitPosition;
  // Perform bitwise AND. If the result is non-zero, the bit is set.
  return (number & mask) !== 0 ? 1 : 0;
}

function emitterPositionToGridXY(position,nX,nY) {
	let facing = position < nX ? "S" : position < nX + nY ? "W" : position < 2 * nX + nY ? "N" : "E";
	let gridX = 0;
	let gridY = 0;
	if (facing=="S") {gridX = position; gridY = 0;}
	if (facing=="W") {gridX = nX - 1; gridY = position - nX;}
	if (facing=="N") {gridX = 2 * nX + nY - position - 1; gridY = nY - 1;}
	if (facing=="E") {gridX = 0; gridY = 2 * nX + 2 * nY - position - 1;}
	return {x: gridX, y: gridY}
}

function squarePositionToGridXY(position,nX,nY) {
	let x = position % nX;
	let y = Math.floor(position / nX);
	return {x: x, y: y};
}

function gridXYToSquarePosition(gridXY,nX,nY) {
	let x = gridXY.x;
	let y = gridXY.y;
	return x + nX * y;
}

function opposingEmitterPositionFromEmitterPosition(positionA,nX,nY) {
	let facing = positionA < nX ? "S" : positionA < nX + nY ? "W" : positionA < 2 * nX + nY ? "N" : "E";
	let positionB = 0;
	if (facing == "S") {positionB = 2 * nX + nY - positionA - 1;}
	if (facing == "W") {positionB = 3 * nX + 2 * nY - positionA - 1;}
	if (facing == "N") {positionB = 2 * nX + nY - positionA - 1;}
	if (facing == "E") {positionB = 3 * nX + 2 * nY - positionA - 1;}
	return positionB;
}

function nextGridXYInFacing(currentGridXY, facing, nX, nY) {
	let x = currentGridXY.x;
	let y = currentGridXY.y;
	let next = {x: 0, y: 0};
	if (facing == "S") {next = {x: x, y: y + 1}}
	if (facing == "W") {next = {x: x - 1, y: y}}
	if (facing == "N") {next = {x: x, y: y - 1}}
	if (facing == "E") {next = {x: x + 1, y: y}}
	if (next.x >= nX || next.x < 0 || next.y >= nY || next.y < 0) {return null;}
	return next;
}

function squareFacingFromEmitterFacingAndDirection(eFacing, eDirection) {
	if (eFacing == "S") {
		if (eDirection == "L") {return "E";}
		if (eDirection == "B") {return "H";}
		if (eDirection == "R") {return "W";}
	}
	if (eFacing == "W") {
		if (eDirection == "L") {return "S";}
		if (eDirection == "B") {return "V";}
		if (eDirection == "R") {return "N";}
	}
	if (eFacing == "N") {
		if (eDirection == "L") {return "W";}
		if (eDirection == "B") {return "H";}
		if (eDirection == "R") {return "E";}
	}
	if (eFacing == "E") {
		if (eDirection == "L") {return "N";}
		if (eDirection == "B") {return "V";}
		if (eDirection == "R") {return "S";}
	}
}

function buttonTextIsValue() {
	for (let i=0; i<game.levelState.squares.length; i++) {
		let square = game.levelState.squares[i];
		square.button.innerText = square.value;
		let backgroundColor = "white";
		if (square.direction == "L") {backgroundColor = "hsla(240,75%,75%,100%)";}
		if (square.direction == "B") {backgroundColor = "hsla(120,75%,75%,100%)";}
		if (square.direction == "R") {backgroundColor = "hsla(60,75%,75%,100%)";}
		if (!square.active) {backgroundColor = "black";}
		square.button.style.background = backgroundColor;
	}
	for (let i=0; i<game.levelState.emitters.length; i++) {
		let emitter = game.levelState.emitters[i];
		let backgroundColor = "hsla(0,0%,50%,50%)";
		if (emitter.direction == "L") {backgroundColor = "hsla(240,75%,75%,100%)";}
		if (emitter.direction == "B") {backgroundColor = "hsla(120,75%,75%,100%)";}
		if (emitter.direction == "R") {backgroundColor = "hsla(60,75%,75%,100%)";}
		emitter.button.style.background = backgroundColor;
	}
}

window.onload = main();

window.addEventListener("keydown", (e) => {
	if (e.key == "z" && !e.ctrlKey && !e.shiftKey) {game.levelState.setCurrentDirection("L");}
	if (e.key == "x" && !e.ctrlKey && !e.shiftKey) {game.levelState.setCurrentDirection("B");}
	if (e.key == "c" && !e.ctrlKey && !e.shiftKey) {game.levelState.setCurrentDirection("R");}
	if (e.key == "s") {game.loadLevelStateFromLevel(game.level); game.solve();}
	if (e.key == "w") {game.loadLevelStateFromLevel(game.level); game.solvableAllBeams();}
	if (e.key == "r") {game.loadLevelStateFromLevel(makeLevel());}
	if (e.key == "m") {game.loadLevelStateFromLevel(makeLevelXY(makeLevelInfo.name,makeLevelInfo.nX,makeLevelInfo.nY,makeLevelInfo.nLeft,makeLevelInfo.nBoth,makeLevelInfo.nRight,makeLevelInfo.fillChance));}
	if (e.key == "a") {game.solveResults();}
	if (e.key == "f") {game.findSolvable();}
	if (e.key == "e") {game.findSolvableAllBeams();}
	if (e.key == "1") {game.level = makeLevelN(1); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "2") {game.level = makeLevelN(2); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "3") {game.level = makeLevelN(3); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "4") {game.level = makeLevelN(4); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "5") {game.level = makeLevelN(5); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "ArrowRight") {makeLevelInfo.nX++; game.level = makeLevelXY(makeLevelInfo.name,makeLevelInfo.nX,makeLevelInfo.nY,makeLevelInfo.nLeft,makeLevelInfo.nBoth,makeLevelInfo.nRight,makeLevelInfo.fillChance); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "ArrowLeft") {makeLevelInfo.nX--; game.level = makeLevelXY(makeLevelInfo.name,makeLevelInfo.nX,makeLevelInfo.nY,makeLevelInfo.nLeft,makeLevelInfo.nBoth,makeLevelInfo.nRight,makeLevelInfo.fillChance); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "ArrowUp") {makeLevelInfo.nY++; game.level = makeLevelXY(makeLevelInfo.name,makeLevelInfo.nX,makeLevelInfo.nY,makeLevelInfo.nLeft,makeLevelInfo.nBoth,makeLevelInfo.nRight,makeLevelInfo.fillChance); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "ArrowDown") {makeLevelInfo.nY--; game.level = makeLevelXY(makeLevelInfo.name,makeLevelInfo.nX,makeLevelInfo.nY,makeLevelInfo.nLeft,makeLevelInfo.nBoth,makeLevelInfo.nRight,makeLevelInfo.fillChance); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "z" && e.ctrlKey) {makeLevelInfo.nLeft--; game.level.nLeft--; game.loadLevelStateFromLevel(game.level); console.log("L" + game.level.nLeft + ", B" + game.level.nBoth + ", R" + game.level.nRight);}
	if (e.key == "x" && e.ctrlKey) {makeLevelInfo.nBoth--; game.level.nBoth--; game.loadLevelStateFromLevel(game.level); console.log("L" + game.level.nLeft + ", B" + game.level.nBoth + ", R" + game.level.nRight);}
	if (e.key == "c" && e.ctrlKey) {makeLevelInfo.nRight--; game.level.nRight--; game.loadLevelStateFromLevel(game.level); console.log("L" + game.level.nLeft + ", B" + game.level.nBoth + ", R" + game.level.nRight);}
	if (e.key == "Z" && e.shiftKey) {makeLevelInfo.nLeft++; game.level.nLeft++; game.loadLevelStateFromLevel(game.level); console.log("L" + game.level.nLeft + ", B" + game.level.nBoth + ", R" + game.level.nRight);}
	if (e.key == "X" && e.shiftKey) {makeLevelInfo.nBoth++; game.level.nBoth++; game.loadLevelStateFromLevel(game.level); console.log("L" + game.level.nLeft + ", B" + game.level.nBoth + ", R" + game.level.nRight);}
	if (e.key == "C" && e.shiftKey) {makeLevelInfo.nRight++; game.level.nRight++; game.loadLevelStateFromLevel(game.level); console.log("L" + game.level.nLeft + ", B" + game.level.nBoth + ", R" + game.level.nRight);}
	if (e.key == "v" && e.ctrlKey) {makeLevelInfo.fillChance -= 0.1; game.level = makeLevelXY(makeLevelInfo.name,makeLevelInfo.nX,makeLevelInfo.nY,makeLevelInfo.nLeft,makeLevelInfo.nBoth,makeLevelInfo.nRight,makeLevelInfo.fillChance); game.loadLevelStateFromLevel(game.level);}
	if (e.key == "V" && e.shiftKey) {makeLevelInfo.fillChance += 0.1; game.level = makeLevelXY(makeLevelInfo.name,makeLevelInfo.nX,makeLevelInfo.nY,makeLevelInfo.nLeft,makeLevelInfo.nBoth,makeLevelInfo.nRight,makeLevelInfo.fillChance); game.loadLevelStateFromLevel(game.level);}
})

//From @delimited at https://stackoverflow.com/questions/9960908/permutations-in-javascript
const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }

 permute(inputArr)

 return result;
}

function getCombinations(arr) {
  const result = [];

  // Recursive helper function
  function generate(currentCombination, startIndex) {
    // Add the current combination to the result
    result.push(currentCombination);

    // Iterate through the remaining elements
    for (let i = startIndex; i < arr.length; i++) {
      // Create a new combination by adding the current element
      const newCombination = [...currentCombination, arr[i]];
      // Recursively call generate with the new combination and updated start index
      generate(newCombination, i + 1);
    }
  }

  // Start the generation process with an empty combination and index 0
  generate([], 0);
  return result;
}

function combinations(set, k) {
  // Handle edge cases
  if (k > set.length || k <= 0) {
    return [];
  }
  if (k === set.length) {
    return [set];
  }
  if (k === 1) {
    return set.map(element => [element]);
  }

  const result = [];
  for (let i = 0; i <= set.length - k; i++) {
    const head = set[i];
    const tailCombinations = combinations(set.slice(i + 1), k - 1);
    for (const tail of tailCombinations) {
      result.push([head, ...tail]);
    }
  }
  return result;
}

function getUniquePermutations(arr) {
  const result = [];
  const n = arr.length;
  // Sort the array to handle duplicates effectively
  arr.sort();

  function backtrack(currentPermutation, used) {
    if (currentPermutation.length === n) {
      result.push([...currentPermutation]); // Add a copy of the permutation
      return;
    }

    for (let i = 0; i < n; i++) {
      // Skip if the element is already used
      if (used[i]) {
        continue;
      }

      // Skip if the current element is a duplicate of the previous one
      // and the previous one was not used (meaning it was skipped in a previous iteration)
      if (i > 0 && arr[i] === arr[i - 1] && !used[i - 1]) {
        continue;
      }

      currentPermutation.push(arr[i]);
      used[i] = true;
      backtrack(currentPermutation, used);
      used[i] = false; // Backtrack: unmark as used
      currentPermutation.pop(); // Backtrack: remove from current permutation
    }
  }

  backtrack([], new Array(n).fill(false)); // Start with empty permutation and all elements unused
  return result;
}

//Every 2nd load level is just the first one ???