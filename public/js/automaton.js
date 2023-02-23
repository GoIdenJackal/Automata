// Define the size of the grid
const gridSize = 100;

// Define the size of each cell
const cellSize = 5;

// Create the initial grid
let grid = new Array(gridSize).fill(0).map(() => new Array(gridSize).fill(0));

// Set the initial state of the grid
grid[Math.floor(gridSize / 2)][0] = 1;

// Define the rules for updating the grid
function updateGrid() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i == 0 && j == 0) {
            continue;
          }
          let nx = x + i;
          let ny = y + j;
          if (nx < 0) {
            nx = gridSize - 1;
          } else if (nx >= gridSize) {
            nx = 0;
          }
          if (ny < 0) {
            ny = gridSize - 1;
          } else if (ny >= gridSize) {
            ny = 0;
          }
          neighbors += grid[nx][ny];
        }
      }
      if (grid[x][y] == 0 && neighbors == 3) {
        grid[x][y] = 1;
      } else if (grid[x][y] == 1 && (neighbors < 2 || neighbors > 3)) {
        grid[x][y] = 0;
      }
    }
  }
}

// Draw the current state of the grid on the canvas
function drawGrid(ctx) {
  ctx.clearRect(0, 0, gridSize * cellSize, gridSize * cellSize);
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (grid[x][y] == 1) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

// Animate the cellular automaton
function animate(ctx) {
  updateGrid();
  drawGrid(ctx);
  requestAnimationFrame(() => animate(ctx));
}

// Get the canvas element and start the animation
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
animate(ctx);
ctx.fillRect(10, 10, 10, 10);