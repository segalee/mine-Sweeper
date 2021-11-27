var gAudioFlag = new Audio('sound/flag.wav');
var gAudioMine = new Audio('sound/mine.wav');
var gAudioWin = new Audio('sound/win.mp3');
var gAudioBoom = new Audio('sound/boom.wav');

var gStartTime;
var gIntervalDuration;
var gIntervalId;

function countNegs(cellI, cellJ, mat) {
    var negsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue;
            if (i === cellI && j === cellJ) continue;
            // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++;
            if (mat[i][j]) negsCount++;
        }
    }
    return negsCount;
}

function drawNum2() {
    var idx = getRandomInt(0, gNums2.length);
    var num = gNums2[idx];
    gNums2.splice(idx, 1);
    return num;
}

/////////////////////////////////////////////////////////////////////////////////

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// var count = 0
// var intervalId = setInterval(function(){
//     count++
//     if (count >= 10) {
//         clearInterval(intervalId)
//     }
//     console.log('timeout' + count);
// }, 500)

// console.log('res:', res);

function createMat(ROWS, COLS) {
    var mat = [];
    for (var i = 0; i < ROWS; i++) {
        var row = [];
        for (var j = 0; j < COLS; j++) {
            row.push('');
        }
        mat.push(row);
    }
    return mat;
}

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell${i}-${j}`;
            strHTML += `<td class="${className}">${cell}</td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function createStopper() {
    gStartTime = Date.now();

    var milliSeconds = 0;
    var seconds = 0;
    var minutes = 0;
    gIntervalDuration = 10;
    gIntervalId = setInterval(() => {
        var elH2Timer = document.querySelector('.timer');
        // CHANGE NUMS
        if (milliSeconds < 1000) {
            milliSeconds += gIntervalDuration;
        } else if (milliSeconds === 1000 && seconds !== 59) {
            milliSeconds = 0;
            seconds++;
        } else if (milliSeconds === 1000 && seconds === 59) {
            milliSeconds = 0;
            seconds = 0;
            minutes++;
        }
        // else if (milliSeconds === 1000 && seconds === 60) {
        //     milliSeconds = 0;
        //     seconds = 0;
        //     minutes++;
        // }
        // CHANGE ON SCREEN
        if (seconds < 10) {
            elH2Timer.innerText = `${minutes}:0${seconds}:${milliSeconds}`;
        } else if (seconds >= 10) {
            elH2Timer.innerText = `${minutes}:${seconds}:${milliSeconds}`;
        } else if (seconds === 59) {
            elH2Timer.innerText = `${minutes}:00:${milliSeconds}`;
        } else {
            elH2Timer.innerText = `${minutes}:${seconds}:${milliSeconds}`;
        }
    }, gIntervalDuration);
}

// function startTimeInterval() {
//     var elH2Timer = document.querySelector('.timer');
//     gStartTime = Date.now();
//     console.log('gStartTime', gStartTime);
//     // console.log(gStartTime);

//     gIntervalID = setInterval(function() {
//         var elTimer = document.querySelector('.timer');
//         var miliSecs = Date.now() - gStartTime;
//         // console.log('miliSecs/1000:', miliSecs/1000);
//         // console.log('miliSecs:', miliSecs);

//         elH2Timer.innerText = (miliSecs / 1000).toFixed(3);
//     }, 10);
// }