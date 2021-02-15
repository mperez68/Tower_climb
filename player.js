class Player {
	constructor(game, x, y) {
		// Constants
		this.JUMP = 25;
		this.MAX_X = 20;
		this.X_ACCELERATION = 1;
		this.GRAVITY = 1;
		this.FRICTION = 0.5;
			// Size
		this.WIDTH = 500;
		this.HEIGHT = 500;
		this.SCALE = 0.1;
		Object.assign(this, { game, x, y });
		
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.jumpIntensity = 0;
		
		this.grounded = false;
		
		this.game.player = this;
		
		this.spritesheet = ASSET_MANAGER.getAsset("./sprites/player.png");
		
		this.animation = new Animator(this.spritesheet, 0, 0, this.WIDTH, this.HEIGHT, 1, 1, 0, false, true);
		
		this.lastBB = new BoundingBox(this.x, this.y, this.WIDTH * this.SCALE, this.HEIGHT * this.SCALE);
		this.updateBB();
	}	//spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
	
	updateBB() {
		this.lastBB = this.BB;
		this.BB = new BoundingBox(this.x, this.y, this.WIDTH * this.SCALE, this.HEIGHT * this.SCALE);
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
		
		// Walls TODO move to collision
		if (this.x < 0 || this.x + this.WIDTH * this.SCALE > PARAMS.PAGE_WIDTH) {
			this.xSpeed = -this.xSpeed / 2;
			if (this.game.up) {
				this.xSpeed += this.xSpeed;
				this.ySpeed -= this.JUMP * Math.abs(this.xSpeed / this.MAX_X);
				console.log(Math.abs(this.xSpeed / this.MAX_X));
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
					that.ySpeed = 0;
					that.y = entity.BB.top - that.BB.height - 1;
					that.grounded = true;
					that.updateBB;
				}
			}
		});
	}
	
	draw(ctx) {
		this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y - this.game.camera.y, this.SCALE);
		
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