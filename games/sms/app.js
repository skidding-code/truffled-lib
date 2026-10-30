// Super Mario Sunshine Web: the page around the wasm runtime.
// - checks the browser has what the runtime needs,
// - validates a disc image locally (header only) and copies it into OPFS,
// - starts the runtime (sms.js / sms.wasm) once a valid image is stored, and
//   shows the game alone, fullscreen, while it is played.
// The disc image is only ever read with File.slice in this browser.
'use strict';

const DIR = 'sms';
const GC_MAGIC = 0xC2339F3D;
const FULL_DISC = 1459978240;
const params = new URLSearchParams(location.search);
const game = params.get('module') !== 'runtime';
const audioWanted = params.get('audio') !== '0';
const moviesWanted = params.get('movies') !== '0'; // the game's cutscenes (THP); A skips each
const DISC_URL = 'disc.iso';
const LITE_DISC_URL = 'disc-lite.iso';

const $ = (id) => document.getElementById(id);
const ui = {
  status: $('status'), progress: $('progress'), caps: $('caps'), log: $('log'),
  disc: $('disc'), play: $('play'), remove: $('remove'), canvas: $('canvas'), stage: $('stage'),
  exportSaves: $('export-saves'), importSaves: $('import-saves'), savesFile: $('saves-file'),
  hud: $('hud'), retry: $('retry'),
};

let capsOk = false;
let stored = null;     // metadata of the stored, validated image
let running = false;
let importing = false; // an import or removal is running in this page
let audio = null;      // { ctx, ready }: the game's output (audio-worklet.js)
let mod = null;        // the game's Module, once started
let rendererReady = false;
let gameReady = false;
let loadError = false;

function setStatus(text, cls = 'muted') {
  ui.status.textContent = text;
  ui.status.className = cls;
  if (cls === 'bad') {
    loadError = true;
    document.body.classList.remove('idle');
    if (ui.hud) {
      ui.hud.classList.remove('gone');
      ui.hud.removeAttribute('aria-hidden');
    }
    ui.progress.hidden = true;
  }
  if (ui.retry) ui.retry.hidden = cls !== 'bad';
}

function showProgress(done, total, label = 'Loading') {
  ui.progress.hidden = false;
  if (total > 0) {
    ui.progress.value = done / total;
    setStatus(`${label}… ${Math.min(100, Math.floor(done / total * 100))}%`);
  } else {
    ui.progress.removeAttribute('value');
    setStatus(`${label}…`);
  }
}

function log(line) {
  if (ui.log) {
    ui.log.textContent += line + '\n';
    ui.log.scrollTop = ui.log.scrollHeight;
  }
  console.log('[sms]', line);
  if (game && line.includes('WebGL 2 renderer ready')) {
    rendererReady = true;
  }
  // Renderer creation precedes shader compilation. Wait for actual game frames
  // before removing the loading screen, so a cold start never looks stuck.
  if (game && rendererReady && !gameReady && !loadError && /\[web\].*\b[1-9]\d* game frames/.test(line)) {
    gameReady = true;
    setStatus('Ready', 'ok');
    if (ui.hud) {
      ui.hud.classList.add('gone');
      ui.hud.setAttribute('aria-hidden', 'true');
    }
    ui.progress.hidden = true;
    ui.canvas.focus();
  }
}

function refreshButtons() {
  refreshSaveButtons();
  if (ui.play) {
    ui.play.textContent = running && game ? 'Back to the game' : 'Play';
    ui.play.disabled = running ? !game || viewing() : !(capsOk && stored && !importing);
  }
  if (ui.remove) ui.remove.disabled = !stored || running || importing;
  if (ui.disc) ui.disc.disabled = running || importing;
}

// ---------------------------------------------------------------- capabilities

