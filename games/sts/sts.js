(function () {
const STS = {};
self.STS = STS;
const params = new URLSearchParams(location.search);
STS.debug = params.has('debug');
STS.fpsLimit = +(params.get('fps') || 0);
STS.pix = self.STSPix;
const canvas = document.getElementById('game');
const loader = document.getElementById('loader');
const bar = document.getElementById('bar');
const note = document.getElementById('note');
const logs = [];

STS.log = (l, s) => {
  if (l >= 3) console.error(s);
  else if (l === 2) console.warn(s);
  else console.log(s);
  if (STS.debug) logs.push(s);
};

STS.fatal = (s) => {
  console.error(s);
  loader.style.display = 'flex';
  note.textContent = 'Error: ' + s;
};

STS.exit = () => {
  flushFs();
};

function status(t, frac) {
  note.textContent = t;
  if (frac !== undefined) bar.style.width = Math.round(Math.max(0, Math.min(1, frac)) * 100) + '%';
}

let W = 1280, H = 720;
function pickSize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr);
  const res = params.get('res');
  if (res) {
    const m = res.split('x');
    w = +m[0];
    h = +m[1];
  }
  let a = w / h;
  if (a < 1.334) h = Math.round(w / 1.334);
  if (a > 2.33) w = Math.round(h * 2.33);
  const maxW = +(params.get('maxw') || 1920);
  if (w > maxW) {
    h = Math.round(h * maxW / w);
    w = maxW;
  }
  W = Math.max(800, w & ~1);
  H = Math.max(450, h & ~1);
  canvas.width = W;
  canvas.height = H;
}

function layout() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  const cw = Math.round(W * s), ch = Math.round(H * s);
  canvas.style.width = cw + 'px';
  canvas.style.height = ch + 'px';
  canvas.style.left = Math.round((innerWidth - cw) / 2) + 'px';
  canvas.style.top = Math.round((innerHeight - ch) / 2) + 'px';
}

