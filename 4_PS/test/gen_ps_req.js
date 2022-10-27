// make ps_req for testing

const ts_total = 1000
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
q_hash = 'a40d149b9527660a46216c8ff919034a99ed4a91d5806aa91dd4df20f9699d03'

for (i = 0; i <ts_total; i++) {
    ts_result[i] = {index, user_id, chain, next_chain, in_hash, q_hash};
}

ps_req = { tick, chain, next_chain, ts_req }
fs.writeFileSync("db_ps.json", JSON.stringify(ps_req)) 
fs.writeFileSync("ps_log.json", "[") 
console.log(ps_req)