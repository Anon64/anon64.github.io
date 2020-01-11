function loadList() {
    let list;
    let xmlhttp;

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "/misc/names.txt");
    xmlhttp.send();
    /*xmlhttp.onreadystatechange = () => {

    }*/
    list = await xmlhttp.responseText.split('\n').filter(Boolean);

    document.getElementById('tracknum').innerHTML = `Showing ${list.length} track(s).`;
    console.log(list);
}