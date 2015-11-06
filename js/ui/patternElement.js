"use strict";

function PatternElement(action, pixelMapper) {
	UIElement.call(this, name, pixelMapper);
	this.pattern = null;
	this.style = null;
}

PatternElement.prototype.setPatternAndStyle = function(pattern, style) {
	this.pattern = pattern;
	this.style = style;
};

PatternElement.prototype.draw = function(ctx, x, y) {
	this.pattern.draw(ctx, this.style, x, y);
	if (this.selected) {
		this.pattern.draw(ctx, "selected", x, y);
	}
};

PatternElement.prototype.offContextDraw = function(offCtx, x, y) {
	if (this.offContextColor === null) {
		this.offContextColor = this.pixelMapper.registerAndGetColor(this);
	}
	this.pattern.offContextDraw(offCtx, x, y, this.offContextColor);
};

PatternElement.prototype.enableFocusRendering = function() {
	this.selected = false;
};

PatternElement.prototype.handleCursorMove = function(x, y) {
};

PatternElement.prototype.handleClick = function(x, y) {
	if (this.selected === false) {
		this.selected = true;
	}
	return this.action;
};

PatternElement.prototype.onFocusOver = function() {
	this.selected = false;
};

PatternElement.prototype.onMouseOverEnd = function() {
};