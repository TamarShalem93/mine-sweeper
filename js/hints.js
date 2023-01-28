"use strict";

function getHint(elHintsbtn) {
  if (gGame.isHint && elHintsbtn.classList.contains("used-hint")) return;

  if (elHintsbtn.classList.contains("clicked-hint")) {
    gGame.isHint = false;
    elHintsbtn.classList.remove("clicked-hint");
  } else {
    elHintsbtn.classList.add("clicked-hint");
    gGame.isHint = true;
  }
}

function onHintOn(location) {
  var currCell = gBoard[location.i][location.j];
  currCell.isShown = true;
  renderCell(location, checkCellValue(location.i, location.j));

  setTimeout(() => {
    currCell.isShown = false;
    renderCell(location, EMPTY);

    gGame.isHint = false;
    updateHintsBtn();
  }, 1500);
}

function updateHintsBtn() {
  var elHintsbtn;
  for (var i = 0; i < 3; i++) {
    elHintsbtn = document.querySelector(`.hint${i + 1}-btn`);

    if (elHintsbtn.classList.contains("clicked-hint")) {
      elHintsbtn.innerText = USEDHINT;
      elHintsbtn.classList.add("used-hint");
    }
  }
}

function resetHints() {
  var elHintsbtn;
  for (var i = 0; i < 3; i++) {
    elHintsbtn = document.querySelector(`.hint${i + 1}-btn`);
    elHintsbtn.classList.remove("used-hint");
    elHintsbtn.classList.remove("clicked-hint");
    elHintsbtn.innerText = HINT;
  }
}
