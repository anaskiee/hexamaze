"use strict";

function GameLoader(canvas, context) {
	this.canvas = canvas;
	this.context = context;

	this.worker = new Worker("./js/mapGenerator.js");
	this.mapStructures = new MapStructures();
	this.physicsEngine = new PhysicsEngine(this.mapStructures);
	this.graphicsEngine = new GraphicsEngine(this.canvas, this.context, this.mapStructures, this.physicsEngine);;
	this.ingameMenu = new IngameMenu(canvas, context);
	this.master = new Master(this.physicsEngine, this.graphicsEngine, this.ingameMenu, this.solver, this, this.worker, this.mapStructures);
	this.eventHandler = new EventHandler(this.canvas, this.master, this.worker);

	this.master.start();
}