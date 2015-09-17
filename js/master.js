"use strict";

function Master(game, forge, pixelMapper) {
	this.game = game;
	this.forge = forge;
	this.pixelMapper = pixelMapper;

	this.commands = null;
	this.events = [];

	var urlSplitted = document.URL.split("?");
	if (urlSplitted.length > 1) {
		this.module = this[urlSplitted[1].split("=")[1]];
	} else {
		this.module = game;
	}

	this.previousMouseMoveElement = null;
}

Master.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
	this.game.setCommandsPrototypeChain(this.commands);
	this.forge.setCommandsPrototypeChain(this.commands);
}

Master.prototype.draw = function() {
	var date = new Date();

	this.applyEvents();
	this.module.computeNewFrameAndDraw(date);
	
	requestAnimationFrame(this.draw.bind(this));
}

Master.prototype.start = function() {
	this.module.startModule();
	this.draw();
}

// A message is destinated to a module
Master.prototype.pushMessageEvent = function(event) {
	this.module.setMessageEventReceivers(event);
	this.events.push(event);
}

// Other events are destinated to a graphical elements, but only
// the module know which one
Master.prototype.pushMouseMoveEvent = function(event) {
	event.setPreviousElement(this.previousMouseMoveElement);
	
	var elem = this.pixelMapper.getElement(event.x, event.y);
	if (elem) {
		event.setReceiver(elem);
		event.setResultReceiver(this.module);
	}

	// If both are null, nothing will be triggered
	// Else, at least something will be, and previous must be updated
	if (this.previousMouseMoveElement != null || elem != null) {
		this.events.push(event);
		this.previousMouseMoveElement = elem;
	}
}

Master.prototype.pushClickEvent = function(event) {
	var elem = this.pixelMapper.getElement(event.x, event.y);
	if (elem) {
		event.setReceiver(elem);
		event.setResultReceiver(this.module);
		this.events.push(event);
	}
}

Master.prototype.pushKeyboardEvent = function(event) {
	this.module.setKeyboardEventReceivers(event);
	this.events.push(event);
}

Master.prototype.applyEvents = function() {
	var event;
	while (this.events.length > 0) {
		event = this.events.shift();
		event.execute();
	}
}
