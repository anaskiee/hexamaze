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
	var levelSolver = new LevelSolver(level);
	
	var pixelMapper = new PixelMapper(offContext);
	var uiCreator = new UICreator(pixelMapper);

	// Graphical modules
	var graphicsEngine = new GraphicsEngine(context, offContext, pixelMapper, level, 
											physicsEngine);
	var ingameMenu = new IngameMenu(context, offContext, uiCreator);
	var developerConsole = new DeveloperConsole(context, offContext);
	var forgeGUI = new ForgeGUI(context, offContext, pixelMapper, uiCreator);
	var mainMenu = new MainMenu(context, offContext, uiCreator);
	
	// Game modules
	var game = new Game(width, height, physicsEngine, graphicsEngine, ingameMenu, 
						developerConsole, worker, level);
	var forge = new Forge(width, height, pixelMapper,  graphicsEngine, 
						developerConsole, level, levelCreator, forgeGUI, levelSolver);
	var home = new Home(width, height, pixelMapper, developerConsole, mainMenu);

	var master = new Master(game, forge, home, pixelMapper, parameters);
	var eventHandler = new EventHandler(canvas, master, worker);

	// Initialize all commands
	commands.help = function(cmdLine) {
		var help = "list of available commands : \n";
		for (var commandName in this) {
			help += commandName + "\n";
		}
		alert(help);
	};
	master.setCommandsPrototypeChain(commands);

	master.start();
}
