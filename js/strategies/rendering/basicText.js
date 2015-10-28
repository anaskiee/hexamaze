"use strict";

function BasicText() {
}

BasicText.prototype.configureContext = function(ctx, fontHeight) {
	ctx.font = fontHeight + "px chunkfive";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000000";
};
