function keySetup() {
    const keyboard = Object.freeze({
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
        M:      77
    });

    // this is the "key daemon" that we poll every frame
    const keys = [];
    const keysLast = [];

    window.onkeyup = (e) => {
        //console.log("keyup=" + e.keyCode);
        keys[e.keyCode] = false;
        keysLast[e.keyCode] = false;
        e.preventDefault();
    };

    window.onkeydown = (e) => {
        console.log("keydown=" + e.keyCode);
        if (keys[e.keyCode] == true)
            keysLast[e.keyCode] = true;
        keys[e.keyCode] = true;
        let mousePosition = app.renderer.plugins.interaction.mouse.global;
        if (e.keyCode == keyboard.M)
            console.log(`mouseX:${mousePosition.x} mouseY:${mousePosition.y}`);
        // checking for other keys - ex. 'p' and 'P' for pausing
        //var char = String.fromCharCode(e.keyCode);
        //if (char == "p" || char == "P") {
        //    // do something
        //}
    };
}

function getKey(keyCode) {
    return keys[keyCode];
}

function getKeyDown(keyCode) {
    return keys[keyCode] && !keysLast[keyCode];
}

//function getKeyUp(keyCode) {
//    return
//}