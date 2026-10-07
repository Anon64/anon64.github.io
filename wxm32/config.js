// Where the alert server lives. The page works from whatever is here: change it here, nowhere else.
window.WXM32_CONFIG = {
  api: 'https://alerts.anon64.dev',   // the alert server (alert-server/ in this project), reachable from the internet
  title: 'WXM32 & Columbus stations',
  pageSize: 60,                        // alerts shown at a time before "Show more"
};
// Testing on your own machine: open the page from localhost or a LAN address with ?api=http://<that address>:8787 to point it at a local server. Ignored on any other host.
{
  const q = new URLSearchParams(location.search).get('api');
  if (q && /^(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)$/.test(location.hostname)) {
    try { const u = new URL(q.trim().replace(/^["'\u201c\u201d]+|["'\u201c\u201d]+$/g, '')); if (/^https?:$/.test(u.protocol)) window.WXM32_CONFIG.api = u.origin; } // quotes from a copy and paste are dropped; anything that is not a web address is ignored
    catch { /* not an address: the default api stays */ }
  }
}
