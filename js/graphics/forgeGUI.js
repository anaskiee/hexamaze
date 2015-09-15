"use strict";

function ForgeGUI(context, offContext, pixelMapper) {
	GraphicalElement.call(this, "ForgeGUI", pixelMapper);

	this.ctx = context;
	this.offCtx = offContext;

	this.import = new TextButton("Import", "import", pixelMapper);
	this.export = new TextButton("Export", "export", pixelMapper);
	this.addLineFirst = new TextButton("+", "add_line_first", pixelMapper);
	this.addLineLast = new TextButton("+", "add_line_last", pixelMapper);
	this.addColumnFirst = new TextButton("+", "add_column_first", pixelMapper);
	this.addColumnLast = new TextButton("+", "add_column_last", pixelMapper);
	this.rmFirstLine = new TextButton("-", "rm_first_line", pixelMapper);
	this.rmLastLine = new TextButton("-", "rm_last_line", pixelMapper);
	this.rmFirstColumn = new TextButton("-", "rm_first_column", pixelMapper);
	this.rmLastColumn = new TextButton("-", "rm_last_column", pixelMapper);
	this.buttons = new Set();
	this.buttons.add(this.import);
	this.buttons.add(this.export);
	this.buttons.add(this.addLineFirst);
	this.buttons.add(this.addLineLast);
	this.buttons.add(this.addColumnFirst);
	this.buttons.add(this.addColumnLast);
	this.buttons.add(this.rmFirstLine);
	this.buttons.add(this.rmLastLine);
	this.buttons.add(this.rmFirstColumn);
	this.buttons.add(this.rmLastColumn);
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
}

ForgeGUI.prototype.setRendererRect = function(x, y, width, height) {
	this.rX = x;
	this.rY = y;
	this.rWidth = width;
	this.rHeight = height;
}

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
	this.ctx.strokeRect(this.rX, this.rY, this.rWidth, this.rHeight);

	// Left interface
	this.ctx.strokeRect(0.5, 0.5, this.width/8, this.height);

	// Buttons
	this.import.draw(this.ctx, 1/16*this.width, 18/20*this.height);
	this.export.draw(this.ctx, 1/16*this.width, 19/20*this.height);
	
	this.addColumnFirst.draw(this.ctx, 3/16*this.width, 3/8*this.height);
	this.rmFirstColumn.draw(this.ctx, 3/16*this.width, 5/8*this.height);
	
	this.addColumnLast.draw(this.ctx, 15/16*this.width, 3/8*this.height);
	this.rmLastColumn.draw(this.ctx, 15/16*this.width, 5/8*this.height);
	
	this.addLineFirst.draw(this.ctx, 8/16*this.width, 1/16*this.height);
	this.rmFirstLine.draw(this.ctx, 10/16*this.width, 1/16*this.height);
	
	this.addLineLast.draw(this.ctx, 8/16*this.width, 15/16*this.height);
	this.rmLastLine.draw(this.ctx, 10/16*this.width, 15/16*this.height);
}

ForgeGUI.prototype.offContextDraw = function() {
	// We do not want to catch mouse events at the moment
	this.offCtx.clearRect(this.offsetX, this.offsetY, this.maxWidth, this.maxHeight);
	
	this.import.offContextDraw(this.offCtx, 1/16*this.width, 18/20*this.height);
	this.export.offContextDraw(this.offCtx, 1/16*this.width, 19/20*this.height);
	
	this.addColumnFirst.offContextDraw(this.offCtx, 3/16*this.width, 3/8*this.height);
	this.rmFirstColumn.offContextDraw(this.offCtx, 3/16*this.width, 5/8*this.height);
	
	this.addColumnLast.offContextDraw(this.offCtx, 15/16*this.width, 3/8*this.height);
	this.rmLastColumn.offContextDraw(this.offCtx, 15/16*this.width, 5/8*this.height);
	
	this.addLineFirst.offContextDraw(this.offCtx, 8/16*this.width, 1/16*this.height);
	this.rmFirstLine.offContextDraw(this.offCtx, 10/16*this.width, 1/16*this.height);
	
	this.addLineLast.offContextDraw(this.offCtx, 8/16*this.width, 15/16*this.height);
	this.rmLastLine.offContextDraw(this.offCtx, 10/16*this.width, 15/16*this.height);
}

//   +--------------+
//   |    Events    |
//   +--------------+
