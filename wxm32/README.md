# WXM32 & WCGQ-FM alerts

A static page: `index.html`, `css/style.css`, `js/app.js`, `js/decode.js`. It loads the compact alert document (`/v3`) from the alert server and decodes it in the browser.

- **Server address:** `config.js` (`api`). To try a local server, open the page from localhost or a LAN address with `?api=http://<that address>:8787`; that override is ignored on any other host.
- **Data format:** plain JSON, described at the top of `js/decode.js`. The sentence of each alert is stored as a dictionary-compressed head and tail around its expiry time; the browser writes the expiry time itself, in the reader's own time zone and format.
- **Server:** `alert-server/` (not part of this repository): it stores the alerts, copies new ones in from EAS Listener, and serves `/v3`, `/alert`, `/events` (live updates) and `/recording/<id>`.
