/* NOTES:
Calling PIXI's drawRect()(http://pixijs.download/dev/docs/PIXI.Graphics.html#drawRect) and giving the x and y values as negative one half of the width and height will change the origin of the rect to the center. For example, if you later change the x value of the rect to the center of the app, it will be properly centered. No clue why. The x and y params don't set the origin; they set the top-left position of the rect with respect to the origin.
To make a value in terms of the other axis (i.e. I want to make a square. I need the scaled height to be scaled in accordance to the scaled width. For example, I want the width to be half the screen's width and the height to equal the width), multiply by the scaling factor from the current axis to the desired (i.e. multiply the desired scaled height in terms of the x axis (.5; one half) and multiply it by the heightToWidthFactor).
The 'animationSpeed' property of PIXI's 'AnimatedSprite' has a value of 1 run at 60 fps, and a value of 1 / 60 run at 1 fps. I believe that, somewhere, the value is being multiplied by 60 to get the framerate. Essentially, the property is a factor applied to 60 to get the real fps. To set the desired fps without inputting it as a factor of 60 fps, set the value to the desired framerate divided by 60 (i.e: for 30 fps, set 'animationSpeed' to 30 / 60).
Text Style Creator: https://pixijs.io/pixi-text-style
*/
"use strict";

let currScreenWidth = 0;
let currScreenHeight = 0;

// Conversion helpers
const widthToHeightFactor = 9 / 16;
const heightToWidthFactor = 16 / 9;

let app;
let appElem;
let projectHousingElement;
const gameObjects = new Array();
const spriteObjs = new Array();

// Game scenes
let startScene, gameScene, gameOverScene, pausedScene;

// Text styles
let titleTextStyle;

let isPaused = false;

// DEBUG STUFFS
let logFPS = false;

// TEST CODE
let idleAnimTest/*, lastFrame, timeSinceAnimUpdate = 0.0;*/

// Set the onload event to the image pre-loader; the init function will be called from there.
window.onload = preload;

function preload() {
    // pre-load images
    PIXI.loader.
        add(["media/images/PC-Idle No Border.png"/*, "images/explosions.png"*/]).
        on("progress", e => { console.log(`progress=${e.progress}`) }).
        load(init);
}

function init() {
    // Console QOL
    document.querySelector("#myConsole").onfocus = (e) => {
        if (e.target.value == "<Please enter a debug command>")
            e.target.value = "";
    }
    document.querySelector("#myConsole").onblur = (e) => {
        if (e.target.value == "")
            e.target.value = "<Please enter a debug command>";
    }
    document.querySelector("#myConsole").onkeydown = (e) => {
        if (e.repeat || e.keyCode != keyboardCode.ENTER) return;
        processDevConsoleInput(e.target.value);
        e.target.value = "";
    }
    // Get the element that houses the app
    /*const */projectHousingElement = document.querySelector("#mainContent");
    //projectHousingElement.innerHTML = "";

    // Get the dimenesions of the app from the housing element
    currScreenWidth = projectHousingElement.clientWidth;
    currScreenHeight = Math.round(projectHousingElement.clientWidth * widthToHeightFactor);

    // Setup canvas
    /*const */app = new PIXI.Application(currScreenWidth, currScreenHeight); if (projectHousingElement.hasChildNodes())
        projectHousingElement.insertBefore(app.view, projectHousingElement.firstElementChild);
    else
        projectHousingElement.appendChild(app.view);
    appElem = document.querySelector("canvas");
    
    // Add text beneath app
    let tempNode = document.createElement("P");
    tempNode.innerHTML = "This game supports window resizing. It only took a full day.";
    projectHousingElement.appendChild(tempNode);

    // Setup input handling
    keySetup();

    // Create text styles
    createTextStyles();

    // Bind resize event
    window.onresize = resizeApp;
    // TEST CODE: create animation
    let idleAnimTextures = loadSpriteSheet("media/images/PC-Idle No Border.png", 256, 256, 8, 4, 2);
    
    let idleAnimTest = createAnim(scaleToScreenWidth(yToX(.5)), scaleToScreenHeight(.5), 256, 256, idleAnimTextures, 15 / 60, true);
    idleAnimTest.anchor = new PIXI.Point(0, 0);
    let idleAnimObj = new SprExtObj(yToX(.5), .5, yToX(.35), .35, idleAnimTest);
    console.log(`x:${idleAnimObj.sprObj.x} y:${idleAnimObj.sprObj.y}`);
    idleAnimObj.sprObj.play();
    //idleAnimObj.sprObj.anchor = new PIXI.Point (0, 0);
    gameObjects.push(idleAnimObj);
    app.stage.addChild(idleAnimObj.sprObj);
    // TEST CODE: Add text
    let titleTest = new TextObj(.5, 0, .75, .25, "Shifting Hues", titleTextStyle);
    //titleTest.textObj.anchor = 0;
    titleTest.textObj.anchor = new PIXI.Point(.5, 0);
    app.stage.addChild(titleTest.textObj);
    gameObjects.push(titleTest);

    //let textTest2 = new PIXI.Text("Shifting Hues", titleTextStyle);
    //textTest2.x = 0;
    //textTest2.y = 0;
    //app.stage.addChild(textTest2);
    //oldCode();

    // Start update loop
    app.ticker.add(gameLoop);


}
//function oldCode() {
//    // #1 - make some squares
//    const s1 = makeRectangle();
//    s1.x = 100;
//    s1.y = 100;

