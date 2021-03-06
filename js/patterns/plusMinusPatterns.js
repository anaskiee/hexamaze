"use strict";

function PlusMinusPatterns(radius) {
	Pattern.call(this);
	this.radius = radius;
	this.width = Math.ceil(2*radius + 2);
	this.height = Math.ceil(2*radius + 2);

	this.preRenderDrawing("minus");
	this.preRenderDrawing("plus");
}

PlusMinusPatterns.prototype = Object.create(Pattern.prototype);
PlusMinusPatterns.prototype.constructor = PlusMinusPatterns;

PlusMinusPatterns.prototype.preRenderDrawing = function(style) {
	// Off screen canvas
	var canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;
	var ctx = canvas.getContext("2d");

	// Draw octagon
	var otherRadius = 91/100*this.radius;
	ctx.translate(this.width/2, this.height/2);
	ctx.beginPath();
	for (var i = 0; i <= 8; i++) {
		var theta = -Math.PI/2 + i/8 * 2*Math.PI;
		if (i === 0) {
			ctx.moveTo(this.radius*Math.cos(theta), this.radius*Math.sin(theta));
		} else {
			ctx.lineTo(this.radius*Math.cos(theta), this.radius*Math.sin(theta));
		}
	}
	for (var i = 8; i >= 0; i--) {
		var theta = -Math.PI/2 + i/8 * 2*Math.PI;
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
};

PlusMinusPatterns.prototype.offContextDraw = function(ctx, x, y, color) {
	var points = [];
	for (var i = 0; i <= 8; i++) {
		var theta = -Math.PI/2 + i/8 * 2*Math.PI;
		var p = {x: Math.round(x + this.radius*Math.cos(theta)), 
					y: Math.round(y + this.radius*Math.sin(theta))};
		points.push(p);
	}
	this.fillPath(ctx, points, color);
};
