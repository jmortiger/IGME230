// GLOBAL FIELDS
// start and end for A*
let startNode = null, endNode = null;

window.onload = init;

function init() {
	//document.querySelector("#gridContainer");
	let temp = buildGrid(document.querySelector("#controlGridWidth").value, document.querySelector("#controlGridHeight").value, 0, "gridContainer");
	document.querySelector("#controlGridWidth").onchange = resetGrid;
	document.querySelector("#controlGridHeight").onchange = resetGrid;
}

function resetGrid(e) {
	buildGrid(document.querySelector("#controlGridWidth").value, document.querySelector("#controlGridHeight").value, 0, "gridContainer");
}

// Returns: An array of 2 elements;
//		The element holding the grid (if not already in document, must be inserted)
//		A matrix of grid cells
function buildGrid(numCols, numRows, cellSpacing, containerId = "gridContainer") {
	let gridContainer = document.querySelector(`#${containerId}`);
	if (!(gridContainer)) {
		gridContainer = document.createElement("div");
		gridContainer.id = containerId;
	}

	// Removes any content in the grid (provided any exists)
	while (gridContainer.childElementCount != 0) {
		gridContainer.removeChild(gridContainer.childNodes[0]);
	}

	const span = document.createElement('span');
	span.className = 'cell';
	gridContainer.style.display = "grid";
	gridContainer.style.width = "auto";
	gridContainer.style.height = "100%";
	gridContainer.style.justifyItems = "stretch";
	gridContainer.style.alignItems = "stretch";
	let gridTempRowsVal = /*`${cellWidth}px`*/"auto";
	for (let i = 1; i < numRows; i++) {
		gridTempRowsVal += /*` ${cellWidth}px`*/" auto";
	}
	gridContainer.style.gridTemplateRows = gridTempRowsVal;
	let gridTempColVal = /*`${cellWidth}px`*/"auto";
	for (let i = 1; i < numCols; i++) {
		gridTempColVal += /*` ${cellWidth}px`*/" auto";
	}
	gridContainer.style.gridTemplateColumns = gridTempColVal;

	gridContainer.style.gridGap = `${cellSpacing}px`;

	let cells = [];

	for (let row = 0; row < numRows; row++) {
		cells.push([]);
		for (let col = 0; col < numCols; col++) {
			let cell = span.cloneNode();
			cell.style.gridColumn = `${col + 1} / span 1`;
			cell.style.gridRow = `${row + 1} / span 1`;
			//cell.style.height = `100%`;
			//cell.style.left = `${col * (cellWidth + cellSpacing)}px`;
			//cell.style.top = `${row * (cellWidth + cellSpacing)}px`;

			applyCellInfo(cell);

			gridContainer.appendChild(cell);
			cells[row][col] = cell;
		}
	}
	return [gridContainer, cells];
}

function applyCellInfo(cell) {
	cell.onclick = (e) => {
		let currAction, formElems = document.querySelector("#setClickedElemsRadioForm").elements;
		for (let i = 0; i < formElems.length; i++) {
			if (formElems[i].checked)
				currAction = formElems[i].value;
		}
		if (currAction == "Start") {
			// If there's a currently stored start node, remove it's id
			if (startNode) startNode.id = "";
			if (cell.className.includes("wallNode")) {
				let temp = cell.className.split(" ");
				cell.className = "";
				for (let str in temp) {
					if (str != "wallNode") cell.className += " " + str;
				}
				cell.className = cell.className.slice(1);
			}
			if (cell.id == "endNode") cell.id = "";
			if (cell == endNode) endNode = null;
			startNode = cell;
			cell.id = "startNode";
		}
		else if (currAction == "Wall") {
			if (cell.id == "startNode") startNode.id = "";
			if (cell == startNode) startNode = null;
			if (cell.id == "endNode") cell.id = "";
			if (cell == endNode) endNode = null;
			if (!cell.className.includes("wallNode")) cell.className += " wallNode";
		}
		else if (currAction == "End") {
			if (cell.id == "startNode") cell.id = "";
			if (cell == startNode) startNode = null;
			if (cell.className.includes("wallNode")) {
				let temp = cell.className.split(" ");
				cell.className = "";
				for (let str in temp) {
					if (str != "wallNode") cell.className += " " + str;
				}
				cell.className = cell.className.slice(1);
			}
			// If there's a currently stored end node, remove its id
			if (endNode) endNode.id = "";
			endNode = cell;
			cell.id = "endNode";
		}
	};
}

function getWallNodes() {
	return document.querySelectorAll(".wallNode");
}

//function removeStringPortion(startString, toRemove) {
//	if (!startString.includes(toRemove)) return startString;

//}