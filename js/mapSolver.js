"use strict";

function MapSolver(map) {
	this.map = map
}

MapSolver.prototype.solve = function() {
	// Find character
	var characterHexagon;
	for (let hexagon of this.map) {
		if (hexagon.characterHere) {
			characterHexagon = hexagon;
			break;
		}
	}

	var directions = ["top", "topLeft", "topRight", "bot", "botLeft", "botRight"];
	var toExplore = [characterHexagon];
	var solution = new Map();
	solution.set(characterHexagon, {prevHexagon : null, depth : 0});
	while (toExplore.length > 0) {
		let hexagon = toExplore.shift();
		let depth = solution.get(hexagon).depth;
		for (let direction of directions) {
			let nextHexagon = this.computeNextHexagon(hexagon, direction);
			nextHexagon.isReachable = true;
			if (!solution.has(nextHexagon)) {
				solution.set(nextHexagon, {prevHexagon : hexagon, depth : depth + 1});
				if (nextHexagon.exitHere) {
					return depth + 1;
				}
				toExplore.push(nextHexagon);
			}
		}
	}	
}

MapSolver.prototype.computeNextHexagon = function(hexagon, direction) {
	var currHexagon = hexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon != null && nextHexagon.type != "block" && !currHexagon.exitHere) {
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}

	return currHexagon;
} 