"use strict";

function UIElement(name, pixelMapper) {
	this.name = name;
	this.pixelMapper = pixelMapper;
	
	this.x = -1;
	this.y = -1;
	this.width = -1;
	this.height = -1;

	this.mouseOver = false;
	this.clickable = false;
	this.action = undefined;
}

UIElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

UIElement.prototype.handleCursorMove = function(x, y) {
	this.mouseOver = true;
};

UIElement.prototype.handleClick = function(x, y) {
	return this.action;
};

UIElement.prototype.onMouseOverEnd = function() {
	this.mouseOver = false;
};