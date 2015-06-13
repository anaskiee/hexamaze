"use strict";

function GraphicsEngine(canvas, context, map, mapWidth, mapHeight) {
	this.canvas = canvas;
	this.ctx = context;
	this.map = map;
	this.width = mapWidth;
	this.height = mapHeight;
	this.radius = 50;
	var hexagonPatterns = new HexagonPatterns(this.radius);
	this.hexagonPattern = hexagonPatterns.getPattern();
}

GraphicsEngine.prototype.beginDrawing = function() {
	this.draw();
}

GraphicsEngine.prototype.draw = function() {
	requestAnimationFrame(this.draw);

	this.ctx.fillStyle = "#003333";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	var preComputedOffsetX = - this.radius/2;
	var preComputedOffsetY = Math.sqrt(3)/2 * this.radius;
	var height = Math.sqrt(3) * this.radius;
	var offsetX, offsetY;
	for (let i = 0; i < this.width; i++) {
		for (let j = 0; j < this.height; j++) {
			if ((i % 2) == 0) {
				offsetY = preComputedOffsetY; 
			} else {
				offsetY = 0;
			}
			this.ctx.drawImage(this.hexagonPattern, i * (2*this.radius + preComputedOffsetX), j * height + offsetY);
		}
	}
}