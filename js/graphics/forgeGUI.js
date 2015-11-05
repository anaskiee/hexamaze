"use strict";

function ForgeGUI(context, offContext, pixelMapper, uiCreator) {
	GraphicalElement.call(this, "ForgeGUI", pixelMapper, uiCreator);

	this.ctx = context;
	this.offCtx = offContext;

	this.testIt = uiCreator.createTextButton("test it button", "Test it", "test_it");
	this.import = uiCreator.createTextButton("Import button", "import", "import");
	this.export = uiCreator.createTextButton("expport button", "export", "export");
	this.buttons = new Set();
	this.buttons.add(this.import);
	this.buttons.add(this.export);
	this.buttons.add(this.testIt);

	this.shortestPaths = uiCreator.createText("paths", "basic_text", "");

	// Buttons on the left
	this.emptyHexagon = new PatternButton("select_empty_hexagon", pixelMapper);
	this.fullHexagon = new PatternButton("select_full_hexagon", pixelMapper);
	this.voidHexagon = new PatternButton("select_void_hexagon", pixelMapper);
	this.character = new PatternButton("select_character", pixelMapper);
	this.exit = new PatternButton("select_exit", pixelMapper);
	this.emptyHexagon.enableFocusRendering();
	this.fullHexagon.enableFocusRendering();
	this.voidHexagon.enableFocusRendering();
	this.character.enableFocusRendering();
	this.exit.enableFocusRendering();

	// Buttons to edit level size
	this.addLineFirst = new PatternButton("add_line_first", pixelMapper);
	this.addLineLast = new PatternButton("add_line_last", pixelMapper);
	this.addColumnFirst = new PatternButton("add_column_first", pixelMapper);
	this.addColumnLast = new PatternButton("add_column_last", pixelMapper);
	this.rmFirstLine = new PatternButton("rm_first_line", pixelMapper);
	this.rmLastLine = new PatternButton("rm_last_line", pixelMapper);
	this.rmFirstColumn = new PatternButton("rm_first_column", pixelMapper);
	this.rmLastColumn = new PatternButton("rm_last_column", pixelMapper);
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

ForgeGUI.prototype.drawElement = function(date) {
	// Clean screen
	this.ctx.fillStyle = "#003333";
	// left
	this.ctx.fillRect(0, 0, this.rX - this.offsetX, this.height);
	// right
	this.ctx.fillRect(this.rX + this.rWidth, 0, 
						this.width - this.rX - this.rWidth, this.height);
	// top
	this.ctx.fillRect(this.rX, 0, this.rWidth, this.rY - this.offsetX);
	// bot
	this.ctx.fillRect(this.rX, this.rY + this.rHeight, 
						this.rWidth, this.height - this.rY - this.rHeight);

	// Around graphicsEngine
	this.ctx.strokeStyle = "#000000";
	this.ctx.strokeRect(this.rX-0.5, this.rY-0.5, this.rWidth+1, this.rHeight+1);

	// Left interface
	this.ctx.strokeRect(Math.round(this.width/8)+0.5, 0.5, 0, this.height);

	// Buttons on the left
	this.testIt.draw(this.ctx, 1/16*this.width, 17/20*this.height);
	this.import.draw(this.ctx, 1/16*this.width, 18/20*this.height);
	this.export.draw(this.ctx, 1/16*this.width, 19/20*this.height);

	// Level indicator
	this.shortestPaths.draw(this.ctx, 4/16*this.width, 19/20*this.height);

	this.emptyHexagon.draw(this.ctx, 1/16*this.width, 3/32*this.height);
	this.fullHexagon.draw(this.ctx, 1/16*this.width, 8/32*this.height);
	this.voidHexagon.draw(this.ctx, 1/16*this.width, 13/32*this.height);
	this.character.draw(this.ctx, 1/16*this.width, 18/32*this.height);
	this.exit.draw(this.ctx, 1/16*this.width, 23/32*this.height);

	// Buttons to edit map size
	this.addColumnFirst.draw(this.ctx, 3/16*this.width, 3/8*this.height);
	this.rmFirstColumn.draw(this.ctx, 3/16*this.width, 5/8*this.height);
	
	this.addColumnLast.draw(this.ctx, 15/16*this.width, 3/8*this.height);
	this.rmLastColumn.draw(this.ctx, 15/16*this.width, 5/8*this.height);
	
	this.addLineFirst.draw(this.ctx, 8/16*this.width, 1/16*this.height);
	this.rmFirstLine.draw(this.ctx, 10/16*this.width, 1/16*this.height);
	
	this.addLineLast.draw(this.ctx, 8/16*this.width, 15/16*this.height);
	this.rmLastLine.draw(this.ctx, 10/16*this.width, 15/16*this.height);
};

ForgeGUI.prototype.offContextDraw = function() {
	// We do not want to catch mouse events at the moment
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
	
	// Buttons on the left
	this.testIt.offContextDraw(this.offCtx, 1/16*this.width, 17/20*this.height);
	this.import.offContextDraw(this.offCtx, 1/16*this.width, 18/20*this.height);
	this.export.offContextDraw(this.offCtx, 1/16*this.width, 19/20*this.height);
	
	this.emptyHexagon.offContextDraw(this.offCtx, 1/16*this.width, 3/32*this.height);
	this.fullHexagon.offContextDraw(this.offCtx, 1/16*this.width, 8/32*this.height);
	this.voidHexagon.offContextDraw(this.offCtx, 1/16*this.width, 13/32*this.height);
	this.character.offContextDraw(this.offCtx, 1/16*this.width, 18/32*this.height);
	this.exit.offContextDraw(this.offCtx, 1/16*this.width, 23/32*this.height);

	// Buttons to edit map
	this.addColumnFirst.offContextDraw(this.offCtx, 3/16*this.width, 3/8*this.height);
	this.rmFirstColumn.offContextDraw(this.offCtx, 3/16*this.width, 5/8*this.height);
	
	this.addColumnLast.offContextDraw(this.offCtx, 15/16*this.width, 3/8*this.height);
	this.rmLastColumn.offContextDraw(this.offCtx, 15/16*this.width, 5/8*this.height);
	
	this.addLineFirst.offContextDraw(this.offCtx, 8/16*this.width, 1/16*this.height);
	this.rmFirstLine.offContextDraw(this.offCtx, 10/16*this.width, 1/16*this.height);
	
	this.addLineLast.offContextDraw(this.offCtx, 8/16*this.width, 15/16*this.height);
	this.rmLastLine.offContextDraw(this.offCtx, 10/16*this.width, 15/16*this.height);
};

ForgeGUI.prototype.setIndicatorText = function(text) {
	this.shortestPaths.setText(text);
};
