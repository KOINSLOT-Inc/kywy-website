// WEBASSEMBLY
"use strict";
let memory = new WebAssembly.Memory({ initial: 108 });

/*stdout and stderr goes here*/
const output = document.getElementById("output");

function readWasmString(offset, length) {
    const bytes = new Uint8Array(memory.buffer, offset, length);
    return new TextDecoder("utf8").decode(bytes);
}

function consoleLogString(offset, length) {
    const string = readWasmString(offset, length);
}

function appendOutput(style) {
    return function (offset, length) {
        const lines = readWasmString(offset, length).split("\n");
        for (var i = 0; i < lines.length; ++i) {
            if (lines[i].length == 0) {
                continue;
            }
        }
    };
}

/*stats about how often doom polls the time*/
let getms_calls_total = 0;
let getms_calls = 0; // in current second
window.setInterval(() => {
    getms_calls_total += getms_calls;
    getms_calls = 0;
}, 1000);

function getMilliseconds() {
    ++getms_calls;
    return performance.now();
}

/*doom is rendered here*/
const canvas = document.getElementById("screen");
const doom_screen_width = 640;
const doom_screen_height = 400;

/*printing stats*/
let number_of_draws_total = 0;
let number_of_draws = 0; // in current second
window.setInterval(function () {
    number_of_draws_total += number_of_draws;
    number_of_draws = 0;
}, 1000);

function drawCanvas(ptr) {
    let doom_screen = new Uint8ClampedArray(
        memory.buffer,
        ptr,
        doom_screen_width * doom_screen_height * 4
    );
    let render_screen = new ImageData(
        doom_screen,
        doom_screen_width,
        doom_screen_height
    );
    let ctx = canvas.getContext("2d");

    ctx.putImageData(render_screen, 0, 0);

    ++number_of_draws;
}

/*These functions will be available in WebAssembly. We also share the memory to share larger amounts of data with javascript, e.g. strings of the video output.*/
let importObject = {
    js: {
        js_console_log: appendOutput("log"),
        js_stdout: appendOutput("stdout"),
        js_stderr: appendOutput("stderr"),
        js_milliseconds_since_start: getMilliseconds,
        js_draw_screen: drawCanvas
    },
    env: {
        memory: memory
    }
};

WebAssembly.instantiateStreaming(
    fetch("https://diekmann.github.io/wasm-fizzbuzz/doom/doom.wasm"),
    importObject
).then((obj) => {
    /*Initialize Doom*/
    obj.instance.exports.main();

    /*input handling*/
    let doomKeyCode = function (keyCode) {
        // Doom seems to use mostly the same keycodes, except for the following (maybe I'm missing a few.)
        switch (keyCode) {
            case 8:
                return 127; // KEY_BACKSPACE
            case 17:
                return 0x80 + 0x1d; // KEY_RCTRL
            case 18:
                return 0x80 + 0x38; // KEY_RALT
            case 37:
                return 0xac; // KEY_LEFTARROW
            case 38:
                return 0xad; // KEY_UPARROW
            case 39:
                return 0xae; // KEY_RIGHTARROW
            case 40:
                return 0xaf; // KEY_DOWNARROW
            default:
                if (keyCode >= 65 /*A*/ && keyCode <= 90 /*Z*/) {
                    return keyCode + 32; // ASCII to lower case
                }
                if (keyCode >= 112 /*F1*/ && keyCode <= 123 /*F12*/) {
                    return keyCode + 75; // KEY_F1
                }
                return keyCode;
        }
    };
    let keyDown = function (keyCode) {
        obj.instance.exports.add_browser_event(0 /*KeyDown*/, keyCode);
    };
    let keyUp = function (keyCode) {
        obj.instance.exports.add_browser_event(1 /*KeyUp*/, keyCode);
    };

    /*keyboard input*/
    canvas.addEventListener("keydown", (event) => {
        keyDown(doomKeyCode(event.keyCode));
        event.preventDefault();
    },
        false
    );
    canvas.addEventListener("keyup", (event) => {
        keyUp(doomKeyCode(event.keyCode));
        event.preventDefault();
    },
        false
    );

    /*mobile touch input*/
    [
        ["enterButton", 13],
        ["leftButton", 0xac],
        ["rightButton", 0xae],
        ["upButton", 0xad],
        ["downButton", 0xaf],
        ["ctrlButton", 0x80 + 0x1d],
        ["spaceButton", 32]
    ].forEach(([elementID, keyCode]) => {
        let button = document.querySelector(`.${elementID}`);
        button.addEventListener("touchstart", () => keyDown(keyCode));
        button.addEventListener("touchend", () => keyUp(keyCode));
        button.addEventListener("touchcancel", () => keyUp(keyCode));
        button.addEventListener("mousedown", () => keyDown(keyCode));
        button.addEventListener("mouseup", () => keyUp(keyCode));
    });

    canvas.addEventListener(
        "focusout",
        function (e) {
            // 		focushint.innerText =
            // 			"Click on the canvas to capture input and start playing.";
            // 		focushint.style.fontWeight = "bold";
        },
        false
    );

    // canvas.focus();

    /*printing stats*/
    let number_of_animation_frames = 0; // in current second
    window.setInterval(function () {
        number_of_animation_frames = 0;
    }, 1000);

    /*Main game loop*/
    function step(timestamp) {
        ++number_of_animation_frames;
        obj.instance.exports.doom_loop_step();
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
});