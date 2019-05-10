// Returns: An array of 2 elements;
//				The element holding the grid (if not already in document, must be inserted)
//				A matrix of grid cells
function buildGrid(numRows, numCols, cellSpacing, containerId = "gridContainer") {
	let gridContainer = document.querySelector(`#${containerId}`);
	if (!(gridContainer)) {
		gridContainer = document.createElement("div");
		gridContainer.id = containerId;
	}
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

	let cells = [];

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
	return [gridContainer, cells];
}