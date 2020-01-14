// declare variables
var mySong; //sound
var myImage;
var myFont;
var textShow = true;


let scl = 30; // terrain

let _text;

//terrain1
let w1 = 3220;
let h1 = 1500;
let cols1;
let rows1;
let flying1 = 0;
let terrain1 = [];

//terrain1
let w2 = 3220;
let h2 = 400;
let cols2;
let rows2;
let flying2 = 0;
let terrain2 = [];

var stella = []; // stars

// loading assets
function preload() {
  mySong = loadSound('assets/song.mp3')
  myImage = loadImage('assets/bg.png')
  myFont = loadFont('assets/NeonTubes2.otf')
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // set up sound analyzer based on volume
  analyzer = new p5.Amplitude(); // perform measurements on the song and give back values
  analyzer.setInput(mySong);


  // create the button that allows to play the song
  var buttonText = 'PLAY'
  button = createButton(buttonText);
  button.style('background-color', 'black');
  button.style("color", "rgb(252, 16, 145)");
  button.style('cursor', 'pointer')
  button.style("font-size", "20px");
  button.style("width", "120px");
  button.style("font-family", "Montserrat");
  button.style("padding", "8px 20px 8px 20px");
  button.style("border-radius", "15px");
  button.style("border-style", "solid");
  button.style("border-color", "rgb(252, 16, 145)");
  button.style("border-width", "2px");
  button.position(windowWidth / 2 - 60, windowHeight / 20)

  // function that allows to play/stop music
  button.mousePressed(
    function() {
      if (mySong.isPlaying()) {
        mySong.stop();
        button.html('PLAY')
        textShow = true;
      } else {
        mySong.play();
        button.html('PAUSE')
        textShow = false;
      }
    })


  //create the subdivision of the terrain1 and the terrain2

  //terrain1
  cols1 = w1 / scl;
  rows1 = h1 / scl;

  for (let x = 0; x < cols1; x++) {
    terrain1[x] = [];

    for (let y = 0; y < rows1; y++) {
      terrain1[x][y] = 0;
    }
  }

  //terrain2
  cols2 = w2 / scl;
  rows2 = h2 / scl;

  for (let x = 0; x < cols2; x++) {
    terrain2[x] = [];

    for (let y = 0; y < rows2; y++) {
      terrain2[x][y] = 0;
    }
  }

  for (let i = 0; i < 1000; i++) {
    stella[i] = new Stella(random(width), random(height), random(255)*10);
  }
}

function draw() {

  // setting analyzer variables
  volume = analyzer.getLevel();
  volume = map(volume, 0, 1, 0, height);

  // stars
  for (let i = 0; i < stella.length; i++) {
   stella[i].display();
 }


  // drawing terrain1
  flying1 -= 0.1;

  let yoff1 = flying1;

  for (let y = 0; y < rows1; y++) {
    let xoff1 = 0;

    for (let x = 0; x < cols1; x++) {
      terrain1[x][y] = map(noise(xoff1 * volume / 1000, yoff1 * volume / 1000), 0, 1, -50, 50);
      xoff1 += 0.5;
    }
    yoff1 += 0.5;
  }

  // drawing terrain2
  flying2 -= 0;

  let yoff2 = flying2;

  for (let y = 0; y < rows2; y++) {
    let xoff2 = 0;

    for (let x = 0; x < cols2; x++) {
      terrain2[x][y] = map(noise(xoff2 * volume / 1300, yoff2 * volume / 1300), 0, 1, -130, 130);
      xoff2 += 1.3;
    }
    yoff2 += 1.3;
  }


// background plane with texture
  push()
    translate(0, 0, -3200)
    ambientLight(60 * volume / volume, 60 * volume / volume, 60 * volume / volume);
    ambientLight(volume, 16 * volume / volume, 254 * volume / volume);
    noStroke()
    texture(myImage)
    plane(10000, 10000)
  pop()

// moon
  push()
    translate(0, +100, -3000)
    noStroke()
    emissiveMaterial(volume, 16 * volume / volume, 254 * volume / volume);
    sphere(1500);
  pop()

// text which disappear when music is playing
if (textShow == true) {
  push()
   fill('#ff3eba');
   textFont(myFont);
   translate(-750,-130)
   textSize(220);
   rotateY(0)
   rotateZ(0)
   text('VAPORWAVE', 50, 50);
  pop()
  push()
   fill('#ff3eba');
   textFont(myFont);
   translate(-400,-60)
   textSize(40);
   rotateY(0)
   rotateZ(0)
   text('A SOUND VISUALIZATION WITH P5.JS', 50, 50);
  pop()
}

  // terrain 1
  push()
  stroke(volume, 16 * volume / volume, 254 * volume / volume)
  ambientMaterial(15, 9, 30)
  strokeWeight(0.4);
  translate(0, 50);

  rotateX(PI / +2.3);

  translate(-w1 / 2, -h1 / 2 + 700);

  for (let y = 0; y < rows1 - 1; y++) {
    beginShape(TRIANGLE_STRIP);

    for (let x = 0; x < cols1; x++) {
      vertex(x * scl, y * scl, terrain1[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain1[x][y + 1]);
    }
    endShape();
  }
  pop()

  // terrain 2
  push()
  stroke(volume, 16 * volume / volume, 254 * volume / volume)
  ambientMaterial(15, 9, 30)
  strokeWeight(0.4);
  translate(0, 50);

  rotateX(PI / +2.7);

  translate(-w2 / 2, -h2 / 2 + 90);

  for (let y = 0; y < rows2 - 1; y++) {
    beginShape(TRIANGLE_STRIP);

    for (let x = 0; x < cols2; x++) {
      vertex(x * scl, y * scl, terrain2[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain2[x][y + 1]);
    }
    endShape();
  }
  pop()

}

// stars array
class Stella {
  constructor(xPos, yPos, color) {
    this.x = xPos;
    this.y = yPos;
    this.color = color;
  }

  display() {
    push()
    translate(- windowWidth * 4,-windowHeight * 4, -3000)
    scale(10)
    stroke(this.color)
    strokeWeight(1.5 + volume/200 + random(volume/450))
    point(this.x, this.y);
    pop()
  }

}

// function that allows the auto-resize canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
