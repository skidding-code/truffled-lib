// Copies a local disc image, or streams a download, into browser storage (OPFS).
// Runs in a dedicated worker so it can use a synchronous access handle, which
// every current engine supports there (FileSystemWritableFileStream is not
// available on the main thread in all of them). Local files use File.slice;
// downloads use a response stream. Disc images are never uploaded.
//
// The page names the file to write: always the slot that is not in use
// (app.js), so the stored image the page last committed is never touched
// here. A copy is checked before it is reported done: its size, and its first
// and last chunk read back. The page alone commits a copy (its marker).
'use strict';

const CHUNK = 8 << 20;

function same(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

self.onmessage = async (ev) => {
  // test: { failAfter: bytes, chunkDelayMs } from the regression tests only
  const { file, url, dir, name, test = {} } = ev.data;
  let handle = null;
  let reader = null;
  const download = new AbortController();
  let downloadTimer;
  const watchDownload = () => {
    clearTimeout(downloadTimer);
    downloadTimer = setTimeout(() => download.abort(new Error('the download stopped responding. Please try again.')), 30000);
  };
  try {
    let total = file ? file.size : 0;
    if (!file) {
      watchDownload();
      const response = await fetch(url, { signal: download.signal });
      clearTimeout(downloadTimer);
      if (!response.ok) throw Object.assign(new Error(`download failed (${response.status}). Please try again.`), {
        name: response.status === 404 ? 'NotFoundError' : 'Error',
      });
      if (/text\/html/i.test(response.headers.get('content-type') || '')) {
        throw Object.assign(new Error('the game image is missing from the server.'), { name: 'NotFoundError' });
      }
      total = Number(response.headers.get('content-length')) || 0;
      if (!response.body) throw new Error('the download could not be opened. Please try again.');
      reader = response.body.getReader();
    }
    const estimate = navigator.storage.estimate ? await navigator.storage.estimate() : {};
    if (total && estimate.quota && estimate.quota - (estimate.usage || 0) < total) {
      throw new DOMException(`the game needs ${Math.ceil(total / 1048576)} MB of browser storage; only ${Math.max(0, Math.floor((estimate.quota - (estimate.usage || 0)) / 1048576))} MB is available.`, 'QuotaExceededError');
    }
    const root = await navigator.storage.getDirectory();
    const sms = await root.getDirectoryHandle(dir, { create: true });
    const fh = await sms.getFileHandle(name, { create: true });
    handle = await fh.createSyncAccessHandle();
    handle.truncate(0);
    let done = 0;
    let first = null, last = null;
    let lastProgress = 0;
    while (true) {
      let buf;
      if (file) {
        if (done >= file.size) break;
        buf = new Uint8Array(await file.slice(done, done + CHUNK).arrayBuffer());
      } else {
        watchDownload();
        const chunk = await reader.read();
        clearTimeout(downloadTimer);
        if (chunk.done) break;
        buf = chunk.value;
      }
      if (!buf.length) continue;
      if (done === 0) first = buf;
      last = { at: done, buf };
      let off = 0;
      while (off < buf.length) {
        const n = handle.write(buf.subarray(off), { at: done + off });
        if (n <= 0) throw new Error(`write failed at byte ${done + off} (browser storage full?)`);
        off += n;
      }
      done += buf.length;
      if (test.failAfter !== undefined && done >= test.failAfter) throw new Error(`test: failing after ${done} bytes`);
      if (test.chunkDelayMs) await new Promise((r) => setTimeout(r, test.chunkDelayMs));
      if (performance.now() - lastProgress >= 100) {
        self.postMessage({ type: 'progress', done, total });
        lastProgress = performance.now();
      }
    }
    if (!done || (total && done !== total)) throw new Error('the download was incomplete. Please try again.');
    handle.flush();
    const size = handle.getSize();
    if (size !== done) throw new Error(`browser storage kept ${size} of ${done} bytes (storage quota?)`);
    for (const piece of [{ at: 0, buf: first }, last]) {
      if (!piece || !piece.buf) continue;
      const back = new Uint8Array(piece.buf.length);
      handle.read(back, { at: piece.at });
      if (!same(back, piece.buf)) throw new Error(`browser storage returned different bytes at ${piece.at}`);
    }
    handle.close();
    handle = null;
    self.postMessage({ type: 'progress', done, total: done });
    self.postMessage({ type: 'done', size });
  } catch (e) {
    if (handle) { try { handle.close(); } catch (e2) { /* ignore */ } }
    const reason = download.signal.aborted ? download.signal.reason : e;
    self.postMessage({ type: 'error', name: reason && reason.name, message: String(reason && reason.message || reason) });
  } finally {
    clearTimeout(downloadTimer);
    if (reader) await reader.cancel().catch(() => {});
  }
};
