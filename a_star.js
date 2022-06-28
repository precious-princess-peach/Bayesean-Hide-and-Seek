class Node{
    constructor(parent, x, y){
        this.parent = parent;
        this.x= x;
        this.y=y;

        this.g=0;
        this.h=0;
    }
}

function aStar(start, end, grid){

    var startNode = new Node(null, start[0],start[1]);
    
    var queue= [];
    var checked=[];
    queue.push(startNode);

    while(queue.length>0){

        //find smallest element in the queue:
        var index = -1;
        var minh = 10000;
        for (var i = 0; i<queue.length; i++){
            if(queue[i].h<minh){
                index = i;
                minh=queue[i].h;
            }
        }

        currentNode = queue[index];
        queue.splice(index,1); //removes currentNode;
        
        // console.log(queue.length);
        // console.log(currentNode.x,currentNode.y);

        if (currentNode.x==end[0] && currentNode.y == end[1]){ //found the route
            var result = [];
            result.push([currentNode.x, currentNode.y]);
            currentNode=currentNode.parent;
            while(currentNode != null){
                result.push([currentNode.x, currentNode.y]);
                currentNode=currentNode.parent;
            }
            return result;
        }

        for (var dir of directions){
            if(currentNode.x + dir[0]< 0 || currentNode.x + dir[0] >= grid.length){continue;} //x value out of bounds
            if(currentNode.y + dir[1]< 0 || currentNode.y + dir[1] >= grid.length){continue;} //y value out of bounds
            if(grid[currentNode.x + dir[0]][currentNode.y+dir[1]]==true){continue;} //cant step on a barrier

            var childNode = new Node(currentNode, currentNode.x + dir[0], currentNode.y + dir[1]);
            childNode.g = currentNode.g + 1;
            childNode.h = childNode.g + Math.abs(end[0]-childNode.x) + Math.abs(end[1]-childNode.y);

            var duplicate = false;
            for (var node of queue){
                if (node.x == childNode.x && node.y == childNode.y && node.h<=childNode.h){
                    duplicate= true;
                }
            }

            for (var node of checked){
                if (node.x == childNode.x && node.y == childNode.y && node.h<=childNode.h){
                    duplicate= true;
                }
            }

            if (duplicate==false){
                queue.push(childNode);
            }
        }
        checked.push(currentNode);
    }
    
    return null;
}