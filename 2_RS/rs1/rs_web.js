//display current_tick.json to rs webpage

const rs_id = 1;
const express = require("express");
const app = express();
const fs = require("fs");
const web_port_array = [1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018];
const version = "RBAS V0.9.2022/06/09";
let web_port = web_port_array[rs_id]
let web_json = {}
let web_req = 0;

app.use(express.static("2_RS/web_rs"));
app.use(express.json({ limit: "1mb" }));
port = web_port_array[rs_id]
app.listen(web_port)
app.post("/rs", async (req, res) => {
  web_req++  

  res.json(web_json);
});

async function main() {
  try {web_json = JSON.parse(fs.readFileSync("2_RS/current.json"))} catch (e) {}
  web_json.rs_id = rs_id  
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m rs_web -" +rs_id + "\033[1;33m      " + time);
  console.log("\033[1;33m                " + version +"\033[1;37m  ");
  console.log("\033[1;32m  listen port = \033[1;37m" + web_port);
  console.log("\033[1;32m      web_req = \033[1;37m" + web_req);
  console.log("\033[1;35m web_json \033[1;37m");
  console.table(web_json.db_log)  
}

setInterval(main, 1000);