async function checkCapabilities() {
  const caps = [];
  const add = (name, ok, why) => caps.push({ name, ok, why });
  add('WebAssembly', typeof WebAssembly === 'object');
  add('SharedArrayBuffer (threads)', typeof SharedArrayBuffer === 'function');
  add('Cross-origin isolated', self.crossOriginIsolated === true,
      'reload the page to finish setting up the game');
  const gl = document.createElement('canvas').getContext('webgl2');
  add('WebGL 2', !!gl);
  let opfs = false;
  try { opfs = !!(navigator.storage && await navigator.storage.getDirectory()); } catch (e) { /* no */ }
  add('Origin-private file system', opfs);
  add('Gamepad API', 'getGamepads' in navigator, null, true);

  if (ui.caps) {
    ui.caps.innerHTML = '';
    for (const c of caps) {
      const li = document.createElement('li');
      li.className = c.ok ? 'ok' : 'bad';
      li.textContent = (c.ok ? '✓ ' : '✗ ') + c.name + (!c.ok && c.why ? ` — ${c.why}` : '');
      ui.caps.appendChild(li);
    }
  }
  // The gamepad API is optional; everything else is required.
  capsOk = caps.filter((c) => c.name !== 'Gamepad API').every((c) => c.ok);
  if (!capsOk) {
    const missing = caps.filter((c) => !c.ok && c.name !== 'Gamepad API').map((c) => c.name);
    setStatus(`Cannot load the game: ${missing.join(', ')} unavailable. Try a current Chrome, Edge or Firefox browser.`, 'bad');
  }
  return capsOk;
}

// ------------------------------------------------------------- disc validation

const be32 = (dv, o) => dv.getUint32(o, false);
const le32 = (dv, o) => dv.getUint32(o, true);
const ascii = (bytes) => String.fromCharCode(...bytes).replace(/\0.*$/s, '');

async function readBytes(file, offset, length) {
  return new Uint8Array(await file.slice(offset, offset + length).arrayBuffer());
}

// Reads the disc header the way platform/disc does; throws with a user-facing
// reason when the file is not a supported image.
async function inspectDisc(file) {
  if (file.size < 0x440) throw new Error('the file is too small to be a GameCube disc image');
  const head = await readBytes(file, 0, 16);
  const dv = new DataView(head.buffer);
  const magic4 = ascii(head.subarray(0, 4));
  let headerAt = 0;
  let format = 'ISO/GCM';
  if (magic4 === 'CISO') {
    format = 'CISO';
    const blockSize = le32(dv, 4);
    const map = await readBytes(file, 8, 1);
    if (!blockSize || !map[0]) throw new Error('CISO image without its first block');
    headerAt = 0x8000;
  } else if (magic4 === 'RVZ\x01' || magic4 === 'WIA\x01' || be32(dv, 0) === 0xB10BC001) {
    throw new Error('RVZ, WIA and GCZ images are not supported: convert to .iso in Dolphin (right-click › Convert File…)');
  }
  const h = await readBytes(file, headerAt, 0x440);
  const hv = new DataView(h.buffer);
  if (be32(hv, 0x1C) !== GC_MAGIC) throw new Error('not a GameCube disc image (no disc magic at 0x1C)');
  const id = ascii(h.subarray(0, 6));
  const rev = h[7];
  const title = ascii(h.subarray(0x20, 0x60)).trim();
  if (id !== 'GMSE01') {
    throw new Error(`this is ${title || 'another game'} (${id}); the port needs Super Mario Sunshine, North America (GMSE01)`);
  }
  if (rev !== 0) throw new Error(`this is revision ${rev} of GMSE01; the port needs Rev 0`);
  const fstOff = be32(hv, 0x424), fstSize = be32(hv, 0x428);
  if (format === 'ISO/GCM' && (fstSize < 12 || fstOff + fstSize > file.size)) {
    throw new Error('the image is truncated (its file table lies past the end of the file)');
  }
  return { id, rev, title, format, size: file.size, name: file.name, trimmed: format === 'ISO/GCM' && file.size < FULL_DISC };
}

// --------------------------------------------------------------------- storage
//
// The stored image lives in one of two slots. An import copies into the slot
// not in use, checks the copy, and only then commits it by writing the marker
// (disc.img.json: which slot, its size, the disc's details); the other slot is
// removed after. So a failed or interrupted import never touches the image the
// marker names, and the marker never names a file still being written. Imports
// and removals hold a Web Lock, so two of them (two picks, two tabs) never run
// at once. Images stored before the slots (disc.img, a marker without `file`)
// are still found.

const MARKER = 'disc.img.json';
const SLOTS = ['disc-a.img', 'disc-b.img'];
const LEGACY = 'disc.img';
const LOCK = 'sms-disc-store';

const discPathInWasm = (meta) => `/opfs/${DIR}/${meta.file}`;

async function smsDir(create = false) {
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle(DIR, { create });
}

