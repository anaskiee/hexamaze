"use strict";

function TextButton(text, action, pixelMapper) {
	this.action = action;
	this.pixelMapper = pixelMapper;
	this.mouseOver = false;
	this.offContextColor = null;
	
	this.textLines = text.split("\n");
	
	// To set
	this.fontHeight = -1;
	this.width = -1;
	this.height = -1;
}

TextButton.prototype.setText = function(text) {
	this.textLines = text.split("\n");
	this.computeButtonSize();
};

TextButton.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;
	this.computeButtonSize();
};

TextButton.prototype.computeButtonSize = function() {
	if (this.fontHeight === -1) {
		console.log("warning: button font size not set");
	}
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	ctx.font = this.fontHeight + "px molot";
	this.width = -1;
	for (var line of this.textLines) {
		this.width = Math.max(this.width, ctx.measureText(line).width);
	}
	this.width = Math.ceil(this.width);
	this.lineHeight = Math.ceil(2/3*this.fontHeight) + 4;
	this.height = this.textLines.length * this.lineHeight;
};

TextButton.prototype.draw = function(ctx, x, y) {
	ctx.font = this.fontHeight + "px molot";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if (this.mouseOver) {
		ctx.fillStyle = "#222222";
	} else {
		ctx.fillStyle = "#000000";
	}
	var nbLines = this.textLines.length;
	for (var i = 0; i < nbLines; i++) {
		var offsetY = y + (i - (nbLines-1)/2) * this.lineHeight;
		ctx.fillText(this.textLines[i], x, Math.round(offsetY));
	}
};

TextButton.prototype.offContextDraw = function(ctx, x, y) {
	if (this.offContextColor === null) {
		this.offContextColor = this.pixelMapper.registerAndGetColor(this);
	}
	ctx.fillStyle = this.offContextColor;
	ctx.fillRect(Math.round(x - this.width/2), Math.round(y - this.height/2),
					this.width, this.height);
};

TextButton.prototype.disable = function() {
	if (this.offContextColor !== null) {
		this.pixelMapper.unregister(this.offContextColor);
		this.offContextColor = null;
		this.mouseOver = false;
	}
};

TextButton.prototype.handleCursorMove = function(x, y) {
	this.mouseOver = true;
};

TextButton.prototype.handleClick = function(x, y) {
	return this.action;
};

TextButton.prototype.onMouseOverEnd = function() {
	this.mouseOver = false;
};
