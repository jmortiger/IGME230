// utils.js
// This file is for a variety of helper functions. Most of these should not require variables not passed into the function.
// This should be largely reuseable.

function processDevConsoleInput(input) {
    
}

function SpriteObjData(sprite, scaleX, scaleY, scaleWidth, scaleHeight) {
    this.sprite = sprite;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
}

//function makeTextObjFromStrAndStyle(txtStr, txtStyle) {
//    let textObj = new PIXI.Text(txtStr);
//    textObj.style = txtStyle;
//    return textObj;
//}

function makeBttnFrmImgSrc(imgSrc) {
    let sprite = PIXI.Sprite.fromImage(imgSrc);
    sprite.buttonMode = true;
    return sprite;
}

function loadSpriteSheet(imgSrc = "images/explosions.png", spriteWidth = 64, spriteHeight = 64, numFrames = 16, spritesPerRow = 4, spritesPerColumns = 4) {
    let spriteSheet = PIXI.BaseTexture.fromImage(imgSrc);
    let textures = [];
    //let frameCond = (i) => { return i < numFrames; }
    let counter = 0;
    for (let j = 0; j < spritesPerColumns; j++) {
        for (let i = 0; i < spritesPerRow; i++) {
            let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i * spriteWidth, j * spriteHeight, spriteWidth, spriteHeight));
            textures.push(frame);
            counter++;
            if (counter == numFrames) break;
        }
        if (counter == numFrames) break;
    }
    return textures;
}

function createAnim(x, y, frameWidth, frameHeight, animTextures, animSpeed, isLooped = true) {
    let wDiv2 = frameWidth / 2;
    let hDiv2 = frameHeight / 2;
    let anim = new PIXI.extras.AnimatedSprite(animTextures);
    anim.x = x - wDiv2;
    anim.y = y - hDiv2;
    anim.animationSpeed = animSpeed;
    anim.loop = isLooped;
    //anim.onComplete = e => gameScene.removeChild(anim);
    //gameScene.addChild(anim);
    //anim.play();
    return anim;
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

function screenToScaleFromPoint(point) {
    return new PIXI.Point(screenToScaleWidth(point.x), screenToScaleHeight(point.y));
}

function xToY(scaleNum) {
    return scaleNum * heightToWidthFactor;
}

function yToX(scaleNum) {
    return scaleNum * widthToHeightFactor;
}

// Object creation helpers

function makeTextObjFromParamObj(textStr, scaleX, scaleY, paramObj) {
    let textObj;
    // Text style
    if (isDefined(paramObj.style))
        textObj = new TextObj(textStr, paramObj.style, scaleX, scaleY);
    else if (isDefined(paramObj.textStyle))
        textObj = new TextObj(textStr, paramObj.textStyle, scaleX, scaleY);
    else
        textObj = new TextObj(textStr, null, scaleX, scaleY, 0, 0);

    // if both are there, scale accordingly. If one one is there, scale based on the sprite's size and the other val
    if (isDefined(paramObj.scaleWidth)) {
        if (isDefined(paramObj.scaleHeight)) {
            textObj.scaleWidth = paramObj.scaleWidth;
            textObj.scaleHeight = paramObj.scaleHeight;
        }
        else {
            textObj.scaleWidth = paramObj.scaleWidth;
            scaleSprObjByWidth(textObj, paramObj.scaleWidth);
        }
    }
    else if (isDefined(paramObj.scaleHeight)) {
        textObj.scaleHeight = paramObj.scaleHeight;
        scaleSprObjByHeight(textObj, paramObj.scaleHeight);
    }

    if (isDefined(paramObj.anchor)) {
        if ((typeof paramObj.anchor) == "number")
            textObj.sprObj.anchor.set(paramObj.anchor);
        else if ((typeof paramObj.anchor) == "object")
            textObj.sprObj.anchor.set(paramObj.anchor.x, paramObj.anchor.y);
    }
    else if (isDefined(paramObj.anchorX) && isDefined(paramObj.anchorY))
        textObj.sprObj.anchor.set(paramObj.anchorX, paramObj.anchorY);

    return textObj;
}

//function makeTextObjFromStyle_ScaleWidth_ScaleHeight(style, scaleWidth, scaleHeight) {

//}

//function makeTextObjFromAlphaAnchorButton_ModeInteractive() {

//}

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

function resizeObjectSprite(objWithSprite) {
    objWithSprite.sprite.x = scaleToScreenWidth(objWithSprite.scaleX);
    objWithSprite.sprite.y = scaleToScreenHeight(objWithSprite.scaleY);
    objWithSprite.sprite.width = scaleToScreenWidth(objWithSprite.scaleWidth);
    objWithSprite.sprite.height = scaleToScreenHeight(objWithSprite.scaleHeight);
}

// resizeSprite(objFromSprite, scaleX, scaleY, scaleWidth, scaleHeight)
// objFromSprite: an object that either is or extends from PIXI.Sprite
// scaleX: 
// scaleY: 
// scaleWidth: 
// scaleHeight: 
function resizeSpriteFromValues(objFromSprite, scaleX, scaleY, scaleWidth, scaleHeight) {
    objFromSprite.x = scaleToScreenWidth(scaleX);
    objFromSprite.y = scaleToScreenHeight(scaleY);
    objFromSprite.width = scaleToScreenWidth(scaleWidth);
    objFromSprite.height = scaleToScreenHeight(scaleHeight);
}

function resizeSpriteFromDataObj(spriteDataObj) {
    spriteDataObj.sprite.x = scaleToScreenWidth(spriteDataObj.scaleX);
    spriteDataObj.sprite.y = scaleToScreenHeight(spriteDataObj.scaleY);
    spriteDataObj.sprite.width = scaleToScreenWidth(spriteDataObj.scaleWidth);
    spriteDataObj.sprite.height = scaleToScreenHeight(spriteDataObj.scaleHeight);
}

function refreshScreenVals(sprExtObj) {
    sprExtObj.sprObj.x = scaleToScreenWidth(sprExtObj.scaleX);
    sprExtObj.sprObj.y = scaleToScreenHeight(sprExtObj.scaleY);
    sprExtObj.sprObj.width = scaleToScreenWidth(sprExtObj.scaleWidth);
    sprExtObj.sprObj.height = scaleToScreenHeight(sprExtObj.scaleHeight);
}

function scaleSprObjByWidth(sprObj, desiredScaleWidth) {
    // Error handling and checking (divide by zero)
    if (desiredScaleWidth == 0) return false;
    let size = sprObj.getSpriteSize();
    size = screenToScaleFromPoint(size);
    let factor = size.x / desiredScaleWidth;
    let desiredScaleHeight = size.y * factor;
    sprObj.scaleWidth = desiredScaleWidth;
    sprObj.scaleHeight = desiredScaleHeight;
}

function scaleSprObjByHeight(sprObj, desiredScaleHeight) {
    // Error handling and checking (divide by zero)
    if (desiredScaleHeight == 0) return false;
    let size = sprObj.getSpriteSize();
    size = screenToScaleFromPoint(size);
    let factor = size.y / desiredScaleHeight;
    let desiredScaleWidth = size.x * factor;
    sprObj.scaleWidth = desiredScaleWidth;
    sprObj.scaleHeight = desiredScaleHeight;
    return true;
}

function isDefined(thing) {
    return (thing != undefined && thing != null);
}