import { mazeData , botData} from "./data.js";
import { updateBotLocUI } from "./mazeUtils.js";
import {$, $$, wait, cycle} from "./utils.js"

var angle = 90*(botData.dir-1);
export function updateBotDir(){
    let bb = $("#bot-body");
    bb.style.setProperty("transform", `rotate(${angle}deg)`)
    updateSensors();
}

export function updateSensors(){
    $("#front").dataset.mode=checkFront()?"on":"off";
    $("#left").dataset.mode=checkLeft()?"on":"off";
    $("#right").dataset.mode=checkRight()?"on":"off";
}

// updateBotDir()
// stepForward(()=>updateBotLocUI());
// turnLeft();

export function turnLeft(){
    botData.dir = cycle(1,4,botData.dir-1);
    angle -= 90;
    updateBotDir();
}

export function turnRight(){
    botData.dir = cycle(1,4,botData.dir+1);
    angle += 90;
    updateBotDir()
}

export function stepForward(){
    switch(botData.dir){
        case 1:
            botData.pos[1] -= 1;
            break;
        case 2:
            botData.pos[0] += 1;
            break;
        case 3:
            botData.pos[1] += 1;
            break;
        case 4:
            botData.pos[0] -= 1;
            break;
    }
    // typeof cb == "function" && cb();
    updateBotLocUI()
}

export function goalReached (){
    return (botData.pos[0] == mazeData.goal[0]) && (botData.pos[1] == mazeData.goal[1]);
}

// (async ()=>{
//     await wait(1000); turnLeft();
//     await wait(1000); turnLeft();
//     await wait(1000); turnLeft();
//     await wait(1000); turnLeft();
//     await wait(1000); turnLeft();
//     await wait(1000); turnLeft();
//     await wait(1000); turnLeft();
//     await wait(1000); turnLeft();
// })();

export function checkFront(mazeId){
    if(botData.dir == 1) return checkNorth();
    if(botData.dir == 2) return checkEast();
    if(botData.dir == 3) return checkSouth();
    if(botData.dir == 4) return checkWest();
}

export function checkLeft(mazeId){
    if(botData.dir == 2) return checkNorth();
    if(botData.dir == 3) return checkEast();
    if(botData.dir == 4) return checkSouth();
    if(botData.dir == 1) return checkWest();
}

export function checkRight(mazeId){
    if(botData.dir == 4) return checkNorth();
    if(botData.dir == 1) return checkEast();
    if(botData.dir == 2) return checkSouth();
    if(botData.dir == 3) return checkWest();
}

export function checkNorth(){
    let [bx,by] = botData.pos;
    if(by<=0) return true;
    // if(by==mazeData.size-1) return true;

    let {wallMatrix} = mazeData;
    return Boolean(wallMatrix[by-1][1][bx])
}

export function checkSouth(){
    let [bx,by] = botData.pos;
    // if(by==0) return true;
    if(by>=mazeData.size-1) return true;

    let {wallMatrix} = mazeData;
    return Boolean(wallMatrix[by][1][bx])
}

export function checkWest(){
    let [bx,by] = botData.pos;
    if(bx<=0) return true;
    let {wallMatrix} = mazeData;

    return Boolean(wallMatrix[by][0][bx-1])
}

export function checkEast(){
    let [bx,by] = botData.pos;
    if(bx>=mazeData.size-1) return true;
    let {wallMatrix} = mazeData;

    return Boolean(wallMatrix[by][0][bx])
}

export function getFront(){
    let [px, py] = botData.pos;
    if(botData.dir == 1) return [px,py-1];
    if(botData.dir == 2) return [px+1,py];
    if(botData.dir == 3) return [px,py+1];
    if(botData.dir == 4) return [px-1,py];
}

export function getLeft(){
    let [px, py] = botData.pos;
    if(botData.dir == 1) return [px-1,py];
    if(botData.dir == 2) return [px,py-1];
    if(botData.dir == 3) return [px+1,py];
    if(botData.dir == 4) return [px,py+1];
}

export function getRight(){
    let [px, py] = botData.pos;
    if(botData.dir == 1) return [px+1,py];
    if(botData.dir == 2) return [px,py+1];
    if(botData.dir == 3) return [px-1,py];
    if(botData.dir == 4) return [px,py-1];
}

export function uTurn(){
    turnLeft();
    turnLeft();
}

/**
 * Moves the Bot the new given pos
 * @param {[x:int,y:int]} newPos 
 * @returns void
 */
export function moveTo(newPos){ 
    let [nx, ny] = newPos;
    let [px, py] = botData.pos;

    if(nx == px && py == ny) return; // newPos == currPos

    if(px-nx==0){ // when New pos is along Y - axis
        if((botData.dir == 1 && ny-py == 1) ||
        (botData.dir == 3 && py-ny == 1)){
            uTurn();
        }
        else if(botData.dir == 2){
            if(py-ny == 1) turnLeft()
            else if(py-ny == -1) turnRight();
        } else if(botData.dir == 4){
            if(py-ny == 1) turnRight()
            else if(py-ny == -1) turnLeft();
        }
    } else if(ny-py==0 ){ // When New Pos is along X-Axis

        if((botData.dir == 2 && px-nx == 1)||(botData.dir ==4 && nx-px == 1)){
            uTurn();
        } 
        else if(botData.dir == 1){ // When Bot Facing North and We have to left or right
            if(px-nx == 1) turnLeft(); // For Left
            else if(px-nx == -1) turnRight(); // For Right
        } else if(botData.dir == 3){ // When bot is facing South and we have to turn left or right
            if(px-nx ==1 ) turnRight();
            else if(px-nx==-1) turnLeft();
        }
    }

    stepForward();
    // updateBotDir();
}


