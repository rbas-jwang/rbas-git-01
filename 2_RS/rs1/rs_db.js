// ws connect from all db at port 1910
// write result to rs0/current_tick.json

const version = "RBAS V0.9.2022/08/19 ";
const rs_id = 1
const fs = require("fs");
const rs_db_port_array = [1910, 1911,1912,1913,1914,1915,1916,1917,1918]
const db_total = 9;
const min_vote = 5;
const init_json = { "tick": 1000000000, "chain": "38b6aba0e9981a60", "next_chain": "38b6aba0e9981a60" }

let wait = 0;
let tick = 1000000000;
let time = "";
let hash = "38b6aba0e9981a603fd951228f5b2dac7c8315f017aeb6f55a04aaf815469d01";
let chain = "38b6aba0e9981a60";
let next_chain = "38b6aba0e9981a60";
let db_rx = 0;
let gen_count = 0
let db_connection = [];
let db_status = "- - - - - - - - -";
let in_total = 0;
let in_err = 0;
let q_total = 0;
let q_err = 0;
let db_log = [];
let rs_db = {};
let vote = 0;
let state = 0;
let rs_log = {};

rs_db_port = rs_db_port_array[rs_id];
var wss = new (require("ws").Server)({ port: rs_db_port }),
  ws_db = []; // userID: webSocket

wss.on("connection", function (webSocket) {
  var db_id = parseInt(webSocket.upgradeReq.url.substr(1, 1), 10);
  ws_db[db_id] = webSocket;
  db_rx++;
  db_connection[db_id] = "\033[1;34mconn\033[1;37m";

  webSocket.on("message", function (message) {
    input = JSON.parse(message);
    db_rx++;
    db_log[db_id] = input;
  });

  webSocket.on("close", function () {
    db_connection[db_id] = "idle";
    console.log("db_link deleted: " + db_id);
  });
});

function term_disp() {
  console.clear();
  // console.log("\033[1;35m" + version);
  console.log("\033[1;35m rs_db - " + rs_id + "\033[1;33m   " + time);
  console.log("         \033[1;33m" + version);
  console.log("\033[1;32m    rs_db_port = \033[1;37m" + rs_db_port);
  console.log("\033[1;32m      db_total = \033[1;37m" + db_total);
  console.log("\033[1;32m         rs_id = \033[1;37m" + rs_id);
  console.log("\033[1;32m          tick = \033[1;37m" + tick);
  console.log("\033[1;32m         state = \033[1;37m" + state);
  console.log("\033[1;32m          wait = \033[1;37m" + wait);
  console.log("\033[1;32m         db_rx = \033[1;37m" + db_rx);
  console.log("\033[1;32m     gen_count = \033[1;37m" + gen_count);
  console.log("\033[1;32m          hash = \033[1;37m" + hash);
  console.log("\033[1;32m          vote = \033[1;37m" + vote);
  console.log("\033[1;32m db_connection = \033[1;37m" + db_connection);
  console.log("\033[1;35mdb_log \033[1;33m   " );
  console.log(db_log[rs_id])

}

function gen_log() {
  gen_count++
  rs_log = { tick, time, hash, db_status, in_total, in_err, q_total, q_err, chain, next_chain, db_log };
  data_str = JSON.stringify(rs_log);
  try { fs.writeFileSync("2_RS/current.json", data_str) } catch (e) { }
  data_str = data_str + "\n";
  fs.appendFileSync("2_RS/log/rs_log.json", data_str);
}

function compare() {
  if (db_log != undefined) {
    in_total = db_log[rs_id].in_total;
    in_err = db_log[rs_id].in_err;
    q_total = db_log[rs_id].q_total;
    q_err = db_log[rs_id].q_err;
    hash = db_log[rs_id].hash;
    chain = db_log[rs_id].chain;
    next_chain = db_log[rs_id].next_chain;
    db_status = " ";
    vote = 0;
    for (i = 0; i < db_total; i++) {
      if (hash == db_log[i].hash) {
        db_status = db_status + "O ";
        vote++;
      } else {
        db_status = db_status + "- ";
      }
    }
  }

}

function init() {
  try {
    rs_log = JSON.parse(fs.readFileSync("2_RS/current.json"));
  } catch (e) { rs_log = init_json }
  tick = rs_log.tick;
  chain = rs_log.chain;
  next_chain = rs_log.next_chain;
  if (tick == 1000000000) gen_log()
  for (i = 0; i < db_total; i++) {
    db_connection[i] = "idle";
    db_log[i] = {tick, hash, chain, next_chain, in_total, in_err, q_total,q_err }
  }
}

function send_sync() {
  rs_db = { tick, chain, next_chain };
  for (i = 0; i < db_total; i++) {
    try {
      ws_db[i].send(JSON.stringify(rs_db));
    } catch (e) { }
  }
}

function all_db_connected() {
  for (i = 0; i < db_total; i++) {
    if (db_connection[i] != "\033[1;34mconn\033[1;37m") return false
  }
  return true
}

init();
async function main() {
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  term_disp();
wait++;
  switch (state) {
    case 0:
      if (all_db_connected()) state = 1;
      break;

    case 1:
      send_sync();
      if (db_rx >= db_total) {
        db_rx = 0;
        vote = 0;
        wait = 0;
        state = 2;
      }
      break;

    case 2:
      wait++
      compare();
      if (vote >= min_vote) {
        gen_log();
        tick++;
        wait = 0;
        state = 1;
      }
      send_sync();
      break;

    default:
      state = 0;
      break;
  }
}

setInterval(main, 1000);
