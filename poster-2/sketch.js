// Set the target date to July 1, 2023 00:00:00
const targetDate = new Date("July 1, 2023 00:00:00").getTime();

// Declare variables for fonts, images, and sounds
let caslonFont; // Caslon font
let kleinFont; // Klein font
let crownImg; // Crown image
let crownSound; // Crown sound
let madonnaImg; // Madonna image
let music; // Music sound

// Declare arrays and objects
let crosses = []; // Array of crosses
let circleEffect; // Circle effect object
let braEffect; // Bra effect object

// Set initial values
let textX; // X position for text
const crown = { x: -100, y: -100, placed: false }; // Crown object with initial position and placement flag

// Camera position and shake parameters
let camPos = { x: 0, y: 0 }; // Camera position
let shakeCam = false; // Flag for camera shake
let shakeDuration = 0.4; // Shake duration in seconds
let shakePower = 10; // Shake power

// Preload function to load assets before setup
function preload() {
  caslonFont = loadFont("./BigCaslon.ttf"); // Load Caslon font
  kleinFont = loadFont("./Klein-Text-Bold.ttf"); // Load Klein font

  crownImg = loadImage("./crown.png"); // Load crown image
  madonnaImg = loadImage("./madonna.png"); // Load Madonna image

  crownSound = loadSound("./Magic Sound Effect No Copyright Free Download.mp3"); // Load crown sound
  music = loadSound("./Madonna - I Dont Search I Find - Offer Nissim Requiem Remix (1) (mp3cut.net).mp3"); // Load music sound
}

function setup() {
  createCanvas(1728, 2304); // Create a canvas with dimensions 1728x2304

  crosses = [new Cross(300, 75, "left"), new Cross(width - 325, 75, "right")]; // Create crosses at specific positions
  circleEffect = new CircleEffect(width / 2 + 20, height / 2 - 200); // Create circle effect at a specific position
  braEffect = new BraEffect(); // Create bra effect object

  textX = -width / 2; // Set initial x position for text
}
function draw() {
  background("#e80000"); // Set the background color to red

  noFill(); // Disable filling shapes with color
  stroke(255); // Set the stroke color to white
  strokeWeight(20); // Set the stroke weight to 20
  rect(0, 0, width, height); // Draw a rectangle that covers the entire canvas

  translate(camPos.x, camPos.y); // Translate the coordinate system based on the camera position

  // Reset camera position to center of the screen
  camPos.x = 0;
  camPos.y = 0;

  updateCameraShake(); // Update camera shake effect

  countdown(); // Perform countdown logic and display

  crosses.forEach((c) => c.draw()); // Draw each cross in the crosses array

  circleEffect.draw(); // Draw the circle effect

  if (textX < width / 2) {
    textX += 10; // Move the textX position towards the center of the screen
  }

  textSize(270); // Set the text size to 270
  fill("#f4eb00"); // Set the fill color to yellow
  textAlign(CENTER); // Set the text alignment to center
  textFont(caslonFont); // Set the font to Caslon
  text("MADONNA", textX, height - 300); // Draw the text "MADONNA" at the specified position

  push();
  translate(width / 2, height / 2 - 30);
  scale(0.8);
  image(madonnaImg, 0, 0); // Draw the Madonna image at the specified position with scaling
  pop();

  fill(255); // Set the fill color to white
  textSize(100); // Set the text size to 100
  textFont(kleinFont); // Set the font to Klein
  text("THE CELEBRATION TOUR", width - textX, height - 100); // Draw the text "THE CELEBRATION TOUR" at the specified position

  braEffect.draw(); // Draw the bra effect

  moveCrown(); // Move the crown object
}

function countdown() {
  const currentTime = new Date().getTime();
  const timeRemaining = targetDate - currentTime;

  // Calculate the remaining days, hours, minutes, and seconds
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // Display the countdown as text
  fill("#f4eb00");
  noStroke();
  textFont(kleinFont);
  textSize(70);
  textAlign(CENTER);
  text(days + "D " + hours + "H " + minutes + "M " + seconds + "S", width / 2, 180);

  fill(255);
  textSize(45);
  text("FOUR DECADES OF MUSIC", width / 2, 240);
}

function moveCrown() {
  imageMode(CENTER); // Set the image mode to draw the crown image from its center

  push();
  translate(crown.x, crown.y); // Translate the coordinate system to the crown's position
  scale(1.2); // Scale the image by a factor of 1.2
  image(crownImg, 0, 0); // Draw the crown image at the specified position
  pop();

  if (crown.placed) {
    return; // If the crown is already placed, exit the function
  }

  crown.x = mouseX; // Update the crown's x position to match the current mouse x position
  crown.y = mouseY; // Update the crown's y position to match the current mouse y position

  if (mouseIsPressed) {
    crown.placed = true; // Set the placed flag of the crown to true
    crownSound.play(); // Play the crown sound
    music.play(); // Play the music
    shakeCam = true; // Enable camera shake
  }
}

