"use strict";

function GameMode(name, width, height, elementsList) {
	this.name = name;
	this.width = width;
	this.height = height;

	this.elementsList = elementsList;
	this.elementsToRender = new Array(elementsList.length).fill(null);

	this.commands = null;
}

GameMode.prototype.handleEventResult = function(eventReceiver, res) {
	if (eventReceiver.name === "DeveloperConsole") {
		this.hideConsole();
	}
	
	var mainCommand = res.split(" ")[0];
	if (this.commands[mainCommand]) {
		this.commands[mainCommand](eventReceiver, res);
	}
};

// +---------------------------+
// |     Drawing managment     |
// +---------------------------+

GameMode.prototype.removeElementToRender = function(name) {
	for (var i = 0; i < this.elementsList.length; i++) {
		var element = this.elementsList[i];
		if (element.name === name) {
			this.elementsToRender[i] = null;
		}
	}

	this.eventsContextDraw();
};

GameMode.prototype.addElementToRender = function(name) {
	for (var i = 0; i < this.elementsList.length; i++) {
		var element = this.elementsList[i];
		if (element.name === name) {
			this.elementsToRender[i] = element;
		}
	}

	this.eventsContextDraw();
};

// +-----------------+
// |     Drawing     |
// +-----------------+

GameMode.prototype.computeNewFrameAndDraw = function(date) {
	// Render
	for (var element of this.elementsToRender) {
		if (element) {
			element.draw(date);
		}
	}

	// Check if some elements doesn't need to be processed
	this.checkStateTransition();
};

GameMode.prototype.checkStateTransition = function() {
	for (var element of this.elementsToRender) {
		if (element && element.active === false) {
			this.removeElementToRender(element.name);
		}
	}
};

GameMode.prototype.eventsContextDraw = function() {
	for (var elem of this.elementsToRender) {
		if (elem !== null) {
			elem.offContextDraw();
		}
	}
};

GameMode.prototype.decompressLevel = function(level) {
	var res = LZString.decompressFromEncodedURIComponent(level);
	if (!res) {
		res = level;
	}
	return res;
};

GameMode.prototype.isAnimationRunning = function() {
	for (var elem of this.elementsToRender) {
		if (elem && elem.animationRunning) {
			return true;
		}
	}
	return false;
};
