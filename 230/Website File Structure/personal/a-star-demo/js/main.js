// GLOBAL FIELDS
const
	START_NODE_ID = "startNode",
	END_NODE_ID = "endNode",
	WALL_NODE_CLASS_NAME = "wallNode";
let OPEN = new Array(),
	CLOSED = new Array(),
	gridCells;

window.onload = init;

function init() {
	resetGrid();
	document.querySelector("#controlGridWidth").onchange = resetGrid;
	document.querySelector("#controlGridHeight").onchange = resetGrid;
	document.querySelector("#simPlay").onclick = playSimulation;
	document.querySelector("#simStep").onclick = stepSimulation;
	document.querySelector("#simReset").onclick = resetSimulation;
}

function resetGrid(e) {
	gridCells = buildGrid(document.querySelector("#controlGridWidth").value, document.querySelector("#controlGridHeight").value, 0, "gridContainer")[1];
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
			// If there's a currently stored start node, remove its id
			if (getStartNode()) getStartNode().id = "";
			if (cell.className.includes(WALL_NODE_CLASS_NAME)) {
				let temp = cell.className.split(" ");
				cell.className = "";
				temp.forEach((str) => {
					if (str != WALL_NODE_CLASS_NAME) cell.className += " " + str;
				});
				cell.className = cell.className.slice(1);
			}
			if (cell.id == END_NODE_ID) cell.id = "";
			cell.id = START_NODE_ID;
		}
		else if (currAction == "Wall") {
			if (cell.id == START_NODE_ID) cell.id = "";
			if (cell.id == END_NODE_ID) cell.id = "";
			if (!cell.className.includes(WALL_NODE_CLASS_NAME)) cell.className += " " + WALL_NODE_CLASS_NAME;
		}
		else if (currAction == "End") {
			if (cell.id == START_NODE_ID) cell.id = "";
			if (cell.className.includes(WALL_NODE_CLASS_NAME)) {
				let temp = cell.className.split(" ");
				cell.className = "";
				temp.forEach((str) => {
					if (str != WALL_NODE_CLASS_NAME) cell.className += " " + str;
				});
				cell.className = cell.className.slice(1);
			}
			// If there's a currently stored end node, remove its id
			if (getEndNode()) getEndNode().id = "";
			cell.id = END_NODE_ID;
		}
	};
}

function playSimulation() {

}

function stepSimulation() {

}

function AStar(start, goal, h) {
	let startAsNode = new MyNode(start, 0, h(start));
	OPEN.push(start);

	let cameFrom;

	let currNode;
	while (OPEN.length != 0) {
		// get node w/ lowest score
		currNode = () => {
			let lowestFScore = OPEN[0];
			for (let i = 0; i < OPEN.length; i++)
				if (OPEN[i].fScore < lowestFScore)
					lowestFScore = OPEN[i];
			return lowestFScore;
		};
		// Remove from open set
		OPEN = OPEN.filter((e) => { return e != currNode; });
		// if it's done, finish
		//if (currNode = goal)

	}
}

function resetSimulation() {
	OPEN = new Array();
	CLOSED = new Array();
}

function getWallNodes() {
	return document.querySelectorAll("." + WALL_NODE_CLASS_NAME);
}

function getStartNode() {
	return document.querySelector("#" + START_NODE_ID);
}

function getEndNode() {
	return document.querySelector("#" + END_NODE_ID);
}

//function removeStringPortion(startString, toRemove) {
//	if (!startString.includes(toRemove)) return startString;

//}

function getNeighboringNodes(node) {
	let coords = getNodeCoords(node), nodes = new Array(), xCoord = coords[0], yCoord = coords[1];
	//for (let i = -1; i < 2; i++) {
	//	for (let j = -1; j < 2; j++) {

	//	}
	//}
	nodes.push(gridCells[xCoord - 1][yCoord - 1]);
	nodes.push(gridCells[xCoord][yCoord - 1]);
	nodes.push(gridCells[xCoord + 1][yCoord - 1]);
	nodes.push(gridCells[xCoord - 1][yCoord]);
	nodes.push(gridCells[xCoord][yCoord]);
	nodes.push(gridCells[xCoord + 1][yCoord]);
	nodes.push(gridCells[xCoord - 1][yCoord + 1]);
	nodes.push(gridCells[xCoord][yCoord + 1]);
	nodes.push(gridCells[xCoord + 1][yCoord + 1]);
}

function getNodeCoords(node) {
	for (let i = 0; i < gridCells.length; i++)
		for (let j = 0; j < gridCells[i].length; j++)
			if (gridCells[i][j] == node) return [i, j];
	return null;
}

class MyNode {
	constructor(elem, gScore, fScore) {
		this.elem = elem;
		this.gScore = gScore;
		this.fScore = fScore;
	}
}
