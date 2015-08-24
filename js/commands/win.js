"use strict";

function Win(name, master, ingameMenu) {
	Command.call(name, "display the win menu");

	this.master = master;
	this.ingameMenu = ingameMenu;
}

Win.prototype = Object.create(Command.prototype);
Win.prototype.constructor = Win;

Win.prototype.execute = function(commandLine) {
	this.master.addElementToRender("IngameMenu");
	this.ingameMenu.setText("You win !");
	this.ingameMenu.expand(new Date());
}