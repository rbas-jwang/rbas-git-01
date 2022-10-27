// output 1_dash/dash3/CURRENT.json to :port/dashboard by http.post

const version = "RBAS V0.8.220112 ";
const express = require("express");
const app = express();
const fs = require("fs");
const port = 1003
const id = 3

let dash_web = {}
let web_req = 0

app.use(express.static("1_dash/web_dash"));
app.listen(port)

app.post("/dashboard", async (req, res) => {
  web_req++
  res.json(dash_web);
});

async function dash_main() {
  try {dash_web = JSON.parse(fs.readFileSync("1_dash/dash3/current.json"))} catch(e) {}
  // dash_web.id = id  
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m dash_web-"+ id +"\033[1;33m  " + time);
  console.log("\033[1;32m        port = \033[1;37m" + port);
  console.log("\033[1;32m     web_req = \033[1;37m" + web_req);
  console.log("\033[1;35mdash_web = \033[1;37m");
  console.table(dash_web.rs_dash[id])
}

setInterval(dash_main, 1000);
