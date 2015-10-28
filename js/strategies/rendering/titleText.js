"use strict";

function TitleText() {
}

TitleText.prototype.configureContext = function(ctx, fontHeight) {
	ctx.font = fontHeight + "px distant-galaxy";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "#000000";
};
