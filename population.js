class Population {
	constructor(
		start_pos,
		n,
		m_rate,
		track,
		car_speed = 3,
		car_size = 4,
		corpseAmount = 50
	) {
		this.start_pos = start_pos;
		this.car_size = car_size;
		this.car_speed = car_speed;
		this.n = n;
		this.m_rate = m_rate;
		this.track = track;
		this.corpseAmount = corpseAmount;
		this.maxFitness = 0;
		this.sumFitness = 0;
		this.cars = [];
		this.deadCars = [];
		this.makeRandomCars();
	}
	makeRandomCars() {
		for (let i = 0; i < this.n; i++) {
			const car = this.makeCar();
			this.cars.push(car);
		}
	}
	makeCar(dna = undefined) {
		const car = new Car(
			this.start_pos.x,
			this.start_pos.y,
			this.track.length,
			dna,
			this.car_speed,
			this.car_size
		);
		return car;
	}
	update() {
		let newCars = [];

		for (let i = 0; i < this.cars.length; i++) {
			const car = this.cars[i];
			const dead = car.update(this.track);
			if (dead) {
				this.deadCars.push(car);
			} else {
				newCars.push(car);
			}
		}
		this.cars = newCars;
		return this.cars.length === 0;
	}
	getFitness() {
		this.bestCars = [];
		this.maxFitness = 0;
		this.sumFitness = 0;
		for (let i = 0; i < this.deadCars.length; i++) {
			const car = this.deadCars[i];
			const fitness = car.getFitness();
			this.sumFitness += fitness;
			if (fitness > this.maxFitness) {
				this.maxFitness = fitness;
			}
			if (fitness > 0) {
				this.bestCars.push(car);
			}
		}
	}
	nextGeneration() {
		if (this.maxFitness > 0) {
			let newCars = [];
			for (let i = 0; i < this.n; i++) {
				const parentA = this.selectOne();
				const parentB = this.selectOne();
				const bestDNA = parentA.crossover(parentB);
				bestDNA.deadInd = (parentA.deadInd + parentB.deadInd) / 2;
				bestDNA.mutate(this.m_rate);
				const car = this.makeCar(bestDNA);
				newCars.push(car);
			}
			this.cars = newCars;
		} else {
			this.makeRandomCars();
		}
		this.deadCars = [];
	}
	selectOne() {
		let rand = random(this.sumFitness);
		let index = -1;
		let theChosenOne;
		while (rand >= 0) {
			index++;
			theChosenOne = this.bestCars[index];
			rand -= theChosenOne.fitness;
		}
		return theChosenOne.dna;
	}
	showCorpses() {
		let corpses = this.deadCars.slice(-this.corpseAmount);
		for (let i = 0; i < corpses.length; i++) {
			const deadCar = corpses[i];
			deadCar.show();
		}
	}
	show() {
		for (let i = 0; i < this.cars.length; i++) {
			const car = this.cars[i];
			car.show();
		}
		this.showCorpses();
	}
}
