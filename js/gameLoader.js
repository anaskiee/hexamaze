"use strict";

function GameLoader(canvas, context) {
	// Create all core objects
	var worker = new Worker("./js/mapGenerator.js");
	var mapStructures = new MapStructures();
	var commands = new Map();
	var physicsEngine = new PhysicsEngine(mapStructures);
	var graphicsEngine = new GraphicsEngine(canvas, context, mapStructures, physicsEngine);;
	var ingameMenu = new IngameMenu(canvas, context);
	var developerConsole = new DeveloperConsole(canvas, context);
	var master = new Master(canvas, physicsEngine, graphicsEngine, ingameMenu, worker, mapStructures, developerConsole, commands);
	var eventHandler = new EventHandler(canvas, master, worker);

	// Initialize all commands
	commands.set("new_map", new NewMap("new_map", master, ingameMenu, worker));
	commands.set("help", new Help("help", commands));
	commands.set("win", new Win("win", master, ingameMenu));

	master.start();
}