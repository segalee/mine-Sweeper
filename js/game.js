'use strict';

const MINE = '💣';
const FLAG = '🚩';
// const LIFE = '❤';
const LIFE = '<i class="fas fa-heart"></i>';

var gBoard;
//Booleans
var gIsGameOn;
var gAfterFirstClick;
//Functions

var gLevel;

var gGame;

function init() {
    gLevel = {
        SIZE: 5,
        MINES: 3,
    };

    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        flags: gLevel.MINES,
        lives: 3,
    };
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard('.board-container');
    setMinesNegsCount();
    livesLeft();
    remainFlags();
    var elH2Timer = document.querySelector('.timer');
    elH2Timer.innerText = '00:00:00';
    clearInterval(gIntervalId);
    var elSmileyBtn = document.querySelector('.smiley');
    elSmileyBtn.innerHTML = '😃';
}

function restartGame(elSmileyBtn) {
    init();
}

function cellMarked(elCell, elCellI, elCellJ) {
    if (gGame.isOn === false) return;
    if (gAfterFirstClick === false) return;
    var currCell = gBoard[elCellI][elCellJ];
    if (currCell.isShown === true) return;
    if (gGame.flags <= 0) return;
    // checkVictory();
    if (currCell.isMarked === false) {
        // if (gGame.markedCount <= 0) return;
        gGame.markedCount--;
        // elCell.innerHTML = FLAG;
        currCell.isMarked = true;
        currCell.isShown = false;
        gGame.flags--;
        remainFlags();
        renderBoard('.board-container');
        gAudioFlag.play();
    } else if (currCell.isMarked === true) {
        // elCell.innerHTML = FLAG;
        currCell.isMarked = false;
        currCell.isShown = false;
        gGame.markedCount++;
        gGame.flags++;
        remainFlags();
        gAudioFlag.play();
        renderBoard('.board-container');
    }
}

function remainFlags() {
    var elFlags = document.querySelector('.flags');
    var strHTML = gGame.flags;
    elFlags.innerHTML = strHTML;
    if (gGame.flags <= 0) {
        elFlags.innerHTML = '0';
    }
}

function livesLeft() {
    var elLives = document.querySelector('.lives');
    var strHTML = '';
    for (var i = 0; i < gGame.lives; i++) {
        strHTML += ` ${LIFE}`;
    }
    elLives.innerHTML = strHTML;
}

function gameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                gBoard[i][j].isShown = true;
                gBoard[i][j].isMarked = false;
            }
        }
    }
}

function cellClicked(elCellClicked, elCellI, elCellJ) {
    // if (gBoard[elCellI][elCellJ].isMarked) return;
    var elSmileyBtn = document.querySelector('.smiley');
    if (gBoard[elCellI][elCellJ].isShown) return;
    if (!gGame.isOn) return;
    //things I want happen on first click: timer-V, V-randomly apply mines
    if (!gAfterFirstClick) {
        createStopper();
        locateRandMines(gLevel.MINES);
        setMinesNegsCount();
        gBoard[elCellI][elCellJ].isShown = true;
        renderBoard('.board-container');
        // gGame.shownCount++;
        gAfterFirstClick = true;
        elCellClicked.disabled = 'disabled';
    }
    // checkVictory();
    gBoard[elCellI][elCellJ].isShown = true;
    if (gAfterFirstClick) gGame.shownCount++;
    expandShown(elCellI, elCellJ, gBoard);
    renderBoard('.board-container');

    if (gBoard[elCellI][elCellJ].isMine) {
        elSmileyBtn.innerHTML = '😣';
        setTimeout(() => {
            elSmileyBtn.innerHTML = '😃';
        }, 1000);
        gGame.lives--;
        livesLeft();
        if (gGame.lives === 0) {
            elCellClicked.innerHTML = '🎇';
            gAudioMine.play();
            setTimeout(() => {
                elSmileyBtn.innerHTML = '😭';
            }, 1000);
            // elCellClicked.display.backgroundColor = 'red';
            console.log('elCellClicked:', elCellClicked);
            console.log('game over YOU LOSE');
            gameOver();
            clearInterval(gIntervalId);
            gGame.isOn = false;
        }
    }
    if (gGame.isOn && gGame.shownCount === gLevel.SIZE ** 2) {
        console.log('YOU WIN');
        clearInterval(gIntervalId);
        setTimeout(() => {
            elSmileyBtn.innerHTML = '😎✌';
        }, 100);
    }
    if (gBoard[elCellI][elCellJ].minesAroundCount === 0) {
        console.log('find non mine negs');
        //count negs with no mines
    }
    renderBoard('.board-container');
}

