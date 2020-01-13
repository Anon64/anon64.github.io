function wait(ms) {
    return new Promise(r => {
        setTimeout(() => {
            r();
        }, ms);
    })
}

let list;

function onLoad() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "/misc/names.txt");
    xmlhttp.send();
    xmlhttp.onload = () => {
        list = xmlhttp.responseText.split('\n').filter(Boolean);
        loadList();
    }
}

async function loadList() {
    let table = document.getElementById('mainlist');

    let idval = document.getElementById('startindex').value;
    let index = isNaN(idval) ? 0 : parseInt(idval) || 0;

    let length = document.getElementById('amount').value || 20;

    if (table.rows.length > 1) {
        let rowCount = table.rows.length;
        for (let i = rowCount - 1; i > length; i--) {
            table.deleteRow(i);
            document.getElementById('tracknum').innerHTML = `Showing ${table.rows.length-1} track(s) of ${list.length}.`;
            await wait(20);
        }
    }
    let here = [];
    let rows = document.getElementById('mainlist').rows;
    for (h = 0; h < tows.length; h++) here.push(rows[h].childNodes[0].innerText);
    if (!(table.rows.length > length)) {
        for (let [id, name] of list.slice(index, index + length).entries()) {
            if(here.includes(id)) continue;
            let row = table.insertRow(-1);
            row.insertCell(0).innerHTML = id;
            row.insertCell(1).innerHTML = name;
            document.getElementById('tracknum').innerHTML = `Showing ${table.rows.length-1} track(s) of ${list.length}.`;
            await wait(30);
        }
    }

}