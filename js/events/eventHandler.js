"use strict";

function EventHandler(canvas, master, worker) {
	this.master = master;

	this.canvas = canvas;
	canvas.addEventListener("touchmove", this.handleTouch.bind(this), false);
	canvas.addEventListener("mousemove", this.handleMouse.bind(this), false);
	canvas.addEventListener("keypress", this.handleKey.bind(this), false);
	canvas.addEventListener("click", this.handleClick.bind(this), false);
	
	worker.addEventListener("message", this.handleMessage.bind(this), false);
}

// Functions to catch events in order to apply them asynchronously
EventHandler.prototype.handleMouse = function(event) {
	var evt = new CursorMoveEvent(event.pageX, event.pageY);
	this.master.pushMouseMoveEvent(evt);
}

EventHandler.prototype.handleTouch = function(event, isMouse) {
	var evt = new CursorMoveEvent(event.touches[0].pageX, event.touches[0].pageY);
	this.master.pushMouseMoveEvent(evt);
}

EventHandler.prototype.handleClick = function(event) {
	var evt = new ClickEvent(event.pageX, event.pageY);
	this.master.pushClickEvent(evt);
}

EventHandler.prototype.handleKey = function(event) {
	// prevent backspace key from navigating back
	if (event.keyCode == 8) {
		event.preventDefault();
	}
	var evt = new KeyEvent(event.keyCode + event.charCode);
	this.master.pushKeyboardEvent(evt);
}

EventHandler.prototype.handleMessage = function(event) {
	var evt = new WorkerMessageEvent(event.data);
	this.master.pushMessageEvent(evt);
}
