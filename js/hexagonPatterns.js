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
	this.preRenderDrawing("reachable", "");
}

HexagonPatterns.prototype.computeDirectionAngles = function(direction) {
	let i;
	if (direction == "botright") {
		i = 0;
	} else if (direction == "bot") {
		i = 1;
	} else if (direction == "botleft") {
		i = 2
	} else if (direction == "topleft") {
		i = 3
	} else if (direction == "top") {
		i = 4
	} else {
		i = 5
	}

	let alpha = i * Math.PI/3;
	let beta = (i+1) * Math.PI/3;

	return {"alpha" : alpha, "beta" : beta};
}

HexagonPatterns.prototype.drawHexagonPath = function(context) {
	context.translate(this.width/2, this.height/2);
	context.beginPath();
	context.moveTo(this.radius, 0);
	for (let theta = Math.PI/3; theta < 2*Math.PI; theta += Math.PI/3) {
		context.lineTo(this.radius * Math.cos(theta), this.radius * Math.sin(theta));
	}
	context.closePath();
}

HexagonPatterns.prototype.drawDirectionIndicator = function(context, advancedStyle) {
	let angles = this.computeDirectionAngles(advancedStyle);
	let alpha = angles["alpha"];
	let beta = angles["beta"];

	context.beginPath();
	context.moveTo(0.9*this.radius * Math.cos(alpha), 0.9*this.radius * Math.sin(alpha));
	context.lineTo(0.9*this.radius * Math.cos(beta), 0.9*this.radius * Math.sin(beta));
	context.lineTo(0.8*this.radius * Math.cos(beta), 0.8*this.radius * Math.sin(beta));
	context.lineTo(0.8*this.radius * Math.cos(alpha), 0.8*this.radius * Math.sin(alpha));
	context.closePath();
	context.fillStyle = "#AAAAAA";
	context.fill();
}

HexagonPatterns.prototype.preRenderDrawing = function(mainStyle, advancedStyle) {
	// Off screen canvas
	var canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;
	var ctx = canvas.getContext("2d");

	this.drawHexagonPath(ctx);

	if (mainStyle == "space") {
		// Nothing to do		
	} else if (mainStyle == "block") {
		ctx.fillStyle = "#666666";
		ctx.fill();
	} else if (mainStyle == "reachable") {
		ctx.fillStyle = "rgba(120, 120, 120, 0.3)";
		ctx.fill();
	}
	ctx.strokeStyle = "#AAAAAA";
	ctx.stroke();

	if (advancedStyle) {
		this.drawDirectionIndicator(ctx, advancedStyle);
		this.drawings.set(mainStyle + "-" + advancedStyle, canvas);
	} else {
		this.drawings.set(mainStyle, canvas);
	}
}

HexagonPatterns.prototype.getPatterns = function(style) {
	return this.drawings;
}