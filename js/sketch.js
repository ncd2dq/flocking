let test_bs = [];

const width = 800;
const height = 600;

let bird_images;
let bird_count_slider, cohesion_slider, separation_slider, alignment_slider;
let bird_count = 25, cohesion_rate = 0, separation_rate = 0, alignment_rate = 0;

function preload(){
    //Preload all bird images and use them multiple times
    bird_images = create_animation_frames();
}

function setup(){
    // Initialize screen
    let canv = createCanvas(width, height);
    canv.parent('the_canvas');
    // Create customization sliders
    bird_count_slider = createSlider(0, 200, bird_count); 
    let bird_count_label = createDiv('Bird Count: ');
    bird_count_slider.parent(bird_count_label);
    
    cohesion_slider = createSlider(0, 5, 1);
    let cohesion_label = createDiv('Cohesion: ');
    cohesion_slider.parent(cohesion_label);
    
    separation_slider = createSlider(0, 5, 1);
    let separation_label = createDiv('Separation: ');
    separation_slider.parent(separation_label);
    
    alignment_slider = createSlider(0, 5, 1);
    let alignment_label = createDiv('Alignment: ');
    alignment_slider.parent(alignment_label);
    
    // Animation settings
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    frameRate(40);
    
    for(let i = 0; i < bird_count; i++){
        test_bs.push(new Bird(bird_images, 50));
    }

}

function draw(){
    // Update game parameters only if slider values change
    bird_count_new = bird_count_slider.value();
    cohesion_rate_new = cohesion_slider.value();
    separation_rate_new = separation_slider.value();
    alignment_rate_new = alignment_slider.value();
    if(bird_count_new != bird_count){
        let diff = bird_count_new - bird_count;
        if(diff > 0){
            for(let i = 0; i < diff; i++){
                test_bs.push(new Bird(bird_images, 50));
            }
        } else {
            diff *= -1
            for(let i = 0; i < diff; i++){
                test_bs.pop();
            }
        }
        bird_count = bird_count_new;
    }
    if(cohesion_rate_new != cohesion_rate){
        cohesion_rate = cohesion_rate_new;
    }
    if(separation_rate_new != separation_rate){
        separation_rate = separation_rate_new;
    }
    if(alignment_rate_new != alignment_rate){
        alignment_rate = alignment_rate_new;
    }
    clear();
    
    mouse_vec = new Vector(mouseX, mouseY);
    for(test_b of test_bs){
        test_b.run(frameCount, mouse_vec);
    }

}

function mousePressed(){
    if(mouseX < width && mouseY < height){
        for(bird of test_bs){
            let mouse_vec = new Vector(mouseX, mouseY);
            mouse_vec = mouse_vec.sub(bird.position, false);
            mouse_vec = mouse_vec.direction(false);
            bird.apply_force(mouse_vec);
        }
    }
}