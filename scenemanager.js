class SceneManager {
	constructor(game) {
		// Constants
		this.SCROLL_INCREMENT = 0.25;
		
		Object.assign(this, { game });
		this.game = game;
		this.game.camera = this;
		this.x = 0;
		this.y = -(PARAMS.PAGE_HEIGHT);	
		this.timeScore = 0;
		this.heightScore = 0;
		this.highScore = 0;
		this.score = 0;
		this.bestY = 0;
		this.scrollSpeed = 0;
        this.elapsedTime = 0;
		this.running = false;
		
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
		this.bestY = 0;
		this.score = 0;
		this.timeScore = 0;
		this.heightScore = 0;
		this.scrollSpeed = 0;
		this.elapsedTime = 0;
		this.running = false;
		
		// Background
		let xMidpoint = (PARAMS.PAGE_WIDTH - PARAMS.BG_WIDTH) / 2;
		for (var i = 1; i < 50; i++) {
			this.game.addEntity(new Background(this.game, 0, -i * PARAMS.PAGE_HEIGHT));
		}
		
		// Platforms
		let levels = 100;
		for (var i = 1; i < levels; i++) {
			let platforms = Math.ceil((levels - i) / 20);
			for (var j = 0; j < platforms; j++){
				this.game.addEntity(new Platform(this.game, Math.random() * (PARAMS.PAGE_WIDTH / platforms) + (j * (PARAMS.PAGE_WIDTH / platforms)) - PARAMS.PLATFORM_WIDTH / 2, -i * 200, 1)); // 1 - (0.01 * i)
			}
		}
		
		// Floor
		this.game.addEntity(new Platform(this.game,-50, -50, 1));
		this.game.addEntity(new Platform(this.game, 150, -50, 1));
		this.game.addEntity(new Platform(this.game, 350, -50, 1));
		this.game.addEntity(new Platform(this.game, 550, -50, 1));
		this.game.addEntity(new Platform(this.game, 750, -50, 1));
		this.game.addEntity(new Platform(this.game, 950, -50, 1));

		// Player
		this.game.addEntity(new Player(this.game, PARAMS.PAGE_WIDTH / 2 - 25, -110));
	};
	
	update() {
		// Restart game
		if (this.game.restart) {
			this.highScore = Math.max(this.highScore, this.score);
			this.game.restart = false;
			this.clearEntities();
			this.loadLevelOne();
			this.y = -(PARAMS.PAGE_HEIGHT);	
		}
		
		// Timer, time score
		if (this.game.player.y < -125) {
			this.elapsedTime += this.game.clockTick;
		if (!this.running) {
			this.running = true;
			this.scrollSpeed += this.SCROLL_INCREMENT;
		}
		}
		if (this.elapsedTime > 10) {
			this.elapsedTime = 0;
			this.scrollSpeed += this.SCROLL_INCREMENT;
			this.timeScore += this.scrollSpeed * 10000;
		}
		
		// Update height score
		this.bestY = Math.min(this.bestY, this.game.player.y + 101);
		this.heightScore = -this.bestY;
		
		// total score
		this.score = Math.floor(this.heightScore + this.timeScore);
		
		// Scroll map
		this.y -= this.scrollSpeed;
		
		// Follow player
		let pushpoint = PARAMS.PAGE_WIDTH / 4;

        if (this.y > this.game.player.y - pushpoint) this.y = this.game.player.y - pushpoint;
		
		if (this.y + PARAMS.PAGE_HEIGHT < this.game.player.y) this.game.restart = true;
	};
	
	draw(ctx) {
		let scoreText = "SCORE: " + this.score + " ";
		ctx.strokeStyle = 'White';
		ctx.font = "30px Arial";
		ctx.strokeText(scoreText, PARAMS.PAGE_WIDTH / 2, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(scoreText, PARAMS.PAGE_WIDTH / 2, 50);
		
		let highScoreText = "HIGH SCORE: " + this.highScore;
		ctx.strokeStyle = 'White';
		ctx.font = "30px Arial";
		ctx.strokeText(highScoreText, PARAMS.PAGE_WIDTH / 2, 100);
		ctx.strokeStyle = 'Black';
		ctx.fillText(highScoreText, PARAMS.PAGE_WIDTH / 2, 100);
		
		let timeText = "";
		if (this.game.player.y < -125) timeText = "SPEED UP IN: 0:" + Math.floor(10 - this.elapsedTime) + " ";
		ctx.strokeStyle = 'White';
		ctx.font = "30px Arial";
		ctx.strokeText(timeText, PARAMS.PAGE_WIDTH / 2, 150);
		ctx.strokeStyle = 'Black';
		ctx.fillText(timeText, PARAMS.PAGE_WIDTH / 2, 150);
	};
}