"use strict";

function WorkerMessageEvent(msg) {
	GameEvent.call(this);
	this.msg = msg;
	this.receiver = null;
}

WorkerMessageEvent.prototype = Object.create(GameEvent.prototype);
WorkerMessageEvent.prototype.constructor = WorkerMessageEvent;

WorkerMessageEvent.prototype.execute = function() {
	if (this.receiver !== null) {
		var result = this.receiver.handleWorkerMessage(this.msg);

		if (result) {
			this.handleResult(result);
		}
	}
};
