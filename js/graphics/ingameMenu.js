"use strict";

function IngameMenu(ctxLocator ,uiCreator) {
	GraphicalElement.call(this, "IngameMenu", ctxLocator);

	this.uiCreator = uiCreator;

	// Text
	this.text = uiCreator.createText("ingame_menu_text", "basic_text", "");

	// For animations
	this.initialOffsetX = -1;
	this.initialOffsetY = -1;
	this.initialWidth = -1;
	this.posX = -1;
	this.posY = -1;
	this.menuWidth = -1;

	this.beginning = -1;
	this.animationDuration = 300;
	this.animation = "";
	this.active = false;

	this.playAgin = uiCreator.createTextButton(
		"ig menu button", "Back to home", "goto_home");
	this.previousElement = null;
	this.dt = -1;
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
	if (this.posX === -1) {
		this.posX = this.maxWidth/4;
		this.posY = -this.height;
		this.menuWidth = 0;
	}

	// Buttons
	this.playAgin.setFontHeight(Math.round(this.height/8));
	this.text.setFontHeight(Math.round(this.height/10));
};

IngameMenu.prototype.reduce = function() {
	this.animation = "reduce";
	this.initAnimation();
	this.playAgin.disable();
};

IngameMenu.prototype.expand = function() {
	this.animation = "expand";
	this.initAnimation();
};

IngameMenu.prototype.setText = function(text) {
	this.text.setText(text);
};

IngameMenu.prototype.initAnimation = function() {
	this.dt = 0;
	this.animationRunning = true;
	this.active = true;

	this.initialOffsetX = this.posX;
	this.initialOffsetY = this.posY;
	this.initialWidth = this.menuWidth;
};

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
};

IngameMenu.prototype.selfRender = function(dt) {
	var ctx = this.ctxLocator.ctx;
	var h = 0.9*this.height;
	var x = h / 2 / Math.sqrt(3);

	ctx.save();
	ctx.translate(this.posX + this.width/2, this.posY + this.height/2);

	// Draw hexagon style menu
	this.drawDistortedHexagon(ctx, this.menuWidth, h, x, "#000000");
	this.drawDistortedHexagon(ctx, 0.992*this.menuWidth, 0.98*h, 0.98*x, "#555555");
	ctx.clip();

	// Draw text
	this.text.draw(ctx, 0, -this.height/6);
	
	// Draw button
	if (this.drawOffContext) {
		var offCtx = this.ctxLocator.offCtx;
		offCtx.save();
		offCtx.translate(this.posX + this.width/2, this.posY + this.height/2);
		this.playAgin.offContextDraw(offCtx, 0, this.height/6);
		offCtx.restore();
	}
	this.playAgin.draw(ctx, 0, this.height/6);

	ctx.restore();
};

IngameMenu.prototype.offContextDraw = function() {
	// We do not want to catch events except buttons, but they are drawn after
	this.ctxLocator.offCtx.clearRect(this.offsetX, this.offsetY, 
									this.maxWidth, this.maxHeight);
};

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
};

IngameMenu.prototype.update = function(dt) {
	var factor;
	this.dt += dt;
	this.drawOffContext = false;
	if (!this.animationRunning) {
		factor = 2;
	} else {
		factor = 2 * this.dt / this.animationDuration;
		if (factor > 2) {
			factor = 2;
			this.animationRunning = false;
			if (this.animation === "reduce") {
				this.active = false;
			// At the end of expand animation, we draw buttons on offContext once
			} else if (this.animation === "expand") {
				this.drawOffContext = true;
			}
		}
		this.computeMenuCharacteristics(factor);
	}
};

IngameMenu.prototype.cleanCanvas = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

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
};

IngameMenu.prototype.handleClick = function(x, y) {
	var element = this.pixelMapper.getElement(x, y);
	if (element) {
		return element.action;
	}
};
