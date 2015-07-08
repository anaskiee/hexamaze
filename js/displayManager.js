"use strict";

function DisplayManager(eventHandler, graphicsEngine, ingameMenu) {
	this.mainMenu = false;
	this.ingame = true;
	this.ingameMenu = true;

	this.eventHandler = eventHandler;
	this.graphicsEngine = graphicsEngine;
	this.ingameMenu = ingameMenu;
}

DisplayManager.prototype.beginDrawing = function() {
	this.draw();
}

DisplayManager.prototype.draw = function() {
	requestAnimationFrame(this.draw.bind(this));

	if (this.eventHandler.applyEvents()) {
		this.graphicsEngine.draw();
		this.ingameMenu.draw();
	}
}