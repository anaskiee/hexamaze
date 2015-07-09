"use strict";

function EventStack(physicsEngine, graphicsEngine, displayManager, solver) {
	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.displayManager = displayManager;
	this.solver = solver;

	this.events = [];
}

EventStack.prototype.push = function(event) {
	this.events.push(event);
}

// Functions to apply events before drawing
EventStack.prototype.applyEvents = function() {
	var e;
	var updateNeeded = false;
	while (this.events.length > 0) {
		updateNeeded = true;
		e = this.events.shift();
		switch (e.type) {
			case "M":
				this.applyNewCursorPosition(e.x, e.y);
				break;
			case "K":
				this.applyKeyEvent(e.key);
				break;
			case "T":
				this.applyNewCursorPosition(e.x, e.y);
				break;
			case "C":
				this.applyClickEvent();
				break;
			case "D":
			this.applyDragEvent();
				break;
			case "I":
				break;
		}
	}
	return updateNeeded;
}

EventStack.prototype.applyKeyEvent = function(key) {
	var changed = false;
	switch (key) {
		case "Enter":
			this.handleClick();
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

	}

	if (changed) {
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);

		this.graphicsEngine.updateDirection(this.direction);
	}
}

EventStack.prototype.applyNewCursorPosition = function(x, y) {
	this.x = x;
	this.y = y;

	var direction = this.computeDirection();
	if (direction != this.direction) {
		this.direction = direction;
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);

		this.graphicsEngine.updateDirection(this.direction);
	}
}

EventStack.prototype.applyClickEvent = function() {
	this.physicsEngine.applyMove(this.direction);
	this.updateCharacterCoordinates();
}

EventStack.prototype.applyDragEvent = function() {
}

// Others functions
EventStack.prototype.updateCharacterCoordinates= function() {
	var characterCoordinates = this.graphicsEngine.computeCharacterCoordinates();
	this.charX = characterCoordinates.x;
	this.charY = characterCoordinates.y;
}

EventStack.prototype.computeDirection = function() {
	var theta = Math.atan((this.y - this.charY) / (this.x - this.charX));
	if (this.x - this.charX < 0) {
		theta += Math.PI;
	}

	let side = (theta / (Math.PI/3) + 6) % 6 ;
	if (side < 1) {
		return "botRight";
	} else if (side < 2) {
		return "bot";
	} else if (side < 3) {
		return "botLeft";
	} else if (side < 4) {
		return "topLeft";
	} else if (side < 5) {
		return "top";
	} else {
		return "topRight";
	}
}