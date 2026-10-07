// WXM32 + Columbus radio stations alert list. Loads the compact v3 JSON from the alert server, decodes it here in the browser (decode.js), and keeps it current over a
// server-sent event stream. Everything the page shows comes from that one document; filtering and search run locally.
import { decode, stamp } from './decode.js';

const CFG = { api: '', title: 'WXM32 & Columbus radio', pageSize: 60, ...window.WXM32_CONFIG };
const $ = (id) => document.getElementById(id);
const h = (tag, props = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) { if (v == null || v === false) continue; if (k === 'class') el.className = v; else if (k === 'text') el.textContent = v; else if (k === 'style') el.style.cssText = v; else if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? '' : v); }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid);
  return el;
};

const LEVELS = [
  { id: 'WRN', label: 'Warning', color: '#ff5d5d' }, { id: 'WCH', label: 'Watch', color: '#ffd23f' },
  { id: 'ADV', label: 'Advisory', color: '#3dd68c' }, { id: 'TEST', label: 'Test', color: '#7b8cff' }, { id: 'none', label: 'Other', color: '#8b98ab' },
];
const levelOf = (a) => a.level ?? 'none';
const S = {
  alerts: [], byId: new Map(), fresh: new Set(), lastId: 0, loaded: false, shown: CFG.pageSize, retry: 0, unread: 0,
  sources: [{ id: 'wxm32', name: 'WXM32', full: 'NOAA Weather Radio, Columbus GA (162.400 MHz)' }, { id: 'wcgq', name: 'WCGQ-FM', full: 'Q107.3 FM, Columbus GA' }, { id: 'wkcn', name: 'WKCN', full: 'Kiss 99.3 FM, Columbus GA' }, { id: 'wltc', name: 'WLTC', full: 'Lite 103.7 FM, Columbus GA' }, { id: 'other', name: 'Other', full: 'Other stations' }], // replaced by the server's own list (/stats) when it answers
  f: { source: '', levels: new Set(LEVELS.map((l) => l.id)), q: '' },
};
const srcName = (id) => S.sources.find((s) => s.id === id)?.name ?? id;

// ---- formatting -----------------------------------------------------------------------------------------------------
const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const monthFmt = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
const relFmt = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
const dayKey = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
function rel(ms) {
  const s = (Date.now() - ms) / 1000;
  if (s < 45) return 'just now';
  if (s < 3600) return relFmt.format(-Math.round(s / 60), 'minute');
  if (s < 86400) return relFmt.format(-Math.round(s / 3600), 'hour');
  if (s < 7 * 86400) return relFmt.format(-Math.round(s / 86400), 'day');
  return '';
}
function dayLabel(ms) {
  const k = dayKey(ms);
  if (k === dayKey(Date.now())) return `Today · ${dayFmt.format(ms)}`;
  if (k === dayKey(Date.now() - 864e5)) return `Yesterday · ${dayFmt.format(ms)}`;
  return dayFmt.format(ms);
}
const ink = (hex) => { const n = parseInt(String(hex).slice(1), 16), [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255]; return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55 ? '#111' : '#fff'; };

// ---- data -----------------------------------------------------------------------------------------------------------
async function api(path) {
  const r = await fetch(CFG.api + path, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`server answered ${r.status}`);
  return r.json();
}
function merge(list, fresh) {
  for (const a of list) { if (S.byId.has(a.id)) continue; S.byId.set(a.id, a); if (fresh) S.fresh.add(a.id); }
  S.alerts = [...S.byId.values()].sort((a, b) => b.date - a.date || b.id - a.id);
  S.lastId = Math.max(S.lastId, ...list.map((a) => a.id));
}
async function loadAll() {
  const [doc, stats] = await Promise.all([api('/v3'), api('/stats').catch(() => null)]);
  if (stats?.sources) S.sources = stats.sources;
  merge(decode(doc), false); S.loaded = true; S.retry = 0;
  $('updated').textContent = `Updated ${dateFmt.format(Date.now())}`;
}
async function loadNew() {
  if (!S.loaded) return;
  const doc = await api(`/v3?after=${S.lastId}`), list = decode(doc);
  if (!list.length) return;
  merge(list, true);
  if (document.hidden) { S.unread += list.length; document.title = `(${S.unread}) ${CFG.title} alerts`; }
  render(true);
}

