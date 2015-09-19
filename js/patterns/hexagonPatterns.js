"use strict";

function HexagonPatterns(radius) {
	Pattern.call(this);
	this.radius = radius;
	this.width = Math.ceil(2*radius + 4);
	this.height = Math.ceil(2*Math.sqrt(3)/2 * radius + 6);
	
	this.preRenderDrawing("space");
	this.preRenderDrawing("top");
	this.preRenderDrawing("topLeft");
	this.preRenderDrawing("topRight");
	this.preRenderDrawing("bot");
	this.preRenderDrawing("botLeft");
	this.preRenderDrawing("botRight");
	this.preRenderDrawing("block");
	this.preRenderDrawing("reachable");
	this.preRenderDrawing("highlight");
	this.preRenderDrawing("void");
}

HexagonPatterns.prototype = Object.create(Pattern.prototype);
HexagonPatterns.prototype.constructor = HexagonPatterns;

HexagonPatterns.prototype.computeDirectionAngles = function(direction) {
	var i;
	if (direction == "botRight") {
		i = 0;
	} else if (direction == "bot") {
		i = 1;
	} else if (direction == "botLeft") {
		i = 2
	} else if (direction == "topLeft") {
		i = 3
	} else if (direction == "top") {
		i = 4
	} else {
		i = 5
	}

	var alpha = i * Math.PI/3;
	var beta = (i+1) * Math.PI/3;

	return {"alpha" : alpha, "beta" : beta};
}

HexagonPatterns.prototype.drawHexagonPath = function(context) {
	context.beginPath();
	context.moveTo(this.radius, 0);
	for (var theta = Math.PI/3; theta < 2*Math.PI; theta += Math.PI/3) {
		context.lineTo(Math.floor(this.radius * Math.cos(theta) + 0.5), 
						Math.floor(this.radius * Math.sin(theta)) + 0.5);
	}
	context.closePath();
}

HexagonPatterns.prototype.drawThickHexagon = function(context, factorInt, factorExt) {
	context.beginPath();
	context.moveTo(factorExt*this.radius, 0);
	for (var i = 0; i <= 6; i++) {
		var theta = Math.PI/3 + i/6 * 2*Math.PI;
		context.lineTo(factorExt * this.radius*Math.cos(theta), 
					factorExt * this.radius*Math.sin(theta));
	}
	for (var i = 6; i >= 0; i--) {
		var theta = Math.PI/3 + i/6 * 2*Math.PI;
		context.lineTo(factorInt * this.radius*Math.cos(theta), 
					factorInt * this.radius*Math.sin(theta));
	}
	context.closePath();
	context.fillStyle = "#00AAAA";
	context.fill();
}

HexagonPatterns.prototype.drawDirectionIndicator = function(context, advancedStyle) {
	var angles = this.computeDirectionAngles(advancedStyle);
	var alpha = angles["alpha"];
	var beta = angles["beta"];

	context.beginPath();
	context.moveTo(0.9*this.radius * Math.cos(alpha), 0.9*this.radius * Math.sin(alpha));
	context.lineTo(0.9*this.radius * Math.cos(beta), 0.9*this.radius * Math.sin(beta));
	context.lineTo(0.8*this.radius * Math.cos(beta), 0.8*this.radius * Math.sin(beta));
	context.lineTo(0.8*this.radius * Math.cos(alpha), 0.8*this.radius * Math.sin(alpha));
	context.closePath();
	context.fillStyle = "#AAAAAA";
	context.fill();
}

HexagonPatterns.prototype.preRenderDrawing = function(style) {
	// Off screen canvas
	var canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;
	var ctx = canvas.getContext("2d");

	ctx.translate(this.width/2, this.height/2);

	switch (style) {
		case "space":
			this.drawHexagonPath(ctx);
			ctx.strokeStyle = "#AAAAAA";
			ctx.stroke();
			break;
		
		case "block":
			this.drawHexagonPath(ctx);
			ctx.fillStyle = "#666666";
			ctx.fill();
			ctx.strokeStyle = "#AAAAAA";
			ctx.stroke();
			break;
		
		case "highlight":
			this.drawHexagonPath(ctx);
			ctx.fillStyle = "rgba(200, 200, 200, 0.3)";
			ctx.fill();
			ctx.strokeStyle = "#AAAAAA";
			ctx.stroke();
			break;

		case "void":
			this.drawHexagonPath(ctx);
			ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
			ctx.stroke();
			break;

		case "top":
		case "bot":
		case "topLeft":
		case "topRight":
		case "botLeft":
		case "botRight":
			this.drawDirectionIndicator(ctx, style);
			break;
	}

	this.drawings.set(style, canvas);
}

HexagonPatterns.prototype.offContextDraw = function(offCtx, x, y, color) {
	var l =[];
	for (var theta = Math.PI/3; theta < 2*Math.PI; theta += Math.PI/3) {
		var p = {x: Math.round(x + 0.98*this.radius * Math.cos(theta)), 
					y: Math.round(y + 0.98*this.radius * Math.sin(theta))};
		l.push(p);
	}
	this.fillPath(offCtx, l, color);
}
