let list;

const retry_interval = [100, 600, 1400, 6000, 10000];
let retry_count = 0;

function getList() {
    document.getElementById('wxm').innerHTML = "WXM32 - <span style='color: #FFFF90;'>Connecting to alert server.</span>";
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', "https://sethcam.ml/wserver/alerts");
    xmlhttp.send();
    xmlhttp.onload = () => {
        try {
            list = JSON.parse(xmlhttp.responseText || "{\"alerts\":[]}");
        } catch (e) {
            document.getElementById('wxm').innerHTML = `WXM32 - <span style='color: #FF9090;'>Error parsing alerts.</span>`;
            return;
        }
        list = list.alerts.sort((a, b) => b.date - a.date);
        document.getElementById('wxm').innerHTML = `WXM32 - <span style='color: #90FF90;'>Collected ${list.length} alert${list.length == 1 ? '' : 's'}.</span>`;
        retry_count = 0;
        loadList();
    }
    xmlhttp.onerror = () => {
        document.getElementById('wxm').innerHTML = `WXM32 - <span style='color: #FF9090;'>Could not connect to alert server. (${retry_count + 1} tr${retry_count == 1 ? 'y' : 'ies'})</span>`;
        setTimeout(function () {
            if (retry_count < 20) getList();
        }, retry_interval[Math.min(retry_count++, retry_interval.length - 1)]);
    }
}

function onLoad() {
    getList();
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

function gc(e) {
    const t = getLevel(e);
    switch (t) {
        case 'WRN':
            return 'warning';
        case 'ADV':
            return 'advisory';
        case 'WCH':
            return 'watch';
        case 'TEST':
            return 'test';
        default:
            return 'unknown';
    }
}

const alert_types = {
    'Administrative Message': 'ADR',
    'Avalanche Watch': 'AVA',
    'Avalanche Warning': 'AVW',
    'Biological Hazard Warning': 'BHW',
    'Boil Water Warning': 'BWW',
    'Blizzard Warning': 'BZW',
    'Coastal Flood Watch': 'CFA',
    'Coastal Flood Warning': 'CFW',
    'Child Abduction Emergency': 'CAE',
    'Civil Danger Warning': 'CDW',
    'Civil Emergency Message': 'CEM',
    'Chemical Hazard Warning': 'CHW',
    'Contaminated Water Warning': 'CWW',
    'Dust Storm Warning': 'DSW',
    'Flash Flood Watch': 'FFA',
    'Flash Flood Warning': 'FFW',
    'Flash Flood Statement': 'FFS',
    'Flood Watch': 'FLA',
    'Flood Warning': 'FLW',
    'Flood Statement': 'FLS',
    'High Wind Watch': 'HWA',
    'High Wind Warning': 'HWW',
    'Hurricane Watch': 'HUA',
    'Hurricane Warning': 'HUW',
    'Hurricane Statement': 'HLS',
    'Severe Thunderstorm Watch': 'SVA',
    'Severe Thunderstorm Warning': 'SVR',
    'Severe Weather Statement': 'SVS',
    'Special Marine Warning': 'SMW',
    'Special Weather Statement': 'SPS',
    'Tornado Watch': 'TOA',
    'Tornado Warning': 'TOR',
    'Tropical Storm Watch': 'TRA',
    'Tropical Storm Warning': 'TRW',
    'Tsunami Watch': 'TSA',
    'Tsunami Warning': 'TSW',
    'Winter Storm Watch': 'WSA',
    'Winter Storm Warning': 'WSW',
    'Emergency Action Notification': 'EAN',
    'Emergengy Action Termination': 'EAT',
    'National Information Center': 'NIC',
    'National Periodic Test': 'NPT',
    'National Audible Test': 'NAT',
    'National Silent Test': 'NST',
    'Required Monthly Test': 'RMT',
    'Required Weekly Test': 'RWT',
    'Earthquake Warning': 'EQW',
    'Evacuation Immediate': 'EVI',
    'Fire Warning': 'FRW',
    'Hazardous Materials Warning': 'HMW',
    'Law Enforcement Warning': 'LEW',
    'Local Area Emergency': 'LAE',
    '911 Outage Emergency': 'TOE',
    'Nuclear Plant Warning': 'NUW',
    'Radiological Hazard Warning': 'RHW',
    'Shelter in Place Warning': 'SPW',
    'Volcano Warning': 'VOW',
    'Network Message Notification': 'NMN',
    'Demonstration Message': 'DMO',
    'Extreme Wind Warning': 'EWW',
    'Storm Surge Watch': 'SSA',
    'Storm Surge Warning': 'SSW',
    'Flash Freeze Warning': 'FSW',
    'Freeze Warning': 'FZW',
    'Hurricane Local Statement': 'HLS',
    'Special Marine Warning': 'SMW',
    'Dam Watch': 'DBA',
    'Dam Break Warning': 'DBW',
    'Contagious Disease Warning': 'DEW',
    'Evacuation Watch': 'EVA',
    'Food Contamination Warning': 'FCW',
    'Iceberg Warning': 'IBW',
    'Industrial Fire Warning': 'IFW',
    'Land Slide Warning': 'LSW',
    'Power Outage Statement': 'POS',
    'Wild Fire Watch': 'WFA',
    'Wild Fire Warning': 'WFW',
    //internal codes (for compatability i guess
    'Transmitter Backup On': 'TXB',
    'Transmitter Carrier Off': 'TXF',
    'Transmitter Carrier On': 'TXO',
    'Transmitter Primary On': 'TXP',
}

const alert_list = Object.keys(alert_types);

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
        let fdate = Intl.DateTimeFormat('en-US', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);

        row.insertCell(0).innerHTML = `<p style='font-size: 12pt;'>${fdate.replace(',', '<br>')}</p>`;
        row.insertCell(1).innerHTML = `<p>${alert.org}<br><span style='font-size: 8pt;'>${alert.orf}</span></p>`;
        let event = row.insertCell(2);
        event.innerHTML = `<p>${alert.typ}<br><span style='font-size: 8pt;'>${alert.evn}</span></p>`;
        event.className = gc(alert.typ);
        //row.insertCell(2).innerHTML = `<span style='text-align: center;color: ${getECol(alert.typ)};'>${alert.typ}</span><br><span style='font-size: 8pt;text-align: center;color: ${getECol(alert.typ)};'>${alert.evn}</span>`
        row.insertCell(3).innerHTML = `<p style='font-size: 12pt; font-size:calc(50% + 0.6vw)'>${alert.msg.replace(new RegExp(`(${alert_list.join('|')})`, 'g'), `<span class='${gc(alert.typ)}'>$&</span>`)}</p>`;
    }
}

function switchcol() {
    document.getElementById('maintable').classList.toggle('dark-mode');

    let warnings = document.getElementsByClassName('warning');
    for (warning of warnings) {
        warning.classList.toggle('warning-dark');
    }
    let watches = document.getElementsByClassName('watch');
    for (watch of watches) {
        watch.classList.toggle('watch-dark');
    }
    let advisories = document.getElementsByClassName('advisory');
    for (advisory of advisories) {
        advisory.classList.toggle('advisory-dark');
    }
    let tests = document.getElementsByClassName('test');
    for (test of tests) {
        test.classList.toggle('test-dark');
    }
}