"use strict";

function HexagonPatterns(radius) {
	this.radius = radius;
	this.width = 2*radius + 4;
	this.height = 2*Math.sqrt(3)/2 * radius + 6;
	
	
	this.drawings = new Map();
	this.preRenderDrawing("space", "");
	this.preRenderDrawing("space", "top");
	this.preRenderDrawing("space", "topleft");
	this.preRenderDrawing("space", "topright");
	this.preRenderDrawing("space", "bot");
	this.preRenderDrawing("space", "botleft");
	this.preRenderDrawing("space", "botright");
	this.preRenderDrawing("block", "");
}

HexagonPatterns.prototype.preRenderDrawing = function(mainStyle, advancedStyle) {
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

	if (mainStyle == "space") {
		ctx.strokeStyle = "#AAAAAA";
		ctx.stroke();
	} else if (mainStyle == "block") {
		ctx.fillStyle = "#AAAAAA";
		ctx.fill();
	}

	if (advancedStyle) {
		let i;
		if (advancedStyle == "botright") {
			i = 0;
		} else if (advancedStyle == "bot") {
			i = 1;
		} else if (advancedStyle == "botleft") {
			i = 2
		} else if (advancedStyle == "topleft") {
			i = 3
		} else if (advancedStyle == "top") {
			i = 4
		} else {
			i = 5
		}
		let alpha = i * Math.PI/3;
		let beta = (i+1) * Math.PI/3;
		ctx.beginPath();
		ctx.moveTo(0.9*this.radius * Math.cos(alpha), 0.9*this.radius * Math.sin(alpha));
		ctx.lineTo(0.9*this.radius * Math.cos(beta), 0.9*this.radius * Math.sin(beta));
		ctx.lineTo(0.8*this.radius * Math.cos(beta), 0.8*this.radius * Math.sin(beta));
		ctx.lineTo(0.8*this.radius * Math.cos(alpha), 0.8*this.radius * Math.sin(alpha));
		ctx.closePath();
		ctx.fillStyle = "#AAAAAA";
		ctx.fill();
	}

	if (advancedStyle) {
		this.drawings.set(mainStyle + "-" + advancedStyle, canvas);
	} else {
		this.drawings.set(mainStyle, canvas);
	}
}

HexagonPatterns.prototype.getPatterns = function(style) {
	return this.drawings;
}