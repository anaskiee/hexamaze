"use strict";

function GameLoader(canvas, context) {
	// Create all core objects
	var worker = new Worker("./js/levelGeneratorWorker.js");
	
	// Basic structures
	var level = new Level();
	var commands = new Map();
	var width = canvas.width;
	var height = canvas.height;

	var physicsEngine = new PhysicsEngine(level);
	var levelCreator = new LevelCreator(level);
	
	// Graphical modules
	var graphicsEngine = new GraphicsEngine(context, level, physicsEngine);
	var ingameMenu = new IngameMenu(context);
	var developerConsole = new DeveloperConsole(context);
	
	// Game modules
	var game = new Game(width, height, physicsEngine, graphicsEngine, ingameMenu, 
						developerConsole, worker, level, commands);
	var forge = new Forge(width, height, graphicsEngine, developerConsole, level, 
							levelCreator, commands);

	var master = new Master(game, forge);
	var eventHandler = new EventHandler(canvas, master, worker);

	// Initialize all commands
	commands.set("help", new Help("help", commands));
	commands.set("new_map", new NewMap("new_map", game));
	commands.set("win", new Win("win", game));

	master.start();
}