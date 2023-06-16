class MorphingShape {
  constructor(posx, posy, size, col) {
    this.x = posx;
    this.y = posy;
    this.size = size;
    this.color = col;

    // Two arrays to store the vertices for two shapes
    // This example assumes that each shape will have the same
    // number of vertices, i.e. the size of each array will be the same
    this.circle = [];
    this.hexagon = [];

    // An array for a third set of vertices, the ones we will be drawing
    // in the window
    this.morph = [];

    // This boolean variable will control if we are morphing to a circle or square
    this.state = false;

    for (let angle = 0; angle < 360; angle += 10) {
      if (angle % 60 == 0) {
        let v = p5.Vector.fromAngle(radians(angle));
        v.mult(this.size);
        this.hexagon.push(v);
      } else {
        this.hexagon.push(null);
      }
    }

    let current;
    for (let i = 0; i < this.hexagon.length; i++) {
      if (this.hexagon[i] != null) {
        current = this.hexagon[i];
        continue;
      }

      let nextIndex = this.hexagon.findIndex((val, index) => index > i && val != null);

      if (nextIndex == -1) {
        nextIndex = 30;
      }

      const next = this.hexagon[nextIndex];

      const percent = (nextIndex - i) / 6;

      const v = createVector(current.x + (next.x - current.x) * percent, current.y + (next.y - current.y) * percent);
      this.hexagon[i] = v;
    }

    // Create a circle using vectors pointing from center
    for (let angle = 0; angle < 360; angle += 10) {
      // Note we are not starting from 0 in order to match the
      // path of a circle.
      let v = p5.Vector.fromAngle(radians(angle));
      v.mult(this.size * 0.85);
      this.circle.push(v);
      // Let's fill out morph array with blank PVectors while we are at it
      this.morph.push(createVector());
    }
  }

  draw() {
    // We will keep track of how far the vertices are from their target
    let totalDistance = 0;

    // Look at each vertex
    for (let i = 0; i < this.circle.length; i++) {
      let v1;
      // Are we lerping to the circle or square?
      if (this.state) {
        v1 = this.circle[i];
      } else {
        v1 = this.hexagon[i];
      }
      // Get the vertex we will draw
      let v2 = this.morph[i];
      // Lerp to the target
      v2.lerp(v1, 0.05);
      // Check how far we are from target
      totalDistance += p5.Vector.dist(v1, v2);
    }

    // If all the vertices are close, switch shape
    // if (totalDistance < 0.1) {
    // this.state = !this.state;
    // }

    push();
    // Draw relative to center
    translate(this.x, this.y);
    strokeWeight(13);
    // Draw a polygon that makes up all the vertices
    beginShape();
    fill(this.color);
    stroke(255);

    this.morph.forEach((v) => {
      vertex(v.x, v.y);
    });
    endShape(CLOSE);

    // this.morph.forEach((v) => {
    // stroke("red");
    // point(v.x, v.y);
    // });
    pop();
  }
}
