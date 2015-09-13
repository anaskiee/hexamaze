"use strict";

function ExitPatterns(exitHeight, widthMax, heightMax) {
	Pattern.call(this);
	this.height = exitHeight;
	this.widthMax = widthMax;
	this.heightMax = heightMax;

	this.preRenderDrawing("basic");
}

ExitPatterns.prototype = Object.create(Pattern.prototype);
ExitPatterns.prototype.constructor = ExitPatterns;

ExitPatterns.prototype.preRenderDrawing = function(style) {
	// Off screen canvas
	var canvas = document.createElement("canvas");
	canvas.width = this.widthMax;
	canvas.height = this.heightMax;
	var ctx = canvas.getContext("2d");

	ctx.translate(this.widthMax/2, this.heightMax/2);
	ctx.beginPath();
	ctx.arc(0, 0, this.height, 0, 2*Math.PI);
	ctx.closePath();
	ctx.strokeStyle = "#00AAAA";
	ctx.stroke();

	this.drawings.set(style, canvas);
}

ExitPatterns.prototype.get = function(style) {
	return this.drawings.get(style);
}