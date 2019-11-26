"use strict";

// GLOBAL FIELDS
const
	START_NODE_ID = "startNode",
	END_NODE_ID = "endNode",
	WALL_NODE_CLASS_NAME = "wallNode",
	PATH_NODE_CLASS_NAME = "pathNode",
	CLOSED_NODE_CLASS_NAME = "closedNode",
	OPEN_NODE_CLASS_NAME = "openNode";
let OPEN = new Array(),
	//CLOSED = new Array(),
	gridCells,
	canTravelDiagonally = true,
	shouldLoopGen = false;

// A STAR FIELDS
let a_gScores = new Array(),
	a_fScores = new Array(),
	a_cameFrom = new Array(),
	a_start,
	a_goal,
	a_h,
	a_currNode,
	aStarDataObj = null;
//function AStarVars() {

//}

// CONST HELPER FUNC
const
	DIST_BTWN_2_PNTS = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));

// CONST BUILT-IN HEURISTICS
const
	H_DEFAULT_GRID = (node) => {
		let t1 = getNodeCoords(node), t2 = getNodeCoords(getEndNode());
		return DIST_BTWN_2_PNTS(t1[0], t1[1], t2[0], t2[1]);
	},
	H_DEFAULT_MANHATTAN_GRID = (node) => {
		let t1 = getNodeCoords(node), t2 = getNodeCoords(getEndNode());
		return Math.abs(t2[0] - t1[0]) + Math.abs(t2[1] - t1[1]);
	};

window.onload = init;

function init() {
	resetGrid();
	document.querySelector("#controlGridWidth").onchange = resetGrid;
	document.querySelector("#controlGridHeight").onchange = resetGrid;
	document.querySelector("#simPlay").onclick = playAtSpeedSimulation;
	document.querySelector("#simPlayAll").onclick = playSimulation;
	document.querySelector("#simStep").onclick = stepSimulation;
	document.querySelector("#simReset").onclick = resetSimulation;
	document.onkeydown = (e) => {
		if (e.char == "s") {
			stepSimulation();
		}
	};
	document.querySelector("#testNeighbors").onclick = testNeighbors;
	document.querySelector("#clearPathNodes").onclick = clearPathNodes;
	document.querySelector("#clearWallNodes").onclick = clearWallNodes;
	document.querySelector("#toggleDiagonal").onclick = e => canTravelDiagonally = !canTravelDiagonally;
	document.querySelector("#genRandomWalls").onclick = genRandomWalls;
	document.querySelector("#shouldLoopGen").onclick = e => shouldLoopGen = !shouldLoopGen;
	//document.querySelector("#").onclick = ;
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

		// Get the currently selected action
		for (let i = 0; i < formElems.length; i++)
			if (formElems[i].checked)
				currAction = formElems[i].value;

		if (currAction == "Start") {
			// If there's a currently stored start node, remove its id
			if (getStartNode())
				getStartNode().id = "";

			// Remove it as a wall
			removeClassName(cell, WALL_NODE_CLASS_NAME);

			// If this cell is the end node, remove it as the end node
			if (cell.id == END_NODE_ID)
				cell.id = "";

			// Set this cell as the start node
			cell.id = START_NODE_ID;
		}
		else if (currAction == "Wall") {
			// If this is either the start or end nodes, remove it as such
			if (cell.id == START_NODE_ID || cell.id == END_NODE_ID)
				cell.id = "";

			// If it isn't already a wall node, make it one
			if (!cell.className.includes(WALL_NODE_CLASS_NAME))
				cell.className += " " + WALL_NODE_CLASS_NAME;
		}
		else if (currAction == "End") {
			// If this cell is the start node, remove it as the start node
			if (cell.id == START_NODE_ID)
				cell.id = "";

			// Remove it as a wall
			removeClassName(cell, WALL_NODE_CLASS_NAME);

			// If there's a currently stored end node, remove its id
			if (getEndNode())
				getEndNode().id = "";

			// Set this cell as the end node
			cell.id = END_NODE_ID;
		}
		else if (currAction == "DeleteWall") {
			removeClassName(cell, WALL_NODE_CLASS_NAME);
		}
	};
}

function testNeighbors() {
	if (getStartNode()) {
		let neighbors = getNeighboringNodes(getStartNode());
		if (neighbors)
			neighbors.forEach((e) => { e.className += " " + PATH_NODE_CLASS_NAME; });
	}
}

