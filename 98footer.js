$("#startbtn").click(function () {
    $("#menu").fadeToggle(40);
});
// Close menu if clicking outside of it
$(document).on('mousedown touchstart', function (e) {
    var $menu = $('#menu');
    var $startbtn = $('#startbtn');
    if ($menu.is(':visible')) {
        // If click is outside menu and not on start button
        if (!$menu.is(e.target) && $menu.has(e.target).length === 0 && !$startbtn.is(e.target)) {
            $menu.fadeOut(40);
        }
    }
});

// Make all windows draggable and resizable
$(function () {
    $(".window.drag.res").draggable({
        handle: ".title-bar",
        containment: "body",
        start: function () {
            bringToFront($(this));
        }
    });
    $(".window.drag.res").resizable({
        minWidth: 300,
        minHeight: 200,
        start: function () {
            bringToFront($(this));
        }
    });
});

var activetab = "";
var topZ = 3000; // base z-index for windows

function bringToFront($win) {
    if (!$win || !$win.length) return;
    // remove active from others
    $(".window").not("#taskbar").removeClass("active");
    $(".tbtab").removeClass("active");
    $win.addClass("active");
    // reset other windows to baseline z-index so this window can be clearly on top
    var baseline = 1000;
    $('.window').not('#taskbar').css('z-index', baseline);
    // bump z-index for the focused window
    topZ += 1;
    $win.css('z-index', topZ);
    activetab = $win.attr("id") + "tab";
    if ($("#" + activetab).length) {
        $("#" + activetab).addClass("active");
    }
    // make only the active window's iframe interactive
    $('.window').not('#taskbar').each(function () {
        var $w = $(this);
        var $ifr = $w.find('iframe');
        if (!$ifr.length) return;
        if ($w.is($win)) {
            $ifr.css('pointer-events', 'auto');
        } else {
            $ifr.css('pointer-events', 'none');
        }
    });

    // Manage iframe wrapper stacking so inactive iframes don't visually overlap
    $('.window').not('#taskbar').each(function () {
        var $w = $(this);
        var $wrap = $w.find('.iframe-wrapper');
        if (!$wrap.length) return;
        if ($w.is($win)) {
            // ensure the wrapper is below the titlebar but above window body background
            $wrap.css('z-index', 50);
        } else {
            $wrap.css('z-index', 0);
        }
    });
}

// Wrap raw iframe elements in a positioned wrapper so we can control stacking
function wrapIframes() {
    $('.window').each(function () {
        var $w = $(this);
        $w.find('iframe').each(function () {
            var $iframe = $(this);
            if ($iframe.parent().hasClass('iframe-wrapper')) return;
            var $wrap = $('<div class="iframe-wrapper"></div>');
            $iframe.after($wrap);
            $wrap.append($iframe);
        });
    });
}

// Run wrapping once on load
$(function () {
    wrapIframes();
});

// Generic handler: clicking a taskbar tab toggles the corresponding window
$(document).on('click', '.tbtab', function (e) {
    var tabId = $(this).attr('id');
    if (!tabId) return;
    // canonical mapping: <windowId>tab -> #<windowId>
    var winId = tabId.replace(/tab$/, '');
    var $win = $('#' + winId);
    if (!$win.length) return;
    if ($win.is(':visible')) {
        // minimize/hide (consistent for all windows)
        $win.removeClass('active');
        $win.fadeOut(40);
        $(this).removeClass('active');
    } else {
        // show and bring to front
        $win.fadeIn(40);
        $win.addClass('active');
        $('.tbtab').removeClass('active');
        $(this).addClass('active');
        bringToFront($win);
        // ensure overlays/iframe wiring for iframe windows
        addIframeOverlay(winId);
    }
});

// Create a taskbar tab for a window if it doesn't exist
function ensureTaskbarTab(windowId, label) {
    var tabId = windowId + 'tab';
    if ($('#' + tabId).length) return;
    var $btn = $('<button/>', { class: 'tbtab', id: tabId }).html('<span>' + label + '</span>');
    // Tab click logic is handled globally for .tbtab, so no need to add another click handler here
    $('#items').append($btn);
}

// Add an overlay on top of an iframe to capture first click and bring window to front
function addIframeOverlay(windowId) {
    var $win = $('#' + windowId);
    if (!$win.length) return;
    // remove existing overlay
    $win.find('.iframe-click-overlay').remove();
    var $overlay = $('<div/>', { class: 'iframe-click-overlay' });
    $overlay.on('mousedown touchstart', function (e) {
        e.preventDefault();
        bringToFront($win);
        // remove overlay so iframe becomes interactive
        $overlay.remove();
        // wire iframe focus handlers for subsequent interactions
        wireIframeFocus(windowId);
    });
    $win.append($overlay);
    // also wire iframe focus now (in case overlay is removed by other means)
    wireIframeFocus(windowId);
}