async function loadStoredMeta() {
  try {
    const dir = await smsDir();
    const meta = JSON.parse(await (await (await dir.getFileHandle(MARKER)).getFile()).text());
    meta.file = meta.file || LEGACY;
    if (meta.file !== LEGACY && !SLOTS.includes(meta.file)) return null;
    const img = await (await dir.getFileHandle(meta.file)).getFile();
    if (img.size !== meta.size) return null; // not what was committed
    // A stale marker or damaged image should trigger a fresh download, rather
    // than making every retry boot the same unusable disc.
    return { ...meta, ...await inspectDisc(img) };
  } catch (e) {
    return null;
  }
}

// One import or removal at a time in this origin. `waiting` runs when another
// tab holds the lock, before waiting for it.
async function withStoreLock(fn, waiting) {
  if (!navigator.locks) return fn();
  return navigator.locks.request(LOCK, { ifAvailable: true }, async (lock) => {
    if (lock) return fn();
    if (waiting) waiting();
    return navigator.locks.request(LOCK, fn);
  });
}

async function removeEntries(names) {
  const dir = await smsDir(true);
  for (const n of names) {
    try {
      await dir.removeEntry(n);
    } catch (e) {
      if (e.name !== 'NotFoundError') throw e;
    }
  }
}

// Writes `data` (a string or bytes) as the file `name` in the OPFS folder
// `path` (folder names from the root). createWritable replaces the file only
// when closed; where it is missing, a worker's sync access handle writes it.
async function writeFileIn(path, name, data) {
  let dir = await navigator.storage.getDirectory();
  for (const d of path) dir = await dir.getDirectoryHandle(d, { create: true });
  const fh = await dir.getFileHandle(name, { create: true });
  if (fh.createWritable) {
    const w = await fh.createWritable();
    await w.write(data);
    await w.close();
    return;
  }
  await new Promise((resolve, reject) => {
    const src = 'onmessage=async e=>{try{let d=await navigator.storage.getDirectory();for(const p of e.data.path)d=await d.getDirectoryHandle(p,{create:true});' +
      'const f=await d.getFileHandle(e.data.name,{create:true});const h=await f.createSyncAccessHandle();h.truncate(0);' +
      'const b=typeof e.data.data==="string"?new TextEncoder().encode(e.data.data):e.data.data;h.write(b,{at:0});h.flush();h.close();postMessage(1)}catch(x){postMessage(String(x))}}';
    const w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    w.onmessage = (e) => { w.terminate(); e.data === 1 ? resolve() : reject(new Error(e.data)); };
    w.postMessage({ path, name, data });
  });
}

// (a torn marker is no valid JSON, so it is never taken for a commit)
const writeMeta = (meta) => writeFileIn([DIR], MARKER, JSON.stringify(meta));

function copyToOpfs(file, name, url = null) {
  return new Promise((resolve, reject) => {
    const w = new Worker('import-worker.js');
    w.onmessage = (e) => {
      const m = e.data;
      if (m.type === 'progress') {
        showProgress(m.done, m.total, file ? 'Preparing' : 'Loading');
      } else if (m.type === 'done') { w.terminate(); resolve(m.size); }
      else { w.terminate(); reject(Object.assign(new Error(m.message), { name: m.name || 'Error' })); }
    };
    w.onerror = (e) => { w.terminate(); reject(new Error(e.message || 'import worker failed')); };
    // window.smsImportTest (regression tests only): failure and delay injection
    w.postMessage({ file, url, dir: DIR, name, test: window.smsImportTest || {} });
  });
}

