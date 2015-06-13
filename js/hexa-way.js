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

	var map = new MapConfiguration(11, 6);
	var mapWidth = map.getMapWidth();
	var mapHeight = map.getMapHeight();
	var graphicsEngine = new GraphicsEngine(canvas, context, map.getMap(), mapWidth, mapHeight);

	graphicsEngine.beginDrawing();

});
