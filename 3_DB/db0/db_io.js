// db_io:
// send result to 3_DB/ps_result.json
// input new req from 3_DB/ps_req.json
// update database at DB/database.json
// generate SYSTEM HASH result and generate db_rs to db_rs.json

const db_id = 0;
let ps_total = 1000;
let ts_total = 1000;

const crypto = require("crypto");
const fs = require("fs");

let result_tick = 1000000000;
let req_tick = result_tick
let db_chain = "-"
let db_next_chain = "-"
let db_in_total = 0;
let db_in_err = 0;
let db_q_total = 0;
let db_q_err = 0;

let ps_in_total = [];
let ps_in_err = [];
let ps_q_total = [];
let ps_q_err = [];

let ts_in_total = [];
let ts_in_err = [];
let ts_q_total = [];
let ts_q_err = [];

let ps_req = [];
let ts_result = [];
let ps_result = [];

let db_rs = {};
let db = {};
let db_disp_ptr = 0;
let db_disp = []; // for disp only
let database = []
let db_ptr = 0
let ps_ptr = 0;
let ts_ptr = 0;

let state = 0;
let wait = 0
let gen_db_rs_cnt = 0
let gen_ps_result_cnt = 0
let ts_req_cnt = 0
let op_time = 0;

function init() {
  in_total = 0;
  in_err = 0;
  q_total = 0;
  q_err = 0;
  for (i = 0; i < ps_total; i++) {
    ts_in_total[i] = [];
    ts_in_err[i] = [];
    ts_q_total[i] = [];
    ts_q_err[i] = [];
    ps_in_total[i] = 0;
    ps_in_err[i] = 0;
    ps_q_total[i] = 0;
    ps_q_err[i] = 0;
    for (j = 0; j < ts_total; j++) {
      ts_in_total[i][j] = 0;
      ts_in_err[i][j] = 0;
      ts_q_total[i][j] = 0;
      ts_q_err[i][j] = 0;
    }
  }
  try { str1 = (fs.readFileSync("3_DB/DB/database.json")) } catch (e) {
    str1 = "empty";
    fs.writeFileSync("3_DB/DB/database.json", "[\n");
  }
  if (str1 != "empty") {
    str1 = str1.slice(0, -2) + ']';
    database = JSON.parse(str1)
    db_ptr = database.length
    for (i = 0; i < db_ptr; i++) {
      key = database[i].hash
      tick = database[i].tick
      id = database[i].id
      db[key] = { id, tick }
    }
  }
  try { db_rs = JSON.parse(fs.readFileSync("3_DB/db_rs.json")) } catch (e) { }
  if (db_rs.tick != undefined) {
    result_tick = db_rs.tick
    db_chain = db_rs.chain
    db_next_chain - db_rs.next_chain
    db_in_total = db_rs.in_total;
    db_in_err = db_rs.in_err
    db_q_total = db_rs.q_total
    db_q_err = db_rs.q_err
  }

  try { ps_result = JSON.parse(fs.readFileSync("3_DB/ps_result.json")) } catch (e) { }
}

