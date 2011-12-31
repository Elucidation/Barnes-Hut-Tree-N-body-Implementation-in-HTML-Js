// User Input

// Introduce new body to system at mouse position
function initUI(canvasId){
	canvasElement = document.getElementById(canvasId);
	//canvasElement.onclick = mouseClick;
	canvasElement.onmousedown = mouseDown;
	canvasElement.onmouseup = mouseUp;
	canvasElement.onmousemove	 = mouseMove;
	if (DEBUG) {
		console.log("Initialize UI complete.");
	}
}

function mouseClick(e) {

	var mouseX, mouseY;
	if(e.offsetX) {mouseX = e.offsetX; mouseY = e.offsetY;}
	else if(e.layerX) {mouseX = e.layerX;mouseY = e.layerY;} // IE

	addBody(mouseX,mouseY,0,0);
}

// Drag stuff
var isDrag = false;
var dragx,dragy,dragm;
var dragx2,dragy2;

function mouseDown(e) {
	isDrag = true;

	var mouseX, mouseY;
	if(e.offsetX) {mouseX = e.offsetX; mouseY = e.offsetY;}
	else if(e.layerX) {mouseX = e.layerX;mouseY = e.layerY;} // IE

	dragx = mouseX;
	dragy = mouseY;
	dragx2 = mouseX;
	dragy2 = mouseY;
}

function mouseMove(e) {
	if (isDrag) {
		var mouseX, mouseY;
		if(e.offsetX) {mouseX = e.offsetX; mouseY = e.offsetY;}
		else if(e.layerX) {mouseX = e.layerX;mouseY = e.layerY;} // IE
		dragx2 = mouseX;
		dragy2 = mouseY;
	}
}

function mouseUp(e) {
	if (isDrag) {
		isDrag = false;

		var mouseX, mouseY;
		if(e.offsetX) {mouseX = e.offsetX; mouseY = e.offsetY;}
		else if(e.layerX) {mouseX = e.layerX;mouseY = e.layerY;} // IE

		addBody(dragx,dragy,mouseX-dragx,mouseY-dragy,dragm);
		refreshGraphics();
	}
}


// Update mass by arrow keys while dragging
window.addEventListener('keydown',doKeyDown,true);
var MASS_STEP = 1;
dragm = 1;
function doKeyDown(evt){
	switch (evt.keyCode) {
		case 69:  /* e was pressed */
			if (DEBUG) {
				console.log("'e' key pressed");
			}
			if (isDrag && dragm+MASS_STEP <= MAXMASS){
				dragm += MASS_STEP;
			}
			break;
		case 68:  /* d key was pressed */
			if (DEBUG) {
				console.log("'d' key pressed");
			}
			if (isDrag && dragm-MASS_STEP >= MINMASS){
				dragm -= MASS_STEP;
			}
			break;
		// case 37:  /* Left arrow was pressed */
		// 	if (x - dx > 0){
		// 		x -= dx;
		// 	}
		// 	break;
		// case 39:  /* Right arrow was pressed */
		// 	if (x + dx < WIDTH){
		// 		x += dx;
		// 	}
		// 	break;
	}
}