function genRandomWalls() {
	resetSimulation();
	resetGrid();
	let wallsToGen = Math.round(document.querySelector("#controlGridWidth").value * document.querySelector("#controlGridHeight").value * (40 / 100));
	gridCells.forEach(t => t.forEach(cell => {
		if (Math.random() <= .4 && wallsToGen > 0) {
			cell.className += " " + WALL_NODE_CLASS_NAME;
		}
	}));

	// If there's a currently stored start node, remove its id
	if (getStartNode())
		getStartNode().id = "";

	// Remove it as a wall
	removeClassName(gridCells[0][0], WALL_NODE_CLASS_NAME);

	// If this cell is the end node, remove it as the end node
	if (gridCells[0][0].id == END_NODE_ID)
		gridCells[0][0].id = "";

	// Set this cell as the start node
	gridCells[0][0].id = START_NODE_ID;
	// If this cell is the start node, remove it as the start node
	if (gridCells[gridCells.length - 1][gridCells[gridCells.length - 1].length - 1].id == START_NODE_ID)
		gridCells[gridCells.length - 1][gridCells[gridCells.length - 1].length - 1].id = "";

	// Remove it as a wall
	removeClassName(gridCells[gridCells.length - 1][gridCells[gridCells.length - 1].length - 1], WALL_NODE_CLASS_NAME);

	// If there's a currently stored end node, remove its id
	if (getEndNode())
		getEndNode().id = "";

	// Set this cell as the end node
	gridCells[gridCells.length - 1][gridCells[gridCells.length - 1].length - 1].id = END_NODE_ID;

	// If looping, immediately start
	if (shouldLoopGen)
		playAtSpeedSimulation();
}

// Removes path node class from all grid cells
function clearPathNodes() {
	// Traverses each grid cell in both array dimensions and calls "removeClassName" on them
	gridCells.forEach((a) => a.forEach(cell => removeClassName(cell, PATH_NODE_CLASS_NAME)));
}

// Removes wall node class from all grid cells
function clearWallNodes() {
	// Traverses each grid cell in both array dimensions and calls "removeClassName" on them
	gridCells.forEach((a) => a.forEach(cell => removeClassName(cell, WALL_NODE_CLASS_NAME)));
}

// Removes open node class from all grid cells
function clearOpenNodes() {
	// Traverses each grid cell in both array dimensions and calls "removeClassName" on them
	gridCells.forEach((a) => a.forEach(cell => removeClassName(cell, OPEN_NODE_CLASS_NAME)));
}

// Removes closed node class from all grid cells
function clearClosedNodes() {
	// Traverses each grid cell in both array dimensions and calls "removeClassName" on them
	gridCells.forEach((a) => a.forEach(cell => removeClassName(cell, CLOSED_NODE_CLASS_NAME)));
}

function playSimulation() {
	resetSimulation();
	let path = AStarComplete(getStartNode(), getEndNode(), (canTravelDiagonally) ? H_DEFAULT_GRID : H_DEFAULT_MANHATTAN_GRID);
	if (!path) {
		alert("There is no path to the end!");
		return;
	}
	let currNode;
	for (let i = 0; i < path.length; i++) {
		currNode = path[i];
		if (currNode != getStartNode() || currNode != getEndNode()) {
			currNode.className += " " + PATH_NODE_CLASS_NAME;
			removeClassName(currNode, CLOSED_NODE_CLASS_NAME);
			removeClassName(currNode, OPEN_NODE_CLASS_NAME);
		}
	}
}

function playAtSpeedSimulation() {
	if (!aStarDataObj) {
		resetSimulation();
		aStarDataObj = AStarInit(getStartNode(), getEndNode(), (canTravelDiagonally) ? H_DEFAULT_GRID : H_DEFAULT_MANHATTAN_GRID);
	}
	//else {
		aStarDataObj = AStarStep(aStarDataObj);
		if (aStarDataObj.isComplete) {
			if (!aStarDataObj.path) {
				alert("There is no path to the end!");
				return;
			}
			let currNode;
			for (let i = 0; i < aStarDataObj.path.length; i++) {
				currNode = aStarDataObj.path[i];
				if (currNode != getStartNode() || currNode != getEndNode()) {
					currNode.className += " " + PATH_NODE_CLASS_NAME;
					removeClassName(currNode, CLOSED_NODE_CLASS_NAME);
					removeClassName(currNode, OPEN_NODE_CLASS_NAME);
				}
			}
			aStarDataObj = null;
			if (shouldLoopGen) {
				setTimeout(genRandomWalls, /*document.querySelector("#controlStepDelay").value * */500);
			}
		}
		else {
			setTimeout(playAtSpeedSimulation, document.querySelector("#controlStepDelay").value * 1000);
		}
	//}
}

