"use strict";

function Game(width, height, physicsEngine, graphicsEngine, ingameMenu, 
				developerConsole, worker, level) {
	GameMode.call(this, "Game");
	this.width = width;
	this.height = height;

	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.ingameMenu = ingameMenu;
	this.developerConsole = developerConsole;
	this.worker = worker;
	this.level = level;
	this.commands = null;

	// 0 -> DeveloperConsole
	// 1 -> GraphicsEngine
	// 2 -> IngameMenu
	this.elementsToRender = new Array(3);
}

Game.prototype = Object.create(GameMode.prototype);
Game.prototype.constructor = Game;

// +---------------------+
// |   Basic functions   |
// +---------------------+
// Manage module start and stop
Game.prototype.startModule = function() {
	this.ingameMenu.setDrawingRect(0, 0, this.width, this.height);
	this.graphicsEngine.setDrawingRect(0, 0, this.width, this.height);
	this.developerConsole.setDrawingRect(0, 19/20*this.height - 0.5, 
											this.width, this.height/20);
	this.expandMenu();
	this.showConsole();
	this.worker.postMessage("compute");
}

Game.prototype.stopModule = function() {
}

Game.prototype.computeNewFrameAndDraw = function(date) {
	// Check if some elements doesn't need to be processed
	this.checkStateTransition();

	// Render
	for (let element of this.elementsToRender) {
		if (element) {
			element.draw(date);
		}
	}
}

Game.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
	this.commands.new_level = this.computeNewMap.bind(this);
	this.commands.win = this.onWinEvent.bind(this);
}

// +----------------------+
// |   Events managment   |
// +----------------------+

Game.prototype.setMessageEventReceivers = function(event) {
	event.setReceiver(this);
	event.setResultReceiver(null);
}

Game.prototype.setMouseEventReceivers = function(event) {
	var assigned = false;
	for (var i = 2; i >= 0; i--) {
		if (this.elementsToRender[i] != null) {
			event.setReceiver(this.elementsToRender[i]);
			event.setResultReceiver(this);
			assigned = true;
			break;
		}
	}
	if (!assigned) {
		event.setReceiver(null);
		event.setResultReceiver(null);
	}
}

Game.prototype.setKeyboardEventReceivers = function(event) {
	// Catch esc
	if (event.keyCode == 27) {
		event.setReceiver(this);
		event.setResultReceiver(null);
		return;
	}

	if (this.elementsToRender[0] != null) {
		event.setReceiver(this.developerConsole);
		event.setResultReceiver(this);
	} else {
		event.setReceiver(null);
		event.setResultReceiver(null);
	}
}

Game.prototype.handleCursorMove = function(x, y) {
}

Game.prototype.handleClick = function(x, y) {
}

Game.prototype.handleKey = function(keyCode) {
	if (keyCode == 27) {
		this.expandMenu();
	}
}

Game.prototype.handleWorkerMessage = function(msg) {
	if (msg.length > 4 && msg.substr(0, 4) == "done") {
		this.loadMap(msg.substr(4));
		this.mapComputed();
	} else {
		this.updateComputingMenu(msg);
	}
}

// +----------------------+
// |   States managment   |
// +----------------------+

Game.prototype.removeElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = null;
			break;
		case "GraphicsEngine":
			this.elementsToRender[1] = null;
			break;
		case "IngameMenu":
			this.elementsToRender[2] = null;
			break;
	}
}

Game.prototype.addElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = this.developerConsole;
			break;
		case "GraphicsEngine":
			this.elementsToRender[1] = this.graphicsEngine;
			break;
		case "IngameMenu":
			this.elementsToRender[2] = this.ingameMenu;
			break;
	}
}

Game.prototype.checkStateTransition = function() {
	for (let element of this.elementsToRender) {
		if (element && element.active == 0) {
			this.removeElementToRender(element.name);
		}
	}
}

// +-------------------------+
// |   Top level functions   |
// +-------------------------+

Game.prototype.computeNewMap = function(commandLine) {
	this.removeElementToRender("GraphicsEngine");
	this.addElementToRender("IngameMenu");
	this.ingameMenu.expand(new Date());
	this.updateComputingMenu(0);
	this.worker.postMessage(commandLine);
}

Game.prototype.onWinEvent = function() {
	this.addElementToRender("IngameMenu");
	this.ingameMenu.setText("You win !");
	this.ingameMenu.expand(new Date());
}

Game.prototype.mapComputed = function() {
	this.addElementToRender("GraphicsEngine");
	setTimeout(this.reduceMenu.bind(this), 1000, true);
}

Game.prototype.loadMap = function(map) {
	this.level.clearData();
	this.level.fill(map);
	this.graphicsEngine.computeGraphicsData();
}

Game.prototype.expandMenu = function() {
	this.addElementToRender("IngameMenu");
	this.ingameMenu.expand(new Date());
}

Game.prototype.reduceMenu = function() {
	this.ingameMenu.reduce(new Date());
}

Game.prototype.displayMenu = function() {
	this.ingameMenu.setText("So many choices...");
	this.switchIngameMenuState();
}

Game.prototype.displayComputing = function() {
	this.ingameMenu.setText("Computing... (0)");
	this.switchIngameMenuState();
}

Game.prototype.updateComputingMenu = function(nbTries) {
	this.ingameMenu.setText("Computing... (" + nbTries + ")");
}

Game.prototype.hideConsole = function() {
	this.developerConsole.hide();
}

Game.prototype.showConsole = function() {
	this.graphicsEngine.adjustDrawingRect(0, 0, 0, -this.developerConsole.maxHeight);
	this.ingameMenu.adjustDrawingRect(0, 0, 0, -this.developerConsole.maxHeight);
	this.addElementToRender("DeveloperConsole");
	this.developerConsole.show();
}