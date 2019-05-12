"use strict";

function ForgeGUI(ctxLocator, pixelMapper, uiCreator) {
	GraphicalElement.call(this, "ForgeGUI", ctxLocator, pixelMapper);

	this.testIt = uiCreator.createTextButton("test it button", "Test it", "test_it");
	this.import = uiCreator.createTextButton("Import button", "import", "import");
	this.export = uiCreator.createTextButton("expport button", "export", "export");
	this.buttons = new Set();
	this.buttons.add(this.import);
	this.buttons.add(this.export);
	this.buttons.add(this.testIt);

	this.shortestPaths = uiCreator.createText("paths", "basic_text", "");

	// Buttons on the left
	this.emptyHexagon = uiCreator.createPatternButton("emptyHex", 
														"select_empty_hexagon");
	this.fullHexagon = uiCreator.createPatternButton("fullHex", "select_full_hexagon");
	this.voidHexagon = uiCreator.createPatternButton("voidHex", "select_void_hexagon");
	this.character = uiCreator.createPatternButton("charButton", "select_character");
	this.exit = uiCreator.createPatternButton("exitButton", "select_exit");
	this.emptyHexagon.enableFocusRendering();
	this.fullHexagon.enableFocusRendering();
	this.voidHexagon.enableFocusRendering();
	this.character.enableFocusRendering();
	this.exit.enableFocusRendering();

	// Buttons to edit level size
	this.addLineFirst = uiCreator.createPatternButton("addLineFirst", 
														"add_line_first");
	this.addLineLast = uiCreator.createPatternButton("addLineLast", "add_line_last");
	this.addColumnFirst = uiCreator.createPatternButton("addColFirst", 
														"add_column_first");
	this.addColumnLast = uiCreator.createPatternButton("addColLast", 
														"add_column_last");
	this.rmFirstLine = uiCreator.createPatternButton("rmFirstLine", "rm_first_line");
	this.rmLastLine = uiCreator.createPatternButton("rmLastLine", "rm_last_line");
	this.rmFirstColumn = uiCreator.createPatternButton("rmFirstCol", 
														"rm_first_column");
	this.rmLastColumn = uiCreator.createPatternButton("rmLastCol", "rm_last_column");
}

ForgeGUI.prototype = Object.create(GraphicalElement.prototype);
ForgeGUI.prototype.constructor = ForgeGUI;

ForgeGUI.prototype.onDrawingRectSet = function() {
	for (var textButton of this.buttons) {
		textButton.disable();
	}
	this.width = Math.floor(this.maxWidth);
	this.height = Math.floor(this.maxHeight);

	for (var textButton of this.buttons) {
		textButton.setFontHeight(Math.round(this.height/20));
	}
	this.shortestPaths.setFontHeight(Math.round(this.height/30));

	var radius = this.height/16;
	this.hexagonPatterns = new HexagonPatterns(radius);
	this.characterPatterns = new CharacterPatterns(2/5 * radius);
	this.exitPatterns = new ExitPatterns(3/5 * radius);
	this.plusMinusPatterns = new PlusMinusPatterns(3/5*radius);

	this.emptyHexagon.setPatternAndStyle(this.hexagonPatterns, "space");
	this.fullHexagon.setPatternAndStyle(this.hexagonPatterns, "block");
	this.voidHexagon.setPatternAndStyle(this.hexagonPatterns, "void");
	this.character.setPatternAndStyle(this.characterPatterns, "basic");
	this.exit.setPatternAndStyle(this.exitPatterns, "basic");

	this.addLineFirst.setPatternAndStyle(this.plusMinusPatterns, "plus");
	this.addLineLast.setPatternAndStyle(this.plusMinusPatterns, "plus");
	this.addColumnFirst.setPatternAndStyle(this.plusMinusPatterns, "plus");
	this.addColumnLast.setPatternAndStyle(this.plusMinusPatterns, "plus");
	this.rmFirstLine.setPatternAndStyle(this.plusMinusPatterns, "minus");
	this.rmLastLine.setPatternAndStyle(this.plusMinusPatterns, "minus");
	this.rmFirstColumn.setPatternAndStyle(this.plusMinusPatterns, "minus");
	this.rmLastColumn.setPatternAndStyle(this.plusMinusPatterns, "minus");
};

ForgeGUI.prototype.setRendererRect = function(x, y, width, height) {
	this.rX = x;
	this.rY = y;
	this.rWidth = width;
	this.rHeight = height;
};

