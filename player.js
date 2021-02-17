class Player {
	constructor(game, x, y) {
		// Constants
		this.JUMP = 25;
		this.MAX_X = 15;
		this.X_ACCELERATION = 1;
		this.GRAVITY = 1;
		this.FRICTION = 0.5;
			// Size
		this.WIDTH = 50;
		this.HEIGHT = 60;
		this.SCALE = 1;
			// Bounding Box & Offsets
		this.BB_WIDTH = 30;
		this.BB_HEIGHT = 60;
		this.BB_WIDTH_OPFSET = (this.WIDTH - this.BB_WIDTH) / 2;
		this.BB_HEIGHT_OPFSET = (this.HEIGHT - this.BB_HEIGHT) / 2;
		Object.assign(this, { game, x, y });
		this.BB = null;
		this.lastBB = null;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.isSpinning = false;
		
		this.grounded = false;
		
		this.game.player = this;
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/player.png");
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/climber.png");
		
		this.standing = new Animator(this.spritesheet, 0, 0, this.WIDTH, this.HEIGHT, 3, 0.5, 0, false, true);
		this.runningRight = new Animator(this.spritesheet, this.WIDTH * 3, 0, this.WIDTH, this.HEIGHT, 4, 0.1, 0, false, true);
		this.runningLeft = new Animator(this.spritesheet, this.WIDTH * 3, this.HEIGHT, this.WIDTH, this.HEIGHT, 4, 0.1, 0, false, true);
		this.jumping = new Animator(this.spritesheet, this.WIDTH * 7, 0, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
		this.jumpingRight = new Animator(this.spritesheet, this.WIDTH * 8, 0, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
		this.jumpingLeft = new Animator(this.spritesheet, this.WIDTH * 8, this.HEIGHT, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
		this.spinningRight = new Animator(this.spritesheet, this.WIDTH * 11, 0, this.HEIGHT, this.HEIGHT, 6, 0.05, 0, false, true);
		this.spinningLeft = new Animator(this.spritesheet, this.WIDTH * 11, 0, this.HEIGHT, this.HEIGHT, 6, 0.05, 0, true, true);
		
		this.updateBB();
	}	//spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
	
	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x + this.BB_WIDTH_OPFSET, this.y - this.BB_HEIGHT_OPFSET, this.BB_WIDTH * this.SCALE, this.BB_HEIGHT * this.SCALE);
	}
	
	update () {
		// Gravity
		this.ySpeed += this.GRAVITY;
		
		// Friction
		if (this.grounded) {
			if (this.xSpeed < -this.FRICTION) {
				this.xSpeed += this.FRICTION;
			} else if (this.xSpeed > this.FRICTION) {
				this.xSpeed -= this.FRICTION;
			} else {
				this.xSpeed = 0;
			}
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
			this.xSpeed -= 0.3 * this.X_ACCELERATION;
			if (this.grounded) this.xSpeed -= 0.7 * this.X_ACCELERATION;
		} else if (this.game.right) {
			// hold speed to right
			this.xSpeed += 0.3 * this.X_ACCELERATION;
			if (this.grounded) this.xSpeed += 0.7 * this.X_ACCELERATION;
		}
		
		// Walls
		if (this.x < 0 || this.x + this.WIDTH * this.SCALE > PARAMS.PAGE_WIDTH) {
			this.xSpeed = -this.xSpeed / 2;
			if (this.game.up) {
				this.isSpinning = true;
				this.xSpeed += this.xSpeed;
				this.ySpeed -= this.JUMP * Math.abs(this.xSpeed / this.MAX_X);
			}
			this.x = Math.round(this.x / PARAMS.PAGE_WIDTH) * (PARAMS.PAGE_WIDTH - this.WIDTH * this.SCALE);
			//console.log("bounce @ (" + this.x + "," + this.y + ")");
		}
		
		// Update Location
		this.x += this.xSpeed;
		this.y += this.ySpeed;
		
		// Update Bounding Box
		this.updateBB();
		
		// Collision
		var that = this;
		this.game.entities.forEach(function (entity) {
			if (entity !== that && entity.BB && that.BB.collide(entity.BB)) {
				if (entity instanceof Platform && !that.game.down && that.lastBB.bottom <= entity.BB.top) {	// land on platform
					that.isSpinning = false;
					that.ySpeed = 0;
					that.y = entity.BB.top - that.BB.height - 1;
					that.grounded = true;
					that.updateBB;
				}
			}
		});
	}
	
	draw(ctx) {
		if (this.xSpeed > 0) {
			if (this.isSpinning) {
				this.spinningRight.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			} else if (!this.grounded) {
				this.jumpingRight.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			} else {
				this.runningRight.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			}
		} else if (this.xSpeed < 0) {
			if (this.isSpinning) {
				this.spinningLeft.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			} else if (!this.grounded) {
				this.jumpingLeft.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			} else {
				this.runningLeft.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			}
		} else {
			if (!this.grounded) {
				this.jumping.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			} else {
				this.standing.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
			}
		}
		
		
		if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y - this.game.camera.y, this.BB.width, this.BB.height);
			
			let coordText = "(" + Math.floor(this.BB.x) + "," + Math.floor(this.BB.y) + ")";
			ctx.strokeStyle = 'White';
			ctx.font = "30px Arial";
			ctx.strokeText(coordText, 50, 50);
			ctx.strokeStyle = 'Black';
			ctx.fillText(coordText, 50, 50);
        }
	}
}