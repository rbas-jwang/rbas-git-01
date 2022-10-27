// db16_web web page of db16 view 
// display database.json in 16 section webpage

const db_id = 0
const web_port = 1020 + db_id;

const express = require("express");
const app = express();
const fs = require("fs");

let web_json = []
let web_req = 0;

app.use(express.static("3_DB/web_db16"));
app.use(express.json({ limit: "1mb" }));
app.listen(web_port)
app.post("/db16", async (req, res) => {
  web_req++
  res.json(web_json);
});

async function main() {
  try {web_json = JSON.parse( fs.readFileSync("3_DB/DB/db_disp.json"))} catch(e) {}
  hash_in_total = web_json.length 
  console.clear();
  console.log("\033[1;35m DB_16_web \n  ");
  console.log("\033[1;32m   listening at port = \033[1;37m" + web_port);
  console.log("\033[1;32m             web_req = \033[1;37m" + web_req);
  console.log("\033[1;32m       hash_in_total = \033[1;37m" + hash_in_total);
  console.log("\n\033[1;35m 3_DB/DB/database.json web_json \033[1;37m");
  if (hash_in_total < 5) {console.log(web_json) } else console.log(web_json[0]) 
}

setInterval(main, 1000);