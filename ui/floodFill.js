import { countInArr } from "./utils.js";

export function getNLocs(size, cell){
    let n = Array.from({length:size}).map(_=>false);
    let [x,y] = cell;

    // checking for north neighbour
    if(y>0) n[0] = ([x,y-1]);

    // checking for east neighbour
    if(x<size-1) n[1] = ([x+1, y]);

    // checking for south neighbour
    if(y<size-1) n[2] = ([x, y+1]);

    // checking for west neighbour
    if(x>0) n[3] = ([x-1, y]);

    return n;
}


export function isWallin(cell, target, walls){
    let [cx, cy] = cell;
    let [tx, ty] = target;

    if(cx == tx && ty == cy ) return false;

    if(tx - cx == 0) { // when both are along Y - axis
        if(cy-ty == 1){ // when target is above the cell
            return checkNorth(walls, cell);
        } else if(ty-cy==1){ // when cell is above the taget
            return checkSouth(walls, cell);
        }
    }
    else if(ty-cy==0){ // when both are along X - axis
        if(tx-cx == 1){ // when target is right to cell
            return checkEast(walls, cell);
        } else if(cx-tx == 1){ // when target is left to cell
            return checkWest(walls, cell);
        }
    }

    throw new Error("target is not at four axial pos.");
}

/**
 * 
 * @param {int} size
 * @param {[x:int,y:int]} cell 
 * @param {[[[boolean]]]} wallMatrix 
 * @returns {[[x:int,y:int],]} neighbour cells Array
 */
export function getUnfilledNLocs(floodMatrix, cell, wallMatrix){
    let size = floodMatrix.length;
    let n = [];
    let [x,y] = cell;
    // checking for north neighbour
    if(y>0 && !checkNorth(wallMatrix, cell) && floodMatrix[y-1][x] == Infinity) n.push([x,y-1]);

    // checking for east neighbour
    if(x<size-1 && !checkEast(wallMatrix, cell) && floodMatrix[y][x+1] == Infinity) n.push([x+1, y]);

    // checking for south neighbour
    if(y<size-1 && !checkSouth(wallMatrix, cell) && floodMatrix[y+1][x] == Infinity) n.push([x, y+1]);

    // checking for west neighbour
    if(x>0 && !checkWest(wallMatrix, cell) && floodMatrix[y][x-1] == Infinity) n.push([x-1, y]);

    return n;
}

function checkNorth(wallMatrix, cell){
    let [x,y] = cell;
    if(y <= 0) return true;
    return wallMatrix[y-1][1][x];
}

function checkEast(wallMatrix, cell){
    let [x,y] = cell;
    if(x >= wallMatrix.length-1) return true;
    return wallMatrix[y][0][x];
}

function checkSouth(wallMatrix, cell){
    let [x,y] = cell;
    if(y >= wallMatrix.length - 1) return true;
    return wallMatrix[y][1][x]
}

function checkWest(wallMatrix, cell){
    let [x,y] = cell;
    if(x <= 0) return true;
    return wallMatrix[y][0][x-1];
}

/**
 * Update the 'floodMatrix' acc. to 'knownWallMatrix' & 'goals'
 * 
 * @param {[[int]]} floodMatrix 
 * @param {[[x,y]]} goals 
 * @param {[[[int]]]} knownWallMatrix 
 */
export function FloodFill(floodMatrix, goals, knownWallMatrix){
    const queue = new Array();
    for(let y=0; y<floodMatrix.length ; y++){
        for(let x=0; x<floodMatrix[y].length; x++){
            floodMatrix[y][x] = Infinity;
        }
    }
    for(let goal of goals){
        let [x,y] = goal;
        floodMatrix[y][x] = 0;
        queue.push([x,y]);
    }
    
    while(queue.length > 0){
        let cell = queue.shift();
        let [cx, cy] = cell;
        let neighbours = getUnfilledNLocs(floodMatrix, cell, knownWallMatrix)//.filter(([x,y])=>floodMatrix[y][x]==Infinity);
        for(let n of neighbours){
            let [nx, ny] = n;
            floodMatrix[ny][nx] = floodMatrix[cy][cx]+1;
            queue.push(n);
        }
    }
}

export function emptyFloodMatrix(size){
    return Array.from({length:size}).map(_=>Array.from({length:size}).map(_=>Infinity));
}

export function smoothPath(path){
    let newPath = [];
    for(let i=0 ; i<path.length; i++){
        if(countInArr(path, path[i]) > 1){
            let j=i;
            while(j++<path.length-1){
                if(path[j] == path[i]) {
                    i = j;
                    break;
                }
            }
        }
        newPath.push(path[i]);
    }

    return newPath;
}