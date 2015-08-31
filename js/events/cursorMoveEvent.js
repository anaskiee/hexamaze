"use strict";

function CursorMoveEvent(x, y) {
	Event.call(this);
	this.x = x;
	this.y = y;
}

CursorMoveEvent.prototype = Object.create(Event.prototype);
CursorMoveEvent.prototype.constructor = CursorMoveEvent;

CursorMoveEvent.prototype.execute = function() {
	if (this.receiver != null) {
		var result = this.receiver.handleCursorMove(this.x, this.y);

		if (result) {
			this.handleResult(result);
		}
	}
}