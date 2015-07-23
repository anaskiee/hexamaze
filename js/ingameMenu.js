"use strict";

function IngameMenu(canvas, context) {
	this.canvas = canvas;
	this.ctx = context;
	this.screenWidth = canvas.width;
	this.screenHeight = canvas.height;
	this.width = this.screenWidth/2;
	this.height = this.screenHeight/2;

	// For animations
	this.initialOffsetX = -1;
	this.initialOffsetY = -1;
	this.initialWidth = -1;
	this.finalOffsetX = -1;
	this.finalOffsetY = -1;
	this.finalWidth = -1;

	this.metrology = {};
	this.metrology["reduce"] = {
		offsetX : (this.screenWidth - this.width) / 2,
		offsetY : -0.97*this.height,
		width : 0};
	this.metrology["expand"] = {
		offsetX : (this.screenWidth - this.width) / 2,
		offsetY : (this.screenHeight - this.height) / 2,
		width : 0.7*this.width};

	// Menu characteristics
	this.offsetX = this.screenWidth/4;
	this.offsetY = -0.97*this.height;
	this.menuWidth = 0;

	this.beginning = -1;
	this.animationRunning = false;
	this.animationDuration = 300;
	this.animation = "";

	// Buttons
	this.buttons = new Set();
	this.addButtons();
	this.buttonSelected = null;
}

IngameMenu.prototype.reduce = function(date) {
	this.animation = "reduce";
	this.initAnimation(date);
}

IngameMenu.prototype.expand = function(date) {
	this.animation = "expand";
	this.initAnimation(date);
}

IngameMenu.prototype.initAnimation = function(date) {
	this.beginning = date;
	this.animationRunning = true;

	this.initialOffsetX = this.offsetX;
	this.initialOffsetY = this.offsetY;
	this.initialWidth = this.menuWidth;
}

IngameMenu.prototype.computeMenuCharacteristics = function(factor) {
	var dim = this.metrology[this.animation];
	switch (this.animation) {
		case "expand":
			if (factor < 1) {
				this.offsetX = this.initialOffsetX + factor*(dim.offsetX - this.initialOffsetX);
				this.offsetY = this.initialOffsetY + factor*(dim.offsetY - this.initialOffsetY);
			} else {
				this.offsetX = dim.offsetX;
				this.offsetY = dim.offsetY;
				this.menuWidth = this.initialWidth + (factor - 1)*(dim.width - this.initialWidth);
			}
			break;

		case "reduce":
			if (factor < 1) {
				this.menuWidth = this.initialWidth + factor*(dim.width - this.initialWidth);
			} else {
				this.menuWidth = dim.width;
				this.offsetX = this.initialOffsetX + (factor - 1)*(dim.offsetX - this.initialOffsetX);
				this.offsetY = this.initialOffsetY + (factor - 1)*(dim.offsetY - this.initialOffsetY);
			}
			break;
	}
}

IngameMenu.prototype.addButtons = function() {
	this.ctx.font = this.height/6 + "px motorwerk";
	var textWidth = this.ctx.measureText("again").width;
	var offsetX = this.metrology["expand"].offsetX + this.width/2;
	var offsetY = this.metrology["expand"].offsetY + this.height/2;
	var button = {
		action : "newgame",
		selected : false,
		xMin : offsetX - textWidth/2,
		xMax : offsetX + textWidth/2,
		yMin : offsetY + (1/6 - 1/13)*this.height,
		yMax : offsetY + (1/6 + 1/10)*this.height};
	this.buttons.add(button);
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
	for (let button of this.buttons) {
		if (button.selected == true) {
			this.ctx.fillStyle = "#698469";
		} else {
			this.ctx.fillStyle = "#000000";
		}
		this.ctx.fillText("Play", 0, this.height/6);
		this.ctx.fillText("again", 0, (1/6 + 1/10)*this.height);
	}

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
	for (let button of this.buttons) {
		if (button.xMin < x && x < button.xMax && button.yMin < y && y < button.yMax) {
			this.buttonSelected = button;
			button.selected = true;
		} else if (button.selected) {
			button.selected = false;
			if (this.buttonSelected == button) {
				this.buttonSelected = null;
			}
		}
	}
}

IngameMenu.prototype.handleClick = function() {
	if (this.buttonSelected) {
		return this.buttonSelected.action;
	}
}
