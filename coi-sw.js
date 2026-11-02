// makes game pages on cdn.jsdelivr.net cross-origin isolated, so SharedArrayBuffer (threads) works.
// jsdelivr sends .html as text/plain and never sends isolation headers. index.xhtml (jsdelivr serves .xhtml as a
// real page) installs this worker once; after that the worker answers navigations to index.xhtml itself:
//   index.xhtml?g=<id>   that game        index.xhtml   the launcher
// as text/html with Document-Isolation-Policy (isolates the page even inside an iframe on a plain page or a
// local file; chrome) plus COOP/COEP (isolates it when it is the whole tab; every browser).
const LIB = [
  'https://cdn.jsdelivr.net/gh/skidding-code/truffled-lib@main/',
  'https://cdn.jsdelivr.net/gh/skidding-code/truffled-lib@lib/',
];
// credentialless keeps third-party no-cors loads working; safari only knows require-corp (jsdelivr sends CORP)
const COEP = /Chrome\/|Firefox\//.test(self.navigator.userAgent) ? 'credentialless' : 'require-corp';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

function isolate(res, type) {
  const h = new Headers(res.headers);
  if (type) h.set('content-type', type);
  h.set('cross-origin-opener-policy', 'same-origin');
  h.set('cross-origin-embedder-policy', COEP);
  h.set('document-isolation-policy', 'isolate-and-credentialless');
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

// lets the launcher around an iframe know when this browser could not isolate the page (no Document-Isolation-Policy)
const TELL = '<script>try{if(!self.crossOriginIsolated&&parent!==self)parent.postMessage({tz:"no-coi"},"*")}catch(e){}</script>';
// appended at the end: the page's first "<head" can be text inside a script (the shim has one in a regex)
async function page(res) {
  if (!res.ok) return res;
  const t = await res.text();
  return new Response(t + TELL, { status: res.status, statusText: res.statusText, headers: res.headers });
}

// main is always current; jsdelivr now and then refuses a main file ("package size exceeded"), the lib tag has it too
async function lib(path) {
  for (const b of LIB) {
    try {
      const r = await fetch(b + path, { cache: 'no-cache' });
      if (r.ok) return r;
    } catch (e) {}
  }
  return new Response('could not load ' + path + ' from jsdelivr, try again in a minute', { status: 502 });
}

self.addEventListener('fetch', e => {
  const r = e.request;
  const scope = self.registration.scope;
  if (r.mode === 'navigate' && r.url.startsWith(scope)) {
    const u = new URL(r.url);
    const name = u.pathname.slice(new URL(scope).pathname.length);
    if (name !== 'index.xhtml' && name !== '') return;
    const g = u.searchParams.get('g') || u.searchParams.get('id');
    const path = g && /^\d+$/.test(g) ? 'html/' + g + '.html' : 'index.html';
    e.respondWith(lib(path).then(page).then(res => isolate(res, 'text/html; charset=utf-8')));
    return;
  }
  // a worker script needs the same embedder policy as the page that starts it
  if (r.destination === 'worker' || r.destination === 'sharedworker') {
    e.respondWith(fetch(r).then(res => (res.type === 'opaque' ? res : isolate(res))));
  }
});
