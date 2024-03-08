import { mazeData , botData} from "./data.js";
import {$, $$, wait, cycle} from "./utils.js"

var angle = 0;
function updateBotDir(){
    let bb = $("#bot-body");
    bb.style.setProperty("transform", `rotate(${angle}deg)`)
    updateSensors();
}

function updateSensors(){
    $("#front").dataset.mode=checkFront()?"off":"on";
    $("#left").dataset.mode=checkLeft()?"off":"on";
    $("#right").dataset.mode=checkRight()?"off":"on";
}

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

(async ()=>{
    await wait(1000); turnLeft();
    await wait(1000); turnLeft();
    await wait(1000); turnLeft();
    await wait(1000); turnLeft();
    await wait(1000); turnLeft();
    await wait(1000); turnLeft();
    await wait(1000); turnLeft();
    await wait(1000); turnLeft();
})();

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

function checkNorth(){
    let [bx,by] = botData.pos;
    if(by==0) return true;
    // if(by==mazeData.size-1) return true;

    let {wallMatrix} = mazeData;
    return Boolean(wallMatrix[by-1][1][bx])
}

function checkSouth(){
    let [bx,by] = botData.pos;
    // if(by==0) return true;
    if(by==mazeData.size-1) return true;

    let {wallMatrix} = mazeData;
    return Boolean(wallMatrix[by][1][bx])
}

function checkWest(){
    let [bx,by] = botData.pos;
    if(bx==0) return true;
    let {wallMatrix} = mazeData;

    return Boolean(wallMatrix[by][0][bx-1])
}

function checkEast(){
    let [bx,by] = botData.pos;
    if(bx==0) return true;
    let {wallMatrix} = mazeData;

    return Boolean(wallMatrix[by][0][bx])
}