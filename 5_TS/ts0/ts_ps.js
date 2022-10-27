// open : node ts0/ts_ps
// ts send : ts0/ts_ps.json
// ts receive : ts0/ps_ts.json
// log json to ps : ./log/ts_LOG.JSON
// test_mode : run ps_sim

let ts_id = 0
let chain = "21396d254d2e1ed7"
let next_chain = chain
let ps_ip = "ws://127.0.0.1:2000/"

const version = "RBAS V0.9";
const fs = require("fs");
const ws = require("ws");

let state = 0
let result_index = 0
let req_index = 0
let link_status = "idle"
let ts_req = {}
let ts_result = {}
let wait = 0;
let ws_rx_cnt = 0;
let ws_tx_cnt = 0
let log_disp_flag = 0

async function connect_ws() {
  ts_ptr = 1000 + ts_id
  ws_ps = new ws(ps_ip + ts_ptr);

  ws_ps.onopen = function () {
    link_status = "\033[1;34mconn\033[1;37m";
  };

  ws_ps.onmessage = function (event) {
    ts_result = JSON.parse(event.data);
    ws_rx_cnt++
    result_index = ts_result.index
  };

  ws_ps.onclose = function (e) {
    setTimeout(function () {
      link_status = "idle"
      connect_ws();
    }, 1000);
  };

  ws_ps.onerror = function (e) {
    console.log("PS connection error")
    setTimeout(function () {
      // link_status = "idle"
      connect_ws();
    }, 1000);
  };
}

function init() {
  ts_req = JSON.parse(fs.readFileSync("5_ts/ts_req.json"))
  if (req_index.index == undefined) {
    index = req_index
    in_hash = "-"
    q_hash = "-"
    id = ts_id
    req_index = {index, id, chain, next_chain, in_hash, q_hash}
  } 
  req_index = ts_req.index
  ts_result = JSON.parse(fs.readFileSync("5_ts/ts_result.json"))
  result_index = ts_result.index
  if (result_index == undefined) req_index = req_index
}

function display() {
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m ts_ps \033[1;37m" + "\033[1;33m " + time);
  console.log("\033[1;33m        " + version);
  console.log("\033[1;32m        state = \033[1;37m" + state);
  console.log("\033[1;32m        ts_id = \033[1;37m" + ts_id);
  console.log("\033[1;32m  link_status = \033[1;37m" + link_status);
  console.log("\033[1;32m result_index = \033[1;37m" + result_index)
  console.log("\033[1;32m    req_index = \033[1;37m" + req_index)
  console.log("\033[1;32mlog_disp_flag = \033[1;37m" + log_disp_flag)
  console.log("\033[1;32m         wait = \033[1;37m" + wait)
  console.log("\033[1;32m    ws_tx_cnt = \033[1;37m" + ws_tx_cnt)
  console.log("\033[1;32m    ws_rx_cnt = \033[1;37m" + ws_rx_cnt)
  console.log("\n\033[1;35m ts_req\033[1;37m")
  console.table(ts_req)
  console.log("\n\033[1;35m ts_result\033[1;37m")
  console.table(ts_result)
}

function ts_ready() {
  ts_req = JSON.parse(fs.readFileSync("5_ts/ts_req.json"))
  req_index = ts_req.index
  result_index = ts_result.index
  if (result_index == req_index) {
    if (log_disp_flag != result_index) {
      log_disp_flag = result_index
      data_str = JSON.stringify(ts_result)
      fs.writeFileSync("5_ts/ts_result.json", data_str)
      fs.appendFileSync("5_ts/log/ts_log.json", data_str + ",\n")
    }
    return true
  } 
  return false
}

function user_input() {
  try { ts_req = JSON.parse(fs.readFileSync("5_ts/ts_req.json")) } catch (e) { }
  req_index = ts_req.index
  if (req_index > result_index) return true
  return false
}

function send_req() {
  if (link_status == "\033[1;34mconn\033[1;37m") {
    try { ws_ps.send(JSON.stringify(ts_req)); } catch (e) { }
    ws_tx_cnt++
  }
}

async function ts_ps_main() {
  wait++
  display()
  switch (state) {
    case 0:
      init()
      state = 1
      break;

    case 1:
      send_req()      
      if (ts_ready()) {
        wait = 0
        state = 2
      }
      break;

    case 2:
      if (user_input()) {
        send_req()
        wait = 0
        state = 1
      }
  }
}

connect_ws();
setInterval(ts_ps_main, 1000)