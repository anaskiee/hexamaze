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

IngameMenu.prototype.draw = function(factor) {
	var l = factor*0.7*this.canvas.width;
	var h = 0.9*this.canvas.height;
	var x = h / 2 / Math.sqrt(3);

	this.ctx.save();
	this.ctx.translate(this.canvas.width/2+0.5, this.canvas.height/2);

	this.drawDistortedHexagon(this.ctx, l, h, x, "#FFFFFF");
	this.drawDistortedHexagon(this.ctx, 0.994*l, 0.98*h, 0.98*x, "#555555");

	this.ctx.restore();
}

IngameMenu.prototype.drawDistortedHexagon = function(ctx, l, h, x, color) {
	ctx.beginPath();
	ctx.moveTo(-l/2 - x, 0);
	ctx.lineTo(-l/2, -h/2);
	ctx.lineTo(l/2, -h/2);
	ctx.lineTo(l/2 + x, 0);
	ctx.lineTo(l/2, h/2);
	ctx.lineTo(-l/2, h/2);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}