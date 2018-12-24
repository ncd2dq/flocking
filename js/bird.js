// Utility function for loading bird sprites
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
        this.max_speed = 10;
        //
        // Animation
        //
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
        //Apply a force to bird's current velocity
        // ::param force:: Vector
        this.acceleration.add(force, true);
    }
    
    update_kinematics(){
        //Physics engine to update movement dynamics
        this.velocity.add(this.acceleration, true);
        this.position.add(this.velocity, true);
        this.acceleration.zero();
        
        if(this.velocity.distance() > this.max_speed){
            this.velocity.direction(true);
            this.velocity.scale(this.max_speed, true);
        }
    }
    
    edges(){
        //Ensure that the birds do not go off screen by looping them
        if(this.position.x >= width){
            this.position.x = 0.1;
        } else if (this.position.x <= 0){
            this.position.x = width;
        } else if (this.position.y >= height){
            this.position.y = 0.1;
        } else if (this.position.y <= 0){
            this.position.y = height;
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
        // ::param p:: parition vector
        // ::param c:: cohesion circle
        // ::param s:: separation circle
        // ::param a:: alignment circle
        if(p){
            fill(0, 0, 0);
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
    
    cohesion_force(spatial_part){
        // Determine the average position of the birds to move towards
        let avg_coh = new Vector(0, 0);
        let count = 0;
        
        for(let position_vec of spatial_part){
            avg_coh.add(position_vec, true);
            count++;   
        }
        
        //When this becomes zero its an NaN
        if(count > 0){
            avg_coh.scale(1 / count, true);
        }
        avg_coh.sub(this.position, true);
        avg_coh.scale(cohesion_rate / 100, true);
        return avg_coh;
    }
    
    alignment_force(spatial_part){
        // Determine the average velocity of the heard to move towards
        let avg_aln = new Vector(0, 0);
        let count = 0;
        
        
        for(let velocity_vec of spatial_part){
            avg_aln.add(velocity_vec, true);
            count++;   
        }
        
        //When this becomes zero its an NaN
        if(count > 0){
            avg_aln.scale(1 / count, true);
        }
        avg_aln.sub(this.velocity, true);
        avg_aln.scale(alignment_rate / 100, true);
        return avg_aln;
    }
    
    separation_force(spatial_part){
        // Determine the average vector to move away from all birds near me
        let avg_sep = new Vector(0, 0);
        let count = 0;
        
        
        for(let position_vec of spatial_part){
            avg_sep.add(position_vec, true);
            count++;   
        }
        
        //When this becomes zero its an NaN
        if(count > 0){
            avg_sep.scale(1 / count, true);
        }
        avg_sep.sub(this.position, true);
        avg_sep.scale(-1 * (separation_rate / 100), true);
        return avg_sep;
    }
    
    get_all_vectors_to_check(spatial_part){
        // Gets all vectors within the surrounding 9 blocks
        // ::param spatial_partition:: Dict[str, List[List[List[Vector]]]] - > [ [[], [], []], [[], [], []] ]
        // ::param check_indexes:: dictionary {'rows': List[int], 'cols': List[int]} of what to check in spatial_partition
        // ::return:: Dictionary[List[List[List[Vector]]]]
        
        let vectors = {'cohesion': [], 'velocity': [], 'seperation': []};
        let check_indexes = this._get_indexes_to_check(this.partition);
        
        for(let i of check_indexes['rows']){
            for(let j of check_indexes['cols']){
                try{
                    for(let vec of spatial_part['position'][i][j]){
                        if(this.position.distance(vec) <= cohesion_range){
                            vectors['cohesion'].push(vec);
                        }
                        if(this.position.distance(vec) <= separation_range){
                            vectors['seperation'].push(vec);
                        }
                    } 
                    for(let vec of spatial_part['velocity'][i][j]){
                        vectors['velocity'].push(vec);
                    } 
                }
                catch(err){
                    //console.log(err)
                }
            }
        }
        
        return vectors;
    }
    
    _get_indexes_to_check(current_partition){
        // Based on what grid position we are in, return what indexes we need to check
        // for the surrounding 9
        let hash_key = current_partition[0].toString() + ',' + current_partition[1].toString();
        return partition_hash[hash_key];
    }
    
    run(frame_count, facing_vec, spatial_part){
        // Executes all necessary functions of bird
        this.update_kinematics();
        this.rotate_bird(facing_vec);
        
        // Animation
        this.edges();
        this.animate(frame_count);
        let all_vecs = this.get_all_vectors_to_check(spatial_part);
        
        // Determine flocking vector
        let s = this.separation_force(all_vecs['seperation']);
        let c = this.cohesion_force(all_vecs['cohesion']);
        let a = this.alignment_force(all_vecs['velocity']);
        let flock = s.add(c).add(a);
        this.apply_force(flock);
        
        this.debug(draw_partition, draw_cohesion, draw_separation, draw_alignment);

/*        if(Number.isNaN(this.velocity.y)){
            console.log('help');
        }*/
    }
    
    
}