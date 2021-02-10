class Player {
	constructor(game, x, y) {
		// Constants
		this.JUMP = 10;
		this.MAX_X = 20;
		this.X_ACCELERATION = 3;
		this.GRAVITY = 1;
		this.FRICTION = 1;
			// Size
		this.WIDTH = 500;
		this.HEIGHT = 500;
		this.SCALE = 0.3;
		this.PAGE_HEIGHT = 900;
		this.PAGE_WIDTH = 768;
		Object.assign(this, { game, x, y });
		
		this.xSpeed = 0;
		this.ySpeed = 0;
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/player.png");
		
		this.animation = new Animator(this.spritesheet, 0, 0, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
	}	//spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
	
	update () {
		// Gravity Tick
		if (this.y < this.PAGE_HEIGHT - (this.HEIGHT * this.SCALE)) {
			this.ySpeed += this.GRAVITY;
		} else {
			this.y = this.PAGE_HEIGHT - (this.HEIGHT * this.SCALE);
			this.ySpeed = 0;
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
			if (this.ySpeed <= 1) {
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
		if (this.x < 0 || this.x + this.WIDTH * this.SCALE > this.PAGE_WIDTH) {
			this.xSpeed = -this.xSpeed;
		}
		
		// Update Location
		this.x += this.xSpeed;
		this.y += this.ySpeed;
	}
	
	draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.SCALE);
	}
}