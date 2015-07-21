"use strict";

function IngameMenu(canvas, context, screenWidth, screenHeight) {
	this.canvas = canvas;
	this.ctx = context;
	this.width = screenWidth/2;
	this.height = screenHeight/2;
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;

	// For animations
	this.initialOffsetX = -1;
	this.initialOffsetY = -1;
	this.initialWidth = -1;
	this.finalOffsetX = -1;
	this.finalOffsetY = -1;
	this.finalWidth = -1;

	// Menu characteristics
	this.offsetX = screenWidth/4;
	this.offsetY = -0.97*this.height;
	this.menuWidth = 0;

	this.beginning = -1;
	this.animationRunning = false;
	this.animationDuration = 300;
	this.animation = "";
}

IngameMenu.prototype.reduce = function(date) {
	this.beginning = date;
	this.animationRunning = true;
	this.animation = "reduce";

	this.initialOffsetX = this.offsetX;
	this.initialOffsetY = this.offsetY;
	this.initialWidth = this.menuWidth;

	this.finalOffsetX = (this.screenWidth - this.width) / 2;
	this.finalOffsetY = -0.97*this.height;
	this.finalWidth = 0;
}

IngameMenu.prototype.expand = function(date) {
	this.beginning = date;
	this.animationRunning = true;
	this.animation = "expand";

	this.initialOffsetX = this.offsetX;
	this.initialOffsetY = this.offsetY;
	this.initialWidth = this.menuWidth;

	this.finalOffsetX = (this.screenWidth - this.width) / 2;
	this.finalOffsetY = (this.screenHeight - this.height) / 2;
	this.finalWidth = 0.7*this.width;
}

IngameMenu.prototype.computeMenuCharacteristics = function(factor) {
	switch (this.animation) {
		case "expand":
			if (factor < 1) {
				this.offsetY = this.initialOffsetY + factor*(this.finalOffsetY - this.initialOffsetY);
				this.offsetX = this.initialOffsetX + factor*(this.finalOffsetX - this.initialOffsetX);
			} else {
				this.offsetX = this.finalOffsetX;
				this.offsetY = this.finalOffsetY;
				this.menuWidth = this.initialWidth + (factor - 1)*(this.finalWidth - this.initialWidth);
			}
			break;

		case "reduce":
			if (factor < 1) {
				this.menuWidth = this.initialWidth + factor*(this.finalWidth - this.initialWidth);
			} else {
				this.menuWidth = this.finalWidth;
				this.offsetX = this.initialOffsetX + (factor - 1)*(this.finalOffsetX - this.initialOffsetX);
				this.offsetY = this.initialOffsetY + (factor - 1)*(this.finalOffsetY - this.initialOffsetY);
			}
			break;
	}
}

IngameMenu.prototype.draw = function(date) {
	var factor;
	if (!this.animationRunning) {
		factor = 2;
	} else {
		factor = 2 * (date - this.beginning) / this.animationDuration;
		if (factor > 2) {
			factor = 2;
			this.animationRunning = false;
		}
		this.computeMenuCharacteristics(factor);
	}
	
	var h = 0.9*this.height;
	var x = h / 2 / Math.sqrt(3);

	this.ctx.save();
	this.ctx.translate(this.offsetX + this.width/2, this.offsetY + this.height/2);

	// Draw hexagon style menu
	this.drawDistortedHexagon(this.ctx, this.menuWidth, h, x, "#000000");
	this.drawDistortedHexagon(this.ctx, 0.992*this.menuWidth, 0.98*h, 0.98*x, "#555555");
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


//   +--------------+
//   |    Events    |
//   +--------------+

IngameMenu.prototype.handleCursorMove = function(x, y) {
}

IngameMenu.prototype.handleClick = function() {
}
