// ZIP archives for save backups (app.js): written without compression (a
// memory card is under half a megabyte), read stored or deflated, so a backup
// re-zipped by any tool still imports. No ZIP64, no encryption.
'use strict';

const SmsZip = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = table[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  // files: [{ name, data: Uint8Array }] -> Blob (application/zip)
  function write(files, date = new Date()) {
    const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
    const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    const enc = new TextEncoder();
    const parts = [], central = [];
    let offset = 0;
    for (const f of files) {
      const name = enc.encode(f.name), crc = crc32(f.data), size = f.data.length;
      const local = new DataView(new ArrayBuffer(30));
      local.setUint32(0, 0x04034B50, true);
      local.setUint16(4, 20, true);       // version needed: 2.0
      local.setUint16(6, 0x0800, true);   // names are UTF-8
      local.setUint16(8, 0, true);        // stored
      local.setUint16(10, time, true);
      local.setUint16(12, day, true);
      local.setUint32(14, crc, true);
      local.setUint32(18, size, true);
      local.setUint32(22, size, true);
      local.setUint16(26, name.length, true);
      const dir = new DataView(new ArrayBuffer(46));
      dir.setUint32(0, 0x02014B50, true);
      dir.setUint16(4, 20, true);
      dir.setUint16(6, 20, true);
      dir.setUint16(8, 0x0800, true);
      dir.setUint16(12, time, true);
      dir.setUint16(14, day, true);
      dir.setUint32(16, crc, true);
      dir.setUint32(20, size, true);
      dir.setUint32(24, size, true);
      dir.setUint16(28, name.length, true);
      dir.setUint32(42, offset, true);
      parts.push(local, name, f.data);
      central.push(dir, name);
      offset += 30 + name.length + size;
    }
    const centralSize = central.reduce((n, p) => n + p.byteLength, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054B50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, centralSize, true);
    end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, end], { type: 'application/zip' });
  }

  async function inflate(bytes) {
    if (typeof DecompressionStream !== 'function') throw new Error('this browser cannot read compressed ZIP entries');
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  // ArrayBuffer -> [{ name, data }]; directories are left out. Throws with a
  // reason when it is not a ZIP this can read, or an entry is damaged.
  async function read(buffer) {
    const bytes = new Uint8Array(buffer), dv = new DataView(buffer);
    let end = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 65535); i--) {
      if (dv.getUint32(i, true) === 0x06054B50) { end = i; break; }
    }
    if (end < 0) throw new Error('not a ZIP file');
    const count = dv.getUint16(end + 10, true);
    let p = dv.getUint32(end + 16, true);
    const dec = new TextDecoder();
    const out = [];
    for (let i = 0; i < count; i++) {
      if (p + 46 > bytes.length || dv.getUint32(p, true) !== 0x02014B50) throw new Error('the ZIP file is damaged');
      const flags = dv.getUint16(p + 8, true), method = dv.getUint16(p + 10, true), crc = dv.getUint32(p + 16, true);
      const csize = dv.getUint32(p + 20, true), size = dv.getUint32(p + 24, true);
      const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
      const at = dv.getUint32(p + 42, true);
      const name = dec.decode(bytes.subarray(p + 46, p + 46 + nlen));
      p += 46 + nlen + xlen + clen;
      if (name.endsWith('/')) continue;
      if (flags & 1) throw new Error(`${name} is encrypted`);
      if (csize === 0xFFFFFFFF || size === 0xFFFFFFFF || at + 30 > bytes.length) throw new Error('the ZIP file is damaged');
      const start = at + 30 + dv.getUint16(at + 26, true) + dv.getUint16(at + 28, true);
      const raw = bytes.subarray(start, start + csize);
      let data;
      if (method === 0) data = raw.slice();
      else if (method === 8) data = await inflate(raw);
      else throw new Error(`${name} is compressed in a way this cannot read (method ${method})`);
      if (data.length !== size || crc32(data) !== crc) throw new Error(`${name} is damaged in the ZIP file`);
      out.push({ name, data });
    }
    return out;
  }

  return { write, read, crc32 };
})();
