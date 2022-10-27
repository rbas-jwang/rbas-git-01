// node 3_DB/dbio_web
// db_io web display of 3_DB/db_rs.json + 3_DB/ps_result.json

const db_id = 0
const web_port = 1030 + db_id;

const express = require("express");
const app = express();
const fs = require("fs");

let ps_total = 1
let ps_result = []
let web_json = {ps_result}
let db_rs = {}
let web_req = 0;

app.use(express.static("3_DB/web_db_io"));
app.use(express.json({ limit: "1mb" }));
app.listen(web_port)
app.post("/dbio", async (req, res) => {
  try {ps_result = JSON.parse(fs.readFileSync("3_DB/ps_result.json"))} catch (e) {}
  web_json = db_rs
  web_json.ps_result = ps_result
  web_req++
  res.json(web_json);
});

in_total = 0
in_err = 0
q_total = 0
q_err = 0
chain = "-"
next_chain = "-"
for (i=0; i<ps_result; i++) {
  ps_result[i] = {tick, chain, next_chain, in_total, in_err, q_total, q_err}
} 

async function main() {
  try {db_rs = JSON.parse(fs.readFileSync("3_DB/db_rs.json"))} catch (e) { }

  console.clear();
  console.log("\033[1;35m DB_IO_web ");
  console.log("\n\033[1;32m  listening at port = \033[1;37m" + web_port);
  console.log("\033[1;32m             web_req = \033[1;37m" + web_req);
  console.log("\033[1;35m db_rs \033[1;37m")
  console.log(db_rs)
}

setInterval(main, 1000);