"use strict";

function MapConfiguration(nbLines, nbColumns) {
	this.nbLines = nbLines + 2;
	this.nbColumns = nbColumns + 2;
	var characterLine = 2;
	var characterColumn = 1;

	// Contstruct map
	// Initialiaze block types
	this.map = new Array(this.nbLines * this.nbColumns);
	for (let i = 0; i < this.nbLines; i++) {
		for (let j = 0; j < this.nbColumns; j++) {
			let idx = i*this.nbColumns + j;
			if (i == 1 && j == 1 || i == 1 && j == this.nbColumns-2) {
				this.map[idx] = new Hexagon("block");
			} else if (i == 0 || j == 0 || i == this.nbLines-1 || j == this.nbColumns-1) {
				this.map[idx] = new Hexagon("block");
			} else {
				this.map[idx] = new Hexagon("space");
			}
		}
	}

	var hexagon;
	// Initialize links between hexagons
	for (let i = 0; i < this.nbLines; i++) {
		for (let j = 0; j < this.nbColumns; j++) {
			let idx = i*this.nbColumns + j;
			hexagon = this.map[idx];

			// Links
			if (i > 0) {
				hexagon.top = this.map[(i-1)*this.nbLines + j];
				if (j > 0) {
					hexagon.topLeft = this.map[(i-1)*this.nbLines + j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.topRight = this.map[(i-1)*this.nbLines + j+1];
				}
			}
			if (i < this.nbLines - 1) {
				hexagon.bot = this.map[(i+1)*this.nbLines + j];
				if (j > 0) {
					hexagon.botLeft = this.map[(i+1)*this.nbLines + j-1];
				}
				if (j < this.nbColumns-1) {
					hexagon.botRight = this.map[(i+1)*this.nbLines + j+1];
				}
			}

			// Character positionning
			if (i == characterLine && j == characterColumn) {
				hexagon.characterHere = true;
			}
		}
	}
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