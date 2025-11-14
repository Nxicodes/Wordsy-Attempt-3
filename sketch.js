/*
==============================================
p5play Animated Post-apocalypse Chatbot - Phone Simple Version
==============================================

DESCRIPTION:
a chatbot which comes from a futre 100 years forward which was designed to describe artifacts and relics of the past (today) to the explorers of the new world


ANIMATIONS:
1. Idle (9 frames) - Plays when character is stationary, shows breathing
2. Walk (13 frames) - Plays when character is moving toward target

CONTROLS:
- Touch/Click on the book to flip the page
- Pick up the book and/or look at it to open it

KEY p5play METHODS:
- loadAni(path, frames) - Load animation from numbered image sequence
- sprite.addAni(name, animation) - Add animation to sprite
- sprite.changeAni(name) - Switch between animations
- sprite.moveTo(x, y, speed) - Move sprite toward target
- sprite.ani.frameDelay - Control animation playback speed
- sprite.mirror.x - Flip sprite horizontally

KEY p5-phone METHODS:
- lockGestures() - Prevent mobile zoom/refresh gestures

LIBRARIES REQUIRED:
- p5.js v1.11.4
- p5play v3
- p5-phone v1.6.1

We are loading in the text from a separate script 
*/

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let idleAni;          // Idle animation (breathing)
let openAni; 
let openIdle;         // Walk animation (locomotion)
let wordsy;
let cw;
let ch;
let danger;
let explan;
let useCase;
let dangerExtreme;

let targetX;
let targetY;



let i;
let pic;
let pText;


let distanceToCenter;

let input;

let writingArray;
function preload(){
idleAni = loadAni("wa/0008.png", 25);
idleAni.frameDelay = 2;

openAni = loadAni("wa/0001.png", 45);
openAni.frameDelay = 3;

openIdle = loadAni("wa/0045.png", "wa/0055.png");
openIdle.frameDelay = 500;

flipAni = loadAni("wa/0046.png", "wa/0072.png");


}




function pageReady(page){
if(typeof page === "string"){
             danger = page;
             console.log(danger);
             pText = danger;
            
        }
}

async function displayText(page) {
  // Simulate an asynchronous operation (e.g., fetching data from an API)
    setTimeout(() => {
        pageReady(page);
    }, 5000); // Simulate a 5-second delay

  console.log("Waiting for data...");

}

function setup() 
{
    i=0;
cw = windowWidth;
ch = windowHeight;
	createCanvas(cw, ch);
    // lockGestures();
    
 
    

    wordsy = new Sprite();
    wordsy.moveTo(cw/2, ch/2);
    wordsy.scale = 1.5;

    wordsy.addAni('idle', idleAni);
    wordsy.addAni('open', openAni);
    wordsy.ani.looping = false;
    wordsy.addAni('openIdle', openIdle);
    wordsy.addAni('flip', flipAni);
    wordsy.ani.looping=false;

    wordsy.changeAni('idle');

    input = createInput('Describe Object Here');
    
    input.size(cw/3, ch/15);
    input.position(cw/2-(input.width/3),ch/2-150);
    input.style('font-size: 30px');
    input.style("background-color", "transparent");
    input.style("color", "white");

    button = createButton('SUBMIT');
    button.position(input.x-(input.width/2),ch/2-150);
    button.size(cw/6, input.height+6);
    button.style('sans-serif; font-size: 30px; font-style: bold;');
    button.mousePressed(submit);
    imageMode(CENTER);
}

async function submit(){
    input.remove();
    button.remove();
    console.log('I got here bruh');
    wordsy.changeAni('open');
    window.getObjDesc(input.value());
    
    setTimeout(flipPage, 25000);
}

function draw()
{
    background(0);
    allSprites.draw();
    fill(50, 30, 10);
    textSize(26);
    textAlign(CENTER, CENTER);
    textFont('Allura');
    
    text(pText, cw/2+30, ch/2+30, wordsy.width/4);
    textWrap(WORD);

    if (pic){
        image(pic, cw/2-185, ch/2+30, 300, 400);
    }
}

// function writeColor(image, x, y, red, green, blue, alpha) {
//   let index = (x + y * width) * 4;
//   image.pixels[index] = red;
//   image.pixels[index + 1] = green;
//   image.pixels[index + 2] = blue;
//   image.pixels[index + 3] = alpha;
// }



function Key(image, color, level=50) {
  console.log('Key() started');
  image.loadPixels();
  let out = createImage(image.width, image.height);
  out.loadPixels();
  let keyVec = createVector(...color);
  
  for (let i = 0; i < image.pixels.length; i += 4) {
    let r = image.pixels[i];
    let g = image.pixels[i + 1];
    let b = image.pixels[i + 2];
    let a = image.pixels[i + 3];
    
    let colVec = createVector(r, g, b);
    let d = colVec.dist(keyVec);
    
    out.pixels[i] = r;
    out.pixels[i + 1] = g;
    out.pixels[i + 2] = b;
    out.pixels[i + 3] = d < level ? 0 : a;  // Make transparent if close to green
  }
  out.updatePixels();
  console.log('Key() finished');
  return out;
}


function newGraphic(){ 

    return new Promise((resolve) => {
    const proxyUrl = "https://pacific-temple-58493-a7332e40ab23.herokuapp.com/";
    loadImage(proxyUrl + window.pImages[i], (draw1) => {
      console.log('Image loaded, starting Key()');
      drawing = Key(draw1, [0, 255, 0], 245);
      pic = drawing;
      pText = writingArray[i];
      console.log('Flipped to page', i, pText);
      i += 1;
      resolve();
    }, (err) => {
      console.error('Failed to load image:', err);
      resolve();
    });
  });

}
async function flipPage(){
if (window.pImages != undefined){
  if (i < 4){
    newGraphic();
    
  } else {
    i = 0;
    newGraphic();
  }
} else {
    i=0;
    return null;
}
}

function distCheck(vibe){
     let distanceToCenter = dist(wordsy.x, wordsy.y, targetX, targetY);
  if (distanceToCenter < 450){
        background(0, 0, 0,0);
        wordsy.changeAni([vibe, ';;']);
        if (wordsy.ani.name === 'flip'){
            console.log('we are flipping a flipped page');
            wordsy.ani.frame = 0;
            wordsy.ani.play();
        }
        setTimeout(flipPage, 2000);
    }
}

function mousePressed() {
  // Set new target position where mouse/touch occurred
  targetX = mouseX;
  targetY = mouseY;
  console.log(wordsy.ani.name);
  if (wordsy.ani.name === "open" & writingArray != undefined){
    distCheck('flip');
  } else if (wordsy.ani.name === "flip"){
    distCheck('flip');
  }
  
// Prevent default behavior
}

function touchStarted() {
  // Handle touch events (for mobile)
  if (touches.length > 0) {
    targetX = touches[0].x;
    targetY = touches[0].y;
  }

    distCheck('open');

  return false; // Prevent default behavior
}