//    const s2 = makeRectangle(80, 40, 0xFF00FF);
//    s2.x = 200;
//    s2.y = 100;

//    // HW 1: add rounded rect

//    let roundedRect = makeRoundedRectangle(100, 50, 0xFFFFFF);
//    roundedRect.x += 350;
//    roundedRect.y += 100;

//    app.stage.addChild(s1);
//    app.stage.addChild(s2);
//    app.stage.addChild(roundedRect);

//    // #2 - make some PixiJS buttons
//    // http://pixijs.download/release/docs/PIXI.Sprite.html
//    const b1 = PIXI.Sprite.fromImage('media/button-130.png');
//    b1.buttonMode = true;
//    b1.anchor.set(0.5);
//    b1.x = 100;
//    b1.y = 200;
//    app.stage.addChild(b1);

//    const b2 = PIXI.Sprite.fromImage('media/button-130.png');
//    b2.buttonMode = true;
//    b2.anchor.set(0.5);
//    b2.x = 250;
//    b2.y = 200;
//    app.stage.addChild(b2);

//    const b3 = PIXI.Sprite.fromImage('media/button-130.png');
//    b3.buttonMode = true;
//    b3.anchor.set(0.5);
//    b3.x = 400;
//    b3.y = 200;
//    app.stage.addChild(b3);

//    // #3 add events to the buttons
//    b1.interactive = true;
//    // element.on('event-name',function-to-call);
//    b1.on('pointerup', e => { s1.rotation += Math.PI / 12; s2.rotation -= Math.PI / 12; roundedRect.rotation -= Math.PI / 12; });

//    b2.interactive = true;
//    b2.on('pointerup', e => { s1.height += 20; s1.width += 20; s2.height += 20; s2.width += 20; roundedRect.height += 20; roundedRect.width += 20; });

//    b3.interactive = true;
//    b3.on('pointerup', e => { s1.height -= 20; s1.width -= 20; s2.height -= 20; s2.width -= 20; roundedRect.height -= 20; roundedRect.width -= 20; });

//    // #4 make b1 act more like a button (mouseover,mousedown etc)
//    b1.on('pointerover', e => { e.target.tint = 0xBBBBBB });
//    b1.on('pointerdown', e => { e.target.tint = 0x888888 });
//    b1.on('pointerup', e => { e.target.tint = 0xBBBBBB });
//    b1.on('pointerout', e => { e.currentTarget.tint = 0xFFFFFF });
//    b1.on('pointerupoutside', e => { e.target.tint = 0xFFFFFF });
//}


// Makes a rectangle w/ an origin at the center of the rectangle.
// See: http://pixijs.download/dev/docs/PIXI.Graphics.html#drawRect http://pixijs.download/dev/docs/PIXI.Graphics.html

function gameLoop() {
    // Pause check
    if (isPaused) return;

    // Calculate deltaTime
    let deltaTime = 1 / app.ticker.FPS;
    if (logFPS) {
        console.log(`FPS: ${app.ticker.FPS} fps`);
        console.log(`Delta Time: ${deltaTime} seconds`);
    }

    // Update keyData
    updateKeyData();

    // TEST CODE: Update frame change time
    //timeSinceAnimUpdate += deltaTime;
    //if (lastFrame != idleAnimTest.currentFrame) {
    //    console.log(`Time since last anim update: ${timeSinceAnimUpdate}s`);
    //    console.log(`Animation FPS: ${1 / timeSinceAnimUpdate}s`);
    //    lastFrame = idleAnimTest.currentFrame;
    //    timeSinceAnimUpdate = 0;
    //}


}

function createTextStyles() {
    titleTextStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 32,
        fontFamily: "Finger Paint"/*"Verdana"*//*,*/
        //fontStyle: "italic",
        //stroke: 0xFF0000,
        //strokeThickness: 6
    });
}

function resizeApp() {
    // 1. Remove the renderer to allow the projectHousingElement to naturally find its new size
    let canvasNode = projectHousingElement.removeChild(document.querySelector("canvas"));

    // 2. Get the new size values
    currScreenWidth = projectHousingElement.clientWidth;
    currScreenHeight = Math.round(projectHousingElement.clientWidth * widthToHeightFactor);

    // 3. Add the projectHousingElement back in; even though this causes the dimensions to change again, they will revert once we adjust the size of the renderer
    if (projectHousingElement.hasChildNodes())
        projectHousingElement.insertBefore(canvasNode, projectHousingElement.firstElementChild);
    else
        projectHousingElement.appendChild(canvasNode);

    if (app.view.width == currScreenWidth && app.view.width == currScreenWidth) return;

    // 4. adjust the size of the renderer
    app.renderer.resize(currScreenWidth, currScreenHeight);

    // Add code to reposition and resize game objects
    for (let i = 0; i < gameObjects.length; i++/*let obj in gameObjects*/) {
        //obj.scaleObject(prevScreenWidth, prevScreenHeight, currScreenWidth, currScreenHeight);
        //gameObjects[i].scaleObject(prevScreenWidth, prevScreenHeight, currScreenWidth, currScreenHeight);
        gameObjects[i].scaleObj();
    }
    for (let i = 0; i < spriteObjs.length; i++) {
        resizeSpriteFromDataObj(spriteObjs[i]);
    }
}