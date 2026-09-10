var train;
const bOps = ["+", "-", "*", "/", "^"];
const uOps = ["", "-"];

class _train {
  constructor() {
    this.carriages = [];
    this.hasPermuteSolution = [];
    for (let i = 0; i < 10000; i++) {
      this.carriages.push(new _carriage(i));
      this.hasPermuteSolution[i] = false;
    }
    this.solved = [];
  }
  findAllCarriages(maxNSolutions) {
    this.carriages.forEach((carriage) => {
      carriage.findSolutions(10, maxNSolutions);
      let nSolutions = carriage.solutions.length;
      if (nSolutions > 0) {
        this.solved.push(carriage);
      }
      console.log(
        `${carriage.number} has ${carriage.solutions.length} solution/s`,
      );
    });
  }
  checkPermuteSolutions() {
    this.carriages.forEach((carriage) => {
      let sortedNumber = carriage.sortedNumber;
      carriage.hasPermuteSolution = this.hasPermuteSolution[sortedNumber];
    });
  }
}

class _carriage {
  constructor(number = 0) {
    this.number = number;
    this.sortedNumber = sortNumber(this.number);
    this.solutions = [];
    this.hasPermuteSolution = false;
  }
  findSolutions(targetNumber, maxNSolutions) {
    this.solutions = [];
    for (let uOpsIndex = 0; uOpsIndex < 64; uOpsIndex++) {
      for (let pPIndex = 0; pPIndex < 5; pPIndex++) {
        for (let bOpsIndex = 0; bOpsIndex < 125; bOpsIndex++) {
          let solution = new _solution(
            this.number,
            pPIndex,
            bOpsIndex,
            uOpsIndex,
          );
          let result = math.evaluate(solution.equation);
          if (result == targetNumber) {
            this.solutions.push(solution);
            train.hasPermuteSolution[this.sortedNumber] = true;
          }
          if (this.solutions.length >= maxNSolutions && maxNSolutions != 0)
            return;
        }
      }
    }
  }
}

class _solution {
  constructor(
    digitsIndex = 0,
    parenthesesPattern = 0,
    bOpsIndex = 0,
    uOpsIndex = 0,
  ) {
    this.digitsIndex = digitsIndex; //0 - 9999
    this.digits = numberToFourDigitArray(this.digitsIndex);
    this.parenthesesPattern = parenthesesPattern; //0 - 4
    this.bOpsIndex = bOpsIndex; //0 - 124
    this.bOps = elementSetIndexToArray(this.bOpsIndex, bOps, 3);
    this.uOpsIndex = uOpsIndex; //0 - 63
    this.uOps = elementSetIndexToArray(this.uOpsIndex, uOps, 6);
  }
  get equation() {
    return addParentheses(
      this.parenthesesPattern,
      this.digits,
      this.bOps,
      this.uOps,
    );
  }
}

function start() {
  train = new _train();
}

function addParentheses(
  pattern = 0,
  digits = ["0", "0", "0", "0"],
  bOps = ["+", "+", "+"],
  uOps = ["", "", "", "", "", ""],
) {
  let A = uOps[0] + digits[0];
  let B = uOps[1] + digits[1];
  let C = uOps[2] + digits[2];
  let D = uOps[3] + digits[3];

  switch (pattern) {
    case 0:
      return `${uOps[4]}(${uOps[5]}(${A}${bOps[0]}${B})${bOps[1]}${C})${bOps[2]}${D}`;
    case 1:
      return `${uOps[4]}(${A}${bOps[0]}${uOps[5]}(${B}${bOps[1]}${C}))${bOps[2]}${D}`;
    case 2:
      return `${uOps[4]}(${A}${bOps[0]}${B})${bOps[1]}${uOps[5]}(${C}${bOps[2]}${D})`;
    case 3:
      return `${A}${bOps[0]}${uOps[4]}(${uOps[5]}(${B}${bOps[1]}${C})${bOps[2]}${D})`;
    case 4:
      return `${A}${bOps[0]}${uOps[4]}(${B}${bOps[1]}${uOps[5]}(${C}${bOps[2]}${D}))`;
  }
}

function numberToFourDigitArray(number) {
  let numberString = String(number);
  let nChars = numberString.length;
  let D = numberString[nChars - 1] ?? "0";
  let C = numberString[nChars - 2] ?? "0";
  let B = numberString[nChars - 3] ?? "0";
  let A = numberString[nChars - 4] ?? "0";
  return [A, B, C, D];
}

//Succeeded by elementSetIndexToArray
function bOpsIndexToArray(index) {
  let b1index = index % 5;
  let b2index = Math.floor((index / 5) % 5);
  let b3index = Math.floor((index / 5 / 5) % 5);
  return [bOps[b1index], bOps[b2index], bOps[b3index]];
}

function elementSetIndexToArray(index, set, nElements) {
  let array = [];
  let length = set.length;
  for (let i = 0; i < nElements; i++) {
    let setIndex = Math.floor((index / math.pow(length, i)) % length);
    array.push(set[setIndex]);
  }
  return array;
}

function sortNumber(number) {
  let sortedDigits = numberToFourDigitArray(number).sort();
  return Number(
    sortedDigits[0] + sortedDigits[1] + sortedDigits[2] + sortedDigits[3],
  );
}

window.onload = start;
