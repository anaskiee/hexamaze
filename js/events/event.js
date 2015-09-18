"use strict";

function Event() {
	this.receiver = null;
	this.resultReceiver = null;
}

Event.prototype.setReceiver = function(receiver) {
	this.receiver = receiver;
}

Event.prototype.setResultReceiver = function(resReceiver) {
	this.resultReceiver = resReceiver;
}

Event.prototype.execute = function() {
}

Event.prototype.handleResult = function(result) {
	if (this.resultReceiver != null) {
		this.resultReceiver.handleEventResult(this.receiver, result);
	} else {
		console.log("no handler for this event result : " + result);
	}
}
