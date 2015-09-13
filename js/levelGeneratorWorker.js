"use strict";

importScripts("./levelCreator.js", "./levelSolver.js", "./level.js", "./hexagon.js");

onmessage = function(msg) {
	var parameters = msg.data.split(" ");
	var nbLines, nbColumns;
	if (parameters.length == 3) {
		nbLines = parseInt(parameters[1]);
		nbColumns = parseInt(parameters[2]);
	} else {
		nbLines = 9;
		nbColumns = 17;
	}
	computeNewLevel(nbLines, nbColumns);
}

function computeNewLevel(nbLines, nbColumns) {
	var difficulty = 9000;
	var nb = 0;

	var level = new Level();
	var solver = new LevelSolver(level);
	var	levelCreator = new LevelCreator(level);
	while (difficulty < 12 || difficulty == 9000) {
		nb++;
		levelCreator.createRandomLevel(nbLines, nbColumns);
		difficulty = solver.getMin();
		if (nb % 30 == 0) {
			postMessage(nb);
		}
	}

	postMessage(nb);
	postMessage("done" + level.toString());

	console.log("number of map tested : " + nb);
	console.log("difficulty : " + difficulty);
}
