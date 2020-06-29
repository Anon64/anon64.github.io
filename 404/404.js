const messages = [
    'bruh moment, you made an oopsie',
    'you aren\'t supposed to see this',
    'what did you do???? (or was it me?)',
    'yikes, ignore this'
];

document.onload(() => {
    document.getElementById('message').innerHTML = `404<br>${messages[Math.floor(messages.length * Math.random())] || 'oops'}`;
})