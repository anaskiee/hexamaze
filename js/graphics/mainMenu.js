"use strict";

function MainMenu(context, offContext, pixelMapper, uiElementCreator) {
	GraphicalElement.call(this, "MainMenu", pixelMapper, uiElementCreator);

	this.ctx = context;
	this.offCtx = offContext;
	this.pixelMapper = pixelMapper;
	this.uiElementCreator = uiElementCreator;

	this.forge = new TextButton("Forge", "goto_forge", pixelMapper);
	this.game = new TextButton("Play on\nrandom level", "goto_game", pixelMapper);
	this.warmup = new TextButton("Warm-up", "level warmup", pixelMapper);
	this.spaceship = new TextButton("Spaceship", "level spaceship", pixelMapper);
	this.highway = new TextButton("Highway", "level highway", pixelMapper);
	this.hopeless = new TextButton("Hopeless", "level hopeless", pixelMapper);
	
	this.levels = uiElementCreator.createUIElement("levels", "text");
	uiElementCreator.setTextStyle(this.levels, "basic_text");
	this.levels.setText("levels");
	
	this.title = uiElementCreator.createUIElement("title", "text");
	uiElementCreator.setTextStyle(this.title, "title_text");
	this.title.setText("Hexamaze");

	this.texts = new Map();
	this.texts.set(this.levels, {x: 7/8, y: 17/30});
	this.texts.set(this.title, {x: 1/2, y: 1/3});
	
	this.buttons = new Map();
	this.buttons.set(this.forge, {x: 1/6,  y: 2/3});
	this.buttons.set(this.game, {x: 1/2,  y: 2/3});
	
	this.buttons.set(this.warmup, {x: 7/8, y: 19/30});
	this.buttons.set(this.spaceship, {x: 7/8, y: 21/30});
	this.buttons.set(this.highway, {x: 7/8, y: 23/30});
	this.buttons.set(this.hopeless, {x: 7/8, y: 25/30});

}

MainMenu.prototype = Object.create(GraphicalElement.prototype);
MainMenu.prototype.constructor = MainMenu;

MainMenu.prototype.onDrawingRectSet = function() {
	this.width = this.maxWidth;
	this.height = this.maxHeight;

	this.forge.setFontHeight(Math.round(this.height/10));
	this.game.setFontHeight(Math.round(this.height/10));
	this.levels.setFontHeight(Math.round(this.height/15));
	this.title.setFontHeight(Math.round(this.height/5));
	this.warmup.setFontHeight(Math.round(this.height/15));
	this.spaceship.setFontHeight(Math.round(this.height/15));
	this.highway.setFontHeight(Math.round(this.height/15));
	this.hopeless.setFontHeight(Math.round(this.height/15));
};

MainMenu.prototype.drawElement = function(date) {
	this.ctx.fillStyle = "#777777";
	this.ctx.fillRect(0, 0, this.width, this.height);

	for (var button of this.buttons.entries()) {
		var obj = button[0];
		var coor = button[1];
		obj.draw(this.ctx, coor.x*this.width, coor.y*this.height);
	}

	for (var text of this.texts.entries()) {
		var obj = text[0];
		var coor = text[1];
		obj.draw(this.ctx, coor.x*this.width, coor.y*this.height);
	}
};

MainMenu.prototype.offContextDraw = function() {
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);

	for (var text of this.buttons.entries()) {
		var obj = text[0];
		var coor = text[1];
		obj.offContextDraw(this.offCtx, coor.x*this.width, coor.y*this.height);
	}
};
