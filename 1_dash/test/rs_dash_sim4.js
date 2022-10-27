// wss connect to all dash
// get information from rs0/current_tick.json
const crypto = require("crypto");
const rs_id = 4;
const rs_port = [1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909]

let tick = 1000000000
let chain = "8be18b4928beb703";
let next_chain = "0f4cef80c25b6d7e";
let dash_rx = 0;
let dash_connection = ["idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle", "idle"];
let rs_dash = {}

var wss = new (require("ws").Server)({ port: rs_port[rs_id] }),
    wss_dash = []; // userID: webSocket

wss.on("connection", function (webSocket) {
    var dash_id = parseInt(webSocket.upgradeReq.url.substr(1, 1), 10);
    wss_dash[dash_id] = webSocket;
    dash_connection[dash_id] = "\033[1;35mconn\033[1;37m ";

    webSocket.on("message", function (message) {
        dash_rx++;
        tick++;
        chain = next_chain;
        next_chain = crypto.createHash("sha256").update(next_chain).digest("hex").substring(0, 16);
        rs_dash = { tick, chain, next_chain };
        wss_dash[dash_id].send(JSON.stringify(rs_dash));
    });

    webSocket.on("close", function () {
        delete dash_connection[dash_id];
        console.log("link deleted: " + dash_id);
    });
});

async function rs_dash_sim() {
    console.clear();
    const d = new Date();
    var str = "" + d;
    time = str.substring(4, 24);
    console.log("\033[1;35m rs_dash_sim - " + rs_id + "\033[1;33m   " + time);
    console.log("\n\033[1;32m            tick = \033[1;37m" + tick);
    console.log("\033[1;32m dash_connection = \033[1;37m" + dash_connection);
    console.log("\033[1;32m         dash_rx = \033[1;37m" + dash_rx);
    console.log("\n\033[1;35m rs_dash = \033[1;37m");
    console.log(rs_dash);
}
setInterval(rs_dash_sim, 1000);
