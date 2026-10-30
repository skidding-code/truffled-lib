(() => {
  "use strict";

  const CORE = new URL(".", document.currentScript.src).href;
  const SLOT = document.body.dataset.slot;
  const TITLE = document.title;
  const STATE_URL = "state.bin";
  const DB_NAME = "peg86";
  const STORE = "saves";
  const touch = matchMedia("(pointer: coarse)").matches;

  const el = (tag, props = {}, html = "") => {
    const node = Object.assign(document.createElement(tag), props);
    if (html) node.innerHTML = html;
    return node;
  };

  const screen = document.getElementById("screen");
  const canvas = screen.querySelector("canvas");

  const loader = el("div", { id: "loader" }, '<p></p><div class="track"><div class="fill"></div></div><a class="retry" href="">retry</a>');
  const loaderText = loader.querySelector("p");
  const fill = loader.querySelector(".fill");

  const toast = el("div", { id: "toast", className: "hidden" });

  const typer = el("div", { id: "typer" });
  const typerInput = el("input", {
    type: "text",
    placeholder: "type here, enter to send",
    autocomplete: "off",
    autocapitalize: "off",
    spellcheck: false,
  });
  typerInput.setAttribute("autocorrect", "off");
  typer.append(typerInput);

  const ffwd = el("button", { id: "ffwd", type: "button", textContent: "right click" });

  const fileInput = el("input", { type: "file", accept: ".peg86", hidden: true });

  const bar = el("div", { id: "bar", className: "hidden" });
  const tool = (label, handler) => {
    const b = el("button", { type: "button", textContent: label });
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      handler(b);
    });
    return b;
  };

  const fsButton = tool("fullscreen", toggleFullscreen);
  bar.append(
    fsButton,
    tool("type", toggleTyper),
    tool("save", () => saveProgress(true)),
    tool("export", exportSave),
    tool("import", () => fileInput.click()),
    tool("reset", resetSave),
  );

  document.body.append(loader, bar, toast, typer, ffwd, fileInput);

  let toastTimer = 0;
  function notify(text, { hold = false } = {}) {
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.classList.remove("hidden");
    if (!hold) toastTimer = setTimeout(() => toast.classList.add("hidden"), 2400);
  }

  function setLoader(text, ratio) {
    loaderText.textContent = text;
    if (typeof ratio === "number" && isFinite(ratio)) fill.style.width = `${Math.min(100, ratio * 100)}%`;
  }

  function failLoader(text) {
    loader.classList.add("error");
    loaderText.textContent = text;
  }

  const mb = (n) => (n / 1048576).toFixed(0);
  const nextFrame = () =>
    new Promise((r) => {
      if (document.hidden) return setTimeout(r, 0);
      requestAnimationFrame(() => setTimeout(r, 0));
      setTimeout(r, 100);
    });

  let barTimer = 0;
  let ready = false;
  function showBar() {
    if (!ready || document.pointerLockElement) return;
    bar.classList.remove("hidden");
    clearTimeout(barTimer);
    barTimer = setTimeout(() => {
      if (!bar.matches(":hover")) bar.classList.add("hidden");
    }, 2600);
  }
  addEventListener("pointermove", showBar, { passive: true });
  addEventListener("pointerdown", showBar, { passive: true });
  bar.addEventListener("mouseleave", showBar);

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }

  function toggleFullscreen() {
    if (fullscreenElement()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    const root = document.documentElement;
    const request = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!request) return notify("fullscreen not supported");
    Promise.resolve(request.call(root, { navigationUI: "hide" }))
      .then(() => navigator.keyboard?.lock?.(["Escape"]).catch(() => {}))
      .catch(() => notify("fullscreen blocked"));
  }

  function syncFullscreen() {
    const on = Boolean(fullscreenElement());
    fsButton.textContent = on ? "exit fullscreen" : "fullscreen";
  }
  document.addEventListener("fullscreenchange", syncFullscreen);
  document.addEventListener("webkitfullscreenchange", syncFullscreen);

  function toggleTyper() {
    const open = typer.classList.toggle("open");
    if (open) typerInput.focus();
    else typerInput.blur();
  }

  const emulator = new V86({
    wasm_path: CORE + "v86.wasm",
    bios: { url: CORE + "seabios.bin" },
    vga_bios: { url: CORE + "vgabios.bin" },
    memory_size: 512 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    screen_container: screen,
    hda: { url: CORE + "reactos.img", async: true, size: 734003200, fixed_chunk_size: 256 * 1024 },
    net_device: { type: "virtio", relay_url: "" },
    autostart: false,
  });

  emulator.add_listener("download-progress", (e) => {
    if (e.lengthComputable) setLoader("loading", e.loaded / e.total);
  });

  typerInput.addEventListener("keydown", async (e) => {
    if (e.key === "Escape") return toggleTyper();
    if (e.key !== "Enter") return;
    e.preventDefault();
    const text = typerInput.value;
    typerInput.value = "";
    for (const char of text) {
      emulator.keyboard_send_text(char);
      await new Promise((r) => setTimeout(r, 40));
    }
    emulator.keyboard_send_scancodes([0x1c, 0x9c]);
  });

  const release = () => emulator.bus.send("mouse-click", [false, false, false]);
  ffwd.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    ffwd.classList.add("held");
    emulator.bus.send("mouse-click", [false, false, true]);
  });
  for (const type of ["pointerup", "pointercancel", "pointerleave"]) {
    ffwd.addEventListener(type, () => {
      ffwd.classList.remove("held");
      release();
    });
  }
  ffwd.addEventListener("contextmenu", (e) => e.preventDefault());
  screen.addEventListener("contextmenu", (e) => e.preventDefault());

  canvas.addEventListener("click", () => {
    if (!ready || touch || document.pointerLockElement) return;
    const lock = canvas.requestPointerLock({ unadjustedMovement: true });
    if (lock && lock.catch) lock.catch(() => canvas.requestPointerLock());
  });

  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement) {
      bar.classList.add("hidden");
      if (typer.classList.contains("open")) toggleTyper();
    } else {
      showBar();
    }
  });

  const hasGzip = typeof CompressionStream !== "undefined" && typeof DecompressionStream !== "undefined";

  const pipe = (blob, Stream) => new Response(blob.stream().pipeThrough(new Stream("gzip")));
  const gzip = async (buffer) => (hasGzip ? pipe(new Blob([buffer]), CompressionStream).blob() : new Blob([buffer]));
  const gunzip = async (blob) => (hasGzip ? pipe(blob, DecompressionStream).arrayBuffer() : blob.arrayBuffer());

  let dbPromise;
  function db() {
    dbPromise ??= new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function idb(mode, action) {
    const store = (await db()).transaction(STORE, mode).objectStore(STORE);
    return new Promise((resolve, reject) => {
      const req = action(store);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  const readSave = () => idb("readonly", (s) => s.get(SLOT));
  const writeSave = (blob) => idb("readwrite", (s) => s.put(blob, SLOT));
  const deleteSave = () => idb("readwrite", (s) => s.delete(SLOT));

  async function fetchState() {
    const res = await fetch(STATE_URL);
    if (!res.ok) throw new Error(`Couldn't download game data (${res.status})`);
    const total = Number(res.headers.get("content-length")) || 0;
    if (!res.body || !total) {
      setLoader("loading");
      return res.arrayBuffer();
    }
    const out = new Uint8Array(total);
    const reader = res.body.getReader();
    let loaded = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      out.set(value, loaded);
      loaded += value.length;
      setLoader(`loading ${mb(loaded)}/${mb(total)} MB`, loaded / total);
    }
    return out.buffer;
  }

  async function boot() {
    try {
      let saved = null;
      try {
        saved = await readSave();
      } catch {}
      let state;
      if (saved) {
        setLoader("loading save");
        await nextFrame();
        try {
          state = await gunzip(saved);
        } catch {
          notify("save was broken, starting over");
        }
      }
      state ??= await fetchState();
      setLoader("starting");
      await nextFrame();
      await emulator.restore_state(state);
      emulator.run();
      ready = true;
      loader.classList.add("done");
      if (touch) ffwd.classList.add("show");
      if (touch) notify("hold the button for right click");
    } catch (err) {
      console.error(err);
      failLoader(err?.message || "failed to load");
    }
  }

  emulator.add_listener("emulator-loaded", boot);

  let saving = null;
  function saveProgress(loud) {
    if (!ready) return Promise.resolve();
    if (saving) return saving;
    saving = (async () => {
      try {
        if (loud) notify("saving", { hold: true });
        await nextFrame();
        await writeSave(await gzip(await emulator.save_state()));
        if (loud) notify("saved");
      } catch (err) {
        console.error(err);
        notify(err?.name === "QuotaExceededError" ? "storage full, use export" : "save failed");
      } finally {
        saving = null;
      }
    })();
    return saving;
  }

  async function exportSave() {
    if (!ready) return;
    try {
      notify("exporting", { hold: true });
      await nextFrame();
      const blob = await gzip(await emulator.save_state());
      const url = URL.createObjectURL(blob);
      const a = el("a", { href: url, download: `${SLOT}.peg86` });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      notify("exported");
    } catch (err) {
      console.error(err);
      notify("export failed");
    }
  }

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    fileInput.value = "";
    if (!file || !ready) return;
    try {
      notify("importing", { hold: true });
      await nextFrame();
      await emulator.restore_state(await gunzip(file));
      await writeSave(file);
      notify("imported");
    } catch (err) {
      console.error(err);
      notify("not a valid save");
    }
  });

  async function resetSave() {
    if (!confirm(`reset ${TITLE} progress?`)) return;
    ready = false;
    try {
      await deleteSave();
    } catch {}
    location.reload();
  }

  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      saveProgress(true);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveProgress(false);
  });
  addEventListener("pagehide", () => saveProgress(false));

  navigator.storage?.persist?.().catch(() => {});
  setLoader("loading");
})();
