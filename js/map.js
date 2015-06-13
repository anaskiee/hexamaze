"use strict";

function Map(width, height) {
	this.width = width + 2;
	this.height = height + 2;

	// Contstruct map
	// Initialiaze block types
	this.map = new Array(this.width * this.height);
	for (let i = 0; i < this.width; i++) {
		for (let j = 0; j < this.height; j++) {
			let idx = i*this.width + j;
			if (i == 0 || j == 0 || i == this.width-1 || j == this.height-1) {
				this.map[idx] = new Hexagon("block");
			} else {
				this.map[idx] = new Hexagon("space");
			}
		}
	}

	var hexagon;
	// Initialize links between hexagons
	for (let i = 0; i < this.width; i++) {
		for (let j = 0; j < this.height; j++) {
			let idx = i*this.width + j;
			hexagon = this.map[idx];
			if (i > 0) {
				hexagon.top = this.map[(i-1)*this.width + j];
				if (j > 0) {
					hexagon.topLeft = this.map[(i-1)*this.width + j-1];
				}
				if (j < this.height-1) {
					hexagon.topRight = this.map[(i-1)*this.width + j+1];
				}
			}
			if (i < this.width - 1) {
				hexagon.bot = this.map[(i+1)*this.width + j];
				if (j > 0) {
					hexagon.botLeft = this.map[(i+1)*this.width + j-1];
				}
				if (j < this.height-1) {
					hexagon.botRight = this.map[(i+1)*this.width + j+1];
				}
			}
		}
	}
}

Map.prototype.getMap = function() {
	return this.map;
}

Map.prototype.getMapWidth = function() {
	return this.width;
}

Map.prototype.getMapHeight = function() {
	return this.height;
}