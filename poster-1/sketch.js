const HEX_COLOR = "#A7D1EC";

// declare the hexagon grid
const grid = [];

let futuraFont;
let eyeImg;

let state = 0;
let finishedAnimating = false;

// these are the indexes for the hexagons that will change colors
const colorLerpIndexes = [18, 19, 26, 27, 34];
// these are the colors for to hexagons
const colorLerpColors = ["#E2555D", "#DE68B1", "#E69635", "#5F4CE6", "#5CA846"];

// these are the colors through which the text will transition
const textColors = ["#FDEE4F", "#2F297E", "#D53873"];
let textColor;

let colorLerpIndex = 0;
let colorLerpPercent = 0;

let eyeScale = 1.7;
let textAlpha = 255;
let growEye = false;

// load assets
function preload() {
  futuraFont = loadFont("./futura.ttf");
  eyeImg = loadImage("./eye logo.png");
}

function setup() {
  createCanvas(2550, 3300);

  textColor = color("black");

  // create a grid of hexagon morphing shapes
  const r = 330;
  s = sqrt((3 * pow(r, 2)) / 4);

  for (let y = -200; y < height + s; y += 2 * s) {
    for (let x = -210; x < width + r; x += 3 * r) {
      grid.push(new MorphingShape(x, y, r, HEX_COLOR));
      grid.push(new MorphingShape(x + 1.5 * r, y + s, r, HEX_COLOR));
    }
  }
}

function mousePressed() {
  // if state is go to next state, same for all
  if (state == 0) {
    state = 1;
    finishedAnimating = false;
  } else if (finishedAnimating && state == 1) {
    // if mouse is over text and click, go to next state
    if (mouseX > 200 && mouseY > height / 2 - 650 && mouseX < width * 0.6 + 200 && mouseY < height / 2 + 450) {
      state = 2;
      finishedAnimating = false;
    }
  } else if (finishedAnimating && state == 2) {
    // if mouse is over eye, go to next step
    if (dist(mouseX, mouseY, width / 2, height / 2 + 720) < 250) {
      state = 3;
      finishedAnimating = false;
    }
  } else if (finishedAnimating && state == 3) {
    state = 4;
  }
}

function draw() {
  background(255);

  // draw every hexagon
  grid.forEach((shape) => shape.draw());

  textFont(futuraFont);
  textSize(320);
  fill(textColor);

  text("UNITE\nCOLOURS\nIN VISION", 200, height / 2 - 380);

  // draw the white background that appears in the end
  if (state >= 3) {
    fill(255, 255, 255, state == 3 ? 255 - textAlpha : 255);
    rect(0, 0, width, height);
  }

  // draw the eye, at it's respective position based on state
  push();
  imageMode(CENTER);
  if (growEye) {
    translate(width / 2, height / 2 - 200);
  } else {
    translate(width / 2, height / 2 + 720);
  }
  scale(eyeScale);
  image(eyeImg, 0, 0);
  pop();

  fill(0, 0, 0, textAlpha);

  if (state != 4) {
    // if we are not at the last state, draw the text
    textStyle(BOLD);
    textSize(80);
    text(`"WE SET A SIGN"`, 200, height / 2 + 1200);
    textStyle(NORMAL);
    text("KISD X HIT June 2023", 200, height / 2 + 1290);

    textSize(50);
    text("Universal Symbols of Acceptance", 200, height / 2 + 1400);
    textStyle(BOLD);
    text("Design Exhibition", 200, height / 2 + 1470);
    textStyle(NORMAL);
    text("Midtown Tel Aviv", 200, height / 2 + 1540);
  } else {
    // draw last state text
    textFont(futuraFont);
    textSize(120);
    fill(0, 0, 0, textAlpha);

    textAlign(CENTER, TOP);
    text(`VISIT US ON FACEBOOK\n"WE SET A SIGN"`, width / 2, height / 2 + 950);
  }

  // animation functions for every state
  if (state == 1 && !finishedAnimating) {
    colorLerp();
  } else if (state == 2 && !finishedAnimating) {
    textColorLerp();
  } else if (state == 3 && !finishedAnimating) {
    eyeTransition();
  } else if (state == 4) {
    finalText();
  }
}

function colorLerp() {
  // https://p5js.org/reference/#/p5/lerpColor
  // lerp color, basically, smoothly transition between colors using a percent variable
  grid[colorLerpIndexes[colorLerpIndex]].color = lerpColor(
    color(HEX_COLOR),
    color(colorLerpColors[colorLerpIndex]),
    colorLerpPercent
  );
  // increase the percent
  // this increment can change the speed at which the color transitions
  colorLerpPercent += 0.03;
  // if it reaches the desired color, change the haxgon that needs to animate
  if (1 - colorLerpPercent <= 0.05) {
    colorLerpPercent = 0;
    colorLerpIndex++;
    // if at the end of the hexagon array, finish animating
    if (colorLerpIndex > colorLerpIndexes.length - 1) {
      finishedAnimating = true;
      colorLerpIndex = 0;
    }
  }
}

function textColorLerp() {
  // same as before but for text
  textColor = lerpColor(
    colorLerpIndex == 0 ? color("black") : color(textColors[colorLerpIndex - 1]),
    color(textColors[colorLerpIndex]),
    colorLerpPercent
  );
  colorLerpPercent += 0.01;
  if (1 - colorLerpPercent <= 0.05) {
    colorLerpPercent = 0;
    colorLerpIndex++;
    if (colorLerpIndex > textColors.length - 1) {
      finishedAnimating = true;

      // the hex.state variable determines if the hexagon should change into a sphere
      grid.forEach((hex) => (hex.state = true));
    }
  }
}

function eyeTransition() {
  if (textAlpha >= 0) {
    // fade out the text
    textAlpha -= 4;
    textColor.setAlpha(textAlpha);
  }
  // decrease the eye size, and when it gets to 0, increase it but from the middle of the screen
  if (!growEye && eyeScale >= 0) {
    eyeScale -= 0.1;
    if (eyeScale <= 0) {
      growEye = true;
    }
  }
  // increase eye scale
  if (growEye && eyeScale < 7.5) {
    eyeScale += 0.1;
  } else if (growEye) {
    // if max eye scale, finish animating
    finishedAnimating = true;
  }
}

// if at the last state and mouse press fade in the text
function finalText() {
  if (textAlpha < 255) {
    textAlpha += 3;
  }
}
