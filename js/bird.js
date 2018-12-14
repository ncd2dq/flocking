function create_animation_frames(){
    // Return a list of images
    const animation_frames = [];
    for(let i = 1; i < 5; i++){
        animation_frames.push(loadImage("./assets/sprites/bird" + i + ".png"));
    }
    return animation_frames;
}

class Bird{
    constructor(animation_frames, rel_size){
        // Kinematics
        this.position = new Vector(Math.random() * width, Math.random() * height);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        
        // Animation --
        // Wobble up and down to imitate upward force of wings flapping
        this.wobble_max_cycle = 3;
        this.wobble_cycle = Math.floor(Math.random() * 3);
        this.wobble_magnitude = 1;
        this.wobble_rate = 4; // High numbers yield slower wobble
        // Animate through sprite images
        this.frames = animation_frames;
        this.max_animation_index = this.frames.length - 1;
        this.animation_index = Math.floor(Math.random() * 3);
        this.last_frame_update = 0;
        this.frame_update_threshold = 3; // Higher numbers yield slower animation
        this.image_scale = rel_size;
        
        this.angle = 0;
    }
    
    realistic_wobble(frame_count){
        if(frame_count % this.wobble_rate == 0){
            if(this.wobble_cycle < this.wobble_max_cycle){
                this.wobble_cycle++;
            } else {
                this.wobble_cycle = 0;
            }
            
            if(this.wobble_cycle == 0){
                this.position.y -= this.wobble_magnitude;
            } else if (this.wobble_cycle == 1){
                this.position.y += this.wobble_magnitude;
            } else if (this.wobble_cycle == 2){
                this.position.y += this.wobble_magnitude;
            } else if (this.wobble_cycle == 3){
                this.position.y -= this.wobble_magnitude;
            }
        }
    }
    
    animate(frame_count){
        // Keeps track of animation index via framecount as a proxy of time
        if(frame_count - this.last_frame_update >= this.frame_update_threshold){
            this.last_frame_update = frame_count;
            if(this.animation_index < this.max_animation_index){
                this.animation_index++;
            } else {
                this.animation_index = 0;
            }
        }
    }
    
    rotate_bird(){
        //Rotate this bird between itself and another vector
        let mouse_vec = new Vector(mouseX, mouseY);
        let angle = this.position.angle_between(mouse_vec);
        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        this.display();
        pop();
    }
    
    display(){
        image(this.frames[this.animation_index], 0, 0, this.image_scale, this.image_scale);
    }
    
    run(frame_count){

        this.rotate_bird();

        this.angle++;
        // Animation --
        this.realistic_wobble(frame_count);
        this.animate(frame_count);
    }
    
    
}