"use strict";

function DeveloperConsole(ctxLocator) {
	GraphicalElement.call(this, "DeveloperConsole", ctxLocator);

	this.active = false;
	this.blockEventsSpread = false;

	this.focus = false;

	this.concatString = "";
	this.command = "";
	this.cmdHeight = -1;
	this.animationRunning = true;

	this.t = 0;
}

DeveloperConsole.prototype = Object.create(GraphicalElement.prototype);
DeveloperConsole.prototype.constructor = DeveloperConsole;

DeveloperConsole.prototype.onDrawingRectSet = function() {
	this.width = this.maxWidth;
	this.height = this.maxHeight;
	this.cmdHeight = 4/5*this.height;
};

DeveloperConsole.prototype.selfRender = function() {
	var ctx = this.ctxLocator.ctx;
	ctx.fillStyle = "#222222";
	ctx.fillRect(0, 0, this.width, this.height);

	ctx.strokeStyle = "#000000";
	ctx.strokeRect(0.5, 0.5, this.width-1, this.height-1);

	var text = this.command + this.concatString;
	TextRendering.fillConsoleText(ctx, 3, this.height/2, [text], this.cmdHeight, 
									"#EEEEEE");
};

DeveloperConsole.prototype.offContextDraw = function() {
	// We do not want to catch mouse events at the moment
	this.ctxLocator.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
};

DeveloperConsole.prototype.update = function(dt) {
	this.t += dt;
	if (this.t > 1000) {
		this.t -= 1000;
	}
	
	if (this.t > 500 && this.concatString === "") {
		this.concatString = "|";
	} else if (this.t < 500 && this.concatString === "|") {
		this.concatString = "";
	}
};

DeveloperConsole.prototype.show = function() {
	this.active = true;
	this.focus = true;
};

DeveloperConsole.prototype.hide = function() {
	this.active = false;
	this.focus = false;
};

DeveloperConsole.prototype.handleKey = function(key) {
	if (key.length === 1) {
		this.command += key;
	} else if (key === 'Backspace') {
		this.command = this.command.slice(0, -1);
	} else if (key === 'Enter') {
		var copy = this.command;
		this.command = "";
		return copy;
	}
};
