//debugger;
// The currently selected note
let selectedNote = null;

let trayPosit;

// Here to allow detaching this event listener
let onMouseUpStopMovingNoteFunc;

window.onload = init;

function init()
{
	let temp = document.querySelector("#controlbar").getBoundingClientRect();
	trayPosit = new DOMRect(temp.x + window.pageXOffset, temp.y + window.pageYOffset, temp.width, temp.height);
	console.log(trayPosit);
	document.querySelector("#createNote").onclick = (e) => {
		document.querySelector("#mainContent").appendChild(createNote(document.querySelector("#textInput").value));
	};
	document.querySelector("#mainContent").appendChild(createNote("Filler text filler text"));
}

function createNote(noteName) {
	// 1. Create new note element
	let newNote = document.createElement("div");
	// 2. Set style class
	newNote.className = "note";
	// 3. Create title element
	let noteTitle = document.createElement("h1");
	// 4. Set title class
	noteTitle.className = "noteTitle";
	// 5. Set title content
	noteTitle.innerHTML = noteName;
	// 6. Append title to note
	newNote.appendChild(noteTitle);
	// 7. Add function to move note on mouse down
	newNote.onmousedown = noteOnMouseDown;
	// 8. Set initial positioning
	newNote.style.position = "relative";
	newNote.style.left = trayPosit.left + "px";
	newNote.style.top = trayPosit.top + "px";
	// 9. Set the new note as the selected note
	selectedNote = newNote;
	// 10. Return new note
	return newNote;
}

function noteOnMouseDown(e) {
	selectedNote = e.currentTarget;
	// If left button was pressed...
	if (e.button == 0) {
		// ...update position on mouse move...
		e.currentTarget.onmousemove = (eventArgs) => {
			console.log("Movement: " + eventArgs.movementX + ", " + eventArgs.movementY);
			console.log("Old Posit: " + eventArgs.currentTarget.style.left + ", " + eventArgs.currentTarget.style.top);
			let temp = getNumFromString(eventArgs.currentTarget.style.left, 2);
			temp += eventArgs.movementX;
			eventArgs.currentTarget.style.left = temp + "px";
			temp = getNumFromString(eventArgs.currentTarget.style.top, 2);
			temp += eventArgs.movementY;
			eventArgs.currentTarget.style.top = temp + "px";
			console.log("New Posit: " + eventArgs.currentTarget.style.left + ", " + eventArgs.currentTarget.style.top);
		};
		// ...and watch for when left button is released to know when to stop watching.
		onMouseUpStopMovingNoteFunc = (eventArgs) => {
			if (eventArgs.button == 0/* && e.target.className.includes("note")*/) {
				// ...to know when to stop watching.
				/*e.currentTarget*/selectedNote.onmousemove = null;
				/*e.currentTarget*/selectedNote.onmouseup = null;
			}
		};
		if (window.addEventListener) {
			window.addEventListener("mouseup", onMouseUpStopMovingNoteFunc);
		}
		else {
			window.attachEvent("onmouseup", onMouseUpStopMovingNoteFunc);
		}
	}
}

// Takes a string containing numbers (and optionally unwanted preceeding/trailing characters) and returns the numerical value of the string.
function getNumFromString(fullStr, numTrailingChars = 0, numPreceedingChars = 0) {
	console.log("fullStr: " + fullStr + "; trailing: " + numTrailingChars + ", preceeding: " + numPreceedingChars);
	fullStr = fullStr.slice(numPreceedingChars, /*fullStr.length - (*/-numTrailingChars/* + 1)*/);
	console.log(fullStr);
	let retVal = Number(fullStr);
	console.log("RetVal: " + retVal);
	return retVal;
}

function checkIfNote(element) {
	return (e.target.className != "note"/*== "noteTitle"*/)
}

//function onMouseUpStopMovingNote(e) {
//	if (e.button == 0) {
//		selectedNote.onmousemove = null;
//		selectedNote.onmouseup = null;
//	}
//}

//function createAutoReplacingTextField(finalType) {
//	// 1. Create new user text input element
//	let newElem = document.createElement("input");
//	// 2. Set as text input
//	newElem.setAttribute("type", "text");
//	// 3. Set as autofocus
//	newElem.setAttribute("autofocus", "true");
//	// 4. 
//}