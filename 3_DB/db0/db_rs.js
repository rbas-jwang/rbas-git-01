// db_rs : connecto to rs at port 1910 - 1918
// output  3_DB/db_rs_json
// input   3_DB/rs_db.json

const db_id = 0;
const rs_total = 1;
const rs_ip_array = [
  "ws://127.0.0.1:1910/",
  "ws://127.0.0.1:1911/",
  "ws://127.0.0.1:1912/",
  "ws://127.0.0.1:1913/",
  "ws://127.0.0.1:1914/",
  "ws://127.0.0.1:1915/",
  "ws://127.0.0.1:1916/",
  "ws://127.0.0.1:1917/",
  "ws://127.0.0.1:1918/",
];

const version = "RBAS V0.9.2022/08/19 ";
const fs = require("fs");
const ws = require("ws");

let link_status = [];
let tick = 1000000000;
let state = 0;
let wait = 0;
let tx_cnt = 0;
let rx_cnt = 0;
let db_rs = {};
let rs_db = {};
let ws_db = [];
let chain = "38b6aba0e9981a60"
let next_chain = "38b6aba0e9981a60"
let hash = "38b6aba0e9981a603fd951228f5b2dac7c8315f017aeb6f55a04aaf815469d01"
let in_total = 0
let in_err = 0
let q_total = 0
let q_err = 0
let db_rs_init = { tick, chain, next_chain, hash, in_total, in_err, q_total, q_err }
let rs_tick = []

async function connect_ws(rs_index) {
  ws_db[rs_index] = new ws(rs_ip_array[rs_index] + db_id);
  ws_db[rs_index].onopen = function () {
    link_status[rs_index] = "\033[1;34mconn\033[1;37m";
  };

  ws_db[rs_index].onmessage = function (event) {
    rx_cnt++;
    rs_db = JSON.parse(event.data);
    if (rs_db != undefined) rs_tick[rs_index] = rs_db.tick;
    try { fs.writeFileSync("3_DB/rs_db.json", JSON.stringify(rs_db)) } catch (e) { };
  };

  ws_db[rs_index].onclose = function (e) {
    setTimeout(function () {
      link_status[rs_index] = "idle";
      connect_ws(rs_index);
    }, 1000);
  };

  ws_db[rs_index].onerror = function (e) {
    // console.log("ws_link connection error" + rs_index);
    setTimeout(function () {
      link_status[rs_index] = "idle"
      connect_ws(rs_index);
    }, 1000);
  };
}

function all_rs_sync() {
  tick = rs_tick[0]
  for (i = 0; i < rs_total; i++) {
    if (rs_tick[i] != tick) return false
  }
  return true;
}

function init() {
  try { db_rs = JSON.parse(fs.readFileSync("3_DB/db_rs.json")) } catch (e) {
    db_rs = db_rs_init
  };
  for (i = 0; i < rs_total; i++) {
    link_status[i] = "idle";
    connect_ws(i);
    rs_tick[i] = tick
  }
  for (i = 0; i < rs_total; i++) {
    if (link_status[i] == "\033[1;34mconn\033[1;37m") {
      ws_db[i].send(JSON.stringify(db_rs));
      tx_cnt++;
    }
  }
}

function send_db_rs() {
  try {db_rs = JSON.parse(fs.readFileSync("3_DB/db_rs.json")) } catch (e) { }
  for (i = 0; i < rs_total; i++) {
    if (link_status[i] == "\033[1;34mconn\033[1;37m") {
      ws_db[i].send(JSON.stringify(db_rs));
      tx_cnt++;
    } 
  }
}

function disp() {
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.clear();
  console.log("\033[1;35m db_rs   \033[1;37m" + "\033[1;33m   " + time);
  console.log("            \033[1;33m" + version);
  console.log("\033[1;32m         db_id = \033[1;37m" + db_id);
  console.log("\033[1;32m      rs_total = \033[1;37m" + rs_total);
  console.log("\033[1;32m          tick = \033[1;37m" + tick);
  console.log("\033[1;32m          wait = \033[1;37m" + wait);
  console.log("\033[1;32m         state = \033[1;37m" + state);
  console.log("\033[1;32m        tx_cnt = \033[1;37m" + tx_cnt);
  console.log("\033[1;32m        rx_cnt = \033[1;37m" + rx_cnt);
  console.log("\033[1;32m   link_status = \033[1;37m" + link_status);
  console.log("\033[1;32m        rs_tick= \033[1;37m" + rs_tick);
  console.log("\033[1;35m db_rs = \033[1;37m");
  console.log(db_rs)
  console.log("\033[1;35m rs_db = \033[1;37m");
  console.log(rs_db)
}

init();
async function db_rs_main() {
  wait++;
  disp();
  switch (state) {
    case 0:
      if (all_rs_sync()) state = 1;
      break;

    case 1:
      send_db_rs()
      state = 2;
      break;

    case 2:
      if (all_rs_sync()) state = 1;
      break;
  }
}

setInterval(db_rs_main, 1000);
