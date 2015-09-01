"use strict";

function LevelCreator(level, nbLines, nbColumns) {
	this.hexagons = null;
	this.level = level;
	this.nbLines = nbLines + 2;
	this.nbColumns = nbColumns + 2;
}

LevelCreator.prototype.createRandomLevel = function() {
	this.createBasicLevel();
	this.randomize(15);
}

LevelCreator.prototype.createBasicLevel = function() {
	// Object where cleaned data are stored
	this.level.clearData();

	// Init reference structure
	this.hexagons = new Array(this.nbLines);
	for (var i = 0; i < this.nbLines; i++) {
		this.hexagons[i] = new Array(this.nbColumns);
	}

	// Initialiaze block types
	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			if (i == 0 || j == 0 || i == this.nbLines-1 || j == this.nbColumns-1) {
				this.hexagons[i][j] = this.level.addHexagon("block");
			} else {
				this.hexagons[i][j] = this.level.addHexagon("space");
			}
		}
	}

	this.setLinks();
}

LevelCreator.prototype.setLinks = function() {
	var hexagon;
	// Initialize links between hexagons
	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			var idx = i*this.nbColumns + j;
			hexagon = this.hexagons[i][j];

			if (hexagon == null) {
				continue;
			}

			// Links
			// top
			if (i > 0) {
				hexagon.top = this.hexagons[i-1][j];
			}

			// bot
			if (i < this.nbLines - 1) {
				hexagon.bot = this.hexagons[i+1][j];
			}

			// topright
			// topleft
			// Column uneven -> line--
			if ((j % 2) == 1) {
				if (i > 0) {
					if (j > 0) {
					hexagon.topLeft = this.hexagons[i-1][j-1];
					}
					if (j < this.nbColumns-1) {
						hexagon.topRight = this.hexagons[i-1][j+1];
					}
				}
			} else {
				if (j > 0) {
					hexagon.topLeft = this.hexagons[i][j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.topRight = this.hexagons[i][j+1];
				}
			}
			// botright
			// botleft
			// Column even -> line++
			if ((j % 2) == 0) {
				if (i < this.nbLines-1) {
					if (j > 0) {
						hexagon.botLeft = this.hexagons[i+1][j-1];
					}
					if (j < this.nbColumns-1) {
						hexagon.botRight = this.hexagons[i+1][j+1];
					}
				}
			} else {
				if (j > 0) {
					hexagon.botLeft = this.hexagons[i][j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.botRight = this.hexagons[i][j+1];
				}
			}
		}
	}
}

LevelCreator.prototype.randomize = function(blockPercent) {
	var limit = blockPercent / 100;
	var hexagon;
	var idx;

	// Character
	var characterHexagon = this.getRandomHexagon();
	this.level.characterHexagon = characterHexagon;
	
	// Exit
	var exitHexagon = this.getRandomHexagon();
	while (exitHexagon == characterHexagon) {
		var exitHexagon = this.getRandomHexagon();
	}
	this.level.exitHexagon = exitHexagon;

	// Blocks
	for (var i = 1; i < this.nbLines-1; i++) {
		for (var j = 1; j < this.nbColumns-1; j++) {
			hexagon = this.hexagons[i][j];
			if (hexagon.type == "space" && hexagon != characterHexagon && hexagon != exitHexagon) {
				if (Math.random() < limit) {
					hexagon.type = "block";
				}
			}
		}
	}
}

LevelCreator.prototype.getRandomHexagon = function() {
	var x = Math.floor(Math.random() * (this.nbColumns - 2)) + 1;
	var y = Math.floor(Math.random() * (this.nbLines - 2)) + 1;
	return this.hexagons[y][x];
}

LevelCreator.prototype.fillEditingStructure = function() {
	var currHex, nextHex;
	var directions = ["top", "topLeft", "topRight", "bot", "botLeft", "botRight"];
	var hexagons = [];
	var marks = new Map();
	hexagons.push(this.level.exitHexagon);
	marks.set(this.level.exitHexagon, [0, 0]);
	var position, i, j;

	// Compute all relative positions
	while (hexagons.length > 0) {
		currHex = hexagons.shift();
		position = marks.get(currHex);
		i = position[0];
		j = position[1];
		for (var dir of directions) {
			nextHex = currHex[dir];
			if (nextHex !== null && !marks.has(nextHex)) {
				hexagons.push(nextHex);
				switch (dir) {
					case "top":
						marks.set(nextHex, [i - 1, j]);
						break;
					case "bot":
						marks.set(nextHex, [i + 1, j]);
						break;
					case "topLeft":
						if (j % 2 == 0) {
							marks.set(nextHex, [i - 1, j - 1]);
						} else {
							marks.set(nextHex, [i, j - 1]);
						}
						break;
					case "topRight":
						if (j % 2 == 0) {
							marks.set(nextHex, [i - 1, j + 1]);
						} else {
							marks.set(nextHex, [i, j + 1]);
						}
						break;
					case "botLeft":
						if (j % 2 == 0) {
							marks.set(nextHex, [i, j - 1]);
						} else {
							marks.set(nextHex, [i + 1, j - 1]);
						}
						break;
					case "botRight":
						if (j % 2 == 0) {
							marks.set(nextHex, [i, j + 1]);
						} else {
							marks.set(nextHex, [i + 1, j + 1]);
						}
						break;
				}
			}
		}
	}

	// Compute max dimensions
	var iMin = 0
	var iMax = 0
	var jMin = 0
	var jMax = 0;
	for (var relPos of marks.values()) {
		iMin = Math.min(iMin, relPos[0]);
		iMax = Math.max(iMax, relPos[0]);
		jMin = Math.min(jMin, relPos[1]);
		jMax = Math.max(jMax, relPos[1]);
	}

	// Init reference structure
	this.nbLines = iMax - iMin + 1;
	this.nbColumns = jMax - jMin + 1;
	this.hexagons = new Array(this.nbLines);
	for (var i = 0; i < this.nbLines; i++) {
		this.hexagons[i] = new Array(this.nbColumns);
		for (var j = 0; j < this.nbColumns; j++) {
			this.hexagons[i][j] = null;
		}
	}

	for (var mark of marks.values()) {
		mark[0] -= iMin;
		mark[1] -= jMax;
	}

	// Place hexagons in array
	for (var [hex, pos] of marks) {
		this.hexagons[pos[0]][pos[1]] = hex;
	}

	// Init links
	this.setLinks();
}