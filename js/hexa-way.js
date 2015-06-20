"use strict";

window.addEventListener('DOMContentLoaded', function() {

	screen.mozlockOrientation = "landscape-secondary";

	var canvas = document.getElementById("main");
	if (!canvas) {
		alert("Impossible to get the main canvas");
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

	var width = 15;
	var height = 7;
	var mapConfig = new MapConfiguration(height, width);
	var map = mapConfig.getMap();
	var nbLines = mapConfig.getMapNbLines();
	var nbColumns = mapConfig.getMapNbColumns();
	var physicsEngine = new PhysicsEngine(map);
	var graphicsEngine = new GraphicsEngine(canvas, context, map, nbLines, nbColumns, eventHandler);
	var eventHandler = new EventHandler(canvas, width/2, height/2, physicsEngine, graphicsEngine);
	var solver = new MapSolver(map);
	console.log(solver.solve());

	graphicsEngine.beginDrawing();

});
