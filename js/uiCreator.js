"use strict";

function UICreator(pixelMapper) {
	this.pixelMapper = pixelMapper;
}

UICreator.prototype.setCustomRendering = function(uiElement, pattern) {
};

UICreator.prototype.createText = function(name, style, text) {
	var uiElement = new Text(name, text, this.pixelMapper);
	uiElement.setStyle(style);
	return uiElement;
};

UICreator.prototype.createTextButton = function(name, text, action) {
	var uiElement = new Text(name, text, this.pixelMapper);
	uiElement.setStyle("button_text");
	uiElement.action = action;
	uiElement.clickable = true;
	return uiElement;
};
