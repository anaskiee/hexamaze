"use strict";

function MapCreator(mapStructures, nbLines, nbColumns) {
	this.nbLines = nbLines + 2;
	this.nbColumns = nbColumns + 2;

	// Object where cleaned data are stored
	mapStructures.initializeData();

	// Contstruct map
	// Initialiaze block types
	var hex;
	
	// Init reference structure
	this.map = new Array(this.nbLines);
	for (var i = 0; i < this.nbLines; i++) {
		this.map[i] = new Array(this.nbColumns);
	}

	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			if (i == 0 || j == 0 || i == this.nbLines-1 || j == this.nbColumns-1) {
				this.map[i][j] = mapStructures.addHexagon("block");
			} else {
				this.map[i][j] = mapStructures.addHexagon("space");
			}
		}
	}

	var hexagon;
	// Initialize links between hexagons
	for (var i = 0; i < this.nbLines; i++) {
		for (var j = 0; j < this.nbColumns; j++) {
			var idx = i*this.nbColumns + j;
			hexagon = this.map[i][j];

			// Links
			// top
			if (i > 0) {
				hexagon.top = this.map[i-1][j];
			}

			// bot
			if (i < this.nbLines - 1) {
				hexagon.bot = this.map[i+1][j];
			}

			// topright
			// topleft
			// Column uneven -> line--
			if ((j % 2) == 1) {
				if (i > 0) {
					if (j > 0) {
					hexagon.topLeft = this.map[i-1][j-1];
					}
					if (j < this.nbColumns-1) {
						hexagon.topRight = this.map[i-1][j+1];
					}
				}
			} else {
				if (j > 0) {
					hexagon.topLeft = this.map[i][j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.topRight = this.map[i][j+1];
				}
			}
			// botright
			// botleft
			// Column even -> line++
			if ((j % 2) == 0) {
				if (i < this.nbLines-1) {
					if (j > 0) {
						hexagon.botLeft = this.map[i+1][j-1];
					}
					if (j < this.nbColumns-1) {
						hexagon.botRight = this.map[i+1][j+1];
					}
				}
			} else {
				if (j > 0) {
					hexagon.botLeft = this.map[i][j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.botRight = this.map[i][j+1];
				}
			}
		}
	}

	this.randomize(15);
}

MapCreator.prototype.randomize = function(blockPercent) {
	var limit = blockPercent / 100;
	var hexagon;
	var idx;

	// Character
	var characterHexagon = this.getRandomHexagon();
	characterHexagon.characterHere = true;
	
	// Exit
	var exitHexagon = this.getRandomHexagon();
	while (exitHexagon == characterHexagon) {
		var exitHexagon = this.getRandomHexagon();
	}
	exitHexagon.exitHere = true;

	// Blocks
	for (var i = 1; i < this.nbLines-1; i++) {
		for (var j = 1; j < this.nbColumns-1; j++) {
			hexagon = this.map[i][j];
			if (hexagon.type == "space" && !hexagon.characterHere && !hexagon.exitHere) {
				if (Math.random() < limit) {
					hexagon.type = "block";
				}
			}
		}
	}
}

MapCreator.prototype.getRandomHexagon = function() {
	var x = Math.floor(Math.random() * (this.nbColumns - 2)) + 1;
	var y = Math.floor(Math.random() * (this.nbLines - 2)) + 1;
	return this.map[y][x];
}