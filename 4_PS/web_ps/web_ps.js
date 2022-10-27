let state = 0;
const ps_id = 0;
const ps_web_port = "/ps";
let ts_total = 1000
let req_json = {};
let tick = 100000000;
let in_total = 0;
let in_err = 0;
let q_total = 0;
let q_err = 0;
let chain = "1234567890abcdef";
let next_chain = "abcdef1234567890";
let ts_count = [];
let ps_web = {};

function clear_log(i) {
    document.getElementsByClassName("index_log")[i].textContent = "-";
    document.getElementsByClassName("in_total_log")[i].textContent = "-";
    document.getElementsByClassName("in_err_log")[i].textContent = "-";
    document.getElementsByClassName("q_total_log")[i].textContent = "-";
    document.getElementsByClassName("q_err_log")[i].textContent = "-";
    document.getElementsByClassName("chain_log")[i].textContent = "-";
    document.getElementsByClassName("next_chain_log")[i].textContent = "-";
}

function fill_count() {
    for (i = 0; i < 1000; i++) {
        if (ps_web.ts_result[i] != undefined) {
            document.getElementsByClassName("ts_in_total")[i].textContent = ps_web.ts_result[i].in_total;
            document.getElementsByClassName("ts_q_total")[i].textContent = ps_web.ts_result[i].q_total;
        }
    }
}

function init() {
    state = 0;
    document.getElementById("ts_total").textContent = 1000;
    for (i = 0; i < 1000; i++) {
        ts_count[i] = { in_total, in_err, q_total, q_err };
        document.getElementsByClassName("ts_in_total")[i].textContent = 0;
        document.getElementsByClassName("ts_q_total")[i].textContent = 0;
    }
    for (i = 0; i < 50; i++) clear_log(i);
    post_ps();
}

async function post_ps() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req_json),
    };
    try {
        res = await fetch(ps_web_port, options);
    } catch (e) { }
    ps_web = await res.json();
}

function update_webpage() {
    if (ps_web.tick != undefined) {
        tick = ps_web.tick;
        document.getElementById("tick").textContent = ps_web.tick;
        document.getElementById("in_total").textContent = ps_web.in_total;
        document.getElementById("in_err").textContent = ps_web.in_err;
        document.getElementById("q_total").textContent = ps_web.q_total;
        document.getElementById("q_err").textContent = ps_web.q_err;
        document.getElementById("chain").textContent = ps_web.chain.substring(0, 16);
        document.getElementById("next_chain").textContent = ps_web.next_chain.substring(0, 16);
        document.getElementById("ts_total").textContent = ts_total;
        i = tick % 50;
        document.getElementsByClassName("index_log")[i].textContent = tick;
        document.getElementsByClassName("in_total_log")[i].textContent = ps_web.in_total;
        document.getElementsByClassName("in_err_log")[i].textContent = ps_web.in_err;
        document.getElementsByClassName("q_total_log")[i].textContent = ps_web.q_total;
        document.getElementsByClassName("q_err_log")[i].textContent = ps_web.in_err;
        document.getElementsByClassName("chain_log")[i].textContent = ps_web.chain.substring(0, 16);
        document.getElementsByClassName("next_chain_log")[i].textContent = ps_web.next_chain.substring(0, 16);
        i = (tick + 1) % 50;
        clear_log(i);
        i = (tick + 2) % 50;
        clear_log(i);
        fill_count();
    }
}

init();
async function web_rt() {
    const utc = new Date();
    var str1 = "" + utc;
    var timeDisp = str1.substring(4, 24);
    document.getElementById("time").textContent = timeDisp;
    post_ps();
    update_webpage();
}
setInterval(web_rt, 1000);
