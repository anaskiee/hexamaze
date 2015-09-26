"use strict";

function GameMode(name, width, height, elementsList) {
	this.name = name;
	this.width = width;
	this.height = height;

	this.elementsList = elementsList;
	this.elementsToRender = new Array(elementsList.length);

	this.commands = null;
}

GameMode.prototype.handleEventResult = function(eventReceiver, res) {
	var mainCommand = res.split(" ")[0];
	if (this.commands[mainCommand]) {
		this.commands[mainCommand](eventReceiver, res);
	}
}

// +---------------------------+
// |     Drawing managment     |
// +---------------------------+

GameMode.prototype.removeElementToRender = function(name) {
	for (var i = 0; i < this.elementsList.length; i++) {
		var element = this.elementsList[i];
		if (element.name == name) {
			this.elementsToRender[i] = null;
		}
	}

	this.eventsContextDraw();
}

GameMode.prototype.addElementToRender = function(name) {
	for (var i = 0; i < this.elementsList.length; i++) {
		var element = this.elementsList[i];
		if (element.name == name) {
			this.elementsToRender[i] = element;
		}
	}

	this.eventsContextDraw();
}

// +-----------------+
// |     Drawing     |
// +-----------------+

GameMode.prototype.computeNewFrameAndDraw = function(date) {
	// Check if some elements doesn't need to be processed
	this.checkStateTransition();

	// Render
	for (var element of this.elementsToRender) {
		if (element) {
			element.draw(date);
		}
	}
}

GameMode.prototype.checkStateTransition = function() {
	for (var element of this.elementsToRender) {
		if (element && element.active == 0) {
			this.removeElementToRender(element.name);
		}
	}
}

GameMode.prototype.eventsContextDraw = function() {
	for (var elem of this.elementsToRender) {
		if (elem != null) {
			elem.offContextDraw();
		}
	}
}
