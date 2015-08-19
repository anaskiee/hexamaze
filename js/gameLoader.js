"use strict";

function GameLoader(canvas, context) {
	this.canvas = canvas;
	this.context = context;

	this.nb = 0;

	this.width = 15;
	this.height = 7;
	var nbLines = this.height + 2;
	var nbColumns = this.width + 2;

	this.worker = new Worker("./js/mapGenerator.js");
	this.mapStructures = new MapStructures();
	//this.mapConfig = null;
	//this.solver = new MapSolver(this.mapStructures.hexagons);
	this.physicsEngine = new PhysicsEngine(this.mapStructures);
	this.graphicsEngine = new GraphicsEngine(this.canvas, this.context, this.mapStructures, nbLines, nbColumns, this.physicsEngine);;
	this.ingameMenu = new IngameMenu(canvas, context);
	this.master = new Master(this.physicsEngine, this.graphicsEngine, this.ingameMenu, this.solver, this, this.worker, this.mapStructures);
	this.eventHandler = new EventHandler(this.canvas, this.master, this.worker);

	this.master.start();
}