STS.width = () => W;
STS.height = () => H;
STS.cursor = (c) => {
  canvas.style.cursor = c;
};
STS.fullscreen = (f) => {
  if (f && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
  else if (!f && document.fullscreenElement) document.exitFullscreen().catch(() => {});
};
STS.clipboard = '';
STS.setClipboard = (s) => {
  STS.clipboard = s;
  if (navigator.clipboard) navigator.clipboard.writeText(s).catch(() => {});
};
STS.prompt = (title, text, cb) => {
  setTimeout(() => {
    const v = window.prompt(title, text);
    cb(v);
  }, 0);
};

let lastFrame = 0;
let firstFrame = true;
STS.requestFrame = (cap, cb) => {
  if (firstFrame) {
    firstFrame = false;
    loader.style.display = 'none';
    canvas.style.visibility = 'visible';
  }
  const tick = (t) => {
    if (cap > 0 && t - lastFrame < 1000 / cap - 2) {
      requestAnimationFrame(tick);
      return;
    }
    lastFrame = t;
    if (STS.debug) {
      const e = G.ctx().getError();
      if (e) STS.glErrors = (STS.glErrors || 0) + 1, STS.lastGlError = e;
    }
    cb(t);
  };
  requestAnimationFrame(tick);
};

const KEYS = {
  Digit0: 7, Digit1: 8, Digit2: 9, Digit3: 10, Digit4: 11, Digit5: 12, Digit6: 13, Digit7: 14, Digit8: 15, Digit9: 16,
  KeyA: 29, KeyB: 30, KeyC: 31, KeyD: 32, KeyE: 33, KeyF: 34, KeyG: 35, KeyH: 36, KeyI: 37, KeyJ: 38, KeyK: 39, KeyL: 40,
  KeyM: 41, KeyN: 42, KeyO: 43, KeyP: 44, KeyQ: 45, KeyR: 46, KeyS: 47, KeyT: 48, KeyU: 49, KeyV: 50, KeyW: 51, KeyX: 52,
  KeyY: 53, KeyZ: 54, Comma: 55, Period: 56, AltLeft: 57, AltRight: 58, ShiftLeft: 59, ShiftRight: 60, Tab: 61, Space: 62,
  Enter: 66, NumpadEnter: 66, Backspace: 67, Backquote: 68, Minus: 69, Equal: 70, BracketLeft: 71, BracketRight: 72,
  Backslash: 73, Semicolon: 74, Quote: 75, Slash: 76, MetaLeft: 63, MetaRight: 63, ControlLeft: 129, ControlRight: 130,
  Escape: 131, End: 132, Insert: 133, PageUp: 92, PageDown: 93, Home: 3, Delete: 112, ArrowUp: 19, ArrowDown: 20,
  ArrowLeft: 21, ArrowRight: 22, F1: 244, F2: 245, F3: 246, F4: 247, F5: 248, F6: 249, F7: 250, F8: 251, F9: 252, F10: 253,
  F11: 254, F12: 255, Numpad0: 144, Numpad1: 145, Numpad2: 146, Numpad3: 147, Numpad4: 148, Numpad5: 149, Numpad6: 150,
  Numpad7: 151, Numpad8: 152, Numpad9: 153, NumpadAdd: 81, NumpadSubtract: 69, NumpadMultiply: 17, NumpadDivide: 76,
  NumpadDecimal: 56
};
const events = [];
function push(a, b, c, d) {
  events.push(a, b, c, d);
}
const noEvents = new Int32Array(0);
STS.inputPoll = () => {
  if (!events.length) return noEvents;
  const out = new Int32Array(events);
  events.length = 0;
  return out;
};
STS.setMouse = () => {};

function pos(e) {
  const r = canvas.getBoundingClientRect();
  return [Math.round((e.clientX - r.left) * W / r.width), Math.round((e.clientY - r.top) * H / r.height)];
}

function gesture() {
  Audio.unlock();
}

function installInput() {
  addEventListener('keydown', (e) => {
    gesture();
    const k = KEYS[e.code] || 0;
    if (e.code === 'F11' || e.code === 'F12' || (e.ctrlKey && (e.code === 'KeyR' || e.code === 'KeyV' || e.code === 'KeyC'))) {
      if (e.code === 'KeyV') return;
    } else {
      e.preventDefault();
    }
    if (!e.repeat) push(1, k, 0, 0);
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) push(3, e.key.charCodeAt(0), 0, 0);
    else if (e.code === 'Backspace') push(3, 8, 0, 0);
    else if (e.code === 'Enter' || e.code === 'NumpadEnter') push(3, 13, 0, 0);
    else if (e.code === 'Tab') push(3, 9, 0, 0);
    else if (e.code === 'Delete') push(3, 127, 0, 0);
  });
  addEventListener('keyup', (e) => {
    const k = KEYS[e.code] || 0;
    push(2, k, 0, 0);
  });
  addEventListener('paste', (e) => {
    const t = e.clipboardData && e.clipboardData.getData('text');
    if (t) {
      STS.clipboard = t;
      for (const ch of t) push(3, ch.charCodeAt(0), 0, 0);
    }
  });
  const btn = (b) => (b === 1 ? 2 : b === 2 ? 1 : b);
  canvas.addEventListener('mousedown', (e) => {
    gesture();
    const [x, y] = pos(e);
    push(4, x, y, btn(e.button));
    e.preventDefault();
  });
  addEventListener('mouseup', (e) => {
    const [x, y] = pos(e);
    push(5, x, y, btn(e.button));
  });
  addEventListener('mousemove', (e) => {
    const [x, y] = pos(e);
    push(6, x, y, 0);
  });
  canvas.addEventListener('wheel', (e) => {
    push(7, e.deltaY > 0 ? 1 : -1, 0, 0);
    e.preventDefault();
  }, {passive: false});
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  let touchId = null;
  canvas.addEventListener('touchstart', (e) => {
    gesture();
    const t = e.changedTouches[0];
    if (touchId === null) {
      touchId = t.identifier;
      const [x, y] = pos(t);
      push(6, x, y, 0);
      push(4, x, y, 0);
    }
    e.preventDefault();
  }, {passive: false});
  canvas.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        const [x, y] = pos(t);
        push(6, x, y, 0);
      }
    }
    e.preventDefault();
  }, {passive: false});
  const end = (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchId) {
        const [x, y] = pos(t);
        push(5, x, y, 0);
        touchId = null;
      }
    }
    e.preventDefault();
  };
  canvas.addEventListener('touchend', end, {passive: false});
  canvas.addEventListener('touchcancel', end, {passive: false});
  addEventListener('blur', () => push(8, 0, 0, 0));
  addEventListener('resize', layout);
}

