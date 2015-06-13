"use strict";

function HexagonPatterns(radius) {
	this.radius = radius;
	this.width = 2*radius + 4;
	this.height = 2*Math.sqrt(3)/2 * radius + 6;
	
	// Off screen canvas
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.ctx = this.canvas.getContext("2d");
	this.preRenderDrawing();
}

HexagonPatterns.prototype.preRenderDrawing = function() {
/*	this.ctx.beginPath();
	this.ctx.moveTo(0, 0);
	this.ctx.lineTo(0, this.height);
	this.ctx.lineTo(this.width, this.height);
	this.ctx.lineTo(this.width, 0);
	this.ctx.closePath();
	this.ctx.fillStyle = "#111111";
	this.ctx.fill();*/

	this.ctx.translate(this.width/2, this.height/2);
	this.ctx.beginPath();
	this.ctx.moveTo(this.radius, 0);
	for (let theta = Math.PI/3; theta < 2*Math.PI; theta += Math.PI/3) {
		this.ctx.lineTo(this.radius * Math.cos(theta), this.radius * Math.sin(theta));
	}
	this.ctx.closePath();
	this.ctx.strokeStyle = "#AAAAAA";
	this.ctx.stroke();
}

HexagonPatterns.prototype.getPattern = function() {
	return this.canvas;
}