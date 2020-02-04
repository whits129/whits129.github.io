let video;
let poseNet;
let poses;
let camWidth = 640;
let camHeight = 480;
let proximity;
let system;
let img;
let img2;
let detectionBuffer = 0;
// let countD=0;
let d = 0;
let systems;
minThreshold = 150;
maxThreshold = 400;
let go = 5;
var a;
counta = 0;
var b;
countb = 0
// const Y_AXIS = 1;
// const X_AXIS = 2;
// let b1, b2, c1, c2;



function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    video = createCapture(VIDEO);
    video.size(640, 480);
    img = loadImage('assets/shy.png');
    img2 = loadImage('assets/hearteyes.png');
    // img3 = loadImage('assets/cryng.png');
    song = loadSound('assets/glitter_02.wav');
    // song2 = loadSound('assets/ambient2.wav');
    // b1 = color(255);
    // b2 = color(0);
    // c1 = color(86, 50, 168, 50);
    // c2 = color(200, 100, 200, 50);

    systems = [];
    system = new ParticleSystem(createVector(width / 2, height / 2));
    poseNet = ml5.poseNet(video, {
        imageScaleFactor: 0.3,
        outputStride: 16,
        flipHorizontal: true,
        minConfidence: 0.5,
        maxPoseDetections: 5,
        scoreThreshold: 0.5,
        nmsRadius: 20,
        detectionType: 'single',
        multiplier: 0.75,
    });

    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function(results) {
        poses = results;
    });


}

function draw() {


    if (poses) drawKeypoints();
    system.run();
    // console.log(system.origin.x);
    if (poses) {
        console.log(detectionBuffer, poses.length)
    }


}

// A function to draw shape over the detected keypoints
function drawKeypoints() {

    let noses = 0;

    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {

        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;

        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            if ((keypoint.score > 0.6) && ['nose'].includes(keypoint.part)) {
                noses++;
                const x = map(keypoint.position.x, 0, camWidth, 0, width);
                const y = map(keypoint.position.y, 0, camHeight, 0, height);





                if (detectionBuffer >= go) {
                    image(img2, x, y, img.width / 5, img.height / 5);
                } else {
                    image(img, x, y, img.width / 5, img.height / 5);
                }




            }
        }
    }
    if (noses === 0) {
        background (86, 50, 168);
        // background(50, 1, 77);
        textSize(36);
        fill(255);
        text('Grab a partner and move along the line.', width / 3.1, (height / 2) - 50);
        text('What happens when you move closer together?', width / 3.4, height / 2);
        // push();
        // stroke(255);
        // strokeWeight(3);
        // line(675, windowHeight/1.7, 1200, windowHeight/1.7);
        // pop();
        // ellipse(a, windowHeight/1.5, 50)
        image(img, a, windowHeight/1.8, img.width / 8, img.height / 8);
        // ellipse(b, windowHeight/1.5, 50)
        image(img, b, windowHeight/1.8, img.width / 8, img.height / 8);
        counta += 1;
        a=(height/1.65)+(sin(counta/15)*100);
        countb += 1;
        b=(height/1.12)+(-sin(countb/15)*100);




    } else if (noses === 1) {
        detectionBuffer = 0;
        background(86, 50, 168, 50);
        textSize(36);
        fill(255);
        text('Grab a partner and move along the line.', width / 3.1, (height / 2) - 50);
        text('What happens when you move closer together?', width / 3.4, height / 2);

    }

    // check proximity
    else if (noses === 2) {
        const pose0 = createVector(poses[0].pose.nose.x, poses[0].pose.nose.y);
        const pose1 = createVector(poses[1].pose.nose.x, poses[1].pose.nose.y);
        // const pose2 = createVector(poses[2].pose.nose.x,poses[2].pose.nose.y);
        //proximity = dist(poses[0].pose.nose.x, poses[0].pose.nose.y, poses[1].pose.nose.x, poses[1].pose.nose.y);
        proximity = dist(pose0.x, pose0.y, pose1.x, pose1.y);
        // console.log(proximity);
        let c = map(proximity, 0, 600, 0, 255);
        background(200, 100, 200, 50);
        // setGradient(0, 0, width, height, c1, c2, Y_AXIS);
        // setGradient(width / 2, 0, width / 2, height, b2, b1, Y_AXIS);

        if (proximity < minThreshold) {
            detectionBuffer += 1;
            if (detectionBuffer >= go) {
                // image(img, x, y, img.width / 10, img.height / 10);
                // fill(255,0,0);
                // ellipse(x, y, 100, 100);
                console.log(proximity);
                background(255, 0, 0, 50);


                const x = map((pose0.x + pose1.x) / 2, 0, camWidth, 0, width);
                const y = map((pose0.y + pose1.y) / 2, 0, camHeight, 0, height);
                system.setOrigin(createVector(x, y));

                for (let i = 0; i < 10; i++) {
                    system.addParticle();
                }
                // system.run();



                if (!song.isPlaying()){
                  song.play();
                console.log("Not Playing");
                }
            }
            // console.log(CLOSE)
            // }else if (proximity > maxThreshold) {
            //   image(img3, x, y, img.width / 10, img.height / 10);
        } else {
            detectionBuffer = 0;
            // console.log(proximity);
        }
    }


    if (noses >= 3) {
        let pose0 = createVector(poses[0].pose.nose.x, poses[0].pose.nose.y);
        let pose1 = createVector(poses[1].pose.nose.x, poses[1].pose.nose.y);
        let pose2 = createVector(poses[2].pose.nose.x, poses[2].pose.nose.y);
        // const pose2 = createVector(poses[2].pose.nose.x,poses[2].pose.nose.y);
        //proximity = dist(poses[0].pose.nose.x, poses[0].pose.nose.y, poses[1].pose.nose.x, poses[1].pose.nose.y);
        proximity = dist(pose0.x, pose0.y, pose1.x, pose1.y);
        proximity1 = dist(pose0.x, pose0.y, pose2.x, pose2.y);
        proximity2 = dist(pose1.x, pose1.y, pose2.x, pose2.y);
        background(200, 100, 200, 50);


        // console.log(proximity);

        if (proximity < minThreshold || proximity1 < minThreshold || proximity2 < minThreshold) {
            // image(img, x, y, img.width / 10, img.height / 10);
            // fill(255,0,0);
            // ellipse(x, y, 100, 100);
            detectionBuffer += 1;
            if (detectionBuffer >= go) {
                background(255, 0, 0, 50);


                if (proximity1 < proximity && proximity1 < proximity2) {
                    pose1 = pose2;
                }
                if (proximity2 < proximity && proximity2 < proximity1) {
                    pose0 = pose2;
                }
                const x = map((pose0.x + pose1.x) / 2, 0, camWidth, 0, width);
                const y = map((pose0.y + pose1.y) / 2, 0, camHeight, 0, height);
                system.setOrigin(createVector(x, y));

                for (let i = 0; i < 10; i++) {
                    system.addParticle();
                }
                // system.run();
                if (!song.isPlaying()){
                  song.play();
                }
                console.log(CLOSE)
            }
        } else {
            detectionBuffer = 0;
        }
    }


}



