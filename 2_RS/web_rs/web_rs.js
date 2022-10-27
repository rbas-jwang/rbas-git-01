
let rs_id = 0
let tick = 1000000000
let time = "."
let disp_json = {}

function disp_log(i) {
  clear_log(i + 1)
  clear_log(i + 2)
  i = i % 20
  document.getElementsByClassName("tick")[i].textContent = tick;
  document.getElementsByClassName ("chain")[i].textContent = disp_json.chain.substring(0, 16);
  document.getElementsByClassName("next_chain")[i].textContent = disp_json.next_chain.substring(0, 16)  
  document.getElementsByClassName("time")[i].textContent = time;
  document.getElementsByClassName("status")[i].textContent = disp_json.db_status;
  document.getElementsByClassName("in_total")[i].textContent = disp_json.db_log[rs_id].in_total;
  document.getElementsByClassName("in_err")[i].textContent = disp_json.db_log[rs_id].in_err;
  document.getElementsByClassName("q_total")[i].textContent = disp_json.db_log[rs_id].q_total;
  document.getElementsByClassName("q_err")[i].textContent = disp_json.db_log[rs_id].q_err;
  document.getElementsByClassName("rs1_status")[i].textContent = disp_json.db_log[0].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs2_status")[i].textContent = disp_json.db_log[1].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs3_status")[i].textContent = disp_json.db_log[2].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs4_status")[i].textContent = disp_json.db_log[3].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs5_status")[i].textContent = disp_json.db_log[4].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs6_status")[i].textContent = disp_json.db_log[5].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs7_status")[i].textContent = disp_json.db_log[6].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs8_status")[i].textContent = disp_json.db_log[7].hash.substring(0,12)+" ..."
  document.getElementsByClassName("rs9_status")[i].textContent = disp_json.db_log[8].hash.substring(0,12)+" ..."

}

function clear_log(i) {
  i = i % 20
  document.getElementsByClassName("tick")[i].textContent = "."
  document.getElementsByClassName("time")[i].textContent = "."
  document.getElementsByClassName("status")[i].textContent = "."
  document.getElementsByClassName("in_total")[i].textContent = "."
  document.getElementsByClassName("in_err")[i].textContent = "."
  document.getElementsByClassName("q_total")[i].textContent = "."
  document.getElementsByClassName("q_err")[i].textContent = "."
  document.getElementsByClassName("rs1_status")[i].textContent = "."
  document.getElementsByClassName("rs2_status")[i].textContent = "."
  document.getElementsByClassName("rs3_status")[i].textContent = "."
  document.getElementsByClassName("rs4_status")[i].textContent = "."
  document.getElementsByClassName("rs5_status")[i].textContent = "."
  document.getElementsByClassName("rs6_status")[i].textContent = "."
  document.getElementsByClassName("rs7_status")[i].textContent = "."
  document.getElementsByClassName("rs8_status")[i].textContent = "."
  document.getElementsByClassName("rs9_status")[i].textContent = "."
  document.getElementsByClassName("chain")[i].textContent = "."
  document.getElementsByClassName("next_chain")[i].textContent = "."
}

function display_update() {
  rs_disp = rs_id+1
  document.getElementById("rs_id").textContent = "RBAS RS -"+ rs_disp;
  tick = disp_json.tick;
  document.getElementById("rs_tick").textContent = tick
  document.getElementById("db_status").textContent = disp_json.db_status;
  document.getElementById("rs_in_total").textContent = disp_json.db_log[rs_id].in_total;
  document.getElementById("rs_in_err").textContent = disp_json.db_log[rs_id].in_err;
  document.getElementById("rs_q_total").textContent = disp_json.db_log[rs_id].q_total;
  document.getElementById("rs_q_err").textContent = disp_json.db_log[rs_id].q_err;
  document.getElementById("chain").textContent = disp_json.chain.substring(0, 16);
  document.getElementById("next_chain").textContent = disp_json.next_chain.substring(0, 16)
  document.getElementById("block").textContent = disp_json.db_log[rs_id].hash.substring(0, 32) + ' ' + disp_json.db_log[rs_id].hash.substring(32, 64);

  for (i = 0; i < 9; i++) {
    if (disp_json.db_log[i] != undefined) {
    document.getElementsByClassName("db_in_total")[i].textContent = disp_json.db_log[i].in_total;
    document.getElementsByClassName("db_in_err")[i].textContent = disp_json.db_log[i].in_err;
    document.getElementsByClassName("db_q_total")[i].textContent = disp_json.db_log[i].q_total;
    document.getElementsByClassName("db_q_err")[i].textContent = disp_json.db_log[i].q_err;
    document.getElementsByClassName("block")[i].textContent = disp_json.db_log[i].hash.substring(0,12)+"...";      
    }
  }

  i = tick %20
  disp_log(i)
}

async function dash_js() {
  const utc = new Date();
  var str1 = "" + utc;
  time = str1.substring(16, 24);
  document.getElementById("time").textContent = time;
  const res = await fetch("/rs", { method: "POST" });
  disp_json = await res.json();
  rs_id = disp_json.rs_id
  console.log(disp_json)
  display_update()
}

setInterval(dash_js, 1000);