let manifest = null;
const dirs = new Map();
const cache = new Map();
const base = 'assets/';
let syncFetches = 0;
let syncBytes = 0;
const accessed = new Set();

function norm(p) {
  p = p.replace(/\\/g, '/');
  while (p.startsWith('./')) p = p.substring(2);
  while (p.startsWith('/')) p = p.substring(1);
  if (p.indexOf('//') >= 0) p = p.replace(/\/+/g, '/');
  if (p.endsWith('/')) p = p.substring(0, p.length - 1);
  if (p.indexOf('/./') >= 0 || p.indexOf('..') >= 0) {
    const out = [];
    for (const s of p.split('/')) {
      if (s === '.' || s === '') continue;
      if (s === '..') out.pop();
      else out.push(s);
    }
    p = out.join('/');
  }
  return p;
}

function indexManifest() {
  dirs.set('', new Set());
  for (const p of Object.keys(manifest.files)) {
    let child = p;
    let i = p.lastIndexOf('/');
    while (true) {
      const parent = i < 0 ? '' : p.substring(0, i);
      let set = dirs.get(parent);
      const name = child.substring(i + 1);
      if (!set) {
        set = new Set();
        dirs.set(parent, set);
      }
      if (set.has(name)) break;
      set.add(name);
      if (i < 0) break;
      child = parent;
      i = parent.lastIndexOf('/');
    }
  }
}

STS.assetSize = (p) => {
  const e = manifest.files[norm(p)];
  return e === undefined ? -1 : e[0];
};
STS.assetIsDir = (p) => dirs.has(norm(p));
STS.assetList = (p) => {
  const s = dirs.get(norm(p));
  return s ? Array.from(s) : [];
};

function url(p) {
  const e = manifest.files[p];
  return base + p + (e && e[1] ? '?v=' + e[1] : '');
}

function syncGet(p) {
  const x = new XMLHttpRequest();
  x.open('GET', url(p), false);
  x.overrideMimeType('text/plain; charset=x-user-defined');
  x.send();
  if (x.status !== 200 && x.status !== 0) return null;
  const s = x.responseText;
  const n = s.length;
  const u = new Uint8Array(n);
  for (let i = 0; i < n; i++) u[i] = s.charCodeAt(i) & 255;
  syncFetches++;
  syncBytes += n;
  if (STS.debug) console.log('sync fetch', p, n);
  return u;
}

STS.assetBytes = (p) => {
  p = norm(p);
  if (manifest.files[p] === undefined) return null;
  accessed.add(p);
  let u = cache.get(p);
  if (!u) {
    u = syncGet(p);
    if (!u) return null;
    if (u.length < 65536) cache.set(p, u);
  } else if (u.length >= 65536) {
    cache.delete(p);
  }
  return new Int8Array(u);
};
STS.accessed = () => Array.from(accessed);
STS.stats = () => ({syncFetches, syncBytes, cached: cache.size, bitmaps: bitmaps.size, glErrors: STS.glErrors || 0, lastGlError: STS.lastGlError || 0, draws: G.draws});

const bitmaps = new Map();
STS.imgTake = (p) => {
  p = norm(p);
  const b = bitmaps.get(p);
  if (!b) return null;
  bitmaps.delete(p);
  accessed.add(p);
  return b;
};
let readCanvas = null;
STS.imgRead = (img, dst, w, h) => {
  if (!readCanvas) readCanvas = new OffscreenCanvas(w, h);
  if (readCanvas.width < w || readCanvas.height < h) {
    readCanvas.width = Math.max(readCanvas.width, w);
    readCanvas.height = Math.max(readCanvas.height, h);
  }
  const ctx = readCanvas.getContext('2d', {willReadFrequently: true});
  ctx.globalCompositeOperation = 'copy';
  ctx.drawImage(img, 0, 0);
  dst.set(ctx.getImageData(0, 0, w, h).data);
};
STS.imgDecode = (data, off, len, dims) => {
  const N = self.STSN;
  const src = N._malloc(len);
  N.HEAPU8.set(new Uint8Array(data.buffer, data.byteOffset + off, len), src);
  const out = N._malloc(12);
  const px = N._img_decode(src, len, out);
  N._free(src);
  const w = N.HEAP32[out >> 2], h = N.HEAP32[(out >> 2) + 1], c = N.HEAP32[(out >> 2) + 2];
  N._free(out);
  if (!px) {
    console.error('stb decode failed', len, Array.from(new Uint8Array(data.buffer, data.byteOffset + off, 8)));
    return null;
  }
  dims[0] = w;
  dims[1] = h;
  dims[2] = c;
  const rgba = N.HEAPU8.slice(px, px + w * h * 4);
  N._img_free(px);
  return rgba;
};

