const SIZE = Math.min(innerWidth, innerHeight);

const VEL = 1;
const NUM_POINTS = 200;

let points = [];

let theShader;

preload = () => (theShader = loadShader("shader.vert", "shader.frag"));

let colors;

function setup() {
  createCanvas(SIZE, SIZE, WEBGL);
  pixelDensity(1);
  background(0);

  for (let i = 0; i < NUM_POINTS; ++i) points.push(new Point());

  colors = points.map((p, i) => mapToRainbow(i, 0, NUM_POINTS)).map(col => col.map(c => c/255));

  ((o) => setInterval(() => o.html(frameRate().toFixed(2)), 100))(
    createElement("h3")
  );
}

function draw() {
  //voronoi();

  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform(
    "u_pointsx",
    points.map((b) => b.x)
  );
  theShader.setUniform(
    "u_pointsy",
    points.map((b) => b.y)
  );

  theShader.setUniform(
    "u_pointscolr",
    colors.map((c) => c[0])
  );
  theShader.setUniform(
    "u_pointscolg",
    colors.map((c) => c[1])
  );
  theShader.setUniform(
    "u_pointscolb",
    colors.map((c) => c[2])
  );

  shader(theShader);
  rect(0, 0, width, height);

  points.forEach((p) => p.move());
}

function myDist(x1, y1, x2, y2) {
  const x = x2 - x1;
  const y = y2 - y1;
  return x * x + y * y;
}

class Point {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    const r = p5.Vector.random2D().mult(VEL);
    this.vx = r.x;
    this.vy = r.y;
  }

  move() {
    let nx = this.x + this.vx;
    let ny = this.y + this.vy;
    if (nx < 0 || nx >= width) {
      this.vx *= -1;
      nx = this.x + this.vx;
    }
    if (ny < 0 || ny >= height) {
      this.vy *= -1;
      ny = this.y + this.vy;
    }
    this.x = nx;
    this.y = ny;
  }

}

function mapToRainbow(value, start, stop) {
  // modulo value to make sure it's in range
  while (value < start) value += start;
  while (value >= stop) value -= stop;

  const outvalue = map(value, start, stop, 0, 256 * 6);

  if (outvalue < 256 * 1) return [255, floor(outvalue - 256 * 0), 0];
  if (outvalue < 256 * 2) return [255 - floor(outvalue - 256 * 1), 255, 0];
  if (outvalue < 256 * 3) return [0, 255, floor(outvalue - 256 * 2)];
  if (outvalue < 256 * 4) return [0, 255 - floor(outvalue - 256 * 3), 255];
  if (outvalue < 256 * 5) return [floor(outvalue - 256 * 4), 0, 255];
  if (outvalue < 256 * 6) return [255, 0, 255 - floor(outvalue - 256 * 5)];

  console.log("Error: map(" + value + ", " + start + ", " + stop + ")");
  return [0, 0, 0];
}
