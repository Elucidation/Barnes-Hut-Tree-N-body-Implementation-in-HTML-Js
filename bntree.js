////////////
var MINMASS = 1e2;
var MAXMASS = 1e4;
var G = 1; // Gravitational Constant
var ETA = 10; // Softening constant
var GFACTOR = 1.3; // Higher means distance has more effect (3 is reality)
var dt; // Global DT set by html

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
function buildTree() {
	
}
function doBNtree() {
	
}
// Update accelerations using BN tree
function forceBNtree() {
	numChecks = 0;
	for (i=0;i<bods.N;i++) {
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

	if (DEBUG==2) {
		console.log("B",i," <-> B",j," : ",F);
	}

	return [ F*dx/r , F*dy/r ];
}

// Update accels by checking every body to each other
function forceBrute() {
	numChecks = 0;
	// Brute force O(n^2) comparisons
	for (i=0;i<bods.N;i++) {
		for (j=i+1;j<bods.N;j++) {
			setAccel(i,j);
			numChecks += 1;
		}
	}
}


var numChecks;
// Set accelerations of bodies based on gravity
function doForces() {
	var i,j;

	// Zero accelerations
	for (i=0;i<bods.N;i++) {
		bods.acc.x[i]=0;
		bods.acc.y[i]=0;
	}

	// Determine accelerations on all bodies
	forceBrute();
	
	if (DEBUG==2) {
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
	if (DEBUG==2) {
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
	for (i=0;i<bods.N;i++) {
		bods.pos.x[i] += bods.vel.x[i]*dt_step;
		bods.pos.y[i] += bods.vel.y[i]*dt_step;
	}
}
function updateVel(dt_step) {
	// Update body velocities based on accelerations
	for (i=0;i<bods.N;i++) {
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