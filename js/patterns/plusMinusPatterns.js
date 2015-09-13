"use strict";

function PlusMinusPatterns(radius) {
	Pattern.call(this);
	this.radius = radius;

	this.preRenderDrawing("minus");
	this.preRenderDrawing("plus");
}

PlusMinusPatterns.prototype = Object.create(Pattern.prototype);
PlusMinusPatterns.prototype.constructor = PlusMinusPatterns;

PlusMinusPatterns.prototype.preRenderDrawing = function(style) {
	// Off screen canvas
	var canvas = document.createElement("canvas");
	canvas.width = 2*this.radius;
	canvas.height = 2*this.radius;
	var ctx = canvas.getContext("2d");

	// Draw octagon
	var otherRadius = 91/100*this.radius;
	ctx.translate(this.radius, this.radius);
		ctx.beginPath();
		for (let i = 0; i <= 8; i++) {
			let theta = -Math.PI/2 + i/8 * 2*Math.PI;
			if (i == 0) {
				ctx.moveTo(this.radius*Math.cos(theta), this.radius*Math.sin(theta));
			} else {
				ctx.lineTo(this.radius*Math.cos(theta), this.radius*Math.sin(theta));
			}
		}
		for (let i = 8; i >= 0; i--) {
			let theta = -Math.PI/2 + i/8 * 2*Math.PI;
			ctx.lineTo(otherRadius*Math.cos(theta), otherRadius*Math.sin(theta));
		}
		ctx.closePath();
		ctx.fillStyle = "#00AAAA";
		ctx.fill();

	var thickness = Math.floor(1/5/2 * this.radius);
	var size = Math.floor(3/5 * this.radius);
	// Draw symbol
	switch (style) {
		case "minus":
			ctx.beginPath();
			ctx.moveTo(-size, -thickness);
			ctx.lineTo(-size, thickness);
			ctx.lineTo(size, thickness);
			ctx.lineTo(size, -thickness);
			ctx.closePath();
			ctx.fillStyle = "#00AAAA";
			ctx.fill();
			break;
		case "plus":
			ctx.beginPath();
			ctx.moveTo(thickness, thickness);
			ctx.lineTo(size, thickness);
			ctx.lineTo(size, -thickness);
			ctx.lineTo(thickness, -thickness);
			ctx.lineTo(thickness, -size);
			ctx.lineTo(-thickness, -size);
			ctx.lineTo(-thickness, -thickness);
			ctx.lineTo(-size, -thickness);
			ctx.lineTo(-size, thickness);
			ctx.lineTo(-thickness, thickness);
			ctx.lineTo(-thickness, size);
			ctx.lineTo(thickness, size);
			ctx.closePath();
			ctx.fillStyle = "#00AAAA";
			ctx.fill();
			break;
		default:
			break;
	}

	this.drawings.set(style, canvas);
}

PlusMinusPatterns.prototype.get = function(style) {
	return this.drawings.get(style);
}