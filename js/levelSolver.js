"use strict";

function LevelSolver(level) {
	this.level = level;
	this.solution = null;
}

LevelSolver.prototype.getMin = function() {
	this.solution = this.solve();

	if (this.solution == "undefined") {
		return 9000;
	}
	var exitHexagon = this.level.exitHexagon;
	return this.solution.get(exitHexagon).depth;
}

LevelSolver.prototype.highlightSolution = function() {
	if (this.solution == null) {
		this.solution = this.solve();
	}
	if (this.solution == "undefined") {
		// no solution
		return;
	}
	var exitHexagon = this.level.exitHexagon;

	var currHexagon = exitHexagon;
	var nextHexagon, direction;
	while (currHexagon != this.level.characterHexagon) {
		nextHexagon = this.solution.get(currHexagon).prevHexagon;
		direction = this.solution.get(currHexagon).direction;
		while (currHexagon != nextHexagon) {
			currHexagon.isReachable = true;
			currHexagon = currHexagon[direction];
		}
	} 
}

LevelSolver.prototype.solve = function() {
	var characterHexagon = this.level.characterHexagon;
	if (characterHexagon == null) {
		console.log("ici");
	}

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
				if (nextHexagon == this.level.exitHexagon) {
					return solution;
				}
				toExplore.push(nextHexagon);
			}
		}
	}
	return "undefined";
}

LevelSolver.prototype.computeNextHexagon = function(hexagon, direction) {
	var currHexagon = hexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon != null && nextHexagon.type != "block" && currHexagon != this.level.exitHexagon) {
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}

	return currHexagon;
} 