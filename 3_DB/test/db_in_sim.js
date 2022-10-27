// simulate (ps_total) PS servers
// each with ts_total ts_req
// write request to to 3_db/ps_req.json
// reply with db_result.json

const ps_total = 1;
const ts_per_ps = 2;
const crypto = require("crypto");
const fs = require("fs");

let ts_total = ps_total * ts_per_ps
let loop = 0;
let index = 0;
let req_tick = 10000000000;

let ps_req = [];
let ps_result = []
let in_hash = "";
let q_hash = "";

function disp() {
  console.clear();
  console.log("\033[1;35m db_in_sim\033[1;37m");
  console.log("\033[1;32m          loop = \033[1;37m" + loop);
  console.log("\033[1;32m      req_tick = \033[1;37m" + req_tick);
  console.log("\033[1;32m      ps_total = \033[1;37m" + ps_total);
  console.log("\033[1;32m      ts_total = \033[1;37m" + ts_total);
  console.log("\033[1;32m         index = \033[1;37m" + index);
  if (ts_total < 5) {
    console.log("\033[1;35m ps_req = \033[1;37m");
    console.log(ps_req);
    console.log("\033[1;35m ps_req[0].ts_req = \033[1;37m");
    if (ps_req[0] != undefined) console.log(ps_req[0].ts_req);
    console.log("\033[1;35m ps_result = \033[1;37m");
    console.log(ps_result);
    console.log("\033[1;35m ps_result[0].ts_result = \033[1;37m");
    if (ps_result[0] != undefined) console.log(ps_result[0].ts_result);
  }
}

function gen_ps_req() {
  index++
  for (i = 0; i < ps_total; i++) {
    let ts_req = [];
    for (j = 0; j < ts_per_ps; j++) {
      id = "U" + index + ".T" + j + ".P" + i;
      str = id + req_tick
      in_hash = crypto.createHash("sha256").update(str).digest("hex");
      q_hash = crypto.createHash("sha256").update(str).digest("hex");
      ts_req[j] = { index, id, in_hash, q_hash };
    }
    tick = req_tick
    ps_req[i] = { tick, ts_req };
  }
  try { fs.writeFileSync("3_DB/ps_req.json", JSON.stringify(ps_req)) } catch (e) { }
}

function init() {
  try {ps_result = JSON.parse(fs.readFileSync("3_DB/ps_result.json"))} catch (e) {}
  req_tick = ps_result[0].tick
  gen_ps_req()
}

function new_result() {
  try { ps_result = JSON.parse(fs.readFileSync("3_DB/ps_result.json")) } catch (e) { }
  try {result_tick = ps_result[0].tick} catch (e) {}
  if (result_tick != undefined) {
    if (result_tick != req_tick) {
      req_tick = result_tick
      return true
    }
  }
  return false
}

async function db_in_sim() {
  loop++;
  disp();
  if (new_result()) gen_ps_req();
}

init();

setInterval(db_in_sim, 1000);
