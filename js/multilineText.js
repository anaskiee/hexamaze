"use strict";

function MultilineText(name, type, pixelMapper) {
	UIElement.call(name, type, pixelMapper);
	this.textLines = null;
	this.font = "";
	this.lineHeight = -1;
	this.fontHeight = -1;

	this.textStyle = null;
}

MultilineText.prototype = Object.create(UIElement.prototype);
MultilineText.prototype.constructor = MultilineText;

MultilineText.prototype.setText = function(text) {
	this.textLines = text.split("\n");
};

MultilineText.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;
	this.lineHeight = Math.ceil(2/3*this.fontHeight) + 10;
};

MultilineText.prototype.draw = function(ctx, x, y) {
	this.textStyle.configureContext(ctx, this.fontHeight);
	var nbLines = this.textLines.length;
	for (var i = 0; i < nbLines; i++) {
		var offsetY = y + (i - (nbLines-1)/2) * this.lineHeight;
		ctx.fillText(this.textLines[i], x, Math.round(offsetY));
	}
};

MultilineText.offContextDraw = function(ctx, x, y) {
};