"use strict";

function LevelSolver(level) {
	this.level = level;
	this.solution = null;
}

LevelSolver.prototype.getMin = function() {
	this.solve();

	if (this.solution == "undefined") {
		return 9000;
	}
	var exitHexagon = this.level.exitHexagon;
	return this.solution.get(exitHexagon).depth;
}

LevelSolver.prototype.highlightSolution = function() {
	if (this.solution == "undefined") {
		// no solution
		return;
	}
	var exitHexagon = this.level.exitHexagon;

	var currHexagon = exitHexagon;
	var nextHexagon, direction;
	while (currHexagon != this.level.characterHexagon) {
		nextHexagon = this.solution.get(currHexagon)
		nextHexagon = nextHexagon.prevHexagon;
		direction = this.solution.get(currHexagon).direction;
		while (currHexagon != nextHexagon) {
			currHexagon.isPreselected = true;
			currHexagon = currHexagon[direction];
		}
	} 
}

LevelSolver.prototype.solve = function() {
	var characterHexagon = this.level.characterHexagon;
	var exitHexagon = this.level.exitHexagon;
	if (characterHexagon == null || exitHexagon == null) {
		return "undefined";
	}

	var directions = ["top", "topLeft", "topRight", "bot", "botRight", "botLeft"];
	var toExplore = [characterHexagon];
	this.solution = new Map();
	this.solution.set(characterHexagon, {prevHexagon : null, depth : 0, direction : ""});
	while (toExplore.length > 0) {
		var hexagon = toExplore.shift();
		var depth = this.solution.get(hexagon).depth;
		for (var direction of directions) {
			var oppositeDirection = directions[(directions.indexOf(direction) + 3) % 6];
			var nextHexagon = this.computeNextHexagon(hexagon, direction);
			if (!this.solution.has(nextHexagon)) {
				this.solution.set(nextHexagon, {prevHexagon : hexagon, depth : depth + 1, 
											direction : oppositeDirection});
				if (nextHexagon == this.level.exitHexagon) {
					return this.solution;
				}
				toExplore.push(nextHexagon);
			}
		}
	}
	this.solution = "undefined";
}

LevelSolver.prototype.computeShortestPaths = function() {
	var characterHexagon = this.level.characterHexagon;
	var exitHexagon = this.level.exitHexagon;
	if (characterHexagon == null || exitHexagon == null) {
		return "undefined";
	}
	if (characterHexagon == exitHexagon) {
		return {length: 0, nb: 1};
	}

	var directions = ["top", "topLeft", "topRight", "bot", "botRight", "botLeft"];
	var toExplore = [characterHexagon];
	this.depths = new Map();
	var shortestPathNumber = 0;
	var minDepth = -1;
	this.depths.set(characterHexagon, 0);
	
	while (toExplore.length > 0) {
		var hexagon = toExplore.shift();
		var depth = this.depths.get(hexagon);
		
		// All shortest paths found
		if (shortestPathNumber > 0 && depth > minDepth + 1) {
			continue;
		}

		for (var direction of directions) {
			var nextHexagon = this.computeNextHexagon(hexagon, direction);

			// We push the hexagons already seen at the same depth
			// nb : some computations are not necessary, we could just store a weight
			if (!this.depths.has(nextHexagon) 
				|| this.depths.get(nextHexagon) == depth + 1) {
				this.depths.set(nextHexagon, depth + 1);
				if (nextHexagon == exitHexagon) {
					if (shortestPathNumber == 0) {
						minDepth = depth + 1;
					}
					shortestPathNumber++;
				}
				toExplore.push(nextHexagon);
			}
		}
	}

	if (shortestPathNumber > 0) {
		return {length: minDepth, nb: shortestPathNumber};
	} else {
		return {length: "undefined", nb: "undefined"};
	}
}

LevelSolver.prototype.computeNextHexagon = function(hexagon, direction) {
	var currHexagon = hexagon;
	var nextHexagon = currHexagon[direction];
	while (nextHexagon != null && nextHexagon.type == "space" && currHexagon != this.level.exitHexagon) {
		currHexagon = nextHexagon;
		nextHexagon = nextHexagon[direction];
	}

	return currHexagon;
}

LevelSolver.prototype.cleanMap = function() {
	for (var hexagon of this.level.hexagons) {
		hexagon.isPreselected = false;
	}
}
