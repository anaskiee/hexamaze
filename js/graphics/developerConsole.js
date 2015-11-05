"use strict";

function DeveloperConsole(context, offContext, uiCreator) {
	GraphicalElement.call(this, "DeveloperConsole");

	this.ctx = context;
	this.offCtx = offContext;
	this.uiCreator = uiCreator;

	this.active = false;
	this.blockEventsSpread = false;

	this.focus = false;

	this.pipePresent = false;
	this.command = "";
	this.text = uiCreator.createText("console text", "console_text", "");
	this.animationRunning = true;
}

DeveloperConsole.prototype = Object.create(GraphicalElement.prototype);
DeveloperConsole.prototype.constructor = DeveloperConsole;

DeveloperConsole.prototype.onDrawingRectSet = function() {
	this.width = this.maxWidth;
	this.height = this.maxHeight;
	this.text.setFontHeight(4/5*this.height);
};

DeveloperConsole.prototype.drawElement = function(date) {
	this.ctx.fillStyle = "#222222";
	this.ctx.fillRect(0, 0, this.width, this.height);

	this.ctx.strokeStyle = "#000000";
	this.ctx.strokeRect(0.5, 0.5, this.width-1, this.height-1);

	if (date % 1000 > 500 && this.pipePresent === false) {
		this.text.setText(this.command + "|");
		this.pipePresent = true;
	} else if (date % 1000 < 500 && this.pipePresent === true) {
		this.text.setText(this.command);
		this.pipePresent = false;
	}
	this.text.draw(this.ctx, 3, this.height/2);
};

DeveloperConsole.prototype.offContextDraw = function() {
	// We do not want to catch mouse events at the moment
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
};

DeveloperConsole.prototype.show = function() {
	this.active = true;
	this.focus = true;
};

DeveloperConsole.prototype.hide = function() {
	this.active = false;
	this.focus = false;
};

DeveloperConsole.prototype.handleKey = function(code) {
	if (32 <= code && code <= 124) {
		this.command += String.fromCharCode(code);
		this.text.setText(this.command);
	} else if (code === 8) {
		this.command = this.command.slice(0, -1);
		this.text.setText(this.command);
	} else if (code === 13) {
		var copy = this.command;
		this.command = "";
		this.text.setText("");
		return copy;
	}
};
