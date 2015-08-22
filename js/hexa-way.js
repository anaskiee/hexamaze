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

	// prevent backspace key from navigating back
	document.onkeydown = function (e) {
		if (e.which === 8 && !$(e.target).is("input, textarea")) {
			e.preventDefault();
		}
	};

	new GameLoader(canvas, context);
});
