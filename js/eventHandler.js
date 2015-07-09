"use strict";

function EventHandler(gameCanvas, initX, initY, igMenuCanvas, master) {
	// Positions when event is received
	this.x = initX;
	this.y = initY;
	this.master = master;

	this.charX = -1;
	this.charY = -1;
	master.updateCharacterCoordinates();
	this.direction = "top";

	// A first fake event is pushed to force display
	this.events = [];
	this.master.push({type : "I"});

	gameCanvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
	gameCanvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
	gameCanvas.addEventListener("keypress", this.handleKey.bind(this), false);
	gameCanvas.addEventListener("click", this.handleClick.bind(this), false);

	igMenuCanvas.addEventListener("dragstart", this.handleDrag.bind(this), false);
}

// Functions to catch events in order to apply them asynchronously
EventHandler.prototype.handleMouse = function(event) {
	this.master.push({type : "M", x : event.pageX, y : event.pageY});
}

EventHandler.prototype.handleKey = function(event) {
	this.master.push({type : "K", key : event.code});
}

EventHandler.prototype.handleTouch = function(event, isMouse) {
	this.master.push({type : "T", x : event.touches[0].pageX, y : event.touches[0].pageY});
}

EventHandler.prototype.handleClick = function(event) {
	this.master.push({type : "C"});
}

EventHandler.prototype.handleDrag = function(event) {
	this.master.push({type : "D"});
}
