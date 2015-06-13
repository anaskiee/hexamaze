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

	var map = new Map(10, 6);
	var mapWidth = map.getMapWidth();
	var mapHeight = map.getMapHeight();
	var graphicsEngine = new GraphicsEngine(canvas, context, map.getMap(), mapWidth, mapHeight);

	graphicsEngine.beginDrawing();

	var hexagonPatterns = new HexagonPatterns(50);
	var hexagonPattern = hexagonPatterns.getPattern();


	//draw();

	function draw() {
		requestAnimationFrame(draw);

		context.fillStyle = "#003333";
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.drawImage(hexagonPattern, 50, 50);
	}

});
