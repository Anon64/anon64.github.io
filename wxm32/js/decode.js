// Decoder for alert format v3, plain JSON. No dependencies and no Node APIs: the same file runs in the browser (import it as a module) and in the server.
//
//   { "v": 3,
//     "stations": ["KFFC/NWS", ...],                     callsigns, each once
//     "areas":    [["013215", "013053"], ...],           lists of SAME county codes, each once
//     "heads":    ["The National Weather Service ... effective until ", ...],   the sentence up to the expiry time, each once
//     "tails":    [" for the following counties in Georgia: Chattahoochee, Muscogee. (KFFC/NWS)", ...],   the sentence after it, each once
//     "alerts":   [[t, org, event, station, area, minutes, flags, head, tail, extra?], ...],
//     "ids":      [..]            optional: the alert ids, when the list is a filtered selection (otherwise an alert's id is its position + 1)
//     "events":   { "TOR": ["Tornado Warning", "#FF0000", "WRN"] }   optional: names, WSv4 colours and levels of the codes in use
//     "orgs":     { "WXR": "National Weather Service" } }            optional
//   t = epoch seconds; station / area / head / tail = positions in the lists above; tail -1 = the head is the whole text.
//   flags (bits): 1 = a test or joke alert, 2 = hidden by the editor, 4 = removed by the editor (a tombstone: the id stays, the alert is gone from every public answer).   extra: { s: source id, i: listener db id, r: recording name }
//
//   message = heads[head] + <expiry time in the reader's own time zone and format> + tails[tail]
//
//   const doc = await (await fetch(api + '/v3')).json();
//   const alerts = decode(doc);            // newest first, each: { id, date, message, event_code, event_full, level, color, fips, ... }
export const ORG_NAMES = { WXR: 'National Weather Service', EAS: 'Broadcast station or cable system', CIV: 'Civil authorities', PEP: 'Primary Entry Point System', EAN: 'Emergency Action Notification Network' };

const fmtCache = new Map();
const formatter = (key, opts, locale, tz) => { const k = `${key}|${locale}|${tz}`; if (!fmtCache.has(k)) fmtCache.set(k, new Intl.DateTimeFormat(locale, { ...opts, ...(tz ? { timeZone: tz } : {}) })); return fmtCache.get(k); };
const norm = (s) => s.replace(/[  ]/g, ' ');

/** the expiry time as it is written inside the sentence: date and time in the reader's locale and time zone (both default to the browser's / server's own) */
export const stamp = (ms, { locale, tz } = {}) => norm(formatter('stamp', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }, locale, tz).format(ms));
const clock = (ms, { locale, tz } = {}) => norm(formatter('clock', { hour: 'numeric', minute: '2-digit' }, locale, tz).format(ms));
export const lengthText = (m) => (!m ? null : m % 60 === 0 ? `${m / 60} hour${m === 60 ? '' : 's'}` : m < 60 ? `${m} minutes` : `${Math.floor(m / 60)} hour${m < 120 ? '' : 's'} ${m % 60} minutes`);

export function messageOf(doc, rec, opts) {
  const [t, , , , , minutes, , head, tail] = rec, h = doc.heads[head] ?? '';
  return tail < 0 ? h : h + stamp((t + minutes * 60) * 1000, opts) + (doc.tails[tail] ?? '');
}

/** one stored tuple -> the object the site uses (the v2 field names are kept: originator, originator_full, callsign, event_code, event_full, start_time, end_time, length, message, date) */
export function decodeAlert(doc, rec, id, opts = {}) {
  const [t, org, event, si, ai, minutes, flags, , , x = {}] = rec, ms = t * 1000, ev = doc.events?.[event];
  return {
    id, date: ms, expires: minutes ? ms + minutes * 60_000 : null,
    originator: org, originator_full: doc.orgs?.[org] ?? ORG_NAMES[org] ?? org, callsign: doc.stations[si] ?? '',
    event_code: event, event_full: ev?.[0] ?? event, level: ev?.[2] ?? null, color: ev?.[1] ?? '#696969',
    start_time: clock(ms, opts), end_time: minutes ? clock(ms + minutes * 60_000, opts) : null, length: lengthText(minutes),
    message: messageOf(doc, rec, opts), fips: doc.areas[ai] ?? [], test: !!(flags & 1), hidden: !!(flags & 2), removed: !!(flags & 4), source: x.s ?? 'other', recording: x.r ?? null, type: 'alert',
  };
}

/** every alert of a document, newest first */
export function decode(doc, opts = {}) {
  if (doc?.v !== 3) throw new Error('not an alert document (format v3)');
  return doc.alerts.map((rec, i) => decodeAlert(doc, rec, doc.ids?.[i] ?? i + 1, opts)).sort((a, b) => b.date - a.date || b.id - a.id);
}
