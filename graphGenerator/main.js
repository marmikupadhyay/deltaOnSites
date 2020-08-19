var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var input = document.getElementById("eqn");
var width = canvas.width;
var height = canvas.height;
var flag;

document.getElementById("input-form").addEventListener("submit", e => {
  e.preventDefault();
  plot();
});

//Function to draw
const draw = () => {
  if (null == canvas || !canvas.getContext) return;

  var axes = {};
  axes.x = 0.5 + 0.5 * canvas.width;
  axes.y = 0.5 + 0.5 * canvas.height;
  axes.drawneg = true;
  showAxes(ctx, axes);
};

// Function to show the aces and the quadrants , called at the beginning
const showAxes = (ctx, axes) => {
  var x = axes.x,
    w = ctx.canvas.width;
  var y = axes.y,
    h = ctx.canvas.height;
  var xmin = axes.drawneg ? 0 : x;
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(xmin, y);
  ctx.lineTo(w, y); // X axis
  ctx.moveTo(x, 0);
  ctx.lineTo(x, h); // Y axis
  ctx.stroke();

  //Filling the quadrant text
  ctx.font = "10px Lato";
  ctx.fillText(
    "I Quadrant",
    ctx.canvas.width * (1 - 0.25),
    ctx.canvas.height * (1 / 4)
  );
  ctx.fillText(
    "II Quadrant",
    ctx.canvas.width * 0.25,
    ctx.canvas.height * (1 / 4)
  );
  ctx.fillText(
    "III Quadrant",
    ctx.canvas.width * 0.25,
    ctx.canvas.height * (1 - 0.25)
  );
  ctx.fillText(
    "IV Quadrant",
    ctx.canvas.width * (1 - 0.25),
    ctx.canvas.height * (1 - 0.25)
  );
};

// Function to plot the graph
const plot = () => {
  //get a function evaluateY that returns the value for the input equation
  const node = math.parse(input.value);
  console.log(node);
  if (node.hasOwnProperty("fn") || node.hasOwnProperty("value")) {
    flag = 1;
  } else {
    flag = 0;
  }
  if (!flag) {
    window.alert("Enter Proper Input");
    return;
  }

  ctx.clearRect(0, 0, width, height);
  draw();
  ctx.save();
  ctx.translate(width / 2, height / 2);

  let scope = { x: -width / 2 };

  const code = node.compile(scope);
  const evaluateY = code.eval;

  ctx.beginPath();

  var scale = document.getElementById("scale").value;

  //Move to the initial position
  ctx.moveTo((-width / 2) * scale, scale * -1 * evaluateY(scope));

  //For loop to draw the graph pixel by pixel
  for (var i = -width / 2 + 0.06; i <= width / 2; i = i + 0.06) {
    scope.x = i;
    ctx.lineTo(scale * i, -1 * scale * evaluateY(scope));
    ctx.strokeStyle = "#1b1b2f";
    ctx.lineWidth = 0.1;
    ctx.stroke();
  }
  ctx.restore();
};

// Calling Functions to draw

draw();
plot();