function stepSimulation() {
	if (!aStarDataObj)
		aStarDataObj = AStarInit(getStartNode(), getEndNode(), (canTravelDiagonally) ? H_DEFAULT_GRID : H_DEFAULT_MANHATTAN_GRID);
	//else {
		aStarDataObj = AStarStep(aStarDataObj);
		if (aStarDataObj.isComplete) {
			if (!aStarDataObj.path) {
				alert("There is no path to the end!");
				return;
			}
			let currNode;
			for (let i = 0; i < aStarDataObj.path.length; i++) {
				currNode = aStarDataObj.path[i];
				if (currNode != getStartNode() || currNode != getEndNode()) {
					currNode.className += " " + PATH_NODE_CLASS_NAME;
					removeClassName(currNode, CLOSED_NODE_CLASS_NAME);
					removeClassName(currNode, OPEN_NODE_CLASS_NAME);
				}
			}
			aStarDataObj = null;
		}
	//}
}

function AStarInit(start, goal, h) {
	let newAStarData = new AStarData(start, goal, h);
	for (let i = 0; i < gridCells.length; i++) {
		newAStarData.gScores.push([]);
		newAStarData.fScores.push([]);
		newAStarData.cameFrom.push([]);
		for (let j = 0; j < gridCells[i].length; j++) {
			newAStarData.gScores[i].push(Infinity);
			newAStarData.fScores[i].push(Infinity);
			newAStarData.cameFrom[i].push(null);
		}
	}

	// Open the start node and define it's g & f scores
	start.className += " " + OPEN_NODE_CLASS_NAME;

	let startNodeCoords = getNodeCoords(newAStarData.start), startX = startNodeCoords[0], startY = startNodeCoords[1]
	newAStarData.gScores[startX][startY] = 0;
	newAStarData.fScores[startX][startY] = newAStarData.gScores[startX][startY] + newAStarData.h(newAStarData.start);
	return newAStarData;
}

function AStarStep(data = aStarDataObj) {
	if (getOpenNodes().length != 0) {
		// get node w/ lowest score
		let lowestFScore = getOpenNodes()[0];
		for (let i = 0; i < getOpenNodes().length; i++) {
			if (getValAtNodeCoords(data.fScores, getOpenNodes()[i]) < getValAtNodeCoords(data.fScores, lowestFScore))
				lowestFScore = getOpenNodes()[i];
			else if (getValAtNodeCoords(data.fScores, getOpenNodes()[i]) == getValAtNodeCoords(data.fScores, lowestFScore)) {
				if (getOpenNodes()[i] == data.currNode)
					lowestFScore = getOpenNodes()[i];
			}
		}
		data.currNode = lowestFScore;

		// Remove from open set
		removeClassName(data.currNode, OPEN_NODE_CLASS_NAME);
		data.currNode.className += " " + CLOSED_NODE_CLASS_NAME;

		// if it's done, finish
		if (data.currNode == data.goal) {
			data.isComplete = true;
			data.path = getPathConstructed(data.goal, data.cameFrom);
			return data;
		}

		// Get collection of neighbors
		let currNodeNeighbors = getTraversableNodes(data.currNode);

		// Iterate
		currNodeNeighbors.forEach((neighbor) => {
			// g = the g of curr + the dist to neighbor
			let tempGScore = getValAtNodeCoords(data.gScores, data.currNode) + dist(data.currNode, neighbor);
			// Is this g better than the currently stored g? If so, ... 
			if (tempGScore < getValAtNodeCoords(data.gScores, neighbor)) {
				let neighborCoords = getNodeCoords(neighbor);
				// 1. Refresh the smallest gScore, ...
				data.gScores[neighborCoords[0]][neighborCoords[1]] = tempGScore;
				// 2. fScore, ...
				data.fScores[neighborCoords[0]][neighborCoords[1]] = data.gScores[neighborCoords[0]][neighborCoords[1]] + data.h(neighbor);
				// 3. ... and the best path to here, ...
				data.cameFrom[neighborCoords[0]][neighborCoords[1]] = data.currNode;
				// 4. ... and if this neighbor wasn't open, open it
				if (!nodeListToArray(getOpenNodes()).includes(neighbor)) {
					neighbor.className += " " + OPEN_NODE_CLASS_NAME;
					removeClassName(neighbor, CLOSED_NODE_CLASS_NAME);
				}
			}
		});
	}
	if (getOpenNodes().length == 0)
		data.isComplete = true;
	return data;
}

