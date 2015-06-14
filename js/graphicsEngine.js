"use strict";

function GraphicsEngine(canvas, context, map, mapWidth, mapHeight, eventHandler) {
	this.canvas = canvas;
	this.ctx = context;
	this.map = map;
	this.width = mapWidth;
	this.height = mapHeight;
	this.eventHandler = eventHandler;

	this.radius = 50;
	var hexagonPatterns = new HexagonPatterns(this.radius);
	this.patterns = hexagonPatterns.getPatterns();

	this.gui = new Gui(50, 90, 120, this.patterns);
}

GraphicsEngine.prototype.beginDrawing = function() {
	this.draw();
}

GraphicsEngine.prototype.draw = function() {
	requestAnimationFrame(this.draw.bind(this));

	// Clean screen
	this.ctx.fillStyle = "#003333";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	// Draw hexagons
	var preComputedOffsetX = - this.radius/2;
	var preComputedOffsetY = Math.sqrt(3)/2 * this.radius;
	var height = Math.sqrt(3) * this.radius;
	var offsetX, offsetY;
	var style;
	for (let i = 0; i < this.width; i++) {
		for (let j = 0; j < this.height; j++) {
			style = this.map[i*this.width + j].type;
			if ((i % 2) == 0) {
				offsetY = preComputedOffsetY; 
			} else {
				offsetY = 0;
			}
			this.ctx.drawImage(this.patterns.get(style), i * (2*this.radius + preComputedOffsetX), j * height + offsetY);
		}
	}

	// Draw gui
	var guiX = 1500;
	var guiY = 500;
	var eX = this.eventHandler.x;
	var eY = this.eventHandler.y;
	var theta = Math.atan((eY - guiY) / (eX - guiX));
	if (eX - guiX < 0) {
		theta += Math.PI;
	}
	this.gui.draw(this.ctx, guiX, guiY, theta);
}