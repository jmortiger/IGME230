"use strict";

const numCols = 70;
const numRows = 40;
const cellWidth = 10;
const cellSpacing = 1;

const cells = [];

let color = "red";

let mouseIsDown = false;

window.onload = init;

function init() {
	const gridContainer = document.querySelector("#gridContainer");

	const span = document.createElement('span');
	span.className = 'cell';

	// Modded
	//gridContainer.style.display = "grid";
	let gTRVal = /*`${cellWidth}px`*/"1fr";
	for (let i = 1; i < numRows; i++) {
		gTRVal += /*` ${cellWidth}px`*/" 1fr";
	}
	gridContainer.style.gridTemplateRows = gTRVal;
	let gTCVal = /*`${cellWidth}px`*/"auto";
	for (let i = 1; i < numCols; i++) {
		gTCVal += /*` ${cellWidth}px`*/" auto";
	}
	gridContainer.style.gridTemplateColumns = gTCVal;
	gridContainer.style.gridGap = `${cellSpacing}px`;

	for (let row = 0; row < numRows; row++) {
		cells.push([]);
		for (let col = 0; col < numCols; col++) {
			let cell = span.cloneNode();
			cell.style.gridColumn = `${col + 1} / span 1`;
			cell.style.gridRow = `${row + 1} / span 1`;
			//cell.style.left = `${col * (cellWidth + cellSpacing)}px`;
			//cell.style.top = `${row * (cellWidth + cellSpacing)}px`;
			gridContainer.appendChild(cell);
			cells[row][col] = cell;
		}
	}

	gridContainer.onclick = fillCell;
	gridContainer.onmousemove = (e) => {
		e.preventDefault();
		if (mouseIsDown) fillCell(e);
	};
	gridContainer.onmousedown = (e) => {
		e.preventDefault();
		mouseIsDown = true;
	};
	window.onmouseup = (e) => {
		e.preventDefault();
		mouseIsDown = false;
	};

	document.querySelector("#colorChooser").onchange = (e) => { color = e.target.value; };

	// Life Stuff
	
	function fillCell(e) {
		if (!isPaused)
			return;
		let rect = gridContainer.getBoundingClientRect();

		let cell00Rect = cells[0][0].getBoundingClientRect();
		let cell11Rect = cells[1][1].getBoundingClientRect();
		let colWidth = cell11Rect.left - (cell00Rect.left/* + cell00Rect.width*/);
		let rowHeight = cell11Rect.top - (cell00Rect.top/* + cell00Rect.height*/);

		let mouseX = e.clientX - rect.left;
		let mouseY = e.clientY - rect.top;
		let columnWidth = cellWidth + cellSpacing;
		let col = Math.floor(mouseX / colWidth);
		let row = Math.floor(mouseY / rowHeight);
		//let col = Math.floor(mouseX / columnWidth);
		//let row = Math.floor(mouseY / columnWidth);
		let selectedCell = cells[row][col];
		if (color == "red")
			lifeworld.world[row][col] = 1;
		if (color == "white")
			lifeworld.world[row][col] = 0;
		//selectedCell.className = 'cellSelected';
		selectedCell.style.backgroundColor = color;
		console.log(`${col}, ${row}`);
	}

	const maxFrameDelay = 1000 / 12;
	let lastUpdate = performance.now();
	let lastFrame = performance.now();
	
	let isPaused = true;

	let stepKeyDisp = document.querySelector("#stepKeyDisplay");
	let pauseKeyDisp = document.querySelector("#pauseKeyDisplay");
	let resetKeyDisp = document.querySelector("#resetKeyDisplay");

	const onPause = (e) => {
		updateGrid();
		isPaused = !isPaused;
	};
	const onStep = (e) => { doStep = true; };
	const onReset = (e) => {
		//lastUpdate = performance.now();
		//lastFrame = performance.now();
		isPaused = true;
		doStep = false;
		framesProcessed = 0;
		framesDrawn = 0;
		updateFrameCounter();
		lifeworld.init(numCols, numRows);
		updateGrid();
	};
	const onKeyDown = (e) => {
		if (e.code == stepKeyDisp.dataset.stepKey)
			onStep();
		if (e.code == pauseKeyDisp.dataset.pauseKey)
			onPause();
		if (e.code == resetKeyDisp.dataset.resetKey)
			onReset();
	};
	window.onkeydown = onKeyDown;

	let doStep = false;
	stepKeyDisp.innerHTML = `Step Key bound to ${stepKeyDisp.dataset.stepKey}.`;

	document.querySelector("#defineStepKey").onclick = (e) => {
		stepKeyDisp.innerHTML = "Press a key to define the step keybind";
		window.onkeydown = (e) => {
			stepKeyDisp.dataset.stepKey = e.code;
			stepKeyDisp.innerHTML = `Step Key bound to ${e.code}.`;
			window.onkeydown = onKeyDown;
		};
	};

	pauseKeyDisp.innerHTML = `Pause Key bound to ${pauseKeyDisp.dataset.pauseKey}.`;

	document.querySelector("#definePauseKey").onclick = (e) => {
		pauseKeyDisp.innerHTML = "Press a key to define the pause keybind";
		window.onkeydown = (e) => {
			pauseKeyDisp.dataset.pauseKey = e.code;
			pauseKeyDisp.innerHTML = `Pause Key bound to ${e.code}.`;
			window.onkeydown = onKeyDown;
		};
	};

	resetKeyDisp.innerHTML = `Reset Key bound to ${resetKeyDisp.dataset.resetKey}.`;

	document.querySelector("#defineResetKey").onclick = (e) => {
		resetKeyDisp.innerHTML = "Press a key to define the reset keybind";
		window.onkeydown = (e) => {
			resetKeyDisp.dataset.resetKey = e.code;
			resetKeyDisp.innerHTML = `Reset Key bound to ${e.code}.`;
			window.onkeydown = onKeyDown;
		};
	};

	let framesProcessed = 0, framesDrawn = 0;

	const frameCounter = document.querySelector("#frameCounter");
	const frameCounterBaseText = frameCounter.innerHTML;
	const updateFrameCounter = () => { frameCounter.innerHTML = frameCounterBaseText + framesDrawn; };
	updateFrameCounter();

	document.querySelector("#stepButton").onclick = onStep;
	document.querySelector("#pauseButton").onclick = onPause;
	document.querySelector("#reset").onclick = onReset;

	lifeworld.init(numCols, numRows);
	updateGrid();
	loop(performance.now());

	function loop(timestamp) {
		requestAnimationFrame(loop);
		lastUpdate = timestamp;
		if (timestamp - lastFrame > maxFrameDelay) {
			lastFrame = timestamp;
			if (!isPaused || doStep) {
				lifeworld.step();
				updateGrid();
				framesDrawn++;
				updateFrameCounter();
				doStep = false;
			}
		}
	}

	// Update the visual grid to match the logical grid
	function updateGrid() {
		for (let row = 0; row < numRows; row++) {
			for (let col = 0; col < numCols; col++) {
				let element = cells[row][col];
				if (lifeworld.world[row][col] == 1) {
					element.style.backgroundColor = "red";
				}
				else {
					element.style.backgroundColor = "white";
				}
			}
		}
	}
}