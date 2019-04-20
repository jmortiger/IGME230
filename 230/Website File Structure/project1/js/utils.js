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
            if (counter == numFrames)
                break;
        }
        if (counter == numFrames)
            break;
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
    anim.onComplete = e => gameScene.removeChild(anim);
    //gameScene.addChild(anim);
    anim.play();
}