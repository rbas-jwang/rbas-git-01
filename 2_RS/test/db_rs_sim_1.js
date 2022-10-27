// simulate db[1] to rs0
// WS connect to rs at port 1910
// update tick

const crypto = require("crypto");
const ws = require("ws");
const fs = require("fs");

let tick = 100000000;
let last_tick = 0
let wait = 0;
let in_total = 0
let in_err = 0
let q_total = 0
let q_err = 0
let hash = ""
let sent_cnt = 0
let rx_cnt = 0
let db_rs = {}
let rs_db = {}
let chain = "bdca9e8dbca354e8"
let next_chain = "2c0eaec2f05b6c7f"
let rs_ip = "ws://127.0.0.1:1910/"
let ws_rs = []
let rs_tick = []
let link_status = []

function connect_ws(db_id) {
    conn_id = 1000+db_id
    try {ws_rs[db_id] = new ws(rs_ip + conn_id)} catch(e) {}
    ws_rs[db_id].onopen = function () {
        link_status[db_id] = "\033[1;34mconn\033[1;37m";
    };

    ws_rs[db_id].onmessage = function (event) {
        rs_db = JSON.parse(event.data);
        tick = rs_db.tick
        rs_tick[db_id] = tick
        rx_cnt++
    };

    ws_rs[db_id].onclose = function (e) {
        setTimeout(function () {
            link_status[db_id] = "idle"
            connect_ws(db_id);
        }, 1000);
    };

    ws_rs[db_id].onerror = function (e) {
        console.log("PS connection error\033[1A")
        setTimeout(function () {
            link_status[db_id] = "idle"
            connect_ws(db_id);
        }, 1000);
    };
}

function init() {
    connect_ws(0)
    rs_log = JSON.parse(fs.readFileSync("2_RS/rs0/current.json"))
    tick = rs_log.tick
    in_total = rs_log.in_total
    in_err = rs_log.in_err
    q_total = rs_log.q_total
    q_err = rs_log.q_err
    chain = rs_log.next_chain
    next_chain = rs_log.next_chain
}

init()

function db_sim() {
    wait++
    if (tick != last_tick) {
        wait = 0
        last_tick = tick
        pwd = hash;
        in_total = in_total + 100
        in_err++
        q_total = q_total + 100
        q_err++
        hash = crypto.createHash("sha256").update(pwd).digest("hex");
        chain = next_chain
        pwd = chain + hash
        next_chain = (crypto.createHash("sha256").update(pwd).digest("hex")).substring(0, 16)
        db_rs = { tick, in_total, in_err, q_total, q_err, chain, next_chain, hash }
        try {ws_rs[0].send(JSON.stringify(db_rs))} catch(e) {}
        sent_cnt++

    }

    console.clear();
    console.log("\033[1;35m db_rs_sim_1 \n\033[1;37m");
    console.log("\033[1;32m    last_tick = \033[1;37m" + last_tick);
    console.log("\033[1;32m         tick = \033[1;37m" + tick);
    console.log("\033[1;32m         wait = \033[1;37m" + wait);
    console.log("\033[1;32m     sent_cnt = \033[1;37m" + sent_cnt);
    console.log("\033[1;32m       rx_cnt = \033[1;37m" + rx_cnt);
    console.log("\033[1;32m        chain = \033[1;37m" + chain);
    console.log("\033[1;32m   next_chain = \033[1;37m" + next_chain);
    console.log("\033[1;32m      hash = \033[1;37m" + hash);
    console.log("\033[1;32m  link_status = \033[1;37m" + link_status);
    console.log("\n\033[1;35m rs_db \033[1;37m ");
    console.log(rs_db)
    console.log("\n\033[1;35m db_rs \033[1;37m ");
    console.log(db_rs)
}

setInterval(db_sim, 1000);
