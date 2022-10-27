// display log/U0T0P0.json for debug

const fs = require("fs");
let displog = {}

function disp() {
    console.clear()
    console.log("\033[1;35mdisplog - display ts0/log/ts_log.json\033[1;37m");
    console.log("\nts_ps_json\n")
    try {disp = fs.readFileSync("ts0/log/ts_log.json")} catch(e) {}
    disp = disp.slice(0, -2)
    disp += "]"
    try {displog = JSON.parse(disp)} catch(e) {console.log(e)}
    console.table(displog)
}
setInterval(disp, 1000)
