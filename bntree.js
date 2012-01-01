////////////
var MINMASS = 1e2;
var MAXMASS = 1e4;
var G = 1; // Gravitational Constant
var ETA = 10; // Softening constant
var GFACTOR = 1.3; // Higher means distance has more effect (3 is reality)
var dt; // Global DT set by html
var MAXDEPTH = 2; // BN tree max depth

// Bodies struct containing all bodies
bods = {pos:{x:new Array(),y:new Array()},
		vel:{x:new Array(),y:new Array()},
		acc:{x:new Array(),y:new Array()},
		mass:new Array(),
		N:0};

// Canvas Context
var c;

// Called by HTML with canvasId passed in
function initBN(canvasId) {
	canvasElement = document.getElementById(canvasId);
	c = canvasElement.getContext("2d");
	if (DEBUG) {
		console.log('Initialize BN complete.');
	}
}

function addBody(x,y,vx,vy,m) {
	bods.pos.x [bods.N] = x;
	bods.pos.y [bods.N] = y;
	bods.vel.x [bods.N] = vx;
	bods.vel.y [bods.N] = vy;
	bods.acc.x [bods.N] = 0;
	bods.acc.y [bods.N] = 0;
	bods.mass [bods.N] = m;
	bods.N = bods.N + 1;

	if (DEBUG) {
	    console.log("ADD BODY M: ",m," P:",x,",",y," V:",vx,",",vy);
	}
}
// BN Tree code ------
var bnDepth, bnNumNodes, bnNumLeafs;
function bnSetTreeStats() {
	bnSetTreeStatsRecurse(bnRoot);
}
function bnSetTreeStatsRecurse(node) {
	// If body in node
	bnNumNodes += 1;
	if ( node.b.length > 0 ) {
		if (node.b != "PARENT") {
			bnNumLeafs += 1;
		}
		// Draw Children
		for (var i=0;i<4;i++){
			var child = node.nodes[i];
			//console.log("B",node.b,": C",i," ",child);

			if (child) { drawBNnode( child ); }
		}
	}
}

function bnDeleteTree() {
	if (bnRoot) {bnRoot = bnDeleteNode(bnRoot);}
}
function bnDeleteNode(node) {
	node.b = null;
	node.box = null;
	// For each child
	for (var i=0;i<4;i++) {
		if (node.nodes[i]) { // If child exists
			node.nodes[i] = bnDeleteNode(node.nodes[i]);
		}
	}
	return null;
}

var bnRoot;
function bnBuildTree() {
	bnDeleteTree(bnRoot); // Delete Tree to clear memory
	bnRoot = {b: [], // Body
		leaf:true,
		CoM: null, // center of mass
		nodes:[null,null,null,null],
		// x y x2 y2
		box:[0, 0, canvasElement.width, canvasElement.height]};
	
	// Add each body to tree
	for (var i=0;i<bods.N;i++) {
		if (pointInBBOX(bods.pos.x[i],bods.pos.y[i],bnRoot.box)) {
			bnAddBody(bnRoot,i,0);
		}
		else {
			console.log("Body ",i," has left the BNtree area. Not added");
		}
	}
	if (DEBUG>=2) {
		console.log("BNtree Built: ",bnRoot);
	}
}

// BBOX = [x y x2 y2]
function pointInBBOX(x,y,BBOX) {
	if (x >= BBOX[0] && x <= BBOX[2] && y >= BBOX[1] && y <= BBOX[3]) {return true;}
	else {return false;}
}

function bnAddBody(node,i,depth) {
	if (DEBUG>=3) {
		console.log("bnAddBody(",node,",",i,",",depth,")");
	}
	// if node has body already
	if ( node.b.length > 0 ) { // not empty
		// Check if hit max depth
		if (depth > MAXDEPTH) {
			if (DEBUG>=3) {console.log('MAX DEPTH B',i);}
			node.b [node.b.length] = i; // Add body to same node since already at max depth
		} 
		else {
			var subBodies;
			if (!node.leaf) { // Same as saying node.b = "PARENT"
				// Node is a parent with children
				subBodies = [i];
			} else {
				// Node is a leaf node (no children), turn to parent
				subBodies = [node.b,i];
			}
			for (var k=0;k<subBodies.length;k++) {
				// Add body to children too		
				var quad = getQuad(subBodies[k],node.box);
				var child = node.nodes[quad];
				if (child) {
					// if quad has child, recurse with child
					bnAddBody(child,subBodies[k],depth+1);
				} else {
					// else add body to child
					node = bnMakeNode(node,quad,subBodies[k]);
				}
			}
			node.b = ["PARENT"];
			node.leaf = false; // Always going to turn into a parent if not already
		}
		// Update center of mass
		node.CoM[1] = (node.CoM[1]*node.CoM[0] + bods.pos.x[i]*bods.mass[i])/(node.CoM[0]+bods.mass[i]);
		node.CoM[2] = (node.CoM[2]*node.CoM[0] + bods.pos.y[i]*bods.mass[i])/(node.CoM[0]+bods.mass[i]);
		node.CoM[0] += bods.mass[i];
	} else { // else if node empty, add body
		node.b = [i];
		node.CoM = [bods.mass[i], bods.pos.x[i],bods.pos.y[i]]; // Center of Mass set to the position of single body
	}
}

function getQuad(i,box) {
	var mx = (box[0]+box[2])/2;
	var my = (box[1]+box[3])/2;
	if (bods.pos.x[i] < mx) { // Left
		if (bods.pos.y[i] < my) {return 0;} // Top
		else {return 2;} // Bottom
	}
	else { // right
		if (bods.pos.y[i] < my) {return 1;} // Top
		else {return 3;} // Bottom}
	}
}

