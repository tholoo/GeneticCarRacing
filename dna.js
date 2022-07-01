class Dna {
	constructor(n, maxVel) {
		this.genome = [];
		this.maxVel = maxVel;
		this.n = n;
		for (let i = 0; i < n; i++) {
			// let vel = new p5.Vector(0, 1);
			this.genome.push(this.randomVec());
		}
		this.deadInd;
	}
	mutate(rate) {
		let bd = floor(min(this.deadInd, this.n));
		for (let i = 0; i < bd; i++) {
			let change;
			if (i >= floor((this.deadInd * 3) / 4)) {
				change = random() < rate;
			} else {
				change = random() < rate / 0.6;
			}
			if (change) {
				this.genome[i] = this.randomVec();
			}
		}
	}
	crossover(partner) {
		let newDna = new Dna(this.n, this.maxVel);
		for (let i = 0; i < this.n; i++) {
			if (random() > 0.5) {
				newDna.genome[i] = this.genome[i];
			} else {
				newDna.genome[i] = partner.genome[i];
			}
		}
		return newDna;
	}

	randomVec() {
		let vel = p5.Vector.random2D();
		vel.setMag(random(this.maxVel));
		return vel;
	}
}
