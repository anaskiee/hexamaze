"use strict";

function Help(name, commands) {
	Command.call(name, "display this help alert");

	this.commands = commands;
}

Help.prototype = Object.create(Command.prototype);
Help.prototype.constructor = Help;

Help.prototype.execute = function(commandLine) {
	var help = "list of available commands : \n";
	for (var commandName of this.commands.keys()) {
		help += commandName + "\n"
	}
	alert(help);
}