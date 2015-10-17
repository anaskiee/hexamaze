"use strict";

function GraphicalElement(name, pixelMapper) {
	this.name = name;
	this.pixelMapper = pixelMapper;
	this.offsetX = 0;
	this.offsetY = 0;
	this.maxWidth = 0;
	this.maxHeight = 0;

	this.animationRunning = false;
	this.offContextColor = null;
}

GraphicalElement.prototype.setDrawingRect = function(offsetX, offsetY, width, height) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.maxWidth = width;
	this.maxHeight = height;
	this.checkProperties();
	this.onDrawingRectSet();
};

GraphicalElement.prototype.adjustDrawingRect = function(offsetX, offsetY, 
															width, height) {
	this.offsetX += offsetX;
	this.offsetY += offsetY;
	this.maxWidth += width;
	this.maxHeight += height;

	this.onDrawingRectSet();
};

GraphicalElement.prototype.checkProperties = function() {
	if (this.offsetX !== Math.floor(this.offsetX))
		console.log("warning: " + this.name + " invalid offsetX " + this.offsetX);
	if (this.offsetY !== Math.floor(this.offsetY))
		console.log("warning: " + this.name + " invalid offsetY " + this.offsetY);
	if (this.maxWidth !== Math.floor(this.maxWidth))
		console.log("warning: " + this.name + " invalid width " + this.maxWidth);
	if (this.maxHeight !== Math.floor(this.maxHeight))
		console.log("warning: " + this.name + " invalid height " + this.maxHeight);
};

GraphicalElement.prototype.onDrawingRectSet = function() {
};

GraphicalElement.prototype.draw = function(date) {
	this.ctx.save();
	this.ctx.translate(this.offsetX, this.offsetY);
	this.drawElement(date);
	this.ctx.restore();
};

GraphicalElement.prototype.offContextDraw = function() {
};

GraphicalElement.prototype.drawElement = function(date) {
};

GraphicalElement.prototype.handleCursorMove = function(x, y) {
};

GraphicalElement.prototype.handleClick = function(x, y) {
};

GraphicalElement.prototype.handleKey = function(keyCode) {
};

GraphicalElement.prototype.handleWorkerMessage = function(keyCode) {
};

GraphicalElement.prototype.onMouseOverEnd = function() {
};
