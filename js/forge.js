"use strict";

function Forge(width, height, pixelMapper, graphicsEngine, developerConsole, level, 
				levelCreator, forgeGUI) {
	GameMode.call(this, "Forge");
	this.width = width;
	this.height = height;

	this.pixelMapper = pixelMapper;
	this.graphicsEngine = graphicsEngine;
	this.developerConsole = developerConsole;
	this.level = level;
	this.levelCreator = levelCreator;
	this.forgeGUI = forgeGUI;
	this.commands = null;

	// 0 -> DeveloperConsole
	// 1 -> ForgeGUI
	// 2 -> GraphicsEngine
	this.elementsToRender = new Array(3);

	this.forgeGuiWidth = -1;
	this.forgeGuiHeight = -1;

	this.selection = null;
	this.buttonSelected = null;
	// Two modes availabe : test and edit
	this.mode = "edit";
}

Forge.prototype = Object.create(GameMode.prototype);
Forge.prototype.constructor = Forge;

// +---------------------+
// |   Basic functions   |
// +---------------------+
// Manage module start and stop
Forge.prototype.startModule = function() {
	this.forgeGuiWidth = this.width;
	this.forgeGuiHeight = this.height;
	this.graphicsEngine.setEventMode("forge");
	this.forgeGUI.setDrawingRect(0, 0, this.width, this.height);
	this.setGraphicsEngineDrawingRect();
	var devConsHeight = Math.round(this.height/20);
	this.developerConsole.setDrawingRect(0, this.height - devConsHeight, 
											this.width, devConsHeight);
	this.showConsole();
	this.levelCreator.createEditingLevel(4, 4);
	this.graphicsEngine.computeGraphicsData();
	this.addElementToRender("ForgeGUI");
	this.addElementToRender("GraphicsEngine");
}

Forge.prototype.setGraphicsEngineDrawingRect = function() {
	var x = Math.round(2/8*this.forgeGuiWidth);
	var y = Math.round(1/8*this.forgeGuiHeight);
	var width = Math.round(5/8*this.forgeGuiWidth);
	var height = Math.round(6/8*this.forgeGuiHeight);
	this.graphicsEngine.setDrawingRect(x, y, width, height);
	this.forgeGUI.setRendererRect(x, y, width, height);
}

Forge.prototype.stopModule = function() {
}

Forge.prototype.computeNewFrameAndDraw = function(date) {
	// Check if some elements doesn't need to be processed
	this.checkStateTransition();

	// Render
	for (var element of this.elementsToRender) {
		if (element) {
			element.draw(date);
		}
	}
}

Forge.prototype.setCommandsPrototypeChain = function(commands) {
	this.commands = Object.create(commands);
	this.commands.add_line_first = this.addLineFirst.bind(this);
	this.commands.add_line_last = this.addLineLast.bind(this);
	this.commands.add_column_first = this.addColumnFirst.bind(this);
	this.commands.add_column_last = this.addColumnLast.bind(this);
	this.commands.rm_first_line = this.removeFirstLine.bind(this);
	this.commands.rm_last_line = this.removeLastLine.bind(this);
	this.commands.rm_first_column = this.removeFirstColumn.bind(this);
	this.commands.rm_last_column = this.removeLastColumn.bind(this);
	this.commands.test_it = this.onTestItClick.bind(this);
	this.commands.import = this.import.bind(this);
	this.commands.export = this.export.bind(this);
	this.commands.select_empty_hexagon = this.onEmptyHexagonSelected.bind(this);
	this.commands.select_full_hexagon = this.onFullHexagonSelected.bind(this);
	this.commands.select_void_hexagon = this.onVoidHexagonSelect.bind(this);
	this.commands.select_character = this.onCharacterSelect.bind(this);
	this.commands.select_exit = this.onExitSelect.bind(this);
	this.commands.click_on_hexagon = this.onHexagonClick.bind(this);
}

// +----------------------+
// |   Events managment   |
// +----------------------+

Forge.prototype.setMessageEventReceivers = function(event) {
}

Forge.prototype.setKeyboardEventReceivers = function(event) {
	if (this.elementsToRender[0] != null) {
		event.setReceiver(this.developerConsole);
		event.setResultReceiver(this);
	} else {
		event.setReceiver(null);
		event.setResultReceiver(null);
	}
}

Forge.prototype.handleKey = function(keyCode) {
}

Forge.prototype.handleWorkerMessage = function(msg) {
}

// +----------------------+
// |   States managment   |
// +----------------------+

Forge.prototype.removeElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = null;
			break;
		case "ForgeGUI":
			this.elementsToRender[1] = null;
			break;
		case "GraphicsEngine":
			this.elementsToRender[2] = null;
			break;
	}
	for (var elem of this.elementsToRender) {
		if (elem != null) {
			elem.offContextDraw();
		}
	}
}

Forge.prototype.addElementToRender = function(name) {
	switch (name) {
		case "DeveloperConsole":
			this.elementsToRender[0] = this.developerConsole;
			break;
		case "ForgeGUI":
			this.elementsToRender[1] = this.forgeGUI;
			break;
		case "GraphicsEngine":
			this.elementsToRender[2] = this.graphicsEngine;
			break;
	}
	for (var elem of this.elementsToRender) {
		if (elem != null) {
			elem.offContextDraw();
		}
	}
}

