// ps web page server at port = 1100
// cd 6_PS_TS
// read ps0/current_tick.json and output to webpage

const ps_id = 0
const port = 1050 + ps_id;

const version = "RBAS V0.9.20220603 ";
const express = require("express");
const app = express();
const fs = require("fs");

let wait = 0;
let web_rx = 0;
let ps_web = [];

app.listen(port);
app.use(express.static("4_PS/web_ps"));
app.use(express.json());

app.post("/ps", function (req, res) {
  web_ts_json = req.body;
  wait = 0;
  web_rx++;
  res.send(JSON.stringify(ps_web));
});

async function web() {
  wait++;
  console.clear();

  try {
    ps_web = JSON.parse(fs.readFileSync("4_PS/db_ps.json"));
  } catch (e) {}
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m ps_web " + "\033[1;33m   " + time);
  console.log("\033[1;32m           " + version);
  console.log("\033[1;32m http port = \033[1;37m" + port);
  console.log("\033[1;32m      wait = \033[1;37m" + wait);
  console.log("\033[1;32m    web_rx = \033[1;37m" + web_rx);
  console.log("\n\033[1;35m ps_web \033[1;37m " );
  console.table(ps_web)
}

setInterval(web, 1000);
