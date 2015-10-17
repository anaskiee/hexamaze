"use strict";

function ClickEvent(x, y) {
	Event.call(this);
	this.x = x;
	this.y = y;
}

ClickEvent.prototype = Object.create(Event.prototype);
ClickEvent.prototype.constructor = ClickEvent;

ClickEvent.prototype.execute = function() {
	if (this.receiver !== null) {
		var result = this.receiver.handleClick(this.x, this.y);

		if (result) {
			this.handleResult(result);
		}
	}
};
