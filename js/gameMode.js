"use strict";

function GameMode(name) {
	this.name = name;
}

GameMode.prototype.handleEventResult = function(res) {
	var mainCommand = res.split(" ")[0];
	if (this.commands[mainCommand]) {
		this.commands[mainCommand](res);
	}
}