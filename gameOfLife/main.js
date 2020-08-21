const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
let grid;

let COLS = 10;
let ROWS = 10;
let scale = 1;
resolution = {
  x: canvas.width / COLS,
  y: canvas.height / ROWS
};
let GAMESTATE = {
  firstTime: true,
  pause: true
};

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let pos = {
    x: 0,
    y: 0
  };
  pos.x = event.clientX - rect.left;
  pos.y = event.clientY - rect.top;
  markCell(pos.x, pos.y);
}

function markCell(x, y) {
  var xind = Number.parseInt(x / resolution.x);
  var yind = Number.parseInt(y / resolution.y);
  grid[xind][yind] = 1;
}
const handleClick = e => {
  getMousePosition(canvas, e);
};

document.getElementById("play").addEventListener("click", e => {
  e.preventDefault();
  if (GAMESTATE.firstTime) {
    GAMESTATE.firstTime = !GAMESTATE.firstTime;
    canvas.removeEventListener("click", handleClick);
  }
  if (GAMESTATE.pause === true) {
    document.getElementById("play").innerHTML = "Pause";
  } else {
    document.getElementById("play").innerHTML = "Play";
  }
  GAMESTATE.pause = !GAMESTATE.pause;
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("input-form").addEventListener("submit", e => {
    e.preventDefault();
    if (!GAMESTATE.pause) {
      document.getElementById("play").click();
    }
    GAMESTATE.firstTime = true;
    canvas.addEventListener("click", handleClick);

    scale = Number.parseInt(document.getElementById("scale").value);
    COLS = Number.parseInt(document.getElementById("cols").value) * scale;
    ROWS = Number.parseInt(document.getElementById("rows").value) * scale;
    resolution.x = canvas.width / COLS;
    resolution.y = canvas.height / ROWS;
    grid = buildGrid();
    requestAnimationFrame(update);
  });
});

function buildGrid() {
  return new Array(COLS)
    .fill(null)
    .map(() => new Array(ROWS).fill(null).map(() => 0));
}

function update() {
  grid = nextGen(grid);
  render(grid);
  requestAnimationFrame(update);
}

function nextGen(grid) {
  if (GAMESTATE.pause) {
    return grid;
  }
  const nextGen = grid.map(arr => [...arr]);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }

      // rules
      if (cell === 1 && numNeighbours < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbours > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbours === 3) {
        nextGen[col][row] = 1;
      }
    }
  }
  return nextGen;
}

function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if (x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS) {
            const currentNeighbour = grid[col + i][row + j];
            numNeighbours += currentNeighbour;
          }
        }
      }
      var cellColor = "green";
      if (cell === 1 && numNeighbours < 2) {
        cellColor = "red";
      } else if (cell === 1 && numNeighbours > 3) {
        cellColor = "red";
      }
      ctx.beginPath();
      ctx.rect(
        col * resolution.x,
        row * resolution.y,
        resolution.x,
        resolution.y
      );
      ctx.fillStyle = cell ? cellColor : "black";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.stroke();
    }
  }
}
