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
const SCENES = {
	startScene: null,
	gameScene: null,
	gameOverScene: null,
	pausedScene: null,
	loadScene: null,
	testScene: null
}

// Text styles
let titleTextStyle, sceneLabelTextStyle, defaultTextStyle;

let isPaused = false;

// DEBUG STUFFS
let logFPS = false;
let displaySceneName = false;
let displayDimensions = true;
let dimensionLabel;

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
	// Dev Console Stuffs
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
    /*const */app = new PIXI.Application(currScreenWidth, currScreenHeight);
	if (projectHousingElement.hasChildNodes())
		projectHousingElement.insertBefore(app.view, projectHousingElement.firstElementChild);
	else
		projectHousingElement.appendChild(app.view);
	appElem = document.querySelector("canvas");

	//app.renderer.backgroundColor = 0xFF00FF;

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

	// Create scenes
	// Initialize them, set them to invisible, and add them to the app stage
	// DEAR GOD WHY IS THIS LANGUAGE PAIN (Object.keys(SCENES) causes infinite hang)
	//for (let i = 0; i < Object.keys(SCENES).length; i++) {
	//    SCENES[i] = new PIXI.Container();
	//    SCENES[i].visible = false;
	//    app.stage.addChild(SCENES[i]);
	//}
	for (let i in SCENES) {
		if (SCENES.hasOwnProperty(i)) {
			SCENES[i] = new PIXI.Container();
			SCENES[i].visible = false;
			app.stage.addChild(SCENES[i]);
		}
	}
	let label = new TextObj("Test Scene", 0, 0, {
		//scaleWidth: .1,
		//scaleHeight: .25,
		scaleByCurrDimensions: "current dimensions",
		style: sceneLabelTextStyle,
		scale: 1,
		doNotRefreshScreenVals: true,
		anchorX: 0,
		anchorY: 0,
		alpha: .25
	});
	scaleSprWidthProp(label, .175);
	refreshScreenVals(label);
	SCENES.testScene.addChild(label.textObj);
	gameObjects.push(label);

	label = new TextObj("Start Scene", 0, 0, {
		//scaleWidth: .1,
		//scaleHeight: .25,
		scaleByCurrDimensions: "current dimensions",
		style: sceneLabelTextStyle,
		scale: 1,
		doNotRefreshScreenVals: true,
		anchorX: 0,
		anchorY: 0,
		alpha: .25
	});
	scaleSprWidthProp(label, .175);
	refreshScreenVals(label);
	SCENES.startScene.addChild(label.textObj);
	gameObjects.push(label);

	//dimensionLabel = new TextObj(`${currScreenWidth}x${currScreenHeight}`, 1, 1, {
	//	//scaleWidth: .75,
	//	//scaleHeight: .25,
	//	style: defaultTextStyle,
	//	scale: 1,
	//	doNotRefreshScreenVals: true,
	//	anchorX: 1,
	//	anchorY: 0,
	//	alpha: .25
	//});
	//dimensionLabel.scaleHeight = scaleWidthProp(dimensionLabel.scaleWidth, dimensionLabel.scaleHeight, .1);
	//dimensionLabel.scaleWidth = .1;
	//refreshScreenVals(dimensionLabel);
	//SCENES.testScreen.addChild(dimensionLabel.textObj);
	//gameObjects.push(dimensionLabel);

	// TEST CODE: create animation
	SCENES.startScene.visible = true;
	let idleAnimTextures = loadSpriteSheet("media/images/PC-Idle No Border.png", 256, 256, 8, 4, 2);

	let idleAnimTest = createAnim(scaleToScreenWidth(yToX(.5)), scaleToScreenHeight(.5), 256, 256, idleAnimTextures, 15 / 60, true);
	idleAnimTest.anchor = new PIXI.Point(0, 0);
	let idleAnimObj = new SprExtObj(idleAnimTest, .5, .5, {
		scaleWidth: yToX(.35),
		scaleHeight: .35,
		anchorX: .5,
		anchorY: .5
	});
	idleAnimObj.sprObj.play();
	gameObjects.push(idleAnimObj);
	SCENES.testScene.addChild(idleAnimObj.sprObj);

	// TEST CODE: Add text
	let titleTest = new TextObj("Shifting Hues", .5, 0, {
		//scaleWidth: .75,
		//scaleHeight: .25,
		style: titleTextStyle,
		//scale: 1,
		doNotRefreshScreenVals: true,
		anchorX: .5,
		anchorY: 0
	});
	scaleSprWidthProp(titleTest, .75);
	refreshScreenVals(titleTest);
	SCENES.startScene.addChild(titleTest.textObj);
	gameObjects.push(titleTest);
	
	// Start update loop
	app.ticker.add(gameLoop);
}

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

	// Switch screens from the startScreen to the testScreen if 'S' is pressed
	if (SCENES.startScene.visible && getKey(keyboardCode.S)) {
		console.log("Switching to test scene");
		SCENES.startScene.visible = false;
		SCENES.testScene.visible = true;
	}
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
		fill: [
			"#ff00dc",
			"aqua"
		],
		fontSize: 200,
		fontFamily: "Finger Paint"/*,*/
		//fontStyle: "italic",
		//stroke: 0xFF0000,
		//strokeThickness: 6
	});

	sceneLabelTextStyle = new PIXI.TextStyle({
		fill: 0xFFFFFF,
		fontFamily: "Verdana",
		fontSize: 50
	});

	defaultTextStyle = new PIXI.TextStyle({
		fill: 0xFFFFFF,
		fontFamily: "Verdana",
		fontSize: 200
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

	// If there's no change, leave
	if (app.view.width == currScreenWidth && app.view.height == currScreenHeight) return;

	// 4. adjust the size of the renderer
	app.renderer.resize(currScreenWidth, currScreenHeight);

	// Reposition and resize game objects
	for (let i = 0; i < gameObjects.length; i++/*let obj in gameObjects*/) {
		//obj.scaleObject(prevScreenWidth, prevScreenHeight, currScreenWidth, currScreenHeight);
		//gameObjects[i].scaleObject(prevScreenWidth, prevScreenHeight, currScreenWidth, currScreenHeight);
		gameObjects[i].scaleObj();
	}
	for (let i = 0; i < spriteObjs.length; i++) {
		resizeSpriteFromDataObj(spriteObjs[i]);
	}
}

function logGameObjData() {
	for (let i = 0; i < gameObjects.length; i++) {
		gameObjects[i].logInfo();
	}
}

function logScreenSize() {
	console.log(`W: ${currScreenWidth} H: ${currScreenHeight}`);
}