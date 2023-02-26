/* eslint-disable require-jsdoc */
const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const app = express();

// eslint-disable-next-line new-cap
const http = require("http").Server(app);
const io = require("socket.io")(http);

const COLS = 260;
const ROWS = 140;

let state;

const csp = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};
app.use(helmet.contentSecurityPolicy(csp));
app.use(cors());

app.get("/", (req, res) => {
  const indexPath = path.join(process.cwd(), "/index.html");
  console.log(indexPath);
  res.sendFile(indexPath);
});

// Handle socket.io connections
let connectionCount = 0;
io.on("connection", (socket) => {
  connectionCount++;
  console.log(connectionCount);
  if (connectionCount <= 1) {
    socket.emit("initialState", state = createInitialState());
  } else {
    socket.emit("drawState", state = getNextState(state));
  }
  console.log("New client connected.");
  socket.emit("connected");

  socket.on("buttonClicked", () => {
    socket.emit("nextState", state = getNextState(state));
    socket.emit("drawState", state);
    socket.broadcast.emit("drawState", state);
  });

  socket.on("mouseMoved", () => {
    socket.emit("updateClientState", state);
  });

  socket.on("reDraw", () => {
    socket.emit("drawState", state);
  });

  socket.on("printState", () => {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (state[y][x] === 1) {
          console.log(`state[${y}][${x}] = 1;`);
        }
      }
    }
  });

  socket.on("canvasClicked", (arg) => {
    const y = (Math.ceil(arg[0] / 10));
    const x = (Math.ceil(arg[1] / 10));

    if (state[y-1][x-1] === 0) {
      state[y-1][x-1] = 1;
    } else {
      state[y-1][x-1] = 0;
    }

    socket.emit("drawState", state);
    socket.broadcast.emit("drawState", state);
  });

  socket.on("disconnect", () => {
    connectionCount--;
    console.log("User disconnected...");
  });
});

// Serve the static files from the public directory
app.use(express.static(path.join(process.cwd(), "js")));

// Start the server
const port = 8080;
http.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function createInitialState() {
  // Create and return the initial game state here.
  const state = new Array(ROWS);
  for (let y = 0; y < ROWS; y++) {
    state[y] = new Array(COLS).fill(0);
  }
  state[5][23] = 1;
  state[5][24] = 1;
  state[5][29] = 1;
  state[5][30] = 1;
  state[6][23] = 1;
  state[6][25] = 1;
  state[6][28] = 1;
  state[6][30] = 1;
  state[7][25] = 1;
  state[7][28] = 1;
  state[8][24] = 1;
  state[8][29] = 1;
  state[9][24] = 1;
  state[9][25] = 1;
  state[9][28] = 1;
  state[9][29] = 1;
  state[10][26] = 1;
  state[10][27] = 1;
  state[11][18] = 1;
  state[11][19] = 1;
  state[12][19] = 1;
  state[13][19] = 1;
  state[13][21] = 1;
  state[14][17] = 1;
  state[14][18] = 1;
  state[14][20] = 1;
  state[14][21] = 1;
  state[14][27] = 1;
  state[15][16] = 1;
  state[15][18] = 1;
  state[15][26] = 1;
  state[15][28] = 1;
  state[16][16] = 1;
  state[16][18] = 1;
  state[16][26] = 1;
  state[16][28] = 1;
  state[16][29] = 1;
  state[17][14] = 1;
  state[17][15] = 1;
  state[17][17] = 1;
  state[17][19] = 1;
  state[17][20] = 1;
  state[18][15] = 1;
  state[18][17] = 1;
  state[18][21] = 1;
  state[18][27] = 1;
  state[18][28] = 1;
  state[18][29] = 1;
  state[18][30] = 1;
  state[19][15] = 1;
  state[19][17] = 1;
  state[19][19] = 1;
  state[19][21] = 1;
  state[19][27] = 1;
  state[19][29] = 1;
  state[20][12] = 1;
  state[20][13] = 1;
  state[20][15] = 1;
  state[21][12] = 1;
  state[21][15] = 1;
  state[21][17] = 1;
  state[22][14] = 1;
  state[22][20] = 1;
  state[23][15] = 1;
  state[23][16] = 1;
  state[23][17] = 1;
  state[23][18] = 1;
  state[23][19] = 1;
  state[25][14] = 1;
  state[25][16] = 1;
  state[25][17] = 1;
  state[26][14] = 1;
  state[26][15] = 1;
  state[26][17] = 1;

  return state;
}

function getNextState(currentState) {
  // Calculate and return the next game state based on the current state.
  const nextState = new Array(ROWS);
  for (let y = 0; y < ROWS; y++) {
    nextState[y] = new Array(COLS).fill(0);
  }

  // Calculate the next state here.
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const neighbors = countNeighbors(currentState, x, y);


      if (currentState[y][x] === 1 && neighbors >= 2 && neighbors <= 3) {
        nextState[y][x] = 1;
      } else if (currentState[y][x] === 0 && neighbors === 3) {
        nextState[y][x] = 1;
      } else {
        nextState[y][x] = 0;
      }
    }
  }
  return nextState;
}

function countNeighbors(state, x, y) {
  // Count the number of live neighbors for the cell at (x, y).
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const neighborY = y + i;
      const neighborX = x + j;
      if (
        neighborY >= 0 &&
        neighborY < ROWS &&
        neighborX >= 0 &&
        neighborX < COLS &&
        !(i === 0 && j === 0)
      ) {
        count += state[neighborY][neighborX];
      }
    }
  }
  return count;
}