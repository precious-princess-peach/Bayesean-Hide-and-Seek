const varepsilon = 0.0000001

function Normalize(arr){
    var tot = 0;

    for (var c = 0; c<arr.length; c++){
        for (var r = 0; r< arr[c].length; r++){
            tot+= arr[c][r];
        }
    }

    for (var c = 0; c<arr.length; c++){
        for (var r = 0; r< arr[c].length; r++){
            arr[c][r] = (1/tot)*arr[c][r];
        }
    }

    return arr;
}

// function dist(x,y,i,j,k,grid){
//     if (x==i && y==j){return 0};
//     if (k==0){return 1};
//     var mind=10;
//     for (var dir of directions){
//         if(i + dir[0]< 0 || i + dir[0] >= grid.length){continue;} //x value out of bounds
//         if(j + dir[1]< 0 || j + dir[1] >= grid.length){continue;} //y value out of bounds
//         if(grid[i + dir[0]][j+dir[1]]==true){continue;} //cant step on a barrier
        
//         var d = dist(x,y,i+dir[0], j+dir[1], k-1, grid);
//         if (d<mind){mind=d};
//     }

//     return 1 + mind;
// }

// function moveModel(x,y, i,j, grid, visible){
//     d = dist(x,y,i,j,3, grid);
//     if (d==0){return 0.1};
//     if(d==1){return 0.2/4};
//     if(d==2){return 0.3/8};
//     if(d==3){return 0.4/12};
//     if(d>3){return 0};
// }

function update(i,j,visible,probs, movementModel){
    var p = 0; 
    for (var s = 0; s<probs.length; s++){
        for (var t = 0; t<probs.length; t++){
            if (visible[s][t] == true){ continue;}
            // p+=moveModel(i,j,s,t, grid)*probs[s][t];
            p+= movementModel[s*probs.length+t][i*probs.length+j]*probs[s][t];
        }
    }

    return p;
}

function bayesUpdate(visible, probs, playerLoc, movementModel){
    if(visible[playerLoc[0]][playerLoc[1]]==true){
        var newProbs = [];
        for (var i =0; i< probs.length; i++){
            newProbs[i]=[];
            for (var j = 0; j<probs.length; j++){
                // newProbs[i][j] = moveModel(i,j, playerLoc[0], playerLoc[1], grid, visible);
                newProbs[i][j] = movementModel[playerLoc[0]*probs.length+playerLoc[1]][i*probs.length+j];
            }
        }
        return Normalize(newProbs);
    }
    
    var newProbs = [];
    for (var i =0; i< probs.length; i++){
        newProbs[i]=[];
        for (var j = 0; j<probs.length; j++){
            newProbs[i][j] = update(i,j,visible, probs, movementModel);
        }
    }
    newProbs = Normalize(newProbs);
    return newProbs;
}