"use strict";

function WorkerMessageEvent(msg) {
	this.msg = msg;
	this.receiver = null;
	console.log(msg);
}

WorkerMessageEvent.prototype.setReceiver = function(receiver) {
	this.receiver = receiver;
}

WorkerMessageEvent.prototype.execute = function() {
	this.receiver.handleWorkerMessage(this.msg);
}