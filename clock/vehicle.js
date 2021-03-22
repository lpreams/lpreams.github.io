function Vehicle(x, y, startx, starty) {
  this.pos = createVector(startx >= 0 ? startx : random(width), starty >= 0 ? starty : random(height));
  this.target = createVector(x, y);
  this.vel = p5.Vector.random2D();
  this.acc = createVector();
  this.r = 4;
  this.maxspeed = 5;
  this.maxforce = 1;
}

Vehicle.prototype.update = function() {

  // behaviors
  var arrive = this.arrive(this.target);
  var flee = this.flee(createVector(mouseX, mouseY));

  arrive.mult(1);
  flee.mult(5);

  this.acc.add(arrive);
  this.acc.add(flee);

  // update
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);

  // show
  stroke(255);
  strokeWeight(this.r);
  point(this.pos.x, this.pos.y);
};

Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 100) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
};

Vehicle.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if (d < 50) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};
