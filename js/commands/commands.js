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

function NewMap(name, game) {
	Command.call(name, "create a random maze");

	this.game = game;
}

NewMap.prototype = Object.create(Command.prototype);
NewMap.prototype.constructor = NewMap;

NewMap.prototype.execute = function(commandLine) {
	this.game.computeNewMap(commandLine);
}

/*--------------------------------------------------*/

function Win(name, game) {
	Command.call(name, "display the win menu");

	this.game = game;
}

Win.prototype = Object.create(Command.prototype);
Win.prototype.constructor = Win;

Win.prototype.execute = function(commandLine) {
	this.game.onWinEvent();
}