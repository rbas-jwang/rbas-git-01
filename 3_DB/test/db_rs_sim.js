// simulate db[1 - db_total] 
// WS connect to rs0 at port 1910
// read 3_db/db_rs.json
// send upon every new tick

const db_total = 9;
const ws = require("ws");
const fs = require("fs");

let result_tick = 0;
let req_tick = 0;
let wait = 0;
let tx_cnt = 0;
let rx_cnt = 0;
let db_rs_str = {};
let rs_db = {};
let rs_ip = "ws://127.0.0.1:1910/";
let ws_rs = [];
let link_status = [];
let rs_tick = []
let state = 0

function connect_ws(db_id) {
    try {
        ws_rs[db_id] = new ws(rs_ip + db_id);
    } catch (e) { }
    ws_rs[db_id].onopen = function () {
        link_status[db_id] = "\033[1;34mconn\033[1;37m";
    };

    ws_rs[db_id].onmessage = function (event) {
        rs_db = JSON.parse(event.data);
        rs_tick[db_id] = rs_db.tick
        rx_cnt++;
    };

    ws_rs[db_id].onclose = function (e) {
        setTimeout(function () {
            link_status[db_id] = "idle";
            connect_ws(db_id);
        }, 1000);
    };

    ws_rs[db_id].onerror = function (e) {
        console.log("PS connection error\033[1A");
        setTimeout(function () {
            link_status[db_id] = "idle";
            connect_ws(db_id);
        }, 1000);
    };
}

function init() {
    for (i = 1; i < db_total; i++) {
        link_status[i] = "idle"
        connect_ws(i);
    }
}

function disp() {
    console.clear();
    console.log("\033[1;35m db_rs_sim of [db(1-8) to rs0] \n\033[1;37m");
    console.log("\033[1;32m        state = \033[1;37m" + state);
    console.log("\033[1;32m     req_tick = \033[1;37m" + req_tick);
    console.log("\033[1;32m  result_tick = \033[1;37m" + result_tick);
    console.log("\033[1;32m         wait = \033[1;37m" + wait);
    console.log("\033[1;32m       tx_cnt = \033[1;37m" + tx_cnt);
    console.log("\033[1;32m       rx_cnt = \033[1;37m" + rx_cnt);
    console.log("\033[1;32m  link_status = \033[1;37m" + link_status);
    console.log("\n\033[1;35m db_rs_str \033[1;37m ");
    console.log(db_rs_str)
    console.log("\n\033[1;35m rs_db \033[1;37m ");
    console.log(rs_db)
}

function send_db_rs() {
    try { db_rs = JSON.parse(fs.readFileSync("3_DB/db_rs.json")) } catch (e) { }
    req_tick = db_rs.tick
    for (i = 1; i < db_total; i++) {
        if (link_status[i] == "\033[1;34mconn\033[1;37m") {
            ws_rs[i].send(JSON.stringify(db_rs));
            tx_cnt++;
        }
    }
}

function new_tick() {
    try { rs_db = JSON.parse(fs.readFileSync("3_DB/rs_db.json")) } catch (e) { }
    tick = rs_db.tick
    for (i = 1; i < db_total; i++) {
        if (rs_tick[i] != tick) return false
    }
    return true;
}

async function db_rs_sim() {
    wait++;
    disp();
    switch (state) {
        case 0:
            init();
            state = 1;
            break;

        case 1:
            send_db_rs()
            state = 2;
            break;

        case 2:
            if (new_tick()) {
                wait = 0
                state = 1;
            }
            break;
    }
}

setInterval(db_rs_sim, 1000);
