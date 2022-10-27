// dash_rs : {chain, next_chain}
// rs_dash = {tick, chain, next_chain}
// write to 1_dash/dash0/CURRENT.json

const rs_total = 9;
const dash_id = 1;

const rs_ip = [
  "ws://127.0.0.1:1900/",
  "ws://127.0.0.1:1901/",
  "ws://127.0.0.1:1902/",
  "ws://127.0.0.1:1903/",
  "ws://127.0.0.1:1904/",
  "ws://127.0.0.1:1905/",
  "ws://127.0.0.1:1906/",
  "ws://127.0.0.1:1907/",
  "ws://127.0.0.1:1908/",
  "ws://127.0.0.1:1909/",
];
const dash_chain = [
  "8be18b4928beb703",
  "0f4cef80c25b6d7e",
  "95e8781d08c25760",
  "f69fd660aa86bf7e",
  "f06cd71d00d54e48",
  "d71a7cc19254b552",
  "124b00ccd5ed5d1e",
  "912cc804ee0e3e5b",
  "8e071974fe21c095",
  "2321f5b5807e70a9",
];
const version = "RBAS V0.8.220112 ";
const crypto = require("crypto");
const fs = require("fs");
const ws = require("ws");

let tick = 1000000000
let chain = dash_chain[dash_id];
let next_chain = chain;
let rs_dash = [];
for (i=0; i< 9; i++) rs_dash[i] = {tick, chain, next_chain}
let ws_rs = [];
let link_status = [];
let dash_rs_json = { chain, next_chain };
let ws_rx_cnt = 0;
let ws_sent_cnt = 0;
let state = 0;

async function connect_ws(rs_index) {
  try {
    ws_rs[rs_index] = new ws(rs_ip[rs_index] + dash_id);
  } catch (e) {
    return;
  }
  ws_rs[rs_index].onopen = function () {
    link_status[rs_index] = "\033[1;34mconn\033[1;37m";
  };

  ws_rs[rs_index].onmessage = function (event) {
    rs_dash[rs_index] = JSON.parse(event.data);
    ws_rx_cnt++;
  };

  ws_rs[rs_index].onclose = function (e) {
    setTimeout(function () {
      link_status[rs_index] = "idle";
      connect_ws(rs_index);
    }, 1000);
  };

  ws_rs[rs_index].onerror = function (e) {
    console.log("PS connection error\033[1A");
    setTimeout(function () {
      link_status[rs_index] = "idle";
      connect_ws(rs_index);
    }, 1000);
  };
}

function display() {
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m dash_rs-" + dash_id + "\033[1;33m   " + time);
  console.log("            \033[1;32m" + version);
  console.log("\033[1;32m      rs_total = \033[1;37m" + rs_total);
  console.log("\033[1;32m         state = \033[1;37m" + state);
  console.log("\033[1;32m   ws_sent_cnt = \033[1;37m" + ws_sent_cnt);
  console.log("\033[1;32m     ws_rx_cnt = \033[1;37m" + ws_rx_cnt);
  console.log("\033[1;32m   link_status = \033[1;37m" + link_status);
  console.log("dash_rs_json = ");
  console.table(dash_rs_json);
  console.log("rs_dash = ");
  console.table(rs_dash);
}

function init() {
  for (i = 0; i < rs_total; i++) {
    link_status[i] = "idle";
    connect_ws(i);
  }
  try {rs_dash = JSON.parse(fs.readFileSync("1_dash/current.json")) } catch(e) {}

  console.table(rs_dash)

  console.log(rs_dash[0])
  tick = rs_dash[0].tick
  if (tick == 1000000000) fs.writeFileSync("1_dash/log/dash_log.json", "[")
}

function poll_rs() {
  for (i = 0; i < rs_total; i++) {
    if (link_status[i] == "\033[1;34mconn\033[1;37m") {
      dash_rs_json = { chain, next_chain }
      try {
        ws_rs[i].send(JSON.stringify(dash_rs_json));
      } catch (e) {}
      ws_sent_cnt++;
    }
  }
}

function log_dash() {
  dash_web = { rs_dash };
  try {
    fs.writeFileSync("1_dash/current.json", JSON.stringify(rs_dash));
  } catch (e) {}
  try {
    fs.appendFileSync(
      "1_dash/log/dash_log.json",
      JSON.stringify(rs_dash) + ",\n"
    );
  } catch (e) {}
}

async function dash_rs_main() {
  display();
  switch (state) {
    case 0:
      init();
      state = 1;
      break;
    case 1:
      poll_rs();
      state = 2;
      break;
    case 2:
      log_dash();
      for (i = 0; i < rs_total; i++) {
        rs_dash[i].tick = 0
      }
      state = 1;
      break;
  }
}

setInterval(dash_rs_main, 1000);
