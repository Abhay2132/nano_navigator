// import { goalReached } from "./botUtils.js";
import { botData, mazeData } from "./data.js";
import { FloodFill, emptyFloodMatrix, getNLocs, isWallin, smoothPath } from "./floodFill.js";
import { updateUI } from "./maze.js";
import { generateEmptyWallMatrix, updateKnownWallsUI, updateFloodUI, swapGS } from "./mazeUtils.js";
import { argsMin, wait } from "./utils.js";
import { stepForward, checkFront, checkLeft, checkRight, moveTo, turnLeft, turnRight, getFront, getRight, getLeft, goalReached, updateBotDir, uTurn } from "./botUtils.js";
import { $ } from "./utils.js";

export var walls;
export var floodMatrix;
var stage = 1; // 1: Start -> Goal  | 2: Wall encountered | 3: Goal Reached | 4 : SpeedRun | 5 : FINISHED
var path = [];
var bestPath = [];

const maxCycles = 2;
var runType = 1;// 1 : start -> Goal , 2 : goal -> start
var currCycle = 1;
var speedRunDone = false;

function addWalls() {
    let [x, y] = botData.pos;
    let { size } = mazeData;
    switch (botData.dir) {
        case 1: // bot facing north
            if (checkFront() && y > 0) walls[y - 1][1][x] = 1;
            if (checkLeft() && x > 0) walls[y][0][x - 1] = 1;
            if (checkRight() && x < size - 1) walls[y][0][x] = 1;
            break;
        case 2: // bot facing east
            if (checkFront() && x < size - 1) walls[y][0][x] = 1;
            if (checkLeft() && y > 0) walls[y - 1][1][x] = 1;
            if (checkRight() && y < size - 1) walls[y][1][x] = 1;
            break;
        case 3: // bot facing south
            if (checkFront() && y < size - 1) walls[y][1][x] = 1;
            if (checkLeft() && x < size - 1) walls[y][0][x] = 1;
            if (checkRight() && x > 0) walls[y][0][x - 1] = 1;
            break;
        case 4: // bot facing west
            if (checkFront() && x > 0) walls[y][0][x - 1] = 1;
            if (checkLeft() && y < size - 1) walls[y][1][x] = 1;
            if (checkRight() && y > 0) walls[y - 1][1][x] = 1;
            break;
    }

    updateKnownWallsUI(walls);
}

export function setup() {
    walls = generateEmptyWallMatrix(mazeData.size);
    floodMatrix = emptyFloodMatrix(mazeData.size);
    FloodFill(floodMatrix, [mazeData.goal], walls);
}

export async function loop() {
    if (floodMatrix.length != mazeData.size) setup(); // when maze updated, only in simulation
    let [x, y] = botData.pos;
    if (stage == 1) {


        if (path.length > 1 &&  path[path.length - 2] == x + "-" + y) {
            path.pop();
        } else {
            path.push(x + "-" + y);
        }
        // add new walls
        addWalls();

        // check if goal reached
        if (goalReached()) {
            stage = 3;
            return;
        }


        // min distance neighbours
        let n = getNLocs(mazeData.size, [x, y]);
        let minIs = argsMin(n.map(_ => Array.isArray(_) ? floodMatrix[_[1]][_[0]] : Infinity));

        // while(minIs.length > 0){
        //     let target = n[minIs.shift()];
        //     if(!isWallin([x,y], target,walls)){
        //         moveTo(target);
        //         return;
        //     }
        // }
        n = n.filter(Boolean).sort(([ax, ay], [bx, by]) => (floodMatrix[ay][ax] - floodMatrix[by][bx]))
            .filter(([nx, ny]) => floodMatrix[ny][nx] < floodMatrix[y][x])
        while (n.length > 0) {
            let target = n.shift();
            if (!isWallin([x, y], target, walls)) {
                moveTo(target);
                return;
            }
        }

        // all min. neighbours are not accessable
        stage = 2;
        return;
    }

    if (stage == 2) {
        FloodFill(floodMatrix, [mazeData.goal], walls);
        updateFloodUI(floodMatrix);
        stage = 1;
        return;
    }

    if (stage == 3) { // when we reached from either goal to start or start to goal

        if(bestPath.length == 0){
            for(let i=0; i< path.length ; i++){
                bestPath.push(path[i]);
            }
        }
        else if(path.length < bestPath.length){
            bestPath.length = 0;
            for(let i=0; i< path.length ; i++){
                bestPath.push(path[i]);
            }
        }
        path.length = 0;
        // if(currCycle <= maxCycles){
        if (runType == 1) { // go back to start
            // swap start <--> goal
            swapGS();
            runType = 2;
            stage = 1;
            FloodFill(floodMatrix, [mazeData.goal], walls);
        }
        else if (runType == 2) {
            if (currCycle == maxCycles) {
                stage = 4;
                return;
            }
            currCycle += 1;
            swapGS();
            runType = 1;
            stage = 1;
            FloodFill(floodMatrix, [mazeData.goal], walls);
        }
        return;
    }

    if (stage == 4) {
        bestPath = Array.from(smoothPath(bestPath));
        let [x,y] = botData.pos;

        let [sx,sy] = bestPath[0].split("-").map(n=>parseInt(n));
        let [ex,ey] = bestPath[bestPath.length - 1].split("-").map(n=>parseInt(n));

        if(sx==x && sy==y){
            for(let i=0; i<bestPath.length ; i++){
                moveTo(bestPath[i].split("-").map(n=>parseInt(n)));
                await wait(100);
            }
        }
        else if(ex==x && ey==y){
            for(let i=bestPath.length-1; i>=0; i--){
                await wait(100);
                moveTo(bestPath[i].split("-").map(n=>parseInt(n)));
            }
        }

        stage = 5;
        return;
    }


}

export function reset() {
    // setup();
    stage = 1;
    path.length = 0;
    botData.pos = Array.from(mazeData.start);
    // path.push([botData.pos]);

    // FloodFill(floodMatrix, [mazeData.goal], walls);

    updateUI();
    resetFloodUI();
}

function resetFloodUI() {
    for (let y = 0; y < floodMatrix.length; y++) {
        for (let x = 0; x < floodMatrix[y].length; x++) {
            let val = floodMatrix[y][x];
            $("#c" + y + "-" + x).innerHTML = (val == Infinity ? 'i' : val);
        }
    }
}