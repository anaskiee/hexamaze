"use strict";

importScripts("./levelCreator.js", "./levelSolver.js", "./level.js", "./hexagon.js");

onmessage = function(msg) {
	var command = msg.data;
	var parameters = command.split(" ");
	if (parameters.length !== 4) {
		console.log("invalid worker command: " + msg);
	}
	var nbLines = parseInt(parameters[1]);
	var nbColumns = parseInt(parameters[2]);
	var difficulty = parseInt(parameters[3]);
	computeNewLevel(nbLines, nbColumns, difficulty, command);
};

function computeNewLevel(nbLines, nbColumns, difficultyMin, command) {
	var difficulty = 9000;
	var nb = 0;
	var msg = {
		type: "computing", 
		data: "",
		cmd: command
	};

	var level = new Level();
	var solver = new LevelSolver(level);
	var	levelCreator = new LevelCreator(level);
	while (difficulty < difficultyMin || difficulty === 9000) {
		nb++;
		levelCreator.createRandomLevel(nbLines, nbColumns);
		difficulty = solver.getMin();
		if (nb % 30 === 0) {
			msg.data = nb;
			postMessage(JSON.stringify(msg));
		}
	}

	msg.data = nb;
	postMessage(JSON.stringify(msg));
	
	msg.type = "computed";
	msg.data = level.toString();
	postMessage(JSON.stringify(msg));

	console.log("number of map tested : " + nb);
	console.log("difficulty : " + difficulty);
}