function display() {
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m db_io " + "\033[1;33m " + time + "\033[1;37m ");
  console.log("\033[1;32m      result_tick = \033[1;37m" + result_tick);
  console.log("\033[1;32m         req_tick = \033[1;37m" + req_tick);
  console.log("\033[1;32m             wait = \033[1;37m" + wait);
  console.log("\033[1;32m            state = \033[1;37m" + state);
  console.log("\033[1;32m         ps_total = \033[1;37m" + ps_total);
  console.log("\033[1;32m         ts_total = \033[1;37m" + ts_total);
  console.log("\033[1;32m    gen_db_rs_cnt = \033[1;37m" + gen_db_rs_cnt);
  console.log("\033[1;32m gen_ps_resultcnt = \033[1;37m" + gen_ps_result_cnt)
  console.log("\033[1;32m       ts_req_cnt = \033[1;37m" + ts_req_cnt);
  console.log("\033[1;32m           db_ptr = \033[1;37m" + db_ptr);
  console.log("\033[1;32m      db_disp_ptr = \033[1;37m" + db_disp_ptr);
  console.log("\033[1;32m          op_time = \033[1;37m" + op_time + " mS");
  console.log("\033[1;35m db_rs = \033[1;37m");
  console.log(db_rs);
  // if (ts_req_cnt < 5) {
  //   console.log("\033[1;35m ps_req = \033[1;37m");
  //   console.log(ps_req);
  //   console.log("\033[1;35m ps_result = \033[1;37m");
  //   console.log(ps_result);
  //   console.log("\033[1;35m db_disp = \033[1;37m");
  //   console.log(db_disp);
  // }
  // if (db_ptr < 10) {
  //   console.log("\033[1;35m database = \033[1;37m");
  //   console.log(database);
  //   console.log("\033[1;35m db = \033[1;37m");
  //   console.log(db);
  // }
}

function hash_input_query(req) {
  result = req;
  tick = req_tick
  hash = req.in_hash;
  result.in_result_id = "-";
  result.in_result_tick = "-";
  if (hash == undefined) return result
  if (hash.length == 64) {
    db_in_total++;
    ps_in_total[ps_ptr]++;
    ts_in_total[ps_ptr][ts_ptr]++;
    id = req.id;
    if (db[hash] == undefined) {
      db[hash] = { tick, id };
      if (db_disp_ptr < 1000) {

        db_disp[db_disp_ptr] = { hash, tick, id };
        db_disp_ptr++;
      }
      result.in_result_id = id;
      result.in_result_tick = tick;
    } else {
      db_in_err++;
      ps_in_err[ps_ptr]++;
      ts_in_err[ps_ptr][ts_ptr]++;
    }
  }
  result.q_result_id = "-";
  result.q_result_tick = "-";
  hash = req.q_hash;
  if (hash == undefined) return result
  if (hash.length == 64) {
    db_q_total++;
    ps_q_total[ps_ptr]++;
    ts_q_total[ps_ptr][ts_ptr]++;
    id = req.id;
    if (db[hash] == undefined) {
      q_err++;
      ps_q_err[ps_ptr]++;
      ts_q_err[ps_ptr][ts_ptr]++;
    } else {
      result.q_result_id = db[hash].id;
      result.q_result_tick = db[hash].tick;
    }
  }
  result.in_total = ts_in_total[ps_ptr][ts_ptr];
  result.in_err = ts_in_err[ps_ptr][ts_ptr];
  result.q_total = ts_q_total[ps_ptr][ts_ptr];
  result.q_err = ts_q_err[ps_ptr][ts_ptr];
  return result;
}

function gen_ps_result() {
  tick = result_tick
  ts_req_cnt = 0
  ps_result = [];
  db_disp_ptr = 0;
  db_disp = [];
  for (ps_ptr = 0; ps_ptr < ps_total; ps_ptr++) {
    ps_result[ps_ptr] = {}
    if (ps_req[ps_ptr] != undefined) {
      this_ts_req = ps_req[ps_ptr].ts_req
      this_ts_result = []
      ts_total = this_ts_req.length
      for (ts_ptr = 0; ts_ptr < ts_total; ts_ptr++) {
        if (this_ts_req[ts_ptr] != undefined) {
          ts_req_cnt++
          this_req = this_ts_req[ts_ptr];
          this_ts_result[ts_ptr] = hash_input_query(this_req);
        }
      }
      in_total = ps_in_total[ps_ptr];
      in_err = ps_in_err[ps_ptr];
      q_total = ps_q_total[ps_ptr];
      q_err = ps_q_err[ps_ptr];
      ts_result = this_ts_result
      chain = ps_req[ps_ptr].chain
      next_chain = ps_req[ps_ptr].next_chain
      ps_result[ps_ptr] = { tick, in_total, in_err, q_total, q_err, chain, next_chain, ts_result };
    }
  }
  try { fs.writeFileSync("3_DB/ps_result.json", JSON.stringify(ps_result)) } catch (e) { }
  gen_ps_result_cnt++
}

function gen_db_rs_json() {
  result_str = JSON.stringify(ps_result)
  pwd = db_chain + result_str;
  chain = db_next_chain;
  hash = crypto.createHash("sha256").update(pwd).digest("hex");
  db_next_chain = hash.substring(0, 16);
  next_chain = db_next_chain
  in_total = db_in_total;
  in_err = db_in_err;
  q_total = db_q_total;
  q_err = db_q_err;
  tick = req_tick
  db_rs = { tick, chain, next_chain, in_total, in_err, q_total, q_err, hash };
  try { fs.writeFileSync("3_DB/db_rs.json", JSON.stringify(db_rs)) } catch (e) { }
  gen_db_rs_cnt++
}

function new_ps_req() {
  try { rs_db = JSON.parse(fs.readFileSync("3_db/rs_db.json")) } catch (e) { }
  result_tick = rs_db.tick
  if (result_tick > req_tick) {
    req_tick = result_tick
    ps_total = ps_req.length
    return true
  }
  console.log("*** no-new tick) ")
  return false
}

function process_ps_req() {
  start_time = new Date();
  try { ps_req = JSON.parse(fs.readFileSync("3_DB/ps_req.json")) } catch (e) { }
  gen_ps_result();
  gen_db_rs_json();
  str = JSON.stringify(db_disp);
  try {
    fs.writeFileSync("3_DB/DB/db_disp.json", str);
  } catch (e) { }
  new_hash_str = ""
  new_hash_cnt = db_disp.length
  for (i = 0; i < new_hash_cnt; i++) {
    str = JSON.stringify(db_disp[i])
    new_hash_str = new_hash_str + str + ",\n";
    db_ptr++
  }
  try {
    fs.appendFileSync("3_DB/DB/database.json", new_hash_str);
  } catch (e) { }
  op_time = (new Date() - start_time);
}

async function db_io_main() {
  wait++
  display();
  switch (state) {
    case 0:
      init();
      state = 1;
      break;

    case 1:
      if (new_ps_req()) state = 2;
      break;

    case 2:
      wait = 0
      process_ps_req()
      req_tick = tick
      state = 1;
      break;
  }
}

setInterval(db_io_main, 1000);
