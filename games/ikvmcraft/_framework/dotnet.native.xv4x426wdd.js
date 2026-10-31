
var createDotnetRuntime = (() => {
  var _scriptDir = import.meta.url;
  
  return (
function(moduleArg = {}) {

// Support for growable heap + pthreads, where the buffer may change, so JS views
// must be updated.
function GROWABLE_HEAP_I8() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP8;
}
function GROWABLE_HEAP_U8() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU8;
}
function GROWABLE_HEAP_I16() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP16;
}
function GROWABLE_HEAP_U16() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU16;
}
function GROWABLE_HEAP_I32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAP32;
}
function GROWABLE_HEAP_U32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPU32;
}
function GROWABLE_HEAP_F32() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPF32;
}
function GROWABLE_HEAP_F64() {
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
  return HEAPF64;
}

var Module = moduleArg;

var readyPromiseResolve, readyPromiseReject;

Module["ready"] = new Promise((resolve, reject) => {
 readyPromiseResolve = resolve;
 readyPromiseReject = reject;
});

if (_nativeModuleLoaded) throw new Error("Native module already loaded");

_nativeModuleLoaded = true;

createDotnetRuntime = Module = moduleArg(Module);

var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
 throw toThrow;
};

var ENVIRONMENT_IS_WEB = typeof window == "object";

var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";

var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

var ENVIRONMENT_IS_PTHREAD = Module["ENVIRONMENT_IS_PTHREAD"] || false;

var scriptDirectory = "";

function locateFile(path) {
 if (Module["locateFile"]) {
  return Module["locateFile"](path, scriptDirectory);
 }
 return scriptDirectory + path;
}

var read_, readAsync, readBinary;

if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
 if (ENVIRONMENT_IS_WORKER) {
  scriptDirectory = self.location.href;
 } else if (typeof document != "undefined" && document.currentScript) {
  scriptDirectory = document.currentScript.src;
 }
 if (_scriptDir) {
  scriptDirectory = _scriptDir;
 }
 if (scriptDirectory.startsWith("blob:")) {
  scriptDirectory = "";
 } else {
  scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
 }
 {
  read_ = url => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, false);
   xhr.send(null);
   return xhr.responseText;
  };
  if (ENVIRONMENT_IS_WORKER) {
   readBinary = url => {
    var xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
   };
  }
  readAsync = (url, onload, onerror) => {
   var xhr = new XMLHttpRequest;
   xhr.open("GET", url, true);
   xhr.responseType = "arraybuffer";
   xhr.onload = () => {
    if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
     onload(xhr.response);
     return;
    }
    onerror();
   };
   xhr.onerror = onerror;
   xhr.send(null);
  };
 }
} else {}

var out = Module["print"] || console.log.bind(console);

var err = Module["printErr"] || console.error.bind(console);

Object.assign(Module, moduleOverrides);

moduleOverrides = null;

if (Module["arguments"]) arguments_ = Module["arguments"];

if (Module["thisProgram"]) thisProgram = Module["thisProgram"];

if (Module["quit"]) quit_ = Module["quit"];

var wasmBinary;

if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];

function intArrayFromBase64(s) {
 var decoded = atob(s);
 var bytes = new Uint8Array(decoded.length);
 for (var i = 0; i < decoded.length; ++i) {
  bytes[i] = decoded.charCodeAt(i);
 }
 return bytes;
}

function tryParseAsDataURI(filename) {
 if (!isDataURI(filename)) {
  return;
 }
 return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}

var wasmMemory;

var wasmModule;

var ABORT = false;

var EXITSTATUS;

/** @type {function(*, string=)} */ function assert(condition, text) {
 if (!condition) {
  abort(text);
 }
}

var HEAP, /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /* BigInt64Array type is not correctly defined in closure
/** not-@type {!BigInt64Array} */ HEAP64, /* BigUInt64Array type is not correctly defined in closure
/** not-t@type {!BigUint64Array} */ HEAPU64, /** @type {!Float64Array} */ HEAPF64;

function updateMemoryViews() {
 var b = wasmMemory.buffer;
 Module["HEAP8"] = HEAP8 = new Int8Array(b);
 Module["HEAP16"] = HEAP16 = new Int16Array(b);
 Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
 Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
 Module["HEAP32"] = HEAP32 = new Int32Array(b);
 Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
 Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
 Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
 Module["HEAP64"] = HEAP64 = new BigInt64Array(b);
 Module["HEAPU64"] = HEAPU64 = new BigUint64Array(b);
}

var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 312606720;

if (ENVIRONMENT_IS_PTHREAD) {
 wasmMemory = Module["wasmMemory"];
} else {
 if (Module["wasmMemory"]) {
  wasmMemory = Module["wasmMemory"];
 } else {
  wasmMemory = new WebAssembly.Memory({
   "initial": INITIAL_MEMORY / 65536,
   "maximum": 4294901760 / 65536,
   "shared": true
  });
  if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
   err("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag");
   if (ENVIRONMENT_IS_NODE) {
    err("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)");
   }
   throw Error("bad memory");
  }
 }
}

updateMemoryViews();

INITIAL_MEMORY = wasmMemory.buffer.byteLength;

var __ATPRERUN__ = [];

var __ATINIT__ = [];

var __ATEXIT__ = [];

var __ATPOSTRUN__ = [];

var runtimeInitialized = false;

var runtimeExited = false;

function preRun() {
 if (Module["preRun"]) {
  if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
  while (Module["preRun"].length) {
   addOnPreRun(Module["preRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
 runtimeInitialized = true;
 if (ENVIRONMENT_IS_PTHREAD) return;
 callRuntimeCallbacks(__ATINIT__);
}

function exitRuntime() {
 if (ENVIRONMENT_IS_PTHREAD) return;
 ___funcs_on_exit();
 callRuntimeCallbacks(__ATEXIT__);
 PThread.terminateAllThreads();
 runtimeExited = true;
}

function postRun() {
 if (ENVIRONMENT_IS_PTHREAD) return;
 if (Module["postRun"]) {
  if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
  while (Module["postRun"].length) {
   addOnPostRun(Module["postRun"].shift());
  }
 }
 callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
 __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
 __ATINIT__.unshift(cb);
}

function addOnExit(cb) {
 __ATEXIT__.unshift(cb);
}

function addOnPostRun(cb) {
 __ATPOSTRUN__.unshift(cb);
}

var runDependencies = 0;

var runDependencyWatcher = null;

var dependenciesFulfilled = null;

function getUniqueRunDependency(id) {
 return id;
}

function addRunDependency(id) {
 runDependencies++;
 Module["monitorRunDependencies"]?.(runDependencies);
}

function removeRunDependency(id) {
 runDependencies--;
 Module["monitorRunDependencies"]?.(runDependencies);
 if (runDependencies == 0) {
  if (runDependencyWatcher !== null) {
   clearInterval(runDependencyWatcher);
   runDependencyWatcher = null;
  }
  if (dependenciesFulfilled) {
   var callback = dependenciesFulfilled;
   dependenciesFulfilled = null;
   callback();
  }
 }
}

/** @param {string|number=} what */ function abort(what) {
 Module["onAbort"]?.(what);
 what = "Aborted(" + what + ")";
 err(what);
 ABORT = true;
 EXITSTATUS = 1;
 what += ". Build with -sASSERTIONS for more info.";
 if (runtimeInitialized) {
  ___trap();
 }
 /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
 readyPromiseReject(e);
 throw e;
}

var dataURIPrefix = "data:application/octet-stream;base64,";

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */ var isDataURI = filename => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

var wasmBinaryFile;

if (Module["locateFile"]) {
 wasmBinaryFile = "dotnet.native.wasm";
 if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
 }
} else {
 wasmBinaryFile = new URL("dotnet.native.wasm", import.meta.url).href;
}

function getBinarySync(file) {
 if (file == wasmBinaryFile && wasmBinary) {
  return new Uint8Array(wasmBinary);
 }
 if (readBinary) {
  return readBinary(file);
 }
 throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(binaryFile) {
 if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
  if (typeof fetch == "function") {
   return fetch(binaryFile, {
    credentials: "same-origin"
   }).then(response => {
    if (!response["ok"]) {
     throw `failed to load wasm binary file at '${binaryFile}'`;
    }
    return response["arrayBuffer"]();
   }).catch(() => getBinarySync(binaryFile));
  }
 }
 return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
 return getBinaryPromise(binaryFile).then(binary => WebAssembly.instantiate(binary, imports)).then(receiver, reason => {
  err(`failed to asynchronously prepare wasm: ${reason}`);
  abort(reason);
 });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
 if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && typeof fetch == "function") {
  return fetch(binaryFile, {
   credentials: "same-origin"
  }).then(response => {
   /** @suppress {checkTypes} */ var result = WebAssembly.instantiateStreaming(response, imports);
   return result.then(callback, function(reason) {
    err(`wasm streaming compile failed: ${reason}`);
    err("falling back to ArrayBuffer instantiation");
    return instantiateArrayBuffer(binaryFile, imports, callback);
   });
  });
 }
 return instantiateArrayBuffer(binaryFile, imports, callback);
}

function createWasm() {
 var info = {
  "env": wasmImports,
  "wasi_snapshot_preview1": wasmImports
 };
 /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
  wasmExports = instance.exports;
  wasmExports = applySignatureConversions(wasmExports);
  Module["wasmExports"] = wasmExports;
  registerTLSInit(wasmExports["_emscripten_tls_init"]);
  wasmTable = wasmExports["__indirect_function_table"];
  addOnInit(wasmExports["__wasm_call_ctors"]);
  wasmModule = module;
  removeRunDependency("wasm-instantiate");
  return wasmExports;
 }
 addRunDependency("wasm-instantiate");
 function receiveInstantiationResult(result) {
  receiveInstance(result["instance"], result["module"]);
 }
 if (Module["instantiateWasm"]) {
  try {
   return Module["instantiateWasm"](info, receiveInstance);
  } catch (e) {
   err(`Module.instantiateWasm callback failed with error: ${e}`);
   readyPromiseReject(e);
  }
 }
 instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
 return {};
}

var ASM_CONSTS = {
 7161588: $0 => {
  console.debug(UTF8ToString($0));
  _free($0);
 },
 7161636: () => {
  console.log("[jiterp heat] no traces yet");
 },
 7161684: $0 => {
  var s = UTF8ToString($0);
  _free($0);
  console.log(s);
 },
 7161741: ($0, $1) => {
  var s = UTF8ToString($0);
  _free($0);
  var c = $1;
  (c == 3 ? console.error : c == 2 ? console.warn : c == 1 ? console.info : c == 4 ? console.debug : console.log)(s);
 },
 7161910: ($0, $1, $2) => {
  try {
   var w = $0 | 0;
   var h = $1 | 0;
   var p = $2 | 0;
   var c = document.createElement("canvas");
   c.width = w;
   c.height = h;
   var ctx = c.getContext("2d");
   var img = ctx.createImageData(w, h);
   img.data.set(GROWABLE_HEAP_U8().subarray(p >>> 0, p + w * h * 4 >>> 0));
   ctx.putImageData(img, 0, 0);
   var url = c.toDataURL("image/png");
   var link = document.querySelector("link[rel~='icon']");
   if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
   }
   link.type = "image/png";
   link.href = url;
  } catch (e) {
   console.warn("[glfwSetWindowIcon] failed:", e);
  }
 },
 7162486: () => {
  try {
   var w = (typeof window !== "undefined") ? window : null;
   if (w && w.tinyfd && typeof w.tinyfd.beep === "function") {
    w.tinyfd.beep();
   }
  } catch (e) {}
 },
 7162647: ($0, $1, $2) => {
  try {
   var w = (typeof window !== "undefined") ? window : null;
   var f = w && w.tinyfd && w.tinyfd.notifyPopup;
   if (typeof f !== "function") return 0;
   return (f($0 ? UTF8ToString($0) : null, $1 ? UTF8ToString($1) : null, $2 ? UTF8ToString($2) : null) | 0);
  } catch (e) {
   return 0;
  }
 },
 7162934: ($0, $1, $2, $3, $4) => {
  try {
   var w = (typeof window !== "undefined") ? window : null;
   var f = w && w.tinyfd && w.tinyfd.messageBox;
   if (typeof f !== "function") return 0;
   var ret = f($0 ? UTF8ToString($0) : null, $1 ? UTF8ToString($1) : null, $2 ? UTF8ToString($2) : null, $3 ? UTF8ToString($3) : null, $4 | 0);
   return (ret | 0);
  } catch (e) {
   return 0;
  }
 },
 7163273: ($0, $1, $2, $3, $4, $5) => {
  try {
   var w = (typeof window !== "undefined") ? window : null;
   var f = w && w.tinyfd && w.tinyfd.colorChooser;
   if (typeof f !== "function") return 0;
   var title = $0 ? UTF8ToString($0) : null;
   var hex = $1 ? UTF8ToString($1) : null;
   var defRGB = null;
   if ($2) {
    defRGB = Array.of(GROWABLE_HEAP_U8()[$2 >>> 0] | 0, GROWABLE_HEAP_U8()[$2 + 1 >>> 0] | 0, GROWABLE_HEAP_U8()[$2 + 2 >>> 0] | 0);
   }
   var r = f.call(w.tinyfd, title, hex, defRGB);
   if (r == null) return 0;
   var s = r.toString();
   stringToUTF8(s, $4, $5);
   if ($3) {
    var m = /^#?([0-9a-fA-F]{6})/.exec(s);
    if (m) {
     var v = parseInt(m[1], 16);
     GROWABLE_HEAP_U8()[$3 >>> 0] = (v >> 16) & 255;
     GROWABLE_HEAP_U8()[$3 + 1 >>> 0] = (v >> 8) & 255;
     GROWABLE_HEAP_U8()[$3 + 2 >>> 0] = (v) & 255;
    }
   }
   return 1;
  } catch (e) {
   return 0;
  }
 },
 7163954: ($0, $1, $2, $3, $4, $5, $6, $7) => {
  try {
   var w = (typeof window !== "undefined") ? window : null;
   var name = $0 ? UTF8ToString($0) : "";
   var f = w && w.tinyfd && w.tinyfd[name];
   if (typeof f !== "function") return 0;
   var args = [];
   if ($1) args.push(UTF8ToString($1)); else args.push(null);
   if ($2) args.push(UTF8ToString($2)); else args.push(null);
   if ($3) args.push(UTF8ToString($3)); else args.push(null);
   if ($4) args.push(UTF8ToString($4)); else args.push(null);
   if ($5 !== -2147483648) args.push($5 | 0);
   var r = f.apply(w.tinyfd, args);
   if (r == null) return 0;
   stringToUTF8(r.toString(), $6, $7);
   return 1;
  } catch (e) {
   return 0;
  }
 },
 7164564: ($0, $1, $2, $3, $4, $5, $6, $7, $8) => {
  try {
   var w = (typeof window !== "undefined") ? window : null;
   var name = $0 ? UTF8ToString($0) : "";
   var f = w && w.tinyfd && w.tinyfd[name];
   if (typeof f !== "function") return 0;
   var title = $1 ? UTF8ToString($1) : null;
   var dflt = $2 ? UTF8ToString($2) : null;
   var n = $3 | 0;
   var arr = [];
   if ($4 && n > 0) {
    var base = $4 >> 2;
    for (var i = 0; i < n; i++) {
     var p = GROWABLE_HEAP_U32()[base + i >>> 0];
     arr.push(p ? UTF8ToString(p) : "");
    }
   }
   var desc = $5 ? UTF8ToString($5) : null;
   var multi = $6;
   var r;
   if (multi < 0) {
    r = f.call(w.tinyfd, title, dflt, arr, desc);
   } else {
    r = f.call(w.tinyfd, title, dflt, arr, desc, multi | 0);
   }
   if (r == null) return 0;
   stringToUTF8(r.toString(), $7, $8);
   return 1;
  } catch (e) {
   return 0;
  }
 },
 7165291: ($0, $1, $2, $3) => {
  var w = $0;
  var h = $1;
  var pixels = $2;
  var canvasId = UTF8ToString($3);
  var canvas = document.querySelector(canvasId);
  var SDL3 = Module["SDL3"];
  if (SDL3.ctxCanvas !== canvas) {
   SDL3.ctx = Browser.createContext(canvas, false, true);
   if (!SDL3.ctx) {
    return false;
   }
   SDL3.ctxCanvas = canvas;
  }
  if (SDL3.w !== w || SDL3.h !== h || SDL3.imageCtx !== SDL3.ctx) {
   SDL3.image = SDL3.ctx.createImageData(w, h);
   SDL3.w = w;
   SDL3.h = h;
   SDL3.imageCtx = SDL3.ctx;
  }
  var data = SDL3.image.data;
  var src = pixels / 4;
  if (SDL3.data32Data !== data) {
   SDL3.data32 = new Int32Array(data.buffer);
   SDL3.data32Data = data;
  }
  var data32 = SDL3.data32;
  data32.set(GROWABLE_HEAP_I32().subarray(src >>> 0, src + data32.length >>> 0));
  SDL3.ctx.putImageData(SDL3.image, 0, 0);
  return true;
 },
 7166040: () => {
  var SDL3 = Module["SDL3"];
  SDL3["mouse_x"] = 0;
  SDL3["mouse_y"] = 0;
  SDL3["mouse_buttons"] = [];
  for (var i = 0; i < 5; ++i) {
   SDL3["mouse_buttons"][i] = false;
  }
  document.addEventListener("mousemove", function(e) {
   var SDL3 = Module["SDL3"];
   SDL3["mouse_x"] = e.clientX;
   SDL3["mouse_y"] = e.clientY;
  });
  document.addEventListener("mousedown", function(e) {
   var SDL3 = Module["SDL3"];
   if (0 <= e.button && e.button < SDL3["mouse_buttons"].length) {
    SDL3["mouse_buttons"][e.button] = true;
   }
  });
  document.addEventListener("mouseup", function(e) {
   var SDL3 = Module["SDL3"];
   if (0 <= e.button && e.button < SDL3["mouse_buttons"].length) {
    SDL3["mouse_buttons"][e.button] = false;
   }
  });
 },
 7166728: ($0, $1, $2, $3, $4) => {
  var w = $0;
  var h = $1;
  var hot_x = $2;
  var hot_y = $3;
  var pixels = $4;
  var canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext("2d");
  var image = ctx.createImageData(w, h);
  var data = image.data;
  var src = pixels / 4;
  var data32 = new Int32Array(data.buffer);
  data32.set(GROWABLE_HEAP_I32().subarray(src >>> 0, src + data32.length >>> 0));
  ctx.putImageData(image, 0, 0);
  var url = hot_x === 0 && hot_y === 0 ? "url(" + canvas.toDataURL() + "), auto" : "url(" + canvas.toDataURL() + ") " + hot_x + " " + hot_y + ", auto";
  var urlBuf = _SDL_malloc(url.length + 1);
  stringToUTF8(url, urlBuf, url.length + 1);
  return urlBuf;
 },
 7167386: $0 => {
  if (Module["canvas"]) {
   Module["canvas"].style["cursor"] = UTF8ToString($0);
  }
 },
 7167469: () => {
  if (Module["canvas"]) {
   Module["canvas"].style["cursor"] = "none";
  }
 },
 7167538: () => Module["SDL3"]["mouse_x"],
 7167576: () => Module["SDL3"]["mouse_y"],
 7167614: $0 => Module["SDL3"]["mouse_buttons"][$0],
 7167662: $0 => {
  var data = $0;
  document.sdlEventHandlerLockKeysCheck = function(event) {
   if ((event.key != "CapsLock") && (event.key != "NumLock") && (event.key != "ScrollLock")) {
    _Emscripten_HandleLockKeysCheck(Module["SDL3"].JSVarToCPtr(data), event.getModifierState("CapsLock"), event.getModifierState("NumLock"), event.getModifierState("ScrollLock"));
   }
  };
  document.addEventListener("keydown", document.sdlEventHandlerLockKeysCheck);
 },
 7168089: () => {
  document.removeEventListener("keydown", document.sdlEventHandlerLockKeysCheck);
 },
 7168173: $0 => {
  var target = document;
  if (target) {
   target.sdlEventHandlerMouseButtonUpGlobal = function(event) {
    var SDL3 = Module["SDL3"];
    var d = SDL3.makePointerEventCStruct(0, 0, event);
    if (d != 0) {
     _Emscripten_HandleMouseButtonUpGlobal(SDL3.JSVarToCPtr($0), d);
     _SDL_free(d);
    }
   };
   target.addEventListener("pointerup", target.sdlEventHandlerMouseButtonUpGlobal);
  }
 },
 7168534: $0 => {
  var SDL3 = Module["SDL3"];
  if (SDL3.makePointerEventCStruct === undefined) {
   SDL3.makePointerEventCStruct = function(left, top, event) {
    var ptrtype = 0;
    if (event.pointerType == "mouse") {
     ptrtype = 1;
    } else if (event.pointerType == "touch") {
     ptrtype = 2;
    } else if (event.pointerType == "pen") {
     ptrtype = 3;
    } else {
     return 0;
    }
    var ptr = _SDL_malloc($0);
    if (ptr != 0) {
     var idx = SDL3.CPtrToHeap32Index(ptr);
     GROWABLE_HEAP_I32()[idx++ >>> 0] = ptrtype;
     GROWABLE_HEAP_I32()[idx++ >>> 0] = event.pointerId;
     GROWABLE_HEAP_I32()[idx++ >>> 0] = (typeof (event.button) !== "undefined") ? event.button : -1;
     GROWABLE_HEAP_I32()[idx++ >>> 0] = event.buttons;
     GROWABLE_HEAP_I32()[idx++ >>> 0] = (event.type == "pointerdown") ? 1 : 0;
     GROWABLE_HEAP_F32()[idx++ >>> 0] = event.movementX;
     GROWABLE_HEAP_F32()[idx++ >>> 0] = event.movementY;
     GROWABLE_HEAP_F32()[idx++ >>> 0] = event.clientX - left;
     GROWABLE_HEAP_F32()[idx++ >>> 0] = event.clientY - top;
     if (ptrtype == 3) {
      GROWABLE_HEAP_F32()[idx++ >>> 0] = event.pressure;
      GROWABLE_HEAP_F32()[idx++ >>> 0] = event.tangentialPressure;
      GROWABLE_HEAP_F32()[idx++ >>> 0] = event.tiltX;
      GROWABLE_HEAP_F32()[idx++ >>> 0] = event.tiltY;
      GROWABLE_HEAP_F32()[idx++ >>> 0] = event.twist;
     }
    }
    return ptr;
   };
  }
 },
 7169526: $0 => {
  var id = UTF8ToString($0);
  try {
   var canvas = document.querySelector(id);
   if (canvas) {
    return canvas === document.activeElement;
   }
  } catch (e) {}
  return false;
 },
 7169692: () => document.hasFocus(),
 7169724: () => {
  var target = document;
  if (target) {
   target.removeEventListener("pointerup", target.sdlEventHandlerMouseButtonUpGlobal);
   target.sdlEventHandlerMouseButtonUpGlobal = undefined;
  }
 },
 7169906: () => document.body.clientWidth,
 7169944: () => document.body.clientHeight,
 7169983: () => window.innerWidth,
 7170013: () => window.innerHeight,
 7170044: () => window.outerWidth,
 7170074: () => window.outerHeight,
 7170105: () => window.pageXOffset,
 7170136: () => window.pageYOffset,
 7170167: ($0, $1) => {
  var target = document.querySelector(UTF8ToString($1));
  if (target) {
   var SDL3 = Module["SDL3"];
   var data = $0;
   target.sdlEventHandlerPointerEnter = function(event) {
    var rect = target.getBoundingClientRect();
    var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event);
    if (d != 0) {
     _Emscripten_HandlePointerEnter(SDL3.JSVarToCPtr(data), d);
     _SDL_free(d);
    }
   };
   target.sdlEventHandlerPointerLeave = function(event) {
    var rect = target.getBoundingClientRect();
    var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event);
    if (d != 0) {
     _Emscripten_HandlePointerLeave(SDL3.JSVarToCPtr(data), d);
     _SDL_free(d);
    }
   };
   target.sdlEventHandlerPointerGeneric = function(event) {
    var rect = target.getBoundingClientRect();
    var d = SDL3.makePointerEventCStruct(rect.left, rect.top, event);
    if (d != 0) {
     _Emscripten_HandlePointerGeneric(SDL3.JSVarToCPtr(data), d);
     _SDL_free(d);
    }
   };
   target.style.touchAction = "none";
   target.addEventListener("pointerenter", target.sdlEventHandlerPointerEnter);
   target.addEventListener("pointerleave", target.sdlEventHandlerPointerLeave);
   target.addEventListener("pointercancel", target.sdlEventHandlerPointerLeave);
   target.addEventListener("pointerdown", target.sdlEventHandlerPointerGeneric);
   target.addEventListener("pointermove", target.sdlEventHandlerPointerGeneric);
   target.addEventListener("pointerup", target.sdlEventHandlerPointerGeneric);
  }
 },
 7171555: ($0, $1, $2) => {
  var target = document.querySelector(UTF8ToString($1));
  if (target) {
   var data = $0;
   var SDL3 = Module["SDL3"];
   var makeDropEventCStruct = function(event) {
    var ptr = 0;
    ptr = _SDL_malloc($2);
    if (ptr != 0) {
     var idx = ptr >> 2;
     var rect = target.getBoundingClientRect();
     GROWABLE_HEAP_I32()[idx++ >>> 0] = event.clientX - rect.left;
     GROWABLE_HEAP_I32()[idx++ >>> 0] = event.clientY - rect.top;
    }
    return ptr;
   };
   SDL3.eventHandlerDropDragover = function(event) {
    event.preventDefault();
    var d = makeDropEventCStruct(event);
    if (d != 0) {
     _Emscripten_SendDragEvent(data, d);
     _SDL_free(d);
    }
   };
   target.addEventListener("dragover", SDL3.eventHandlerDropDragover);
   SDL3.drop_count = 0;
   try {
    FS.mkdir("/tmp/filedrop");
   } catch (e) {}
   SDL3.eventHandlerDropDrop = function(event) {
    event.preventDefault();
    if (event.dataTransfer.types.includes("text/plain")) {
     let plain_text = stringToNewUTF8(event.dataTransfer.getData("text/plain"));
     _Emscripten_SendDragTextEvent(data, plain_text);
     _Emscripten_force_free(plain_text);
    } else if (event.dataTransfer.types.includes("Files")) {
     let files_read = 0;
     const files_to_read = event.dataTransfer.files.length;
     for (let i = 0; i < files_to_read; i++) {
      const file = event.dataTransfer.files.item(i);
      const file_reader = new FileReader;
      file_reader.readAsArrayBuffer(file);
      file_reader.onload = function(event) {
       const fs_dropdir = `/tmp/filedrop/${SDL3.drop_count}`;
       SDL3.drop_count += 1;
       const fs_filepath = `${fs_dropdir}/${file.name}`;
       const c_fs_filepath = stringToNewUTF8(fs_filepath);
       const contents_array8 = new Uint8Array(event.target.result);
       try {
        FS.mkdir(fs_dropdir);
        var stream = FS.open(fs_filepath, "w");
        FS.write(stream, contents_array8, 0, contents_array8.length, 0);
        FS.close(stream);
        _Emscripten_SendDragFileEvent(data, c_fs_filepath);
       } catch (e) {}
       _Emscripten_force_free(c_fs_filepath);
       onFileRead();
      };
      file_reader.onerror = function(event) {
       onFileRead();
      };
     }
     function onFileRead() {
      ++files_read;
      if (files_read === files_to_read) {
       _Emscripten_SendDragCompleteEvent(data);
      }
     }
    }
    _Emscripten_SendDragCompleteEvent(data);
   };
   target.addEventListener("drop", SDL3.eventHandlerDropDrop);
   SDL3.eventHandlerDropDragend = function(event) {
    event.preventDefault();
    _Emscripten_SendDragCompleteEvent(data);
   };
   target.addEventListener("dragend", SDL3.eventHandlerDropDragend);
   target.addEventListener("dragleave", SDL3.eventHandlerDropDragend);
  }
 },
 7173922: $0 => {
  var target = document.querySelector(UTF8ToString($0));
  if (target) {
   var SDL3 = Module["SDL3"];
   target.removeEventListener("dragleave", SDL3.eventHandlerDropDragend);
   target.removeEventListener("dragend", SDL3.eventHandlerDropDragend);
   target.removeEventListener("drop", SDL3.eventHandlerDropDrop);
   SDL3.drop_count = undefined;
   function recursive_remove(dirpath) {
    FS.readdir(dirpath).forEach(filename => {
     const p = `${dirpath}/${filename}`;
     const p_s = FS.stat(p);
     if (FS.isFile(p_s.mode)) {
      FS.unlink(p);
     } else if (FS.isDir(p)) {
      recursive_remove(p);
     }
    });
    FS.rmdir(dirpath);
   }
   ("/tmp/filedrop");
   FS.rmdir("/tmp/filedrop");
   target.removeEventListener("dragover", SDL3.eventHandlerDropDragover);
   SDL3.eventHandlerDropDragover = undefined;
   SDL3.eventHandlerDropDrop = undefined;
   SDL3.eventHandlerDropDragend = undefined;
  }
 },
 7174752: $0 => {
  var target = document.querySelector(UTF8ToString($0));
  if (target) {
   target.removeEventListener("pointerenter", target.sdlEventHandlerPointerEnter);
   target.removeEventListener("pointerleave", target.sdlEventHandlerPointerLeave);
   target.removeEventListener("pointercancel", target.sdlEventHandlerPointerLeave);
   target.removeEventListener("pointerdown", target.sdlEventHandlerPointerGeneric);
   target.removeEventListener("pointermove", target.sdlEventHandlerPointerGeneric);
   target.removeEventListener("pointerup", target.sdlEventHandlerPointerGeneric);
   target.style.touchAction = "";
   target.sdlEventHandlerPointerEnter = undefined;
   target.sdlEventHandlerPointerLeave = undefined;
   target.sdlEventHandlerPointerGeneric = undefined;
  }
 },
 7175486: () => {
  if (!window.matchMedia) {
   return -1;
  }
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
   return 0;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
   return 1;
  }
  return -1;
 },
 7175695: () => {
  if (typeof (Module["SDL3"]) !== "undefined") {
   var SDL3 = Module["SDL3"];
   SDL3.themeChangedMatchMedia.removeEventListener("change", SDL3.eventHandlerThemeChanged);
   SDL3.themeChangedMatchMedia = undefined;
   SDL3.eventHandlerThemeChanged = undefined;
  }
 },
 7175948: () => window.innerWidth,
 7175978: () => window.innerHeight,
 7176009: $0 => {
  Module["requestFullscreen"] = function(lockPointer, resizeCanvas) {
   _requestFullscreenThroughSDL($0);
  };
 },
 7176118: ($0, $1) => {
  var pngData = GROWABLE_HEAP_U8().buffer instanceof ArrayBuffer ? GROWABLE_HEAP_U8().subarray($0 >>> 0, $0 + $1 >>> 0) : GROWABLE_HEAP_U8().slice($0, $0 + $1);
  var blob = new Blob([ pngData ], {
   type: "image/png"
  });
  var url = URL.createObjectURL(blob);
  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
   link = document.createElement("link");
   link.rel = "icon";
   link.type = "image/png";
   document.head.appendChild(link);
  }
  if (link.href && link.href.startsWith("blob:")) {
   URL.revokeObjectURL(link.href);
  }
  link.href = url;
 },
 7176611: () => {
  Module["requestFullscreen"] = function(lockPointer, resizeCanvas) {};
 },
 7176685: () => window.innerWidth,
 7176715: () => window.innerHeight,
 7176746: $0 => {
  var canvas = document.querySelector(UTF8ToString($0));
  canvas.SDL3_original_position = canvas.style.position;
  canvas.SDL3_original_top = canvas.style.top;
  canvas.SDL3_original_left = canvas.style.left;
  var div = document.createElement("div");
  div.id = "SDL3_fill_document_background_elements";
  div.SDL3_canvas = canvas;
  div.SDL3_canvas_parent = canvas.parentNode;
  div.SDL3_canvas_nextsib = canvas.nextSibling;
  var children = Array.from(document.body.children);
  for (var child of children) {
   div.appendChild(child);
  }
  document.body.appendChild(div);
  div.style.display = "none";
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
 },
 7177444: () => {
  var div = document.getElementById("SDL3_fill_document_background_elements");
  if (div) {
   if (div.SDL3_canvas_nextsib) {
    div.SDL3_canvas_parent.insertBefore(div.SDL3_canvas, div.SDL3_canvas_nextsib);
   } else {
    div.SDL3_canvas_parent.appendChild(div.SDL3_canvas);
   }
   while (div.firstChild) {
    document.body.insertBefore(div.firstChild, div);
   }
   div.SDL3_canvas.style.position = div.SDL3_canvas.SDL3_original_position;
   div.SDL3_canvas.style.top = div.SDL3_canvas.SDL3_original_top;
   div.SDL3_canvas.style.left = div.SDL3_canvas.SDL3_original_left;
   div.remove();
  }
 },
 7178003: () => {
  if (window.matchMedia) {
   var SDL3 = Module["SDL3"];
   SDL3.eventHandlerThemeChanged = function(event) {
    _Emscripten_SendSystemThemeChangedEvent();
   };
   SDL3.themeChangedMatchMedia = window.matchMedia("(prefers-color-scheme: dark)");
   SDL3.themeChangedMatchMedia.addEventListener("change", SDL3.eventHandlerThemeChanged);
  }
 },
 7178325: ($0, $1, $2, $3, $4) => {
  var title = UTF8ToString($0);
  var message = UTF8ToString($1);
  var background = UTF8ToString($2);
  var color = UTF8ToString($3);
  var id = UTF8ToString($4);
  var dialog = document.createElement("dialog");
  dialog.classList.add("SDL3_messagebox");
  dialog.id = id;
  dialog.style.color = color;
  dialog.style.backgroundColor = background;
  document.body.append(dialog);
  var h1 = document.createElement("h1");
  h1.innerText = title;
  dialog.append(h1);
  var p = document.createElement("p");
  p.innerText = message;
  dialog.append(p);
  dialog.showModal();
 },
 7178866: ($0, $1, $2, $3, $4, $5, $6, $7) => {
  var dialog_id = UTF8ToString($0);
  var text = UTF8ToString($1);
  var responseId = $2;
  var clickOnReturn = $3;
  var clickOnEscape = $4;
  var border = UTF8ToString($5);
  var background = UTF8ToString($6);
  var hovered = UTF8ToString($7);
  var dialog = document.getElementById(dialog_id);
  if (!dialog) {
   return false;
  }
  var button = document.createElement("button");
  button.innerText = text;
  button.style.borderColor = border;
  button.style.backgroundColor = background;
  dialog.addEventListener("keydown", function(e) {
   if (clickOnReturn && e.key === "Enter") {
    e.preventDefault();
    button.click();
   } else if (clickOnEscape && e.key === "Escape") {
    e.preventDefault();
    button.click();
   }
  });
  dialog.addEventListener("cancel", function(e) {
   e.preventDefault();
  });
  button.onmouseenter = function(e) {
   button.style.backgroundColor = hovered;
  };
  button.onmouseleave = function(e) {
   button.style.backgroundColor = background;
  };
  button.onclick = function(e) {
   dialog.close(responseId);
  };
  dialog.append(button);
  return true;
 },
 7179875: $0 => {
  var dialog_id = UTF8ToString($0);
  var dialog = document.getElementById(dialog_id);
  if (!dialog) {
   return false;
  }
  return dialog.open;
 },
 7180013: $0 => {
  var dialog_id = UTF8ToString($0);
  var dialog = document.getElementById(dialog_id);
  if (!dialog) {
   return 0;
  }
  try {
   return parseInt(dialog.returnValue);
  } catch (e) {
   return 0;
  }
 },
 7180195: ($0, $1) => {
  alert(UTF8ToString($0) + "\n\n" + UTF8ToString($1));
 },
 7180252: () => {
  if (typeof (AudioContext) !== "undefined") {
   return true;
  } else if (typeof (webkitAudioContext) !== "undefined") {
   return true;
  }
  return false;
 },
 7180399: () => {
  if ((typeof (navigator.mediaDevices) !== "undefined") && (typeof (navigator.mediaDevices.getUserMedia) !== "undefined")) {
   return true;
  } else if (typeof (navigator.webkitGetUserMedia) !== "undefined") {
   return true;
  }
  return false;
 },
 7180633: () => {
  var SDL3 = Module["SDL3"];
  if (typeof (SDL3.audio_playback) === "undefined") {
   SDL3.audio_playback = {};
  }
  if (typeof (SDL3.audio_recording) === "undefined") {
   SDL3.audio_recording = {};
  }
  if (!SDL3.audioContext) {
   if (typeof (AudioContext) !== "undefined") {
    SDL3.audioContext = new AudioContext;
   } else if (typeof (webkitAudioContext) !== "undefined") {
    SDL3.audioContext = new webkitAudioContext;
   }
   if (SDL3.audioContext) {
    if ((typeof navigator.userActivation) === "undefined") {
     autoResumeAudioContext(SDL3.audioContext);
    }
   }
  }
  return (SDL3.audioContext !== undefined);
 },
 7181212: () => Module["SDL3"].audioContext.sampleRate,
 7181263: ($0, $1, $2, $3) => {
  var SDL3 = Module["SDL3"];
  var have_microphone = function(stream) {
   if (SDL3.audio_recording.silenceTimer !== undefined) {
    clearInterval(SDL3.audio_recording.silenceTimer);
    SDL3.audio_recording.silenceTimer = undefined;
    SDL3.audio_recording.silenceBuffer = undefined;
   }
   SDL3.audio_recording.mediaStreamNode = SDL3.audioContext.createMediaStreamSource(stream);
   SDL3.audio_recording.scriptProcessorNode = SDL3.audioContext.createScriptProcessor($1, $0, 1);
   SDL3.audio_recording.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {
    if ((SDL3 === undefined) || (SDL3.audio_recording === undefined)) {
     return;
    }
    audioProcessingEvent.outputBuffer.getChannelData(0).fill(0);
    SDL3.audio_recording.currentRecordingBuffer = audioProcessingEvent.inputBuffer;
    dynCall("ip", $2, [ $3 ]);
   };
   SDL3.audio_recording.mediaStreamNode.connect(SDL3.audio_recording.scriptProcessorNode);
   SDL3.audio_recording.scriptProcessorNode.connect(SDL3.audioContext.destination);
   SDL3.audio_recording.stream = stream;
  };
  var no_microphone = function(error) {};
  SDL3.audio_recording.silenceBuffer = SDL3.audioContext.createBuffer($0, $1, SDL3.audioContext.sampleRate);
  SDL3.audio_recording.silenceBuffer.getChannelData(0).fill(0);
  var silence_callback = function() {
   SDL3.audio_recording.currentRecordingBuffer = SDL3.audio_recording.silenceBuffer;
   dynCall("ip", $2, [ $3 ]);
  };
  SDL3.audio_recording.silenceTimer = setInterval(silence_callback, ($1 / SDL3.audioContext.sampleRate) * 1e3);
  if ((navigator.mediaDevices !== undefined) && (navigator.mediaDevices.getUserMedia !== undefined)) {
   navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
   }).then(have_microphone).catch(no_microphone);
  } else if (navigator.webkitGetUserMedia !== undefined) {
   navigator.webkitGetUserMedia({
    audio: true,
    video: false
   }, have_microphone, no_microphone);
  }
 },
 7183104: ($0, $1, $2, $3) => {
  var SDL3 = Module["SDL3"];
  SDL3.audio_playback.scriptProcessorNode = SDL3.audioContext["createScriptProcessor"]($1, 0, $0);
  SDL3.audio_playback.scriptProcessorNode["onaudioprocess"] = function(e) {
   if ((SDL3 === undefined) || (SDL3.audio_playback === undefined)) {
    return;
   }
   if (SDL3.audio_playback.silenceTimer !== undefined) {
    clearInterval(SDL3.audio_playback.silenceTimer);
    SDL3.audio_playback.silenceTimer = undefined;
    SDL3.audio_playback.silenceBuffer = undefined;
   }
   SDL3.audio_playback.currentPlaybackBuffer = e["outputBuffer"];
   dynCall("ip", $2, [ $3 ]);
  };
  SDL3.audio_playback.scriptProcessorNode["connect"](SDL3.audioContext["destination"]);
  if (SDL3.audioContext.state === "suspended") {
   SDL3.audio_playback.silenceBuffer = SDL3.audioContext.createBuffer($0, $1, SDL3.audioContext.sampleRate);
   SDL3.audio_playback.silenceBuffer.getChannelData(0).fill(0);
   var silence_callback = function() {
    if ((typeof navigator.userActivation) !== "undefined") {
     if (navigator.userActivation.hasBeenActive) {
      SDL3.audioContext.resume();
     }
    }
    SDL3.audio_playback.currentPlaybackBuffer = SDL3.audio_playback.silenceBuffer;
    dynCall("ip", $2, [ $3 ]);
    SDL3.audio_playback.currentPlaybackBuffer = undefined;
   };
   SDL3.audio_playback.silenceTimer = setInterval(silence_callback, ($1 / SDL3.audioContext.sampleRate) * 1e3);
  }
 },
 7184420: $0 => {
  var SDL3 = Module["SDL3"];
  if ($0) {
   if (SDL3.audio_recording.silenceTimer !== undefined) {
    clearInterval(SDL3.audio_recording.silenceTimer);
   }
   if (SDL3.audio_recording.stream !== undefined) {
    var tracks = SDL3.audio_recording.stream.getAudioTracks();
    for (var i = 0; i < tracks.length; i++) {
     SDL3.audio_recording.stream.removeTrack(tracks[i]);
    }
   }
   if (SDL3.audio_recording.scriptProcessorNode !== undefined) {
    SDL3.audio_recording.scriptProcessorNode.onaudioprocess = function(audioProcessingEvent) {};
    SDL3.audio_recording.scriptProcessorNode.disconnect();
   }
   if (SDL3.audio_recording.mediaStreamNode !== undefined) {
    SDL3.audio_recording.mediaStreamNode.disconnect();
   }
   SDL3.audio_recording = undefined;
  } else {
   if (SDL3.audio_playback.scriptProcessorNode != undefined) {
    SDL3.audio_playback.scriptProcessorNode.disconnect();
   }
   if (SDL3.audio_playback.silenceTimer !== undefined) {
    clearInterval(SDL3.audio_playback.silenceTimer);
   }
   SDL3.audio_playback = undefined;
  }
  if ((SDL3.audioContext !== undefined) && (SDL3.audio_playback === undefined) && (SDL3.audio_recording === undefined)) {
   SDL3.audioContext.close();
   SDL3.audioContext = undefined;
  }
 },
 7185576: ($0, $1) => {
  var SDL3 = Module["SDL3"];
  var buf = SDL3.CPtrToHeap32Index($0);
  var numChannels = SDL3.audio_playback.currentPlaybackBuffer["numberOfChannels"];
  for (var c = 0; c < numChannels; ++c) {
   var channelData = SDL3.audio_playback.currentPlaybackBuffer["getChannelData"](c);
   if (channelData.length != $1) {
    throw "Web Audio playback buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!";
   }
   for (var j = 0; j < $1; ++j) {
    channelData[j] = GROWABLE_HEAP_F32()[buf + (j * numChannels + c) >>> 0];
   }
  }
 },
 7186109: ($0, $1) => {
  var SDL3 = Module["SDL3"];
  var numChannels = SDL3.audio_recording.currentRecordingBuffer.numberOfChannels;
  for (var c = 0; c < numChannels; ++c) {
   var channelData = SDL3.audio_recording.currentRecordingBuffer.getChannelData(c);
   if (channelData.length != $1) {
    throw "Web Audio recording buffer length mismatch! Destination size: " + channelData.length + " samples vs expected " + $1 + " samples!";
   }
   if (numChannels == 1) {
    for (var j = 0; j < $1; ++j) {
     setValue($0 + (j * 4), channelData[j], "float");
    }
   } else {
    for (var j = 0; j < $1; ++j) {
     setValue($0 + (((j * numChannels) + c) * 4), channelData[j], "float");
    }
   }
  }
 },
 7186736: () => {
  Module["SDL3"].dummy_audio = {};
  Module["SDL3"].dummy_audio.timers = [];
  Module["SDL3"].dummy_audio.timers[0] = undefined;
  Module["SDL3"].dummy_audio.timers[1] = undefined;
 },
 7186913: ($0, $1, $2, $3, $4) => {
  var a = Module["SDL3"].dummy_audio;
  if (a.timers[$0] !== undefined) {
   clearInterval(a.timers[$0]);
  }
  a.timers[$0] = setInterval(function() {
   dynCall("vi", $3, [ $4 ]);
  }, ($1 / $2) * 1e3);
 },
 7187105: $0 => {
  var a = Module["SDL3"].dummy_audio;
  if (a.timers[$0] !== undefined) {
   clearInterval(a.timers[$0]);
  }
  a.timers[$0] = undefined;
 },
 7187236: () => {
  Module["SDL3"].camera = {};
 },
 7187268: () => (navigator.mediaDevices === undefined) ? 0 : 1,
 7187327: ($0, $1, $2, $3, $4) => {
  const device = $0;
  const w = $1;
  const h = $2;
  const framerate_numerator = $3;
  const framerate_denominator = $4;
  const outcome = Module._SDLEmscriptenCameraPermissionOutcome;
  const iterate = Module._SDLEmscriptenThreadIterate;
  const constraints = {};
  if ((w <= 0) || (h <= 0)) {
   constraints.video = true;
  } else {
   constraints.video = {};
   constraints.video.width = w;
   constraints.video.height = h;
  }
  if ((framerate_numerator > 0) && (framerate_denominator > 0)) {
   var fps = framerate_numerator / framerate_denominator;
   constraints.video.frameRate = {
    ideal: fps
   };
  }
  function grabNextCameraFrame() {
   const SDL3 = Module["SDL3"];
   if ((typeof (SDL3) === "undefined") || (typeof (SDL3.camera) === "undefined") || (typeof (SDL3.camera.stream) === "undefined")) {
    return;
   }
   const nextframems = SDL3.camera.next_frame_time;
   const now = performance.now();
   if (now >= nextframems) {
    iterate(device);
    while (SDL3.camera.next_frame_time < now) {
     SDL3.camera.next_frame_time += SDL3.camera.fpsincrms;
    }
   }
   requestAnimationFrame(grabNextCameraFrame);
  }
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
   const settings = stream.getVideoTracks()[0].getSettings();
   const actualw = settings.width;
   const actualh = settings.height;
   const actualfps = settings.frameRate;
   console.log("Camera is opened! Actual spec: (" + actualw + "x" + actualh + "), fps=" + actualfps);
   if (outcome(device, 1, actualw, actualh, actualfps)) {
    const video = document.createElement("video");
    video.width = actualw;
    video.height = actualh;
    video.style.display = "none";
    video.srcObject = stream;
    const canvas = document.createElement("canvas");
    canvas.width = actualw;
    canvas.height = actualh;
    canvas.style.display = "none";
    const ctx2d = canvas.getContext("2d");
    const SDL3 = Module["SDL3"];
    SDL3.camera.width = actualw;
    SDL3.camera.height = actualh;
    SDL3.camera.fps = actualfps;
    SDL3.camera.fpsincrms = 1e3 / actualfps;
    SDL3.camera.stream = stream;
    SDL3.camera.video = video;
    SDL3.camera.canvas = canvas;
    SDL3.camera.ctx2d = ctx2d;
    SDL3.camera.next_frame_time = performance.now();
    video.play();
    video.addEventListener("loadedmetadata", () => {
     grabNextCameraFrame();
    });
   }
  }).catch(err => {
   console.error("Tried to open camera but it threw an error! " + err.name + ": " + err.message);
   outcome(device, 0, 0, 0, 0);
  });
 },
 7189633: () => {
  const SDL3 = Module["SDL3"];
  if ((typeof (SDL3) === "undefined") || (typeof (SDL3.camera) === "undefined") || (typeof (SDL3.camera.stream) === "undefined")) {
   return;
  }
  SDL3.camera.stream.getTracks().forEach(track => track.stop());
  SDL3.camera = {};
 },
 7189884: ($0, $1, $2) => {
  const w = $0;
  const h = $1;
  const rgba = $2;
  const SDL3 = Module["SDL3"];
  if ((typeof (SDL3) === "undefined") || (typeof (SDL3.camera) === "undefined") || (typeof (SDL3.camera.ctx2d) === "undefined")) {
   return 0;
  }
  SDL3.camera.ctx2d.drawImage(SDL3.camera.video, 0, 0, w, h);
  const imgrgba = SDL3.camera.ctx2d.getImageData(0, 0, w, h).data;
  GROWABLE_HEAP_U8().set(imgrgba, rgba >>> 0);
  return 1;
 },
 7190262: () => {
  if (typeof (Module["SDL3"]) !== "undefined") {
   Module["SDL3"].camera = undefined;
  }
 },
 7190349: $0 => {
  let gamepad = navigator["getGamepads"]()[$0];
  if (!gamepad) {
   return 0;
  }
  let vendor_str = "Vendor: ";
  if (gamepad["id"]["indexOf"](vendor_str) > 0) {
   let vendor_str_index = gamepad["id"]["indexOf"](vendor_str) + vendor_str["length"];
   return parseInt(gamepad["id"]["substr"](vendor_str_index, 4), 16);
  }
  let id_split = gamepad["id"]["split"]("-");
  if (id_split["length"] > 1 && !isNaN(parseInt(id_split[0], 16))) {
   return parseInt(id_split[0], 16);
  }
  return 0;
 },
 7190814: $0 => {
  let gamepad = navigator["getGamepads"]()[$0];
  if (!gamepad) {
   return 0;
  }
  let product_str = "Product: ";
  if (gamepad["id"]["indexOf"](product_str) > 0) {
   let product_str_index = gamepad["id"]["indexOf"](product_str) + product_str["length"];
   return parseInt(gamepad["id"]["substr"](product_str_index, 4), 16);
  }
  let id_split = gamepad["id"]["split"]("-");
  if (id_split["length"] > 1 && !isNaN(parseInt(id_split[1], 16))) {
   return parseInt(id_split[1], 16);
  }
  return 0;
 },
 7191286: $0 => {
  let gamepad = navigator["getGamepads"]()[$0];
  if (!gamepad) {
   return 0;
  }
  return gamepad["id"]["toLowerCase"]()["indexOf"]("xinput") >= 0;
 },
 7191429: $0 => {
  let gamepads = navigator["getGamepads"]();
  if (!gamepads) {
   return 0;
  }
  let gamepad = gamepads[$0];
  if (!gamepad || !gamepad["vibrationActuator"]) {
   return 0;
  }
  return 1;
 },
 7191604: ($0, $1, $2) => {
  let gamepads = navigator["getGamepads"]();
  if (!gamepads) {
   return 0;
  }
  let gamepad = gamepads[$0];
  if (!gamepad || !gamepad["vibrationActuator"]) {
   return 0;
  }
  gamepad["vibrationActuator"]["playEffect"]("dual-rumble", {
   "startDelay": 0,
   "duration": 3e3,
   "weakMagnitude": $2 / 65535,
   "strongMagnitude": $1 / 65535
  });
  return 1;
 },
 7191940: () => {
  if (typeof (Module["SDL3"]) === "undefined") {
   Module["SDL3"] = {};
  }
  var SDL3 = Module["SDL3"];
  if (typeof (SDL3.JSVarToCPtr) === "undefined") {
   SDL3.JSVarToCPtr = function(v) {
    return v;
   };
  }
  if (typeof (SDL3.CPtrToHeap32Index) === "undefined") {
   SDL3.CPtrToHeap32Index = function(ptr) {
    return ptr >>> 2;
   };
  }
 },
 7192254: () => {
  console.log("WASM_JIT_PLACEHOLDER_STRAY " + (new Error).stack);
 },
 7192326: ($0, $1, $2, $3, $4, $5, $6) => {
  var f = (new Error).stack.split("\n").slice(2, 18).map(function(l) {
   return l.trim().split(" ")[1];
  }).join("<");
  console.log("JITERP_ENTRY_SITE " + $0 + " " + ($1 ? "inst" : "static") + ($2 ? "_ret_" : "_") + $3 + ($4 ? " unbox" : "") + ($5 ? " slot" : "") + " | " + UTF8ToString($6) + " | " + f);
 },
 7192642: $0 => {
  var l = Error.stackTraceLimit;
  Error.stackTraceLimit = 40;
  var s = (new Error).stack;
  Error.stackTraceLimit = l;
  console.log(UTF8ToString($0) + " " + s);
 },
 7192805: $0 => {
  console.log(UTF8ToString($0));
 },
 7192842: ($0, $1) => {
  var lp = $1 < 0 ? $1 + 4294967296 : $1;
  var f = wasmTable.get($0);
  if (!f) return 0;
  GROWABLE_HEAP_I32()[lp / 4 >>> 0] = (f.length | 0);
  if ((f.length | 0) !== 2) return 2;
  if (Module.__wjSlotFn && Module.__wjSlotFn.has($0) && Module.__wjSlotFn.get($0) !== f) return 3;
  return 1;
 },
 7193110: $0 => {
  setInterval(function() {
   Module._mono_wasm_jit_edge_tick();
  }, $0);
 },
 7193185: $0 => {
  setInterval(function() {
   Module._mono_wasm_jit_edge_tick();
  }, $0);
 },
 7193260: ($0, $1) => {
  var fn = wasmTable.get($1);
  wasmTable.set($0, fn);
  if (Module.__wjSlotFn) Module.__wjSlotFn.set($0, fn);
  if (!Module.__wjAliasOf) {
   Module.__wjAliasOf = new Map;
   Module.__wjAliasRepoints = 0;
   Module.__wjAliasRepoint = function(f, oldfn, newfn) {
    var al = Module.__wjAliasOf.get(f);
    if (!al || oldfn === newfn) return;
    var i = 0;
    while (i < al.length) {
     if (oldfn && wasmTable.get(al[i]) === oldfn) {
      wasmTable.set(al[i], newfn);
      if (Module.__wjSlotFn) Module.__wjSlotFn.set(al[i], newfn);
      Module.__wjAliasRepoints++;
      i++;
     } else {
      al[i] = al[al.length - 1];
      al.pop();
     }
    }
   };
  }
  var al = Module.__wjAliasOf.get($1);
  if (!al) Module.__wjAliasOf.set($1, al = []);
  if (al.indexOf($0) < 0) al.push($0);
 },
 7193977: () => {
  var err = new Error;
  console.log("Stacktrace: \n");
  console.log(err.stack);
 },
 7194057: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) => {
  var p = $2 < 0 ? $2 + 4294967296 : $2;
  var eb = $4 < 0 ? $4 + 4294967296 : $4;
  var op = $6 < 0 ? $6 + 4294967296 : $6;
  var t0 = performance.now();
  try {
   var b = GROWABLE_HEAP_U8().slice(p, p + $3);
   if (!Module.__wjHelperImports) {
    Module.__wjSlotFn = new Map;
    Module.__wjSlotChanged = 0;
    Module.__wjHelperImports = new Proxy({}, {
     get: function(t, k) {
      if (typeof k !== "string") return undefined;
      if (!/^[0-9]+$/.test(k)) return undefined;
      var i = Number(k);
      var f = wasmTable.get(i);
      if (Module.__wjSlotFn && Module.__wjSlotFn.has(i) && Module.__wjSlotFn.get(i) !== f) {
       Module.__wjSlotChanged = (Module.__wjSlotChanged | 0) + 1;
       if (Module.__wjSlotChanged <= 20) console.log("WASM_JIT_IMPORT_SLOT_CHANGED slot=" + i + " n=" + Module.__wjSlotChanged);
      }
      return f;
     }
    });
   }
   var inst = new WebAssembly.Instance(new WebAssembly.Module(b), {
    m: {
     h: wasmMemory
    },
    f: {
     f: wasmTable
    },
    x: {
     e: wasmExports && wasmExports["__cpp_exception"]
    },
    s: {
     p: wasmExports && wasmExports["__stack_pointer"],
     l: $7,
     c: $8,
     v: $9,
     n: $10,
     d: $11,
     m: $12,
     b: $13,
     i: $14,
     g: Module._mono_wasm_jit_worker_action_addr()
    },
    h: Module.__wjHelperImports
   });
   if (op) GROWABLE_HEAP_F64()[op / 8 >>> 0] = performance.now() - t0;
   if ($0 > 0 && $1 > 0) {
    var oldf = wasmTable.get($1);
    wasmTable.set($0, inst.exports.e);
    wasmTable.set($1, inst.exports.f);
    if (Module.__wjSlotFn) {
     Module.__wjSlotFn.set($0, inst.exports.e);
     Module.__wjSlotFn.set($1, inst.exports.f);
    }
    if (Module.__wjAliasRepoint) Module.__wjAliasRepoint($1, oldf, inst.exports.f);
   }
   return 1;
  } catch (e) {
   if (op) GROWABLE_HEAP_F64()[op / 8 >>> 0] = performance.now() - t0;
   var _ex = "";
   try {
    _ex = " exports=[" + Object.keys(inst && inst.exports || {}).join(",") + "]";
   } catch (e2) {}
   try {
    var _hm = /"h" "([0-9]+)"/.exec("" + e);
    if (_hm) {
     var _hi = Number(_hm[1]);
     var _hf = wasmTable.get(_hi);
     var _vs = Module.__wjVslowFn;
     _ex += " [h " + _hi + ": table " + (_hf ? ("fn name=" + _hf.name + " len=" + _hf.length) : "null") + " vslow_here=" + !!(_vs && _vs.has(_hi)) + " same_fn=" + !!(_vs && _vs.get(_hi) === _hf) + " slotfn=" + !!(Module.__wjSlotFn && Module.__wjSlotFn.has(_hi)) + " aliased=" + !!(Module.__wjAliasOf && Module.__wjAliasOf.has(_hi)) + "]";
    }
   } catch (e3) {}
   if (eb) stringToUTF8("" + e + _ex, eb, $5);
   return 0;
  }
 },
 7196328: ($0, $1, $2) => {
  var p = $0 < 0 ? $0 + 4294967296 : $0;
  try {
   if (!Module.__wjHelperImports) {
    Module.__wjSlotFn = new Map;
    Module.__wjSlotChanged = 0;
    Module.__wjHelperImports = new Proxy({}, {
     get: function(t, k) {
      if (typeof k !== "string" || !/^[0-9]+$/.test(k)) return undefined;
      return wasmTable.get(Number(k));
     }
    });
   }
   new WebAssembly.Instance(new WebAssembly.Module(GROWABLE_HEAP_U8().slice(p, p + $1)), {
    m: {
     h: wasmMemory
    },
    f: {
     f: wasmTable
    },
    s: {
     p: wasmExports["__stack_pointer"],
     l: 0,
     c: 0,
     v: 0,
     n: 0,
     d: 0,
     m: 0,
     b: 0,
     i: 0,
     g: 0
    },
    h: Module.__wjHelperImports
   });
   (Module.__wjVslowFn || (Module.__wjVslowFn = new Map)).set($2, wasmTable.get($2));
   return 1;
  } catch (e) {
   if ((Module.__wjVslowErr = (Module.__wjVslowErr | 0) + 1) <= 8) console.log("WASM_JIT_VSLOW_FAIL " + e);
   return 0;
  }
 },
 7197129: ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) => {
  var es = $0 < 0 ? $0 + 4294967296 : $0;
  var fs = $1 < 0 ? $1 + 4294967296 : $1;
  var p = $3 < 0 ? $3 + 4294967296 : $3;
  var eb = $5 < 0 ? $5 + 4294967296 : $5;
  var op = $7 < 0 ? $7 + 4294967296 : $7;
  var t0 = performance.now();
  try {
   var b = GROWABLE_HEAP_U8().slice(p, p + $4);
   if (!Module.__wjHelperImports) {
    Module.__wjSlotFn = new Map;
    Module.__wjSlotChanged = 0;
    Module.__wjHelperImports = new Proxy({}, {
     get: function(t, k) {
      if (typeof k !== "string") return undefined;
      if (!/^[0-9]+$/.test(k)) return undefined;
      var i = Number(k);
      var f = wasmTable.get(i);
      if (Module.__wjSlotFn && Module.__wjSlotFn.has(i) && Module.__wjSlotFn.get(i) !== f) {
       Module.__wjSlotChanged = (Module.__wjSlotChanged | 0) + 1;
       if (Module.__wjSlotChanged <= 20) console.log("WASM_JIT_IMPORT_SLOT_CHANGED slot=" + i + " n=" + Module.__wjSlotChanged);
      }
      return f;
     }
    });
   }
   var inst = new WebAssembly.Instance(new WebAssembly.Module(b), {
    m: {
     h: wasmMemory
    },
    f: {
     f: wasmTable
    },
    x: {
     e: wasmExports && wasmExports["__cpp_exception"]
    },
    s: {
     p: wasmExports && wasmExports["__stack_pointer"],
     l: $8,
     c: $9,
     v: $10,
     n: $11,
     d: $12,
     m: $13,
     b: $14,
     i: $15,
     g: Module._mono_wasm_jit_worker_action_addr()
    },
    h: Module.__wjHelperImports
   });
   if (op) GROWABLE_HEAP_F64()[op / 8 >>> 0] = performance.now() - t0;
   var k = 0;
   var ef = null;
   var ff = null;
   var eslot = new Array($2);
   var fslot = new Array($2);
   var efn = new Array($2);
   var ffn = new Array($2);
   while (k < $2) {
    ef = inst.exports["e" + k];
    ff = inst.exports["f" + k];
    if (!ef || !ff) throw new Error("batched module missing export e" + k);
    eslot[k] = GROWABLE_HEAP_I32()[es / 4 + k >>> 0];
    fslot[k] = GROWABLE_HEAP_I32()[fs / 4 + k >>> 0];
    if (!(eslot[k] > 0) || !(fslot[k] > 0)) throw new Error("batched module bad slot for member " + k + ": e=" + eslot[k] + " f=" + fslot[k]);
    wasmTable.get(eslot[k]);
    wasmTable.get(fslot[k]);
    efn[k] = ef;
    ffn[k] = ff;
    k = k + 1;
   }
   k = 0;
   var oldf = null;
   while (k < $2) {
    oldf = wasmTable.get(fslot[k]);
    wasmTable.set(eslot[k], efn[k]);
    wasmTable.set(fslot[k], ffn[k]);
    if (Module.__wjSlotFn) {
     Module.__wjSlotFn.set(eslot[k], efn[k]);
     Module.__wjSlotFn.set(fslot[k], ffn[k]);
    }
    if (Module.__wjAliasRepoint) Module.__wjAliasRepoint(fslot[k], oldf, ffn[k]);
    k = k + 1;
   }
   return 1;
  } catch (e) {
   if (op) GROWABLE_HEAP_F64()[op / 8 >>> 0] = performance.now() - t0;
   var _ex = "";
   try {
    var _hm = /"h" "([0-9]+)"/.exec("" + e);
    if (_hm) {
     var _hi = Number(_hm[1]);
     var _hf = wasmTable.get(_hi);
     var _vs = Module.__wjVslowFn;
     _ex = " [h " + _hi + ": table " + (_hf ? ("fn name=" + _hf.name + " len=" + _hf.length) : "null") + " vslow_here=" + !!(_vs && _vs.has(_hi)) + " same_fn=" + !!(_vs && _vs.get(_hi) === _hf) + " slotfn=" + !!(Module.__wjSlotFn && Module.__wjSlotFn.has(_hi)) + " aliased=" + !!(Module.__wjAliasOf && Module.__wjAliasOf.has(_hi)) + "]";
    }
   } catch (e3) {}
   if (eb) stringToUTF8("" + e + _ex, eb, $6);
   return 0;
  }
 },
 7199986: $0 => {
  var s = Module.__wjStubFn && Module.__wjStubFn.get($0);
  if (!s) return 0;
  var old = wasmTable.get($0);
  if (old !== s) {
   wasmTable.set($0, s);
   if (Module.__wjAliasRepoint) Module.__wjAliasRepoint($0, old, s);
  }
  if (Module.__wjSlotFn) Module.__wjSlotFn.set($0, s);
  return 1;
 },
 7200268: () => {
  var o = Error.stackTraceLimit;
  Error.stackTraceLimit = 10;
  var st = (new Error).stack || "";
  Error.stackTraceLimit = o;
  var ls = st.split("\n");
  var fr = [];
  var fnv = function(x) {
   var h = 2166136261 | 0;
   for (var k = 0; k < x.length; k++) h = Math.imul(h ^ (x.charCodeAt(k) & 255), 16777619);
   return h || 1;
  };
  for (var i = 0; i < ls.length && fr.length < 2; i++) {
   var l = ls[i];
   var u = l.lastIndexOf(" (wasm://wasm/");
   if (u < 0) {
    if (fr.length && l.indexOf("    at ") === 0) fr.push([ 3, 0 ]);
    continue;
   }
   var url = l.slice(u + 14);
   var c = url.indexOf(":wasm-function[");
   if (c < 0) continue;
   var mh = url.slice(0, c);
   var d = mh.lastIndexOf("-");
   var mod = d > 0 ? mh.slice(0, d) : mh;
   if (mod === "dotnet.native.wasm") {
    if (fr.length) fr.push([ 1, 0 ]);
    continue;
   }
   var t = l.slice(l.indexOf("at ") + 3, u);
   var fn = t.indexOf(mod + ".") === 0 ? t.slice(mod.length + 1) : t;
   if (fr.length && (fn === "entry" || fn.slice(-8) === " [entry]")) {
    fr.push([ 2, 0 ]);
    continue;
   }
   fr.push([ 0, fnv(fn) ]);
  }
  if (fr.length === 2 && fr[0][0] === 0) Module._mono_wasm_jit_edge_record(fr[0][1], fr[1][0], fr[1][1]);
 },
 7201413: ($0, $1, $2) => {
  var p = $0 < 0 ? $0 + 4294967296 : $0;
  try {
   if (!Module.__wjHelperImports) {
    Module.__wjSlotFn = new Map;
    Module.__wjSlotChanged = 0;
    Module.__wjHelperImports = new Proxy({}, {
     get: function(t, k) {
      if (typeof k !== "string" || !/^[0-9]+$/.test(k)) return undefined;
      return wasmTable.get(Number(k));
     }
    });
   }
   var prev = $2 > 0 ? wasmTable.get($2) : null;
   new WebAssembly.Instance(new WebAssembly.Module(GROWABLE_HEAP_U8().slice(p, p + $1)), {
    m: {
     h: wasmMemory
    },
    f: {
     f: wasmTable
    },
    s: {
     p: wasmExports["__stack_pointer"],
     l: 0,
     c: 0,
     v: 0,
     n: 0,
     d: 0,
     m: 0,
     b: 0,
     i: 0,
     g: 0
    },
    h: Module.__wjHelperImports
   });
   if ($2 > 0) {
    var stub = wasmTable.get($2);
    (Module.__wjStubFn || (Module.__wjStubFn = new Map)).set($2, stub);
    if (prev && prev !== stub && Module.__wjAliasRepoint) Module.__wjAliasRepoint($2, prev, stub);
   }
   return 1;
  } catch (e) {
   if ((Module.__wjLazyBankErr = (Module.__wjLazyBankErr | 0) + 1) <= 8) console.log("WASM_JIT_LAZY_BANK_FAIL " + e);
   return 0;
  }
 },
 7202398: $0 => {
  var m = Module.__wjSlotFn;
  var fn = m && m.get($0);
  if (!fn) return 0;
  if (wasmTable.get($0) !== fn) {
   wasmTable.set($0, fn);
   return 2;
  }
  return 1;
 }
};

function unbox_small_structs(type_ptr) {
 type_ptr = type_ptr;
 var type_id = GROWABLE_HEAP_U16()[(type_ptr + 6 >> 1) + 0 >>> 0];
 while (type_id === 13) {
  if (GROWABLE_HEAP_U32()[(type_ptr >> 2) + 0 >>> 0] > 16) {
   break;
  }
  var elements = GROWABLE_HEAP_U32()[(type_ptr + 8 >> 2) + 0 >>> 0];
  var first_element = GROWABLE_HEAP_U32()[(elements >> 2) + 0 >>> 0];
  if (first_element === 0) {
   type_id = 0;
   break;
  } else if (GROWABLE_HEAP_U32()[(elements >> 2) + 1 >>> 0] === 0) {
   type_ptr = first_element;
   type_id = GROWABLE_HEAP_U16()[(first_element + 6 >> 1) + 0 >>> 0];
  } else {
   break;
  }
 }
 return [ type_ptr, type_id ];
}

function ffi_call_js(cif, fn, rvalue, avalue) {
 cif = cif;
 fn = fn;
 rvalue = rvalue;
 avalue = avalue;
 var abi = GROWABLE_HEAP_U32()[(cif >> 2) + 0 >>> 0];
 var nargs = GROWABLE_HEAP_U32()[(cif >> 2) + 1 >>> 0];
 var nfixedargs = GROWABLE_HEAP_U32()[(cif >> 2) + 6 >>> 0];
 var arg_types_ptr = GROWABLE_HEAP_U32()[(cif >> 2) + 2 >>> 0];
 var flags = GROWABLE_HEAP_U32()[(cif >> 2) + 5 >>> 0];
 var rtype_unboxed = unbox_small_structs(GROWABLE_HEAP_U32()[(cif >> 2) + 3 >>> 0]);
 var rtype_ptr = rtype_unboxed[0];
 var rtype_id = rtype_unboxed[1];
 var orig_stack_ptr = stackSave();
 var cur_stack_ptr = orig_stack_ptr;
 var args = [];
 var ret_by_arg = false;
 if (rtype_id === 15) {
  throw new Error("complex ret marshalling nyi");
 }
 if (rtype_id < 0 || rtype_id > 15) {
  throw new Error("Unexpected rtype " + rtype_id);
 }
 if (rtype_id === 4 || rtype_id === 13) {
  args.push(rvalue);
  ret_by_arg = true;
 }
 for (var i = 0; i < nfixedargs; i++) {
  var arg_ptr = GROWABLE_HEAP_U32()[(avalue >> 2) + i >>> 0];
  var arg_unboxed = unbox_small_structs(GROWABLE_HEAP_U32()[(arg_types_ptr >> 2) + i >>> 0]);
  var arg_type_ptr = arg_unboxed[0];
  var arg_type_id = arg_unboxed[1];
  switch (arg_type_id) {
  case 1:
  case 10:
  case 9:
   args.push(GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 0 >>> 0]);
   break;

  case 2:
   args.push(GROWABLE_HEAP_F32()[(arg_ptr >> 2) + 0 >>> 0]);
   break;

  case 3:
   args.push(GROWABLE_HEAP_F64()[(arg_ptr >> 3) + 0 >>> 0]);
   break;

  case 5:
   args.push(GROWABLE_HEAP_U8()[arg_ptr + 0 >>> 0]);
   break;

  case 6:
   args.push(GROWABLE_HEAP_I8()[arg_ptr + 0 >>> 0]);
   break;

  case 7:
   args.push(GROWABLE_HEAP_U16()[(arg_ptr >> 1) + 0 >>> 0]);
   break;

  case 8:
   args.push(GROWABLE_HEAP_I16()[(arg_ptr >> 1) + 0 >>> 0]);
   break;

  case 11:
  case 12:
   args.push(HEAPU64[(arg_ptr >> 3) + 0]);
   break;

  case 4:
   args.push(HEAPU64[(arg_ptr >> 3) + 0]);
   args.push(HEAPU64[(arg_ptr >> 3) + 1]);
   break;

  case 13:
   var size = GROWABLE_HEAP_U32()[(arg_type_ptr >> 2) + 0 >>> 0];
   var align = GROWABLE_HEAP_U16()[(arg_type_ptr + 4 >> 1) + 0 >>> 0];
   ((cur_stack_ptr -= (size)), (cur_stack_ptr &= (~((align) - 1))));
   GROWABLE_HEAP_I8().subarray(cur_stack_ptr >>> 0, cur_stack_ptr + size >>> 0).set(GROWABLE_HEAP_I8().subarray(arg_ptr >>> 0, arg_ptr + size >>> 0));
   args.push(cur_stack_ptr);
   break;

  case 14:
   args.push(GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 0 >>> 0]);
   break;

  case 15:
   throw new Error("complex marshalling nyi");

  default:
   throw new Error("Unexpected type " + arg_type_id);
  }
 }
 if (flags & 1) {
  var struct_arg_info = [];
  for (var i = nargs - 1; i >= nfixedargs; i--) {
   var arg_ptr = GROWABLE_HEAP_U32()[(avalue >> 2) + i >>> 0];
   var arg_unboxed = unbox_small_structs(GROWABLE_HEAP_U32()[(arg_types_ptr >> 2) + i >>> 0]);
   var arg_type_ptr = arg_unboxed[0];
   var arg_type_id = arg_unboxed[1];
   switch (arg_type_id) {
   case 5:
   case 6:
    ((cur_stack_ptr -= (1)), (cur_stack_ptr &= (~((1) - 1))));
    GROWABLE_HEAP_U8()[cur_stack_ptr + 0 >>> 0] = GROWABLE_HEAP_U8()[arg_ptr + 0 >>> 0];
    break;

   case 7:
   case 8:
    ((cur_stack_ptr -= (2)), (cur_stack_ptr &= (~((2) - 1))));
    GROWABLE_HEAP_U16()[(cur_stack_ptr >> 1) + 0 >>> 0] = GROWABLE_HEAP_U16()[(arg_ptr >> 1) + 0 >>> 0];
    break;

   case 1:
   case 9:
   case 10:
   case 2:
    ((cur_stack_ptr -= (4)), (cur_stack_ptr &= (~((4) - 1))));
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 0 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 0 >>> 0];
    break;

   case 3:
   case 11:
   case 12:
    ((cur_stack_ptr -= (8)), (cur_stack_ptr &= (~((8) - 1))));
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 0 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 0 >>> 0];
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 1 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 1 >>> 0];
    break;

   case 4:
    ((cur_stack_ptr -= (16)), (cur_stack_ptr &= (~((8) - 1))));
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 0 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 0 >>> 0];
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 1 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 1 >>> 0];
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 2 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 2 >>> 0];
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 3 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 3 >>> 0];
    break;

   case 13:
    ((cur_stack_ptr -= (4)), (cur_stack_ptr &= (~((4) - 1))));
    struct_arg_info.push([ cur_stack_ptr, arg_ptr, GROWABLE_HEAP_U32()[(arg_type_ptr >> 2) + 0 >>> 0], GROWABLE_HEAP_U16()[(arg_type_ptr + 4 >> 1) + 0 >>> 0] ]);
    break;

   case 14:
    ((cur_stack_ptr -= (4)), (cur_stack_ptr &= (~((4) - 1))));
    GROWABLE_HEAP_U32()[(cur_stack_ptr >> 2) + 0 >>> 0] = GROWABLE_HEAP_U32()[(arg_ptr >> 2) + 0 >>> 0];
    break;

   case 15:
    throw new Error("complex arg marshalling nyi");

   default:
    throw new Error("Unexpected argtype " + arg_type_id);
   }
  }
  args.push(cur_stack_ptr);
  for (var i = 0; i < struct_arg_info.length; i++) {
   var struct_info = struct_arg_info[i];
   var arg_target = struct_info[0];
   var arg_ptr = struct_info[1];
   var size = struct_info[2];
   var align = struct_info[3];
   ((cur_stack_ptr -= (size)), (cur_stack_ptr &= (~((align) - 1))));
   GROWABLE_HEAP_I8().subarray(cur_stack_ptr >>> 0, cur_stack_ptr + size >>> 0).set(GROWABLE_HEAP_I8().subarray(arg_ptr >>> 0, arg_ptr + size >>> 0));
   GROWABLE_HEAP_U32()[(arg_target >> 2) + 0 >>> 0] = cur_stack_ptr;
  }
 }
 stackRestore(cur_stack_ptr);
 stackAlloc(0);
 0;
 var result = getWasmTableEntry(fn).apply(null, args);
 stackRestore(orig_stack_ptr);
 if (ret_by_arg) {
  return;
 }
 switch (rtype_id) {
 case 0:
  break;

 case 1:
 case 9:
 case 10:
  GROWABLE_HEAP_U32()[(rvalue >> 2) + 0 >>> 0] = result;
  break;

 case 2:
  GROWABLE_HEAP_F32()[(rvalue >> 2) + 0 >>> 0] = result;
  break;

 case 3:
  GROWABLE_HEAP_F64()[(rvalue >> 3) + 0 >>> 0] = result;
  break;

 case 5:
 case 6:
  GROWABLE_HEAP_U8()[rvalue + 0 >>> 0] = result;
  break;

 case 7:
 case 8:
  GROWABLE_HEAP_U16()[(rvalue >> 1) + 0 >>> 0] = result;
  break;

 case 11:
 case 12:
  HEAPU64[(rvalue >> 3) + 0] = result;
  break;

 case 14:
  GROWABLE_HEAP_U32()[(rvalue >> 2) + 0 >>> 0] = result;
  break;

 case 15:
  throw new Error("complex ret marshalling nyi");

 default:
  throw new Error("Unexpected rtype " + rtype_id);
 }
}

/** @constructor */ function ExitStatus(status) {
 this.name = "ExitStatus";
 this.message = `Program terminated with exit(${status})`;
 this.status = status;
}

var terminateWorker = worker => {
 worker.terminate();
 worker.onmessage = e => {};
};

var killThread = pthread_ptr => {
 var worker = PThread.pthreads[pthread_ptr];
 delete PThread.pthreads[pthread_ptr];
 terminateWorker(worker);
 __emscripten_thread_free_data(pthread_ptr);
 PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
 worker.pthread_ptr = 0;
};

var cancelThread = pthread_ptr => {
 var worker = PThread.pthreads[pthread_ptr];
 worker.postMessage({
  "cmd": "cancel"
 });
};

var cleanupThread = pthread_ptr => {
 var worker = PThread.pthreads[pthread_ptr];
 PThread.returnWorkerToPool(worker);
};

var zeroMemory = (address, size) => {
 GROWABLE_HEAP_U8().fill(0, address, address + size);
 return address;
};

var spawnThread = threadParams => {
 var worker = PThread.getNewWorker();
 if (!worker) {
  return 6;
 }
 PThread.runningWorkers.push(worker);
 PThread.pthreads[threadParams.pthread_ptr] = worker;
 worker.pthread_ptr = threadParams.pthread_ptr;
 var msg = {
  "cmd": "run",
  "start_routine": threadParams.startRoutine,
  "arg": threadParams.arg,
  "pthread_ptr": threadParams.pthread_ptr
 };
 msg.moduleCanvasId = threadParams.moduleCanvasId;
 msg.offscreenCanvases = threadParams.offscreenCanvases;
 worker.postMessage(msg, threadParams.transferList);
 return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var withStackSave = f => {
 var stack = stackSave();
 var ret = f();
 stackRestore(stack);
 return ret;
};

var MAX_INT53 = 9007199254740992;

var MIN_INT53 = -9007199254740992;

var bigintToI53Checked = num => (num < MIN_INT53 || num > MAX_INT53) ? NaN : Number(num);

/** @type{function(number, (number|boolean), ...number)} */ var proxyToMainThread = (funcIndex, emAsmAddr, sync, ...callArgs) => withStackSave(() => {
 var serializedNumCallArgs = callArgs.length * 2;
 var args = stackAlloc(serializedNumCallArgs * 8);
 var b = ((args) >>> 3);
 for (var i = 0; i < callArgs.length; i++) {
  var arg = callArgs[i];
  if (typeof arg == "bigint") {
   HEAP64[b + 2 * i] = 1n;
   HEAP64[b + 2 * i + 1] = arg;
  } else {
   HEAP64[b + 2 * i] = 0n;
   GROWABLE_HEAP_F64()[b + 2 * i + 1 >>> 0] = arg;
  }
 }
 return __emscripten_run_on_main_thread_js(funcIndex, emAsmAddr, serializedNumCallArgs, args, sync);
});

function _proc_exit(code) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(0, 0, 1, code);
 EXITSTATUS = code;
 if (!keepRuntimeAlive()) {
  PThread.terminateAllThreads();
  Module["onExit"]?.(code);
  ABORT = true;
 }
 quit_(code, new ExitStatus(code));
}

/** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
 EXITSTATUS = status;
 if (ENVIRONMENT_IS_PTHREAD) {
  exitOnMainThread(status);
  throw "unwind";
 }
 if (!keepRuntimeAlive()) {
  exitRuntime();
 }
 _proc_exit(status);
};

var _exit = exitJS;

var handleException = e => {
 if (e instanceof ExitStatus || e == "unwind") {
  return EXITSTATUS;
 }
 quit_(1, e);
};

var PThread = {
 unusedWorkers: [],
 runningWorkers: [],
 tlsInitFunctions: [],
 pthreads: {},
 init() {
  if (ENVIRONMENT_IS_PTHREAD) {
   PThread.initWorker();
  } else {
   PThread.initMainThread();
  }
 },
 initMainThread() {
  addOnPreRun(() => {
   addRunDependency("loading-workers");
   PThread.loadWasmModuleToAllWorkers(() => removeRunDependency("loading-workers"));
  });
 },
 initWorker() {
  PThread["receiveObjectTransfer"] = PThread.receiveObjectTransfer;
  PThread["threadInitTLS"] = PThread.threadInitTLS;
  PThread["setExitStatus"] = PThread.setExitStatus;
  noExitRuntime = false;
 },
 setExitStatus: status => EXITSTATUS = status,
 terminateAllThreads__deps: [ "$terminateWorker" ],
 terminateAllThreads: () => {
  for (var worker of PThread.runningWorkers) {
   terminateWorker(worker);
  }
  for (var worker of PThread.unusedWorkers) {
   terminateWorker(worker);
  }
  PThread.unusedWorkers = [];
  PThread.runningWorkers = [];
  PThread.pthreads = [];
 },
 returnWorkerToPool: worker => {
  var pthread_ptr = worker.pthread_ptr;
  delete PThread.pthreads[pthread_ptr];
  PThread.unusedWorkers.push(worker);
  PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
  worker.pthread_ptr = 0;
  __emscripten_thread_free_data(pthread_ptr);
 },
 receiveObjectTransfer(data) {
  if (typeof GL != "undefined") {
   Object.assign(GL.offscreenCanvases, data.offscreenCanvases);
   if (!Module["canvas"] && data.moduleCanvasId && GL.offscreenCanvases[data.moduleCanvasId]) {
    Module["canvas"] = GL.offscreenCanvases[data.moduleCanvasId].offscreenCanvas;
    Module["canvas"].id = data.moduleCanvasId;
   }
  }
 },
 threadInitTLS() {
  PThread.tlsInitFunctions.forEach(f => f());
 },
 loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
  worker.onmessage = e => {
   var d = e["data"];
   var cmd = d["cmd"];
   if (d["targetThread"] && d["targetThread"] != _pthread_self()) {
    var targetWorker = PThread.pthreads[d["targetThread"]];
    if (targetWorker) {
     targetWorker.postMessage(d, d["transferList"]);
    } else {
     err(`Internal error! Worker sent a message "${cmd}" to target pthread ${d["targetThread"]}, but that thread no longer exists!`);
    }
    return;
   }
   if (cmd === "checkMailbox") {
    checkMailbox();
   } else if (cmd === "spawnThread") {
    spawnThread(d);
   } else if (cmd === "cleanupThread") {
    cleanupThread(d["thread"]);
   } else if (cmd === "killThread") {
    killThread(d["thread"]);
   } else if (cmd === "cancelThread") {
    cancelThread(d["thread"]);
   } else if (cmd === "loaded") {
    worker.loaded = true;
    onFinishedLoading(worker);
   } else if (cmd === "alert") {
    alert(`Thread ${d["threadId"]}: ${d["text"]}`);
   } else if (d.target === "setimmediate") {
    worker.postMessage(d);
   } else if (cmd === "callHandler") {
    Module[d["handler"]](...d["args"]);
   } else if (cmd) {
    err(`worker sent an unknown command ${cmd}`);
   }
  };
  worker.onerror = e => {
   var message = "worker sent an error!";
   err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
   throw e;
  };
  var handlers = [];
  var knownHandlers = [ "onExit", "onAbort", "print", "printErr" ];
  for (var handler of knownHandlers) {
   if (Module.hasOwnProperty(handler)) {
    handlers.push(handler);
   }
  }
  worker.postMessage({
   "cmd": "load",
   "handlers": handlers,
   "urlOrBlob": Module["mainScriptUrlOrBlob"],
   "wasmMemory": wasmMemory,
   "wasmModule": wasmModule
  });
 }),
 loadWasmModuleToAllWorkers(onMaybeReady) {
  onMaybeReady();
 },
 allocateUnusedWorker() {
  var worker;
  if (!Module["locateFile"]) {
   worker = new Worker(new URL("dotnet.native.worker.mjs", import.meta.url), {
    type: "module"
   });
  } else {
   var pthreadMainJs = locateFile("dotnet.native.worker.mjs");
   worker = new Worker(pthreadMainJs, {
    type: "module"
   });
  }
  PThread.unusedWorkers.push(worker);
 },
 getNewWorker() {
  if (PThread.unusedWorkers.length == 0) {
   PThread.allocateUnusedWorker();
   PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
  }
  return PThread.unusedWorkers.pop();
 }
};

Module["PThread"] = PThread;

var callRuntimeCallbacks = callbacks => {
 while (callbacks.length > 0) {
  callbacks.shift()(Module);
 }
};

var establishStackSpace = () => {
 var pthread_ptr = _pthread_self();
 var stackHigh = GROWABLE_HEAP_U32()[(((pthread_ptr) + (52)) >>> 2) >>> 0];
 var stackSize = GROWABLE_HEAP_U32()[(((pthread_ptr) + (56)) >>> 2) >>> 0];
 var stackLow = stackHigh - stackSize;
 _emscripten_stack_set_limits(stackHigh, stackLow);
 stackRestore(stackHigh);
};

Module["establishStackSpace"] = establishStackSpace;

function exitOnMainThread(returnCode) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 0, 0, returnCode);
 _exit(returnCode);
}

/**
     * @param {number} ptr
     * @param {string} type
     */ function getValue(ptr, type = "i8") {
 if (type.endsWith("*")) type = "*";
 switch (type) {
 case "i1":
  return GROWABLE_HEAP_I8()[ptr >>> 0];

 case "i8":
  return GROWABLE_HEAP_I8()[ptr >>> 0];

 case "i16":
  return GROWABLE_HEAP_I16()[((ptr) >>> 1) >>> 0];

 case "i32":
  return GROWABLE_HEAP_I32()[((ptr) >>> 2) >>> 0];

 case "i64":
  return HEAP64[((ptr) >>> 3)];

 case "float":
  return GROWABLE_HEAP_F32()[((ptr) >>> 2) >>> 0];

 case "double":
  return GROWABLE_HEAP_F64()[((ptr) >>> 3) >>> 0];

 case "*":
  return GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0];

 default:
  abort(`invalid type for getValue: ${type}`);
 }
}

var wasmTableMirror = [];

var wasmTable;

var getWasmTableEntry = funcPtr => {
 var func = wasmTableMirror[funcPtr];
 if (!func) {
  if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
  wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
 }
 return func;
};

var invokeEntryPoint = (ptr, arg) => {
 runtimeKeepaliveCounter = 0;
 var result = getWasmTableEntry(ptr)(arg);
 function finish(result) {
  if (keepRuntimeAlive()) {
   PThread.setExitStatus(result);
  } else {
   __emscripten_thread_exit(result);
  }
 }
 finish(result);
};

Module["invokeEntryPoint"] = invokeEntryPoint;

var noExitRuntime = Module["noExitRuntime"] || false;

var registerTLSInit = tlsInitFunc => PThread.tlsInitFunctions.push(tlsInitFunc);

/**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */ function setValue(ptr, value, type = "i8") {
 if (type.endsWith("*")) type = "*";
 switch (type) {
 case "i1":
  GROWABLE_HEAP_I8()[ptr >>> 0] = value;
  break;

 case "i8":
  GROWABLE_HEAP_I8()[ptr >>> 0] = value;
  break;

 case "i16":
  GROWABLE_HEAP_I16()[((ptr) >>> 1) >>> 0] = value;
  break;

 case "i32":
  GROWABLE_HEAP_I32()[((ptr) >>> 2) >>> 0] = value;
  break;

 case "i64":
  HEAP64[((ptr) >>> 3)] = BigInt(value);
  break;

 case "float":
  GROWABLE_HEAP_F32()[((ptr) >>> 2) >>> 0] = value;
  break;

 case "double":
  GROWABLE_HEAP_F64()[((ptr) >>> 3) >>> 0] = value;
  break;

 case "*":
  GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] = value;
  break;

 default:
  abort(`invalid type for setValue: ${type}`);
 }
}

/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */ var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
 idx >>>= 0;
 var endIdx = idx + maxBytesToRead;
 var str = "";
 while (!(idx >= endIdx)) {
  var u0 = heapOrArray[idx++];
  if (!u0) return str;
  if (!(u0 & 128)) {
   str += String.fromCharCode(u0);
   continue;
  }
  var u1 = heapOrArray[idx++] & 63;
  if ((u0 & 224) == 192) {
   str += String.fromCharCode(((u0 & 31) << 6) | u1);
   continue;
  }
  var u2 = heapOrArray[idx++] & 63;
  if ((u0 & 240) == 224) {
   u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
  } else {
   u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
  }
  if (u0 < 65536) {
   str += String.fromCharCode(u0);
  } else {
   var ch = u0 - 65536;
   str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
  }
 }
 return str;
};

/**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */ var UTF8ToString = (ptr, maxBytesToRead) => {
 ptr >>>= 0;
 return ptr ? UTF8ArrayToString(GROWABLE_HEAP_U8(), ptr, maxBytesToRead) : "";
};

function ___assert_fail(condition, filename, line, func) {
 condition >>>= 0;
 filename >>>= 0;
 func >>>= 0;
 abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);
}

function ___call_sighandler(fp, sig) {
 fp >>>= 0;
 return getWasmTableEntry(fp)(sig);
}

function ___emscripten_init_main_thread_js(tb) {
 tb >>>= 0;
 __emscripten_thread_init(tb, /*is_main=*/ !ENVIRONMENT_IS_WORKER, /*is_runtime=*/ 1, /*can_block=*/ !ENVIRONMENT_IS_WEB, /*default_stacksize=*/ 1048576, /*start_profiling=*/ false);
 PThread.threadInitTLS();
}

function ___emscripten_thread_cleanup(thread) {
 thread >>>= 0;
 if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread); else postMessage({
  "cmd": "cleanupThread",
  "thread": thread
 });
}

function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 0, 1, pthread_ptr, attr, startRoutine, arg);
 return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
}

function ___pthread_create_js(pthread_ptr, attr, startRoutine, arg) {
 pthread_ptr >>>= 0;
 attr >>>= 0;
 startRoutine >>>= 0;
 arg >>>= 0;
 if (typeof SharedArrayBuffer == "undefined") {
  err("Current environment does not support SharedArrayBuffer, pthreads are not available!");
  return 6;
 }
 var transferList = [];
 var error = 0;
 var transferredCanvasNames = attr ? GROWABLE_HEAP_U32()[(((attr) + (40)) >>> 2) >>> 0] : 0;
 if (transferredCanvasNames == 4294967295) {
  transferredCanvasNames = "#canvas";
 } else transferredCanvasNames &&= UTF8ToString(transferredCanvasNames).trim();
 transferredCanvasNames &&= transferredCanvasNames.split(",");
 var offscreenCanvases={};if(globalThis.window&&!window.TRANSFERRED_CANVAS&&!window.WINK_GL_MAIN){transferredCanvasNames=[".canvas"];window.TRANSFERRED_CANVAS=true;}
 var moduleCanvasId = Module["canvas"] ? Module["canvas"].id : "";
 for (var i in transferredCanvasNames) {
  var name = transferredCanvasNames[i].trim();
  var offscreenCanvasInfo;
  try {
   if (name == "#canvas") {
    if (!Module["canvas"]) {
     err(`pthread_create: could not find canvas with ID "${name}" to transfer to thread!`);
     error = 28;
     break;
    }
    name = Module["canvas"].id;
   }
   if (GL.offscreenCanvases[name]) {
    offscreenCanvasInfo = GL.offscreenCanvases[name];
    GL.offscreenCanvases[name] = null;
    if (Module["canvas"] instanceof OffscreenCanvas && name === Module["canvas"].id) Module["canvas"] = null;
   } else if (!ENVIRONMENT_IS_PTHREAD) {
    var canvas = (Module["canvas"] && Module["canvas"].id === name) ? Module["canvas"] : document.querySelector(name);
    if (!canvas) {
     err(`pthread_create: could not find canvas with ID "${name}" to transfer to thread!`);
     error = 28;
     break;
    }
    if (canvas.controlTransferredOffscreen) {
     err(`pthread_create: cannot transfer canvas with ID "${name}" to thread, since the current thread does not have control over it!`);
     error = 63;
     break;
    }
    if (canvas.transferControlToOffscreen) {
     if (!canvas.canvasSharedPtr) {
      canvas.canvasSharedPtr = _malloc(12);
      GROWABLE_HEAP_I32()[((canvas.canvasSharedPtr) >>> 2) >>> 0] = canvas.width;
      GROWABLE_HEAP_I32()[(((canvas.canvasSharedPtr) + (4)) >>> 2) >>> 0] = canvas.height;
      GROWABLE_HEAP_U32()[(((canvas.canvasSharedPtr) + (8)) >>> 2) >>> 0] = 0;
     }
     offscreenCanvasInfo = {
      offscreenCanvas: canvas.transferControlToOffscreen(),
      canvasSharedPtr: canvas.canvasSharedPtr,
      id: canvas.id
     };
     canvas.controlTransferredOffscreen = true;
    } else {
     err(`pthread_create: cannot transfer control of canvas "${name}" to pthread, because current browser does not support OffscreenCanvas!`);
     err("pthread_create: Build with -sOFFSCREEN_FRAMEBUFFER to enable fallback proxying of GL commands from pthread to main thread.");
     return 52;
    }
   }
   if (offscreenCanvasInfo) {
    transferList.push(offscreenCanvasInfo.offscreenCanvas);
    offscreenCanvases[offscreenCanvasInfo.id] = offscreenCanvasInfo;
   }
  } catch (e) {
   err(`pthread_create: failed to transfer control of canvas "${name}" to OffscreenCanvas! Error: ${e}`);
   return 28;
  }
 }
 if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
  return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
 }
 if (error) return error;
 for (var canvas of Object.values(offscreenCanvases)) {
  GROWABLE_HEAP_U32()[(((canvas.canvasSharedPtr) + (8)) >>> 2) >>> 0] = pthread_ptr;
 }
 var threadParams = {
  startRoutine: startRoutine,
  pthread_ptr: pthread_ptr,
  arg: arg,
  moduleCanvasId: moduleCanvasId,
  offscreenCanvases: offscreenCanvases,
  transferList: transferList
 };
 if (ENVIRONMENT_IS_PTHREAD) {
  threadParams.cmd = "spawnThread";
  postMessage(threadParams, transferList);
  return 0;
 }
 return spawnThread(threadParams);
}

function ___pthread_kill_js(thread, signal) {
 thread >>>= 0;
 if (signal === 33) {
  if (!ENVIRONMENT_IS_PTHREAD) cancelThread(thread); else postMessage({
   "cmd": "cancelThread",
   "thread": thread
  });
 } else {
  if (!ENVIRONMENT_IS_PTHREAD) killThread(thread); else postMessage({
   "cmd": "killThread",
   "thread": thread
  });
 }
 return 0;
}

var nowIsMonotonic = 1;

var __emscripten_get_now_is_monotonic = () => nowIsMonotonic;

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
 outIdx >>>= 0;
 if (!(maxBytesToWrite > 0)) return 0;
 var startIdx = outIdx;
 var endIdx = outIdx + maxBytesToWrite - 1;
 for (var i = 0; i < str.length; ++i) {
  var u = str.charCodeAt(i);
  if (u >= 55296 && u <= 57343) {
   var u1 = str.charCodeAt(++i);
   u = 65536 + ((u & 1023) << 10) | (u1 & 1023);
  }
  if (u <= 127) {
   if (outIdx >= endIdx) break;
   heap[outIdx++ >>> 0] = u;
  } else if (u <= 2047) {
   if (outIdx + 1 >= endIdx) break;
   heap[outIdx++ >>> 0] = 192 | (u >> 6);
   heap[outIdx++ >>> 0] = 128 | (u & 63);
  } else if (u <= 65535) {
   if (outIdx + 2 >= endIdx) break;
   heap[outIdx++ >>> 0] = 224 | (u >> 12);
   heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
   heap[outIdx++ >>> 0] = 128 | (u & 63);
  } else {
   if (outIdx + 3 >= endIdx) break;
   heap[outIdx++ >>> 0] = 240 | (u >> 18);
   heap[outIdx++ >>> 0] = 128 | ((u >> 12) & 63);
   heap[outIdx++ >>> 0] = 128 | ((u >> 6) & 63);
   heap[outIdx++ >>> 0] = 128 | (u & 63);
  }
 }
 heap[outIdx >>> 0] = 0;
 return outIdx - startIdx;
};

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, GROWABLE_HEAP_U8(), outPtr, maxBytesToWrite);

function __emscripten_get_progname(str, len) {
 str >>>= 0;
 stringToUTF8(thisProgram, str, len);
}

var maybeExit = () => {
 if (runtimeExited) {
  return;
 }
 if (!keepRuntimeAlive()) {
  try {
   if (ENVIRONMENT_IS_PTHREAD) __emscripten_thread_exit(EXITSTATUS); else _exit(EXITSTATUS);
  } catch (e) {
   handleException(e);
  }
 }
};

var callUserCallback = func => {
 if (runtimeExited || ABORT) {
  return;
 }
 try {
  func();
  maybeExit();
 } catch (e) {
  handleException(e);
 }
};

function __emscripten_thread_mailbox_await(pthread_ptr) {
 pthread_ptr >>>= 0;
 if (typeof Atomics.waitAsync === "function") {
  var wait = Atomics.waitAsync(GROWABLE_HEAP_I32(), ((pthread_ptr) >>> 2), pthread_ptr);
  wait.value.then(checkMailbox);
  var waitingAsync = pthread_ptr + 128;
  Atomics.store(GROWABLE_HEAP_I32(), ((waitingAsync) >>> 2), 1);
 }
}

Module["__emscripten_thread_mailbox_await"] = __emscripten_thread_mailbox_await;

var checkMailbox = () => {
 var pthread_ptr = _pthread_self();
 if (pthread_ptr) {
  __emscripten_thread_mailbox_await(pthread_ptr);
  callUserCallback(__emscripten_check_mailbox);
 }
};

Module["checkMailbox"] = checkMailbox;

function __emscripten_notify_mailbox_postmessage(targetThreadId, currThreadId, mainThreadId) {
 targetThreadId >>>= 0;
 currThreadId >>>= 0;
 mainThreadId >>>= 0;
 if (targetThreadId == currThreadId) {
  setTimeout(checkMailbox);
 } else if (ENVIRONMENT_IS_PTHREAD) {
  postMessage({
   "targetThread": targetThreadId,
   "cmd": "checkMailbox"
  });
 } else {
  var worker = PThread.pthreads[targetThreadId];
  if (!worker) {
   return;
  }
  worker.postMessage({
   "cmd": "checkMailbox"
  });
 }
}

var proxiedJSCallArgs = [];

function __emscripten_receive_on_main_thread_js(funcIndex, emAsmAddr, callingThread, numCallArgs, args) {
 emAsmAddr >>>= 0;
 callingThread >>>= 0;
 args >>>= 0;
 numCallArgs /= 2;
 proxiedJSCallArgs.length = numCallArgs;
 var b = ((args) >>> 3);
 for (var i = 0; i < numCallArgs; i++) {
  if (HEAP64[b + 2 * i]) {
   proxiedJSCallArgs[i] = HEAP64[b + 2 * i + 1];
  } else {
   proxiedJSCallArgs[i] = GROWABLE_HEAP_F64()[b + 2 * i + 1 >>> 0];
  }
 }
 var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
 PThread.currentProxiedOperationCallerThread = callingThread;
 var rtn = func(...proxiedJSCallArgs);
 PThread.currentProxiedOperationCallerThread = 0;
 return rtn;
}

function __emscripten_runtime_keepalive_clear() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 0, 1);
 noExitRuntime = false;
 runtimeKeepaliveCounter = 0;
}

var JSEvents = {
 removeAllEventListeners() {
  while (JSEvents.eventHandlers.length) {
   JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
  }
  JSEvents.deferredCalls = [];
 },
 registerRemoveEventListeners() {
  if (!JSEvents.removeEventListenersRegistered) {
   __ATEXIT__.push(JSEvents.removeAllEventListeners);
   JSEvents.removeEventListenersRegistered = true;
  }
 },
 inEventHandler: 0,
 deferredCalls: [],
 deferCall(targetFunction, precedence, argsList) {
  function arraysHaveEqualContent(arrA, arrB) {
   if (arrA.length != arrB.length) return false;
   for (var i in arrA) {
    if (arrA[i] != arrB[i]) return false;
   }
   return true;
  }
  for (var i in JSEvents.deferredCalls) {
   var call = JSEvents.deferredCalls[i];
   if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
    return;
   }
  }
  JSEvents.deferredCalls.push({
   targetFunction: targetFunction,
   precedence: precedence,
   argsList: argsList
  });
  JSEvents.deferredCalls.sort((x, y) => x.precedence < y.precedence);
 },
 removeDeferredCalls(targetFunction) {
  for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
   if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
    JSEvents.deferredCalls.splice(i, 1);
    --i;
   }
  }
 },
 canPerformEventHandlerRequests() {
  if (navigator.userActivation) {
   return navigator.userActivation.isActive;
  }
  return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
 },
 runDeferredCalls() {
  if (!JSEvents.canPerformEventHandlerRequests()) {
   return;
  }
  for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
   var call = JSEvents.deferredCalls[i];
   JSEvents.deferredCalls.splice(i, 1);
   --i;
   call.targetFunction(...call.argsList);
  }
 },
 eventHandlers: [],
 removeAllHandlersOnTarget: (target, eventTypeString) => {
  for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
   if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
    JSEvents._removeHandler(i--);
   }
  }
 },
 _removeHandler(i) {
  var h = JSEvents.eventHandlers[i];
  h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
  JSEvents.eventHandlers.splice(i, 1);
 },
 registerOrRemoveHandler(eventHandler) {
  if (!eventHandler.target) {
   return -4;
  }
  if (eventHandler.callbackfunc) {
   eventHandler.eventListenerFunc = function(event) {
    ++JSEvents.inEventHandler;
    JSEvents.currentEventHandler = eventHandler;
    JSEvents.runDeferredCalls();
    eventHandler.handlerFunc(event);
    JSEvents.runDeferredCalls();
    --JSEvents.inEventHandler;
   };
   eventHandler.target.addEventListener(eventHandler.eventTypeString, eventHandler.eventListenerFunc, eventHandler.useCapture);
   JSEvents.eventHandlers.push(eventHandler);
   JSEvents.registerRemoveEventListeners();
  } else {
   for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
    if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
     JSEvents._removeHandler(i--);
    }
   }
  }
  return 0;
 },
 getTargetThreadForEventCallback(targetThread) {
  switch (targetThread) {
  case 1:
   return 0;

  case 2:
   return PThread.currentProxiedOperationCallerThread;

  default:
   return targetThread;
  }
 },
 getNodeNameForTarget(target) {
  if (!target) return "";
  if (target == window) return "#window";
  if (target == screen) return "#screen";
  return target?.nodeName || "";
 },
 fullscreenEnabled() {
  return document.fullscreenEnabled;
 }
};

var lengthBytesUTF8 = str => {
 var len = 0;
 for (var i = 0; i < str.length; ++i) {
  var c = str.charCodeAt(i);
  if (c <= 127) {
   len++;
  } else if (c <= 2047) {
   len += 2;
  } else if (c >= 55296 && c <= 57343) {
   len += 4;
   ++i;
  } else {
   len += 3;
  }
 }
 return len;
};

var stringToNewUTF8 = str => {
 var size = lengthBytesUTF8(str) + 1;
 var ret = _malloc(size);
 if (ret) stringToUTF8(str, ret, size);
 return ret;
};

var setOffscreenCanvasSizeOnTargetThread = (targetThread, targetCanvas, width, height) => {
 targetCanvas = targetCanvas ? UTF8ToString(targetCanvas) : "";
 var targetCanvasPtr = 0;
 if (targetCanvas) {
  targetCanvasPtr = stringToNewUTF8(targetCanvas);
 }
 __emscripten_set_offscreencanvas_size_on_thread(targetThread, targetCanvasPtr, width, height);
};

var webgl_enable_ANGLE_instanced_arrays = ctx => {
 var ext = ctx.getExtension("ANGLE_instanced_arrays");
 if (ext) {
  ctx["vertexAttribDivisor"] = (index, divisor) => ext["vertexAttribDivisorANGLE"](index, divisor);
  ctx["drawArraysInstanced"] = (mode, first, count, primcount) => ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
  ctx["drawElementsInstanced"] = (mode, count, type, indices, primcount) => ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
  return 1;
 }
};

var webgl_enable_OES_vertex_array_object = ctx => {
 var ext = ctx.getExtension("OES_vertex_array_object");
 if (ext) {
  ctx["createVertexArray"] = () => ext["createVertexArrayOES"]();
  ctx["deleteVertexArray"] = vao => ext["deleteVertexArrayOES"](vao);
  ctx["bindVertexArray"] = vao => ext["bindVertexArrayOES"](vao);
  ctx["isVertexArray"] = vao => ext["isVertexArrayOES"](vao);
  return 1;
 }
};

var webgl_enable_WEBGL_draw_buffers = ctx => {
 var ext = ctx.getExtension("WEBGL_draw_buffers");
 if (ext) {
  ctx["drawBuffers"] = (n, bufs) => ext["drawBuffersWEBGL"](n, bufs);
  return 1;
 }
};

var webgl_enable_WEBGL_multi_draw = ctx => !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));

var getEmscriptenSupportedExtensions = ctx => {
 var supportedExtensions = [ "ANGLE_instanced_arrays", "EXT_blend_minmax", "EXT_disjoint_timer_query", "EXT_frag_depth", "EXT_shader_texture_lod", "EXT_sRGB", "OES_element_index_uint", "OES_fbo_render_mipmap", "OES_standard_derivatives", "OES_texture_float", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_vertex_array_object", "WEBGL_color_buffer_float", "WEBGL_depth_texture", "WEBGL_draw_buffers", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw" ];
 return (ctx.getSupportedExtensions() || []).filter(ext => supportedExtensions.includes(ext));
};

var GL = {
 counter: 1,
 buffers: [],
 programs: [],
 framebuffers: [],
 renderbuffers: [],
 textures: [],
 shaders: [],
 vaos: [],
 contexts: {},
 offscreenCanvases: {},
 queries: [],
 stringCache: {},
 unpackAlignment: 4,
 recordError: errorCode => {
  if (!GL.lastError) {
   GL.lastError = errorCode;
  }
 },
 getNewId: table => {
  var ret = GL.counter++;
  for (var i = table.length; i < ret; i++) {
   table[i] = null;
  }
  return ret;
 },
 genObject: (n, buffers, createFunction, objectTable) => {
  for (var i = 0; i < n; i++) {
   var buffer = GLctx[createFunction]();
   var id = buffer && GL.getNewId(objectTable);
   if (buffer) {
    buffer.name = id;
    objectTable[id] = buffer;
   } else {
    GL.recordError(1282);
   }
   GROWABLE_HEAP_I32()[(((buffers) + (i * 4)) >>> 2) >>> 0] = id;
  }
 },
 getSource: (shader, count, string, length) => {
  var source = "";
  for (var i = 0; i < count; ++i) {
   var len = length ? GROWABLE_HEAP_U32()[(((length) + (i * 4)) >>> 2) >>> 0] : undefined;
   source += UTF8ToString(GROWABLE_HEAP_U32()[(((string) + (i * 4)) >>> 2) >>> 0], len);
  }
  return source;
 },
 createContext: (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
  var ctx = (canvas.getContext("webgl", webGLContextAttributes));
  if (!ctx) return 0;
  var handle = GL.registerContext(ctx, webGLContextAttributes);
  return handle;
 },
 registerContext: (ctx, webGLContextAttributes) => {
  var handle = _malloc(8);
  GROWABLE_HEAP_U32()[(((handle) + (4)) >>> 2) >>> 0] = _pthread_self();
  var context = {
   handle: handle,
   attributes: webGLContextAttributes,
   version: webGLContextAttributes.majorVersion,
   GLctx: ctx
  };
  if (ctx.canvas) ctx.canvas.GLctxObject = context;
  GL.contexts[handle] = context;
  if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
   GL.initExtensions(context);
  }
  return handle;
 },
 makeContextCurrent: contextHandle => {
  GL.currentContext = GL.contexts[contextHandle];
  Module.ctx = GLctx = GL.currentContext?.GLctx;
  return !(contextHandle && !GLctx);
 },
 getContext: contextHandle => GL.contexts[contextHandle],
 deleteContext: contextHandle => {
  if (GL.currentContext === GL.contexts[contextHandle]) {
   GL.currentContext = null;
  }
  if (typeof JSEvents == "object") {
   JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
  }
  if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) {
   GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
  }
  _free(GL.contexts[contextHandle].handle);
  GL.contexts[contextHandle] = null;
 },
 initExtensions: context => {
  context ||= GL.currentContext;
  if (context.initExtensionsDone) return;
  context.initExtensionsDone = true;
  var GLctx = context.GLctx;
  webgl_enable_ANGLE_instanced_arrays(GLctx);
  webgl_enable_OES_vertex_array_object(GLctx);
  webgl_enable_WEBGL_draw_buffers(GLctx);
  {
   GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
  }
  webgl_enable_WEBGL_multi_draw(GLctx);
  getEmscriptenSupportedExtensions(GLctx).forEach(ext => {
   if (!ext.includes("lose_context") && !ext.includes("debug")) {
    GLctx.getExtension(ext);
   }
  });
 }
};

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

var findCanvasEventTarget = target => {
 target = maybeCStringToJsString(target);
 return GL.offscreenCanvases[target.substr(1)] || (target == "canvas" && Object.keys(GL.offscreenCanvases)[0]) || (typeof document != "undefined" && document.querySelector(target));
};

var setCanvasElementSizeCallingThread = (target, width, height) => {
 var canvas = findCanvasEventTarget(target);
 if (!canvas) return -4;
 if (canvas.canvasSharedPtr) {
  GROWABLE_HEAP_I32()[((canvas.canvasSharedPtr) >>> 2) >>> 0] = width;
  GROWABLE_HEAP_I32()[(((canvas.canvasSharedPtr) + (4)) >>> 2) >>> 0] = height;
 }
 if (canvas.offscreenCanvas || !canvas.controlTransferredOffscreen) {
  if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
  var autoResizeViewport = false;
  if (canvas.GLctxObject?.GLctx) {
   var prevViewport = canvas.GLctxObject.GLctx.getParameter(2978);
   autoResizeViewport = (prevViewport[0] === 0 && prevViewport[1] === 0 && prevViewport[2] === canvas.width && prevViewport[3] === canvas.height);
  }
  canvas.width = width;
  canvas.height = height;
  if (autoResizeViewport) {
   canvas.GLctxObject.GLctx.viewport(0, 0, width, height);
  }
 } else if (canvas.canvasSharedPtr) {
  var targetThread = GROWABLE_HEAP_U32()[(((canvas.canvasSharedPtr) + (8)) >>> 2) >>> 0];
  setOffscreenCanvasSizeOnTargetThread(targetThread, target, width, height);
  return 1;
 } else {
  return -4;
 }
 return 0;
};

function setCanvasElementSizeMainThread(target, width, height) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 0, 1, target, width, height);
 return setCanvasElementSizeCallingThread(target, width, height);
}

/** @suppress {duplicate } */ function _emscripten_set_canvas_element_size(target, width, height) {
 target >>>= 0;
 var canvas = findCanvasEventTarget(target);
 if (canvas) {
  return setCanvasElementSizeCallingThread(target, width, height);
 }
 return setCanvasElementSizeMainThread(target, width, height);
}

var __emscripten_set_offscreencanvas_size = _emscripten_set_canvas_element_size;

function __emscripten_thread_set_strongref(thread) {
 thread >>>= 0;
}

function __gmtime_js(time, tmPtr) {
 time = bigintToI53Checked(time);
 tmPtr >>>= 0;
 var date = new Date(time * 1e3);
 GROWABLE_HEAP_I32()[((tmPtr) >>> 2) >>> 0] = date.getUTCSeconds();
 GROWABLE_HEAP_I32()[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getUTCMinutes();
 GROWABLE_HEAP_I32()[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getUTCHours();
 GROWABLE_HEAP_I32()[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getUTCDate();
 GROWABLE_HEAP_I32()[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getUTCMonth();
 GROWABLE_HEAP_I32()[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getUTCFullYear() - 1900;
 GROWABLE_HEAP_I32()[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getUTCDay();
 var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
 var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
 GROWABLE_HEAP_I32()[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
}

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
 var leap = isLeapYear(date.getFullYear());
 var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
 var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
 return yday;
};

function __localtime_js(time, tmPtr) {
 time = bigintToI53Checked(time);
 tmPtr >>>= 0;
 var date = new Date(time * 1e3);
 GROWABLE_HEAP_I32()[((tmPtr) >>> 2) >>> 0] = date.getSeconds();
 GROWABLE_HEAP_I32()[(((tmPtr) + (4)) >>> 2) >>> 0] = date.getMinutes();
 GROWABLE_HEAP_I32()[(((tmPtr) + (8)) >>> 2) >>> 0] = date.getHours();
 GROWABLE_HEAP_I32()[(((tmPtr) + (12)) >>> 2) >>> 0] = date.getDate();
 GROWABLE_HEAP_I32()[(((tmPtr) + (16)) >>> 2) >>> 0] = date.getMonth();
 GROWABLE_HEAP_I32()[(((tmPtr) + (20)) >>> 2) >>> 0] = date.getFullYear() - 1900;
 GROWABLE_HEAP_I32()[(((tmPtr) + (24)) >>> 2) >>> 0] = date.getDay();
 var yday = ydayFromDate(date) | 0;
 GROWABLE_HEAP_I32()[(((tmPtr) + (28)) >>> 2) >>> 0] = yday;
 GROWABLE_HEAP_I32()[(((tmPtr) + (36)) >>> 2) >>> 0] = -(date.getTimezoneOffset() * 60);
 var start = new Date(date.getFullYear(), 0, 1);
 var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
 var winterOffset = start.getTimezoneOffset();
 var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
 GROWABLE_HEAP_I32()[(((tmPtr) + (32)) >>> 2) >>> 0] = dst;
}

var timers = {};

var _emscripten_get_now;

_emscripten_get_now = () => performance.timeOrigin + performance.now();

function __setitimer_js(which, timeout_ms) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 0, 1, which, timeout_ms);
 if (timers[which]) {
  clearTimeout(timers[which].id);
  delete timers[which];
 }
 if (!timeout_ms) return 0;
 var id = setTimeout(() => {
  delete timers[which];
  callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
 }, timeout_ms);
 timers[which] = {
  id: id,
  timeout_ms: timeout_ms
 };
 return 0;
}

function __tzset_js(timezone, daylight, std_name, dst_name) {
 timezone >>>= 0;
 daylight >>>= 0;
 std_name >>>= 0;
 dst_name >>>= 0;
 var currentYear = (new Date).getFullYear();
 var winter = new Date(currentYear, 0, 1);
 var summer = new Date(currentYear, 6, 1);
 var winterOffset = winter.getTimezoneOffset();
 var summerOffset = summer.getTimezoneOffset();
 var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
 GROWABLE_HEAP_U32()[((timezone) >>> 2) >>> 0] = stdTimezoneOffset * 60;
 GROWABLE_HEAP_I32()[((daylight) >>> 2) >>> 0] = Number(winterOffset != summerOffset);
 function extractZone(date) {
  var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
  return match ? match[1] : "GMT";
 }
 var winterName = extractZone(winter);
 var summerName = extractZone(summer);
 if (summerOffset < winterOffset) {
  stringToUTF8(winterName, std_name, 7);
  stringToUTF8(summerName, dst_name, 7);
 } else {
  stringToUTF8(winterName, dst_name, 7);
  stringToUTF8(summerName, std_name, 7);
 }
}

function __wasmfs_copy_preloaded_file_data(index, buffer) {
 buffer >>>= 0;
 return GROWABLE_HEAP_U8().set(wasmFSPreloadedFiles[index].fileData, buffer >>> 0);
}

var wasmFS$backends = {};

var wasmFS$JSMemoryFiles = {};

var wasmFS$fetchSizes = {};

var __wasmfs_create_js_file_backend_js = function(backend) {
 backend >>>= 0;
 wasmFS$backends[backend] = {
  allocFile: file => {},
  freeFile: file => {
   wasmFS$JSMemoryFiles[file] = undefined;
  },
  write: (file, buffer, length, offset) => {
   try {
    if (!wasmFS$JSMemoryFiles[file]) {
     wasmFS$JSMemoryFiles[file] = new Uint8Array(offset + length);
    }
    if (offset + length > wasmFS$JSMemoryFiles[file].length) {
     var oldContents = wasmFS$JSMemoryFiles[file];
     var newContents = new Uint8Array(offset + length);
     newContents.set(oldContents);
     wasmFS$JSMemoryFiles[file] = newContents;
    }
    wasmFS$JSMemoryFiles[file].set(GROWABLE_HEAP_U8().subarray(buffer >>> 0, buffer + length >>> 0), offset);
    return length;
   } catch (err) {
    return -29;
   }
  },
  read: (file, buffer, length, offset) => {
   var fileData = wasmFS$JSMemoryFiles[file];
   var dataAfterOffset = Math.max(0, fileData.length - offset);
   length = Math.min(length, dataAfterOffset);
   GROWABLE_HEAP_U8().set(fileData.subarray(offset, offset + length), buffer >>> 0);
   return length;
  },
  getSize: file => wasmFS$JSMemoryFiles[file] ? wasmFS$JSMemoryFiles[file].length : 0
 };
};

async function __wasmfs_create_fetch_backend_js(backend) {
 backend >>>= 0;
 function getUrl(file) {
  var url = "";
  var fileUrl_p = __wasmfs_fetch_get_file_path(file);
  var fileUrl = UTF8ToString(fileUrl_p);
  var isAbs = fileUrl.indexOf("://") !== -1;
  if (isAbs) {
   url = fileUrl;
  } else {
   try {
    var u = new URL(fileUrl, self.location.origin);
    url = u.toString();
   } catch (e) {}
  }
  return url;
 }
 async function getFile(file) {
  if (wasmFS$JSMemoryFiles[file]) {
   return Promise.resolve();
  }
  var response = await fetch(getUrl(file));
  if (response.ok) {
   var buffer = await response["arrayBuffer"]();
   wasmFS$JSMemoryFiles[file] = new Uint8Array(buffer);
  } else {
   throw response;
  }
 }
 __wasmfs_create_js_file_backend_js(backend);
 var jsFileOps = wasmFS$backends[backend];
 wasmFS$backends[backend] = {
  allocFile: async file => {
   jsFileOps.allocFile(file);
   return Promise.resolve();
  },
  freeFile: async file => {
   jsFileOps.freeFile(file);
   return Promise.resolve();
  },
  write: async (file, buffer, length, offset) => {
   abort("TODO: file writing in fetch backend? read-only for now");
  },
  read: async (file, buffer, length, offset) => {
   try {
    await getFile(file);
   } catch (response) {
    return response.status === 404 ? -44 : -8;
   }
   return jsFileOps.read(file, buffer, length, offset);
  },
  getSize: async file => {
   if (!wasmFS$JSMemoryFiles[file]) {
    var known = wasmFS$fetchSizes[file];
    if (known !== undefined) return known;
    try {
     var head = await fetch(getUrl(file), {
      method: "HEAD"
     });
     var len = head.headers.get("Content-Length");
     if (head.ok && len !== null && !head.headers.get("Content-Encoding")) {
      var n = Number(len);
      if (Number.isSafeInteger(n) && n >= 0) {
       wasmFS$fetchSizes[file] = n;
       return n;
      }
     }
    } catch (e) {}
   }
   try {
    await getFile(file);
   } catch (response) {}
   return jsFileOps.getSize(file);
  }
 };
}

var wasmFSPreloadedDirs = [];

var __wasmfs_get_num_preloaded_dirs = () => wasmFSPreloadedDirs.length;

var wasmFSPreloadedFiles = [];

var wasmFSPreloadingFlushed = false;

var __wasmfs_get_num_preloaded_files = () => {
 wasmFSPreloadingFlushed = true;
 return wasmFSPreloadedFiles.length;
};

function __wasmfs_get_preloaded_child_path(index, childNameBuffer) {
 childNameBuffer >>>= 0;
 var s = wasmFSPreloadedDirs[index].childName;
 var len = lengthBytesUTF8(s) + 1;
 stringToUTF8(s, childNameBuffer, len);
}

var __wasmfs_get_preloaded_file_mode = index => wasmFSPreloadedFiles[index].mode;

function __wasmfs_get_preloaded_file_size(index) {
 return wasmFSPreloadedFiles[index].fileData.length;
}

function __wasmfs_get_preloaded_parent_path(index, parentPathBuffer) {
 parentPathBuffer >>>= 0;
 var s = wasmFSPreloadedDirs[index].parentPath;
 var len = lengthBytesUTF8(s) + 1;
 stringToUTF8(s, parentPathBuffer, len);
}

function __wasmfs_get_preloaded_path_name(index, fileNameBuffer) {
 fileNameBuffer >>>= 0;
 var s = wasmFSPreloadedFiles[index].pathName;
 var len = lengthBytesUTF8(s) + 1;
 stringToUTF8(s, fileNameBuffer, len);
}

function __wasmfs_jsimpl_alloc_file(backend, file) {
 backend >>>= 0;
 file >>>= 0;
 return wasmFS$backends[backend].allocFile(file);
}

async function __wasmfs_jsimpl_async_alloc_file(ctx, backend, file) {
 ctx >>>= 0;
 backend >>>= 0;
 file >>>= 0;
 await wasmFS$backends[backend].allocFile(file);
 _emscripten_proxy_finish(ctx);
}

async function __wasmfs_jsimpl_async_free_file(ctx, backend, file) {
 ctx >>>= 0;
 backend >>>= 0;
 file >>>= 0;
 await wasmFS$backends[backend].freeFile(file);
 _emscripten_proxy_finish(ctx);
}

async function __wasmfs_jsimpl_async_get_size(ctx, backend, file, size_p) {
 ctx >>>= 0;
 backend >>>= 0;
 file >>>= 0;
 size_p >>>= 0;
 var size = await wasmFS$backends[backend].getSize(file);
 HEAP64[((size_p) >>> 3)] = BigInt(size);
 _emscripten_proxy_finish(ctx);
}

async function __wasmfs_jsimpl_async_read(ctx, backend, file, buffer, length, offset, result_p) {
 ctx >>>= 0;
 backend >>>= 0;
 file >>>= 0;
 buffer >>>= 0;
 length >>>= 0;
 offset = bigintToI53Checked(offset);
 result_p >>>= 0;
 var result = await wasmFS$backends[backend].read(file, buffer, length, offset);
 GROWABLE_HEAP_U32()[((result_p) >>> 2) >>> 0] = result;
 _emscripten_proxy_finish(ctx);
}

async function __wasmfs_jsimpl_async_write(ctx, backend, file, buffer, length, offset, result_p) {
 ctx >>>= 0;
 backend >>>= 0;
 file >>>= 0;
 buffer >>>= 0;
 length >>>= 0;
 offset = bigintToI53Checked(offset);
 result_p >>>= 0;
 var result = await wasmFS$backends[backend].write(file, buffer, length, offset);
 GROWABLE_HEAP_U32()[((result_p) >>> 2) >>> 0] = result;
 _emscripten_proxy_finish(ctx);
}

function __wasmfs_jsimpl_free_file(backend, file) {
 backend >>>= 0;
 file >>>= 0;
 return wasmFS$backends[backend].freeFile(file);
}

function __wasmfs_jsimpl_get_size(backend, file) {
 backend >>>= 0;
 file >>>= 0;
 return wasmFS$backends[backend].getSize(file);
}

function __wasmfs_jsimpl_read(backend, file, buffer, length, offset) {
 backend >>>= 0;
 file >>>= 0;
 buffer >>>= 0;
 length >>>= 0;
 offset = bigintToI53Checked(offset);
 if (!wasmFS$backends[backend].read) {
  return -28;
 }
 return wasmFS$backends[backend].read(file, buffer, length, offset);
}

function __wasmfs_jsimpl_write(backend, file, buffer, length, offset) {
 backend >>>= 0;
 file >>>= 0;
 buffer >>>= 0;
 length >>>= 0;
 offset = bigintToI53Checked(offset);
 if (!wasmFS$backends[backend].write) {
  return -28;
 }
 return wasmFS$backends[backend].write(file, buffer, length, offset);
}

class HandleAllocator {
 constructor() {
  this.allocated = [ undefined ];
  this.freelist = [];
 }
 get(id) {
  return this.allocated[id];
 }
 has(id) {
  return this.allocated[id] !== undefined;
 }
 allocate(handle) {
  var id = this.freelist.pop() || this.allocated.length;
  this.allocated[id] = handle;
  return id;
 }
 free(id) {
  this.allocated[id] = undefined;
  this.freelist.push(id);
 }
}

var wasmfsOPFSAccessHandles = new HandleAllocator;

var wasmfsOPFSProxyFinish = ctx => {
 _emscripten_proxy_finish(ctx);
};

async function __wasmfs_opfs_close_access(ctx, accessID, errPtr) {
 ctx >>>= 0;
 errPtr >>>= 0;
 let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
 try {
  await accessHandle.close();
 } catch {
  let err = -29;
  GROWABLE_HEAP_I32()[((errPtr) >>> 2) >>> 0] = err;
 }
 wasmfsOPFSAccessHandles.free(accessID);
 wasmfsOPFSProxyFinish(ctx);
}

var wasmfsOPFSBlobs = new HandleAllocator;

var __wasmfs_opfs_close_blob = blobID => {
 wasmfsOPFSBlobs.free(blobID);
};

function __wasmfs_opfs_flush_access(ctx, accessID, errPtr) {
 ctx >>>= 0;
 errPtr >>>= 0;
 let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
 (globalThis.__opfsStats ||= {
  reads: 0,
  readBytes: 0,
  writes: 0,
  writeBytes: 0,
  sizes: 0,
  flushes: 0,
  opens: 0
 }).flushes++;
 try {
  accessHandle.flush();
 } catch {
  let err = -29;
  GROWABLE_HEAP_I32()[((errPtr) >>> 2) >>> 0] = err;
 }
 wasmfsOPFSProxyFinish(ctx);
}

var wasmfsOPFSDirectoryHandles = new HandleAllocator;

var __wasmfs_opfs_free_directory = dirID => {
 wasmfsOPFSDirectoryHandles.free(dirID);
};

var wasmfsOPFSFileHandles = new HandleAllocator;

var __wasmfs_opfs_free_file = fileID => {
 wasmfsOPFSFileHandles.free(fileID);
};

async function wasmfsOPFSGetOrCreateFile(parent, name, create) {
 let parentHandle = wasmfsOPFSDirectoryHandles.get(parent);
 let fileHandle;
 try {
  fileHandle = await parentHandle.getFileHandle(name, {
   create: create
  });
 } catch (e) {
  if (e.name === "NotFoundError") {
   return -20;
  }
  if (e.name === "TypeMismatchError") {
   return -31;
  }
  return -29;
 }
 return wasmfsOPFSFileHandles.allocate(fileHandle);
}

async function wasmfsOPFSGetOrCreateDir(parent, name, create) {
 let parentHandle = wasmfsOPFSDirectoryHandles.get(parent);
 let childHandle;
 try {
  childHandle = await parentHandle.getDirectoryHandle(name, {
   create: create
  });
 } catch (e) {
  if (e.name === "NotFoundError") {
   return -20;
  }
  if (e.name === "TypeMismatchError") {
   return -54;
  }
  return -29;
 }
 return wasmfsOPFSDirectoryHandles.allocate(childHandle);
}

async function __wasmfs_opfs_get_child(ctx, parent, namePtr, childTypePtr, childIDPtr) {
 ctx >>>= 0;
 namePtr >>>= 0;
 childTypePtr >>>= 0;
 childIDPtr >>>= 0;
 let name = UTF8ToString(namePtr);
 let childType = 1;
 let childID = await wasmfsOPFSGetOrCreateFile(parent, name, false);
 if (childID == -31) {
  childType = 2;
  childID = await wasmfsOPFSGetOrCreateDir(parent, name, false);
 }
 GROWABLE_HEAP_I32()[((childTypePtr) >>> 2) >>> 0] = childType;
 GROWABLE_HEAP_I32()[((childIDPtr) >>> 2) >>> 0] = childID;
 wasmfsOPFSProxyFinish(ctx);
}

var __wasmfs_opfs_get_entries = async function(ctx, dirID, entriesPtr, errPtr) {
 ctx >>>= 0;
 entriesPtr >>>= 0;
 errPtr >>>= 0;
 let dirHandle = wasmfsOPFSDirectoryHandles.get(dirID);
 try {
  let iter = dirHandle.entries();
  for (let entry; entry = await iter.next(), !entry.done; ) {
   let [name, child] = entry.value;
   withStackSave(() => {
    let namePtr = stringToUTF8OnStack(name);
    let type = child.kind == "file" ? 1 : 2;
    __wasmfs_opfs_record_entry(entriesPtr, namePtr, type);
   });
  }
 } catch {
  let err = -29;
  GROWABLE_HEAP_I32()[((errPtr) >>> 2) >>> 0] = err;
 }
 wasmfsOPFSProxyFinish(ctx);
};

function __wasmfs_opfs_get_size_access(ctx, accessID, sizePtr) {
 ctx >>>= 0;
 sizePtr >>>= 0;
 let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
 let size;
 try {
  size = accessHandle.getSize();
 } catch {
  size = -29;
 }
 HEAP64[((sizePtr) >>> 3)] = BigInt(size);
 (globalThis.__opfsStats ||= {
  reads: 0,
  readBytes: 0,
  writes: 0,
  writeBytes: 0,
  sizes: 0,
  flushes: 0,
  opens: 0
 }).sizes++;
 wasmfsOPFSProxyFinish(ctx);
}

var __wasmfs_opfs_get_size_blob = blobID => wasmfsOPFSBlobs.get(blobID).size;

async function __wasmfs_opfs_get_size_file(ctx, fileID, sizePtr) {
 ctx >>>= 0;
 sizePtr >>>= 0;
 let fileHandle = wasmfsOPFSFileHandles.get(fileID);
 let size;
 try {
  size = (await fileHandle.getFile()).size;
 } catch {
  size = -29;
 }
 HEAP64[((sizePtr) >>> 3)] = BigInt(size);
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_init_root_directory(ctx) {
 ctx >>>= 0;
 if (wasmfsOPFSDirectoryHandles.allocated.length == 1) {
  /** @suppress {checkTypes} */ let root = await navigator.storage.getDirectory();
  wasmfsOPFSDirectoryHandles.allocated.push(root);
 }
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_insert_directory(ctx, parent, namePtr, childIDPtr) {
 ctx >>>= 0;
 namePtr >>>= 0;
 childIDPtr >>>= 0;
 let name = UTF8ToString(namePtr);
 let childID = await wasmfsOPFSGetOrCreateDir(parent, name, true);
 GROWABLE_HEAP_I32()[((childIDPtr) >>> 2) >>> 0] = childID;
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_insert_file(ctx, parent, namePtr, childIDPtr) {
 ctx >>>= 0;
 namePtr >>>= 0;
 childIDPtr >>>= 0;
 let name = UTF8ToString(namePtr);
 let childID = await wasmfsOPFSGetOrCreateFile(parent, name, true);
 GROWABLE_HEAP_I32()[((childIDPtr) >>> 2) >>> 0] = childID;
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_move_file(ctx, fileID, newParentID, namePtr, errPtr) {
 ctx >>>= 0;
 namePtr >>>= 0;
 errPtr >>>= 0;
 let name = UTF8ToString(namePtr);
 let fileHandle = wasmfsOPFSFileHandles.get(fileID);
 let newDirHandle = wasmfsOPFSDirectoryHandles.get(newParentID);
 try {
  await fileHandle.move(newDirHandle, name);
 } catch {
  let err = -29;
  GROWABLE_HEAP_I32()[((errPtr) >>> 2) >>> 0] = err;
 }
 wasmfsOPFSProxyFinish(ctx);
}

var wasmfsOPFSAccessModeSupported;

async function wasmfsOPFSGetAccessHandle(fileHandle, allowExclusive) {
 if (wasmfsOPFSAccessModeSupported === undefined) {
  try {
   let probe = await fileHandle.createSyncAccessHandle({
    mode: "__wasmfs_probe__"
   });
   await probe.close();
   wasmfsOPFSAccessModeSupported = false;
  } catch (e) {
   if (e.name !== "TypeError") {
    if (allowExclusive) {
     return fileHandle.createSyncAccessHandle();
    }
    throw e;
   }
   wasmfsOPFSAccessModeSupported = true;
  }
 }
 if (wasmfsOPFSAccessModeSupported) {
  return fileHandle.createSyncAccessHandle({
   mode: "readwrite-unsafe"
  });
 }
 if (allowExclusive) {
  return fileHandle.createSyncAccessHandle();
 }
 throw new DOMException("non-exclusive OPFS access handle unavailable", "NoModificationAllowedError");
}

async function __wasmfs_opfs_open_access(ctx, fileID, accessIDPtr, allowExclusive) {
 ctx >>>= 0;
 accessIDPtr >>>= 0;
 let fileHandle = wasmfsOPFSFileHandles.get(fileID);
 let accessID;
 try {
  let accessHandle;
  accessHandle = await wasmfsOPFSGetAccessHandle(fileHandle, allowExclusive);
  accessID = wasmfsOPFSAccessHandles.allocate(accessHandle);
 } catch (e) {
  if (e.name === "InvalidStateError" || e.name === "NoModificationAllowedError") {
   accessID = -2;
  } else {
   accessID = -29;
  }
 }
 GROWABLE_HEAP_I32()[((accessIDPtr) >>> 2) >>> 0] = accessID;
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_open_blob(ctx, fileID, blobIDPtr) {
 ctx >>>= 0;
 blobIDPtr >>>= 0;
 let fileHandle = wasmfsOPFSFileHandles.get(fileID);
 let blobID;
 try {
  let blob = await fileHandle.getFile();
  blobID = wasmfsOPFSBlobs.allocate(blob);
 } catch (e) {
  if (e.name === "NotAllowedError") {
   blobID = -2;
  } else {
   blobID = -29;
  }
 }
 GROWABLE_HEAP_I32()[((blobIDPtr) >>> 2) >>> 0] = blobID;
 wasmfsOPFSProxyFinish(ctx);
}

function __wasmfs_opfs_read_access(accessID, bufPtr, len, pos) {
 bufPtr >>>= 0;
 let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
 let data = GROWABLE_HEAP_U8().subarray(bufPtr >>> 0, bufPtr + len >>> 0);
 var S = (globalThis.__opfsStats ||= {
  reads: 0,
  readBytes: 0,
  writes: 0,
  writeBytes: 0,
  sizes: 0,
  flushes: 0,
  opens: 0
 });
 S.reads++;
 S.readBytes += len;
 if ((S.reads & 8191) === 0) err("OPFS_STATS reads=" + S.reads + " readMB=" + (S.readBytes / 1048576).toFixed(1) + " writes=" + S.writes + " writeMB=" + (S.writeBytes / 1048576).toFixed(1) + " getSize=" + S.sizes + " flush=" + S.flushes + " open=" + S.opens);
 try {
  return accessHandle.read(data, {
   at: pos
  });
 } catch (e) {
  if (e.name == "TypeError") {
   return -28;
  }
  return -29;
 }
}

async function __wasmfs_opfs_read_blob(ctx, blobID, bufPtr, len, pos, nreadPtr) {
 ctx >>>= 0;
 bufPtr >>>= 0;
 nreadPtr >>>= 0;
 let blob = wasmfsOPFSBlobs.get(blobID);
 let slice = blob.slice(pos, pos + len);
 let nread = 0;
 try {
  let buf = await slice.arrayBuffer();
  let data = new Uint8Array(buf);
  GROWABLE_HEAP_U8().set(data, bufPtr >>> 0);
  nread += data.length;
 } catch (e) {
  if (e instanceof RangeError) {
   nread = -21;
  } else {
   nread = -29;
  }
 }
 GROWABLE_HEAP_I32()[((nreadPtr) >>> 2) >>> 0] = nread;
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_remove_child(ctx, dirID, namePtr, errPtr) {
 ctx >>>= 0;
 namePtr >>>= 0;
 errPtr >>>= 0;
 let name = UTF8ToString(namePtr);
 let dirHandle = wasmfsOPFSDirectoryHandles.get(dirID);
 try {
  await dirHandle.removeEntry(name);
 } catch {
  let err = -29;
  GROWABLE_HEAP_I32()[((errPtr) >>> 2) >>> 0] = err;
 }
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_set_size_access(ctx, accessID, size, errPtr) {
 ctx >>>= 0;
 size = bigintToI53Checked(size);
 errPtr >>>= 0;
 let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
 try {
  await accessHandle.truncate(size);
 } catch {
  let err = -29;
  GROWABLE_HEAP_I32()[((errPtr) >>> 2) >>> 0] = err;
 }
 wasmfsOPFSProxyFinish(ctx);
}

async function __wasmfs_opfs_set_size_file(ctx, fileID, size, errPtr) {
 ctx >>>= 0;
 size = bigintToI53Checked(size);
 errPtr >>>= 0;
 let fileHandle = wasmfsOPFSFileHandles.get(fileID);
 try {
  let writable = await fileHandle.createWritable({
   keepExistingData: true
  });
  await writable.truncate(size);
  await writable.close();
 } catch {
  let err = -29;
  GROWABLE_HEAP_I32()[((errPtr) >>> 2) >>> 0] = err;
 }
 wasmfsOPFSProxyFinish(ctx);
}

function __wasmfs_opfs_write_access(accessID, bufPtr, len, pos) {
 bufPtr >>>= 0;
 let accessHandle = wasmfsOPFSAccessHandles.get(accessID);
 let data = GROWABLE_HEAP_U8().subarray(bufPtr >>> 0, bufPtr + len >>> 0);
 var S = (globalThis.__opfsStats ||= {
  reads: 0,
  readBytes: 0,
  writes: 0,
  writeBytes: 0,
  sizes: 0,
  flushes: 0,
  opens: 0
 });
 S.writes++;
 S.writeBytes += len;
 try {
  return accessHandle.write(data, {
   at: pos
  });
 } catch (e) {
  if (e.name == "TypeError") {
   return -28;
  }
  return -29;
 }
}

var FS_stdin_getChar_buffer = [];

/** @type {function(string, boolean=, number=)} */ function intArrayFromString(stringy, dontAddNull, length) {
 var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
 var u8array = new Array(len);
 var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
 if (dontAddNull) u8array.length = numBytesWritten;
 return u8array;
}

var FS_stdin_getChar = () => {
 if (!FS_stdin_getChar_buffer.length) {
  var result = null;
  if (typeof window != "undefined" && typeof window.prompt == "function") {
   result = window.prompt("Input: ");
   if (result !== null) {
    result += "\n";
   }
  } else if (typeof readline == "function") {
   result = readline();
   if (result !== null) {
    result += "\n";
   }
  }
  if (!result) {
   return null;
  }
  FS_stdin_getChar_buffer = intArrayFromString(result, true);
 }
 return FS_stdin_getChar_buffer.shift();
};

var __wasmfs_stdin_get_char = () => {
 var c = FS_stdin_getChar();
 if (typeof c === "number") {
  return c;
 }
 return -1;
};

var __wasmfs_thread_utils_heartbeat = function(queue) {
 queue >>>= 0;
 var intervalID = setInterval(() => {
  if (ABORT) {
   clearInterval(intervalID);
  } else {
   _emscripten_proxy_execute_queue(queue);
  }
 }, 2);
};

var _abort = () => {
 abort("");
};

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
 readEmAsmArgsArray.length = 0;
 var ch;
 while (ch = GROWABLE_HEAP_U8()[sigPtr++ >>> 0]) {
  var wide = (ch != 105);
  wide &= (ch != 112);
  buf += wide && (buf % 8) ? 4 : 0;
  readEmAsmArgsArray.push(ch == 112 ? GROWABLE_HEAP_U32()[((buf) >>> 2) >>> 0] : ch == 106 ? HEAP64[((buf) >>> 3)] : ch == 105 ? GROWABLE_HEAP_I32()[((buf) >>> 2) >>> 0] : GROWABLE_HEAP_F64()[((buf) >>> 3) >>> 0]);
  buf += wide ? 8 : 4;
 }
 return readEmAsmArgsArray;
};

var runMainThreadEmAsm = (emAsmAddr, sigPtr, argbuf, sync) => {
 var args = readEmAsmArgs(sigPtr, argbuf);
 if (ENVIRONMENT_IS_PTHREAD) {
  return proxyToMainThread(0, emAsmAddr, sync, ...args);
 }
 return ASM_CONSTS[emAsmAddr](...args);
};

function _emscripten_asm_const_async_on_main_thread(emAsmAddr, sigPtr, argbuf) {
 emAsmAddr >>>= 0;
 sigPtr >>>= 0;
 argbuf >>>= 0;
 return runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 0);
}

/** @suppress {duplicate } */ function _emscripten_asm_const_int_sync_on_main_thread(emAsmAddr, sigPtr, argbuf) {
 emAsmAddr >>>= 0;
 sigPtr >>>= 0;
 argbuf >>>= 0;
 return runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);
}

var _emscripten_asm_const_double_sync_on_main_thread = _emscripten_asm_const_int_sync_on_main_thread;

var runEmAsmFunction = (code, sigPtr, argbuf) => {
 var args = readEmAsmArgs(sigPtr, argbuf);
 return ASM_CONSTS[code](...args);
};

function _emscripten_asm_const_int(code, sigPtr, argbuf) {
 code >>>= 0;
 sigPtr >>>= 0;
 argbuf >>>= 0;
 return runEmAsmFunction(code, sigPtr, argbuf);
}

function _emscripten_asm_const_ptr_sync_on_main_thread(emAsmAddr, sigPtr, argbuf) {
 emAsmAddr >>>= 0;
 sigPtr >>>= 0;
 argbuf >>>= 0;
 return runMainThreadEmAsm(emAsmAddr, sigPtr, argbuf, 1);
}

var runtimeKeepalivePush = () => {
 runtimeKeepaliveCounter += 1;
};

var _emscripten_set_main_loop_timing = (mode, value) => {
 Browser.mainLoop.timingMode = mode;
 Browser.mainLoop.timingValue = value;
 if (!Browser.mainLoop.func) {
  return 1;
 }
 if (!Browser.mainLoop.running) {
  runtimeKeepalivePush();
  Browser.mainLoop.running = true;
 }
 if (mode == 0) {
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
   var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
   setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
  };
  Browser.mainLoop.method = "timeout";
 } else if (mode == 1) {
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
   Browser.requestAnimationFrame(Browser.mainLoop.runner);
  };
  Browser.mainLoop.method = "rAF";
 } else if (mode == 2) {
  if (typeof Browser.setImmediate == "undefined") {
   if (typeof setImmediate == "undefined") {
    var setImmediates = [];
    var emscriptenMainLoopMessageId = "setimmediate";
    /** @param {Event} event */ var Browser_setImmediate_messageHandler = event => {
     if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
      event.stopPropagation();
      setImmediates.shift()();
     }
    };
    addEventListener("message", Browser_setImmediate_messageHandler, true);
    Browser.setImmediate = /** @type{function(function(): ?, ...?): number} */ (function Browser_emulated_setImmediate(func) {
     setImmediates.push(func);
     if (ENVIRONMENT_IS_WORKER) {
      if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
      Module["setImmediates"].push(func);
      postMessage({
       target: emscriptenMainLoopMessageId
      });
     } else postMessage(emscriptenMainLoopMessageId, "*");
    });
   } else {
    Browser.setImmediate = setImmediate;
   }
  }
  Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
   Browser.setImmediate(Browser.mainLoop.runner);
  };
  Browser.mainLoop.method = "immediate";
 }
 return 0;
};

var runtimeKeepalivePop = () => {
 runtimeKeepaliveCounter -= 1;
};

/**
     * @param {number=} arg
     * @param {boolean=} noSetTiming
     */ var setMainLoop = (browserIterationFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
 Browser.mainLoop.func = browserIterationFunc;
 Browser.mainLoop.arg = arg;
 /** @type{number} */ var thisMainLoopId = (() => Browser.mainLoop.currentlyRunningMainloop)();
 function checkIsRunning() {
  if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) {
   runtimeKeepalivePop();
   maybeExit();
   return false;
  }
  return true;
 }
 Browser.mainLoop.running = false;
 Browser.mainLoop.runner = function Browser_mainLoop_runner() {
  if (ABORT) return;
  if (Browser.mainLoop.queue.length > 0) {
   var start = Date.now();
   var blocker = Browser.mainLoop.queue.shift();
   blocker.func(blocker.arg);
   if (Browser.mainLoop.remainingBlockers) {
    var remaining = Browser.mainLoop.remainingBlockers;
    var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
    if (blocker.counted) {
     Browser.mainLoop.remainingBlockers = next;
    } else {
     next = next + .5;
     Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
    }
   }
   Browser.mainLoop.updateStatus();
   if (!checkIsRunning()) return;
   setTimeout(Browser.mainLoop.runner, 0);
   return;
  }
  if (!checkIsRunning()) return;
  Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
  if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
   Browser.mainLoop.scheduler();
   return;
  } else if (Browser.mainLoop.timingMode == 0) {
   Browser.mainLoop.tickStartTime = _emscripten_get_now();
  }
  if (typeof GL != "undefined" && GL.currentContext && !GL.currentContextIsProxied && !GL.currentContext.attributes.explicitSwapControl && GL.currentContext.GLctx.commit) {
   GL.currentContext.GLctx.commit();
  }
  Browser.mainLoop.runIter(browserIterationFunc);
  if (!checkIsRunning()) return;
  if (typeof SDL == "object") SDL.audio?.queueNewAudioData?.();
  Browser.mainLoop.scheduler();
 };
 if (!noSetTiming) {
  if (fps && fps > 0) {
   _emscripten_set_main_loop_timing(0, 1e3 / fps);
  } else {
   _emscripten_set_main_loop_timing(1, 1);
  }
  Browser.mainLoop.scheduler();
 }
 if (simulateInfiniteLoop) {
  throw "unwind";
 }
};

/** @param {number=} timeout */ var safeSetTimeout = (func, timeout) => {
 runtimeKeepalivePush();
 return setTimeout(() => {
  runtimeKeepalivePop();
  callUserCallback(func);
 }, timeout);
};

var warnOnce = text => {
 warnOnce.shown ||= {};
 if (!warnOnce.shown[text]) {
  warnOnce.shown[text] = 1;
  err(text);
 }
};

var preloadPlugins = Module["preloadPlugins"] || [];

var Browser = {
 mainLoop: {
  running: false,
  scheduler: null,
  method: "",
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  pause() {
   Browser.mainLoop.scheduler = null;
   Browser.mainLoop.currentlyRunningMainloop++;
  },
  resume() {
   Browser.mainLoop.currentlyRunningMainloop++;
   var timingMode = Browser.mainLoop.timingMode;
   var timingValue = Browser.mainLoop.timingValue;
   var func = Browser.mainLoop.func;
   Browser.mainLoop.func = null;
   setMainLoop(func, 0, false, Browser.mainLoop.arg, true);
   _emscripten_set_main_loop_timing(timingMode, timingValue);
   Browser.mainLoop.scheduler();
  },
  updateStatus() {
   if (Module["setStatus"]) {
    var message = Module["statusMessage"] || "Please wait...";
    var remaining = Browser.mainLoop.remainingBlockers;
    var expected = Browser.mainLoop.expectedBlockers;
    if (remaining) {
     if (remaining < expected) {
      Module["setStatus"](`{message} ({expected - remaining}/{expected})`);
     } else {
      Module["setStatus"](message);
     }
    } else {
     Module["setStatus"]("");
    }
   }
  },
  runIter(func) {
   if (ABORT) return;
   if (Module["preMainLoop"]) {
    var preRet = Module["preMainLoop"]();
    if (preRet === false) {
     return;
    }
   }
   callUserCallback(func);
   Module["postMainLoop"]?.();
  }
 },
 isFullscreen: false,
 pointerLock: false,
 moduleContextCreatedCallbacks: [],
 workers: [],
 init() {
  if (Browser.initted) return;
  Browser.initted = true;
  var imagePlugin = {};
  imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
   return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
  };
  imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
   var b = new Blob([ byteArray ], {
    type: Browser.getMimetype(name)
   });
   if (b.size !== byteArray.length) {
    b = new Blob([ (new Uint8Array(byteArray)).buffer ], {
     type: Browser.getMimetype(name)
    });
   }
   var url = URL.createObjectURL(b);
   var img = new Image;
   img.onload = () => {
    var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement("canvas"));
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    preloadedImages[name] = canvas;
    URL.revokeObjectURL(url);
    onload?.(byteArray);
   };
   img.onerror = event => {
    err(`Image ${url} could not be decoded`);
    onerror?.();
   };
   img.src = url;
  };
  preloadPlugins.push(imagePlugin);
  var audioPlugin = {};
  audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
   return !Module.noAudioDecoding && name.substr(-4) in {
    ".ogg": 1,
    ".wav": 1,
    ".mp3": 1
   };
  };
  audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
   var done = false;
   function finish(audio) {
    if (done) return;
    done = true;
    preloadedAudios[name] = audio;
    onload?.(byteArray);
   }
   function fail() {
    if (done) return;
    done = true;
    preloadedAudios[name] = new Audio;
    onerror?.();
   }
   var b = new Blob([ byteArray ], {
    type: Browser.getMimetype(name)
   });
   var url = URL.createObjectURL(b);
   var audio = new Audio;
   audio.addEventListener("canplaythrough", () => finish(audio), false);
   audio.onerror = function audio_onerror(event) {
    if (done) return;
    err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
    function encode64(data) {
     var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
     var PAD = "=";
     var ret = "";
     var leftchar = 0;
     var leftbits = 0;
     for (var i = 0; i < data.length; i++) {
      leftchar = (leftchar << 8) | data[i];
      leftbits += 8;
      while (leftbits >= 6) {
       var curr = (leftchar >> (leftbits - 6)) & 63;
       leftbits -= 6;
       ret += BASE[curr];
      }
     }
     if (leftbits == 2) {
      ret += BASE[(leftchar & 3) << 4];
      ret += PAD + PAD;
     } else if (leftbits == 4) {
      ret += BASE[(leftchar & 15) << 2];
      ret += PAD;
     }
     return ret;
    }
    audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
    finish(audio);
   };
   audio.src = url;
   safeSetTimeout(() => {
    finish(audio);
   }, 1e4);
  };
  preloadPlugins.push(audioPlugin);
  function pointerLockChange() {
   Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"];
  }
  var canvas = Module["canvas"];
  if (canvas) {
   canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || (() => {});
   canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || (() => {});
   canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
   document.addEventListener("pointerlockchange", pointerLockChange, false);
   document.addEventListener("mozpointerlockchange", pointerLockChange, false);
   document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
   document.addEventListener("mspointerlockchange", pointerLockChange, false);
   if (Module["elementPointerLock"]) {
    canvas.addEventListener("click", ev => {
     if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
      Module["canvas"].requestPointerLock();
      ev.preventDefault();
     }
    }, false);
   }
  }
 },
 createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
  if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
  var ctx;
  var contextHandle;
  if (useWebGL) {
   var contextAttributes = {
    antialias: false,
    alpha: false,
    majorVersion: 1
   };
   if (webGLContextAttributes) {
    for (var attribute in webGLContextAttributes) {
     contextAttributes[attribute] = webGLContextAttributes[attribute];
    }
   }
   if (typeof GL != "undefined") {
    contextHandle = GL.createContext(canvas, contextAttributes);
    if (contextHandle) {
     ctx = GL.getContext(contextHandle).GLctx;
    }
   }
  } else {
   ctx = canvas.getContext("2d");
  }
  if (!ctx) return null;
  if (setInModule) {
   Module.ctx = ctx;
   if (useWebGL) GL.makeContextCurrent(contextHandle);
   Module.useWebGL = useWebGL;
   Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
   Browser.init();
  }
  return ctx;
 },
 destroyContext(canvas, useWebGL, setInModule) {},
 fullscreenHandlersInstalled: false,
 lockPointer: undefined,
 resizeCanvas: undefined,
 requestFullscreen(lockPointer, resizeCanvas) {
  Browser.lockPointer = lockPointer;
  Browser.resizeCanvas = resizeCanvas;
  if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
  if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
  var canvas = Module["canvas"];
  function fullscreenChange() {
   Browser.isFullscreen = false;
   var canvasContainer = canvas.parentNode;
   if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
    canvas.exitFullscreen = Browser.exitFullscreen;
    if (Browser.lockPointer) canvas.requestPointerLock();
    Browser.isFullscreen = true;
    if (Browser.resizeCanvas) {
     Browser.setFullscreenCanvasSize();
    } else {
     Browser.updateCanvasDimensions(canvas);
    }
   } else {
    canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
    canvasContainer.parentNode.removeChild(canvasContainer);
    if (Browser.resizeCanvas) {
     Browser.setWindowedCanvasSize();
    } else {
     Browser.updateCanvasDimensions(canvas);
    }
   }
   Module["onFullScreen"]?.(Browser.isFullscreen);
   Module["onFullscreen"]?.(Browser.isFullscreen);
  }
  if (!Browser.fullscreenHandlersInstalled) {
   Browser.fullscreenHandlersInstalled = true;
   document.addEventListener("fullscreenchange", fullscreenChange, false);
   document.addEventListener("mozfullscreenchange", fullscreenChange, false);
   document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
   document.addEventListener("MSFullscreenChange", fullscreenChange, false);
  }
  var canvasContainer = document.createElement("div");
  canvas.parentNode.insertBefore(canvasContainer, canvas);
  canvasContainer.appendChild(canvas);
  canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
  canvasContainer.requestFullscreen();
 },
 exitFullscreen() {
  if (!Browser.isFullscreen) {
   return false;
  }
  var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (() => {});
  CFS.apply(document, []);
  return true;
 },
 nextRAF: 0,
 fakeRequestAnimationFrame(func) {
  var now = Date.now();
  if (Browser.nextRAF === 0) {
   Browser.nextRAF = now + 1e3 / 60;
  } else {
   while (now + 2 >= Browser.nextRAF) {
    Browser.nextRAF += 1e3 / 60;
   }
  }
  var delay = Math.max(Browser.nextRAF - now, 0);
  setTimeout(func, delay);
 },
 requestAnimationFrame(func) {
  if (typeof requestAnimationFrame == "function") {
   requestAnimationFrame(func);
   return;
  }
  var RAF = Browser.fakeRequestAnimationFrame;
  RAF(func);
 },
 safeSetTimeout(func, timeout) {
  return safeSetTimeout(func, timeout);
 },
 safeRequestAnimationFrame(func) {
  runtimeKeepalivePush();
  return Browser.requestAnimationFrame(() => {
   runtimeKeepalivePop();
   callUserCallback(func);
  });
 },
 getMimetype(name) {
  return {
   "jpg": "image/jpeg",
   "jpeg": "image/jpeg",
   "png": "image/png",
   "bmp": "image/bmp",
   "ogg": "audio/ogg",
   "wav": "audio/wav",
   "mp3": "audio/mpeg"
  }[name.substr(name.lastIndexOf(".") + 1)];
 },
 getUserMedia(func) {
  window.getUserMedia ||= navigator["getUserMedia"] || navigator["mozGetUserMedia"];
  window.getUserMedia(func);
 },
 getMovementX(event) {
  return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
 },
 getMovementY(event) {
  return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
 },
 getMouseWheelDelta(event) {
  var delta = 0;
  switch (event.type) {
  case "DOMMouseScroll":
   delta = event.detail / 3;
   break;

  case "mousewheel":
   delta = event.wheelDelta / 120;
   break;

  case "wheel":
   delta = event.deltaY;
   switch (event.deltaMode) {
   case 0:
    delta /= 100;
    break;

   case 1:
    delta /= 3;
    break;

   case 2:
    delta *= 80;
    break;

   default:
    throw "unrecognized mouse wheel delta mode: " + event.deltaMode;
   }
   break;

  default:
   throw "unrecognized mouse wheel event: " + event.type;
  }
  return delta;
 },
 mouseX: 0,
 mouseY: 0,
 mouseMovementX: 0,
 mouseMovementY: 0,
 touches: {},
 lastTouches: {},
 calculateMouseCoords(pageX, pageY) {
  var rect = Module["canvas"].getBoundingClientRect();
  var cw = Module["canvas"].width;
  var ch = Module["canvas"].height;
  var scrollX = ((typeof window.scrollX != "undefined") ? window.scrollX : window.pageXOffset);
  var scrollY = ((typeof window.scrollY != "undefined") ? window.scrollY : window.pageYOffset);
  var adjustedX = pageX - (scrollX + rect.left);
  var adjustedY = pageY - (scrollY + rect.top);
  adjustedX = adjustedX * (cw / rect.width);
  adjustedY = adjustedY * (ch / rect.height);
  return {
   x: adjustedX,
   y: adjustedY
  };
 },
 setMouseCoords(pageX, pageY) {
  const {x: x, y: y} = Browser.calculateMouseCoords(pageX, pageY);
  Browser.mouseMovementX = x - Browser.mouseX;
  Browser.mouseMovementY = y - Browser.mouseY;
  Browser.mouseX = x;
  Browser.mouseY = y;
 },
 calculateMouseEvent(event) {
  if (Browser.pointerLock) {
   if (event.type != "mousemove" && ("mozMovementX" in event)) {
    Browser.mouseMovementX = Browser.mouseMovementY = 0;
   } else {
    Browser.mouseMovementX = Browser.getMovementX(event);
    Browser.mouseMovementY = Browser.getMovementY(event);
   }
   if (typeof SDL != "undefined") {
    Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
    Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
   } else {
    Browser.mouseX += Browser.mouseMovementX;
    Browser.mouseY += Browser.mouseMovementY;
   }
  } else {
   if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
    var touch = event.touch;
    if (touch === undefined) {
     return;
    }
    var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
    if (event.type === "touchstart") {
     Browser.lastTouches[touch.identifier] = coords;
     Browser.touches[touch.identifier] = coords;
    } else if (event.type === "touchend" || event.type === "touchmove") {
     var last = Browser.touches[touch.identifier];
     last ||= coords;
     Browser.lastTouches[touch.identifier] = last;
     Browser.touches[touch.identifier] = coords;
    }
    return;
   }
   Browser.setMouseCoords(event.pageX, event.pageY);
  }
 },
 resizeListeners: [],
 updateResizeListeners() {
  var canvas = Module["canvas"];
  Browser.resizeListeners.forEach(listener => listener(canvas.width, canvas.height));
 },
 setCanvasSize(width, height, noUpdates) {
  var canvas = Module["canvas"];
  Browser.updateCanvasDimensions(canvas, width, height);
  if (!noUpdates) Browser.updateResizeListeners();
 },
 windowedWidth: 0,
 windowedHeight: 0,
 setFullscreenCanvasSize() {
  if (typeof SDL != "undefined") {
   var flags = GROWABLE_HEAP_U32()[((SDL.screen) >>> 2) >>> 0];
   flags = flags | 8388608;
   GROWABLE_HEAP_I32()[((SDL.screen) >>> 2) >>> 0] = flags;
  }
  Browser.updateCanvasDimensions(Module["canvas"]);
  Browser.updateResizeListeners();
 },
 setWindowedCanvasSize() {
  if (typeof SDL != "undefined") {
   var flags = GROWABLE_HEAP_U32()[((SDL.screen) >>> 2) >>> 0];
   flags = flags & ~8388608;
   GROWABLE_HEAP_I32()[((SDL.screen) >>> 2) >>> 0] = flags;
  }
  Browser.updateCanvasDimensions(Module["canvas"]);
  Browser.updateResizeListeners();
 },
 updateCanvasDimensions(canvas, wNative, hNative) {
  if (wNative && hNative) {
   canvas.widthNative = wNative;
   canvas.heightNative = hNative;
  } else {
   wNative = canvas.widthNative;
   hNative = canvas.heightNative;
  }
  var w = wNative;
  var h = hNative;
  if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
   if (w / h < Module["forcedAspectRatio"]) {
    w = Math.round(h * Module["forcedAspectRatio"]);
   } else {
    h = Math.round(w / Module["forcedAspectRatio"]);
   }
  }
  if (((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode) && (typeof screen != "undefined")) {
   var factor = Math.min(screen.width / w, screen.height / h);
   w = Math.round(w * factor);
   h = Math.round(h * factor);
  }
  if (Browser.resizeCanvas) {
   if (canvas.width != w) canvas.width = w;
   if (canvas.height != h) canvas.height = h;
   if (typeof canvas.style != "undefined") {
    canvas.style.removeProperty("width");
    canvas.style.removeProperty("height");
   }
  } else {
   if (canvas.width != wNative) canvas.width = wNative;
   if (canvas.height != hNative) canvas.height = hNative;
   if (typeof canvas.style != "undefined") {
    if (w != wNative || h != hNative) {
     canvas.style.setProperty("width", w + "px", "important");
     canvas.style.setProperty("height", h + "px", "important");
    } else {
     canvas.style.removeProperty("width");
     canvas.style.removeProperty("height");
    }
   }
  }
 }
};

var _emscripten_cancel_main_loop = () => {
 Browser.mainLoop.pause();
 Browser.mainLoop.func = null;
};

var _emscripten_check_blocking_allowed = () => {};

function _emscripten_console_log(str) {
 str >>>= 0;
 console.log(UTF8ToString(str));
}

var _emscripten_date_now = () => Date.now();

function _emscripten_err(str) {
 str >>>= 0;
 return err(UTF8ToString(str));
}

var currentFullscreenStrategy = {};

var getCanvasSizeCallingThread = (target, width, height) => {
 var canvas = findCanvasEventTarget(target);
 if (!canvas) return -4;
 if (canvas.canvasSharedPtr) {
  var w = GROWABLE_HEAP_I32()[((canvas.canvasSharedPtr) >>> 2) >>> 0];
  var h = GROWABLE_HEAP_I32()[(((canvas.canvasSharedPtr) + (4)) >>> 2) >>> 0];
  GROWABLE_HEAP_I32()[((width) >>> 2) >>> 0] = w;
  GROWABLE_HEAP_I32()[((height) >>> 2) >>> 0] = h;
 } else if (canvas.offscreenCanvas) {
  GROWABLE_HEAP_I32()[((width) >>> 2) >>> 0] = canvas.offscreenCanvas.width;
  GROWABLE_HEAP_I32()[((height) >>> 2) >>> 0] = canvas.offscreenCanvas.height;
 } else if (!canvas.controlTransferredOffscreen) {
  GROWABLE_HEAP_I32()[((width) >>> 2) >>> 0] = canvas.width;
  GROWABLE_HEAP_I32()[((height) >>> 2) >>> 0] = canvas.height;
 } else {
  return -4;
 }
 return 0;
};

function getCanvasSizeMainThread(target, width, height) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(7, 0, 1, target, width, height);
 return getCanvasSizeCallingThread(target, width, height);
}

function _emscripten_get_canvas_element_size(target, width, height) {
 target >>>= 0;
 width >>>= 0;
 height >>>= 0;
 var canvas = findCanvasEventTarget(target);
 if (canvas) {
  return getCanvasSizeCallingThread(target, width, height);
 }
 return getCanvasSizeMainThread(target, width, height);
}

var stringToUTF8OnStack = str => {
 var size = lengthBytesUTF8(str) + 1;
 var ret = stackAlloc(size);
 stringToUTF8(str, ret, size);
 return ret;
};

var getCanvasElementSize = target => withStackSave(() => {
 var w = stackAlloc(8);
 var h = w + 4;
 var targetInt = stringToUTF8OnStack(target.id);
 var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
 var size = [ GROWABLE_HEAP_I32()[((w) >>> 2) >>> 0], GROWABLE_HEAP_I32()[((h) >>> 2) >>> 0] ];
 return size;
});

var setCanvasElementSize = (target, width, height) => {
 if (!target.controlTransferredOffscreen) {
  target.width = width;
  target.height = height;
 } else {
  withStackSave(() => {
   var targetInt = stringToUTF8OnStack(target.id);
   _emscripten_set_canvas_element_size(targetInt, width, height);
  });
 }
};

var registerRestoreOldStyle = canvas => {
 var canvasSize = getCanvasElementSize(canvas);
 var oldWidth = canvasSize[0];
 var oldHeight = canvasSize[1];
 var oldCssWidth = canvas.style.width;
 var oldCssHeight = canvas.style.height;
 var oldBackgroundColor = canvas.style.backgroundColor;
 var oldDocumentBackgroundColor = document.body.style.backgroundColor;
 var oldPaddingLeft = canvas.style.paddingLeft;
 var oldPaddingRight = canvas.style.paddingRight;
 var oldPaddingTop = canvas.style.paddingTop;
 var oldPaddingBottom = canvas.style.paddingBottom;
 var oldMarginLeft = canvas.style.marginLeft;
 var oldMarginRight = canvas.style.marginRight;
 var oldMarginTop = canvas.style.marginTop;
 var oldMarginBottom = canvas.style.marginBottom;
 var oldDocumentBodyMargin = document.body.style.margin;
 var oldDocumentOverflow = document.documentElement.style.overflow;
 var oldDocumentScroll = document.body.scroll;
 var oldImageRendering = canvas.style.imageRendering;
 function restoreOldStyle() {
  var fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
   document.removeEventListener("fullscreenchange", restoreOldStyle);
   setCanvasElementSize(canvas, oldWidth, oldHeight);
   canvas.style.width = oldCssWidth;
   canvas.style.height = oldCssHeight;
   canvas.style.backgroundColor = oldBackgroundColor;
   if (!oldDocumentBackgroundColor) document.body.style.backgroundColor = "white";
   document.body.style.backgroundColor = oldDocumentBackgroundColor;
   canvas.style.paddingLeft = oldPaddingLeft;
   canvas.style.paddingRight = oldPaddingRight;
   canvas.style.paddingTop = oldPaddingTop;
   canvas.style.paddingBottom = oldPaddingBottom;
   canvas.style.marginLeft = oldMarginLeft;
   canvas.style.marginRight = oldMarginRight;
   canvas.style.marginTop = oldMarginTop;
   canvas.style.marginBottom = oldMarginBottom;
   document.body.style.margin = oldDocumentBodyMargin;
   document.documentElement.style.overflow = oldDocumentOverflow;
   document.body.scroll = oldDocumentScroll;
   canvas.style.imageRendering = oldImageRendering;
   if (canvas.GLctxObject) canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
   if (currentFullscreenStrategy.canvasResizedCallback) {
    if (currentFullscreenStrategy.canvasResizedCallbackTargetThread) __emscripten_run_callback_on_thread(currentFullscreenStrategy.canvasResizedCallbackTargetThread, currentFullscreenStrategy.canvasResizedCallback, 37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData); else getWasmTableEntry(currentFullscreenStrategy.canvasResizedCallback)(37, 0, currentFullscreenStrategy.canvasResizedCallbackUserData);
   }
  }
 }
 document.addEventListener("fullscreenchange", restoreOldStyle);
 return restoreOldStyle;
};

var setLetterbox = (element, topBottom, leftRight) => {
 element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
 element.style.paddingTop = element.style.paddingBottom = topBottom + "px";
};

/** @type {Object} */ var specialHTMLTargets = [ 0, typeof document != "undefined" ? document : 0, typeof window != "undefined" ? window : 0 ];

var getBoundingClientRect = e => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
 "left": 0,
 "top": 0
};

var JSEvents_resizeCanvasForFullscreen = (target, strategy) => {
 var restoreOldStyle = registerRestoreOldStyle(target);
 var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
 var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
 var rect = getBoundingClientRect(target);
 var windowedCssWidth = rect.width;
 var windowedCssHeight = rect.height;
 var canvasSize = getCanvasElementSize(target);
 var windowedRttWidth = canvasSize[0];
 var windowedRttHeight = canvasSize[1];
 if (strategy.scaleMode == 3) {
  setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
  cssWidth = windowedCssWidth;
  cssHeight = windowedCssHeight;
 } else if (strategy.scaleMode == 2) {
  if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
   var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
   setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
   cssHeight = desiredCssHeight;
  } else {
   var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
   setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
   cssWidth = desiredCssWidth;
  }
 }
 if (!target.style.backgroundColor) target.style.backgroundColor = "black";
 if (!document.body.style.backgroundColor) document.body.style.backgroundColor = "black";
 target.style.width = cssWidth + "px";
 target.style.height = cssHeight + "px";
 if (strategy.filteringMode == 1) {
  target.style.imageRendering = "optimizeSpeed";
  target.style.imageRendering = "-moz-crisp-edges";
  target.style.imageRendering = "-o-crisp-edges";
  target.style.imageRendering = "-webkit-optimize-contrast";
  target.style.imageRendering = "optimize-contrast";
  target.style.imageRendering = "crisp-edges";
  target.style.imageRendering = "pixelated";
 }
 var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? devicePixelRatio : 1;
 if (strategy.canvasResolutionScaleMode != 0) {
  var newWidth = (cssWidth * dpiScale) | 0;
  var newHeight = (cssHeight * dpiScale) | 0;
  setCanvasElementSize(target, newWidth, newHeight);
  if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
 }
 return restoreOldStyle;
};

var JSEvents_requestFullscreen = (target, strategy) => {
 if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
  JSEvents_resizeCanvasForFullscreen(target, strategy);
 }
 if (target.requestFullscreen) {
  target.requestFullscreen();
 } else {
  return JSEvents.fullscreenEnabled() ? -3 : -1;
 }
 currentFullscreenStrategy = strategy;
 if (strategy.canvasResizedCallback) {
  if (strategy.canvasResizedCallbackTargetThread) __emscripten_run_callback_on_thread(strategy.canvasResizedCallbackTargetThread, strategy.canvasResizedCallback, 37, 0, strategy.canvasResizedCallbackUserData); else getWasmTableEntry(strategy.canvasResizedCallback)(37, 0, strategy.canvasResizedCallbackUserData);
 }
 return 0;
};

function _emscripten_exit_fullscreen() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(6, 0, 1);
 if (!JSEvents.fullscreenEnabled()) return -1;
 JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
 var d = specialHTMLTargets[1];
 if (d.exitFullscreen) {
  d.fullscreenElement && d.exitFullscreen();
 } else {
  return -1;
 }
 return 0;
}

var requestPointerLock = target => {
 if (target.requestPointerLock) {
  target.requestPointerLock();
 } else {
  if (document.body.requestPointerLock) {
   return -3;
  }
  return -1;
 }
 return 0;
};

function _emscripten_exit_pointerlock() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(8, 0, 1);
 JSEvents.removeDeferredCalls(requestPointerLock);
 if (document.exitPointerLock) {
  document.exitPointerLock();
 } else {
  return -1;
 }
 return 0;
}

var _emscripten_exit_with_live_runtime = () => {
 runtimeKeepalivePush();
 throw "unwind";
};

function _emscripten_force_exit(status) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(9, 0, 1, status);
 __emscripten_runtime_keepalive_clear();
 _exit(status);
}

Module["_emscripten_force_exit"] = _emscripten_force_exit;

function _emscripten_get_device_pixel_ratio() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(10, 0, 1);
 return devicePixelRatio;
}

var findEventTarget = target => {
 target = maybeCStringToJsString(target);
 var domElement = specialHTMLTargets[target] || (typeof document != "undefined" ? document.querySelector(target) : undefined);
 return domElement;
};

function _emscripten_get_element_css_size(target, width, height) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(11, 0, 1, target, width, height);
 target >>>= 0;
 width >>>= 0;
 height >>>= 0;
 target = findEventTarget(target);
 if (!target) return -4;
 var rect = getBoundingClientRect(target);
 GROWABLE_HEAP_F64()[((width) >>> 3) >>> 0] = rect.width;
 GROWABLE_HEAP_F64()[((height) >>> 3) >>> 0] = rect.height;
 return 0;
}

var fillFullscreenChangeEventData = eventStruct => {
 var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
 var isFullscreen = !!fullscreenElement;
 /** @suppress{checkTypes} */ GROWABLE_HEAP_I32()[((eventStruct) >>> 2) >>> 0] = isFullscreen;
 GROWABLE_HEAP_I32()[(((eventStruct) + (4)) >>> 2) >>> 0] = JSEvents.fullscreenEnabled();
 var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
 var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
 var id = reportedElement?.id || "";
 stringToUTF8(nodeName, eventStruct + 8, 128);
 stringToUTF8(id, eventStruct + 136, 128);
 GROWABLE_HEAP_I32()[(((eventStruct) + (264)) >>> 2) >>> 0] = reportedElement ? reportedElement.clientWidth : 0;
 GROWABLE_HEAP_I32()[(((eventStruct) + (268)) >>> 2) >>> 0] = reportedElement ? reportedElement.clientHeight : 0;
 GROWABLE_HEAP_I32()[(((eventStruct) + (272)) >>> 2) >>> 0] = screen.width;
 GROWABLE_HEAP_I32()[(((eventStruct) + (276)) >>> 2) >>> 0] = screen.height;
 if (isFullscreen) {
  JSEvents.previousFullscreenElement = fullscreenElement;
 }
};

function _emscripten_get_fullscreen_status(fullscreenStatus) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(12, 0, 1, fullscreenStatus);
 fullscreenStatus >>>= 0;
 if (!JSEvents.fullscreenEnabled()) return -1;
 fillFullscreenChangeEventData(fullscreenStatus);
 return 0;
}

var fillGamepadEventData = (eventStruct, e) => {
 GROWABLE_HEAP_F64()[((eventStruct) >>> 3) >>> 0] = e.timestamp;
 for (var i = 0; i < e.axes.length; ++i) {
  GROWABLE_HEAP_F64()[(((eventStruct + i * 8) + (16)) >>> 3) >>> 0] = e.axes[i];
 }
 for (var i = 0; i < e.buttons.length; ++i) {
  if (typeof e.buttons[i] == "object") {
   GROWABLE_HEAP_F64()[(((eventStruct + i * 8) + (528)) >>> 3) >>> 0] = e.buttons[i].value;
  } else {
   GROWABLE_HEAP_F64()[(((eventStruct + i * 8) + (528)) >>> 3) >>> 0] = e.buttons[i];
  }
 }
 for (var i = 0; i < e.buttons.length; ++i) {
  if (typeof e.buttons[i] == "object") {
   GROWABLE_HEAP_I32()[(((eventStruct + i * 4) + (1040)) >>> 2) >>> 0] = e.buttons[i].pressed;
  } else {
   /** @suppress {checkTypes} */ GROWABLE_HEAP_I32()[(((eventStruct + i * 4) + (1040)) >>> 2) >>> 0] = e.buttons[i] == 1;
  }
 }
 GROWABLE_HEAP_I32()[(((eventStruct) + (1296)) >>> 2) >>> 0] = e.connected;
 GROWABLE_HEAP_I32()[(((eventStruct) + (1300)) >>> 2) >>> 0] = e.index;
 GROWABLE_HEAP_I32()[(((eventStruct) + (8)) >>> 2) >>> 0] = e.axes.length;
 GROWABLE_HEAP_I32()[(((eventStruct) + (12)) >>> 2) >>> 0] = e.buttons.length;
 stringToUTF8(e.id, eventStruct + 1304, 64);
 stringToUTF8(e.mapping, eventStruct + 1368, 64);
};

function _emscripten_get_gamepad_status(index, gamepadState) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(13, 0, 1, index, gamepadState);
 gamepadState >>>= 0;
 if (index < 0 || index >= JSEvents.lastGamepadState.length) return -5;
 if (!JSEvents.lastGamepadState[index]) return -7;
 fillGamepadEventData(gamepadState, JSEvents.lastGamepadState[index]);
 return 0;
}

var getHeapMax = () => 4294901760;

function _emscripten_get_heap_max() {
 return getHeapMax();
}

function _emscripten_get_main_loop_timing(mode, value) {
 mode >>>= 0;
 value >>>= 0;
 if (mode) GROWABLE_HEAP_I32()[((mode) >>> 2) >>> 0] = Browser.mainLoop.timingMode;
 if (value) GROWABLE_HEAP_I32()[((value) >>> 2) >>> 0] = Browser.mainLoop.timingValue;
}

var _emscripten_get_now_res = () => 1e3;

function _emscripten_get_num_gamepads() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(14, 0, 1);
 return JSEvents.lastGamepadState.length;
}

function _emscripten_get_screen_size(width, height) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(15, 0, 1, width, height);
 width >>>= 0;
 height >>>= 0;
 GROWABLE_HEAP_I32()[((width) >>> 2) >>> 0] = screen.width;
 GROWABLE_HEAP_I32()[((height) >>> 2) >>> 0] = screen.height;
}

/** @suppress {duplicate } */ var _glActiveTexture = x0 => GLctx.activeTexture(x0);

var _emscripten_glActiveTexture = _glActiveTexture;

/** @suppress {duplicate } */ var _glAttachShader = (program, shader) => {
 GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glAttachShader = _glAttachShader;

/** @suppress {duplicate } */ var _glBeginQueryEXT = (target, id) => {
 GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id]);
};

var _emscripten_glBeginQueryEXT = _glBeginQueryEXT;

/** @suppress {duplicate } */ function _glBindAttribLocation(program, index, name) {
 name >>>= 0;
 GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
}

var _emscripten_glBindAttribLocation = _glBindAttribLocation;

/** @suppress {duplicate } */ var _glBindBuffer = (target, buffer) => {
 GLctx.bindBuffer(target, GL.buffers[buffer]);
};

var _emscripten_glBindBuffer = _glBindBuffer;

/** @suppress {duplicate } */ var _glBindFramebuffer = (target, framebuffer) => {
 GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
};

var _emscripten_glBindFramebuffer = _glBindFramebuffer;

/** @suppress {duplicate } */ var _glBindRenderbuffer = (target, renderbuffer) => {
 GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glBindRenderbuffer = _glBindRenderbuffer;

/** @suppress {duplicate } */ var _glBindTexture = (target, texture) => {
 GLctx.bindTexture(target, GL.textures[texture]);
};

var _emscripten_glBindTexture = _glBindTexture;

/** @suppress {duplicate } */ var _glBindVertexArray = vao => {
 GLctx.bindVertexArray(GL.vaos[vao]);
};

/** @suppress {duplicate } */ var _glBindVertexArrayOES = _glBindVertexArray;

var _emscripten_glBindVertexArrayOES = _glBindVertexArrayOES;

/** @suppress {duplicate } */ var _glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

var _emscripten_glBlendColor = _glBlendColor;

/** @suppress {duplicate } */ var _glBlendEquation = x0 => GLctx.blendEquation(x0);

var _emscripten_glBlendEquation = _glBlendEquation;

/** @suppress {duplicate } */ var _glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

var _emscripten_glBlendEquationSeparate = _glBlendEquationSeparate;

/** @suppress {duplicate } */ var _glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

var _emscripten_glBlendFunc = _glBlendFunc;

/** @suppress {duplicate } */ var _glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

var _emscripten_glBlendFuncSeparate = _glBlendFuncSeparate;

/** @suppress {duplicate } */ function _glBufferData(target, size, data, usage) {
 size >>>= 0;
 data >>>= 0;
 GLctx.bufferData(target, data ? GROWABLE_HEAP_U8().subarray(data >>> 0, data + size >>> 0) : size, usage);
}

var _emscripten_glBufferData = _glBufferData;

/** @suppress {duplicate } */ function _glBufferSubData(target, offset, size, data) {
 offset >>>= 0;
 size >>>= 0;
 data >>>= 0;
 GLctx.bufferSubData(target, offset, GROWABLE_HEAP_U8().subarray(data >>> 0, data + size >>> 0));
}

var _emscripten_glBufferSubData = _glBufferSubData;

/** @suppress {duplicate } */ var _glCheckFramebufferStatus = x0 => GLctx.checkFramebufferStatus(x0);

var _emscripten_glCheckFramebufferStatus = _glCheckFramebufferStatus;

/** @suppress {duplicate } */ var _glClear = x0 => GLctx.clear(x0);

var _emscripten_glClear = _glClear;

/** @suppress {duplicate } */ var _glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _emscripten_glClearColor = _glClearColor;

/** @suppress {duplicate } */ var _glClearDepthf = x0 => GLctx.clearDepth(x0);

var _emscripten_glClearDepthf = _glClearDepthf;

/** @suppress {duplicate } */ var _glClearStencil = x0 => GLctx.clearStencil(x0);

var _emscripten_glClearStencil = _glClearStencil;

/** @suppress {duplicate } */ var _glColorMask = (red, green, blue, alpha) => {
 GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _emscripten_glColorMask = _glColorMask;

/** @suppress {duplicate } */ var _glCompileShader = shader => {
 GLctx.compileShader(GL.shaders[shader]);
};

var _emscripten_glCompileShader = _glCompileShader;

/** @suppress {duplicate } */ function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
 data >>>= 0;
 GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, data ? GROWABLE_HEAP_U8().subarray((data) >>> 0, data + imageSize >>> 0) : null);
}

var _emscripten_glCompressedTexImage2D = _glCompressedTexImage2D;

/** @suppress {duplicate } */ function _glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
 data >>>= 0;
 GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, data ? GROWABLE_HEAP_U8().subarray((data) >>> 0, data + imageSize >>> 0) : null);
}

var _emscripten_glCompressedTexSubImage2D = _glCompressedTexSubImage2D;

/** @suppress {duplicate } */ var _glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexImage2D = _glCopyTexImage2D;

/** @suppress {duplicate } */ var _glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage2D = _glCopyTexSubImage2D;

/** @suppress {duplicate } */ var _glCreateProgram = () => {
 var id = GL.getNewId(GL.programs);
 var program = GLctx.createProgram();
 program.name = id;
 program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
 program.uniformIdCounter = 1;
 GL.programs[id] = program;
 return id;
};

var _emscripten_glCreateProgram = _glCreateProgram;

/** @suppress {duplicate } */ var _glCreateShader = shaderType => {
 var id = GL.getNewId(GL.shaders);
 GL.shaders[id] = GLctx.createShader(shaderType);
 return id;
};

var _emscripten_glCreateShader = _glCreateShader;

/** @suppress {duplicate } */ var _glCullFace = x0 => GLctx.cullFace(x0);

var _emscripten_glCullFace = _glCullFace;

/** @suppress {duplicate } */ function _glDeleteBuffers(n, buffers) {
 buffers >>>= 0;
 for (var i = 0; i < n; i++) {
  var id = GROWABLE_HEAP_I32()[(((buffers) + (i * 4)) >>> 2) >>> 0];
  var buffer = GL.buffers[id];
  if (!buffer) continue;
  GLctx.deleteBuffer(buffer);
  buffer.name = 0;
  GL.buffers[id] = null;
 }
}

var _emscripten_glDeleteBuffers = _glDeleteBuffers;

/** @suppress {duplicate } */ function _glDeleteFramebuffers(n, framebuffers) {
 framebuffers >>>= 0;
 for (var i = 0; i < n; ++i) {
  var id = GROWABLE_HEAP_I32()[(((framebuffers) + (i * 4)) >>> 2) >>> 0];
  var framebuffer = GL.framebuffers[id];
  if (!framebuffer) continue;
  GLctx.deleteFramebuffer(framebuffer);
  framebuffer.name = 0;
  GL.framebuffers[id] = null;
 }
}

var _emscripten_glDeleteFramebuffers = _glDeleteFramebuffers;

/** @suppress {duplicate } */ var _glDeleteProgram = id => {
 if (!id) return;
 var program = GL.programs[id];
 if (!program) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GLctx.deleteProgram(program);
 program.name = 0;
 GL.programs[id] = null;
};

var _emscripten_glDeleteProgram = _glDeleteProgram;

/** @suppress {duplicate } */ function _glDeleteQueriesEXT(n, ids) {
 ids >>>= 0;
 for (var i = 0; i < n; i++) {
  var id = GROWABLE_HEAP_I32()[(((ids) + (i * 4)) >>> 2) >>> 0];
  var query = GL.queries[id];
  if (!query) continue;
  GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
  GL.queries[id] = null;
 }
}

var _emscripten_glDeleteQueriesEXT = _glDeleteQueriesEXT;

/** @suppress {duplicate } */ function _glDeleteRenderbuffers(n, renderbuffers) {
 renderbuffers >>>= 0;
 for (var i = 0; i < n; i++) {
  var id = GROWABLE_HEAP_I32()[(((renderbuffers) + (i * 4)) >>> 2) >>> 0];
  var renderbuffer = GL.renderbuffers[id];
  if (!renderbuffer) continue;
  GLctx.deleteRenderbuffer(renderbuffer);
  renderbuffer.name = 0;
  GL.renderbuffers[id] = null;
 }
}

var _emscripten_glDeleteRenderbuffers = _glDeleteRenderbuffers;

/** @suppress {duplicate } */ var _glDeleteShader = id => {
 if (!id) return;
 var shader = GL.shaders[id];
 if (!shader) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GLctx.deleteShader(shader);
 GL.shaders[id] = null;
};

var _emscripten_glDeleteShader = _glDeleteShader;

/** @suppress {duplicate } */ function _glDeleteTextures(n, textures) {
 textures >>>= 0;
 for (var i = 0; i < n; i++) {
  var id = GROWABLE_HEAP_I32()[(((textures) + (i * 4)) >>> 2) >>> 0];
  var texture = GL.textures[id];
  if (!texture) continue;
  GLctx.deleteTexture(texture);
  texture.name = 0;
  GL.textures[id] = null;
 }
}

var _emscripten_glDeleteTextures = _glDeleteTextures;

/** @suppress {duplicate } */ function _glDeleteVertexArrays(n, vaos) {
 vaos >>>= 0;
 for (var i = 0; i < n; i++) {
  var id = GROWABLE_HEAP_I32()[(((vaos) + (i * 4)) >>> 2) >>> 0];
  GLctx.deleteVertexArray(GL.vaos[id]);
  GL.vaos[id] = null;
 }
}

/** @suppress {duplicate } */ var _glDeleteVertexArraysOES = _glDeleteVertexArrays;

var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArraysOES;

/** @suppress {duplicate } */ var _glDepthFunc = x0 => GLctx.depthFunc(x0);

var _emscripten_glDepthFunc = _glDepthFunc;

/** @suppress {duplicate } */ var _glDepthMask = flag => {
 GLctx.depthMask(!!flag);
};

var _emscripten_glDepthMask = _glDepthMask;

/** @suppress {duplicate } */ var _glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _emscripten_glDepthRangef = _glDepthRangef;

/** @suppress {duplicate } */ var _glDetachShader = (program, shader) => {
 GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glDetachShader = _glDetachShader;

/** @suppress {duplicate } */ var _glDisable = x0 => GLctx.disable(x0);

var _emscripten_glDisable = _glDisable;

/** @suppress {duplicate } */ var _glDisableVertexAttribArray = index => {
 GLctx.disableVertexAttribArray(index);
};

var _emscripten_glDisableVertexAttribArray = _glDisableVertexAttribArray;

/** @suppress {duplicate } */ var _glDrawArrays = (mode, first, count) => {
 GLctx.drawArrays(mode, first, count);
};

var _emscripten_glDrawArrays = _glDrawArrays;

/** @suppress {duplicate } */ var _glDrawArraysInstanced = (mode, first, count, primcount) => {
 GLctx.drawArraysInstanced(mode, first, count, primcount);
};

/** @suppress {duplicate } */ var _glDrawArraysInstancedANGLE = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstancedANGLE;

var tempFixedLengthArray = [];

/** @suppress {duplicate } */ function _glDrawBuffers(n, bufs) {
 bufs >>>= 0;
 var bufArray = tempFixedLengthArray[n];
 for (var i = 0; i < n; i++) {
  bufArray[i] = GROWABLE_HEAP_I32()[(((bufs) + (i * 4)) >>> 2) >>> 0];
 }
 GLctx.drawBuffers(bufArray);
}

/** @suppress {duplicate } */ var _glDrawBuffersWEBGL = _glDrawBuffers;

var _emscripten_glDrawBuffersWEBGL = _glDrawBuffersWEBGL;

/** @suppress {duplicate } */ function _glDrawElements(mode, count, type, indices) {
 indices >>>= 0;
 GLctx.drawElements(mode, count, type, indices);
}

var _emscripten_glDrawElements = _glDrawElements;

/** @suppress {duplicate } */ function _glDrawElementsInstanced(mode, count, type, indices, primcount) {
 indices >>>= 0;
 GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
}

/** @suppress {duplicate } */ var _glDrawElementsInstancedANGLE = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstancedANGLE;

/** @suppress {duplicate } */ var _glEnable = x0 => GLctx.enable(x0);

var _emscripten_glEnable = _glEnable;

/** @suppress {duplicate } */ var _glEnableVertexAttribArray = index => {
 GLctx.enableVertexAttribArray(index);
};

var _emscripten_glEnableVertexAttribArray = _glEnableVertexAttribArray;

/** @suppress {duplicate } */ var _glEndQueryEXT = target => {
 GLctx.disjointTimerQueryExt["endQueryEXT"](target);
};

var _emscripten_glEndQueryEXT = _glEndQueryEXT;

/** @suppress {duplicate } */ var _glFinish = () => GLctx.finish();

var _emscripten_glFinish = _glFinish;

/** @suppress {duplicate } */ var _glFlush = () => GLctx.flush();

var _emscripten_glFlush = _glFlush;

/** @suppress {duplicate } */ var _glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
 GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glFramebufferRenderbuffer = _glFramebufferRenderbuffer;

/** @suppress {duplicate } */ var _glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
 GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
};

var _emscripten_glFramebufferTexture2D = _glFramebufferTexture2D;

/** @suppress {duplicate } */ var _glFrontFace = x0 => GLctx.frontFace(x0);

var _emscripten_glFrontFace = _glFrontFace;

/** @suppress {duplicate } */ function _glGenBuffers(n, buffers) {
 buffers >>>= 0;
 GL.genObject(n, buffers, "createBuffer", GL.buffers);
}

var _emscripten_glGenBuffers = _glGenBuffers;

/** @suppress {duplicate } */ function _glGenFramebuffers(n, ids) {
 ids >>>= 0;
 GL.genObject(n, ids, "createFramebuffer", GL.framebuffers);
}

var _emscripten_glGenFramebuffers = _glGenFramebuffers;

/** @suppress {duplicate } */ function _glGenQueriesEXT(n, ids) {
 ids >>>= 0;
 for (var i = 0; i < n; i++) {
  var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
  if (!query) {
   GL.recordError(1282);
   /* GL_INVALID_OPERATION */ while (i < n) GROWABLE_HEAP_I32()[(((ids) + (i++ * 4)) >>> 2) >>> 0] = 0;
   return;
  }
  var id = GL.getNewId(GL.queries);
  query.name = id;
  GL.queries[id] = query;
  GROWABLE_HEAP_I32()[(((ids) + (i * 4)) >>> 2) >>> 0] = id;
 }
}

var _emscripten_glGenQueriesEXT = _glGenQueriesEXT;

/** @suppress {duplicate } */ function _glGenRenderbuffers(n, renderbuffers) {
 renderbuffers >>>= 0;
 GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
}

var _emscripten_glGenRenderbuffers = _glGenRenderbuffers;

/** @suppress {duplicate } */ function _glGenTextures(n, textures) {
 textures >>>= 0;
 GL.genObject(n, textures, "createTexture", GL.textures);
}

var _emscripten_glGenTextures = _glGenTextures;

/** @suppress {duplicate } */ function _glGenVertexArrays(n, arrays) {
 arrays >>>= 0;
 GL.genObject(n, arrays, "createVertexArray", GL.vaos);
}

/** @suppress {duplicate } */ var _glGenVertexArraysOES = _glGenVertexArrays;

var _emscripten_glGenVertexArraysOES = _glGenVertexArraysOES;

/** @suppress {duplicate } */ var _glGenerateMipmap = x0 => GLctx.generateMipmap(x0);

var _emscripten_glGenerateMipmap = _glGenerateMipmap;

var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
 program = GL.programs[program];
 var info = GLctx[funcName](program, index);
 if (info) {
  var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
  if (length) GROWABLE_HEAP_I32()[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
  if (size) GROWABLE_HEAP_I32()[((size) >>> 2) >>> 0] = info.size;
  if (type) GROWABLE_HEAP_I32()[((type) >>> 2) >>> 0] = info.type;
 }
};

/** @suppress {duplicate } */ function _glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
 length >>>= 0;
 size >>>= 0;
 type >>>= 0;
 name >>>= 0;
 __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name);
}

var _emscripten_glGetActiveAttrib = _glGetActiveAttrib;

/** @suppress {duplicate } */ function _glGetActiveUniform(program, index, bufSize, length, size, type, name) {
 length >>>= 0;
 size >>>= 0;
 type >>>= 0;
 name >>>= 0;
 __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);
}

var _emscripten_glGetActiveUniform = _glGetActiveUniform;

/** @suppress {duplicate } */ function _glGetAttachedShaders(program, maxCount, count, shaders) {
 count >>>= 0;
 shaders >>>= 0;
 var result = GLctx.getAttachedShaders(GL.programs[program]);
 var len = result.length;
 if (len > maxCount) {
  len = maxCount;
 }
 GROWABLE_HEAP_I32()[((count) >>> 2) >>> 0] = len;
 for (var i = 0; i < len; ++i) {
  var id = GL.shaders.indexOf(result[i]);
  GROWABLE_HEAP_I32()[(((shaders) + (i * 4)) >>> 2) >>> 0] = id;
 }
}

var _emscripten_glGetAttachedShaders = _glGetAttachedShaders;

/** @suppress {duplicate } */ function _glGetAttribLocation(program, name) {
 name >>>= 0;
 return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
}

var _emscripten_glGetAttribLocation = _glGetAttribLocation;

var writeI53ToI64 = (ptr, num) => {
 GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] = num;
 var lower = GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0];
 GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0] = (num - lower) / 4294967296;
};

var emscriptenWebGLGet = (name_, p, type) => {
 if (!p) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 var ret = undefined;
 switch (name_) {
 case 36346:
  ret = 1;
  break;

 case 36344:
  if (type != 0 && type != 1) {
   GL.recordError(1280);
  }
  return;

 case 36345:
  ret = 0;
  break;

 case 34466:
  var formats = GLctx.getParameter(34467);
  /*GL_COMPRESSED_TEXTURE_FORMATS*/ ret = formats ? formats.length : 0;
  break;
 }
 if (ret === undefined) {
  var result = GLctx.getParameter(name_);
  switch (typeof result) {
  case "number":
   ret = result;
   break;

  case "boolean":
   ret = result ? 1 : 0;
   break;

  case "string":
   GL.recordError(1280);
   return;

  case "object":
   if (result === null) {
    switch (name_) {
    case 34964:
    case 35725:
    case 34965:
    case 36006:
    case 36007:
    case 32873:
    case 34229:
    case 34068:
     {
      ret = 0;
      break;
     }

    default:
     {
      GL.recordError(1280);
      return;
     }
    }
   } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
    for (var i = 0; i < result.length; ++i) {
     switch (type) {
     case 0:
      GROWABLE_HEAP_I32()[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
      break;

     case 2:
      GROWABLE_HEAP_F32()[(((p) + (i * 4)) >>> 2) >>> 0] = result[i];
      break;

     case 4:
      GROWABLE_HEAP_I8()[(p) + (i) >>> 0] = result[i] ? 1 : 0;
      break;
     }
    }
    return;
   } else {
    try {
     ret = result.name | 0;
    } catch (e) {
     GL.recordError(1280);
     err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
     return;
    }
   }
   break;

  default:
   GL.recordError(1280);
   err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof (result)}!`);
   return;
  }
 }
 switch (type) {
 case 1:
  writeI53ToI64(p, ret);
  break;

 case 0:
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = ret;
  break;

 case 2:
  GROWABLE_HEAP_F32()[((p) >>> 2) >>> 0] = ret;
  break;

 case 4:
  GROWABLE_HEAP_I8()[p >>> 0] = ret ? 1 : 0;
  break;
 }
};

/** @suppress {duplicate } */ function _glGetBooleanv(name_, p) {
 p >>>= 0;
 return emscriptenWebGLGet(name_, p, 4);
}

var _emscripten_glGetBooleanv = _glGetBooleanv;

/** @suppress {duplicate } */ function _glGetBufferParameteriv(target, value, data) {
 data >>>= 0;
 if (!data) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GROWABLE_HEAP_I32()[((data) >>> 2) >>> 0] = GLctx.getBufferParameter(target, value);
}

var _emscripten_glGetBufferParameteriv = _glGetBufferParameteriv;

/** @suppress {duplicate } */ var _glGetError = () => {
 var error = GLctx.getError() || GL.lastError;
 GL.lastError = 0;
 /*GL_NO_ERROR*/ return error;
};

var _emscripten_glGetError = _glGetError;

/** @suppress {duplicate } */ function _glGetFloatv(name_, p) {
 p >>>= 0;
 return emscriptenWebGLGet(name_, p, 2);
}

var _emscripten_glGetFloatv = _glGetFloatv;

/** @suppress {duplicate } */ function _glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
 params >>>= 0;
 var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
 if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
  result = result.name | 0;
 }
 GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = result;
}

var _emscripten_glGetFramebufferAttachmentParameteriv = _glGetFramebufferAttachmentParameteriv;

/** @suppress {duplicate } */ function _glGetIntegerv(name_, p) {
 p >>>= 0;
 return emscriptenWebGLGet(name_, p, 0);
}

var _emscripten_glGetIntegerv = _glGetIntegerv;

/** @suppress {duplicate } */ function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
 length >>>= 0;
 infoLog >>>= 0;
 var log = GLctx.getProgramInfoLog(GL.programs[program]);
 if (log === null) log = "(unknown error)";
 var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
 if (length) GROWABLE_HEAP_I32()[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

var _emscripten_glGetProgramInfoLog = _glGetProgramInfoLog;

/** @suppress {duplicate } */ function _glGetProgramiv(program, pname, p) {
 p >>>= 0;
 if (!p) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 if (program >= GL.counter) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 program = GL.programs[program];
 if (pname == 35716) {
  var log = GLctx.getProgramInfoLog(program);
  if (log === null) log = "(unknown error)";
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = log.length + 1;
 } else if (pname == 35719) /* GL_ACTIVE_UNIFORM_MAX_LENGTH */ {
  if (!program.maxUniformLength) {
   for (var i = 0; i < GLctx.getProgramParameter(program, 35718); /*GL_ACTIVE_UNIFORMS*/ ++i) {
    program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
   }
  }
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = program.maxUniformLength;
 } else if (pname == 35722) /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */ {
  if (!program.maxAttributeLength) {
   for (var i = 0; i < GLctx.getProgramParameter(program, 35721); /*GL_ACTIVE_ATTRIBUTES*/ ++i) {
    program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
   }
  }
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = program.maxAttributeLength;
 } else if (pname == 35381) /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */ {
  if (!program.maxUniformBlockNameLength) {
   for (var i = 0; i < GLctx.getProgramParameter(program, 35382); /*GL_ACTIVE_UNIFORM_BLOCKS*/ ++i) {
    program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
   }
  }
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = program.maxUniformBlockNameLength;
 } else {
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = GLctx.getProgramParameter(program, pname);
 }
}

var _emscripten_glGetProgramiv = _glGetProgramiv;

/** @suppress {duplicate } */ function _glGetQueryObjecti64vEXT(id, pname, params) {
 params >>>= 0;
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 var query = GL.queries[id];
 var param;
 {
  param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
 }
 var ret;
 if (typeof param == "boolean") {
  ret = param ? 1 : 0;
 } else {
  ret = param;
 }
 writeI53ToI64(params, ret);
}

var _emscripten_glGetQueryObjecti64vEXT = _glGetQueryObjecti64vEXT;

/** @suppress {duplicate } */ function _glGetQueryObjectivEXT(id, pname, params) {
 params >>>= 0;
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 var query = GL.queries[id];
 var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
 var ret;
 if (typeof param == "boolean") {
  ret = param ? 1 : 0;
 } else {
  ret = param;
 }
 GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = ret;
}

var _emscripten_glGetQueryObjectivEXT = _glGetQueryObjectivEXT;

/** @suppress {duplicate } */ var _glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;

var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjectui64vEXT;

/** @suppress {duplicate } */ var _glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;

var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectuivEXT;

/** @suppress {duplicate } */ function _glGetQueryivEXT(target, pname, params) {
 params >>>= 0;
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname);
}

var _emscripten_glGetQueryivEXT = _glGetQueryivEXT;

/** @suppress {duplicate } */ function _glGetRenderbufferParameteriv(target, pname, params) {
 params >>>= 0;
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = GLctx.getRenderbufferParameter(target, pname);
}

var _emscripten_glGetRenderbufferParameteriv = _glGetRenderbufferParameteriv;

/** @suppress {duplicate } */ function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
 length >>>= 0;
 infoLog >>>= 0;
 var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
 if (log === null) log = "(unknown error)";
 var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
 if (length) GROWABLE_HEAP_I32()[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

var _emscripten_glGetShaderInfoLog = _glGetShaderInfoLog;

/** @suppress {duplicate } */ function _glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
 range >>>= 0;
 precision >>>= 0;
 var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
 GROWABLE_HEAP_I32()[((range) >>> 2) >>> 0] = result.rangeMin;
 GROWABLE_HEAP_I32()[(((range) + (4)) >>> 2) >>> 0] = result.rangeMax;
 GROWABLE_HEAP_I32()[((precision) >>> 2) >>> 0] = result.precision;
}

var _emscripten_glGetShaderPrecisionFormat = _glGetShaderPrecisionFormat;

/** @suppress {duplicate } */ function _glGetShaderSource(shader, bufSize, length, source) {
 length >>>= 0;
 source >>>= 0;
 var result = GLctx.getShaderSource(GL.shaders[shader]);
 if (!result) return;
 var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
 if (length) GROWABLE_HEAP_I32()[((length) >>> 2) >>> 0] = numBytesWrittenExclNull;
}

var _emscripten_glGetShaderSource = _glGetShaderSource;

/** @suppress {duplicate } */ function _glGetShaderiv(shader, pname, p) {
 p >>>= 0;
 if (!p) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 if (pname == 35716) {
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var logLength = log ? log.length + 1 : 0;
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = logLength;
 } else if (pname == 35720) {
  var source = GLctx.getShaderSource(GL.shaders[shader]);
  var sourceLength = source ? source.length + 1 : 0;
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = sourceLength;
 } else {
  GROWABLE_HEAP_I32()[((p) >>> 2) >>> 0] = GLctx.getShaderParameter(GL.shaders[shader], pname);
 }
}

var _emscripten_glGetShaderiv = _glGetShaderiv;

var webglGetExtensions = function $webglGetExtensions() {
 var exts = getEmscriptenSupportedExtensions(GLctx);
 exts = exts.concat(exts.map(e => "GL_" + e));
 return exts;
};

/** @suppress {duplicate } */ function _glGetString(name_) {
 var ret = GL.stringCache[name_];
 if (!ret) {
  switch (name_) {
  case 7939:
   /* GL_EXTENSIONS */ ret = stringToNewUTF8(webglGetExtensions().join(" "));
   break;

  case 7936:
  /* GL_VENDOR */ case 7937:
  /* GL_RENDERER */ case 37445:
  /* UNMASKED_VENDOR_WEBGL */ case 37446:
   /* UNMASKED_RENDERER_WEBGL */ var s = GLctx.getParameter(name_);
   if (!s) {
    GL.recordError(1280);
   }
   ret = s ? stringToNewUTF8(s) : 0;
   break;

  case 7938:
   /* GL_VERSION */ var glVersion = GLctx.getParameter(7938);
   {
    glVersion = `OpenGL ES 2.0 (${glVersion})`;
   }
   ret = stringToNewUTF8(glVersion);
   break;

  case 35724:
   /* GL_SHADING_LANGUAGE_VERSION */ var glslVersion = GLctx.getParameter(35724);
   var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
   var ver_num = glslVersion.match(ver_re);
   if (ver_num !== null) {
    if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
    glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
   }
   ret = stringToNewUTF8(glslVersion);
   break;

  default:
   GL.recordError(1280);
  }
  GL.stringCache[name_] = ret;
 }
 return ret;
}

var _emscripten_glGetString = _glGetString;

/** @suppress {duplicate } */ function _glGetTexParameterfv(target, pname, params) {
 params >>>= 0;
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GROWABLE_HEAP_F32()[((params) >>> 2) >>> 0] = GLctx.getTexParameter(target, pname);
}

var _emscripten_glGetTexParameterfv = _glGetTexParameterfv;

/** @suppress {duplicate } */ function _glGetTexParameteriv(target, pname, params) {
 params >>>= 0;
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = GLctx.getTexParameter(target, pname);
}

var _emscripten_glGetTexParameteriv = _glGetTexParameteriv;

/** @suppress {checkTypes} */ var jstoi_q = str => parseInt(str);

/** @noinline */ var webglGetLeftBracePos = name => name.slice(-1) == "]" && name.lastIndexOf("[");

var webglPrepareUniformLocationsBeforeFirstUse = program => {
 var uniformLocsById = program.uniformLocsById, uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, i, j;
 if (!uniformLocsById) {
  program.uniformLocsById = uniformLocsById = {};
  program.uniformArrayNamesById = {};
  for (i = 0; i < GLctx.getProgramParameter(program, 35718); /*GL_ACTIVE_UNIFORMS*/ ++i) {
   var u = GLctx.getActiveUniform(program, i);
   var nm = u.name;
   var sz = u.size;
   var lb = webglGetLeftBracePos(nm);
   var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
   var id = program.uniformIdCounter;
   program.uniformIdCounter += sz;
   uniformSizeAndIdsByName[arrayName] = [ sz, id ];
   for (j = 0; j < sz; ++j) {
    uniformLocsById[id] = j;
    program.uniformArrayNamesById[id++] = arrayName;
   }
  }
 }
};

/** @suppress {duplicate } */ function _glGetUniformLocation(program, name) {
 name >>>= 0;
 name = UTF8ToString(name);
 if (program = GL.programs[program]) {
  webglPrepareUniformLocationsBeforeFirstUse(program);
  var uniformLocsById = program.uniformLocsById;
  var arrayIndex = 0;
  var uniformBaseName = name;
  var leftBrace = webglGetLeftBracePos(name);
  if (leftBrace > 0) {
   arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
   uniformBaseName = name.slice(0, leftBrace);
  }
  var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
  if (sizeAndId && arrayIndex < sizeAndId[0]) {
   arrayIndex += sizeAndId[1];
   if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
    return arrayIndex;
   }
  }
 } else {
  GL.recordError(1281);
 }
 /* GL_INVALID_VALUE */ return -1;
}

var _emscripten_glGetUniformLocation = _glGetUniformLocation;

var webglGetUniformLocation = location => {
 var p = GLctx.currentProgram;
 if (p) {
  var webglLoc = p.uniformLocsById[location];
  if (typeof webglLoc == "number") {
   p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""));
  }
  return webglLoc;
 } else {
  GL.recordError(1282);
 }
};

/** @suppress{checkTypes} */ var emscriptenWebGLGetUniform = (program, location, params, type) => {
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 program = GL.programs[program];
 webglPrepareUniformLocationsBeforeFirstUse(program);
 var data = GLctx.getUniform(program, webglGetUniformLocation(location));
 if (typeof data == "number" || typeof data == "boolean") {
  switch (type) {
  case 0:
   GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = data;
   break;

  case 2:
   GROWABLE_HEAP_F32()[((params) >>> 2) >>> 0] = data;
   break;
  }
 } else {
  for (var i = 0; i < data.length; i++) {
   switch (type) {
   case 0:
    GROWABLE_HEAP_I32()[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
    break;

   case 2:
    GROWABLE_HEAP_F32()[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
    break;
   }
  }
 }
};

/** @suppress {duplicate } */ function _glGetUniformfv(program, location, params) {
 params >>>= 0;
 emscriptenWebGLGetUniform(program, location, params, 2);
}

var _emscripten_glGetUniformfv = _glGetUniformfv;

/** @suppress {duplicate } */ function _glGetUniformiv(program, location, params) {
 params >>>= 0;
 emscriptenWebGLGetUniform(program, location, params, 0);
}

var _emscripten_glGetUniformiv = _glGetUniformiv;

/** @suppress {duplicate } */ function _glGetVertexAttribPointerv(index, pname, pointer) {
 pointer >>>= 0;
 if (!pointer) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 GROWABLE_HEAP_I32()[((pointer) >>> 2) >>> 0] = GLctx.getVertexAttribOffset(index, pname);
}

var _emscripten_glGetVertexAttribPointerv = _glGetVertexAttribPointerv;

/** @suppress{checkTypes} */ var emscriptenWebGLGetVertexAttrib = (index, pname, params, type) => {
 if (!params) {
  GL.recordError(1281);
  /* GL_INVALID_VALUE */ return;
 }
 var data = GLctx.getVertexAttrib(index, pname);
 if (pname == 34975) /*VERTEX_ATTRIB_ARRAY_BUFFER_BINDING*/ {
  GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = data && data["name"];
 } else if (typeof data == "number" || typeof data == "boolean") {
  switch (type) {
  case 0:
   GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = data;
   break;

  case 2:
   GROWABLE_HEAP_F32()[((params) >>> 2) >>> 0] = data;
   break;

  case 5:
   GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0] = Math.fround(data);
   break;
  }
 } else {
  for (var i = 0; i < data.length; i++) {
   switch (type) {
   case 0:
    GROWABLE_HEAP_I32()[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
    break;

   case 2:
    GROWABLE_HEAP_F32()[(((params) + (i * 4)) >>> 2) >>> 0] = data[i];
    break;

   case 5:
    GROWABLE_HEAP_I32()[(((params) + (i * 4)) >>> 2) >>> 0] = Math.fround(data[i]);
    break;
   }
  }
 }
};

/** @suppress {duplicate } */ function _glGetVertexAttribfv(index, pname, params) {
 params >>>= 0;
 emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
}

var _emscripten_glGetVertexAttribfv = _glGetVertexAttribfv;

/** @suppress {duplicate } */ function _glGetVertexAttribiv(index, pname, params) {
 params >>>= 0;
 emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
}

var _emscripten_glGetVertexAttribiv = _glGetVertexAttribiv;

/** @suppress {duplicate } */ var _glHint = (x0, x1) => GLctx.hint(x0, x1);

var _emscripten_glHint = _glHint;

/** @suppress {duplicate } */ var _glIsBuffer = buffer => {
 var b = GL.buffers[buffer];
 if (!b) return 0;
 return GLctx.isBuffer(b);
};

var _emscripten_glIsBuffer = _glIsBuffer;

/** @suppress {duplicate } */ var _glIsEnabled = x0 => GLctx.isEnabled(x0);

var _emscripten_glIsEnabled = _glIsEnabled;

/** @suppress {duplicate } */ var _glIsFramebuffer = framebuffer => {
 var fb = GL.framebuffers[framebuffer];
 if (!fb) return 0;
 return GLctx.isFramebuffer(fb);
};

var _emscripten_glIsFramebuffer = _glIsFramebuffer;

/** @suppress {duplicate } */ var _glIsProgram = program => {
 program = GL.programs[program];
 if (!program) return 0;
 return GLctx.isProgram(program);
};

var _emscripten_glIsProgram = _glIsProgram;

/** @suppress {duplicate } */ var _glIsQueryEXT = id => {
 var query = GL.queries[id];
 if (!query) return 0;
 return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
};

var _emscripten_glIsQueryEXT = _glIsQueryEXT;

/** @suppress {duplicate } */ var _glIsRenderbuffer = renderbuffer => {
 var rb = GL.renderbuffers[renderbuffer];
 if (!rb) return 0;
 return GLctx.isRenderbuffer(rb);
};

var _emscripten_glIsRenderbuffer = _glIsRenderbuffer;

/** @suppress {duplicate } */ var _glIsShader = shader => {
 var s = GL.shaders[shader];
 if (!s) return 0;
 return GLctx.isShader(s);
};

var _emscripten_glIsShader = _glIsShader;

/** @suppress {duplicate } */ var _glIsTexture = id => {
 var texture = GL.textures[id];
 if (!texture) return 0;
 return GLctx.isTexture(texture);
};

var _emscripten_glIsTexture = _glIsTexture;

/** @suppress {duplicate } */ var _glIsVertexArray = array => {
 var vao = GL.vaos[array];
 if (!vao) return 0;
 return GLctx.isVertexArray(vao);
};

/** @suppress {duplicate } */ var _glIsVertexArrayOES = _glIsVertexArray;

var _emscripten_glIsVertexArrayOES = _glIsVertexArrayOES;

/** @suppress {duplicate } */ var _glLineWidth = x0 => GLctx.lineWidth(x0);

var _emscripten_glLineWidth = _glLineWidth;

/** @suppress {duplicate } */ var _glLinkProgram = program => {
 program = GL.programs[program];
 GLctx.linkProgram(program);
 program.uniformLocsById = 0;
 program.uniformSizeAndIdsByName = {};
};

var _emscripten_glLinkProgram = _glLinkProgram;

/** @suppress {duplicate } */ var _glPixelStorei = (pname, param) => {
 if (pname == 3317) /* GL_UNPACK_ALIGNMENT */ {
  GL.unpackAlignment = param;
 }
 GLctx.pixelStorei(pname, param);
};

var _emscripten_glPixelStorei = _glPixelStorei;

/** @suppress {duplicate } */ var _glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

var _emscripten_glPolygonOffset = _glPolygonOffset;

/** @suppress {duplicate } */ var _glQueryCounterEXT = (id, target) => {
 GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target);
};

var _emscripten_glQueryCounterEXT = _glQueryCounterEXT;

var computeUnpackAlignedImageSize = (width, height, sizePerPixel, alignment) => {
 function roundedToNextMultipleOf(x, y) {
  return (x + y - 1) & -y;
 }
 var plainRowSize = width * sizePerPixel;
 var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
 return height * alignedRowSize;
};

var colorChannelsInGlTextureFormat = format => {
 var colorChannels = {
  5: 3,
  6: 4,
  8: 2,
  29502: 3,
  29504: 4
 };
 return colorChannels[format - 6402] || 1;
};

var heapObjectForWebGLType = type => {
 type -= 5120;
 if (type == 1) return GROWABLE_HEAP_U8();
 if (type == 4) return GROWABLE_HEAP_I32();
 if (type == 6) return GROWABLE_HEAP_F32();
 if (type == 5 || type == 28922) return GROWABLE_HEAP_U32();
 return GROWABLE_HEAP_U16();
};

var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));

var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
 var heap = heapObjectForWebGLType(type);
 var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
 var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
 return heap.subarray(toTypedArrayIndex(pixels, heap) >>> 0, toTypedArrayIndex(pixels + bytes, heap) >>> 0);
};

/** @suppress {duplicate } */ function _glReadPixels(x, y, width, height, format, type, pixels) {
 pixels >>>= 0;
 var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
 if (!pixelData) {
  GL.recordError(1280);
  /*GL_INVALID_ENUM*/ return;
 }
 GLctx.readPixels(x, y, width, height, format, type, pixelData);
}

var _emscripten_glReadPixels = _glReadPixels;

/** @suppress {duplicate } */ var _glReleaseShaderCompiler = () => {};

var _emscripten_glReleaseShaderCompiler = _glReleaseShaderCompiler;

/** @suppress {duplicate } */ var _glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

var _emscripten_glRenderbufferStorage = _glRenderbufferStorage;

/** @suppress {duplicate } */ var _glSampleCoverage = (value, invert) => {
 GLctx.sampleCoverage(value, !!invert);
};

var _emscripten_glSampleCoverage = _glSampleCoverage;

/** @suppress {duplicate } */ var _glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

var _emscripten_glScissor = _glScissor;

/** @suppress {duplicate } */ function _glShaderBinary(count, shaders, binaryformat, binary, length) {
 shaders >>>= 0;
 binary >>>= 0;
 GL.recordError(1280);
}

var _emscripten_glShaderBinary = _glShaderBinary;

/** @suppress {duplicate } */ function _glShaderSource(shader, count, string, length) {
 string >>>= 0;
 length >>>= 0;
 var source = GL.getSource(shader, count, string, length);
 GLctx.shaderSource(GL.shaders[shader], source);
}

var _emscripten_glShaderSource = _glShaderSource;

/** @suppress {duplicate } */ var _glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

var _emscripten_glStencilFunc = _glStencilFunc;

/** @suppress {duplicate } */ var _glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

var _emscripten_glStencilFuncSeparate = _glStencilFuncSeparate;

/** @suppress {duplicate } */ var _glStencilMask = x0 => GLctx.stencilMask(x0);

var _emscripten_glStencilMask = _glStencilMask;

/** @suppress {duplicate } */ var _glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

var _emscripten_glStencilMaskSeparate = _glStencilMaskSeparate;

/** @suppress {duplicate } */ var _glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

var _emscripten_glStencilOp = _glStencilOp;

/** @suppress {duplicate } */ var _glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

var _emscripten_glStencilOpSeparate = _glStencilOpSeparate;

/** @suppress {duplicate } */ function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
 pixels >>>= 0;
 var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null;
 GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
}

var _emscripten_glTexImage2D = _glTexImage2D;

/** @suppress {duplicate } */ var _glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

var _emscripten_glTexParameterf = _glTexParameterf;

/** @suppress {duplicate } */ function _glTexParameterfv(target, pname, params) {
 params >>>= 0;
 var param = GROWABLE_HEAP_F32()[((params) >>> 2) >>> 0];
 GLctx.texParameterf(target, pname, param);
}

var _emscripten_glTexParameterfv = _glTexParameterfv;

/** @suppress {duplicate } */ var _glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

var _emscripten_glTexParameteri = _glTexParameteri;

/** @suppress {duplicate } */ function _glTexParameteriv(target, pname, params) {
 params >>>= 0;
 var param = GROWABLE_HEAP_I32()[((params) >>> 2) >>> 0];
 GLctx.texParameteri(target, pname, param);
}

var _emscripten_glTexParameteriv = _glTexParameteriv;

/** @suppress {duplicate } */ function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
 pixels >>>= 0;
 var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0) : null;
 GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
}

var _emscripten_glTexSubImage2D = _glTexSubImage2D;

/** @suppress {duplicate } */ var _glUniform1f = (location, v0) => {
 GLctx.uniform1f(webglGetUniformLocation(location), v0);
};

var _emscripten_glUniform1f = _glUniform1f;

var miniTempWebGLFloatBuffers = [];

/** @suppress {duplicate } */ function _glUniform1fv(location, count, value) {
 value >>>= 0;
 if (count <= 288) {
  var view = miniTempWebGLFloatBuffers[count - 1];
  for (var i = 0; i < count; ++i) {
   view[i] = GROWABLE_HEAP_F32()[(((value) + (4 * i)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_F32().subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
 }
 GLctx.uniform1fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform1fv = _glUniform1fv;

/** @suppress {duplicate } */ var _glUniform1i = (location, v0) => {
 GLctx.uniform1i(webglGetUniformLocation(location), v0);
};

var _emscripten_glUniform1i = _glUniform1i;

var miniTempWebGLIntBuffers = [];

/** @suppress {duplicate } */ function _glUniform1iv(location, count, value) {
 value >>>= 0;
 if (count <= 288) {
  var view = miniTempWebGLIntBuffers[count - 1];
  for (var i = 0; i < count; ++i) {
   view[i] = GROWABLE_HEAP_I32()[(((value) + (4 * i)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_I32().subarray((((value) >>> 2)) >>> 0, ((value + count * 4) >>> 2) >>> 0);
 }
 GLctx.uniform1iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform1iv = _glUniform1iv;

/** @suppress {duplicate } */ var _glUniform2f = (location, v0, v1) => {
 GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2f = _glUniform2f;

/** @suppress {duplicate } */ function _glUniform2fv(location, count, value) {
 value >>>= 0;
 if (count <= 144) {
  var view = miniTempWebGLFloatBuffers[2 * count - 1];
  for (var i = 0; i < 2 * count; i += 2) {
   view[i] = GROWABLE_HEAP_F32()[(((value) + (4 * i)) >>> 2) >>> 0];
   view[i + 1] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 4)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_F32().subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
 }
 GLctx.uniform2fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform2fv = _glUniform2fv;

/** @suppress {duplicate } */ var _glUniform2i = (location, v0, v1) => {
 GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2i = _glUniform2i;

/** @suppress {duplicate } */ function _glUniform2iv(location, count, value) {
 value >>>= 0;
 if (count <= 144) {
  var view = miniTempWebGLIntBuffers[2 * count - 1];
  for (var i = 0; i < 2 * count; i += 2) {
   view[i] = GROWABLE_HEAP_I32()[(((value) + (4 * i)) >>> 2) >>> 0];
   view[i + 1] = GROWABLE_HEAP_I32()[(((value) + (4 * i + 4)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_I32().subarray((((value) >>> 2)) >>> 0, ((value + count * 8) >>> 2) >>> 0);
 }
 GLctx.uniform2iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform2iv = _glUniform2iv;

/** @suppress {duplicate } */ var _glUniform3f = (location, v0, v1, v2) => {
 GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3f = _glUniform3f;

/** @suppress {duplicate } */ function _glUniform3fv(location, count, value) {
 value >>>= 0;
 if (count <= 96) {
  var view = miniTempWebGLFloatBuffers[3 * count - 1];
  for (var i = 0; i < 3 * count; i += 3) {
   view[i] = GROWABLE_HEAP_F32()[(((value) + (4 * i)) >>> 2) >>> 0];
   view[i + 1] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 4)) >>> 2) >>> 0];
   view[i + 2] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 8)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_F32().subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
 }
 GLctx.uniform3fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform3fv = _glUniform3fv;

/** @suppress {duplicate } */ var _glUniform3i = (location, v0, v1, v2) => {
 GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3i = _glUniform3i;

/** @suppress {duplicate } */ function _glUniform3iv(location, count, value) {
 value >>>= 0;
 if (count <= 96) {
  var view = miniTempWebGLIntBuffers[3 * count - 1];
  for (var i = 0; i < 3 * count; i += 3) {
   view[i] = GROWABLE_HEAP_I32()[(((value) + (4 * i)) >>> 2) >>> 0];
   view[i + 1] = GROWABLE_HEAP_I32()[(((value) + (4 * i + 4)) >>> 2) >>> 0];
   view[i + 2] = GROWABLE_HEAP_I32()[(((value) + (4 * i + 8)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_I32().subarray((((value) >>> 2)) >>> 0, ((value + count * 12) >>> 2) >>> 0);
 }
 GLctx.uniform3iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform3iv = _glUniform3iv;

/** @suppress {duplicate } */ var _glUniform4f = (location, v0, v1, v2, v3) => {
 GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4f = _glUniform4f;

/** @suppress {duplicate } */ function _glUniform4fv(location, count, value) {
 value >>>= 0;
 if (count <= 72) {
  var view = miniTempWebGLFloatBuffers[4 * count - 1];
  var heap = GROWABLE_HEAP_F32();
  value = ((value) >>> 2);
  for (var i = 0; i < 4 * count; i += 4) {
   var dst = value + i;
   view[i] = heap[dst >>> 0];
   view[i + 1] = heap[dst + 1 >>> 0];
   view[i + 2] = heap[dst + 2 >>> 0];
   view[i + 3] = heap[dst + 3 >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_F32().subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
 }
 GLctx.uniform4fv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform4fv = _glUniform4fv;

/** @suppress {duplicate } */ var _glUniform4i = (location, v0, v1, v2, v3) => {
 GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4i = _glUniform4i;

/** @suppress {duplicate } */ function _glUniform4iv(location, count, value) {
 value >>>= 0;
 if (count <= 72) {
  var view = miniTempWebGLIntBuffers[4 * count - 1];
  for (var i = 0; i < 4 * count; i += 4) {
   view[i] = GROWABLE_HEAP_I32()[(((value) + (4 * i)) >>> 2) >>> 0];
   view[i + 1] = GROWABLE_HEAP_I32()[(((value) + (4 * i + 4)) >>> 2) >>> 0];
   view[i + 2] = GROWABLE_HEAP_I32()[(((value) + (4 * i + 8)) >>> 2) >>> 0];
   view[i + 3] = GROWABLE_HEAP_I32()[(((value) + (4 * i + 12)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_I32().subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
 }
 GLctx.uniform4iv(webglGetUniformLocation(location), view);
}

var _emscripten_glUniform4iv = _glUniform4iv;

/** @suppress {duplicate } */ function _glUniformMatrix2fv(location, count, transpose, value) {
 value >>>= 0;
 if (count <= 72) {
  var view = miniTempWebGLFloatBuffers[4 * count - 1];
  for (var i = 0; i < 4 * count; i += 4) {
   view[i] = GROWABLE_HEAP_F32()[(((value) + (4 * i)) >>> 2) >>> 0];
   view[i + 1] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 4)) >>> 2) >>> 0];
   view[i + 2] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 8)) >>> 2) >>> 0];
   view[i + 3] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 12)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_F32().subarray((((value) >>> 2)) >>> 0, ((value + count * 16) >>> 2) >>> 0);
 }
 GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
}

var _emscripten_glUniformMatrix2fv = _glUniformMatrix2fv;

/** @suppress {duplicate } */ function _glUniformMatrix3fv(location, count, transpose, value) {
 value >>>= 0;
 if (count <= 32) {
  var view = miniTempWebGLFloatBuffers[9 * count - 1];
  for (var i = 0; i < 9 * count; i += 9) {
   view[i] = GROWABLE_HEAP_F32()[(((value) + (4 * i)) >>> 2) >>> 0];
   view[i + 1] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 4)) >>> 2) >>> 0];
   view[i + 2] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 8)) >>> 2) >>> 0];
   view[i + 3] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 12)) >>> 2) >>> 0];
   view[i + 4] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 16)) >>> 2) >>> 0];
   view[i + 5] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 20)) >>> 2) >>> 0];
   view[i + 6] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 24)) >>> 2) >>> 0];
   view[i + 7] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 28)) >>> 2) >>> 0];
   view[i + 8] = GROWABLE_HEAP_F32()[(((value) + (4 * i + 32)) >>> 2) >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_F32().subarray((((value) >>> 2)) >>> 0, ((value + count * 36) >>> 2) >>> 0);
 }
 GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
}

var _emscripten_glUniformMatrix3fv = _glUniformMatrix3fv;

/** @suppress {duplicate } */ function _glUniformMatrix4fv(location, count, transpose, value) {
 value >>>= 0;
 if (count <= 18) {
  var view = miniTempWebGLFloatBuffers[16 * count - 1];
  var heap = GROWABLE_HEAP_F32();
  value = ((value) >>> 2);
  for (var i = 0; i < 16 * count; i += 16) {
   var dst = value + i;
   view[i] = heap[dst >>> 0];
   view[i + 1] = heap[dst + 1 >>> 0];
   view[i + 2] = heap[dst + 2 >>> 0];
   view[i + 3] = heap[dst + 3 >>> 0];
   view[i + 4] = heap[dst + 4 >>> 0];
   view[i + 5] = heap[dst + 5 >>> 0];
   view[i + 6] = heap[dst + 6 >>> 0];
   view[i + 7] = heap[dst + 7 >>> 0];
   view[i + 8] = heap[dst + 8 >>> 0];
   view[i + 9] = heap[dst + 9 >>> 0];
   view[i + 10] = heap[dst + 10 >>> 0];
   view[i + 11] = heap[dst + 11 >>> 0];
   view[i + 12] = heap[dst + 12 >>> 0];
   view[i + 13] = heap[dst + 13 >>> 0];
   view[i + 14] = heap[dst + 14 >>> 0];
   view[i + 15] = heap[dst + 15 >>> 0];
  }
 } else {
  var view = GROWABLE_HEAP_F32().subarray((((value) >>> 2)) >>> 0, ((value + count * 64) >>> 2) >>> 0);
 }
 GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
}

var _emscripten_glUniformMatrix4fv = _glUniformMatrix4fv;

/** @suppress {duplicate } */ var _glUseProgram = program => {
 program = GL.programs[program];
 GLctx.useProgram(program);
 GLctx.currentProgram = program;
};

var _emscripten_glUseProgram = _glUseProgram;

/** @suppress {duplicate } */ var _glValidateProgram = program => {
 GLctx.validateProgram(GL.programs[program]);
};

var _emscripten_glValidateProgram = _glValidateProgram;

/** @suppress {duplicate } */ var _glVertexAttrib1f = (x0, x1) => GLctx.vertexAttrib1f(x0, x1);

var _emscripten_glVertexAttrib1f = _glVertexAttrib1f;

/** @suppress {duplicate } */ function _glVertexAttrib1fv(index, v) {
 v >>>= 0;
 GLctx.vertexAttrib1f(index, GROWABLE_HEAP_F32()[v >>> 2]);
}

var _emscripten_glVertexAttrib1fv = _glVertexAttrib1fv;

/** @suppress {duplicate } */ var _glVertexAttrib2f = (x0, x1, x2) => GLctx.vertexAttrib2f(x0, x1, x2);

var _emscripten_glVertexAttrib2f = _glVertexAttrib2f;

/** @suppress {duplicate } */ function _glVertexAttrib2fv(index, v) {
 v >>>= 0;
 GLctx.vertexAttrib2f(index, GROWABLE_HEAP_F32()[v >>> 2], GROWABLE_HEAP_F32()[v + 4 >>> 2]);
}

var _emscripten_glVertexAttrib2fv = _glVertexAttrib2fv;

/** @suppress {duplicate } */ var _glVertexAttrib3f = (x0, x1, x2, x3) => GLctx.vertexAttrib3f(x0, x1, x2, x3);

var _emscripten_glVertexAttrib3f = _glVertexAttrib3f;

/** @suppress {duplicate } */ function _glVertexAttrib3fv(index, v) {
 v >>>= 0;
 GLctx.vertexAttrib3f(index, GROWABLE_HEAP_F32()[v >>> 2], GROWABLE_HEAP_F32()[v + 4 >>> 2], GROWABLE_HEAP_F32()[v + 8 >>> 2]);
}

var _emscripten_glVertexAttrib3fv = _glVertexAttrib3fv;

/** @suppress {duplicate } */ var _glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

var _emscripten_glVertexAttrib4f = _glVertexAttrib4f;

/** @suppress {duplicate } */ function _glVertexAttrib4fv(index, v) {
 v >>>= 0;
 GLctx.vertexAttrib4f(index, GROWABLE_HEAP_F32()[v >>> 2], GROWABLE_HEAP_F32()[v + 4 >>> 2], GROWABLE_HEAP_F32()[v + 8 >>> 2], GROWABLE_HEAP_F32()[v + 12 >>> 2]);
}

var _emscripten_glVertexAttrib4fv = _glVertexAttrib4fv;

/** @suppress {duplicate } */ var _glVertexAttribDivisor = (index, divisor) => {
 GLctx.vertexAttribDivisor(index, divisor);
};

/** @suppress {duplicate } */ var _glVertexAttribDivisorANGLE = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisorANGLE;

/** @suppress {duplicate } */ function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
 ptr >>>= 0;
 GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}

var _emscripten_glVertexAttribPointer = _glVertexAttribPointer;

/** @suppress {duplicate } */ var _glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

var _emscripten_glViewport = _glViewport;

var GLFW3 = {
 fDestructors: [],
 fWindowContexts: null,
 fCustomCursors: null,
 fScaleMQL: null,
 fScaleChangeCallback: null,
 fWindowResizeCallback: null,
 fKeyboardCallback: null,
 fClipboardCallback: null,
 fRequestFullscreen: null,
 fDeferredActions: [],
 fContext: null,
 fCSSValues: null,
 fErrorCodes: {
  GLFW_INVALID_VALUE: 65540,
  GLFW_PLATFORM_ERROR: 65544
 },
 onError(errorCode, errorMessage) {
  if (GLFW3.fErrorHandler) {
   const ptr = stringToNewUTF8(errorMessage);
   getWasmTableEntry(GLFW3.fErrorHandler)(GLFW3.fErrorCodes[errorCode], ptr);
   _free(ptr);
  }
 },
 onScaleChange() {
  if (GLFW3.fScaleChangeCallback) {
   getWasmTableEntry(GLFW3.fScaleChangeCallback)(GLFW3.fContext);
  }
 },
 onWindowResize(glfwWindow, width, height) {
  if (GLFW3.fWindowResizeCallback) {
   getWasmTableEntry(GLFW3.fWindowResizeCallback)(GLFW3.fContext, glfwWindow, width, height);
  }
 },
 isAnyElementFocused: () => document.activeElement !== document.body,
 isAnyOtherElementFocused() {
  return GLFW3.isAnyElementFocused() && GLFW3.findContext(document.activeElement) == null;
 },
 onPaste(e) {
  if (!GLFW3.isAnyOtherElementFocused()) {
   e.preventDefault();
  }
  let clipboardData = e.clipboardData || window.clipboardData;
  let pastedData = clipboardData.getData("text/plain");
  if (pastedData !== "" && GLFW3.fClipboardCallback) {
   const pastedString = stringToNewUTF8(pastedData);
   getWasmTableEntry(GLFW3.fClipboardCallback)(GLFW3.fContext, pastedString, null);
   _free(pastedString);
  }
 },
 onCutOrCopy(e) {
  if (GLFW3.fClipboardCallback) {
   const windowSelection = window.getSelection();
   if (windowSelection && windowSelection.toString() !== "") {
    const selection = stringToNewUTF8(windowSelection.toString());
    getWasmTableEntry(GLFW3.fClipboardCallback)(GLFW3.fContext, selection, null);
    _free(selection);
   } else {
    if (!GLFW3.isAnyOtherElementFocused()) {
     e.clipboardData.setData("text/plain", " ");
     e.preventDefault();
    }
   }
  }
 },
 onMouseEvent(e) {
  requestAnimationFrame(GLFW3.executeDeferredActions);
 },
 onKeyboardEvent(e) {
  if (e.type === "keydown") requestAnimationFrame(GLFW3.executeDeferredActions);
  if (GLFW3.fKeyboardCallback) {
   const code = stringToNewUTF8(e.code);
   const key = stringToNewUTF8(e.key);
   var codepoint = e.key.charCodeAt(0);
   if (codepoint < 127 && e.key.length > 1) codepoint = 0;
   var modifierBits = 0;
   if (e.shiftKey) modifierBits |= 1;
   if (e.ctrlKey) modifierBits |= 2;
   if (e.altKey) modifierBits |= 4;
   if (e.metaKey) modifierBits |= 8;
   if (getWasmTableEntry(GLFW3.fKeyboardCallback)(GLFW3.fContext, e.type === "keydown", code, key, e.repeat, codepoint, modifierBits)) e.preventDefault();
   _free(key);
   _free(code);
  }
 },
 executeDeferredActions() {
  if (GLFW3.fDeferredActions.length > 0) {
   for (let action of GLFW3.fDeferredActions) action();
   GLFW3.fDeferredActions.length = 0;
  }
 },
 deferAction(action) {
  GLFW3.fDeferredActions.push(action);
 },
 findContextByCanvas(canvas) {
  for (let w in GLFW3.fWindowContexts) {
   if (GLFW3.fWindowContexts[w].canvas === canvas) {
    return GLFW3.fWindowContexts[w];
   }
  }
  return null;
 },
 findContextBySelector__deps: [ "$findEventTarget" ],
 findContextBySelector(canvasSelector) {
  return typeof canvasSelector === "string" ? GLFW3.findContextByCanvas(findEventTarget(canvasSelector)) : null;
 },
 findContext(any) {
  if (!any) return null;
  if (GLFW3.fWindowContexts[any]) return GLFW3.fWindowContexts[any];
  if (any instanceof HTMLCanvasElement) return GLFW3.findContextByCanvas(any);
  return GLFW3.findContextBySelector(any);
 },
 requestFullscreen(target, lockPointer, resizeCanvas) {
  if (GLFW3.fRequestFullscreen) {
   const ctx = GLFW3.findContext(target);
   getWasmTableEntry(GLFW3.fRequestFullscreen)(ctx ? ctx.glfwWindow : 0, lockPointer, resizeCanvas);
  }
 },
 backupCSSValues(element, ...names) {
  if (!GLFW3.fCSSValues.has(element)) {
   GLFW3.fCSSValues.set(element, {});
  }
  const properties = GLFW3.fCSSValues.get(element);
  names.forEach(name => properties[name] = element.style.getPropertyValue(name));
 },
 setCSSValue(element, name, value) {
  if (!GLFW3.fCSSValues.get(element)?.hasOwnProperty(name)) {
   GLFW3.backupCSSValues(element, name);
  }
  element.style.setProperty(name, value);
 },
 restoreCSSValues(element, ...names) {
  const properties = GLFW3.fCSSValues.get(element);
  if (!properties) return;
  if (names.length === 0) names = Object.keys(properties);
  names.forEach(name => {
   const value = properties[name];
   if (!value) element.style.removeProperty(name); else element.style.setProperty(name, value);
   delete properties[name];
  });
  if (Object.keys(properties).length === 0) {
   GLFW3.fCSSValues.delete(element);
  }
 },
 setCanvasResizeSelector__deps: [ "$findEventTarget" ],
 setCanvasResizeSelector: (any, canvasResizeSelector) => {
  const ctx = GLFW3.findContext(any);
  if (!ctx) {
   GLFW3.onError("GLFW_INVALID_VALUE", `Cannot find canvas [${any !== null ? any.toString() : "nullptr"}]`);
   return -4;
  }
  if (ctx.fCanvasResize) {
   ctx.fCanvasResize.destroy();
   delete ctx.fCanvasResize;
  }
  if (canvasResizeSelector) {
   const canvasResize = findEventTarget(canvasResizeSelector);
   if (!canvasResize) {
    GLFW3.onError("GLFW_INVALID_VALUE", `Cannot find canvas resize selector [${canvasResizeSelector}]`);
    return -4;
   }
   const glfwWindow = ctx.glfwWindow;
   ctx.fCanvasResize = {
    target: canvasResize,
    destructors: []
   };
   ctx.fCanvasResize.addEventListener = (elt, type, listener) => {
    elt.addEventListener(type, listener);
    ctx.fCanvasResize.destructors.push(() => {
     elt.removeEventListener(type, listener);
    });
   };
   ctx.fCanvasResize.destroy = () => {
    for (let destructor of ctx.fCanvasResize.destructors) destructor();
   };
   if (canvasResize === window) {
    ctx.fCanvasResize.computeSize = () => ({
     width: window.innerWidth,
     height: window.innerHeight
    });
    const listener = e => {
     const size = ctx.fCanvasResize.computeSize();
     GLFW3.onWindowResize(glfwWindow, size.width, size.height);
    };
    ctx.fCanvasResize.observer = {
     observe: elt => {
      window.addEventListener("resize", listener);
     },
     disconnect: () => {
      window.removeEventListener("resize", listener);
     }
    };
   } else {
    ctx.fCanvasResize.destructors.push(() => {
     GLFW3.restoreCSSValues(canvasResize);
    });
    ctx.fCanvasResize.computeSize = () => {
     const style = getComputedStyle(canvasResize);
     return {
      width: parseInt(style.width, 10),
      height: parseInt(style.height, 10)
     };
    };
    ctx.fCanvasResize.observer = new ResizeObserver(entries => {
     const ctx = GLFW3.fWindowContexts[glfwWindow];
     if (ctx.fCanvasResize) {
      for (const entry of entries) {
       if (entry.target === canvasResize) {
        const size = ctx.fCanvasResize.computeSize();
        GLFW3.onWindowResize(glfwWindow, size.width, size.height);
       }
      }
     }
    });
   }
   ctx.fCanvasResize.destructors.push(() => {
    ctx.fCanvasResize.observer.disconnect();
   });
   ctx.fCanvasResize.observer.observe(canvasResize);
   const size = ctx.fCanvasResize.computeSize();
   GLFW3.onWindowResize(glfwWindow, size.width, size.height);
  }
  return 0;
 },
 makeCanvasResizable__deps: [ "$findEventTarget" ],
 makeCanvasResizable: (any, resizableSelector, handleSelector) => {
  if (!resizableSelector) {
   GLFW3.onError("GLFW_INVALID_VALUE", `canvas resize selector is required`);
   return -4;
  }
  const res = GLFW3.setCanvasResizeSelector(any, resizableSelector);
  if (res !== 0) return res;
  if (!handleSelector) return 0;
  const ctx = GLFW3.findContext(any);
  const resizable = findEventTarget(resizableSelector);
  const handle = findEventTarget(handleSelector);
  if (!handle) {
   GLFW3.onError("GLFW_INVALID_VALUE", `Cannot find handle element with selector [${handleSelector}]`);
   return -4;
  }
  var lastDownX = 0;
  var lastDownY = 0;
  var size = undefined;
  var touchId = undefined;
  ctx.fCanvasResize.onSizeChanged = (width, height) => {
   if (size === undefined) {
    GLFW3.setCSSValue(resizable, "width", `${width}px`);
    GLFW3.setCSSValue(resizable, "height", `${height}px`);
   }
  };
  function computeSize(element) {
   const style = getComputedStyle(element);
   return {
    width: parseFloat(style.width),
    height: parseFloat(style.height)
   };
  }
  const onMouseDown = e => {
   size = computeSize(resizable);
   lastDownX = e.clientX;
   lastDownY = e.clientY;
  };
  ctx.fCanvasResize.addEventListener(handle, "mousedown", onMouseDown);
  const onMouseMove = e => {
   if (size !== undefined) {
    var offsetX = lastDownX - e.clientX;
    var offsetY = lastDownY - e.clientY;
    size.width -= offsetX;
    size.height -= offsetY;
    if (size.width < 0) size.width = 0;
    if (size.height < 0) size.height = 0;
    GLFW3.setCSSValue(resizable, "width", `${size.width}px`);
    GLFW3.setCSSValue(resizable, "height", `${size.height}px`);
    lastDownX = e.clientX;
    lastDownY = e.clientY;
   }
  };
  ctx.fCanvasResize.addEventListener(window, "mousemove", onMouseMove);
  const onMouseUp = e => {
   if (size !== undefined) {
    const canvasSize = computeSize(ctx.canvas);
    GLFW3.setCSSValue(resizable, "width", `${canvasSize.width}px`);
    GLFW3.setCSSValue(resizable, "height", `${canvasSize.height}px`);
    size = undefined;
   }
  };
  ctx.fCanvasResize.addEventListener(window, "mouseup", onMouseUp);
  const onTouchStart = e => {
   if (touchId === undefined && e.touches && e.touches.length === 1) {
    const touch = e.touches[0];
    touchId = touch.identifier;
    e.preventDefault();
    onMouseDown(touch);
   }
  };
  ctx.fCanvasResize.addEventListener(handle, "touchstart", onTouchStart);
  const onTouchMove = e => {
   if (size !== undefined && touchId !== undefined) {
    const touch = e.changedTouches ? Array.from(e.changedTouches).find(touch => touch.identifier === touchId) : undefined;
    if (touch !== undefined) {
     onMouseMove(touch);
    }
   }
  };
  ctx.fCanvasResize.addEventListener(window, "touchmove", onTouchMove);
  const onTouchEnd = e => {
   if (size !== undefined && touchId !== undefined) {
    const touch = e.changedTouches ? Array.from(e.changedTouches).find(touch => touch.identifier === touchId) : undefined;
    if (touch !== undefined) {
     touchId = undefined;
     onMouseUp(touch);
    }
   }
  };
  ctx.fCanvasResize.addEventListener(window, "touchend", onTouchEnd);
  ctx.fCanvasResize.addEventListener(window, "touchcancel", onTouchEnd);
  return 0;
 },
 unmakeCanvasResizable: any => GLFW3.setCanvasResizeSelector(any, null)
};

function _emscripten_glfw3_context_destroy() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(16, 0, 1);
 GLFW3.fWindowContexts = null;
 GLFW3.fCustomCursors = null;
 GLFW3.fCSSValues = null;
 GLFW3.fScaleChangeCallback = null;
 GLFW3.fWindowResizeCallback = null;
 GLFW3.fKeyboardCallback = null;
 GLFW3.fClipboardCallback = null;
 GLFW3.fRequestFullscreen = null;
 for (let destructor of GLFW3.fDestructors) destructor();
 GLFW3.fContext = null;
}

function _emscripten_glfw3_context_get_fullscreen_window() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(17, 0, 1);
 const ctx = GLFW3.findContextByCanvas(document.fullscreenElement);
 return ctx ? ctx.glfwWindow : null;
}

var _emscripten_glfw3_context_get_now = () => performance.now();

function _emscripten_glfw3_context_get_pointer_lock_window() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(18, 0, 1);
 const ctx = GLFW3.findContextByCanvas(document.pointerLockElement);
 return ctx ? ctx.glfwWindow : null;
}

function _emscripten_glfw3_context_init(context, scale, scaleChangeCallback, windowResizeCallback, keyboardCallback, clipboardCallback, requestFullscreen, errorHandler) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(19, 0, 1, context, scale, scaleChangeCallback, windowResizeCallback, keyboardCallback, clipboardCallback, requestFullscreen, errorHandler);
 context >>>= 0;
 scaleChangeCallback >>>= 0;
 windowResizeCallback >>>= 0;
 keyboardCallback >>>= 0;
 clipboardCallback >>>= 0;
 requestFullscreen >>>= 0;
 errorHandler >>>= 0;
 specialHTMLTargets["Module['canvas']"] = Module.canvas;
 specialHTMLTargets["window"] = window;
 GLFW3.fWindowContexts = {};
 GLFW3.fCustomCursors = {};
 GLFW3.fCSSValues = new Map;
 GLFW3.fScaleChangeCallback = scaleChangeCallback;
 GLFW3.fWindowResizeCallback = windowResizeCallback;
 GLFW3.fKeyboardCallback = keyboardCallback;
 GLFW3.fClipboardCallback = clipboardCallback;
 GLFW3.fRequestFullscreen = requestFullscreen;
 GLFW3.fErrorHandler = errorHandler;
 GLFW3.fContext = context;
 GLFW3.fScaleMQL = window.matchMedia("(resolution: " + scale + "dppx)");
 GLFW3.fScaleMQL.addEventListener("change", GLFW3.onScaleChange);
 GLFW3.fDestructors.push(() => {
  if (GLFW3.fScaleMQL) {
   GLFW3.fScaleMQL.removeEventListener("change", GLFW3.onScaleChange);
  }
 });
 document.addEventListener("mouseup", GLFW3.onMouseEvent);
 GLFW3.fDestructors.push(() => {
  document.removeEventListener("mouseup", GLFW3.onMouseEvent);
 });
 document.addEventListener("mousedown", GLFW3.onMouseEvent);
 GLFW3.fDestructors.push(() => {
  document.removeEventListener("mousedown", GLFW3.onMouseEvent);
 });
 document.addEventListener("keydown", GLFW3.onKeyboardEvent);
 GLFW3.fDestructors.push(() => {
  document.removeEventListener("keydown", GLFW3.onKeyboardEvent);
 });
 document.addEventListener("keyup", GLFW3.onKeyboardEvent);
 GLFW3.fDestructors.push(() => {
  document.removeEventListener("keyup", GLFW3.onKeyboardEvent);
 });
 document.addEventListener("cut", GLFW3.onCutOrCopy);
 GLFW3.fDestructors.push(() => {
  document.removeEventListener("cut", GLFW3.onCutOrCopy);
 });
 document.addEventListener("copy", GLFW3.onCutOrCopy);
 GLFW3.fDestructors.push(() => {
  document.removeEventListener("copy", GLFW3.onCutOrCopy);
 });
 document.addEventListener("paste", GLFW3.onPaste);
 GLFW3.fDestructors.push(() => {
  document.removeEventListener("paste", GLFW3.onPaste);
 });
}

function _emscripten_glfw3_context_is_any_element_focused() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(20, 0, 1);
 return GLFW3.isAnyElementFocused();
}

function _emscripten_glfw3_context_is_runtime_platform_apple() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(21, 0, 1);
 return navigator.platform.indexOf("Mac") === 0 || navigator.platform === "iPhone";
}

function _emscripten_glfw3_context_jspi_posttask() {
 return new Promise(function(r) {
  try {
   if (typeof scheduler !== "undefined" && scheduler.postTask) {
    scheduler.postTask(r, {
     priority: "user-visible"
    });
    return;
   }
  } catch (e) {}
  setTimeout(r, 0);
 });
}

function _emscripten_glfw3_context_jspi_raf() {
 return new Promise(function(r) {
  var settled = false;
  var done = function() {
   if (!settled) {
    settled = true;
    r();
   }
  };
  try {
   if (typeof requestAnimationFrame === "function") requestAnimationFrame(done);
  } catch (e) {}
  setTimeout(done, 1e3);
 });
}

function _emscripten_glfw3_context_jspi_settimeout() {
 return new Promise(function(r) {
  var settled = false;
  var done = function() {
   if (!settled) {
    settled = true;
    r();
   }
  };
  try {
   if (typeof scheduler !== "undefined" && scheduler.yield) scheduler.yield().then(done, done); else setTimeout(done, 0);
  } catch (e) {
   setTimeout(done, 0);
  }
  setTimeout(done, 1e3);
 });
}

function _emscripten_glfw3_context_jspi_sleep(ms) {
 return new Promise(function(r) {
  setTimeout(r, ms);
 });
}

var _emscripten_glfw3_context_keyboard_lock = function(enable) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(22, 0, 1, enable);
 if (!navigator.keyboard || !navigator.keyboard.lock) return;
 if (enable) {
  try {
   const p = navigator.keyboard.lock([ "Escape" ]);
   if (p && typeof p.catch === "function") p.catch(() => {});
  } catch (e) {}
 } else {
  try {
   navigator.keyboard.unlock();
  } catch (e) {}
 }
};

function _emscripten_glfw3_context_make_canvas_resizable(glfwWindow, resizableSelector, handleSelector) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(23, 0, 1, glfwWindow, resizableSelector, handleSelector);
 glfwWindow >>>= 0;
 resizableSelector >>>= 0;
 handleSelector >>>= 0;
 resizableSelector = resizableSelector ? UTF8ToString(resizableSelector) : null;
 handleSelector = handleSelector ? UTF8ToString(handleSelector) : null;
 return GLFW3.makeCanvasResizable(glfwWindow, resizableSelector, handleSelector);
}

var _emscripten_glfw3_context_open_url = function(url, target) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(24, 0, 1, url, target);
 url >>>= 0;
 target >>>= 0;
 if (url) {
  url = UTF8ToString(url);
  target = target ? UTF8ToString(target) : null;
  GLFW3.deferAction(() => {
   window.open(url, target);
  });
 }
};

var _emscripten_glfw3_context_set_clipboard_string = function(content) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(25, 0, 1, content);
 content >>>= 0;
 content = content ? UTF8ToString(content) : "";
 const errorHandler = err => {
  if (GLFW3.fClipboardCallback) {
   const errorString = stringToNewUTF8(`${err}`);
   getWasmTableEntry(GLFW3.fClipboardCallback)(GLFW3.fContext, null, errorString);
   _free(errorString);
  } else {
   GLFW3.onError("GLFW_PLATFORM_ERROR", `Cannot set clipboard string [${err}]`);
  }
 };
 if (navigator.clipboard) {
  GLFW3.deferAction(() => {
   navigator.clipboard.writeText(content).then(() => {
    if (GLFW3.fClipboardCallback) {
     const string = stringToNewUTF8(content);
     getWasmTableEntry(GLFW3.fClipboardCallback)(GLFW3.fContext, string, null);
     _free(string);
    }
   }).catch(errorHandler);
  });
 } else {
  errorHandler("Missing navigator.clipboard");
 }
};

function _emscripten_glfw3_context_set_title(title) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(26, 0, 1, title);
 title >>>= 0;
 if (title) document.title = UTF8ToString(title);
}

function _emscripten_glfw3_context_unmake_canvas_resizable(glfwWindow) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(27, 0, 1, glfwWindow);
 glfwWindow >>>= 0;
 return GLFW3.unmakeCanvasResizable(glfwWindow);
}

function _emscripten_glfw3_create_custom_cursor(glfwCursor, width, height, pixels) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(28, 0, 1, glfwCursor, width, height, pixels);
 glfwCursor >>>= 0;
 pixels >>>= 0;
 const canvas = document.createElement("canvas");
 canvas.width = width;
 canvas.height = height;
 const ctx = canvas.getContext("2d");
 const imageData = ctx.createImageData(width, height);
 for (let i = 0; i < width * height * 4; i++) {
  var p = getValue(pixels + i, "i8");
  if (p < 0) p += 256;
  imageData.data[i] = p;
 }
 ctx.putImageData(imageData, 0, 0);
 GLFW3.fCustomCursors[glfwCursor] = canvas.toDataURL();
}

function _emscripten_glfw3_destroy_custom_cursor(glfwCursor) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(29, 0, 1, glfwCursor);
 glfwCursor >>>= 0;
 delete GLFW3.fCustomCursors[glfwCursor];
}

function _emscripten_glfw3_window_change_focus(glfwWindow, isFocussed) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(30, 0, 1, glfwWindow, isFocussed);
 glfwWindow >>>= 0;
 const canvas = GLFW3.fWindowContexts[glfwWindow].canvas;
 if (isFocussed) {
  canvas.focus();
 } else {
  canvas.blur();
 }
}

function _emscripten_glfw3_window_destroy(glfwWindow) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(31, 0, 1, glfwWindow);
 glfwWindow >>>= 0;
 if (GLFW3.fWindowContexts) {
  const ctx = GLFW3.fWindowContexts[glfwWindow];
  if (!ctx) return;
  const canvas = ctx.canvas;
  ctx.restoreCSSValues();
  _emscripten_set_canvas_element_size(ctx.CSelector, ctx.originalSize.width, ctx.originalSize.height);
  _free(ctx.CSelector);
  if (ctx.fCanvasResize) {
   ctx.fCanvasResize.destroy();
   delete ctx.fCanvasResize;
  }
  delete GLFW3.fWindowContexts[glfwWindow];
 }
}

function _emscripten_glfw3_window_get_computed_opacity(glfwWindow) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(32, 0, 1, glfwWindow);
 glfwWindow >>>= 0;
 return GLFW3.fWindowContexts[glfwWindow].getComputedCSSValue("opacity");
}

function _emscripten_glfw3_window_get_computed_visibility(glfwWindow) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(33, 0, 1, glfwWindow);
 glfwWindow >>>= 0;
 return GLFW3.fWindowContexts[glfwWindow].getComputedCSSValue("display") !== "none";
}

function _emscripten_glfw3_window_get_position(glfwWindow, x, y) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(34, 0, 1, glfwWindow, x, y);
 glfwWindow >>>= 0;
 x >>>= 0;
 y >>>= 0;
 const canvas = GLFW3.fWindowContexts[glfwWindow].canvas;
 const rect = getBoundingClientRect(canvas);
 GROWABLE_HEAP_I32()[((x) >>> 2) >>> 0] = rect.x;
 GROWABLE_HEAP_I32()[((y) >>> 2) >>> 0] = rect.y;
}

function _emscripten_glfw3_window_init(glfwWindow, canvasSelector) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(35, 0, 1, glfwWindow, canvasSelector);
 glfwWindow >>>= 0;
 canvasSelector >>>= 0;
 canvasSelector = UTF8ToString(canvasSelector);
 const canvas = findEventTarget(canvasSelector);
 if (!canvas) return -4;
 if (GLFW3.findContextByCanvas(canvas)) {
  return -3;
 }
 var canvasCtx = {};
 canvasCtx.glfwWindow = glfwWindow;
 canvasCtx.selector = canvasSelector;
 canvasCtx.CSelector = stringToNewUTF8(canvasSelector);
 canvasCtx.canvas = canvas;
 canvasCtx.originalSize = {
  width: canvas.width,
  height: canvas.height
 };
 canvasCtx.restoreCSSValue = name => {
  GLFW3.restoreCSSValues(canvas, name);
 };
 canvasCtx.restoreCSSValues = () => {
  GLFW3.restoreCSSValues(canvas);
 };
 canvasCtx.setCSSValue = (name, value) => {
  GLFW3.setCSSValue(canvas, name, value);
 };
 canvasCtx.getComputedCSSValue = name => window.getComputedStyle(canvas).getPropertyValue(name);
 GLFW3.fWindowContexts[canvasCtx.glfwWindow] = canvasCtx;
 return 0;
}

function _emscripten_glfw3_window_on_created(glfwWindow) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(36, 0, 1, glfwWindow);
 glfwWindow >>>= 0;
 if (Module.glfwOnWindowCreated) {
  Module.glfwOnWindowCreated(glfwWindow, GLFW3.fWindowContexts[glfwWindow].selector);
 }
}

var _emscripten_glfw3_window_resize_offscreen_local = (width, height) => {
 if (typeof GL === "undefined" || !GL.offscreenCanvases) return;
 for (const key in GL.offscreenCanvases) {
  const info = GL.offscreenCanvases[key];
  const oc = info && info.offscreenCanvas;
  if (!oc) continue;
  try {
   if (oc.width !== width) oc.width = width;
   if (oc.height !== height) oc.height = height;
  } catch (e) {}
 }
};

function _emscripten_glfw3_window_set_custom_cursor(glfwWindow, glfwCursor, xhot, yhot) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(37, 0, 1, glfwWindow, glfwCursor, xhot, yhot);
 glfwWindow >>>= 0;
 glfwCursor >>>= 0;
 const ctx = GLFW3.fWindowContexts[glfwWindow];
 const cursor = GLFW3.fCustomCursors[glfwCursor];
 if (cursor) ctx.setCSSValue("cursor", `url(${cursor}) ${xhot} ${yhot}, auto`); else ctx.restoreCSSValue("cursor");
}

function _emscripten_glfw3_window_set_opacity(glfwWindow, opacity) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(38, 0, 1, glfwWindow, opacity);
 glfwWindow >>>= 0;
 const ctx = GLFW3.fWindowContexts[glfwWindow];
 ctx.setCSSValue("opacity", opacity);
}

function _emscripten_glfw3_window_set_size(glfwWindow, width, height, fbWidth, fbHeight) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(39, 0, 1, glfwWindow, width, height, fbWidth, fbHeight);
 glfwWindow >>>= 0;
 const ctx = GLFW3.fWindowContexts[glfwWindow];
 const canvas = ctx.canvas;
 _emscripten_set_canvas_element_size(ctx.CSelector, fbWidth, fbHeight);
 ctx.setCSSValue("width", width + "px", "important");
 ctx.setCSSValue("height", height + "px", "important");
 if (ctx.fCanvasResize && ctx.fCanvasResize.onSizeChanged) ctx.fCanvasResize.onSizeChanged(width, height);
}

function _emscripten_glfw3_window_set_standard_cursor(glfwWindow, cursor) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(40, 0, 1, glfwWindow, cursor);
 glfwWindow >>>= 0;
 cursor >>>= 0;
 const ctx = GLFW3.fWindowContexts[glfwWindow];
 if (cursor) ctx.setCSSValue("cursor", UTF8ToString(cursor)); else ctx.restoreCSSValue("cursor");
}

function _emscripten_glfw3_window_set_visibility(glfwWindow, visible) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(41, 0, 1, glfwWindow, visible);
 glfwWindow >>>= 0;
 const ctx = GLFW3.fWindowContexts[glfwWindow];
 if (!visible) ctx.setCSSValue("display", "none"); else ctx.restoreCSSValue("display");
}

var _emscripten_has_asyncify = () => 0;

var _emscripten_num_logical_cores = () => navigator["hardwareConcurrency"];

function _emscripten_out(str) {
 str >>>= 0;
 return out(UTF8ToString(str));
}

var doRequestFullscreen = (target, strategy) => {
 if (!JSEvents.fullscreenEnabled()) return -1;
 target = findEventTarget(target);
 if (!target) return -4;
 if (!target.requestFullscreen) {
  return -3;
 }
 var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
 if (!canPerformRequests) {
  if (strategy.deferUntilInEventHandler) {
   JSEvents.deferCall(JSEvents_requestFullscreen, 1, /* priority over pointer lock */ [ target, strategy ]);
   return 1;
  }
  return -2;
 }
 return JSEvents_requestFullscreen(target, strategy);
};

function _emscripten_request_fullscreen(target, deferUntilInEventHandler) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(42, 0, 1, target, deferUntilInEventHandler);
 target >>>= 0;
 var strategy = {
  scaleMode: 0,
  canvasResolutionScaleMode: 0,
  filteringMode: 0,
  deferUntilInEventHandler: deferUntilInEventHandler,
  canvasResizedCallbackTargetThread: 2
 };
 return doRequestFullscreen(target, strategy);
}

function _emscripten_request_fullscreen_strategy(target, deferUntilInEventHandler, fullscreenStrategy) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(43, 0, 1, target, deferUntilInEventHandler, fullscreenStrategy);
 target >>>= 0;
 fullscreenStrategy >>>= 0;
 var strategy = {
  scaleMode: GROWABLE_HEAP_I32()[((fullscreenStrategy) >>> 2) >>> 0],
  canvasResolutionScaleMode: GROWABLE_HEAP_I32()[(((fullscreenStrategy) + (4)) >>> 2) >>> 0],
  filteringMode: GROWABLE_HEAP_I32()[(((fullscreenStrategy) + (8)) >>> 2) >>> 0],
  deferUntilInEventHandler: deferUntilInEventHandler,
  canvasResizedCallbackTargetThread: GROWABLE_HEAP_I32()[(((fullscreenStrategy) + (20)) >>> 2) >>> 0],
  canvasResizedCallback: GROWABLE_HEAP_I32()[(((fullscreenStrategy) + (12)) >>> 2) >>> 0],
  canvasResizedCallbackUserData: GROWABLE_HEAP_I32()[(((fullscreenStrategy) + (16)) >>> 2) >>> 0]
 };
 return doRequestFullscreen(target, strategy);
}

function _emscripten_request_pointerlock(target, deferUntilInEventHandler) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(44, 0, 1, target, deferUntilInEventHandler);
 target >>>= 0;
 target = findEventTarget(target);
 if (!target) return -4;
 if (!target.requestPointerLock) {
  return -1;
 }
 var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
 if (!canPerformRequests) {
  if (deferUntilInEventHandler) {
   JSEvents.deferCall(requestPointerLock, 2, /* priority below fullscreen */ [ target ]);
   return 1;
  }
  return -2;
 }
 return requestPointerLock(target);
}

var growMemory = size => {
 var b = wasmMemory.buffer;
 var pages = (size - b.byteLength + 65535) / 65536;
 try {
  wasmMemory.grow(pages);
  updateMemoryViews();
  return 1;
 } /*success*/ catch (e) {}
};

function _emscripten_resize_heap(requestedSize) {
 requestedSize >>>= 0;
 var oldSize = GROWABLE_HEAP_U8().length;
 if (requestedSize <= oldSize) {
  return false;
 }
 var maxHeapSize = getHeapMax();
 if (requestedSize > maxHeapSize) {
  return false;
 }
 var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
 for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
  var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
  overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
  var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
  var replacement = growMemory(newSize);
  if (replacement) {
   return true;
  }
 }
 return false;
}

/** @suppress {checkTypes} */ function _emscripten_sample_gamepad_data() {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(45, 0, 1);
 try {
  if (navigator.getGamepads) return (JSEvents.lastGamepadState = navigator.getGamepads()) ? 0 : -1;
 } catch (e) {
  navigator.getGamepads = null;
 }
 return -1;
}

var registerBeforeUnloadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) => {
 var beforeUnloadEventHandlerFunc = (e = event) => {
  var confirmationMessage = getWasmTableEntry(callbackfunc)(eventTypeId, 0, userData);
  if (confirmationMessage) {
   confirmationMessage = UTF8ToString(confirmationMessage);
  }
  if (confirmationMessage) {
   e.preventDefault();
   e.returnValue = confirmationMessage;
   return confirmationMessage;
  }
 };
 var eventHandler = {
  target: findEventTarget(target),
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: beforeUnloadEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_beforeunload_callback_on_thread(userData, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(46, 0, 1, userData, callbackfunc, targetThread);
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (typeof onbeforeunload == "undefined") return -1;
 if (targetThread !== 1) return -5;
 return registerBeforeUnloadEventCallback(2, userData, true, callbackfunc, 28, "beforeunload");
}

var registerFocusEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.focusEvent) JSEvents.focusEvent = _malloc(256);
 var focusEventHandlerFunc = (e = event) => {
  var nodeName = JSEvents.getNodeNameForTarget(e.target);
  var id = e.target.id ? e.target.id : "";
  var focusEvent = targetThread ? _malloc(256) : JSEvents.focusEvent;
  stringToUTF8(nodeName, focusEvent + 0, 128);
  stringToUTF8(id, focusEvent + 128, 128);
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, focusEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, focusEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: findEventTarget(target),
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: focusEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_blur_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(47, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 12, "blur", targetThread);
}

var fillDeviceMotionEventData = (eventStruct, e, target) => {
 var supportedFields = 0;
 var a = e["acceleration"];
 supportedFields |= a && 1;
 var ag = e["accelerationIncludingGravity"];
 supportedFields |= ag && 2;
 var rr = e["rotationRate"];
 supportedFields |= rr && 4;
 a = a || {};
 ag = ag || {};
 rr = rr || {};
 GROWABLE_HEAP_F64()[((eventStruct) >>> 3) >>> 0] = a["x"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (8)) >>> 3) >>> 0] = a["y"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (16)) >>> 3) >>> 0] = a["z"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (24)) >>> 3) >>> 0] = ag["x"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (32)) >>> 3) >>> 0] = ag["y"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (40)) >>> 3) >>> 0] = ag["z"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (48)) >>> 3) >>> 0] = rr["alpha"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (56)) >>> 3) >>> 0] = rr["beta"];
 GROWABLE_HEAP_F64()[(((eventStruct) + (64)) >>> 3) >>> 0] = rr["gamma"];
};

var registerDeviceMotionEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.deviceMotionEvent) JSEvents.deviceMotionEvent = _malloc(80);
 var deviceMotionEventHandlerFunc = (e = event) => {
  fillDeviceMotionEventData(JSEvents.deviceMotionEvent, e, target);
  if (targetThread) {
   var deviceMotionEvent = _malloc(80);
   fillDeviceMotionEventData(deviceMotionEvent, e, target);
   __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, deviceMotionEvent, userData);
  } else if (getWasmTableEntry(callbackfunc)(eventTypeId, JSEvents.deviceMotionEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: findEventTarget(target),
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: deviceMotionEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_devicemotion_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(48, 0, 1, userData, useCapture, callbackfunc, targetThread);
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerDeviceMotionEventCallback(2, userData, useCapture, callbackfunc, 17, "devicemotion", targetThread);
}

function _emscripten_set_element_css_size(target, width, height) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(49, 0, 1, target, width, height);
 target >>>= 0;
 target = findEventTarget(target);
 if (!target) return -4;
 target.style.width = width + "px";
 target.style.height = height + "px";
 return 0;
}

function _emscripten_set_focus_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(50, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerFocusEventCallback(target, userData, useCapture, callbackfunc, 13, "focus", targetThread);
}

var registerFullscreenChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.fullscreenChangeEvent) JSEvents.fullscreenChangeEvent = _malloc(280);
 var fullscreenChangeEventhandlerFunc = (e = event) => {
  var fullscreenChangeEvent = targetThread ? _malloc(280) : JSEvents.fullscreenChangeEvent;
  fillFullscreenChangeEventData(fullscreenChangeEvent);
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, fullscreenChangeEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: fullscreenChangeEventhandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(51, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (!JSEvents.fullscreenEnabled()) return -1;
 target = findEventTarget(target);
 if (!target) return -4;
 return registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);
}

var registerGamepadEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.gamepadEvent) JSEvents.gamepadEvent = _malloc(1432);
 var gamepadEventHandlerFunc = (e = event) => {
  var gamepadEvent = targetThread ? _malloc(1432) : JSEvents.gamepadEvent;
  fillGamepadEventData(gamepadEvent, e["gamepad"]);
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, gamepadEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, gamepadEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: findEventTarget(target),
  allowsDeferredCalls: true,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: gamepadEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_gamepadconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(52, 0, 1, userData, useCapture, callbackfunc, targetThread);
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (_emscripten_sample_gamepad_data()) return -1;
 return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 26, "gamepadconnected", targetThread);
}

function _emscripten_set_gamepaddisconnected_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(53, 0, 1, userData, useCapture, callbackfunc, targetThread);
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (_emscripten_sample_gamepad_data()) return -1;
 return registerGamepadEventCallback(2, userData, useCapture, callbackfunc, 27, "gamepaddisconnected", targetThread);
}

var registerKeyEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(176);
 var keyEventHandlerFunc = e => {
  var keyEventData = targetThread ? _malloc(176) : JSEvents.keyEvent;
  GROWABLE_HEAP_F64()[((keyEventData) >>> 3) >>> 0] = e.timeStamp;
  var idx = ((keyEventData) >>> 2);
  GROWABLE_HEAP_I32()[idx + 2 >>> 0] = e.location;
  GROWABLE_HEAP_I32()[idx + 3 >>> 0] = e.ctrlKey;
  GROWABLE_HEAP_I32()[idx + 4 >>> 0] = e.shiftKey;
  GROWABLE_HEAP_I32()[idx + 5 >>> 0] = e.altKey;
  GROWABLE_HEAP_I32()[idx + 6 >>> 0] = e.metaKey;
  GROWABLE_HEAP_I32()[idx + 7 >>> 0] = e.repeat;
  GROWABLE_HEAP_I32()[idx + 8 >>> 0] = e.charCode;
  GROWABLE_HEAP_I32()[idx + 9 >>> 0] = e.keyCode;
  GROWABLE_HEAP_I32()[idx + 10 >>> 0] = e.which;
  stringToUTF8(e.key || "", keyEventData + 44, 32);
  stringToUTF8(e.code || "", keyEventData + 76, 32);
  stringToUTF8(e.char || "", keyEventData + 108, 32);
  stringToUTF8(e.locale || "", keyEventData + 140, 32);
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, keyEventData, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, keyEventData, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: findEventTarget(target),
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: keyEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(54, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
}

function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(55, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
}

function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(56, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
}

function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop) {
 func >>>= 0;
 var browserIterationFunc = getWasmTableEntry(func);
 setMainLoop(browserIterationFunc, fps, simulateInfiniteLoop);
}

var fillMouseEventData = (eventStruct, e, target) => {
 GROWABLE_HEAP_F64()[((eventStruct) >>> 3) >>> 0] = e.timeStamp;
 var idx = ((eventStruct) >>> 2);
 GROWABLE_HEAP_I32()[idx + 2 >>> 0] = e.screenX;
 GROWABLE_HEAP_I32()[idx + 3 >>> 0] = e.screenY;
 GROWABLE_HEAP_I32()[idx + 4 >>> 0] = e.clientX;
 GROWABLE_HEAP_I32()[idx + 5 >>> 0] = e.clientY;
 GROWABLE_HEAP_I32()[idx + 6 >>> 0] = e.ctrlKey;
 GROWABLE_HEAP_I32()[idx + 7 >>> 0] = e.shiftKey;
 GROWABLE_HEAP_I32()[idx + 8 >>> 0] = e.altKey;
 GROWABLE_HEAP_I32()[idx + 9 >>> 0] = e.metaKey;
 GROWABLE_HEAP_I16()[idx * 2 + 20 >>> 0] = e.button;
 GROWABLE_HEAP_I16()[idx * 2 + 21 >>> 0] = e.buttons;
 GROWABLE_HEAP_I32()[idx + 11 >>> 0] = e["movementX"];
 GROWABLE_HEAP_I32()[idx + 12 >>> 0] = e["movementY"];
 var rect = getBoundingClientRect(target);
 GROWABLE_HEAP_I32()[idx + 13 >>> 0] = e.clientX - (rect.left | 0);
 GROWABLE_HEAP_I32()[idx + 14 >>> 0] = e.clientY - (rect.top | 0);
};

var registerMouseEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(72);
 target = findEventTarget(target);
 var mouseEventHandlerFunc = (e = event) => {
  fillMouseEventData(JSEvents.mouseEvent, e, target);
  if (targetThread) {
   var mouseEventData = _malloc(72);
   fillMouseEventData(mouseEventData, e, target);
   __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, mouseEventData, userData);
  } else if (getWasmTableEntry(callbackfunc)(eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString != "mouseleave",
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: mouseEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(57, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
}

function _emscripten_set_mouseenter_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(58, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter", targetThread);
}

function _emscripten_set_mouseleave_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(59, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);
}

function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(60, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
}

function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(61, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
}

var screenOrientation = () => {
 if (!window.screen) return undefined;
 return screen.orientation || screen["mozOrientation"] || screen["webkitOrientation"];
};

var fillOrientationChangeEventData = eventStruct => {
 var orientationsType1 = [ "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary" ];
 var orientationsType2 = [ "portrait", "portrait", "landscape", "landscape" ];
 var orientationIndex = 0;
 var orientationAngle = 0;
 var screenOrientObj = screenOrientation();
 if (typeof screenOrientObj === "object") {
  orientationIndex = orientationsType1.indexOf(screenOrientObj.type);
  if (orientationIndex < 0) {
   orientationIndex = orientationsType2.indexOf(screenOrientObj.type);
  }
  if (orientationIndex >= 0) {
   orientationIndex = 1 << orientationIndex;
  }
  orientationAngle = screenOrientObj.angle;
 }
 GROWABLE_HEAP_I32()[((eventStruct) >>> 2) >>> 0] = orientationIndex;
 GROWABLE_HEAP_I32()[(((eventStruct) + (4)) >>> 2) >>> 0] = orientationAngle;
};

var registerOrientationChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.orientationChangeEvent) JSEvents.orientationChangeEvent = _malloc(8);
 var orientationChangeEventHandlerFunc = (e = event) => {
  var orientationChangeEvent = targetThread ? _malloc(8) : JSEvents.orientationChangeEvent;
  fillOrientationChangeEventData(orientationChangeEvent);
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, orientationChangeEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, orientationChangeEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: orientationChangeEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_orientationchange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(62, 0, 1, userData, useCapture, callbackfunc, targetThread);
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (!window.screen || !screen.orientation) return -1;
 return registerOrientationChangeEventCallback(screen.orientation, userData, useCapture, callbackfunc, 18, "change", targetThread);
}

var fillPointerlockChangeEventData = eventStruct => {
 var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
 var isPointerlocked = !!pointerLockElement;
 /** @suppress{checkTypes} */ GROWABLE_HEAP_I32()[((eventStruct) >>> 2) >>> 0] = isPointerlocked;
 var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
 var id = pointerLockElement?.id || "";
 stringToUTF8(nodeName, eventStruct + 4, 128);
 stringToUTF8(id, eventStruct + 132, 128);
};

var registerPointerlockChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.pointerlockChangeEvent) JSEvents.pointerlockChangeEvent = _malloc(260);
 var pointerlockChangeEventHandlerFunc = (e = event) => {
  var pointerlockChangeEvent = targetThread ? _malloc(260) : JSEvents.pointerlockChangeEvent;
  fillPointerlockChangeEventData(pointerlockChangeEvent);
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, pointerlockChangeEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, pointerlockChangeEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: pointerlockChangeEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

/** @suppress {missingProperties} */ function _emscripten_set_pointerlockchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(63, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (!document || !document.body || (!document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock)) {
  return -1;
 }
 target = findEventTarget(target);
 if (!target) return -4;
 registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mozpointerlockchange", targetThread);
 registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "webkitpointerlockchange", targetThread);
 registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "mspointerlockchange", targetThread);
 return registerPointerlockChangeEventCallback(target, userData, useCapture, callbackfunc, 20, "pointerlockchange", targetThread);
}

var registerPointerlockErrorEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 var pointerlockErrorEventHandlerFunc = (e = event) => {
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, 0, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, 0, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: pointerlockErrorEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

/** @suppress {missingProperties} */ function _emscripten_set_pointerlockerror_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(64, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (!document || !document.body.requestPointerLock && !document.body.mozRequestPointerLock && !document.body.webkitRequestPointerLock && !document.body.msRequestPointerLock) {
  return -1;
 }
 target = findEventTarget(target);
 if (!target) return -4;
 registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "mozpointerlockerror", targetThread);
 registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "webkitpointerlockerror", targetThread);
 registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "mspointerlockerror", targetThread);
 return registerPointerlockErrorEventCallback(target, userData, useCapture, callbackfunc, 38, "pointerlockerror", targetThread);
}

var registerUiEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.uiEvent) JSEvents.uiEvent = _malloc(36);
 target = findEventTarget(target);
 var uiEventHandlerFunc = (e = event) => {
  if (e.target != target) {
   return;
  }
  var b = document.body;
  if (!b) {
   return;
  }
  var uiEvent = targetThread ? _malloc(36) : JSEvents.uiEvent;
  GROWABLE_HEAP_I32()[((uiEvent) >>> 2) >>> 0] = 0;
  GROWABLE_HEAP_I32()[(((uiEvent) + (4)) >>> 2) >>> 0] = b.clientWidth;
  GROWABLE_HEAP_I32()[(((uiEvent) + (8)) >>> 2) >>> 0] = b.clientHeight;
  GROWABLE_HEAP_I32()[(((uiEvent) + (12)) >>> 2) >>> 0] = innerWidth;
  GROWABLE_HEAP_I32()[(((uiEvent) + (16)) >>> 2) >>> 0] = innerHeight;
  GROWABLE_HEAP_I32()[(((uiEvent) + (20)) >>> 2) >>> 0] = outerWidth;
  GROWABLE_HEAP_I32()[(((uiEvent) + (24)) >>> 2) >>> 0] = outerHeight;
  GROWABLE_HEAP_I32()[(((uiEvent) + (28)) >>> 2) >>> 0] = pageXOffset | 0;
  GROWABLE_HEAP_I32()[(((uiEvent) + (32)) >>> 2) >>> 0] = pageYOffset | 0;
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, uiEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, uiEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: uiEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_resize_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(65, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerUiEventCallback(target, userData, useCapture, callbackfunc, 10, "resize", targetThread);
}

var _emscripten_set_timeout = function(cb, msecs, userData) {
 cb >>>= 0;
 userData >>>= 0;
 return safeSetTimeout(() => getWasmTableEntry(cb)(userData), msecs);
};

var registerTouchEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1696);
 target = findEventTarget(target);
 var touchEventHandlerFunc = e => {
  var t, touches = {}, et = e.touches;
  for (var i = 0; i < et.length; ++i) {
   t = et[i];
   t.isChanged = t.onTarget = 0;
   touches[t.identifier] = t;
  }
  for (var i = 0; i < e.changedTouches.length; ++i) {
   t = e.changedTouches[i];
   t.isChanged = 1;
   touches[t.identifier] = t;
  }
  for (var i = 0; i < e.targetTouches.length; ++i) {
   touches[e.targetTouches[i].identifier].onTarget = 1;
  }
  var touchEvent = targetThread ? _malloc(1696) : JSEvents.touchEvent;
  GROWABLE_HEAP_F64()[((touchEvent) >>> 3) >>> 0] = e.timeStamp;
  var idx = ((touchEvent) >>> 2);
  GROWABLE_HEAP_I32()[idx + 3 >>> 0] = e.ctrlKey;
  GROWABLE_HEAP_I32()[idx + 4 >>> 0] = e.shiftKey;
  GROWABLE_HEAP_I32()[idx + 5 >>> 0] = e.altKey;
  GROWABLE_HEAP_I32()[idx + 6 >>> 0] = e.metaKey;
  idx += 7;
  var targetRect = getBoundingClientRect(target);
  var numTouches = 0;
  for (var i in touches) {
   t = touches[i];
   GROWABLE_HEAP_I32()[idx + 0 >>> 0] = t.identifier;
   GROWABLE_HEAP_I32()[idx + 1 >>> 0] = t.screenX;
   GROWABLE_HEAP_I32()[idx + 2 >>> 0] = t.screenY;
   GROWABLE_HEAP_I32()[idx + 3 >>> 0] = t.clientX;
   GROWABLE_HEAP_I32()[idx + 4 >>> 0] = t.clientY;
   GROWABLE_HEAP_I32()[idx + 5 >>> 0] = t.pageX;
   GROWABLE_HEAP_I32()[idx + 6 >>> 0] = t.pageY;
   GROWABLE_HEAP_I32()[idx + 7 >>> 0] = t.isChanged;
   GROWABLE_HEAP_I32()[idx + 8 >>> 0] = t.onTarget;
   GROWABLE_HEAP_I32()[idx + 9 >>> 0] = t.clientX - (targetRect.left | 0);
   GROWABLE_HEAP_I32()[idx + 10 >>> 0] = t.clientY - (targetRect.top | 0);
   idx += 13;
   if (++numTouches > 31) {
    break;
   }
  }
  GROWABLE_HEAP_I32()[(((touchEvent) + (8)) >>> 2) >>> 0] = numTouches;
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, touchEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, touchEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: touchEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(66, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
}

function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(67, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
}

function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(68, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
}

function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(69, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
}

var fillVisibilityChangeEventData = eventStruct => {
 var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
 var visibilityState = visibilityStates.indexOf(document.visibilityState);
 /** @suppress{checkTypes} */ GROWABLE_HEAP_I32()[((eventStruct) >>> 2) >>> 0] = document.hidden;
 GROWABLE_HEAP_I32()[(((eventStruct) + (4)) >>> 2) >>> 0] = visibilityState;
};

var registerVisibilityChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.visibilityChangeEvent) JSEvents.visibilityChangeEvent = _malloc(8);
 var visibilityChangeEventHandlerFunc = (e = event) => {
  var visibilityChangeEvent = targetThread ? _malloc(8) : JSEvents.visibilityChangeEvent;
  fillVisibilityChangeEventData(visibilityChangeEvent);
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, visibilityChangeEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, visibilityChangeEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: visibilityChangeEventHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(70, 0, 1, userData, useCapture, callbackfunc, targetThread);
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 if (!specialHTMLTargets[1]) {
  return -4;
 }
 return registerVisibilityChangeEventCallback(specialHTMLTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
}

var registerWheelEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
 targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
 if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(104);
 var wheelHandlerFunc = (e = event) => {
  var wheelEvent = targetThread ? _malloc(104) : JSEvents.wheelEvent;
  fillMouseEventData(wheelEvent, e, target);
  GROWABLE_HEAP_F64()[(((wheelEvent) + (72)) >>> 3) >>> 0] = e["deltaX"];
  GROWABLE_HEAP_F64()[(((wheelEvent) + (80)) >>> 3) >>> 0] = e["deltaY"];
  GROWABLE_HEAP_F64()[(((wheelEvent) + (88)) >>> 3) >>> 0] = e["deltaZ"];
  GROWABLE_HEAP_I32()[(((wheelEvent) + (96)) >>> 2) >>> 0] = e["deltaMode"];
  if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, wheelEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, wheelEvent, userData)) e.preventDefault();
 };
 var eventHandler = {
  target: target,
  allowsDeferredCalls: true,
  eventTypeString: eventTypeString,
  callbackfunc: callbackfunc,
  handlerFunc: wheelHandlerFunc,
  useCapture: useCapture
 };
 return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_wheel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(71, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
 target >>>= 0;
 userData >>>= 0;
 callbackfunc >>>= 0;
 targetThread >>>= 0;
 target = findEventTarget(target);
 if (!target) return -4;
 if (typeof target.onwheel != "undefined") {
  return registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel", targetThread);
 } else {
  return -1;
 }
}

function _emscripten_set_window_title(title) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(72, 0, 1, title);
 title >>>= 0;
 return document.title = UTF8ToString(title);
}

var _emscripten_sleep = () => {
 throw "Please compile your program with async support in order to use asynchronous operations like emscripten_sleep";
};

var _emscripten_unwind_to_js_event_loop = () => {
 throw "unwind";
};

var _emscripten_supports_offscreencanvas = () => typeof OffscreenCanvas != "undefined";

var webglPowerPreferences = [ "default", "low-power", "high-performance" ];

/** @suppress {duplicate } */ function _emscripten_webgl_do_create_context(target, attributes) {
 target >>>= 0;
 attributes >>>= 0;
 var a = ((attributes) >>> 2);
 var powerPreference = GROWABLE_HEAP_I32()[a + (24 >> 2) >>> 0];
 var contextAttributes = {
  "alpha": !!GROWABLE_HEAP_I32()[a + (0 >> 2) >>> 0],
  "depth": !!GROWABLE_HEAP_I32()[a + (4 >> 2) >>> 0],
  "stencil": !!GROWABLE_HEAP_I32()[a + (8 >> 2) >>> 0],
  "antialias": !!GROWABLE_HEAP_I32()[a + (12 >> 2) >>> 0],
  "premultipliedAlpha": !!GROWABLE_HEAP_I32()[a + (16 >> 2) >>> 0],
  "preserveDrawingBuffer": !!GROWABLE_HEAP_I32()[a + (20 >> 2) >>> 0],
  "powerPreference": webglPowerPreferences[powerPreference],
  "failIfMajorPerformanceCaveat": !!GROWABLE_HEAP_I32()[a + (28 >> 2) >>> 0],
  majorVersion: GROWABLE_HEAP_I32()[a + (32 >> 2) >>> 0],
  minorVersion: GROWABLE_HEAP_I32()[a + (36 >> 2) >>> 0],
  enableExtensionsByDefault: GROWABLE_HEAP_I32()[a + (40 >> 2) >>> 0],
  explicitSwapControl: GROWABLE_HEAP_I32()[a + (44 >> 2) >>> 0],
  proxyContextToMainThread: GROWABLE_HEAP_I32()[a + (48 >> 2) >>> 0],
  renderViaOffscreenBackBuffer: GROWABLE_HEAP_I32()[a + (52 >> 2) >>> 0]
 };
 var canvas = findCanvasEventTarget(target);
 if (!canvas) {
  return 0;
 }
 if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
 if (contextAttributes.explicitSwapControl) {
  var supportsOffscreenCanvas = canvas.transferControlToOffscreen || (_emscripten_supports_offscreencanvas() && canvas instanceof OffscreenCanvas);
  if (!supportsOffscreenCanvas) {
   return 0;
  }
  if (canvas.transferControlToOffscreen) {
   if (!canvas.controlTransferredOffscreen) {
    GL.offscreenCanvases[canvas.id] = {
     canvas: canvas.transferControlToOffscreen(),
     canvasSharedPtr: _malloc(12),
     id: canvas.id
    };
    canvas.controlTransferredOffscreen = true;
   } else if (!GL.offscreenCanvases[canvas.id]) {
    return 0;
   }
   canvas = GL.offscreenCanvases[canvas.id];
  }
 }
 var contextHandle = GL.createContext(canvas, contextAttributes);
 return contextHandle;
}

var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;

var _emscripten_webgl_destroy_context_calling_thread = contextHandle => {
 if (GL.currentContext == contextHandle) GL.currentContext = 0;
 GL.deleteContext(contextHandle);
};

var _emscripten_webgl_destroy_context_main_thread = _emscripten_webgl_destroy_context_calling_thread;

function _emscripten_webgl_destroy_context(p0) {
 p0 >>>= 0;
 return GL.contexts[p0] ? _emscripten_webgl_destroy_context_calling_thread(p0) : _emscripten_webgl_destroy_context_main_thread(p0);
}

function _emscripten_webgl_make_context_current(contextHandle) {
 contextHandle >>>= 0;
 var success = GL.makeContextCurrent(contextHandle);
 return success ? 0 : -5;
}

var WebGPU = {
 Internals: {
  jsObjects: [],
  jsObjectInsert: (ptr, jsObject) => {
   WebGPU.Internals.jsObjects[(ptr >>>= 0)] = jsObject;
  },
  bufferOnUnmaps: [],
  futures: [],
  futureInsert: (futureId, promise) => {}
 },
 getJsObject: ptr => {
  if (!ptr) return undefined;
  var key = (ptr >>>= 0);
  return WebGPU.Internals.jsObjects[key];
 },
 importJsAdapter: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateAdapter(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsBindGroup: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateBindGroup(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsBindGroupLayout: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateBindGroupLayout(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsBuffer: (buffer, parentPtr = 0) => {
  assert(buffer.mapState != "pending");
  var mapState = buffer.mapState == "mapped" ? 3 : 1;
  var bufferPtr = _emwgpuCreateBuffer(parentPtr, mapState);
  WebGPU.Internals.jsObjectInsert(bufferPtr, buffer);
  if (buffer.mapState == "mapped") {
   WebGPU.Internals.bufferOnUnmaps[bufferPtr] = [];
  }
  return bufferPtr;
 },
 importJsCommandBuffer: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateCommandBuffer(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsCommandEncoder: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateCommandEncoder(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsComputePassEncoder: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateComputePassEncoder(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsComputePipeline: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateComputePipeline(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsDevice: (device, parentPtr = 0) => {
  var queuePtr = _emwgpuCreateQueue(parentPtr);
  var devicePtr = _emwgpuCreateDevice(parentPtr, queuePtr);
  WebGPU.Internals.jsObjectInsert(queuePtr, device.queue);
  WebGPU.Internals.jsObjectInsert(devicePtr, device);
  return devicePtr;
 },
 importJsPipelineLayout: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreatePipelineLayout(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsQuerySet: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateQuerySet(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsQueue: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateQueue(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsRenderBundle: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateRenderBundle(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsRenderBundleEncoder: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateRenderBundleEncoder(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsRenderPassEncoder: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateRenderPassEncoder(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsRenderPipeline: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateRenderPipeline(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsSampler: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateSampler(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsShaderModule: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateShaderModule(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsSurface: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateSurface(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsTexture: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateTexture(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 importJsTextureView: (obj, parentPtr = 0) => {
  var ptr = _emwgpuCreateTextureView(parentPtr);
  WebGPU.Internals.jsObjects[ptr >>> 0] = obj;
  return ptr;
 },
 errorCallback: (callback, type, message, userdata) => {
  var sp = stackSave();
  var messagePtr = stringToUTF8OnStack(message);
  getWasmTableEntry(callback)(type, messagePtr, userdata);
  stackRestore(sp);
 },
 setStringView: (ptr, data, length) => {
  GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] = data;
  GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0] = length;
 },
 makeStringFromStringView: stringViewPtr => {
  var ptr = GROWABLE_HEAP_U32()[((stringViewPtr) >>> 2) >>> 0];
  var length = GROWABLE_HEAP_U32()[(((stringViewPtr) + (4)) >>> 2) >>> 0];
  return UTF8ToString(ptr, length);
 },
 makeStringFromOptionalStringView: stringViewPtr => {
  var ptr = GROWABLE_HEAP_U32()[((stringViewPtr) >>> 2) >>> 0];
  var length = GROWABLE_HEAP_U32()[(((stringViewPtr) + (4)) >>> 2) >>> 0];
  if (!ptr) {
   if (length === 0) {
    return "";
   }
   return undefined;
  }
  return UTF8ToString(ptr, length);
 },
 makeColor: ptr => ({
  "r": GROWABLE_HEAP_F64()[((ptr) >>> 3) >>> 0],
  "g": GROWABLE_HEAP_F64()[(((ptr) + (8)) >>> 3) >>> 0],
  "b": GROWABLE_HEAP_F64()[(((ptr) + (16)) >>> 3) >>> 0],
  "a": GROWABLE_HEAP_F64()[(((ptr) + (24)) >>> 3) >>> 0]
 }),
 makeExtent3D: ptr => ({
  "width": GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0],
  "height": GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0],
  "depthOrArrayLayers": GROWABLE_HEAP_U32()[(((ptr) + (8)) >>> 2) >>> 0]
 }),
 makeOrigin3D: ptr => ({
  "x": GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0],
  "y": GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0],
  "z": GROWABLE_HEAP_U32()[(((ptr) + (8)) >>> 2) >>> 0]
 }),
 makeTexelCopyTextureInfo: ptr => ({
  "texture": WebGPU.getJsObject(GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0]),
  "mipLevel": GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0],
  "origin": WebGPU.makeOrigin3D(ptr + 8),
  "aspect": WebGPU.TextureAspect[GROWABLE_HEAP_U32()[(((ptr) + (20)) >>> 2) >>> 0]]
 }),
 makeTexelCopyBufferLayout: ptr => {
  var bytesPerRow = GROWABLE_HEAP_U32()[(((ptr) + (8)) >>> 2) >>> 0];
  var rowsPerImage = GROWABLE_HEAP_U32()[(((ptr) + (12)) >>> 2) >>> 0];
  return {
   "offset": (GROWABLE_HEAP_U32()[(((ptr + 4)) >>> 2) >>> 0] * 4294967296 + GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0]),
   "bytesPerRow": bytesPerRow === 4294967295 ? undefined : bytesPerRow,
   "rowsPerImage": rowsPerImage === 4294967295 ? undefined : rowsPerImage
  };
 },
 makeTexelCopyBufferInfo: ptr => {
  var layoutPtr = ptr + 0;
  var bufferCopyView = WebGPU.makeTexelCopyBufferLayout(layoutPtr);
  bufferCopyView["buffer"] = WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((ptr) + (16)) >>> 2) >>> 0]);
  return bufferCopyView;
 },
 optionalQuerySetIndex: index => index === 4294967295 ? undefined : index,
 makePassTimestampWrites: ptr => {
  if (ptr === 0) return undefined;
  return {
   "querySet": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0]),
   "beginningOfPassWriteIndex": WebGPU.optionalQuerySetIndex(GROWABLE_HEAP_U32()[(((ptr) + (8)) >>> 2) >>> 0]),
   "endOfPassWriteIndex": WebGPU.optionalQuerySetIndex(GROWABLE_HEAP_U32()[(((ptr) + (12)) >>> 2) >>> 0])
  };
 },
 makePipelineConstants: (constantCount, constantsPtr) => {
  if (!constantCount) return;
  var constants = {};
  for (var i = 0; i < constantCount; ++i) {
   var entryPtr = constantsPtr + 24 * i;
   var key = WebGPU.makeStringFromStringView(entryPtr + 4);
   constants[key] = GROWABLE_HEAP_F64()[(((entryPtr) + (16)) >>> 3) >>> 0];
  }
  return constants;
 },
 makePipelineLayout: layoutPtr => {
  if (!layoutPtr) return "auto";
  return WebGPU.getJsObject(layoutPtr);
 },
 makeComputeState: ptr => {
  if (!ptr) return undefined;
  var desc = {
   "module": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0]),
   "constants": WebGPU.makePipelineConstants(GROWABLE_HEAP_U32()[(((ptr) + (16)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((ptr) + (20)) >>> 2) >>> 0]),
   "entryPoint": WebGPU.makeStringFromOptionalStringView(ptr + 8)
  };
  return desc;
 },
 makeComputePipelineDesc: descriptor => {
  var desc = {
   "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
   "layout": WebGPU.makePipelineLayout(GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0]),
   "compute": WebGPU.makeComputeState(descriptor + 16)
  };
  return desc;
 },
 makeRenderPipelineDesc: descriptor => {
  function makePrimitiveState(psPtr) {
   if (!psPtr) return undefined;
   return {
    "topology": WebGPU.PrimitiveTopology[GROWABLE_HEAP_U32()[(((psPtr) + (4)) >>> 2) >>> 0]],
    "stripIndexFormat": WebGPU.IndexFormat[GROWABLE_HEAP_U32()[(((psPtr) + (8)) >>> 2) >>> 0]],
    "frontFace": WebGPU.FrontFace[GROWABLE_HEAP_U32()[(((psPtr) + (12)) >>> 2) >>> 0]],
    "cullMode": WebGPU.CullMode[GROWABLE_HEAP_U32()[(((psPtr) + (16)) >>> 2) >>> 0]],
    "unclippedDepth": !!(GROWABLE_HEAP_U32()[(((psPtr) + (20)) >>> 2) >>> 0])
   };
  }
  function makeBlendComponent(bdPtr) {
   if (!bdPtr) return undefined;
   return {
    "operation": WebGPU.BlendOperation[GROWABLE_HEAP_U32()[((bdPtr) >>> 2) >>> 0]],
    "srcFactor": WebGPU.BlendFactor[GROWABLE_HEAP_U32()[(((bdPtr) + (4)) >>> 2) >>> 0]],
    "dstFactor": WebGPU.BlendFactor[GROWABLE_HEAP_U32()[(((bdPtr) + (8)) >>> 2) >>> 0]]
   };
  }
  function makeBlendState(bsPtr) {
   if (!bsPtr) return undefined;
   return {
    "alpha": makeBlendComponent(bsPtr + 12),
    "color": makeBlendComponent(bsPtr + 0)
   };
  }
  function makeColorState(csPtr) {
   var formatInt = GROWABLE_HEAP_U32()[(((csPtr) + (4)) >>> 2) >>> 0];
   return formatInt === 0 ? undefined : {
    "format": WebGPU.TextureFormat[formatInt],
    "blend": makeBlendState(GROWABLE_HEAP_U32()[(((csPtr) + (8)) >>> 2) >>> 0]),
    "writeMask": GROWABLE_HEAP_U32()[(((csPtr) + (16)) >>> 2) >>> 0]
   };
  }
  function makeColorStates(count, csArrayPtr) {
   var states = [];
   for (var i = 0; i < count; ++i) {
    states.push(makeColorState(csArrayPtr + 24 * i));
   }
   return states;
  }
  function makeStencilStateFace(ssfPtr) {
   return {
    "compare": WebGPU.CompareFunction[GROWABLE_HEAP_U32()[((ssfPtr) >>> 2) >>> 0]],
    "failOp": WebGPU.StencilOperation[GROWABLE_HEAP_U32()[(((ssfPtr) + (4)) >>> 2) >>> 0]],
    "depthFailOp": WebGPU.StencilOperation[GROWABLE_HEAP_U32()[(((ssfPtr) + (8)) >>> 2) >>> 0]],
    "passOp": WebGPU.StencilOperation[GROWABLE_HEAP_U32()[(((ssfPtr) + (12)) >>> 2) >>> 0]]
   };
  }
  function makeDepthStencilState(dssPtr) {
   if (!dssPtr) return undefined;
   return {
    "format": WebGPU.TextureFormat[GROWABLE_HEAP_U32()[(((dssPtr) + (4)) >>> 2) >>> 0]],
    "depthWriteEnabled": !!(GROWABLE_HEAP_U32()[(((dssPtr) + (8)) >>> 2) >>> 0]),
    "depthCompare": WebGPU.CompareFunction[GROWABLE_HEAP_U32()[(((dssPtr) + (12)) >>> 2) >>> 0]],
    "stencilFront": makeStencilStateFace(dssPtr + 16),
    "stencilBack": makeStencilStateFace(dssPtr + 32),
    "stencilReadMask": GROWABLE_HEAP_U32()[(((dssPtr) + (48)) >>> 2) >>> 0],
    "stencilWriteMask": GROWABLE_HEAP_U32()[(((dssPtr) + (52)) >>> 2) >>> 0],
    "depthBias": GROWABLE_HEAP_I32()[(((dssPtr) + (56)) >>> 2) >>> 0],
    "depthBiasSlopeScale": GROWABLE_HEAP_F32()[(((dssPtr) + (60)) >>> 2) >>> 0],
    "depthBiasClamp": GROWABLE_HEAP_F32()[(((dssPtr) + (64)) >>> 2) >>> 0]
   };
  }
  function makeVertexAttribute(vaPtr) {
   return {
    "format": WebGPU.VertexFormat[GROWABLE_HEAP_U32()[(((vaPtr) + (4)) >>> 2) >>> 0]],
    "offset": (GROWABLE_HEAP_U32()[((((vaPtr + 4)) + (8)) >>> 2) >>> 0] * 4294967296 + GROWABLE_HEAP_U32()[(((vaPtr) + (8)) >>> 2) >>> 0]),
    "shaderLocation": GROWABLE_HEAP_U32()[(((vaPtr) + (16)) >>> 2) >>> 0]
   };
  }
  function makeVertexAttributes(count, vaArrayPtr) {
   var vas = [];
   for (var i = 0; i < count; ++i) {
    vas.push(makeVertexAttribute(vaArrayPtr + i * 24));
   }
   return vas;
  }
  function makeVertexBuffer(vbPtr) {
   if (!vbPtr) return undefined;
   var stepModeInt = GROWABLE_HEAP_U32()[(((vbPtr) + (4)) >>> 2) >>> 0];
   var attributeCountInt = GROWABLE_HEAP_U32()[(((vbPtr) + (16)) >>> 2) >>> 0];
   if (stepModeInt === 0 && attributeCountInt === 0) {
    return null;
   }
   return {
    "arrayStride": (GROWABLE_HEAP_U32()[((((vbPtr + 4)) + (8)) >>> 2) >>> 0] * 4294967296 + GROWABLE_HEAP_U32()[(((vbPtr) + (8)) >>> 2) >>> 0]),
    "stepMode": WebGPU.VertexStepMode[stepModeInt],
    "attributes": makeVertexAttributes(attributeCountInt, GROWABLE_HEAP_U32()[(((vbPtr) + (20)) >>> 2) >>> 0])
   };
  }
  function makeVertexBuffers(count, vbArrayPtr) {
   if (!count) return undefined;
   var vbs = [];
   for (var i = 0; i < count; ++i) {
    vbs.push(makeVertexBuffer(vbArrayPtr + i * 24));
   }
   return vbs;
  }
  function makeVertexState(viPtr) {
   if (!viPtr) return undefined;
   var desc = {
    "module": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((viPtr) + (4)) >>> 2) >>> 0]),
    "constants": WebGPU.makePipelineConstants(GROWABLE_HEAP_U32()[(((viPtr) + (16)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((viPtr) + (20)) >>> 2) >>> 0]),
    "buffers": makeVertexBuffers(GROWABLE_HEAP_U32()[(((viPtr) + (24)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((viPtr) + (28)) >>> 2) >>> 0]),
    "entryPoint": WebGPU.makeStringFromOptionalStringView(viPtr + 8)
   };
   return desc;
  }
  function makeMultisampleState(msPtr) {
   if (!msPtr) return undefined;
   return {
    "count": GROWABLE_HEAP_U32()[(((msPtr) + (4)) >>> 2) >>> 0],
    "mask": GROWABLE_HEAP_U32()[(((msPtr) + (8)) >>> 2) >>> 0],
    "alphaToCoverageEnabled": !!(GROWABLE_HEAP_U32()[(((msPtr) + (12)) >>> 2) >>> 0])
   };
  }
  function makeFragmentState(fsPtr) {
   if (!fsPtr) return undefined;
   var desc = {
    "module": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((fsPtr) + (4)) >>> 2) >>> 0]),
    "constants": WebGPU.makePipelineConstants(GROWABLE_HEAP_U32()[(((fsPtr) + (16)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((fsPtr) + (20)) >>> 2) >>> 0]),
    "targets": makeColorStates(GROWABLE_HEAP_U32()[(((fsPtr) + (24)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((fsPtr) + (28)) >>> 2) >>> 0]),
    "entryPoint": WebGPU.makeStringFromOptionalStringView(fsPtr + 8)
   };
   return desc;
  }
  var desc = {
   "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
   "layout": WebGPU.makePipelineLayout(GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0]),
   "vertex": makeVertexState(descriptor + 16),
   "primitive": makePrimitiveState(descriptor + 48),
   "depthStencil": makeDepthStencilState(GROWABLE_HEAP_U32()[(((descriptor) + (72)) >>> 2) >>> 0]),
   "multisample": makeMultisampleState(descriptor + 76),
   "fragment": makeFragmentState(GROWABLE_HEAP_U32()[(((descriptor) + (92)) >>> 2) >>> 0])
  };
  return desc;
 },
 fillLimitStruct: (limits, limitsOutPtr) => {
  function setLimitValueU32(name, limitOffset) {
   var limitValue = limits[name];
   GROWABLE_HEAP_I32()[(((limitsOutPtr) + (limitOffset)) >>> 2) >>> 0] = limitValue;
  }
  function setLimitValueU64(name, limitOffset) {
   var limitValue = limits[name];
   HEAP64[(((limitsOutPtr) + (limitOffset)) >>> 3)] = BigInt(limitValue);
  }
  setLimitValueU32("maxTextureDimension1D", 4);
  setLimitValueU32("maxTextureDimension2D", 8);
  setLimitValueU32("maxTextureDimension3D", 12);
  setLimitValueU32("maxTextureArrayLayers", 16);
  setLimitValueU32("maxBindGroups", 20);
  setLimitValueU32("maxBindGroupsPlusVertexBuffers", 24);
  setLimitValueU32("maxBindingsPerBindGroup", 28);
  setLimitValueU32("maxDynamicUniformBuffersPerPipelineLayout", 32);
  setLimitValueU32("maxDynamicStorageBuffersPerPipelineLayout", 36);
  setLimitValueU32("maxSampledTexturesPerShaderStage", 40);
  setLimitValueU32("maxSamplersPerShaderStage", 44);
  setLimitValueU32("maxStorageBuffersPerShaderStage", 48);
  setLimitValueU32("maxStorageTexturesPerShaderStage", 52);
  setLimitValueU32("maxUniformBuffersPerShaderStage", 56);
  setLimitValueU32("minUniformBufferOffsetAlignment", 80);
  setLimitValueU32("minStorageBufferOffsetAlignment", 84);
  setLimitValueU64("maxUniformBufferBindingSize", 64);
  setLimitValueU64("maxStorageBufferBindingSize", 72);
  setLimitValueU32("maxVertexBuffers", 88);
  setLimitValueU64("maxBufferSize", 96);
  setLimitValueU32("maxVertexAttributes", 104);
  setLimitValueU32("maxVertexBufferArrayStride", 108);
  setLimitValueU32("maxInterStageShaderVariables", 112);
  setLimitValueU32("maxColorAttachments", 116);
  setLimitValueU32("maxColorAttachmentBytesPerSample", 120);
  setLimitValueU32("maxComputeWorkgroupStorageSize", 124);
  setLimitValueU32("maxComputeInvocationsPerWorkgroup", 128);
  setLimitValueU32("maxComputeWorkgroupSizeX", 132);
  setLimitValueU32("maxComputeWorkgroupSizeY", 136);
  setLimitValueU32("maxComputeWorkgroupSizeZ", 140);
  setLimitValueU32("maxComputeWorkgroupsPerDimension", 144);
  if (limits.maxImmediateSize !== undefined) {
   setLimitValueU32("maxImmediateSize", 148);
  }
 },
 fillAdapterInfoStruct: (info, infoStruct) => {
  GROWABLE_HEAP_I32()[(((infoStruct) + (52)) >>> 2) >>> 0] = info.subgroupMinSize;
  GROWABLE_HEAP_I32()[(((infoStruct) + (56)) >>> 2) >>> 0] = info.subgroupMaxSize;
  var strs = info.vendor + info.architecture + info.device + info.description;
  var strPtr = stringToNewUTF8(strs);
  var vendorLen = lengthBytesUTF8(info.vendor);
  WebGPU.setStringView(infoStruct + 4, strPtr, vendorLen);
  strPtr += vendorLen;
  var architectureLen = lengthBytesUTF8(info.architecture);
  WebGPU.setStringView(infoStruct + 12, strPtr, architectureLen);
  strPtr += architectureLen;
  var deviceLen = lengthBytesUTF8(info.device);
  WebGPU.setStringView(infoStruct + 20, strPtr, deviceLen);
  strPtr += deviceLen;
  var descriptionLen = lengthBytesUTF8(info.description);
  WebGPU.setStringView(infoStruct + 28, strPtr, descriptionLen);
  strPtr += descriptionLen;
  GROWABLE_HEAP_I32()[(((infoStruct) + (36)) >>> 2) >>> 0] = 2;
  var adapterType = info.isFallbackAdapter ? 3 : 4;
  GROWABLE_HEAP_I32()[(((infoStruct) + (40)) >>> 2) >>> 0] = adapterType;
  GROWABLE_HEAP_I32()[(((infoStruct) + (44)) >>> 2) >>> 0] = 0;
  GROWABLE_HEAP_I32()[(((infoStruct) + (48)) >>> 2) >>> 0] = 0;
 },
 AddressMode: [ , "clamp-to-edge", "repeat", "mirror-repeat" ],
 BlendFactor: [ , "zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha" ],
 BlendOperation: [ , "add", "subtract", "reverse-subtract", "min", "max" ],
 BufferBindingType: [ "binding-not-used", , "uniform", "storage", "read-only-storage" ],
 BufferMapState: [ , "unmapped", "pending", "mapped" ],
 CompareFunction: [ , "never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always" ],
 CompilationInfoRequestStatus: [ , "success", "callback-cancelled" ],
 CompositeAlphaMode: [ , "opaque", "premultiplied", "unpremultiplied", "inherit" ],
 CullMode: [ , "none", "front", "back" ],
 ErrorFilter: [ , "validation", "out-of-memory", "internal" ],
 FeatureLevel: [ , "compatibility", "core" ],
 FeatureName: {
  1: "core-features-and-limits",
  2: "depth-clip-control",
  3: "depth32float-stencil8",
  4: "texture-compression-bc",
  5: "texture-compression-bc-sliced-3d",
  6: "texture-compression-etc2",
  7: "texture-compression-astc",
  8: "texture-compression-astc-sliced-3d",
  9: "timestamp-query",
  10: "indirect-first-instance",
  11: "shader-f16",
  12: "rg11b10ufloat-renderable",
  13: "bgra8unorm-storage",
  14: "float32-filterable",
  15: "float32-blendable",
  16: "clip-distances",
  17: "dual-source-blending",
  18: "subgroups",
  19: "texture-formats-tier1",
  20: "texture-formats-tier2",
  21: "primitive-index",
  327692: "chromium-experimental-unorm16-texture-formats",
  327693: "chromium-experimental-snorm16-texture-formats",
  327732: "chromium-experimental-multi-draw-indirect"
 },
 FilterMode: [ , "nearest", "linear" ],
 FrontFace: [ , "ccw", "cw" ],
 IndexFormat: [ , "uint16", "uint32" ],
 InstanceFeatureName: [ , "timed-wait-any", "shader-source-spirv", "multiple-devices-per-adapter" ],
 LoadOp: [ , "load", "clear" ],
 MipmapFilterMode: [ , "nearest", "linear" ],
 OptionalBool: [ "false", "true" ],
 PowerPreference: [ , "low-power", "high-performance" ],
 PredefinedColorSpace: [ , "srgb", "display-p3" ],
 PrimitiveTopology: [ , "point-list", "line-list", "line-strip", "triangle-list", "triangle-strip" ],
 QueryType: [ , "occlusion", "timestamp" ],
 SamplerBindingType: [ "binding-not-used", , "filtering", "non-filtering", "comparison" ],
 Status: [ , "success", "error" ],
 StencilOperation: [ , "keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap" ],
 StorageTextureAccess: [ "binding-not-used", , "write-only", "read-only", "read-write" ],
 StoreOp: [ , "store", "discard" ],
 SurfaceGetCurrentTextureStatus: [ , "success-optimal", "success-suboptimal", "timeout", "outdated", "lost", "error" ],
 TextureAspect: [ , "all", "stencil-only", "depth-only" ],
 TextureDimension: [ , "1d", "2d", "3d" ],
 TextureFormat: [ , "r8unorm", "r8snorm", "r8uint", "r8sint", "r16unorm", "r16snorm", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32float", "r32uint", "r32sint", "rg16unorm", "rg16snorm", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rgb9e5ufloat", "rg32float", "rg32uint", "rg32sint", "rgba16unorm", "rgba16snorm", "rgba16uint", "rgba16sint", "rgba16float", "rgba32float", "rgba32uint", "rgba32sint", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb" ],
 TextureSampleType: [ "binding-not-used", , "float", "unfilterable-float", "depth", "sint", "uint" ],
 TextureViewDimension: [ , "1d", "2d", "2d-array", "cube", "cube-array", "3d" ],
 ToneMappingMode: [ , "standard", "extended" ],
 VertexFormat: [ , "uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra" ],
 VertexStepMode: [ , "vertex", "instance" ],
 WGSLLanguageFeatureName: [ , "readonly_and_readwrite_storage_textures", "packed_4x8_integer_dot_product", "unrestricted_pointer_parameters", "pointer_composite_access" ]
};

function _emwgpuBufferDestroy(bufferPtr) {
 bufferPtr >>>= 0;
 var buffer = WebGPU.getJsObject(bufferPtr);
 var onUnmap = WebGPU.Internals.bufferOnUnmaps[bufferPtr];
 if (onUnmap) {
  for (var i = 0; i < onUnmap.length; ++i) {
   onUnmap[i]();
  }
  delete WebGPU.Internals.bufferOnUnmaps[bufferPtr];
 }
 buffer.destroy();
}

var _emwgpuBufferMapAsync = function(bufferPtr, futureId, mode, offset, size) {
 bufferPtr >>>= 0;
 futureId = bigintToI53Checked(futureId);
 mode = bigintToI53Checked(mode);
 offset >>>= 0;
 size >>>= 0;
 var buffer = WebGPU.getJsObject(bufferPtr);
 WebGPU.Internals.bufferOnUnmaps[bufferPtr] = [];
 if (size == 4294967295) size = undefined;
 runtimeKeepalivePush();
 WebGPU.Internals.futureInsert(futureId, buffer.mapAsync(mode, offset, size).then(() => {
  runtimeKeepalivePop();
  _emwgpuOnMapAsyncCompleted(futureId, 1, 0);
 }, ex => {
  runtimeKeepalivePop();
  var sp = stackSave();
  var messagePtr = stringToUTF8OnStack(ex.message);
  var status = ex.name === "AbortError" ? 4 : ex.name === "OperationError" ? 3 : 0;
  _emwgpuOnMapAsyncCompleted(futureId, status, messagePtr);
  delete WebGPU.Internals.bufferOnUnmaps[bufferPtr];
 }));
};

function _emwgpuBufferReadMappedRange(bufferPtr, offset, data, size) {
 bufferPtr >>>= 0;
 offset >>>= 0;
 data >>>= 0;
 size >>>= 0;
 var buffer = WebGPU.getJsObject(bufferPtr);
 var mapped;
 try {
  mapped = buffer.getMappedRange(offset, size);
 } catch (ex) {
  return 2;
 }
 GROWABLE_HEAP_U8().set(new Uint8Array(mapped), data >>> 0);
 return 1;
}

function _emwgpuBufferUnmap(bufferPtr) {
 bufferPtr >>>= 0;
 var buffer = WebGPU.getJsObject(bufferPtr);
 var onUnmap = WebGPU.Internals.bufferOnUnmaps[bufferPtr];
 if (!onUnmap) {
  return;
 }
 for (var i = 0; i < onUnmap.length; ++i) {
  onUnmap[i]();
 }
 delete WebGPU.Internals.bufferOnUnmaps[bufferPtr];
 buffer.unmap();
}

function _emwgpuDelete(ptr) {
 ptr >>>= 0;
 delete WebGPU.Internals.jsObjects[ptr >>> 0];
}

function _emwgpuDeviceCreateBuffer(devicePtr, descriptor, bufferPtr) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 bufferPtr >>>= 0;
 var mappedAtCreation = !!(GROWABLE_HEAP_U32()[(((descriptor) + (32)) >>> 2) >>> 0]);
 var desc = {
  "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
  "usage": GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0],
  "size": (GROWABLE_HEAP_U32()[((((descriptor + 4)) + (24)) >>> 2) >>> 0] * 4294967296 + GROWABLE_HEAP_U32()[(((descriptor) + (24)) >>> 2) >>> 0]),
  "mappedAtCreation": mappedAtCreation
 };
 var device = WebGPU.getJsObject(devicePtr);
 var buffer;
 try {
  buffer = device.createBuffer(desc);
 } catch (ex) {
  return false;
 }
 WebGPU.Internals.jsObjectInsert(bufferPtr, buffer);
 if (mappedAtCreation) {
  WebGPU.Internals.bufferOnUnmaps[bufferPtr] = [];
 }
 return true;
}

function _emwgpuDeviceCreateShaderModule(devicePtr, descriptor, shaderModulePtr) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 shaderModulePtr >>>= 0;
 var nextInChainPtr = GROWABLE_HEAP_U32()[((descriptor) >>> 2) >>> 0];
 var sType = GROWABLE_HEAP_U32()[(((nextInChainPtr) + (4)) >>> 2) >>> 0];
 var desc = {
  "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
  "code": ""
 };
 switch (sType) {
 case 2:
  {
   desc["code"] = WebGPU.makeStringFromStringView(nextInChainPtr + 8);
   break;
  }
 }
 var device = WebGPU.getJsObject(devicePtr);
 WebGPU.Internals.jsObjectInsert(shaderModulePtr, device.createShaderModule(desc));
}

var _emwgpuDeviceDestroy = devicePtr => {
 const device = WebGPU.getJsObject(devicePtr);
 device.onuncapturederror = null;
 device.destroy();
};

var ENV = {};

var getExecutableName = () => thisProgram || "./this.program";

var getEnvStrings = () => {
 if (!getEnvStrings.strings) {
  var lang = ((typeof navigator == "object" && navigator.languages && navigator.languages[0]) || "C").replace("-", "_") + ".UTF-8";
  var env = {
   "USER": "web_user",
   "LOGNAME": "web_user",
   "PATH": "/",
   "PWD": "/",
   "HOME": "/home/web_user",
   "LANG": lang,
   "_": getExecutableName()
  };
  for (var x in ENV) {
   if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
  }
  var strings = [];
  for (var x in env) {
   strings.push(`${x}=${env[x]}`);
  }
  getEnvStrings.strings = strings;
 }
 return getEnvStrings.strings;
};

var stringToAscii = (str, buffer) => {
 for (var i = 0; i < str.length; ++i) {
  GROWABLE_HEAP_I8()[buffer++ >>> 0] = str.charCodeAt(i);
 }
 GROWABLE_HEAP_I8()[buffer >>> 0] = 0;
};

var _environ_get = function(__environ, environ_buf) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(73, 0, 1, __environ, environ_buf);
 __environ >>>= 0;
 environ_buf >>>= 0;
 var bufSize = 0;
 getEnvStrings().forEach((string, i) => {
  var ptr = environ_buf + bufSize;
  GROWABLE_HEAP_U32()[(((__environ) + (i * 4)) >>> 2) >>> 0] = ptr;
  stringToAscii(string, ptr);
  bufSize += string.length + 1;
 });
 return 0;
};

var _environ_sizes_get = function(penviron_count, penviron_buf_size) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(74, 0, 1, penviron_count, penviron_buf_size);
 penviron_count >>>= 0;
 penviron_buf_size >>>= 0;
 var strings = getEnvStrings();
 GROWABLE_HEAP_U32()[((penviron_count) >>> 2) >>> 0] = strings.length;
 var bufSize = 0;
 strings.forEach(string => bufSize += string.length + 1);
 GROWABLE_HEAP_U32()[((penviron_buf_size) >>> 2) >>> 0] = bufSize;
 return 0;
};

var Sockets = {
 BUFFER_SIZE: 10240,
 MAX_BUFFER_SIZE: 10485760,
 nextFd: 1,
 fds: {},
 nextport: 1,
 maxport: 65535,
 peer: null,
 connections: {},
 portmap: {},
 localAddr: 4261412874,
 addrPool: [ 33554442, 50331658, 67108874, 83886090, 100663306, 117440522, 134217738, 150994954, 167772170, 184549386, 201326602, 218103818, 234881034 ]
};

var inetPton4 = str => {
 var b = str.split(".");
 for (var i = 0; i < 4; i++) {
  var tmp = Number(b[i]);
  if (isNaN(tmp)) return null;
  b[i] = tmp;
 }
 return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
};

var inetPton6 = str => {
 var words;
 var w, offset, z, i;
 /* http://home.deds.nl/~aeron/regex/ */ var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
 var parts = [];
 if (!valid6regx.test(str)) {
  return null;
 }
 if (str === "::") {
  return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
 }
 if (str.startsWith("::")) {
  str = str.replace("::", "Z:");
 } else {
  str = str.replace("::", ":Z:");
 }
 if (str.indexOf(".") > 0) {
  str = str.replace(new RegExp("[.]", "g"), ":");
  words = str.split(":");
  words[words.length - 4] = jstoi_q(words[words.length - 4]) + jstoi_q(words[words.length - 3]) * 256;
  words[words.length - 3] = jstoi_q(words[words.length - 2]) + jstoi_q(words[words.length - 1]) * 256;
  words = words.slice(0, words.length - 2);
 } else {
  words = str.split(":");
 }
 offset = 0;
 z = 0;
 for (w = 0; w < words.length; w++) {
  if (typeof words[w] == "string") {
   if (words[w] === "Z") {
    for (z = 0; z < (8 - words.length + 1); z++) {
     parts[w + z] = 0;
    }
    offset = z - 1;
   } else {
    parts[w + offset] = _htons(parseInt(words[w], 16));
   }
  } else {
   parts[w + offset] = words[w];
  }
 }
 return [ (parts[1] << 16) | parts[0], (parts[3] << 16) | parts[2], (parts[5] << 16) | parts[4], (parts[7] << 16) | parts[6] ];
};

var DNS = {
 address_map: {
  id: 1,
  addrs: {},
  names: {}
 },
 lookup_name(name) {
  var res = inetPton4(name);
  if (res !== null) {
   return name;
  }
  res = inetPton6(name);
  if (res !== null) {
   return name;
  }
  var addr;
  if (DNS.address_map.addrs[name]) {
   addr = DNS.address_map.addrs[name];
  } else {
   var id = DNS.address_map.id++;
   assert(id < 65535, "exceeded max address mappings of 65535");
   addr = "172.29." + (id & 255) + "." + (id & 65280);
   DNS.address_map.names[addr] = name;
   DNS.address_map.addrs[name] = addr;
  }
  return addr;
 },
 lookup_addr(addr) {
  if (DNS.address_map.names[addr]) {
   return DNS.address_map.names[addr];
  }
  return null;
 }
};

var inetNtop4 = addr => (addr & 255) + "." + ((addr >> 8) & 255) + "." + ((addr >> 16) & 255) + "." + ((addr >> 24) & 255);

var inetNtop6 = ints => {
 var str = "";
 var word = 0;
 var longest = 0;
 var lastzero = 0;
 var zstart = 0;
 var len = 0;
 var i = 0;
 var parts = [ ints[0] & 65535, (ints[0] >> 16), ints[1] & 65535, (ints[1] >> 16), ints[2] & 65535, (ints[2] >> 16), ints[3] & 65535, (ints[3] >> 16) ];
 var hasipv4 = true;
 var v4part = "";
 for (i = 0; i < 5; i++) {
  if (parts[i] !== 0) {
   hasipv4 = false;
   break;
  }
 }
 if (hasipv4) {
  v4part = inetNtop4(parts[6] | (parts[7] << 16));
  if (parts[5] === -1) {
   str = "::ffff:";
   str += v4part;
   return str;
  }
  if (parts[5] === 0) {
   str = "::";
   if (v4part === "0.0.0.0") v4part = "";
   if (v4part === "0.0.0.1") v4part = "1";
   str += v4part;
   return str;
  }
 }
 for (word = 0; word < 8; word++) {
  if (parts[word] === 0) {
   if (word - lastzero > 1) {
    len = 0;
   }
   lastzero = word;
   len++;
  }
  if (len > longest) {
   longest = len;
   zstart = word - longest + 1;
  }
 }
 for (word = 0; word < 8; word++) {
  if (longest > 1) {
   if (parts[word] === 0 && word >= zstart && word < (zstart + longest)) {
    if (word === zstart) {
     str += ":";
     if (zstart === 0) str += ":";
    }
    continue;
   }
  }
  str += Number(_ntohs(parts[word] & 65535)).toString(16);
  str += word < 7 ? ":" : "";
 }
 return str;
};

/** @param {number=} addrlen */ var writeSockaddr = (sa, family, addr, port, addrlen) => {
 switch (family) {
 case 2:
  addr = inetPton4(addr);
  zeroMemory(sa, 16);
  if (addrlen) {
   GROWABLE_HEAP_I32()[((addrlen) >>> 2) >>> 0] = 16;
  }
  GROWABLE_HEAP_I16()[((sa) >>> 1) >>> 0] = family;
  GROWABLE_HEAP_I32()[(((sa) + (4)) >>> 2) >>> 0] = addr;
  GROWABLE_HEAP_I16()[(((sa) + (2)) >>> 1) >>> 0] = _htons(port);
  break;

 case 10:
  addr = inetPton6(addr);
  zeroMemory(sa, 28);
  if (addrlen) {
   GROWABLE_HEAP_I32()[((addrlen) >>> 2) >>> 0] = 28;
  }
  GROWABLE_HEAP_I32()[((sa) >>> 2) >>> 0] = family;
  GROWABLE_HEAP_I32()[(((sa) + (8)) >>> 2) >>> 0] = addr[0];
  GROWABLE_HEAP_I32()[(((sa) + (12)) >>> 2) >>> 0] = addr[1];
  GROWABLE_HEAP_I32()[(((sa) + (16)) >>> 2) >>> 0] = addr[2];
  GROWABLE_HEAP_I32()[(((sa) + (20)) >>> 2) >>> 0] = addr[3];
  GROWABLE_HEAP_I16()[(((sa) + (2)) >>> 1) >>> 0] = _htons(port);
  break;

 default:
  return 5;
 }
 return 0;
};

function _getaddrinfo(node, service, hint, out) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(75, 0, 1, node, service, hint, out);
 node >>>= 0;
 service >>>= 0;
 hint >>>= 0;
 out >>>= 0;
 var addrs = [];
 var canon = null;
 var addr = 0;
 var port = 0;
 var flags = 0;
 var family = 0;
 var type = 0;
 var proto = 0;
 var ai, last;
 function allocaddrinfo(family, type, proto, canon, addr, port) {
  var sa, salen, ai;
  var errno;
  salen = family === 10 ? 28 : 16;
  addr = family === 10 ? inetNtop6(addr) : inetNtop4(addr);
  sa = _malloc(salen);
  errno = writeSockaddr(sa, family, addr, port);
  assert(!errno);
  ai = _malloc(32);
  GROWABLE_HEAP_I32()[(((ai) + (4)) >>> 2) >>> 0] = family;
  GROWABLE_HEAP_I32()[(((ai) + (8)) >>> 2) >>> 0] = type;
  GROWABLE_HEAP_I32()[(((ai) + (12)) >>> 2) >>> 0] = proto;
  GROWABLE_HEAP_U32()[(((ai) + (24)) >>> 2) >>> 0] = canon;
  GROWABLE_HEAP_U32()[(((ai) + (20)) >>> 2) >>> 0] = sa;
  if (family === 10) {
   GROWABLE_HEAP_I32()[(((ai) + (16)) >>> 2) >>> 0] = 28;
  } else {
   GROWABLE_HEAP_I32()[(((ai) + (16)) >>> 2) >>> 0] = 16;
  }
  GROWABLE_HEAP_I32()[(((ai) + (28)) >>> 2) >>> 0] = 0;
  return ai;
 }
 if (hint) {
  flags = GROWABLE_HEAP_I32()[((hint) >>> 2) >>> 0];
  family = GROWABLE_HEAP_I32()[(((hint) + (4)) >>> 2) >>> 0];
  type = GROWABLE_HEAP_I32()[(((hint) + (8)) >>> 2) >>> 0];
  proto = GROWABLE_HEAP_I32()[(((hint) + (12)) >>> 2) >>> 0];
 }
 if (type && !proto) {
  proto = type === 2 ? 17 : 6;
 }
 if (!type && proto) {
  type = proto === 17 ? 2 : 1;
 }
 if (proto === 0) {
  proto = 6;
 }
 if (type === 0) {
  type = 1;
 }
 if (!node && !service) {
  return -2;
 }
 if (flags & ~(1 | 2 | 4 | 1024 | 8 | 16 | 32)) {
  return -1;
 }
 if (hint !== 0 && (GROWABLE_HEAP_I32()[((hint) >>> 2) >>> 0] & 2) && !node) {
  return -1;
 }
 if (flags & 32) {
  return -2;
 }
 if (type !== 0 && type !== 1 && type !== 2) {
  return -7;
 }
 if (family !== 0 && family !== 2 && family !== 10) {
  return -6;
 }
 if (service) {
  service = UTF8ToString(service);
  port = parseInt(service, 10);
  if (isNaN(port)) {
   if (flags & 1024) {
    return -2;
   }
   return -8;
  }
 }
 if (!node) {
  if (family === 0) {
   family = 2;
  }
  if ((flags & 1) === 0) {
   if (family === 2) {
    addr = _htonl(2130706433);
   } else {
    addr = [ 0, 0, 0, 1 ];
   }
  }
  ai = allocaddrinfo(family, type, proto, null, addr, port);
  GROWABLE_HEAP_U32()[((out) >>> 2) >>> 0] = ai;
  return 0;
 }
 node = UTF8ToString(node);
 addr = inetPton4(node);
 if (addr !== null) {
  if (family === 0 || family === 2) {
   family = 2;
  } else if (family === 10 && (flags & 8)) {
   addr = [ 0, 0, _htonl(65535), addr ];
   family = 10;
  } else {
   return -2;
  }
 } else {
  addr = inetPton6(node);
  if (addr !== null) {
   if (family === 0 || family === 10) {
    family = 10;
   } else {
    return -2;
   }
  }
 }
 if (addr != null) {
  ai = allocaddrinfo(family, type, proto, node, addr, port);
  GROWABLE_HEAP_U32()[((out) >>> 2) >>> 0] = ai;
  return 0;
 }
 if (flags & 4) {
  return -2;
 }
 node = DNS.lookup_name(node);
 addr = inetPton4(node);
 if (family === 0) {
  family = 2;
 } else if (family === 10) {
  addr = [ 0, 0, _htonl(65535), addr ];
 }
 ai = allocaddrinfo(family, type, proto, null, addr, port);
 GROWABLE_HEAP_U32()[((out) >>> 2) >>> 0] = ai;
 return 0;
}

var initRandomFill = () => {
 if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") {
  return view => (view.set(crypto.getRandomValues(new Uint8Array(view.byteLength))), 
  view);
 } else abort("initRandomDevice");
};

var randomFill = view => (randomFill = initRandomFill())(view);

function _getentropy(buffer, size) {
 buffer >>>= 0;
 size >>>= 0;
 randomFill(GROWABLE_HEAP_U8().subarray(buffer >>> 0, buffer + size >>> 0));
 return 0;
}

var readSockaddr = (sa, salen) => {
 var family = GROWABLE_HEAP_I16()[((sa) >>> 1) >>> 0];
 var port = _ntohs(GROWABLE_HEAP_U16()[(((sa) + (2)) >>> 1) >>> 0]);
 var addr;
 switch (family) {
 case 2:
  if (salen !== 16) {
   return {
    errno: 28
   };
  }
  addr = GROWABLE_HEAP_I32()[(((sa) + (4)) >>> 2) >>> 0];
  addr = inetNtop4(addr);
  break;

 case 10:
  if (salen !== 28) {
   return {
    errno: 28
   };
  }
  addr = [ GROWABLE_HEAP_I32()[(((sa) + (8)) >>> 2) >>> 0], GROWABLE_HEAP_I32()[(((sa) + (12)) >>> 2) >>> 0], GROWABLE_HEAP_I32()[(((sa) + (16)) >>> 2) >>> 0], GROWABLE_HEAP_I32()[(((sa) + (20)) >>> 2) >>> 0] ];
  addr = inetNtop6(addr);
  break;

 default:
  return {
   errno: 5
  };
 }
 return {
  family: family,
  addr: addr,
  port: port
 };
};

function _getnameinfo(sa, salen, node, nodelen, serv, servlen, flags) {
 sa >>>= 0;
 node >>>= 0;
 serv >>>= 0;
 var info = readSockaddr(sa, salen);
 if (info.errno) {
  return -6;
 }
 var port = info.port;
 var addr = info.addr;
 var overflowed = false;
 if (node && nodelen) {
  var lookup;
  if ((flags & 1) || !(lookup = DNS.lookup_addr(addr))) {
   if (flags & 8) {
    return -2;
   }
  } else {
   addr = lookup;
  }
  var numBytesWrittenExclNull = stringToUTF8(addr, node, nodelen);
  if (numBytesWrittenExclNull + 1 >= nodelen) {
   overflowed = true;
  }
 }
 if (serv && servlen) {
  port = "" + port;
  var numBytesWrittenExclNull = stringToUTF8(port, serv, servlen);
  if (numBytesWrittenExclNull + 1 >= servlen) {
   overflowed = true;
  }
 }
 if (overflowed) {
  return -12;
 }
 return 0;
}

var WINK = {
 waiting: [],
 lost: false,
 errors: 0,
 pending: null,
 running: false,
 scheduled: false,
 inRunner: false,
 runnerTop: 0,
 outerSP: 0,
 promisingRun: null,
 schedule: function() {
  if (WINK.running || WINK.scheduled) return;
  WINK.scheduled = true;
  queueMicrotask(WINK.drain);
 },
 drain: async function() {
  WINK.scheduled = false;
  WINK.running = true;
  try {
   while (WINK.pending && WINK.pending.size) {
    var queues = Array.from(WINK.pending);
    WINK.pending.clear();
    for (var i = 0; i < queues.length; ++i) await WINK.runQueue(queues[i]);
   }
  } catch (e) {
   err("wink: main-thread runner failed: " + (e && e.stack || e));
  } finally {
   WINK.running = false;
  }
 },
 runQueue: async function(queue) {
  if (!WINK.promisingRun) {
   var size = Module["winkRunnerStackSize"] || 16 * 1024 * 1024;
   var base = _malloc(size);
   if (!base) throw new Error("no memory for the runner stack");
   WINK.runnerTop = (base + size) & ~15;
   WINK.promisingRun = WebAssembly.promising(wasmExports["wink_main_run_queue"]);
  }
  WINK.outerSP = stackSave();
  stackRestore(WINK.runnerTop);
  WINK.inRunner = true;
  try {
   await WINK.promisingRun(queue);
  } finally {
   WINK.inRunner = false;
   stackRestore(WINK.outerSP);
  }
 },
 suspend: function(promise) {
  if (!WINK.inRunner) return promise;
  var mine = stackSave();
  stackRestore(WINK.outerSP);
  return promise.then(function(value) {
   WINK.outerSP = stackSave();
   stackRestore(mine);
   return value;
  });
 },
 wakeAll: function() {
  var waiting = WINK.waiting;
  if (!waiting.length) return;
  WINK.waiting = [];
  for (var i = 0; i < waiting.length; ++i) waiting[i]();
 },
 features: [ "texture-compression-bc", "texture-compression-bc-sliced-3d", "texture-compression-etc2", "texture-compression-astc", "texture-compression-astc-sliced-3d", "depth32float-stencil8", "rg11b10ufloat-renderable", "depth-clip-control", "float32-filterable", "float32-blendable", "clip-distances", "dual-source-blending", "timestamp-query", "indirect-first-instance", "texture-formats-tier1", "texture-formats-tier2" ],
 limitsUp: {
  maxUniformBuffersPerShaderStage: 16,
  maxInterStageShaderVariables: 32,
  maxVertexAttributes: 32,
  maxStorageBuffersPerShaderStage: 24,
  maxStorageBuffersInVertexStage: 24,
  maxStorageBuffersInFragmentStage: 24,
  maxStorageTexturesPerShaderStage: 8,
  maxStorageTexturesInVertexStage: 8,
  maxStorageTexturesInFragmentStage: 8,
  maxDynamicUniformBuffersPerPipelineLayout: 32,
  maxDynamicStorageBuffersPerPipelineLayout: 16,
  maxSampledTexturesPerShaderStage: 56,
  maxSamplersPerShaderStage: 32,
  maxColorAttachmentBytesPerSample: 128,
  maxComputeInvocationsPerWorkgroup: 1024,
  maxComputeWorkgroupSizeX: 1024,
  maxComputeWorkgroupSizeY: 1024,
  maxComputeWorkgroupSizeZ: 64,
  maxComputeWorkgroupStorageSize: 65536,
  maxTextureDimension1D: 16384,
  maxTextureDimension2D: 16384,
  maxTextureDimension3D: 2048,
  maxTextureArrayLayers: 2048
 },
 limitsDown: {
  minUniformBufferOffsetAlignment: 32,
  minStorageBufferOffsetAlignment: 32
 },
 descriptor: function(adapter) {
  var requiredFeatures = WINK.features.filter(function(f) {
   return adapter["features"]["has"](f);
  });
  var requiredLimits = {};
  var have = adapter["limits"];
  var short = [];
  for (var up in WINK.limitsUp) {
   if (typeof have[up] != "number") continue;
   requiredLimits[up] = Math.min(have[up], WINK.limitsUp[up]);
   if (have[up] < WINK.limitsUp[up]) short.push(up + " " + have[up]);
  }
  for (var down in WINK.limitsDown) {
   if (typeof have[down] != "number") continue;
   requiredLimits[down] = Math.max(have[down], WINK.limitsDown[down]);
  }
  if (short.length) err("wink: adapter limits below what the driver can use: " + short.join(", "));
  return {
   "requiredFeatures": requiredFeatures,
   "requiredLimits": requiredLimits
  };
 },
 adopt: function(device) {
  device["lost"]["then"](function(info) {
   WINK.lost = true;
   _wink_set_device_lost();
   err("wink: WebGPU device lost: " + info["reason"] + ": " + info["message"]);
   WINK.wakeAll();
  });
  device["addEventListener"]("uncapturederror", function(e) {
   if (WINK.errors++ < 32) err("wink: WebGPU error: " + e["error"]["message"]);
  });
  return WebGPU.importJsDevice(device);
 }
};

function _gex_wgpu_jspi_signal() {
 WINK.wakeAll();
}

function _gex_wgpu_jspi_wait() {
 if (WINK.lost) return;
 return WINK.suspend(new Promise(function(resolve) {
  WINK.waiting.push(resolve);
 }));
}

var DOTNET = {
 setup: function setup(emscriptenBuildOptions) {
  const modulePThread = PThread;
  const dotnet_replacements = {
   fetch: globalThis.fetch,
   ENVIRONMENT_IS_WORKER: ENVIRONMENT_IS_WORKER,
   require: require,
   modulePThread: modulePThread,
   scriptDirectory: scriptDirectory
  };
  ENVIRONMENT_IS_WORKER = dotnet_replacements.ENVIRONMENT_IS_WORKER;
  Module.__dotnet_runtime.initializeReplacements(dotnet_replacements);
  noExitRuntime = dotnet_replacements.noExitRuntime;
  fetch = dotnet_replacements.fetch;
  require = dotnet_replacements.require;
  _scriptDir = __dirname = scriptDirectory = dotnet_replacements.scriptDirectory;
  Module.__dotnet_runtime.passEmscriptenInternals({
   isPThread: ENVIRONMENT_IS_PTHREAD,
   quit_: quit_,
   ExitStatus: ExitStatus,
   updateMemoryViews: updateMemoryViews,
   getMemory: () => wasmMemory,
   getWasmIndirectFunctionTable: () => wasmTable
  }, emscriptenBuildOptions);
  if (ENVIRONMENT_IS_PTHREAD) {
   Module.config = {};
   Module.__dotnet_runtime.configureWorkerStartup(Module);
  } else {
   Module.__dotnet_runtime.configureEmscriptenStartup(Module);
  }
 }
};

function _mono_interp_flush_jitcall_queue() {
 return {
  runtime_idx: 14
 };
}

function _mono_interp_invoke_wasm_jit_call_trampoline() {
 return {
  runtime_idx: 13
 };
}

function _mono_interp_jit_wasm_entry_trampoline() {
 return {
  runtime_idx: 9
 };
}

function _mono_interp_jit_wasm_jit_call_trampoline() {
 return {
  runtime_idx: 12
 };
}

function _mono_interp_record_interp_entry() {
 return {
  runtime_idx: 8
 };
}

function _mono_interp_tier_prepare_jiterpreter() {
 return {
  runtime_idx: 7
 };
}

function _mono_jiterp_wasm_jit_patch_interp_entry() {
 return {
  runtime_idx: 10
 };
}

function _mono_jiterp_wasm_jit_unpatch_interp_entry() {
 return {
  runtime_idx: 11
 };
}

function _mono_wasm_browser_entropy() {
 return {
  runtime_idx: 20
 };
}

function _mono_wasm_cancel_promise() {
 return {
  runtime_idx: 28
 };
}

function _mono_wasm_console_clear() {
 return {
  runtime_idx: 22
 };
}

function _mono_wasm_dump_threads() {
 return {
  runtime_idx: 42
 };
}

function _mono_wasm_free_method_data() {
 return {
  runtime_idx: 15
 };
}

function _mono_wasm_get_locale_info() {
 return {
  runtime_idx: 29
 };
}

function _mono_wasm_install_js_worker_interop() {
 return {
  runtime_idx: 43
 };
}

function _mono_wasm_invoke_js_function() {
 return {
  runtime_idx: 25
 };
}

function _mono_wasm_invoke_jsimport_MT() {
 return {
  runtime_idx: 45
 };
}

function _mono_wasm_process_current_pid() {
 return {
  runtime_idx: 21
 };
}

function _mono_wasm_pthread_on_pthread_attached() {
 return {
  runtime_idx: 36
 };
}

function _mono_wasm_pthread_on_pthread_registered() {
 return {
  runtime_idx: 35
 };
}

function _mono_wasm_pthread_on_pthread_unregistered() {
 return {
  runtime_idx: 37
 };
}

function _mono_wasm_pthread_set_name() {
 return {
  runtime_idx: 38
 };
}

function _mono_wasm_release_cs_owned_object() {
 return {
  runtime_idx: 23
 };
}

function _mono_wasm_resolve_or_reject_promise() {
 return {
  runtime_idx: 27
 };
}

function _mono_wasm_schedule_synchronization_context() {
 return {
  runtime_idx: 41
 };
}

function _mono_wasm_set_entrypoint_breakpoint() {
 return {
  runtime_idx: 19
 };
}

function _mono_wasm_start_deputy_thread_async() {
 return {
  runtime_idx: 39
 };
}

function _mono_wasm_start_io_thread_async() {
 return {
  runtime_idx: 40
 };
}

function _mono_wasm_trace_logger() {
 return {
  runtime_idx: 18
 };
}

function _mono_wasm_uninstall_js_worker_interop() {
 return {
  runtime_idx: 44
 };
}

function _mono_wasm_warn_about_blocking_wait() {
 return {
  runtime_idx: 46
 };
}

var arraySum = (array, index) => {
 var sum = 0;
 for (var i = 0; i <= index; sum += array[i++]) {}
 return sum;
};

var MONTH_DAYS_LEAP = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var MONTH_DAYS_REGULAR = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

var addDays = (date, days) => {
 var newDate = new Date(date.getTime());
 while (days > 0) {
  var leap = isLeapYear(newDate.getFullYear());
  var currentMonth = newDate.getMonth();
  var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
  if (days > daysInCurrentMonth - newDate.getDate()) {
   days -= (daysInCurrentMonth - newDate.getDate() + 1);
   newDate.setDate(1);
   if (currentMonth < 11) {
    newDate.setMonth(currentMonth + 1);
   } else {
    newDate.setMonth(0);
    newDate.setFullYear(newDate.getFullYear() + 1);
   }
  } else {
   newDate.setDate(newDate.getDate() + days);
   return newDate;
  }
 }
 return newDate;
};

var writeArrayToMemory = (array, buffer) => {
 GROWABLE_HEAP_I8().set(array, buffer >>> 0);
};

function _strftime(s, maxsize, format, tm) {
 s >>>= 0;
 maxsize >>>= 0;
 format >>>= 0;
 tm >>>= 0;
 var tm_zone = GROWABLE_HEAP_U32()[(((tm) + (40)) >>> 2) >>> 0];
 var date = {
  tm_sec: GROWABLE_HEAP_I32()[((tm) >>> 2) >>> 0],
  tm_min: GROWABLE_HEAP_I32()[(((tm) + (4)) >>> 2) >>> 0],
  tm_hour: GROWABLE_HEAP_I32()[(((tm) + (8)) >>> 2) >>> 0],
  tm_mday: GROWABLE_HEAP_I32()[(((tm) + (12)) >>> 2) >>> 0],
  tm_mon: GROWABLE_HEAP_I32()[(((tm) + (16)) >>> 2) >>> 0],
  tm_year: GROWABLE_HEAP_I32()[(((tm) + (20)) >>> 2) >>> 0],
  tm_wday: GROWABLE_HEAP_I32()[(((tm) + (24)) >>> 2) >>> 0],
  tm_yday: GROWABLE_HEAP_I32()[(((tm) + (28)) >>> 2) >>> 0],
  tm_isdst: GROWABLE_HEAP_I32()[(((tm) + (32)) >>> 2) >>> 0],
  tm_gmtoff: GROWABLE_HEAP_I32()[(((tm) + (36)) >>> 2) >>> 0],
  tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
 };
 var pattern = UTF8ToString(format);
 var EXPANSION_RULES_1 = {
  "%c": "%a %b %d %H:%M:%S %Y",
  "%D": "%m/%d/%y",
  "%F": "%Y-%m-%d",
  "%h": "%b",
  "%r": "%I:%M:%S %p",
  "%R": "%H:%M",
  "%T": "%H:%M:%S",
  "%x": "%m/%d/%y",
  "%X": "%H:%M:%S",
  "%Ec": "%c",
  "%EC": "%C",
  "%Ex": "%m/%d/%y",
  "%EX": "%H:%M:%S",
  "%Ey": "%y",
  "%EY": "%Y",
  "%Od": "%d",
  "%Oe": "%e",
  "%OH": "%H",
  "%OI": "%I",
  "%Om": "%m",
  "%OM": "%M",
  "%OS": "%S",
  "%Ou": "%u",
  "%OU": "%U",
  "%OV": "%V",
  "%Ow": "%w",
  "%OW": "%W",
  "%Oy": "%y"
 };
 for (var rule in EXPANSION_RULES_1) {
  pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
 }
 var WEEKDAYS = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
 var MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
 function leadingSomething(value, digits, character) {
  var str = typeof value == "number" ? value.toString() : (value || "");
  while (str.length < digits) {
   str = character[0] + str;
  }
  return str;
 }
 function leadingNulls(value, digits) {
  return leadingSomething(value, digits, "0");
 }
 function compareByDay(date1, date2) {
  function sgn(value) {
   return value < 0 ? -1 : (value > 0 ? 1 : 0);
  }
  var compare;
  if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
   if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
    compare = sgn(date1.getDate() - date2.getDate());
   }
  }
  return compare;
 }
 function getFirstWeekStartDate(janFourth) {
  switch (janFourth.getDay()) {
  case 0:
   return new Date(janFourth.getFullYear() - 1, 11, 29);

  case 1:
   return janFourth;

  case 2:
   return new Date(janFourth.getFullYear(), 0, 3);

  case 3:
   return new Date(janFourth.getFullYear(), 0, 2);

  case 4:
   return new Date(janFourth.getFullYear(), 0, 1);

  case 5:
   return new Date(janFourth.getFullYear() - 1, 11, 31);

  case 6:
   return new Date(janFourth.getFullYear() - 1, 11, 30);
  }
 }
 function getWeekBasedYear(date) {
  var thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
  var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
  var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
  var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
  var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
   if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
    return thisDate.getFullYear() + 1;
   }
   return thisDate.getFullYear();
  }
  return thisDate.getFullYear() - 1;
 }
 var EXPANSION_RULES_2 = {
  "%a": date => WEEKDAYS[date.tm_wday].substring(0, 3),
  "%A": date => WEEKDAYS[date.tm_wday],
  "%b": date => MONTHS[date.tm_mon].substring(0, 3),
  "%B": date => MONTHS[date.tm_mon],
  "%C": date => {
   var year = date.tm_year + 1900;
   return leadingNulls((year / 100) | 0, 2);
  },
  "%d": date => leadingNulls(date.tm_mday, 2),
  "%e": date => leadingSomething(date.tm_mday, 2, " "),
  "%g": date => getWeekBasedYear(date).toString().substring(2),
  "%G": getWeekBasedYear,
  "%H": date => leadingNulls(date.tm_hour, 2),
  "%I": date => {
   var twelveHour = date.tm_hour;
   if (twelveHour == 0) twelveHour = 12; else if (twelveHour > 12) twelveHour -= 12;
   return leadingNulls(twelveHour, 2);
  },
  "%j": date => leadingNulls(date.tm_mday + arraySum(isLeapYear(date.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon - 1), 3),
  "%m": date => leadingNulls(date.tm_mon + 1, 2),
  "%M": date => leadingNulls(date.tm_min, 2),
  "%n": () => "\n",
  "%p": date => {
   if (date.tm_hour >= 0 && date.tm_hour < 12) {
    return "AM";
   }
   return "PM";
  },
  "%S": date => leadingNulls(date.tm_sec, 2),
  "%t": () => "\t",
  "%u": date => date.tm_wday || 7,
  "%U": date => {
   var days = date.tm_yday + 7 - date.tm_wday;
   return leadingNulls(Math.floor(days / 7), 2);
  },
  "%V": date => {
   var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7) / 7);
   if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
    val++;
   }
   if (!val) {
    val = 52;
    var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
    if (dec31 == 4 || (dec31 == 5 && isLeapYear(date.tm_year % 400 - 1))) {
     val++;
    }
   } else if (val == 53) {
    var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
    if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1;
   }
   return leadingNulls(val, 2);
  },
  "%w": date => date.tm_wday,
  "%W": date => {
   var days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);
   return leadingNulls(Math.floor(days / 7), 2);
  },
  "%y": date => (date.tm_year + 1900).toString().substring(2),
  "%Y": date => date.tm_year + 1900,
  "%z": date => {
   var off = date.tm_gmtoff;
   var ahead = off >= 0;
   off = Math.abs(off) / 60;
   off = (off / 60) * 100 + (off % 60);
   return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
  },
  "%Z": date => date.tm_zone,
  "%%": () => "%"
 };
 pattern = pattern.replace(/%%/g, "\0\0");
 for (var rule in EXPANSION_RULES_2) {
  if (pattern.includes(rule)) {
   pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
  }
 }
 pattern = pattern.replace(/\0\0/g, "%");
 var bytes = intArrayFromString(pattern, false);
 if (bytes.length > maxsize) {
  return 0;
 }
 writeArrayToMemory(bytes, s);
 return bytes.length - 1;
}

function _strftime_l(s, maxsize, format, tm, loc) {
 s >>>= 0;
 maxsize >>>= 0;
 format >>>= 0;
 tm >>>= 0;
 loc >>>= 0;
 return _strftime(s, maxsize, format, tm);
}

function _wgpuCommandEncoderBeginComputePass(encoderPtr, descriptor) {
 encoderPtr >>>= 0;
 descriptor >>>= 0;
 var desc;
 if (descriptor) {
  desc = {
   "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
   "timestampWrites": WebGPU.makePassTimestampWrites(GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0])
  };
 }
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var ptr = _emwgpuCreateComputePassEncoder(0);
 WebGPU.Internals.jsObjectInsert(ptr, commandEncoder.beginComputePass(desc));
 return ptr;
}

function _wgpuCommandEncoderBeginRenderPass(encoderPtr, descriptor) {
 encoderPtr >>>= 0;
 descriptor >>>= 0;
 function makeColorAttachment(caPtr) {
  var viewPtr = GROWABLE_HEAP_U32()[(((caPtr) + (4)) >>> 2) >>> 0];
  if (viewPtr === 0) {
   return undefined;
  }
  var depthSlice = GROWABLE_HEAP_I32()[(((caPtr) + (8)) >>> 2) >>> 0];
  if (depthSlice == -1) depthSlice = undefined;
  var loadOpInt = GROWABLE_HEAP_U32()[(((caPtr) + (16)) >>> 2) >>> 0];
  var storeOpInt = GROWABLE_HEAP_U32()[(((caPtr) + (20)) >>> 2) >>> 0];
  var clearValue = WebGPU.makeColor(caPtr + 24);
  return {
   "view": WebGPU.getJsObject(viewPtr),
   "depthSlice": depthSlice,
   "resolveTarget": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((caPtr) + (12)) >>> 2) >>> 0]),
   "clearValue": clearValue,
   "loadOp": WebGPU.LoadOp[loadOpInt],
   "storeOp": WebGPU.StoreOp[storeOpInt]
  };
 }
 function makeColorAttachments(count, caPtr) {
  var attachments = [];
  for (var i = 0; i < count; ++i) {
   attachments.push(makeColorAttachment(caPtr + 56 * i));
  }
  return attachments;
 }
 function makeDepthStencilAttachment(dsaPtr) {
  if (dsaPtr === 0) return undefined;
  return {
   "view": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((dsaPtr) + (4)) >>> 2) >>> 0]),
   "depthClearValue": GROWABLE_HEAP_F32()[(((dsaPtr) + (16)) >>> 2) >>> 0],
   "depthLoadOp": WebGPU.LoadOp[GROWABLE_HEAP_U32()[(((dsaPtr) + (8)) >>> 2) >>> 0]],
   "depthStoreOp": WebGPU.StoreOp[GROWABLE_HEAP_U32()[(((dsaPtr) + (12)) >>> 2) >>> 0]],
   "depthReadOnly": !!(GROWABLE_HEAP_U32()[(((dsaPtr) + (20)) >>> 2) >>> 0]),
   "stencilClearValue": GROWABLE_HEAP_U32()[(((dsaPtr) + (32)) >>> 2) >>> 0],
   "stencilLoadOp": WebGPU.LoadOp[GROWABLE_HEAP_U32()[(((dsaPtr) + (24)) >>> 2) >>> 0]],
   "stencilStoreOp": WebGPU.StoreOp[GROWABLE_HEAP_U32()[(((dsaPtr) + (28)) >>> 2) >>> 0]],
   "stencilReadOnly": !!(GROWABLE_HEAP_U32()[(((dsaPtr) + (36)) >>> 2) >>> 0])
  };
 }
 function makeRenderPassDescriptor(descriptor) {
  var nextInChainPtr = GROWABLE_HEAP_U32()[((descriptor) >>> 2) >>> 0];
  var maxDrawCount = undefined;
  if (nextInChainPtr !== 0) {
   var sType = GROWABLE_HEAP_U32()[(((nextInChainPtr) + (4)) >>> 2) >>> 0];
   var renderPassMaxDrawCount = nextInChainPtr;
   maxDrawCount = (GROWABLE_HEAP_U32()[((((renderPassMaxDrawCount + 4)) + (8)) >>> 2) >>> 0] * 4294967296 + GROWABLE_HEAP_U32()[(((renderPassMaxDrawCount) + (8)) >>> 2) >>> 0]);
  }
  var desc = {
   "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
   "colorAttachments": makeColorAttachments(GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0]),
   "depthStencilAttachment": makeDepthStencilAttachment(GROWABLE_HEAP_U32()[(((descriptor) + (20)) >>> 2) >>> 0]),
   "occlusionQuerySet": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((descriptor) + (24)) >>> 2) >>> 0]),
   "timestampWrites": WebGPU.makePassTimestampWrites(GROWABLE_HEAP_U32()[(((descriptor) + (28)) >>> 2) >>> 0]),
   "maxDrawCount": maxDrawCount
  };
  return desc;
 }
 var desc = makeRenderPassDescriptor(descriptor);
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var ptr = _emwgpuCreateRenderPassEncoder(0);
 WebGPU.Internals.jsObjectInsert(ptr, commandEncoder.beginRenderPass(desc));
 return ptr;
}

function _wgpuCommandEncoderClearBuffer(encoderPtr, bufferPtr, offset, size) {
 encoderPtr >>>= 0;
 bufferPtr >>>= 0;
 offset = bigintToI53Checked(offset);
 size = bigintToI53Checked(size);
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 if (size == -1) size = undefined;
 var buffer = WebGPU.getJsObject(bufferPtr);
 commandEncoder.clearBuffer(buffer, offset, size);
}

function _wgpuCommandEncoderCopyBufferToBuffer(encoderPtr, srcPtr, srcOffset, dstPtr, dstOffset, size) {
 encoderPtr >>>= 0;
 srcPtr >>>= 0;
 srcOffset = bigintToI53Checked(srcOffset);
 dstPtr >>>= 0;
 dstOffset = bigintToI53Checked(dstOffset);
 size = bigintToI53Checked(size);
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var src = WebGPU.getJsObject(srcPtr);
 var dst = WebGPU.getJsObject(dstPtr);
 commandEncoder.copyBufferToBuffer(src, srcOffset, dst, dstOffset, size);
}

function _wgpuCommandEncoderCopyBufferToTexture(encoderPtr, srcPtr, dstPtr, copySizePtr) {
 encoderPtr >>>= 0;
 srcPtr >>>= 0;
 dstPtr >>>= 0;
 copySizePtr >>>= 0;
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var copySize = WebGPU.makeExtent3D(copySizePtr);
 commandEncoder.copyBufferToTexture(WebGPU.makeTexelCopyBufferInfo(srcPtr), WebGPU.makeTexelCopyTextureInfo(dstPtr), copySize);
}

function _wgpuCommandEncoderCopyTextureToBuffer(encoderPtr, srcPtr, dstPtr, copySizePtr) {
 encoderPtr >>>= 0;
 srcPtr >>>= 0;
 dstPtr >>>= 0;
 copySizePtr >>>= 0;
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var copySize = WebGPU.makeExtent3D(copySizePtr);
 commandEncoder.copyTextureToBuffer(WebGPU.makeTexelCopyTextureInfo(srcPtr), WebGPU.makeTexelCopyBufferInfo(dstPtr), copySize);
}

function _wgpuCommandEncoderCopyTextureToTexture(encoderPtr, srcPtr, dstPtr, copySizePtr) {
 encoderPtr >>>= 0;
 srcPtr >>>= 0;
 dstPtr >>>= 0;
 copySizePtr >>>= 0;
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var copySize = WebGPU.makeExtent3D(copySizePtr);
 commandEncoder.copyTextureToTexture(WebGPU.makeTexelCopyTextureInfo(srcPtr), WebGPU.makeTexelCopyTextureInfo(dstPtr), copySize);
}

function _wgpuCommandEncoderFinish(encoderPtr, descriptor) {
 encoderPtr >>>= 0;
 descriptor >>>= 0;
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var ptr = _emwgpuCreateCommandBuffer(0);
 WebGPU.Internals.jsObjectInsert(ptr, commandEncoder.finish());
 return ptr;
}

function _wgpuCommandEncoderResolveQuerySet(encoderPtr, querySetPtr, firstQuery, queryCount, destinationPtr, destinationOffset) {
 encoderPtr >>>= 0;
 querySetPtr >>>= 0;
 destinationPtr >>>= 0;
 destinationOffset = bigintToI53Checked(destinationOffset);
 var commandEncoder = WebGPU.getJsObject(encoderPtr);
 var querySet = WebGPU.getJsObject(querySetPtr);
 var destination = WebGPU.getJsObject(destinationPtr);
 commandEncoder.resolveQuerySet(querySet, firstQuery, queryCount, destination, destinationOffset);
}

function _wgpuComputePassEncoderDispatchWorkgroups(passPtr, x, y, z) {
 passPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.dispatchWorkgroups(x, y, z);
}

function _wgpuComputePassEncoderEnd(passPtr) {
 passPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.end();
}

function _wgpuComputePassEncoderSetBindGroup(passPtr, groupIndex, groupPtr, dynamicOffsetCount, dynamicOffsetsPtr) {
 passPtr >>>= 0;
 groupPtr >>>= 0;
 dynamicOffsetCount >>>= 0;
 dynamicOffsetsPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 var group = WebGPU.getJsObject(groupPtr);
 if (dynamicOffsetCount == 0) {
  pass.setBindGroup(groupIndex, group);
 } else {
  pass.setBindGroup(groupIndex, group, GROWABLE_HEAP_U32(), ((dynamicOffsetsPtr) >>> 2), dynamicOffsetCount);
 }
}

function _wgpuComputePassEncoderSetPipeline(passPtr, pipelinePtr) {
 passPtr >>>= 0;
 pipelinePtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 var pipeline = WebGPU.getJsObject(pipelinePtr);
 pass.setPipeline(pipeline);
}

var readI53FromI64 = ptr => GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] + GROWABLE_HEAP_I32()[(((ptr) + (4)) >>> 2) >>> 0] * 4294967296;

function _wgpuDeviceCreateBindGroup(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 function makeEntry(entryPtr) {
  var bufferPtr = GROWABLE_HEAP_U32()[(((entryPtr) + (8)) >>> 2) >>> 0];
  var samplerPtr = GROWABLE_HEAP_U32()[(((entryPtr) + (32)) >>> 2) >>> 0];
  var textureViewPtr = GROWABLE_HEAP_U32()[(((entryPtr) + (36)) >>> 2) >>> 0];
  var binding = GROWABLE_HEAP_U32()[(((entryPtr) + (4)) >>> 2) >>> 0];
  if (bufferPtr) {
   var size = readI53FromI64((entryPtr) + (24));
   if (size == -1) size = undefined;
   return {
    "binding": binding,
    "resource": {
     "buffer": WebGPU.getJsObject(bufferPtr),
     "offset": (GROWABLE_HEAP_U32()[((((entryPtr + 4)) + (16)) >>> 2) >>> 0] * 4294967296 + GROWABLE_HEAP_U32()[(((entryPtr) + (16)) >>> 2) >>> 0]),
     "size": size
    }
   };
  } else if (samplerPtr) {
   return {
    "binding": binding,
    "resource": WebGPU.getJsObject(samplerPtr)
   };
  } else {
   return {
    "binding": binding,
    "resource": WebGPU.getJsObject(textureViewPtr)
   };
  }
 }
 function makeEntries(count, entriesPtrs) {
  var entries = [];
  for (var i = 0; i < count; ++i) {
   entries.push(makeEntry(entriesPtrs + 40 * i));
  }
  return entries;
 }
 var desc = {
  "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
  "layout": WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0]),
  "entries": makeEntries(GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((descriptor) + (20)) >>> 2) >>> 0])
 };
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateBindGroup(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createBindGroup(desc));
 return ptr;
}

function _wgpuDeviceCreateBindGroupLayout(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 function makeBufferEntry(entryPtr) {
  var typeInt = GROWABLE_HEAP_U32()[(((entryPtr) + (4)) >>> 2) >>> 0];
  if (!typeInt) return undefined;
  return {
   "type": WebGPU.BufferBindingType[typeInt],
   "hasDynamicOffset": !!(GROWABLE_HEAP_U32()[(((entryPtr) + (8)) >>> 2) >>> 0]),
   "minBindingSize": (GROWABLE_HEAP_U32()[((((entryPtr + 4)) + (16)) >>> 2) >>> 0] * 4294967296 + GROWABLE_HEAP_U32()[(((entryPtr) + (16)) >>> 2) >>> 0])
  };
 }
 function makeSamplerEntry(entryPtr) {
  var typeInt = GROWABLE_HEAP_U32()[(((entryPtr) + (4)) >>> 2) >>> 0];
  if (!typeInt) return undefined;
  return {
   "type": WebGPU.SamplerBindingType[typeInt]
  };
 }
 function makeTextureEntry(entryPtr) {
  var sampleTypeInt = GROWABLE_HEAP_U32()[(((entryPtr) + (4)) >>> 2) >>> 0];
  if (!sampleTypeInt) return undefined;
  return {
   "sampleType": WebGPU.TextureSampleType[sampleTypeInt],
   "viewDimension": WebGPU.TextureViewDimension[GROWABLE_HEAP_U32()[(((entryPtr) + (8)) >>> 2) >>> 0]],
   "multisampled": !!(GROWABLE_HEAP_U32()[(((entryPtr) + (12)) >>> 2) >>> 0])
  };
 }
 function makeStorageTextureEntry(entryPtr) {
  var accessInt = GROWABLE_HEAP_U32()[(((entryPtr) + (4)) >>> 2) >>> 0];
  if (!accessInt) return undefined;
  return {
   "access": WebGPU.StorageTextureAccess[accessInt],
   "format": WebGPU.TextureFormat[GROWABLE_HEAP_U32()[(((entryPtr) + (8)) >>> 2) >>> 0]],
   "viewDimension": WebGPU.TextureViewDimension[GROWABLE_HEAP_U32()[(((entryPtr) + (12)) >>> 2) >>> 0]]
  };
 }
 function makeEntry(entryPtr) {
  return {
   "binding": GROWABLE_HEAP_U32()[(((entryPtr) + (4)) >>> 2) >>> 0],
   "visibility": GROWABLE_HEAP_U32()[(((entryPtr) + (8)) >>> 2) >>> 0],
   "buffer": makeBufferEntry(entryPtr + 24),
   "sampler": makeSamplerEntry(entryPtr + 48),
   "texture": makeTextureEntry(entryPtr + 56),
   "storageTexture": makeStorageTextureEntry(entryPtr + 72)
  };
 }
 function makeEntries(count, entriesPtrs) {
  var entries = [];
  for (var i = 0; i < count; ++i) {
   entries.push(makeEntry(entriesPtrs + 88 * i));
  }
  return entries;
 }
 var desc = {
  "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
  "entries": makeEntries(GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0])
 };
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateBindGroupLayout(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createBindGroupLayout(desc));
 return ptr;
}

function _wgpuDeviceCreateCommandEncoder(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 var desc;
 if (descriptor) {
  desc = {
   "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4)
  };
 }
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateCommandEncoder(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createCommandEncoder(desc));
 return ptr;
}

function _wgpuDeviceCreateComputePipeline(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 var desc = WebGPU.makeComputePipelineDesc(descriptor);
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateComputePipeline(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createComputePipeline(desc));
 return ptr;
}

function _wgpuDeviceCreatePipelineLayout(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 var bglCount = GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0];
 var bglPtr = GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0];
 var bgls = [];
 for (var i = 0; i < bglCount; ++i) {
  bgls.push(WebGPU.getJsObject(GROWABLE_HEAP_U32()[(((bglPtr) + (4 * i)) >>> 2) >>> 0]));
 }
 var desc = {
  "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
  "bindGroupLayouts": bgls
 };
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreatePipelineLayout(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createPipelineLayout(desc));
 return ptr;
}

function _wgpuDeviceCreateQuerySet(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 var desc = {
  "type": WebGPU.QueryType[GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0]],
  "count": GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0]
 };
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateQuerySet(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createQuerySet(desc));
 return ptr;
}

function _wgpuDeviceCreateRenderPipeline(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 var desc = WebGPU.makeRenderPipelineDesc(descriptor);
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateRenderPipeline(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createRenderPipeline(desc));
 return ptr;
}

function _wgpuDeviceCreateSampler(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 var desc;
 if (descriptor) {
  desc = {
   "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
   "addressModeU": WebGPU.AddressMode[GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0]],
   "addressModeV": WebGPU.AddressMode[GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0]],
   "addressModeW": WebGPU.AddressMode[GROWABLE_HEAP_U32()[(((descriptor) + (20)) >>> 2) >>> 0]],
   "magFilter": WebGPU.FilterMode[GROWABLE_HEAP_U32()[(((descriptor) + (24)) >>> 2) >>> 0]],
   "minFilter": WebGPU.FilterMode[GROWABLE_HEAP_U32()[(((descriptor) + (28)) >>> 2) >>> 0]],
   "mipmapFilter": WebGPU.MipmapFilterMode[GROWABLE_HEAP_U32()[(((descriptor) + (32)) >>> 2) >>> 0]],
   "lodMinClamp": GROWABLE_HEAP_F32()[(((descriptor) + (36)) >>> 2) >>> 0],
   "lodMaxClamp": GROWABLE_HEAP_F32()[(((descriptor) + (40)) >>> 2) >>> 0],
   "compare": WebGPU.CompareFunction[GROWABLE_HEAP_U32()[(((descriptor) + (44)) >>> 2) >>> 0]],
   "maxAnisotropy": GROWABLE_HEAP_U16()[(((descriptor) + (48)) >>> 1) >>> 0]
  };
 }
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateSampler(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createSampler(desc));
 return ptr;
}

function _wgpuDeviceCreateTexture(devicePtr, descriptor) {
 devicePtr >>>= 0;
 descriptor >>>= 0;
 var desc = {
  "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
  "size": WebGPU.makeExtent3D(descriptor + 28),
  "mipLevelCount": GROWABLE_HEAP_U32()[(((descriptor) + (44)) >>> 2) >>> 0],
  "sampleCount": GROWABLE_HEAP_U32()[(((descriptor) + (48)) >>> 2) >>> 0],
  "dimension": WebGPU.TextureDimension[GROWABLE_HEAP_U32()[(((descriptor) + (24)) >>> 2) >>> 0]],
  "format": WebGPU.TextureFormat[GROWABLE_HEAP_U32()[(((descriptor) + (40)) >>> 2) >>> 0]],
  "usage": GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0]
 };
 var viewFormatCount = GROWABLE_HEAP_U32()[(((descriptor) + (52)) >>> 2) >>> 0];
 if (viewFormatCount) {
  var viewFormatsPtr = GROWABLE_HEAP_U32()[(((descriptor) + (56)) >>> 2) >>> 0];
  desc["viewFormats"] = Array.from(GROWABLE_HEAP_I32().subarray((((viewFormatsPtr) >>> 2)) >>> 0, ((viewFormatsPtr + viewFormatCount * 4) >>> 2) >>> 0), format => WebGPU.TextureFormat[format]);
 }
 var device = WebGPU.getJsObject(devicePtr);
 var ptr = _emwgpuCreateTexture(0);
 WebGPU.Internals.jsObjectInsert(ptr, device.createTexture(desc));
 return ptr;
}

function _wgpuDeviceGetLimits(devicePtr, limitsOutPtr) {
 devicePtr >>>= 0;
 limitsOutPtr >>>= 0;
 var device = WebGPU.getJsObject(devicePtr);
 WebGPU.fillLimitStruct(device.limits, limitsOutPtr);
 return 1;
}

function _wgpuDeviceHasFeature(devicePtr, featureEnumValue) {
 devicePtr >>>= 0;
 var device = WebGPU.getJsObject(devicePtr);
 return device.features.has(WebGPU.FeatureName[featureEnumValue]);
}

function _wgpuQuerySetDestroy(querySetPtr) {
 querySetPtr >>>= 0;
 WebGPU.getJsObject(querySetPtr).destroy();
}

var _wgpuQueueSubmit = function(queuePtr, commandCount, commands) {
 queuePtr >>>= 0;
 commandCount >>>= 0;
 commands >>>= 0;
 var queue = WebGPU.getJsObject(queuePtr);
 var cmds = Array.from(GROWABLE_HEAP_I32().subarray((((commands) >>> 2)) >>> 0, ((commands + commandCount * 4) >>> 2) >>> 0), id => WebGPU.getJsObject(id));
 queue.submit(cmds);
};

function _wgpuQueueWriteBuffer(queuePtr, bufferPtr, bufferOffset, data, size) {
 queuePtr >>>= 0;
 bufferPtr >>>= 0;
 bufferOffset = bigintToI53Checked(bufferOffset);
 data >>>= 0;
 size >>>= 0;
 var queue = WebGPU.getJsObject(queuePtr);
 var buffer = WebGPU.getJsObject(bufferPtr);
 var subarray = GROWABLE_HEAP_U8().subarray(data >>> 0, data + size >>> 0);
 queue.writeBuffer(buffer, bufferOffset, subarray, 0, size);
}

function _wgpuQueueWriteTexture(queuePtr, destinationPtr, data, dataSize, dataLayoutPtr, writeSizePtr) {
 queuePtr >>>= 0;
 destinationPtr >>>= 0;
 data >>>= 0;
 dataSize >>>= 0;
 dataLayoutPtr >>>= 0;
 writeSizePtr >>>= 0;
 var queue = WebGPU.getJsObject(queuePtr);
 var destination = WebGPU.makeTexelCopyTextureInfo(destinationPtr);
 var dataLayout = WebGPU.makeTexelCopyBufferLayout(dataLayoutPtr);
 var writeSize = WebGPU.makeExtent3D(writeSizePtr);
 var subarray = GROWABLE_HEAP_U8().subarray(data >>> 0, data + dataSize >>> 0);
 queue.writeTexture(destination, subarray, dataLayout, writeSize);
}

function _wgpuRenderPassEncoderBeginOcclusionQuery(passPtr, queryIndex) {
 passPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.beginOcclusionQuery(queryIndex);
}

function _wgpuRenderPassEncoderDraw(passPtr, vertexCount, instanceCount, firstVertex, firstInstance) {
 passPtr >>>= 0;
 firstVertex >>>= 0;
 firstInstance >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.draw(vertexCount, instanceCount, firstVertex, firstInstance);
}

function _wgpuRenderPassEncoderDrawIndexed(passPtr, indexCount, instanceCount, firstIndex, baseVertex, firstInstance) {
 passPtr >>>= 0;
 firstIndex >>>= 0;
 firstInstance >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
}

function _wgpuRenderPassEncoderEnd(encoderPtr) {
 encoderPtr >>>= 0;
 var encoder = WebGPU.getJsObject(encoderPtr);
 encoder.end();
}

function _wgpuRenderPassEncoderEndOcclusionQuery(passPtr) {
 passPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.endOcclusionQuery();
}

function _wgpuRenderPassEncoderSetBindGroup(passPtr, groupIndex, groupPtr, dynamicOffsetCount, dynamicOffsetsPtr) {
 passPtr >>>= 0;
 groupPtr >>>= 0;
 dynamicOffsetCount >>>= 0;
 dynamicOffsetsPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 var group = WebGPU.getJsObject(groupPtr);
 if (dynamicOffsetCount == 0) {
  pass.setBindGroup(groupIndex, group);
 } else {
  pass.setBindGroup(groupIndex, group, GROWABLE_HEAP_U32(), ((dynamicOffsetsPtr) >>> 2), dynamicOffsetCount);
 }
}

function _wgpuRenderPassEncoderSetBlendConstant(passPtr, colorPtr) {
 passPtr >>>= 0;
 colorPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 var color = WebGPU.makeColor(colorPtr);
 pass.setBlendConstant(color);
}

function _wgpuRenderPassEncoderSetIndexBuffer(passPtr, bufferPtr, format, offset, size) {
 passPtr >>>= 0;
 bufferPtr >>>= 0;
 offset = bigintToI53Checked(offset);
 size = bigintToI53Checked(size);
 var pass = WebGPU.getJsObject(passPtr);
 var buffer = WebGPU.getJsObject(bufferPtr);
 if (size == -1) size = undefined;
 pass.setIndexBuffer(buffer, WebGPU.IndexFormat[format], offset, size);
}

function _wgpuRenderPassEncoderSetPipeline(passPtr, pipelinePtr) {
 passPtr >>>= 0;
 pipelinePtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 var pipeline = WebGPU.getJsObject(pipelinePtr);
 pass.setPipeline(pipeline);
}

function _wgpuRenderPassEncoderSetScissorRect(passPtr, x, y, w, h) {
 passPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.setScissorRect(x, y, w, h);
}

function _wgpuRenderPassEncoderSetStencilReference(passPtr, reference) {
 passPtr >>>= 0;
 reference >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.setStencilReference(reference);
}

function _wgpuRenderPassEncoderSetVertexBuffer(passPtr, slot, bufferPtr, offset, size) {
 passPtr >>>= 0;
 bufferPtr >>>= 0;
 offset = bigintToI53Checked(offset);
 size = bigintToI53Checked(size);
 var pass = WebGPU.getJsObject(passPtr);
 var buffer = WebGPU.getJsObject(bufferPtr);
 if (size == -1) size = undefined;
 pass.setVertexBuffer(slot, buffer, offset, size);
}

function _wgpuRenderPassEncoderSetViewport(passPtr, x, y, w, h, minDepth, maxDepth) {
 passPtr >>>= 0;
 var pass = WebGPU.getJsObject(passPtr);
 pass.setViewport(x, y, w, h, minDepth, maxDepth);
}

function _wgpuRenderPipelineGetBindGroupLayout(pipelinePtr, groupIndex) {
 pipelinePtr >>>= 0;
 var pipeline = WebGPU.getJsObject(pipelinePtr);
 var ptr = _emwgpuCreateBindGroupLayout(0);
 WebGPU.Internals.jsObjectInsert(ptr, pipeline.getBindGroupLayout(groupIndex));
 return ptr;
}

function _wgpuSurfaceConfigure(surfacePtr, config) {
 surfacePtr >>>= 0;
 config >>>= 0;
 var devicePtr = GROWABLE_HEAP_U32()[(((config) + (4)) >>> 2) >>> 0];
 var context = WebGPU.getJsObject(surfacePtr);
 var canvasSize = [ GROWABLE_HEAP_U32()[(((config) + (24)) >>> 2) >>> 0], GROWABLE_HEAP_U32()[(((config) + (28)) >>> 2) >>> 0] ];
 if (canvasSize[0] !== 0) {
  context["canvas"]["width"] = canvasSize[0];
 }
 if (canvasSize[1] !== 0) {
  context["canvas"]["height"] = canvasSize[1];
 }
 var configuration = {
  "device": WebGPU.getJsObject(devicePtr),
  "format": WebGPU.TextureFormat[GROWABLE_HEAP_U32()[(((config) + (8)) >>> 2) >>> 0]],
  "usage": GROWABLE_HEAP_U32()[(((config) + (16)) >>> 2) >>> 0],
  "alphaMode": WebGPU.CompositeAlphaMode[GROWABLE_HEAP_U32()[(((config) + (40)) >>> 2) >>> 0]]
 };
 var viewFormatCount = GROWABLE_HEAP_U32()[(((config) + (32)) >>> 2) >>> 0];
 if (viewFormatCount) {
  var viewFormatsPtr = GROWABLE_HEAP_U32()[(((config) + (36)) >>> 2) >>> 0];
  configuration["viewFormats"] = Array.from(GROWABLE_HEAP_I32().subarray((((viewFormatsPtr) >>> 2)) >>> 0, ((viewFormatsPtr + viewFormatCount * 4) >>> 2) >>> 0), format => WebGPU.TextureFormat[format]);
 }
 {
  var nextInChainPtr = GROWABLE_HEAP_U32()[((config) >>> 2) >>> 0];
  if (nextInChainPtr !== 0) {
   var sType = GROWABLE_HEAP_U32()[(((nextInChainPtr) + (4)) >>> 2) >>> 0];
   var surfaceColorManagement = nextInChainPtr;
   configuration.colorSpace = WebGPU.PredefinedColorSpace[GROWABLE_HEAP_U32()[(((surfaceColorManagement) + (8)) >>> 2) >>> 0]];
   configuration.toneMapping = {
    mode: WebGPU.ToneMappingMode[GROWABLE_HEAP_U32()[(((surfaceColorManagement) + (12)) >>> 2) >>> 0]]
   };
  }
 }
 context.configure(configuration);
}

function _wgpuSurfaceGetCurrentTexture(surfacePtr, surfaceTexturePtr) {
 surfacePtr >>>= 0;
 surfaceTexturePtr >>>= 0;
 var context = WebGPU.getJsObject(surfacePtr);
 try {
  var texturePtr = _emwgpuCreateTexture(0);
  WebGPU.Internals.jsObjectInsert(texturePtr, context.getCurrentTexture());
  GROWABLE_HEAP_U32()[(((surfaceTexturePtr) + (4)) >>> 2) >>> 0] = texturePtr;
  GROWABLE_HEAP_I32()[(((surfaceTexturePtr) + (8)) >>> 2) >>> 0] = 1;
 } catch (ex) {
  GROWABLE_HEAP_U32()[(((surfaceTexturePtr) + (4)) >>> 2) >>> 0] = 0;
  GROWABLE_HEAP_I32()[(((surfaceTexturePtr) + (8)) >>> 2) >>> 0] = 6;
 }
}

function _wgpuSurfaceUnconfigure(surfacePtr) {
 surfacePtr >>>= 0;
 var context = WebGPU.getJsObject(surfacePtr);
 context.unconfigure();
}

function _wgpuTextureCreateView(texturePtr, descriptor) {
 texturePtr >>>= 0;
 descriptor >>>= 0;
 var desc;
 if (descriptor) {
  var mipLevelCount = GROWABLE_HEAP_U32()[(((descriptor) + (24)) >>> 2) >>> 0];
  var arrayLayerCount = GROWABLE_HEAP_U32()[(((descriptor) + (32)) >>> 2) >>> 0];
  desc = {
   "label": WebGPU.makeStringFromOptionalStringView(descriptor + 4),
   "format": WebGPU.TextureFormat[GROWABLE_HEAP_U32()[(((descriptor) + (12)) >>> 2) >>> 0]],
   "dimension": WebGPU.TextureViewDimension[GROWABLE_HEAP_U32()[(((descriptor) + (16)) >>> 2) >>> 0]],
   "baseMipLevel": GROWABLE_HEAP_U32()[(((descriptor) + (20)) >>> 2) >>> 0],
   "mipLevelCount": mipLevelCount === 4294967295 ? undefined : mipLevelCount,
   "baseArrayLayer": GROWABLE_HEAP_U32()[(((descriptor) + (28)) >>> 2) >>> 0],
   "arrayLayerCount": arrayLayerCount === 4294967295 ? undefined : arrayLayerCount,
   "aspect": WebGPU.TextureAspect[GROWABLE_HEAP_U32()[(((descriptor) + (36)) >>> 2) >>> 0]]
  };
 }
 var texture = WebGPU.getJsObject(texturePtr);
 var ptr = _emwgpuCreateTextureView(0);
 WebGPU.Internals.jsObjectInsert(ptr, texture.createView(desc));
 return ptr;
}

function _wgpuTextureDestroy(texturePtr) {
 texturePtr >>>= 0;
 WebGPU.getJsObject(texturePtr).destroy();
}

function _wgpuTextureGetDepthOrArrayLayers(texturePtr) {
 texturePtr >>>= 0;
 var texture = WebGPU.getJsObject(texturePtr);
 return texture.depthOrArrayLayers;
}

function _wgpuTextureGetDimension(texturePtr) {
 texturePtr >>>= 0;
 var texture = WebGPU.getJsObject(texturePtr);
 return WebGPU.TextureDimension.indexOf(texture.dimension);
}

function _wgpuTextureGetHeight(texturePtr) {
 texturePtr >>>= 0;
 var texture = WebGPU.getJsObject(texturePtr);
 return texture.height;
}

function _wgpuTextureGetWidth(texturePtr) {
 texturePtr >>>= 0;
 var texture = WebGPU.getJsObject(texturePtr);
 return texture.width;
}

function _wink_js_acquire_device() {
 var given = Module["winkDevice"] || Module["preinitializedWebGPUDevice"];
 if (given) return WINK.adopt(given);
 var gpu = typeof navigator != "undefined" ? navigator["gpu"] : undefined;
 if (!gpu) {
  err("wink: navigator.gpu is unavailable");
  return 0;
 }
 return WINK.suspend((async function() {
  try {
   var adapter = await gpu["requestAdapter"](Module["winkAdapterOptions"] || {
    "powerPreference": "high-performance"
   });
   if (!adapter) {
    err("wink: no WebGPU adapter");
    return 0;
   }
   var desc = WINK.descriptor(adapter);
   if (Module["winkDeviceDescriptor"]) desc = Module["winkDeviceDescriptor"](adapter, desc) || desc;
   return WINK.adopt(await adapter["requestDevice"](desc));
  } catch (e) {
   err("wink: requesting a WebGPU device failed: " + e);
   return 0;
  }
 })());
}

function _wink_js_create_surface(selectorPtr) {
 var selector = selectorPtr ? UTF8ToString(selectorPtr) : "";
 var provided = Module["winkCanvas"];
 var canvas = null;
 if (typeof provided == "function") canvas = provided(selector); else if (provided && !selector) canvas = provided;
 var owned = typeof GL != "undefined" && GL.offscreenCanvases || {};
 if (!canvas && selector) {
  var id = selector.charAt(0) == "#" ? selector.substr(1) : selector;
  if (owned[id]) canvas = owned[id].offscreenCanvas;
 }
 if (!canvas && (!selector || selector == "#canvas")) canvas = Module["canvas"];
 if (!canvas && selector && typeof document != "undefined") canvas = document.querySelector(selector);
 if (!canvas && typeof document == "undefined") {
  var ids = Object.keys(owned).filter(function(k) {
   return owned[k];
  });
  if (ids.length == 1) canvas = owned[ids[0]].offscreenCanvas;
 }
 if (!canvas) {
  err("wink: no canvas" + (selector ? " for " + selector : ""));
  return 0;
 }
 var context = canvas.getContext("webgpu");
 if (!context) {
  err("wink: the canvas will not give a webgpu context");
  return 0;
 }
 var ptr = _emwgpuCreateSurface(0);
 WebGPU.Internals.jsObjectInsert(ptr, context);
 return ptr;
}

function _wink_js_get_env(buf, len) {
 var env = Module["winkEnv"];
 if (!env) return 0;
 var text = "";
 if (Array.isArray(env)) {
  for (var i = 0; i < env.length; ++i) text += env[i] + "\n";
 } else {
  for (var name in env) text += name + "=" + env[name] + "\n";
 }
 var need = lengthBytesUTF8(text) + 1;
 if (buf && len >= need) stringToUTF8(text, buf, len);
 return need;
}

function _wink_js_has_jspi() {
 return (typeof WebAssembly.Suspending == "function" && typeof WebAssembly.promising == "function") ? 1 : 0;
}

function _wink_js_kick(queue) {
 if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(76, 0, 0, queue);
 queue >>>= 0;
 if (!WINK.pending) WINK.pending = new Set;
 WINK.pending.add(queue);
 WINK.schedule();
}

function _wink_js_yield_frame(frames) {
 return WINK.suspend(new Promise(function(resolve) {
  var left = frames;
  var settled = false;
  var done = function() {
   if (!settled) {
    settled = true;
    resolve();
   }
  };
  var tick = function() {
   if (--left <= 0) done(); else requestAnimationFrame(tick);
  };
  if (left > 0 && typeof requestAnimationFrame == "function") requestAnimationFrame(tick); else if (typeof scheduler != "undefined" && scheduler["yield"]) scheduler["yield"]().then(done, done); else setTimeout(done, 0);
  setTimeout(done, 1e3);
 }));
}

var listenOnce = (object, event, func) => {
 object.addEventListener(event, func, {
  "once": true
 });
};

/** @param {Object=} elements */ var autoResumeAudioContext = (ctx, elements) => {
 if (!elements) {
  elements = [ document, document.getElementById("canvas") ];
 }
 [ "keydown", "mousedown", "touchstart" ].forEach(event => {
  elements.forEach(element => {
   if (element) {
    listenOnce(element, event, () => {
     if (ctx.state === "suspended") ctx.resume();
    });
   }
  });
 });
};

var dynCall = (sig, ptr, args = []) => {
 var rtn = getWasmTableEntry(ptr)(...args);
 return rtn;
};

var MEMFS = {
 createBackend(opts) {
  return _wasmfs_create_memory_backend();
 }
};

var PATH = {
 isAbs: path => path.charAt(0) === "/",
 splitPath: filename => {
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
  return splitPathRe.exec(filename).slice(1);
 },
 normalizeArray: (parts, allowAboveRoot) => {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
   var last = parts[i];
   if (last === ".") {
    parts.splice(i, 1);
   } else if (last === "..") {
    parts.splice(i, 1);
    up++;
   } else if (up) {
    parts.splice(i, 1);
    up--;
   }
  }
  if (allowAboveRoot) {
   for (;up; up--) {
    parts.unshift("..");
   }
  }
  return parts;
 },
 normalize: path => {
  var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
  path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
  if (!path && !isAbsolute) {
   path = ".";
  }
  if (path && trailingSlash) {
   path += "/";
  }
  return (isAbsolute ? "/" : "") + path;
 },
 dirname: path => {
  var result = PATH.splitPath(path), root = result[0], dir = result[1];
  if (!root && !dir) {
   return ".";
  }
  if (dir) {
   dir = dir.substr(0, dir.length - 1);
  }
  return root + dir;
 },
 basename: path => {
  if (path === "/") return "/";
  path = PATH.normalize(path);
  path = path.replace(/\/$/, "");
  var lastSlash = path.lastIndexOf("/");
  if (lastSlash === -1) return path;
  return path.substr(lastSlash + 1);
 },
 join: (...paths) => PATH.normalize(paths.join("/")),
 join2: (l, r) => PATH.normalize(l + "/" + r)
};

var readI53FromU64 = ptr => GROWABLE_HEAP_U32()[((ptr) >>> 2) >>> 0] + GROWABLE_HEAP_U32()[(((ptr) + (4)) >>> 2) >>> 0] * 4294967296;

var FS_mknod = (path, mode, dev) => FS.handleError(withStackSave(() => {
 var pathBuffer = stringToUTF8OnStack(path);
 return __wasmfs_mknod(pathBuffer, mode, dev);
}));

var FS_create = (path, mode = 438) => {
 /* 0666 */ mode &= 4095;
 mode |= 32768;
 return FS_mknod(path, mode, 0);
};

var FS_writeFile = (path, data) => withStackSave(() => {
 var pathBuffer = stringToUTF8OnStack(path);
 if (typeof data == "string") {
  var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
  var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
  data = buf.slice(0, actualNumBytes);
 }
 var dataBuffer = _malloc(data.length);
 for (var i = 0; i < data.length; i++) {
  GROWABLE_HEAP_I8()[(dataBuffer) + (i) >>> 0] = data[i];
 }
 var ret = __wasmfs_write_file(pathBuffer, dataBuffer, data.length);
 _free(dataBuffer);
 return ret;
});

var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn) => {
 var pathName = name ? parent + "/" + name : parent;
 var mode = FS_getMode(canRead, canWrite);
 if (!wasmFSPreloadingFlushed) {
  wasmFSPreloadedFiles.push({
   pathName: pathName,
   fileData: fileData,
   mode: mode
  });
 } else {
  FS_create(pathName, mode);
  FS_writeFile(pathName, fileData);
 }
};

/** @param {boolean=} noRunDep */ var asyncLoad = (url, onload, onerror, noRunDep) => {
 var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
 readAsync(url, arrayBuffer => {
  onload(new Uint8Array(arrayBuffer));
  if (dep) removeRunDependency(dep);
 }, event => {
  if (onerror) {
   onerror();
  } else {
   throw `Loading data file "${url}" failed.`;
  }
 });
 if (dep) addRunDependency(dep);
};

var PATH_FS = {
 resolve: (...args) => {
  var resolvedPath = "", resolvedAbsolute = false;
  for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
   var path = (i >= 0) ? args[i] : FS.cwd();
   if (typeof path != "string") {
    throw new TypeError("Arguments to path.resolve must be strings");
   } else if (!path) {
    return "";
   }
   resolvedPath = path + "/" + resolvedPath;
   resolvedAbsolute = PATH.isAbs(path);
  }
  resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
  return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
 },
 relative: (from, to) => {
  from = PATH_FS.resolve(from).substr(1);
  to = PATH_FS.resolve(to).substr(1);
  function trim(arr) {
   var start = 0;
   for (;start < arr.length; start++) {
    if (arr[start] !== "") break;
   }
   var end = arr.length - 1;
   for (;end >= 0; end--) {
    if (arr[end] !== "") break;
   }
   if (start > end) return [];
   return arr.slice(start, end - start + 1);
  }
  var fromParts = trim(from.split("/"));
  var toParts = trim(to.split("/"));
  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
   if (fromParts[i] !== toParts[i]) {
    samePartsLength = i;
    break;
   }
  }
  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
   outputParts.push("..");
  }
  outputParts = outputParts.concat(toParts.slice(samePartsLength));
  return outputParts.join("/");
 }
};

var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror) => {
 if (typeof Browser != "undefined") Browser.init();
 var handled = false;
 preloadPlugins.forEach(plugin => {
  if (handled) return;
  if (plugin["canHandle"](fullname)) {
   plugin["handle"](byteArray, fullname, finish, onerror);
   handled = true;
  }
 });
 return handled;
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
 var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
 var dep = getUniqueRunDependency(`cp ${fullname}`);
 function processData(byteArray) {
  function finish(byteArray) {
   preFinish?.();
   if (!dontCreateFile) {
    FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
   }
   onload?.();
   removeRunDependency(dep);
  }
  if (FS_handledByPreloadPlugin(byteArray, fullname, finish, () => {
   onerror?.();
   removeRunDependency(dep);
  })) {
   return;
  }
  finish(byteArray);
 }
 addRunDependency(dep);
 if (typeof url == "string") {
  asyncLoad(url, processData, onerror);
 } else {
  processData(url);
 }
};

var FS_getMode = (canRead, canWrite) => {
 var mode = 0;
 if (canRead) mode |= 292 | 73;
 if (canWrite) mode |= 146;
 return mode;
};

var FS_modeStringToFlags = str => {
 var flagModes = {
  "r": 0,
  "r+": 2,
  "w": 512 | 64 | 1,
  "w+": 512 | 64 | 2,
  "a": 1024 | 64 | 1,
  "a+": 1024 | 64 | 2
 };
 var flags = flagModes[str];
 if (typeof flags == "undefined") {
  throw new Error(`Unknown file open mode: ${str}`);
 }
 return flags;
};

var FS_mkdir = (path, mode = 511) => /* 0777 */ FS.handleError(withStackSave(() => {
 var buffer = stringToUTF8OnStack(path);
 return __wasmfs_mkdir(buffer, mode);
}));

/**
     * @param {number=} mode Optionally, the mode to create in. Uses mkdir's
     *                       default if not set.
     */ var FS_mkdirTree = (path, mode) => {
 var dirs = path.split("/");
 var d = "";
 for (var i = 0; i < dirs.length; ++i) {
  if (!dirs[i]) continue;
  d += "/" + dirs[i];
  try {
   FS_mkdir(d, mode);
  } catch (e) {
   if (e.errno != 20) throw e;
  }
 }
};

var FS_unlink = path => withStackSave(() => {
 var buffer = stringToUTF8OnStack(path);
 return __wasmfs_unlink(buffer);
});

var wasmFSDevices = {};

var wasmFSDeviceStreams = {};

var FS = {
 init() {
  FS.ensureErrnoError();
 },
 ErrnoError: null,
 handleError(returnValue) {
  if (returnValue < 0) {
   throw new FS.ErrnoError(-returnValue);
  }
  return returnValue;
 },
 ensureErrnoError() {
  if (FS.ErrnoError) return;
  FS.ErrnoError = /** @this{Object} */ function ErrnoError(code) {
   this.errno = code;
   this.message = "FS error";
   this.name = "ErrnoError";
  };
  FS.ErrnoError.prototype = new Error;
  FS.ErrnoError.prototype.constructor = FS.ErrnoError;
 },
 createDataFile(parent, name, fileData, canRead, canWrite, canOwn) {
  FS_createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
 },
 createPath(parent, path, canRead, canWrite) {
  var parts = path.split("/").reverse();
  while (parts.length) {
   var part = parts.pop();
   if (!part) continue;
   var current = PATH.join2(parent, part);
   if (!wasmFSPreloadingFlushed) {
    wasmFSPreloadedDirs.push({
     parentPath: parent,
     childName: part
    });
   } else {
    FS.mkdir(current);
   }
   parent = current;
  }
  return current;
 },
 createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
  return FS_createPreloadedFile(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish);
 },
 readFile(path, opts = {}) {
  opts.encoding = opts.encoding || "binary";
  if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
   throw new Error('Invalid encoding type "' + opts.encoding + '"');
  }
  var buf = withStackSave(() => __wasmfs_read_file(stringToUTF8OnStack(path)));
  var length = readI53FromI64(buf);
  var ret = new Uint8Array(GROWABLE_HEAP_U8().subarray(buf + 8 >>> 0, buf + 8 + length >>> 0));
  if (opts.encoding === "utf8") {
   ret = UTF8ArrayToString(ret, 0);
  }
  return ret;
 },
 cwd: () => UTF8ToString(__wasmfs_get_cwd()),
 analyzePath(path) {
  var exists = !!FS.findObject(path);
  return {
   exists: exists,
   object: {
    contents: exists ? FS.readFile(path) : null
   }
  };
 },
 mkdir: (path, mode) => FS_mkdir(path, mode),
 mkdirTree: (path, mode) => FS_mkdirTree(path, mode),
 rmdir: path => FS.handleError(withStackSave(() => __wasmfs_rmdir(stringToUTF8OnStack(path)))),
 open: (path, flags, mode) => withStackSave(() => {
  flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
  mode = typeof mode == "undefined" ? 438 : /* 0666 */ mode;
  var buffer = stringToUTF8OnStack(path);
  var fd = FS.handleError(__wasmfs_open(buffer, flags, mode));
  return {
   fd: fd
  };
 }),
 create: (path, mode) => FS_create(path, mode),
 close: stream => FS.handleError(-__wasmfs_close(stream.fd)),
 unlink: path => FS_unlink(path),
 chdir: path => withStackSave(() => {
  var buffer = stringToUTF8OnStack(path);
  return __wasmfs_chdir(buffer);
 }),
 read(stream, buffer, offset, length, position) {
  var seeking = typeof position != "undefined";
  var dataBuffer = _malloc(length);
  var bytesRead;
  if (seeking) {
   bytesRead = __wasmfs_pread(stream.fd, dataBuffer, length, position);
  } else {
   bytesRead = __wasmfs_read(stream.fd, dataBuffer, length);
  }
  bytesRead = FS.handleError(bytesRead);
  for (var i = 0; i < length; i++) {
   buffer[offset + i] = GROWABLE_HEAP_I8()[(dataBuffer) + (i) >>> 0];
  }
  _free(dataBuffer);
  return bytesRead;
 },
 write(stream, buffer, offset, length, position, canOwn) {
  var seeking = typeof position != "undefined";
  var dataBuffer = _malloc(length);
  for (var i = 0; i < length; i++) {
   GROWABLE_HEAP_I8()[(dataBuffer) + (i) >>> 0] = buffer[offset + i];
  }
  var bytesRead;
  if (seeking) {
   bytesRead = __wasmfs_pwrite(stream.fd, dataBuffer, length, position);
  } else {
   bytesRead = __wasmfs_write(stream.fd, dataBuffer, length);
  }
  bytesRead = FS.handleError(bytesRead);
  _free(dataBuffer);
  return bytesRead;
 },
 allocate(stream, offset, length) {
  return FS.handleError(__wasmfs_allocate(stream.fd, BigInt(offset), BigInt(length)));
 },
 writeFile: (path, data) => FS_writeFile(path, data),
 mmap: (stream, length, offset, prot, flags) => {
  var buf = FS.handleError(__wasmfs_mmap(length, prot, flags, stream.fd, BigInt(offset)));
  return {
   ptr: buf,
   allocated: true
  };
 },
 msync: (stream, bufferPtr, offset, length, mmapFlags) => {
  assert(offset === 0);
  return FS.handleError(__wasmfs_msync(bufferPtr, length, mmapFlags));
 },
 munmap: (addr, length) => (FS.handleError(__wasmfs_munmap(addr, length))),
 symlink: (target, linkpath) => withStackSave(() => (__wasmfs_symlink(stringToUTF8OnStack(target), stringToUTF8OnStack(linkpath)))),
 readlink(path) {
  var readBuffer = FS.handleError(withStackSave(() => __wasmfs_readlink(stringToUTF8OnStack(path))));
  return UTF8ToString(readBuffer);
 },
 statBufToObject(statBuf) {
  return {
   dev: GROWABLE_HEAP_U32()[((statBuf) >>> 2) >>> 0],
   mode: GROWABLE_HEAP_U32()[(((statBuf) + (4)) >>> 2) >>> 0],
   nlink: GROWABLE_HEAP_U32()[(((statBuf) + (8)) >>> 2) >>> 0],
   uid: GROWABLE_HEAP_U32()[(((statBuf) + (12)) >>> 2) >>> 0],
   gid: GROWABLE_HEAP_U32()[(((statBuf) + (16)) >>> 2) >>> 0],
   rdev: GROWABLE_HEAP_U32()[(((statBuf) + (20)) >>> 2) >>> 0],
   size: readI53FromI64((statBuf) + (24)),
   blksize: GROWABLE_HEAP_U32()[(((statBuf) + (32)) >>> 2) >>> 0],
   blocks: GROWABLE_HEAP_U32()[(((statBuf) + (36)) >>> 2) >>> 0],
   atime: readI53FromI64((statBuf) + (40)),
   mtime: readI53FromI64((statBuf) + (56)),
   ctime: readI53FromI64((statBuf) + (72)),
   ino: readI53FromU64((statBuf) + (88))
  };
 },
 stat(path) {
  var statBuf = _malloc(96);
  FS.handleError(withStackSave(() => __wasmfs_stat(stringToUTF8OnStack(path), statBuf)));
  var stats = FS.statBufToObject(statBuf);
  _free(statBuf);
  return stats;
 },
 lstat(path) {
  var statBuf = _malloc(96);
  FS.handleError(withStackSave(() => __wasmfs_lstat(stringToUTF8OnStack(path), statBuf)));
  var stats = FS.statBufToObject(statBuf);
  _free(statBuf);
  return stats;
 },
 chmod(path, mode) {
  return FS.handleError(withStackSave(() => {
   var buffer = stringToUTF8OnStack(path);
   return __wasmfs_chmod(buffer, mode);
  }));
 },
 lchmod(path, mode) {
  return FS.handleError(withStackSave(() => {
   var buffer = stringToUTF8OnStack(path);
   return __wasmfs_lchmod(buffer, mode);
  }));
 },
 fchmod(fd, mode) {
  return FS.handleError(__wasmfs_fchmod(fd, mode));
 },
 utime: (path, atime, mtime) => (FS.handleError(withStackSave(() => (__wasmfs_utime(stringToUTF8OnStack(path), atime, mtime))))),
 truncate(path, len) {
  return FS.handleError(withStackSave(() => (__wasmfs_truncate(stringToUTF8OnStack(path), BigInt(len)))));
 },
 ftruncate(fd, len) {
  return FS.handleError(__wasmfs_ftruncate(fd, BigInt(len)));
 },
 findObject(path) {
  var result = withStackSave(() => __wasmfs_identify(stringToUTF8OnStack(path)));
  if (result == 44) {
   return null;
  }
  return {
   isFolder: result == 31,
   isDevice: false
  };
 },
 readdir: path => withStackSave(() => {
  var pathBuffer = stringToUTF8OnStack(path);
  var entries = [];
  var state = __wasmfs_readdir_start(pathBuffer);
  if (!state) {
   throw new Error("No such directory");
  }
  var entry;
  while (entry = __wasmfs_readdir_get(state)) {
   entries.push(UTF8ToString(entry));
  }
  __wasmfs_readdir_finish(state);
  return entries;
 }),
 mount: (type, opts, mountpoint) => {
  var backendPointer = type.createBackend(opts);
  return FS.handleError(withStackSave(() => __wasmfs_mount(stringToUTF8OnStack(mountpoint), backendPointer)));
 },
 unmount: mountpoint => (FS.handleError(withStackSave(() => __wasmfs_unmount(stringToUTF8OnStack(mountpoint))))),
 mknod: (path, mode, dev) => FS_mknod(path, mode, dev),
 makedev: (ma, mi) => ((ma) << 8 | (mi)),
 registerDevice(dev, ops) {
  var backendPointer = _wasmfs_create_jsimpl_backend();
  var definedOps = {
   userRead: ops.read,
   userWrite: ops.write,
   allocFile: file => {
    wasmFSDeviceStreams[file] = {};
   },
   freeFile: file => {
    wasmFSDeviceStreams[file] = undefined;
   },
   getSize: file => {},
   read: (file, buffer, length, offset) => {
    var bufferArray = Module.HEAP8.subarray(buffer, buffer + length);
    try {
     var bytesRead = definedOps.userRead(wasmFSDeviceStreams[file], bufferArray, 0, length, offset);
    } catch (e) {
     return -e.errno;
    }
    Module.HEAP8.set(bufferArray, buffer);
    return bytesRead;
   },
   write: (file, buffer, length, offset) => {
    var bufferArray = Module.HEAP8.subarray(buffer, buffer + length);
    try {
     var bytesWritten = definedOps.userWrite(wasmFSDeviceStreams[file], bufferArray, 0, length, offset);
    } catch (e) {
     return -e.errno;
    }
    Module.HEAP8.set(bufferArray, buffer);
    return bytesWritten;
   }
  };
  wasmFS$backends[backendPointer] = definedOps;
  wasmFSDevices[dev] = backendPointer;
 },
 createDevice(parent, name, input, output) {
  if (typeof parent != "string") {
   throw new Error("Only string paths are accepted");
  }
  var path = PATH.join2(parent, name);
  var mode = FS_getMode(!!input, !!output);
  if (!FS.createDevice.major) FS.createDevice.major = 64;
  var dev = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(dev, {
   read(stream, buffer, offset, length, pos) {
    /* ignored */ var bytesRead = 0;
    for (var i = 0; i < length; i++) {
     var result;
     try {
      result = input();
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
     if (result === undefined && bytesRead === 0) {
      throw new FS.ErrnoError(6);
     }
     if (result === null || result === undefined) break;
     bytesRead++;
     buffer[offset + i] = result;
    }
    return bytesRead;
   },
   write(stream, buffer, offset, length, pos) {
    for (var i = 0; i < length; i++) {
     try {
      output(buffer[offset + i]);
     } catch (e) {
      throw new FS.ErrnoError(29);
     }
    }
    return i;
   }
  });
  return FS.mkdev(path, mode, dev);
 },
 mkdev(path, mode, dev) {
  if (typeof dev === "undefined") {
   dev = mode;
   mode = 438;
  }
  var deviceBackend = wasmFSDevices[dev];
  if (!deviceBackend) {
   throw new Error("Invalid device ID.");
  }
  return FS.handleError(withStackSave(() => (_wasmfs_create_file(stringToUTF8OnStack(path), mode, deviceBackend))));
 },
 rename(oldPath, newPath) {
  return FS.handleError(withStackSave(() => {
   var oldPathBuffer = stringToUTF8OnStack(oldPath);
   var newPathBuffer = stringToUTF8OnStack(newPath);
   return __wasmfs_rename(oldPathBuffer, newPathBuffer);
  }));
 },
 llseek(stream, offset, whence) {
  return FS.handleError(__wasmfs_llseek(stream.fd, BigInt(offset), whence));
 }
};

var getCFunc = ident => {
 var func = Module["_" + ident];
 return func;
};

/**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */ var ccall = (ident, returnType, argTypes, args, opts) => {
 var toC = {
  "string": str => {
   var ret = 0;
   if (str !== null && str !== undefined && str !== 0) {
    ret = stringToUTF8OnStack(str);
   }
   return ret;
  },
  "array": arr => {
   var ret = stackAlloc(arr.length);
   writeArrayToMemory(arr, ret);
   return ret;
  }
 };
 function convertReturnValue(ret) {
  if (returnType === "string") {
   return UTF8ToString(ret);
  }
  if (returnType === "boolean") return Boolean(ret);
  return ret;
 }
 var func = getCFunc(ident);
 var cArgs = [];
 var stack = 0;
 if (args) {
  for (var i = 0; i < args.length; i++) {
   var converter = toC[argTypes[i]];
   if (converter) {
    if (stack === 0) stack = stackSave();
    cArgs[i] = converter(args[i]);
   } else {
    cArgs[i] = args[i];
   }
  }
 }
 var ret = func(...cArgs);
 function onDone(ret) {
  if (stack !== 0) stackRestore(stack);
  return convertReturnValue(ret);
 }
 ret = onDone(ret);
 return ret;
};

/**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */ var cwrap = (ident, returnType, argTypes, opts) => {
 var numericArgs = !argTypes || argTypes.every(type => type === "number" || type === "boolean");
 var numericRet = returnType !== "string";
 if (numericRet && numericArgs && !opts) {
  return getCFunc(ident);
 }
 return (...args) => ccall(ident, returnType, argTypes, args, opts);
};

var uleb128Encode = (n, target) => {
 if (n < 128) {
  target.push(n);
 } else {
  target.push((n % 128) | 128, n >> 7);
 }
};

var sigToWasmTypes = sig => {
 var typeNames = {
  "i": "i32",
  "j": "i64",
  "f": "f32",
  "d": "f64",
  "e": "externref",
  "p": "i32"
 };
 var type = {
  parameters: [],
  results: sig[0] == "v" ? [] : [ typeNames[sig[0]] ]
 };
 for (var i = 1; i < sig.length; ++i) {
  type.parameters.push(typeNames[sig[i]]);
 }
 return type;
};

var generateFuncType = (sig, target) => {
 var sigRet = sig.slice(0, 1);
 var sigParam = sig.slice(1);
 var typeCodes = {
  "i": 127,
  "p": 127,
  "j": 126,
  "f": 125,
  "d": 124,
  "e": 111
 };
 target.push(96);
 /* form: func */ uleb128Encode(sigParam.length, target);
 for (var i = 0; i < sigParam.length; ++i) {
  target.push(typeCodes[sigParam[i]]);
 }
 if (sigRet == "v") {
  target.push(0);
 } else {
  target.push(1, typeCodes[sigRet]);
 }
};

var convertJsFunctionToWasm = (func, sig) => {
 if (typeof WebAssembly.Function == "function") {
  return new WebAssembly.Function(sigToWasmTypes(sig), func);
 }
 var typeSectionBody = [ 1 ];
 generateFuncType(sig, typeSectionBody);
 var bytes = [ 0, 97, 115, 109, 1, 0, 0, 0, 1 ];
 uleb128Encode(typeSectionBody.length, bytes);
 bytes.push(...typeSectionBody);
 bytes.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
 var module = new WebAssembly.Module(new Uint8Array(bytes));
 var instance = new WebAssembly.Instance(module, {
  "e": {
   "f": func
  }
 });
 var wrappedFunc = instance.exports["f"];
 return wrappedFunc;
};

var updateTableMap = (offset, count) => {
 if (functionsInTableMap) {
  for (var i = offset; i < offset + count; i++) {
   var item = getWasmTableEntry(i);
   if (item) {
    functionsInTableMap.set(item, i);
   }
  }
 }
};

var functionsInTableMap;

var getFunctionAddress = func => {
 if (!functionsInTableMap) {
  functionsInTableMap = new WeakMap;
  updateTableMap(0, wasmTable.length);
 }
 return functionsInTableMap.get(func) || 0;
};

var freeTableIndexes = [];

var getEmptyTableSlot = () => {
 if (freeTableIndexes.length) {
  return freeTableIndexes.pop();
 }
 try {
  wasmTable.grow(1);
 } catch (err) {
  if (!(err instanceof RangeError)) {
   throw err;
  }
  throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
 }
 return wasmTable.length - 1;
};

var setWasmTableEntry = (idx, func) => {
 wasmTable.set(idx, func);
 wasmTableMirror[idx] = wasmTable.get(idx);
};

/** @param {string=} sig */ var addFunction = (func, sig) => {
 var rtn = getFunctionAddress(func);
 if (rtn) {
  return rtn;
 }
 var ret = getEmptyTableSlot();
 try {
  setWasmTableEntry(ret, func);
 } catch (err) {
  if (!(err instanceof TypeError)) {
   throw err;
  }
  var wrapped = convertJsFunctionToWasm(func, sig);
  setWasmTableEntry(ret, wrapped);
 }
 functionsInTableMap.set(func, ret);
 return ret;
};

PThread.init();

var GLctx;

Module["requestFullscreen"] = Browser.requestFullscreen;

Module["requestAnimationFrame"] = Browser.requestAnimationFrame;

Module["setCanvasSize"] = Browser.setCanvasSize;

Module["pauseMainLoop"] = Browser.mainLoop.pause;

Module["resumeMainLoop"] = Browser.mainLoop.resume;

Module["getUserMedia"] = Browser.getUserMedia;

Module["createContext"] = Browser.createContext;

var preloadedImages = {};

var preloadedAudios = {};

for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));

var miniTempWebGLFloatBuffersStorage = new Float32Array(288);

for (/**@suppress{duplicate}*/ var i = 0; i < 288; ++i) {
 miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1);
}

var miniTempWebGLIntBuffersStorage = new Int32Array(288);

for (/**@suppress{duplicate}*/ var i = 0; i < 288; ++i) {
 miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i + 1);
}

Module["requestFullscreen"] = (lockPointer, resizeCanvas) => {
 GLFW3.requestFullscreen(null, lockPointer, resizeCanvas);
};

Module["glfwGetWindow"] = any => {
 const ctx = GLFW3.findContext(any);
 return ctx ? ctx.glfwWindow : null;
};

Module["glfwGetCanvas"] = any => {
 const ctx = GLFW3.findContext(any);
 return ctx ? ctx.canvas : null;
};

Module["glfwGetCanvasSelector"] = any => {
 const ctx = GLFW3.findContext(any);
 return ctx ? ctx.selector : null;
};

Module["glfwMakeCanvasResizable"] = (any, resizableSelector, handleSelector) => {
 GLFW3.makeCanvasResizable(any, resizableSelector, handleSelector);
};

Module["glfwUnmakeCanvasResizable"] = any => {
 GLFW3.unmakeCanvasResizable(any);
};

Module["glfwRequestFullscreen"] = GLFW3.requestFullscreen;

Module["glfwIsRuntimePlatformApple"] = () => _emscripten_glfw3_context_is_runtime_platform_apple();

_emscripten_glfw3_context_jspi_posttask = new WebAssembly.Suspending(_emscripten_glfw3_context_jspi_posttask);

_emscripten_glfw3_context_jspi_raf = new WebAssembly.Suspending(_emscripten_glfw3_context_jspi_raf);

_emscripten_glfw3_context_jspi_settimeout = new WebAssembly.Suspending(_emscripten_glfw3_context_jspi_settimeout);

_emscripten_glfw3_context_jspi_sleep = new WebAssembly.Suspending(_emscripten_glfw3_context_jspi_sleep);

if (typeof WebAssembly.Suspending == "function") _gex_wgpu_jspi_wait = new WebAssembly.Suspending(_gex_wgpu_jspi_wait);

DOTNET.setup({
 wasmEnableSIMD: true,
 wasmEnableEH: true,
 enableAotProfiler: false,
 enableDevToolsProfiler: false,
 enableLogProfiler: false,
 enableEventPipe: false,
 runAOTCompilation: false,
 wasmEnableThreads: true,
 wasmEnableJSPI: true,
 gitHash: "cee4bb977159390ef34fabebfeb80cd823941022"
});

if (typeof WebAssembly.Suspending == "function") _wink_js_acquire_device = new WebAssembly.Suspending(_wink_js_acquire_device);

if (typeof WebAssembly.Suspending == "function") _wink_js_yield_frame = new WebAssembly.Suspending(_wink_js_yield_frame);

FS.init();

var proxiedFunctionTable = [ _proc_exit, exitOnMainThread, pthreadCreateProxied, __emscripten_runtime_keepalive_clear, setCanvasElementSizeMainThread, __setitimer_js, _emscripten_exit_fullscreen, getCanvasSizeMainThread, _emscripten_exit_pointerlock, _emscripten_force_exit, _emscripten_get_device_pixel_ratio, _emscripten_get_element_css_size, _emscripten_get_fullscreen_status, _emscripten_get_gamepad_status, _emscripten_get_num_gamepads, _emscripten_get_screen_size, _emscripten_glfw3_context_destroy, _emscripten_glfw3_context_get_fullscreen_window, _emscripten_glfw3_context_get_pointer_lock_window, _emscripten_glfw3_context_init, _emscripten_glfw3_context_is_any_element_focused, _emscripten_glfw3_context_is_runtime_platform_apple, _emscripten_glfw3_context_keyboard_lock, _emscripten_glfw3_context_make_canvas_resizable, _emscripten_glfw3_context_open_url, _emscripten_glfw3_context_set_clipboard_string, _emscripten_glfw3_context_set_title, _emscripten_glfw3_context_unmake_canvas_resizable, _emscripten_glfw3_create_custom_cursor, _emscripten_glfw3_destroy_custom_cursor, _emscripten_glfw3_window_change_focus, _emscripten_glfw3_window_destroy, _emscripten_glfw3_window_get_computed_opacity, _emscripten_glfw3_window_get_computed_visibility, _emscripten_glfw3_window_get_position, _emscripten_glfw3_window_init, _emscripten_glfw3_window_on_created, _emscripten_glfw3_window_set_custom_cursor, _emscripten_glfw3_window_set_opacity, _emscripten_glfw3_window_set_size, _emscripten_glfw3_window_set_standard_cursor, _emscripten_glfw3_window_set_visibility, _emscripten_request_fullscreen, _emscripten_request_fullscreen_strategy, _emscripten_request_pointerlock, _emscripten_sample_gamepad_data, _emscripten_set_beforeunload_callback_on_thread, _emscripten_set_blur_callback_on_thread, _emscripten_set_devicemotion_callback_on_thread, _emscripten_set_element_css_size, _emscripten_set_focus_callback_on_thread, _emscripten_set_fullscreenchange_callback_on_thread, _emscripten_set_gamepadconnected_callback_on_thread, _emscripten_set_gamepaddisconnected_callback_on_thread, _emscripten_set_keydown_callback_on_thread, _emscripten_set_keypress_callback_on_thread, _emscripten_set_keyup_callback_on_thread, _emscripten_set_mousedown_callback_on_thread, _emscripten_set_mouseenter_callback_on_thread, _emscripten_set_mouseleave_callback_on_thread, _emscripten_set_mousemove_callback_on_thread, _emscripten_set_mouseup_callback_on_thread, _emscripten_set_orientationchange_callback_on_thread, _emscripten_set_pointerlockchange_callback_on_thread, _emscripten_set_pointerlockerror_callback_on_thread, _emscripten_set_resize_callback_on_thread, _emscripten_set_touchcancel_callback_on_thread, _emscripten_set_touchend_callback_on_thread, _emscripten_set_touchmove_callback_on_thread, _emscripten_set_touchstart_callback_on_thread, _emscripten_set_visibilitychange_callback_on_thread, _emscripten_set_wheel_callback_on_thread, _emscripten_set_window_title, _environ_get, _environ_sizes_get, _getaddrinfo, _wink_js_kick ];

var wasmImports = {
 /** @export */ __assert_fail: ___assert_fail,
 /** @export */ __call_sighandler: ___call_sighandler,
 /** @export */ __emscripten_init_main_thread_js: ___emscripten_init_main_thread_js,
 /** @export */ __emscripten_thread_cleanup: ___emscripten_thread_cleanup,
 /** @export */ __pthread_create_js: ___pthread_create_js,
 /** @export */ __pthread_kill_js: ___pthread_kill_js,
 /** @export */ _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic,
 /** @export */ _emscripten_get_progname: __emscripten_get_progname,
 /** @export */ _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
 /** @export */ _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
 /** @export */ _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
 /** @export */ _emscripten_set_offscreencanvas_size: __emscripten_set_offscreencanvas_size,
 /** @export */ _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
 /** @export */ _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
 /** @export */ _gmtime_js: __gmtime_js,
 /** @export */ _localtime_js: __localtime_js,
 /** @export */ _setitimer_js: __setitimer_js,
 /** @export */ _tzset_js: __tzset_js,
 /** @export */ _wasmfs_copy_preloaded_file_data: __wasmfs_copy_preloaded_file_data,
 /** @export */ _wasmfs_create_fetch_backend_js: __wasmfs_create_fetch_backend_js,
 /** @export */ _wasmfs_get_num_preloaded_dirs: __wasmfs_get_num_preloaded_dirs,
 /** @export */ _wasmfs_get_num_preloaded_files: __wasmfs_get_num_preloaded_files,
 /** @export */ _wasmfs_get_preloaded_child_path: __wasmfs_get_preloaded_child_path,
 /** @export */ _wasmfs_get_preloaded_file_mode: __wasmfs_get_preloaded_file_mode,
 /** @export */ _wasmfs_get_preloaded_file_size: __wasmfs_get_preloaded_file_size,
 /** @export */ _wasmfs_get_preloaded_parent_path: __wasmfs_get_preloaded_parent_path,
 /** @export */ _wasmfs_get_preloaded_path_name: __wasmfs_get_preloaded_path_name,
 /** @export */ _wasmfs_jsimpl_alloc_file: __wasmfs_jsimpl_alloc_file,
 /** @export */ _wasmfs_jsimpl_async_alloc_file: __wasmfs_jsimpl_async_alloc_file,
 /** @export */ _wasmfs_jsimpl_async_free_file: __wasmfs_jsimpl_async_free_file,
 /** @export */ _wasmfs_jsimpl_async_get_size: __wasmfs_jsimpl_async_get_size,
 /** @export */ _wasmfs_jsimpl_async_read: __wasmfs_jsimpl_async_read,
 /** @export */ _wasmfs_jsimpl_async_write: __wasmfs_jsimpl_async_write,
 /** @export */ _wasmfs_jsimpl_free_file: __wasmfs_jsimpl_free_file,
 /** @export */ _wasmfs_jsimpl_get_size: __wasmfs_jsimpl_get_size,
 /** @export */ _wasmfs_jsimpl_read: __wasmfs_jsimpl_read,
 /** @export */ _wasmfs_jsimpl_write: __wasmfs_jsimpl_write,
 /** @export */ _wasmfs_opfs_close_access: __wasmfs_opfs_close_access,
 /** @export */ _wasmfs_opfs_close_blob: __wasmfs_opfs_close_blob,
 /** @export */ _wasmfs_opfs_flush_access: __wasmfs_opfs_flush_access,
 /** @export */ _wasmfs_opfs_free_directory: __wasmfs_opfs_free_directory,
 /** @export */ _wasmfs_opfs_free_file: __wasmfs_opfs_free_file,
 /** @export */ _wasmfs_opfs_get_child: __wasmfs_opfs_get_child,
 /** @export */ _wasmfs_opfs_get_entries: __wasmfs_opfs_get_entries,
 /** @export */ _wasmfs_opfs_get_size_access: __wasmfs_opfs_get_size_access,
 /** @export */ _wasmfs_opfs_get_size_blob: __wasmfs_opfs_get_size_blob,
 /** @export */ _wasmfs_opfs_get_size_file: __wasmfs_opfs_get_size_file,
 /** @export */ _wasmfs_opfs_init_root_directory: __wasmfs_opfs_init_root_directory,
 /** @export */ _wasmfs_opfs_insert_directory: __wasmfs_opfs_insert_directory,
 /** @export */ _wasmfs_opfs_insert_file: __wasmfs_opfs_insert_file,
 /** @export */ _wasmfs_opfs_move_file: __wasmfs_opfs_move_file,
 /** @export */ _wasmfs_opfs_open_access: __wasmfs_opfs_open_access,
 /** @export */ _wasmfs_opfs_open_blob: __wasmfs_opfs_open_blob,
 /** @export */ _wasmfs_opfs_read_access: __wasmfs_opfs_read_access,
 /** @export */ _wasmfs_opfs_read_blob: __wasmfs_opfs_read_blob,
 /** @export */ _wasmfs_opfs_remove_child: __wasmfs_opfs_remove_child,
 /** @export */ _wasmfs_opfs_set_size_access: __wasmfs_opfs_set_size_access,
 /** @export */ _wasmfs_opfs_set_size_file: __wasmfs_opfs_set_size_file,
 /** @export */ _wasmfs_opfs_write_access: __wasmfs_opfs_write_access,
 /** @export */ _wasmfs_stdin_get_char: __wasmfs_stdin_get_char,
 /** @export */ _wasmfs_thread_utils_heartbeat: __wasmfs_thread_utils_heartbeat,
 /** @export */ abort: _abort,
 /** @export */ emscripten_asm_const_async_on_main_thread: _emscripten_asm_const_async_on_main_thread,
 /** @export */ emscripten_asm_const_double_sync_on_main_thread: _emscripten_asm_const_double_sync_on_main_thread,
 /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
 /** @export */ emscripten_asm_const_int_sync_on_main_thread: _emscripten_asm_const_int_sync_on_main_thread,
 /** @export */ emscripten_asm_const_ptr_sync_on_main_thread: _emscripten_asm_const_ptr_sync_on_main_thread,
 /** @export */ emscripten_cancel_main_loop: _emscripten_cancel_main_loop,
 /** @export */ emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
 /** @export */ emscripten_console_log: _emscripten_console_log,
 /** @export */ emscripten_date_now: _emscripten_date_now,
 /** @export */ emscripten_err: _emscripten_err,
 /** @export */ emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
 /** @export */ emscripten_exit_pointerlock: _emscripten_exit_pointerlock,
 /** @export */ emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
 /** @export */ emscripten_force_exit: _emscripten_force_exit,
 /** @export */ emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
 /** @export */ emscripten_get_device_pixel_ratio: _emscripten_get_device_pixel_ratio,
 /** @export */ emscripten_get_element_css_size: _emscripten_get_element_css_size,
 /** @export */ emscripten_get_fullscreen_status: _emscripten_get_fullscreen_status,
 /** @export */ emscripten_get_gamepad_status: _emscripten_get_gamepad_status,
 /** @export */ emscripten_get_heap_max: _emscripten_get_heap_max,
 /** @export */ emscripten_get_main_loop_timing: _emscripten_get_main_loop_timing,
 /** @export */ emscripten_get_now: _emscripten_get_now,
 /** @export */ emscripten_get_now_res: _emscripten_get_now_res,
 /** @export */ emscripten_get_num_gamepads: _emscripten_get_num_gamepads,
 /** @export */ emscripten_get_screen_size: _emscripten_get_screen_size,
 /** @export */ emscripten_glActiveTexture: _emscripten_glActiveTexture,
 /** @export */ emscripten_glAttachShader: _emscripten_glAttachShader,
 /** @export */ emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
 /** @export */ emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
 /** @export */ emscripten_glBindBuffer: _emscripten_glBindBuffer,
 /** @export */ emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
 /** @export */ emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
 /** @export */ emscripten_glBindTexture: _emscripten_glBindTexture,
 /** @export */ emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
 /** @export */ emscripten_glBlendColor: _emscripten_glBlendColor,
 /** @export */ emscripten_glBlendEquation: _emscripten_glBlendEquation,
 /** @export */ emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
 /** @export */ emscripten_glBlendFunc: _emscripten_glBlendFunc,
 /** @export */ emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
 /** @export */ emscripten_glBufferData: _emscripten_glBufferData,
 /** @export */ emscripten_glBufferSubData: _emscripten_glBufferSubData,
 /** @export */ emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
 /** @export */ emscripten_glClear: _emscripten_glClear,
 /** @export */ emscripten_glClearColor: _emscripten_glClearColor,
 /** @export */ emscripten_glClearDepthf: _emscripten_glClearDepthf,
 /** @export */ emscripten_glClearStencil: _emscripten_glClearStencil,
 /** @export */ emscripten_glColorMask: _emscripten_glColorMask,
 /** @export */ emscripten_glCompileShader: _emscripten_glCompileShader,
 /** @export */ emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
 /** @export */ emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
 /** @export */ emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
 /** @export */ emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
 /** @export */ emscripten_glCreateProgram: _emscripten_glCreateProgram,
 /** @export */ emscripten_glCreateShader: _emscripten_glCreateShader,
 /** @export */ emscripten_glCullFace: _emscripten_glCullFace,
 /** @export */ emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
 /** @export */ emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
 /** @export */ emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
 /** @export */ emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
 /** @export */ emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
 /** @export */ emscripten_glDeleteShader: _emscripten_glDeleteShader,
 /** @export */ emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
 /** @export */ emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
 /** @export */ emscripten_glDepthFunc: _emscripten_glDepthFunc,
 /** @export */ emscripten_glDepthMask: _emscripten_glDepthMask,
 /** @export */ emscripten_glDepthRangef: _emscripten_glDepthRangef,
 /** @export */ emscripten_glDetachShader: _emscripten_glDetachShader,
 /** @export */ emscripten_glDisable: _emscripten_glDisable,
 /** @export */ emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
 /** @export */ emscripten_glDrawArrays: _emscripten_glDrawArrays,
 /** @export */ emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
 /** @export */ emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
 /** @export */ emscripten_glDrawElements: _emscripten_glDrawElements,
 /** @export */ emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
 /** @export */ emscripten_glEnable: _emscripten_glEnable,
 /** @export */ emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
 /** @export */ emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
 /** @export */ emscripten_glFinish: _emscripten_glFinish,
 /** @export */ emscripten_glFlush: _emscripten_glFlush,
 /** @export */ emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
 /** @export */ emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
 /** @export */ emscripten_glFrontFace: _emscripten_glFrontFace,
 /** @export */ emscripten_glGenBuffers: _emscripten_glGenBuffers,
 /** @export */ emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
 /** @export */ emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
 /** @export */ emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
 /** @export */ emscripten_glGenTextures: _emscripten_glGenTextures,
 /** @export */ emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
 /** @export */ emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
 /** @export */ emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
 /** @export */ emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
 /** @export */ emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
 /** @export */ emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
 /** @export */ emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
 /** @export */ emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
 /** @export */ emscripten_glGetError: _emscripten_glGetError,
 /** @export */ emscripten_glGetFloatv: _emscripten_glGetFloatv,
 /** @export */ emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
 /** @export */ emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
 /** @export */ emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
 /** @export */ emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
 /** @export */ emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
 /** @export */ emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
 /** @export */ emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
 /** @export */ emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
 /** @export */ emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
 /** @export */ emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
 /** @export */ emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
 /** @export */ emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
 /** @export */ emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
 /** @export */ emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
 /** @export */ emscripten_glGetString: _emscripten_glGetString,
 /** @export */ emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
 /** @export */ emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
 /** @export */ emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
 /** @export */ emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
 /** @export */ emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
 /** @export */ emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
 /** @export */ emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
 /** @export */ emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
 /** @export */ emscripten_glHint: _emscripten_glHint,
 /** @export */ emscripten_glIsBuffer: _emscripten_glIsBuffer,
 /** @export */ emscripten_glIsEnabled: _emscripten_glIsEnabled,
 /** @export */ emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
 /** @export */ emscripten_glIsProgram: _emscripten_glIsProgram,
 /** @export */ emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
 /** @export */ emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
 /** @export */ emscripten_glIsShader: _emscripten_glIsShader,
 /** @export */ emscripten_glIsTexture: _emscripten_glIsTexture,
 /** @export */ emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
 /** @export */ emscripten_glLineWidth: _emscripten_glLineWidth,
 /** @export */ emscripten_glLinkProgram: _emscripten_glLinkProgram,
 /** @export */ emscripten_glPixelStorei: _emscripten_glPixelStorei,
 /** @export */ emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
 /** @export */ emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
 /** @export */ emscripten_glReadPixels: _emscripten_glReadPixels,
 /** @export */ emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
 /** @export */ emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
 /** @export */ emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
 /** @export */ emscripten_glScissor: _emscripten_glScissor,
 /** @export */ emscripten_glShaderBinary: _emscripten_glShaderBinary,
 /** @export */ emscripten_glShaderSource: _emscripten_glShaderSource,
 /** @export */ emscripten_glStencilFunc: _emscripten_glStencilFunc,
 /** @export */ emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
 /** @export */ emscripten_glStencilMask: _emscripten_glStencilMask,
 /** @export */ emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
 /** @export */ emscripten_glStencilOp: _emscripten_glStencilOp,
 /** @export */ emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
 /** @export */ emscripten_glTexImage2D: _emscripten_glTexImage2D,
 /** @export */ emscripten_glTexParameterf: _emscripten_glTexParameterf,
 /** @export */ emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
 /** @export */ emscripten_glTexParameteri: _emscripten_glTexParameteri,
 /** @export */ emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
 /** @export */ emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
 /** @export */ emscripten_glUniform1f: _emscripten_glUniform1f,
 /** @export */ emscripten_glUniform1fv: _emscripten_glUniform1fv,
 /** @export */ emscripten_glUniform1i: _emscripten_glUniform1i,
 /** @export */ emscripten_glUniform1iv: _emscripten_glUniform1iv,
 /** @export */ emscripten_glUniform2f: _emscripten_glUniform2f,
 /** @export */ emscripten_glUniform2fv: _emscripten_glUniform2fv,
 /** @export */ emscripten_glUniform2i: _emscripten_glUniform2i,
 /** @export */ emscripten_glUniform2iv: _emscripten_glUniform2iv,
 /** @export */ emscripten_glUniform3f: _emscripten_glUniform3f,
 /** @export */ emscripten_glUniform3fv: _emscripten_glUniform3fv,
 /** @export */ emscripten_glUniform3i: _emscripten_glUniform3i,
 /** @export */ emscripten_glUniform3iv: _emscripten_glUniform3iv,
 /** @export */ emscripten_glUniform4f: _emscripten_glUniform4f,
 /** @export */ emscripten_glUniform4fv: _emscripten_glUniform4fv,
 /** @export */ emscripten_glUniform4i: _emscripten_glUniform4i,
 /** @export */ emscripten_glUniform4iv: _emscripten_glUniform4iv,
 /** @export */ emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
 /** @export */ emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
 /** @export */ emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
 /** @export */ emscripten_glUseProgram: _emscripten_glUseProgram,
 /** @export */ emscripten_glValidateProgram: _emscripten_glValidateProgram,
 /** @export */ emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
 /** @export */ emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
 /** @export */ emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
 /** @export */ emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
 /** @export */ emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
 /** @export */ emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
 /** @export */ emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
 /** @export */ emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
 /** @export */ emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
 /** @export */ emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
 /** @export */ emscripten_glViewport: _emscripten_glViewport,
 /** @export */ emscripten_glfw3_context_destroy: _emscripten_glfw3_context_destroy,
 /** @export */ emscripten_glfw3_context_get_fullscreen_window: _emscripten_glfw3_context_get_fullscreen_window,
 /** @export */ emscripten_glfw3_context_get_now: _emscripten_glfw3_context_get_now,
 /** @export */ emscripten_glfw3_context_get_pointer_lock_window: _emscripten_glfw3_context_get_pointer_lock_window,
 /** @export */ emscripten_glfw3_context_init: _emscripten_glfw3_context_init,
 /** @export */ emscripten_glfw3_context_is_any_element_focused: _emscripten_glfw3_context_is_any_element_focused,
 /** @export */ emscripten_glfw3_context_is_runtime_platform_apple: _emscripten_glfw3_context_is_runtime_platform_apple,
 /** @export */ emscripten_glfw3_context_jspi_posttask: _emscripten_glfw3_context_jspi_posttask,
 /** @export */ emscripten_glfw3_context_jspi_raf: _emscripten_glfw3_context_jspi_raf,
 /** @export */ emscripten_glfw3_context_jspi_settimeout: _emscripten_glfw3_context_jspi_settimeout,
 /** @export */ emscripten_glfw3_context_jspi_sleep: _emscripten_glfw3_context_jspi_sleep,
 /** @export */ emscripten_glfw3_context_keyboard_lock: _emscripten_glfw3_context_keyboard_lock,
 /** @export */ emscripten_glfw3_context_make_canvas_resizable: _emscripten_glfw3_context_make_canvas_resizable,
 /** @export */ emscripten_glfw3_context_open_url: _emscripten_glfw3_context_open_url,
 /** @export */ emscripten_glfw3_context_set_clipboard_string: _emscripten_glfw3_context_set_clipboard_string,
 /** @export */ emscripten_glfw3_context_set_title: _emscripten_glfw3_context_set_title,
 /** @export */ emscripten_glfw3_context_unmake_canvas_resizable: _emscripten_glfw3_context_unmake_canvas_resizable,
 /** @export */ emscripten_glfw3_create_custom_cursor: _emscripten_glfw3_create_custom_cursor,
 /** @export */ emscripten_glfw3_destroy_custom_cursor: _emscripten_glfw3_destroy_custom_cursor,
 /** @export */ emscripten_glfw3_window_change_focus: _emscripten_glfw3_window_change_focus,
 /** @export */ emscripten_glfw3_window_destroy: _emscripten_glfw3_window_destroy,
 /** @export */ emscripten_glfw3_window_get_computed_opacity: _emscripten_glfw3_window_get_computed_opacity,
 /** @export */ emscripten_glfw3_window_get_computed_visibility: _emscripten_glfw3_window_get_computed_visibility,
 /** @export */ emscripten_glfw3_window_get_position: _emscripten_glfw3_window_get_position,
 /** @export */ emscripten_glfw3_window_init: _emscripten_glfw3_window_init,
 /** @export */ emscripten_glfw3_window_on_created: _emscripten_glfw3_window_on_created,
 /** @export */ emscripten_glfw3_window_resize_offscreen_local: _emscripten_glfw3_window_resize_offscreen_local,
 /** @export */ emscripten_glfw3_window_set_custom_cursor: _emscripten_glfw3_window_set_custom_cursor,
 /** @export */ emscripten_glfw3_window_set_opacity: _emscripten_glfw3_window_set_opacity,
 /** @export */ emscripten_glfw3_window_set_size: _emscripten_glfw3_window_set_size,
 /** @export */ emscripten_glfw3_window_set_standard_cursor: _emscripten_glfw3_window_set_standard_cursor,
 /** @export */ emscripten_glfw3_window_set_visibility: _emscripten_glfw3_window_set_visibility,
 /** @export */ emscripten_has_asyncify: _emscripten_has_asyncify,
 /** @export */ emscripten_num_logical_cores: _emscripten_num_logical_cores,
 /** @export */ emscripten_out: _emscripten_out,
 /** @export */ emscripten_request_fullscreen: _emscripten_request_fullscreen,
 /** @export */ emscripten_request_fullscreen_strategy: _emscripten_request_fullscreen_strategy,
 /** @export */ emscripten_request_pointerlock: _emscripten_request_pointerlock,
 /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
 /** @export */ emscripten_sample_gamepad_data: _emscripten_sample_gamepad_data,
 /** @export */ emscripten_set_beforeunload_callback_on_thread: _emscripten_set_beforeunload_callback_on_thread,
 /** @export */ emscripten_set_blur_callback_on_thread: _emscripten_set_blur_callback_on_thread,
 /** @export */ emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
 /** @export */ emscripten_set_devicemotion_callback_on_thread: _emscripten_set_devicemotion_callback_on_thread,
 /** @export */ emscripten_set_element_css_size: _emscripten_set_element_css_size,
 /** @export */ emscripten_set_focus_callback_on_thread: _emscripten_set_focus_callback_on_thread,
 /** @export */ emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
 /** @export */ emscripten_set_gamepadconnected_callback_on_thread: _emscripten_set_gamepadconnected_callback_on_thread,
 /** @export */ emscripten_set_gamepaddisconnected_callback_on_thread: _emscripten_set_gamepaddisconnected_callback_on_thread,
 /** @export */ emscripten_set_keydown_callback_on_thread: _emscripten_set_keydown_callback_on_thread,
 /** @export */ emscripten_set_keypress_callback_on_thread: _emscripten_set_keypress_callback_on_thread,
 /** @export */ emscripten_set_keyup_callback_on_thread: _emscripten_set_keyup_callback_on_thread,
 /** @export */ emscripten_set_main_loop: _emscripten_set_main_loop,
 /** @export */ emscripten_set_main_loop_timing: _emscripten_set_main_loop_timing,
 /** @export */ emscripten_set_mousedown_callback_on_thread: _emscripten_set_mousedown_callback_on_thread,
 /** @export */ emscripten_set_mouseenter_callback_on_thread: _emscripten_set_mouseenter_callback_on_thread,
 /** @export */ emscripten_set_mouseleave_callback_on_thread: _emscripten_set_mouseleave_callback_on_thread,
 /** @export */ emscripten_set_mousemove_callback_on_thread: _emscripten_set_mousemove_callback_on_thread,
 /** @export */ emscripten_set_mouseup_callback_on_thread: _emscripten_set_mouseup_callback_on_thread,
 /** @export */ emscripten_set_orientationchange_callback_on_thread: _emscripten_set_orientationchange_callback_on_thread,
 /** @export */ emscripten_set_pointerlockchange_callback_on_thread: _emscripten_set_pointerlockchange_callback_on_thread,
 /** @export */ emscripten_set_pointerlockerror_callback_on_thread: _emscripten_set_pointerlockerror_callback_on_thread,
 /** @export */ emscripten_set_resize_callback_on_thread: _emscripten_set_resize_callback_on_thread,
 /** @export */ emscripten_set_timeout: _emscripten_set_timeout,
 /** @export */ emscripten_set_touchcancel_callback_on_thread: _emscripten_set_touchcancel_callback_on_thread,
 /** @export */ emscripten_set_touchend_callback_on_thread: _emscripten_set_touchend_callback_on_thread,
 /** @export */ emscripten_set_touchmove_callback_on_thread: _emscripten_set_touchmove_callback_on_thread,
 /** @export */ emscripten_set_touchstart_callback_on_thread: _emscripten_set_touchstart_callback_on_thread,
 /** @export */ emscripten_set_visibilitychange_callback_on_thread: _emscripten_set_visibilitychange_callback_on_thread,
 /** @export */ emscripten_set_wheel_callback_on_thread: _emscripten_set_wheel_callback_on_thread,
 /** @export */ emscripten_set_window_title: _emscripten_set_window_title,
 /** @export */ emscripten_sleep: _emscripten_sleep,
 /** @export */ emscripten_unwind_to_js_event_loop: _emscripten_unwind_to_js_event_loop,
 /** @export */ emscripten_webgl_create_context: _emscripten_webgl_create_context,
 /** @export */ emscripten_webgl_destroy_context: _emscripten_webgl_destroy_context,
 /** @export */ emscripten_webgl_make_context_current: _emscripten_webgl_make_context_current,
 /** @export */ emwgpuBufferDestroy: _emwgpuBufferDestroy,
 /** @export */ emwgpuBufferMapAsync: _emwgpuBufferMapAsync,
 /** @export */ emwgpuBufferReadMappedRange: _emwgpuBufferReadMappedRange,
 /** @export */ emwgpuBufferUnmap: _emwgpuBufferUnmap,
 /** @export */ emwgpuDelete: _emwgpuDelete,
 /** @export */ emwgpuDeviceCreateBuffer: _emwgpuDeviceCreateBuffer,
 /** @export */ emwgpuDeviceCreateShaderModule: _emwgpuDeviceCreateShaderModule,
 /** @export */ emwgpuDeviceDestroy: _emwgpuDeviceDestroy,
 /** @export */ environ_get: _environ_get,
 /** @export */ environ_sizes_get: _environ_sizes_get,
 /** @export */ exit: _exit,
 /** @export */ ffi_call_js: ffi_call_js,
 /** @export */ getaddrinfo: _getaddrinfo,
 /** @export */ getentropy: _getentropy,
 /** @export */ getnameinfo: _getnameinfo,
 /** @export */ gex_wgpu_jspi_signal: _gex_wgpu_jspi_signal,
 /** @export */ gex_wgpu_jspi_wait: _gex_wgpu_jspi_wait,
 /** @export */ memory: wasmMemory || Module["wasmMemory"],
 /** @export */ mono_interp_flush_jitcall_queue: _mono_interp_flush_jitcall_queue,
 /** @export */ mono_interp_invoke_wasm_jit_call_trampoline: _mono_interp_invoke_wasm_jit_call_trampoline,
 /** @export */ mono_interp_jit_wasm_entry_trampoline: _mono_interp_jit_wasm_entry_trampoline,
 /** @export */ mono_interp_jit_wasm_jit_call_trampoline: _mono_interp_jit_wasm_jit_call_trampoline,
 /** @export */ mono_interp_record_interp_entry: _mono_interp_record_interp_entry,
 /** @export */ mono_interp_tier_prepare_jiterpreter: _mono_interp_tier_prepare_jiterpreter,
 /** @export */ mono_jiterp_wasm_jit_patch_interp_entry: _mono_jiterp_wasm_jit_patch_interp_entry,
 /** @export */ mono_jiterp_wasm_jit_unpatch_interp_entry: _mono_jiterp_wasm_jit_unpatch_interp_entry,
 /** @export */ mono_wasm_browser_entropy: _mono_wasm_browser_entropy,
 /** @export */ mono_wasm_cancel_promise: _mono_wasm_cancel_promise,
 /** @export */ mono_wasm_console_clear: _mono_wasm_console_clear,
 /** @export */ mono_wasm_dump_threads: _mono_wasm_dump_threads,
 /** @export */ mono_wasm_free_method_data: _mono_wasm_free_method_data,
 /** @export */ mono_wasm_get_locale_info: _mono_wasm_get_locale_info,
 /** @export */ mono_wasm_install_js_worker_interop: _mono_wasm_install_js_worker_interop,
 /** @export */ mono_wasm_invoke_js_function: _mono_wasm_invoke_js_function,
 /** @export */ mono_wasm_invoke_jsimport_MT: _mono_wasm_invoke_jsimport_MT,
 /** @export */ mono_wasm_process_current_pid: _mono_wasm_process_current_pid,
 /** @export */ mono_wasm_pthread_on_pthread_attached: _mono_wasm_pthread_on_pthread_attached,
 /** @export */ mono_wasm_pthread_on_pthread_registered: _mono_wasm_pthread_on_pthread_registered,
 /** @export */ mono_wasm_pthread_on_pthread_unregistered: _mono_wasm_pthread_on_pthread_unregistered,
 /** @export */ mono_wasm_pthread_set_name: _mono_wasm_pthread_set_name,
 /** @export */ mono_wasm_release_cs_owned_object: _mono_wasm_release_cs_owned_object,
 /** @export */ mono_wasm_resolve_or_reject_promise: _mono_wasm_resolve_or_reject_promise,
 /** @export */ mono_wasm_schedule_synchronization_context: _mono_wasm_schedule_synchronization_context,
 /** @export */ mono_wasm_set_entrypoint_breakpoint: _mono_wasm_set_entrypoint_breakpoint,
 /** @export */ mono_wasm_start_deputy_thread_async: _mono_wasm_start_deputy_thread_async,
 /** @export */ mono_wasm_start_io_thread_async: _mono_wasm_start_io_thread_async,
 /** @export */ mono_wasm_trace_logger: _mono_wasm_trace_logger,
 /** @export */ mono_wasm_uninstall_js_worker_interop: _mono_wasm_uninstall_js_worker_interop,
 /** @export */ mono_wasm_warn_about_blocking_wait: _mono_wasm_warn_about_blocking_wait,
 /** @export */ proc_exit: _proc_exit,
 /** @export */ strftime: _strftime,
 /** @export */ strftime_l: _strftime_l,
 /** @export */ wgpuCommandEncoderBeginComputePass: _wgpuCommandEncoderBeginComputePass,
 /** @export */ wgpuCommandEncoderBeginRenderPass: _wgpuCommandEncoderBeginRenderPass,
 /** @export */ wgpuCommandEncoderClearBuffer: _wgpuCommandEncoderClearBuffer,
 /** @export */ wgpuCommandEncoderCopyBufferToBuffer: _wgpuCommandEncoderCopyBufferToBuffer,
 /** @export */ wgpuCommandEncoderCopyBufferToTexture: _wgpuCommandEncoderCopyBufferToTexture,
 /** @export */ wgpuCommandEncoderCopyTextureToBuffer: _wgpuCommandEncoderCopyTextureToBuffer,
 /** @export */ wgpuCommandEncoderCopyTextureToTexture: _wgpuCommandEncoderCopyTextureToTexture,
 /** @export */ wgpuCommandEncoderFinish: _wgpuCommandEncoderFinish,
 /** @export */ wgpuCommandEncoderResolveQuerySet: _wgpuCommandEncoderResolveQuerySet,
 /** @export */ wgpuComputePassEncoderDispatchWorkgroups: _wgpuComputePassEncoderDispatchWorkgroups,
 /** @export */ wgpuComputePassEncoderEnd: _wgpuComputePassEncoderEnd,
 /** @export */ wgpuComputePassEncoderSetBindGroup: _wgpuComputePassEncoderSetBindGroup,
 /** @export */ wgpuComputePassEncoderSetPipeline: _wgpuComputePassEncoderSetPipeline,
 /** @export */ wgpuDeviceCreateBindGroup: _wgpuDeviceCreateBindGroup,
 /** @export */ wgpuDeviceCreateBindGroupLayout: _wgpuDeviceCreateBindGroupLayout,
 /** @export */ wgpuDeviceCreateCommandEncoder: _wgpuDeviceCreateCommandEncoder,
 /** @export */ wgpuDeviceCreateComputePipeline: _wgpuDeviceCreateComputePipeline,
 /** @export */ wgpuDeviceCreatePipelineLayout: _wgpuDeviceCreatePipelineLayout,
 /** @export */ wgpuDeviceCreateQuerySet: _wgpuDeviceCreateQuerySet,
 /** @export */ wgpuDeviceCreateRenderPipeline: _wgpuDeviceCreateRenderPipeline,
 /** @export */ wgpuDeviceCreateSampler: _wgpuDeviceCreateSampler,
 /** @export */ wgpuDeviceCreateTexture: _wgpuDeviceCreateTexture,
 /** @export */ wgpuDeviceGetLimits: _wgpuDeviceGetLimits,
 /** @export */ wgpuDeviceHasFeature: _wgpuDeviceHasFeature,
 /** @export */ wgpuQuerySetDestroy: _wgpuQuerySetDestroy,
 /** @export */ wgpuQueueSubmit: _wgpuQueueSubmit,
 /** @export */ wgpuQueueWriteBuffer: _wgpuQueueWriteBuffer,
 /** @export */ wgpuQueueWriteTexture: _wgpuQueueWriteTexture,
 /** @export */ wgpuRenderPassEncoderBeginOcclusionQuery: _wgpuRenderPassEncoderBeginOcclusionQuery,
 /** @export */ wgpuRenderPassEncoderDraw: _wgpuRenderPassEncoderDraw,
 /** @export */ wgpuRenderPassEncoderDrawIndexed: _wgpuRenderPassEncoderDrawIndexed,
 /** @export */ wgpuRenderPassEncoderEnd: _wgpuRenderPassEncoderEnd,
 /** @export */ wgpuRenderPassEncoderEndOcclusionQuery: _wgpuRenderPassEncoderEndOcclusionQuery,
 /** @export */ wgpuRenderPassEncoderSetBindGroup: _wgpuRenderPassEncoderSetBindGroup,
 /** @export */ wgpuRenderPassEncoderSetBlendConstant: _wgpuRenderPassEncoderSetBlendConstant,
 /** @export */ wgpuRenderPassEncoderSetIndexBuffer: _wgpuRenderPassEncoderSetIndexBuffer,
 /** @export */ wgpuRenderPassEncoderSetPipeline: _wgpuRenderPassEncoderSetPipeline,
 /** @export */ wgpuRenderPassEncoderSetScissorRect: _wgpuRenderPassEncoderSetScissorRect,
 /** @export */ wgpuRenderPassEncoderSetStencilReference: _wgpuRenderPassEncoderSetStencilReference,
 /** @export */ wgpuRenderPassEncoderSetVertexBuffer: _wgpuRenderPassEncoderSetVertexBuffer,
 /** @export */ wgpuRenderPassEncoderSetViewport: _wgpuRenderPassEncoderSetViewport,
 /** @export */ wgpuRenderPipelineGetBindGroupLayout: _wgpuRenderPipelineGetBindGroupLayout,
 /** @export */ wgpuSurfaceConfigure: _wgpuSurfaceConfigure,
 /** @export */ wgpuSurfaceGetCurrentTexture: _wgpuSurfaceGetCurrentTexture,
 /** @export */ wgpuSurfaceUnconfigure: _wgpuSurfaceUnconfigure,
 /** @export */ wgpuTextureCreateView: _wgpuTextureCreateView,
 /** @export */ wgpuTextureDestroy: _wgpuTextureDestroy,
 /** @export */ wgpuTextureGetDepthOrArrayLayers: _wgpuTextureGetDepthOrArrayLayers,
 /** @export */ wgpuTextureGetDimension: _wgpuTextureGetDimension,
 /** @export */ wgpuTextureGetHeight: _wgpuTextureGetHeight,
 /** @export */ wgpuTextureGetWidth: _wgpuTextureGetWidth,
 /** @export */ wink_js_acquire_device: _wink_js_acquire_device,
 /** @export */ wink_js_create_surface: _wink_js_create_surface,
 /** @export */ wink_js_get_env: _wink_js_get_env,
 /** @export */ wink_js_has_jspi: _wink_js_has_jspi,
 /** @export */ wink_js_kick: _wink_js_kick,
 /** @export */ wink_js_yield_frame: _wink_js_yield_frame
};

var wasmExports = createWasm();

var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["__wasm_call_ctors"])();

var _wasmfs_create_file = (a0, a1, a2) => (_wasmfs_create_file = wasmExports["wasmfs_create_file"])(a0, a1, a2);

var _perform_thread_dump = Module["_perform_thread_dump"] = () => (_perform_thread_dump = Module["_perform_thread_dump"] = wasmExports["perform_thread_dump"])();

var _ikvm_native_used_mb = Module["_ikvm_native_used_mb"] = () => (_ikvm_native_used_mb = Module["_ikvm_native_used_mb"] = wasmExports["ikvm_native_used_mb"])();

var _ikvm_gc_heap_mb = Module["_ikvm_gc_heap_mb"] = () => (_ikvm_gc_heap_mb = Module["_ikvm_gc_heap_mb"] = wasmExports["ikvm_gc_heap_mb"])();

var _ikvm_heap_top_mb = Module["_ikvm_heap_top_mb"] = () => (_ikvm_heap_top_mb = Module["_ikvm_heap_top_mb"] = wasmExports["ikvm_heap_top_mb"])();

var _sbrk = Module["_sbrk"] = a0 => (_sbrk = Module["_sbrk"] = wasmExports["sbrk"])(a0);

var _install_thread_log_forwarder = Module["_install_thread_log_forwarder"] = () => (_install_thread_log_forwarder = Module["_install_thread_log_forwarder"] = wasmExports["install_thread_log_forwarder"])();

var _pthread_self = Module["_pthread_self"] = () => (_pthread_self = Module["_pthread_self"] = wasmExports["pthread_self"])();

var _malloc = Module["_malloc"] = a0 => (_malloc = Module["_malloc"] = wasmExports["malloc"])(a0);

var _dump_jiterp_trace_heat = Module["_dump_jiterp_trace_heat"] = a0 => (_dump_jiterp_trace_heat = Module["_dump_jiterp_trace_heat"] = wasmExports["dump_jiterp_trace_heat"])(a0);

var _mono_jiterp_get_trace_count = Module["_mono_jiterp_get_trace_count"] = () => (_mono_jiterp_get_trace_count = Module["_mono_jiterp_get_trace_count"] = wasmExports["mono_jiterp_get_trace_count"])();

var _mono_jiterp_get_trace_method = Module["_mono_jiterp_get_trace_method"] = a0 => (_mono_jiterp_get_trace_method = Module["_mono_jiterp_get_trace_method"] = wasmExports["mono_jiterp_get_trace_method"])(a0);

var _mono_jiterp_get_trace_hit_count = Module["_mono_jiterp_get_trace_hit_count"] = a0 => (_mono_jiterp_get_trace_hit_count = Module["_mono_jiterp_get_trace_hit_count"] = wasmExports["mono_jiterp_get_trace_hit_count"])(a0);

var _mono_jiterp_get_trace_is_compiled = Module["_mono_jiterp_get_trace_is_compiled"] = a0 => (_mono_jiterp_get_trace_is_compiled = Module["_mono_jiterp_get_trace_is_compiled"] = wasmExports["mono_jiterp_get_trace_is_compiled"])(a0);

var _mono_jiterp_get_trace_abort_reason = Module["_mono_jiterp_get_trace_abort_reason"] = a0 => (_mono_jiterp_get_trace_abort_reason = Module["_mono_jiterp_get_trace_abort_reason"] = wasmExports["mono_jiterp_get_trace_abort_reason"])(a0);

var _free = Module["_free"] = a0 => (_free = Module["_free"] = wasmExports["free"])(a0);

var _managed_em_loop_callback = Module["_managed_em_loop_callback"] = () => (_managed_em_loop_callback = Module["_managed_em_loop_callback"] = wasmExports["managed_em_loop_callback"])();

var _htons = Module["_htons"] = a0 => (_htons = Module["_htons"] = wasmExports["htons"])(a0);

var _htonl = a0 => (_htonl = wasmExports["htonl"])(a0);

var _ntohs = Module["_ntohs"] = a0 => (_ntohs = Module["_ntohs"] = wasmExports["ntohs"])(a0);

var _memalign = Module["_memalign"] = (a0, a1) => (_memalign = Module["_memalign"] = wasmExports["memalign"])(a0, a1);

var _sin = Module["_sin"] = a0 => (_sin = Module["_sin"] = wasmExports["sin"])(a0);

var _cos = Module["_cos"] = a0 => (_cos = Module["_cos"] = wasmExports["cos"])(a0);

var _log = Module["_log"] = a0 => (_log = Module["_log"] = wasmExports["log"])(a0);

var _pow = Module["_pow"] = (a0, a1) => (_pow = Module["_pow"] = wasmExports["pow"])(a0, a1);

var _log10 = Module["_log10"] = a0 => (_log10 = Module["_log10"] = wasmExports["log10"])(a0);

var _exp = Module["_exp"] = a0 => (_exp = Module["_exp"] = wasmExports["exp"])(a0);

var _atan2 = Module["_atan2"] = (a0, a1) => (_atan2 = Module["_atan2"] = wasmExports["atan2"])(a0, a1);

var _fflush = a0 => (_fflush = wasmExports["fflush"])(a0);

var _atan = Module["_atan"] = a0 => (_atan = Module["_atan"] = wasmExports["atan"])(a0);

var _sinf = Module["_sinf"] = a0 => (_sinf = Module["_sinf"] = wasmExports["sinf"])(a0);

var _cosf = Module["_cosf"] = a0 => (_cosf = Module["_cosf"] = wasmExports["cosf"])(a0);

var _tanf = Module["_tanf"] = a0 => (_tanf = Module["_tanf"] = wasmExports["tanf"])(a0);

var _emscripten_glfw3_get_frame_count = Module["_emscripten_glfw3_get_frame_count"] = () => (_emscripten_glfw3_get_frame_count = Module["_emscripten_glfw3_get_frame_count"] = wasmExports["emscripten_glfw3_get_frame_count"])();

var _Emscripten_force_free = Module["_Emscripten_force_free"] = a0 => (_Emscripten_force_free = Module["_Emscripten_force_free"] = wasmExports["Emscripten_force_free"])(a0);

var _SDL_malloc = Module["_SDL_malloc"] = a0 => (_SDL_malloc = Module["_SDL_malloc"] = wasmExports["SDL_malloc"])(a0);

var _SDL_calloc = Module["_SDL_calloc"] = (a0, a1) => (_SDL_calloc = Module["_SDL_calloc"] = wasmExports["SDL_calloc"])(a0, a1);

var _SDL_realloc = Module["_SDL_realloc"] = (a0, a1) => (_SDL_realloc = Module["_SDL_realloc"] = wasmExports["SDL_realloc"])(a0, a1);

var _SDL_free = Module["_SDL_free"] = a0 => (_SDL_free = Module["_SDL_free"] = wasmExports["SDL_free"])(a0);

var _SDLEmscriptenCameraPermissionOutcome = Module["_SDLEmscriptenCameraPermissionOutcome"] = (a0, a1, a2, a3, a4) => (_SDLEmscriptenCameraPermissionOutcome = Module["_SDLEmscriptenCameraPermissionOutcome"] = wasmExports["SDLEmscriptenCameraPermissionOutcome"])(a0, a1, a2, a3, a4);

var _SDLEmscriptenThreadIterate = Module["_SDLEmscriptenThreadIterate"] = a0 => (_SDLEmscriptenThreadIterate = Module["_SDLEmscriptenThreadIterate"] = wasmExports["SDLEmscriptenThreadIterate"])(a0);

var _Emscripten_HandlePointerEnter = Module["_Emscripten_HandlePointerEnter"] = (a0, a1) => (_Emscripten_HandlePointerEnter = Module["_Emscripten_HandlePointerEnter"] = wasmExports["Emscripten_HandlePointerEnter"])(a0, a1);

var _Emscripten_HandlePointerLeave = Module["_Emscripten_HandlePointerLeave"] = (a0, a1) => (_Emscripten_HandlePointerLeave = Module["_Emscripten_HandlePointerLeave"] = wasmExports["Emscripten_HandlePointerLeave"])(a0, a1);

var _Emscripten_HandlePointerGeneric = Module["_Emscripten_HandlePointerGeneric"] = (a0, a1) => (_Emscripten_HandlePointerGeneric = Module["_Emscripten_HandlePointerGeneric"] = wasmExports["Emscripten_HandlePointerGeneric"])(a0, a1);

var _Emscripten_HandleMouseButtonUpGlobal = Module["_Emscripten_HandleMouseButtonUpGlobal"] = (a0, a1) => (_Emscripten_HandleMouseButtonUpGlobal = Module["_Emscripten_HandleMouseButtonUpGlobal"] = wasmExports["Emscripten_HandleMouseButtonUpGlobal"])(a0, a1);

var _Emscripten_SendDragEvent = Module["_Emscripten_SendDragEvent"] = (a0, a1) => (_Emscripten_SendDragEvent = Module["_Emscripten_SendDragEvent"] = wasmExports["Emscripten_SendDragEvent"])(a0, a1);

var _Emscripten_SendDragCompleteEvent = Module["_Emscripten_SendDragCompleteEvent"] = a0 => (_Emscripten_SendDragCompleteEvent = Module["_Emscripten_SendDragCompleteEvent"] = wasmExports["Emscripten_SendDragCompleteEvent"])(a0);

var _Emscripten_SendDragTextEvent = Module["_Emscripten_SendDragTextEvent"] = (a0, a1) => (_Emscripten_SendDragTextEvent = Module["_Emscripten_SendDragTextEvent"] = wasmExports["Emscripten_SendDragTextEvent"])(a0, a1);

var _Emscripten_SendDragFileEvent = Module["_Emscripten_SendDragFileEvent"] = (a0, a1) => (_Emscripten_SendDragFileEvent = Module["_Emscripten_SendDragFileEvent"] = wasmExports["Emscripten_SendDragFileEvent"])(a0, a1);

var _Emscripten_HandleLockKeysCheck = Module["_Emscripten_HandleLockKeysCheck"] = (a0, a1, a2, a3) => (_Emscripten_HandleLockKeysCheck = Module["_Emscripten_HandleLockKeysCheck"] = wasmExports["Emscripten_HandleLockKeysCheck"])(a0, a1, a2, a3);

var _Emscripten_SendSystemThemeChangedEvent = Module["_Emscripten_SendSystemThemeChangedEvent"] = () => (_Emscripten_SendSystemThemeChangedEvent = Module["_Emscripten_SendSystemThemeChangedEvent"] = wasmExports["Emscripten_SendSystemThemeChangedEvent"])();

var _requestFullscreenThroughSDL = Module["_requestFullscreenThroughSDL"] = a0 => (_requestFullscreenThroughSDL = Module["_requestFullscreenThroughSDL"] = wasmExports["requestFullscreenThroughSDL"])(a0);

var _wink_main_run_queue = a0 => (_wink_main_run_queue = wasmExports["wink_main_run_queue"])(a0);

var _wink_set_device_lost = () => (_wink_set_device_lost = wasmExports["wink_set_device_lost"])();

var _posix_memalign = Module["_posix_memalign"] = (a0, a1, a2) => (_posix_memalign = Module["_posix_memalign"] = wasmExports["posix_memalign"])(a0, a1, a2);

var _fmaf = Module["_fmaf"] = (a0, a1, a2) => (_fmaf = Module["_fmaf"] = wasmExports["fmaf"])(a0, a1, a2);

var _fma = Module["_fma"] = (a0, a1, a2) => (_fma = Module["_fma"] = wasmExports["fma"])(a0, a1, a2);

var _log2f = Module["_log2f"] = a0 => (_log2f = Module["_log2f"] = wasmExports["log2f"])(a0);

var _powf = Module["_powf"] = (a0, a1) => (_powf = Module["_powf"] = wasmExports["powf"])(a0, a1);

var _tanh = Module["_tanh"] = a0 => (_tanh = Module["_tanh"] = wasmExports["tanh"])(a0);

var _tanhf = Module["_tanhf"] = a0 => (_tanhf = Module["_tanhf"] = wasmExports["tanhf"])(a0);

var _log2 = Module["_log2"] = a0 => (_log2 = Module["_log2"] = wasmExports["log2"])(a0);

var _logf = Module["_logf"] = a0 => (_logf = Module["_logf"] = wasmExports["logf"])(a0);

var _expf = Module["_expf"] = a0 => (_expf = Module["_expf"] = wasmExports["expf"])(a0);

var _atanf = Module["_atanf"] = a0 => (_atanf = Module["_atanf"] = wasmExports["atanf"])(a0);

var _acosf = Module["_acosf"] = a0 => (_acosf = Module["_acosf"] = wasmExports["acosf"])(a0);

var _asinf = Module["_asinf"] = a0 => (_asinf = Module["_asinf"] = wasmExports["asinf"])(a0);

var _atan2f = Module["_atan2f"] = (a0, a1) => (_atan2f = Module["_atan2f"] = wasmExports["atan2f"])(a0, a1);

var stackSave = Module["stackSave"] = () => (stackSave = Module["stackSave"] = wasmExports["stackSave"])();

var _emscripten_stack_set_limits = (a0, a1) => (_emscripten_stack_set_limits = wasmExports["emscripten_stack_set_limits"])(a0, a1);

var stackRestore = Module["stackRestore"] = a0 => (stackRestore = Module["stackRestore"] = wasmExports["stackRestore"])(a0);

var _gex_wgsl_cache_load = Module["_gex_wgsl_cache_load"] = (a0, a1) => (_gex_wgsl_cache_load = Module["_gex_wgsl_cache_load"] = wasmExports["gex_wgsl_cache_load"])(a0, a1);

var _gex_wgsl_cache_budget = Module["_gex_wgsl_cache_budget"] = a0 => (_gex_wgsl_cache_budget = Module["_gex_wgsl_cache_budget"] = wasmExports["gex_wgsl_cache_budget"])(a0);

var _gex_wgsl_cache_dump = Module["_gex_wgsl_cache_dump"] = (a0, a1) => (_gex_wgsl_cache_dump = Module["_gex_wgsl_cache_dump"] = wasmExports["gex_wgsl_cache_dump"])(a0, a1);

var _gex_wgsl_cache_stats = Module["_gex_wgsl_cache_stats"] = a0 => (_gex_wgsl_cache_stats = Module["_gex_wgsl_cache_stats"] = wasmExports["gex_wgsl_cache_stats"])(a0);

var _gex_wgsl_cache_stats2 = Module["_gex_wgsl_cache_stats2"] = a0 => (_gex_wgsl_cache_stats2 = Module["_gex_wgsl_cache_stats2"] = wasmExports["gex_wgsl_cache_stats2"])(a0);

var _emwgpuCreateBindGroup = a0 => (_emwgpuCreateBindGroup = wasmExports["emwgpuCreateBindGroup"])(a0);

var _emwgpuCreateBindGroupLayout = a0 => (_emwgpuCreateBindGroupLayout = wasmExports["emwgpuCreateBindGroupLayout"])(a0);

var _emwgpuCreateCommandBuffer = a0 => (_emwgpuCreateCommandBuffer = wasmExports["emwgpuCreateCommandBuffer"])(a0);

var _emwgpuCreateCommandEncoder = a0 => (_emwgpuCreateCommandEncoder = wasmExports["emwgpuCreateCommandEncoder"])(a0);

var _emwgpuCreateComputePassEncoder = a0 => (_emwgpuCreateComputePassEncoder = wasmExports["emwgpuCreateComputePassEncoder"])(a0);

var _emwgpuCreateComputePipeline = a0 => (_emwgpuCreateComputePipeline = wasmExports["emwgpuCreateComputePipeline"])(a0);

var _emwgpuCreatePipelineLayout = a0 => (_emwgpuCreatePipelineLayout = wasmExports["emwgpuCreatePipelineLayout"])(a0);

var _emwgpuCreateQuerySet = a0 => (_emwgpuCreateQuerySet = wasmExports["emwgpuCreateQuerySet"])(a0);

var _emwgpuCreateRenderBundle = a0 => (_emwgpuCreateRenderBundle = wasmExports["emwgpuCreateRenderBundle"])(a0);

var _emwgpuCreateRenderBundleEncoder = a0 => (_emwgpuCreateRenderBundleEncoder = wasmExports["emwgpuCreateRenderBundleEncoder"])(a0);

var _emwgpuCreateRenderPassEncoder = a0 => (_emwgpuCreateRenderPassEncoder = wasmExports["emwgpuCreateRenderPassEncoder"])(a0);

var _emwgpuCreateRenderPipeline = a0 => (_emwgpuCreateRenderPipeline = wasmExports["emwgpuCreateRenderPipeline"])(a0);

var _emwgpuCreateSampler = a0 => (_emwgpuCreateSampler = wasmExports["emwgpuCreateSampler"])(a0);

var _emwgpuCreateSurface = a0 => (_emwgpuCreateSurface = wasmExports["emwgpuCreateSurface"])(a0);

var _emwgpuCreateTexture = a0 => (_emwgpuCreateTexture = wasmExports["emwgpuCreateTexture"])(a0);

var _emwgpuCreateTextureView = a0 => (_emwgpuCreateTextureView = wasmExports["emwgpuCreateTextureView"])(a0);

var _emwgpuCreateAdapter = a0 => (_emwgpuCreateAdapter = wasmExports["emwgpuCreateAdapter"])(a0);

var _emwgpuCreateBuffer = (a0, a1) => (_emwgpuCreateBuffer = wasmExports["emwgpuCreateBuffer"])(a0, a1);

var _emwgpuCreateDevice = (a0, a1) => (_emwgpuCreateDevice = wasmExports["emwgpuCreateDevice"])(a0, a1);

var _emwgpuCreateQueue = a0 => (_emwgpuCreateQueue = wasmExports["emwgpuCreateQueue"])(a0);

var _emwgpuCreateShaderModule = a0 => (_emwgpuCreateShaderModule = wasmExports["emwgpuCreateShaderModule"])(a0);

var _emwgpuOnCompilationInfoCompleted = (a0, a1, a2) => (_emwgpuOnCompilationInfoCompleted = wasmExports["emwgpuOnCompilationInfoCompleted"])(a0, a1, a2);

var _emwgpuOnCreateComputePipelineCompleted = (a0, a1, a2, a3) => (_emwgpuOnCreateComputePipelineCompleted = wasmExports["emwgpuOnCreateComputePipelineCompleted"])(a0, a1, a2, a3);

var _emwgpuOnCreateRenderPipelineCompleted = (a0, a1, a2, a3) => (_emwgpuOnCreateRenderPipelineCompleted = wasmExports["emwgpuOnCreateRenderPipelineCompleted"])(a0, a1, a2, a3);

var _emwgpuOnDeviceLostCompleted = (a0, a1, a2) => (_emwgpuOnDeviceLostCompleted = wasmExports["emwgpuOnDeviceLostCompleted"])(a0, a1, a2);

var _emwgpuOnMapAsyncCompleted = (a0, a1, a2) => (_emwgpuOnMapAsyncCompleted = wasmExports["emwgpuOnMapAsyncCompleted"])(a0, a1, a2);

var _emwgpuOnPopErrorScopeCompleted = (a0, a1, a2, a3) => (_emwgpuOnPopErrorScopeCompleted = wasmExports["emwgpuOnPopErrorScopeCompleted"])(a0, a1, a2, a3);

var _emwgpuOnRequestAdapterCompleted = (a0, a1, a2, a3) => (_emwgpuOnRequestAdapterCompleted = wasmExports["emwgpuOnRequestAdapterCompleted"])(a0, a1, a2, a3);

var _emwgpuOnRequestDeviceCompleted = (a0, a1, a2, a3) => (_emwgpuOnRequestDeviceCompleted = wasmExports["emwgpuOnRequestDeviceCompleted"])(a0, a1, a2, a3);

var _emwgpuOnWorkDoneCompleted = (a0, a1) => (_emwgpuOnWorkDoneCompleted = wasmExports["emwgpuOnWorkDoneCompleted"])(a0, a1);

var _emwgpuOnUncapturedError = (a0, a1, a2) => (_emwgpuOnUncapturedError = wasmExports["emwgpuOnUncapturedError"])(a0, a1, a2);

var _acos = Module["_acos"] = a0 => (_acos = Module["_acos"] = wasmExports["acos"])(a0);

var _acosh = Module["_acosh"] = a0 => (_acosh = Module["_acosh"] = wasmExports["acosh"])(a0);

var _acoshf = Module["_acoshf"] = a0 => (_acoshf = Module["_acoshf"] = wasmExports["acoshf"])(a0);

var _asin = Module["_asin"] = a0 => (_asin = Module["_asin"] = wasmExports["asin"])(a0);

var _asinh = Module["_asinh"] = a0 => (_asinh = Module["_asinh"] = wasmExports["asinh"])(a0);

var _asinhf = Module["_asinhf"] = a0 => (_asinhf = Module["_asinhf"] = wasmExports["asinhf"])(a0);

var _atanh = Module["_atanh"] = a0 => (_atanh = Module["_atanh"] = wasmExports["atanh"])(a0);

var _atanhf = Module["_atanhf"] = a0 => (_atanhf = Module["_atanhf"] = wasmExports["atanhf"])(a0);

var _cosh = Module["_cosh"] = a0 => (_cosh = Module["_cosh"] = wasmExports["cosh"])(a0);

var _coshf = Module["_coshf"] = a0 => (_coshf = Module["_coshf"] = wasmExports["coshf"])(a0);

var _sinh = Module["_sinh"] = a0 => (_sinh = Module["_sinh"] = wasmExports["sinh"])(a0);

var _sinhf = Module["_sinhf"] = a0 => (_sinhf = Module["_sinhf"] = wasmExports["sinhf"])(a0);

var _tan = Module["_tan"] = a0 => (_tan = Module["_tan"] = wasmExports["tan"])(a0);

var _fmodf = Module["_fmodf"] = (a0, a1) => (_fmodf = Module["_fmodf"] = wasmExports["fmodf"])(a0, a1);

var _log10f = Module["_log10f"] = a0 => (_log10f = Module["_log10f"] = wasmExports["log10f"])(a0);

var _cbrtf = Module["_cbrtf"] = a0 => (_cbrtf = Module["_cbrtf"] = wasmExports["cbrtf"])(a0);

var _fmod = Module["_fmod"] = (a0, a1) => (_fmod = Module["_fmod"] = wasmExports["fmod"])(a0, a1);

var _mono_wasm_register_root = Module["_mono_wasm_register_root"] = (a0, a1, a2) => (_mono_wasm_register_root = Module["_mono_wasm_register_root"] = wasmExports["mono_wasm_register_root"])(a0, a1, a2);

var _mono_wasm_deregister_root = Module["_mono_wasm_deregister_root"] = a0 => (_mono_wasm_deregister_root = Module["_mono_wasm_deregister_root"] = wasmExports["mono_wasm_deregister_root"])(a0);

var _mono_wasm_add_assembly = Module["_mono_wasm_add_assembly"] = (a0, a1, a2) => (_mono_wasm_add_assembly = Module["_mono_wasm_add_assembly"] = wasmExports["mono_wasm_add_assembly"])(a0, a1, a2);

var _mono_wasm_add_satellite_assembly = Module["_mono_wasm_add_satellite_assembly"] = (a0, a1, a2, a3) => (_mono_wasm_add_satellite_assembly = Module["_mono_wasm_add_satellite_assembly"] = wasmExports["mono_wasm_add_satellite_assembly"])(a0, a1, a2, a3);

var _mono_wasm_setenv = Module["_mono_wasm_setenv"] = (a0, a1) => (_mono_wasm_setenv = Module["_mono_wasm_setenv"] = wasmExports["mono_wasm_setenv"])(a0, a1);

var _mono_wasm_getenv = Module["_mono_wasm_getenv"] = a0 => (_mono_wasm_getenv = Module["_mono_wasm_getenv"] = wasmExports["mono_wasm_getenv"])(a0);

var _mono_wasm_load_runtime = Module["_mono_wasm_load_runtime"] = (a0, a1, a2, a3) => (_mono_wasm_load_runtime = Module["_mono_wasm_load_runtime"] = wasmExports["mono_wasm_load_runtime"])(a0, a1, a2, a3);

var _mono_wasm_invoke_jsexport = Module["_mono_wasm_invoke_jsexport"] = (a0, a1) => (_mono_wasm_invoke_jsexport = Module["_mono_wasm_invoke_jsexport"] = wasmExports["mono_wasm_invoke_jsexport"])(a0, a1);

var _mono_wasm_print_thread_dump = Module["_mono_wasm_print_thread_dump"] = () => (_mono_wasm_print_thread_dump = Module["_mono_wasm_print_thread_dump"] = wasmExports["mono_wasm_print_thread_dump"])();

var _mono_wasm_invoke_jsexport_async_post = Module["_mono_wasm_invoke_jsexport_async_post"] = (a0, a1, a2) => (_mono_wasm_invoke_jsexport_async_post = Module["_mono_wasm_invoke_jsexport_async_post"] = wasmExports["mono_wasm_invoke_jsexport_async_post"])(a0, a1, a2);

var _mono_wasm_invoke_jsexport_sync = Module["_mono_wasm_invoke_jsexport_sync"] = (a0, a1) => (_mono_wasm_invoke_jsexport_sync = Module["_mono_wasm_invoke_jsexport_sync"] = wasmExports["mono_wasm_invoke_jsexport_sync"])(a0, a1);

var _mono_wasm_invoke_jsexport_sync_send = Module["_mono_wasm_invoke_jsexport_sync_send"] = (a0, a1, a2) => (_mono_wasm_invoke_jsexport_sync_send = Module["_mono_wasm_invoke_jsexport_sync_send"] = wasmExports["mono_wasm_invoke_jsexport_sync_send"])(a0, a1, a2);

var _mono_wasm_synchronization_context_pump = Module["_mono_wasm_synchronization_context_pump"] = () => (_mono_wasm_synchronization_context_pump = Module["_mono_wasm_synchronization_context_pump"] = wasmExports["mono_wasm_synchronization_context_pump"])();

var _mono_wasm_string_from_utf16_ref = Module["_mono_wasm_string_from_utf16_ref"] = (a0, a1, a2) => (_mono_wasm_string_from_utf16_ref = Module["_mono_wasm_string_from_utf16_ref"] = wasmExports["mono_wasm_string_from_utf16_ref"])(a0, a1, a2);

var _mono_wasm_exec_regression = Module["_mono_wasm_exec_regression"] = (a0, a1) => (_mono_wasm_exec_regression = Module["_mono_wasm_exec_regression"] = wasmExports["mono_wasm_exec_regression"])(a0, a1);

var _mono_wasm_exit = Module["_mono_wasm_exit"] = a0 => (_mono_wasm_exit = Module["_mono_wasm_exit"] = wasmExports["mono_wasm_exit"])(a0);

var _mono_wasm_set_main_args = Module["_mono_wasm_set_main_args"] = (a0, a1) => (_mono_wasm_set_main_args = Module["_mono_wasm_set_main_args"] = wasmExports["mono_wasm_set_main_args"])(a0, a1);

var _mono_wasm_strdup = Module["_mono_wasm_strdup"] = a0 => (_mono_wasm_strdup = Module["_mono_wasm_strdup"] = wasmExports["mono_wasm_strdup"])(a0);

var _mono_wasm_parse_runtime_options = Module["_mono_wasm_parse_runtime_options"] = (a0, a1) => (_mono_wasm_parse_runtime_options = Module["_mono_wasm_parse_runtime_options"] = wasmExports["mono_wasm_parse_runtime_options"])(a0, a1);

var _mono_wasm_intern_string_ref = Module["_mono_wasm_intern_string_ref"] = a0 => (_mono_wasm_intern_string_ref = Module["_mono_wasm_intern_string_ref"] = wasmExports["mono_wasm_intern_string_ref"])(a0);

var _mono_wasm_string_get_data_ref = Module["_mono_wasm_string_get_data_ref"] = (a0, a1, a2, a3) => (_mono_wasm_string_get_data_ref = Module["_mono_wasm_string_get_data_ref"] = wasmExports["mono_wasm_string_get_data_ref"])(a0, a1, a2, a3);

var _mono_wasm_write_managed_pointer_unsafe = Module["_mono_wasm_write_managed_pointer_unsafe"] = (a0, a1) => (_mono_wasm_write_managed_pointer_unsafe = Module["_mono_wasm_write_managed_pointer_unsafe"] = wasmExports["mono_wasm_write_managed_pointer_unsafe"])(a0, a1);

var _mono_wasm_copy_managed_pointer = Module["_mono_wasm_copy_managed_pointer"] = (a0, a1) => (_mono_wasm_copy_managed_pointer = Module["_mono_wasm_copy_managed_pointer"] = wasmExports["mono_wasm_copy_managed_pointer"])(a0, a1);

var _mono_wasm_init_finalizer_thread = Module["_mono_wasm_init_finalizer_thread"] = () => (_mono_wasm_init_finalizer_thread = Module["_mono_wasm_init_finalizer_thread"] = wasmExports["mono_wasm_init_finalizer_thread"])();

var _mono_wasm_i52_to_f64 = Module["_mono_wasm_i52_to_f64"] = (a0, a1) => (_mono_wasm_i52_to_f64 = Module["_mono_wasm_i52_to_f64"] = wasmExports["mono_wasm_i52_to_f64"])(a0, a1);

var _mono_wasm_u52_to_f64 = Module["_mono_wasm_u52_to_f64"] = (a0, a1) => (_mono_wasm_u52_to_f64 = Module["_mono_wasm_u52_to_f64"] = wasmExports["mono_wasm_u52_to_f64"])(a0, a1);

var _mono_wasm_f64_to_u52 = Module["_mono_wasm_f64_to_u52"] = (a0, a1) => (_mono_wasm_f64_to_u52 = Module["_mono_wasm_f64_to_u52"] = wasmExports["mono_wasm_f64_to_u52"])(a0, a1);

var _mono_wasm_f64_to_i52 = Module["_mono_wasm_f64_to_i52"] = (a0, a1) => (_mono_wasm_f64_to_i52 = Module["_mono_wasm_f64_to_i52"] = wasmExports["mono_wasm_f64_to_i52"])(a0, a1);

var _mono_wasm_method_get_full_name = Module["_mono_wasm_method_get_full_name"] = a0 => (_mono_wasm_method_get_full_name = Module["_mono_wasm_method_get_full_name"] = wasmExports["mono_wasm_method_get_full_name"])(a0);

var _mono_wasm_method_get_name = Module["_mono_wasm_method_get_name"] = a0 => (_mono_wasm_method_get_name = Module["_mono_wasm_method_get_name"] = wasmExports["mono_wasm_method_get_name"])(a0);

var _mono_wasm_method_get_name_ex = Module["_mono_wasm_method_get_name_ex"] = a0 => (_mono_wasm_method_get_name_ex = Module["_mono_wasm_method_get_name_ex"] = wasmExports["mono_wasm_method_get_name_ex"])(a0);

var _mono_wasm_get_f32_unaligned = Module["_mono_wasm_get_f32_unaligned"] = a0 => (_mono_wasm_get_f32_unaligned = Module["_mono_wasm_get_f32_unaligned"] = wasmExports["mono_wasm_get_f32_unaligned"])(a0);

var _mono_wasm_get_f64_unaligned = Module["_mono_wasm_get_f64_unaligned"] = a0 => (_mono_wasm_get_f64_unaligned = Module["_mono_wasm_get_f64_unaligned"] = wasmExports["mono_wasm_get_f64_unaligned"])(a0);

var _mono_wasm_get_i32_unaligned = Module["_mono_wasm_get_i32_unaligned"] = a0 => (_mono_wasm_get_i32_unaligned = Module["_mono_wasm_get_i32_unaligned"] = wasmExports["mono_wasm_get_i32_unaligned"])(a0);

var _mono_wasm_is_zero_page_reserved = Module["_mono_wasm_is_zero_page_reserved"] = () => (_mono_wasm_is_zero_page_reserved = Module["_mono_wasm_is_zero_page_reserved"] = wasmExports["mono_wasm_is_zero_page_reserved"])();

var _mono_wasm_read_as_bool_or_null_unsafe = Module["_mono_wasm_read_as_bool_or_null_unsafe"] = a0 => (_mono_wasm_read_as_bool_or_null_unsafe = Module["_mono_wasm_read_as_bool_or_null_unsafe"] = wasmExports["mono_wasm_read_as_bool_or_null_unsafe"])(a0);

var _mono_wasm_assembly_load = Module["_mono_wasm_assembly_load"] = a0 => (_mono_wasm_assembly_load = Module["_mono_wasm_assembly_load"] = wasmExports["mono_wasm_assembly_load"])(a0);

var _mono_wasm_assembly_find_class = Module["_mono_wasm_assembly_find_class"] = (a0, a1, a2) => (_mono_wasm_assembly_find_class = Module["_mono_wasm_assembly_find_class"] = wasmExports["mono_wasm_assembly_find_class"])(a0, a1, a2);

var _mono_wasm_assembly_find_method = Module["_mono_wasm_assembly_find_method"] = (a0, a1, a2) => (_mono_wasm_assembly_find_method = Module["_mono_wasm_assembly_find_method"] = wasmExports["mono_wasm_assembly_find_method"])(a0, a1, a2);

var _diag_trace_request = Module["_diag_trace_request"] = a0 => (_diag_trace_request = Module["_diag_trace_request"] = wasmExports["diag_trace_request"])(a0);

var _diag_trace_take_request = Module["_diag_trace_take_request"] = () => (_diag_trace_take_request = Module["_diag_trace_take_request"] = wasmExports["diag_trace_take_request"])();

var _diag_set_step = Module["_diag_set_step"] = a0 => (_diag_set_step = Module["_diag_set_step"] = wasmExports["diag_set_step"])(a0);

var _diag_get_step = Module["_diag_get_step"] = () => (_diag_get_step = Module["_diag_get_step"] = wasmExports["diag_get_step"])();

var _diag_set_step2 = Module["_diag_set_step2"] = a0 => (_diag_set_step2 = Module["_diag_set_step2"] = wasmExports["diag_set_step2"])(a0);

var _diag_get_step2 = Module["_diag_get_step2"] = () => (_diag_get_step2 = Module["_diag_get_step2"] = wasmExports["diag_get_step2"])();

var _diag_stream_append = Module["_diag_stream_append"] = (a0, a1) => (_diag_stream_append = Module["_diag_stream_append"] = wasmExports["diag_stream_append"])(a0, a1);

var _diag_stream_len = Module["_diag_stream_len"] = () => (_diag_stream_len = Module["_diag_stream_len"] = wasmExports["diag_stream_len"])();

var _diag_stream_ptr = Module["_diag_stream_ptr"] = () => (_diag_stream_ptr = Module["_diag_stream_ptr"] = wasmExports["diag_stream_ptr"])();

var _diag_stream_mark_done = Module["_diag_stream_mark_done"] = () => (_diag_stream_mark_done = Module["_diag_stream_mark_done"] = wasmExports["diag_stream_mark_done"])();

var _diag_stream_is_done = Module["_diag_stream_is_done"] = () => (_diag_stream_is_done = Module["_diag_stream_is_done"] = wasmExports["diag_stream_is_done"])();

var _diag_stream_reset = Module["_diag_stream_reset"] = () => (_diag_stream_reset = Module["_diag_stream_reset"] = wasmExports["diag_stream_reset"])();

var _mono_wasm_send_dbg_command_with_parms = Module["_mono_wasm_send_dbg_command_with_parms"] = (a0, a1, a2, a3, a4, a5, a6) => (_mono_wasm_send_dbg_command_with_parms = Module["_mono_wasm_send_dbg_command_with_parms"] = wasmExports["mono_wasm_send_dbg_command_with_parms"])(a0, a1, a2, a3, a4, a5, a6);

var _mono_wasm_send_dbg_command = Module["_mono_wasm_send_dbg_command"] = (a0, a1, a2, a3, a4) => (_mono_wasm_send_dbg_command = Module["_mono_wasm_send_dbg_command"] = wasmExports["mono_wasm_send_dbg_command"])(a0, a1, a2, a3, a4);

var _mono_wasm_jit_prof_stat = Module["_mono_wasm_jit_prof_stat"] = a0 => (_mono_wasm_jit_prof_stat = Module["_mono_wasm_jit_prof_stat"] = wasmExports["mono_wasm_jit_prof_stat"])(a0);

var _mono_wasm_jit_snapshot = Module["_mono_wasm_jit_snapshot"] = () => (_mono_wasm_jit_snapshot = Module["_mono_wasm_jit_snapshot"] = wasmExports["mono_wasm_jit_snapshot"])();

var _mono_wasm_jit_dump_hot_edges = Module["_mono_wasm_jit_dump_hot_edges"] = a0 => (_mono_wasm_jit_dump_hot_edges = Module["_mono_wasm_jit_dump_hot_edges"] = wasmExports["mono_wasm_jit_dump_hot_edges"])(a0);

var _mono_wasm_jit_dump_blockers = Module["_mono_wasm_jit_dump_blockers"] = a0 => (_mono_wasm_jit_dump_blockers = Module["_mono_wasm_jit_dump_blockers"] = wasmExports["mono_wasm_jit_dump_blockers"])(a0);

var _mono_jiterp_register_jit_call_thunk = Module["_mono_jiterp_register_jit_call_thunk"] = (a0, a1) => (_mono_jiterp_register_jit_call_thunk = Module["_mono_jiterp_register_jit_call_thunk"] = wasmExports["mono_jiterp_register_jit_call_thunk"])(a0, a1);

var _mono_jiterp_entry_adopt_info = Module["_mono_jiterp_entry_adopt_info"] = (a0, a1) => (_mono_jiterp_entry_adopt_info = Module["_mono_jiterp_entry_adopt_info"] = wasmExports["mono_jiterp_entry_adopt_info"])(a0, a1);

var _mono_jiterp_interp_entry_set_slot = Module["_mono_jiterp_interp_entry_set_slot"] = (a0, a1, a2) => (_mono_jiterp_interp_entry_set_slot = Module["_mono_jiterp_interp_entry_set_slot"] = wasmExports["mono_jiterp_interp_entry_set_slot"])(a0, a1, a2);

var _mono_wasm_jit_slot_live = Module["_mono_wasm_jit_slot_live"] = a0 => (_mono_wasm_jit_slot_live = Module["_mono_wasm_jit_slot_live"] = wasmExports["mono_wasm_jit_slot_live"])(a0);

var _mono_wasm_jit_note_invalid_cast = Module["_mono_wasm_jit_note_invalid_cast"] = (a0, a1, a2, a3) => (_mono_wasm_jit_note_invalid_cast = Module["_mono_wasm_jit_note_invalid_cast"] = wasmExports["mono_wasm_jit_note_invalid_cast"])(a0, a1, a2, a3);

var _mono_jiterp_stackval_to_data = Module["_mono_jiterp_stackval_to_data"] = (a0, a1, a2) => (_mono_jiterp_stackval_to_data = Module["_mono_jiterp_stackval_to_data"] = wasmExports["mono_jiterp_stackval_to_data"])(a0, a1, a2);

var _mono_jiterp_stackval_from_data = Module["_mono_jiterp_stackval_from_data"] = (a0, a1, a2) => (_mono_jiterp_stackval_from_data = Module["_mono_jiterp_stackval_from_data"] = wasmExports["mono_jiterp_stackval_from_data"])(a0, a1, a2);

var _mono_jiterp_get_arg_offset = Module["_mono_jiterp_get_arg_offset"] = (a0, a1, a2) => (_mono_jiterp_get_arg_offset = Module["_mono_jiterp_get_arg_offset"] = wasmExports["mono_jiterp_get_arg_offset"])(a0, a1, a2);

var _mono_jiterp_overflow_check_i4 = Module["_mono_jiterp_overflow_check_i4"] = (a0, a1, a2) => (_mono_jiterp_overflow_check_i4 = Module["_mono_jiterp_overflow_check_i4"] = wasmExports["mono_jiterp_overflow_check_i4"])(a0, a1, a2);

var _mono_jiterp_overflow_check_u4 = Module["_mono_jiterp_overflow_check_u4"] = (a0, a1, a2) => (_mono_jiterp_overflow_check_u4 = Module["_mono_jiterp_overflow_check_u4"] = wasmExports["mono_jiterp_overflow_check_u4"])(a0, a1, a2);

var _mono_jiterp_ld_delegate_method_ptr = Module["_mono_jiterp_ld_delegate_method_ptr"] = (a0, a1) => (_mono_jiterp_ld_delegate_method_ptr = Module["_mono_jiterp_ld_delegate_method_ptr"] = wasmExports["mono_jiterp_ld_delegate_method_ptr"])(a0, a1);

var _mono_jiterp_interp_entry = Module["_mono_jiterp_interp_entry"] = a0 => (_mono_jiterp_interp_entry = Module["_mono_jiterp_interp_entry"] = wasmExports["mono_jiterp_interp_entry"])(a0);

var _cbrt = Module["_cbrt"] = a0 => (_cbrt = Module["_cbrt"] = wasmExports["cbrt"])(a0);

var _mono_jiterp_get_polling_required_address = Module["_mono_jiterp_get_polling_required_address"] = () => (_mono_jiterp_get_polling_required_address = Module["_mono_jiterp_get_polling_required_address"] = wasmExports["mono_jiterp_get_polling_required_address"])();

var _mono_jiterp_prof_enter = Module["_mono_jiterp_prof_enter"] = (a0, a1) => (_mono_jiterp_prof_enter = Module["_mono_jiterp_prof_enter"] = wasmExports["mono_jiterp_prof_enter"])(a0, a1);

var _mono_jiterp_prof_samplepoint = Module["_mono_jiterp_prof_samplepoint"] = (a0, a1) => (_mono_jiterp_prof_samplepoint = Module["_mono_jiterp_prof_samplepoint"] = wasmExports["mono_jiterp_prof_samplepoint"])(a0, a1);

var _mono_jiterp_prof_leave = Module["_mono_jiterp_prof_leave"] = (a0, a1) => (_mono_jiterp_prof_leave = Module["_mono_jiterp_prof_leave"] = wasmExports["mono_jiterp_prof_leave"])(a0, a1);

var _mono_jiterp_do_safepoint = Module["_mono_jiterp_do_safepoint"] = (a0, a1) => (_mono_jiterp_do_safepoint = Module["_mono_jiterp_do_safepoint"] = wasmExports["mono_jiterp_do_safepoint"])(a0, a1);

var _mono_jiterp_imethod_to_ftnptr = Module["_mono_jiterp_imethod_to_ftnptr"] = a0 => (_mono_jiterp_imethod_to_ftnptr = Module["_mono_jiterp_imethod_to_ftnptr"] = wasmExports["mono_jiterp_imethod_to_ftnptr"])(a0);

var _mono_jiterp_enum_hasflag = Module["_mono_jiterp_enum_hasflag"] = (a0, a1, a2, a3) => (_mono_jiterp_enum_hasflag = Module["_mono_jiterp_enum_hasflag"] = wasmExports["mono_jiterp_enum_hasflag"])(a0, a1, a2, a3);

var _mono_jiterp_get_simd_intrinsic = Module["_mono_jiterp_get_simd_intrinsic"] = (a0, a1) => (_mono_jiterp_get_simd_intrinsic = Module["_mono_jiterp_get_simd_intrinsic"] = wasmExports["mono_jiterp_get_simd_intrinsic"])(a0, a1);

var _mono_jiterp_get_simd_opcode = Module["_mono_jiterp_get_simd_opcode"] = (a0, a1) => (_mono_jiterp_get_simd_opcode = Module["_mono_jiterp_get_simd_opcode"] = wasmExports["mono_jiterp_get_simd_opcode"])(a0, a1);

var _mono_jiterp_get_opcode_info = Module["_mono_jiterp_get_opcode_info"] = (a0, a1) => (_mono_jiterp_get_opcode_info = Module["_mono_jiterp_get_opcode_info"] = wasmExports["mono_jiterp_get_opcode_info"])(a0, a1);

var _mono_jiterp_placeholder_trace = Module["_mono_jiterp_placeholder_trace"] = (a0, a1, a2, a3) => (_mono_jiterp_placeholder_trace = Module["_mono_jiterp_placeholder_trace"] = wasmExports["mono_jiterp_placeholder_trace"])(a0, a1, a2, a3);

var _mono_jiterp_placeholder_jit_call = Module["_mono_jiterp_placeholder_jit_call"] = (a0, a1, a2, a3) => (_mono_jiterp_placeholder_jit_call = Module["_mono_jiterp_placeholder_jit_call"] = wasmExports["mono_jiterp_placeholder_jit_call"])(a0, a1, a2, a3);

var _mono_jiterp_get_interp_entry_func = Module["_mono_jiterp_get_interp_entry_func"] = a0 => (_mono_jiterp_get_interp_entry_func = Module["_mono_jiterp_get_interp_entry_func"] = wasmExports["mono_jiterp_get_interp_entry_func"])(a0);

var _mono_wasm_jit_method_known_dead = Module["_mono_wasm_jit_method_known_dead"] = (a0, a1) => (_mono_wasm_jit_method_known_dead = Module["_mono_wasm_jit_method_known_dead"] = wasmExports["mono_wasm_jit_method_known_dead"])(a0, a1);

var _mono_jiterp_is_enabled = Module["_mono_jiterp_is_enabled"] = () => (_mono_jiterp_is_enabled = Module["_mono_jiterp_is_enabled"] = wasmExports["mono_jiterp_is_enabled"])();

var _mono_jiterp_allocate_table_entry = Module["_mono_jiterp_allocate_table_entry"] = a0 => (_mono_jiterp_allocate_table_entry = Module["_mono_jiterp_allocate_table_entry"] = wasmExports["mono_jiterp_allocate_table_entry"])(a0);

var _mono_jiterp_encode_leb64_ref = Module["_mono_jiterp_encode_leb64_ref"] = (a0, a1, a2) => (_mono_jiterp_encode_leb64_ref = Module["_mono_jiterp_encode_leb64_ref"] = wasmExports["mono_jiterp_encode_leb64_ref"])(a0, a1, a2);

var _mono_jiterp_encode_leb52 = Module["_mono_jiterp_encode_leb52"] = (a0, a1, a2) => (_mono_jiterp_encode_leb52 = Module["_mono_jiterp_encode_leb52"] = wasmExports["mono_jiterp_encode_leb52"])(a0, a1, a2);

var _mono_jiterp_encode_leb_signed_boundary = Module["_mono_jiterp_encode_leb_signed_boundary"] = (a0, a1, a2) => (_mono_jiterp_encode_leb_signed_boundary = Module["_mono_jiterp_encode_leb_signed_boundary"] = wasmExports["mono_jiterp_encode_leb_signed_boundary"])(a0, a1, a2);

var _mono_jiterp_increase_entry_count = Module["_mono_jiterp_increase_entry_count"] = a0 => (_mono_jiterp_increase_entry_count = Module["_mono_jiterp_increase_entry_count"] = wasmExports["mono_jiterp_increase_entry_count"])(a0);

var _mono_jiterp_object_unbox = Module["_mono_jiterp_object_unbox"] = a0 => (_mono_jiterp_object_unbox = Module["_mono_jiterp_object_unbox"] = wasmExports["mono_jiterp_object_unbox"])(a0);

var _mono_jiterp_type_is_byref = Module["_mono_jiterp_type_is_byref"] = a0 => (_mono_jiterp_type_is_byref = Module["_mono_jiterp_type_is_byref"] = wasmExports["mono_jiterp_type_is_byref"])(a0);

var _mono_jiterp_value_copy = Module["_mono_jiterp_value_copy"] = (a0, a1, a2) => (_mono_jiterp_value_copy = Module["_mono_jiterp_value_copy"] = wasmExports["mono_jiterp_value_copy"])(a0, a1, a2);

var _mono_jiterp_try_newobj_inlined = Module["_mono_jiterp_try_newobj_inlined"] = (a0, a1) => (_mono_jiterp_try_newobj_inlined = Module["_mono_jiterp_try_newobj_inlined"] = wasmExports["mono_jiterp_try_newobj_inlined"])(a0, a1);

var _mono_jiterp_try_newstr = Module["_mono_jiterp_try_newstr"] = (a0, a1) => (_mono_jiterp_try_newstr = Module["_mono_jiterp_try_newstr"] = wasmExports["mono_jiterp_try_newstr"])(a0, a1);

var _mono_jiterp_try_newarr = Module["_mono_jiterp_try_newarr"] = (a0, a1, a2) => (_mono_jiterp_try_newarr = Module["_mono_jiterp_try_newarr"] = wasmExports["mono_jiterp_try_newarr"])(a0, a1, a2);

var _mono_jiterp_gettype_ref = Module["_mono_jiterp_gettype_ref"] = (a0, a1) => (_mono_jiterp_gettype_ref = Module["_mono_jiterp_gettype_ref"] = wasmExports["mono_jiterp_gettype_ref"])(a0, a1);

var _mono_jiterp_has_parent_fast = Module["_mono_jiterp_has_parent_fast"] = (a0, a1) => (_mono_jiterp_has_parent_fast = Module["_mono_jiterp_has_parent_fast"] = wasmExports["mono_jiterp_has_parent_fast"])(a0, a1);

var _mono_jiterp_implements_interface = Module["_mono_jiterp_implements_interface"] = (a0, a1) => (_mono_jiterp_implements_interface = Module["_mono_jiterp_implements_interface"] = wasmExports["mono_jiterp_implements_interface"])(a0, a1);

var _mono_jiterp_is_special_interface = Module["_mono_jiterp_is_special_interface"] = a0 => (_mono_jiterp_is_special_interface = Module["_mono_jiterp_is_special_interface"] = wasmExports["mono_jiterp_is_special_interface"])(a0);

var _mono_jiterp_implements_special_interface = Module["_mono_jiterp_implements_special_interface"] = (a0, a1, a2) => (_mono_jiterp_implements_special_interface = Module["_mono_jiterp_implements_special_interface"] = wasmExports["mono_jiterp_implements_special_interface"])(a0, a1, a2);

var _mono_jiterp_cast_v2 = Module["_mono_jiterp_cast_v2"] = (a0, a1, a2, a3) => (_mono_jiterp_cast_v2 = Module["_mono_jiterp_cast_v2"] = wasmExports["mono_jiterp_cast_v2"])(a0, a1, a2, a3);

var _mono_jiterp_localloc = Module["_mono_jiterp_localloc"] = (a0, a1, a2) => (_mono_jiterp_localloc = Module["_mono_jiterp_localloc"] = wasmExports["mono_jiterp_localloc"])(a0, a1, a2);

var _mono_jiterp_ldtsflda = Module["_mono_jiterp_ldtsflda"] = (a0, a1) => (_mono_jiterp_ldtsflda = Module["_mono_jiterp_ldtsflda"] = wasmExports["mono_jiterp_ldtsflda"])(a0, a1);

var _mono_jiterp_box_ref = Module["_mono_jiterp_box_ref"] = (a0, a1, a2, a3) => (_mono_jiterp_box_ref = Module["_mono_jiterp_box_ref"] = wasmExports["mono_jiterp_box_ref"])(a0, a1, a2, a3);

var _mono_jiterp_conv = Module["_mono_jiterp_conv"] = (a0, a1, a2) => (_mono_jiterp_conv = Module["_mono_jiterp_conv"] = wasmExports["mono_jiterp_conv"])(a0, a1, a2);

var _mono_jiterp_relop_fp = Module["_mono_jiterp_relop_fp"] = (a0, a1, a2) => (_mono_jiterp_relop_fp = Module["_mono_jiterp_relop_fp"] = wasmExports["mono_jiterp_relop_fp"])(a0, a1, a2);

var _mono_jiterp_get_size_of_stackval = Module["_mono_jiterp_get_size_of_stackval"] = () => (_mono_jiterp_get_size_of_stackval = Module["_mono_jiterp_get_size_of_stackval"] = wasmExports["mono_jiterp_get_size_of_stackval"])();

var _mono_jiterp_type_get_raw_value_size = Module["_mono_jiterp_type_get_raw_value_size"] = a0 => (_mono_jiterp_type_get_raw_value_size = Module["_mono_jiterp_type_get_raw_value_size"] = wasmExports["mono_jiterp_type_get_raw_value_size"])(a0);

var _mono_jiterp_trace_bailout = Module["_mono_jiterp_trace_bailout"] = a0 => (_mono_jiterp_trace_bailout = Module["_mono_jiterp_trace_bailout"] = wasmExports["mono_jiterp_trace_bailout"])(a0);

var _mono_jiterp_get_trace_bailout_count = Module["_mono_jiterp_get_trace_bailout_count"] = a0 => (_mono_jiterp_get_trace_bailout_count = Module["_mono_jiterp_get_trace_bailout_count"] = wasmExports["mono_jiterp_get_trace_bailout_count"])(a0);

var _mono_jiterp_adjust_abort_count = Module["_mono_jiterp_adjust_abort_count"] = (a0, a1) => (_mono_jiterp_adjust_abort_count = Module["_mono_jiterp_adjust_abort_count"] = wasmExports["mono_jiterp_adjust_abort_count"])(a0, a1);

var _mono_jiterp_wasm_jit_entry_ok = Module["_mono_jiterp_wasm_jit_entry_ok"] = a0 => (_mono_jiterp_wasm_jit_entry_ok = Module["_mono_jiterp_wasm_jit_entry_ok"] = wasmExports["mono_jiterp_wasm_jit_entry_ok"])(a0);

var _mono_jiterp_interp_entry_prologue = Module["_mono_jiterp_interp_entry_prologue"] = (a0, a1, a2) => (_mono_jiterp_interp_entry_prologue = Module["_mono_jiterp_interp_entry_prologue"] = wasmExports["mono_jiterp_interp_entry_prologue"])(a0, a1, a2);

var _mono_jiterp_get_opcode_value_table_entry = Module["_mono_jiterp_get_opcode_value_table_entry"] = a0 => (_mono_jiterp_get_opcode_value_table_entry = Module["_mono_jiterp_get_opcode_value_table_entry"] = wasmExports["mono_jiterp_get_opcode_value_table_entry"])(a0);

var _mono_jiterp_record_trace_abort = Module["_mono_jiterp_record_trace_abort"] = (a0, a1) => (_mono_jiterp_record_trace_abort = Module["_mono_jiterp_record_trace_abort"] = wasmExports["mono_jiterp_record_trace_abort"])(a0, a1);

var _mono_jiterp_parse_option = Module["_mono_jiterp_parse_option"] = a0 => (_mono_jiterp_parse_option = Module["_mono_jiterp_parse_option"] = wasmExports["mono_jiterp_parse_option"])(a0);

var _mono_jiterp_get_options_version = Module["_mono_jiterp_get_options_version"] = () => (_mono_jiterp_get_options_version = Module["_mono_jiterp_get_options_version"] = wasmExports["mono_jiterp_get_options_version"])();

var _mono_jiterp_get_options_as_json = Module["_mono_jiterp_get_options_as_json"] = () => (_mono_jiterp_get_options_as_json = Module["_mono_jiterp_get_options_as_json"] = wasmExports["mono_jiterp_get_options_as_json"])();

var _mono_jiterp_get_option_as_int = Module["_mono_jiterp_get_option_as_int"] = a0 => (_mono_jiterp_get_option_as_int = Module["_mono_jiterp_get_option_as_int"] = wasmExports["mono_jiterp_get_option_as_int"])(a0);

var _mono_jiterp_object_has_component_size = Module["_mono_jiterp_object_has_component_size"] = a0 => (_mono_jiterp_object_has_component_size = Module["_mono_jiterp_object_has_component_size"] = wasmExports["mono_jiterp_object_has_component_size"])(a0);

var _mono_jiterp_get_hashcode = Module["_mono_jiterp_get_hashcode"] = a0 => (_mono_jiterp_get_hashcode = Module["_mono_jiterp_get_hashcode"] = wasmExports["mono_jiterp_get_hashcode"])(a0);

var _mono_jiterp_try_get_hashcode = Module["_mono_jiterp_try_get_hashcode"] = a0 => (_mono_jiterp_try_get_hashcode = Module["_mono_jiterp_try_get_hashcode"] = wasmExports["mono_jiterp_try_get_hashcode"])(a0);

var _mono_jiterp_get_signature_has_this = Module["_mono_jiterp_get_signature_has_this"] = a0 => (_mono_jiterp_get_signature_has_this = Module["_mono_jiterp_get_signature_has_this"] = wasmExports["mono_jiterp_get_signature_has_this"])(a0);

var _mono_jiterp_get_signature_return_type = Module["_mono_jiterp_get_signature_return_type"] = a0 => (_mono_jiterp_get_signature_return_type = Module["_mono_jiterp_get_signature_return_type"] = wasmExports["mono_jiterp_get_signature_return_type"])(a0);

var _mono_jiterp_get_signature_param_count = Module["_mono_jiterp_get_signature_param_count"] = a0 => (_mono_jiterp_get_signature_param_count = Module["_mono_jiterp_get_signature_param_count"] = wasmExports["mono_jiterp_get_signature_param_count"])(a0);

var _mono_jiterp_get_signature_params = Module["_mono_jiterp_get_signature_params"] = a0 => (_mono_jiterp_get_signature_params = Module["_mono_jiterp_get_signature_params"] = wasmExports["mono_jiterp_get_signature_params"])(a0);

var _mono_jiterp_type_to_ldind = Module["_mono_jiterp_type_to_ldind"] = a0 => (_mono_jiterp_type_to_ldind = Module["_mono_jiterp_type_to_ldind"] = wasmExports["mono_jiterp_type_to_ldind"])(a0);

var _mono_jiterp_type_to_stind = Module["_mono_jiterp_type_to_stind"] = a0 => (_mono_jiterp_type_to_stind = Module["_mono_jiterp_type_to_stind"] = wasmExports["mono_jiterp_type_to_stind"])(a0);

var _mono_jiterp_get_array_rank = Module["_mono_jiterp_get_array_rank"] = (a0, a1) => (_mono_jiterp_get_array_rank = Module["_mono_jiterp_get_array_rank"] = wasmExports["mono_jiterp_get_array_rank"])(a0, a1);

var _mono_jiterp_get_array_element_size = Module["_mono_jiterp_get_array_element_size"] = (a0, a1) => (_mono_jiterp_get_array_element_size = Module["_mono_jiterp_get_array_element_size"] = wasmExports["mono_jiterp_get_array_element_size"])(a0, a1);

var _mono_jiterp_set_object_field = Module["_mono_jiterp_set_object_field"] = (a0, a1, a2, a3) => (_mono_jiterp_set_object_field = Module["_mono_jiterp_set_object_field"] = wasmExports["mono_jiterp_set_object_field"])(a0, a1, a2, a3);

var _mono_jiterp_debug_count = Module["_mono_jiterp_debug_count"] = () => (_mono_jiterp_debug_count = Module["_mono_jiterp_debug_count"] = wasmExports["mono_jiterp_debug_count"])();

var _mono_jiterp_stelem_ref = Module["_mono_jiterp_stelem_ref"] = (a0, a1, a2) => (_mono_jiterp_stelem_ref = Module["_mono_jiterp_stelem_ref"] = wasmExports["mono_jiterp_stelem_ref"])(a0, a1, a2);

var _mono_jiterp_get_member_offset = Module["_mono_jiterp_get_member_offset"] = a0 => (_mono_jiterp_get_member_offset = Module["_mono_jiterp_get_member_offset"] = wasmExports["mono_jiterp_get_member_offset"])(a0);

var _mono_jiterp_get_counter = Module["_mono_jiterp_get_counter"] = a0 => (_mono_jiterp_get_counter = Module["_mono_jiterp_get_counter"] = wasmExports["mono_jiterp_get_counter"])(a0);

var _mono_jiterp_modify_counter = Module["_mono_jiterp_modify_counter"] = (a0, a1) => (_mono_jiterp_modify_counter = Module["_mono_jiterp_modify_counter"] = wasmExports["mono_jiterp_modify_counter"])(a0, a1);

var _mono_jiterp_write_number_unaligned = Module["_mono_jiterp_write_number_unaligned"] = (a0, a1, a2) => (_mono_jiterp_write_number_unaligned = Module["_mono_jiterp_write_number_unaligned"] = wasmExports["mono_jiterp_write_number_unaligned"])(a0, a1, a2);

var _mono_jiterp_get_rejected_trace_count = Module["_mono_jiterp_get_rejected_trace_count"] = () => (_mono_jiterp_get_rejected_trace_count = Module["_mono_jiterp_get_rejected_trace_count"] = wasmExports["mono_jiterp_get_rejected_trace_count"])();

var _mono_jiterp_boost_back_branch_target = Module["_mono_jiterp_boost_back_branch_target"] = a0 => (_mono_jiterp_boost_back_branch_target = Module["_mono_jiterp_boost_back_branch_target"] = wasmExports["mono_jiterp_boost_back_branch_target"])(a0);

var _mono_jiterp_is_imethod_var_address_taken = Module["_mono_jiterp_is_imethod_var_address_taken"] = (a0, a1) => (_mono_jiterp_is_imethod_var_address_taken = Module["_mono_jiterp_is_imethod_var_address_taken"] = wasmExports["mono_jiterp_is_imethod_var_address_taken"])(a0, a1);

var _mono_jiterp_initialize_table = Module["_mono_jiterp_initialize_table"] = (a0, a1, a2) => (_mono_jiterp_initialize_table = Module["_mono_jiterp_initialize_table"] = wasmExports["mono_jiterp_initialize_table"])(a0, a1, a2);

var _mono_jiterp_get_table_used = Module["_mono_jiterp_get_table_used"] = a0 => (_mono_jiterp_get_table_used = Module["_mono_jiterp_get_table_used"] = wasmExports["mono_jiterp_get_table_used"])(a0);

var _mono_jiterp_get_table_capacity = Module["_mono_jiterp_get_table_capacity"] = a0 => (_mono_jiterp_get_table_capacity = Module["_mono_jiterp_get_table_capacity"] = wasmExports["mono_jiterp_get_table_capacity"])(a0);

var _mono_jiterp_allocate_table_entries = Module["_mono_jiterp_allocate_table_entries"] = (a0, a1) => (_mono_jiterp_allocate_table_entries = Module["_mono_jiterp_allocate_table_entries"] = wasmExports["mono_jiterp_allocate_table_entries"])(a0, a1);

var _mono_jiterp_table_remaining = Module["_mono_jiterp_table_remaining"] = a0 => (_mono_jiterp_table_remaining = Module["_mono_jiterp_table_remaining"] = wasmExports["mono_jiterp_table_remaining"])(a0);

var _mono_jiterp_tlqueue_next = Module["_mono_jiterp_tlqueue_next"] = a0 => (_mono_jiterp_tlqueue_next = Module["_mono_jiterp_tlqueue_next"] = wasmExports["mono_jiterp_tlqueue_next"])(a0);

var _mono_jiterp_tlqueue_add = Module["_mono_jiterp_tlqueue_add"] = (a0, a1) => (_mono_jiterp_tlqueue_add = Module["_mono_jiterp_tlqueue_add"] = wasmExports["mono_jiterp_tlqueue_add"])(a0, a1);

var _mono_jiterp_tlqueue_clear = Module["_mono_jiterp_tlqueue_clear"] = a0 => (_mono_jiterp_tlqueue_clear = Module["_mono_jiterp_tlqueue_clear"] = wasmExports["mono_jiterp_tlqueue_clear"])(a0);

var _mono_interp_pgo_load_table = Module["_mono_interp_pgo_load_table"] = (a0, a1) => (_mono_interp_pgo_load_table = Module["_mono_interp_pgo_load_table"] = wasmExports["mono_interp_pgo_load_table"])(a0, a1);

var _mono_interp_pgo_save_table = Module["_mono_interp_pgo_save_table"] = (a0, a1) => (_mono_interp_pgo_save_table = Module["_mono_interp_pgo_save_table"] = wasmExports["mono_interp_pgo_save_table"])(a0, a1);

var _mono_llvm_cpp_catch_exception = Module["_mono_llvm_cpp_catch_exception"] = (a0, a1, a2) => (_mono_llvm_cpp_catch_exception = Module["_mono_llvm_cpp_catch_exception"] = wasmExports["mono_llvm_cpp_catch_exception"])(a0, a1, a2);

var _mono_jiterp_begin_catch = Module["_mono_jiterp_begin_catch"] = a0 => (_mono_jiterp_begin_catch = Module["_mono_jiterp_begin_catch"] = wasmExports["mono_jiterp_begin_catch"])(a0);

var _mono_jiterp_end_catch = Module["_mono_jiterp_end_catch"] = () => (_mono_jiterp_end_catch = Module["_mono_jiterp_end_catch"] = wasmExports["mono_jiterp_end_catch"])();

var _emscripten_main_runtime_thread_id = Module["_emscripten_main_runtime_thread_id"] = () => (_emscripten_main_runtime_thread_id = Module["_emscripten_main_runtime_thread_id"] = wasmExports["emscripten_main_runtime_thread_id"])();

var _mono_wasm_create_deputy_thread = Module["_mono_wasm_create_deputy_thread"] = () => (_mono_wasm_create_deputy_thread = Module["_mono_wasm_create_deputy_thread"] = wasmExports["mono_wasm_create_deputy_thread"])();

var _mono_wasm_create_io_thread = Module["_mono_wasm_create_io_thread"] = () => (_mono_wasm_create_io_thread = Module["_mono_wasm_create_io_thread"] = wasmExports["mono_wasm_create_io_thread"])();

var _mono_wasm_register_ui_thread = Module["_mono_wasm_register_ui_thread"] = () => (_mono_wasm_register_ui_thread = Module["_mono_wasm_register_ui_thread"] = wasmExports["mono_wasm_register_ui_thread"])();

var _mono_wasm_register_io_thread = Module["_mono_wasm_register_io_thread"] = () => (_mono_wasm_register_io_thread = Module["_mono_wasm_register_io_thread"] = wasmExports["mono_wasm_register_io_thread"])();

var _mono_threads_wasm_sync_run_in_target_thread_done = Module["_mono_threads_wasm_sync_run_in_target_thread_done"] = a0 => (_mono_threads_wasm_sync_run_in_target_thread_done = Module["_mono_threads_wasm_sync_run_in_target_thread_done"] = wasmExports["mono_threads_wasm_sync_run_in_target_thread_done"])(a0);

var _mono_wasm_gc_lock = Module["_mono_wasm_gc_lock"] = () => (_mono_wasm_gc_lock = Module["_mono_wasm_gc_lock"] = wasmExports["mono_wasm_gc_lock"])();

var _mono_wasm_gc_unlock = Module["_mono_wasm_gc_unlock"] = () => (_mono_wasm_gc_unlock = Module["_mono_wasm_gc_unlock"] = wasmExports["mono_wasm_gc_unlock"])();

var _mono_print_method_from_ip = Module["_mono_print_method_from_ip"] = a0 => (_mono_print_method_from_ip = Module["_mono_print_method_from_ip"] = wasmExports["mono_print_method_from_ip"])(a0);

var _mono_wasm_jit_get_counter = Module["_mono_wasm_jit_get_counter"] = a0 => (_mono_wasm_jit_get_counter = Module["_mono_wasm_jit_get_counter"] = wasmExports["mono_wasm_jit_get_counter"])(a0);

var _mono_wasm_jit_dump_stats = Module["_mono_wasm_jit_dump_stats"] = () => (_mono_wasm_jit_dump_stats = Module["_mono_wasm_jit_dump_stats"] = wasmExports["mono_wasm_jit_dump_stats"])();

var _mono_wasm_jit_dump_dep_graph = Module["_mono_wasm_jit_dump_dep_graph"] = () => (_mono_wasm_jit_dump_dep_graph = Module["_mono_wasm_jit_dump_dep_graph"] = wasmExports["mono_wasm_jit_dump_dep_graph"])();

var _mono_wasm_jit_dump_bail_hist = Module["_mono_wasm_jit_dump_bail_hist"] = () => (_mono_wasm_jit_dump_bail_hist = Module["_mono_wasm_jit_dump_bail_hist"] = wasmExports["mono_wasm_jit_dump_bail_hist"])();

var _mono_wasm_jit_dump_residual_ring = Module["_mono_wasm_jit_dump_residual_ring"] = () => (_mono_wasm_jit_dump_residual_ring = Module["_mono_wasm_jit_dump_residual_ring"] = wasmExports["mono_wasm_jit_dump_residual_ring"])();

var _mono_wasm_jit_slot_live_ptr_addr = Module["_mono_wasm_jit_slot_live_ptr_addr"] = () => (_mono_wasm_jit_slot_live_ptr_addr = Module["_mono_wasm_jit_slot_live_ptr_addr"] = wasmExports["mono_wasm_jit_slot_live_ptr_addr"])();

var _mono_wasm_jit_slot_live_cap_addr = Module["_mono_wasm_jit_slot_live_cap_addr"] = () => (_mono_wasm_jit_slot_live_cap_addr = Module["_mono_wasm_jit_slot_live_cap_addr"] = wasmExports["mono_wasm_jit_slot_live_cap_addr"])();

var _mono_wasm_jit_worker_reuse = Module["_mono_wasm_jit_worker_reuse"] = (a0, a1, a2) => (_mono_wasm_jit_worker_reuse = Module["_mono_wasm_jit_worker_reuse"] = wasmExports["mono_wasm_jit_worker_reuse"])(a0, a1, a2);

var _mono_wasm_jit_liveness = Module["_mono_wasm_jit_liveness"] = a0 => (_mono_wasm_jit_liveness = Module["_mono_wasm_jit_liveness"] = wasmExports["mono_wasm_jit_liveness"])(a0);

var _mono_wasm_jit_eslot_probe = Module["_mono_wasm_jit_eslot_probe"] = (a0, a1) => (_mono_wasm_jit_eslot_probe = Module["_mono_wasm_jit_eslot_probe"] = wasmExports["mono_wasm_jit_eslot_probe"])(a0, a1);

var _mono_wasm_jit_registry_count = Module["_mono_wasm_jit_registry_count"] = () => (_mono_wasm_jit_registry_count = Module["_mono_wasm_jit_registry_count"] = wasmExports["mono_wasm_jit_registry_count"])();

var _mono_wasm_jit_worker_action_addr = Module["_mono_wasm_jit_worker_action_addr"] = () => (_mono_wasm_jit_worker_action_addr = Module["_mono_wasm_jit_worker_action_addr"] = wasmExports["mono_wasm_jit_worker_action_addr"])();

var _mono_wasm_jit_edge_record = Module["_mono_wasm_jit_edge_record"] = (a0, a1, a2) => (_mono_wasm_jit_edge_record = Module["_mono_wasm_jit_edge_record"] = wasmExports["mono_wasm_jit_edge_record"])(a0, a1, a2);

var _mono_wasm_jit_edge_tick = Module["_mono_wasm_jit_edge_tick"] = () => (_mono_wasm_jit_edge_tick = Module["_mono_wasm_jit_edge_tick"] = wasmExports["mono_wasm_jit_edge_tick"])();

var _mono_wasm_jit_entry_sig = Module["_mono_wasm_jit_entry_sig"] = (a0, a1, a2, a3) => (_mono_wasm_jit_entry_sig = Module["_mono_wasm_jit_entry_sig"] = wasmExports["mono_wasm_jit_entry_sig"])(a0, a1, a2, a3);

var _mono_wasm_jit_lazy_interp = Module["_mono_wasm_jit_lazy_interp"] = (a0, a1) => (_mono_wasm_jit_lazy_interp = Module["_mono_wasm_jit_lazy_interp"] = wasmExports["mono_wasm_jit_lazy_interp"])(a0, a1);

var _mono_wasm_jit_lazy_bind = Module["_mono_wasm_jit_lazy_bind"] = a0 => (_mono_wasm_jit_lazy_bind = Module["_mono_wasm_jit_lazy_bind"] = wasmExports["mono_wasm_jit_lazy_bind"])(a0);

var _mono_wasm_load_icu_data = Module["_mono_wasm_load_icu_data"] = a0 => (_mono_wasm_load_icu_data = Module["_mono_wasm_load_icu_data"] = wasmExports["mono_wasm_load_icu_data"])(a0);

var _memset = Module["_memset"] = (a0, a1, a2) => (_memset = Module["_memset"] = wasmExports["memset"])(a0, a1, a2);

var __emscripten_tls_init = Module["__emscripten_tls_init"] = () => (__emscripten_tls_init = Module["__emscripten_tls_init"] = wasmExports["_emscripten_tls_init"])();

var _emscripten_builtin_memalign = (a0, a1) => (_emscripten_builtin_memalign = wasmExports["emscripten_builtin_memalign"])(a0, a1);

var __emscripten_run_callback_on_thread = (a0, a1, a2, a3, a4) => (__emscripten_run_callback_on_thread = wasmExports["_emscripten_run_callback_on_thread"])(a0, a1, a2, a3, a4);

var __emscripten_set_offscreencanvas_size_on_thread = (a0, a1, a2, a3) => (__emscripten_set_offscreencanvas_size_on_thread = wasmExports["_emscripten_set_offscreencanvas_size_on_thread"])(a0, a1, a2, a3);

var ___funcs_on_exit = () => (___funcs_on_exit = wasmExports["__funcs_on_exit"])();

var __emscripten_thread_init = Module["__emscripten_thread_init"] = (a0, a1, a2, a3, a4, a5) => (__emscripten_thread_init = Module["__emscripten_thread_init"] = wasmExports["_emscripten_thread_init"])(a0, a1, a2, a3, a4, a5);

var __emscripten_thread_crashed = Module["__emscripten_thread_crashed"] = () => (__emscripten_thread_crashed = Module["__emscripten_thread_crashed"] = wasmExports["_emscripten_thread_crashed"])();

var _emscripten_main_thread_process_queued_calls = () => (_emscripten_main_thread_process_queued_calls = wasmExports["emscripten_main_thread_process_queued_calls"])();

var _emscripten_proxy_execute_queue = a0 => (_emscripten_proxy_execute_queue = wasmExports["emscripten_proxy_execute_queue"])(a0);

var _emscripten_proxy_finish = a0 => (_emscripten_proxy_finish = wasmExports["emscripten_proxy_finish"])(a0);

var __emscripten_run_on_main_thread_js = (a0, a1, a2, a3, a4) => (__emscripten_run_on_main_thread_js = wasmExports["_emscripten_run_on_main_thread_js"])(a0, a1, a2, a3, a4);

var __emscripten_thread_free_data = a0 => (__emscripten_thread_free_data = wasmExports["_emscripten_thread_free_data"])(a0);

var __emscripten_thread_exit = Module["__emscripten_thread_exit"] = a0 => (__emscripten_thread_exit = Module["__emscripten_thread_exit"] = wasmExports["_emscripten_thread_exit"])(a0);

var __emscripten_timeout = (a0, a1) => (__emscripten_timeout = wasmExports["_emscripten_timeout"])(a0, a1);

var __emscripten_check_mailbox = () => (__emscripten_check_mailbox = wasmExports["_emscripten_check_mailbox"])();

var ___trap = () => (___trap = wasmExports["__trap"])();

var stackAlloc = Module["stackAlloc"] = a0 => (stackAlloc = Module["stackAlloc"] = wasmExports["stackAlloc"])(a0);

var __wasmfs_fetch_get_file_path = a0 => (__wasmfs_fetch_get_file_path = wasmExports["_wasmfs_fetch_get_file_path"])(a0);

var __wasmfs_read_file = a0 => (__wasmfs_read_file = wasmExports["_wasmfs_read_file"])(a0);

var __wasmfs_write_file = (a0, a1, a2) => (__wasmfs_write_file = wasmExports["_wasmfs_write_file"])(a0, a1, a2);

var __wasmfs_mkdir = (a0, a1) => (__wasmfs_mkdir = wasmExports["_wasmfs_mkdir"])(a0, a1);

var __wasmfs_rmdir = a0 => (__wasmfs_rmdir = wasmExports["_wasmfs_rmdir"])(a0);

var __wasmfs_open = (a0, a1, a2) => (__wasmfs_open = wasmExports["_wasmfs_open"])(a0, a1, a2);

var __wasmfs_allocate = (a0, a1, a2) => (__wasmfs_allocate = wasmExports["_wasmfs_allocate"])(a0, a1, a2);

var __wasmfs_mknod = (a0, a1, a2) => (__wasmfs_mknod = wasmExports["_wasmfs_mknod"])(a0, a1, a2);

var __wasmfs_unlink = a0 => (__wasmfs_unlink = wasmExports["_wasmfs_unlink"])(a0);

var __wasmfs_chdir = a0 => (__wasmfs_chdir = wasmExports["_wasmfs_chdir"])(a0);

var __wasmfs_symlink = (a0, a1) => (__wasmfs_symlink = wasmExports["_wasmfs_symlink"])(a0, a1);

var __wasmfs_readlink = a0 => (__wasmfs_readlink = wasmExports["_wasmfs_readlink"])(a0);

var __wasmfs_write = (a0, a1, a2) => (__wasmfs_write = wasmExports["_wasmfs_write"])(a0, a1, a2);

var __wasmfs_pwrite = (a0, a1, a2, a3) => (__wasmfs_pwrite = wasmExports["_wasmfs_pwrite"])(a0, a1, a2, a3);

var __wasmfs_chmod = (a0, a1) => (__wasmfs_chmod = wasmExports["_wasmfs_chmod"])(a0, a1);

var __wasmfs_fchmod = (a0, a1) => (__wasmfs_fchmod = wasmExports["_wasmfs_fchmod"])(a0, a1);

var __wasmfs_lchmod = (a0, a1) => (__wasmfs_lchmod = wasmExports["_wasmfs_lchmod"])(a0, a1);

var __wasmfs_llseek = (a0, a1, a2) => (__wasmfs_llseek = wasmExports["_wasmfs_llseek"])(a0, a1, a2);

var __wasmfs_rename = (a0, a1) => (__wasmfs_rename = wasmExports["_wasmfs_rename"])(a0, a1);

var __wasmfs_read = (a0, a1, a2) => (__wasmfs_read = wasmExports["_wasmfs_read"])(a0, a1, a2);

var __wasmfs_pread = (a0, a1, a2, a3) => (__wasmfs_pread = wasmExports["_wasmfs_pread"])(a0, a1, a2, a3);

var __wasmfs_truncate = (a0, a1) => (__wasmfs_truncate = wasmExports["_wasmfs_truncate"])(a0, a1);

var __wasmfs_ftruncate = (a0, a1) => (__wasmfs_ftruncate = wasmExports["_wasmfs_ftruncate"])(a0, a1);

var __wasmfs_close = a0 => (__wasmfs_close = wasmExports["_wasmfs_close"])(a0);

var __wasmfs_mmap = (a0, a1, a2, a3, a4) => (__wasmfs_mmap = wasmExports["_wasmfs_mmap"])(a0, a1, a2, a3, a4);

var __wasmfs_msync = (a0, a1, a2) => (__wasmfs_msync = wasmExports["_wasmfs_msync"])(a0, a1, a2);

var __wasmfs_munmap = (a0, a1) => (__wasmfs_munmap = wasmExports["_wasmfs_munmap"])(a0, a1);

var __wasmfs_utime = (a0, a1, a2) => (__wasmfs_utime = wasmExports["_wasmfs_utime"])(a0, a1, a2);

var __wasmfs_stat = (a0, a1) => (__wasmfs_stat = wasmExports["_wasmfs_stat"])(a0, a1);

var __wasmfs_lstat = (a0, a1) => (__wasmfs_lstat = wasmExports["_wasmfs_lstat"])(a0, a1);

var __wasmfs_mount = (a0, a1) => (__wasmfs_mount = wasmExports["_wasmfs_mount"])(a0, a1);

var __wasmfs_unmount = a0 => (__wasmfs_unmount = wasmExports["_wasmfs_unmount"])(a0);

var __wasmfs_identify = a0 => (__wasmfs_identify = wasmExports["_wasmfs_identify"])(a0);

var __wasmfs_readdir_start = a0 => (__wasmfs_readdir_start = wasmExports["_wasmfs_readdir_start"])(a0);

var __wasmfs_readdir_get = a0 => (__wasmfs_readdir_get = wasmExports["_wasmfs_readdir_get"])(a0);

var __wasmfs_readdir_finish = a0 => (__wasmfs_readdir_finish = wasmExports["_wasmfs_readdir_finish"])(a0);

var __wasmfs_get_cwd = () => (__wasmfs_get_cwd = wasmExports["_wasmfs_get_cwd"])();

var _wasmfs_create_jsimpl_backend = () => (_wasmfs_create_jsimpl_backend = wasmExports["wasmfs_create_jsimpl_backend"])();

var _wasmfs_create_memory_backend = () => (_wasmfs_create_memory_backend = wasmExports["wasmfs_create_memory_backend"])();

var _wasmfs_opfs_stat = Module["_wasmfs_opfs_stat"] = (a0, a1) => (_wasmfs_opfs_stat = Module["_wasmfs_opfs_stat"] = wasmExports["wasmfs_opfs_stat"])(a0, a1);

var _wasmfs_opfs_stat_shape = Module["_wasmfs_opfs_stat_shape"] = a0 => (_wasmfs_opfs_stat_shape = Module["_wasmfs_opfs_stat_shape"] = wasmExports["wasmfs_opfs_stat_shape"])(a0);

var _wasmfs_opfs_invalidate_negative_cache = Module["_wasmfs_opfs_invalidate_negative_cache"] = () => (_wasmfs_opfs_invalidate_negative_cache = Module["_wasmfs_opfs_invalidate_negative_cache"] = wasmExports["wasmfs_opfs_invalidate_negative_cache"])();

var _wasmfs_opfs_negative_stat = Module["_wasmfs_opfs_negative_stat"] = a0 => (_wasmfs_opfs_negative_stat = Module["_wasmfs_opfs_negative_stat"] = wasmExports["wasmfs_opfs_negative_stat"])(a0);

var __wasmfs_opfs_record_entry = (a0, a1, a2) => (__wasmfs_opfs_record_entry = wasmExports["_wasmfs_opfs_record_entry"])(a0, a1, a2);

var ___stack_pointer = Module["___stack_pointer"] = 13324496;

var ___start_em_js = Module["___start_em_js"] = 7202653;

var ___stop_em_js = Module["___stop_em_js"] = 7208116;

function applySignatureConversions(wasmExports) {
 wasmExports = Object.assign({}, wasmExports);
 var makeWrapper_pP = f => a0 => f(a0) >>> 0;
 var makeWrapper_p = f => () => f() >>> 0;
 var makeWrapper_pp = f => a0 => f(a0) >>> 0;
 var makeWrapper_ppp = f => (a0, a1) => f(a0, a1) >>> 0;
 var makeWrapper_p_ = f => a0 => f(a0) >>> 0;
 wasmExports["sbrk"] = makeWrapper_pP(wasmExports["sbrk"]);
 wasmExports["pthread_self"] = makeWrapper_p(wasmExports["pthread_self"]);
 wasmExports["malloc"] = makeWrapper_pp(wasmExports["malloc"]);
 wasmExports["memalign"] = makeWrapper_ppp(wasmExports["memalign"]);
 wasmExports["stackSave"] = makeWrapper_p(wasmExports["stackSave"]);
 wasmExports["emscripten_main_runtime_thread_id"] = makeWrapper_p(wasmExports["emscripten_main_runtime_thread_id"]);
 wasmExports["emscripten_builtin_memalign"] = makeWrapper_ppp(wasmExports["emscripten_builtin_memalign"]);
 wasmExports["stackAlloc"] = makeWrapper_pp(wasmExports["stackAlloc"]);
 wasmExports["_wasmfs_read_file"] = makeWrapper_pp(wasmExports["_wasmfs_read_file"]);
 wasmExports["_wasmfs_get_cwd"] = makeWrapper_p_(wasmExports["_wasmfs_get_cwd"]);
 return wasmExports;
}

Module["addRunDependency"] = addRunDependency;

Module["removeRunDependency"] = removeRunDependency;

Module["FS_createPath"] = FS.createPath;

Module["out"] = out;

Module["err"] = err;

Module["abort"] = abort;

Module["wasmMemory"] = wasmMemory;

Module["wasmExports"] = wasmExports;

Module["keepRuntimeAlive"] = keepRuntimeAlive;

Module["runtimeKeepalivePush"] = runtimeKeepalivePush;

Module["runtimeKeepalivePop"] = runtimeKeepalivePop;

Module["maybeExit"] = maybeExit;

Module["ccall"] = ccall;

Module["cwrap"] = cwrap;

Module["addFunction"] = addFunction;

Module["setValue"] = setValue;

Module["getValue"] = getValue;

Module["UTF8ArrayToString"] = UTF8ArrayToString;

Module["UTF8ToString"] = UTF8ToString;

Module["stringToUTF8Array"] = stringToUTF8Array;

Module["lengthBytesUTF8"] = lengthBytesUTF8;

Module["ExitStatus"] = ExitStatus;

Module["safeSetTimeout"] = safeSetTimeout;

Module["FS_createPreloadedFile"] = FS.createPreloadedFile;

Module["FS"] = FS;

Module["FS_createDataFile"] = FS.createDataFile;

Module["FS_unlink"] = FS.unlink;

Module["PThread"] = PThread;

var calledRun;

dependenciesFulfilled = function runCaller() {
 if (!calledRun) run();
 if (!calledRun) dependenciesFulfilled = runCaller;
};

function run() {
 if (runDependencies > 0) {
  return;
 }
 if (ENVIRONMENT_IS_PTHREAD) {
  readyPromiseResolve(Module);
  initRuntime();
  startWorker(Module);
  return;
 }
 preRun();
 if (runDependencies > 0) {
  return;
 }
 function doRun() {
  if (calledRun) return;
  calledRun = true;
  Module["calledRun"] = true;
  if (ABORT) return;
  initRuntime();
  readyPromiseResolve(Module);
  if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
  postRun();
 }
 if (Module["setStatus"]) {
  Module["setStatus"]("Running...");
  setTimeout(function() {
   setTimeout(function() {
    Module["setStatus"]("");
   }, 1);
   doRun();
  }, 1);
 } else {
  doRun();
 }
}

if (Module["preInit"]) {
 if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
 while (Module["preInit"].length > 0) {
  Module["preInit"].pop()();
 }
}

run();


  return moduleArg.ready
}
);
})();
export default createDotnetRuntime;
var fetch = fetch || undefined; var require = require || undefined; var __dirname = __dirname || ''; var _nativeModuleLoaded = false;
