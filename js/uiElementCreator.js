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

UIElementCreator.prototype.setTextStyle = function(uiElement, style) {
	switch (style) {
		case "basic_text":
			uiElement.fontName = "chunkfive";
			uiElement.textAlign = "center";
			uiElement.textBaseline = "middle";
			uiElement.defaultColor = "#000000";
			uiElement.overColor = "#222222";
			break;
		case "title_text":
			uiElement.fontName = "distant-galaxy";
			uiElement.textAlign = "center";
			uiElement.textBaseline = "middle";
			uiElement.defaultColor = "#000000";
			uiElement.overColor = "#222222";
			break;
		case "button_text":
			uiElement.fontName = "molot";
			uiElement.textAlign = "center";
			uiElement.textBaseline = "middle";
			uiElement.defaultColor = "#000000";
			uiElement.overColor = "#222222";
			break;
		case "console_text":
			uiElement.fontName = "ubuntu-condensed";
			uiElement.textAlign = "left";
			uiElement.textBaseline = "middle";
			uiElement.defaultColor = "#EEEEEE";
			uiElement.overColor = "#222222";
			break;
		default:
			console.log("warning: unknow style '" + style + "'");
			break;
	}
};

UIElementCreator.prototype.setCustomRendering = function(uiElement, pattern) {
};