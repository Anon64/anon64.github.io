function loadList() {
    let list;
    let xmlhttp;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "misc/names.txt", true);
    xmlhttp.send();
    list = xmlhttp.responseText.split('\n');

    document.getElementById('tracknum').innerHTML = `Showing ${list.length} track(s).`;
}