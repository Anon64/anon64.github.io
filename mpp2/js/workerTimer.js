self.onmessage = function(event) {
  setTimeout(() => {
    postMessage({ args: event.data.args });
  }, event.data.delay);
};