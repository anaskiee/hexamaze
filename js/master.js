"use strict";

function Master(game, forge, home, pixelMapper, parameters) {
	this.game = game;
	this.forge = forge;
	this.home = home;
	this.pixelMapper = pixelMapper;

	this.commands = null;
	this.events = [];

	if (parameters.mode) {
		this.module = this[parameters.mode];
	} else {
		this.module = home;
	}

	this.previousMouseMoveElement = null;
}

Master.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
	this.commands.goto_game = this.goToGame.bind(this);
	this.commands.goto_forge = this.goToForge.bind(this);
	this.commands.goto_home = this.goToHome.bind(this);
	this.commands.level = this.loadLevel.bind(this);

	this.game.setCommandsPrototypeChain(this.commands);
	this.forge.setCommandsPrototypeChain(this.commands);
	this.home.setCommandsPrototypeChain(this.commands);
};

Master.prototype.draw = function() {
	var date = Date.now();

	var eventNb = this.events.length;
	this.applyEvents();
	if (eventNb > 0 || this.module.isAnimationRunning()) {
		this.module.computeNewFrameAndDraw(date);
	}
	
	requestAnimationFrame(this.draw.bind(this));
};

Master.prototype.start = function() {
	this.module.startModule();
	this.draw();
};

// A message is destinated to a module
Master.prototype.pushMessageEvent = function(event) {
	this.module.setMessageEventReceivers(event);
	this.events.push(event);
};

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
	if (this.previousMouseMoveElement || elem) {
		this.events.push(event);
		this.previousMouseMoveElement = elem;
	}
};

Master.prototype.pushClickEvent = function(event) {
	var elem = this.pixelMapper.getElement(event.x, event.y);
	if (elem) {
		event.setReceiver(elem);
		event.setResultReceiver(this.module);
		this.events.push(event);
	}
};

Master.prototype.pushKeyboardEvent = function(event) {
	this.module.setKeyboardEventReceivers(event);
	this.events.push(event);
};

Master.prototype.applyEvents = function() {
	var event;
	while (this.events.length > 0) {
		event = this.events.shift();
		event.execute();
	}
};

// Top level functions
Master.prototype.goToHome = function() {
	this.home.startModule();
	this.module = this.home;
};

Master.prototype.goToForge = function() {
	this.forge.startModule();
	this.module = this.forge;
};

Master.prototype.goToGame = function() {
	this.game.startModule();
	this.module = this.game;
};

Master.prototype.loadLevel = function(cmdSender, cmd) {
	var levelName = cmd.split(" ")[1];
	this.game.startModule(getLevel(levelName));
	this.module = this.game;
};
