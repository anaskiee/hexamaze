"use strict";

function MapConfiguration(mapStructures, nbLines, nbColumns) {
	this.nbLines = nbLines + 2;
	this.nbColumns = nbColumns + 2;
	var characterLine = 3;
	var characterColumn = 4;
	var exitLine = 4;
	var exitColumn = 5;

	mapStructures.initializeData();

	// Contstruct map
	// Initialiaze block types
	var hex;
	this.map = new Array(this.nbLines * this.nbColumns);
	for (let i = 0; i < this.nbLines; i++) {
		for (let j = 0; j < this.nbColumns; j++) {
			let idx = i*this.nbColumns + j;
			if (i == 0 || j == 0 || i == this.nbLines-1 || j == this.nbColumns-1) {
				this.map[idx] = mapStructures.addHexagon("block");
			} else {
				this.map[idx] = mapStructures.addHexagon("space");
			}
			this.map[idx].i = i;
			this.map[idx].j = j;
		}
	}

	var hexagon;
	// Initialize links between hexagons
	for (let i = 0; i < this.nbLines; i++) {
		for (let j = 0; j < this.nbColumns; j++) {
			let idx = i*this.nbColumns + j;
			hexagon = this.map[idx];

			// Links
			// top
			if (i > 0) {
				hexagon.top = this.map[(i-1)*this.nbColumns + j];
			}

			// bot
			if (i < this.nbLines - 1) {
				hexagon.bot = this.map[(i+1)*this.nbColumns + j];
			}

			// topright
			// topleft
			// Column uneven -> line--
			if ((j % 2) == 1) {
				if (i > 0) {
					if (j > 0) {
					hexagon.topLeft = this.map[(i-1)*this.nbColumns + j-1];
					}
					if (j < this.nbColumns-1) {
						hexagon.topRight = this.map[(i-1)*this.nbColumns + j+1];
					}
				}
			} else {
				if (j > 0) {
					hexagon.topLeft = this.map[i*this.nbColumns + j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.topRight = this.map[i*this.nbColumns + j+1];
				}
			}
			// botright
			// botleft
			// Column even -> line++
			if ((j % 2) == 0) {
				if (i < this.nbLines-1) {
					if (j > 0) {
						hexagon.botLeft = this.map[(i+1)*this.nbColumns + j-1];
					}
					if (j < this.nbColumns-1) {
						hexagon.botRight = this.map[(i+1)*this.nbColumns + j+1];
					}
				}
			} else {
				if (j > 0) {
					hexagon.botLeft = this.map[i*this.nbColumns + j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.botRight = this.map[i*this.nbColumns + j+1];
				}
			}
		}
	}

	this.randomize(15);
}

MapConfiguration.prototype.getMap = function() {
	return this.map;
}

MapConfiguration.prototype.getMapNbLines = function() {
	return this.nbLines;
}

MapConfiguration.prototype.getMapNbColumns = function() {
	return this.nbColumns;
}

MapConfiguration.prototype.randomize = function(blockPercent) {
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
	for (let i = 1; i < this.nbLines-1; i++) {
		for (let j = 1; j < this.nbColumns-1; j++) {
			idx = i*this.nbColumns + j;
			hexagon = this.map[idx];
			if (hexagon.type == "space" && !hexagon.characterHere && !hexagon.exitHere) {
				if (Math.random() < limit) {
					hexagon.type = "block";
				}
			}
		}
	}
}

MapConfiguration.prototype.getRandomHexagon = function() {
	var x = Math.floor(Math.random() * (this.nbColumns - 2)) + 1;
	var y = Math.floor(Math.random() * (this.nbLines - 2)) + 1;
	return this.map[y*this.nbColumns + x];
}