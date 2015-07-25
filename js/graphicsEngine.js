"use strict";

function GraphicsEngine(canvas, context, mapStructures, nbLines, nbColumns, physicsEngine) {
	this.canvas = canvas;
	this.ctx = context;
	this.map = mapStructures.hexagons;
	this.nbLines = nbLines;
	this.nbColumns = nbColumns;

	// To apply events
	this.physicsEngine = physicsEngine;

	// Direction given by eventHandler
	this.direction = "top";

	// Character position on screen
	this.charX = -1;
	this.charY = -1;

	// Patterns
	this.radius = 50;
	var hexagonPatterns = new HexagonPatterns(this.radius);
	this.patterns = hexagonPatterns.getPatterns();
	var characterHeight = 20;
	this.patternWidth = this.patterns.get("block").width;
	this.patternHeight = this.patterns.get("block").height;
	this.characterPatterns = new CharacterPatterns(characterHeight, this.patternWidth, this.patternHeight);
	var exitHeight = 25;
	this.exitPatterns = new ExitPatterns(exitHeight, this.patternWidth, this.patternHeight);

	this.computeGraphicsData();
}

GraphicsEngine.prototype.computeGraphicsData = function() {
	// Pre computation of each hexagons position for the drawing
	this.computeHexagonCoordinates();
	this.updateCharacterCoordinates();
}

GraphicsEngine.prototype.draw = function() {
	// Clean screen
	this.ctx.fillStyle = "#003333";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

	var posX, posY;
	var style;
	for (let hexagon of this.map) {
		posX = hexagon.x;
		posY = hexagon.y;
		
		if (hexagon.exitHere) {
			this.ctx.drawImage(this.exitPatterns.get("basic"), posX, posY);
		}

		if (hexagon.characterHere) {
			// Draw character
			this.ctx.drawImage(this.characterPatterns.get("basic"), posX, posY);
			this.ctx.drawImage(this.patterns.get("space-" + this.direction), posX, posY);
		} else {
			// Draw hexagons
			style = hexagon.type;
			if (hexagon.isPreselected) {
				this.ctx.drawImage(this.patterns.get("highlight"), posX, posY);
			} else if (hexagon.isReachable) {
				this.ctx.drawImage(this.patterns.get("reachable"), posX, posY);
			} else {
				this.ctx.drawImage(this.patterns.get(style), posX, posY);
			}
		}

	}
}

GraphicsEngine.prototype.computeHexagonCoordinates = function() {
	var preComputedOffsetX = - this.radius/2;
	var preComputedOffsetY = Math.sqrt(3)/2 * this.radius;
	var width = 2*this.radius;
	var height = Math.sqrt(3) * this.radius;
	var hexagon;
	var posX, posY;
	var offsetY;
	var i, j;

	for (let hexagon of this.map) {
		i = hexagon.i;
		j = hexagon.j;
		
		if ((j % 2) == 0) {
			offsetY = preComputedOffsetY;
		} else {
			offsetY = 0;
		}
		posX = j * (width + preComputedOffsetX);
		posY = i * height + offsetY;

		hexagon.x = posX;
		hexagon.y = posY;
	}
}

GraphicsEngine.prototype.updateCharacterCoordinates = function() {
	for (let hexagon of this.map) {
		if (hexagon.characterHere) {
			this.charX = hexagon.x + this.patternWidth/2;
			this.charY = hexagon.y + this.patternHeight/2; 
		}
	}
}

GraphicsEngine.prototype.computeDirection = function(x, y) {
	var theta = Math.atan((y - this.charY) / (x - this.charX));
	if (x - this.charX < 0) {
		theta += Math.PI;
	}

	let side = (theta / (Math.PI/3) + 6) % 6 ;
	if (side < 1) {
		return "botRight";
	} else if (side < 2) {
		return "bot";
	} else if (side < 3) {
		return "botLeft";
	} else if (side < 4) {
		return "topLeft";
	} else if (side < 5) {
		return "top";
	} else {
		return "topRight";
	}
}

//   +--------------+
//   |    Events    |
//   +--------------+

GraphicsEngine.prototype.handleCursorMove = function(x, y) {
	var direction = this.computeDirection(x, y);
	if (direction != this.direction) {
		this.direction = direction;
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);
	}
}

GraphicsEngine.prototype.handleClick = function() {
	this.physicsEngine.applyMove(this.direction);
	this.updateCharacterCoordinates();
}
