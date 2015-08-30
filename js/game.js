"use strict";

function Game(width, height, physicsEngine, graphicsEngine, ingameMenu, 
				developerConsole, worker, level, commands) {
	this.width = width;
	this.height = height;

	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.ingameMenu = ingameMenu;
	this.developerConsole = developerConsole;
	this.worker = worker;
	this.level = level;
	this.commands = commands;

	// 0 -> GraphicsEngine
	// 1 -> IngameMenu
	// 2 -> DeveloperConsole
	this.elementsToRender = new Array(3);

	this.events = [];
}

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

	// Apply events
	this.applyEvents();

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

Game.prototype.push = function(event) {
	this.events.push(event);
}

Game.prototype.applyEvents = function() {
	var event;
	while (this.events.length > 0) {
		event = this.events.shift();
		event.execute();
	}
}

Game.prototype.handleCursorMove = function(x, y) {
	var action;
	if (this.ingameMenu.active) {
		action = this.ingameMenu.handleCursorMove(x, y);
		if (action) {
			this.handleAction(action);
		}
	}
	if (this.graphicsEngine.active) {
		action = this.graphicsEngine.handleCursorMove(x, y);
		if (action) {
			this.handleAction(action);
		}
	}
}

Game.prototype.handleClick = function(x, y) {
	var action;
	if (this.ingameMenu.active) {
		action = this.ingameMenu.handleClick(x, y);
		if (action) {
			this.handleAction(action);
		}
	}
	if (this.graphicsEngine.active) {
		action = this.graphicsEngine.handleClick(x, y);
		if (action) {
			this.handleAction(action);
		}
	}
}

Game.prototype.handleKey = function(keyCode) {
	var action = this.developerConsole.handleKey(keyCode);
	if (action) {
		this.handleAction(action);
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

Game.prototype.handleAction = function(action) {
	var mainCommand = action.split(" ")[0];
	if (this.commands.has(mainCommand)) {
		this.commands.get(mainCommand).execute(action);
	}
}


// +----------------------+
// |   States managment   |
// +----------------------+

Game.prototype.removeElementToRender = function(name) {
	switch (name) {
		case "GraphicsEngine":
			this.elementsToRender[0] = null;
			break;
		case "IngameMenu":
			this.elementsToRender[1] = null;
			break;
		case "DeveloperConsole":
			this.elementsToRender[2] = null;
			break;
	}
}

Game.prototype.addElementToRender = function(name) {
	switch (name) {
		case "GraphicsEngine":
			this.elementsToRender[0] = this.graphicsEngine;
			break;
		case "IngameMenu":
			this.elementsToRender[1] = this.ingameMenu;
			break;
		case "DeveloperConsole":
			this.elementsToRender[2] = this.developerConsole;
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