class Cross {
  constructor(x, y, side) {
    this.x = x; // X position of the cross
    this.y = y; // Y position of the cross
    this.side = side; // Side of the cross (left or right)

    this.points = []; // Array to store the points of the cross

    this.size = 5; // Size of each point in the cross

    // Generate points for the vertical lines of the cross
    for (let i = 0; i < 35; i += this.size) {
      for (let j = 0; j < 225; j += this.size) {
        this.points.push({ x: this.x + i, y: this.y + j });
      }
    }

    // Generate points for the horizontal lines of the cross
    for (let i = -50; i < 85; i += this.size) {
      for (let j = 0; j < 35; j += this.size) {
        this.points.push({ x: this.x + i, y: this.y + 45 + j });
      }
    }

    // Set random target positions for some points
    for (let i = 0; i < this.points.length / 5; i++) {
      const index = floor(random(this.points.length));
      if (
        (this.side == "left" && this.points[index].x > this.x + 30) ||
        (this.side == "right" && this.points[index].x < this.x - 30)
      ) {
        i--;
        continue;
      }
      const a = this.side == "right" ? 1 : -1;
      this.points[index].target = {
        x: this.points[index].x + random(200, 500) * a,
        y: this.points[index].y - random(200, 500),
      };
    }
  }

  draw() {
    // Randomly update target positions for some points
    if (random(100) < 2) {
      const index = floor(random(this.points.length));
      const a = this.side == "right" ? 1 : -1;
      this.points[index].target = {
        x: this.points[index].x + random(200, 500) * a,
        y: this.points[index].y - random(200, 500),
      };
    }

    fill(255); // Set the fill color to white
    noStroke(); // Disable stroke
    this.points.forEach((p) => {
      if (p.target) {
        if (dist(p.x, p.y, p.target.x, p.target.y) > 3) {
          p.x = lerp(p.x, p.target.x, 0.001); // Interpolate the x position towards the target
          p.y = lerp(p.y, p.target.y, 0.001); // Interpolate the y position towards the target
        }
      }
      rect(p.x, p.y, this.size - 2, this.size - 2); // Draw a rectangle at the point's position
    });
  }
}

class CircleEffect {
  constructor(x, y) {
    this.x = x; // X position of the circle effect
    this.y = y; // Y position of the circle effect
    this.initialSize = 500; // Initial size of the circle effect
    this.size = this.initialSize; // Current size of the circle effect
    this.rotation = 0; // Rotation angle of the circle effect
    this.state = 0; // State of the circle effect (0 or 1)
  }

  draw() {
    this.rotation += 0.08; // Increase the rotation angle

    if (this.state == 0) {
      this.size = lerp(this.size, this.initialSize * 0.9, 0.01); // Interpolate the size towards 90% of the initial size
      if (abs(this.size - this.initialSize * 0.9) < 10) {
        this.state = 1; // Transition to the next state when the size is close to 90% of the initial size
      }
    } else {
      this.size = lerp(this.size, this.initialSize, 0.008); // Interpolate the size towards the initial size
      if (abs(this.size - this.initialSize) < 10) {
        this.state = 0; // Transition to the previous state when the size is close to the initial size
      }
    }

    push();
    translate(this.x, this.y); // Translate the coordinate system to the circle's position
    rotate(this.rotation); // Apply rotation to the coordinate system
    angleMode(DEGREES); // Set the angle mode to degrees
    stroke(255); // Set the stroke color to white
    strokeWeight(5); // Set the stroke weight to 5

    // Draw lines in a circular pattern
    for (let i = 0; i < 360; i += 2) {
      const x1 = cos(i) * (this.size * 0.6); // Calculate the x position of the inner end of the line
      const y1 = sin(i) * (this.size * 0.6); // Calculate the y position of the inner end of the line
      const x2 = cos(i) * this.size; // Calculate the x position of the outer end of the line
      const y2 = sin(i) * this.size; // Calculate the y position of the outer end of the line
      line(x1, y1, x2, y2); // Draw a line from the inner end to the outer end
    }
    pop();
  }
}

class BraEffect {
  constructor() {
    this.oldColor = color("red"); // Initial color of the effect
    this.color = this.oldColor; // Current color of the effect
    this.next = this.getNextColor(); // Color to transition to
    this.percent = 0; // Transition progress percentage
  }

  getNextColor() {
    return color(random(255), random(255), random(255)); // Generate a random color
  }

  draw() {
    this.color = lerpColor(this.oldColor, this.next, this.percent); // Interpolate the color between the old color and the next color
    this.color.setAlpha(100); // Set the alpha (transparency) value of the color
    this.percent += 0.04; // Increase the transition progress

    if (this.percent >= 0.99) {
      // Transition to the next color when the progress reaches 99%
      this.percent = 0; // Reset the progress to 0
      this.oldColor = this.next; // Set the old color to the current next color
      this.next = this.getNextColor(); // Generate a new next color
    }

    fill(this.color); // Set the fill color to the current color
    noStroke(); // Disable stroke (outline)
    circle(width / 2 + 63, height / 2 + 355, 230); // Draw a circle at the specified position

    // triangle(width / 2 - 270, height / 2 + 345, width / 2 - 180, height / 2 + 480, width / 2 - 130, height / 2 + 250);
  }
}

function updateCameraShake() {
  if (!shakeCam) {
    return;
  }

  shakeDuration -= deltaTime / 1000; // Reduce the shake duration based on the elapsed time

  // Generate a random offset to add to the camera position
  let xOffset = random(-shakePower, shakePower);
  let yOffset = random(-shakePower, shakePower);

  camPos.x += xOffset; // Add the random offset to the camera's x position
  camPos.y += yOffset; // Add the random offset to the camera's y position

  if (shakeDuration < 0) {
    // Reset shake duration
    shakeDuration = 0.5;
    shakeCam = false; // Disable camera shake
  }
}
