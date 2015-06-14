"use strict";

function EventHandler(canvas, initX, initY) {
	// Positions when event is received
	this.x = initX;
	this.y = initY;

	canvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
	canvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
} 

EventHandler.prototype.handleMouse = function(event) {
	this.handleTouch(event, true);
}

EventHandler.prototype.handleTouch = function(event, isMouse) {
	if (isMouse) {
		this.x = event.pageX;
		this.y = event.pageY;
	} else {
		this.x = event.touches[0].pageX;
		this.y = event.touches[0].pageY;
	}
}
