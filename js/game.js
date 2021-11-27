'use strict';

// const MINE = '<i class="fas fa-bomb"></i>';
// const MINE = '<i class="fab fa-freebsd"></i>';
const MINE = '💣';
const FLAG = '🚩';
// const LIFE = '❤';
const LIFE = '<i class="fas fa-heart"></i>';
const HINT = '<i class="far fa-lightbulb"></i>';

var gBoard;
//Booleans
var gIsGameOn;
var gAfterFirstClick;
//Functions
var gLevel = {
    SIZE: 5,
    MINES: 3,
};
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    minesPressedCount: 0,
    minesMarkedCount: 0,
    secsPassed: 0,
    flags: gLevel.MINES,
    lives: 3,
    hints: 3,
    // isHintClicked: false,
};

function init() {
    gAfterFirstClick = false;
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        minesPressedCount: 0,
        minesMarkedCount: 0,
        secsPassed: 0,
        flags: gLevel.MINES,
        lives: 3,
        hints: 3,
        // isHintClicked: false,
    };
    gBoard = buildBoard(gLevel.SIZE);
    renderBoard('.board-container');
    setMinesNegsCount();
    // hintsLeft();
    livesLeft();
    remainFlags();
    var elH2Timer = document.querySelector('.timer');
    elH2Timer.innerText = '00:00:00';
    clearInterval(gIntervalId);
    var elSmileyBtn = document.querySelector('.smiley');
    elSmileyBtn.innerHTML = '😃';
}

function restartGame(elSmileyBtn) {
    var elRst = document.querySelector('.rst');
    elRst.innerHTML = `<div class="rst">Restart?
    <button class="smiley" onclick="restartGame(this)">😃</button>
</div>`;
    init();
}

// function giveHint(elClickedCell) {
//     gGame.isHintClicked = true;
//     if (gGame.hints >= 0) {
//         // elClickedCell.style.color = 'yellow';
//         gGame.hints--;
//         hintsLeft();
//     }
// }

// function hintsLeft() {
//     var elHints = document.querySelector('.hints');
//     var strHTML = '';
//     for (var i = 0; i < gGame.hints; i++) {
//         strHTML += ` ${HINT}`;
//     }
//     elHints.innerHTML = strHTML;
// }

function livesLeft() {
    var elLives = document.querySelector('.lives');
    var strHTML = '';
    for (var i = 0; i < gGame.lives; i++) {
        strHTML += ` ${LIFE}`;
    }
    elLives.innerHTML = strHTML;
}

