"use strict";

function Text(name, type, pixelMapper) {
	UIElement.call(name, type, pixelMapper);
	this.text = "";
	this.lineHeight = -1;
	this.fontHeight = -1;

	this.textStyle = null;
}

Text.prototype = Object.create(UIElement.prototype);
Text.prototype.constructor = Text;

Text.prototype.setText = function(text) {
	this.text = text;
};

Text.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;
	this.lineHeight = Math.ceil(2/3*this.fontHeight) + 10;
};

Text.prototype.draw = function(ctx, x, y) {
	this.textStyle.configureContext(ctx, this.fontHeight);
	ctx.fillText(this.text, x, y);
};

Text.prototype.offContextDraw = function(ctx, x, y) {
};