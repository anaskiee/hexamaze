"use strict";

function Master(game) {
	this.events = [];
	this.module = game;
}

Master.prototype.draw = function() {
	requestAnimationFrame(this.draw.bind(this));
	var date = new Date();

	this.applyEvents();
	this.module.computeNewFrameAndDraw(date);
}

Master.prototype.start = function() {
	this.module.startModule();
	this.draw();
}

// A message is destinated to a module
Master.prototype.pushMessageEvent = function(event) {
	this.module.setMessageEventReceivers(event);
	this.events.push(event);
}

// Other events are destinated to a graphical elements, but only
// the module know which one
Master.prototype.pushMouseEvent = function(event) {
	this.module.setMouseEventReceivers(event);
	this.events.push(event);
}

Master.prototype.pushKeyboardEvent = function(event) {
	this.module.setKeyboardEventReceivers(event);
	this.events.push(event);
}

Master.prototype.applyEvents = function() {
	var event;
	while (this.events.length > 0) {
		event = this.events.shift();
		event.execute();
	}
}

// Functions to apply events before drawing
/*Master.prototype.applyEvents = function() {
	var e;
	var updateNeeded = false;
	var action;

	var eventTarget;

	var elementsNumber = this.elementsToRender.length;
	while (this.events.length > 0) {
		updateNeeded = true;
		e = this.events.shift();
		for (var i = elementsNumber - 1; 0 <= i; i--) {
			eventTarget = this.elementsToRender[i];
			
			// This element is not active
			if (!eventTarget) {
				continue;
			}

			action = "";

			switch (e.type) {
				case "M":
					action = eventTarget.handleCursorMove(e.x, e.y);
					break;
				case "K":
					action = eventTarget.handleKey(e.code);
					//action = this.applyKeyEvent(e.key);
					break;
				case "T":
					action = eventTarget.handleCursorMove(e.x, e.y);
					break;
				case "C":
					action = eventTarget.handleClick(e.x, e.y);
					break;
				case "I":
					break;
				case "MG":
					this.updateComputingMenu(e.nb);
					break;
				case "MC":
					this.loadMap(e.map);
					this.mapComputed();
					break;
			}
	
			if (action) {
				var mainCommand = action.split(" ")[0];
				if (this.commands.has(mainCommand)) {
					var test = this.commands.get(mainCommand);
					this.commands.get(mainCommand).execute(action);
				}
			}

			if (eventTarget.blockEventsSpread) {
				break;
			}
		}
	}
	return updateNeeded;
}*/

/*Master.prototype.applyKeyEvent = function(key) {
	var changed = false;
	switch (key) {
		case "KeyH":
			this.solver.highlightSolution();
			break;
		case "KeyC":
			this.physicsEngine.cleanHighlight();
			break;
		case "Escape":
			this.displayMenu();
			break;
	}

	if (changed) {
		this.physicsEngine.cleanPreselectedHexagons();
		this.physicsEngine.computeHexagonsTowardsDirection(this.direction);

		this.graphicsEngine.updateDirection(this.direction);
	}
}*/
