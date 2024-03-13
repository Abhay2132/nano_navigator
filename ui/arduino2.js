// import { goalReached } from "./botUtils.js";
import { botData, mazeData } from "./data.js";
import { FloodFill, emptyFloodMatrix , getNLocs, isWallin} from "./floodFill.js";
import { updateUI } from "./maze.js";
import { generateEmptyWallMatrix, updateKnownWallsUI, updateFloodUI } from "./mazeUtils.js";
import { argsMin } from "./utils.js";
import { stepForward, checkFront, checkLeft, checkRight, moveTo , turnLeft, turnRight, getFront, getRight, getLeft, goalReached, updateBotDir, uTurn } from "./botUtils.js";
import { $ } from "./utils.js";

export var walls;
export var floodMatrix ;
var stage = 1; // 1: Start -> Goal  | 2: Wall encountered
var path = [];
var bestPath = [];

function addWalls(){
    let [x,y] = botData.pos;
    let {size} = mazeData;
    switch(botData.dir){
        case 1: // bot facing north
            if(checkFront() && y > 0) walls[y-1][1][x] = 1;
            if(checkLeft() && x > 0) walls[y][0][x-1] = 1;
            if(checkRight() && x < size -1 ) walls[y][0][x] = 1;
            break;
        case 2: // bot facing east
            if(checkFront() && x < size-1) walls[y][0][x] = 1;
            if(checkLeft() && y > 0) walls[y-1][1][x] = 1;
            if(checkRight() && y < size -1 ) walls[y][1][x] = 1;
            break;
        case 3: // bot facing south
            if(checkFront() && y < size-1) walls[y][1][x] = 1;
            if(checkLeft() && x < size-1) walls[y][0][x] = 1;
            if(checkRight() && x >0 ) walls[y][0][x-1] = 1;
            break;
        case 4: // bot facing west
            if(checkFront() && x > 0) walls[y][0][x-1] = 1;
            if(checkLeft() && y < size-1) walls[y][1][x] = 1;
            if(checkRight() && y > 0 ) walls[y-1][1][x] = 1;
            break;   
    }

    updateKnownWallsUI(walls);
}

export function setup(){
    walls = generateEmptyWallMatrix(mazeData.size)
    floodMatrix = emptyFloodMatrix(mazeData.size);
    FloodFill(floodMatrix, [mazeData.goal], walls);
}

export async function loop(){
    if(floodMatrix.length != mazeData.size) setup(); // when maze updated, only in simulation
    let [x,y] = botData.pos;
    if(stage == 1){
        
        // add new walls
        addWalls();
        if(goalReached()){
            stage = 3;
            return;
        }
        

        // min distance neighbours
        let n = getNLocs(mazeData.size, [x,y]);
        let minIs = argsMin(n.map(_ => Array.isArray(_) ? floodMatrix[_[1]][_[0]] : Infinity));
        
        // while(minIs.length > 0){
        //     let target = n[minIs.shift()];
        //     if(!isWallin([x,y], target,walls)){
        //         moveTo(target);
        //         return;
        //     }
        // }
        n = n.filter(Boolean).sort(([ax,ay],[bx,by]) => (floodMatrix[ay][ax] - floodMatrix[by][bx]))
        .filter(([nx,ny])=>floodMatrix[ny][nx] < floodMatrix[y][x])
        while(n.length > 0){
            let target = n.shift();
            if(!isWallin([x,y], target, walls)){
                moveTo(target);
                return;
            }
        }

        // all min. neighbours are not accessable
        stage=2;
        return;
    }

    if(stage == 2){
        FloodFill(floodMatrix, [mazeData.goal], walls);
        updateFloodUI(floodMatrix);
        stage = 1;
        return ;
    }
}

export function reset(){
    // setup();
    stage = 1;
    path.length = 0;
    botData.pos = Array.from(mazeData.start);
    path.push([botData.pos]);

    // FloodFill(floodMatrix, [mazeData.goal], walls);

    updateUI();
    resetFloodUI();
}

function resetFloodUI(){
    for(let y=0; y<floodMatrix.length; y++){
        for(let x=0; x<floodMatrix[y].length; x++){
            let val = floodMatrix[y][x];
            $("#c"+y+"-"+x).innerHTML = (val == Infinity ? 'i' : val);
        }
    }
}