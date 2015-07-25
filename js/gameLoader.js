"use strict";

function GameLoader(canvas, context) {
	this.canvas = canvas;
	this.context = context;

	this.width = 15;
	this.height = 7;
	var nbLines = this.height + 2;
	var nbColumns = this.width + 2;

	this.mapStructures = new MapStructures();
	this.mapConfig = null;
	this.solver = new MapSolver(this.mapStructures.hexagons);
	this.physicsEngine = new PhysicsEngine(this.mapStructures);
	this.graphicsEngine = new GraphicsEngine(this.canvas, this.context, this.mapStructures, nbLines, nbColumns, this.physicsEngine);;
	this.ingameMenu = new IngameMenu(canvas, context);
	this.master = new Master(this.physicsEngine, this.graphicsEngine, this.ingameMenu, this.solver, this);
	this.eventHandler = new EventHandler(this.canvas, this.master);

	this.nbGame = 0;
	this.newGame();
}

GameLoader.prototype.newGame = function() {
	this.nbGame++;

	// Stop the previous drawing
	this.master.stopDrawing();

	var difficulty = 9000;
	var nb = 0;
	while (difficulty < 10 || difficulty == 9000) {
		nb++;
		this.mapConfig = new MapConfiguration(this.mapStructures, this.height, this.width);
		difficulty = this.solver.getMin();
	}
	console.log(nb);
	console.log(difficulty);

	this.physicsEngine.computePhysicsData();
	this.graphicsEngine.computeGraphicsData();
	
	this.master.beginDrawing();
}