async function importDisc(file) {
  if (importing) {
    log(`[page] ${file.name} ignored: another import is still running`);
    return;
  }
  importing = true;
  refreshButtons();
  try {
    setStatus(`Checking ${file.name}…`);
    const meta = await inspectDisc(file);
    log(`[page] ${file.name}: ${meta.title} (${meta.id} rev ${meta.rev}, ${meta.format}, ${(meta.size / 1048576).toFixed(1)} MiB)`);
    if (navigator.storage.persist) {
      const persisted = await navigator.storage.persist();
      log(`[page] persistent storage ${persisted ? 'granted' : 'not granted (the browser may evict the image under storage pressure)'}`);
    }
    await withStoreLock(async () => {
      // what is committed now (another tab may have changed it while we waited)
      const current = await loadStoredMeta();
      const target = current && current.file === SLOTS[0] ? SLOTS[1] : SLOTS[0];
      // leftovers of failed imports, and the slot about to be written
      await removeEntries([LEGACY, ...SLOTS].filter((n) => !current || n !== current.file));
      const est = navigator.storage.estimate ? await navigator.storage.estimate() : null;
      if (est && est.quota && est.quota - (est.usage || 0) < meta.size) {
        throw new Error(`not enough browser storage: ${(meta.size / 1048576).toFixed(0)} MiB needed, ` +
          `${((est.quota - (est.usage || 0)) / 1048576).toFixed(0)} MiB available`);
      }
      ui.progress.hidden = false;
      ui.progress.value = 0;
      try {
        await copyToOpfs(file, target);
      } catch (e) {
        await removeEntries([target]).catch(() => {}); // free the space now; nothing names it
        throw e;
      }
      meta.file = target;
      meta.importedAt = new Date().toISOString();
      await writeMeta(meta); // the commit
      stored = meta;
      try {
        await removeEntries([LEGACY, ...SLOTS].filter((n) => n !== target));
      } catch (e) {
        log(`[page] the previous image stays until the next import: ${e.message}`);
      }
    }, () => setStatus('Waiting for an import or removal in another tab to finish…'));
    setStatus(`Ready: ${stored.title} (${stored.id}) is stored in this browser.`, 'ok');
  } catch (e) {
    // whatever is committed: the image stored before, after a failed replacement
    stored = await loadStoredMeta();
    setStatus(`Cannot use ${file.name}: ${e.message}` +
      (stored ? ` The image stored before, ${stored.title} (${stored.id}), is still ready.` : ''), 'bad');
    log(`[page] import failed: ${e.message}`);
  } finally {
    importing = false;
    ui.progress.hidden = true;
    refreshButtons();
  }
}

async function removeDisc() {
  importing = true;
  refreshButtons();
  try {
    // the marker first: a removal cut short never leaves it naming a missing file
    await withStoreLock(() => removeEntries([MARKER, LEGACY, ...SLOTS]),
      () => setStatus('Waiting for an import or removal in another tab to finish…'));
    stored = null;
    setStatus('Stored disc removed.');
  } catch (e) {
    stored = await loadStoredMeta();
    setStatus(`Cannot remove the stored disc: ${e.message}`, 'bad');
  } finally {
    importing = false;
    refreshButtons();
  }
}

// ----------------------------------------------------------------------- saves
//
// The memory card is a folder in OPFS (sms/card-a), kept by platform/card as
// on the desktop: index.txt names the card's files, and each has a .dat (its
// bytes) and a .stat (its CARDStat). Export puts those files in a ZIP, under
// card-a/, so a backup also unzips into the desktop port's card folder.
// Import checks a ZIP's card and replaces this browser's with it, file by
// file through <name>.tmp as platform/card writes them, the index last, so an
// import cut short leaves files the card's own recovery takes. The game reads
// the card when it starts and writes it while it runs, so a running game
// holds CARD_LOCK (also against a second game in another tab), and the card
// is replaced only when no game holds it.

const CARD = 'card-a';
const CARD_LOCK = 'sms-memory-card';
const STAT_SIZE = 108;          // sizeof(CARDStat) as platform/card stores it
const CARD_BYTES = 59 * 8192;   // the emulated card's 59 blocks

async function cardFolder() {
  try {
    return await (await smsDir()).getDirectoryHandle(CARD);
  } catch (e) {
    return null;
  }
}

// The card's files the index names: [{ name, data }], index.txt first. A file
// whose write was cut between its two steps is read from its .tmp, as the
// card does when the game starts.
async function readCard() {
  const dir = await cardFolder();
  if (!dir) return [];
  const read = async (name) => {
    for (const n of [name, name + '.tmp']) {
      try {
        return new Uint8Array(await (await (await dir.getFileHandle(n)).getFile()).arrayBuffer());
      } catch (e) { /* next */ }
    }
    return null;
  };
  const index = await read('index.txt');
  if (!index) return [];
  const files = [{ name: 'index.txt', data: index }];
  for (const n of indexNames(index)) {
    for (const ext of ['.dat', '.stat']) {
      const data = await read(n + ext);
      if (data) files.push({ name: n + ext, data });
    }
  }
  return files;
}

const indexNames = (bytes) => new TextDecoder().decode(bytes).split('\n').map((l) => l.trim()).filter(Boolean);

