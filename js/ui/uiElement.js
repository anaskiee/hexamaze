"use strict";

function UIElement(name, pixelMapper) {
	this.name = name;
	this.pixelMapper = pixelMapper;
	
	this.x = -1;
	this.y = -1;
	this.width = -1;
	this.height = -1;

	this.mouseOver = false;
	this.selected = false;
	this.clickable = false;
	this.action = undefined;
	this.offContextColor = null;
}

UIElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

UIElement.prototype.handleCursorMove = function(x, y) {
	this.mouseOver = true;
};

UIElement.prototype.handleClick = function(x, y) {
	if (this.selected === false) {
		this.selected = true;
	}
	return this.action;
};

UIElement.prototype.onMouseOverEnd = function() {
	this.mouseOver = false;
};

UIElement.prototype.disable = function() {
	if (this.offContextColor !== null) {
		this.pixelMapper.unregister(this.offContextColor);
		this.offContextColor = null;
		this.mouseOver = false;
	}
};