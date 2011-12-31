// User Input

// Introduce new body to system at mouse position
function initUI(canvasId){
	canvasElement = document.getElementById(canvasId);
	//canvasElement.onclick = mouseClick;
	canvasElement.onmousedown = mouseDown;
	canvasElement.onmouseup = mouseUp;
}

function mouseClick(e) {

	var mouseX, mouseY;
	if(e.offsetX) {mouseX = e.offsetX; mouseY = e.offsetY;}
	else if(e.layerX) {mouseX = e.layerX;mouseY = e.layerY;} // IE

	addBody(mouseX,mouseY,0,0);
}

// Drag stuff
var isDrag = false;
var dragx,dragy;

function mouseDown(e) {
	isDrag = true;

	var mouseX, mouseY;
	if(e.offsetX) {mouseX = e.offsetX; mouseY = e.offsetY;}
	else if(e.layerX) {mouseX = e.layerX;mouseY = e.layerY;} // IE

	dragx = mouseX;
	dragy = mouseY;
}

function mouseUp(e) {
	isDrag = false;

	var mouseX, mouseY;
	if(e.offsetX) {mouseX = e.offsetX; mouseY = e.offsetY;}
	else if(e.layerX) {mouseX = e.layerX;mouseY = e.layerY;} // IE
	
	addBody(dragx,dragy,mouseX-dragx,mouseY-dragy);
	refresh();
}