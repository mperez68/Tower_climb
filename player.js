class Player {
	constructor(game, x, y) {
		// Constants
		this.JUMP = 20;
		this.MAX_X = 20;
		this.X_ACCELERATION = 3;
		this.GRAVITY = 1;
		this.FRICTION = 1;
			// Size
		this.WIDTH = 500;
		this.HEIGHT = 500;
		this.SCALE = 0.3;
		Object.assign(this, { game, x, y });
		
		this.xSpeed = 0;
		this.ySpeed = 0;
		
		this.grounded = false;
		
		this.game.player = this;
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/player.png");
		
		this.animation = new Animator(this.spritesheet, 0, 0, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
		
		this.updateBB();
	}	//spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
	
	updateBB() {
		this.BB = new BoundingBox(this.x, this.y, this.WIDTH * this.SCALE, this.HEIGHT * this.SCALE);
	}
	
	update () {
		// Gravity
		if (this.y < PARAMS.PAGE_HEIGHT - (this.HEIGHT * this.SCALE)) {
			this.ySpeed += this.GRAVITY;
		} else {
			this.y = PARAMS.PAGE_HEIGHT - (this.HEIGHT * this.SCALE);
			this.ySpeed = 0;
			this.grounded = true;
		}
		
		// Friction
		if (this.xSpeed < -this.FRICTION) {
			this.xSpeed += this.FRICTION;
		} else if (this.xSpeed > this.FRICTION) {
			this.xSpeed -= this.FRICTION;
		} else {
			this.xSpeed = 0;
		}
		if (this.xSpeed > this.MAX_X) {
			this.xSpeed = this.MAX_X;
		} else if (this.xSpeed < -this.MAX_X) {
			this.xSpeed = -this.MAX_X;
		}
		
		// Acceleration
		if(this.game.up){
			if (this.grounded) {
				this.grounded = false;
				this.ySpeed -= this.JUMP;
			}
		} else if (this.game.down) {
			// nothing
		}
		if(this.game.left){
			// hold speed to left
			this.xSpeed -= this.X_ACCELERATION;
		} else if (this.game.right) {
			// hold speed to right
			this.xSpeed += this.X_ACCELERATION;
		}
		
		// Walls TODO move to collision
		if (this.x < 0 || this.x + this.WIDTH * this.SCALE > PARAMS.PAGE_WIDTH) {
			this.xSpeed = -this.xSpeed;
			console.log("bounce @ (" + this.x + "," + this.y + ")");
		}
		
		// Update Location
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		
		// Update Bounding Box
		this.updateBB();
		
		// Collisions
	}
	
	draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
		
		if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x - this.game.camera.x - (this.WIDTH * this.SCALE / 2), this.BB.y - this.game.camera.y - (this.WIDTH / 2), this.BB.width, this.BB.height);
        }
	}
}