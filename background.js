class Background {
	constructor(game, x, y) {
		Object.assign(this, { game, x, y });
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Background-1.png");
	}
	
	update() {
		//
	}
	
	draw(ctx) {
		let xMidpoint = PARAMS.PAGE_WIDTH / 2;
		
		ctx.drawImage(this.spritesheet, PARAMS.BG_WIDTH / 2 - xMidpoint, 0,
		    PARAMS.BG_WIDTH, PARAMS.PAGE_HEIGHT,
			this.x, this.y - this.game.camera.y,
			PARAMS.BG_WIDTH, PARAMS.PAGE_HEIGHT);
	}
}

class Platform {
	constructor(game, x, y) {
		// Constants
		this.WIDTH = 202;
		this.HEIGHT = 98;
		
		Object.assign(this, { game, x, y });
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Platform-1.png");
	}
	
	update() {
		//
	}
	
	draw(ctx) {
		ctx.drawImage(this.spritesheet, 0, 0,
		    this.WIDTH, this.HEIGHT,
			this.x, this.y - this.game.camera.y,
			this.WIDTH, this.HEIGHT);
	}
}