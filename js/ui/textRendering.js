"use strict";

var TextRendering = {
	fillConsoleText: function(ctx, x, y, text, height, color) {
		ctx.font = height + "px ubuntu-condensed";
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color;
		TextRendering.fillTextLines(ctx, x, y, text, 2/3*height + 5);
	},

	fillBasicText: function(ctx, x, y, text, height, color) {
		ctx.font = height + "px chunkfive";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color;
		TextRendering.fillTextLines(ctx, x, y, text, 2/3*height + 5);
	},

	fillTitleText: function(ctx, x, y, text, height, color) {
		ctx.font = height + "px distant-galaxy";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color;
		TextRendering.fillTextLines(ctx, x, y, text, 2/3*height + 5);
	},

	fillButtonText: function(ctx, x, y, text, height, color) {
		ctx.font = height + "px molot";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = color;
		TextRendering.fillTextLines(ctx, x, y, text, 2/3*height + 5);
	},

	fillTextLines: function(ctx, x, y, textLines, lineHeight) {
		var nbLines = textLines.length;
		for (var i = 0; i < nbLines; i++) {
			var offsetY = y + (i - (nbLines-1)/2) * lineHeight;
			ctx.fillText(textLines[i], x, Math.round(offsetY));
		}
	}
};