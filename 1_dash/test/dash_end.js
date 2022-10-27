// tester for dash
// simulate input from all RS as rs_dash
// update current_tick.json every 1 second

const fs = require("fs");
const crypto = require("crypto");
const rs_total = 9
let rs_dash = [];
let chain = "7ddafc31daaf4e34";
let next_chain = chain;
let tick = 1000000000;

async function dash_end() {
  tick++;
  chain = next_chain;
  next_chain = crypto.createHash("sha256").update(next_chain).digest("hex").substring(0,16);
  for (i = 0; i < rs_total; i++) {
    rs_dash[i] = { tick, chain, next_chain };
  }
  console.clear();
  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m dash_end" + "\033[1;33m   " + time);
  console.log("\033[1;32m    rs_total = \033[1;37m " + rs_total);
  console.log("\033[1;32m        tick = \033[1;37m " + tick);
  console.log("\033[1;32m       chain = \033[1;37m " + chain);
  console.log("\033[1;32m  next_chain = \033[1;37m " + next_chain);
  fs.writeFileSync("1_dash/current.json", JSON.stringify(rs_dash));
}

setInterval(dash_end, 1000);
