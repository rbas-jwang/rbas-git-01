// test db_io 
// read 3_DB/db0/db_rs.json
// update tick
// return 3_DB/db0/rs_db.json

const fs = require("fs");
const ps_total = 3
const ts_total = 1

let count = 0
let tick = 1000000000

async function db_io_end() {
    try {db_rs = JSON.parse(fs.readFileSync("3_DB/db0/db_rs.json"))} catch(e) {}
    tick = db_rs.tick + 1
    chain = db_rs.chain
    next_chain = db_rs.next_chain
    rs_db = {chain, next_chain, tick}
    try {fs.writeFileSync("3_DB/db0/rs_db.json", JSON.stringify(rs_db))} catch(e) {}
    count++;
    console.clear();
    console.log("\033[1;35m db_io_end\033[1;37m");
    console.log("\n\033[1;32m        tick = \033[1;37m" + tick)
    console.log("\033[1;32m       count = \033[1;37m" + count)
    console.log("\n\033[1;35m db_req = \033[1;37m");
    console.log(db_rs)
    // console.log("\n\033[1;35m rs_db = \033[1;37m");
    // console.log(rs_db)
}

setInterval(db_io_end, 1000);
