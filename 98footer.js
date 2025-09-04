$("#start").click(function () {
    $("#menu").fadeToggle(40);
});

$(function () {
    $(".drag").draggable();
    $(".res").resizable();
    $('.window').draggable();
});


var activetab = "";

$(".window").not("#taskbar").click(function () {
    $(".window").removeClass("active");
    $(".tbtab").removeClass("active");
    $(this).addClass("active");
    activetab = $(this).attr("id") + "tab";
    console.log(activetab)
    $("#" + activetab).addClass("active");
});

// Clock //

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('time-s').innerHTML =
        h + ":" + m;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

let drags = new Set() //set of all active drags
document.addEventListener("touchmove", function (event) {
    if (!event.isTrusted) return //don't react to fake touches
    Array.from(event.changedTouches).forEach(function (touch) {
        drags.add(touch.identifier) //mark this touch as a drag
    })
})
document.addEventListener("touchend", function (event) {
    if (!event.isTrusted) return
    let isDrag = false
    Array.from(event.changedTouches).forEach(function (touch) {
        if (drags.has(touch.identifier)) {
            isDrag = true
        }
        drags.delete(touch.identifier) //touch ended, so delete it
    })
    if (!isDrag && document.activeElement == document.body) {
        //note that double-tap only happens when the body is active
        event.preventDefault() //don't zoom
        event.stopPropagation() //don't relay event
        event.target.focus() //in case it's an input element
        event.target.click() //in case it has a click handler
        event.target.dispatchEvent(new TouchEvent("touchend", event))
        //dispatch a copy of this event (for other touch handlers)
    }
})


// browser //
function browserload() {
    var url = document.getElementById('browserinput').value;
    url = url.replace(/^http:\/\//, '');
    url = url.replace(/^https:\/\//, '');
    url = "https://" + url;
    document.getElementById('browserframe').src = url;
}
$("#browserinput").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        browserload();
    }
});

$('#browserclose').on("click", function () {
    $('#browser').removeClass("active");
    $('#browser').fadeOut(40);
    $('#browsertab').fadeOut(40);
});

$("#browserbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#browser").fadeIn(40);
    $('#browser').addClass("active");
    $(".tbtab").removeClass("active");
    $("#browsertab").fadeIn(40);
    $('#browsertab').addClass("active");
});

// welcome //

$('#welcomeclose').on("click", function () {
    $('#welcome').removeClass("active");
    $('#welcome').fadeOut(40);
    $('#welcometab').fadeOut(40);
});

$("#welcomembtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#welcome").fadeIn(40);
    $('#welcome').addClass("active");
    $(".tbtab").removeClass("active");
    $("#welcometab").fadeIn(40);
    $('#welcometab').addClass("active");
});

// the team //
$('#theteamclose').on("click", function () {
    $('#theteam').removeClass("active");
    $('#theteam').fadeOut(40);
    $('#thetamtab').fadeOut(40);
});

$("#theteambtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#theteam").fadeIn(40);
    $('#theteam').addClass("active");
    $(".tbtab").removeClass("active");
    $("#theteamtab").fadeIn(40);
    $('#theteamtab').addClass("active");
});

// calc //
$('#calcclose').on("click", function () {
    $('#calc').removeClass("active");
    $('#calc').fadeOut(40);
    $('#calctab').fadeOut(40);
});

$("#calcbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#calc").fadeIn(40);
    $('#calc').addClass("active");
    $(".tbtab").removeClass("active");
    $("#calctab").fadeIn(40);
    $('#calctab').addClass("active");
});

// mailingList //
$('#mailingListclose').on("click", function () {
    $('#mailingList').removeClass("active");
    $('#mailingList').fadeOut(40);
    $('#mailingListtab').fadeOut(40);
});

$("#mailingListbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#mailingList").fadeIn(40);
    $('#mailingList').addClass("active");
    $(".tbtab").removeClass("active");
    $("#mailingListtab").fadeIn(40);
    $('#mailingListtab').addClass("active");
});

// kywy //
$('#kywyclose').on("click", function () {
    $('#kywy').removeClass("active");
    $('#kywy').fadeOut(40);
    $('#kywytab').fadeOut(40);
});

