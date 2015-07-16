"use strict";

window.addEventListener('DOMContentLoaded', function() {

	screen.mozlockOrientation = "landscape-secondary";

	// Get man canvas
	var canvas = document.getElementById("map");
	if (!canvas) {
		alert("Impossible to get the map canvas");
		return;
	}

	var context = canvas.getContext("2d");
	if (!context) {
		alert("Impossible to get context of canvas");
		return;
	}

	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	canvas.width = screenWidth;
	canvas.height = screenHeight;

	canvas.focus();

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
	var ingameMenu = new IngameMenu(canvas, context, screenWidth, screenHeight);
	var master = new Master(physicsEngine, graphicsEngine, ingameMenu, solver);
	var eventHandler = new EventHandler(canvas, screenWidth/2, screenHeight/2, master);

	master.beginDrawing();

});
