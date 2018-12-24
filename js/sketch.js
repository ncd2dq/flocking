let all_birds = [];

const width = 800;
const height = 600;

let bird_images;
let bird_count_slider, cohesion_slider, separation_slider, alignment_slider;
let bird_count = 1, cohesion_rate = 0, separation_rate = 0, alignment_rate = 0;
let cohesion_range = 10, separation_range = 10, alignment_range = 10;

let partition_vector_button, seperation_range_button, cohesion_range_button, alignment_range_button, grid_button;
let draw_partition = false, draw_separation = false, draw_cohesion = false, draw_alignment = false, draw_grid = false;

let spatial_partition;
let spatial_copy;

function preload(){
    //Preload all bird images and use them multiple times
    bird_images = create_animation_frames();
}

function setup(){
    // Initialize screen
    let canv = createCanvas(width, height);
    canv.parent('the_canvas');
    
    // Spatial Partitioning initialize
    spatial_partition = new SpatialPartition(width, height, 7, 7);
    // Max range should be the radius of the circle enscribed by the 9 partition boxes
    let max_range = (Math.floor(spatial_partition.row_len * 3) / 2) * 2;

    // Create customization sliders
    bird_count_slider = createSlider(0, 200, bird_count); 
    let bird_count_label = createDiv('Bird Count: ');
    // Rates of flocking sliders
    bird_count_slider.parent(bird_count_label);
    cohesion_slider = createSlider(1, 10, 1);
    let cohesion_label = createDiv('Cohesion-|: ');
    cohesion_slider.parent(cohesion_label);
    separation_slider = createSlider(1, 10, 1);
    let separation_label = createDiv('Separation: ');
    separation_slider.parent(separation_label);
    alignment_slider = createSlider(1, 10, 1);
    let alignment_label = createDiv('Alignment: ');
    alignment_slider.parent(alignment_label);
    // Perception range sliders
    cohesion_range_slider = createSlider(0, max_range, cohesion_range);
    let cohesion_range_label = createDiv('Cohesion Range--||: ');
    cohesion_range_slider.parent(cohesion_range_label);
    separation_range_slider = createSlider(0, max_range, separation_range);
    let separation_range_label = createDiv('Separation Range-|: ');
    separation_range_slider.parent(separation_range_label);
    alignment_range_slider = createSlider(0, max_range, alignment_range);
    let alignment_range_label = createDiv('Alignment Range-|: ');
    alignment_range_slider.parent(alignment_range_label);
    // Create debug buttons
    partition_vector_button = createButton('Partition');
    partition_vector_button.mousePressed(d_partition);
    seperation_range_button = createButton('Separation');
    seperation_range_button.mousePressed(d_separation);
    cohesion_range_button = createButton('Cohesion');
    cohesion_range_button.mousePressed(d_cohesion);
    alignment_range_button = createButton('Alignment');
    alignment_range_button.mousePressed(d_alignment);
    grid_button = createButton('Grid');
    grid_button.mousePressed(d_grid);
    
    // Animation settings
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    frameRate(40);
    
    // Add initial birds to bird list
    for(let i = 0; i < bird_count; i++){
        all_birds.push(new Bird(bird_images, 50));
    }
    
    spatial_partition.fill(all_birds);

}


function draw(){
    clear();
    update_simulation_parameters();
    spatial_copy = spatial_partition.grid_copy();
    
    // Run all birds
    mouse_vec = new Vector(mouseX, mouseY);
    for(let bird of all_birds){
        bird.run(frameCount, mouse_vec, spatial_copy);
    }
    

    spatial_partition.reset_grid();
    spatial_partition.fill(all_birds);
    if(draw_grid){
        spatial_partition.display();
    }
}


function update_simulation_parameters(){
    // Update game parameters only if slider values change
    
    // Bird count changes
    bird_count_new = bird_count_slider.value();
    if(bird_count_new != bird_count){
        let diff = bird_count_new - bird_count;
        if(diff > 0){
            for(let i = 0; i < diff; i++){
                const new_bird = new Bird(bird_images, 50)
                all_birds.push(new_bird);
                spatial_partition.fill([new_bird]);
            }
        } else {
            diff *= -1
            for(let i = 0; i < diff; i++){
                let removed_bird = all_birds.pop();
                spatial_partition.grid[removed_bird.partition[0]][removed_bird.partition[1]].pop(removed_bird);
            }
        }
        bird_count = bird_count_new;
    }
    
    // Flocking rate changes
    cohesion_rate_new = cohesion_slider.value();
    separation_rate_new = separation_slider.value();
    alignment_rate_new = alignment_slider.value();
    if(cohesion_rate_new != cohesion_rate){
        cohesion_rate = cohesion_rate_new;
    }
    if(separation_rate_new != separation_rate){
        separation_rate = separation_rate_new;
    }
    if(alignment_rate_new != alignment_rate){
        alignment_rate = alignment_rate_new;
    }
    
    // Perception range changes
    cohesion_range_new = cohesion_range_slider.value();
    separation_range_new = separation_range_slider.value();
    alignment_range_new = alignment_range_slider.value();
    if(cohesion_range_new != cohesion_range){
        cohesion_range = cohesion_range_new;
    }
    if(separation_range_new != separation_range){
        separation_range = separation_range_new;
    }
    if(alignment_range_new != alignment_range){
        alignment_range = alignment_range_new;
    }
}

function d_alignment(){
    if(draw_alignment == false){
        draw_alignment = true;
    } else {
        draw_alignment = false;
    }
}

function d_partition(){
    if(draw_partition == false){
        draw_partition = true;
    } else {
        draw_partition = false;
    }
}

function d_separation(){
    if(draw_separation == false){
        draw_separation = true;
    } else {
        draw_separation = false;
    }
}

function d_cohesion(){
    if(draw_cohesion == false){
        draw_cohesion = true;
    } else {
        draw_cohesion = false;
    }
}

function d_grid(){
    if(draw_grid == false){
        draw_grid = true;
    } else {
        draw_grid = false;
    }
}

function mousePressed(){
    if(mouseX < width && mouseY < height){
        for(bird of all_birds){
            let mouse_vec = new Vector(mouseX, mouseY);
            mouse_vec = mouse_vec.sub(bird.position, false);
            mouse_vec = mouse_vec.direction(false);
            bird.apply_force(mouse_vec);
        }
    }
}