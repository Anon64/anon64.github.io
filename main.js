function loadList() {
    let list;
    let xmlhttp;
    
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "names.txt", true);
    xmlhttp.send();
    list = xmlhttp.responseText.split('\r\n');

    document.getElementById('tracknum').innerHTML = `Showing ${list.length} tracks.`;
}