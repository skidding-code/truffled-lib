# truffled-lib

a jsdelivr-only game library, laid out like gn-math's `freebuisness/{assets,html,covers}`.

- `zones.json` — catalog (`id`, `name`, `cover`, `url`, optional `altNames`, `special`)
- `html/<id>.html` — one self-contained entry page per game; fetch it and `document.write` it into an iframe (or a new about:blank tab)
- `covers/<id>.*` — thumbnails
- `index.html` — the single-file launcher; download it and open it from `file://`, host it anywhere, or paste it into an about:blank tab
- `loader.html` — a tiny page that fetches the launcher from jsdelivr and writes it in, for hosts where you only want a stub

game files live in this repo's tags (`c0001`, `c0002`, …; covers and oversized pages in `l001`…) and are only ever fetched from `cdn.jsdelivr.net`, e.g. `truffled-lib@c0001/games/...`. each tag is at most 45 MB because jsdelivr only reliably serves a github repo+ref up to 50 MB. `main` holds just the launcher, catalog and html pages, and the `lib` tag points at the same commit. read the library through `@main` (always current). jsdelivr occasionally refuses a `@main` file with "package size exceeded" because the repo as a whole is large; `@lib` serves the same files then (it can lag a release behind). the launcher falls back on its own.

## loading a game yourself

```js
const LIB = "https://cdn.jsdelivr.net/gh/skidding-code/truffled-lib@main";
const zones = await (await fetch(LIB + "/zones.json")).json();
const z = zones.find(z => z.name === "OvO");
const html = await (await fetch(z.url.replace("{HTML_URL}", LIB + "/html"))).text();
const f = document.body.appendChild(document.createElement("iframe"));
f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
```

`url` values starting with `http` are external sites (they need a proxy) and should be opened directly.

## how the html pages work

each page carries a `<base>` pointing at its folder in one of the chunk tags plus a small inline runtime that:

- remaps root-relative, truffled.lol and mirrored third-party urls onto jsdelivr
- re-joins files that were split into `.tzpN` chunks (jsdelivr's per-file limit is 20 MB) for `fetch`, `XMLHttpRequest` and `src` assignments
- wraps cross-origin and blob `Worker`/`SharedWorker` scripts in blob workers that carry the same runtime, and remaps `AudioWorklet` modules
- loads nested `.html` pages (jsdelivr serves html as `text/plain`) by fetching and writing them into their frame

## threaded games (SharedArrayBuffer)

browsers only give a page `SharedArrayBuffer` when it is cross-origin isolated, which takes response headers that jsdelivr doesn't send (it also serves `.html` as `text/plain`). the `coi3` tag works around that on jsdelivr itself:

- `index.xhtml`: jsdelivr serves `.xhtml` as a real page. on the first visit it installs `coi-sw.js`, a service worker on cdn.jsdelivr.net
- `coi-sw.js` then answers `index.xhtml?g=<id>` with that game's page as `text/html`, adding `Document-Isolation-Policy` plus `Cross-Origin-Opener-Policy`/`Cross-Origin-Embedder-Policy`

games tagged `threads` in `zones.json` open in an iframe of `https://cdn.jsdelivr.net/gh/skidding-code/truffled-lib@coi3/index.xhtml?g=<id>` (`allow="cross-origin-isolated"`). `Document-Isolation-Policy` isolates that iframe even when the page around it is a local file or any plain host (chrome). firefox and safari don't support it yet; there the launcher offers the same url in a new tab, where COOP/COEP isolate it. every other game loads like before: its html is fetched and written into an about:blank iframe.
