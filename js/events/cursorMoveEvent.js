"use strict";

function CursorMoveEvent(x, y) {
	Event.call(this);
	this.x = x;
	this.y = y;
	this.previousElement = null;
}

CursorMoveEvent.prototype = Object.create(Event.prototype);
CursorMoveEvent.prototype.constructor = CursorMoveEvent;

CursorMoveEvent.prototype.execute = function() {
	if (this.previousElement) {
		this.previousElement.onMouseOverEnd();
	}
	
	if (this.receiver !== null) {
		var result = this.receiver.handleCursorMove(this.x, this.y);

		if (result) {
			this.handleResult(result);
		}
	}
};

CursorMoveEvent.prototype.setPreviousElement = function(elem) {
	this.previousElement = elem;
};