// Wire iframe pointer events so parent can bring window to front on subsequent interactions
function wireIframeFocus(windowId) {
    var $win = $('#' + windowId);
    if (!$win.length) return;
    var $iframe = $win.find('iframe');
    if (!$iframe.length) return;
    // remove previous handlers
    $iframe.off('.kywyFocus');
    // pointerdown/enter on iframe element (not inside) will bring parent window to front
    $iframe.on('pointerdown.kywyFocus pointerenter.kywyFocus', function (e) {
        bringToFront($win);
    });
}

// Bring window to front on mousedown (works even if click occurs inside iframe for parent container)
$(document).on('mousedown', '.window', function (e) {
    if ($(this).attr('id') === 'taskbar') return;
    bringToFront($(this));
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
    $('#menu').fadeOut(40);
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
    $('#menu').fadeOut(40);
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
    $('#theteamtab').remove();
});

$("#theteambtn").click(function () {
    $('#menu').fadeOut(40);
    $("#theteam").fadeIn(40);
    $('#theteam').addClass("active");
    $(".tbtab").removeClass("active");
    $("#theteamtab").fadeIn(40);
    $('#theteamtab').addClass("active");
});

// Legacy calc handlers removed; use the new `#blogwindow` iframe instead

// KYWY Docs window open/close
$('#docsclose').on("click", function () {
    $('#docswindow').removeClass("active");
    $('#docswindow').fadeOut(40);
    $('#docswindowtab').remove();
});
$("#docsbtn").click(function () {
    $('#menu').fadeOut(40);
    $('#docswindow').fadeIn(40);
    $('#docswindow').addClass("active");
    bringToFront($('#docswindow'));
});

// Privacy Policy window open/close
$('#privacywindowclose').on("click", function () {
    $('#privacywindow').removeClass("active");
    $('#privacywindow').fadeOut(40);
    $('#privacywindowtab').remove();
});
$("#privacybtn").click(function () {
    $('#menu').fadeOut(40);
    $('#privacywindow').fadeIn(40);
    $('#privacywindow').addClass("active");
    bringToFront($('#privacywindow'));
});

// Paint window open/close
$('#paintclose').on("click", function () {
    $('#paintwindow').removeClass("active");
    $('#paintwindow').fadeOut(40);
    $('#paintwindowtab').remove();
});

