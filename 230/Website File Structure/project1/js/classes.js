
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
	constructor(scaleX = 0, scaleY = 0, scaleWidth = 0, scaleHeight = 0) {
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

	logInfo() {
		console.log(`{scaleX: ${this.scaleX}, scaleY: ${this.scaleY}, scaleWidth: ${this.scaleWidth}, scaleHeight: ${this.scaleHeight}, {screenX: ${this.sprObj.x}, screenY: ${this.sprObj.y}, screenWidth: ${this.sprObj.width}, screenHeight: ${this.sprObj.height}}`);
	}
}

class SprExtObj extends ScreenObject {
	constructor(sprExtObj, scaleX = 0, scaleY = 0, paramObj) {
		super(scaleX, scaleY);
		this.sprObj = sprExtObj;

		if ((isDefined(paramObj.firstScaleMethod) && paramObj.firstScaleMethod == "currentDimensions") || (isDefined(paramObj.scaleByCurrDimensions))) {
			scaleSprObjByCurrDimensions(this, this.sprObj.width, this.sprObj.height);
		}

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
		else
			scaleSprObjByCurrDimensions(this, this.sprObj.width, this.sprObj.height);
		// TODO: add hex notation and collision w/ float 1.0 and 1 out of 255
		if (isDefined(paramObj.alpha)) {
			if ((typeof paramObj.alpha) == "number") {
				if (paramObj.alpha < 1)
					this.sprObj.alpha = paramObj.alpha;
				else
					this.sprObj.alpha = paramObj.alpha / 255;
			}
		}
		if (isDefined(paramObj.anchor)) {
			if ((typeof paramObj.anchor) == "number")
				this.sprObj.anchor = paramObj.anchor;
			else if ((typeof paramObj.anchor) == "object")
				this.sprObj.anchor.set(paramObj.anchor.x, paramObj.anchor.y);
		}
		else if (isDefined(paramObj.anchorX) && isDefined(paramObj.anchorY))
			this.sprObj.anchor.set(paramObj.anchorX, paramObj.anchorY);

		if (isDefined(paramObj.scale)) {
			if ((typeof paramObj.scale) == "number")
				this.sprObj.scale.set(paramObj.scale, paramObj.scale);
			else if ((typeof paramObj.scale) == "object")
				this.sprObj.scale.set(paramObj.scale.x, paramObj.scale.y);
		}
		else if (isDefined(paramObj.scaleX) && isDefined(paramObj.scaleY))
			this.sprObj.scale.set(paramObj.scaleX, paramObj.scaleY);
		// TODO: handle other params


		if ((isDefined(paramObj.doNotRefreshScreenVals) && !paramObj.doNotRefreshScreenVals) || 
			(isDefined(paramObj.doRefreshScreenVals) && paramObj.doRefreshScreenVals))
			refreshScreenVals(this);
		else if (!isDefined(paramObj.doNotRefreshScreenVals) && !isDefined(paramObj.doRefreshScreenVals))
			refreshScreenVals(this);
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
	constructor(textStr = "Failure To Set TextObj textStr", scaleX = 0, scaleY = 0, paramObj) {
		super(new PIXI.Text(textStr), scaleX, scaleY, paramObj);
		this.textObj = this.sprObj;


		if ((isDefined(paramObj.firstScaleMethod) && paramObj.firstScaleMethod == "currentDimensions") || (isDefined(paramObj.scaleByCurrDimensions))) {
			scaleSprObjByCurrDimensions(this, this.sprObj.width, this.sprObj.height);
		}
		// Text style
		if (isDefined(paramObj.style))
			this.textObj.style = paramObj.style;
		else if (isDefined(paramObj.textStyle))
			this.textObj.style = paramObj.textStyle;
		//else
		//    //this.textObj = new Text(textStr);

		// if both are there, scale accordingly. If one one is there, scale based on the sprite's size and the other val
		//if (isDefined(paramObj.scaleWidth)) {
		//    if (isDefined(paramObj.scaleHeight)) {
		//        this.scaleWidth = paramObj.scaleWidth;
		//        this.scaleHeight = paramObj.scaleHeight;
		//    }
		//    else {
		//        this.scaleWidth = paramObj.scaleWidth;
		//        scaleSprObjByWidth(this, paramObj.scaleWidth);
		//    }
		//}
		//else if (isDefined(paramObj.scaleHeight)) {
		//    this.scaleHeight = paramObj.scaleHeight;
		//    scaleSprObjByHeight(this, paramObj.scaleHeight);
		//}

		if (isDefined(paramObj.anchor)) {
			if ((typeof paramObj.anchor) == "number")
				this.sprObj.anchor = paramObj.anchor;
			else if ((typeof paramObj.anchor) == "object")
				this.sprObj.anchor.set(paramObj.anchor.x, paramObj.anchor.y);
		}
		else if (isDefined(paramObj.anchorX) && isDefined(paramObj.anchorY))
			this.sprObj.anchor.set(paramObj.anchorX, paramObj.anchorY);

		if (isDefined(paramObj.scale)) {
			if ((typeof paramObj.scale) == "number")
				this.sprObj.scale.set(paramObj.scale, paramObj.scale);
			else if ((typeof paramObj.scale) == "object")
				this.sprObj.scale.set(paramObj.scale.x, paramObj.scale.y);
		}
		else if (isDefined(paramObj.scaleX) && isDefined(paramObj.scaleY))
			this.sprObj.scale.set(paramObj.scaleX, paramObj.scaleY);


		//if ((isDefined(paramObj.doNotRefreshScreenVals) && !paramObj.doNotRefreshScreenVals) ||
		//	(isDefined(paramObj.doRefreshScreenVals) && paramObj.doRefreshScreenVals))
		//	refreshScreenVals(this);
		//else if (!isDefined(paramObj.doNotRefreshScreenVals) && !isDefined(paramObj.doRefreshScreenVals))
		//	refreshScreenVals(this);
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

class Collider {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}


}
