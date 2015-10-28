"use strict";

function UIElementCreator(pixelMapper) {
	this.pixelMapper = pixelMapper;

	this.textRenderingStrategies = new Map();
	this.textRenderingStrategies.set("basic_text", new BasicText());
	this.textRenderingStrategies.set("button_text", new ButtonText());
	this.textRenderingStrategies.set("title_text", new TitleText());
	this.textRenderingStrategies.set("console_text", new ConsoleText());
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
	var strategy = this.textRenderingStrategies.get(style);
	if (strategy === undefined) {
		console.log("warning: unknow style '" + style + "'");
	} else {
		uiElement.textStyle = strategy;
	}
};

UIElementCreator.prototype.setCustomRendering = function(uiElement, pattern) {
};