function AStarComplete(start, goal, h) {
	let gScores = new Array(),
		fScores = new Array(),
		cameFrom = new Array();
	for (let i = 0; i < gridCells.length; i++) {
		gScores.push([]);
		fScores.push([]);
		cameFrom.push([]);
		for (let j = 0; j < gridCells[i].length; j++) {
			gScores[i].push(Infinity);
			fScores[i].push(Infinity);
			cameFrom[i].push(null);
		}
	}

	// Open the start node and define it's g & f scores
	//OPEN.push(start);
	start.className += " " + OPEN_NODE_CLASS_NAME;

	let startNodeCoords = getNodeCoords(start), startX = startNodeCoords[0], startY = startNodeCoords[1]
	gScores[startX][startY] = 0;
	fScores[startX][startY] = gScores[startX][startY] + h(start);

	let currNode = start;
	//while (OPEN.length != 0) {
	while (getOpenNodes().length != 0) {
		// get node w/ lowest score
		//let lowestFScore = OPEN[0];
		let lowestFScore = getOpenNodes()[0];
		//for (let i = 0; i < OPEN.length; i++)
		//	if (getValAtNodeCoords(fScores, OPEN[i]) < getValAtNodeCoords(fScores, lowestFScore))
		//		lowestFScore = OPEN[i];
		for (let i = 0; i < getOpenNodes().length; i++)
			if (getValAtNodeCoords(fScores, getOpenNodes()[i]) < getValAtNodeCoords(fScores, lowestFScore))
				lowestFScore = getOpenNodes()[i];
		currNode = lowestFScore;

		// Remove from open set
		//OPEN = OPEN.filter((e) => { return e != currNode; });
		removeClassName(currNode, OPEN_NODE_CLASS_NAME);
		currNode.className += " " + CLOSED_NODE_CLASS_NAME;

		// if it's done, finish
		if (currNode == goal)
			return getPathConstructed(goal, cameFrom);

		// Get collection of neighbors
		let currNodeNeighbors = getTraversableNodes(currNode);

		// Iterate
		currNodeNeighbors.forEach((neighbor) => {
			// g = the g of curr + the dist to neighbor
			let tempGScore = getValAtNodeCoords(gScores, currNode) + dist(currNode, neighbor);
			// Is this g better than the currently stored g? If so, ... 
			if (tempGScore < getValAtNodeCoords(gScores, neighbor)) {
				let neighborCoords = getNodeCoords(neighbor);
				// 1. Refresh the smallest gScore, ...
				gScores[neighborCoords[0]][neighborCoords[1]] = tempGScore;
				// 2. fScore, ...
				fScores[neighborCoords[0]][neighborCoords[1]] = gScores[neighborCoords[0]][neighborCoords[1]] + h(neighbor);
				// 3. ... and the best path to here, ...
				cameFrom[neighborCoords[0]][neighborCoords[1]] = currNode;
				// 4. ... and if this neighbor wasn't open, open it
				//if (!OPEN.includes(neighbor))
				//	OPEN.push(neighbor);
				if (!nodeListToArray(getOpenNodes()).includes(neighbor)) {
					neighbor.className += " " + OPEN_NODE_CLASS_NAME;
					removeClassName(neighbor, CLOSED_NODE_CLASS_NAME);
				}
			}
		});
	}
}

