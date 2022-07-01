class Car {
    constructor(
        x,
        y,
        track_length,
        dna = undefined,
        speed = 3,
        size = 4
    ) {
        this.pos = new p5.Vector(x, y);
        this.startingPos = this.pos.copy();
        this.speed = speed;
        this.size = size;
        this.w = 3;
        this.track_length = track_length;
        this.middle = new p5.Vector(this.pos.x / 2, this.pos.y);
        this.acc = new p5.Vector();
        this.vel = new p5.Vector();
        if (dna !== undefined) {
            this.dna = dna;
        } else {
            this.dna = new Dna(track_length * 30, speed);
        }

        this.dnaInd = 0;
        this.isDead = false;
        this.fitness = 0;
        this.collided_with = 0;
        this.prevCellOn;
        this.cellOn;
    }
    applyForce(force) {
        this.acc.add(force);
    }
    getFitness() {
        let fitness = 0;
        let Adist;

        initilize(this.prevCellOn);
        while (Adist === undefined) {
            Adist = A_step();
        }
        if (Adist === -1) console.log('AAAAAAAAA');
        // const distance = distSq(this.middle, FINISH_CELL.middle) + 1;
        // const distance =
        // 	Math.abs(FINISH_CELL.middle.x - this.middle.x) -
        // 	Math.abs(FINISH_CELL.middle.y - this.middle.y);
        fitness += (1 / Adist) * 100;
        // fitness += (1 / distance) * 10000;
        // fitness += distance;
        fitness -= this.collided_with * 30;
        if (this.isInCell(FINISH_CELL)) {
            fitness *= 2;
        }
        if (fitness < 0) fitness = 0;
        this.fitness = pow(fitness, 4);
        // print(
        // 	'Distance:',
        // 	distance,
        // 	'Fitness:',
        // 	fitness,
        // 	'this.fitness',
        // 	this.fitness
        // );
        return this.fitness;
    }
    update(cells) {
        // this.pos.x = mouseX;
        // this.pos.y = mouseY;
        if (!this.isDead) {
            this.prevCellOn = this.cellOn;
            if (this.dnaInd < this.dna.n) {
                this.applyForce(this.dna.genome[this.dnaInd]);
                this.dnaInd++;
            }
            this.vel.add(this.acc);
            this.vel.limit(this.speed);
            this.pos.add(this.vel);
            this.acc.mult(0);

            this.middle = new p5.Vector(
                this.pos.x + (this.size * this.w) / 2,
                this.pos.y
            );

            const dead = this.dead(cells);
            this.isDead = dead;
            if (this.isDead) {
                this.dna.deadInd = this.dnaInd;
            }
        }
        if (initilized) A_step();
        return this.isDead;
    }
    closestCell(cells) {
        let closestD = Infinity;
        let closest;
        for (const cell of cells) {
            const d = distSq(cell.middle, this.middle);
            if (d < closestD) {
                closestD = d;
                closest = cell;
            }
        }
        return closest;
    }
    isInCell(cell) {
        // fill(0, 255, 0);
        // ellipse(cell.middle.x, cell.middle.y, 10);
        if (
            this.middle.x >= cell.pos.x &&
            this.middle.x <= cell.pos.x + cell.s
        ) {
            if (
                this.middle.y >= cell.pos.y &&
                this.middle.y <= cell.pos.y + cell.s
            ) {
                return true;
            }
        }
        return false;
    }
    dead(cells) {
        if (this.pos.x < 0 || this.pos.x > width) return true;
        if (this.pos.y < 0 || this.pos.y > height) return true;

        this.collided_with = 0;
        for (let obst of obsts) {
            if (obst.colliding(this)) {
                this.collided_with++;
                break;
            }
        }
        const closest_cell = this.closestCell(cells);
        const is_in_cell = this.isInCell(closest_cell);
        if (is_in_cell) this.cellOn = closest_cell;
        if (this.collided_with > 0) return true;
        return !is_in_cell;
    }
    show() {
        push();
        translate(this.middle.x, this.middle.y);

        rotate(this.vel.heading());
        if (this.isDead) {
            stroke(100, 0, 0, 150);
            fill(255, 0, 0, 175);
        } else {
            stroke(0, 150);
            fill(255);
        }
        triangle(
            (this.size * this.w) / 2,
            0,
            (-this.size * this.w) / 2,
            this.size,
            (-this.size * this.w) / 2, -this.size
        );
        pop();
        // push();
        // noFill();
        // strokeWeight(CELL_SIZE / 3);
        // stroke(175, 175, 220);
        // beginShape();
        // for (let spot of optimal_path) {
        // 	vertex(spot.middle.x, spot.middle.y);
        // }
        // endShape();
        // pop();
    }
}