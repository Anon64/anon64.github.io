function wait(ms) {
    return new Promise(r => {
        setTimeout(() => {
            r();
        }, ms);
    })
}

function loadList() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "./misc/names.txt");
    xmlhttp.send();
    xmlhttp.onload = async () => {
        let list = xmlhttp.responseText.split('\n').filter(Boolean);
        let table = document.getElementById('mainlist');
        for (let [id, name] of list.entries()) {
            document.getElementById('tracknum').innerHTML = `Showing ${list.indexOf(name)+1} track(s).`;
            let row = table.insertRow(-1);
            row.insertCell(0).innerHTML = id;
            row.insertCell(1).innerHTML = name;
            await wait(30);
        }
        /*list.forEach(async (name, id) => {
            let row = table.insertRow(-1);
            row.insertCell(0).innerHTML = id;
            row.insertCell(1).innerHTML = name;
        });
        */
    }
}