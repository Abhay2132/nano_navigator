import { checkFront, checkLeft, checkRight, stepForward, goalReached, turnLeft, turnRight } from "./botUtils.js";
import { generateEmptyWallMatrix, getDistMatrix } from "./mazeUtils.js";
import { botData, mazeData } from "./data.js";

// console.log(walls);
console.log(getDistMatrix());

export function bfs() {
    const walls = generateEmptyWallMatrix(mazeData.size)
    let path = [botData.pos];
    
    while (!goalReached()){

    }
}