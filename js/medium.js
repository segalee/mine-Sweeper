'use strict';

function initMedium() {
    clearInterval(gIntervalId);
    gLevel = {
        SIZE: 8,
        MINES: 12,
    };

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        flags: gLevel.MINES,
        lives: 3,
    };
    gBoard = buildBoard();
    renderBoard('.board-container');
    setMinesNegsCount();
    livesLeft();
    remainFlags();
    var elSmileyBtn = document.querySelector('.smiley');
    elSmileyBtn.innerHTML = '😃';
    var elH2Timer = document.querySelector('.timer');
    elH2Timer.innerText = '00:00:00';
}