function locateRandMines(mines) {
    var minesCounter = 0;
    while (minesCounter < mines) {
        var randI = getRandomInt(0, gBoard.length);
        var randJ = getRandomInt(0, gBoard.length);
        var cell = gBoard[randI][randJ];
        if (cell.isMine) {
            continue;
        } else {
            cell.isMine = true;
            minesCounter++;
        }
    }
}

function expandShown(cellI, cellJ, gBoard) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > gBoard[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            if (
                gBoard[i][j].minesAroundCount === 0 &&
                gBoard[i][j].isMarked === false &&
                gBoard[i][j].isMine === false
            ) {
                gBoard[i][j].isShown = true;
                renderBoard('.board-container');
            }
        }
    }
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var mineNegsCount = countMineNegs(i, j, gBoard);
            gBoard[i][j].minesAroundCount = mineNegsCount;
        }
    }
    renderBoard('.board-container');
}

function countMineNegs(cellI, cellJ, gBoard) {
    var mineNegsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > gBoard[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            if (gBoard[i][j].isMine) mineNegsCount++;
        }
    }
    return mineNegsCount;
}

function buildBoard(boardSize) {
    boardSize = gLevel.SIZE;
    var countMines = 0;
    var board = [];
    for (var i = 0; i < boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < boardSize; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i, j },
                // content: 0,
            };

            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`;
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var cellDisplay = cell.minesAroundCount;
            if (cell.isMine) cellDisplay = MINE;
            if (cellDisplay === 0) cellDisplay = '';
            if (cell.isShown) {
                var className = 'shown';
            }
            if (!cell.isShown) {
                cellDisplay = ' ';
                className = 'not-shown';
            }
            if (cell.isMarked && !cell.isShown) cellDisplay = FLAG;
            if (cell.isMine && cell.isShown) {
                className = 'mine';
            }
            if (cell.minesAroundCount === 1 && cell.isShown) {
                className = 'one';
            }
            if (cell.minesAroundCount === 2 && cell.isShown) {
                className = 'two';
            }
            if (cell.minesAroundCount === 3 && cell.isShown) {
                className = 'three';
            }
            if (cell.minesAroundCount === 4 && cell.isShown) {
                className = 'four';
            }
            strHTML += `\t<td class="td cell ${className}" data-i=${i} data-j=${j}
                            onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j});return false;" >${cellDisplay}
                         </td>\n`;
        }
        strHTML += `</tr>\n`;
    }
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// function checkVictory() {
//     gGame.shownCount = 0;
//     for (var i = 0; i < gBoard.length; i++) {
//         for (var j = 0; j < gBoard.length; j++) {
//             if (gBoard[i][j].isShown === true) gGame.shownCount++;
//         }
//     }
//     console.log('gGame.shownCount:', gGame.shownCount);
//     if (
//         gGame.markedCount === 0 &&
//         gGame.isOn &&
//         gGame.shownCount === gLevel.SIZE ** 2
//     ) {
//         console.log('YOU WIN');
//         clearInterval(gIntervalId);

//         document.querySelector('.smiley').innerHTML = '😎✌';
//     }

//     console.log('victory!');
// }