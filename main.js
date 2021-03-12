var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

// Graphics
ASSET_MANAGER.queueDownload("./sprites/Background-00.png");
ASSET_MANAGER.queueDownload("./sprites/Background-01.png");
ASSET_MANAGER.queueDownload("./sprites/Background-02.png");
ASSET_MANAGER.queueDownload("./sprites/Background-03.png");
ASSET_MANAGER.queueDownload("./sprites/Background-04.png");
ASSET_MANAGER.queueDownload("./sprites/Background-05.png");
ASSET_MANAGER.queueDownload("./sprites/Background-06.png");
ASSET_MANAGER.queueDownload("./sprites/Background-07.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-00.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-01.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-02.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-03.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-04.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-05.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-06.png");
ASSET_MANAGER.queueDownload("./sprites/Platform-07.png");
ASSET_MANAGER.queueDownload("./sprites/climber.png");

// Audio
ASSET_MANAGER.queueDownload("./audio/jump1.mp3");
ASSET_MANAGER.queueDownload("./audio/jump2.mp3");
ASSET_MANAGER.queueDownload("./audio/walljump.mp3");

ASSET_MANAGER.queueDownload("./audio/playmusic.mp3");
ASSET_MANAGER.queueDownload("./audio/idlemusic.mp3");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine.init(ctx);
	
	new SceneManager(gameEngine);
	
	gameEngine.start();
});
