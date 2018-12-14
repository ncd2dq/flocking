let test_bs = [];

const width = 800;
const height = 600;

let bird_images;


function preload(){
    //Preload all bird images and use them multiple times
    bird_images = create_animation_frames();
}

function setup(){
    createCanvas(width, height);
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    frameRate(40);
    
    for(let i = 0; i < 600; i++){
        test_bs.push(new Bird(bird_images, 50));
    }

}

function draw(){
    clear();
    
    for(test_b of test_bs){
        test_b.run(frameCount);
    }
    
    
/*    let x = 100, y = 100;
    translate(x, y);
    rotate(angle);
    rect(0, 0, 50, 50);
    translate(0, 0);*/

}