// A simple Particle class
let Particle = function(position) {
    this.acceleration = createVector(0, 0.0015);
    this.velocity = createVector(random(-2, 2), random(-2, 2));
    this.position = position.copy();
    this.lifespan = 600;
};

Particle.prototype.run = function() {
    this.update();
    this.display();
};

// Method to update position
Particle.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    if (detectionBuffer) {
        this.lifespan -= .5;
    } else {
        this.lifespan -= 50;
    }

};


// Method to display
Particle.prototype.display = function() {
    stroke(200, this.lifespan);
    strokeWeight(0);
    fill(random(255), random(255), random(255), this.lifespan);
    ellipse(this.position.x, this.position.y, 6, 6);
};

// Is the particle still useful?
Particle.prototype.isDead = function() {
    return this.lifespan < 0;
};

let ParticleSystem = function(position) {
    this.origin = position.copy();
    this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.run();
        if (p.isDead()) {
            this.particles.splice(i, 1);
        }
    }
}

ParticleSystem.prototype.setOrigin = function(newOrigin) {
    this.origin = newOrigin;
}

// function setGradient(x, y, w, h, c1, c2, axis) {
//   noFill();
//
//   if (axis === Y_AXIS) {
//     // Top to bottom gradient
//     for (let i = y; i <= y + h; i++) {
//       let inter = map(i, y, y + h, 0, 1);
//       let c = lerpColor(c1, c2, inter);
//       stroke(c);
//       line(x, i, x + w, i);
//     }
//   } else if (axis === X_AXIS) {
//     // Left to right gradient
//     for (let i = x; i <= x + w; i++) {
//       let inter = map(i, x, x + w, 0, 1);
//       let c = lerpColor(c1, c2, inter);
//       stroke(c);
//       line(i, y, i, y + h);
//     }
//   }
// }
