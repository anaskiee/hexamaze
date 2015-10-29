"use strict";

function Text(name, type, pixelMapper) {
	UIElement.call(this, name, type, pixelMapper);
	this.textLines = [""];
	this.lineHeight = -1;

	this.fontHeight = -1;
	this.fontName = "";
	this.textAlign = "";
	this.textBaseline = "";
	this.font = "";

	this.defaultColor = "";
	this.overColor = "";
	this.offContextColor = null;
}

Text.prototype = Object.create(UIElement.prototype);
Text.prototype.constructor = Text;

Text.prototype.setText = function(text) {
	this.textLines = text.split("\n");
	this.computeButtonSize();
};

Text.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;
	this.font = fontHeight + "px " + this.fontName;
	this.computeButtonSize();
};

Text.prototype.computeButtonSize = function() {
	if (this.fontHeight === -1) {
		console.log("warning: button font size not set");
		return;
	}

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	ctx.font = this.font;
	this.width = -1;
	for (var line of this.textLines) {
		this.width = Math.max(this.width, ctx.measureText(line).width);
	}
	this.width = Math.ceil(this.width);
	this.lineHeight = Math.ceil(2/3*this.fontHeight) + 4;
	this.height = this.textLines.length * this.lineHeight;
};

Text.prototype.draw = function(ctx, x, y) {
	ctx.font = this.font;
	ctx.textAlign = this.textAlign;
	ctx.textBaseline = this.textBaseline;
	if (this.mouseOver) {
		ctx.fillStyle = this.overColor;
	} else {
		ctx.fillStyle = this.defaultColor;
	}
	var nbLines = this.textLines.length;
	for (var i = 0; i < nbLines; i++) {
		var offsetY = y + (i - (nbLines-1)/2) * this.lineHeight;
		ctx.fillText(this.textLines[i], x, Math.round(offsetY));
	}
};

Text.prototype.offContextDraw = function(ctx, x, y) {
	if (this.offContextColor === null) {
		this.offContextColor = this.pixelMapper.registerAndGetColor(this);
	}
	ctx.fillStyle = this.offContextColor;
	ctx.fillRect(Math.round(x - this.width/2), Math.round(y - this.height/2),
				this.width, this.height);
};