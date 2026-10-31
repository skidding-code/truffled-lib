'use strict';

const statusLine = document.getElementById('status');
const worldList = document.getElementById('world-list');
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function status(message) { statusLine.textContent = message; }

function openSaves() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('/saves', 21);
    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.objectStoreNames.contains('FILE_DATA')
        ? request.transaction.objectStore('FILE_DATA')
        : db.createObjectStore('FILE_DATA');
      if (!store.indexNames.contains('timestamp'))
        store.createIndex('timestamp', 'timestamp', {unique: false});
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readEntries(db) {
  return new Promise((resolve, reject) => {
    const entries = new Map();
    const transaction = db.transaction('FILE_DATA', 'readonly');
    const request = transaction.objectStore('FILE_DATA').openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) { entries.set(cursor.key, cursor.value); cursor.continue(); }
    };
    transaction.oncomplete = () => resolve(entries);
    transaction.onerror = () => reject(transaction.error);
  });
}

function worldIds(entries) {
  return [...entries.keys()]
    .map(key => /^\/saves\/([^/]+)\/data\.bin$/.exec(key))
    .filter(Boolean).map(match => match[1]).sort();
}

function titleFor(entries, id) {
  const raw = entries.get(`/saves/${id}/title.txt`)?.contents;
  return raw ? decoder.decode(raw).trim() || id : id;
}

function writeWorld(db, id, title, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('FILE_DATA', 'readwrite');
    const store = transaction.objectStore('FILE_DATA');
    const timestamp = new Date();
    store.put({timestamp, mode: 0o40755}, `/saves/${id}`);
    store.put({timestamp, mode: 0o100644, contents: data}, `/saves/${id}/data.bin`);
    store.put({timestamp, mode: 0o100644, contents: encoder.encode(title)},
              `/saves/${id}/title.txt`);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function crc32(data) {
  let crc = -1;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ -1) >>> 0;
}

function zipWorlds(entries, ids) {
  const files = [];
  for (const id of ids) {
    for (const [key, value] of entries) {
      if (!key.startsWith(`/saves/${id}/`) || !value.contents) continue;
      const rest = key.slice(`/saves/${id}/`.length);
      if (rest.includes('/') || !rest) continue;
      files.push({name: `worlds/${id}/${rest}`, data: new Uint8Array(value.contents)});
    }
  }
  if (!files.length) throw new Error('No worlds found');
  const chunks = [];
  const directory = [];
  let offset = 0;
  for (const {name, data} of files) {
    const filename = encoder.encode(name);
    const checksum = crc32(data);
    const local = new Uint8Array(30 + filename.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0x0800, true);
    view.setUint32(14, checksum, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, filename.length, true);
    local.set(filename, 30);
    chunks.push(local, data);
    const central = new Uint8Array(46 + filename.length);
    const record = new DataView(central.buffer);
    record.setUint32(0, 0x02014b50, true);
    record.setUint16(4, 20, true);
    record.setUint16(6, 20, true);
    record.setUint16(8, 0x0800, true);
    record.setUint32(16, checksum, true);
    record.setUint32(20, data.length, true);
    record.setUint32(24, data.length, true);
    record.setUint16(28, filename.length, true);
    record.setUint32(42, offset, true);
    central.set(filename, 46);
    directory.push(central);
    offset += local.length + data.length;
  }
  const directorySize = directory.reduce((sum, entry) => sum + entry.length, 0);
  const end = new Uint8Array(22);
  const footer = new DataView(end.buffer);
  footer.setUint32(0, 0x06054b50, true);
  footer.setUint16(8, directory.length, true);
  footer.setUint16(10, directory.length, true);
  footer.setUint32(12, directorySize, true);
  footer.setUint32(16, offset, true);
  return new Blob([...chunks, ...directory, end], {type: 'application/zip'});
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function refresh() {
  const db = await openSaves();
  try {
    const entries = await readEntries(db);
    worldList.replaceChildren();
    for (const id of worldIds(entries)) {
      const item = document.createElement('li');
      item.append(document.createTextNode(`${titleFor(entries, id)} `));
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'Download ZIP';
      button.onclick = () => download(zipWorlds(entries, [id]), `${id}.zip`);
      item.append(button);
      worldList.append(item);
    }
    status(`${worldIds(entries).length} world(s) stored in this browser.`);
  } finally { db.close(); }
}

document.getElementById('import-form').addEventListener('submit', async event => {
  event.preventDefault();
  const files = [...document.getElementById('world-file').files];
  if (!files.length) return;
  const db = await openSaves();
  try {
    for (const file of files) {
      if (!file.name.toLowerCase().endsWith('.ms') || file.size < 12)
        throw new Error(`${file.name}: choose a non-empty .ms world file`);
      const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
      const signature = String.fromCharCode(...head);
      if (['CON ', 'LIVE', 'PIRS', 'PK\x03\x04'].includes(signature))
        throw new Error(`${file.name}: this is a container or ZIP, not a raw .ms save`);
      const title = file.name.slice(0, -3);
      const id = `web-${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}`;
      status(`Importing ${file.name}...`);
      await writeWorld(db, id, title, new Uint8Array(await file.arrayBuffer()));
    }
  } catch (error) { status(error.message); db.close(); return; }
  db.close();
  await refresh();
});

document.getElementById('download-all').addEventListener('click', async () => {
  try {
    const db = await openSaves();
    const entries = await readEntries(db);
    db.close();
    download(zipWorlds(entries, worldIds(entries)), 'minecraft-worlds.zip');
    status('World backup downloaded.');
  } catch (error) { status(error.message); }
});

refresh().catch(error => status(`Save storage unavailable: ${error.message}`));