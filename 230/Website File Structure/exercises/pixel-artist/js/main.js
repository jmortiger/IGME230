const numCols = 30;
const numRows = 20;
const cellWidth = 25;
const cellSpacing = 1;

const cells = [];

let color = "red";

window.onload = init;

function init() {
	const gridContainer = document.querySelector("#gridContainer");
	const span = document.createElement('span');
	span.className = 'cell';
	gridContainer.style.display = "grid";
	let gTRVal = /*`${cellWidth}px`*/"auto";
	for (let i = 1; i < numRows; i++) {
		gTRVal += /*` ${cellWidth}px`*/" auto";
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

	document.querySelector("#colorChooser").onchange = (e) => { color = e.target.value; };

	gridContainer.onclick = fillCell;

	let mouseIsDown = false;

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
}

function fillCell(e) {
	let rect = gridContainer.getBoundingClientRect();
	let mouseX = e.clientX - rect.left;
	let mouseY = e.clientY - rect.top;
	let columnWidth = cellWidth + cellSpacing;
	let col = Math.floor(mouseX / columnWidth);
	let row = Math.floor(mouseY / columnWidth);
	let selectedCell = cells[row][col];
	selectedCell.className = 'cellSelected';
	selectedCell.style.backgroundColor = color;
	console.log(`${col}, ${row}`);
}