function BreadthFirstInit(start, goal) {
	let bdbd = new BreadthFirstData(start, goal);
	for (let i = 0; i < gridCells.length; i++) {
		bdbd.gScores.push([]);
		bdbd.cameFrom.push([]);
		for (let j = 0; j < gridCells[i].length; j++) {
			bdbd.gScores[i].push(Infinity);
			bdbd.cameFrom[i].push(null);
		}
	}

	// Open the start node and define it's g & f scores
	start.className += " " + OPEN_NODE_CLASS_NAME;

	let startNodeCoords = getNodeCoords(bdbd.start), startX = startNodeCoords[0], startY = startNodeCoords[1]
	bdbd.gScores[startX][startY] = 0;
	return bdbd;
}
function BreadthFirstStep(bFD) {
	let pendingOpening = [];
	//for (let i = 0; i < getOpenNodes().length; i++) {

	//}
	getOpenNodes().forEach(a => getTraversableNodes(a).forEach(b => {
		if (!b.className.includes(CLOSED_NODE_CLASS_NAME)) {
			let coords = getNodeCoords(b), x = coords[0], y = coords[1], potenGScore = getValAtNodeCoords(bFD.gScores, bFD.currNode) + dist(bFD.currNode, b);
			pendingOpening.push(b);
			if (bFD.gScores[x][y] >= potenGScore) {
				bFD.gScores[x][y] = potenGScore;
				bFD.cameFrom[x][y] = bFD.currNode;
			}
			if (!b.className.includes(OPEN_NODE_CLASS_NAME)) {
				pendingOpening.push(b);
			}
			if (b == bFD.goal) {
				bFD.isComplete = true;
				bFD.path = getPathConstructed(b, bFD.cameFrom);
			}
		}
	}));
	getOpenNodes().forEach(e => {
		removeClassName(e, OPEN_NODE_CLASS_NAME);
		if (!e.className.includes(CLOSED_NODE_CLASS_NAME))
			e.className += " " + CLOSED_NODE_CLASS_NAME;
	});
	pendingOpening.forEach(b => b.className += " " + OPEN_NODE_CLASS_NAME);

	return bFD;
}

// Checks if you can travel from nodeFrom to nodeTo.
function canTraverseNode(nodeFrom, nodeTo) {
	return nodeTo.className.includes(WALL_NODE_CLASS_NAME);
}

function getPathConstructed(endNode, cameFromArr) {
	let retVal = [endNode], curr = endNode;
	while (curr != getStartNode()) {
		curr = getValAtNodeCoords(cameFromArr, curr);
		retVal.unshift(curr);
	}
	return retVal;
}

// Gets the value at the coordinates of the given node in the given array.
function getValAtNodeCoords(array, node) {
	return getValAt(array, getNodeCoords(node));
}

// Gets the value at the given coordinates of the given 2D array.
function getValAt(array, coords) {
	return array[coords[0]][coords[1]];
}

function dist(nodeA, nodeB) {
	let coordsA = getNodeCoords(nodeA), coordsB = getNodeCoords(nodeB);
	return DIST_BTWN_2_PNTS(coordsA[0], coordsA[1], coordsB[0], coordsB[1]);
}

function resetSimulation() {
	OPEN = new Array();
	//CLOSED = new Array();
	clearPathNodes();
	clearOpenNodes();
	clearClosedNodes();
	aStarDataObj = null;
}

function getWallNodes() {
	return document.querySelectorAll("." + WALL_NODE_CLASS_NAME);
}

function getOpenNodes() {
	return document.querySelectorAll("." + OPEN_NODE_CLASS_NAME);
}

function getStartNode() {
	return document.querySelector("#" + START_NODE_ID);
}

function getEndNode() {
	return document.querySelector("#" + END_NODE_ID);
}

function nodeListToArray(nodeList) {
	let retVal = [];
	nodeList.forEach(e => retVal.push(e));
	return retVal;
}

//function removeStringPortion(startString, toRemove) {
//	if (!startString.includes(toRemove)) return startString;
//}

// Gets an array of all nodes neighboring the given node
function getNeighboringNodes(node) {
	let coords = getNodeCoords(node),
		nodes = new Array(),
		xCoord = coords[0],
		yCoord = coords[1];
	console.log("Testing nodes.");
	if (isNodeValid(xCoord - 1, yCoord - 1)) nodes.push(gridCells[xCoord - 1][yCoord - 1]);
	if (isNodeValid(xCoord, yCoord - 1)) nodes.push(gridCells[xCoord][yCoord - 1]);
	if (isNodeValid(xCoord + 1, yCoord - 1)) nodes.push(gridCells[xCoord + 1][yCoord - 1]);
	if (isNodeValid(xCoord - 1, yCoord)) nodes.push(gridCells[xCoord - 1][yCoord]);
	//if (isNodeValid(xCoord, yCoord)) nodes.push(gridCells[xCoord][yCoord]);
	if (isNodeValid(xCoord + 1, yCoord)) nodes.push(gridCells[xCoord + 1][yCoord]);
	if (isNodeValid(xCoord - 1, yCoord + 1)) nodes.push(gridCells[xCoord - 1][yCoord + 1]);
	if (isNodeValid(xCoord, yCoord + 1)) nodes.push(gridCells[xCoord][yCoord + 1]);
	if (isNodeValid(xCoord + 1, yCoord + 1)) nodes.push(gridCells[xCoord + 1][yCoord + 1]);
	console.log("Return Val: " + nodes);
	return nodes;
}

