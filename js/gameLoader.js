"use strict";

function GameLoader(canvas, context, offContext, parameters) {
	// Create all core objects
	var worker = new Worker("js/levelGeneratorWorker.js");
	
	// Basic structures
	var level = new Level();
	var commands = {};
	var width = canvas.width;
	var height = canvas.height;

	var physicsEngine = new PhysicsEngine(level);
	var levelCreator = new LevelCreator(level);
	
	var pixelMapper = new PixelMapper(offContext);

	// Graphical modules
	var graphicsEngine = new GraphicsEngine(context, offContext, pixelMapper, level, 
											physicsEngine);
	var ingameMenu = new IngameMenu(context, offContext, pixelMapper);
	var developerConsole = new DeveloperConsole(context, offContext, pixelMapper);
	var forgeGUI = new ForgeGUI(context, offContext, pixelMapper);
	
	// Game modules
	var game = new Game(width, height, physicsEngine, graphicsEngine, ingameMenu, 
						developerConsole, worker, level);
	var forge = new Forge(width, height, pixelMapper,  graphicsEngine, 
							developerConsole, level, levelCreator, forgeGUI);

	var master = new Master(game, forge, pixelMapper, parameters);
	var eventHandler = new EventHandler(canvas, master, worker);

	// Initialize all commands
	commands.help = function(cmdLine) {
		var help = "list of available commands : \n";
		for (var commandName in this) {
			help += commandName + "\n";
		}
		alert(help);
	}
	master.setCommandsPrototypeChain(commands);

	master.start();
}
