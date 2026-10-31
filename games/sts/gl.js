(function () {
const G = {};
let gl = null;
const tex = [null], buf = [null], prog = [null], sh = [null], fbo = [null], rbo = [null], loc = [null];
const free = { tex: [], buf: [], prog: [], sh: [], fbo: [], rbo: [] };
const locCache = new Map();
const shType = [0];
let badFilter = false;

function add(tab, list, o) {
  if (!o) return 0;
  const id = list.length ? list.pop() : tab.length;
  tab[id] = o;
  return id;
}

function del(tab, list, id) {
  if (id > 0 && tab[id]) {
    tab[id] = null;
    list.push(id);
  }
}

function u8(dv, p, n) {
  return new Uint8Array(dv.buffer, dv.byteOffset + p, n === undefined ? dv.byteLength - p : n);
}

function i32(dv, p, n) {
  return new Int32Array(dv.buffer.slice(dv.byteOffset + p, dv.byteOffset + p + n * 4));
}

function f32(dv, p, n) {
  const off = dv.byteOffset + p;
  if ((off & 3) === 0) return new Float32Array(dv.buffer, off, n);
  return new Float32Array(dv.buffer.slice(off, off + n * 4));
}

function putInt(dv, p, v) {
  dv.setInt32(p, v | 0, true);
}

function putFloat(dv, p, v) {
  dv.setFloat32(p, +v, true);
}

function pixView(dv, p, type) {
  if (!dv) return null;
  const off = dv.byteOffset + p;
  const len = dv.byteLength - p;
  if (type === 0x8363 || type === 0x8033 || type === 0x8034 || type === 0x1403) {
    return new Uint16Array(dv.buffer.slice(off, off + (len & ~1)));
  }
  if (type === 0x1406) return new Float32Array(dv.buffer.slice(off, off + (len & ~3)));
  return new Uint8Array(dv.buffer, off, len);
}

function translate(src, type) {
  let s = src.replace(/^\s*#version[^\n]*\n/m, '');
  s = s.replace(/\btexture\b(?!\s*\()/g, 'sts_texture');
  s = s.replace(/\btexture2D\s*\(/g, 'texture(').replace(/\btextureCube\s*\(/g, 'texture(');
  s = s.replace(/\btexture2DLod\s*\(/g, 'textureLod(');
  s = s.replace(/\bsample\b/g, 'sts_sample');
  if (type === 0x8B31) {
    s = s.replace(/\battribute\b/g, 'in').replace(/\bvarying\b/g, 'out');
    return '#version 300 es\nprecision highp float;\nprecision highp int;\n' + s;
  }
  s = s.replace(/\bvarying\b/g, 'in').replace(/\bgl_FragColor\b/g, 'sts_FragColor').replace(/\bgl_FragData\s*\[\s*0\s*\]/g, 'sts_FragColor');
  return '#version 300 es\nprecision mediump float;\nprecision mediump int;\nout vec4 sts_FragColor;\n' + s;
}

G.init = function (ctx) {
  gl = ctx;
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
};
G.ctx = function () {
  return gl;
};

G.glActiveTexture = (t) => gl.activeTexture(t);
G.glBindTexture = (t, id) => gl.bindTexture(t, tex[id]);
G.glBlendFunc = (s, d) => gl.blendFunc(s, d);
G.glClear = (m) => gl.clear(m);
G.glClearColor = (r, g, b, a) => gl.clearColor(r, g, b, a);
G.glClearDepthf = (d) => gl.clearDepth(d);
G.glClearStencil = (s) => gl.clearStencil(s);
G.glColorMask = (r, g, b, a) => gl.colorMask(r, g, b, a);
G.glCompressedTexImage2D = (t, l, f, w, h, b, size, d, p) => gl.compressedTexImage2D(t, l, f, w, h, b, u8(d, p, size));
G.glCompressedTexSubImage2D = (t, l, x, y, w, h, f, size, d, p) => gl.compressedTexSubImage2D(t, l, x, y, w, h, f, u8(d, p, size));
G.glCopyTexImage2D = (t, l, f, x, y, w, h, b) => gl.copyTexImage2D(t, l, f, x, y, w, h, b);
G.glCopyTexSubImage2D = (t, l, xo, yo, x, y, w, h) => gl.copyTexSubImage2D(t, l, xo, yo, x, y, w, h);
G.glCullFace = (m) => gl.cullFace(m);
G.glDeleteTextures = (n, d, p) => {
  for (let i = 0; i < n; i++) {
    const id = d.getInt32(p + i * 4, true);
    if (tex[id]) gl.deleteTexture(tex[id]);
    del(tex, free.tex, id);
  }
};
G.glDeleteTexture = (id) => {
  if (tex[id]) gl.deleteTexture(tex[id]);
  del(tex, free.tex, id);
};
G.glDepthFunc = (f) => gl.depthFunc(f);
G.glDepthMask = (f) => gl.depthMask(f);
G.glDepthRangef = (n, f) => gl.depthRange(n, f);
G.glDisable = (c) => gl.disable(c);
G.glDrawArrays = (m, f, c) => {
  G.draws++;
  gl.drawArrays(m, f, c);
};
G.draws = 0;
G.glDrawElements_b = (m, c, t, d, p) => {
  G.draws++;
  gl.drawElements(m, c, t, p);
};
G.glDrawElements_i = (m, c, t, off) => {
  G.draws++;
  gl.drawElements(m, c, t, off);
};
G.glEnable = (c) => gl.enable(c);
G.glFinish = () => gl.finish();
G.glFlush = () => gl.flush();
G.glFrontFace = (m) => gl.frontFace(m);
G.glGenTextures = (n, d, p) => {
  for (let i = 0; i < n; i++) putInt(d, p + i * 4, add(tex, free.tex, gl.createTexture()));
};
G.glGenTexture = () => add(tex, free.tex, gl.createTexture());
G.glGetError = () => gl.getError();
G.glGetIntegerv = (pname, d, p) => {
  const v = gl.getParameter(pname);
  if (v === null || v === undefined) putInt(d, p, 0);
  else if (typeof v === 'number' || typeof v === 'boolean') putInt(d, p, +v);
  else if (v.length !== undefined) for (let i = 0; i < v.length; i++) putInt(d, p + i * 4, +v[i]);
  else {
    let id = 0;
    for (const t of [tex, buf, prog, fbo, rbo]) {
      const k = t.indexOf(v);
      if (k > 0) id = k;
    }
    putInt(d, p, id);
  }
};
G.glGetString = (n) => {
  if (n === 0x1F03) return (gl.getSupportedExtensions() || []).join(' ');
  if (n === 0x1F02) return 'WebGL 2.0';
  const v = gl.getParameter(n);
  return v == null ? '' : String(v);
};
G.glHint = (t, m) => gl.hint(t, m);
G.glLineWidth = (w) => gl.lineWidth(w);
G.glPixelStorei = (p, v) => gl.pixelStorei(p, v);
G.glPolygonOffset = (f, u) => gl.polygonOffset(f, u);
G.glReadPixels = (x, y, w, h, f, t, d, p) => {
  if (t === 0x1401) gl.readPixels(x, y, w, h, f, t, u8(d, p));
  else {
    const tmp = pixView(d, p, t);
    gl.readPixels(x, y, w, h, f, t, tmp);
    u8(d, p, tmp.byteLength).set(new Uint8Array(tmp.buffer, tmp.byteOffset, tmp.byteLength));
  }
};
G.glScissor = (x, y, w, h) => gl.scissor(x, y, w, h);
G.glStencilFunc = (f, r, m) => gl.stencilFunc(f, r, m);
G.glStencilMask = (m) => gl.stencilMask(m);
G.glStencilOp = (f, zf, zp) => gl.stencilOp(f, zf, zp);
G.glTexImage2D = (t, l, ifmt, w, h, b, f, ty, d, p) => {
  try {
    gl.texImage2D(t, l, ifmt, w, h, b, f, ty, pixView(d, p, ty));
  } catch (e) {
    console.error('texImage2D failed', t, l, ifmt, w, h, f, ty, d && d.byteLength, p, e);
    throw e;
  }
};
G.texImageSource = (t, l, ifmt, f, ty, img) => {
  gl.texImage2D(t, l, ifmt, f, ty, img);
};
G.glTexParameterf = (t, p, v) => {
  if (p >= 0x2800 && p <= 0x2803) {
    if (!badFilter && (v | 0) !== v) {
      badFilter = true;
      console.warn('texParameterf', p, v);
    }
    gl.texParameteri(t, p, v | 0);
  }
  else gl.texParameterf(t, p, v);
};
G.glTexSubImage2D = (t, l, x, y, w, h, f, ty, d, p) => {
  gl.texSubImage2D(t, l, x, y, w, h, f, ty, pixView(d, p, ty));
};
G.texSubImageSource = (t, l, x, y, f, ty, img) => {
  gl.texSubImage2D(t, l, x, y, f, ty, img);
};
G.glViewport = (x, y, w, h) => gl.viewport(x, y, w, h);
G.glAttachShader = (p, s) => gl.attachShader(prog[p], sh[s]);
G.glBindAttribLocation = (p, i, n) => gl.bindAttribLocation(prog[p], i, n);
G.glBindBuffer = (t, id) => gl.bindBuffer(t, buf[id]);
G.glBindFramebuffer = (t, id) => gl.bindFramebuffer(t, fbo[id]);
G.glBindRenderbuffer = (t, id) => gl.bindRenderbuffer(t, rbo[id]);
G.glBlendColor = (r, g, b, a) => gl.blendColor(r, g, b, a);
G.glBlendEquation = (m) => gl.blendEquation(m);
G.glBlendEquationSeparate = (a, b) => gl.blendEquationSeparate(a, b);
G.glBlendFuncSeparate = (a, b, c, d) => gl.blendFuncSeparate(a, b, c, d);
G.glBufferData = (t, size, d, p, u) => {
  if (!d) gl.bufferData(t, size, u);
  else gl.bufferData(t, u8(d, p, size), u);
};
G.glBufferSubData = (t, off, size, d, p) => gl.bufferSubData(t, off, u8(d, p, size));
G.glCheckFramebufferStatus = (t) => gl.checkFramebufferStatus(t);
G.glCompileShader = (s) => {
  gl.compileShader(sh[s]);
  if (self.STS && STS.debug && !gl.getShaderParameter(sh[s], gl.COMPILE_STATUS)) (STS.shaderLogs = STS.shaderLogs || []).push(gl.getShaderInfoLog(sh[s]) + ' SRC ' + gl.getShaderSource(sh[s]));
};
G.glCreateProgram = () => add(prog, free.prog, gl.createProgram());
G.glCreateShader = (t) => {
  const id = add(sh, free.sh, gl.createShader(t));
  shType[id] = t;
  return id;
};
G.glDeleteBuffer = (id) => {
  if (buf[id]) gl.deleteBuffer(buf[id]);
  del(buf, free.buf, id);
};
G.glDeleteBuffers = (n, d, p) => {
  for (let i = 0; i < n; i++) G.glDeleteBuffer(d.getInt32(p + i * 4, true));
};
G.glDeleteFramebuffer = (id) => {
  if (fbo[id]) gl.deleteFramebuffer(fbo[id]);
  del(fbo, free.fbo, id);
};
G.glDeleteFramebuffers = (n, d, p) => {
  for (let i = 0; i < n; i++) G.glDeleteFramebuffer(d.getInt32(p + i * 4, true));
};
G.glDeleteProgram = (id) => {
  if (prog[id]) {
    locCache.delete(prog[id]);
    gl.deleteProgram(prog[id]);
  }
  del(prog, free.prog, id);
};
G.glDeleteRenderbuffer = (id) => {
  if (rbo[id]) gl.deleteRenderbuffer(rbo[id]);
  del(rbo, free.rbo, id);
};
G.glDeleteRenderbuffers = (n, d, p) => {
  for (let i = 0; i < n; i++) G.glDeleteRenderbuffer(d.getInt32(p + i * 4, true));
};
G.glDeleteShader = (id) => {
  if (sh[id]) gl.deleteShader(sh[id]);
  del(sh, free.sh, id);
};
G.glDetachShader = (p, s) => gl.detachShader(prog[p], sh[s]);
G.glDisableVertexAttribArray = (i) => gl.disableVertexAttribArray(i);
G.glEnableVertexAttribArray = (i) => gl.enableVertexAttribArray(i);
G.glFramebufferRenderbuffer = (t, a, rt, id) => gl.framebufferRenderbuffer(t, a, rt, rbo[id]);
G.glFramebufferTexture2D = (t, a, tt, id, l) => gl.framebufferTexture2D(t, a, tt, tex[id], l);
G.glGenBuffer = () => add(buf, free.buf, gl.createBuffer());
G.glGenBuffers = (n, d, p) => {
  for (let i = 0; i < n; i++) putInt(d, p + i * 4, G.glGenBuffer());
};
G.glGenerateMipmap = (t) => gl.generateMipmap(t);
G.glGenFramebuffer = () => add(fbo, free.fbo, gl.createFramebuffer());
G.glGenFramebuffers = (n, d, p) => {
  for (let i = 0; i < n; i++) putInt(d, p + i * 4, G.glGenFramebuffer());
};
G.glGenRenderbuffer = () => add(rbo, free.rbo, gl.createRenderbuffer());
G.glGenRenderbuffers = (n, d, p) => {
  for (let i = 0; i < n; i++) putInt(d, p + i * 4, G.glGenRenderbuffer());
};
function active(info, sd, sp, td, tp) {
  if (!info) return null;
  if (sd) putInt(sd, sp, info.size);
  if (td) putInt(td, tp, info.type);
  return info.name;
}
G.glGetActiveAttrib = (p, i, sd, sp, td, tp) => active(gl.getActiveAttrib(prog[p], i), sd, sp, td, tp);
G.glGetActiveUniform = (p, i, sd, sp, td, tp) => active(gl.getActiveUniform(prog[p], i), sd, sp, td, tp);
G.glGetAttachedShaders = (p, max, cd, cp, sd, sp) => {
  const list = gl.getAttachedShaders(prog[p]) || [];
  const n = Math.min(max, list.length);
  if (cd) putInt(cd, cp, n);
  for (let i = 0; i < n; i++) putInt(sd, sp + i * 4, sh.indexOf(list[i]));
};
G.glGetAttribLocation = (p, n) => gl.getAttribLocation(prog[p], n);
G.glGetBooleanv = (pname, d, p) => d.setUint8(p, gl.getParameter(pname) ? 1 : 0);
G.glGetBufferParameteriv = (t, pname, d, p) => putInt(d, p, gl.getBufferParameter(t, pname));
G.glGetFloatv = (pname, d, p) => {
  const v = gl.getParameter(pname);
  if (v && v.length !== undefined) for (let i = 0; i < v.length; i++) putFloat(d, p + i * 4, v[i]);
  else putFloat(d, p, v || 0);
};
G.glGetFramebufferAttachmentParameteriv = (t, a, pname, d, p) => {
  const v = gl.getFramebufferAttachmentParameter(t, a, pname);
  putInt(d, p, typeof v === 'number' ? v : 0);
};
G.glGetProgramiv = (id, pname, d, p) => {
  const v = gl.getProgramParameter(prog[id], pname);
  putInt(d, p, typeof v === 'boolean' ? (v ? 1 : 0) : v);
};
G.glGetProgramInfoLog = (id) => gl.getProgramInfoLog(prog[id]) || '';
G.glGetRenderbufferParameteriv = (t, pname, d, p) => putInt(d, p, gl.getRenderbufferParameter(t, pname));
G.glGetShaderiv = (id, pname, d, p) => {
  const v = gl.getShaderParameter(sh[id], pname);
  putInt(d, p, typeof v === 'boolean' ? (v ? 1 : 0) : v);
};
G.glGetShaderInfoLog = (id) => gl.getShaderInfoLog(sh[id]) || '';
G.glGetShaderPrecisionFormat = (st, pt, rd, rp, pd, pp) => {
  const f = gl.getShaderPrecisionFormat(st, pt);
  putInt(rd, rp, f.rangeMin);
  putInt(rd, rp + 4, f.rangeMax);
  putInt(pd, pp, f.precision);
};
G.glGetTexParameterfv = (t, pname, d, p) => putFloat(d, p, gl.getTexParameter(t, pname));
G.glGetTexParameteriv = (t, pname, d, p) => putInt(d, p, gl.getTexParameter(t, pname));
G.glGetUniformfv = (pid, l, d, p) => {
  const v = gl.getUniform(prog[pid], loc[l]);
  if (v && v.length !== undefined) for (let i = 0; i < v.length; i++) putFloat(d, p + i * 4, v[i]);
  else putFloat(d, p, v);
};
G.glGetUniformiv = (pid, l, d, p) => {
  const v = gl.getUniform(prog[pid], loc[l]);
  if (v && v.length !== undefined) for (let i = 0; i < v.length; i++) putInt(d, p + i * 4, v[i]);
  else putInt(d, p, +v);
};
G.glGetUniformLocation = (pid, name) => {
  const pr = prog[pid];
  let m = locCache.get(pr);
  if (!m) {
    m = new Map();
    locCache.set(pr, m);
  }
  let id = m.get(name);
  if (id === undefined) {
    const l = gl.getUniformLocation(pr, name);
    id = l ? loc.push(l) - 1 : -1;
    m.set(name, id);
  }
  return id;
};
G.glGetVertexAttribfv = (i, pname, d, p) => {
  const v = gl.getVertexAttrib(i, pname);
  if (v && v.length !== undefined) for (let k = 0; k < v.length; k++) putFloat(d, p + k * 4, v[k]);
  else putFloat(d, p, +v);
};
G.glGetVertexAttribiv = (i, pname, d, p) => {
  const v = gl.getVertexAttrib(i, pname);
  putInt(d, p, typeof v === 'object' && v ? buf.indexOf(v) : +v);
};
G.glGetVertexAttribPointerv = () => {};
G.glIsBuffer = (id) => !!buf[id] && gl.isBuffer(buf[id]);
G.glIsEnabled = (c) => gl.isEnabled(c);
G.glIsFramebuffer = (id) => !!fbo[id] && gl.isFramebuffer(fbo[id]);
G.glIsProgram = (id) => !!prog[id] && gl.isProgram(prog[id]);
G.glIsRenderbuffer = (id) => !!rbo[id] && gl.isRenderbuffer(rbo[id]);
G.glIsShader = (id) => !!sh[id] && gl.isShader(sh[id]);
G.glIsTexture = (id) => !!tex[id] && gl.isTexture(tex[id]);
G.glLinkProgram = (id) => gl.linkProgram(prog[id]);
G.glReleaseShaderCompiler = () => {};
G.glRenderbufferStorage = (t, f, w, h) => gl.renderbufferStorage(t, f === 0x8D48 ? 0x8D48 : f, w, h);
G.glSampleCoverage = (v, i) => gl.sampleCoverage(v, i);
G.glShaderBinary = () => {};
G.glShaderSource = (id, src) => {
  const out = translate(src, shType[id]);
  gl.shaderSource(sh[id], out);
};
G.glStencilFuncSeparate = (f, fn, r, m) => gl.stencilFuncSeparate(f, fn, r, m);
G.glStencilMaskSeparate = (f, m) => gl.stencilMaskSeparate(f, m);
G.glStencilOpSeparate = (f, a, b, c) => gl.stencilOpSeparate(f, a, b, c);
G.glTexParameterfv = (t, pname, d, p) => gl.texParameterf(t, pname, d.getFloat32(p, true));
G.glTexParameteri = (t, pname, v) => {
  if (pname === 0x2801 && v !== 0x2600 && v !== 0x2601 && v !== 0x2700 && v !== 0x2701 && v !== 0x2702 && v !== 0x2703 && !badFilter) {
    badFilter = true;
    console.warn('min filter', v, new Error().stack);
  }
  gl.texParameteri(t, pname, v);
};
G.glTexParameteriv = (t, pname, d, p) => gl.texParameteri(t, pname, d.getInt32(p, true));
G.glUniform1f = (l, x) => gl.uniform1f(loc[l], x);
G.glUniform1fv_b = (l, c, d, p) => gl.uniform1fv(loc[l], f32(d, p, c));
G.glUniform1fv_a = (l, c, v, o) => gl.uniform1fv(loc[l], v, o, c);
G.glUniform1i = (l, x) => gl.uniform1i(loc[l], x);
G.glUniform1iv_b = (l, c, d, p) => gl.uniform1iv(loc[l], i32(d, p, c));
G.glUniform1iv_a = (l, c, v, o) => gl.uniform1iv(loc[l], v, o, c);
G.glUniform2f = (l, x, y) => gl.uniform2f(loc[l], x, y);
G.glUniform2fv_b = (l, c, d, p) => gl.uniform2fv(loc[l], f32(d, p, c * 2));
G.glUniform2fv_a = (l, c, v, o) => gl.uniform2fv(loc[l], v, o, c * 2);
G.glUniform2i = (l, x, y) => gl.uniform2i(loc[l], x, y);
G.glUniform2iv_b = (l, c, d, p) => gl.uniform2iv(loc[l], i32(d, p, c * 2));
G.glUniform2iv_a = (l, c, v, o) => gl.uniform2iv(loc[l], v, o, c * 2);
G.glUniform3f = (l, x, y, z) => gl.uniform3f(loc[l], x, y, z);
G.glUniform3fv_b = (l, c, d, p) => gl.uniform3fv(loc[l], f32(d, p, c * 3));
G.glUniform3fv_a = (l, c, v, o) => gl.uniform3fv(loc[l], v, o, c * 3);
G.glUniform3i = (l, x, y, z) => gl.uniform3i(loc[l], x, y, z);
G.glUniform3iv_b = (l, c, d, p) => gl.uniform3iv(loc[l], i32(d, p, c * 3));
G.glUniform3iv_a = (l, c, v, o) => gl.uniform3iv(loc[l], v, o, c * 3);
G.glUniform4f = (l, x, y, z, w) => gl.uniform4f(loc[l], x, y, z, w);
G.glUniform4fv_b = (l, c, d, p) => gl.uniform4fv(loc[l], f32(d, p, c * 4));
G.glUniform4fv_a = (l, c, v, o) => gl.uniform4fv(loc[l], v, o, c * 4);
G.glUniform4i = (l, x, y, z, w) => gl.uniform4i(loc[l], x, y, z, w);
G.glUniform4iv_b = (l, c, d, p) => gl.uniform4iv(loc[l], i32(d, p, c * 4));
G.glUniform4iv_a = (l, c, v, o) => gl.uniform4iv(loc[l], v, o, c * 4);
G.glUniformMatrix2fv_b = (l, c, t, d, p) => gl.uniformMatrix2fv(loc[l], t, f32(d, p, c * 4));
G.glUniformMatrix2fv_a = (l, c, t, v, o) => gl.uniformMatrix2fv(loc[l], t, v, o, c * 4);
G.glUniformMatrix3fv_b = (l, c, t, d, p) => gl.uniformMatrix3fv(loc[l], t, f32(d, p, c * 9));
G.glUniformMatrix3fv_a = (l, c, t, v, o) => gl.uniformMatrix3fv(loc[l], t, v, o, c * 9);
G.glUniformMatrix4fv_b = (l, c, t, d, p) => gl.uniformMatrix4fv(loc[l], t, f32(d, p, c * 16));
G.glUniformMatrix4fv_a = (l, c, t, v, o) => gl.uniformMatrix4fv(loc[l], t, v, o, c * 16);
G.glUseProgram = (id) => gl.useProgram(prog[id]);
G.glValidateProgram = (id) => gl.validateProgram(prog[id]);
G.glVertexAttrib1f = (i, x) => gl.vertexAttrib1f(i, x);
G.glVertexAttrib1fv = (i, d, p) => gl.vertexAttrib1fv(i, f32(d, p, 1));
G.glVertexAttrib2f = (i, x, y) => gl.vertexAttrib2f(i, x, y);
G.glVertexAttrib2fv = (i, d, p) => gl.vertexAttrib2fv(i, f32(d, p, 2));
G.glVertexAttrib3f = (i, x, y, z) => gl.vertexAttrib3f(i, x, y, z);
G.glVertexAttrib3fv = (i, d, p) => gl.vertexAttrib3fv(i, f32(d, p, 3));
G.glVertexAttrib4f = (i, x, y, z, w) => gl.vertexAttrib4f(i, x, y, z, w);
G.glVertexAttrib4fv = (i, d, p) => gl.vertexAttrib4fv(i, f32(d, p, 4));
G.glVertexAttribPointer_b = () => {
  throw new Error('client-side vertex arrays are not supported');
};
G.glVertexAttribPointer_i = (i, s, t, n, st, off) => gl.vertexAttribPointer(i, s, t, n, st, off);

self.G = G;
})();
