// db wss connect to ps at pport 8120
// get result_tick from ps_result[]
// combine all ps_req input to 3_DB/ps_req.json
const db_id = 0;
const db_port = 1920 + db_id;

let ps_total = 1;
let ts_each_ps = 1;
let ts_total = ps_total * ts_each_ps

const fs = require("fs");
let tick = 1000000000
let req_tick = tick
let result_tick = tick
let wait = 0;
let max_wait = 10
let ps_result = [];
let rx_cnt = 0;
let tx_cnt = 0
let ps_req = [];
let link_status = [];
let state = 0;
let ps_rx = []

var wss = new (require("ws").Server)({ port: db_port }), ws_ps = [];

wss.on("connection", function (webSocket) {
  var ps_id = parseInt(webSocket.upgradeReq.url.substr(2, 4), 10);
  ws_ps[ps_id] = webSocket;
  link_status[ps_id] = "\033[1;34mconn\033[1;37m";

  webSocket.on("message", function (message) {
    rx_cnt++;
    ps_req[ps_id] = JSON.parse(message);
    ps_rx[ps_id] = true
  });

  webSocket.on("close", function () {
    delete ws_ps[ps_id];
    link_status[ps_id] = "idle";
  });
});

function display() {
  console.clear();
  console.log("\033[1;35m db_ps " + db_id + "\033[1;37m");

  console.log("\033[1;32m        tick = \033[1;37m" + tick);
  console.log("\033[1;32m    req_tick = \033[1;37m" + req_tick);
  console.log("\033[1;32m result_tick = \033[1;37m" + result_tick);
  console.log("\033[1;32m       state = \033[1;37m" + state);
  console.log("\033[1;32m        wait = \033[1;37m" + wait);
  console.log("\033[1;32m     db_port = \033[1;37m" + db_port);

  console.log("\033[1;32m    ps_total = \033[1;37m" + ps_total);
  console.log("\033[1;32m    ts_total = \033[1;37m" + ts_total);
  console.log("\033[1;32m      rx_cnt = \033[1;37m" + rx_cnt);
  console.log("\033[1;32m      tx_cnt = \033[1;37m" + tx_cnt);
  console.log("\033[1;35m link_status = \033[1;37m" + link_status);
  console.log("\033[1;35m       ps_rx = \033[1;37m" + ps_rx);

  if (ts_total < 6) {
    // console.log("\033[1;35m ps_req = \033[1;37m");
    // console.table(ps_req);
    console.log("\033[1;35m ps_result[0] = \033[1;37m");
    console.table(ps_result[0]);
  }
}

function all_ps_rx() {
  for (i = 0; i < ps_total; i++) if (ps_rx[i] == false) return false
  for (i = 0; i < ps_total; i++) ps_rx[i] = false
  return true
}

function result_ready() {
  try { ps_result = JSON.parse(fs.readFileSync("3_db/ps_result.json")) } catch (e) { }
  if (ps_result[0] != undefined) {
    try { result_tick = ps_result[0].tick } catch (e) { }
    for (i = 0; i < ps_total; i++) if (ps_result[i].tick < req_tick) return false
    return true
  }
  return false
}

function send_result() {
  for (i = 0; i < ps_total; i++) {
    if (link_status[i] == "\033[1;34mconn\033[1;37m") {
      ws_ps[i].send(JSON.stringify(ps_result[i]));
      tx_cnt++
    }
  }
}

function gen_ps_req() {
  req_tick = ps_req[0].tick
  rs_db = JSON.parse(fs.readFileSync("3_DB/rs_db.json"));
  fs.writeFileSync("3_DB/ps_req.json", JSON.stringify(ps_req))
  tick = rs_db.tick;
  wait = 0;
}

function init() {
  try {
    ps_result = JSON.parse(fs.readFileSync("3_db/ps_result.json"));
  } catch (e) { }
  ps_total = ps_result.length
  try {
    ps_req = JSON.parse(fs.readFileSync("3_db/ps_req.json"));
  } catch (e) { }
  for (i = 0; i < ps_total; i++) {
    ps_rx[i] = false
  }
  try { result_tick = ps_result[0].tick } catch (e) { }
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
        gen_ps_req()
        wait = 0;
        state = 1;
      }

      break;
  }
  display()
}

setInterval(db_ps_main, 1000);
