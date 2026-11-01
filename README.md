# truffled-lib

a jsdelivr-only game library, laid out like gn-math's `freebuisness/{assets,html,covers}`.

- `zones.json` — catalog (`id`, `name`, `cover`, `url`, optional `altNames`, `special`)
- `html/<id>.html` — one self-contained entry page per game; fetch it and `document.write` it into an iframe (or a new about:blank tab)
- `covers/<id>.*` — thumbnails
- `index.html` — the single-file launcher; download it and open it from `file://`, host it anywhere, or paste it into an about:blank tab
- `loader.html` — a tiny page that fetches the launcher from jsdelivr and writes it in, for hosts where you only want a stub

game files live in this repo's tags (`c0001`, `c0002`, …; covers and oversized pages in `l001`…) and are only ever fetched from `cdn.jsdelivr.net`, e.g. `truffled-lib@c0001/games/...`. each tag is at most 45 MB because jsdelivr only reliably serves a github repo+ref up to 50 MB. `main` holds just the launcher, catalog and html pages, and the `lib` tag points at the same commit. read the library through `@lib`: jsdelivr serves a tag from its own small tarball, while `@main` files are occasionally refused with "package size exceeded" because the repo as a whole is large. the launcher falls back to `@main` on its own.

## loading a game yourself

```js
const LIB = "https://cdn.jsdelivr.net/gh/skidding-code/truffled-lib@lib";
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

## threaded games (removed)

games that need threads use SharedArrayBuffer (pthreads / threaded engines). browsers only allow that on cross-origin isolated pages, so they can't run from a plain file, s3 or about:blank launcher — the same limit gn-math has. threaded games were dropped from the catalog. `coi-serviceworker.js` is kept for anyone who re-adds one: host `index.html` next to `coi-serviceworker.js` on any https static host (github pages, cloudflare pages, ...): the launcher registers it once and reloads isolated. serving the launcher with `Cross-Origin-Opener-Policy: same-origin` + `Cross-Origin-Embedder-Policy: credentialless` works too.
