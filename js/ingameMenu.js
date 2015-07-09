"use strict";

function IngameMenu(canvas, context, screenWidth, screenHeight) {
	this.canvas = canvas;
	this.ctx = context;
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;

	this.canvas.style.position = "absolute";
	this.reduce();
}

IngameMenu.prototype.reduce = function() {
	var left = (this.screenWidth - this.canvas.width) / 2;
	var top = -0.97*this.canvas.height;
	this.canvas.style.left = left + "px";
	this.canvas.style.top = top + "px";
}

IngameMenu.prototype.expand = function() {
	var left = (this.screenWidth - this.canvas.width) / 2;
	var top = (this.screenHeight - this.canvas.height) / 2;
	this.canvas.style.left = left + "px";
	this.canvas.style.top = top + "px";
}

IngameMenu.prototype.draw = function() {
	this.ctx.fillStyle = "#AAAAAA";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	var l = this.canvas.height/3;
	var h = Math.sqrt(3)/6*this.canvas.height;
	this.ctx.save();
	this.ctx.translate(this.canvas.width/2, this.canvas.height/2);

	this.ctx.fillStyle = "#333333";
	this.ctx.fillRect(-l/2, -h/2, l, h);

	this.ctx.beginPath();
	this.ctx.moveTo(-l/2, -h);
	this.ctx.lineTo(l/2, -h);
	this.ctx.lineTo(l/2 + h, 0);
	this.ctx.lineTo(l/2, h);
	this.ctx.lineTo(-l/2, h);
	this.ctx.lineTo(-l/2 + -h, 0);
	this.ctx.closePath();
	this.ctx.fill();

	this.ctx.restore();
}