"use strict";

function PhysicsEngine(level) {
	// The physcics engine describes law ruling the changes of this level
	this.level = level;
}

PhysicsEngine.prototype.computeReachableHexagons = function() {
	var directions = ["top", "topRight", "topLeft", "bot", "botRight", "botLeft"];
	for (var direction of directions) {
		var currHexagon = this.level.characterHexagon;
		var nextHexagon = currHexagon[direction];
		while (nextHexagon !== null && nextHexagon.type === "space" 
				&& currHexagon !== this.level.exitHexagon) {
			nextHexagon.isReachable = true;
			currHexagon = nextHexagon;
			nextHexagon = nextHexagon[direction];
		}
	}
};

PhysicsEngine.prototype.computeHexagonsTowardsDirection = function(direction) {
	var currHexagon = this.level.characterHexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon !== null && nextHexagon.type === "space" 
			&& currHexagon !== this.level.exitHexagon) {
		nextHexagon.isPreselected = true;
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}
};

PhysicsEngine.prototype.applyMove = function(direction) {
	this.cleanMap();

	var currHexagon = this.level.characterHexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon !== null && nextHexagon.type === "space" 
			&& currHexagon !== this.level.exitHexagon) {
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}
	this.level.characterHexagon = currHexagon;

	if (this.level.characterHexagon === this.level.exitHexagon) {
		return "win";
	} else {
		return "";
	}
};

PhysicsEngine.prototype.cleanMap = function() {
	for (var hexagon of this.level.hexagons) {
		hexagon.isPreselected = false;
	}
};

PhysicsEngine.prototype.cleanHighlight = function() {
	for (var hexagon of this.level.hexagons) {
		hexagon.isReachable = false;
	}
};

PhysicsEngine.prototype.cleanPreselectedHexagons = function() {
	for (var hexagon of this.level.hexagons) {
		hexagon.isPreselected = false;
	}
};
