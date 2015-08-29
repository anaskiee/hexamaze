"use strict";

function CursorMoveEvent(x, y) {
	this.x = x;
	this.y = y;
	this.receiver = null;
}

CursorMoveEvent.prototype.setReceiver = function(receiver) {
	this.receiver = receiver;
}

CursorMoveEvent.prototype.execute = function() {
	this.receiver.handleCursorMove(this.x, this.y);
}