// A backup's card, checked: [{ name, data }] of index.txt and the files it
// names, from the ZIP's root or one folder. Throws with what is wrong.
function checkCard(entries) {
  const byName = new Map();
  for (const e of entries) {
    const parts = e.name.split('/');
    if (parts.length > 2) continue;
    byName.set(parts[parts.length - 1], e.data);
  }
  const index = byName.get('index.txt');
  if (!index) throw new Error('no memory card in it (no index.txt)');
  const names = indexNames(index);
  if (!names.length) throw new Error('its memory card is empty');
  const files = [{ name: 'index.txt', data: index }];
  let total = 0;
  for (const n of names) {
    if (!/^[\w.\-]{1,64}$/.test(n) || n.startsWith('.')) throw new Error(`a save has a name this card cannot hold (${n})`);
    const dat = byName.get(n + '.dat'), stat = byName.get(n + '.stat');
    if (!dat || !stat) throw new Error(`${n} is missing its ${dat ? '.stat' : '.dat'} file`);
    if (stat.length !== STAT_SIZE) throw new Error(`${n}.stat is not a memory card file's status (${stat.length} bytes)`);
    if (!dat.length || dat.length % 8192) throw new Error(`${n}.dat is not a whole number of card blocks (${dat.length} bytes)`);
    total += dat.length;
    files.push({ name: n + '.dat', data: dat }, { name: n + '.stat', data: stat });
  }
  if (total > CARD_BYTES) throw new Error('its saves do not fit on a memory card');
  return files;
}

function refreshSaveButtons() {
  if (ui.exportSaves) ui.exportSaves.disabled = !capsOk;
  if (ui.importSaves) ui.importSaves.disabled = !capsOk || running || importing;
}

async function exportSaves() {
  try {
    const files = await readCard();
    if (files.length < 2) {
      setStatus('There are no saves in this browser yet.');
      return;
    }
    const blob = SmsZip.write(files.map((f) => ({ name: `${CARD}/${f.name}`, data: f.data })));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sms-saves-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
    const saves = indexNames(files[0].data);
    log(`[page] exported the memory card: ${saves.join(', ')} (${blob.size} bytes)`);
    setStatus(`Saves exported to ${a.download}.`, 'ok');
  } catch (e) {
    setStatus(`Cannot export the saves: ${e.message}`, 'bad');
  }
}

async function replaceCard(files) {
  const dir = await (await smsDir(true)).getDirectoryHandle(CARD, { create: true });
  const put = async (f) => {
    await writeFileIn([DIR, CARD], f.name + '.tmp', f.data);
    const tmp = await dir.getFileHandle(f.name + '.tmp');
    if (tmp.move) {
      await removeIn(dir, f.name);
      await tmp.move(f.name);
    } else { // no move(): written in place
      await writeFileIn([DIR, CARD], f.name, f.data);
      await removeIn(dir, f.name + '.tmp');
    }
  };
  for (const f of files.slice(1)) await put(f);
  await put(files[0]); // the index last
  // what the new card does not name: older saves, leftovers of cut writes
  const keep = new Set(files.map((f) => f.name));
  const stale = [];
  for await (const [name, h] of dir.entries()) if (h.kind === 'file' && !keep.has(name)) stale.push(name);
  for (const name of stale) await removeIn(dir, name);
}

async function removeIn(dir, name) {
  try {
    await dir.removeEntry(name);
  } catch (e) {
    if (e.name !== 'NotFoundError') throw e;
  }
}

async function importSaves(file) {
  if (running) {
    setStatus('Saves can be imported only before Play: reload the page first.', 'bad');
    return;
  }
  importing = true;
  refreshButtons();
  try {
    const files = checkCard(await SmsZip.read(await file.arrayBuffer()));
    const saves = indexNames(files[0].data);
    const current = await readCard();
    if (current.length > 1 && !confirm('Importing replaces the saves in this browser (' +
      indexNames(current[0].data).join(', ') + ') with those in ' + file.name +
      '. Export the ones here first if you want to keep them. Import?')) {
      setStatus('Saves not imported.');
      return;
    }
    const replace = () => replaceCard(files);
    if (navigator.locks) {
      const done = await navigator.locks.request(CARD_LOCK, { ifAvailable: true }, async (lock) => {
        if (!lock) return false;
        await replace();
        return true;
      });
      if (!done) throw new Error('the game is running in another tab; close it first');
    } else {
      await replace();
    }
    log(`[page] imported the memory card from ${file.name}: ${saves.join(', ')}`);
    setStatus(`Saves imported from ${file.name}. They load from file select.`, 'ok');
  } catch (e) {
    setStatus(`Cannot import ${file.name}: ${e.message}. The saves here are unchanged.`, 'bad');
    log(`[page] saves import failed: ${e.message}`);
  } finally {
    importing = false;
    refreshButtons();
  }
}

