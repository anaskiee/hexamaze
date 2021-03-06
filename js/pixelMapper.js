"use strict";

function PixelMapper(ctxLocator) {
	this.ctxLocator = ctxLocator;

	// 0 for null element
	// others to register elements
	this.currentIndex = 0;

	// color -> object
	this.colorMap = new Map();
}

PixelMapper.prototype.registerAndGetColor = function(object) {
	if (!object) {
		console.log("warning : registering but no object in argument");
	}
	this.currentIndex++;
	var idx = this.currentIndex;
	var b = idx % 256;
	var g = ((idx - b) / 256) % 256;
	var r = ((idx - 256*g - b) / 256) % 256;
	var color = "rgb(" + r + "," + g + "," + b + ")";
	this.colorMap.set(color, object);
	return color;
};

PixelMapper.prototype.getElement = function(x, y) {
	var pixel = this.ctxLocator.offCtx.getImageData(x, y, 1, 1);
	var color = pixel.data;
	var r = pixel.data[0];
	var g = pixel.data[1];
	var b = pixel.data[2];
	color = "rgb(" + r + "," + g + "," + b + ")";
	var element = this.colorMap.get(color);
	return element;
};

PixelMapper.prototype.unregister = function(color) {
	this.colorMap.delete(color);
};
