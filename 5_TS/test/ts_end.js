// open : node ts_end
// init based on ./web/current_tick.json
// ts send : ./ts_req.json
// ts receive : ./ps_ts.json
// return update in_total, q_total
// update ./log/T0P0.json

const fs = require("fs");
const version = "RBAS V0.9.2022/06/10 ";

let wait = 0
let index = 0
let tick = 10000000000
let id = "-"
let in_total = 0
let in_err = 0
let q_total = 0
let q_err = 0
let chain = "-"
let in_hash = "="
let q_hash = "-"
let next_chain = chain
let ts_req = {index, id, chain, next_chain, in_hash, q_hash}
let ts_result = {tick, id, chain, next_chain, in_hash, q_hash}

function init() {
    web_ts_json = {}
    try { ts_result = JSON.parse(fs.readFileSync("5_TS/ts_result.json")) } catch (e) { }
    index = ts_result.index
    chain = ts_result.chain
    ts_web_json = ts_result

}

async function ts_ps() {
    tick++
    wait++
    try { ts_req = JSON.parse(fs.readFileSync("5_TS/ts_req.json"))} catch (e) {}
    if ((index != ts_req.index) || (index == 0)) {
        index = ts_req.index
        chain = ts_req.chain
        next_chain = ts_req.next_chain
        id = ts_req.id
        in_result_id = "-"
        in_result_tick = "-"
        q_result_id = "-"
        q_result_tick = "-"

        in_hash = ts_req.in_hash
        if (in_hash.length == 64) {
            in_result_id = id
            in_result_tick = tick
            in_total++
        }

        q_hash = ts_req.q_hash
        if (q_hash.length == 64) {
            q_result_id = id
            q_result_tick = tick
            q_total++
        }

        ts_result = { index, id, tick, chain, next_chain, in_hash, in_result_id, in_result_tick, in_total, in_err, q_hash, q_result_id, q_result_tick, q_total, q_err }
        data_str = JSON.stringify(ts_result)
        fs.writeFileSync("5_TS/ts_result.json", data_str)
        fs.appendFileSync("5_TS/log/ts_log.json", data_str + ",\n")
    }

    console.clear();
    const d = new Date();
    var str = "" + d;
    time = str.substring(4, 24);
    console.clear()
    console.log("\033[1;36m" + version + "\033[1;35m ts_end" + "\033[1;33m   " + time);
    console.log("\n\033[1;32m        tick = \033[1;37m" + tick)
    console.log("\033[1;32m        wait = \033[1;37m" + wait);
    console.log("\033[1;32m       index = \033[1;37m" + index)
    console.log("\n\033[1;35m ts_req = \033[1;37m");
    console.table(ts_req)
    console.log("\n\033[1;35m ts_result = \033[1;37m");
    console.table(ts_result)
}

init()
setInterval(ts_ps, 1000)