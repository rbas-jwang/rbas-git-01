// wss connect to all dash
// get information from rs0/current_tick.json

const rs_id = 6
const fs = require("fs");
const dash_chain = ["8be18b4928beb703", "0f4cef80c25b6d7e", "95e8781d08c25760", "f69fd660aa86bf7e", "f06cd71d00d54e48", "d71a7cc19254b552", "124b00ccd5ed5d1e", "912cc804ee0e3e5b", "8e071974fe21c095", "2321f5b5807e70a9"]

let tick = "chain_error"
let chain = "8be18b4928beb703"
let next_chain = "0f4cef80c25b6d7e"
let rs_dash = {}
let rs_dash_error = {}
let dash_rx = 0
let dash_connection = [0,0,0,0,0,0,0,0,0]

var wss = new (require('ws')).Server({ port: 1906 }),
    wss_dash = [] // userID: webSocket

wss.on('connection', function (webSocket) {
    var dash_id = parseInt(webSocket.upgradeReq.url.substr(1, 1), 10)
    wss_dash[dash_id] = webSocket
    dash_connection[dash_id] = "connected"

    webSocket.on("message", function (message) {
        input = JSON.parse(message);
        dash_rx++
        if (input.chain == dash_chain[dash_id]) {
            try { wss_dash[dash_id].send(JSON.stringify(rs_dash)) } catch (e) { }
        }
        else {
            try { wss_dash[dash_id].send(JSON.stringify(rs_dash_error)) } catch (e) { }
        }
    });

    webSocket.on('close', function () {
        delete dash_connection[dash_id]
        console.log('link deleted: ' + dash_id)
    })
})

function init() {
    rs_dash_error = { tick, chain, next_chain }
    tick = 1000000000
}

init();
async function rs_dash_main() {
    try { log = JSON.parse(fs.readFileSync("2_RS/current.json")) } catch (e) { }
    tick = log.tick
    chain = log.chain
    next_chain = log.next_chain
    rs_dash = { tick, chain, next_chain }

    console.clear();

    const d = new Date();
    var str = "" + d;
    time = str.substring(4, 24);
    console.log("\033[1;35m \n rs_dash_sim - " +rs_id+"\033[1;33m   " + time);
    console.log("\n\033[1;32m            tick = \033[1;37m" + tick)
    console.log("\033[1;32m dash_connection = \033[1;37m" + dash_connection)
    console.log("\033[1;32m         dash_rx = \033[1;37m" + dash_rx)
    console.log("\n\033[1;35m rs_dash = \033[1;37m");
    console.log(rs_dash)
}
setInterval(rs_dash_main, 1000);