$("#paintbtn").click(function () {
    $('#menu').fadeOut(40);
    $('#paintwindow').fadeIn(40);
    $('#paintwindow').addClass("active");
    bringToFront($('#paintwindow'));
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
    $('#menu').fadeOut(40);
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

// Utility to add fullscreen button behavior
function addFullscreenButton(windowId, iframeSelector, url) {
    const win = document.getElementById(windowId);
    if (!win) return;
    const titleBarControls = win.querySelector('.title-bar-controls');
    if (!titleBarControls) return;
    // Create fullscreen button
    const fsBtn = document.createElement('button');
    fsBtn.setAttribute('aria-label', 'Fullscreen');
    fsBtn.innerHTML = '⛶';
    fsBtn.style.marginRight = '4px';
    fsBtn.onclick = function(e) {
        e.stopPropagation();
        window.open(url, '_blank');
    };
    // Insert before close button
    titleBarControls.insertBefore(fsBtn, titleBarControls.firstChild);
}

// Add fullscreen buttons to all windows
addFullscreenButton('paintwindow', 'iframe', 'https://tools.kywy.io/drawing-editor.html');
addFullscreenButton('blogwindow', 'iframe', 'blog.html');
addFullscreenButton('githubwindow', 'iframe', 'https://github.com/KOINSLOT-Inc');
addFullscreenButton('docswindow', 'iframe', 'https://docs.kywy.io');
addFullscreenButton('privacywindow', 'iframe', 'legal.html');
addFullscreenButton('featured-games-window', 'iframe', 'featured-games.html');

// Fix window opening so windows stay open after start menu closes
$('#paintbtn').click(function () {
    $('#paintwindow').fadeIn(40);
    $('#paintwindow').addClass('active');
    ensureTaskbarTab('paintwindow', 'Paint');
    bringToFront($('#paintwindow'));
    addIframeOverlay('paintwindow');
});
$('#paintclose').on("click", function () {
    $('#paintwindow').removeClass('active');
    $('#paintwindow').fadeOut(40);
});

$('#calcbtn').click(function () {
    $('#blogwindow').fadeIn(40);
    $('#blogwindow').addClass('active');
    ensureTaskbarTab('blogwindow', 'Blog');
    bringToFront($('#blogwindow'));
    addIframeOverlay('blogwindow');
});
$('#blogclose').on("click", function () {
    $('#blogwindow').removeClass('active');
    $('#blogwindow').fadeOut(40);
    $('#blogwindowtab').remove();
});

$('#githubbtn').click(function () {
    $('#menu').fadeOut(40);
    window.open('https://github.com/KOINSLOT-Inc', '_blank');
});
$('#githubclose').on("click", function () {
    $('#githubwindow').removeClass('active');
    $('#githubwindow').fadeOut(40);
});

// Defensive: also handle any close button inside the github window (in case ID isn't reachable)
$('#githubwindow').on('click', '.title-bar-controls button[aria-label="Close"]', function () {
    $('#githubwindow').removeClass('active');
    $('#githubwindow').fadeOut(40);
});

$('#docsbtn').click(function () {
    $('#docswindow').fadeIn(40);
    $('#docswindow').addClass('active');
    ensureTaskbarTab('docswindow', 'Docs');
    bringToFront($('#docswindow'));
    addIframeOverlay('docswindow');
});
// Discord
$('#contactbtn').click(function () {
    $('#menu').fadeOut(40);
    window.open('https://discord.com/invite/zAYym57Fy6', '_blank');
});
$('#docsclose').on("click", function () {
    $('#docswindow').removeClass('active');
    $('#docswindow').fadeOut(40);
});

$('#privacybtn').click(function () {
    $('#privacywindow').fadeIn(40);
    $('#privacywindow').addClass('active');
    ensureTaskbarTab('privacywindow', 'Privacy');
    bringToFront($('#privacywindow'));
    addIframeOverlay('privacywindow');
});
$('#privacywindowclose').on("click", function () {
    $('#privacywindow').removeClass('active');
    $('#privacywindow').fadeOut(40);
});

$('#featured-games-btn').click(function () {
    $('#featured-games-window').fadeIn(40);
    $('#featured-games-window').addClass('active');
    ensureTaskbarTab('featured-games-window', 'Games');
    bringToFront($('#featured-games-window'));
    addIframeOverlay('featured-games-window');
});
$('#featured-games-close').on("click", function () {
    $('#featured-games-window').removeClass('active');
    $('#featured-games-window').fadeOut(40);
    $('#featured-games-windowtab').remove();
});

// Desktop icon handler for Featured Games
$('#featured-games-desktop-icon').on('click', function () {
    $('#featured-games-window').fadeIn(40);
    $('#featured-games-window').addClass('active');
    ensureTaskbarTab('featured-games-window', 'Games');
    bringToFront($('#featured-games-window'));
    addIframeOverlay('featured-games-window');
});

// Store window handlers
$('#storebtn').click(function () {
    $('#storewindow').fadeIn(40);
    $('#storewindow').addClass('active');
    ensureTaskbarTab('storewindow', 'Store');
    bringToFront($('#storewindow'));
    addIframeOverlay('storewindow');
});
$('#storeclose').on("click", function () {
    $('#storewindow').removeClass('active');
    $('#storewindow').fadeOut(40);
    $('#storewindowtab').remove();
});
$('#storemaximize').on("click", function () {
    const storeWindow = $('#storewindow');
    if (storeWindow.hasClass('maximized')) {
        // Restore window
        storeWindow.removeClass('maximized');
        storeWindow.css({
            width: '800px',
            height: '600px',
            top: '100px',
            left: '100px'
        });
    } else {
        // Maximize window
        storeWindow.addClass('maximized');
        storeWindow.css({
            width: '100vw',
            height: '100vh',
            top: '0px',
            left: '0px'
        });
    }
});

// Desktop icon handler for Store
$('#store-desktop-icon').on('click', function () {
    $('#storewindow').fadeIn(40);
    $('#storewindow').addClass('active');
    ensureTaskbarTab('storewindow', 'Store');
    bringToFront($('#storewindow'));
    addIframeOverlay('storewindow');
});

// PayPal Store window handlers
$('#paypal-store-btn').click(function () {
    $('#paypal-store-window').fadeIn(40);
    $('#paypal-store-window').addClass('active');
    ensureTaskbarTab('paypal-store-window', 'KYWY Store');
    bringToFront($('#paypal-store-window'));
    addIframeOverlay('paypal-store-window');
});
$('#paypal-store-close').on("click", function () {
    $('#paypal-store-window').removeClass('active');
    $('#paypal-store-window').fadeOut(40);
    $('#paypal-store-windowtab').remove();
});

// KYWY Classroom Donate window handlers
$('#classroom-donate-btn').click(function () {
    $('#classroom-donate-window').fadeIn(40);
    $('#classroom-donate-window').addClass('active');
    ensureTaskbarTab('classroom-donate-window', 'KYWY Classroom');
    bringToFront($('#classroom-donate-window'));
    addIframeOverlay('classroom-donate-window');
});
$('#classroom-donate-close').on("click", function () {
    $('#classroom-donate-window').removeClass('active');
    $('#classroom-donate-window').fadeOut(40);
    $('#classroom-donate-windowtab').remove();
});

// Desktop icon handlers for PayPal pages
$('#paypal-store-desktop-icon').on('click', function () {
    $('#paypal-store-window').fadeIn(40);
    $('#paypal-store-window').addClass('active');
    ensureTaskbarTab('paypal-store-window', 'KYWY Store');
    bringToFront($('#paypal-store-window'));
    addIframeOverlay('paypal-store-window');
});

$('#classroom-donate-desktop-icon').on('click', function () {
    $('#classroom-donate-window').fadeIn(40);
    $('#classroom-donate-window').addClass('active');
    ensureTaskbarTab('classroom-donate-window', 'KYWY Classroom');
    bringToFront($('#classroom-donate-window'));
    addIframeOverlay('classroom-donate-window');
});