async function decodeBitmap(p, bytes) {
  const type = p.endsWith('.jpg') || p.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  try {
    const bmp = await createImageBitmap(new Blob([bytes], {type}), {premultiplyAlpha: 'none', colorSpaceConversion: 'none'});
    bitmaps.set(p, bmp);
    if (bytes.length >= 65536) cache.delete(p);
  } catch (e) {
    console.warn('bitmap decode failed', p, e);
  }
}

async function loadPack(name, weight, done, total) {
  const r = await fetch(name);
  if (!r.ok) return;
  const len = +r.headers.get('content-length') || 0;
  const reader = r.body.getReader();
  const chunks = [];
  let got = 0;
  while (true) {
    const {done: d, value} = await reader.read();
    if (d) break;
    chunks.push(value);
    got += value.length;
    if (len) status('Downloading game data', (done + weight * Math.min(1, got / len)) / total);
  }
  const buf = new Uint8Array(got);
  let o = 0;
  for (const c of chunks) {
    buf.set(c, o);
    o += c.length;
  }
  const dv = new DataView(buf.buffer);
  const hlen = dv.getUint32(0, true);
  const index = JSON.parse(new TextDecoder().decode(buf.subarray(4, 4 + hlen)));
  let off = 4 + hlen;
  const decodes = [];
  for (const [p, n] of index) {
    const u = buf.subarray(off, off + n);
    off += n;
    cache.set(p, u);
    if (/\.(png|jpg)$/.test(p)) decodes.push([p, u]);
  }
  let k = 0;
  const workers = [];
  for (let i = 0; i < 8; i++) {
    workers.push((async () => {
      while (k < decodes.length) {
        const [p, u] = decodes[k++];
        await decodeBitmap(p, u);
      }
    })());
  }
  await Promise.all(workers);
}

let db = null;
const fsPaths = [], fsDatas = [];
const pending = new Map();
let flushTimer = 0;

function openDb() {
  return new Promise((res) => {
    let req;
    try {
      req = indexedDB.open('sts-save', 1);
    } catch (e) {
      res(null);
      return;
    }
    req.onupgradeneeded = () => req.result.createObjectStore('files');
    req.onsuccess = () => res(req.result);
    req.onerror = () => res(null);
  });
}

async function loadFs() {
  db = await openDb();
  if (!db) return;
  await new Promise((res) => {
    const tx = db.transaction('files', 'readonly');
    const st = tx.objectStore('files');
    const req = st.openCursor();
    req.onsuccess = () => {
      const c = req.result;
      if (c) {
        fsPaths.push(c.key);
        fsDatas.push(c.value);
        c.continue();
      } else res();
    };
    req.onerror = () => res();
  });
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
}

function flushFs() {
  clearTimeout(flushTimer);
  flushTimer = 0;
  if (!db || !pending.size) return;
  const tx = db.transaction('files', 'readwrite');
  const st = tx.objectStore('files');
  for (const [p, d] of pending) {
    if (d === null) st.delete(p);
    else st.put(d, p);
  }
  pending.clear();
}

STS.fsCount = () => fsPaths.length;
STS.fsPath = (i) => fsPaths[i];
STS.fsData = (i) => {
  const u = fsDatas[i];
  return new Int8Array(u.buffer, u.byteOffset, u.byteLength);
};
STS.fsPut = (p, d) => {
  pending.set(p, new Uint8Array(d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength)));
  if (!flushTimer) flushTimer = setTimeout(flushFs, 250);
};
STS.fsDel = (p) => {
  pending.set(p, null);
  if (!flushTimer) flushTimer = setTimeout(flushFs, 250);
};
addEventListener('pagehide', flushFs);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) flushFs();
});

const Audio = {};
let actx = null;
let master = null;
const sounds = [null];
const music = [null];
let instSeq = 1;
let unlocked = false;
let decodedBytes = 0;
const DECODE_LIMIT = 96 * 1024 * 1024;

