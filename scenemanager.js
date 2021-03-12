class SceneManager {
	constructor(game) {
		// Constants
		this.PLAY_MUSIC_PATH = "./audio/playmusic.mp3";
		this.IDLE_MUSIC_PATH = "./audio/idlemusic.mp3";
		this.SCROLL_INCREMENT = 0.25;
		
		Object.assign(this, { game });
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
		this.topOfMap = 0;
		this.tier = 0;
		this.musicMode = 0; // 0 is silent, 1 is idle music, 2 is climb music
		this.currentMusic = 0; // 0 is silent, 1 is idle music, 2 is climb music

		ASSET_MANAGER.adjustVolume(0.15);
		
		this.loadLevel();
	};
	
	clearEntities() {
        this.game.entities = [];
    };
	
	loadLevel() {
		console.log("level " + this.tier + " being loaded.");
		
		// local variables
		let xMidpoint = (PARAMS.PAGE_WIDTH - PARAMS.BG_WIDTH) / 2;
		let platsPerPhase = 10;
		let levels = 50;
		let platHeight = 225;
		let startHeight = -50;
		// Platforms
		for (var i = 0; i < levels; i++) {
			let platforms = Math.ceil((levels - i) / platsPerPhase) + 1;
			if (i % platsPerPhase == 0) {
				for (var j = 0; j < 6; j++) {
					this.game.addEntity(new Platform(this.game, (j * 200), this.topOfMap + startHeight - i * platHeight, 1, this.tier));
					this.game.addEntity(new TextBox(this.game, PARAMS.PAGE_WIDTH / 2, this.topOfMap + startHeight - i * platHeight + 45, this.tier * levels + i));
				};
			} else {
				for (var j = 0; j < platforms; j++){
					this.game.addEntityToFront(new Platform(this.game,
										Math.random() * (PARAMS.PAGE_WIDTH / platforms) + (j * (PARAMS.PAGE_WIDTH / platforms)) - PARAMS.PLATFORM_WIDTH / 2,
										this.topOfMap + startHeight - i * platHeight, 1, this.tier));
				};
			};
		};
		
		// Background
		let yPointer = this.topOfMap -(levels * platHeight);
		while (yPointer < this.topOfMap ) {
			this.game.addEntityToFront(new Background(this.game, 0, yPointer, this.tier));
			yPointer += PARAMS.BG_WIDTH;
		}
		
		// Tier 0 extras
		if (this.tier == 0) {
			this.bestY = 0;
			this.score = 0;
			this.timeScore = 0;
			this.heightScore = 0;
			this.scrollSpeed = 0;
			this.elapsedTime = 0;
			this.game.addEntity(new Player(this.game, PARAMS.PAGE_WIDTH / 2 - 25, startHeight - 60));
			this.running = false;
		};
		
		this.topOfMap -= levels * platHeight;
	};
	
	update() {
		// Restart game
		if (this.game.restart) {
			this.game.restart = false;
			this.tier = 0;
			this.topOfMap = 0;
			this.highScore = Math.max(this.highScore, this.score);
			this.clearEntities();
			this.loadLevel();
			this.y = -(PARAMS.PAGE_HEIGHT);
			this.musicMode = 1;
		}
		
		// Generate new level on approach
		if (this.y <= this.topOfMap) {
			this.tier++;
			this.loadLevel();
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
		
		// Invulnerable reset
		if (this.y + PARAMS.PAGE_HEIGHT < this.game.player.y && this.game.player.invulnerable) this.game.player.y -= PARAMS.PAGE_HEIGHT * (3 / 4);
		
		// Handle audio
		if (this.musicMode != 2 && this.game.player.y < -125) {
			this.musicMode = 2;
		}
		
		if (this.musicMode == 1 && this.currentMusic != 1) {
			console.log("switch to idle music");
			this.currentMusic = 1;
			ASSET_MANAGER.pauseAsset(this.PLAY_MUSIC_PATH);
			ASSET_MANAGER.playAsset(this.IDLE_MUSIC_PATH);
		} else if (this.musicMode == 2 && this.currentMusic != 2) {
			console.log("switch to climbing music");
			this.currentMusic = 2;
			ASSET_MANAGER.playAsset(this.PLAY_MUSIC_PATH);
			ASSET_MANAGER.pauseAsset(this.IDLE_MUSIC_PATH);
		} else if (this.musicMode == 0 && this.currentMusic != 0){
			console.log("switch to no music");
			this.currentMusic = 0;
			ASSET_MANAGER.pauseAsset(this.PLAY_MUSIC_PATH);
			ASSET_MANAGER.pauseAsset(this.IDLE_MUSIC_PATH);
		}
		
		// death
		if (this.y + PARAMS.PAGE_HEIGHT < this.game.player.y) { 
			this.game.restart = true;
			console.log("pause all music");
			this.musicMode = 0;
		}
	};
	
	draw(ctx) {
		// LEFT ALIGN TEXT //
		ctx.textAlign  = "left";
		// Score Text
		let tierText = "LEVEL: " + (this.tier + 1) + " ";
		ctx.strokeStyle = 'White';
		ctx.font = "30px Impact";
		ctx.strokeText(tierText, 50, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(tierText, 50, 50);
		
		// CENTER ALIGN TEXT //
		ctx.textAlign  = "center";
		// Score Text
		let scoreText = "SCORE: " + this.score + " ";
		ctx.strokeStyle = 'White';
		ctx.font = "30px Impact";
		ctx.strokeText(scoreText, PARAMS.PAGE_WIDTH / 2, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(scoreText, PARAMS.PAGE_WIDTH / 2, 50);
		// High Score Text
		let highScoreText = "";
		if (this.game.player.y > -PARAMS.PAGE_HEIGHT) highScoreText = "HIGH SCORE: " + this.highScore;
		ctx.strokeStyle = 'White';
		ctx.font = "50px Impact";
		ctx.strokeText(highScoreText, PARAMS.PAGE_WIDTH / 2, 100);
		ctx.strokeStyle = 'Black';
		ctx.fillText(highScoreText, PARAMS.PAGE_WIDTH / 2, 100);
		// Controls Text
		let controlText1 = "";
		let controlText2 = "";
		if (this.game.player.y > -125) controlText1 = "A & D move left and right. W or Space Bar jumps.";
		if (this.game.player.y > -125) controlText2 = "Jumping off the wall gives you an extra boost!";
		ctx.strokeStyle = 'White';
		ctx.font = "30px Impact";
		ctx.strokeText(controlText1, PARAMS.PAGE_WIDTH / 2, 200);
		ctx.strokeText(controlText2, PARAMS.PAGE_WIDTH / 2, 240);
		ctx.strokeStyle = 'Black';
		ctx.fillText(controlText1, PARAMS.PAGE_WIDTH / 2, 200);
		ctx.fillText(controlText2, PARAMS.PAGE_WIDTH / 2, 240);
		
		// RIGHT ALIGN TEXT //
		ctx.textAlign  = "right";
		// Speed Up Text
		let timeText = "";
		if (this.game.player.y < -125) timeText = "SPEED UP IN: 0:" + Math.floor(11 - this.elapsedTime) + " ";
		ctx.strokeStyle = 'White';
		ctx.font = "30px Impact";
		ctx.strokeText(timeText, PARAMS.PAGE_WIDTH- 50, 100);
		ctx.strokeStyle = 'Black';
		if (Math.floor(11 - this.elapsedTime) < 3) ctx.strokeStyle = 'Red';
		ctx.fillText(timeText, PARAMS.PAGE_WIDTH- 50, 100);
		// Air Time Text
		let airTimeText = "";
		airTimeText = "AIR TIME: " + Math.floor( this.game.player.airTime * 100 ) + " ";
		ctx.strokeStyle = 'White';
		ctx.font = "30px Impact";
		ctx.strokeText(airTimeText, PARAMS.PAGE_WIDTH - 50, 50);
		ctx.strokeStyle = 'Black';
		ctx.fillText(airTimeText, PARAMS.PAGE_WIDTH - 50, 50);
	};
}