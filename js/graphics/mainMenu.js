"use strict";

function MainMenu(ctxLocator, uiCreator) {
	GraphicalElement.call(this, "MainMenu", ctxLocator, uiCreator);

	this.uiCreator = uiCreator;

	this.forge = uiCreator.createTextButton("forge button", "Forge", "goto_forge");
	this.game = uiCreator.createTextButton("game button", "Play on\nrandom level", 
													"goto_game");
	this.warmup = uiCreator.createTextButton("warmup level", "Warm-up", "level warmup");
	this.spaceship = uiCreator.createTextButton("spaceship level", "Spaceship", 
													"level spaceship");
	this.highway = uiCreator.createTextButton("highway level", "Highway", 
													"level highway");
	this.hopeless = uiCreator.createTextButton("hopeless level", "Hopeless", 
												"level hopeless");
	
	this.levels = uiCreator.createText("levels title", "basic_text", "levels");
	this.title = uiCreator.createText("main title", "title_text", "hexamaze");

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

MainMenu.prototype.selfRender = function() {
	var ctx = this.ctxLocator.ctx;
	ctx.fillStyle = "#777777";
	ctx.fillRect(0, 0, this.width, this.height);

	for (var button of this.buttons.entries()) {
		var obj = button[0];
		var coor = button[1];
		obj.draw(ctx, coor.x*this.width, coor.y*this.height);
	}

	for (var text of this.texts.entries()) {
		var obj = text[0];
		var coor = text[1];
		obj.draw(ctx, coor.x*this.width, coor.y*this.height);
	}
};

MainMenu.prototype.offContextDraw = function() {
	var offCtx = this.ctxLocator.offCtx;
	offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);

	for (var text of this.buttons.entries()) {
		var obj = text[0];
		var coor = text[1];
		obj.offContextDraw(offCtx, coor.x*this.width, coor.y*this.height);
	}
};

MainMenu.prototype.update = function(dt) {
};