function ac() {
  if (!actx) {
    const C = self.AudioContext || self.webkitAudioContext;
    actx = new C({latencyHint: 'interactive'});
    master = actx.createGain();
    master.connect(actx.destination);
  }
  return actx;
}

Audio.unlock = () => {
  if (unlocked) return;
  unlocked = true;
  ac().resume().catch(() => {});
  for (const m of music) if (m && m.wantPlay) m.el.play().catch(() => {});
};

function fetchBytes(p) {
  const c = cache.get(p);
  if (c) return Promise.resolve(c);
  return fetch(url(p)).then((r) => r.arrayBuffer()).then((b) => new Uint8Array(b));
}

function evict() {
  if (decodedBytes <= DECODE_LIMIT) return;
  const list = sounds.filter((s) => s && s.buffer && s.insts.size === 0).sort((a, b) => a.used - b.used);
  for (const s of list) {
    if (decodedBytes <= DECODE_LIMIT * 0.75) break;
    decodedBytes -= s.size;
    s.buffer = null;
    s.decoding = null;
  }
}

function decodeSound(s) {
  if (s.buffer) return Promise.resolve(s.buffer);
  if (!s.decoding) {
    s.decoding = fetchBytes(s.path).then((u) => ac().decodeAudioData(u.slice().buffer)).then((b) => {
      s.buffer = b;
      s.size = b.length * b.numberOfChannels * 4;
      decodedBytes += s.size;
      evict();
      return b;
    }).catch((e) => {
      console.warn('sound decode failed', s.path, e);
      s.decoding = null;
      return null;
    });
  }
  return s.decoding;
}

STS.sndLoad = (p) => {
  p = norm(p);
  accessed.add(p);
  return sounds.push({path: p, buffer: null, decoding: null, insts: new Map(), used: 0, size: 0}) - 1;
};

function startInst(s, inst) {
  if (inst.stopped || !s.buffer) return;
  const ctx = ac();
  const src = ctx.createBufferSource();
  src.buffer = s.buffer;
  src.loop = inst.loop;
  src.playbackRate.value = inst.pitch;
  const g = ctx.createGain();
  g.gain.value = inst.vol;
  let node = src;
  if (inst.pan !== 0 && ctx.createStereoPanner) {
    const pn = ctx.createStereoPanner();
    pn.pan.value = inst.pan;
    src.connect(pn);
    node = pn;
    inst.panner = pn;
  }
  node.connect(g);
  g.connect(master);
  src.onended = () => {
    if (!inst.paused) s.insts.delete(inst.id);
  };
  inst.src = src;
  inst.gain = g;
  inst.started = ctx.currentTime;
  src.start(0, inst.offset || 0);
}

STS.sndPlay = (id, vol, pitch, pan, loop) => {
  const s = sounds[id];
  if (!s) return -1;
  s.used = performance.now();
  const inst = {id: instSeq++, vol, pitch, pan, loop, src: null, gain: null, stopped: false, paused: false, offset: 0};
  s.insts.set(inst.id, inst);
  if (s.buffer) startInst(s, inst);
  else {
    const t0 = performance.now();
    decodeSound(s).then(() => {
      if (loop || performance.now() - t0 < 400) startInst(s, inst);
      else s.insts.delete(inst.id);
    });
  }
  return inst.id;
};

function instOp(s, inst, op, a, b) {
  switch (op) {
    case 0:
      inst.stopped = true;
      if (inst.src) try {
        inst.src.stop();
      } catch (e) {}
      s.insts.delete(inst.id);
      break;
    case 1:
      if (inst.src && !inst.paused) {
        inst.paused = true;
        inst.offset = (ac().currentTime - inst.started) * inst.pitch;
        try {
          inst.src.stop();
        } catch (e) {}
      }
      break;
    case 2:
      if (inst.paused) {
        inst.paused = false;
        startInst(s, inst);
      }
      break;
    case 3:
      inst.loop = a !== 0;
      if (inst.src) inst.src.loop = inst.loop;
      break;
    case 4:
      inst.pitch = a;
      if (inst.src) inst.src.playbackRate.value = a;
      break;
    case 5:
      inst.vol = a;
      if (inst.gain) inst.gain.gain.value = a;
      break;
    case 6:
      inst.pan = a;
      inst.vol = b;
      if (inst.gain) inst.gain.gain.value = b;
      if (inst.panner) inst.panner.pan.value = a;
      break;
  }
}

