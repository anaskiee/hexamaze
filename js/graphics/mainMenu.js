"use strict";

function MainMenu(context, offContext, pixelMapper) {
	GraphicalElement.call(this, "MainMenu", pixelMapper);

	this.ctx = context;
	this.offCtx = offContext;
	this.pixelMapper = pixelMapper;

	this.text = "Hexamaze"

	this.forge = new TextButton("Forge", "goto_forge", pixelMapper);
	this.game = new TextButton("Play on\nrandom level", "goto_game", pixelMapper);
}

MainMenu.prototype = Object.create(GraphicalElement.prototype);
MainMenu.prototype.constructor = MainMenu;

MainMenu.prototype.onDrawingRectSet = function() {
	this.width = this.maxWidth;
	this.height = this.maxHeight;

	this.forge.setFontHeight(Math.round(this.height/10));
	this.game.setFontHeight(Math.round(this.height/10));
}

MainMenu.prototype.drawElement = function(date) {
	this.ctx.fillStyle = "#555555";
	this.ctx.fillRect(0, 0, this.width, this.height);

	// Draw title
	this.ctx.fillStyle = "#000000";
	this.ctx.font = this.height/6 + "px motorwerk";
	this.ctx.textAlign = "center";
	this.ctx.fillText(this.text, 1/2*this.width, 1/3*this.height);

	// Draw buttons
	this.forge.draw(this.ctx, 1/3*this.width, 2/3*this.height);
	this.game.draw(this.ctx, 2/3*this.width, 2/3*this.height);
}

MainMenu.prototype.offContextDraw = function() {
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);

	this.forge.offContextDraw(this.offCtx, 1/3*this.width, 2/3*this.height);
	this.game.offContextDraw(this.offCtx, 2/3*this.width, 2/3*this.height);
}
