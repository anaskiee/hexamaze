"use strict";

function ClickEvent(x, y) {
	this.x = x;
	this.y = y;
	this.receiver = null;
}

ClickEvent.prototype.setReceiver = function(receiver) {
	this.receiver = receiver;
}

ClickEvent.prototype.execute = function() {
	this.receiver.handleClick(this.x, this.y);
}