"use strict";

function Home(width, height, pixelMapper, developerConsole, mainMenu) {
	GameMode.call(this, "Home");
	this.width = width;
	this.height = height;
	this.mainMenu = mainMenu;

	this.pixelMapper = pixelMapper;
	this.developerConsole = developerConsole;
	this.commands = null;

	// 0 -> DeveloperConsole
	// 1 -> MainMenu
	this.elementsToRender = new Array(2);
}

Home.prototype = Object.create(GameMode.prototype);
Home.prototype.constructor = Home;

Home.prototype.startModule = function() {
	this.mainMenu.setDrawingRect(0, 0, this.width, this.height);
	this.developerConsole.setDrawingRect(0, 19/20*this.height - 0.5, 
											this.width, this.height/20);
	this.addElementToRender("MainMenu");
	this.showConsole();
}

Home.prototype.stopModule = function() {
}

Home.prototype.computeNewFrameAndDraw = function(date) {
	// Check if some elements doesn't need to be processed
	this.checkStateTransition();

	// Render
	for (var element of this.elementsToRender) {
		if (element) {
			element.draw(date);
		}
	}
}

Home.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
}

Home.prototype.setKeyboardEventReceivers = function(event) {
	if (this.elementsToRender[0] != null) {
		event.setReceiver(this.developerConsole);
		event.setResultReceiver(this);
	} else {
		event.setReceiver(null);
		event.setResultReceiver(null);
	}
}

Home.prototype.removeElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = null;
			break;
		case "MainMenu":
			this.elementsToRender[1] = null;
			break;
	}
	for (var elem of this.elementsToRender) {
		if (elem != null) {
			elem.offContextDraw();
		}
	}
}

Home.prototype.addElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = this.developerConsole;
			break;
		case "MainMenu":
			this.elementsToRender[1] = this.mainMenu;
			break;
	}
	for (var elem of this.elementsToRender) {
		if (elem != null) {
			elem.offContextDraw();
		}
	}
}

Home.prototype.checkStateTransition = function() {
	for (var element of this.elementsToRender) {
		if (element && element.active == 0) {
			this.removeElementToRender(element.name);
		}
	}
}

// +-------------------------+
// |   Top level functions   |
// +-------------------------+

Home.prototype.showConsole = function() {
	this.mainMenu.adjustDrawingRect(0, 0, 0, -this.developerConsole.maxHeight);
	this.addElementToRender("DeveloperConsole");
	this.developerConsole.show();
}