function gameOver() {
    gGame.isOn = false;
    clearInterval(gIntervalId);
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

function firstCellClicked(elCellClicked, elCellI, elCellJ) {
    createStopper();
    positionRandMines(gLevel.MINES, elCellI, elCellJ);
    setMinesNegsCount();
    gBoard[elCellI][elCellJ].isShown = true;
    renderBoard('.board-container');
    gAfterFirstClick = true;
    elCellClicked.disabled = 'disabled';
}

// function showCellClickedNegs(cellI, cellJ, gBoard) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j > gBoard[i].length - 1) continue;
//             if (i === cellI && j === cellJ) continue;
//             if ((gBoard[i][j].isShown = false)) {
//                 gBoard[i][j].isShown = true;
//                 console.log(gBoard);
//             }
//         }
//     }
// }

// function unShowCellClickedNegs(cellI, cellJ, gBoard) {
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (j < 0 || j > gBoard[i].length - 1) continue;
//             if (i === cellI && j === cellJ) continue;
//             if ((gBoard[i][j].isShown = true)) {
//                 gBoard[i][j].isShown = false;
//                 console.log(gBoard);
//             }
//         }
//     }
// }

function cellClicked(elCellClicked, elCellI, elCellJ) {
    var elSmileyBtn = document.querySelector('.smiley');
    if (gBoard[elCellI][elCellJ].isMarked) return;
    if (gBoard[elCellI][elCellJ].isShown) return;
    if (!gGame.isOn) return;
    // if (gGame.isHintClicked) {
    //     console.log('is hint clicked');
    //     showCellClickedNegs(elCellI, elCellJ, gBoard);
    //     setTimeout(() => {
    //         unShowCellClickedNegs(elCellI, elCellJ, gBoard);
    //     }, 500);
    //     gGame.isHintClicked = false;
    // }
    //things I want happen on first click: timer-V, V-randomly apply mines
    if (!gAfterFirstClick) {
        firstCellClicked(elCellClicked, elCellI, elCellJ);
    }
    if (gBoard[elCellI][elCellJ].isMine) {
        gAudioBoom.play();
        gGame.minesPressedCount++;
        // gGame.flags--;
        remainFlags();
    }
    gBoard[elCellI][elCellJ].isShown = true;
    expandShown(elCellI, elCellJ, gBoard);
    checkVictory();
    renderBoard('.board-container');

    if (gBoard[elCellI][elCellJ].isMine) {
        elSmileyBtn.innerHTML = '😣';
        setTimeout(() => {
            elSmileyBtn.innerHTML = '😃';
        }, 1000);
        gGame.lives--;
        livesLeft();
        if (gGame.lives === 0) {
            gBoard[elCellI][elCellJ].isLastMine = true;
            // elCellClicked.innerText = '🎇';
            gAudioMine.play();
            setTimeout(() => {
                elSmileyBtn.innerHTML = '😭';
            }, 1000);
            gameOver();
            clearInterval(gIntervalId);
            gGame.isOn = false;
        }
    }
    renderBoard('.board-container');
}

function checkVictory() {
    gGame.shownCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown === true) gGame.shownCount++;
        }
    }
    // var foundAllMines =
    //     gGame.minesMarkedCount + gGame.minesPressedCount === gLevel.MINES;
    var allCellsShown =
        gLevel.SIZE ** 2 === gGame.shownCount + gGame.minesMarkedCount;
    if (
        gGame.isOn &&
        gGame.minesMarkedCount === gLevel.MINES &&
        gGame.minesPressedCount !== gLevel.MINES &&
        allCellsShown
        // foundAllMines
    ) {
        gAudioWin.play();
        clearInterval(gIntervalId);
        gGame.isOn = false;
        document.querySelector('.smiley').innerHTML = '😎✌';
    }
    renderBoard('.board-container');
}

function shownCount() {
    gGame.shownCount = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown === true) gGame.shownCount++;
        }
    }
}

function cellMarked(elCell, elCellI, elCellJ) {
    if (!gGame.isOn) return;
    if (!gAfterFirstClick) return;
    var currCell = gBoard[elCellI][elCellJ];
    if (!currCell.isMine && currCell.isShown) return;
    if (currCell.isShown) {
        currCell.isShown = false;
    }
    if (!currCell.isMarked) {
        if (gGame.flags <= 0) return;
        gGame.markedCount++;
        currCell.isMarked = true;
        currCell.isShown = false;
        if (currCell.isMine) {
            gGame.minesMarkedCount++;
        }
        gGame.flags--;
        remainFlags();
        renderBoard('.board-container');
        gAudioFlag.play();
    } else {
        if (gGame.flags < 0) return;
        currCell.isMarked = false;
        currCell.isShown = false;
        if (currCell.isMine) {
            gGame.minesMarkedCount--;
        }
        gGame.markedCount--;
        gGame.flags++;
        remainFlags();
        gAudioFlag.play();
        renderBoard('.board-container');
    }
    checkVictory();
}

function remainFlags() {
    var elFlags = document.querySelector('.flags');
    var strHTML = gGame.flags;
    elFlags.innerHTML = strHTML;
    if (gGame.flags <= 0) {
        elFlags.innerHTML = '0';
    }
}

function positionRandMines(mines, elCellI, elCellJ) {
    var minesCounter = 0;
    var selectedCell = gBoard[elCellI][elCellJ];
    while (minesCounter < mines) {
        var randI = getRandomInt(0, gBoard.length);
        var randJ = getRandomInt(0, gBoard.length);
        var cell = gBoard[randI][randJ];
        var isFirstClickSelectedCell =
            selectedCell.location.i === cell.location.i &&
            selectedCell.location.j === cell.location.j;
        if (cell.isMine || isFirstClickSelectedCell) {
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
                isLastMine: false,
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
            if (cell.isLastMine) {
                cellDisplay = '🎇';
                className = 'explosion';
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
            // if (gGame.lives === 0 && cell.isMine && cell.isShown ) cellDisplay = '🎇';
            strHTML += `\t<td class="td cell ${className}" data-i=${i} data-j=${j}
                            onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j});return false;">${cellDisplay}
                         </td>\n`;
        }
        strHTML += `</tr>\n`;
    }
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}