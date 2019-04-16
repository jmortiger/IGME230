const app = new PIXI.Application(600, 400);
document.body.appendChild(app.view);

// #1 - make some squares
const s1 = makeRectangle();
s1.x = 100;
s1.y = 100;

const s2 = makeRectangle(80, 40, 0xFF00FF);
s2.x = 200;
s2.y = 100;

// HW 1: add rounded rect

/*let roundedRect = new PIXI.Graphics();
roundedRect.beginFill(0xFFFFFF);
roundedRect.lineSty*/
let roundedRect = makeRoundedRectangle(100, 50, 0xFFFFFF);
roundedRect.x += 350;
roundedRect.y += 100;

app.stage.addChild(s1);
app.stage.addChild(s2);
app.stage.addChild(roundedRect);

// #2 - make some PixiJS buttons
// http://pixijs.download/release/docs/PIXI.Sprite.html
const b1 = PIXI.Sprite.fromImage('images/button-130.png');
b1.buttonMode = true;
b1.anchor.set(0.5);
b1.x = 100;
b1.y = 200;
app.stage.addChild(b1);

const b2 = PIXI.Sprite.fromImage('images/button-130.png');
b2.buttonMode = true;
b2.anchor.set(0.5);
b2.x = 250;
b2.y = 200;
app.stage.addChild(b2);

const b3 = PIXI.Sprite.fromImage('images/button-130.png');
b3.buttonMode = true;
b3.anchor.set(0.5);
b3.x = 400;
b3.y = 200;
app.stage.addChild(b3);

// #3 add events to the buttons
b1.interactive = true;
// element.on('event-name',function-to-call);
b1.on('pointerup', e => { s1.rotation += Math.PI / 12; s2.rotation -= Math.PI / 12; roundedRect.rotation -= Math.PI / 12; });

b2.interactive = true;
b2.on('pointerup', e => { s1.height += 20; s1.width += 20; s2.height += 20; s2.width += 20; roundedRect.height += 20; roundedRect.width += 20; });

b3.interactive = true;
b3.on('pointerup', e => { s1.height -= 20; s1.width -= 20; s2.height -= 20; s2.width -= 20; roundedRect.height -= 20; roundedRect.width -= 20; });

// #4 make b1 act more like a button (mouseover,mousedown etc)
b1.on('pointerover', e => { e.target.tint = 0xBBBBBB });
b1.on('pointerdown', e => { e.target.tint = 0x888888 });
b1.on('pointerup', e => { e.target.tint = 0xBBBBBB });
b1.on('pointerout', e => { e.currentTarget.tint = 0xFFFFFF });
b1.on('pointerupoutside', e => { e.target.tint = 0xFFFFFF });

function makeRectangle(width = 50, height = 50, color = 0xFF0000) {
    // http://pixijs.download/dev/docs/PIXI.Graphics.html
    let rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.lineStyle(4, 0xFFFF00, 1);
    rect.drawRect(-width * .5, -height * .5, width, height);
    rect.endFill();
    return rect;
}

function makeRoundedRectangle(width = 50, height = 50, color = 0xFF0000) {
    // http://pixijs.download/dev/docs/PIXI.Graphics.html
    let rect = new PIXI.Graphics();
    rect.beginFill(color);
    rect.lineStyle(4, 0xFFFF00, 1);
    rect.drawRoundedRect(-width * .5, -height * .5, width, height);
    rect.endFill();
    return rect;
}