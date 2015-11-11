"use strict";

function DeveloperConsole(context, offContext) {
	GraphicalElement.call(this, "DeveloperConsole");

	this.ctx = context;
	this.offCtx = offContext;

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
	this.ctx.fillStyle = "#222222";
	this.ctx.fillRect(0, 0, this.width, this.height);

	this.ctx.strokeStyle = "#000000";
	this.ctx.strokeRect(0.5, 0.5, this.width-1, this.height-1);

	var text = this.command + this.concatString;
	TextRendering.fillConsoleText(this.ctx, 3, this.height/2, [text], this.cmdHeight, 
									"#EEEEEE");
};

DeveloperConsole.prototype.offContextDraw = function() {
	// We do not want to catch mouse events at the moment
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
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

DeveloperConsole.prototype.handleKey = function(code) {
	if (32 <= code && code <= 124) {
		this.command += String.fromCharCode(code);
	} else if (code === 8) {
		this.command = this.command.slice(0, -1);
	} else if (code === 13) {
		var copy = this.command;
		this.command = "";
		return copy;
	}
};
