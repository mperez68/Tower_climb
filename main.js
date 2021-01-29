var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/player.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	
	// Background
	//var bg = new Background(gameEngine, 0, 0);	
	
	
	// Player
	var player = new Player(gameEngine, 50, 50);	

	gameEngine.init(ctx);
	
	// Background
	//gameEngine.addEntity(bg);

	// Player
	gameEngine.addEntity(player);

	gameEngine.start();
});
