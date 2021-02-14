class SceneManager {
	constructor(game) {
		Object.assign(this, { game });
		
		this.game = game;
		this.game.camera = this;
		this.x = 0;
		this.y = 0;	
		
		// HUD variables
		//
		
		// HUD animations
		//
		
		this.loadLevelOne();
	};
	
	clearEntities() {
        this.game.entities = [];
    };
	
	loadLevelOne() {
		// Background
		this.game.addEntity(new Background(this.game, 0, 0));
		this.game.addEntity(new Background(this.game, 0, -PARAMS.PAGE_HEIGHT));
		
		// Platforms
		this.game.addEntity(new Platform(this.game, 100, 500));
		this.game.addEntity(new Platform(this.game, 400, 300));
		this.game.addEntity(new Platform(this.game, 100, 200));
		this.game.addEntity(new Platform(this.game, 400, 100));

		// Player
		this.game.addEntity(new Player(this.game, 50, 50));
	};
	
	update() { // TODO replace with constants
		if (this.game.restart) {
			this.game.restart = false;
			this.clearEntities();
			this.loadLevelOne();
		}
		
		let yMidpoint = PARAMS.PAGE_WIDTH / 2 - 500 / 2;
		if (this.game.player.y < yMidpoint) {
			this.y = this.game.player.y - yMidpoint;
		}
	};
	
	draw(ctx) {
		//
	};
}