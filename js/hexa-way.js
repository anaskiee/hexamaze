"use strict";

window.addEventListener('DOMContentLoaded', function() {

	screen.mozlockOrientation = "landscape-secondary";

	// Get man canvas
	var canvas = document.getElementById("map");
	if (!canvas) {
		alert("Impossible to get the map canvas");
		return;
	}
	canvas.focus();

	var context = canvas.getContext("2d");
	if (!context) {
		alert("Impossible to get context of canvas");
		return;
	}

	var width = window.innerWidth;
	var height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;

	// Get end game menu canvas;
	var igCanvas = document.getElementById("igMenu");
	var igContext = igCanvas.getContext("2d");
	igCanvas.width = width/2;
	igCanvas.height = height/2;

	var width = 15;
	var height = 7;
	
	var difficulty = 9000;
	while (difficulty < 10 || difficulty == 9000) {
		var mapConfig = new MapConfiguration(height, width);
		var map = mapConfig.getMap();
		var solver = new MapSolver(map);
		difficulty = solver.getMin();
	}
	console.log(difficulty);
	//solver.highlightSolution();

	var nbLines = mapConfig.getMapNbLines();
	var nbColumns = mapConfig.getMapNbColumns();
	var physicsEngine = new PhysicsEngine(map);
	var graphicsEngine = new GraphicsEngine(canvas, context, map, nbLines, nbColumns, eventHandler);
	var ingameMenu = new IngameMenu(igCanvas, igContext);
	var eventHandler = new EventHandler(canvas, width/2, height/2, physicsEngine, graphicsEngine, solver);
	var displayManager = new DisplayManager(eventHandler, graphicsEngine, ingameMenu);

	displayManager.beginDrawing();

});
