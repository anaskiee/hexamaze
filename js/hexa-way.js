"use strict";

window.addEventListener('DOMContentLoaded', function() {

	screen.mozlockOrientation = "landscape-secondary";

	var canvas = document.getElementById("main");
	if (!canvas) {
		alert("Impossible to get the main canvas");
		return;
	}

	var context = canvas.getContext("2d");
	if (!context) {
		alert("Impossible to get context of canvas");
		return;
	}

	var width = window.innerWidth;
	var height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;

	var eventHandler = new EventHandler(canvas, width/2, height/2);
	var width = 11;
	var height = 6;
	var map = new MapConfiguration(height, width);
	var nbLines = map.getMapNbLines();
	var nbColumns = map.getMapNbColumns();
	var graphicsEngine = new GraphicsEngine(canvas, context, map.getMap(), nbLines, nbColumns, eventHandler);

	graphicsEngine.beginDrawing();

});
