"use strict";

function KeyEvent(keyCode) {
	this.keyCode = keyCode;
	this.receiver = null;
}

KeyEvent.prototype.setReceiver = function(receiver) {
	this.receiver = receiver;
}

KeyEvent.prototype.execute = function() {
	this.receiver.handleKey(this.keyCode);
}