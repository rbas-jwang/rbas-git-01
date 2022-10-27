// db_rs : connecto to rs at port 1910 - 1918
// input from 3_DB/db1/db_rs.json
// store result at 3_DB/db1/rs_db.json
const version = "RBAS V0.9.2022/08/19 ";
const crypto = require("crypto");
const fs = require("fs");
const ws = require("ws");
const rs_ip = [
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
const db_id = 1001;
const rs_total = 2;

let link_status = [ "idle",
"idle",
"idle",
"idle",
"idle",
"idle",
"idle",
"idle",
"idle"];
let last_tick = 0;
let tick = 0;
let state = 0;
let wait = 0;
let tx_cnt = 0;
let rx_cnt = 0;
let db_rs = {};
let rs_db = {};
let ws_db = [];

async function connect_ws(rs_index) {
  ws_db[rs_index] = new ws(rs_ip[rs_index] + db_id);

  ws_db[rs_index].onopen = function () {
    link_status[rs_index] = "\033[1;34mconn\033[1;37m";
  };

  ws_db[rs_index].onmessage = function (event) {
    rx_cnt++;
    rs_db = JSON.parse(event.data);
    tick = rs_db.tick;
    try {fs.writeFileSync("3_DB/db1/rs_db.json", JSON.stringify(rs_db))} catch(e) {};
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

function all_rs_connect() {
  for (i = 0; i < rs_total; i++) {
    if (link_status[i] != "\033[1;34mconn\033[1;37m") return false;
  }
  return true;
}

function init() {
  for (i = 0; i < rs_total; i++) {
    link_status[i] = "idle";
    connect_ws(i);
  }
}

function disp() {
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.clear();
  console.log("\033[1;35m db_rs\033[1;37m" + "\033[1;33m   " + time);
  console.log("         \033[1;33m" + version);
  console.log("\033[1;32m       db_id = \033[1;37m" + db_id);
  console.log("\033[1;32m    rs_total = \033[1;37m" + rs_total);
  console.log("\033[1;32m   last_tick = \033[1;37m" + last_tick);
  console.log("\033[1;32m        tick = \033[1;37m" + tick);
  console.log("\033[1;32m       state = \033[1;37m" + state);
  console.log("\033[1;32m        wait = \033[1;37m" + wait);
  console.log("\033[1;32m      tx_cnt = \033[1;37m" + tx_cnt);
  console.log("\033[1;32m      rx_cnt = \033[1;37m" + rx_cnt);
  console.log("\033[1;32m link_status = \033[1;37m" + link_status);
  console.log("\n\033[1;35m db_rs = \033[1;37m");
  console.log(db_rs)
  // console.log("\n\033[1;35m rs_db = \033[1;37m");
  // console.log(rs_db)
}

init();
async function db_rs_main() {
  wait++;
  disp();
  switch (state) {
    case 0:
      if (all_rs_connect()) {
        wait = 0;
        state = 1;
      }
      break;

    case 1:
      try {
        db_rs = JSON.parse(fs.readFileSync("3_DB/db1/db_rs.json"));
      } catch (e) {}
      last_tick = db_rs.tick;
      if (tick != last_tick) {
        for (i = 0; i < rs_total; i++) {
          try {
            ws_db[i].send(JSON.stringify(db_rs));
          } catch (e) {}
          tx_cnt++;
        }
        state = 2;
        wait = 0;
      }
      break;

    case 2:

      if (tick != last_tick) {
        wait = 0;
        state = 1;
      }
      break;

    default:
      state = 0;
      break;
  }
  wait++;
}

setInterval(db_rs_main, 1000);
