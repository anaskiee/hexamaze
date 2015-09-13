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

	var offCanvas = document.createElement("canvas");
	var offContext = offCanvas.getContext("2d");

	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	offCanvas.width = screenWidth;
	offCanvas.height = screenHeight;

	canvas.focus();

	new GameLoader(canvas, context, offCanvas, offContext);
});
