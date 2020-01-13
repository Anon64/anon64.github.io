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

function bettersort(q) {
    return function (a, b) {
        return a[1].indexOf(q) - b[1].indexOf(q);
    }
}

function searchlist(q = '') {
    let out = [];
    for ([id, name] of list.entries()) {
        out.push([id, name]);
    }
    return out.filter(n => (n[1].toLowerCase().includes('test') && !!n)).sort(bettersort(q));
}

let busy = false;

async function loadList() {
    if (busy) return;
    busy = true;
    let table = document.getElementById('mainlist');

    let idval = document.getElementById('startindex').value;
    let index = isNaN(idval) ? 0 : parseInt(idval) || 0;

    let length = document.getElementById('amount').value || 20;

    let search = document.getElementById('searchbox').value || '';

    let summatory = 0;
    if (table.rows.length > 1) {
        let rowCount = table.rows.length;
        for (let i = 1; i < rowCount; i++) {
            table.deleteRow(1);
            document.getElementById('tracknum').innerHTML = `Showing ${table.rows.length-1} track(s) of ${list.length}.`;
            let newtime = (500 - summatory) / ((1.05 - Math.pow(1.05, -(rowCount - 2))) / (1.05 - 1));
            summatory += newtime;
            if (newtime > 1) await wait(newtime);
        }
    }

    summatory = 0;
    let songlist = search ? searchlist(search).slice(0, length) : list.slice(index, index + length).entries();
    let listlength = songlist.length;
    for (let [id, name] of songlist) {
        let row = table.insertRow(-1);
        row.insertCell(0).innerHTML = search ? id : id + index;
        row.insertCell(1).innerHTML = name;
        document.getElementById('tracknum').innerHTML = `Showing ${table.rows.length-1} track(s) of ${list.length}.`;
        let newtime = (2000 - summatory) / ((1.05 - Math.pow(1.05, -(listlength - 1))) / (1.05 - 1));
        summatory += newtime;
        if (newtime > 1) await wait(newtime);
    }
    await wait(200);
    busy = false;
}