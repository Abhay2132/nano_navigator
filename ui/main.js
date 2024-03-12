import { createMaze, updateUI } from "./maze.js";
import { setup, loop } from "./arduino.js";
import { wait , $} from "./utils.js";
import { updateBotDir, stepForward, updateSensors } from "./botUtils.js";

window.pause = true;

(async ()=>{

createMaze();
updateBotDir();

$("label[for=cell-dist]").click();
setup();
while(true){
    await wait(100);
    // if(window.pause) continue;
    if(!window.pause) {
        loop();
        updateUI();
    }

    
}

})();