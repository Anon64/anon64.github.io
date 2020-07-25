let list;

function onLoad() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "https://sethcam.ml/wserver/alerts");
    xmlhttp.send();
    xmlhttp.onload = () => {
        list = JSON.parse(xmlhttp.responseText || "{\"alerts\":[]}");
        list = list.alerts.sort((a, b)=> b.date - a.date);
        loadList();
    }
}

async function loadList() {
    let table = document.getElementById('maintable');

    let length = parseInt(document.getElementById('amount').value) || 20;

    if (table.rows.length > 1) {
        let rowCount = table.rows.length;
        for (let i = 1; i < rowCount; i++) {
            table.deleteRow(1);
        }
    }

    for (let [i, alert] of list.entries()) {
        if(i > length) return;
        let date = new Date(alert.date);

        let row = table.insertRow(-1);
        row.insertCell(0).innerHTML = date.toLocaleString('en-GB').replace(',','');
        row.insertCell(1).innerHTML = alert.ori;
        row.insertCell(2).innerHTML = alert.msg;
    }
}