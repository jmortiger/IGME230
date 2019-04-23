
class RectObj {
    constructor(scaleX = 0, scaleY = 0, scaleWidth = .05, scaleHeight = .05) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;

        this.rect = makeCenteredScaleRect(scaleX, scaleY, scaleWidth, scaleHeight);
        console.log(`x=${this.rect.x} y=${this.rect.y}`);
    }

    scaleObject(prevScreenWidth, prevScreenHeight, newScreenWidth, newScreenHeight) {
        if (prevScreenHeight == newScreenHeight && prevScreenWidth == newScreenWidth)
            return;
        //let widthFactor = newScreenWidth / prevScreenWidth;
        //let heightFactor = newScreenHeight / prevScreenHeight;
        //this.scaleX *= widthFactor;
        //this.scaleY *= heightFactor;
        //this.scaleWidth *= widthFactor;
        //this.scaleHeight *= heightFactor;

        this.rect.x = scaleToScreenWidth(this.scaleX);
        this.rect.y = scaleToScreenHeight(this.scaleY)
        console.log(`x=${this.rect.x} y=${this.rect.y}`);
        this.rect.width = scaleToScreenWidth(this.scaleWidth);
        this.rect.height = scaleToScreenHeight(this.scaleHeight)
        console.log(`w=${this.rect.width} h=${this.rect.height}`);
    }

    scaleObj() {
        this.rect.x = scaleToScreenWidth(this.scaleX);
        this.rect.y = scaleToScreenHeight(this.scaleY)
        this.rect.width = scaleToScreenWidth(this.scaleWidth);
        this.rect.height = scaleToScreenHeight(this.scaleHeight)
    }
}

class ScreenObject {
    constructor(scaleX = 0, scaleY = 0, scaleWidth = .5, scaleHeight = 0) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;
    }

    scaleObject(prevScreenWidth, prevScreenHeight, newScreenWidth, newScreenHeight) {
        if (prevScreenHeight == newScreenHeight && prevScreenWidth == newScreenWidth)
            return;
        //let widthFactor = newScreenWidth / previousScreenWidth;
        //let heightFactor = newScreenHeight / previousScreenHeight;
        //this.scaleX *= widthFactor;
        //this.scaleY *= heightFactor;
        //this.scaleWidth *= widthFactor;
        //this.scaleHeight *= heightFactor;

        this.textObj.x = scaleToScreenWidth(this.scaleX);
        this.textObj.y = scaleToScreenHeight(this.scaleY)
        //console.log(`x=${this.textObj.x} y=${this.textObj.y}`);
        this.textObj.width = scaleToScreenWidth(this.scaleWidth);
        this.textObj.height = scaleToScreenHeight(this.scaleHeight)
        //console.log(`w=${this.textObj.width} h=${this.textObj.height}`);
    }

    scaleObj() {
        this.textObj.x = scaleToScreenWidth(this.scaleX);
        this.textObj.y = scaleToScreenHeight(this.scaleY)
        //console.log(`x=${this.textObj.x} y=${this.textObj.y}`);
        this.textObj.width = scaleToScreenWidth(this.scaleWidth);
        this.textObj.height = scaleToScreenHeight(this.scaleHeight)
        //console.log(`w=${this.textObj.width} h=${this.textObj.height}`);
    }
}

class SprExtObj extends ScreenObject {
    constructor(sprExtObj, scaleX = 0, scaleY = 0, paramObj) {
        super(scaleX, scaleY);
        this.sprObj = sprExtObj;

        // if both are there, scale accordingly. If one one is there, scale based on the sprite's size and the other val
        if (isDefined(paramObj.scaleWidth) && paramObj.scaleWidth != 0) {
            if (isDefined(paramObj.scaleHeight) && paramObj.scaleHeight != 0) {
                this.scaleWidth = paramObj.scaleWidth;
                this.scaleHeight = paramObj.scaleHeight;
            }
            else {
                this.scaleWidth = paramObj.scaleWidth;
                scaleSprObjByWidth(this, paramObj.scaleWidth);
            }
        }
        else if (isDefined(paramObj.scaleHeight) && paramObj.scaleHeight != 0) {
            this.scaleHeight = paramObj.scaleHeight;
            scaleSprObjByHeight(this, paramObj.scaleHeight);
        }

        // TODO: handle other params

        if (isDefined(this.sprObj)) {
            this.sprObj.x = scaleToScreenWidth(this.scaleX);
            this.sprObj.y = scaleToScreenHeight(this.scaleY);
            this.sprObj.width = scaleToScreenWidth(this.scaleWidth);
            this.sprObj.height = scaleToScreenHeight(this.scaleHeight);
            //this.scaleHeight = screenToScaleHeight(this.sprObj.height);
        }
    }

