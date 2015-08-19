"use strict";

function MapSolver(map) {
	this.map = map
	this.solution = null;
}

MapSolver.prototype.getCharacterHexagon = function() {
	for (var hexagon of this.map) {
		if (hexagon.characterHere) {
			return hexagon;
		}
	}
}

MapSolver.prototype.getExitHexagon = function() {
	for (var hexagon of this.map) {
		if (hexagon.exitHere) {
			return hexagon;
		}
	}
}

MapSolver.prototype.getMin = function() {
	this.solution = this.solve();

	if (this.solution == "undefined") {
		return 9000;
	}
	var exitHexagon = this.getExitHexagon();
	return this.solution.get(exitHexagon).depth;
}

MapSolver.prototype.highlightSolution = function() {
	if (this.solution == null) {
		this.solution = this.solve();
	}
	if (this.solution == "undefined") {
		// no solution
		return;
	}
	var exitHexagon = this.getExitHexagon();

	var currHexagon = exitHexagon;
	var nextHexagon, direction;
	while (!currHexagon.characterHere) {
		nextHexagon = this.solution.get(currHexagon).prevHexagon;
		direction = this.solution.get(currHexagon).direction;
		while (currHexagon != nextHexagon) {
			currHexagon.isReachable = true;
			currHexagon = currHexagon[direction];
		}
	} 
}

MapSolver.prototype.solve = function() {
	var characterHexagon = this.getCharacterHexagon();

	var directions = ["top", "topLeft", "topRight", "bot", "botRight", "botLeft"];
	var toExplore = [characterHexagon];
	var solution = new Map();
	solution.set(characterHexagon, {prevHexagon : null, depth : 0, direction : ""});
	while (toExplore.length > 0) {
		var hexagon = toExplore.shift();
		var depth = solution.get(hexagon).depth;
		for (var direction of directions) {
			var oppositeDirection = directions[(directions.indexOf(direction) + 3) % 6];
			var nextHexagon = this.computeNextHexagon(hexagon, direction);
			if (!solution.has(nextHexagon)) {
				solution.set(nextHexagon, {prevHexagon : hexagon, depth : depth + 1, direction : oppositeDirection});
				if (nextHexagon.exitHere) {
					return solution;
				}
				toExplore.push(nextHexagon);
			}
		}
	}
	return "undefined";
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