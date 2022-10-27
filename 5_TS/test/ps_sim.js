// ps_sim : simulate ps
// init based on 5_TS/web/current_tick.json
// WS connect to TS at port
// update tick, in_total, in_err, q_total, q_err
// log to 5_TS/log/T0P0.json

const fs = require("fs");

let tick = 100000000;
let rx_cnt = 0;
let wait = 0;
let ts_req = {};
let ts_result = {};
let index = 0;
let in_total = 0;
let in_err = 0;
let q_total = 0;
let q_err = 0;
let chain = "";
let next_chain = "";
let ts_link = []

function init() {
  web_ts_json = {};
  try {ts_result = JSON.parse(fs.readFileSync("5_TS/ts_result.json"))} catch (e) { }
  index = ts_result.index;
  chain = ts_result.chain;
  next_chain = ts_result.next_chain;
  tick = 1000000000
  in_total = ts_result.in_total;
  in_err = ts_result.in_err;
  q_total = ts_result.q_total;
  q_err = ts_result.q_err;
}

var wss = new (require("ws").Server)({ port: 2000 }), ws_ts = [];

wss.on("connection", function (webSocket) {
  var userID = parseInt(webSocket.upgradeReq.url.substr(2, 4), 10);
  ws_ts[userID] = webSocket;
  ts_link[userID] = "\033[1;34mconn\033[1;37m"

  webSocket.on("message", function (message) {
    rx_cnt++;
    console.log("received from " + userID);
    ts_req = JSON.parse(message);
    if (index != ts_req.index || index == 0) {
      {
        index = ts_req.index;
        id = ts_req.id;
        chain = ts_req.chain;
        next_chain = ts_req.next_chain;
        in_result_id = "-";
        in_result_tick = "-";
        q_result_id = "-";
        q_result_tick = "-";
        in_hash = ts_req.in_hash;
        if (in_hash.length == 64) {
          in_result_id = id;
          in_result_tick = tick;
          in_total++;
        }
        q_hash = ts_req.q_hash;
        if (q_hash.length == 64) {
          q_result_id = id;
          q_result_tick = tick;
          q_total++;
        }
        ts_result = { index, id, tick, chain, next_chain, in_hash, in_result_id, in_result_tick, in_total, in_err, q_hash, q_result_id, q_result_tick, q_total, q_err };
        ws_ts[userID].send(JSON.stringify(ts_result));
      }
    }
  });

  webSocket.on("close", function () {
    delete ws_ts[userID];
    console.log("deleted: " + userID);
    ts_link[userID] = "idle"
  });
});

init();

async function ps_sim() {
  tick++;
  wait++;

  console.clear();
  console.log("\033[1;35mps_sim \nts-ps connection\033[1;37m");
  console.log("\033[1;32m         tick = \033[1;37m" + tick);
  console.log("\033[1;32m         wait = \033[1;37m" + wait);
  console.log("\033[1;32m       rx_cnt = \033[1;37m" + rx_cnt);
  console.log("\033[1;32m   next_chain = \033[1;37m" + next_chain);
  console.log("\033[1;32m      ts_link = \033[1;37m" + ts_link);

  console.log("\033[1;35m ts_req\033[1;37m");
  console.table(ts_req);
  console.log("\033[1;35m ts_result\033[1;37m");
  console.table(ts_result);
}

setInterval(ps_sim, 1000);
