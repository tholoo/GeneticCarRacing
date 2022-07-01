class Obst {
	constructor(x, y, size) {
		this.pos = new p5.Vector(x, y);
		this.size = size;
		this.hsize = this.size / 2;
	}
	colliding(car) {
		if (
			car.middle.x > this.pos.x - this.hsize &&
			car.middle.x < this.pos.x + this.hsize
		) {
			if (
				car.middle.y > this.pos.y - this.hsize &&
				car.middle.y < this.pos.y + this.hsize
			) {
				return true;
			}
		}
		return false;
	}
	show() {
		push();
		rectMode(CENTER);
		stroke(50, 255);
		fill(0);
		rect(this.pos.x, this.pos.y, this.size, this.size);
		pop();
	}
}