// Held from Play until the page closes; false when a game in another tab holds it.
function holdCard() {
  if (!navigator.locks) return Promise.resolve(true);
  return new Promise((resolve) => {
    navigator.locks.request(CARD_LOCK, { ifAvailable: true }, (lock) => {
      resolve(!!lock);
      return lock ? new Promise(() => {}) : undefined;
    });
  });
}

// ----------------------------------------------------------------------- audio

// Browsers start audio only from a user gesture: the context is made in the
// Play click, at the game's 32 kHz, and the worklet joins it once the game
// hands over its sample ring (Module.smsAudioStart, from platform/audio/ai.cpp).
function createAudio() {
  if (!game || !audioWanted || typeof AudioWorkletNode !== 'function') return null;
  try {
    const ctx = new AudioContext({ sampleRate: 32000, latencyHint: 'interactive' });
    // Handle failures immediately: the runtime may take a while to request audio.
    const ready = ctx.audioWorklet.addModule('audio-worklet.js').then(() => true, (e) => {
      log(`[page] no audio: ${e.message}`);
      return false;
    });
    return { ctx, ready };
  } catch (e) {
    log(`[page] no audio: ${e.message}`);
    return null;
  }
}

function startGameAudio(ring) {
  if (!audio) return false;
  audio.ready.then((ready) => {
    if (!ready) return;
    const node = new AudioWorkletNode(audio.ctx, 'sms-audio', {
      numberOfInputs: 0, outputChannelCount: [2], processorOptions: ring });
    node.connect(audio.ctx.destination);
    audio.node = node;
    return audio.ctx.resume();
  }).then(() => log(`[page] audio: ${audio.ctx.state}, ${audio.ctx.sampleRate} Hz` +
    (audio.ctx.state === 'running' ? '' : ' (click the picture to start it)')))
    .catch((e) => log(`[page] audio failed: ${e.message}`));
  return true;
}

// -------------------------------------------------------------- the game view
//
// Playing shows the game alone: #stage, which holds only the canvas, covers the
// page (body.playing hides the rest) and is made fullscreen. Browsers allow
// fullscreen only from a user gesture, so it is asked for in the Play click
// itself, before anything is awaited. Leaving fullscreen (Escape) returns to
// the page with the game still running; Play goes back. Where fullscreen is
// refused (an iframe without allowfullscreen, a browser setting) the stage
// still fills the window, and Escape returns from that too.
//
// The canvas's size in device pixels goes to the game (smsSetDisplaySize,
// platform/gx/src/gx_platform.cpp). SMS_ASPECT stretches the rendered picture
// to fill it. Measure the stage so SDL's canvas styles cannot feed back into
// the requested display size.

const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;
const viewing = () => document.body.classList.contains('playing');

function enterGameView() {
  document.body.classList.add('playing');
  refreshButtons();
  ui.canvas.focus();
  noteActivity();
  const el = ui.stage;
  const request = el.requestFullscreen || el.webkitRequestFullscreen;
  if (fullscreenElement() === el) return;
  if (!request || !navigator.userActivation?.isActive || document.fullscreenEnabled === false || document.webkitFullscreenEnabled === false) return;
  try {
    const p = request.call(el, { navigationUI: 'hide' });
    if (p && p.then) p.then(() => ui.canvas.focus(), () => {});
  } catch (e) { /* fullscreen not available */ }
}

function leaveGameView() {
  document.body.classList.remove('playing');
  document.body.classList.remove('idle');
  if (ui.hud) ui.hud.classList.remove('gone');
}

// the pointer hides over the game after two seconds without moving
let idleTimer = 0;
function noteActivity() {
  document.body.classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (viewing()) document.body.classList.add('idle'); }, 2000);
}
ui.stage.addEventListener('pointermove', noteActivity);

