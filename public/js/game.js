const CELL_SIZE = 10;
const WIDTH = 640;
const HEIGHT = 480;

let state = [];

function initialize() {
  // Initialize the game state here.
  state = createInitialState();
}

function update() {
  // Update the game state here.
  state = getNextState(state);
}

function draw(context) {
  // Draw the game state on the canvas context.
  context.clearRect(0, 0, WIDTH, HEIGHT);
  for (let y = 0; y < state.length; y++) {
    for (let x = 0; x < state[y].length; x++) {
      if (state[y][x] === 1) {
        context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function createInitialState() {
  // Create and return the initial game state here.
  const rows = HEIGHT / CELL_SIZE;
  const cols = WIDTH / CELL_SIZE;
  const state = new Array(rows);
  for (let y = 0; y < rows; y++) {
    state[y] = new Array(cols).fill(0);
  }
  state[0][0] = 1;
  state[1][1] = 1;
  state[2][1] = 1;
  state[2][2] = 1;
  state[3][1] = 1;
  return state;
}

function getNextState(currentState) {
  // Calculate and return the next game state based on the current state.
  const rows = currentState.length;
  const cols = currentState[0].length;
  const nextState = new Array(rows);
  for (let y = 0; y < rows; y++) {
    nextState[y] = new Array(cols).fill(0);
  }
  // Calculate the next state here.
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countNeighbors(currentState, x, y);
      if (currentState[y][x] === 1 && neighbors >= 2 && neighbors <= 3) {
        nextState[y][x] = 1;
      } else if (currentState[y][x] === 0 && neighbors === 3) {
        nextState[y][x] = 1;
      }
    }
  }
  return nextState;
}

function countNeighbors(state, x, y) {
  // Count the number of live neighbors for the cell at (x, y).
  const rows = state.length;
  const cols = state[0].length;
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const neighborY = y + i;
      const neighborX = x + j;
      if (
        neighborY >= 0 &&
        neighborY < rows &&
        neighborX >= 0 &&
        neighborX < cols &&
        !(i === 0 && j === 0)
      ) {
        count += state[neighborY][neighborX];
      }
    }
  }
  return count;
}

export default {
  initialize,
  update, 
  draw
};