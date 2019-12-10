"use strict";

class AStarData {
	constructor(start, goal, h, gScores = [], fScores = [], cameFrom = [], currNode = start) {
		this.start = start;
		this.goal = goal;
		this.h = h;

		this.gScores = gScores;
		this.fScores = fScores;
		this.cameFrom = cameFrom;
		this.currNode = currNode;

		this.isComplete = false;
		this.path = null;
	}
}

class BreadthFirstData {
	constructor(start, goal, gScores = [], cameFrom = [], currNode = start) {
		this.start = start;
		this.goal = goal;

		this.gScores = gScores;
		this.cameFrom = cameFrom;
		this.currNode = currNode;

		this.isComplete = false;
		this.path = null;
	}
}


class Node {
	constructor(nodeLabel, nodeConnectionList, nodeElem) {
		this.nodeLabel = nodeLabel;
		this.nodeConnectionList = nodeConnectionList;
		this.nodeElem = nodeElem;
	}
}


class NodeConnection {
	constructor(nodeStart, nodeEnd, weight) {
		this.nodeStart = nodeStart;
		this.nodeEnd = nodeEnd;
		this.weight = weight;
	}
}

class StateInfo {
	constructor() {
		this.isLMBDown = false;
		this.isMMBDown = false;
		this.isRMBDown = false;
		//this.isLMBDown = false;

		// Set listeners to automatically update values.
		document.addEventListener("mousedown", (e) => {
			if (e.button == 0)
				this.isLMBDown = true;
			if (e.button == 1 || e.button == 4)
				this.isMMBDown = true;
			if (e.button == 2)
				this.isRMBDown = true;
		});
		document.addEventListener("mouseup", (e) => {
			if (e.button == 0)
				this.isLMBDown = false;
			if (e.button == 1 || e.button == 4)
				this.isMMBDown = false;
			if (e.button == 2)
				this.isRMBDown = false;
		});
	}
}