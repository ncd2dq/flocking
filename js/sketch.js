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
    
    for(let i = 0; i < 100; i++){
        test_bs.push(new Bird(bird_images, 50));
    }

}

function draw(){
    clear();
    
    mouse_vec = new Vector(mouseX, mouseY);
    for(test_b of test_bs){
        test_b.run(frameCount, mouse_vec);
    }

}

function mousePressed(){
    for(bird of test_bs){
        let mouse_vec = new Vector(mouseX, mouseY);
        mouse_vec = mouse_vec.sub(bird.position, false);
        mouse_vec = mouse_vec.direction(false);
        bird.apply_force(mouse_vec);
    }
}