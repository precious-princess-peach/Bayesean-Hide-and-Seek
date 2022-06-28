// ALGO CREDIT GOES TO https://www.albertford.com/shadowcasting/



function slope(col,row){
    return (2*col-1)/(2*row);
}

function is_symmetric(row, c, r){
    return (c>=row.depth*row.start_slope && c<= row.depth * row.end_slope)
}

const north = 0;
const east = 1;
const south = 2;
const west = 3;

class Quadrant{
    constructor(cardinal, x,y){
        this.cardinal = cardinal;
        this.ox = x;
        this.oy = y;
    }

    transform(col,row){
        if (this.cardinal == north){
            return [this.ox + col, this.oy - row];
        }
        if (this.cardinal == south){
            return [this.ox + col, this.oy + row];
        }
        if (this.cardinal == east){
            return [this.ox + row, this.oy +col];
        }
        if (this.cardinal == west){
            return [this.ox - row, this.oy + col];
        }
        
    }
}

function round_ties_up(n){
    return Math.floor(n+0.5);
}

function round_ties_down(n){
    return Math.ceil(n-0.5);
}
class Row{
    constructor(depth, start_slope, end_slope){
        this.depth = depth;
        this.start_slope = start_slope;
        this.end_slope = end_slope;
    }
    
    * tiles(){
        var min_col = round_ties_up(this.depth*this.start_slope);
        var max_col = round_ties_down(this.depth*this.end_slope);
        
        for (let c = min_col; c<max_col+1; c++){
            // console.log(c);
            yield [c, this.depth];
        }
    }

    nextRow(){
        var r  = new Row(this.depth+1, this.start_slope, this.end_slope);
        return r;
    }
}


function computeFov(x,y,isBarrier,markVisible){
        // var c =0;
        // var r = 0;
    
        // while (!isBarrier(c,r)){
        //     while(!isBarrier(c,r)){
        //         markVisible(c,r)
        //         c++;
        //         // console.log([c,r]);
        //     }
        //     r++;
        //     c=0;
        // }
    
    
        markVisible(x,y);
    
        
        for (var i = 0; i<4; i++){
            quadrant = new Quadrant(i,x,y);
    
            function reveal(col,row){
                var a = quadrant.transform(col,row);
                markVisible(a[0],a[1]);
                // console.log(a[0],a[1]);
            }
    
            function is_wall(col,row){
                if (col == null || row == null) return false;
                var a = quadrant.transform(col,row);
                return isBarrier(a[0],a[1]);
            }
    
            function is_floor(col,row){
                if (col == null || row == null) return false;
                var a = quadrant.transform(col,row);
                return !isBarrier(a[0],a[1]);
            }
    
            function scan(row){
                var prev_tile = [null,null];
                for (let tile of row.tiles()){
                    if (is_wall(tile[0],tile[1]) || is_symmetric(row,tile[0],tile[1])){
                        // console.log(quadrant.transform(tile[0],tile[1]));
                        reveal(tile[0],tile[1]);
                    }
                    if( is_wall(prev_tile[0],prev_tile[1]) && is_floor(tile[0],tile[1])){
                        row.start_slope = slope(tile[0],tile[1]);
                    }
                    if (is_floor(prev_tile[0],prev_tile[1]) && is_wall(tile[0],tile[1])){
                        var next_row = row.nextRow();
                        next_row.end_slope = slope(tile[0],tile[1]);
                        scan(next_row);
                    }
                    prev_tile = [tile[0], tile[1]];
                }
                // console.log(prev_tile);
                if (is_floor(prev_tile[0],prev_tile[1])){
                    scan(row.nextRow());
                }
            }
    
            var first_row = new Row(1, -1, 1);
            scan(first_row);        
        }
        
    }