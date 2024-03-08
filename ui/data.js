
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
    dir : 1, // N W S E
    pos : [0,0], // [x,y]
    
}