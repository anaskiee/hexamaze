"use strict";

function GraphicsEngine(context, offContext, pixelMapper, level, physicsEngine) {
	GraphicalElement.call(this, "GraphicsEngine", pixelMapper);

	this.ctx = context;
	this.offCtx = offContext;

	this.level = level;

	this.active = true;
	this.blockEventsSpread = false;

	// To apply events
	this.physicsEngine = physicsEngine;

	// Direction given by eventHandler
	this.direction = "";

	// Character position on screen
	this.charX = -1;
	this.charY = -1;

	this.mode = "";
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
	this.hexagonPatterns = new HexagonPatterns(this.radius);
	var characterHeight = 2/5*this.radius;
	this.characterPatterns = new CharacterPatterns(characterHeight);
	var exitHeight = 3/5*this.radius;
	this.exitPatterns = new ExitPatterns(exitHeight);
	this.plusMinusPatterns = new PlusMinusPatterns(this.radius);
	
	this.updateCharacterCoordinates();
}

/*GraphicsEngine.prototype.computeHexagonSize = function(screenWidth, screenHeight) {
	var a = 2 / Math.sqrt(3) / (2*this.nbLines + 1) * screenHeight;
	var b = screenWidth / (2*this.nbColumns);
	return Math.floor(Math.min(a, b));
}*/

// Super function to compute hexagons size and position on screen
GraphicsEngine.prototype.computeMapSize = function(width, height) {
	var currHex, nextHex;
	var directions = ["top", "topLeft", "topRight", "bot", "botLeft", "botRight"];
	var hexagons = [];
	var marks = new Map();
	var hexagon = this.level.getAnHexagon();

	if (!hexagon) {
		console.log("empty level WTF !!");
		return;
	}

	hexagons.push(hexagon);
	marks.set(hexagon, [0, 0]);
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
	var maxWidthRadius = Math.floor(width / (3/2*(maxX - minX + 1) + 1/2));
	var maxHeightRadius = Math.floor(height / (Math.sqrt(3)*(maxY - minY + 1)));
	var radius = Math.min(maxHeightRadius, maxWidthRadius);

	// Compute real dimensions in order to center everything
	// 1/2 for the last part on the right
	var usedWidth = radius * (3/2 * (maxX - minX + 1) + 1/2);
	var usedHeight = radius * (Math.sqrt(3) * (maxY - minY + 1));
	offsetX = (width - usedWidth) / 2;
	offsetY = (height - usedHeight) / 2;

	for (var value of marks.values()) {
		value[0] -= minX;
		value[1] -= minY;
	}

	for (var entry of marks.entries()) {
		var hex = entry[0];
		var offset = entry[1];
		hex.x = radius + offset[0] * 3/2 * radius + offsetX;
		hex.y = Math.sqrt(3)/2*radius + offset[1] * Math.sqrt(3) * radius + offsetY;
	}

	return radius;
}

GraphicsEngine.prototype.drawElement = function(date) {
	// Clean screen
	this.ctx.fillStyle = "#003333";
	this.ctx.fillRect(0, 0, this.width, this.height);

	var posX, posY, style;

	// Draw all basic hexagons
	for (var hexagon of this.level.hexagons) {
		posX = hexagon.x;
		posY = hexagon.y;
		style = hexagon.type;
		
		if (hexagon.isPreselected) {
			this.hexagonPatterns.draw(this.ctx, "highlight", posX, posY);
		} else if (hexagon.isReachable) {
			this.hexagonPatterns.draw(this.ctx, "reachable", posX, posY);
		} else {
			// voids are not drawn in game mode
			if (!(style == "void" && this.mode == "game")) {
				this.hexagonPatterns.draw(this.ctx, style, posX, posY);
			}
		}
	}

	// Draw character and direction preselected
	if (this.level.characterHexagon != null) {
		posX = this.level.characterHexagon.x;
		posY = this.level.characterHexagon.y;
		this.characterPatterns.draw(this.ctx, "basic", posX, posY);
		if (this.direction) {
			this.hexagonPatterns.draw(this.ctx, this.direction, posX, posY);
		}
	}

	// Draw exit
	if (this.level.exitHexagon != null) {
		posX = this.level.exitHexagon.x;
		posY = this.level.exitHexagon.y;
		this.exitPatterns.draw(this.ctx, "basic", posX, posY);
	}
}

GraphicsEngine.prototype.offContextDraw = function() {
	if (this.mode == "game") {
		if (this.offContextColor == null) {
			this.offContextColor = this.pixelMapper.registerAndGetColor(this);
		}
		this.offCtx.fillStyle = this.offContextColor;
		this.offCtx.fillRect(this.offsetX, this.offsetY, 
								this.maxWidth, this.maxHeight);
	} else if (this.mode == "forge") {
		this.offCtx.clearRect(this.offsetX, this.offsetY, 
								this.maxWidth, this.maxHeight);
		var color;
		var x, y;
		for (var hexagon of this.level.hexagons) {
			x = hexagon.x;
			y = hexagon.y;
			color = this.pixelMapper.registerAndGetColor(hexagon);
			this.offCtx.save();
			this.offCtx.translate(Math.round(this.offsetX), Math.round(this.offsetY));
			this.hexagonPatterns.offContextDraw(this.offCtx, x, y, color);
			this.offCtx.restore();
		}
	}
}

GraphicsEngine.prototype.updateCharacterCoordinates = function() {
	var hexagon = this.level.characterHexagon;
	if (hexagon != null) {
		this.charX = this.offsetX + hexagon.x;
		this.charY = this.offsetY + hexagon.y; 
	} else {
		this.charX = -1;
		this.charY = -1;
	}
}

GraphicsEngine.prototype.computeDirection = function(x, y) {
	var theta = Math.atan((y - this.charY) / (x - this.charX));
	if (x - this.charX < 0) {
		theta += Math.PI;
	}

	var side = (theta / (Math.PI/3) + 6) % 6 ;
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

GraphicsEngine.prototype.setEventMode = function(mode) {
	if (mode == "game") {
		this.mode = "game";
		this.updateCharacterCoordinates();
	} else if (mode == "forge") {
		this.mode = "forge";
		this.direction = null;
		this.physicsEngine.cleanPreselectedHexagons();
	} else {
		console.log("Unknown mode: " + mode);
	}
}

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
