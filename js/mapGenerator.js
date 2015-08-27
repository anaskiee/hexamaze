"use strict";

importScripts("./mapCreator.js", "./mapSolver.js", "./mapStructures.js", "./hexagon.js");

onmessage = function(msg) {
	var parameters = msg.data.split(" ");
	var nbLines, nbColumns;
	if (parameters.length == 3) {
		nbLines = parseInt(parameters[1]);
		nbColumns = parseInt(parameters[2]);
	} else {
		nbLines = 7;
		nbColumns = 15;
	}
	computeNewMap(nbLines, nbColumns);
}

function computeNewMap(nbLines, nbColumns) {
	var difficulty = 9000;
	var nb = 0;

	var height = nbLines;
	var width = nbColumns;

	var mapStructures = new MapStructures();
	var solver = new MapSolver(mapStructures.hexagons);
	var mapConfig;
	while (difficulty < 5 || difficulty == 9000) {
		nb++;
		mapConfig = new MapCreator(mapStructures, height, width);
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
