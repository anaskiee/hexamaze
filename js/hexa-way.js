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

	var hexagon = new Hexagon(50);
	var hexagonPattern = hexagon.getPattern();

	canvas.width = width;
	canvas.height = height;

	draw();

	function draw() {
		requestAnimationFrame(draw);

		context.fillStyle = "#003333";
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.drawImage(hexagonPattern, 50, 50);
	}

});
