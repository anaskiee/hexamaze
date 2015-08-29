"use strict";

function GameLoader(canvas, context) {
	// Create all core objects
	var worker = new Worker("./js/levelGeneratorWorker.js");
	
	// Basic structures
	var level = new Level();
	var commands = new Map();
	var width = canvas.width;
	var height = canvas.height;

	// Graphical modules
	var physicsEngine = new PhysicsEngine(level);
	var graphicsEngine = new GraphicsEngine(canvas, context, level, physicsEngine);
	var ingameMenu = new IngameMenu(canvas, context);
	var developerConsole = new DeveloperConsole(canvas, context);
	
	// Game modules
	var game = new Game(width, height, physicsEngine, graphicsEngine, ingameMenu, 
						developerConsole, worker, level, commands);

	var master = new Master(game);
	var eventHandler = new EventHandler(canvas, master, worker);

	// Initialize all commands
	commands.set("help", new Help("help", commands));
	commands.set("new_map", new NewMap("new_map", game));
	commands.set("win", new Win("win", game));

	master.start();
}