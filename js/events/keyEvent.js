"use strict";

function KeyEvent(keyCode) {
	GameEvent.call(this);
	this.keyCode = keyCode;
}

KeyEvent.prototype = Object.create(GameEvent.prototype);
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
