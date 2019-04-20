/*NOTES:
 
Calling PIXI's drawRect()(http://pixijs.download/dev/docs/PIXI.Graphics.html#drawRect) and giving the x and y values as negative one half of the width and height will change the origin of the rect to the center. For example, if you later change the x value of the rect to the center of the app, it will be properly centered. No clue why. The x and y params don't set the origin; they set the top-left position of the rect with respect to the origin.
 
To make a value in terms of the other axis (i.e. I want to make a square. I need the scaled height to be scaled in accordance to the scaled width. For example, I want the width to be half the screen's width and the height to equal the width), multiply by the scaling factor from the current axis to the desired (i.e. multiply the desired scaled height in terms of the x axis (.5; one half) and multiply it by the heightToWidthFactor).

 */

let currScreenWidth = 0;
let currScreenHeight = 0;
const widthToHeightFactor = 9 / 16;
const heightToWidthFactor = 16 / 9;
let app;
let projectHousingElement;
const gameObjects = new Array();

window.onload = init;
function init() {
    // Setup canvas
    /*const */projectHousingElement = document.querySelector("#mainContent");
    projectHousingElement.innerHTML = "";
    
    currScreenWidth = projectHousingElement.clientWidth;
    currScreenHeight = Math.round(projectHousingElement.clientWidth * widthToHeightFactor);

    /*const */app = new PIXI.Application(currScreenWidth, currScreenHeight);
    projectHousingElement.appendChild(app.view);

    //projectHousingElement.innerHTML += "<p>This game supports window resizing. It only took a full day.</p>";
    let tempNode = document.createElement("P");
    tempNode.innerHTML = "This game supports window resizing. It only took a full day.";
    projectHousingElement.appendChild(tempNode);

    // Setup input handling
    keySetup();

    // pre-load images
    PIXI.loader.
        add(["media/images/PC-Idle No Border.png"/*, "images/explosions.png"*/]).
        on("progress", e => { console.log(`progress=${e.progress}`) }).
        load(setup);

    window.onresize = resizeApp;

    //const gameObjects = new Array();

    let tR2 = new RectObj(.5, .5, yToX(.5)/*.5 * widthToHeightFactor*/, .5);
    let bTest = new Button(.05/* + (.25 / 2)*/, xToY(.05), .25, .25 * (35 / 130) * heightToWidthFactor);
    bTest.anchorX = 0;
    bTest.anchorY = 0;
    //bTest.scaleX = .2;
    //bTest.scaleY = xToY(.2);
    //bTest.anchorX = .5;
    //bTest.anchorY = .5;

    //bTest.zIndex = 5;
    //let tR2 = makeCenteredScaleRect(.5, .5, .5 * widthToHeightFactor, .5);
    //tR2.x = scaleToScreenWidth(.5);
    //tR2.y = scaleToScreenHeight(.5);
    //let testRect = new RectObj(.5, .5, .25, .25);
    //gameObjects.push(testRect);
    //app.stage.addChild(testRect.rect);
    //app.stage.addChild(tR2);
    //app.stage.addChild(tR2.rect); // Auto added
    //app.stage.addChild(bTest.sprite);
    //console.log(`x=${tR2.x} y=${tR2.y}`);
    //console.log(`w=${tR2.width} h=${tR2.height}`);
    //console.log(`x=${tr3.x} y=${tr3.y}`);
    //console.log(`w=${tr3.width} h=${tr3.height}`);
    gameObjects.push(tR2);
    gameObjects.push(bTest);


    //gameObjects.push();
    //oldCode();
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

function makeCenteredScaleRect(scaleX = 0, scaleY = 0,
                               scaleWidth = .25, scaleHeight = .25, 
                               borderWidth = 4, 
                               color = 0xFF0000, 
                               outlineColor = 0xFFFF00) {
    // http://pixijs.download/dev/docs/PIXI.Graphics.html
    let rect = new PIXI.Graphics();
    let screenWidth = scaleToScreenWidth(scaleWidth);
    let screenHeight = scaleToScreenHeight(scaleHeight);
    rect.beginFill(color);
    rect.lineStyle(borderWidth, outlineColor, 1);
    rect.drawRect(-Math.round(screenWidth * .5), -Math.round(screenHeight * .5), screenWidth, screenHeight);
    rect.endFill();
    rect.x = scaleToScreenWidth(scaleX);
    rect.y = scaleToScreenHeight(scaleY);
    return rect;
}

// Makes a rectangle w/ a top-left corner offset of the specified value.
// Notes: By top-left corner offset, I mean entering the distance the top-left corner is from the origin, and, consequently, the origin. For example, entering negative half the width & height will set the top-left there, and, therefore, set the origin at the center.
// See: http://pixijs.download/dev/docs/PIXI.Graphics.html#drawRect http://pixijs.download/dev/docs/PIXI.Graphics.html
function makeScaleRect(scaleX = 0, scaleY = 0, 
                       scaleWidth = .25, scaleHeight = .25, 
                       scaleCornerOffsetX = 0, scaleCornerOffsetY = 0, 
                       borderWidth = 0, 
                       color = 0xFF0000, 
                       outlineColor = 0xFFFF00) {
    // http://pixijs.download/dev/docs/PIXI.Graphics.html
    let rect = new PIXI.Graphics();
    let screenWidth = scaleToScreenWidth(scaleWidth);
    let screenHeight = scaleToScreenHeight(scaleHeight);
    let screenCornerOffsetX = scaleToScreenWidth(scaleCornerOffsetX);
    let screenCornerOffsetY = scaleToScreenHeight(scaleCornerOffsetY);
    rect.beginFill(color);
    rect.lineStyle(borderWidth, outlineColor, 1);
    rect.drawRect(screenCornerOffsetX, screenCornerOffsetY, screenWidth, screenHeight);
    rect.endFill();
    rect.x = scaleToScreenWidth(scaleX);
    rect.y = scaleToScreenHeight(scaleY);
    return rect;
}

function makeRectangle(screenWidth = 50, screenHeight = 50, color = 0xFF0000, outlineColor = 0xFFFF00) {
    // http://pixijs.download/dev/docs/PIXI.Graphics.html
    let rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.lineStyle(4, outlineColor, 1);
    // Makes a rect w/ an origin at the center
    rect.drawRect(-screenWidth * .5, -screenHeight * .5, screenWidth, screenHeight);
    rect.endFill();
    return rect;
}

function makeRoundedRectangle(screenWidth = 50, screenHeight = 50, color = 0xFF0000, outlineColor = 0xFFFF00) {
    // http://pixijs.download/dev/docs/PIXI.Graphics.html
    let rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.lineStyle(4, outlineColor, 1);
    rect.drawRoundedRect(-screenWidth * .5, -screenHeight * .5, screenWidth, screenHeight);
    rect.endFill();
    return rect;
}

function resizeApp() {
    //let parent = app.view.parentNode;
    //currScreenWidth = parent.clientWidth;
    //currScreenHeight = parent.clientHeight;
    let prevScreenWidth = app.view.width;
    let prevScreenHeight = app.view.height;

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

    // 4. adjust the size of the renderer
    app.renderer.resize(currScreenWidth, currScreenHeight);

    // TODO: Add code to reposition and resize game objects
    for (let i = 0; i < gameObjects.length; i++/*let obj in gameObjects*/) {
        //obj.scaleObject(prevScreenWidth, prevScreenHeight, currScreenWidth, currScreenHeight);
        gameObjects[i].scaleObject(prevScreenWidth, prevScreenHeight, currScreenWidth, currScreenHeight);
    }
}

function scaleToScreenWidth(num) {
    return Math.round(num * currScreenWidth);
}

function scaleToScreenHeight(num) {
    return Math.round(num * currScreenHeight);
}

function scaleToScreen(x, y) {
    return new PIXI.Point(scaleToScreenWidth(x), scaleToScreenHeight(y));
}

function screenToScaleWidth(num) {
    return num / currScreenWidth;
}

function screenToScaleHeight(num) {
    return num / currScreenHeight;
}

function screenToScale(x, y) {
    return new PIXI.Point(screenToScaleWidth(x), screenToScaleHeight(y));
}

function xToY(scaleNum) {
    return scaleNum * heightToWidthFactor;
}

function yToX(scaleNum) {
    return scaleNum * widthToHeightFactor;
}