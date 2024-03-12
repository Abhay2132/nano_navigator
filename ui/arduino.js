import { getDistMatrix } from "./mazeUtils.js"
import { botData, mazeData } from "./data.js";
import { stepForward, checkFront, checkLeft, checkRight, moveTo , turnLeft, turnRight, getFront, getRight, getLeft, goalReached, updateBotDir, uTurn } from "./botUtils.js";
import { updateUI } from "./maze.js";


let DM = getDistMatrix();

/**
 * dir = 1 | 2 | 3 | 4 => N | E | S | W
 * pos = [x,y]
 */

/**
 * Searching Stages :-
 *  1 = Start -> Goal
 *  2 = DeadEnd -> LastJoint
 *  3 = Goal -> Start
 *  4 = Speed Run
 */


// Cell Types 
const SC = 1; // Simple Cell - go straight
const IC = 2; // Intersection Cell - choices for next cell

/**
 * Create new Entry for the path array
 * @param {[[x, y]]} loc 
 * @param {SC|IC} type 
 * @returns 
 */
const createPathUnit = (loc, type) => ({loc, type});

var stage = 1;
var path = [[botData.pos]];
var pathMoves = [];
var visitedCells = new Set();

export function setup(){
    // define pinModes
    // define Serial pins
}

export function loop(){
    let [x,y] = botData.pos;

    if(DM.length != mazeData.size) DM = getDistMatrix();
    // console.log(botData.pos)
    if(stage == 1){
        if(visitedCells.has(x+"-"+y)){
            stage = 2;
            return;
        }
        visitedCells.add(x+"-"+y);

        if(goalReached()){
            stage = 3;
            return;
        }

        let arr = [];
        if(!checkFront()) arr.push(getFront())
        if(!checkLeft()) arr.push(getLeft())
        if(!checkRight()) arr.push(getRight())

        if(arr.length == 0) {
            if(path.length == 1) {
                uTurn();
                visitedCells.delete(x+"-"+y);
                return;
            }
            
            stage = 2;
            return;
        }

        arr.sort((a,b) => DM[a[1]][a[0]] - DM[b[1]][b[0]]);
        path.push(arr);
        
        moveTo(arr[0]);

        return;
    }

    if(stage == 2){
        
        let lastCell = path.at(-1);
        if(lastCell.length > 1){
            moveTo(lastCell.shift()); 
            // lastCell.unshift();
            moveTo(path[path.length - 2][0]);
            moveTo(lastCell[0]);
            stage = 1;

            return;
        }

        moveTo(lastCell[0]);
        path.pop();

        return;
    }
}

export function reset(){
    path.length = 0;
    path.push([botData.pos]);
    botData.pos = [...mazeData.start];
    stage = 1;
    DM = getDistMatrix();

    updateUI();
    visitedCells.clear();
}