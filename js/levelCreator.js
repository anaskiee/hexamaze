"use strict";

function LevelCreator(level, nbLines, nbColumns) {
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

	var hexagon;
	// Initialize links between hexagons
	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			var idx = i*this.nbColumns + j;
			hexagon = this.hexagons[i][j];

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
