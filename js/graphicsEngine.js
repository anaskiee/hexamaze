"use strict";

function GraphicsEngine(canvas, context, map, nbLines, nbColumns, eventHandler) {
	this.canvas = canvas;
	this.ctx = context;
	this.map = map;
	this.nbLines = nbLines;
	this.nbColumns = nbColumns;
	this.eventHandler = eventHandler;

	// Direction given by eventHandler
	this.direction = "top";

	// Patterns
	this.radius = 50;
	var hexagonPatterns = new HexagonPatterns(this.radius);
	this.patterns = hexagonPatterns.getPatterns();
	var characterHeight = 20;
	this.patternWidth = this.patterns.get("block").width;
	this.patternHeight = this.patterns.get("block").height;
	this.characterPatterns = new CharacterPatterns(characterHeight, this.patternWidth, this.patternHeight);

	this.computeHexagonCoordinates();

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
/*	var preComputedOffsetX = - this.radius/2;
	var preComputedOffsetY = Math.sqrt(3)/2 * this.radius;
	var width = 2*this.radius;
	var height = Math.sqrt(3) * this.radius;
	var offsetX, offsetY;
	var style;
	var hexagon;
	var posX, posY;
	for (let j = 0; j < this.nbColumns; j++) {
		this.ctx.save();
		if ((j % 2) == 0) {
			this.ctx.translate(0, preComputedOffsetY);
		}
		for (let i = 0; i < this.nbLines; i++) {
			hexagon = this.map[i*this.nbColumns + j];
			style = hexagon.type;
			posX = j * (width + preComputedOffsetX);
			posY = i * height;

			if (hexagon.isReachable) {
				this.ctx.drawImage(this.patterns.get("reachable"), posX, posY);
			} else {
				this.ctx.drawImage(this.patterns.get(style), posX, posY);
			}

			if (hexagon.characterHere) {
				this.ctx.drawImage(this.characterPatterns.get("basic"), posX, posY);
			}
		}
		this.ctx.restore();
	}*/

	var posX, posY;
	var style;
	for (let hexagon of this.map) {
		posX = hexagon.x;
		posY = hexagon.y;
		style = hexagon.type;
		if (hexagon.isReachable) {
			this.ctx.drawImage(this.patterns.get("reachable"), posX, posY);
		} else {
			this.ctx.drawImage(this.patterns.get(style), posX, posY);
		}

		if (hexagon.characterHere) {
			this.ctx.drawImage(this.characterPatterns.get("basic"), posX, posY);
		}
	}

	// Draw gui
	var guiX = 1500;
	var guiY = 500;
	var eX = 500;
	var eY = 500;
	//var eX = this.eventHandler.x;
	//var eY = this.eventHandler.y;
	var theta = Math.atan((eY - guiY) / (eX - guiX));
	if (eX - guiX < 0) {
		theta += Math.PI;
	}
	this.gui.draw(this.ctx, guiX, guiY, theta);
}

GraphicsEngine.prototype.computeHexagonCoordinates = function() {
	var preComputedOffsetX = - this.radius/2;
	var preComputedOffsetY = Math.sqrt(3)/2 * this.radius;
	var width = 2*this.radius;
	var height = Math.sqrt(3) * this.radius;
	var hexagon;
	var posX, posY;
	var offsetY;
	for (let j = 0; j < this.nbColumns; j++) {
		if ((j % 2) == 0) {
			offsetY = preComputedOffsetY;
		} else {
			offsetY = 0;
		}
		for (let i = 0; i < this.nbLines; i++) {
			hexagon = this.map[i*this.nbColumns + j];
			posX = j * (width + preComputedOffsetX);
			posY = i * height + offsetY;

			hexagon.x = posX;
			hexagon.y = posY;
		}
	}
}

GraphicsEngine.prototype.computeCharacterCoordinates = function() {
	for (let hexagon of this.map) {
		if (hexagon.characterHere) {
			return {x : hexagon.x + this.patternWidth/2, 
					y : hexagon.y + this.patternHeight/2};
		}
	}
}