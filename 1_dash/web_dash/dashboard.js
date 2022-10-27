let time = Date.now();
let wait = 0;
let tick = 1000000000;
let chain = "";
let next_chain = "";

function display_update() {
  for (i = 0; i < 9; i++) {
    try {
      tick = rs_dash[i].tick;
    } catch (e) {
      tick = 0;
    }
    document.getElementsByClassName("tick")[i].textContent = tick;
  }
}

function clear_rs(ptr) {
  document.getElementsByClassName("rs_tick")[ptr].textContent = ".";
  document.getElementsByClassName("chain")[ptr].textContent = ".";
  document.getElementsByClassName("next_chain")[ptr].textContent = ".";
}

function display_rs(i) {
  ptr = (tick % 20) + i * 20;
  console.log("ptr = " + ptr);
  document.getElementsByClassName("rs_tick")[ptr].textContent = tick;
  document.getElementsByClassName("chain")[ptr].textContent = chain;
  document.getElementsByClassName("next_chain")[ptr].textContent = next_chain;
  ptr = ((tick + 1) % 20) + i * 20;
  clear_rs(ptr);
  ptr = ((tick + 2) % 20) + i * 20;
  clear_rs(ptr);
}

function display_log() {
  for (i = 0; i < 9; i++) {
    try {
      tick = rs_dash[i].tick;
    } catch (e) {
      tick = 0;
    }
    try {
      chain = rs_dash[i].chain.substring(0, 6) + " ...";
    } catch (e) {
      chain = ".";
    }
    try {
      next_chain = rs_dash[i].next_chain.substring(0, 6) + " ...";
    } catch (e) {
      next_chain = ".";
    }
    display_rs(i);
  }
}
for (j = 0; j < 20; j++) {
  for (i = 0; i < 9; i++) {
    ptr = j + i * 20;
    clear_rs(ptr);
  }
}

document.getElementById("title").textContent = "RBAS dashboard";

async function dash_js() {
  const utc = new Date();
  var str1 = "" + utc;
  var timeDisp = str1.substring(4, 24);
  document.getElementById("rbas_time").textContent = timeDisp;
  const res = await fetch("/dashboard", { method: "POST" });
  rs_dash = await res.json();
  console.clear();
  console.log(rs_dash);
  display_update();
  display_log();
}

setInterval(dash_js, 500);
