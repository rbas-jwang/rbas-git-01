// wss connect to all dash at port 1900
// get information from rs0/current_tick.json

const rs_id = 01
const dash_total = 9
const rs_dash_port = 1900 + rs_id;
const fs = require("fs");
let dash_chain = [
  "8be18b4928beb703",
  "0f4cef80c25b6d7e",
  "95e8781d08c25760",
  "f69fd660aa86bf7e",
  "f06cd71d00d54e48",
  "d71a7cc19254b552",
  "124b00ccd5ed5d1e",
  "912cc804ee0e3e5b",
  "8e071974fe21c095",
  "2321f5b5807e70a9",
];
let tick = "";
let chain = "8be18b4928beb703";
let next_chain = "0f4cef80c25b6d7e";
let rs_dash = {};
let rs_dash_error = {};
let dash_rx = 0;
let link_status = [];

var wss = new (require("ws").Server)({ port: rs_dash_port }), wss_dash = [];

wss.on("connection", function (webSocket) {
  var dash_id = parseInt(webSocket.upgradeReq.url.substr(1, 1), 10);
  wss_dash[dash_id] = webSocket;
  link_status[dash_id] = "\033[1;34mconn\033[1;37m";

  webSocket.on("message", function (message) {
    input = JSON.parse(message);
    dash_rx++;
    dash_rx++;
    if ((input.chain == dash_chain[dash_id]) || (input.chain == next_chain)) {
      try {
        wss_dash[dash_id].send(JSON.stringify(rs_dash));
      } catch (e) {}
    } else {
      try {
        wss_dash[dash_id].send(JSON.stringify(rs_dash_error));
      } catch (e) {}
    }
  });

  webSocket.on("close", function () {
    link_status[dash_id] = "idle";
    console.log("link deleted: " + dash_id);
  });
});

function init() {
  for (i=0; i<dash_total; i++) link_status[i] = "idle"
  tick = "error";
  rs_dash_error = { tick, chain, next_chain };
  tick = 1000000000;
}

init();

async function rs_dash_main() {
  try {
    log = JSON.parse(fs.readFileSync("2_RS/current.json"));
  } catch (e) {}
  tick = log.tick;
  chain = log.chain;
  next_chain = log.next_chain;
  rs_dash = { tick, chain, next_chain };

  console.clear();

  const d = new Date();
  var str = "" + d;
  time = str.substring(4, 24);
  console.log("\033[1;35m rs_dash - " + rs_id + "\033[1;33m   " + time);
  console.log("\033[1;32m   rs_dash_port = \033[1;37m" + rs_dash_port);
  console.log("\033[1;32m           tick = \033[1;37m" + tick);
  console.log("\033[1;32m        dash_rx = \033[1;37m" + dash_rx);
  console.log("\033[1;32m    link_status = \033[1;37m" + link_status);
  console.log("\033[1;35mrs_dash = \033[1;37m");
  console.log(rs_dash);
  // console.log(dash_chain)
}
setInterval(rs_dash_main, 1000);
