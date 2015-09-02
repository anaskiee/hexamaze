"use strict";

function Forge(width, height, graphicsEngine, developerConsole, level, levelCreator, 
				commands) {
	GameMode.call(this, "Forge");
	this.width = width;
	this.height = height;

	this.graphicsEngine = graphicsEngine;
	this.developerConsole = developerConsole;
	this.level = level;
	this.levelCreator = levelCreator;
	this.commands = commands;

	// 0 -> DeveloperConsole
	// 1 -> GraphicsEngine
	this.elementsToRender = new Array(2);
}

Forge.prototype = Object.create(GameMode.prototype);
Forge.prototype.constructor = Forge;

// +---------------------+
// |   Basic functions   |
// +---------------------+
// Manage module start and stop
Forge.prototype.startModule = function() {
	this.graphicsEngine.setDrawingRect(0, 0, this.width, this.height);
	this.developerConsole.setDrawingRect(0, 19/20*this.height - 0.5, 
											this.width, this.height/20);
	this.showConsole();
	this.levelCreator.createEditingLevel(5, 8);
	this.graphicsEngine.computeGraphicsData();
	this.addElementToRender("GraphicsEngine");
}

Forge.prototype.stopModule = function() {
}

Forge.prototype.computeNewFrameAndDraw = function(date) {
	// Check if some elements doesn't need to be processed
	this.checkStateTransition();

	// Render
	for (let element of this.elementsToRender) {
		if (element) {
			element.draw(date);
		}
	}
}

// +----------------------+
// |   Events managment   |
// +----------------------+

Forge.prototype.setMessageEventReceivers = function(event) {
}

Forge.prototype.setMouseEventReceivers = function(event) {
}

Forge.prototype.setKeyboardEventReceivers = function(event) {
	if (this.elementsToRender[0] != null) {
		event.setReceiver(this.developerConsole);
		event.setResultReceiver(this);
	} else {
		event.setReceiver(null);
		event.setResultReceiver(null);
	}
}

Forge.prototype.handleCursorMove = function(x, y) {
}

Forge.prototype.handleClick = function(x, y) {
}

Forge.prototype.handleKey = function(keyCode) {
}

Forge.prototype.handleWorkerMessage = function(msg) {
}

Forge.prototype.handleEventResult = function(res) {
	var mainCommand = res.split(" ")[0];
	if (this.commands.has(mainCommand)) {
		this.commands.get(mainCommand).execute(res);
	}
}


// +----------------------+
// |   States managment   |
// +----------------------+

Forge.prototype.removeElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = null;
			break;
		case "GraphicsEngine":
			this.elementsToRender[1] = null;
			break;
	}
}

Forge.prototype.addElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = this.developerConsole;
			break;
		case "GraphicsEngine":
			this.elementsToRender[1] = this.graphicsEngine;
			break;
	}
}

Forge.prototype.checkStateTransition = function() {
	for (let element of this.elementsToRender) {
		if (element && element.active == 0) {
			this.removeElementToRender(element.name);
		}
	}
}

// +-------------------------+
// |   Top level functions   |
// +-------------------------+

Forge.prototype.hideConsole = function() {
	this.developerConsole.hide();
}

Forge.prototype.showConsole = function() {
	this.graphicsEngine.adjustDrawingRect(0, 0, 0, -this.developerConsole.maxHeight);
	this.addElementToRender("DeveloperConsole");
	this.developerConsole.show();
}