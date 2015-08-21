"use strict";

function Master(canvas, physicsEngine, graphicsEngine, ingameMenu, worker, mapStructure, developerConsole) {
	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.ingameMenu = ingameMenu;
	this.worker = worker;
	this.mapStructure = mapStructure;
	this.developerConsole = developerConsole;
	this.width = canvas.width;
	this.height = canvas.height;
	
	// 0 -> GraphicsEngine
	// 1 -> IngameMenu
	// 2 -> DeveloperConsole
	this.elementsToRender = new Array(3);
	this.commands = new Map();
	this.initializeCommandsBinding();

	this.events = [];
	this.mapDrawAllowed = false;
}

// +--------------------------+
// |    Drawing management    |
// +--------------------------+

Master.prototype.stopDrawing = function() {
	this.mapDrawAllowed = false;
	this.expandMenu();
}

Master.prototype.beginDrawing = function() {
	this.mapDrawAllowed = true;
	this.switchIngameMenuState();
}

Master.prototype.draw = function() {
	requestAnimationFrame(this.draw.bind(this));
	var date = new Date();

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

Master.prototype.manualDraw = function() {
	var date = new Date();
	// Render
	for (let element of this.elementsToRender) {
		if (element) {
			element.draw(date);
		}
	}
}

// +----------------------+
// |   States managment   |
// +----------------------+

Master.prototype.start = function() {
	this.expandMenu();
	this.showConsole();
	this.worker.postMessage("compute");
	this.draw();
}

Master.prototype.removeElementToRender = function(name) {
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

Master.prototype.addElementToRender = function(name) {
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

Master.prototype.mapComputed = function() {
	this.addElementToRender("GraphicsEngine");
	//this.elementsToRender.unshift(this.graphicsEngine);
	setTimeout(this.reduceMenu.bind(this), 1000, true);
}

Master.prototype.loadMap = function(map) {
	this.mapStructure.initializeData();
	this.mapStructure.fill(map);
	this.physicsEngine.computePhysicsData();
	this.graphicsEngine.computeGraphicsData();
}

Master.prototype.checkStateTransition = function() {
	for (let element of this.elementsToRender) {
		if (element && element.active == 0) {
			this.removeElementToRender(element.name);
			/*let idx = this.elementsToRender.indexOf(element);
			if (idx > -1) {
				this.elementsToRender.splice(idx, 1);
			} else {
				console.log("error : element not found");
			}*/
		}
	}
}

/*Master.prototype.switchIngameMenuState = function() {
	if (this.elementsToRender.indexOf(this.ingameMenu) == -1) {
		this.expandMenu();
	} else {
		this.reduceMenu();
	}
}*/

Master.prototype.expandMenu = function() {
	//this.elementsToRender.push(this.ingameMenu);
	this.addElementToRender("IngameMenu");
	this.ingameMenu.expand(new Date());
}

Master.prototype.reduceMenu = function() {
	this.ingameMenu.reduce(new Date());
}

Master.prototype.displayMenu = function() {
	this.ingameMenu.setText("So many choices...");
	this.switchIngameMenuState();
}

Master.prototype.displayWin = function() {
	this.ingameMenu.setText("You win !");
	this.switchIngameMenuState();
}

Master.prototype.displayComputing = function() {
	this.ingameMenu.setText("Computing... (0)");
	this.switchIngameMenuState();
}

Master.prototype.updateComputingMenu = function(nbTries) {
	this.ingameMenu.setText("Computing... (" + nbTries + ")");
}

Master.prototype.hideConsole = function() {
	this.developerConsole.hide();
}

// +----------------------+
// |   Events managment   |
// +----------------------+

Master.prototype.push = function(event) {
	this.events.push(event);
}

// Functions to apply events before drawing
Master.prototype.applyEvents = function() {
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
					this.commands.get(mainCommand)(action);
				}
			}

			if (eventTarget.blockEventsSpread) {
				break;
			}
		}
	}
	return updateNeeded;
}

Master.prototype.initializeCommandsBinding = function() {
	this.commands.set("new_map", this.randomMap.bind(this));
	this.commands.set("win", this.win.bind(this));
	this.commands.set("help", this.help.bind(this));
}

Master.prototype.randomMap = function(commandLine) {
	this.removeElementToRender("GraphicsEngine");
	this.addElementToRender("IngameMenu");
	this.ingameMenu.expand(new Date());
	this.updateComputingMenu(0);
	this.worker.postMessage(commandLine);
}

Master.prototype.win = function() {
	this.addElementToRender("IngameMenu");
	this.ingameMenu.setText("You win !");
	this.ingameMenu.expand(new Date());
}

Master.prototype.help = function() {
	var help = "list of available commands : \n";
	for (var commandName of this.commands.keys()) {
		help += commandName + "\n"
	}
	alert(help);
}

Master.prototype.showConsole = function() {
	this.graphicsEngine.height -= this.developerConsole.height;
	this.addElementToRender("DeveloperConsole");
	this.developerConsole.show();
}


/*Master.prototype.applyKeyEvent = function(key) {
	var changed = false;
	switch (key) {
		case "Enter":
			this.applyClickEvent();
			break;
		case "KeyQ":
			this.direction = "topLeft";
			changed = true;
			break;
		case "KeyW":
			this.direction = "top";
			changed = true;
			break;
		case "KeyE":
			this.direction = "topRight";
			changed = true;
			break;
		case "KeyA":
			this.direction = "botLeft";
			changed = true;
			break;
		case "KeyS":
			this.direction = "bot";
			changed = true;
			break;
		case "KeyD":
			this.direction = "botRight";
			changed = true;
			break;
		case "KeyH":
			this.solver.highlightSolution();
			break;
		case "KeyC":
			this.physicsEngine.cleanHighlight();
			break;
		case "Escape":
			this.displayMenu();
			break;
	}

	if (changed) {
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);

		this.graphicsEngine.updateDirection(this.direction);
	}
}*/
