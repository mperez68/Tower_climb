class Background {
	constructor(game, x, y) {
		this.WIDTH = 768;
		this.HEIGHT = 1357;
		Object.assign(this, { game, x, y });
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Background-1.png");
		
		this.animation = new Animator(this.spritesheet, 0, 0, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
	}
	
	update() {
		//
	}
	
	draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, PARAMS.PAGE_WIDTH / this.WIDTH);
	}
}

class Platform {
	constructor(game, x, y, scale) {
		// Constants
		this.WIDTH = 202;
		this.HEIGHT = 98;
		this.SCALE = scale;
		
		Object.assign(this, { game, x, y });
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Platform-1.png");
		
		this.updateBB();
	}
	
	updateBB() {
		this.BB = new BoundingBox(this.x, this.y, this.WIDTH * this.SCALE, (this.HEIGHT - 35) * this.SCALE);
	}
	
	update() {
		//
		
		this.updateBB();
	}
	
	draw(ctx) {
		ctx.drawImage(this.spritesheet, 0, 0,
		    this.WIDTH, this.HEIGHT,
			this.x, this.y - this.game.camera.y,
			this.WIDTH * this.SCALE, this.HEIGHT * this.SCALE);
			
		if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
        }
	}
}