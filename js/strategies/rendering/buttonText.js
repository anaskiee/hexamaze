"use strict";

function ButtonText() {
}

ButtonText.prototype.draw = function(uiElement, ctx, x, y) {
	ctx.font = uiElement.fontHeight + "px molot";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if (uiElement.mouseOver) {
		ctx.fillStyle = "#222222";
	} else {
		ctx.fillStyle = "#000000";
	}
	ctx.fillText(uiElement.text, x, y);
};

ButtonText.prototype.offContextDraw = function(uiElement, ctx, x, y) {
	if (uiElement.offContextColor === null) {
		uiElement.offContextColor = uiElement.pixelMapper.registerAndGetColor(uiElement);
	}
	ctx.fillStyle = uiElement.offContextColor;
	ctx.fillRect(Math.round(x - uiElement.width/2), Math.round(y - uiElement.height/2),
					uiElement.width, uiElement.height);
};

function MultilineButtonText() {
}

MultilineButtonText.prototype.draw = function(uiElement, ctx, x, y) {
	ctx.font = uiElement.fontHeight + "px molot";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	if (uiElement.mouseOver) {
		ctx.fillStyle = "#222222";
	} else {
		ctx.fillStyle = "#000000";
	}
	var nbLines = uiElement.textLines.length;
	for (var i = 0; i < nbLines; i++) {
		var offsetY = y + (i - (nbLines-1)/2) * uiElement.lineHeight;
		ctx.fillText(uiElement.textLines[i], x, Math.round(offsetY));
	}
};

MultilineButtonText.prototype.offContextDraw = function(uiElement, ctx, x, y) {
	if (uiElement.offContextColor === null) {
		uiElement.offContextColor = uiElement.pixelMapper.registerAndGetColor(uiElement);
	}
	ctx.fillStyle = uiElement.offContextColor;
	ctx.fillRect(Math.round(x - uiElement.width/2), Math.round(y - uiElement.height/2),
					uiElement.width, uiElement.height);
};