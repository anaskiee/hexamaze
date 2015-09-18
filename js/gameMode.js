"use strict";

function GameMode(name) {
	this.name = name;
}

GameMode.prototype.handleEventResult = function(eventReceiver, res) {
	var mainCommand = res.split(" ")[0];
	if (this.commands[mainCommand]) {
		this.commands[mainCommand](eventReceiver, res);
	}
}
