// ps_sim :- simulate ps_total ps servers
// ws send ps_req[ps_id] request to db[0]
// reply with ps_result

const ps_total = 1
const ts_per_ps = 2
const db_ip = "ws://127.0.0.1:1920/"
const crypto = require("crypto");
const fs = require("fs");
const ws = require("ws");
let state = 0
let index = 0;
let loop = 0
let tick = 10000000000
let req_tick = tick
let result_tick = 0
let link_status = []
let ws_ps = []
let ts_request = []
let ps_req = []
let ps_result = []
let ws_rx_cnt = 0;
let ws_tx_cnt = 0
let chain = "a69313b4d3e23363"
let next_chain = "23363dbea6579cd6"
let in_hash = "2998e69d3b406b38d719e98b70bb7ab80139b89dabfe3212097fffde3ee1906f"
let q_hash = "a40d149b9527660a46216c8ff919034a99ed4a91d5806aa91dd4df20f9699d03"

async function connect_ws(ps_id) {
    ps_ptr = 1000 + ps_id
    ws_ps[ps_id] = new ws(db_ip + ps_ptr);

    ws_ps[ps_id].onopen = function () {
        link_status[ps_id] = "\033[1;34mconn\033[1;37m"
    };

    ws_ps[ps_id].onmessage = function (event) {
        ws_rx_cnt++        
        ps_result[ps_id] = JSON.parse(event.data)
        result_tick = ps_result[ps_id].tick
    }

    ws_ps[ps_id].onclose = function (e) {
        setTimeout(function () {
            link_status[ps_id] = "idle"
            connect_ws(ps_id);
        }, 1000);
    };

    ws_ps[ps_id].onerror = function (e) {
        // console.log("PS connection error")
        setTimeout(function () {
            link_status[ps_id] = "idle"
            connect_ws(ps_id);
        }, 1000);
    };
}

function display() {
    console.clear();
    console.log("\033[1;35m ps_sim\033[1;37m");
    console.log("\033[1;32m        state = \033[1;37m" + state);
    console.log("\033[1;32m        db_ip = \033[1;37m" + db_ip);
    console.log("\033[1;32m         tick = \033[1;37m" + tick)
    console.log("\033[1;32m     req_tick = \033[1;37m" + req_tick)
    console.log("\033[1;32m  result_tick = \033[1;37m" + result_tick)

    console.log("\033[1;32m         loop = \033[1;37m" + loop)
    console.log("\033[1;32m        index = \033[1;37m" + index)
    console.log("\033[1;32m    ws_tx_cnt = \033[1;37m" + ws_tx_cnt)
    console.log("\033[1;32m    ws_rx_cnt = \033[1;37m" + ws_rx_cnt)
    console.log("\033[1;32m  link_status = \033[1;37m" + link_status)

    console.log("\033[1;35m ps_req = \033[1;37m");
    console.log(ps_req)

    console.log("\033[1;35m ps_req[0].ts_req = \033[1;37m");
    if (ps_req[0] != undefined) console.log(ps_req[0].ts_req)
    console.log("\033[1;35m ps_result = \033[1;37m");
    console.log(ps_result)
    console.log("\033[1;35m ps_result[0].ts_result = \033[1;37m");
    if (ps_result[0] != undefined) console.log(ps_result[0].ts_result)
}

function gen_ps_req() {
    for (i = 0; i < ps_total; i++) {
        ps_req[i] = {}
        ts_req = []
        for (j = 0; j < ts_per_ps; j++) {
            id = "U" + index + ".T" + j + ".P" + i
            in_hash = crypto.createHash("sha256").update(id).digest("hex")
            q_hash = crypto.createHash("sha256").update(id).digest("hex")
            ts_request[j] = { index, id, in_hash, q_hash }
        }
        chain = next_chain
        pwd = chain + in_hash + q_hash
        next_chain = crypto.createHash("sha256").update(pwd).digest("hex").substring(0, 16);
        ts_req = ts_request
        tick = result_tick
        ps_req[i] = { tick, chain, next_chain, ts_req }
    }
    for (i = 0; i < ps_total; i++) {
        if (link_status[i] == "\033[1;34mconn\033[1;37m") {
            ws_ps[i].send(JSON.stringify(ps_req[i]))
            ws_tx_cnt++
        }
    }
}

function init() {
    for (i = 0; i < ps_total; i++) {
        link_status[i] = "idle"
        connect_ws(i);
    }
    try {ps_result = JSON.parse(fs.readFileSync("3_db/ps_result.json"))} catch(e) {}
    if (ps_result[0] != undefined)     tick = ps_result[0].tick
    req_tick = tick-1
    result_tick = tick
}

async function ps_sim() {
    loop++
    display()    
    switch (state) {
        case 0:
            init()
            gen_ps_req()
            state = 1
            break;
        case 1:
            if ((ws_rx_cnt == ws_tx_cnt)) {
                state = 2
            }
            break;
        case 2:
            req_tick = result_tick
            index++
            gen_ps_req()
            state = 1
            break;
    }

}

init()

setInterval(ps_sim, 1000)