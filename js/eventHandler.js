"use strict";

function EventHandler(gameCanvas, initX, initY, igMenuCanvas, eventStack) {
	// Positions when event is received
	this.x = initX;
	this.y = initY;
	this.eventStack = eventStack;

	this.charX = -1;
	this.charY = -1;
	eventStack.updateCharacterCoordinates();
	this.direction = "top";

	// A first fake event is pushed to force display
	this.events = [];
	this.eventStack.push({type : "I"});

	gameCanvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
	gameCanvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
	gameCanvas.addEventListener("keypress", this.handleKey.bind(this), false);
	gameCanvas.addEventListener("click", this.handleClick.bind(this), false);

	igMenuCanvas.addEventListener("dragstart", this.handleDrag.bind(this), false);
}

// Functions to catch events in order to apply them asynchronously
EventHandler.prototype.handleMouse = function(event) {
	this.eventStack.push({type : "M", x : event.pageX, y : event.pageY});
}

EventHandler.prototype.handleKey = function(event) {
	this.eventStack.push({type : "K", key : event.code});
}

EventHandler.prototype.handleTouch = function(event, isMouse) {
	this.eventStack.push({type : "T", x : event.touches[0].pageX, y : event.touches[0].pageY});
}

EventHandler.prototype.handleClick = function(event) {
	this.eventStack.push({type : "C"});
}

EventHandler.prototype.handleDrag = function(event) {
	this.eventStack.push({type : "D"});
}
