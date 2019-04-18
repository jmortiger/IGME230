
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
    constructor(dx = 0, dy = 0) {
        this.dx = dx;
        this.dy = dy;
    }

    update(deltaTime) {

    }
}