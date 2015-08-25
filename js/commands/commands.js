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

/*--------------------------------------------------*/

function NewMap(name, master) {
	Command.call(name, "create a random maze");

	this.master = master;
}

NewMap.prototype = Object.create(Command.prototype);
NewMap.prototype.constructor = NewMap;

NewMap.prototype.execute = function(commandLine) {
	this.master.computeNewMap(commandLine);
}

/*--------------------------------------------------*/

function Win(name, master) {
	Command.call(name, "display the win menu");

	this.master = master;
}

Win.prototype = Object.create(Command.prototype);
Win.prototype.constructor = Win;

Win.prototype.execute = function(commandLine) {
	this.master.onWinEvent();
}