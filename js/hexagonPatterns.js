"use strict";

function HexagonPatterns(radius) {
	this.radius = radius;
	this.width = 2*radius + 4;
	this.height = 2*Math.sqrt(3)/2 * radius + 6;
	
	
	this.drawings = new Map();
	this.preRenderDrawing("space");
	this.preRenderDrawing("block");
}

HexagonPatterns.prototype.preRenderDrawing = function(style) {
	if (!this.drawings.has(style)) {
		// Off screen canvas
		var canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");

		ctx.translate(this.width/2, this.height/2);
		ctx.beginPath();
		ctx.moveTo(this.radius, 0);
		for (let theta = Math.PI/3; theta < 2*Math.PI; theta += Math.PI/3) {
			ctx.lineTo(this.radius * Math.cos(theta), this.radius * Math.sin(theta));
		}
		ctx.closePath();
		
		if (style == "space") {
			ctx.strokeStyle = "#AAAAAA";
			ctx.stroke();
		} else if (style == "block") {
			ctx.fillStyle = "#AAAAAA";
			ctx.fill();
		}

		this.drawings.set(style, canvas);
	}
}

HexagonPatterns.prototype.getPatterns = function(style) {
	return this.drawings;
}