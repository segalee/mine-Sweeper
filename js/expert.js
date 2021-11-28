function initExpert() {
    var elRst = document.querySelector('.rst');
    elRst.innerHTML = `<div class="rst">Restart?
    <button class="smiley" onclick="restartGame(this)">😃</button>
</div>`;
    gLevel = {
        SIZE: 12,
        MINES: 30,
    };
    init();
}