"use strict";

function UIElementCreator(pixelMapper) {
	this.pixelMapper = pixelMapper;
}

UIElementCreator.prototype.createUIElement = function(name, type) {
	var uiElement;
	switch (type) {
		case "text":
			uiElement = new Text(name, type, this.pixelMapper);
			break;
		default:
			console.log("warning: unknown type '" + type + "'");
			break;
	}

	return uiElement;
};

UIElementCreator.prototype.setCustomRendering = function(uiElement, pattern) {
};