"use strict";

function EventHandler(canvas, initX, initY, physicsEngine, graphicsEngine) {
	// Positions when event is received
	this.x = initX;
	this.y = initY;
	this.physicsEngine = physicsEngine;
	this.graphicsEngine = graphicsEngine;
	
	this.charX = -1;
	this.charY = -1;
	this.updateCharacterCoordinates();
	this.direction = "top";

	canvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
	canvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
	canvas.addEventListener("keypress", this.handleKey.bind(this), false);
	canvas.addEventListener("click", this.handleClick.bind(this), false);
} 

EventHandler.prototype.handleMouse = function(event) {
	this.handleTouch(event, true);
}

EventHandler.prototype.handleKey = function(event) {
	var changed = false;
	switch (event.code) {
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
	}

	if (changed) {
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);

		this.graphicsEngine.updateDirection(this.direction);
	}
}

EventHandler.prototype.handleTouch = function(event, isMouse) {
	if (isMouse) {
		this.x = event.pageX;
		this.y = event.pageY;
	} else {
		this.x = event.touches[0].pageX;
		this.y = event.touches[0].pageY;
	}

	var direction = this.computeDirection();
	if (direction != this.direction) {
		this.direction = direction;
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);

		this.graphicsEngine.updateDirection(this.direction);
	}
}

EventHandler.prototype.handleClick = function(event) {
	this.physicsEngine.applyMove(this.direction);
	this.updateCharacterCoordinates();
}

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