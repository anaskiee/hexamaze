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

TextButton.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;

	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	ctx.font = this.fontHeight + "px motorwerk";
	this.width = -1;
	for (var line of this.textLines) {
		this.width = Math.max(this.width, ctx.measureText(line).width);
	}
	this.width = Math.ceil(this.width) + 10;
	this.height = this.textLines.length * (Math.ceil(1/2*this.fontHeight) + 3);
}

TextButton.prototype.draw = function(ctx, x, y) {
	ctx.font = this.fontHeight + "px motorwerk";
	ctx.textAlign = "center";
	if (this.mouseOver) {
		ctx.fillStyle = "#698469";
		this.mouseOver = false;
	} else {
		ctx.fillStyle = "#000000";
	}
	for (var i = 0; i < this.textLines.length; i++) {
		ctx.fillText(this.textLines[i], x, 
				y + Math.round(1/4*this.fontHeight) + (i * (1/2*this.fontHeight + 3)));
	}
}

TextButton.prototype.offContextDraw = function(ctx, x, y) {
	if (this.offContextColor == null) {
		this.offContextColor = this.pixelMapper.registerAndGetColor(this);
	}
	ctx.fillStyle = this.offContextColor;
	ctx.fillRect(Math.round(x - this.width/2), Math.round(y - 1/4*this.fontHeight),
					this.width, this.height);
}

TextButton.prototype.disable = function() {
	if (this.offContextColor != null) {
		this.pixelMapper.unregister(this.offContextColor);
		this.offContextColor = null;
		this.mouseOver = false;
	}
}

TextButton.prototype.handleCursorMove = function(x, y) {
	this.mouseOver = true;
}

TextButton.prototype.handleClick = function(x, y) {
	return this.action;
}