//  PS main  WSS connect to all ts at ps_portts_result
//  combines input to ps_db.json
//  reply with ts_result[i]
const ps_id = 0
const ps_port = 2000 + ps_id
let ts_total = 1
let ts_chain = [
  '21396d254d2e1ed7',
  'e6ed1ef841168f06',
  '4dd93ec4aa4d1ad4',
  'e2308750486f06f8',
  '46cfc23e307fcc22',
  '4491afb18511521b',
  '81721ae0f964b628',
  '4a1c23f93de69ee9',
  'ef0bd42519cb9215',
  '904b050d9a3f4e67'
]

const version = "  RBAS V0.9";
const crypto = require("crypto");
const fs = require("fs");

let state = 0
let tick = 1000000000
let result_tick = tick
let req_tick = tick
let chain = '86bd5d12696e2b7e'
let next_chain = '86bd5d12696e2b7e'
let db_ps_init = { tick, chain, next_chain }
let ts_rx = 0
let ts_tx = 0
let wait = 0
let ts_connection = []
let ts_req = []
let ps_db = {}
let db_ps = {}
let ps_db_cnt = 0
let ts_result = {}

let wss = new (require('ws')).Server({ port: ps_port }), ws_ts = []

wss.on('connection', function (webSocket) {
  let ts_id = parseInt(webSocket.upgradeReq.url.substr(2, 4), 10)
  ws_ts[ts_id] = webSocket;
  ts_connection[ts_id] = "\033[1;34mconn\033[1;37m"

  webSocket.on('message', function (message) {
    ts_rx++
    ts_req[ts_id] = JSON.parse(message)
    if (db_ps.ts_result != undefined) {
      ts_result = db_ps.ts_result[ts_id]
      if (ts_result != undefined) {
        ts_result.tick = tick
        ws_ts[ts_id].send(JSON.stringify(ts_result));
        ts_tx++
      }
    }
  })

  webSocket.on('close', function () {
    delete ws_ts[ts_id]
    ts_connection[ts_id] = "idle"
  })
})

function display() {
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  ts_total = ts_connection.length
  console.log("\033[1;35m ps_ts" + "\033[1;33m " + time + version);
  console.log("\033[1;32m       ps_port = \033[1;37m" + ps_port);
  console.log("\033[1;32m      ts_total = \033[1;37m" + ts_total);
  console.log("\033[1;32m      req_tick = \033[1;37m" + req_tick)
  console.log("\033[1;32m   result_tick = \033[1;37m" + result_tick)
  console.log("\033[1;32m          wait = \033[1;37m" + wait);
  console.log("\033[1;32m         ts_rx = \033[1;37m" + ts_rx);
  console.log("\033[1;32m         ts_tx = \033[1;37m" + ts_tx);
  console.log("\033[1;32m         state = \033[1;37m" + state);
  console.log("\033[1;32m     ps_db_cnt = \033[1;37m" + ps_db_cnt);
  console.log("\033[1;32m ts_connection = \033[1;37m" + ts_connection);

  if (ts_total < 2) {
    console.log("\033[1;35m ps_db = \033[1;37m");
    console.log(ps_db)
    console.log("\033[1;35m ts_req = \033[1;37m");
    console.log(ts_req)
    console.log("\033[1;35m db_ps = \033[1;37m");
    console.log(db_ps)
    console.log("\033[1;35m ts_result = \033[1;37m");
    console.log(ts_result)
  }
}

function init() {
  try { db_ps = JSON.parse(fs.readFileSync("4_PS/db_ps.json")) } catch (e) { db_ps = db_ps_init };
  result_tick = db_ps.tick
}

function gen_ps_db() {
  chain = next_chain
  pwd = chain + ts_req
  next_chain = crypto.createHash("sha256").update(pwd).digest("hex").substring(0, 16);
  req_tick = result_tick
  tick = req_tick
  ps_db = { tick, chain, next_chain, ts_req }
  ps_db_cnt++
  try { fs.writeFileSync("4_PS/ps_db.json", JSON.stringify(ps_db)) } catch (e) { }
  ts_req = []
}

function new_tick() {
  try { db_ps = JSON.parse(fs.readFileSync("4_PS/db_ps.json")) } catch (e) { db_ps = db_ps_init };
  result_tick = db_ps.tick
  if (result_tick == req_tick) return false
  req_tick = result_tick
  return true
}

async function main() {
  display();
  wait++

  switch (state) {
    case 0:
      init();
      if (new_tick()) state = 1
      break;

    case 1:
      gen_ps_db();
      wait = 0
      state = 2;
      break;

    case 2:
      if (new_tick()) {
        wait = 0
        state = 1
      }
      break;
  }
}

setInterval(main, 1000);
