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

// Manage module start and stop
Game.prototype.startModule = function() {
	this.expandMenu();
	this.showConsole();
	this.worker.postMessage("compute");
}

Game.prototype.stopModule = function() {
}

// Basic functions
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

// Event managment
Game.prototype.push = function(event) {
	this.events.push(event);
}

Game.prototype.applyEvents = function() {
	var e;
	var updateNeeded = false;
	var action;

	var eventTarget;

	var elementsNumber = this.elementsToRender.length;
	while (this.events.length > 0) {
		updateNeeded = true;
		e = this.events.shift();
		for (var i = elementsNumber - 1; 0 <= i; i--) {
			eventTarget = this.elementsToRender[i];
			
			// This element is not active
			if (!eventTarget) {
				continue;
			}

			action = "";

			switch (e.type) {
				case "M":
					action = eventTarget.handleCursorMove(e.x, e.y);
					break;
				case "K":
					action = eventTarget.handleKey(e.code);
					//action = this.applyKeyEvent(e.key);
					break;
				case "T":
					action = eventTarget.handleCursorMove(e.x, e.y);
					break;
				case "C":
					action = eventTarget.handleClick(e.x, e.y);
					break;
				case "I":
					break;
				case "MG":
					this.updateComputingMenu(e.nb);
					break;
				case "MC":
					this.loadMap(e.map);
					this.mapComputed();
					break;
			}
	
			if (action) {
				var mainCommand = action.split(" ")[0];
				if (this.commands.has(mainCommand)) {
					var test = this.commands.get(mainCommand);
					this.commands.get(mainCommand).execute(action);
				}
			}

			if (eventTarget.blockEventsSpread) {
				break;
			}
		}
	}
	return updateNeeded;
}

Game.prototype.handleCursorMove = function(x, y) {
}

Game.prototype.handleClick = function(x, y) {
}

Game.prototype.handleKey = function(code) {
}

Game.prototype.handleWorkerMessage = function(msg) {
}

// Manage states
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

// Top level functions

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
	this.graphicsEngine.height -= this.developerConsole.height;
	this.addElementToRender("DeveloperConsole");
	this.developerConsole.show();
}