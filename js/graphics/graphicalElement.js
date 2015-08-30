"use strict";

function GraphicalElement(name) {
	this.name = name;
	this.offsetX = 0;
	this.offsetY = 0;
	this.maxWidth = 0;
	this.maxHeight = 0;
}

GraphicalElement.prototype.setDrawingRect = function(offsetX, offsetY, width, height) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.maxWidth = width;
	this.maxHeight = height;

	this.onDrawingRectSet();
}

GraphicalElement.prototype.adjustDrawingRect = function(offsetX, offsetY, 
															width, height) {
	this.offsetX += offsetX;
	this.offsetY += offsetY;
	this.maxWidth += width;
	this.maxHeight += height;

	this.onDrawingRectSet();
}

GraphicalElement.prototype.onDrawingRectSet = function() {
}

GraphicalElement.prototype.draw = function(date) {
	this.ctx.save();
	this.ctx.translate(this.offsetX, this.offsetY);
	this.drawElement(date);
	this.ctx.restore();
}

GraphicalElement.prototype.drawElement = function(date) {
}

GraphicalElement.prototype.handleCursorMove = function(x, y) {
}

GraphicalElement.prototype.handleClick = function(x, y) {
}

GraphicalElement.prototype.handleKey = function(keyCode) {
}

GraphicalElement.prototype.handleWorkerMessage = function(keyCode) {
}