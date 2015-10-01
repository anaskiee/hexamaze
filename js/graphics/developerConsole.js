"use strict";

function DeveloperConsole(context, offContext, pixelMapper) {
	GraphicalElement.call(this, "DeveloperConsole", pixelMapper);

	this.ctx = context;
	this.offCtx = offContext;

	this.active = false;
	this.blockEventsSpread = false;

	this.focus = false;

	this.text = "";
	this.animationRunning = true;
}

DeveloperConsole.prototype = Object.create(GraphicalElement.prototype);
DeveloperConsole.prototype.constructor = DeveloperConsole;

DeveloperConsole.prototype.onDrawingRectSet = function() {
	this.width = this.maxWidth;
	this.height = this.maxHeight;
}

DeveloperConsole.prototype.drawElement = function(date) {
	this.ctx.fillStyle = "#222222";
	this.ctx.fillRect(0, 0, this.width, this.height);

	this.ctx.strokeStyle = "#000000";
	this.ctx.strokeRect(0.5, 0.5, this.width-1, this.height-1);

	this.ctx.font = 4/5*this.height + "px ubuntu-condensed";
	this.ctx.textBaseline = "middle";
	this.ctx.fillStyle = "#EEEEEE";
	if (date % 1000 > 500) {
		this.ctx.fillText(this.text + "|", 3, this.height/2);
	} else {
		this.ctx.fillText(this.text, 3, this.height/2);
	}
}

DeveloperConsole.prototype.offContextDraw = function() {
	// We do not want to catch mouse events at the moment
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
}

DeveloperConsole.prototype.show = function() {
	this.active = true;
	this.focus = true;
}

DeveloperConsole.prototype.hide = function() {
	this.active = false;
	this.focus = false;
}

DeveloperConsole.prototype.handleKey = function(code) {
	if (32 <= code && code <= 124) {
		this.text += String.fromCharCode(code);
	} else if (code == 8) {
		this.text = this.text.slice(0, -1);
	} else if (code == 13) {
		var copy = this.text;
		this.text = "";
		return copy;
	}
}