function bnMakeNode(parent,quad,child) {
	if (DEBUG>=3) {
		console.log("bnMakeNode(",parent,",",quad,",",child,")");
	}
	var child = {b:[child],
		leaf:true,
		CoM : [bods.mass[child], bods.pos.x[child],bods.pos.y[child]], // Center of Mass set to the position of single body
		nodes:[null,null,null,null],
		box:[0,0,0,0]};

	switch (quad) {
		case 0: // Top Left
			child.box = [parent.box[0],
				parent.box[1],
				(parent.box[0]+parent.box[2])/2, 
				(parent.box[1]+parent.box[3])/2];
			break;
		case 1: // Top Right
			child.box = [(parent.box[0]+parent.box[2])/2,
				parent.box[1],
				parent.box[2], 
				(parent.box[1]+parent.box[3])/2];
			break;
		case 2: // Bottom Left
			child.box = [parent.box[0],
				(parent.box[1]+parent.box[3])/2,
				(parent.box[0]+parent.box[2])/2, 
				parent.box[3]];
			break;
		case 3: // Bottom Right
			child.box = [(parent.box[0]+parent.box[2])/2,
				(parent.box[1]+parent.box[3])/2,
				parent.box[2], 
				parent.box[3]];
			break;
	}
	parent.nodes[quad] = child;
	return parent;
}

function doBNtree() {
}

// Update accelerations using BN tree
function forceBNtree() {
	numChecks = 0;
	bnBuildTree(); // Build BN tree based on current pos
	for (var i=0;i<bods.N;i++) {
		// For each body
		doBNtree(i);
	}
}
// ------
// do_Both defaults true: Updates acceleration of bods[j] also (negative of bods[i])
function setAccel(i,j,do_Both) {
	do_Both = typeof(do_Both) != 'undefined' ? do_Both : true;
	
	// Get Force Vector between bodies i, j
	var F = getForceVec(i,j);

	// a = F/m
	// Body i
	bods.acc.x[i] += F[0]/bods.mass[i];
	bods.acc.y[i] += F[1]/bods.mass[i];
	
	if (do_Both) {
		// Body j, equal and opposite force
		bods.acc.x[j] -= F[0]/bods.mass[j];
		bods.acc.y[j] -= F[1]/bods.mass[j];
	}
}

function getForceVec(i,j) {
	// Determines force interaction between
	// bods[i] and bods[j], an adds to bods[i]
	var dx = bods.pos.x[j]-bods.pos.x[i];
	var dy = bods.pos.y[j]-bods.pos.y[i];
	var r = Math.sqrt(dx*dx+dy*dy)+ETA;
	// F_{x|y} = d_{x|y}/r * G*M*m/r.^3;
	var F = G*bods.mass[i]*bods.mass[j]/Math.pow(r,GFACTOR);

	if (DEBUG>=4) {
		console.log("B",i," <-> B",j," : ",F);
	}

	return [ F*dx/r , F*dy/r ];
}

// Update accels by checking every body to each other
function forceBrute() {
	numChecks = 0;
	// Brute force O(n^2) comparisons
	for (var i=0;i<bods.N;i++) {
		for (var j=i+1;j<bods.N;j++) {
			setAccel(i,j);
			numChecks += 1;
		}
	}
}


var numChecks;
// Set accelerations of bodies based on gravity
function doForces() {
	// Zero accelerations
	for (var i=0;i<bods.N;i++) {
		bods.acc.x[i]=0;
		bods.acc.y[i]=0;
	}

	// Determine accelerations on all bodies
	bnBuildTree(); // REMOVE WHEN doing forceBNtree!
	forceBrute();
	
	if (DEBUG>=2) {
		console.log("# Force Checks: ",numChecks);
	}
}

// Basic update system step by time step dt
var T = 0; // current system time
var dt = 0.01;
function step() {
	
	// Use integration method to step once by global dt
	leapfrog();

	T += dt;
	if (DEBUG>=2) {
	    console.log("STEP");
	}
	refreshGraphics();
}
function forwardEuler() {
	doForces(); // Set/Update accelerations
	updatePos(dt); // Move full step
	updateVel(dt); // Move Velocities full step
}

function leapfrog() {
	updatePos(0.5*dt); // Move half step
	doForces(); // Set/Update accelerations
	updateVel(dt); // Move Velocities full step
	updatePos(0.5*dt); // Move half step
}

function updatePos(dt_step) {
	// Update body positions based on velocities
	for (var i=0;i<bods.N;i++) {
		bods.pos.x[i] += bods.vel.x[i]*dt_step;
		bods.pos.y[i] += bods.vel.y[i]*dt_step;
	}
}
function updateVel(dt_step) {
	// Update body velocities based on accelerations
	for (var i=0;i<bods.N;i++) {
		bods.vel.x[i] += bods.acc.x[i]*dt_step;
		bods.vel.y[i] += bods.acc.y[i]*dt_step;
	}
}


var sysTimer;
var sysRunning = false;
function startSys() {
	sysTimer = setInterval(step,10);
	gfxTimer = setInterval(refreshGraphics,1/60.0*1000);
	sysRunning = true;
	if (DEBUG) {
	    console.log("START SYSTEM ",T,"s");
	}
}
function pauseSys() {
	clearInterval(sysTimer);
	clearInterval(gfxTimer);
	sysRunning = false;
	if (DEBUG) {
	    console.log("STOP SYSTEM ",T,"s");
	}
}