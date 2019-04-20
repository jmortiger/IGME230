
class RectObj {
    constructor(scaleX = 0, scaleY = 0, scaleWidth = .05, scaleHeight = .05) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;

        this.rect = makeCenteredScaleRect(scaleX, scaleY, scaleWidth, scaleHeight);
        console.log(`x=${this.rect.x} y=${this.rect.y}`);

        app.stage.addChild(this.rect);
    }

    scaleObject(prevScreenWidth, prevScreenHeight, newScreenWidth, newScreenHeight) {
        if (prevScreenHeight == newScreenHeight, prevScreenWidth == newScreenWidth)
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
}

class ScreenObject {
    constructor(scaleX = 0, scaleY = 0, scaleWidth = 0, scaleHeight = 0) {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleWidth = scaleWidth;
        this.scaleHeight = scaleHeight;
    }

    scaleObject(prevScreenWidth, prevScreenHeight, newScreenWidth, newScreenHeight) {
        if (prevScreenHeight == newScreenHeight, prevScreenWidth == newScreenWidth)
            return;
        //let widthFactor = newScreenWidth / previousScreenWidth;
        //let heightFactor = newScreenHeight / previousScreenHeight;
        //this.scaleX *= widthFactor;
        //this.scaleY *= heightFactor;
        //this.scaleWidth *= widthFactor;
        //this.scaleHeight *= heightFactor;


    }

    draw() {

    }
}
// INCOMPLETE
class Button extends ScreenObject {
    constructor(scaleX = 0, scaleY = 0, scaleWidth = .15, scaleHeight = .1, imgSrc = 'media/button-130.png', anchor = new PIXI.Point(.5, .5)) {
        super(scaleX, scaleY, scaleWidth, scaleHeight);
        this.sprite = PIXI.Sprite.fromImage(imgSrc);
        this.sprite.buttonMode = true;
        this.sprite.anchor.set(anchor.x, anchor.y);
        this.sprite.x = scaleToScreenWidth(this.scaleX);
        this.sprite.y = scaleToScreenHeight(this.scaleY);
        this.sprite.width = scaleToScreenWidth(this.scaleWidth);
        this.sprite.height = scaleToScreenHeight(this.scaleHeight);
        app.stage.addChild(this.sprite);

        // Fix this
        //this.sprite.on('pointerover', e => { e.target.tint = 0xBBBBBB });
        //this.sprite.on('pointerdown', e => { e.target.tint = 0x888888 });
        //this.sprite.on('pointerup', e => { e.target.tint = 0xBBBBBB });
        //this.sprite.on('pointerout', e => { e.currentTarget.tint = 0xFFFFFF });
        //this.sprite.on('pointerupoutside', e => { e.target.tint = 0xFFFFFF });
    }

    get anchorX() { return this.sprite.anchor.x; }
    set anchorX(anchorX) { this.sprite.anchor.x = anchorX; }
    get anchorY() { return this.sprite.anchor.y; }
    set anchorY(anchorY) { this.sprite.anchor.y = anchorY; }

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
        if (prevScreenHeight == newScreenHeight, prevScreenWidth == newScreenWidth)
            return;
        this.sprite.x = scaleToScreenWidth(this.scaleX);
        this.sprite.y = scaleToScreenHeight(this.scaleY);
        this.sprite.width = scaleToScreenWidth(this.scaleWidth);
        this.sprite.height = scaleToScreenHeight(this.scaleHeight);
    }
}

class GameObject {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    //update(deltaTime) {

    //}

    checkCollision(other) {

    }

    scaleObject(previousScreenWidth, previousScreenHeight, newScreenWidth, newScreenHeight) {
        if (previousScreenHeight == newScreenHeight, previousScreenWidth == newScreenWidth)
            return;

    }

    draw() {

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