"use strict";

function GraphicsEngine(ctxLocator, pixelMapper, level, physicsEngine) {
	GraphicalElement.call(this, "GraphicsEngine", ctxLocator, pixelMapper);

	this.level = level;
	this.physicsEngine = physicsEngine;

	this.active = true;
	this.blockEventsSpread = false;

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
	this.computeGraphicsData();
};

GraphicsEngine.prototype.computeGraphicsData = function() {
	// Only compute if there is level is initialized
	if (this.level.hexagons.size > 0) {
		// Pre computation of each hexagons position for the drawing
		this.radius = this.computeMapSize(this.width, this.height);
	
		// Patterns
		this.hexagonPatterns = new HexagonPatterns(this.radius);
		var characterHeight = 2/5*this.radius;
		var character = this.level.character;
		character.pattern = new CharacterPatterns(characterHeight);
		character.x = character.hexagon.x;
		character.y = character.hexagon.y;
		var exitHeight = 3/5*this.radius;
		this.exitPatterns = new ExitPatterns(exitHeight);
		
		this.updateCharacterCoordinates();
	}
};

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
	var minX, maxX, minY, maxY;
	for (var mark of marks.entries()) {
		var hex = mark[0];
		var relPos = mark[1];
		// In game mode, we do not want to draw void hexagons
		// But in edit one, we do
		if (this.mode === "game" && hex.type !== "void" || this.mode === "forge") {
			if (minX === undefined) {
				minX = maxX = relPos[0];
				minY = maxY = relPos[1];
			} else {
				minX = Math.min(minX, relPos[0]);
				maxX = Math.max(maxX, relPos[0]);
				minY = Math.min(minY, relPos[1]);
				maxY = Math.max(maxY, relPos[1]);
			}
		}
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
};

GraphicsEngine.prototype.selfRender = function() {
	var ctx = this.ctxLocator.ctx;
	// Clean screen
	ctx.fillStyle = "#003333";
	ctx.fillRect(0, 0, this.width, this.height);

	var posX, posY, style;

	// Draw all basic hexagons
	for (var hexagon of this.level.hexagons) {
		posX = hexagon.x;
		posY = hexagon.y;
		style = hexagon.type;
		
		if (hexagon.isPreselected) {
			this.hexagonPatterns.draw(ctx, "highlight", posX, posY);
		} else if (hexagon.isReachable) {
			this.hexagonPatterns.draw(ctx, "reachable", posX, posY);
		} else {
			// voids are not drawn in game mode
			if (!(style === "void" && this.mode === "game")) {
				this.hexagonPatterns.draw(ctx, style, posX, posY);
			}
		}
	}

	// Draw character and direction preselected
	if (this.level.character.hexagon !== null) {
		posX = this.level.character.hexagon.x;
		posY = this.level.character.hexagon.y;
		this.level.character.render(ctx);
		if (this.direction) {
			this.hexagonPatterns.draw(ctx, this.direction, posX, posY);
		}
	}

	// Draw exit
	if (this.level.exitHexagon !== null) {
		posX = this.level.exitHexagon.x;
		posY = this.level.exitHexagon.y;
		this.exitPatterns.draw(ctx, "basic", posX, posY);
	}
};

GraphicsEngine.prototype.offContextDraw = function() {
	var offCtx = this.ctxLocator.offCtx;
	if (this.mode === "game") {
		if (this.offContextColor === null) {
			this.offContextColor = this.pixelMapper.registerAndGetColor(this);
		}
		offCtx.fillStyle = this.offContextColor;
		offCtx.fillRect(this.offsetX, this.offsetY, 
								this.maxWidth, this.maxHeight);
	} else if (this.mode === "forge") {
		offCtx.clearRect(this.offsetX, this.offsetY, 
								this.maxWidth, this.maxHeight);
		var x, y;
		for (var hexagon of this.level.hexagons) {
			x = hexagon.x;
			y = hexagon.y;
			if (hexagon.offContextColor === null) {
				hexagon.offContextColor = this.pixelMapper.registerAndGetColor(hexagon);
			}
			offCtx.save();
			offCtx.translate(Math.round(this.offsetX), Math.round(this.offsetY));
			this.hexagonPatterns.offContextDraw(offCtx, x, y, 
												hexagon.offContextColor);
			offCtx.restore();
		}
	}
};

GraphicsEngine.prototype.update = function(dt) {
	this.level.character.update(dt);
	if (this.animationRunning === true && 
		this.level.character.animationRunning === false) {
		this.animationRunning = false;
	}
};

GraphicsEngine.prototype.updateCharacterCoordinates = function() {
	var hexagon = this.level.character.hexagon;
	if (hexagon !== null) {
		this.charX = this.offsetX + hexagon.x;
		this.charY = this.offsetY + hexagon.y; 
	} else {
		this.charX = -1;
		this.charY = -1;
	}
};

GraphicsEngine.prototype.computeDirection = function(x, y) {
	var X = x - this.charX;
	var Y = y - this.charY;
	if (Y < 0) {
		if (Y*Y > 3*X*X) {
			return "top";
		} else if (X > 0) {
			return "topRight";
		} else {
			return "topLeft";
		}
	} else {
		if (Y*Y > 3*X*X) {
			return "bot";
		} else if (X > 0) {
			return "botRight";
		} else {
			return "botLeft";
		}
	}
};

//   +--------------+
//   |    Events    |
//   +--------------+

GraphicsEngine.prototype.setEventMode = function(mode) {
	if (mode === "game") {
		this.mode = "game";
		this.updateCharacterCoordinates();
	} else if (mode === "forge") {
		this.mode = "forge";
		this.direction = null;
		this.physicsEngine.cleanPreselectedHexagons();
	} else {
		console.log("Unknown mode: " + mode);
	}
	this.computeGraphicsData();
};

GraphicsEngine.prototype.handleCursorMove = function(x, y) {
	if (this.level.character.animationRunning === true)
		return;

	var direction = this.computeDirection(x, y);
	if (direction !== this.direction) {
		this.direction = direction;
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);
	}
};

GraphicsEngine.prototype.handleClick = function() {
	if (this.level.character.animationRunning === true)
		return;
	
	var character = this.level.character;
	var px = this.offsetX + character.hexagon.x;
	var py = this.offsetY + character.hexagon.y;
	var action = this.physicsEngine.applyMove(this.direction);
	var x = this.offsetX + character.hexagon.x;
	var y = this.offsetY + character.hexagon.y;
	if (px !== x || py !== y) {
		this.animationRunning = true;
		character.initAnimation(px, py, x, y);
		this.updateCharacterCoordinates();
		return action;
	}
};
