// Arrow Length Multipliers
drawArrows = false; // Button edit
arrowLengthRatio = 2;
ARROWHEADSIZE = 5;

// Circle Sizes
var MINRADIUS = 1;
var MAXRADIUS = 5;

// Barnes-Hut Tree Graphics
var SHOW_BN_TREE = false;
var BN_DRAW_DEPTH = 10; // Depth to draw tree out to
var BN_DRAW_TEXT_DEPTH = 4; // Depth to draw text of node bbox

// Canvas Context
var c;
// Graphics refresh timer
var gfxTimer=0;
var displayStepTime;

function initGraphics(canvasId,dataId){
	canvasElement = document.getElementById(canvasId);
	c = canvasElement.getContext("2d");
	data = document.getElementById(dataId);
	timeDisp = document.getElementById('timeDisp');
	bodyCounter = document.getElementById('bodyCount');

	//gfxTimer = setInterval(refreshGraphics,1/60.0*1000);

	if (DEBUG) {
		console.log('Initialize Graphics complete.');
	}
}

// Main Drawing --------------------------

function drawBNtree() {
	if (bnRoot && SHOW_BN_TREE) {drawBNnode(bnRoot,0)};
}
function drawBNnode(node,depth) {
	// If body in node
	if ( typeof(node.b) != 'undefined' && depth <= BN_DRAW_DEPTH) {
		// Draw Node
		drawBBOX(node.box[0],node.box[1],
			node.box[2],node.box[3]);
		c.textBaseline = 'top';
		
		if(DEBUG >= 1) {
			// Draw Center of Mass
			c.strokeStyle = '#f00';
			c.lineWidth = "0.5";
			drawCross(node.CoM[1],node.CoM[2],5);
		}

		if (node.b != "PARENT" && depth <= BN_DRAW_TEXT_DEPTH) {
			c.font = "6pt Courier New";
			c.fillStyle = "#090";
			c.fillText('B:['+node.b.join(" ")+"]",node.box[0]+1,node.box[1]+1)
		}
		// Draw Children
		for (var i=0;i<4;i++){
			var child = node.nodes[i];
			//console.log("B",node.b,": C",i," ",child);

			if (child) { drawBNnode( child , depth+1); }
		}
	}
}


// Updates text on html page
function updateData() {
	timeDisp.value = T.toFixed(2); // Update time output form
	var bruteHalfChecks = bods.N*(bods.N-1)/2; // what efficient Brute Force checks would be
	bodyCounter.innerHTML = bods.N;

	data.innerHTML = "<p><b>System "+(sysRunning?"Running":"Paused")+"</b><br/>\n\
		Bodies: "+bods.N+"<br/>\n\
		Force calculations per step: "+numChecks+"<br/>\n\
		</p>";

	if (INTERACTION_METHOD=="BN") {
		data.innerHTML += "\n\
			<p>\n\
			<b>BN Tree</b>\n\
			Depth: "+bnDepth+"<br/>\n\
			Nodes: "+bnNumNodes+"<br/>\n\
			Leafs: "+bnNumLeafs+"<br/>\n\
			</p>\n\
			<p>\n\
			<b>Number of Calculations</b><br/>\n\
			BN Tree: "+numChecks+"<br/>\n\
			Brute Force: "+bruteHalfChecks+"<br/>\n\
			</p>\n\
			<p>\n\
			Speedup : "+(100*(1-numChecks/bruteHalfChecks)).toFixed(2)+"%<br/>\n\
			</p>"
	}

		data.innerHTML += "\n\
			<p>\n\
			<b>Time per step</b><br/>\n\
			Compute : "+stepTime+"ms<br/>\n\
			Display : "+displayStepTime+"6ms<br/>\n\
			</p>";

	
	if (DEBUG>=1) {
		data.innerHTML += "<ul>";
		var i;
		for(i=0;i<bods.N;i++){
			data.innerHTML += "<li> B"+i+" : Pos "+
				bods.pos.x[i].toFixed(2)+", "+bods.pos.y[i].toFixed(2)+
				"; M: " + bods.mass[i] +
				" </li>";
		}
		data.innerHTML += "</ul>";
	}
}

// Updates graphics in Canvas
function refreshGraphics() {
	var startTime = (new Date()).getTime();

	c.clearRect(0,0,canvasElement.width,canvasElement.height);

	if (isDrag) {
		drawCircle(dragx,dragy,massToRadius(dragm));
		drawArrow(dragx,dragy,dragx2,dragy2);
	}

	com = {x:0,y:0}; // Center of mass of sys
	var allMass = 0;

	for(var i=0;i<bods.N;i++){
		drawCircle(bods.pos.x[i],bods.pos.y[i],massToRadius(bods.mass[i]));
		// Velocity arrow (Green)
		if (drawArrows) {
			drawArrow(bods.pos.x[i],
				bods.pos.y[i],
				bods.pos.x[i]+bods.vel.x[i],
				bods.pos.y[i]+bods.vel.y[i],'',"#0f0");
			// Acceleration arrow (Red)
			drawArrow(bods.pos.x[i],
				bods.pos.y[i],
				bods.pos.x[i]+bods.acc.x[i],
				bods.pos.y[i]+bods.acc.y[i],5,"#f00");
		}
		com.x += bods.pos.x[i]*bods.mass[i];
		com.y += bods.pos.y[i]*bods.mass[i];
		allMass += bods.mass[i];
	}

	// Draw Center of Mass
	com.x /= allMass;
	com.y /= allMass;

	c.strokeStyle = '#00f';
	c.lineWidth = "1";
	drawCross(com.x,com.y);

	// Draw BNtree
	drawBNtree();

	updateData();

	displayStepTime = (new Date()).getTime()-startTime;
}

function massToRadius(mass) {
	return MINRADIUS+(mass-MINMASS)/(MAXMASS-MINMASS)*(MAXRADIUS-MINRADIUS);
	
}

// Simple Shapes --------------------------
function drawBBOX(x,y,x2,y2) {
	drawBox(x,y,x2-x,y2-y);
}
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
	h = (typeof(h) != 'undefined' && h != '') ? h : ARROWHEADSIZE; // Default h
	color = typeof(color) != 'undefined' ? color : '#0f0'; // Default color

	// Resize arrow based on arrowLengthRatio
	// v = [x2-x,y2-y];
	// vMag = Math.sqrt(v[0]*v[0]+v[1]*v[1]);
	// if (vMag==0) {vMag = 1;}
	// console.log(vMag);

	// x2 = x + v[0]*arrowLengthRatio/vMag;
	// y2 = y + v[1]*arrowLengthRatio/vMag;
	
	// Linear Ratio
	x2 = x + (x2-x)/arrowLengthRatio;
	y2 = y + (y2-y)/arrowLengthRatio;

	// Logarithmic Ratio
	// var d = getDist(x,y,x2,y2);
	// var arrowLength = (Math.log(2+d)-Math.log(2))/Math.log(1.1);
	// x2 = x + (x2-x)/d * arrowLength;
	// y2 = y + (y2-y)/d * arrowLength;


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
	var angle = Math.atan2(y2-y,x2-x);
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
	// Lines
	c.beginPath();
	c.moveTo(x-h/2,y);
	c.lineTo(x+h/2,y);
	c.moveTo(x,y-h/2);
	c.lineTo(x,y+h/2);
	c.closePath();
    c.stroke();
}