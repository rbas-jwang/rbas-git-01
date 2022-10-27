// web db_io 
const ps_total = 50
const ts_total = 50
let index = 0
let ps_id = 0
let ts_id = 0
let tick = 1000000000
let in_total = 0
let in_err = 0
let q_total = 0
let q_err = 0
let chain = "6b86b273ff34fce19d6b804eff5"
let next_chain = chain
let loop = 0
let disp_json = { tick, in_total, in_err, q_total, q_err, chain, next_chain }

function common_disp() {
    const utc = new Date();
    var str1 = "" + utc;
    var timeDisp = str1.substring(4, 24);
    document.getElementById("time").textContent = timeDisp;
    document.getElementById("tick").textContent = disp_json.tick;
    document.getElementById("input_total").textContent = disp_json.in_total;
    document.getElementById("input_err").textContent = disp_json.in_err;
    document.getElementById("query_total").textContent = disp_json.q_total;
    document.getElementById("query_err").textContent = disp_json.q_err;
    document.getElementById("chain").textContent = disp_json.chain
    document.getElementById("next_chain").textContent = disp_json.next_chain
}

function clear_db_log(j) {
    i = j % 10
    document.getElementsByClassName("db_tick")[i].textContent = " .";
    document.getElementsByClassName("db_chain")[i].textContent = " .";
    document.getElementsByClassName("db_next_chain")[i].textContent = " .";
}

function disp_db_log() {
    i = tick % 10
    document.getElementsByClassName("db_tick")[i].textContent = tick;
    document.getElementsByClassName("db_chain")[i].textContent = disp_json.chain
    document.getElementsByClassName("db_next_chain")[i].textContent = disp_json.next_chain
    clear_db_log(i + 1)
}

function clear_in_log(j) {
    i = j % 50
    document.getElementsByClassName("index")[i].textContent = " ";
    document.getElementsByClassName("tick")[i].textContent = " .";
    document.getElementsByClassName("ps_id")[i].textContent = " .";
    document.getElementsByClassName("ts_id")[i].textContent = " .";
    document.getElementsByClassName("user_id")[i].textContent = " .";
    document.getElementsByClassName("in_hash")[i].textContent = " .";
    document.getElementsByClassName("in_r_id")[i].textContent = " .";
    document.getElementsByClassName("in_r_tick")[i].textContent = " .";
    document.getElementsByClassName("q_hash")[i].textContent = " .";
    document.getElementsByClassName("q_r_id")[i].textContent = " .";
    document.getElementsByClassName("q_r_tick")[i].textContent = ".";
}

function disp_in_log() {
    for (i = 0; i < 50; i++) clear_in_log(i)
    index = 0
    for (ps_id = 0; ps_id < ps_total; ps_id++) {
        this_ps_result = disp_json.ps_result[ps_id]
        if (this_ps_result != undefined) {
            for (ts_id = 0; ts_id < ts_total; ts_id++) {

                console.log("index = " + index + ", ps = " + ps_id + ", ts = " + ts_id)
                this_result = this_ps_result.ts_result[ts_id]     
                console.log("this result = ")                           
                console.log(this_result)
                if (this_result != undefined) {
                    document.getElementsByClassName("index")[index].textContent = index
                    document.getElementsByClassName("tick")[index].textContent = tick;
                    document.getElementsByClassName("ps_id")[index].textContent = ps_id
                    document.getElementsByClassName("ts_id")[index].textContent = ts_id
                    document.getElementsByClassName("user_id")[index].textContent = this_result.id
                    document.getElementsByClassName("in_hash")[index].textContent = this_result.in_hash.substring(0, 12) + "...";
                    document.getElementsByClassName("in_r_id")[index].textContent = this_result.in_result_id;
                    document.getElementsByClassName("in_r_tick")[index].textContent = this_result.in_result_tick;
                    document.getElementsByClassName("q_hash")[index].textContent = this_result.q_hash.substring(0, 12) + "...";
                    document.getElementsByClassName("q_r_id")[index].textContent = this_result.q_result_id;
                    document.getElementsByClassName("q_r_tick")[index].textContent = this_result.q_result_tick;
                    index++
                    if (index >= 50) return
                }
            }
        }
    }
}

async function get_disp_json() {
    const res = await fetch("/dbio", { method: "POST" });
    disp_json = await res.json();
    tick = disp_json.tick
    console.log("pot and fetched data from db_io = ")
    console.log(disp_json)
}

async function web_db_io() {
    loop++
    await get_disp_json()
    common_disp()
    disp_db_log()
    disp_in_log()
}

for (i = 0; i < 50; i++) clear_in_log(i)
for (i = 0; i < 10; i++) clear_db_log(i)

setInterval(web_db_io, 1000);