// ---- filters --------------------------------------------------------------------------------------------------------
function visibleAlerts() {
  const q = S.f.q.trim().toLowerCase();
  return S.alerts.filter((a) => (!S.f.source || a.source === S.f.source) && S.f.levels.has(levelOf(a)) && (!q || `${a.event_full} ${a.event_code} ${a.message} ${a.callsign} ${a.originator_full} ${srcName(a.source)}`.toLowerCase().includes(q)));
}
function syncUrl() {
  const p = new URLSearchParams(), off = LEVELS.map((l) => l.id).filter((id) => !S.f.levels.has(id));
  if (S.f.source) p.set('source', S.f.source);
  if (off.length) p.set('hide', off.join(','));
  if (S.f.q) p.set('q', S.f.q);
  const qs = p.toString(); history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
}
function readUrl() {
  const p = new URLSearchParams(location.search);
  S.f.source = p.get('source') ?? ''; S.f.q = p.get('q') ?? ''; $('q').value = S.f.q;
  for (const id of (p.get('hide') ?? '').split(',').filter(Boolean)) S.f.levels.delete(id);
}
function buildControls() {
  const counts = (id) => S.alerts.filter((a) => (id ? a.source === id : true)).length;
  const seg = $('sources'); seg.replaceChildren();
  for (const s of [{ id: '', name: 'All stations' }, ...S.sources.filter((s) => s.id !== 'other' || counts(s.id))]) { // every station the server monitors, even one with no alerts yet; "Other" only when something is filed there
    seg.append(h('button', { type: 'button', 'aria-pressed': String(S.f.source === s.id), title: s.full ?? '', onclick: () => { S.f.source = s.id; S.shown = CFG.pageSize; syncUrl(); buildControls(); render(); } }, s.name, h('small', { text: String(counts(s.id)) })));
  }
  const chips = $('levels'); chips.replaceChildren();
  for (const l of LEVELS) {
    if (l.id === 'none' && !S.alerts.some((a) => levelOf(a) === 'none')) continue;
    chips.append(h('button', { type: 'button', class: 'chip', style: `--c:${l.color}`, 'aria-pressed': String(S.f.levels.has(l.id)), onclick: () => { S.f.levels.has(l.id) ? S.f.levels.delete(l.id) : S.f.levels.add(l.id); S.shown = CFG.pageSize; syncUrl(); buildControls(); render(); } }, h('i'), l.label));
  }
}

// ---- summary --------------------------------------------------------------------------------------------------------
function renderStats() {
  const day = Date.now() - 864e5, last = S.alerts[0], first = S.alerts.at(-1);
  const tile = (value, label) => h('div', { class: 'stat' }, h('b', { text: value }), h('span', { text: label }));
  $('stats').replaceChildren(
    tile(S.alerts.length.toLocaleString(), 'alerts on record'),
    tile(S.alerts.filter((a) => a.date >= day).length.toLocaleString(), 'in the last 24 hours'),
    tile(last ? rel(last.date) || dateFmt.format(last.date) : '–', 'latest alert'),
    tile(first ? monthFmt.format(first.date) : '–', 'archive begins'),
  );
}

