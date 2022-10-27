// simulate db[1-9] to rs0
// WS connect to rs at port 1910-1908
// update tick

const db_total = 9;
const rs_total = 1;
const crypto = require("crypto");
const ws = require("ws");
const fs = require("fs");

let tick = 100000000;
let last_tick = 0;
let wait = 0;
let in_total = 0;
let in_err = 0;
let q_total = 0;
let q_err = 0;
let hash = "";
let sent_cnt = 0;
let rx_cnt = 0;
let db_rs_json = {};
let rs_db = {};
let chain = "bdca9e8dbca354e8";
let next_chain = "2c0eaec2f05b6c7f";
let rs_ip = [
  "ws://127.0.0.1:1910/",
  "ws://127.0.0.1:1911/",
  "ws://127.0.0.1:1912/",
  "ws://127.0.0.1:1913/",
  "ws://127.0.0.1:1914/",
  "ws://127.0.0.1:1915/",
  "ws://127.0.0.1:1916/",
  "ws://127.0.0.1:1917/",
  "ws://127.0.0.1:1918/"
];
let ws_rs = [];
let rs_tick = [];
let link_status = [];

function connect_ws(db_id, rs_ptr) {
  try {
    ws_rs[db_id][rs_ptr] = new ws(rs_ip[rs_ptr] + db_id);
  } catch (e) { }
  ws_rs[db_id][rs_ptr].onopen = function () {
    link_status[db_id][rs_ptr] = "\033[1;34mconn\033[1;37m";
  };

  ws_rs[db_id][rs_ptr].onmessage = function (event) {
    rs_db = JSON.parse(event.data);
    tick = rs_db.tick;
    rs_tick[db_id] = tick;
    rx_cnt++;
  };

  ws_rs[db_id][rs_ptr].onclose = function (e) {
    setTimeout(function () {
      link_status[db_id][rs_ptr] = "idle";
      connect_ws(db_id, rs_ptr);
    }, 1000);
  };

  ws_rs[db_id][rs_ptr].onerror = function (e) {
    console.log("PS connection error\033[1A");
    setTimeout(function () {
      link_status[db_id][rs_ptr] = "idle";
      connect_ws(db_id, rs_ptr);
    }, 1000);
  };
}

function init() {
  for (i = 0; i < db_total; i++) {
    ws_rs[i] = []
    link_status[i] = []
    for (j = 0; j < rs_total; j++) connect_ws(i, j);
  }
  rs_log = JSON.parse(fs.readFileSync("2_RS/current.json"));
  tick = rs_log.tick;
  in_total = rs_log.in_total;
  in_err = rs_log.in_err;
  q_total = rs_log.q_total;
  q_err = rs_log.q_err;
  chain = rs_log.next_chain;
  next_chain = rs_log.next_chain;
}

function display() {
  console.clear();
  console.log("\033[1;35m db_rs_sim_all \n\033[1;37m");
  console.log("\033[1;32m    last_tick = \033[1;37m" + last_tick);
  console.log("\033[1;32m         tick = \033[1;37m" + tick);
  console.log("\033[1;32m         wait = \033[1;37m" + wait);
  console.log("\033[1;32m     sent_cnt = \033[1;37m" + sent_cnt);
  console.log("\033[1;32m       rx_cnt = \033[1;37m" + rx_cnt);
  console.log("\033[1;32m     db_total = \033[1;37m" + db_total);
  console.log("\033[1;32m     rs_total = \033[1;37m" + rs_total);
  console.log("\033[1;32m  link_status = \033[1;37m" + link_status);
  console.log("\n\033[1;35m db_rs_json \033[1;37m ");
  console.log(db_rs_json)
  console.log("\n\033[1;35m rs_db \033[1;37m ");
  console.log(rs_db)
}

function send_db_rs() {
  last_tick = tick;
  pwd = hash;
  in_total = in_total + 100;
  in_err++;
  q_total = q_total + 100;
  q_err++;
  hash = crypto.createHash("sha256").update(pwd).digest("hex");
  chain = next_chain;
  pwd = chain + hash;
  next_chain = crypto
    .createHash("sha256")
    .update(pwd)
    .digest("hex")
    .substring(0, 16);
  db_rs_json = {
    tick,
    in_total,
    in_err,
    q_total,
    q_err,
    chain,
    next_chain,
    hash,
  };
  for (i = 0; i < db_total; i++) {
    for (j = 0; j < rs_total; j++) {
      try {
        ws_rs[i][j].send(JSON.stringify(db_rs_json));
      } catch (e) { }
      sent_cnt++;
    }
  }
}

init();
function db_sim() {
  wait++;
  display()
  if (tick != last_tick) {
    wait = 0;
    send_db_rs()
  }
}

setInterval(db_sim, 1000);
