////////////

// Bodies struct containing all bodies
bods = {pos:{x:new Array(),y:new Array()},
		vel:{x:new Array(),y:new Array()},
		N:0};

// Canvas Context
var c;

// Called by HTML with canvasId passed in
function initBN(canvasId) {
	canvasElement = document.getElementById(canvasId);
	c = canvasElement.getContext("2d");
	console.log('Initialize BN complete.');
}

function addBody(x,y,vx,vy) {
	bods.pos.x [bods.N] = x;
	bods.pos.y [bods.N] = y;
	bods.vel.x [bods.N] = vx;
	bods.vel.y [bods.N] = vy;
	bods.N = bods.N + 1;
}
