// test db_ps
// read 3_DB/db0/ps_req.json
// update tick, ps_req.chain, next_chi, in_total, in_err, q_total, q_err
// return 3_DB/db0/ps_result.json
// and update rs_db.json
// and update db_rs.json

const fs = require("fs");
let ps_total = 1;
let ts_total = 1;
let state = 0
let loop = 0;
let tick = 1000000000;
let req_tick = tick
let in_total = 0;
let in_err = 0;
let q_total = 0;
let q_err = 0;
let ps_req = []
let ps_result = [];
let ts_result = [];
let chain = "-test chain"
let next_chain = "- next chain"


function init() {
  try { ps_req = JSON.parse(fs.readFileSync("3_DB/ps_req.json")) } catch (e) { };
  if (ps_req[0] != undefined) {
    tick = ps_req[0].tick
  }
}

function update_result() {
  tick++;
  in_total = in_total + 100;
  in_err++;
  q_total = q_total + 10;
  q_err++;
  for (i = 0; i < ps_total; i++) {

    if (ps_req[i] != undefined) {
      for (j = 0; j < ts_total; j++) {
        if (ps_req[i].ts_req != undefined) {
          ts_result[j] = ps_req[i].ts_req[j];
          ts_result[j].in_total = in_total;
          ts_result[j].in_err = in_err;
          ts_result[j].q_total = q_total;
          ts_result[j].q_err = q_err;
        }
      }
    }
    ps_result[i] = { tick, in_total, in_err, q_total, q_err, ts_result };

  }
  rs_db = {tick}
  db_rs = {tick, chain, next_chain, in_total, in_err, q_total, q_err}
  fs.writeFileSync("3_db/rs_db.json", JSON.stringify(rs_db))
  fs.writeFileSync("3_db/db_rs.json", JSON.stringify(db_rs))
  fs.writeFileSync("3_DB/ps_result.json", JSON.stringify(ps_result))
}

function new_req() {
  try { ps_req = JSON.parse(fs.readFileSync("3_DB/ps_req.json")) } catch (e) { };
  if (ps_req[0] != undefined) {
    ps_total = ps_req.length
    req_tick = ps_req[0].tick
  }
  if (req_tick == tick) return true
  return false
}

function display() {
  console.clear();
  console.log("\033[1;35m db_ps_end\033[1;37m");
  console.log("\033[1;32m         tick = \033[1;37m" + tick);
  console.log("\033[1;32m     req_tick = \033[1;37m" + req_tick);

  console.log("\033[1;32m         loop = \033[1;37m" + loop);
  console.log("\033[1;32m        state = \033[1;37m" + state);
  console.log("\n\033[1;35m ps_req = \033[1;37m");
  console.log(ps_req);
  console.log("\n\033[1;35m ps_result = \033[1;37m");
  console.log(ps_result);
  console.log("\n\033[1;35m ps_result[0].ts_result = \033[1;37m");
  if (ps_result[0] != undefined) console.log(ps_result[0].ts_result);
}

async function db_ps_end() {
  loop++
  display()
  switch (state) {
    case 0:
      init()
      state = 1
      break;

    case 1:
      if (new_req()) state = 2
      break;

    case 2:
      update_result()
      state = 1
      break;

  }

}

setInterval(db_ps_end, 1000);
