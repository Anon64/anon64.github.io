const messages = [
    // 'bruh moment, you made an oopsie.', // outdated
    'you aren\'t supposed to see this.',
    'what did you do???? (or was it me?)',
    'yikes, ignore this.',
    'could you try that again, please?',
    'are you sure you did that right?',
    'nope, try again.',
    'whoops, something went wrong.',
    'you seem lost, need help?',
    'this page is a ghost town.',
    'uh oh, looks like we\'re lost in the void.',
    'the page you\'re looking for is on vacation.',
    'hmm, that didn\'t work. try again?',
    'this page has vanished into thin air.',
    'error 404: page not found, but we\'re still here.',
    'looks like you\'ve gone off the beaten path.',
    '404 - Page not found. Did you break the internet?',
    'not sure what happened, but it\'s not good.',
    'something went wrong - let\'s try again.',
    'page lost in cyberspace!',
    'uh-oh, looks like you stumbled upon an empty room.',
    'this isn\'t the page you\'re looking for.',
    'page unavailable, we\'re working on it.',
    'this page is out of service - try again later.',
    'the page is just...gone. Sorry about that!',
    'page not found! We may need to retrace our steps.',
    '404 error - it\'s like the page never existed!',
    'well, this is awkward... that page doesn\'t exist.',
    'we couldn\'t find that. Want to try something else?',
    'page not found! But we\'re still here to help.',
    'the page is nowhere to be found. Want to go home?',
    'how did you do that? this page doesn\'t exist.',
    'that seems to not have worked. try again?',
];

//bruh what are you doing here, stop snooping around.

function onLoad() {
    if (location.pathname.substr(0, 6) == "/mpp2/") {
        location = `/mpp2/?${location.pathname.slice(6)}`
    } else {
        document.getElementById('message').innerHTML = `404<br>${messages[Math.floor(messages.length * Math.random())] || 'oops'}`;
    }
}