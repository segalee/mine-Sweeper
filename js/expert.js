function initExpert() {
    var elH2Timer = document.querySelector('.timer');
    elH2Timer.innerText = '00:00:00';
    clearInterval(gIntervalId);
    gLevel = {
        SIZE: 12,
        MINES: 30,
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
}