// db wss connect to ps at pport 8120
// get result_tick from ps_result

const db_id = 0;
const db_port = 1920 + db_id;
let ps_total = 1;
let ts_each_ps = 2;
let ts_total = ps_total * ts_each_ps

const fs = require("fs");
let tick = 1000000000
let req_tick = tick
let result_tick = tick
let wait = 0;
let max_wait = 10
let ps_req = {}
let ps_result = {};
let rx_cnt = 0;
let tx_cnt = 0
let gen_result_cnt = 0

let link_status = [];
let state = 0;
let ps_rx = []
let in_total = 0
let in_err = 0
let q_total = 0
let q_err = 0
let ts_result = []

var wss = new (require("ws").Server)({ port: db_port }), ws_ps = [];

wss.on("connection", function (webSocket) {
  var ps_id = parseInt(webSocket.upgradeReq.url.substr(2, 4), 10);
  ws_ps[ps_id] = webSocket;
  link_status[ps_id] = "\033[1;34mconn\033[1;37m";

  webSocket.on("message", function (message) {
    rx_cnt++;
    ps_req = JSON.parse(message);
    req_tick = ps_req.tick
    ps_rx[ps_id] = true
  });

  webSocket.on("close", function () {
    delete ws_ps[ps_id];
    link_status[ps_id] = "idle";
  });
});

function init() {

  ps_result = JSON.parse(fs.readFileSync("4_ps/db_ps.json"));

  tick = ps_result.tick
  req_tick = tick
  result_tick = tick
  for (i = 0; i < ps_total; i++) {
    ps_rx[i] = false
  }
}

function display() {
  console.clear();
  console.log("\033[1;35m db_sim " + db_id + "\033[1;37m");

  console.log("\033[1;32m           tick = \033[1;37m" + tick);
  console.log("\033[1;32m       req_tick = \033[1;37m" + req_tick);
  console.log("\033[1;32m    result_tick = \033[1;37m" + result_tick);
  console.log("\033[1;32m          state = \033[1;37m" + state);
  console.log("\033[1;32m           wait = \033[1;37m" + wait);
  console.log("\033[1;32m        db_port = \033[1;37m" + db_port);

  console.log("\033[1;32m       ps_total = \033[1;37m" + ps_total);
  console.log("\033[1;32m       ts_total = \033[1;37m" + ts_total);
  console.log("\033[1;32m gen_result_cnt = \033[1;37m" + gen_result_cnt);
  console.log("\033[1;32m         rx_cnt = \033[1;37m" + rx_cnt);
  console.log("\033[1;32m         tx_cnt = \033[1;37m" + tx_cnt);
  console.log("\033[1;35m    link_status = \033[1;37m" + link_status);
  console.log("\033[1;35m          ps_rx = \033[1;37m" + ps_rx);

  if (ts_total < 6) {
    console.log("\033[1;35m ps_req = \033[1;37m");
    console.log(ps_req);
    console.log("\033[1;35m ps_result = \033[1;37m");
    console.log(ps_result);
  }
}

function all_ps_rx() {
  for (i = 0; i < ps_total; i++) if (ps_rx[i] == false) return false
  for (i = 0; i < ps_total; i++) ps_rx[i] = false
  return true
}

function result_ready() {
  tick = req_tick + 1
  result_tick = tick
  ts_result = ps_req.ts_req
  id = "test_id"
  if (ts_result != undefined) {
    if (ts_result.length >= 1) {
      for (i = 0; i < ts_total; i++) {
        if (ps_req.ts_req != undefined) {
          ts_result[i].in_result_id = id
          ts_result[i].in_result_tick = tick
          ts_result[i].in_total = in_total
          ts_result[i].in_err = in_err
          ts_result[i].q_total = q_total
          ts_result[i].q_err = q_err
          ts_result[i].q_result_tick = tick
          ts_result[i].q_result_id = id
          in_total++
          q_total++
        }
      }
    }
  }
  chain = ps_req.chain
  next_chain = ps_req.next_chain
  ps_result = { tick, chain, next_chain, in_total, q_total, in_err, q_err, ts_result }
  try { fs.writeFileSync("4_PS/db_ps.json", JSON.stringify(ps_result)) } catch { }
  try { fs.writeFileSync("4_PS/current.json", JSON.stringify(db_ps)) } catch { }
  gen_result_cnt++
  return true
}

function send_result() {
  for (i = 0; i < ps_total; i++) {
    if (link_status[i] == "\033[1;34mconn\033[1;37m") {
      ws_ps[i].send(JSON.stringify(ps_result));
    }
  }
}

async function db_ps_main() {
  wait++;
  switch (state) {

    case 0:
      init();
      state = 1;
      break;

    case 1:
      if ((wait > max_wait) || (all_ps_rx())) {
        state = 2
      }
      break;

    case 2:
      if (result_ready()) {
        send_result()
        tx_cnt++
        wait = 0;
        state = 1;
      }

      break;
  }
  display()
}

setInterval(db_ps_main, 1000);
