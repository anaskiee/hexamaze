"use strict";

function Forge(width, height, graphicsEngine, developerConsole, level, levelCreator) {
	GameMode.call(this, "Forge");
	this.width = width;
	this.height = height;

	this.graphicsEngine = graphicsEngine;
	this.developerConsole = developerConsole;
	this.level = level;
	this.levelCreator = levelCreator;
	this.commands = null;

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
	this.levelCreator.createEditingLevel(4, 4);
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

Forge.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
	this.commands.add_line_first = this.addLineFirst.bind(this);
	this.commands.add_line_last = this.addLineLast.bind(this);
	this.commands.add_column_first = this.addColumnFirst.bind(this);
	this.commands.add_column_last = this.addColumnLast.bind(this);
	this.commands.rm_first_line = this.removeFirstLine.bind(this);
	this.commands.rm_last_line = this.removeLastLine.bind(this);
	this.commands.rm_first_column = this.removeFirstColumn.bind(this);
	this.commands.rm_last_column = this.removeLastColumn.bind(this);
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

Forge.prototype.editLevel = function(operation) {
	this.removeElementToRender("GraphicsEngine");
	operation();
	this.graphicsEngine.computeGraphicsData();
	this.addElementToRender("GraphicsEngine");
}

Forge.prototype.addLineFirst = function() {
	this.editLevel(this.levelCreator.addLineFirst.bind(this.levelCreator));
}

Forge.prototype.addLineLast = function() {
	this.editLevel(this.levelCreator.addLineLast.bind(this.levelCreator));
}

Forge.prototype.addColumnFirst = function() {
	this.editLevel(this.levelCreator.addColumnFirst.bind(this.levelCreator));
}

Forge.prototype.addColumnLast = function() {
	this.editLevel(this.levelCreator.addColumnLast.bind(this.levelCreator));
}

Forge.prototype.removeFirstLine = function() {
	this.editLevel(this.levelCreator.removeFirstLine.bind(this.levelCreator));
}

Forge.prototype.removeLastLine = function() {
	this.editLevel(this.levelCreator.removeLastLine.bind(this.levelCreator));
}

Forge.prototype.removeFirstColumn = function() {
	this.editLevel(this.levelCreator.removeFirstColumn.bind(this.levelCreator));
}

Forge.prototype.removeLastColumn = function() {
	this.editLevel(this.levelCreator.removeLastColumn.bind(this.levelCreator));
}