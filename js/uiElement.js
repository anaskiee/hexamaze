"use strict";

function UIElement(name, type, pixelMapper) {
	this.name = name;
	this.type = type;
	this.pixelMapper = pixelMapper;
	
	this.x = -1;
	this.y = -1;
	this.width = -1;
	this.height = -1;

	this.mouseOver = false;
	this.clickable = false;
}

UIElement.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};
