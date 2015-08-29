"use strict";

function Master(game) {
	this.events = [];
	this.module = game;
}

// +--------------------------+
// |    Drawing management    |
// +--------------------------+

Master.prototype.draw = function() {
	requestAnimationFrame(this.draw.bind(this));
	var date = new Date();

	this.module.computeNewFrameAndDraw(date);
}

// +----------------------+
// |   States managment   |
// +----------------------+

Master.prototype.start = function() {
	//this.expandMenu();
	//this.showConsole();
	//this.worker.postMessage("compute");
	this.module.startModule();
	this.draw();
}

// +----------------------+
// |   Events managment   |
// +----------------------+

Master.prototype.push = function(event) {
	//this.events.push(event);
	this.module.push(event);
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
