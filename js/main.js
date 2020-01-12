function wait(ms) {
    return new Promise(r => {
        setTimeout(() => {
            r();
        }, ms);
    })
}

function loadList() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "/misc/names.txt");
    xmlhttp.send();
    xmlhttp.onload = async () => {
        let list = xmlhttp.responseText.split('\n').filter(Boolean);
        let table = document.getElementById('mainlist');
        document.getElementById('tracknum').innerHTML = `Showing ${list.length} track(s).`;
        for (name of list) {
            let row = table.insertRow(-1);
            row.insertCell(0).innerHTML = list.indexOf(name);
            row.insertCell(1).innerHTML = name;
            await wait(50);
        }
        /*list.forEach(async (name, id) => {
            let row = table.insertRow(-1);
            row.insertCell(0).innerHTML = id;
            row.insertCell(1).innerHTML = name;
        });
        */
    }
}