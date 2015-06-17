"use strict";

function PhysicsEngine(map) {
	this.map = map;
	this.characterHexagon = null;

	this.searchForCharacter();
	this.computeReachableHexagons();
}

PhysicsEngine.prototype.searchForCharacter = function() {
	for (let hexagon of this.map) {
		if (hexagon.characterHere) {
			this.characterHexagon = hexagon;
			break;
		}
	}
}

PhysicsEngine.prototype.computeReachableHexagons = function() {
	var directions = ["top", "topRight", "topLeft", "bot", "botRight", "botLeft"];
	for (let direction of directions) {
		var nextHexagon = this.characterHexagon[direction];
		while (nextHexagon != null && nextHexagon.type != "block") {
			nextHexagon.isReachable = true;
			nextHexagon = nextHexagon[direction];
		}
	}
}

PhysicsEngine.prototype.applyMove = function(direction) {
	this.cleanMap();

	var currHexagon = this.characterHexagon;
	var nextHexagon = this.characterHexagon[direction];
	while (nextHexagon != null && nextHexagon.type != "block") {
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}
	this.characterHexagon = currHexagon;
	this.characterHexagon.characterHere = true;

	this.computeReachableHexagons();
}

PhysicsEngine.prototype.cleanMap = function() {
	for (let hexagon of this.map) {
		hexagon.isReachable = false;
		hexagon.characterHere = false;
	}
}