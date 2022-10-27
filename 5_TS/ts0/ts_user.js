// ts0 main program with input & query on web_port
// web display of ts0/ps_ts.json
// rx from web -> ts0/ts_ps.json

const ts_id = "T0P0"
const express = require("express");
const app = express();
const fs = require("fs");
const version = "RBAS V0.9.2022/08/12 ";
const web_port = 1100;

let wait = 0;
let result_index = 0
let req_index = 0
let web_rx = 0
let id = "-"
let ts_req = {}
let ts_result = {}

app.listen(web_port);
app.use(express.static("5_TS/web"));
app.use(express.json());
app.post('/ts', function (req, res) {
  wait = 0
  web_rx++
  ts_req = req.body
  if (ts_req.index != req_index) {
    req_index = ts_req.index
    id = ts_req.id
    fs.writeFileSync("5_TS/ts_req.json", JSON.stringify(ts_req))
  }
  ts_result = JSON.parse(fs.readFileSync("5_TS/ts_result.json"))
  res.send(JSON.stringify(ts_result));
})

function display() {
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m ts_user" + "\033[1;33m   " + time);  
  console.log("\033[1;32m          " + version)
  console.log("\033[1;32m           ts_id = \033[1;33m" + ts_id);
  console.log("\033[1;32m              id = \033[1;33m" + id);
  console.log("\033[1;32m        web_port = \033[1;33m" + web_port);
  console.log("\033[1;32m    result_index = \033[1;33m" +result_index);  
  console.log("\033[1;32m       req_index = \033[1;33m" + req_index);  
  console.log("\033[1;32m            wait = \033[1;33m" + wait);
  console.log("\033[1;32m          web_rx = \033[1;33m" + web_rx);
  console.log("\n\033[1;35m ts_req\033[1;37m")
  console.table(ts_req)
  console.log("\n\033[1;35m ts_result\033[1;37m")
  console.table(ts_result)  
}

async function ts_user_main() {
  wait++
  display()
}

setInterval(ts_user_main, 1000);
