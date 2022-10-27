//display current_tick.json to rs webpage

const rs_id = 0
const web_port = 1010 + rs_id

const express = require("express");
const app = express();
const fs = require("fs");

let web_json = {}
let web_req = 0;

app.use(express.static("2_RS/web_rs"));
app.use(express.json({ limit: "1mb" }));

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
  console.log("\033[1;32m  listen port = \033[1;37m" + web_port);
  console.log("\033[1;32m      web_req = \033[1;37m" + web_req);
  console.log("\033[1;35m web_json.db_log[0] \033[1;37m");
  console.log(web_json.db_log[0])  
}

setInterval(main, 1000);
