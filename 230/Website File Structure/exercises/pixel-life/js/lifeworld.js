const lifeworld = {
    init(numCols, numRows, world = null) {
        this.numCols = numCols;
		this.numRows = numRows;
		this.world = world;
		this.worldBuffer = this.buildArray();

		if (!(this.world)) {
			this.world = this.buildArray();
			this.randomSetup();
		}
    },

    buildArray() {
        let outerArray = [];
        for (let row = 0; row < this.numRows; row++) {
            let innerArray = [];
            for (let col = 0; col < this.numCols; col++) {
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.world[row][col] = 0;
                if (Math.random() < 0.1/*(row + col) % 3 == 0*/)
                    this.world[row][col] = 1;
            }
        }
    },

    getLivingNeighbors(row, col) {
        if (row < 0 || col < 0 || row > this.numRows - 1 || col > this.numCols - 1)
            return 0;
        let neighbors = [];
        if ((row != 0 && col != 0) && (row < this.numRows - 1 && col < this.numCols - 1)) {
            neighbors.push(this.world[row - 1][col - 1]);
            neighbors.push(this.world[row - 1][col]);
            neighbors.push(this.world[row - 1][col + 1]);
            neighbors.push(this.world[row][col - 1]);
            neighbors.push(this.world[row][col + 1]);
            neighbors.push(this.world[row + 1][col - 1]);
            neighbors.push(this.world[row + 1][col]);
            neighbors.push(this.world[row + 1][col + 1]);
        }
        else if (row < this.numRows - 1 && col < this.numCols - 1) {
            neighbors.push(this.world[row][col + 1]);
            neighbors.push(this.world[row + 1][col]);
            neighbors.push(this.world[row + 1][col + 1]);
            if (row != 0) {
                neighbors.push(this.world[row - 1][col]);
                neighbors.push(this.world[row - 1][col + 1]);
            }
            if (col != 0) {
                neighbors.push(this.world[row][col - 1]);
                neighbors.push(this.world[row + 1][col - 1]);
            }
        }
        else if (row != 0 && col != 0) {
            neighbors.push(this.world[row - 1][col - 1]);
            neighbors.push(this.world[row - 1][col]);
            neighbors.push(this.world[row][col - 1]);
            if (row < this.numRows - 1) {
                neighbors.push(this.world[row + 1][col]);
                neighbors.push(this.world[row + 1][col - 1]);
            }
            if (col < this.numCols - 1) {
                neighbors.push(this.world[row][col + 1]);
                neighbors.push(this.world[row - 1][col + 1]);
            }
		}

        let sum = 0;
        for (let i = 0; i < neighbors.length; i++)
            sum += neighbors[i];
        return sum;
    },

    step() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                if (this.world[row][col] == 1) {
                    if (this.getLivingNeighbors(row, col) < 2 || this.getLivingNeighbors(row, col) > 3)
                        this.worldBuffer[row][col] = 0;
                    else
                        this.worldBuffer[row][col] = 1;
                }
                else if (this.world[row][col] == 0) {
                    if (this.getLivingNeighbors(row, col) == 3)
                        this.worldBuffer[row][col] = 1;
                    else
                        this.worldBuffer[row][col] = 0;
                }
            }
        }

        let temp = this.world;
        this.world = this.worldBuffer;
        this.worldBuffer = temp;
    }
}