let displaySize = null; // [w, h] in device pixels
function sendDisplaySize() {
  if (displaySize && mod && mod.smsSetDisplaySize) mod.smsSetDisplaySize(displaySize[0], displaySize[1]);
}
if (typeof ResizeObserver === 'function') {
  const ro = new ResizeObserver((entries) => {
    const e = entries[entries.length - 1];
    const dp = e.devicePixelContentBoxSize && e.devicePixelContentBoxSize[0];
    const dpr = window.devicePixelRatio || 1;
    const w = dp ? dp.inlineSize : Math.round(e.contentRect.width * dpr);
    const h = dp ? dp.blockSize : Math.round(e.contentRect.height * dpr);
    if (w < 16 || h < 16) return; // hidden
    displaySize = [Math.min(w, 4096), Math.min(h, 4096)];
    sendDisplaySize();
  });
  try {
    ro.observe(ui.stage, { box: 'device-pixel-content-box' });
  } catch (e) {
    ro.observe(ui.stage);
  }
}

// -------------------------------------------------------------------- gamepads
//
// The game reads the browser's gamepads through SDL (buttons, sticks); this
// adds what SDL's browser joystick leaves out, once an animation frame: the
// pressure of a standard gamepad's L and R (a light R sprays FLUDD on the
// move), and rumble, played on that gamepad where the browser can. Both pass
// through words in the game's memory (platform/gx/src/gx_platform.cpp). The
// first connected gamepad with the standard layout is the one used.

let padName = null, rumbleSent = 0, rumbleAt = 0;

function gamepadFrame(now) {
  const pads = navigator.getGamepads ? [...navigator.getGamepads()] : [];
  const pad = pads.find((g) => g && g.connected && g.mapping === 'standard') || null;
  if ((pad ? pad.id : null) !== padName) {
    padName = pad ? pad.id : null;
    log(pad ? `[page] gamepad: ${pad.id}` : '[page] no gamepad');
  }
  if (mod && mod.smsSetGamepad) {
    const pressure = (b) => Math.round(Math.max(0, Math.min(1, b ? b.value : 0)) * 32767);
    mod.smsSetGamepad(!!pad, pad ? pressure(pad.buttons[6]) : 0, pad ? pressure(pad.buttons[7]) : 0);
    const strength = mod.smsGamepadRumble();
    const motor = pad && pad.vibrationActuator;
    // as on the desktop: sent on a change, and again each second while on
    if (motor && (strength !== rumbleSent || (strength && now - rumbleAt > 1000))) {
      const done = strength
        ? motor.playEffect('dual-rumble', { duration: 2000, strongMagnitude: strength / 65535, weakMagnitude: strength / 65535 })
        : motor.reset && motor.reset();
      if (done && done.catch) done.catch(() => {});
      rumbleSent = strength;
      rumbleAt = now;
    }
  }
  requestAnimationFrame(gamepadFrame);
}

// --------------------------------------------------------------------- runtime

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('the game files could not be loaded. Check your connection and try again.'));
    document.head.appendChild(s);
  });
}

async function play() {
  if (running) { // back to the game
    enterGameView();
    if (audio && audio.ctx.state !== 'running') audio.ctx.resume();
    return;
  }
  running = true;
  loadError = false;
  rendererReady = false;
  gameReady = false;
  audio = createAudio();  // before any await: needs the click
  if (game) enterGameView(); // so does fullscreen
  refreshButtons();
  ui.progress.hidden = false;
  ui.progress.removeAttribute('value');
  setStatus('Loading…');
  try {
    if (game && !(await holdCard())) throw new Error('the game is already running in another tab of this browser');
    // The game is the default; ?module=runtime runs the small diagnostic build.
    await loadScript(game ? 'sms-game.js' : 'sms.js');
    const disc = discPathInWasm(stored);
    mod = {
      // window.smsDebugEnv (tests) adds or overrides SMS_* options.
      smsEnv: game ? Object.assign({ SMS_DISC_IMAGE: disc, SMS_ASPECT: 'stretch' }, audioWanted ? {} : { SMS_AUDIO: '0' },
        moviesWanted && !stored.lite ? {} : { SMS_SKIP_MOVIES: '1' },
        window.smsDebugEnv || {}) : {},
      smsAudioStart: startGameAudio,
      canvas: ui.canvas,
      arguments: [disc],
      print: (t) => log(t),
      printErr: (t) => log(t),
      onRuntimeCheck: (rc) => {
        setStatus(rc === 0 ? 'Runtime check passed: wasm, threads, OPFS disc access and WebGL 2 all work. ' +
          'Reload without ?module=runtime to play the game.'
          : `Runtime check failed (code ${rc}); see the log.`, rc === 0 ? 'ok' : 'bad');
      },
      onAbort: (what) => { leaveGameView(); setStatus(`The game stopped: ${what}`, 'bad'); },
      smsDisplayReady: () => sendDisplaySize(),
    };
    await createSmsModule(mod);
    if (game) requestAnimationFrame(gamepadFrame);
  } catch (e) {
    running = false;
    leaveGameView();
    setStatus(`Cannot start: ${e.message}`, 'bad');
    refreshButtons();
  }
}

