// init the posenet
let poseNet;
let video;
let poses = [];


let song1;
let song2;

let song1Volume = 0.0;
let song2Volume = 0.0;

let slider;
let song1PlayButton;
let song1StopButton;

let song2PlayButtton;
let song2StopButton;

function preload() {
  song1 = loadSound('sounds/no-exit.mp3');
  song2 = loadSound('sounds/departure.mp3');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  setupPoseNet();
  createSliderUI();
  createButtonUI();
}

function draw () {
  image(video, 0, 0, 500, 500);

  drawKeypoints();
  // drawSkeleton();
  setTrackVolumes();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function initSongVolumes () {
  song1.setVolume(song1Volume);
  song2.setVolume(song2Volume);
}

function setupPoseNet () {
  video = createCapture(VIDEO);
  video.size(500, 500);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}


function createSliderUI () {
  // visual crossfade
  slider = createSlider(-100, 100, 0);
  slider.position(10, 10);
  slider.style('width', '80px');
}

function createButtonUI () {
  // ui for play and stop buttons
  song1PlayButton = createButton("Play Song 1");
  song1PlayButton.position(10, 49);
  song1PlayButton.mousePressed(() => playSong(1));

  song1StopButton = createButton("Stop Song 1");
  song1StopButton.position(100, 49);
  song1StopButton.mousePressed(() => stopSong(1));

  song2PlayButton = createButton("Play Song 2");
  song2PlayButton.position(10, 79);
  song2PlayButton.mousePressed(() => playSong(2));

  song2StopButton = createButton("Stop Song 2");
  song2StopButton.position(100, 79);
  song2StopButton.mousePressed(() => stopSong(2));
}




function setTrackVolumes () {
  let val = slider.value();
  if (val < 0) {
    song1Volume = map(val, -100, 0, 0.5, 0.25);
    song2Volume = map(val, -100, 0, 0, .25);
  } else if (val == 0) {
    song1Volume = .25;
    song2Volume = .25;
  } else {
    song1Volume = map(val, 0, 100, 0.25, 0);
    song2Volume = map(val, 0, 100, 0.25, 0.5);
  }

  song1.setVolume(song1Volume);
  song2.setVolume(song2Volume);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      console.log(keypoint);
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}


function playSong (trackNo) {
  if (trackNo == 1 && !song1.isPlaying()) song1.play();
  if (trackNo == 2 && !song2.isPlaying()) song2.play();
}

function stopSong (trackNo) {
  if (trackNo == 1) song1.stop();
  if (trackNo == 2) song2.stop();
}

// chrome audio policy :: https://github.com/processing/p5.js-sound/issues/249
function mousePressed() { getAudioContext().resume() }


