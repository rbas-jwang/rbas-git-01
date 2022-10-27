// dash_rs : {chain, next_chain}
// rs_dash = {tick, chain, next_chain}
// write to 1_dash/dash0/CURRENT.json

const version = "RBAS V0.8.220112 ";
const crypto = require("crypto");
const fs = require("fs");
const ws = require("ws");

const rs_total = 9
let dash_id = 8
let rs_ip = [
    "ws://127.0.0.1:1900/",
    "ws://127.0.0.1:1901/",
    "ws://127.0.0.1:1902/",
    "ws://127.0.0.1:1903/",
    "ws://127.0.0.1:1904/",
    "ws://127.0.0.1:1905/",
    "ws://127.0.0.1:1906/",
    "ws://127.0.0.1:1907/",
    "ws://127.0.0.1:1908/",
    "ws://127.0.0.1:1909/"]
let tick = 1000000000
let chain = "8e071974fe21c095"
let next_chain = chain
let rs_dash = []
let ws_rs = []
let link_status = [];
let dash_rs_json = { chain, next_chain }
let ws_rx_cnt = 0;
let ws_sent_cnt = 0;

for (i = 0; i < rs_total; i++) {
    link_status[i] = "idle"
    connect_ws(i);
}

async function connect_ws(rs_index) {

    try { ws_rs[rs_index] = new ws(rs_ip[rs_index] + dash_id) } catch (e) { return };
    ws_rs[rs_index].onopen = function () {
        link_status[rs_index] = "\033[1;34mconn\033[1;37m";
    };

    ws_rs[rs_index].onmessage = function (event) {
        rs_dash[rs_index] = JSON.parse(event.data);
        ws_rx_cnt++
        tick = rs_dash.tick
    };

    ws_rs[rs_index].onclose = function (e) {
        setTimeout(function () {
            link_status[rs_index] = "idle"
            connect_ws(rs_index);
        }, 1000);
    };

    ws_rs[rs_index].onerror = function (e) {
        console.log("PS connection error\033[1A")
        setTimeout(function () {
            link_status[rs_index] = "idle"
            connect_ws(rs_index);
        }, 1000);
    };
}

async function dash_rs() {
    dash_web = { rs_dash }
    try { fs.writeFileSync("1_dash/dash0/current.json", JSON.stringify(dash_web)) } catch (e) { }

    for (i = 0; i < rs_total; i++) {
        if (link_status[i] == "\033[1;34mconn\033[1;37m") {
            // chain = next_chain
            // next_chain = crypto.createHash('sha256').update(next_chain).digest('hex').substring(0, 16);
            // dash_rs_json = { chain, next_chain }
            try { ws_rs[i].send(JSON.stringify(dash_rs_json)); } catch (e) { }
            ws_sent_cnt++
        }
    }
    console.clear();
    const d = new Date();
    var str = "" + d;
    time = str.substring(4, 24);
    console.log("\033[1;35m dash_rs-"+ dash_id + "\033[1;33m   " + time);
    console.log("            \033[1;32m" + version);
    console.log("\033[1;32m      rs_total = \033[1;37m" + rs_total);
    console.log("\033[1;32m          tick = \033[1;37m" + tick)
    console.log("\033[1;32m         chain = \033[1;37m" + chain)
    console.log("\033[1;32m    next_chain = \033[1;37m" + next_chain)
    console.log("\033[1;32m   ws_sent_cnt = \033[1;37m" + ws_sent_cnt)
    console.log("\033[1;32m     ws_rx_cnt = \033[1;37m" + ws_rx_cnt)
    console.log("\033[1;32m   link_status = \033[1;37m" + link_status)
    console.log("\ndash_rs_json = ");
    console.table(dash_rs_json)
    console.log("\nrs_dash = ");
    console.table(rs_dash)
}

setInterval(dash_rs, 1000)