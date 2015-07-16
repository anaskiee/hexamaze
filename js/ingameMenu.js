"use strict";

function IngameMenu(canvas, context, screenWidth, screenHeight) {
	this.canvas = canvas;
	this.ctx = context;
	this.width = screenWidth/2;
	this.height = screenHeight/2;
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;

	this.offsetX = -1;
	this.offsetY = -1;

	this.beginning = -1;
	this.animationRunning = false;
	this.animationDuration = 500;

	this.canvas.style.position = "absolute";
	this.reduce();
}

IngameMenu.prototype.reduce = function(date) {
	this.offsetX = (this.screenWidth - this.width) / 2;
	this.offsetY = -0.97*this.height;
}

IngameMenu.prototype.expand = function(date) {
	this.beginning = date;
	this.animationRunning = true;

	this.offsetX = (this.screenWidth - this.width) / 2;
	this.offsetY = (this.screenHeight - this.height) / 2;
}

IngameMenu.prototype.draw = function(date) {
	var factor;
	if (!this.animationRunning) {
		factor = 1;
	} else {
		factor = (date - this.beginning) / this.animationDuration;
		if (factor > 1) {
			factor = 1;
			this.animationRunning = false;
		}
	}
	var l = factor*0.7*this.width;
	var h = 0.9*this.height;
	var x = h / 2 / Math.sqrt(3);

	this.ctx.save();
	this.ctx.translate(this.offsetX + this.width/2, this.offsetY + this.height/2);

	// Draw hexagon style menu
	this.drawDistortedHexagon(this.ctx, l, h, x, "#000000");
	this.drawDistortedHexagon(this.ctx, 0.992*l, 0.98*h, 0.98*x, "#555555");
	this.ctx.clip();

	// Draw text
	this.ctx.fillStyle = "#000000";
	this.ctx.font = this.height/6 + "px motorwerk";
	this.ctx.textAlign = "center";
	this.ctx.fillText("Ingame menu text !", 0, -this.height/6);
	this.ctx.fillText("Play", 0, this.height/6);
	this.ctx.fillText("again", 0, (1/6 + 1/10)*this.height);

	this.ctx.restore();
}

IngameMenu.prototype.drawDistortedHexagon = function(ctx, l, h, x, color) {
	ctx.beginPath();
	ctx.moveTo(-l/2 - x, 0);
	ctx.lineTo(-l/2, -h/2);
	ctx.lineTo(l/2, -h/2);
	ctx.lineTo(l/2 + x, 0);
	ctx.lineTo(l/2, h/2);
	ctx.lineTo(-l/2, h/2);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

IngameMenu.prototype.cleanCanvas = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}