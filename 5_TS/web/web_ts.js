// initial setup with ./web/current_tick.json
// const ts_ip = "url ";
const ts_id = "T0P0";
let user_id = 0
let id = "U" + user_id + ts_id;
let loop = 0
let ts_hash = "-";
let in_hash = "-";
let q_hash = "-";
let chain = "21396d254d2e1ed7"
let next_chain = chain;
let tick = 0;
let index = 0;
let operation = "idle";
let ts_req = {};
let ts_result = {};
let post_cnt = 0

function auto() { operation = "auto"; }
function stop() { operation = "idle"; }
function input() { operation = "input"; }
function query() { operation = "query"; }

function clear_log_row(i) {
    i = i % 50;
    document.getElementsByClassName("tick_log")[i].textContent = " .";
    document.getElementsByClassName("index_log")[i].textContent = " .";
    document.getElementsByClassName("id_log")[i].textContent = " .";
    document.getElementsByClassName("in_hash_log")[i].textContent = ".";
    document.getElementsByClassName("in_result_tick_log")[i].textContent = ".";
    document.getElementsByClassName("in_result_id_log")[i].textContent = ".";
    document.getElementsByClassName("in_total_log")[i].textContent = ".";
    document.getElementsByClassName("in_err_log")[i].textContent = ".";
    document.getElementsByClassName("q_hash_log")[i].textContent = ".";
    document.getElementsByClassName("q_result_tick_log")[i].textContent = ".";
    document.getElementsByClassName("q_result_id_log")[i].textContent = ".";
    document.getElementsByClassName("q_total_log")[i].textContent = ".";
    document.getElementsByClassName("q_err_log")[i].textContent = ". ";
    document.getElementsByClassName("chain_log")[i].textContent = ".";
    document.getElementsByClassName("next_chain_log")[i].textContent = ". ";
}

function clear_log() {
    for (i = 0; i < 50; i++) {
        clear_log_row(i);
    }
}

async function hash_gen(message) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}

async function post_ts() {
    post_cnt++
    console.log("ts_req = ")
    console.table(ts_req)
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ts_req),
    };
    res = await fetch("/ts", options);
    ts_result = await res.json();
    if (ts_result.index != undefined) {
        if (index != ts_result.index) {
            tick = ts_result.tick
            index = ts_result.index
        }
    }

}

async function update_webpage() {
    key_length = Object.keys(ts_result).length
    console.log("ts_result = " + post_cnt + " length = " + key_length)
    console.table(ts_result);
    const d = new Date();
    var str = "" + d;
    time = str.substring(16, 24);
    document.getElementById("time").textContent = time;
    if (document.getElementById("user_id_in").value != id) {
        user_id = document.getElementById("user_id_in").value;
        id = "U" + user_id + ts_id
        document.getElementById("user_id_in").textContent = id
    }
    input_data = document.getElementById("input").value;
    ts_hash = await hash_gen(input_data);
    document.getElementById("ts_hash").textContent = ts_hash.substring(0, 32) + " " + ts_hash.substring(32, 64);
    if (key_length > 5) {
        if (index > 0) {
            i = (index + 1) % 50;
            document.getElementsByClassName("next_chain_log")[i].textContent =
                next_chain.substring(0, 6) + " ...";
        }
        if (ts_result.chain != undefined) {
            document.getElementById("index").textContent = ts_result.index;
            document.getElementById("in_total").textContent = ts_result.in_total;
            document.getElementById("q_total").textContent = ts_result.q_total;
            document.getElementById("chain").textContent = chain;
            document.getElementById("in_id").textContent = ts_result.in_result_id;
            document.getElementById("in_tick").textContent = ts_result.in_result_tick;
            document.getElementById("q_id").textContent = ts_result.q_result_id;
            document.getElementById("q_tick").textContent = ts_result.q_result_tick;
            clear_log_row(index + 1);
            clear_log_row(index + 2);
            i = index % 50;
            document.getElementsByClassName("index_log")[i].textContent = index;
            document.getElementsByClassName("tick_log")[i].textContent = tick;
            document.getElementsByClassName("id_log")[i].textContent = ts_result.id;
            document.getElementsByClassName("in_hash_log")[i].textContent =
                ts_result.in_hash.substring(0, 10) + "...";
            document.getElementsByClassName("in_result_tick_log")[i].textContent =
                ts_result.in_result_tick;
            document.getElementsByClassName("in_result_id_log")[i].textContent =
                ts_result.in_result_id;
            document.getElementsByClassName("in_total_log")[i].textContent =
                ts_result.in_total;
            document.getElementsByClassName("in_err_log")[i].textContent =
                ts_result.in_err;
            document.getElementsByClassName("q_hash_log")[i].textContent =
                ts_result.q_hash.substring(0, 10) + "...";
            document.getElementsByClassName("q_result_tick_log")[i].textContent = ts_result.q_result_tick;
            document.getElementsByClassName("q_result_id_log")[i].textContent =
                ts_result.q_result_id;
            document.getElementsByClassName("q_total_log")[i].textContent =
                ts_result.q_total;
            document.getElementsByClassName("q_err_log")[i].textContent =
                ts_result.q_err;
            document.getElementsByClassName("chain_log")[i].textContent =
                ts_result.chain.substring(0, 6) + " ...";
            document.getElementsByClassName("next_chain_log")[i].textContent =
                ts_result.next_chain.substring(0, 6) + " ...";
        }
    }
}

async function gen_ts_req() {
    if (ts_result.next_chain != undefined) chain = ts_result.next_chain
    document.getElementById("input").value = id + " index= " + index
    input_data = document.getElementById("input").value;
    ts_hash = await hash_gen(input_data);
    document.getElementById("ts_hash").textContent = ts_hash.substring(0, 32) + " " + ts_hash.substring(32, 64);
    temp = ts_hash;
    temp_hash = await hash_gen(temp);
    next_chain = temp_hash.substring(0, 16);
    document.getElementById("next_chain").textContent = next_chain;

    ts_req = { index, id, chain, next_chain, in_hash, q_hash };
}

function init() {
    document.getElementById("ts_id").textContent = ts_id;
    document.getElementById("user_id_in").textContent = id;
    clear_log()
}

async function new_input() {
    await post_ts();
    in_hash = "-";
    q_hash = "-";
    if (operation == "input") {
        in_hash = ts_hash;
        operation = "idle";
        index++;
        gen_ts_req()
        console.log("input true")
        return true
    }
    if (operation == "query") {
        q_hash = ts_hash;
        operation = "idle";
        index++;
        gen_ts_req()
        console.log("query true")
        return true
    }
    if (operation == "auto") {
        if (ts_result.index == ts_req.index) {
            in_hash = ts_hash;
            q_hash = ts_hash;
            index++;
            gen_ts_req()
            console.log("continue true")
            return true
        }
    }
    console.log("new input false")
    return false
}

init()
async function web_ts() {
    loop++
    console.log({ loop, operation })
    await update_webpage();
    flag = await new_input()
    if (flag == true) loop = 0
}

setInterval(web_ts, 1000);
