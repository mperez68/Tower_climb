class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	isLeft(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.x < oth.x) returnFlag = true;
		} else {
			if (this.x < oth) returnFlag = true;
		}
		return returnFlag;
	}
	
	isRight(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.x > oth.x) returnFlag = true;
		} else {
			if (this.x > oth) returnFlag = true;
		}
		return returnFlag;
	}
	
	isAbove(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.y < oth.y) returnFlag = true;
		} else {
			if (this.y < oth) returnFlag = true;
		}
		return returnFlag;
	}
	
	isBelow(oth) {
		var returnFlag = false;
		if (oth instanceof Point) {
			if (this.y > oth.y) returnFlag = true;
		} else {
			if (this.y > oth) returnFlag = true;
		}
		return returnFlag;
	}
}


// Pedestrian, Buildings, Finish Lines, etc.
class BoundingBox {
    constructor(x, y, width, height) {
        Object.assign(this, { x, y, width, height });

        this.left = x;
        this.top = y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };

    collide(oth) {
        if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) return true;
        return false;
    };
};


// Vehicles
class AngleBoundingBox {
    constructor(x, y, width, height, direction) {
        Object.assign(this, { x, y, width, height });
		
		this.direction = direction;
		
		this.radians = [ (this.direction) * (Math.PI / 180) + Math.atan(this.width / this.height ),
						(this.direction) * (Math.PI / 180) - Math.atan(this.width / this.height ),
						(this.direction - 180) * (Math.PI / 180) + Math.atan(this.width / this.height ),
						(this.direction - 180) * (Math.PI / 180) - Math.atan(this.width / this.height ) ];
			
		this.distance = Math.sqrt( Math.pow( this.width / 2 , 2) + Math.pow( this.height / 2 , 2)  );
		
        this.left = new Point (x, y);
        this.top = new Point (x, y);
        this.right = new Point (x, y);
        this.bottom = new Point (x, y);
		
		this.points = [];
		for (var i = 0; i < this.radians.length; i++) {
			let temp = new Point(this.x + (Math.sin(this.radians[i]) * this.distance),
									this.y - (Math.cos(this.radians[i]) * this.distance));
			this.points[i] = temp;
			if (temp.isLeft(this.left)) this.left = temp;
			if (temp.isRight(this.right)) this.right = temp;
			if (temp.isAbove(this.top)) this.top = temp;
			if (temp.isBelow(this.bottom)) this.bottom = temp;
		};
    };

    collide(oth) {
        if (this.right.isRight(oth.left) && this.left.isLeft(oth.right) && this.top.isAbove(oth.bottom) && this.bottom.isBelow(oth.top)) return true;
        return false;
    };
};