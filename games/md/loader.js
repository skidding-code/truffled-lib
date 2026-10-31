(() => {
  const FILES = {
    "index.wasm": { chunks: 12, size: 37406162, type: "application/wasm" },
    "index.pck": { chunks: 40, size: 124873836, type: "application/octet-stream" },
    "index.audio.worklet.js": { chunks: 1, size: 7298, type: "text/javascript" },
    "index.audio.position.worklet.js": { chunks: 1, size: 2973, type: "text/javascript" },
  };
  const base = new URL(".", document.currentScript.src);
  const parts = new Map();
  const pending = new Map();
  const queue = [];
  const total = FILES["index.wasm"].size + FILES["index.pck"].size;
  let active = 0;
  let loaded = 0;

  window.__chunk = (name, index, encoded) => {
    const file = FILES[name];
    const chunks = parts.get(name);
    if (!file || !chunks || !Number.isInteger(index) || index < 0 || index >= file.chunks) {
      throw new Error("Unexpected game data: " + name);
    }
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    if (!chunks[index] && (name === "index.wasm" || name === "index.pck")) {
      loaded += bytes.length;
      window.dispatchEvent(new CustomEvent("meowdoku-progress", { detail: { loaded, total } }));
    }
    chunks[index] = bytes;
  };

  function script(name, index) {
    return new Promise((resolve, reject) => {
      const path = `data/${name}-${String(index).padStart(2, "0")}.js`;
      const element = document.createElement("script");
      const finish = (error) => {
        clearTimeout(timer);
        element.onload = element.onerror = null;
        element.remove();
        if (error) reject(error);
        else resolve();
      };
      const failure = () => new Error("Could not load " + path + ". Reload to retry.");
      const timer = setTimeout(() => finish(failure()), 60000);
      element.src = new URL(path, base).href;
      element.onload = () => finish(parts.get(name)[index] ? null : failure());
      element.onerror = () => finish(failure());
      document.head.appendChild(element);
    });
  }

  function pump() {
    while (active < 6 && queue.length) {
      const { name, index, resolve, reject } = queue.shift();
      active++;
      script(name, index).then(resolve, reject).finally(() => {
        active--;
        pump();
      });
    }
  }

  function load(name) {
    if (!pending.has(name)) {
      const file = FILES[name];
      parts.set(name, new Array(file.chunks));
      const downloads = Array.from({ length: file.chunks }, (_, index) =>
        new Promise((resolve, reject) => queue.push({ name, index, resolve, reject })),
      );
      pending.set(name, Promise.all(downloads).then(() => {
        const bytes = new Uint8Array(file.size);
        let offset = 0;
        for (const chunk of parts.get(name)) {
          if (!chunk || offset + chunk.length > file.size) throw new Error("Invalid game data: " + name);
          bytes.set(chunk, offset);
          offset += chunk.length;
        }
        if (offset !== file.size) throw new Error("Incomplete game data: " + name);
        parts.delete(name);
        return bytes;
      }));
      pump();
    }
    return pending.get(name);
  }

  function nameOf(input) {
    const url = new URL(input instanceof Request ? input.url : String(input), document.baseURI);
    const name = url.pathname.split("/").pop();
    const local = new URL(name, base);
    return Object.hasOwn(FILES, name) && url.origin === local.origin && url.pathname === local.pathname ? name : null;
  }

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, options) => {
    const name = nameOf(input);
    if (!name) return nativeFetch(input, options);
    return load(name).then((bytes) => {
      if (name.endsWith(".pck")) pending.delete(name);
      return new Response(bytes, {
        status: 200,
        headers: { "Content-Type": FILES[name].type, "Content-Length": String(bytes.length) },
      });
    });
  };

  if (window.AudioWorklet) {
    const nativeAddModule = AudioWorklet.prototype.addModule;
    AudioWorklet.prototype.addModule = function (input, options) {
      const name = nameOf(input);
      if (!name) return nativeAddModule.call(this, input, options);
      return load(name).then(async (bytes) => {
        if (base.protocol === "file:") {
          const text = new TextDecoder().decode(bytes);
          return nativeAddModule.call(this, "data:text/javascript;base64," + btoa(text), options);
        }
        const url = URL.createObjectURL(new Blob([bytes], { type: FILES[name].type }));
        try {
          return await nativeAddModule.call(this, url, options);
        } finally {
          URL.revokeObjectURL(url);
        }
      });
    };
  }
})();
