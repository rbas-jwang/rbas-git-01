// rs at pport 1910 
// connect to db
// return next tick to db

const fs = require("fs");
const db_total = 1
 
let loop = 0
let rx_cnt = 0
let tx_cnt = 0
let chain = ""
let next_chain = ""
let tick = 1000000000
let rs_db = {tick, chain, next_chain}
let db_rs= {}
let link_status = []

var wss = new (require("ws").Server)({ port: 1910 }),
    ws_ps = []; 

wss.on("connection", function (webSocket) {
    var db_index = parseInt(webSocket.upgradeReq.url.substr(1, 1), 10);
    ws_ps[db_index] = webSocket;
    link_status[db_index] = "\033[1;34mconn\033[1;37m"

    webSocket.on("message", function (message) {
        rx_cnt++;
        db_rs= JSON.parse(message)
        tick = db_rs.tick
        loop = 0
        tick++
        chain = db_rs.chain
        next_chain = db_rs.next_chain
        rs_db = {tick, chain, next_chain}        
        ws_ps[db_index].send(JSON.stringify(rs_db));
        tx_cnt++
    });

    webSocket.on("close", function () {
        delete ws_ps[db_index];
        link_status[db_index] = "idle"
    });
}
);

function init() {
    for (i = 0; i < db_total; i++) {
        link_status[i] = "idle"
    }
}

init()

async function rs_sim() {
    loop++;    
    console.clear();
    console.log("\033[1;35m rs_sim\033[1;37m");
    console.log("\033[1;32m          tick = \033[1;37m" + tick)
    console.log("\033[1;32m          loop = \033[1;37m" + loop)
    console.log("\033[1;32m      db_total = \033[1;37m" + db_total)   
    console.log("\033[1;32m        rx_cnt = \033[1;37m" + rx_cnt)
    console.log("\033[1;32m        tx_cnt = \033[1;37m" + tx_cnt)
    console.log("\033[1;32m   link_status = \033[1;37m" + link_status)
    console.log("\n\033[1;35m db_rs= \033[1;37m");
    console.log(db_rs)
    console.log("\n\033[1;35m rs_db = \033[1;37m");
    console.log(rs_db)
}

setInterval(rs_sim, 1000);
