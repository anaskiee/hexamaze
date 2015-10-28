"use strict";

function ConsoleText() {
}

ConsoleText.prototype.configureContext = function(ctx, fontHeight) {
	ctx.font = fontHeight + "px ubuntu-condensed";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#EEEEEE";
};
