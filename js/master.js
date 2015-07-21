"use strict";

function Master(physicsEngine, graphicsEngine, ingameMenu, solver) {
	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.ingameMenu = ingameMenu;
	this.solver = solver;
	
	this.mainMenuDisplayed = false;
	this.gameDisplayed = true;
	this.ingameMenuDisplayed = false;

	this.events = [];
}


// +--------------------------+
// |    Drawing management    |
// +--------------------------+

Master.prototype.beginDrawing = function() {
	this.draw();
}

Master.prototype.draw = function() {
	requestAnimationFrame(this.draw.bind(this));

	var date = new Date();
	var animationRunning = this.ingameMenu.animationRunning;

	if (this.applyEvents() || animationRunning) {
		if (this.gameDisplayed) {
			this.graphicsEngine.draw();
		}
		if (this.ingameMenu) {
			// Game is drawn because menu is moving
			this.graphicsEngine.draw();
			this.ingameMenu.draw(date);
		}
	}
}


// +----------------------+
// |   States managment   |
// +----------------------+

Master.prototype.switchIngameMenuState = function() {
	this.ingameMenuDisplayed = !this.ingameMenuDisplayed;
	this.gameDisplayed = !this.gameDisplayed;
	if (this.ingameMenuDisplayed) {
		this.ingameMenu.expand(new Date());
	} else {
		this.ingameMenu.reduce(new Date());
	}
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

	var eventTarget;
	if (this.gameDisplayed) {
		eventTarget = this.graphicsEngine;
	} else if (this.ingameMenuDisplayed) {
		eventTarget = this.ingameMenu;
	} else {
		console.log("error in state managment");
		return;
	}

	while (this.events.length > 0) {
		updateNeeded = true;
		e = this.events.shift();
		switch (e.type) {
			case "M":
				eventTarget.handleCursorMove(e.x, e.y);
				break;
			case "K":
				this.applyKeyEvent(e.key);
				break;
			case "T":
				eventTarget.handleCursorMove(e.x, e.y);
				break;
			case "C":
				eventTarget.handleClick();
				break;
			case "I":
				break;
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
			this.switchIngameMenuState();
			break;

	}

	if (changed) {
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);

		this.graphicsEngine.updateDirection(this.direction);
	}
}
