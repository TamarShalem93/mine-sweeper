"use strict";

function onCellClicked(elCell, i, j) {
  var currCell = gBoard[i][j];

  if (!gGame.isOn || currCell.isMarked || currCell.isShown) return;
  // gPreMovesLoctions.pop();

  if (gGame.isHint) {
    onHintOn({ i, j });
    return;
  }

  gPreMovesLoctions.push({ i, j });

  if (gGame.isFirstClick) {
    gGame.isFirstClick = false;
    startTimer();
    addMines(gLevel.MINES, gBoard);
    setMinesNegsCount(gBoard);
  }

  currCell.isShown = true;

  if (currCell.isMine) {
    gGame.mainesCount--;
    gGame.lives--;
    console.log(gGame.lives);
    updatedLives();
    gGame.shownMainsCount++;
  } else if (currCell.minesAroundCount === 0) expandShown(gBoard, elCell, i, j);

  renderCell({ i, j }, checkCellValue(i, j));
  updateBoomsRemain();
  checkGameOver();
}

function expandShown(board, elCell, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= board[i].length) continue;
      var currCell = board[i][j];

      if (currCell.isShown || currCell.isMarked) continue;

      currCell.isShown = true;

      renderCell({ i, j }, checkCellValue(i, j));
      gPreMovesLoctions.push({ i, j });

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
  if (gGame.markedCount === gLevel.MINES) return;
  if (gGame.shownMainsCount + gGame.markedCount === gLevel.MINES) return;

  currCell.isMarked = !currCell.isMarked;

  if (currCell.isMarked) {
    value = FLAG;
    gGame.markedCount++;
  } else {
    value = EMPTY;
    gGame.markedCount--;
  }

  renderCell({ i, j }, checkCellValue(i, j));
  updateBoomsRemain();
  checkGameOver();
}
