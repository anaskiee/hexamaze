"use strict";

function MapStructures() {
	this.hexagons = new Set();
	this.characterHexagon = null;
	this.exitHexagon = null;
}

MapStructures.prototype.initializeData = function() {
	if (this.hexagons.size > 0) {
		this.hexagons.clear();
		this.characterHexagon = null;
		this.exitHexagon = null;
	}
}

MapStructures.prototype.addHexagon = function(type) {
	var hex = new Hexagon(type);
	this.hexagons.add(hex);
	return hex;
};