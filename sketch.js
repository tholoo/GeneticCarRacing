p5.disableFriendlyErrors = true;
let population;
const POPULATION_N = 250;
const MUTATION_RATE = 0.001;
// const CELL_SIZE = 20;
const CELL_NUM = 25;
const CAR_SPEED = 5;
let CAR_SIZE = 4;
const CORPSE_AMOUNT = 50;
let START_CELL;
let FINISH_CELL;

let BRUSH_SIZE = 50;
let BRUSH_STEP = 10;
let CELL_SIZE;

config = new(function() {
    this.iters = 1;
    this.obstacle_size = 1;
})();

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    gui = new dat.GUI();

    CELL_SIZE = width / 30
    BRUSH_SIZE = CELL_SIZE
    BRUSH_STEP = BRUSH_SIZE / 2
    CAR_SIZE = CELL_SIZE / 5
    cols = width / CELL_SIZE;
    rows = height / CELL_SIZE;
    grid = [];
    for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
            grid[x][y] = new Cell(x, y, CELL_SIZE, 0);
        }
    }
    noStroke();
    track = [];
    // createDiv('Drag mouse to create track');
    // createDiv('Press D to delete track cell');
    // createDiv('Press S to specify starting cell');
    // createDiv('Press F to specify finishing cell');
    // createDiv('Press N to create the default track');
    // createDiv('Press O to create obstacle');
    // createDiv('Press B to begin');
    obst_size = (CELL_SIZE * 3) / 4;
    config.obstacle_size = obst_size

    gui.add(config, 'iters', 1, 500, 1);
    gui.add(config, 'obstacle_size', 1, floor(CELL_SIZE * 4), 1)

    // createDefaultTrack();
    // obst_size_input = createInput(str(obst_size));
    obsts = [];

    track_started = false;
    initilized = false;
}

function draw() {
    background(50);
    if (track.length > 0) {
        for (let epoch = 0; epoch < config.iters; epoch++) {
            const done = population.update();
            if (done === true) {
                population.getFitness();
                // print(population.maxFitness);
                population.nextGeneration();
            }
        }
        for (let i = 0; i < track.length; i++) {
            const cell = track[i];
            cell.show();
        }

        population.show();
    } else {
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let cell = grid[x][y];
                cell.show();
            }
        }
        showBrush();
    }
    obst_size = config.obstacle_size;
    for (let obst of obsts) {
        obst.show();
    }
}

function showBrush() {
    push();
    stroke(255);
    fill(255, 20);
    strokeWeight(2);
    ellipse(mouseX, mouseY, BRUSH_SIZE);
    pop();
}

function mouseWheel(event) {
    if (event.delta < 0) {
        BRUSH_SIZE += BRUSH_STEP;
    } else {
        BRUSH_SIZE -= BRUSH_STEP;
    }
    BRUSH_SIZE = constrain(BRUSH_SIZE, 1, width * height)
}

function mouseDragged() {
    let [mX, mY] = getMouseXY();
    if (mX !== false) {
        // grid[mX][mY].trackInd = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                const cell = grid[x][y];
                const BR = BRUSH_SIZE / 2;
                const V = new p5.Vector(mouseX, mouseY);
                if (
                    distSq(cell.middle, V) <
                    BR * BR + (cell.s / 2) * (cell.s / 2)
                ) {
                    if (cell.trackInd === 1) {
                        START_CELL = undefined
                    } else if (cell.trackInd === 2) {
                        FINISH_CELL = undefined
                    }
                    cell.trackInd = 0;
                }
            }
        }
    }
}

function keyPressed() {
    if (key == 'n' && !track_started) {
        createDefaultTrack(); //* Create the default track
    } else if (key == 'o') {
        const obst = new Obst(mouseX, mouseY, obst_size);
        obsts.push(obst); //* Add obstacle
    } else {
        let [mX, mY] = getMouseXY();
        if (mX !== false && !track_started) {
            const cell = grid[mX][mY];
            if (cell.trackInd > -1) {
                if (key === 's' && !START_CELL) {
                    cell.trackInd = 1; //* Start
                    START_CELL = cell;
                } else if (key === 'f' && !FINISH_CELL) {
                    cell.trackInd = 2; //* Finish
                    FINISH_CELL = cell;
                }
            }
            if (key === 'd') {
                cell.trackInd = -1; //* Delete Cell
            }
            if (key === 'b' && START_CELL && FINISH_CELL) {
                startTrack(START_CELL.x, START_CELL.y);
            }
        }
    }
}

