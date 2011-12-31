
// Arrow Length Multipliers
arrowMult = 1;

// Canvas Context
var c;


function initGraphics(canvasId,dataId){
	canvasElement = document.getElementById(canvasId);
	c = canvasElement.getContext("2d");
	data = document.getElementById(dataId);

	gfxTimer = setInterval(refreshGraphics,1/60.0*1000);

	if (DEBUG) {
		console.log('Initialize Graphics complete.');
	}
}

// Main Drawing --------------------------


// Updates text on html page
function updateData() {
	data.innerHTML = "";
	if (sysRunning) {
		data.innerHTML += ("System <b>Running</b>");
	} 
	else {
		data.innerHTML += ("System <b>Stopped/Paused</b>");
	}
	data.innerHTML += "<br>\n";
	data.innerHTML += "# Bodies: "+bods.N+"<br/>\n";
	data.innerHTML += "# Force calcuations per step: "+numChecks+"\n";
	data.innerHTML += "<ul>";
	var i;
	for(i=0;i<bods.N;i++){
		data.innerHTML += "<li> B"+i+" : Pos "+
			bods.pos.x[i].toFixed(2)+", "+bods.pos.y[i].toFixed(2)+
			" </li>";
	}
	data.innerHTML += "</ul>";
}

// Updates graphics in Canvas
function refreshGraphics() {
	c.clearRect(0,0,canvasElement.width,canvasElement.height);

	if (isDrag) {
		drawCircle(dragx,dragy,massToRadius(dragm));
		drawArrow(dragx,dragy,dragx2,dragy2);
	}

	com = {x:0,y:0}; // Center of mass of sys
	var allMass = 0;

	for(i=0;i<bods.N;i++){
		drawCircle(bods.pos.x[i],bods.pos.y[i],massToRadius(bods.mass[i]));
		// Velocity arrow (Green)
		drawArrow(bods.pos.x[i],
			bods.pos.y[i],
			bods.pos.x[i]+bods.vel.x[i],
			bods.pos.y[i]+bods.vel.y[i],'',"#0f0");
		// Acceleration arrow (Red)
		drawArrow(bods.pos.x[i],
			bods.pos.y[i],
			bods.pos.x[i]+bods.acc.x[i],
			bods.pos.y[i]+bods.acc.y[i],5,"#f00");
		com.x += bods.pos.x[i]*bods.mass[i];
		com.y += bods.pos.y[i]*bods.mass[i];
		allMass += bods.mass[i];
	}

	// Draw Center of Mass
	com.x /= allMass;
	com.y /= allMass;
	drawCross(com.x,com.y);

	updateData();
}

var MINRADIUS = 1;
var MAXRADIUS = 20;

function massToRadius(mass) {
	return MINRADIUS+(mass-MINMASS)/(MAXMASS-MINMASS)*(MAXRADIUS-MINRADIUS);
	
}

// Simple Shapes --------------------------
function drawBox(x,y,w,h) {
	c.strokeStyle = '#00f';
	c.lineWidth = "1";
	c.strokeRect(x,y,w,h);	
}

// x,y center with radius r
function drawCircle(x,y,r) {
	c.strokeStyle = '#f00';
	c.fillStyle = '#fff';
	c.lineWidth = "1";
	c.beginPath();
	c.arc(x,y,r,0,Math.PI*2,true); 
	c.closePath();
	c.stroke();
	//c.fill();
}

// Arrow
// x,y start to x2,y2 end
// h = Arrow Head size
function drawArrow(x,y,x2,y2,h,color) {
	h = (typeof(h) != 'undefined' && h != '') ? h : 10; // Default h
	color = typeof(color) != 'undefined' ? color : '#0f0'; // Default color
	var angle = Math.atan2(y2-y,x2-x);

	x2 = x + (x2-x)*arrowMult;
	y2 = y + (y2-y)*arrowMult;

	c.strokeStyle = color;
	c.fillStyle = color;
	c.lineWidth = "0";

	
	// Line
	c.beginPath();
	c.moveTo(x,y);
	c.lineTo(x2,y2);
	c.closePath();
    c.stroke();

	// Arrow head
	c.beginPath();
	c.moveTo(x2,y2);
    c.lineTo(x2-h*Math.cos(angle-Math.PI/8),y2-h*Math.sin(angle-Math.PI/8));
    c.lineTo(x2-h*Math.cos(angle+Math.PI/8),y2-h*Math.sin(angle+Math.PI/8));
    c.lineTo(x2,y2);
    c.closePath();
    c.fill();
}

// h = cross line width
function drawCross(x,y,h) {
	h = typeof(h) != 'undefined' ? h : 10; // Default h
	c.strokeStyle = '#00f';
	c.lineWidth = "1";

	// Lines
	c.beginPath();
	c.moveTo(x-h/2,y);
	c.lineTo(x+h/2,y);
	c.moveTo(x,y-h/2);
	c.lineTo(x,y+h/2);
	c.closePath();
    c.stroke();
}