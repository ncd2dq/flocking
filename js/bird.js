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
        //
        // Kinematics
        //
        this.position = new Vector(Math.random() * width, Math.random() * height);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        
        //
        // Animation
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
        
        // Spatial Partition
        this.partition = [];
    }
    
    apply_force(force){
        //Apply a force to objects current velocity
        // ::param force:: Vector
        this.acceleration.add(force, true);
    }
    
    update_kinematics(){
        //Physics engine to update movement dynamics
        this.velocity.add(this.acceleration, true);
        this.position.add(this.velocity, true);
        this.acceleration.zero();
    }
    
    edges(){
        //Ensure that the birds do not go off screen
        if(this.position.x >= width){
            this.position.x = 0;
        } else if (this.position.x <= 0){
            this.position.x = width;
        } else if (this.position.y >= height){
            this.position.y = 0;
        } else if (this.position.y <= 0){
            this.position.y = height;
        }
    }
    
    realistic_wobble(frame_count){
        // This function makes the bird wobble up and down as an animation technique to simulate flight
        // ::param frame_count:: integer
        if(frame_count % this.wobble_rate == 0){
            // Advance wobble cycle animation
            if(this.wobble_cycle < this.wobble_max_cycle){
                this.wobble_cycle++;
            } else {
                this.wobble_cycle = 0;
            }
            
            // Apply wobble to position
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
        //All drawing occurs at 0 because of the push/translate/rotate/pop
        image(this.frames[this.animation_index], 0, 0, this.image_scale, this.image_scale);
    }
    
    debug(p=false, c=false, s=false, a=false){
        // Debug drawing
        // ::param p:: parition
        // ::param c:: cohesion circle
        // ::param s:: separation circle
        // ::param a:: alignment circle
        if(p){
            text('<' + this.partition[0] + ', ' + this.partition[1] + '>', this.position.x, this.position.y + 35);
        }
        if(c){
            noFill();
            stroke(255, 0, 0);
            ellipse(this.position.x, this.position.y, cohesion_range, cohesion_range);
        }
        if(s){
            noFill();
            stroke(0, 255, 0);
            ellipse(this.position.x, this.position.y, separation_range, separation_range);
        }
        if(a){
            noFill();
            stroke(0, 0, 255);
            ellipse(this.position.x, this.position.y, alignment_range, alignment_range);
        }
    }
    
    cohesion_force(){
        
    }
    
    alignment_force(){
        
    }
    
    separation_force(spatial_part){
        // Determine the average vector to move away from all birds near me
        let avg_sep = new Vector(0, 0);
        let count = 0;
        
        
        for(let position_vec of spatial_part){
            avg_sep.add(position_vec, true);
            count++;
        }
        
        avg_sep.scale(1 / count, true);
        avg_sep.sub(this.position);
        
    }
    
    get_all_vectors_to_check(spatial_part){
        // ::param spatial_partition::
        // ::param check_indexes:: dictionary {'rows': List[int], 'cols': List[int]} of what to check in spatial_partition
        // ::return:: Dictionary[List[List[List[Vector]]]]
        
        let vectors = {'position': [], 'velocity': []};
        let check_indexes = this._get_indexes_to_check(spatial_part);
        
        for(let i of check_indexes['rows']){
            for(let j of check_indexes['cols']){
                // nothing
            }
        }
        
        return vectors;
    }
    
    _get_indexes_to_check(spatial_part){
        // Returns the row / col indexes that a bird should check in the spatial_part dictionaries
        // checks through the 9 surrounding boxes
        
        // TODO: convert this to a preestablished hashmap and have the birds look up their
        //spatial partition as the key, eliminates the need for every bird to do this calculation
        let rows, cols;
        // Row finder
        if(this.partition[0] == 0){
            rows = [spatial_part['position'].length, 0, 1]; 
        } else if (this.partition[0] == spatial_part['position'].length - 1){
            rows = [this.partition[0] - 1, this.partition[0], 0]
        } else {
            rows = [this.partition[0] - 1, this.partition[0], this.partition[0] + 1];
        }
        // Col finder
        if(this.partition[1] == 0){
            cols = [spatial_part['position'][0].length, 0, 1]; 
        } else if (this.partition[1] == spatial_part['position'][0].length - 1){
            cols = [this.partition[1] - 1, this.partition[1], 0]
        } else {
            cols = [this.partition[1] - 1, this.partition[1], this.partition[1] + 1];
        }
        
        return {'rows': rows, 'cols': cols};
        

    }
    
    flock(){
        
    }
    
    run(frame_count, facing_vec, spatial_part){
        
        this.separation_force(spatial_part['position']);
        
        this.update_kinematics();
        this.rotate_bird(facing_vec);
        
        // Animation --
        this.realistic_wobble(frame_count);
        this.edges();
        this.animate(frame_count);
        
        this.debug(true);
    }
    
    
}