// ---- alerts ---------------------------------------------------------------------------------------------------------
function messageNodes(a) { // the sentence with the event name and the expiry time picked out
  const text = a.message, nodes = [], m = /\*\*\* (.+?) \*\*\*/.exec(text);
  const until = a.expires ? stamp(a.expires) : null;
  const plain = (t) => { // split a plain run around the expiry time
    const i = until ? t.indexOf(until) : -1;
    if (i < 0) return nodes.push(t);
    nodes.push(t.slice(0, i), h('span', { class: 'until', text: until }), t.slice(i + until.length));
  };
  if (!m) { plain(text); return nodes; }
  plain(text.slice(0, m.index) + ' '); nodes.push(h('mark', { text: m[1] })); plain(' ' + text.slice(m.index + m[0].length));
  return nodes;
}
function detailPanel(a) {
  const src = S.sources.find((s) => s.id === a.source);
  const row = (k, v) => [h('dt', { text: k }), h('dd', {}, v)];
  return h('div', { class: 'detail' },
    h('dl', {},
      row('Station', `${src?.name ?? a.source}${src?.full ? ` · ${src.full}` : ''}`),
      row('Sent by', `${a.originator_full} (${a.originator})${a.callsign ? ` · ${a.callsign}` : ''}`),
      row('Heard', dateFmt.format(a.date)),
      a.expires ? row('Expires', `${dateFmt.format(a.expires)}${a.length ? ` · ${a.length}` : ''}`) : null,
      a.fips.length ? row('Areas', h('span', { class: 'codes' }, a.fips.map((f) => h('code', { text: f })))) : null,
      row('Alert', `#${a.id} · ${a.event_code}`),
    ),
    a.recording ? h('audio', { controls: true, preload: 'none', src: CFG.api + a.recording }) : null,
  );
}
function card(a) {
  const level = LEVELS.find((l) => l.id === levelOf(a));
  let panel = null;
  const details = h('button', { type: 'button', 'aria-expanded': 'false', onclick: (e) => { const el = e.currentTarget, art = el.closest('article'); if (panel) { panel.remove(); panel = null; el.setAttribute('aria-expanded', 'false'); el.textContent = 'Details'; } else { panel = detailPanel(a); art.append(panel); el.setAttribute('aria-expanded', 'true'); el.textContent = 'Hide details'; } } }, 'Details');
  const copy = h('button', { type: 'button', onclick: async (e) => { const url = `${location.origin}${location.pathname}#a${a.id}`; try { await navigator.clipboard.writeText(url); e.currentTarget.textContent = 'Copied'; setTimeout(() => { e.currentTarget.textContent = 'Copy link'; }, 1500); } catch { location.hash = `a${a.id}`; } } }, 'Copy link');
  const el = h('article', { class: `alert${S.fresh.has(a.id) ? ' fresh' : ''}`, id: `a${a.id}`, style: `--ev:${a.color};--ink:${ink(a.color)}` },
    h('div', { class: 'a-head' },
      h('span', { class: 'ev', text: a.event_full }), h('span', { class: 'lvl', text: level?.label ?? 'Other' }),
      h('span', { class: 'src', text: `${srcName(a.source)}${a.callsign ? ` · ${a.callsign}` : ''}` }),
      h('div', { class: 'when', title: dateFmt.format(a.date) }, h('b', { text: timeFmt.format(a.date) }), h('span', { class: 'rel', 'data-ms': String(a.date), text: rel(a.date) })),
    ),
    h('p', { class: 'msg' }, messageNodes(a)),
    h('div', { class: 'a-foot' }, details, a.recording ? h('button', { type: 'button', onclick: (e) => { if (!panel) details.click(); panel?.querySelector('audio')?.play().catch(() => {}); e.currentTarget.blur(); } }, '▶ Listen') : null, copy),
  );
  return el;
}
function render(keepScroll) {
  const list = $('list'), all = visibleAlerts(), shown = all.slice(0, S.shown), y = scrollY;
  renderStats();
  const frag = document.createDocumentFragment(); let day = '';
  for (const a of shown) { const k = dayKey(a.date); if (k !== day) { day = k; frag.append(h('div', { class: 'day', text: dayLabel(a.date) })); } frag.append(card(a)); }
  list.replaceChildren(frag); S.fresh.clear();
  $('more').hidden = all.length <= S.shown; $('more').textContent = `Show more (${Math.min(CFG.pageSize, all.length - S.shown)} of ${all.length - S.shown} older)`;
  $('count').textContent = all.length === S.alerts.length ? `${all.length.toLocaleString()} alerts` : `${all.length.toLocaleString()} of ${S.alerts.length.toLocaleString()} alerts match`;
  const st = $('state');
  if (!all.length) { st.hidden = false; st.replaceChildren(...(S.alerts.length ? [h('h2', { text: 'No alerts match' }), h('p', { text: 'Try another station, severity or search.' })] : [h('h2', { text: 'No alerts yet' }), h('p', { text: 'When WXM32 or WCGQ-FM airs one, it appears here the moment it is decoded.' })])); } else st.hidden = true;
  if (keepScroll) scrollTo(0, y);
}

