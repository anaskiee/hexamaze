"use strict";

function PhysicsEngine(mapStructures) {
	this.map = mapStructures.hexagons;
	this.characterHexagon = null;

	this.computePhysicsData();
}

PhysicsEngine.prototype.computePhysicsData = function() {
	this.searchForCharacter();
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
		var currHexagon = this.characterHexagon;
		var nextHexagon = currHexagon[direction];
		while (nextHexagon != null && nextHexagon.type != "block" && !currHexagon.exitHere) {
			nextHexagon.isReachable = true;
			currHexagon = nextHexagon;
			nextHexagon = nextHexagon[direction];
		}
	}
}

PhysicsEngine.prototype.computeHexagonsTowardsDirection = function(direction) {
	var currHexagon = this.characterHexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon != null && nextHexagon.type != "block" && !currHexagon.exitHere) {
		nextHexagon.isPreselected = true;
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}
}

PhysicsEngine.prototype.applyMove = function(direction) {
	this.cleanMap();

	var currHexagon = this.characterHexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon != null && nextHexagon.type != "block" && !currHexagon.exitHere) {
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}
	this.characterHexagon = currHexagon;
	this.characterHexagon.characterHere = true;

	if (this.characterHexagon.exitHere) {
		return "win";
	} else {
		return "";
	}
}

PhysicsEngine.prototype.cleanMap = function() {
	for (let hexagon of this.map) {
		hexagon.characterHere = false;
		hexagon.isPreselected = false;
	}
}

PhysicsEngine.prototype.cleanHighlight = function() {
	for (let hexagon of this.map) {
		hexagon.isReachable = false;
	}
}

PhysicsEngine.prototype.cleanPreselectedHexagons = function() {
	for (let hexagon of this.map) {
		hexagon.isPreselected = false;
	}
}