// Gets an array of all traversable nodes neighboring the given node
function getTraversableNodes(node) {
	let coords = getNodeCoords(node),
		nodes = new Array(),
		xCoord = coords[0],
		yCoord = coords[1];
	console.log("Testing nodes.");
	// Formatted for VS vertical editing
	if (isNodeValid(xCoord - 1, yCoord - 1)	&& !canTraverseNode(node, gridCells[xCoord - 1][yCoord - 1]) && canTravelDiagonally) nodes.push(gridCells[xCoord - 1][yCoord - 1]);
	if (isNodeValid(xCoord + 1, yCoord - 1)	&& !canTraverseNode(node, gridCells[xCoord + 1][yCoord - 1]) && canTravelDiagonally) nodes.push(gridCells[xCoord + 1][yCoord - 1]);
	if (isNodeValid(xCoord - 1, yCoord + 1)	&& !canTraverseNode(node, gridCells[xCoord - 1][yCoord + 1]) && canTravelDiagonally) nodes.push(gridCells[xCoord - 1][yCoord + 1]);
	if (isNodeValid(xCoord + 1, yCoord + 1) && !canTraverseNode(node, gridCells[xCoord + 1][yCoord + 1]) && canTravelDiagonally) nodes.push(gridCells[xCoord + 1][yCoord + 1]);
	if (isNodeValid(xCoord + 0, yCoord - 1)	&& !canTraverseNode(node, gridCells[xCoord + 0][yCoord - 1])) nodes.push(gridCells[xCoord + 0][yCoord - 1]);
	if (isNodeValid(xCoord - 1, yCoord + 0)	&& !canTraverseNode(node, gridCells[xCoord - 1][yCoord + 0])) nodes.push(gridCells[xCoord - 1][yCoord + 0]);
	if (isNodeValid(xCoord + 1, yCoord + 0)	&& !canTraverseNode(node, gridCells[xCoord + 1][yCoord + 0])) nodes.push(gridCells[xCoord + 1][yCoord + 0]);
	if (isNodeValid(xCoord + 0, yCoord + 1)	&& !canTraverseNode(node, gridCells[xCoord + 0][yCoord + 1])) nodes.push(gridCells[xCoord + 0][yCoord + 1]);
	//if(isNodeValid(xCoord+ 0, yCoord + 0)	&& !canTraverseNode(node, gridCells[xCoord + 0][yCoord + 0])) nodes.push(gridCells[xCoord + 0][yCoord + 0]);
	console.log("Return Val: " + nodes);
	return nodes;
}

// Checks if given coordinates are within the array bounds
function isNodeValid(xCoord, yCoord) {
	return !(
		xCoord < 0 ||
		yCoord < 0 ||
		xCoord >= gridCells.length ||
		yCoord >= gridCells[xCoord].length); //yCoord >= gridCells[0].length);
}

// Gets the coordinates of the given node
function getNodeCoords(node) {
	for (let i = 0; i < gridCells.length; i++)
		for (let j = 0; j < gridCells[i].length; j++)
			if (gridCells[i][j] == node) return [i, j];
	return null;
}

// Removes the given string from the given element's classes (if found)
function removeClassName(elementToChange, nameToRemove) {
	if (elementToChange.className.includes(nameToRemove)) {
		let temp = elementToChange.className.split(" ");
		elementToChange.className = "";
		temp.forEach((str) => {
			if (str != nameToRemove)
				elementToChange.className += " " + str;
		});
		elementToChange.className = elementToChange.className.slice(1);
	}
	//return elementToChange;
}


class AStarData {
	constructor(start, goal, h, gScores = [], fScores = [], cameFrom = [], currNode = start) {
		this.start		= start;
		this.goal		= goal;
		this.h			= h;

		this.gScores	= gScores;
		this.fScores	= fScores;
		this.cameFrom	= cameFrom;
		this.currNode	= currNode;

		this.isComplete = false;
		this.path		= null;
	}
}

class BreadthFirstData {
	constructor(start, goal, gScores = [], cameFrom = [], currNode = start) {
		this.start		= start;
		this.goal		= goal;

		this.gScores	= gScores;
		this.cameFrom	= cameFrom;
		this.currNode	= currNode;

		this.isComplete = false;
		this.path		= null;
	}
}