// node 3_DB/dbps_web
// db_ps web display of 3_DB/db_rs.json + 3_DB/ps_result.json

const db_id = 0
const web_port = 1040 + db_id;

const express = require("express");
const app = express();
const fs = require("fs");

let web_json = {}
let loop = 0
let db_rs = {}
let web_req = 0;
let ps_result = []

app.use(express.static("3_DB/web_db_ps"));
app.use(express.json({ limit: "1mb" }));
app.listen(web_port)
app.post("/dbps", async (req, res) => {
  web_req++
  res.json(web_json);
});

async function main() {
  loop++
  ps_total = 0
  ts_total = 0
  try { db_rs = JSON.parse(fs.readFileSync("3_DB/db_rs.json")) } catch (e) { }
  try { ps_result = JSON.parse(fs.readFileSync("3_DB/ps_result.json")) } catch (e) { }
  ps_total = ps_result.length
  if (ps_result[0] != undefined) {
    if (ps_result[0].ts_result != undefined) {
      ts_total = ps_result[0].ts_result.length
    }
  }
  result_total = ps_total * ts_total
  web_json = db_rs
  web_json.ps_result = ps_result

  console.clear();
  console.log("\033[1;35m DB_PS_web ");
  console.log("\033[1;32m   listening at port = \033[1;37m" + web_port);
  console.log("\033[1;32m                loop = \033[1;37m" + loop);
  console.log("\033[1;32m             web_req = \033[1;37m" + web_req);
  console.log("\033[1;32m            ps_total = \033[1;37m" + ps_total);
  console.log("\033[1;32m            ts_total = \033[1;37m" + ts_total);
  console.log("\033[1;32m        result_total = \033[1;37m" + result_total);
  // if (result_total < 6) {
  //   console.log("\033[1;35m web_json \033[1;37m")
  //   console.log(web_json)
  // }
}

setInterval(main, 1000);