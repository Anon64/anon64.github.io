let list;

function onLoad() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "https://sethcam.ml/wserver/alerts");
    xmlhttp.send();
    xmlhttp.onload = () => {
        list = JSON.parse(xmlhttp.responseText || "{\"alerts\":[]}");
        list = list.alerts.sort((a, b) => b.date - a.date);
        loadList();
    }
}

const event_levels = {
    'ADR': 'ADV',
    'AVA': 'WCH',
    'AVW': 'WRN',
    'BLU': 'WRN',
    'BZW': 'WRN',
    'CAE': 'ADV',
    'CDW': 'WRN',
    'CEM': 'WRN',
    'CFA': 'WCH',
    'CFW': 'WRN',
    'DMO': 'TEST',
    'DSW': 'WRN',
    'EAN': 'WRN',
    'EAT': 'WRN',
    'EQW': 'WRN',
    'EVI': 'WRN',
    'EWW': 'WRN',
    'FFA': 'WCH',
    'FFS': 'ADV',
    'FFW': 'WRN',
    'FLA': 'WCH',
    'FLS': 'ADV',
    'FLW': 'WRN',
    'FRW': 'WRN',
    'FSW': 'WRN',
    'FZW': 'WRN',
    'HLS': 'ADV',
    'HMW': 'WRN',
    'HUA': 'WCH',
    'HUW': 'WRN',
    'HWA': 'WCH',
    'HWW': 'WRN',
    'LAE': 'ADV',
    'LEW': 'WRN',
    'NAT': 'TEST',
    'NIC': 'ADV',
    'NMN': 'ADV',
    'NPT': 'TEST',
    'NST': 'TEST',
    'NUW': 'WRN',
    'RHW': 'WRN',
    'RMT': 'TEST',
    'RWT': 'TEST',
    'SMW': 'WRN',
    'SPS': 'ADV',
    'SPW': 'WRN',
    'SQW': 'WRN',
    'SSA': 'WCH',
    'SSW': 'WRN',
    'SVA': 'WCH',
    'SVR': 'WRN',
    'SVS': 'ADV',
    'TOA': 'WCH',
    'TOE': 'ADV',
    'TOR': 'WRN',
    'TRA': 'WCH',
    'TRW': 'WRN',
    'TSA': 'WCH',
    'TSW': 'WRN',
    'VOW': 'WRN',
    'WSA': 'WCH',
    'WSW': 'WRN',
    'A': 'WCH',
    'E': 'ADV',
    'S': 'ADV',
    'W': 'WRN',
    'M': 'ADV',
    //others
    'BHW': 'WRN',
    'BWW': 'WRN',
    'CHW': 'WRN',
    'CWW': 'WRN',
    'DBA': 'WCH',
    'DBW': 'WRN',
    'DEW': 'WRN',
    'EVA': 'WCH',
    'FCW': 'WRN',
    'IBW': 'WRN',
    'IFW': 'WRN',
    'LSW': 'WRN',
    'POS': 'ADV',
    'WFA': 'WCH',
    'WFW': 'WRN',
    // internal use only
    'TXB': 'ADV',
    'TXF': 'ADV',
    'TXO': 'ADV',
    'TXP': 'ADV',
}

function getLevel(e) {
    const l = event_levels;
    return l[e] ? l[e] : l[e.slice(-1)] ? l[e.slice(-1)] : undefined;
}

function getECol(e) {
    const t = getLevel(e);
    switch (t) {
        case 'WRN':
            return '#FF9090';
        case 'ADV':
            return '#90FF90';
        case 'WCH':
            return '#FFFF90';
        case 'TEST':
            return '#FEFEFE';
        default:
            return '#696969';
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
        if (i > length) return;
        let date = new Date(alert.date);
        let row = table.insertRow(-1);
        row.insertCell(0).innerText = date.toLocaleString('en-GB').replace(',', '');
        row.insertCell(1).innerText = alert.ori;
        let event = row.insertCell(2);
        event.innerHTML = `<span style='text-align: center; color: black;'>${alert.typ}</span><br><span style='font-size: 8pt;text-align: center;'>${alert.evn}</span>`;
        event.style['background-color'] = getECol(alert.typ);
        //row.insertCell(2).innerHTML = `<span style='text-align: center;color: ${getECol(alert.typ)};'>${alert.typ}</span><br><span style='font-size: 8pt;text-align: center;color: ${getECol(alert.typ)};'>${alert.evn}</span>`
        row.insertCell(3).innerText = alert.msg;
    }
}