// open : node ps_db
// connect to db at db_ip
// input db_pd from first db[0]
// test_mode : run db_sim (sim one db each, run 9 for 9 db )

const ps_id = 0;
const db_total = 1;
const db_ip_array = [
  "ws://127.0.0.1:1920/",
  "ws://127.0.0.1:1921/",
  "ws://127.0.0.1:1922/",
  "ws://127.0.0.1:1920/",
  "ws://127.0.0.1:1924/",
  "ws://127.0.0.1:1925/",
  "ws://127.0.0.1:1926/",
  "ws://127.0.0.1:1927/",
  "ws://127.0.0.1:1928/",
  "ws://127.0.0.1:1929/",
];

const crypto = require("crypto");
const fs = require("fs");
const ws = require("ws");


let tick = 10000000000;
let result_tick = tick;
let link_status = [];
let chain = "86bd5d12696e2b7e";
let next_chain = "86bd5d12696e2b7e";
let ps_db_init = { tick, chain, next_chain };
let ps_db = {}
let db_ps = [];
let state = 0;
let wait = 0;
let rs_ps_cnt = 0;
let ps_db_cnt = 0;
let ws_ps = [];
let conn_try = 0;

async function connect_ws(db_index) {
  ps_ptr = 1000 + ps_id;
  conn_try++;
  db_ip = db_ip_array[ps_id];
  ws_ps[db_index] = new ws(db_ip + ps_ptr);

  ws_ps[db_index].onopen = function () {
    link_status[db_index] = "\033[1;34mconn\033[1;37m";
  };

  ws_ps[db_index].onmessage = function (event) {
    db_ps[db_index] = JSON.parse(event.data)
    rs_ps_cnt++;
  };

  ws_ps[db_index].onclose = function (e) {
    setTimeout(function () {
      link_status[db_index] = "idle";
      connect_ws(db_index);
    }, 1000);
  };

  ws_ps[db_index].onerror = function (e) {
    setTimeout(function () {
      link_status[db_index] = "idle";
      connect_ws(db_index);
    }, 1000);
  };
}

function display() {
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.clear();
  console.log("\033[1;35m ps_db " + ps_id + "\033[1;33m    " + time);
  console.log("\033[1;32m   result_tick = \033[1;37m" + result_tick);
  console.log("\033[1;32m          tick = \033[1;37m" + tick);
  console.log("\033[1;32m         state = \033[1;37m" + state);
  console.log("\033[1;32m      conn_try = \033[1;37m" + conn_try);
  console.log("\033[1;32m   link_status = \033[1;37m" + link_status);
  console.log("\033[1;32m          wait = \033[1;37m" + wait);
  console.log("\033[1;32m     ps_db_cnt = \033[1;37m" + ps_db_cnt);
  console.log("\033[1;32m     rs_ps_cnt = \033[1;37m" + rs_ps_cnt);
  // console.log("\n\033[1;35m ps_db = \033[1;37m");
  // console.table(ps_db);
  console.log("\n\033[1;35m ps_result (db_ps) = \033[1;37m");
  console.table(db_ps[0]);
}

function init() {
  for (i = 0; i < db_total; i++) {
    link_status[i] = "idle";
    connect_ws(i);
  }
  try {
    ps_db = JSON.parse(fs.readFileSync("4_ps/ps_db.json"))
  } catch (e) { ps_db = ps_db_init }
  tick = ps_db.tick
}

function send_ps_db() {
  try { ps_db = JSON.parse(fs.readFileSync("4_ps/ps_db.json")) } catch (e) { }
  tick = ps_db.tick  
  for (i = 0; i < db_total; i++) {
    if (link_status[i] == "\033[1;34mconn\033[1;37m") {
      try {
        ws_ps[i].send(JSON.stringify(ps_db));
      } catch (e) { }
      ps_db_cnt++;
    }
  }
}

function all_db_ps() {
  if (db_ps[0] != undefined) {
    result_tick = db_ps[0].tick
    for (i = 0; i < db_total; i++) {
      if (db_ps[i].tick != result_tick) return false
    }
    str = JSON.stringify(db_ps[0])
    try { fs.writeFileSync("4_ps/db_ps.json", str) } catch (e) { }
    data_str = str + ",\n";
    fs.appendFileSync("4_ps/log/ps_log.json", data_str);
    return true
  }
  return false
}

async function ps_db_main() {
  wait++;
  display()

  switch (state) {
    case 0:
      init()
      state = 1
      break;

    case 1:
      wait = 0
      send_ps_db()
      state = 2
      break;

    case 2:
      if (all_db_ps()) state = 1
      break;
  }
}

setInterval(ps_db_main, 1000);
