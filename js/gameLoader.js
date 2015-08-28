"use strict";

function GameLoader(canvas, context) {
	// Create all core objects
	var worker = new Worker("./js/levelGeneratorWorker.js");
	var level = new Level();
	var commands = new Map();
	var physicsEngine = new PhysicsEngine(level);
	var graphicsEngine = new GraphicsEngine(canvas, context, level, physicsEngine);;
	var ingameMenu = new IngameMenu(canvas, context);
	var developerConsole = new DeveloperConsole(canvas, context);
	var master = new Master(canvas, physicsEngine, graphicsEngine, ingameMenu, worker, level, developerConsole, commands);
	var eventHandler = new EventHandler(canvas, master, worker);

	// Initialize all commands
	commands.set("help", new Help("help", commands));
	commands.set("new_map", new NewMap("new_map", master));
	commands.set("win", new Win("win", master));

	master.start();
}