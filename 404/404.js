const messages = [
    'bruh moment, you made an oopsie.',
    'you aren\'t supposed to see this.',
    'what did you do???? (or was it me?)',
    'yikes, ignore this.',
    'could you try that again, please?',
    'are you sure you did that right?',
    'nope, try again.',
    'whoops, something went wrong.',
    'you seem lost, need help?'
];

//bruh what are you doing here, stop snooping around.

function onLoad() {
    if (location.pathname.substr(0, 6) == "/mpp2/") {
        location = `/mpp2/?${location.pathname.slice(6)}`
    } else {
        document.getElementById('message').innerHTML = `404<br>${messages[Math.floor(messages.length * Math.random())] || 'oops'}`;
    }
}