"use strict";

function ForgeGUI(context, offContext, pixelMapper) {
	GraphicalElement.call(this, "ForgeGUI", pixelMapper);

	this.ctx = context;
	this.offCtx = offContext;

	this.import = new TextButton("Import", "import", pixelMapper);
	this.export = new TextButton("Export", "export", pixelMapper);
	this.previousElement = null;
}

ForgeGUI.prototype = Object.create(GraphicalElement.prototype);
ForgeGUI.prototype.constructor = ForgeGUI;

ForgeGUI.prototype.onDrawingRectSet = function() {
	this.import.disable();
	this.export.disable();
	this.width = Math.floor(this.maxWidth);
	this.height = Math.floor(this.maxHeight);

	this.import.setFontHeight(Math.round(this.height/20));
	this.export.setFontHeight(Math.round(this.height/20));
}

ForgeGUI.prototype.setRendererRect = function(x, y, width, height) {
	this.rX = x;
	this.rY = y;
	this.rWidth = width;
	this.rHeight = height;
}

ForgeGUI.prototype.drawElement = function(date) {
	// Clean screen
	this.ctx.fillStyle = "#003333";
	// left
	this.ctx.fillRect(0, 0, this.rX - this.offsetX, this.height);
	// right
	this.ctx.fillRect(this.rX + this.rWidth, 0, 
						this.width - this.rX - this.rWidth, this.height);
	// top
	this.ctx.fillRect(this.rX, 0, this.rWidth, this.rY - this.offsetX);
	// bot
	this.ctx.fillRect(this.rX, this.rY + this.rHeight, 
						this.rWidth, this.height - this.rY - this.rHeight);

	// Around graphicsEngine
	this.ctx.strokeStyle = "#000000";
	this.ctx.strokeRect(this.rX, this.rY, this.rWidth, this.rHeight);

	// Left interface
	this.ctx.strokeRect(0.5, 0.5, this.width/8, this.height);

	// Buttons
	this.import.draw(this.ctx, 1/16*this.width, 18/20*this.height);
	this.export.draw(this.ctx, 1/16*this.width, 19/20*this.height);
}

ForgeGUI.prototype.offContextDraw = function() {
	// We do not want to catch mouse events at the moment
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
	this.import.offContextDraw(this.offCtx, 1/16*this.width, 18/20*this.height);
	this.export.offContextDraw(this.offCtx, 1/16*this.width, 19/20*this.height);
}

//   +--------------+
//   |    Events    |
//   +--------------+

ForgeGUI.prototype.handleCursorMove = function(x, y) {
	if (this.previousElement) {
		this.previousElement.mouseOver = false;
	}
	var element = this.pixelMapper.getElement(x, y);
	if (element) {
		element.mouseOver = true;
		this.previousElement = element;
	}
}

ForgeGUI.prototype.handleClick = function(x, y) {
	var element = this.pixelMapper.getElement(x, y);
	if (element) {
		return element.action;
	}
}
