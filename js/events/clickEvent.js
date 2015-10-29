"use strict";

function ClickEvent(x, y) {
	GameEvent.call(this);
	this.x = x;
	this.y = y;
}

ClickEvent.prototype = Object.create(GameEvent.prototype);
ClickEvent.prototype.constructor = ClickEvent;

ClickEvent.prototype.execute = function() {
	if (this.receiver !== null) {
		var result = this.receiver.handleClick(this.x, this.y);

		if (result) {
			this.handleResult(result);
		}
	}
};
