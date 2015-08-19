"use strict";

importScripts("./mapConfiguration.js", "./mapSolver.js", "./mapStructures.js", "./hexagon.js");

onmessage = function(msg) {
	computeNewMap();
}

function computeNewMap() {
	var difficulty = 9000;
	var nb = 0;

	var height = 7;
	var width = 15;

	var mapStructures = new MapStructures();
	var solver = new MapSolver(mapStructures.hexagons);
	var mapConfig;
	while (difficulty < 10 || difficulty == 9000) {
		nb++;
		mapConfig = new MapConfiguration(mapStructures, height, width);
		difficulty = solver.getMin();
		if (nb % 30 == 0) {
			postMessage(nb);
		}
	}

	postMessage(nb);
	postMessage("done" + mapStructures.toString());

	console.log("number of map tested : " + nb);
	console.log("difficulty : " + difficulty);
}
