'use strict';

function initEasy() {
    var elRst = document.querySelector('.rst');
    elRst.innerHTML = `<div class="rst">Restart?
    <button class="smiley" onclick="restartGame(this)">😃</button>
</div>`;
    gLevel = {
        SIZE: 5,
        MINES: 3,
    };
    init();
}