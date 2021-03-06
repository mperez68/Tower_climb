// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor() {
        this.entities = [];
        this.showOutlines = false;
        this.ctx = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
		this.restart = false;
		
		// Mouse Flags
        /*this.click = null;
        this.mouse = null;
        this.wheel = null;*/
		
		// Keyboard Flags
		this.up = null;
		this.down = null;
		this.left = null;
		this.right = null;
		this.space = null;
    };

    init(ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        var that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    };

    startInput() {
        var that = this;
		
		// Keyboard Controls
		this.ctx.canvas.addEventListener("keydown", function (e) {
			//console.log("KeyDown");
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
				case "Space":
					event.preventDefault();
					if (!that.up) {
						that.up = true;
						//console.log('Jump Start');
						setTimeout(function () {
							that.up = false;
							//console.log('Jump End');
						}, 200)
					}
					break;
				case "KeyS":
				case "ArrowDown":
					that.down = true;
					break;
				case "KeyA":
				case "ArrowLeft":
					that.left = true;
					break;
				case "KeyD":
				case "ArrowRight":
					that.right = true;
					break;
				case "KeyR":
					that.restart = true;
					break;
			}
		}, false);
		
		this.ctx.canvas.addEventListener("keyup", function (e) {
			//console.log("KeyUp");
			switch (e.code) {
				case "KeyW":
				case "ArrowUp":
				case "Space":
					//that.up = false;
					break;
				case "KeyS":
				case "ArrowDown":
					that.down = false;
					break;
				case "KeyA":
				case "ArrowLeft":
					that.left = false;
					break;
				case "KeyD":
				case "ArrowRight":
					that.right = false;
					break;
			}
		}, false);
		
		// Mouse Controls
		/*
        var getXandY = function (e) {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            return { x: x, y: y };
        }
		
        this.ctx.canvas.addEventListener("mousemove", function (e) {
            //console.log(getXandY(e));
            that.mouse = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("click", function (e) {
            //console.log(getXandY(e));
            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("wheel", function (e) {
            //console.log(getXandY(e));
            that.wheel = e;
            //       console.log(e.wheelDelta);
            e.preventDefault();
        }, false);

        this.ctx.canvas.addEventListener("contextmenu", function (e) {
            //console.log(getXandY(e));
            that.rightclick = getXandY(e);
            e.preventDefault();
        }, false);*/
    };

    addEntity(entity) {
        this.entities.push(entity);
    };

    addEntityToFront(entity) {
        this.entities.unshift(entity);
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
		this.camera.draw(this.ctx);
    };

    update() {
		if (document.getElementById("myDebug").checked) {
			PARAMS.DEBUG = true;
		} else {
			PARAMS.DEBUG = false;
		}
		
        var entitiesCount = this.entities.length;

        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (var i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                this.entities.splice(i, 1);
            }
        }
		this.camera.update();
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
};