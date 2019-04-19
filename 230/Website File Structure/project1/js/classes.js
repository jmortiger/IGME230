

class ScreenObject {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    scaleObject(previousScreenWidth, previousScreenHeight, newScreenWidth, newScreenHeight) {
        if (previousScreenHeight == newScreenHeight, previousScreenWidth == newScreenWidth)
            return;

    }

    draw() {

    }
}

class Button extends ScreenObject{
    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(x, y, width, height);
        const b1 = PIXI.Sprite.fromImage('media/button-130.png');
        b1.buttonMode = true;
        b1.anchor.set(0.5);
        b1.x = 100;
        b1.y = 200;
        app.stage.addChild(b1);
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