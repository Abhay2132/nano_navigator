import { makeMaze, setCellColor, getCell, getWallMatrix, loadMaze, parseID, getCellMatrix } from "./mazeUtils.js";
import {$, $$} from "./utils.js"
import { mazeData } from "./data.js";

loadMaze(mazeData)
activateControls();


function activateControls() {
    $$(".wall").forEach(t => t.addEventListener("click", e => {
        e.target.setAttribute("mode",
            e.target.getAttribute("mode") === "on" ? "off" : "on");
        // mazeData.wallMatrix = getWallMatrix(mazeData.mazeId);
    }))

    $$(".cell").forEach(c => c.addEventListener("click", e => {

        let i = 1;
        $$("input[name=select]").forEach((t, _) => { if (t.checked) i = _ + 1; });
        // $(".active").classList.remove("active");
        // e.target.classList.add("active");
        switch (i) {
            case 1:
                $(".active").classList.remove("active");
                e.target.classList.add("active");
                break;
            case 2:
                $(".start").classList.remove("start");
                e.target.classList.add("start");
                mazeData.start = parseID(e.target);
                break;
            case 3:
                $(".goal").classList.remove("goal");
                e.target.classList.add("goal");
                mazeData.goal = parseID(e.target);
                break;

        }

    }))
}

$("#save-maze").addEventListener("click", e => {
    mazeData.wallMatrix = getWallMatrix(mazeData.mazeId);
    $("#maze-data").value = JSON.stringify(mazeData);
})

$("#load-maze").addEventListener("click", e => {
    let maze_data = $("#maze-data").value;
    console.log(maze_data)
    if (!maze_data) return;

    let mazeData = JSON.parse(maze_data);

    loadMaze(mazeData)
    activateControls();
})

$("#set-size").addEventListener("click", e => {
    let size = Math.abs(parseInt($("input#maze-size").value));
    if (!size) return;

    mazeData = {...mazeData, size:size}
    loadMaze(mazeData);
    activateControls();
})

$("#clear-maze").addEventListener("click", e =>{
    $$(".wall").forEach(wall => wall.setAttribute("mode", "off"))
    mazeData.wallMatrix = [];
})

$("#cell-value-control label[for=cell-dist]").addEventListener("click", e=>{
    // console.log(getCellMatrix(mazeData.mazeId));
    const [gx,gy] = mazeData.goal;
    const cells = $$(".cell");
    for(let cell of cells){
        let [cx,cy] = parseID(cell);
        cell.innerHTML = Math.abs(cx-gx)+Math.abs(cy-gy);
    }
})

$("#cell-value-control label[for=cell-loc]").addEventListener("click", e=>{
    const cells = $$(".cell");
    for(let cell of cells){
        let [cx,cy] = parseID(cell);
        cell.innerHTML = cy+","+cx;
    }
})
