"use strict";

function CharacterPatterns(size) {
	Pattern.call(this);
	this.size = size;
	this.width = Math.ceil(2*size + 2);
	this.height = Math.ceil(2*size + 2);

	this.preRenderDrawing("basic");
}

CharacterPatterns.prototype = Object.create(Pattern.prototype);
CharacterPatterns.prototype.constructor = CharacterPatterns;

CharacterPatterns.prototype.preRenderDrawing = function(style) {
	// Off screen canvas
	var canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;
	var ctx = canvas.getContext("2d");

	ctx.translate(this.width/2, this.height/2);
	ctx.beginPath();
	ctx.arc(0, 0, this.size, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = "#00AAAA";
	ctx.fill();

	this.drawings.set(style, canvas);
};

CharacterPatterns.prototype.offContextDraw = function(ctx, x, y, color) {
	this.fillDisk(ctx, Math.round(x), Math.round(y), Math.round(this.size), color);
};
