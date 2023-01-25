"use strict";

const FLAG = "🚩";
const BOOM = "💣";
const EMPTY = "";

// – A Matrix
// containing cell objects:
// Each cell:
var gBoard = [];

// This is an object by which the
// board size is set (in this case:
// 4x4 board and how many mines
// to place)
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

// This is an object in which you
// can keep and update the
// current game state:
// isOn: Boolean, when true we
// let the user play
// shownCount: How many cells
// are shown
// markedCount: How many cells
// are marked (with a flag)
// secsPassed: How many seconds
// passed
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function onInit() {
  //This is called when page loads
  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard);
  handleRightClick();
}

function buildBoard(size) {
  const board = [];

  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }

  addMines(gLevel.MINES, board);

  setMinesNegsCount(board);

  console.log(board);
  return board;
}

function addMines(minesNum, board) {
  for (var i = 0; i < minesNum; i++) {
    var emptyPos = getEmptyPos(board);

    board[emptyPos.i][emptyPos.j].isMine = true;
  }
  return board;
}

function getEmptyPos(board) {
  var emptyCells = [];

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (isEmptyCell(i, j, board)) {
        emptyCells.push({ i, j });
      }
    }
  }

  var randIdx = getRandomInt(0, emptyCells.length - 1);

  return emptyCells[randIdx];
}

function isEmptyCell(i, j, board) {
  return board[i][j].isMine === false;
}

function setMinesNegsCount(board) {
  var minesNegsCount;

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      var currCell = board[i][j];
      minesNegsCount = countNegs(i, j, board);
      currCell.minesAroundCount = minesNegsCount;
    }
  }

  return board;
}

function countNegs(rowIdx, colIdx, board) {
  var neighborsCount = 0;

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j].isMine) neighborsCount++;
    }
  }
  return neighborsCount;
}

function renderBoard(board) {
  var strHTML = "<table><tbody>";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board.length; j++) {
      const className = `cell cell-${i}-${j}`;

      strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})"></td>`;
    }
    strHTML += "</tr>";
  }
  strHTML += "</tbody></table>";
  console.log(strHTML);

  const elContainer = document.querySelector(".board");
  elContainer.innerHTML = strHTML;
}

function onCellClicked(elCell, i, j) {
  //  Called when a cell is clicked
  var currCell = gBoard[i][j];
  currCell.isShown = true;
  gGame.shownCount++;

  var value;

  if (currCell.isMine) value = BOOM;
  else if (currCell.minesAroundCount === 0) {
    value = EMPTY;
    expandShown(gBoard, elCell, i, j);
  } else if (currCell.minesAroundCount > 0) value = currCell.minesAroundCount;

  renderCell({ i, j }, value);

  // if (currCell.isShown) elCell.classList.add("shown");
  // else elCell.classList.remove("shown");

  if (currCell.isMine) {
    gameOver();
    return;
  }

  checkGameOver();
}

function renderCell(location, value) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;

  var currCell = gBoard[location.i][location.j];

  if (currCell.isShown) elCell.classList.add("shown");
  else elCell.classList.remove("shown");
}

// function handleRightClick() {
//   for (var i = 0; i < gBoard.length; i++) {
//     for (var j = 0; j < gBoard[i].length; j++) {
//       console.log(i, j);
//       var currCell = document.querySelector(`.cell-${i}-${j}`);
//       currCell.addEventListener("contextmenu", function (event) {
//         event.preventDefault();
//       });
//       onCellMarked(currCell, i, j);
//     }
//   }
// }
// function handleRightClick() {
//   const cells = document.querySelectorAll(".cell");
//   for (var i = 0; i < cells.length; i++) {
//     cells[i].addEventListener("contextmenu", function (event) {
//       event.preventDefault();
//       console.log("hi");
//       var elCell = document.querySelector(`.cell-${i}-${j}`);
//       elCell.innerText = FLAG;
//       // your code here
//     });
//   }
// }

// function onCellMarked(elCell, i, j) {
//   var currCell = gBoard[i][j];

//   !currCell.isMarked;

//   if (currCell.isMarked) gGame.markedCount++;
//   else gGame.markedCount--;

//   var value = currCell.isMarked ? EMPTY : FLAG;

//   renderCell({ i, j }, value);
//   checkGameOver();
// }

function expandShown(board, elCell, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[i].length) continue;

      var value;
      var currCell = board[i][j];
      currCell.isShown = true;
      gGame.shownCount++;
      if (currCell.minesAroundCount > 0) value = currCell.minesAroundCount;
      if (currCell.minesAroundCount === 0) {
        value = EMPTY;
        // expandShown(board, elCell, i, j);
      }
      renderCell({ i, j }, value, elCell);
    }
  }
}

function checkGameOver() {
  var maxShownNum = gLevel.SIZE ** -gLevel.MINES;
  var minesNum = gLevel.MINES;
  var maxFlagedNum = gLevel.MINES;
  if (gGame.shownCount === maxShownNum && maxFlagedNum === minesNum)
    console.log("victory!!");
}

function gameOver() {
  console.log("gameover");
}
