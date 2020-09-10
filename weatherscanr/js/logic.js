let status;

function onLoad() {
    loadStatus();
    setInterval(loadStatus, 10000);
}

function loadStatus() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "https://sethcam.ml/anon64/ice/status-json.xsl");
    xmlhttp.send();
    xmlhttp.onload = () => {
        try {
            status = JSON.parse(xmlhttp.responseText)
        } catch (e) {

        }
        //console.log(status)
        let meta = JSON.parse(status.icestats.source.title);
        document.getElementById('nowplaying').innerText = `Now Playing: ${meta.artist} - ${meta.title}`;
    }
}