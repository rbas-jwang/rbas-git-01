// ts_sim :- simulate up to 1000active ts 
// ws input request to ps0 "ws://127.0.0.1:2000/"
// continue to req in_hash + q_hash service 

const crypto = require("crypto");
const fs = require("fs");
const ws = require("ws");
const ps_ip = "ws://127.0.0.1:2000/"
const ts_active = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
]

let ts_total = 1000
let user_id = "P0T"
let index = 0
let tick = 10000000000
let req_tick = tick
let result_tick = tick
let link_status = []
let ws_ps = []
let ts_req = []
let ts_result = []
let loop = 0;
let ws_rx_cnt = 0;
let ws_tx_cnt = 0
let ts_chain = []
let chain = "a69313b4d3e23363"
let next_chain = "23363dbea6579cd6"
let in_hash = "2998e69d3b406b38d719e98b70bb7ab80139b89dabfe3212097fffde3ee1906f"
let q_hash = "a40d149b9527660a46216c8ff919034a99ed4a91d5806aa91dd4df20f9699d03"
let state = 0

async function connect_ws(ts_id) {
    ts_ptr = 1000 + ts_id
    ws_ps[ts_id] = new ws(ps_ip + ts_ptr);

    ws_ps[ts_id].onopen = function () {
        link_status[ts_id] = "\033[1;34mconn\033[1;37m"
    };

    ws_ps[ts_id].onmessage = function (event) {
        ts_result[ts_id] = JSON.parse(event.data)
        ws_rx_cnt++
    }

    ws_ps[ts_id].onclose = function (e) {
        setTimeout(function () {
            link_status[ts_id] = "idle"
            connect_ws(ts_id);
        }, 1000);
    };

    ws_ps[ts_id].onerror = function (e) {
        console.log("PS connection error")
        setTimeout(function () {
            link_status = "idle"
            connect_ws(ts_id);
        }, 1000);
    };
}

function init() {
    current = JSON.parse(fs.readFileSync("4_ps/db_ps.json"))
    tick = current.tick
    for (i = 3; i < ts_total; i++) {
        ts_chain[i] = chain
        link_status[i] = "idle"
        connect_ws(i);
    }
}

function display() {
    console.clear();
    console.log("\033[1;35m ts_sim\033[1;37m");
    console.log("\033[1;32m        tick = \033[1;37m" + tick)
    console.log("\033[1;32m    req_tick = \033[1;37m" + req_tick)
    console.log("\033[1;32m result_tick = \033[1;37m" + result_tick)
    console.log("\033[1;32m        loop = \033[1;37m" + loop)
    console.log("\033[1;32m  url to ps0 = \033[1;37m" + ps_ip);
    console.log("\033[1;32m       index = \033[1;37m" + index)
    console.log("\033[1;32m    ts_total = \033[1;37m" + ts_total)
    console.log("\033[1;32m   ws_tx_cnt = \033[1;37m" + ws_tx_cnt)
    console.log("\033[1;32m   ws_rx_cnt = \033[1;37m" + ws_rx_cnt)
    console.log("\033[1;32m link_status = \033[1;37m" + link_status)
    console.log("\033[1;32m       state = \033[1;37m" + state)
    if (ts_total < 3) {
        console.log("\033[1;35m ts_req = \033[1;37m");
        console.log(ts_req)
        console.log("\n ts_result = ");
        console.log(ts_result)
    }
}

function next_tick() {
    try { result_tick = ts_result[1].tick } catch (e) { }
    console.log("result_tick = " + result_tick + ", req_tick = " + req_tick)
    result_tick == req_tick
    tick = result_tick
    try { fs.writeFileSync("4_ps/sim_ts_result.json", JSON.stringify(ts_result)) } catch (e) { }
    return true
}

function send_new_req() {
    req_tick = tick
    index++
    for (i = 3; i < ts_total; i++) {
        if ((link_status[i] != "cidleonnected") && (ts_active[i] == 1)) {
            id = user_id + i + "U" + index
            pwd = chain + in_hash + q_hash + tick
            in_hash = crypto.createHash("sha256").update(pwd).digest("hex")
            q_hash = in_hash
            chain = ts_chain[i]
            ts_chain[i] = in_hash.substring(0, 16);
            next_chain = ts_chain[i]
            ts_req[i] = { index, id, chain, next_chain, in_hash, q_hash }
            try { ws_ps[i].send(JSON.stringify(ts_req[i])) } catch (e) { }
            try { fs.writeFileSync("4_ps/sim_ts_req.json", JSON.stringify(ts_req)) } catch (e) { }
            ws_tx_cnt++
        }
    }
}

async function ts_ps() {
    loop++
    display()
    switch (state) {
        case 0:
            init()
            state = 1
            break;

        case 1:
            send_new_req()
            state = 2
            break;

        case 2:
            if (next_tick()) {
                state = 1
            }
            break;
    }
}

setInterval(ts_ps, 1000)