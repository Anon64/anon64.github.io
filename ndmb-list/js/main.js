const DEBUG = false; // what was

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
    xmlhttp.open('GET', "/ndmb-list/misc/names.txt");
    xmlhttp.send();
    xmlhttp.onload = () => {
        list = xmlhttp.responseText.split('\n').filter(Boolean);
        document.getElementById('searchbox').addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('subtn').click();
            }
        });
        document.getElementById('amount').addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById('subtn').click();
            }
        });
        loadList();
    }
}

function bettersort(q) {
    return function (a, b) {
        return a[1].toLowerCase().indexOf(q) - b[1].toLowerCase().indexOf(q);
    }
}

function searchlist(q = '') {
    let out = [];
    for ([id, name] of list.entries()) {
        out.push([id, name]);
    }
    return out.filter(n => (n[1].toLowerCase().includes(q) && !!n)).sort(bettersort(q)).sort(function (a, b) {
        let na = a[1].toLowerCase();
        let nb = b[1].toLowerCase();
        return na.indexOf(q) == nb.indexOf(q) ? (na.indexOf(q) + na.length) - (nb.indexOf(q) + nb.length) : 0;
    });
}

let busy = false;

async function loadList() {
    if (busy) return;
    busy = true;
    let table = document.getElementById('mainlist');

    let idval = document.getElementById('startindex').value;
    let index = isNaN(idval) ? 0 : parseInt(idval) || 0;

    let length = parseInt(document.getElementById('amount').value) || 20;

    let search = document.getElementById('searchbox').value || '';

    let summatory = 0;
    if (table.rows.length > 1) {
        let rowCount = table.rows.length;
        for (let i = 1; i < rowCount; i++) {
            table.deleteRow(1);
            document.getElementById('tracknum').innerHTML = `Showing ${table.rows.length - 1} track(s) of ${list.length}.`;
            let newtime = (500 - summatory) / ((1.05 - Math.pow(1.05, -(Math.min(rowCount, 100) - 1))) / (1.05 - 1));
            summatory += newtime;
            if (newtime > 1) await wait(newtime);
        }
    }

    let summatory1 = 0;
    let songlist = search ? searchlist(search).slice(0, length) : list.slice(index, index + length).entries();
    let listlength = search ? songlist.length : list.slice(index, index + length).length;
    for (let [id, name] of songlist) {
        let row = table.insertRow(-1);
        row.insertCell(0).innerHTML = search ? id : id + index;
        let nn = name.replace(new RegExp(search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i'), `<span style='background-color: #FFD700; color: black;'>$&</span>`).replace(new RegExp('[\\x00\\x08\\x0B\\x0C\\x0E-\\x1F\x7F-\x9F]', 'g'), ' ').slice(0, 250);
        row.insertCell(1).innerHTML = `${nn}${nn.length > 250 ? '...' : ''}`;
        document.getElementById('tracknum').innerHTML = `Showing ${table.rows.length - 1} track(s) of ${list.length}.`;
        let newtime = (1000 - summatory1) / ((1.05 - Math.pow(1.05, -(Math.min(listlength, 100) - 1))) / (1.05 - 1));
        summatory1 += newtime;
        if (DEBUG) console.log(newtime);
        if (newtime > 1) await wait(newtime);
    }
    await wait(200);
    busy = false;
}