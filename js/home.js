"use strict";

function Home(width, height, pixelMapper, developerConsole, mainMenu) {
	var elemList = [developerConsole, mainMenu];
	GameMode.call(this, "Home", width, height, elemList);
	this.mainMenu = mainMenu;

	this.pixelMapper = pixelMapper;
	this.developerConsole = developerConsole;
}

Home.prototype = Object.create(GameMode.prototype);
Home.prototype.constructor = Home;

// +---------------------+
// |   Basic functions   |
// +---------------------+
Home.prototype.startModule = function() {
	this.mainMenu.setDrawingRect(0, 0, this.width, this.height);
	var devConsHeight = Math.round(this.height/20);
	this.developerConsole.setDrawingRect(0, this.height - devConsHeight, 
											this.width, devConsHeight);
	this.addElementToRender("MainMenu");
}

Home.prototype.stopModule = function() {
}

Home.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
}


// +----------------------+
// |   Events managment   |
// +----------------------+
Home.prototype.setKeyboardEventReceivers = function(event) {
	var consoleVisible = this.elementsToRender[0] != null;
	if (consoleVisible) {
		event.setReceiver(this.developerConsole);
		event.setResultReceiver(this);
	} else {
		event.setReceiver(this);
	}
}

Home.prototype.handleKey = function(keyCode) {
	if (keyCode == 13) {
		this.showConsole();
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

Home.prototype.hideConsole = function() {
	this.mainMenu.adjustDrawingRect(0, 0, 0, this.developerConsole.maxHeight);
	this.removeElementToRender("DeveloperConsole");
	this.developerConsole.hide();
}
