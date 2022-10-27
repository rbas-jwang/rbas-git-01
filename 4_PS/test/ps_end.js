// ps_end :- 
// input  ps0/ps_db.json - updata in_total, in_err, q..
// output ps0/ps_ts.json and append to ps0/ps_log.json

const crypto = require("crypto");
const fs = require("fs");
let ps_total = 1
let ts_total = 2

let tick = 1000000000
let last_tick = tick
let index = 0
let ps_id = 'P0'
let chain = "a69313b4d3e23363dbea6579cd6"
let next_chain = "a69313b4d3e23363dbea6579cd6"
let in_total = 0
let in_err = 0
let q_total = 0
let q_err = 0
let db_ps = {}
let ts_request = []

let ts_result = []
let ts_in_total = []
let ts_in_err = []
let ts_q_total = []
let ts_q_err = []
let ts_req = []

let ps_db_init = { tick, chain, next_chain, ts_req }
let ps_ts = {}
let ps_db = {}

function init() {
    try { ps_ts = JSON.parse(fs.readFileSync("4_PS/db_ps.json")) } catch (e) { ps_ts.tick = 1000000000 }
    tick = ps_ts.tick
    chain = ps_ts.chain
    next_chain = ps_ts.next_chain
    for (i = 0; i < ts_total; i++) {
        ts_result[i] = {}
        ts_in_total[i] = 0
        ts_q_total[i] = 0
        ts_in_err[i] = 0
        ts_q_err[i] = 0
        in_total = 0
        q_total = 0
        in_err = 0
        q_err = 0
    }
}

function display() {
    console.clear();
    const d = new Date();
    var str = "" + d;
    time = str.substring(4, 24);
    console.log("\033[1;35m ps_end  " + "\033[1;33m " + time);
    console.log("\n\033[1;32m         tick = \033[1;37m" + tick)
    console.log("\033[1;32m    last_tick = \033[1;37m" + last_tick);
    console.log("\033[1;32m        index = \033[1;37m" + index);
    console.log("\033[1;32m     ts_total = \033[1;37m" + ts_total);
    console.log("\033[1;32m     in_total = \033[1;37m" + in_total);
    console.log("\033[1;32m       in_err = \033[1;37m" + in_err);
    console.log("\033[1;32m      q_total = \033[1;37m" + q_total);
    console.log("\033[1;32m        q_err = \033[1;37m" + q_err);
    if (ts_total < 3) {
        console.log("\033[1;35m ps_db = \033[1;37m");
        console.log(ps_db)
        // console.log("\033[1;35m ts_result = \033[1;37m");
        // console.log(ts_result)
        console.log("\033[1;35m db_ps = \033[1;37m");
        console.log(db_ps)
    }
}

init()

function ps_end() {
    display()
    try { ps_db = JSON.parse(fs.readFileSync("4_PS/ps_db.json")) } catch (e) { ps_db = ps_db_init }
    tick == ps_db.tick
    if ((tick == last_tick) || (last_tick == 1000000000)) {
        tick++
        last_tick = tick
        ts_request = ps_db.ts_req
        ts_total = ts_request.length
        for (i = 0; i < ts_total; i++) {
            if (ps_db.ts_req[i] != undefined) {
                ts_result[i] = ts_request[i]
                ts_result[i].in_result_id = ts_request[i].id
                ts_result[i].in_result_tick = tick
                ts_result[i].in_total = ts_in_total[i]++
                ts_result[i].in_err = ts_in_err[i]++
                ts_result[i].q_total = ts_q_total[i]++
                ts_result[i].q_err = ts_q_err[i]++
                ts_result[i].q_result_tick = tick
                ts_result[i].q_result_id = ts_request[i].id
                in_total++
                q_total++
            }
        }
        chain = ps_db.chain
        next_chain = ps_db.next_chain
        db_ps = { tick, ps_id, chain, next_chain, in_total, q_total, in_err, q_err, ts_result }


        try { fs.writeFileSync("4_PS/db_ps.json", JSON.stringify(db_ps)) } catch { }
        try { fs.writeFileSync("4_PS/current.json", JSON.stringify(db_ps)) } catch { }
    }



}

setInterval(ps_end, 1000);
