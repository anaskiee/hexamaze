"use strict";

function CharacterPatterns(characterHeight, widthMax, heightMax) {
	this.height = characterHeight;
	this.widthMax = widthMax;
	this.heightMax = heightMax;

	this.drawings = new Map();
	this.preRenderDrawing("basic");
}

CharacterPatterns.prototype.preRenderDrawing = function(style) {
	// Off screen canvas
	var canvas = document.createElement("canvas");
	canvas.width = this.widthMax;
	canvas.height = this.heightMax;
	var ctx = canvas.getContext("2d");

	ctx.translate(this.widthMax/2, this.heightMax/2);
	ctx.beginPath();
	ctx.arc(0, 0, this.height, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = "#00AAAA";
	ctx.fill();

	this.drawings.set(style, canvas);
}

CharacterPatterns.prototype.get = function(style) {
	return this.drawings.get(style);
}