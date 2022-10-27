// web do_ps 

const ps_id = 0
let req_json = {}
let db_ps_web = {}

function clear_log(i) {
    document.getElementsByClassName("tick")[i].textContent = "-"
    document.getElementsByClassName("chain")[i].textContent = "-"
    document.getElementsByClassName("next_chain")[i].textContent = "-"
}

function fill_count() {
    ps_result_json = db_ps_web.ps_result
    for (i = 0; i < 1000; i++) {
        
        if (ps_result_json[i] != undefined) {
            document.getElementsByClassName("ps_in_total")[i].textContent = ps_result_json[i].in_total
            document.getElementsByClassName("ps_q_total")[i].textContent = ps_result_json[i].q_total
            document.getElementsByClassName("ps_in_err")[i].textContent = ps_result_json[i].in_err
            document.getElementsByClassName("ps_q_err")[i].textContent = ps_result_json[i].q_err
        } else {
            document.getElementsByClassName("ps_in_total")[i].textContent = "-"
            document.getElementsByClassName("ps_in_err")[i].textContent = "-"
            document.getElementsByClassName("ps_q_total")[i].textContent = "-"
            document.getElementsByClassName("ps_q_err")[i].textContent = "-"
        }
    }
}

function init() {
    for (i = 0; i < 1000; i++) {
        document.getElementsByClassName("ps_in_total")[i].textContent = "-"
        document.getElementsByClassName("ps_in_err")[i].textContent = "-"
        document.getElementsByClassName("ps_q_total")[i].textContent = "-"
        document.getElementsByClassName("ps_q_err")[i].textContent = "-"
    }
    for (i = 0; i < 40; i++) {
        document.getElementsByClassName("tick")[i].textContent = "-"
        document.getElementsByClassName("chain")[i].textContent = "-"
        document.getElementsByClassName("next_chain")[i].textContent = "-"
    }
}

async function post_ps() {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req_json),
    };
    try {res = await fetch("/dbps", options)} catch(e){} ;
    db_ps_web = await res.json();
}

function update_webpage() {
    const utc = new Date();
    var str1 = "" + utc;
    var timeDisp = str1.substring(4, 24);
    document.getElementById("time").textContent = timeDisp;
    tick = db_ps_web.tick
    document.getElementById("tick").textContent = tick
    document.getElementById("in_total").textContent = db_ps_web.in_total
    document.getElementById("in_err").textContent = db_ps_web.in_err
    document.getElementById("q_total").textContent = db_ps_web.q_total
    document.getElementById("q_err").textContent = db_ps_web.q_err
    document.getElementById("chain").textContent = db_ps_web.chain.substring(0, 16);
    document.getElementById("next_chain").textContent = db_ps_web.next_chain.substring(0, 16);

    i = tick % 40
    document.getElementsByClassName("tick")[i].textContent = tick
    document.getElementsByClassName("chain")[i].textContent = db_ps_web.chain.substring(0, 16);
    document.getElementsByClassName("next_chain")[i].textContent = db_ps_web.next_chain.substring(0, 16);
    i = (tick + 1) % 40
    clear_log(i)
    i = (tick + 2) % 40
    clear_log(i)
    
    fill_count()
}

init();
post_ps()
async function web_db_ps() {
    update_webpage();
    post_ps()
}
setInterval(web_db_ps, 1000);