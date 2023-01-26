"use strict";

function onCellClicked(elCell, i, j) {
  var value;
  var currCell = gBoard[i][j];

  // gPreviousMove.push({ lastMove: gBoard[i][j], i, j });

  if (!gGame.isOn) {
    gGame.isOn = true;
    startTimer();
    addMines(gLevel.MINES, gBoard);
    setMinesNegsCount(gBoard);
  }

  if (gGame.isHint) {
    onHintOn(elCell, { i, j });
    return;
  }

  // if (!gGame.isOn || currCell.isMarked || currCell.isShown) {
  //   gPreviousMove.pop();
  //   return;
  // }

  currCell.isShown = true;

  if (currCell.isMine) {
    value = BOOM;
    gGame.mainesCount--;
    gGame.lives--;
    updatedLives();
  } else if (currCell.minesAroundCount === 0) {
    expandShown(gBoard, elCell, i, j);

    value = EMPTY;
  } else if (currCell.minesAroundCount > 0) value = currCell.minesAroundCount;

  renderCell({ i, j }, value);
  updateBoomsRemain();
  checkGameOver();
}

function expandShown(board, elCell, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[i].length) continue;
      var value;
      var currCell = board[i][j];

      if (currCell.isShown || currCell.isMarked) continue;

      currCell.isShown = true;

      if (currCell.minesAroundCount > 0) value = currCell.minesAroundCount;
      if (currCell.minesAroundCount === 0) {
        value = EMPTY;
      }
      renderCell({ i, j }, value, elCell);

      if (currCell.minesAroundCount === 0 && !currCell.isMarked) {
        expandShown(board, elCell, i, j);
      }
    }
  }
  checkGameOver();
}

function onCellMarked(i, j) {
  var currCell = gBoard[i][j];
  var value;

  if (currCell.isShown) return;
  if (gGame.markedCount >= gLevel.MINES) return;

  currCell.isMarked = !currCell.isMarked;

  if (currCell.isMarked) {
    value = FLAG;
    gGame.markedCount++;
  } else {
    value = EMPTY;
    gGame.markedCount--;
  }

  renderCell({ i, j }, value);
  updateBoomsRemain();
  checkGameOver();
}

// function checkCellValue(i, j) {
//   var value;
//   var currCell = gBoard[i][j];

//   if (currCell.minesAroundCount > 0) value = currCell.minesAroundCount;
//   if (currCell.isMine) value = BOOM;
//   if (currCell.minesAroundCount === 0 || !currCell.isMarked) value = EMPTY;
//   if (currCell.isMarked) value = FLAG;

//   console.log(value);
//   return value;
// }

// function undo() {
//   var lastMove = gPreviousMove.splice(gGame.length - 1, 1);
//   console.log(lastMove);

//   gBoard[i][j] = {
//     minesAroundCount: lastMove.minesAroundCount,
//     isShown: lastMove.isMarked,
//     isMine: lastMove.isMine,
//     isMarked: lastMove.isMarked,
//   };
//   renderBoard(lastMove);
// }