// ------------------------------------------------------------------------ boot

// A trap or a failed call on this thread stops the game without a word in the
// status line otherwise (the workers wait on it forever).
window.addEventListener('error', (e) => {
  if (!running) return;
  leaveGameView(); // so the message is seen
  setStatus(`The game stopped: ${e.message}`, 'bad');
});
window.addEventListener('unhandledrejection', (e) => {
  leaveGameView();
  setStatus(`Cannot load the game: ${e.reason?.message || e.reason || 'Please try again.'}`, 'bad');
});

if (ui.retry) ui.retry.addEventListener('click', () => location.reload());
if (ui.disc) ui.disc.addEventListener('change', () => {
  const f = ui.disc.files && ui.disc.files[0];
  ui.disc.value = '';
  if (f) importDisc(f);
});
if (ui.remove) ui.remove.addEventListener('click', removeDisc);
if (ui.exportSaves) ui.exportSaves.addEventListener('click', exportSaves);
if (ui.importSaves) ui.importSaves.addEventListener('click', () => ui.savesFile.click());
if (ui.savesFile) ui.savesFile.addEventListener('change', () => {
  const f = ui.savesFile.files && ui.savesFile.files[0];
  ui.savesFile.value = '';
  if (f) importSaves(f);
});
if (ui.play) ui.play.addEventListener('click', play);
ui.canvas.addEventListener('click', () => {
  ui.canvas.focus();
  if (audio && audio.ctx.state !== 'running') audio.ctx.resume();
});
ui.canvas.addEventListener('keydown', (event) => {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
});

async function autoFetchDisc() {
  showProgress(0, 0);
  importing = true;
  refreshButtons();
  try {
    await withStoreLock(async () => {
      // Another tab may have finished downloading while this one waited.
      stored = await loadStoredMeta();
      if (stored) return;
      const target = SLOTS[0];
      await removeEntries([LEGACY, ...SLOTS]);
      try {
        // Stream directly to browser storage. Building a 1+ GB Blob here used
        // to keep the entire download in RAM, then copy all of it a second time.
        let lite = !moviesWanted;
        try {
          await copyToOpfs(null, target, new URL(lite ? LITE_DISC_URL : DISC_URL, location.href).href);
        } catch (e) {
          if (lite || !['QuotaExceededError', 'NotFoundError'].includes(e.name)) throw e;
          await removeEntries([target]);
          lite = true;
          log(`[page] ${e.name === 'QuotaExceededError' ? 'storage is limited' : 'the full disc is unavailable'}; loading the smaller disc with movie cutscenes skipped`);
          showProgress(0, 0);
          await copyToOpfs(null, target, new URL(LITE_DISC_URL, location.href).href);
        }
        ui.progress.removeAttribute('value');
        setStatus('Loading…');
        const dir = await smsDir();
        const file = await (await dir.getFileHandle(target)).getFile();
        const meta = await inspectDisc(file);
        meta.file = target;
        meta.lite = lite;
        meta.importedAt = new Date().toISOString();
        await writeMeta(meta);
        stored = meta;
      } catch (e) {
        await removeEntries([target]).catch(() => {});
        throw e;
      }
    }, () => setStatus('Waiting for the game to finish loading in another tab…'));
  } catch (e) {
    setStatus(`Cannot load the game: ${e.message}`, 'bad');
    log(`[page] auto-fetch failed: ${e.message}`);
  } finally {
    importing = false;
    refreshButtons();
  }
}

(async () => {
  await window.smsIsolation;
  const ok = await checkCapabilities();
  if (!ok) return;
  stored = await loadStoredMeta();
  if (!stored) await autoFetchDisc();
  if (stored) {
    await play();
  }
})().catch((e) => setStatus(`Cannot load the game: ${e.message}`, 'bad'));
