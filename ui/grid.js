import { $, makeMaze, setCellColor, $$, getCell, getWallMatrix, loadMaze } from "./utils.js";
const matrixData = {
    size:5,
    wallMatrix: [
        [[1, 0, 0, 0], [0, 0, 1, 1, 0]],
        [[1, 0, 0, 1], [0, 0, 1, 0, 0]],
        [[1, 1, 1, 1], [0, 0, 0, 0, 0]],
        [[1, 1, 0, 1], [0, 1, 1, 1, 0]],
        [[0, 0, 0, 0]]],
    goal:[2,2],
    start:[0,0]
}

$("#maze-box").innerHTML = (makeMaze(5, "maze2"))
getCell("maze2", 2, 2).id = "goal"
let start = getCell("maze2", 0, 0)
start.setAttribute("type", "start");
start.classList.add("active");

$$(".wall").forEach(t => t.addEventListener("click", e => {
    e.target.setAttribute("mode",
        e.target.getAttribute("mode") === "on" ? "off" : "on");
}))

$$(".cell").forEach(c => c.addEventListener("click", e => {
    $(".active").classList.remove("active");
    e.target.classList.add("active");
}))

$("#save-maze").addEventListener("click", e => {
    $("#maze-data").value = JSON.stringify(getWallMatrix("maze2"));
})

$("#load-maze").addEventListener("click", e => {
    let maze_data = $("#maze-data").value;
    console.log(maze_data)
    if (!maze_data) return;

    let wallMatrix = JSON.parse(maze_data);

    console.log(wallMatrix)
    loadMaze("maze2", wallMatrix)
})

$("#set-size").addEventListener("click", e => {
    let size = Math.abs(parseInt($("input#maze-size").value));
    if (!size) return;


})

loadMaze("maze2", matrixData.wallMatrix);

