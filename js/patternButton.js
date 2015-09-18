"use strict";

function PatternButton(action, pixelMapper) {
	this.pattern = null;
	this.style = null;
	
	this.action = action;
	this.pixelMapper = pixelMapper;

	this.offContextColor = null;
}

PatternButton.prototype.setPatternAndStyle = function(pattern, style) {
	this.pattern = pattern;
	this.style = style;
}

PatternButton.prototype.draw = function(ctx, x, y) {
	this.pattern.draw(ctx, this.style, x, y);
}

PatternButton.prototype.offContextDraw = function(offCtx, x, y) {
	if (this.offContextColor == null) {
		this.offContextColor = this.pixelMapper.registerAndGetColor(this);
	}
	this.pattern.offContextDraw(offCtx, x, y, this.offContextColor);
}

PatternButton.prototype.disable = function() {
	if (this.offContextColor != null) {
		this.pixelMapper.unregister(this.offContextColor);
		this.offContextColor = null;
	}
}

PatternButton.prototype.handleCursorMove = function(x, y) {
}

PatternButton.prototype.handleClick = function(x, y) {
	return this.action;
}

PatternButton.prototype.onMouseOverEnd = function() {
}
