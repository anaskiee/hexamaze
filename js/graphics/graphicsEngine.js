"use strict";

function GraphicsEngine(context, level, physicsEngine) {
	GraphicalElement.call(this, GraphicsEngine);

	this.ctx = context;
	this.level = level;

	this.active = true;
	this.blockEventsSpread = false;

	// To apply events
	this.physicsEngine = physicsEngine;

	// Direction given by eventHandler
	this.direction = "top";

	// Character position on screen
	this.charX = -1;
	this.charY = -1;
}

GraphicsEngine.prototype = Object.create(GraphicalElement.prototype);
GraphicsEngine.prototype.constructor = GraphicsEngine;

GraphicsEngine.prototype.onDrawingRectSet = function() {
	this.width = this.maxWidth;
	this.height = this.maxHeight;

	if (this.level.hexagons.length > 0) {
		this.computeGraphicsData();
	}
}

GraphicsEngine.prototype.computeGraphicsData = function() {
	// Pre computation of each hexagons position for the drawing
	this.radius = this.computeMapSize(this.width, this.height);

	// Patterns
	var hexagonPatterns = new HexagonPatterns(this.radius);
	this.patterns = hexagonPatterns.getPatterns();
	var characterHeight = 2/5*this.radius;
	this.patternWidth = this.patterns.get("block").width;
	this.patternHeight = this.patterns.get("block").height;
	this.characterPatterns = new CharacterPatterns(characterHeight, this.patternWidth, this.patternHeight);
	var exitHeight = 3/5*this.radius;
	this.exitPatterns = new ExitPatterns(exitHeight, this.patternWidth, this.patternHeight);
	this.plusMinuePatterns = new PlusMinusPatterns(this.radius);
	
	this.updateCharacterCoordinates();
}

/*GraphicsEngine.prototype.computeHexagonSize = function(screenWidth, screenHeight) {
	var a = 2 / Math.sqrt(3) / (2*this.nbLines + 1) * screenHeight;
	var b = screenWidth / (2*this.nbColumns);
	return Math.floor(Math.min(a, b));
}*/

// Super function to compute hexagons size and position on screen
GraphicsEngine.prototype.computeMapSize = function(width, height) {
	console.log("width", width);
	console.log("height", height);
	var currHex, nextHex;
	var directions = ["top", "topLeft", "topRight", "bot", "botLeft", "botRight"];
	var hexagons = [];
	var marks = new Map();
	hexagons.push(this.level.exitHexagon);
	marks.set(this.level.exitHexagon, [0, 0]);
	var offset, offsetX, offsetY;

	// Compute all relative positions
	while (hexagons.length > 0) {
		currHex = hexagons.shift();
		offset = marks.get(currHex);
		offsetX = offset[0];
		offsetY = offset[1];
		for (var dir of directions) {
			nextHex = currHex[dir];
			if (nextHex !== null && !marks.has(nextHex)) {
				hexagons.push(nextHex);
				switch (dir) {
					case "top":
						marks.set(nextHex, [offsetX, offsetY - 1]);
						break;
					case "topLeft":
						marks.set(nextHex, [offsetX - 1, offsetY - 1/2]);
						break;
					case "topRight":
						marks.set(nextHex, [offsetX + 1, offsetY - 1/2]);
						break;
					case "bot":
						marks.set(nextHex, [offsetX, offsetY + 1]);
						break;
					case "botLeft":
						marks.set(nextHex, [offsetX - 1, offsetY + 1/2]);
						break;
					case "botRight": 
						marks.set(nextHex, [offsetX + 1, offsetY + 1/2]);
						break;
				}
			}
		}
	}

	// Compute max dimensions
	var minX = 0
	var maxX = 0
	var minY = 0
	var maxY = 0;
	for (var relPos of marks.values()) {
		minX = Math.min(minX, relPos[0]);
		maxX = Math.max(maxX, relPos[0]);
		minY = Math.min(minY, relPos[1]);
		maxY = Math.max(maxY, relPos[1]);
	}

	// Compute hexagon radius by maximizing their size on screen
	var maxWidthRadius = width / (3/2*(maxX - minX + 1) + 1/2);
	var maxHeightRadius = height / (Math.sqrt(3)*(maxY - minY + 1));
	var radius = Math.floor(Math.min(maxHeightRadius, maxWidthRadius));
	if (maxWidthRadius < maxHeightRadius) {
		console.log("width limit");
	} else {
		console.log("height limit");
	}

	// Compute real dimensions in order to center everything
	var usedWidth = radius * (3/2 * (maxX - minX + 1) + 1/2);
	offsetX = (width - usedWidth) / 2;
	// Vertical offset is only computed when there is actually space vertically
	// Else, hexagon's vertical margin are enough
	if (radius == maxWidthRadius) {
		var usedHeight = radius * (Math.sqrt(3) * (maxY - minY + 1) + 2-Math.sqrt(3));
		offsetY = (height - usedHeight) / 2;
	} else {
		offsetY = 0;
	}

	for (var [key, value] of marks) {
		value[0] -= minX;
		value[1] -= minY;
	}

	for (var [hex, offset] of marks) {
		hex.x = offset[0] * 3/2 * radius + offsetX;
		hex.y = offset[1] * Math.sqrt(3) * radius + offsetY;
	}

	return radius;
}

GraphicsEngine.prototype.drawElement = function(date) {
	// Clean screen
	this.ctx.fillStyle = "#003333";
	this.ctx.fillRect(0, 0, this.width, this.height);

	var posX, posY, style;

	// Draw all basic hexagons
	for (let hexagon of this.level.hexagons) {
		posX = hexagon.x;
		posY = hexagon.y;
		style = hexagon.type;
		
		if (hexagon.isPreselected) {
			this.ctx.drawImage(this.patterns.get("highlight"), posX, posY);
		} else if (hexagon.isReachable) {
			this.ctx.drawImage(this.patterns.get("reachable"), posX, posY);
		} else {
			this.ctx.drawImage(this.patterns.get(style), posX, posY);
		}
	}

	// Draw character and direction preselected
	posX = this.level.characterHexagon.x;
	posY = this.level.characterHexagon.y;
	this.ctx.drawImage(this.characterPatterns.get("basic"), posX, posY);
	this.ctx.drawImage(this.patterns.get("space-" + this.direction), posX, posY);

	// Draw exit
	posX = this.level.exitHexagon.x;
	posY = this.level.exitHexagon.y;
	this.ctx.drawImage(this.exitPatterns.get("basic"), posX, posY);
}

GraphicsEngine.prototype.updateCharacterCoordinates = function() {
	var hexagon = this.level.characterHexagon;
	this.charX = hexagon.x + this.patternWidth/2;
	this.charY = hexagon.y + this.patternHeight/2; 
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
	var action = this.physicsEngine.applyMove(this.direction);
	this.updateCharacterCoordinates();
	return action;
}
