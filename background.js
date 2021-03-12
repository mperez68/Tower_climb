class Background {
	constructor(game, x, y, tier) {
		this.WIDTH = PARAMS.BG_WIDTH;
		this.HEIGHT = PARAMS.BG_HEIGHT;
		Object.assign(this, { game, x, y, tier });
		
		//console.log("./sprites/Background-" + this.pad(tier % PARAMS.VERSIONS, 1) + ".png");
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Background-" + this.pad(tier % PARAMS.VERSIONS, 2) + ".png");
		
		this.animation = new Animator(this.spritesheet, 0, 0, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
	}
	
	update() {
		//
	}
	
	draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, PARAMS.PAGE_WIDTH / this.WIDTH);
	}
	
	pad(num, size) {
		num = num.toString();
		while (num.length < size) num = "0" + num;
		return num;
	}
}

class Platform {
	constructor(game, x, y, scale, tier) {
		// Constants
		this.WIDTH = 202;
		this.HEIGHT = 98;
		this.SCALE = scale;
		
		Object.assign(this, { game, x, y, tier });
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Platform-" + this.pad(tier % PARAMS.VERSIONS, 2) + ".png");
		this.updateBB();
	}
	
	updateBB() {
		this.BB = new BoundingBox(this.x, this.y, this.WIDTH * this.SCALE, (this.HEIGHT - 35) * this.SCALE);
	}
	
	update() {
		if (this.game.camera.y + PARAMS.PAGE_HEIGHT < this.y) this.removeFromWorld = true;
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
	
	pad(num, size) {
		num = num.toString();
		while (num.length < size) num = "0" + num;
		return num;
	}
}