    scaleObject(prevScreenWidth, prevScreenHeight, newScreenWidth, newScreenHeight) {
        if (prevScreenHeight == newScreenHeight && prevScreenWidth == newScreenWidth)
            return;

        this.sprObj.x = scaleToScreenWidth(this.scaleX);
        this.sprObj.y = scaleToScreenHeight(this.scaleY);
        this.sprObj.width = scaleToScreenWidth(this.scaleWidth);
        this.sprObj.height = scaleToScreenHeight(this.scaleHeight);
    }

    scaleObj() {
        this.sprObj.x = scaleToScreenWidth(this.scaleX);
        this.sprObj.y = scaleToScreenHeight(this.scaleY);
        this.sprObj.width = scaleToScreenWidth(this.scaleWidth);
        this.sprObj.height = scaleToScreenHeight(this.scaleHeight);
    }

    // getSpriteSize()
    // Returns the width and height from the sprite.
    getSpriteSize() {
        return new PIXI.Point(this.sprObj.width, this.sprObj.height);
    }
}

class TextObj extends SprExtObj {
    constructor(textStr = "Failure To Set TextObj textStr", textStyle = null, scaleX = 0, scaleY = 0, paramObj) {
        super(new PIXI.Text(textStr), scaleX, scaleY, paramObj);
        this.textObj = this.sprObj;
        // Text style
        if (isDefined(paramObj.style))
            //this.textObj = new Text(textStr, paramObj.style);
            this.textObj.style = paramObj.style;
        else if (isDefined(paramObj.textStyle))
            //this.textObj = new Text(textStr, paramObj.textStyle);
            this.textObj.style = paramObj.textStyle;
        //else
        //    //this.textObj = new Text(textStr);

        // if both are there, scale accordingly. If one one is there, scale based on the sprite's size and the other val
        if (isDefined(paramObj.scaleWidth)) {
            if (isDefined(paramObj.scaleHeight)) {
                this.scaleWidth = paramObj.scaleWidth;
                this.scaleHeight = paramObj.scaleHeight;
            }
            else {
                this.scaleWidth = paramObj.scaleWidth;
                scaleSprObjByWidth(this, paramObj.scaleWidth);
            }
        }
        else if (isDefined(paramObj.scaleHeight)) {
            this.scaleHeight = paramObj.scaleHeight;
            scaleSprObjByHeight(this, paramObj.scaleHeight);
        }

        if (isDefined(paramObj.anchor)) {
            if ((typeof paramObj.anchor) == "number")
                this.sprObj.anchor.set(paramObj.anchor);
            else if ((typeof paramObj.anchor) == "object")
                this.sprObj.anchor.set(paramObj.anchor.x, paramObj.anchor.y);
        }
        else if (isDefined(paramObj.anchorX) && isDefined(paramObj.anchorY))
            this.sprObj.anchor.set(paramObj.anchorX, paramObj.anchorY);
        
        //if (!isDefined(textStyle))
        //    this.textObj = new PIXI.Text(textStr);
        //else
        //    this.textObj = new PIXI.Text(textStr, textStyle);
        //this.sprObj = this.textObj;
        //if (scaleWidth == 0) {
        //    if (!scaleSprObjByHeight(this, this.scaleHeight)) {
        //        // TODO: Throw error here.
        //    }
        //    scaleSprObjByWidth(this, this.scaleWidth);
        //}
        refreshScreenVals(this);
    }

