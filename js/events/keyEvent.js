"use strict";

function KeyEvent(key) {
	GameEvent.call(this);
	this.key = key;
}

KeyEvent.prototype = Object.create(GameEvent.prototype);
KeyEvent.prototype.constructor = KeyEvent;

KeyEvent.prototype.execute = function() {
	if (this.receiver !== null) {
		var result = this.receiver.handleKey(this.key);

		// Nothing returned
		if (result !== undefined) {
			this.handleResult(result);
		}
	}
};
