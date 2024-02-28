// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// https://learn.ml5js.org/#/reference/posenet

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let capture;
let poseNet;
let poses = []; // this array will contain our detected poses (THIS IS THE IMPORTANT STUFF)
const cam_w = 640;
const cam_h = 480;
let heehee = 0

function preload() {
  object = loadModel("attack.obj");
  fire = loadImage("fire.gif");
  pink = loadImage("pinkfire.gif");
  comet = loadImage("comet.png");
  sound = loadSound('blip.mp3');
}

const options = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16, // 8, 16 (larger = faster/less accurate)
  flipHorizontal: true,
  minConfidence: 0.5,
  maxPoseDetections: 3, // 5 is the max
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "multiple",
  inputResolution: 257, // 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, or 801, smaller = faster/less accurate
  multiplier: 0.5, // 1.01, 1.0, 0.75, or 0.50, smaller = faster/less accurate
  quantBytes: 2,
};

function setup() {
  createCanvas(cam_w, cam_h, WEBGL);
  capture = createCapture(VIDEO);
  capture.size(cam_w, cam_h);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(capture, options, modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected.
  poseNet.on("pose", function (results) {
    poses = results;
  });

  // Hide the capture element, and just show the canvas
  capture.hide();
}

// this function gets called once the model loads successfully.
function modelReady() {
  console.log("Model loaded");
}

function draw() {
  // mirror the capture being drawn to the canvas
  push();
  translate(-width / 2, -height / 2);
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();

  d();
}
function d() {
  if (poses.length > 0) {
    let pose = poses[0].pose;

    //   0 nose
    // 1 leftEye
    // 2 rightEye
    // 3 leftEar
    // 4 rightEar
    // 5 leftShoulder
    // 6 rightShoulder
    // 7 leftElbow
    // 8 rightElbow
    // 9 leftWrist
    // 10 rightWrist
    // 11 leftHip
    // 12 rightHip
    // 13 leftknee
    // 14 rightKnee
    // 15 leftAnkle
    // 16 rightAnkle

    let eyelx = pose.keypoints[1].position.x;
    let eyely = pose.keypoints[1].position.y;
    let eyerx = pose.keypoints[2].position.x;
    let eyery = pose.keypoints[2].position.y;
    let nosex = pose.keypoints[0].position.x;
    let nosey = pose.keypoints[0].position.y;

    let earlx = pose.keypoints[3].position.x;
    let early = pose.keypoints[3].position.y;
    let earrx = pose.keypoints[4].position.x;
    let earry = pose.keypoints[4].position.y;

    let elbowlx = pose.keypoints[7].position.x;
    let elbowly = pose.keypoints[7].position.y;
    let elbowrx = pose.keypoints[8].position.x;
    let elbowry = pose.keypoints[8].position.y;

    let wristrx = pose.keypoints[10].position.x;
    let wristry = pose.keypoints[10].position.y;

    let eyedis = sqrt(
      abs((eyerx - eyelx) * (eyerx - eyelx)) +
        abs((eyery - eyely) * (eyery - eyely))
    );

    let O = (eyelx + eyerx) / 2 - nosex;
    let A = (eyely + eyery) / 2 - nosey;
    let headangle = atan(O / A);
    //console.log(tan(frameCount));
    
    //let Z = map(tan(frameCount/100), -1, 1, 0, 500, true);
    // % is "modulus" operand
    let Z = 10+(frameCount % 100);
    // for (let Z=0;Z<1000;Z+=t*50){

    translate(-width / 2 + nosex, 60+ -height / 2 + nosey, Z*(Z/4));
    
    let change = [comet,fire,pink];
    
    if (Z <= 10) {
      sound.setVolume(0.5)
      sound.playMode('untilDone')
      sound.play();
      heehee +=1
      if (heehee>2) {
        heehee = 0
      } 
    }

    //for (let Z = 0; Z < 100; Z++) {
    //   push();
    //   translate(0, 0, Z * 50);
    //   pop();
    //   //rotateZ(frameCount * 0.01);
    //   //translate(10, 10, 0);
    //   // if (Z >= 99) {Z = 0;}//
    // }
    
    
    normalMaterial();
    texture(change[heehee]);
    rotateY(headangle);
    rotateX(-headangle);
    scale(10);
    model(object);
  }
}
