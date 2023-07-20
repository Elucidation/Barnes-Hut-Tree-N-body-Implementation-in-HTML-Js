// User Input Stuff
// Introduce new body to system at mouse position
function initUI(canvasId) {
  canvasElement = document.getElementById(canvasId);
  //canvasElement.onclick = mouseClick;
  canvasElement.onmousedown = mouseDown;
  canvasElement.onmouseup = mouseUp;
  canvasElement.onmousemove = mouseMove;
  if (DEBUG) {
    console.log("Initialize UI complete.");
  }
  setDT(-2);
}

function mouseClick(e) {
  var mouseX, mouseY;
  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  } else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  } // IE

  addBody(mouseX, mouseY, 0, 0);
}

// Drag stuff
var isDrag = false;
var dragx, dragy, dragm;
var dragx2, dragy2;

function mouseDown(e) {
  isDrag = true;

  var mouseX, mouseY;
  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  } else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  } // IE

  dragx = mouseX;
  dragy = mouseY;
  dragx2 = mouseX;
  dragy2 = mouseY;
  refreshGraphics();
}

function mouseMove(e) {
  if (isDrag) {
    var mouseX, mouseY;
    if (e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    } else if (e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
    } // IE
    dragx2 = mouseX;
    dragy2 = mouseY;
    dragx2 = (mouseX - dragx) / arrowLengthRatio + dragx;
    dragy2 = (mouseY - dragy) / arrowLengthRatio + dragy;
    refreshGraphics();
  }
}

function mouseUp(e) {
  if (isDrag) {
    isDrag = false;

    var mouseX, mouseY;
    if (e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    } else if (e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
    } // IE

    mouseX = (mouseX - dragx) / arrowLengthRatio + dragx;
    mouseY = (mouseY - dragy) / arrowLengthRatio + dragy;

    addBody(dragx, dragy, mouseX - dragx, mouseY - dragy, dragm);
    refreshGraphics();
  }
}

// Update mass by arrow keys while dragging
window.addEventListener("keydown", doKeyDown, true);
var MASS_STEP = (MAXMASS - MINMASS) / 10;
dragm = (MINMASS + MAXMASS) / 2;
function doKeyDown(evt) {
  switch (evt.keyCode) {
    case 69 /* e was pressed */:
      if (DEBUG) {
        console.log("'e' key pressed");
      }
      if (isDrag && dragm + MASS_STEP <= MAXMASS) {
        dragm += MASS_STEP;
      }
      break;
    case 68 /* d key was pressed */:
      if (DEBUG) {
        console.log("'d' key pressed");
      }
      if (isDrag && dragm - MASS_STEP >= MINMASS) {
        dragm -= MASS_STEP;
      }
      break;
    case 80 /* p key was pressed */:
      if (DEBUG) {
        console.log("'p' key pressed");
      }
      if (sysRunning) {
        pauseSys();
      } else {
        startSys();
      }
      break;
    case 83 /* s key was pressed */:
      if (DEBUG) {
        console.log("'s' key pressed");
      }
      step();
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
function setDT(v) {
  dt = Math.pow(10, v);
  if (DEBUG) {
    console.log("DT SET: ", dt);
  }
  document.getElementById("dtSliderVal").innerHTML = dt.toFixed(4);
}

function setDEBUG(lvl) {
  DEBUG = lvl % DEBUGMAX;
  console.log("DEBUG SET: ", DEBUG);
  document.getElementById("debugLVL").innerHTML = DEBUG;
  document.getElementById("debugSlider").value = DEBUG;
  refreshGraphics();
}

function toggleDEBUG() {
  setDEBUG(DEBUG + 1);
}

function toggleArrows() {
  drawArrows = !drawArrows;
  console.log("SHOW ARROWS SET : ", drawArrows);
  refreshGraphics();
}

function toggleShowBNtree() {
  SHOW_BN_TREE = !SHOW_BN_TREE;
  console.log("SHOW BN TREE : ", SHOW_BN_TREE);
  if (!sysRunning) {
    bnBuildTree();
  }
  refreshGraphics();
}

function resetSys() {
  resetBodies();
  bnDeleteTree();
  console.log("DELETED ALL BODIES");
  refreshGraphics();
}
