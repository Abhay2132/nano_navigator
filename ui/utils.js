
const _maze = (mazeBody="", mazeId="", size=0) =>  `<div id="${mazeId}" data-size="${size}" class="maze">${mazeBody}</div>`;
const _row = (rowBody="", _id="") => ` <div class="row" id=${_id} >${rowBody}</div>`;

const _v_row = (b="", _id="") => `<div class="v-wall-row" id=${_id} >${b}</div>`;
const _h_row = (b="", _id="") => `<div class="h-wall-row" id=${_id} >${b}</div>`;

const _cell = (n="", _id="") => ` <div class="cell" id=${_id} >${n}</div>`

const _v_wall = (_id="", mode="off") => `<div class="v-wall wall" id=${_id} mode=${mode}></div>`;
const _h_wall = (_id="", mode="off") => `<div class="h-wall wall" id=${_id} mode=${mode}></div>`;

const _wall_col = ( _id="") => `<div class="wall-col wall" id=${_id} ></div>`;

const cid = (x,y) => "c"+x+"-"+y;
const vid = (x,y) => "v"+x+"-"+y;
const hid = (x,y) => "h"+x+"-"+y;
const iid = (x,y) => "i"+x+"-"+y;

export function makeMaze(size=0, _id){
    let rows = "";
    for(let y=0 ; y<size; y++){
        let row = "";
        let v_row = "";
        let h_row = "";

        // For Vertical Wall Column
        for(let x=0; x<size*2-1; x++){
            let _x = parseInt(x/2);
            let item = (x%2==0) ? _cell(y+","+_x,cid(y,_x)) : _v_wall(vid(y,_x));
            v_row += item;
        }

        // For Horizontal Wall Column
        if(y<size-1){
            for(let x=0; x<size*2-1;x++){
                let _x = parseInt(x/2);
                let item = (x%2==0) ? _h_wall(hid(y,_x)):_wall_col(iid(y,_x));
                h_row += item;
            }
        }

        row = _v_row(v_row, y+"-0") + _h_row(h_row, y+"-1");
        rows += _row(row, y);
    }

    return _maze(rows, _id, size);
}

export const $ = q => document.querySelector(q);
export const $$ = q => Array.from(document.querySelectorAll(q));

export const getCell = (mazeId, x,y) => {
    return $(`#${mazeId} #c${y}-${x}`)
}

export const setCellColor = (mazeId, x,y, bgcolor, color) => {
    getCell(mazeId, x,y).style.setProperty("color", color);
    getCell(mazeId, x,y).style.setProperty("background-color", bgcolor);
}

export const getWallMatrix = (mazeId) => {
    const wallMatrix = [];

    const size = parseInt($("#"+mazeId).dataset.size);

    for(let y=1; y <= size ; y++){
        let v_walls = $$(`#${mazeId} > .row:nth-child(${y}) > .v-wall-row > .wall`).map(t => t.getAttribute("mode") === "on" ? 1 : 0);
        let arr = [v_walls];

        if(y < size){
            let h_walls = $$(`#${mazeId} > .row:nth-child(${y}) > .h-wall-row > .wall`).filter(t=>!t.classList.contains("wall-col")).map(t => t.getAttribute("mode") === "on" ? 1 : 0);
            arr.push(h_walls);
        }

        wallMatrix.push(arr)
    }
    
    return wallMatrix;
}

export function loadMaze(mazeId, wallMatrix){
    const maze = $("#"+mazeId)
    for(let y=0 ;y<wallMatrix.length ; y++){
        let [v_walls , h_walls] = wallMatrix[y];

        v_walls.forEach((mode,x) => {
            $(`#${mazeId} .wall#v${y}-${x}`).setAttribute("mode", mode ? "on":"off");
        })   
        h_walls && h_walls.forEach((mode,x)=>{
            $(`#${mazeId} .wall#h${y}-${x}`).setAttribute("mode", mode ? "on":"off");
        })
    }
}

export function getCellMatrix(mazeId, goal=[0,0]){
    mazeSize = parseInt($("#"+mazeId).dataset.size || "0");
    if(!mazeSize) return console.error(`mazeSize is invalid '${mazeSize}'`);
    let [gx,gy] = goal;
    let cellMatrix = [];
    for(let y=0; y<mazeSize; y++){
        let row = [];
        for(let x=0; x<mazeSize; x++){

        }
    }
}


