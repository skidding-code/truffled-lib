# truffled-lib

a jsdelivr-only game library, laid out like gn-math's `freebuisness/{assets,html,covers}`.

- `zones.json` — catalog (`id`, `name`, `cover`, `url`, optional `altNames`, `special`)
- `html/<id>.html` — one self-contained entry page per game; fetch it and `document.write` it into an iframe (or a new about:blank tab)
- `covers/<id>.*` — thumbnails
- `index.html` — single-file launcher; works from any origin, `file://`, or pasted into an about:blank tab

game files live in `skidding-code/truffled-lib-NN` and are only ever fetched from `cdn.jsdelivr.net`.

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

each page carries a `<base>` pointing at its folder in a `truffled-lib-NN` repo plus a small inline runtime that:

- remaps root-relative, truffled.lol and mirrored third-party urls onto jsdelivr
- re-joins files that were split into `.partN` chunks (jsdelivr's per-file limit is 20 MB) for `fetch`, `XMLHttpRequest` and `src` assignments
- wraps cross-origin `Worker`/`SharedWorker` scripts in blob workers
- loads nested `.html` pages (jsdelivr serves html as `text/plain`) by fetching and writing them into their frame
