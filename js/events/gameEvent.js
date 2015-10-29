"use strict";

function GameEvent() {
	this.receiver = null;
	this.resultReceiver = null;
}

GameEvent.prototype.setReceiver = function(receiver) {
	this.receiver = receiver;
};

GameEvent.prototype.setResultReceiver = function(resReceiver) {
	this.resultReceiver = resReceiver;
};

GameEvent.prototype.execute = function() {
};

GameEvent.prototype.handleResult = function(result) {
	if (this.resultReceiver !== null) {
		this.resultReceiver.handleEventResult(this.receiver, result);
	} else {
		console.log("no handler for this event result : " + result);
	}
};
