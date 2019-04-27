// Array of keyboard events
const events = new Array();
// Object containing keycodes for certain keys; acts similarly to C#'s 'Keys.Up' enum
const keyboardCode = Object.freeze({
    TILDE:  192,
    TAB:    9,
    ENTER:  13,
    SHIFT:  16,
    CTRL:   17,
    SPACE:  32,
    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40,
    W:      87,
    A:      65,
    S:      83,
    D:      68,
    P:      80,
    M:      77,
    F:      70
});
const keyboardKey = Object.freeze({
    TILDE:  192,
    TAB:    9,
    ENTER:  13,
    SHIFT:  16,
    CTRL:   17,
    SPACE:  32,
    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40,
    W:      87,
    A:      65,
    S:      83,
    D:      68,
    P:      80,
    M:      77,
    F:      70
});

// this is the "key daemon" that we poll every frame
const keys = [];
// The same thing, but for the last update (at least, that's the idea)
const keysLast = [];

let keyState = [];
let keyStateLast = [];
function keySetup() {
    window.onkeyup = (e) => {
        //console.log("keyup=" + e.keyCode);
        keys[e.keyCode] = false;
        keysLast[e.keyCode] = false;
        e.preventDefault();
    };

    window.onkeydown = (e) => {
        //console.log("keydown=" + e.keyCode);
        if (keys[e.keyCode] == true)
            keysLast[e.keyCode] = true;
        keys[e.keyCode] = true;

        // Theortically should allow for events to be hooked to keys
        if (events.length != 0) {
            for (let i = 0; i < events.length; i++) {
                if (e.keyCode == events[i]['keyCode']) {
                    events[i].eventFunc(e);
                }
            }
        }

        let mousePosition = app.renderer.plugins.interaction.mouse.global;
        if (e.keyCode == keyboardCode.M)
            console.log(`mouseX:${mousePosition.x} mouseY:${mousePosition.y}`);
        //if (e.keyCode == keyboardCode.P) {
        //    isPaused = !isPaused;
        //    console.log(`isPaused: ${isPaused}`);
        //}
        if (e.keyCode == keyboardCode.F) {
            logFPS = !logFPS;
            console.log(`logFPS: ${logFPS}`);
        }
        if (e.keyCode == keyboardCode.TILDE) {
            let mycnsle = document.querySelector("#myConsole");
            if (mycnsle.style.display == "none") {
                mycnsle.style.display = "block";
            }
            else {
                mycnsle.style.display = "none";
            }
        }
        // checking for other keys - ex. 'p' and 'P' for pausing
        //var char = String.fromCharCode(e.keyCode);
        //if (char == "p" || char == "P") {
        //    // do something
        //}
    };
}

function updateKeyData() {
    keyStateLast = keyState.slice();
    keyState = keys.slice();
}

function getKey(keyCode) {
    //return keys[keyCode];
    return keyState[keyCode];
}

function getKeyDown(keyCode) {
    //return keys[keyCode] && !keysLast[keyCode];
    return keyState[keyCode] && !keyStateLast[keyCode];
}

function getKeyUp(keyCode) {
    return !keyState[keyCode] && keyStateLast[keyCode];
}

function EventInfo(keyCode, eventFunc) {
    this.keyCode = keyCode;
    this.eventFunc = eventFunc;
}

// TODO: Test
function bindKeyDown(keyCode, eventFunction) {
    events.push(new EventInfo(keyCode, eventFunction));
}