"use strict";

function DeveloperConsole(canvas, context) {
	GraphicalElement.call(this);

	this.name = "DeveloperConsole";

	this.canvas = canvas;
	this.ctx = context;
	this.screenWidth = canvas.width;
	this.screenHeight = canvas.height;
	this.width = this.screenWidth;
	this.height = this.screenHeight/20;

	this.active = false;
	this.blockEventsSpread = false;

	this.focus = false;

	this.text = "";
}

DeveloperConsole.prototype = Object.create(GraphicalElement.prototype);
DeveloperConsole.prototype.constructor = DeveloperConsole;

DeveloperConsole.prototype.draw = function(date) {
	this.ctx.fillStyle = "#222222";
	this.ctx.fillRect(0, this.screenHeight - this.height, this.width, this.height);

	this.ctx.strokeStyle = "#000000";
	this.ctx.strokeRect(0, this.screenHeight - this.height, this.width, this.height);

	this.ctx.font = 4/5*this.height + "px Consolas";
	this.ctx.fillStyle = "#FFFFFF";
	if (date % 1000 > 500) {
		this.ctx.fillText(this.text + "|", 0, this.screenHeight - 1/4 * this.height)
	} else {
		this.ctx.fillText(this.text, 0, this.screenHeight - 1/4 * this.height)
	}
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
	} else if (code === 8) {
		this.text = this.text.slice(0, -1);
	} else if (code === 13) {
		var copy = this.text;
		this.text = "";
		return copy;
	}
}