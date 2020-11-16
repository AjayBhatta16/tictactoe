const modeButton = document.querySelector('.settings-button');
const startButton = document.querySelector('#start');
let squares = document.querySelectorAll('.square');
const turnHeader = document.querySelector('#turn');
const board = document.querySelector('#board');

const letterX = '<span class="x">X</span>';
const letterO = '<span class="o">O</span>';
const wins = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
const partialWins = [[1,2],[2,3],[1,3],[4,5],[4,6],[5,6],[7,8],[7,9],[8,9],[1,4],[1,7],[4,7],[2,5],[2,8],[5,8],[3,6],[3,9],[6,9],[1,5],[1,9],[5,9],[3,5],[3,7],[5,7]];
const modeText = ["Player vs Player","Player vs CPU"];

let cpu = false;
let choice;
let emptySquares = [1,2,3,4,5,6,7,8,9];
let p1 = [];
let p2 = [];
let turn = 1;

function switchMode() {
  cpu = !cpu;
  reset();
  this.textContent = cpu ? modeText[1] : modeText[0];
}

function addX() {
  if(this.classList.contains('free')){
    this.innerHTML = letterX;
    this.classList.remove('free');
    index = parseInt(this.dataset.sq);
    p2.push(index);
    emptySquares = emptySquares.filter(val => val != index);
    turn += 1;
    playGame();
  }
}

function addO() {
  if(this.classList.contains('free')){
    this.innerHTML = letterO;
    this.classList.remove('free');
    index = parseInt(this.dataset.sq);
    p1.push(index);
    emptySquares = emptySquares.filter(val => val != index);
    turn += 1;
    playGame();
  }
}

function hasWin(arr) {
  if(arr.length < 3) {
    return false;
  }
  let foundWin = false;
  wins.forEach(win => {
    if(arr.includes(win[0]) && arr.includes(win[1]) && arr.includes(win[2])){
      foundWin = true;
    }
  });
  return foundWin;
}

function hasPartialWin(arr) {
  if (arr.length < 2) {
    return false;
  }
  let foundPartial = false;
  partialWins.forEach(pw => {
    if(arr.includes(pw[0]) && arr.includes(pw[1])) {
      foundPartial = true;
    }
  });
  return foundPartial;
}

function findPotentialWin(playerArr,openArr) {
  let potential = null;
  wins.forEach(win => {
    if ((playerArr.includes(win[0]) && openArr.includes(win[1]) && openArr.includes(win[2])) || (playerArr.includes(win[1]) && openArr.includes(win[0]) && openArr.includes(win[2])) || (playerArr.includes(win[2]) && openArr.includes(win[0]) && openArr.includes(win[1]))) {
      potential = win;
    }
  });
  return potential;
}

function gameOver() {
  if (turn %2 == 1 && !cpu) {
    squares.forEach(square => square.removeEventListener('click', addX));
  } else {
    squares.forEach(square => square.removeEventListener('click', addO));
  }
  if(hasWin(p1)){
    turnHeader.textContent = "Player 1 Wins";
  } else if(hasWin(p2)) {
    turnHeader.textContent = "Player 2 Wins";
  } else {
    turnHeader.textContent = "Tie game";
  }
  board.classList.remove('active');
}

function nextSpot(cpuArr,humanArr,openArr) {
  if (humanArr.length == 2) {
    if ((humanArr.includes(5) && humanArr.includes(9)) || (humanArr.includes(3) && humanArr.includes(8)) || (humanArr.includes(4) && (humanArr.includes(8) || humanArr.includes(9)))) {
      return 7;
    }
    if (humanArr.includes(6) && humanArr.includes(7)) {
      return 9;
    }
  }
  
  if (cpuArr.length == 0 && openArr.includes(5)) {
    return 5;
  } else if (cpuArr.length == 0) {
    return 1;
  }
  if (hasPartialWin(cpuArr)) {
    let output = 0;
    wins.forEach(win => {
      if (cpuArr.includes(win[0]) && cpuArr.includes(win[1]) && openArr.includes(win[2])) {
        output = win[2];
      } else if (cpuArr.includes(win[0]) && cpuArr.includes(win[2]) && openArr.includes(win[1])) {
        output = win[1];
      } else if (cpuArr.includes(win[1]) && cpuArr.includes(win[2]) && openArr.includes(win[0])) {
        output = win[0];
      }
    });
    if (output != 0) {
      return output;
    }
  }
  if (hasPartialWin(humanArr)) {
    let output = 0;
    wins.forEach(win => {
      if (humanArr.includes(win[0]) && humanArr.includes(win[1]) && openArr.includes(win[2])) {
        output = win[2];
      } else if (humanArr.includes(win[0]) && humanArr.includes(win[2]) && openArr.includes(win[1])) {
        output = win[1];
      } else if (humanArr.includes(win[1]) && humanArr.includes(win[2]) && openArr.includes(win[0])) {
        output = win[0];
      }
    });
    if (output != 0) {
      return output;
    }
  }
  if ((humanArr.includes(1) && humanArr.includes(9)) || (humanArr.includes(3) && humanArr.includes(7))) {
    if (openArr.includes(2)) {
      return 2;
    } else if (openArr.includes(4)) {
      return 4;
    } else if (openArr.includes(6)) {
      return 6;
    } else {
      return 8;
    }
  }
  let potential = findPotentialWin(cpuArr,openArr);
  if (potential) {
    if (openArr.includes(potential[0])) {
      return potential[0];
    } else {
      return potential[1];
    }
  }
  return openArr[Math.floor(Math.random()*openArr.length)];
}

function playGame() {
  console.log(`${p1}\n${p2}\n${turn}`);
  if(hasWin(p1) || hasWin(p2) || turn == 10) {
    gameOver();
    return;
  }
  if (turn > 1) {
    squares = document.querySelectorAll('.free');
  }
  if (turn % 2 == 1) {
    if (turn > 1 && !cpu) {
      squares.forEach(square => square.removeEventListener('click', addX));
    }
    turnHeader.textContent = "Player 1's turn";
    squares.forEach(square => {
      square.addEventListener('click',addO);
    });
  } else {
    if(!cpu) {
      squares.forEach(square => square.removeEventListener('click',addO));
      turnHeader.textContent = "Player 2's turn";
      squares.forEach(square => {
        square.addEventListener('click',addX);
      });
    } else {
      // choice = Math.floor(Math.random()*(emptySquares.length));
      choice = nextSpot(p2,p1,emptySquares);
      let square = document.querySelector('[data-sq~="'+choice+'"]');
      //console.log(choice, emptySquares[choice]);
      square.innerHTML = letterX;
      square.classList.remove('free');
      index = parseInt(square.dataset.sq);
      p2.push(index);
      emptySquares = emptySquares.filter(val => val != index);
      turn += 1;
      playGame();
    }
  }
}

function reset() {
  squares = document.querySelectorAll('.square');
  squares.forEach(square => {
    if (!square.classList.contains('free')) {
      square.classList.add('free');
    }
    square.innerHTML = '';
  });
  turn = 1;
  p1 = [];
  p2 = [];
  emptySquares = [1,2,3,4,5,6,7,8,9];
}

function start() {
  if (turn > 1) {
    reset();
  } 
  board.classList.add('active');
  playGame();
}

modeButton.addEventListener('click',switchMode);
startButton.addEventListener('click',start);