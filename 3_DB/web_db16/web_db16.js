// db16 web view at port 1020

let tick = 1000000000
let db16 = []
let db_index = []
let total = 0

function init_disp() {
    document.getElementById("total").textContent = 0;
    for (i = 0; i < 16; i++) document.getElementsByClassName("total")[i].textContent = 0;
    for (i = 0; i < 1600; i++) {
        document.getElementsByClassName("hash")[i].textContent = "-";
        document.getElementsByClassName("id")[i].textContent = "-";
        document.getElementsByClassName("tick")[i].textContent = "-";
    }
}

function disp_update(digit) {
    document.getElementsByClassName("total")[digit].textContent = db_index[digit]
    for (i = 0; i < 100; i++) {
        ptr = digit * 100 + i
        hash = "-"
        try { hash = db16[digit][i].hash } catch (e) { }
        if (hash.length >= 32) {
            document.getElementsByClassName("hash")[ptr].textContent = db16[digit][i].hash.substring(0, 6) + "...";
            document.getElementsByClassName("id")[ptr].textContent = db16[digit][i].id;
            document.getElementsByClassName("tick")[ptr].textContent = db16[digit][i].tick;
        }
        else {
            document.getElementsByClassName("hash")[ptr].textContent = "-"
            document.getElementsByClassName("id")[ptr].textContent = "-"
            document.getElementsByClassName("tick")[ptr].textContent = "-"
        }
    }
}

init_disp()

async function disp() {
    const utc = new Date();
    var str1 = "" + utc;
    var timeDisp = str1.substring(4, 24);
    const res = await fetch("/db16", { method: "POST" });
    data_json = await res.json();
    document.getElementById("time").textContent = timeDisp;

    document.getElementById("tick").textContent = tick;
    document.getElementById("total").textContent = total;
    if (data_json[0] != undefined) {
        tick = data_json[0].tick
        total = 0
        for (i = 0; i < 16; i++) {
            db_index[i] = 0
            db16[i] = []
        }

        data_json.forEach(element => {
            digit = element.hash.substring(0, 1)
            // console.log("digit = "+ digit)
            i = parseInt(digit, 16)
            // console.log("first digit = " + i)
            db16[i][db_index[i]] = element
            db_index[i]++
            total++
        })

        for (digit = 0; digit < 16; digit++) {
            console.log("db16-" + digit + " = ")
            console.log(db16[digit])
            disp_update(digit)
        }
    }

}

setInterval(disp, 1000);