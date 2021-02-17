var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/Background-1.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-1.png");
ASSET_MANAGER.queueDownload("./sprites/player.png");
ASSET_MANAGER.queueDownload("./sprites/climber.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine.init(ctx);
	
	new SceneManager(gameEngine);
	
	gameEngine.start();
});
