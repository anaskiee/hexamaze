"use strict";

function EventHandler(canvas, master, worker) {
	this.master = master;

	// A first fake event is pushed to force display
	this.master.push({type : "I"});

	this.canvas = canvas;
	canvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
	canvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
	canvas.addEventListener("keypress", this.handleKey.bind(this), false);
	canvas.addEventListener("click", this.handleClick.bind(this), false);
	
	worker.addEventListener("message", this.handleMessage.bind(this), false);
}

// Functions to catch events in order to apply them asynchronously
EventHandler.prototype.handleMouse = function(event) {
	this.master.push({type : "M", x : event.pageX, y : event.pageY});
}

EventHandler.prototype.handleKey = function(event) {
	this.master.push({type : "K", key : event.code});
}

EventHandler.prototype.handleTouch = function(event, isMouse) {
	this.master.push({type : "T", x : event.touches[0].pageX, y : event.touches[0].pageY});
}

EventHandler.prototype.handleClick = function(event) {
	this.master.push({type : "C"});
}

EventHandler.prototype.handleMessage = function(event) {
	var msg = event.data;
	console.log(msg);
	if (msg.length > 4 && msg.substr(0, 4) == "done") {
		//this.master.mapComputed();
		this.master.push({type : "MC", map : msg.substr(4)});
	} else {
		this.master.push({type : "MG", nb : msg});
	}
}
