function undo() {
  var lastMove = gPreMovesLoctions.pop();
  var rowIdx = lastMove.i;
  var colIdx = lastMove.j;

  if (!gGame.isOn) return;

  if (gBoard[rowIdx][colIdx].isMine && gBoard[rowIdx][colIdx].isShown) {
    gGame.lives++;
    updatedLives();
    gGame.mainesCount++;
    gGame.shownMainsCount--;
    updateBoomsRemain();
  }

  if (gBoard[rowIdx][colIdx].isMarked) {
    gBoard[rowIdx][colIdx].isMarked = !gBoard[rowIdx][colIdx].isMarked;
    gGame.markedCount--;
    updateBoomsRemain();
  }

  gBoard[rowIdx][colIdx].isShown = false;
  renderCell(lastMove, EMPTY);

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= gBoard[i].length) continue;

      var currCell = gBoard[i][j];

      if (!currCell.isShown || currCell.isMarked) continue;

      if (currCell.minesAroundCount === 0 && !currCell.isMarked) {
        if (currCell.isShown) undo();
      }
    }
  }
}
