// make ts_rsult for testing

const crypto = require("crypto");
const fs = require("fs");
tick = 1000000000
ps_id = 'P0'
chain = "a69313b4d3e23363dbea6579cd6"
next_chain = "a69313b4d3e23363dbea6579cd6"
user_id = 'U0T0P0'
index = 0
ts_result = []
in_hash = '2998e69d3b406b38d719e98b70bb7ab80139b89dabfe3212097fffde3ee1906f'
in_result_id = 'U0T0P0'
in_result_tick = tick
in_total = 0
in_err = 0
q_hash = 'a40d149b9527660a46216c8ff919034a99ed4a91d5806aa91dd4df20f9699d03'
q_result_id = 'U0T0P0'
q_result_tick = tick
q_total = 0
q_err = 0

for (i = 0; i < 2; i++) {
    in_total = 0
    q_total = 0
    in_err = 0
    q_err = 0
    in_result_id = "UT0P0"
    in_result_tick = 1000000000
    q_result_id = "UT0P0"
    q_result_tick = 1000000000
    ts_result[i] = {
    index, user_id, tick, chain, next_chain,
    in_hash, in_result_id, in_result_tick, in_total, in_err,
    q_hash, q_result_id, q_result_tick, q_total, q_err
  };
}

ps_result = { tick, ps_id, chain, next_chain, in_total, q_total, in_err, q_err, ts_result }
str = JSON.stringify(ps_result)
console.clear()
console.log(str)
fs.writeFileSync("db_ps.json", str) 
fs.writeFileSync("log/ps_log.json", "[") 
console.log(ps_result)
