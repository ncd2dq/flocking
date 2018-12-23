//This module provides a basic vector class with mathimatical operations

function to_degrees(angle){
    //Utility function to convert to degrees
    return angle * (180 / Math.PI);
}


class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    round(){
        this.x = Math.floor(this.x * 100) / 100;
        this.y = Math.floor(this.y * 100) / 100;
    }
    
    zero(){
        // Reset vector to 0, 0
        this.x = 0;
        this.y = 0;
    }
    
    dot(other){
        //Dot product of vectors
        const dot_prod = this.x * other.x + this.y * other.y;
        return dot_prod;
    }
    
    add(other, inplace=false){
        //Subtraction of a vector
        const new_x = this.x + other.x;
        const new_y = this.y + other.y;
        if(inplace){
            this.x = new_x;
            this.y = new_y;
        } else {
            return new Vector(new_x, new_y);
        }
    }
    
    sub(other, inplace=false){
        //Subtraction of a vector
        const new_x = this.x - other.x;
        const new_y = this.y - other.y;
        if(inplace){
            this.x = new_x;
            this.y = new_y;
        } else {
            return new Vector(new_x, new_y);
        }
    }
    
    angle_between(other){
        //Provides the angle between this vector and another vector
        let difference = other.sub(this).direction();
        let base = new Vector(1, 0);
        
        const dot_prod = base.dot(difference);
        const base_mag = base.distance();
        const diff_mag = difference.distance();
        const result = dot_prod / (base_mag * diff_mag);
        let angle = -1 * Math.acos(result);
        angle = to_degrees(angle);
        if(difference.x == 0 && difference.y == 1){
            angle = -270;
        } else if(difference.x < 0 && difference.y > 0){
            angle = 360 - angle;
        } else if (difference.x > 0 && difference.y > 0){
            angle = 360 - angle;
        }
        
        return angle;
    }
    
    scale(scalar, inplace=false){
        //Scales a vector by a scalar value
        const new_x = this.x * scalar;
        const new_y = this.y * scalar;
        if(inplace){
            this.x = new_x;
            this.y = new_y;
        } else {
            return new Vector(new_x, new_y);
        }
    }
    
    direction(inplace=false){
        // Returns the direct or the current vector or normalizes the vector if inplace is true
        let mag = this.distance();
        if(inplace){
            this.x /= mag;
            this.y /= mag;
        } else {
            let dir = new Vector(this.x / mag, this.y / mag);
            return dir;
        }
    }
    
    distance(other=false){
        //Return integer value distance between two vectors, or magnitude of current vector if
        //no other is provided
        if(other == false){
            other = new Vector(0, 0);
        }
        const operand = Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2);
        const dist = Math.pow(operand, 1/2)
        return dist;
    }
    
    collide(points, shape='square'){
        //Returns a boolean if this vector is within the given shape
        // ::param points (square) List[Vector]:: [top_left, x_len, y_len]
        // ::param points (circle) List[Vector]:: [center, radius]
        if(shape == 'square'){
            //Roughly estimate square with the enscribed circle
            const center = new Vector(points[0].x + points[1] / 2, points[0].y + points[2] / 2);
            const dist = this.distance(ceneter);
            if(dist <= points[1] / 2){
                return true;
            } else {
                return false;
            }
            
        } else if(shape == 'circle'){
            const dist = this.distance(points[0]);
            if(dist <= points[1]){
                return true;
            } else {
                return false;
            }
        } else {
            console.log('Undefined collision shape: ' + shape);
        }
    }
}