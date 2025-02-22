let dark = false;
let list;
const retry_interval = [3000, 5000, 8000, 10000, 15000, 30000];
let retry_count = 0;

//i should rewrite some day

//new fetch thing https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647

const getJSON = async url => {
    const response = await fetch(url);
    if (!response.ok) // check if response worked (no 404 errors etc...)
        throw new Error(response.statusText);

    const data = response.json(); // get JSON from the response
    return data; // returns a promise, which resolves to this data value
};

async function getList() {
    document.getElementById('wxm').innerHTML = "WXM32 & WCGQ-FM (107.3) - <span style='color: #FFFF90;'>Connecting to alert server.</span>";

    try {
        list = await getJSON("https://acikek.com/alert");
        //document.getElementById('wxm').innerHTML = `WXM32 & WCGQ-FM (107.3) - <span style='color: #FF9090;'>Error parsing alerts.</span>`;
        list = list.alerts.sort((a, b) => b.date - a.date);
        document.getElementById('wxm').innerHTML = `WXM32 & WCGQ-FM (107.3) - <span style='color: #90FF90;'>Collected ${list.length} alert${list.length == 1 ? '' : 's'}.</span>`;
        retry_count = 0;
        loadList();
    } catch (e) {
        // document.getElementById('wxm').innerHTML = `WXM32 & WCGQ-FM (107.3) - <span style='color: #FF9090;'>Could not connect to alert server. (${retry_count + 1} tr${(retry_count + 1) == 1 ? 'y' : 'ies'})</span>`;
        // setTimeout(function () {
        //     if (retry_count < 20) getList();
        // }, retry_interval[Math.min(retry_count++, retry_interval.length - 1)]);
        // this is so extra
        document.getElementById('wxm').innerHTML = `WXM32 & WCGQ-FM (107.3) - <span style='color: #FF9090;'>Could not connect to alert server. (${retry_count + 1} tr${(retry_count + 1) == 1 ? 'y' : 'ies'})</span>`;

        // Calculate next retry time by adding the retry interval to the current time
        nextRetryTime = Date.now() + retry_interval[Math.min(retry_count++, retry_interval.length - 1)];

        // Start countdown for retry
        let retryMessage = document.createElement('span');
        retryMessage.style.color = '#FF9090';
        retryMessage.innerText = ` Retrying in calculating...`;

        document.getElementById('wxm').appendChild(retryMessage);

        const countdownInterval = setInterval(() => {
            const remaining_ms = nextRetryTime - Date.now();
            const remaining_deciseconds = Math.max(remaining_ms / 100, 0); // Convert milliseconds to deciseconds

            if (remaining_deciseconds <= 0) {
                clearInterval(countdownInterval);
                // setTimeout(function () {
                    /* if (retry_count < 20)*/ getList();
                // }, retry_interval[Math.min(retry_count++, retry_interval.length - 1)]);
            } else {
                // Calculate seconds and deciseconds for display
                const seconds = Math.floor(remaining_deciseconds / 10);
                const deciseconds = Math.floor(remaining_deciseconds % 10);
                retryMessage.innerText = ` Retrying in ${seconds}.${deciseconds} seconds...`;
            }
        }, 100); // Update every 100ms (decisecond precision)

    };
}

function onLoad() {
    getList();
}

// this is pretty bad, lol!

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
};

function getLevel(e) {
    const l = event_levels;
    return l[e] ? l[e] : l[e.slice(-1)] ? l[e.slice(-1)] : undefined;
}

function gc(e, d = false) {
    const t = getLevel(e);
    let out = "";
    switch (t) {
        case 'WRN':
            out = 'warning';
            break;
        case 'ADV':
            out = 'advisory';
            break;
        case 'WCH':
            out = 'watch';
            break;
        case 'TEST':
            out = 'test';
            break;
        default:
            out = 'unknown';
            break;
    }
    return out + (d && out != 'unknown' ? '-dark' : '');
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
    //internal codes (for compatability i guess)
    'Transmitter Backup On': 'TXB',
    'Transmitter Carrier Off': 'TXF',
    'Transmitter Carrier On': 'TXO',
    'Transmitter Primary On': 'TXP',
};

const alert_list = Object.keys(alert_types);

async function loadList() {
    const tableBody = document.getElementById('alert-list-body');
    const emptyMessage = document.getElementById('empty-message');

    tableBody.innerHTML = ''; // Clear current table rows

    if (list.length === 0) {
        emptyMessage.style.display = 'block'; // Show message if no alerts
    } else {
        emptyMessage.style.display = 'none'; // Hide message if there are alerts

        let length = parseInt(document.getElementById('amount').value) || 20;

        if (tableBody.rows.length > 1) {
            let rowCount = tableBody.rows.length;
            for (let i = 1; i < rowCount; i++) {
                tableBody.deleteRow(1);
            }
        }

        for (let [i, alert] of list.entries()) {
            if (i > length + 1) return; //what
            let date = new Date(alert.date);
            let row = tableBody.insertRow(-1);
            let fdate = new Intl.DateTimeFormat(navigator.language, {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }).format(date);

            // Manually extract the date and time parts
            let [datePart, timePart] = fdate.split(/\s*,\s*|\s+/); // Handles both space and comma

            row.insertCell(0).innerHTML = `<p style='font-size: 12pt;'>${datePart}<br>${timePart}</p>`;

            row.insertCell(1).innerHTML = `<p>${alert.originator}<br><span style='font-size: 8pt;'>${alert.originator_full}</span></p>`;
            let event = row.insertCell(2);
            event.innerHTML = `<p>${alert.event_code}<br><span style='font-size: 8pt;'>${alert.event_full}</span></p>`;
            event.className = gc(alert.event_code, dark);
            //row.insertCell(2).innerHTML = `<span style='text-align: center;color: ${getECol(alert.typ)};'>${alert.typ}</span><br><span style='font-size: 8pt;text-align: center;color: ${getECol(alert.typ)};'>${alert.evn}</span>`
            row.insertCell(3).innerHTML = `<p style='font-size: 12pt; font-size:calc(50% + 0.6vw)'>${alert.message.replace(new RegExp(`(${alert_list.join('|')})`, 'g'), `<span class='${gc(alert.event_code, dark)}'>$&</span>`)}</p>`;
        }
    }
    if (dark) sa();
}

function switchcol() {
    dark = !dark;
    sa();
}

function sa() {
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

    document.body.classList.toggle('dark-mode');
}
