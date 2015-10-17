"use strict";

function Game(width, height, physicsEngine, graphicsEngine, ingameMenu, 
				developerConsole, worker, level) {
	var elemList = [developerConsole, graphicsEngine, ingameMenu];
	GameMode.call(this, "Game", width, height, elemList);

	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.ingameMenu = ingameMenu;
	this.developerConsole = developerConsole;
	this.worker = worker;
	this.level = level;
}

Game.prototype = Object.create(GameMode.prototype);
Game.prototype.constructor = Game;

// +---------------------+
// |   Basic functions   |
// +---------------------+
// Manage module start and stop
Game.prototype.startModule = function(level) {
	this.ingameMenu.setDrawingRect(0, 0, this.width, this.height);
	this.graphicsEngine.setDrawingRect(0, 0, this.width, this.height);
	var devConsHeight = Math.round(this.height/20);
	this.developerConsole.setDrawingRect(0, this.height - devConsHeight, 
											this.width, devConsHeight);
	this.graphicsEngine.setEventMode("game");
	this.expandMenu();
	
	// Load this one
	if (level) {
		this.loadMap(this.decompressLevel(level));
		this.mapComputed();

	// Call the worker to generate one
	} else {
		this.worker.postMessage("compute");
	}
};

Game.prototype.stopModule = function() {
};

Game.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
	this.commands.new_level = this.computeNewMap.bind(this);
	this.commands.win = this.onWinEvent.bind(this);
};

// +----------------------+
// |   Events managment   |
// +----------------------+

Game.prototype.setMessageEventReceivers = function(event) {
	event.setReceiver(this);
	event.setResultReceiver(null);
};

Game.prototype.setKeyboardEventReceivers = function(event) {
	// Catch esc
	if (event.keyCode === 27) {
		event.setReceiver(this);
		event.setResultReceiver(null);
		return;
	}

	var consoleVisible = this.elementsToRender[0] !== null;
	if (consoleVisible) {
		event.setReceiver(this.developerConsole);
		event.setResultReceiver(this);
	} else {
		event.setReceiver(this);
	}
};

Game.prototype.handleKey = function(keyCode) {
	if (keyCode === 27) {
		this.expandMenu();
	} else if (keyCode === 13) {
		this.showConsole();
	}
};

Game.prototype.handleWorkerMessage = function(msg) {
	if (msg.length > 4 && msg.substr(0, 4) === "done") {
		this.loadMap(msg.substr(4));
		this.mapComputed();
	} else {
		this.updateComputingMenu(msg);
	}
};

// +-------------------------+
// |   Top level functions   |
// +-------------------------+

Game.prototype.computeNewMap = function(cmdSender, commandLine) {
	this.removeElementToRender("GraphicsEngine");
	this.addElementToRender("IngameMenu");
	this.ingameMenu.expand(Date.now());
	this.updateComputingMenu(0);
	this.worker.postMessage(commandLine);
};

Game.prototype.onWinEvent = function() {
	this.addElementToRender("IngameMenu");
	this.ingameMenu.setText("You win !");
	this.ingameMenu.expand(Date.now());
};

Game.prototype.mapComputed = function() {
	this.addElementToRender("GraphicsEngine");
	setTimeout(this.reduceMenu.bind(this), 1000, true);
};

Game.prototype.loadMap = function(map) {
	this.level.clearData();
	this.level.fill(map);
	this.graphicsEngine.computeGraphicsData();
};

Game.prototype.expandMenu = function() {
	this.addElementToRender("IngameMenu");
	this.ingameMenu.expand(Date.now());
};	

Game.prototype.reduceMenu = function() {
	this.ingameMenu.reduce(Date.now());
};

Game.prototype.displayMenu = function() {
	this.ingameMenu.setText("So many choices...");
	this.switchIngameMenuState();
};

Game.prototype.displayComputing = function() {
	this.ingameMenu.setText("Computing... (0)");
	this.switchIngameMenuState();
};

Game.prototype.updateComputingMenu = function(nbTries) {
	var text = "Computing a random level\n";
	text += "Too easy map rejected:\n";
	text += nbTries;
	this.ingameMenu.setText(text);
};

Game.prototype.showConsole = function() {
	this.graphicsEngine.adjustDrawingRect(0, 0, 0, -this.developerConsole.maxHeight);
	this.ingameMenu.adjustDrawingRect(0, 0, 0, -this.developerConsole.maxHeight);
	this.addElementToRender("DeveloperConsole");
	this.developerConsole.show();
};

Game.prototype.hideConsole = function() {
	this.graphicsEngine.adjustDrawingRect(0, 0, 0, this.developerConsole.maxHeight);
	this.ingameMenu.adjustDrawingRect(0, 0, 0, this.developerConsole.maxHeight);
	this.removeElementToRender("DeveloperConsole");
	this.developerConsole.hide();
};