function startTrack(x, y) {
    if (grid[x][y].isStart()) {
        track_started = true;
        getTrack();
        population = new Population(
            START_CELL.middle,
            POPULATION_N,
            MUTATION_RATE,
            track,
            CAR_SPEED,
            CAR_SIZE,
            CORPSE_AMOUNT
        );
        initilize();
        initilized = true;
    }
}

function createDefaultTrack() {
    if (track_started) {
        return;
    }
    let first = [
        floor(rows / 2 - rows / 4),
        floor(cols / 2 - cols / 4),
    ];
    let second = [
        floor(rows / 2 + rows / 4),
        floor(cols / 2 - cols / 4),
    ];
    let third = [
        floor(rows / 2 + rows / 4),
        floor(cols / 2 + cols / 4),
    ];
    let fourth = [
        floor(rows / 2 - rows / 4),
        floor(cols / 2 + cols / 4),
    ];

    for (let i = first[0]; i < second[0]; i++) {
        let cell = grid[first[1]][i];
        cell.trackInd = 0;
    }
    for (let i = second[1]; i < third[1]; i++) {
        let cell = grid[i][second[0]];
        cell.trackInd = 0;
    }
    for (let i = third[0]; i > fourth[0]; i--) {
        let cell = grid[third[1]][i];
        cell.trackInd = 0;
    }
    for (let i = fourth[1]; i > first[1]; i--) {
        let cell = grid[i][fourth[0]];
        cell.trackInd = 0;
    }
    START_CELL = grid[first[1]][first[0]];
    FINISH_CELL = grid[fourth[1]][fourth[0]];
    START_CELL.trackInd = 1;
    FINISH_CELL.trackInd = 2;
    startTrack(first[1], first[0]);
    randomObsts();
}

function getTrack() {
    for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
            const cell = grid[x][y];
            const i = cell.trackInd;
            if (i > -1) {
                if (i === 1) {
                    START_CELL = cell;
                } else if (i === 2) {
                    FINISH_CELL = cell;
                }
                track.push(cell);
            }
        }
    }
}

function randomObsts() {
    for (let cell of track) {
        if (
            random() > 0.5 &&
            cell !== START_CELL &&
            cell !== FINISH_CELL
        ) {
            const o_size = random(5, obst_size);
            const xOffset = random((obst_size * 2) / 3);
            const yOffset = random((obst_size * 2) / 3);
            const obst = new Obst(
                cell.middle.x + xOffset,
                cell.middle.y + yOffset,
                o_size
            );
            obsts.push(obst);
        }
    }
}

function getMouseXY() {
    if (mouseX < width && mouseY < height) {
        let mX = floor(mouseX / CELL_SIZE);
        let mY = floor(mouseY / CELL_SIZE);
        return [mX, mY];
    }
    return [false, false];
}

function distSq(pos1, pos2) {
    let dx = pos1.x - pos2.x;
    let dy = pos1.y - pos2.y;
    return dx * dx + dy * dy;
}

// function resetPreviouses() {
// 	for (let i = 0; i < cols; i++) {
// 		for (let j = 0; j < rows; j++) {
// 			grid[i][j].previous = undefined;
// 		}
// 	}
// }
function initilize(s = START_CELL, e = FINISH_CELL) {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].addNeighbors();
            grid[i][j].previous = undefined;
        }
    }

    start = s;
    end = e;

    openSet = [start];
    closedSet = [];
    optimal_path = [];

    found_end = false;
}

function A_step() {
    if (openSet.length > 0) {
        let lowest = 0;
        for (let i = 0; i < openSet.length; i++) {
            const spot = openSet[i];
            if (spot.f < openSet[lowest].f) {
                lowest = i;
            }
        }
        const lowestI = lowest;
        lowest = openSet[lowest];

        if (!found_end) {
            optimal_path = [];
            let prev = lowest.previous;
            optimal_path.push(lowest);
            while (prev) {
                optimal_path.push(prev);
                prev = prev.previous;
            }
        }

        if (lowest === end) {
            // console.log('Done:', str(optimal_path.length), 'Cells');
            found_end = true;
            return optimal_path.length;
        }

        removeFromArray(openSet, lowestI);
        closedSet.push(lowest);
        if (lowest.neighbors.length > 0) {
            for (const neighbor of lowest.neighbors) {
                if (!closedSet.includes(neighbor) && !neighbor.isWall()) {
                    let theG = lowest.g + 1;
                    if (openSet.includes(neighbor)) {
                        if (theG < neighbor.g) {
                            neighbor.updateScores(theG, lowest);
                        }
                    } else {
                        neighbor.updateScores(theG, lowest);
                        openSet.push(neighbor);
                    }
                }
            }
        }
    } else {
        return -1;
    }
}

function removeFromArray(arr, index) {
    if (index >= 0) arr.splice(index, 1);
}