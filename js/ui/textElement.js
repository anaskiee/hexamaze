"use strict";

function TextElement(name, text, pixelMapper) {
	UIElement.call(this, name, pixelMapper);
	this.textLines = text.split("\n");

	this.fontHeight = -1;
	this.rendering = null;

	this.defaultColor = "";
	this.overColor = "";
}

TextElement.prototype = Object.create(UIElement.prototype);
TextElement.prototype.constructor = TextElement;

TextElement.prototype.setText = function(text) {
	this.textLines = text.split("\n");
	this.computeButtonSize();
};

TextElement.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;
	this.font = fontHeight + "px " + this.fontName;
	this.computeButtonSize();
};

TextElement.prototype.computeButtonSize = function() {
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
	var lineHeight = 2/3*this.fontHeight + 4;
	this.height = this.textLines.length * lineHeight;
};

TextElement.prototype.draw = function(ctx, x, y) {
	var color;
	if (this.mouseOver) {
		color = this.overColor;
	} else {
		color = this.defaultColor;
	}
	this.rendering(ctx, x, y, this.textLines, this.fontHeight, color);
};

TextElement.prototype.offContextDraw = function(ctx, x, y) {
	if (this.clickable) {
		if (this.offContextColor === null) {
			this.offContextColor = this.pixelMapper.registerAndGetColor(this);
		}
		ctx.fillStyle = this.offContextColor;
		ctx.fillRect(Math.round(x - this.width/2), Math.round(y - this.height/2),
					this.width, this.height);
	}
};

TextElement.prototype.setStyle = function(style) {
	switch (style) {
		case "basic_text":
			this.rendering = TextRendering.fillBasicText;
			this.defaultColor = "#000000";
			this.overColor = "#222222";
			break;
		case "title_text":
			this.rendering = TextRendering.fillTitleText;
			this.defaultColor = "#000000";
			this.overColor = "#222222";
			break;
		case "button_text":
			this.rendering = TextRendering.fillButtonText;
			this.defaultColor = "#000000";
			this.overColor = "#222222";
			break;
		case "console_text":
			this.rendering = TextRendering.fillConsoleText;
			this.defaultColor = "#EEEEEE";
			this.overColor = "#222222";
			break;
		default:
			console.log("warning: unknow style '" + style + "'");
			break;
	}
};
