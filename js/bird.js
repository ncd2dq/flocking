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
        
        //
        // Animation --
        //
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
    }
    
    apply_force(force){
        //Apply a force to objects current velocity
        // ::param force:: Vector
        this.acceleration.add(force, true);
    }
    
    update_kinematics(){
        this.velocity.add(this.acceleration, true);
        this.position.add(this.velocity, true);
        this.acceleration.zero();
    }
    
    realistic_wobble(frame_count){
        // This function makes the bird wobble up and down as an animation technique to simulate flight
        // ::param frame_count:: integer
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
    
    rotate_bird(facing_vec){
        //Rotate this bird between itself and another vector
        // ::param facing_vec:: Vector class where the bird should be facing
        let angle = this.position.angle_between(facing_vec);
        push();
        translate(this.position.x, this.position.y);
        rotate(angle);
        this.display();
        pop();
    }
    
    display(){
        image(this.frames[this.animation_index], 0, 0, this.image_scale, this.image_scale);
    }
    
    run(frame_count, facing_vec){
        this.update_kinematics();
        this.rotate_bird(facing_vec);
        
        // Animation --
        this.realistic_wobble(frame_count);
        this.animate(frame_count);
    }
    
    
}