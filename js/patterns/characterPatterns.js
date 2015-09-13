"use strict";

function CharacterPatterns(characterHeight, widthMax, heightMax) {
	Pattern.call(this);
	this.height = characterHeight;
	this.widthMax = widthMax;
	this.heightMax = heightMax;

	this.preRenderDrawing("basic");
}

CharacterPatterns.prototype = Object.create(Pattern.prototype);
CharacterPatterns.prototype.constructor = CharacterPatterns;

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