// output 1_dash/dash0/current.json to :web_port/dashboard by http.post

const id = 0

const web_port = 1000 + id
const express = require("express");
const app = express();
const fs = require("fs");

let dash_web = []
let web_req = 0

app.use(express.static("1_dash/web_dash"));
app.listen(web_port)
app.post("/dashboard", async (req, res) => {
  web_req++

  res.json(dash_web);
});

async function dash_web_main() {
  try {dash_web = JSON.parse(fs.readFileSync("1_dash/current.json"))} catch(e) {}  
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m dash_web-"+ id +"\033[1;33m  " + time);
  console.log("\033[1;32m    web_port = \033[1;37m" + web_port);
  console.log("\033[1;32m     web_req = \033[1;37m" + web_req);
  console.log("\033[1;35mdash_web = \033[1;37m");
  console.table(dash_web)
}

setInterval(dash_web_main, 500);
