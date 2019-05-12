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

	this.workerCommand = null;
	this.levelSaved = "";
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
		this.levelSaved = this.decompressLevel(level);
		this.loadMap(this.decompressLevel(level));
		this.mapComputed();

	// Call the worker to generate one
	} else {
		this.workerCommand = "compute 9 17 12";
		this.worker.postMessage(this.workerCommand);
	}
};

Game.prototype.stopModule = function() {
	this.workerCommand = null;
};

Game.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
	this.commands.new_level = this.computeNewMap.bind(this);
	this.commands.win = this.onWinEvent.bind(this);
	this.commands.restart = this.restart.bind(this);
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

Game.prototype.handleKey = function(key) {
	if (key === 'Escape') {
		this.expandMenu();
	} else if (key === 'Enter') {
		this.showConsole();
	}
};

Game.prototype.handleWorkerMessage = function(msg) {
	var jsonMsg = JSON.parse(msg);
	// Check that a command is running and that we got a response
	// from the one expected
	if (this.workerCommand === jsonMsg.cmd) {
		if (jsonMsg.type === "computed") {
			this.levelSaved = jsonMsg.data;
			this.loadMap(jsonMsg.data);
			this.mapComputed();
		} else {
			this.updateComputingMenu(jsonMsg.data);
		}
	} else {
		console.log("this command response is outdated: " + jsonMsg.cmd);
	}
};

// +-------------------------+
// |   Top level functions   |
// +-------------------------+

Game.prototype.computeNewMap = function(cmdSender, commandLine) {
	this.removeElementToRender("GraphicsEngine");
	this.addElementToRender("IngameMenu");
	this.ingameMenu.expand();
	this.updateComputingMenu(0);
	if (commandLine.split(" ").length === 4) {
		this.workerCommand = commandLine;
		this.worker.postMessage(this.workerCommand);
	}
};

Game.prototype.onWinEvent = function() {
	this.addElementToRender("IngameMenu");
	this.ingameMenu.setText("You win !");
	this.ingameMenu.expand();
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
	this.ingameMenu.expand();
};	

Game.prototype.reduceMenu = function() {
	this.ingameMenu.reduce();
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

Game.prototype.restart = function() {
		this.loadMap(this.levelSaved);
		this.mapComputed();
};