Forge.prototype.checkStateTransition = function() {
	for (var element of this.elementsToRender) {
		if (element && element.active == 0) {
			this.removeElementToRender(element.name);
		}
	}
}

// +-------------------------+
// |   Top level functions   |
// +-------------------------+

Forge.prototype.hideConsole = function() {
	this.developerConsole.hide();
}

Forge.prototype.showConsole = function() {
	this.forgeGuiHeight -= this.developerConsole.maxHeight;
	this.forgeGUI.adjustDrawingRect(0, 0, 0, -this.developerConsole.maxHeight);
	this.setGraphicsEngineDrawingRect();
	this.addElementToRender("DeveloperConsole");
	this.developerConsole.show();
}

Forge.prototype.editLevel = function(operation) {
	this.removeElementToRender("GraphicsEngine");
	operation();
	this.graphicsEngine.computeGraphicsData();
	this.addElementToRender("GraphicsEngine");
}

Forge.prototype.addLineFirst = function() {
	this.editLevel(this.levelCreator.addLineFirst.bind(this.levelCreator));
}

Forge.prototype.addLineLast = function() {
	this.editLevel(this.levelCreator.addLineLast.bind(this.levelCreator));
}

Forge.prototype.addColumnFirst = function() {
	this.editLevel(this.levelCreator.addColumnFirst.bind(this.levelCreator));
}

Forge.prototype.addColumnLast = function() {
	this.editLevel(this.levelCreator.addColumnLast.bind(this.levelCreator));
}

Forge.prototype.removeFirstLine = function() {
	this.editLevel(this.levelCreator.removeFirstLine.bind(this.levelCreator));
}

Forge.prototype.removeLastLine = function() {
	this.editLevel(this.levelCreator.removeLastLine.bind(this.levelCreator));
}

Forge.prototype.removeFirstColumn = function() {
	this.editLevel(this.levelCreator.removeFirstColumn.bind(this.levelCreator));
}

Forge.prototype.removeLastColumn = function() {
	this.editLevel(this.levelCreator.removeLastColumn.bind(this.levelCreator));
}

Forge.prototype.onTestItClick = function(cmdSender) {
	if (this.mode == "edit") {
		this.mode = "test";
		this.graphicsEngine.setEventMode("game");
		cmdSender.setText("Back to edit");
		this.levelCreator.save();
	} else {
		this.mode = "edit";
		this.graphicsEngine.setEventMode("forge");
		cmdSender.setText("Test it");
		this.levelCreator.restore();
	}
	this.forgeGUI.offContextDraw();
	this.graphicsEngine.offContextDraw();
}

Forge.prototype.import = function() {
	var level = window.prompt("enter the map previously exported");
	if (level) {
		this.removeElementToRender("GraphicsEngine");
		this.level.clearData();
		this.level.fill(level);
		this.levelCreator.clearData();
		this.levelCreator.fillEditingStructure();
		this.graphicsEngine.computeGraphicsData();
		this.addElementToRender("GraphicsEngine");
	}
}

Forge.prototype.export = function() {
	if (!this.level.isLevelFinished()) {
		alert("export impossible, level is not complete");
	} else if (this.mode == "test") {
		alert("export not allowed while testing");
	} else {
		alert(this.level.toString());
	}
}

Forge.prototype.onEmptyHexagonSelected = function(cmdSender) {
	if (this.buttonSelected != null) {
		this.buttonSelected.onFocusOver();
	}
	console.log("style selected : space");
	this.selection = "space";
	this.buttonSelected = cmdSender;
}

Forge.prototype.onFullHexagonSelected = function(cmdSender) {
	if (this.buttonSelected != null) {
		this.buttonSelected.onFocusOver();
	}
	console.log("style selected : block");
	this.selection = "block";
	this.buttonSelected = cmdSender;
}

Forge.prototype.onVoidHexagonSelect = function(cmdSender) {
	if (this.buttonSelected != null) {
		this.buttonSelected.onFocusOver();
	}
	console.log("style selected : void");
	this.selection = "void";
	this.buttonSelected = cmdSender;
}

Forge.prototype.onCharacterSelect = function(cmdSender) {
	if (this.buttonSelected != null) {
		this.buttonSelected.onFocusOver();
	}
	console.log("character selected");
	this.selection = "character";
	this.buttonSelected = cmdSender;
}

Forge.prototype.onExitSelect = function(cmdSender) {
	if (this.buttonSelected != null) {
		this.buttonSelected.onFocusOver();
	}
	console.log("exit selected");
	this.selection = "exit";
	this.buttonSelected = cmdSender;
}

// The sender of the command is an hexagon
Forge.prototype.onHexagonClick = function(cmdSender) {
	if (this.selection == "exit") {
		this.levelCreator.setExitHexagon(cmdSender);
	} else if (this.selection == "character") {
		this.levelCreator.setCharacterHexagon(cmdSender);
	} else if (this.selection != null) {
		this.levelCreator.setHexagonStyle(cmdSender, this.selection);
	}
}
