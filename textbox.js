class TextBox {
	constructor(game, x, y, displayText) {
		// Local variables
		Object.assign(this, { game, x, y, displayText });
	};
	
	update() {
		
	};
	
	draw(ctx) {
		// Displays whatever text is given.
		ctx.font = "30px Fantasy";
		ctx.textAlign = "center";
		ctx.strokeStyle = 'White';
		ctx.strokeText(this.displayText, this.x, this.y - this.game.camera.y);
		ctx.strokeStyle = 'White';
		ctx.fillText(this.displayText, this.x, this.y - this.game.camera.y);
	};
}