"use strict";

function Character() {
	this.hexagon = null;
	this.pattern = null;
	
	// For animation purpose
	// Set by level renderer
	this.startx = -1;
	this.starty = -1;
	this.endx = -1;
	this.endy = -1;
	this.t = 0;
	this.animationRunning = false;

	this.x = -1;
	this.y = -1;
}

Character.prototype.update = function(dt) {
	if (this.animationRunning) {
		this.t += dt;
		if (this.t > 300) {
			this.t = 300;
			this.animationRunning = false;
		}
		this.x = this.startx + this.t / 300 * (this.endx - this.startx);
		this.y = this.starty + this.t / 300 * (this.endy - this.starty);
	}
};

Character.prototype.render = function(ctx) {
	this.pattern.draw(ctx, "basic", this.x, this.y);
};

Character.prototype.initAnimation = function(startx, starty, endx, endy) {
	this.startx = startx;
	this.starty = starty;
	this.endx = endx;
	this.endy = endy;
	this.t = 0;
	this.animationRunning = true;
};