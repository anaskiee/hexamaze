"use strict";

function Command(name, description) {
	this.name = name;
	this.description = description
}

Command.prototype.execute = function(commandLine) {
	console.log("warning : command " + this.name + "doesn't have an execute function");
}