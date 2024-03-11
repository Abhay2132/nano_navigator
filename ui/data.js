
export const mazeData = {
    mazeId: "maze2",
    size: 5,
    wallMatrix: [
        [[1, 0, 0, 0], [0, 0, 1, 1, 0]],
        [[1, 0, 0, 1], [0, 0, 1, 0, 0]],
        [[1, 1, 1, 1], [0, 0, 0, 0, 0]],
        [[1, 1, 0, 1], [0, 1, 1, 1, 0]],
        [[0, 0, 0, 0]]],
    goal: [2, 2],
    start: [0, 0],
}

export const botData = {
    dir : 3, // N E S W = 1 2 3 4
    pos : [...mazeData.start], // [x,y]
    
}

window.botData = botData;
window.mazeData = mazeData;