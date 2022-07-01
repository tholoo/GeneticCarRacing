class Cell {
    constructor(x, y, cell_size) {
        this.x = x;
        this.y = y;
        this.s = cell_size;
        this.pos = new p5.Vector(this.x * this.s, this.y * this.s);
        this.middle = new p5.Vector(
            this.pos.x + this.s / 2,
            this.pos.y + this.s / 2
        );
        this.trackInd = -1;

        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.previous;
        this.neighbors = [];
    }
    addNeighbors() {
        this.neighbors = this.getNeighbors();
    }
    heuristic() {
        const d = dist(this.x, this.y, end.x, end.y);
        // const d = abs(this.x - end.x) + abs(this.y - end.y);
        this.g = d;
    }
    updateScores(newG, prev) {
        this.g = newG;
        this.heuristic();
        this.f = this.h + this.g;
        this.previous = prev;
    }
    isWall() {
        return this.trackInd === -1;
    }
    isStart() {
        return this.trackInd === 1;
    }
    getNeighbors() {
        let neighbors = [];

        if (this.x > 0) {
            const neighbor = grid[this.x - 1][this.y];
            if (neighbor.val !== 0) neighbors.push(neighbor); //* LEFT
        }
        if (this.x < cols - 1) {
            const neighbor = grid[this.x + 1][this.y];
            if (neighbor.val !== 0) neighbors.push(neighbor); //* RIGHT
        }
        if (this.y > 0) {
            const neighbor = grid[this.x][this.y - 1];
            if (neighbor.val !== 0) neighbors.push(neighbor); //* TOP
        }
        if (this.y < rows - 1) {
            const neighbor = grid[this.x][this.y + 1];
            if (neighbor.val !== 0) neighbors.push(neighbor); //* DOWN
        }

        return neighbors;
    }
    show() {
        noStroke()
        if (this.trackInd <= -1) {
            fill(0, 100);
        } else if (this.trackInd === 0) {
            stroke(255);
            fill(255);
        } else if (this.trackInd === 1) {
            fill(0, 255, 0);
        } else if (this.trackInd === 2) {
            fill(255, 165, 0);
        }
        rect(this.pos.x, this.pos.y, this.s);
    }
}