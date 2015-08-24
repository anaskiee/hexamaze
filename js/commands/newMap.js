"use strict";

function NewMap(name, master, ingameMenu, worker) {
	Command.call(name, "create a random maze");

	this.master = master;
	this.ingameMenu = ingameMenu;
	this.worker = worker;
}

NewMap.prototype = Object.create(Command.prototype);
NewMap.prototype.constructor = NewMap;

NewMap.prototype.execute = function(commandLine) {
	this.master.removeElementToRender("GraphicsEngine");
	this.master.addElementToRender("IngameMenu");
	this.ingameMenu.expand(new Date());
	this.master.updateComputingMenu(0);
	this.worker.postMessage(commandLine);
}