STS.sndOp = (id, instId, op, a, b) => {
  const s = sounds[id];
  if (!s) return;
  if (op === 9) {
    for (const inst of Array.from(s.insts.values())) instOp(s, inst, 0, 0, 0);
    if (s.buffer) decodedBytes -= s.size;
    sounds[id] = null;
    return;
  }
  if (instId < 0) {
    for (const inst of Array.from(s.insts.values())) instOp(s, inst, op, a, b);
  } else {
    const inst = s.insts.get(instId);
    if (inst) instOp(s, inst, op, a, b);
  }
};

STS.musNew = (p) => {
  p = norm(p);
  accessed.add(p);
  const el = document.createElement('audio');
  el.preload = 'auto';
  el.src = url(p);
  const m = {el, wantPlay: false, ended: false, volume: 1};
  el.addEventListener('ended', () => {
    m.ended = true;
    m.wantPlay = false;
  });
  return music.push(m) - 1;
};

STS.musOp = (id, op, a) => {
  const m = music[id];
  if (!m) return 0;
  const el = m.el;
  switch (op) {
    case 0:
      m.wantPlay = true;
      m.ended = false;
      el.play().catch(() => {});
      return 0;
    case 1:
      m.wantPlay = false;
      el.pause();
      return 0;
    case 2:
      m.wantPlay = false;
      el.pause();
      try {
        el.currentTime = 0;
      } catch (e) {}
      return 0;
    case 3:
      return m.wantPlay ? 1 : 0;
    case 4:
      el.loop = a !== 0;
      return 0;
    case 5:
      return el.loop ? 1 : 0;
    case 6:
      m.volume = Math.max(0, Math.min(1, a));
      el.volume = m.volume;
      return 0;
    case 7:
      return m.volume;
    case 8:
      try {
        el.currentTime = a;
      } catch (e) {}
      return 0;
    case 9:
      return el.currentTime || 0;
    case 10:
      el.pause();
      el.removeAttribute('src');
      el.load();
      music[id] = null;
      return 0;
    case 20:
      if (m.ended) {
        m.ended = false;
        return 1;
      }
      return 0;
  }
  return 0;
};

async function boot() {
  try {
    pickSize();
    layout();
    installInput();
    status('Loading', 0);
    const [man] = await Promise.all([
      fetch('manifest.json').then((r) => r.json()),
      loadFs(),
      createSTSN({locateFile: (f) => f}).then((m) => {
        self.STSN = m;
      })
    ]);
    manifest = man;
    indexManifest();
    const packs = manifest.boot || [];
    const total = packs.reduce((s, p) => s + p[1], 0) || 1;
    let done = 0;
    for (const [name, size] of packs) {
      await loadPack(name, size, done, total);
      done += size;
    }
    status('Starting', 1);
    const gl = canvas.getContext('webgl2', {
      alpha: false, depth: true, stencil: false, antialias: false, premultipliedAlpha: false,
      preserveDrawingBuffer: params.has('preserve'), powerPreference: 'high-performance'
    });
    if (!gl) {
      STS.fatal('WebGL 2 is not available in this browser.');
      return;
    }
    G.init(gl);
    setTimeout(() => main([]), 0);
  } catch (e) {
    STS.fatal(String(e && e.stack || e));
  }
}

STS.dumpAccess = () => {
  return fetch('__access', {method: 'POST', body: JSON.stringify(Array.from(accessed))});
};

let frames = 0;
let lastRep = performance.now();
if (STS.debug) {
  const origRaf = requestAnimationFrame;
  self.requestAnimationFrame = (f) => origRaf((t) => {
    frames++;
    f(t);
  });
  addEventListener('error', (e) => logs.push('ERR ' + e.message + ' ' + (e.error && e.error.stack)));
  addEventListener('unhandledrejection', (e) => logs.push('REJ ' + (e.reason && (e.reason.stack || e.reason))));
  setInterval(() => {
    const now = performance.now();
    const fps = frames * 1000 / (now - lastRep);
    frames = 0;
    lastRep = now;
    const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0;
    const body = JSON.stringify({fps: Math.round(fps), mem, stats: STS.stats(), logs: logs.splice(0)});
    fetch('__log', {method: 'POST', body}).catch(() => {});
    if (params.has('trace')) STS.dumpAccess();
  }, 2000);
}

boot();
})();