ForgeGUI.prototype.selfRender = function() {
	var ctx = this.ctxLocator.ctx;
	// Clean screen
	ctx.fillStyle = "#003333";
	// left
	ctx.fillRect(0, 0, this.rX - this.offsetX, this.height);
	// right
	ctx.fillRect(this.rX + this.rWidth, 0, 
						this.width - this.rX - this.rWidth, this.height);
	// top
	ctx.fillRect(this.rX, 0, this.rWidth, this.rY - this.offsetX);
	// bot
	ctx.fillRect(this.rX, this.rY + this.rHeight, 
						this.rWidth, this.height - this.rY - this.rHeight);

	// Around graphicsEngine
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(this.rX-0.5, this.rY-0.5, this.rWidth+1, this.rHeight+1);

	// Left interface
	ctx.strokeRect(Math.round(this.width/8)+0.5, 0.5, 0, this.height);

	// Buttons on the left
	this.testIt.draw(ctx, 1/16*this.width, 17/20*this.height);
	this.import.draw(ctx, 1/16*this.width, 18/20*this.height);
	this.export.draw(ctx, 1/16*this.width, 19/20*this.height);

	// Level indicator
	this.shortestPaths.draw(ctx, 4/16*this.width, 19/20*this.height);

	this.emptyHexagon.draw(ctx, 1/16*this.width, 3/32*this.height);
	this.fullHexagon.draw(ctx, 1/16*this.width, 8/32*this.height);
	this.voidHexagon.draw(ctx, 1/16*this.width, 13/32*this.height);
	this.character.draw(ctx, 1/16*this.width, 18/32*this.height);
	this.exit.draw(ctx, 1/16*this.width, 23/32*this.height);

	// Buttons to edit map size
	this.addColumnFirst.draw(ctx, 3/16*this.width, 3/8*this.height);
	this.rmFirstColumn.draw(ctx, 3/16*this.width, 5/8*this.height);
	
	this.addColumnLast.draw(ctx, 15/16*this.width, 3/8*this.height);
	this.rmLastColumn.draw(ctx, 15/16*this.width, 5/8*this.height);
	
	this.addLineFirst.draw(ctx, 8/16*this.width, 1/16*this.height);
	this.rmFirstLine.draw(ctx, 10/16*this.width, 1/16*this.height);
	
	this.addLineLast.draw(ctx, 8/16*this.width, 15/16*this.height);
	this.rmLastLine.draw(ctx, 10/16*this.width, 15/16*this.height);
};

ForgeGUI.prototype.offContextDraw = function() {
	var offCtx = this.ctxLocator.offCtx;
	// We do not want to catch mouse events at the moment
	offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
	
	// Buttons on the left
	this.testIt.offContextDraw(offCtx, 1/16*this.width, 17/20*this.height);
	this.import.offContextDraw(offCtx, 1/16*this.width, 18/20*this.height);
	this.export.offContextDraw(offCtx, 1/16*this.width, 19/20*this.height);
	
	this.emptyHexagon.offContextDraw(offCtx, 1/16*this.width, 3/32*this.height);
	this.fullHexagon.offContextDraw(offCtx, 1/16*this.width, 8/32*this.height);
	this.voidHexagon.offContextDraw(offCtx, 1/16*this.width, 13/32*this.height);
	this.character.offContextDraw(offCtx, 1/16*this.width, 18/32*this.height);
	this.exit.offContextDraw(offCtx, 1/16*this.width, 23/32*this.height);

	// Buttons to edit map
	this.addColumnFirst.offContextDraw(offCtx, 3/16*this.width, 3/8*this.height);
	this.rmFirstColumn.offContextDraw(offCtx, 3/16*this.width, 5/8*this.height);
	
	this.addColumnLast.offContextDraw(offCtx, 15/16*this.width, 3/8*this.height);
	this.rmLastColumn.offContextDraw(offCtx, 15/16*this.width, 5/8*this.height);
	
	this.addLineFirst.offContextDraw(offCtx, 8/16*this.width, 1/16*this.height);
	this.rmFirstLine.offContextDraw(offCtx, 10/16*this.width, 1/16*this.height);
	
	this.addLineLast.offContextDraw(offCtx, 8/16*this.width, 15/16*this.height);
	this.rmLastLine.offContextDraw(offCtx, 10/16*this.width, 15/16*this.height);
};

ForgeGUI.prototype.update = function(dt) {
};

ForgeGUI.prototype.setIndicatorText = function(text) {
	this.shortestPaths.setText(text);
};
