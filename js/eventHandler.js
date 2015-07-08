"use strict";

function EventHandler(canvas, initX, initY, physicsEngine, graphicsEngine, solver) {
	// Positions when event is received
	this.x = initX;
	this.y = initY;
	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	this.solver = solver;
	
	this.charX = -1;
	this.charY = -1;
	this.updateCharacterCoordinates();
	this.direction = "top";

	// A first fake event is pushed to force display
	this.events = [];
	this.events.push({type : "I"});

	canvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
	canvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
	canvas.addEventListener("keypress", this.handleKey.bind(this), false);
	canvas.addEventListener("click", this.handleClick.bind(this), false);
}

// Functions to catch events in order to apply them asynchronously
EventHandler.prototype.handleMouse = function(event) {
	this.events.push({type : "M", x : event.pageX, y : event.pageY});
}

EventHandler.prototype.handleKey = function(event) {
	this.events.push({type : "K", key : event.code});
}

EventHandler.prototype.handleTouch = function(event, isMouse) {
	this.events.push({type : "T", x : event.touches[0].pageX, y : event.touches[0].pageY});
}

EventHandler.prototype.handleClick = function(event) {
	this.events.push({type : "C"});
}

// Functions to apply events before drawing
EventHandler.prototype.applyEvents = function() {
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
			case "I":
				break;
		}
	}
	return updateNeeded;
}

EventHandler.prototype.applyKeyEvent = function(key) {
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

EventHandler.prototype.applyNewCursorPosition = function(x, y) {
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

EventHandler.prototype.applyClickEvent = function() {
	this.physicsEngine.applyMove(this.direction);
	this.updateCharacterCoordinates();
}

// Others functions
EventHandler.prototype.updateCharacterCoordinates= function() {
	var characterCoordinates = this.graphicsEngine.computeCharacterCoordinates();
	this.charX = characterCoordinates.x;
	this.charY = characterCoordinates.y;
}

EventHandler.prototype.computeDirection = function() {
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