// ---- live -----------------------------------------------------------------------------------------------------------
function setLive(on, text) { const el = $('live'); el.className = `live ${on ? 'on' : 'off'}`; $('live-text').textContent = text ?? (on ? 'Live' : 'Offline'); }
function connect() {
  let es; try { es = new EventSource(`${CFG.api}/events`); } catch { return; }
  es.onopen = () => setLive(true);
  es.addEventListener('alert', () => loadNew().catch(() => {}));
  es.onerror = () => setLive(false, 'Reconnecting…');
}
setInterval(() => { if (S.loaded) loadNew().then(() => $('updated').textContent = `Updated ${dateFmt.format(Date.now())}`).catch(() => {}); }, 60_000); // a safety net if the live stream is blocked
setInterval(() => { for (const el of document.querySelectorAll('.rel')) el.textContent = rel(Number(el.dataset.ms)); if (S.alerts[0]) renderStats(); }, 30_000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { S.unread = 0; document.title = `${CFG.title} alerts`; loadNew().catch(() => {}); } });

// ---- start ----------------------------------------------------------------------------------------------------------
function showError(e) {
  const delay = [3, 5, 8, 10, 15, 30][Math.min(S.retry++, 5)];
  setLive(false, 'Offline');
  const st = $('state'); st.hidden = false; $('list').replaceChildren(); $('more').hidden = true; $('count').textContent = '';
  const left = h('span', { text: `${delay}s` });
  st.replaceChildren(h('h2', { text: "Can't reach the alert server" }), h('p', { text: `${e.message}. Retrying in `, }, left), h('button', { class: 'btn', type: 'button', onclick: () => start() }, 'Retry now'));
  let n = delay; const t = setInterval(() => { left.textContent = `${--n}s`; if (n <= 0) { clearInterval(t); start(); } }, 1000);
  st.dataset.timer = String(t);
}
async function start() {
  clearInterval(Number($('state').dataset.timer)); setLive(false, 'Connecting…');
  $('list').replaceChildren(...Array.from({ length: 4 }, () => h('div', { class: 'skeleton' }))); $('state').hidden = true;
  try {
    await loadAll();
    readUrl(); buildControls(); render(); connect(); setLive(true);
    const m = /^#a(\d+)$/.exec(location.hash); // a link to one alert: make sure it is on screen, open it
    if (m && S.byId.has(Number(m[1]))) {
      const idx = visibleAlerts().findIndex((a) => a.id === Number(m[1])); if (idx >= S.shown) { S.shown = idx + 1; render(); }
      const el = $(`a${m[1]}`); if (el) { el.scrollIntoView({ block: 'center' }); el.querySelector('.a-foot button')?.click(); }
    }
  } catch (e) { showError(e); }
}
$('more').addEventListener('click', () => { S.shown += CFG.pageSize; render(true); });
let qt; $('q').addEventListener('input', (e) => { clearTimeout(qt); qt = setTimeout(() => { S.f.q = e.target.value; S.shown = CFG.pageSize; syncUrl(); render(); }, 150); });
$('theme').addEventListener('click', () => { const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = t; try { localStorage.setItem('wxm32-theme', t); } catch { /* private mode */ } });
document.title = `${CFG.title} alerts`;
start();
