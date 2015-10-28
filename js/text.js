"use strict";

function Text(name, type, pixelMapper) {
	UIElement.call(name, type, pixelMapper);
	this.textLines = null;
	this.lineHeight = -1;
	this.fontHeight = -1;

	this.offContextColor = null;
	this.textStyle = null;
}

Text.prototype = Object.create(UIElement.prototype);
Text.prototype.constructor = Text;

Text.prototype.setText = function(text) {
	this.textLines = text.split("\n");
};

Text.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;
	this.lineHeight = Math.ceil(2/3*this.fontHeight) + 10;
};

Text.prototype.draw = function(ctx, x, y) {
	this.textStyle.configureContext(ctx, this.fontHeight);
	var nbLines = this.textLines.length;
	for (var i = 0; i < nbLines; i++) {
		var offsetY = y + (i - (nbLines-1)/2) * this.lineHeight;
		ctx.fillText(this.textLines[i], x, Math.round(offsetY));
	}
};

Text.prototype.offContextDraw = function(ctx, x, y) {
};