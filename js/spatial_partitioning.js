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
    
    grid_copy(){
        // Makes a deep copy of the grid with just vectors
        // ::return:: List[List[List[Vector]]] - > [ [[], [], []], [[], [], []] ]
        let grid_c = {'position': [], 'velocity': []};
        
        for(let i = 0; i < this.rows; i++){
            let new_p_row = [];
            let new_v_row = [];
            for(let j = 0; j < this.cols; j++){
                new_p_row.push(this.snap_shot([i, j], 'position'));
                new_v_row.push(this.snap_shot([i, j], 'velocity'));
            }
            grid_c['position'].push(new_p_row);
            grid_c['velocity'].push(new_v_row);
        }
        
        return grid_c;
    }
    
    snap_shot(partition, type){
        // Produce a snapshot of positions or velocity on a specific grid square
        // birds will use to not update one at at time but rather all at once
        // ::param partition:: List[int, int] position in grid
        // ::param type:: position/velocity to indicate what type of snapshot is needed
        let partition_copy = [];
        if(type == 'position'){
            for(let bird of this.grid[partition[0]][partition[1]]){
                partition_copy.push(JSON.parse(JSON.stringify(bird.position)));
            } 
        } else {
            for(let bird of this.grid[partition[0]][partition[1]]){
                partition_copy.push(JSON.parse(JSON.stringify(bird.velocity)));
            }
        }
        
        return partition_copy;
    }
    
    reset_grid(){
        // Recreates a proper empty grid
        this.grid = [];
        for(let i = 0; i < this.rows; i++){
            this.grid.push([]);
            for(let j = 0; j < this.cols; j++){
                this.grid[i].push([]);
            }
        }
    }
    
    display(){
        // Debugging, displays the grid lines
        fill(255, 255, 255);
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
    
    // ERRONEOUS
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
    
    create_parition_hash(){
        // Create hash map of what indexes a given bird should check in the spatial partition
        let hash_map = {};
        
        for(let i = 0; i < this.rows; i++){
            for(let j = 0; j < this.cols; j++){
                // Instantiate dictionary to avoid key errors
                hash_map[i.toString() + ',' + j.toString()] = {'rows': [], 'cols': []};
                let row_list = [];
                let col_list = [];
                
                // Rows List
                if(i == 0){
                    row_list = [this.rows - 1, 0, 1];
                } else if (i == this.rows - 1){
                    row_list = [i - 1, i, 0];
                } else {
                    row_list = [i - 1, i, i + 1];
                }
                
                // Cols list
                if(j == 0){
                    col_list = [this.cols - 1, 0, 1];
                } else if(j == this.cols - 1){
                    col_list = [j - 1, j, 0];
                } else {
                    col_list = [j - 1, j, j + 1];
                }
                hash_map[i.toString() + ',' + j.toString()]['rows'] = row_list;
                hash_map[i.toString() + ',' + j.toString()]['cols'] = col_list;
            }
        }
        return hash_map;
    }
}