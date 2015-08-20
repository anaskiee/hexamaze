"use strict";

function Master(physicsEngine, graphicsEngine, ingameMenu, solver, gameLoader, worker, mapStructure, developerConsole) {
	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.ingameMenu = ingameMenu;
	this.solver = solver;
	this.gameLoader = gameLoader;
	this.worker = worker;
	this.mapStructure = mapStructure;
	this.developerConsole = developerConsole;
	
	//this.mainMenuDisplayed = false;
	this.gameDisplayed = true;
	this.ingameMenuDisplayed = false;
	this.elementsToRender = [];

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

	// Check if some elements doesn't need to be processed
	this.checkStateTransition();

	var date = new Date();
	//var animationRunning = this.ingameMenu.animationRunning || this.state == "computing";

	// Apply events
	this.applyEvents();

	// Render
	for (let element of this.elementsToRender) {
		element.draw(date);
	}
/*	if (this.applyEvents() || animationRunning) {
		if (this.mapDrawAllowed) {
			this.graphicsEngine.draw();
		}
		this.ingameMenu.draw(date);
	}*/
}

Master.prototype.manualDraw = function() {
	var date = new Date();
	// Render
	for (let element of this.elementsToRender) {
		element.draw(date);
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

Master.prototype.mapComputed = function() {
	this.elementsToRender.unshift(this.graphicsEngine);
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
		if (element.active == 0) {
			let idx = this.elementsToRender.indexOf(element);
			if (idx > -1) {
				this.elementsToRender.splice(idx, 1);
			} else {
				console.log("error : element not found");
			}
		}
	}
}

Master.prototype.switchIngameMenuState = function() {
	if (this.elementsToRender.indexOf(this.ingameMenu) == -1) {
		this.expandMenu();
	} else {
		this.reduceMenu();
	}
}

Master.prototype.expandMenu = function() {
	this.elementsToRender.push(this.ingameMenu);
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

Master.prototype.showConsole = function() {
	this.elementsToRender.push(this.developerConsole);
	this.developerConsole.show();
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
					console.log(e.nb);
					this.updateComputingMenu(e.nb);
					break;
				case "MC":
					this.loadMap(e.map);
					this.mapComputed();
					break;
			}
	
			switch (action) {
				case "newgame":
					this.elementsToRender.shift();
					this.updateComputingMenu(0);
					this.worker.postMessage("compute");
					break;
				case "win":
					this.displayWin();
					break;
			}

			if (eventTarget.blockEventsSpread) {
				break;
			}
		}
	}
	return updateNeeded;
}

Master.prototype.applyKeyEvent = function(key) {
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
}