$("#kywybtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#kywy").fadeIn(40);
    $('#kywy').addClass("active");
    $(".tbtab").removeClass("active");
    $("#kywytab").fadeIn(40);
    $('#kywytab').addClass("active");
});

$('#githubclose').on("click", function () {
    $('#github').removeClass("active");
    $('#github').fadeOut(40);
    $('#githubtab').fadeOut(40);
});

$("#githubbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#github").fadeIn(40);
    $('#github').addClass("active");
    $(".tbtab").removeClass("active");
    $("#githubtab").fadeIn(40);
    $('#githubtab').addClass("active");
});

$('#privacyclose').on("click", function () {
    $('#privacy').removeClass("active");
    $('#privacy').fadeOut(40);
    $('#privacytab').fadeOut(40);
});

$("#privacybtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#privacy").fadeIn(40);
    $('#privacy').addClass("active");
    $(".tbtab").removeClass("active");
    $("#privacytab").fadeIn(40);
    $('#privacytab').addClass("active");
});


$('#contactclose').on("click", function () {
    $('#contact').removeClass("active");
    $('#contact').fadeOut(40);
    $('#contacttab').fadeOut(40);
});

$("#contactbtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#contact").fadeIn(40);
    $('#contact').addClass("active");
    $(".tbtab").removeClass("active");
    $("#contacttab").fadeIn(40);
    $('#contacttab').addClass("active");
});


// Model3D //
// $('#Model3Dclose').on("click", function () {
//     $('#Model3D').removeClass("active");
//     $('#Model3D').fadeOut(40);
//     $('#Model3Dltab').fadeOut(40);
// });

// $("#Model3Dbtn").click(function () {
//     $("#menu").fadeToggle(40);
//     $("#Model3D").fadeIn(40);
//     $('#Model3D').addClass("active");
//     $(".tbtab").removeClass("active");
//     $("#Model3Dtab").fadeIn(40);
//     $('#Model3Dtab').addClass("active");
// });

// Game //
var highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').innerHTML = highScore;

$('#snakeclose').on("click", function () {
    $('#snake').removeClass("active");
    $('#snake').fadeOut(40);
    $('#snaketab').fadeOut(40);
});

$("#snakebtn").click(function () {
    $("#menu").fadeToggle(40);
    $("#snake").fadeIn(40);
    $('#snake').addClass("active");
    $(".tbtab").removeClass("active");
    $("#snaketab").fadeIn(40);
    $('#snaketab').addClass("active");
});

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var score = 0;
var grid = 8;
var count = 0;

var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
var apple = {
    x: 192,
    y: 192
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
    requestAnimationFrame(loop);
    if (++count < 8) {
        return;
    }
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    context.fillStyle = 'green';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    context.fillStyle = 'white';
    snake.cells.forEach(function (cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score += 1;
            document.getElementById('score').innerHTML = score;
            apple.x = getRandomInt(0, 15) * grid;
            apple.y = getRandomInt(0, 15) * grid;

            // Update high score if current score is greater
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
                document.getElementById('highScore').innerHTML = highScore;
            }
        }

        for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
                score = 0;
                apple.x = getRandomInt(0, 15) * grid;
                apple.y = getRandomInt(0, 15) * grid;
            }
        }
    });
}

document.addEventListener('keydown', function (e) {
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

btn1.onclick = function () {
    if (snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
};
btn2.onclick = function () {
    if (snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
};
btn3.onclick = function () {
    if (snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
};
btn4.onclick = function () {
    if (snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
};

requestAnimationFrame(loop);
// Load high score from localStorage or set to 0 if not available
var highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').innerHTML = highScore;
// Update high score if current score is greater
if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    document.getElementById('highScore').innerHTML = highScore;
}
// Check if current score is greater than high score
if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
    document.getElementById('highScore').innerHTML = highScore;
}


//audio play pause 
function aud_play_pause() {
    var myAudio = document.getElementById("player");
    if (myAudio.paused) {
        myAudio.play();
    } else {
        myAudio.pause();
    }
}

