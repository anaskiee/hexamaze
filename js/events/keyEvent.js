"use strict";

function KeyEvent(keyCode) {
	Event.call(this);
	this.keyCode = keyCode;
}

KeyEvent.prototype = Object.create(Event.prototype);
KeyEvent.prototype.constructor = KeyEvent;

KeyEvent.prototype.execute = function() {
	if (this.receiver !== null) {
		var result = this.receiver.handleKey(this.keyCode);

		// Nothing returned
		if (result !== undefined) {
			this.handleResult(result);
		}
	}
};
