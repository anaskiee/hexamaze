"use strict";

function Text(text) {
	this.textLines = text.split("\n");
}

Text.prototype.setText = function(text) {
	this.textLines = text.split("\n");
}

Text.prototype.setFontHeight = function(fontHeight) {
	this.fontHeight = fontHeight;
	this.lineHeight = Math.ceil(2/3*this.fontHeight) + 10;
}

Text.prototype.draw = function(ctx, x, y) {
	ctx.font = this.fontHeight + "px chunkfive";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000000";
	var nbLines = this.textLines.length;
	for (var i = 0; i < nbLines; i++) {
		var offsetY = y + (i - (nbLines-1)/2) * this.lineHeight;
		ctx.fillText(this.textLines[i], x, Math.round(offsetY));
	}
}