    scaleObject(prevScreenWidth, prevScreenHeight, newScreenWidth, newScreenHeight) {
        if (prevScreenHeight == newScreenHeight && prevScreenWidth == newScreenWidth)
            return;

        this.textObj.x = scaleToScreenWidth(this.scaleX);
        this.textObj.y = scaleToScreenHeight(this.scaleY);
        this.textObj.width = scaleToScreenWidth(this.scaleWidth);
        this.textObj.height = scaleToScreenHeight(this.scaleHeight);
    }

    scaleObj() {
        this.textObj.x = scaleToScreenWidth(this.scaleX);
        this.textObj.y = scaleToScreenHeight(this.scaleY);
        this.textObj.width = scaleToScreenWidth(this.scaleWidth);
        this.textObj.height = scaleToScreenHeight(this.scaleHeight);
    }

    // getSpriteSize()
    // Returns the width and height from the sprite.
    getSpriteSize() {
        return new PIXI.Point(this.sprObj.width, this.sprObj.height);
    }
}

// INCOMPLETE
class Button extends SprExtObj {
    constructor(scaleX = 0, scaleY = 0, scaleWidth = .15, scaleHeight = .1, imgSrc = 'media/images/button-130.png', anchor = new PIXI.Point(.5, .5)) {
        super(scaleX, scaleY, scaleWidth, scaleHeight, makeBttnFrmImgSrc(imgSrc));
        this.sprObj.anchor.set(anchor.x, anchor.y);

        // Fix this
        //this.sprite.on('pointerover', e => { e.target.tint = 0xBBBBBB });
        //this.sprite.on('pointerdown', e => { e.target.tint = 0x888888 });
        //this.sprite.on('pointerup', e => { e.target.tint = 0xBBBBBB });
        //this.sprite.on('pointerout', e => { e.currentTarget.tint = 0xFFFFFF });
        //this.sprite.on('pointerupoutside', e => { e.target.tint = 0xFFFFFF });
    }

    get anchorX() { return this.sprObj.anchor.x; }
    set anchorX(anchorX) { this.sprObj.anchor.x = anchorX; }
    get anchorY() { return this.sprObj.anchor.y; }
    set anchorY(anchorY) { this.sprObj.anchor.y = anchorY; }

    // WHYYYYYYYYYYYYYYYYYYYYYYYY
    //set scaleX(newScaleX) {
    //    this.scaleX = newScaleX;
    //    this.sprite.x = scaleToScreenWidth(newScaleX);
    //}

    //set scaleY(newScaleY) {
    //    this.scaleY = newScaleY;
    //    this.sprite.y = scaleToScreenHeight(newScaleY);
    //}
    
    scaleObject(prevScreenWidth, prevScreenHeight, newScreenWidth, newScreenHeight) {
        if (prevScreenHeight == newScreenHeight && prevScreenWidth == newScreenWidth)
            return;
        this.sprObj.x = scaleToScreenWidth(this.scaleX);
        this.sprObj.y = scaleToScreenHeight(this.scaleY);
        this.sprObj.width = scaleToScreenWidth(this.scaleWidth);
        this.sprObj.height = scaleToScreenHeight(this.scaleHeight);
    }

    scaleObj() {
        this.sprObj.x = scaleToScreenWidth(this.scaleX);
        this.sprObj.y = scaleToScreenHeight(this.scaleY);
        this.sprObj.width = scaleToScreenWidth(this.scaleWidth);
        this.sprObj.height = scaleToScreenHeight(this.scaleHeight);
    }
}

class GameObject extends ScreenObject {
    constructor(scaleX = 0, scaleY = 0, scaleWidth = 0, scaleHeight = 0) {
        super(scaleX, scaleY, scaleWidth, scaleHeight);
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;
    }

    //update(deltaTime) {

    //}

    checkCollision(other) {

    }
    // TODO: FINISH
    scaleObject(previousScreenWidth, previousScreenHeight, newScreenWidth, newScreenHeight) {
        if (previousScreenHeight == newScreenHeight && previousScreenWidth == newScreenWidth)
            return;

    }
}

// TODO: Lookup inheritance
class Moveable extends GameObject {
    constructor(x = 0, y = 0, width = 0, height = 0, dx = 0, dy = 0) {
        super(x = 0, y = 0, width = 0, height = 0);
        this.dx = dx;
        this.dy = dy;
    }

    update(deltaTime) {

    }
}