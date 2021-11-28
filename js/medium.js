'use strict';

function initMedium() {
    var elRst = document.querySelector('.rst');
    elRst.innerHTML = `<div class="rst">Restart?
    <button class="smiley" onclick="restartGame(this)">😃</button>
</div>`;
    gLevel = {
        SIZE: 8,
        MINES: 12,
    };
    init();
}