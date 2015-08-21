"use strict";

function GameLoader(canvas, context) {
	var worker = new Worker("./js/mapGenerator.js");
	var mapStructures = new MapStructures();
	var physicsEngine = new PhysicsEngine(mapStructures);
	var graphicsEngine = new GraphicsEngine(canvas, context, mapStructures, physicsEngine);;
	var ingameMenu = new IngameMenu(canvas, context);
	var developerConsole = new DeveloperConsole(canvas, context);
	var master = new Master(canvas, physicsEngine, graphicsEngine, ingameMenu, worker, mapStructures, developerConsole);
	var eventHandler = new EventHandler(canvas, master, worker);

	master.start();
}