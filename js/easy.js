'use strict';

function initEasy() {
    gLevel.size = 5;
    gLevel.mines = 3;
    init();
}

// function initEasy() {
//     gLevel = {
//         SIZE: 5,
//         MINES: 3,
//     };

//     gGame = {
//         isOn: true,
//         shownCount: 0,
//         markedCount: 0,
//         secsPassed: 0,
//         flags: gLevel.MINES,
//         lives: 3,
//     };
//     gBoard = buildBoard(gLevel.SIZE);
//     renderBoard('.board-container');
//     setMinesNegsCount();
//     livesLeft();
//     remainFlags();
//     var elH2Timer = document.querySelector('.timer');
//     elH2Timer.innerText = '00:00:00';
//     clearInterval(gIntervalId);
//     var elSmileyBtn = document.querySelector('.smiley');
//     elSmileyBtn.innerHTML = '😃';
// }