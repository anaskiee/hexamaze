"use strict";

function PhysicsEngine(system) {
	// The physcics engine describes law ruling the changes of this system
	this.system = system
}

PhysicsEngine.prototype.computeReachableHexagons = function() {
	var directions = ["top", "topRight", "topLeft", "bot", "botRight", "botLeft"];
	for (let direction of directions) {
		var currHexagon = this.system.characterHexagon;
		var nextHexagon = currHexagon[direction];
		while (nextHexagon != null && nextHexagon.type != "block" && !currHexagon.exitHere) {
			nextHexagon.isReachable = true;
			currHexagon = nextHexagon;
			nextHexagon = nextHexagon[direction];
		}
	}
}

PhysicsEngine.prototype.computeHexagonsTowardsDirection = function(direction) {
	var currHexagon = this.system.characterHexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon != null && nextHexagon.type != "block" && !currHexagon.exitHere) {
		nextHexagon.isPreselected = true;
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}
}

PhysicsEngine.prototype.applyMove = function(direction) {
	this.cleanMap();

	var currHexagon = this.system.characterHexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon != null && nextHexagon.type != "block" && !currHexagon.exitHere) {
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}
	this.system.characterHexagon = currHexagon;
	this.system.characterHexagon.characterHere = true;

	if (this.system.characterHexagon === this.system.exitHexagon) {
		return "win";
	} else {
		return "";
	}
}

PhysicsEngine.prototype.cleanMap = function() {
	for (let hexagon of this.system.hexagons) {
		hexagon.characterHere = false;
		hexagon.isPreselected = false;
	}
}

PhysicsEngine.prototype.cleanHighlight = function() {
	for (let hexagon of this.system.hexagons) {
		hexagon.isReachable = false;
	}
}

PhysicsEngine.prototype.cleanPreselectedHexagons = function() {
	for (let hexagon of this.system.hexagons) {
		hexagon.isPreselected = false;
	}
}
