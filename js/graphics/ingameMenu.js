"use strict";

function IngameMenu(context, offContext, pixelMapper) {
	GraphicalElement.call(this, "IngameMenu", pixelMapper);

	this.ctx = context;
	this.offCtx = offContext;

	// Text
	//this.text = "Ingame menu text !";
	this.text = new Text("");

	// For animations
	this.initialOffsetX = -1;
	this.initialOffsetY = -1;
	this.initialWidth = -1;

	this.beginning = -1;
	this.animationRunning = false;
	this.animationDuration = 300;
	this.animation = "";
	this.active = false;
	this.blockEventsSpread = true;

	this.playAgin = new TextButton("Back to home", "goto_home", pixelMapper);
	this.previousElement = null;
}

IngameMenu.prototype = Object.create(GraphicalElement.prototype);
IngameMenu.prototype.constructor = IngameMenu;

IngameMenu.prototype.onDrawingRectSet = function() {
	this.width = this.maxWidth/2;
	this.height = this.maxHeight/2;
	
	this.metrology = {};
	this.metrology["reduce"] = {
		offsetX : (this.maxWidth - this.width) / 2,
		offsetY : -0.97*this.height,
		width : 0};
	this.metrology["expand"] = {
		offsetX : (this.maxWidth - this.width) / 2,
		offsetY : (this.maxHeight - this.height) / 2,
		width : 0.7*this.width};

	// Menu characteristics
	this.posX = this.maxWidth/4;
	this.posY = -0.97*this.height;
	this.menuWidth = 0;
	
	// Buttons
	this.playAgin.setFontHeight(Math.round(this.height/8));
	this.text.setFontHeight(Math.round(this.height/10));
}

IngameMenu.prototype.reduce = function(date) {
	this.animation = "reduce";
	this.initAnimation(date);
	this.playAgin.disable();
}

IngameMenu.prototype.expand = function(date) {
	this.animation = "expand";
	this.initAnimation(date);
}

IngameMenu.prototype.setText = function(text) {
	this.text.setText(text);
}

IngameMenu.prototype.initAnimation = function(date) {
	this.beginning = date;
	this.animationRunning = true;
	this.active = true;

	this.initialOffsetX = this.posX;
	this.initialOffsetY = this.posY;
	this.initialWidth = this.menuWidth;
}

IngameMenu.prototype.computeMenuCharacteristics = function(factor) {
	var dim = this.metrology[this.animation];
	switch (this.animation) {
		case "expand":
			if (factor < 1) {
				this.posX = this.initialOffsetX + factor*(dim.offsetX - this.initialOffsetX);
				this.posY = this.initialOffsetY + factor*(dim.offsetY - this.initialOffsetY);
			} else {
				this.posX = dim.offsetX;
				this.posY = dim.offsetY;
				this.menuWidth = this.initialWidth + (factor - 1)*(dim.width - this.initialWidth);
			}
			break;

		case "reduce":
			if (factor < 1) {
				this.menuWidth = this.initialWidth + factor*(dim.width - this.initialWidth);
			} else {
				this.menuWidth = dim.width;
				this.posX = this.initialOffsetX + (factor - 1)*(dim.offsetX - this.initialOffsetX);
				this.posY = this.initialOffsetY + (factor - 1)*(dim.offsetY - this.initialOffsetY);
			}
			break;
	}
}

IngameMenu.prototype.drawElement = function(date) {
	var factor;
	var drawOffContext = false;
	if (!this.animationRunning) {
		factor = 2;
	} else {
		factor = 2 * (date - this.beginning) / this.animationDuration;
		if (factor > 2) {
			factor = 2;
			this.animationRunning = false;
			if (this.animation == "reduce") {
				this.active = false;
			// At the end of expand animation, we draw buttons on offContext once
			} else if (this.animation == "expand") {
				drawOffContext = true;
			}
		}
		this.computeMenuCharacteristics(factor);
	}
	
	var h = 0.9*this.height;
	var x = h / 2 / Math.sqrt(3);

	this.ctx.save();
	this.ctx.translate(this.posX + this.width/2, this.posY + this.height/2);

	// Draw hexagon style menu
	this.drawDistortedHexagon(this.ctx, this.menuWidth, h, x, "#000000");
	this.drawDistortedHexagon(this.ctx, 0.992*this.menuWidth, 0.98*h, 0.98*x, "#555555");
	this.ctx.clip();

	// Draw text
	this.text.draw(this.ctx, 0, -this.height/6);
	
	// Draw button
	if (drawOffContext) {
		this.offCtx.save();
		this.offCtx.translate(this.posX + this.width/2, this.posY + this.height/2);
		this.playAgin.offContextDraw(this.offCtx, 0, this.height/6);
		this.offCtx.restore();
	}
	this.playAgin.draw(this.ctx, 0, this.height/6);

	this.ctx.restore();
}

IngameMenu.prototype.offContextDraw = function() {
	// We do not want to catch events except buttons, but they are drawn after
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
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
	if (this.previousElement) {
		this.previousElement.mouseOver = false;
	}
	var element = this.pixelMapper.getElement(x, y);
	if (element) {
		element.mouseOver = true;
		this.previousElement = element;
	}
}

IngameMenu.prototype.handleClick = function(x, y) {
	var element = this.pixelMapper.getElement(x, y);
	if (element) {
		return element.action;
	}
}
