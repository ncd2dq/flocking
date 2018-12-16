// This module provides a class that segments the canvas into regions so that birds will only perform their 
// flocking calculations on birds in their region

class SpatialPartition{
    constructor(width, height, rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.width = width;
        this.height = height;
        this.row_len = height / rows;
        this.col_len = width / cols;
        this.grid = [];
        
        for(let i = 0; i < rows; i++){
            this.grid.push([]);
            for(let j = 0; j < cols; j++){
                this.grid[i].push([]);
            }
        }
    }
    
    reset_grid(){
        this.grid = [];
        for(let i = 0; i < this.rows; i++){
            this.grid.push([]);
            for(let j = 0; j < this.cols; j++){
                this.grid[i].push([]);
            }
        }
    }
    
    display(){
        // Debugging, displays the grid
        for(let i = 0; i < this.rows; i++){
            line(0, this.row_len * (i + 1), this.width, this.row_len * (i + 1));
        }
        for(let j = 0; j < this.cols; j++){
            line(this.col_len * (j + 1), 0, this.col_len * (j + 1), this.height);
        }
    }
    
    fill(bird_list){
        // Place the birds in their respective spatial partition
        // ::param bird_list:: List[Bird()]
        for(let bird of bird_list){
            let row = Math.floor(bird.position.y / this.row_len);
            let col = Math.floor(bird.position.x / this.col_len);
            try{
            this.grid[row][col].push(bird);
            bird.partition = [row, col];
            }
            catch(err){
                //nothing
            }
        }
    }
    
    upkeep(){
        // Ensure that all birds are in their correct partition
        //SOMETHING IS WRONG WITH THIS AND BIRDS WEREN'T GETTING UPDATED
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                if(this.grid[i][j].length > 0){
                    for(let bird of this.grid[i][j]){
                        let row = Math.floor(bird.position.y / this.row_len);
                        let col = Math.floor(bird.position.x / this.col_len);
                        
                        // Only try and update the birds place in the grid if it is not in the right spot
                        if(row != bird.partition[0] || col != bird.partition[1]){
                            try{
                                let cur_bird = this.grid[i][j].pop(bird);
                                this.grid[row][col].push(cur_bird);
                                cur_bird.partition = [row, col];
                            }
                            catch(err){
                                //nothing
                            }
                        }
                    }
                }
            }
        }
    }
    
    
}