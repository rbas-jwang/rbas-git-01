// generate init_chain for each server  2022/09/20
//
// client->server = (tick, id, block_hash, chain, next_hash)
// server->client = {tick, next_chain}
//
// array_size < 15 for print,
// array_size = 1000 for file

const array_size = 10;
const fs = require("fs");
const crypto = require("crypto");
const rbas_root =
  "38b6aba0e9981a603fd951228f5b2dac7c8315f017aeb6f55a04aaf815469d01";
let root = [rbas_root]
let dash_init = [];
let db_init = [];
let ps_init = [];
let ts_ps0_init = [];

for (i = 0; i < 10; i++) {
  dash_id = "dash" + i;
  pwd = rbas_root + dash_id;
  key = crypto.createHash("sha256").update(pwd).digest("hex");
  chain = key.substring(0, 16);
  dash_init[i] = { key, chain };
}

for (i = 0; i < 10; i++) {
  db_id = "db" + i;
  pwd = rbas_root + db_id;
  key = crypto.createHash("sha256").update(pwd).digest("hex");
  chain = key.substring(0, 16);
  db_init[i] = { key, chain };
}

for (i = 0; i < array_size; i++) {
  ps_id = "ps" + i;
  pwd = rbas_root + ps_id;
  key = crypto.createHash("sha256").update(pwd).digest("hex");
  chain = key.substring(0, 16);
  ps_init[i] = { key, chain };
}

for (i = 0; i < array_size; i++) {
  ps0_ts_id = "ps0" + i;
  pwd = rbas_root + ps0_ts_id;
  key = crypto.createHash("sha256").update(pwd).digest("hex");
  chain = key.substring(0, 16);
  ts_ps0_init[i] = { key, chain };
}

  console.clear();
  console.log("\033[1;35m RBAS init-key \n root = \033[1;37m");

  console.table(root);
  console.log("\033[1;35m db_root = \033[1;37m");
  console.table(db_init);
  console.log("\033[1;35m dash_root = \033[1;37m");
  console.table(dash_init);

if (array_size < 15) {
  console.log("\033[1;35m ps_root = \033[1;37m");
  console.table(ps_init);
  console.log("\033[1;35m ps0_ts_root = \033[1;37m");
  console.table(ts_ps0_init);
}

filename = "0_chain/dash_init.json";
data_string = JSON.stringify(dash_init);
fs.writeFileSync(filename, data_string);

filename = "0_chain/db_init.json";
data_string = JSON.stringify(db_init);
fs.writeFileSync(filename, data_string);

filename = "0_chain/ps_init.json";
data_string = JSON.stringify(ps_init);
fs.writeFileSync(filename, data_string);

filename = "0_chain/ts_ps0_init.json";
data_string = JSON.stringify(ts_ps0_init);
fs.writeFileSync(filename, data_string);
