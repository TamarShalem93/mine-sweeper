"use strict";

function getHint(elHintsbtn) {
  gGame.isHint = true;
  elHintsbtn.innerText = USEDHINT;
  elHintsbtn.classList.add("used-hint");
}

function onHintOn(elCell, location) {
  var elModal = document.querySelector(".modal");
  elModal.style.display = "block";

  var currCell = gBoard[location.i][location.j];

  var elModalHint = document.querySelector(".modal .hint");
  elModalHint.innerText = currCell.isMine ? BOOM : currCell.minesAroundCount;

  setTimeout(() => {
    gGame.isHint = false;
    elModal.style.display = "none";
  }, 1000);
}

function resetHints() {
  var elHint;
  for (var i = 0; i < 3; i++) {
    elHint = document.querySelector(`.hint${i + 1}-btn`);
    elHint.classList.remove("used-hint");
    elHint.innerText = HINT;
  }
}
