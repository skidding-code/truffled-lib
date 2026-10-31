(function () {
const P = {};
const lu4 = new Uint32Array(16), lu5 = new Uint32Array(32), lu6 = new Uint32Array(64);
for (let i = 0; i < 16; i++) lu4[i] = Math.floor(i / 15 * 255);
for (let i = 0; i < 32; i++) lu5[i] = Math.floor(i / 31 * 255);
for (let i = 0; i < 64; i++) lu6[i] = Math.floor(i / 63 * 255);
const BPP = [0, 1, 2, 3, 4, 2, 2];

function toFormat(f, c) {
  c >>>= 0;
  let r, g, b, a;
  switch (f) {
    case 1: return c & 0xff;
    case 2:
      r = (c >>> 24) & 0xff; g = (c >>> 16) & 0xff; b = (c >>> 8) & 0xff; a = c & 0xff;
      return ((((0.2126 * r + 0.7152 * g + 0.0722 * b) >>> 0) & 0xff) << 8 | a) >>> 0;
    case 3: return c >>> 8;
    case 4: return c;
    case 5:
      r = (((c >>> 27) << 11) & 0xf800);
      g = (((c >>> 18) << 5) & 0x7e0);
      b = ((c & 0xff00) >>> 11) & 0x1f;
      return r | g | b;
    case 6:
      r = (((c >>> 28) << 12) & 0xf000);
      g = ((((c & 0xff0000) >>> 20) << 8) & 0xf00);
      b = ((((c & 0xff00) >>> 12) << 4) & 0xf0);
      a = ((c & 0xff) >>> 4) & 0xf;
      return r | g | b | a;
  }
  return 0;
}

function toRGBA(f, c) {
  switch (f) {
    case 1: return ((c & 0xff) | 0xffffff00) >>> 0;
    case 2: return (((c & 0xff00) << 16) | ((c & 0xff00) << 8) | (c & 0xffff)) >>> 0;
    case 3: return ((c << 8) | 0xff) >>> 0;
    case 4: return c >>> 0;
    case 5: return ((lu5[(c & 0xf800) >>> 11] << 24) | (lu6[(c & 0x7e0) >>> 5] << 16) | (lu5[c & 0x1f] << 8) | 0xff) >>> 0;
    case 6: return ((lu4[(c & 0xf000) >>> 12] << 24) | (lu4[(c & 0xf00) >>> 8] << 16) | (lu4[(c & 0xf0) >>> 4] << 8) | lu4[c & 0xf]) >>> 0;
  }
  return 0;
}

function getRaw(p, o, f) {
  switch (f) {
    case 1: return p[o];
    case 2: return (p[o] << 8) | p[o + 1];
    case 3: return (p[o] << 16) | (p[o + 1] << 8) | p[o + 2];
    case 4: return ((p[o] << 24) | (p[o + 1] << 16) | (p[o + 2] << 8) | p[o + 3]) >>> 0;
    default: return p[o] | (p[o + 1] << 8);
  }
}

function setRaw(p, o, f, c) {
  switch (f) {
    case 1: p[o] = c; break;
    case 3: p[o] = c >>> 16; p[o + 1] = c >>> 8; p[o + 2] = c; break;
    case 4: p[o] = c >>> 24; p[o + 1] = c >>> 16; p[o + 2] = c >>> 8; p[o + 3] = c; break;
    default: p[o] = c; p[o + 1] = c >>> 8; break;
  }
}

function blend(src, dst) {
  const sa = src & 0xff;
  if (sa === 0) return dst >>> 0;
  const sb = (src >>> 8) & 0xff, sg = (src >>> 16) & 0xff, sr = (src >>> 24) & 0xff;
  let da = dst & 0xff, db = (dst >>> 8) & 0xff, dg = (dst >>> 16) & 0xff, dr = (dst >>> 24) & 0xff;
  da -= Math.floor((da * sa) / 255);
  const a = da + sa;
  dr = Math.floor((dr * da + sr * sa) / a);
  dg = Math.floor((dg * da + sg * sa) / a);
  db = Math.floor((db * da + sb * sa) / a);
  return ((dr << 24) | (dg << 16) | (db << 8) | a) >>> 0;
}

P.clear = function (p, w, h, f, col) {
  const c = toFormat(f, col);
  const n = w * h;
  if (f === 1) { p.fill(c & 0xff, 0, n); return; }
  if (f === 4) {
    const r = c >>> 24, g = (c >>> 16) & 0xff, b = (c >>> 8) & 0xff, a = c & 0xff;
    if (r === g && g === b && b === a) { p.fill(r, 0, n * 4); return; }
    for (let i = 0, o = 0; i < n; i++, o += 4) { p[o] = r; p[o + 1] = g; p[o + 2] = b; p[o + 3] = a; }
    return;
  }
  const bpp = BPP[f];
  for (let i = 0, o = 0; i < n; i++, o += bpp) setRaw(p, o, f, f === 2 ? (((c & 0xff) << 8) | (c >>> 8)) : c);
};

P.getPixel = function (p, w, h, f, x, y) {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  return toRGBA(f, getRaw(p, (x + w * y) * BPP[f], f)) | 0;
};

function put(p, w, h, f, x, y, col, bl) {
  if (x < 0 || y < 0 || x >= w || y >= h) return;
  const o = (x + w * y) * BPP[f];
  if (bl) col = blend(col, toRGBA(f, getRaw(p, o, f)));
  setRaw(p, o, f, toFormat(f, col));
}

P.setPixel = function (p, w, h, f, x, y, col, bl) {
  put(p, w, h, f, x, y, col >>> 0, bl);
};

P.drawLine = function (p, w, h, f, x0, y0, x1, y1, col, bl) {
  col >>>= 0;
  let dy = y1 - y0, dx = x1 - x0, stepx, stepy, fraction;
  if (dy < 0) { dy = -dy; stepy = -1; } else stepy = 1;
  if (dx < 0) { dx = -dx; stepx = -1; } else stepx = 1;
  dy <<= 1; dx <<= 1;
  put(p, w, h, f, x0, y0, col, bl);
  if (dx > dy) {
    fraction = dy - (dx >> 1);
    while (x0 !== x1) {
      if (fraction >= 0) { y0 += stepy; fraction -= dx; }
      x0 += stepx; fraction += dy;
      put(p, w, h, f, x0, y0, col, bl);
    }
  } else {
    fraction = dx - (dy >> 1);
    while (y0 !== y1) {
      if (fraction >= 0) { x0 += stepx; fraction -= dy; }
      y0 += stepy; fraction += dx;
      put(p, w, h, f, x0, y0, col, bl);
    }
  }
};

function hline(p, w, h, f, x1, x2, y, col, bl) {
  if (y < 0 || y >= h) return;
  if (x1 > x2) { const t = x1; x1 = x2; x2 = t; }
  if (x1 >= w || x2 < 0) return;
  if (x1 < 0) x1 = 0;
  if (x2 >= w) x2 = w - 1;
  const bpp = BPP[f];
  let o = (x1 + y * w) * bpp;
  const fc = toFormat(f, col);
  for (let x = x1; x <= x2; x++, o += bpp) {
    if (bl) setRaw(p, o, f, toFormat(f, blend(col, toRGBA(f, getRaw(p, o, f)))));
    else setRaw(p, o, f, fc);
  }
}

function vline(p, w, h, f, y1, y2, x, col, bl) {
  if (x < 0 || x >= w) return;
  if (y1 > y2) { const t = y1; y1 = y2; y2 = t; }
  if (y1 >= h || y2 < 0) return;
  if (y1 < 0) y1 = 0;
  if (y2 >= h) y2 = h - 1;
  for (let y = y1; y <= y2; y++) put(p, w, h, f, x, y, col, bl);
}

P.drawRect = function (p, w, h, f, x, y, rw, rh, col, bl) {
  col >>>= 0;
  hline(p, w, h, f, x, x + rw - 1, y, col, bl);
  hline(p, w, h, f, x, x + rw - 1, y + rh - 1, col, bl);
  vline(p, w, h, f, y, y + rh - 1, x, col, bl);
  vline(p, w, h, f, y, y + rh - 1, x + rw - 1, col, bl);
};

function circlePoints(p, w, h, f, cx, cy, x, y, col) {
  const s = (px, py) => put(p, w, h, f, px, py, col, 0);
  if (x === 0) {
    s(cx, cy + y); s(cx, cy - y); s(cx + y, cy); s(cx - y, cy);
  } else if (x === y) {
    s(cx + x, cy + y); s(cx - x, cy + y); s(cx + x, cy - y); s(cx - x, cy - y);
  } else if (x < y) {
    s(cx + x, cy + y); s(cx - x, cy + y); s(cx + x, cy - y); s(cx - x, cy - y);
    s(cx + y, cy + x); s(cx - y, cy + x); s(cx + y, cy - x); s(cx - y, cy - x);
  }
}

P.drawCircle = function (p, w, h, f, x, y, r, col) {
  col >>>= 0;
  let px = 0, py = r, d = Math.trunc((5 - r * 4) / 4);
  circlePoints(p, w, h, f, x, y, px, py, col);
  while (px < py) {
    px++;
    if (d < 0) d += 2 * px + 1;
    else { py--; d += 2 * (px - py) + 1; }
    circlePoints(p, w, h, f, x, y, px, py, col);
  }
};

P.fillRect = function (p, w, h, f, x, y, rw, rh, col, bl) {
  col >>>= 0;
  let x2 = x + rw - 1, y2 = y + rh - 1;
  if (x >= w || y >= h || x2 < 0 || y2 < 0) return;
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x2 >= w) x2 = w - 1;
  if (y2 >= h) y2 = h - 1;
  for (; y <= y2; y++) hline(p, w, h, f, x, x2, y, col, bl);
};

P.fillCircle = function (p, w, h, f, x0, y0, r, col, bl) {
  col >>>= 0;
  let ff = 1 - r, ddx = 1, ddy = -2 * r, px = 0, py = r;
  hline(p, w, h, f, x0, x0, y0 + r, col, bl);
  hline(p, w, h, f, x0, x0, y0 - r, col, bl);
  hline(p, w, h, f, x0 - r, x0 + r, y0, col, bl);
  while (px < py) {
    if (ff >= 0) { py--; ddy += 2; ff += ddy; }
    px++; ddx += 2; ff += ddx;
    hline(p, w, h, f, x0 - px, x0 + px, y0 + py, col, bl);
    hline(p, w, h, f, x0 - px, x0 + px, y0 - py, col, bl);
    hline(p, w, h, f, x0 - py, x0 + py, y0 + px, col, bl);
    hline(p, w, h, f, x0 - py, x0 + py, y0 - px, col, bl);
  }
};

P.fillTriangle = function (p, w, h, f, x1, y1, x2, y2, x3, y3, col, bl) {
  col >>>= 0;
  if ((x2 - x1) * (y3 - y1) === (x3 - x1) * (y2 - y1)) return;
  const edge = (ax, ay, bx, by) => (by > ay ? {x1: ax, y1: ay, x2: bx, y2: by} : {x1: bx, y1: by, x2: ax, y2: ay});
  const e = [edge(x1, y1, x2, y2), edge(x1, y1, x3, y3), edge(x2, y2, x3, y3)];
  const len = (k) => e[k].y2 - e[k].y1;
  let l0 = len(0), l1 = len(1), l2 = len(2), t;
  if (l1 >= l0 && l1 >= l2) { t = e[0]; e[0] = e[1]; e[1] = t; t = l0; l0 = l1; l1 = t; }
  else if (l2 >= l0 && l2 >= l1) { t = e[0]; e[0] = e[2]; e[2] = t; t = l0; l0 = l2; l2 = t; }
  if (l2 > l1) { t = e[1]; e[1] = e[2]; e[2] = t; }
  const s0 = (e[0].x1 - e[0].x2) / (e[0].y2 - e[0].y1);
  const s1 = (e[1].x1 - e[1].x2) / (e[1].y2 - e[1].y1);
  let b1 = Math.max(e[1].y1, 0), b2 = Math.min(e[1].y2, h - 1);
  for (let y = b1; y <= b2; y++) {
    hline(p, w, h, f, Math.trunc(e[0].x2 + s0 * (e[0].y2 - y) + 0.5), Math.trunc(e[1].x2 + s1 * (e[1].y2 - y) + 0.5), y, col, bl);
  }
  if (e[2].y2 - e[2].y1 > 0) {
    const s2 = (e[2].x1 - e[2].x2) / (e[2].y2 - e[2].y1);
    b1 = Math.max(e[2].y1, 0); b2 = Math.min(e[2].y2, h - 1);
    for (let y = b1; y <= b2; y++) {
      hline(p, w, h, f, Math.trunc(e[0].x2 + s0 * (e[0].y2 - y) + 0.5), Math.trunc(e[2].x2 + s2 * (e[2].y2 - y) + 0.5), y, col, bl);
    }
  }
};

function sameSize(s, sw, sh, sf, d, dw, dh, df, sx0, sy0, dx0, dy0, w, h, bl) {
  if (sf === 4 && df === 4 && !bl) {
    let x0 = sx0, dxs = dx0, ww = w;
    if (x0 < 0) { dxs -= x0; ww += x0; x0 = 0; }
    if (dxs < 0) { x0 -= dxs; ww += dxs; dxs = 0; }
    ww = Math.min(ww, sw - x0, dw - dxs);
    if (ww <= 0) return;
    for (let r = 0; r < h; r++) {
      const sy = sy0 + r, dy = dy0 + r;
      if (sy < 0 || dy < 0) continue;
      if (sy >= sh || dy >= dh) break;
      const so = (x0 + sy * sw) * 4;
      d.set(s.subarray(so, so + ww * 4), (dxs + dy * dw) * 4);
    }
    return;
  }
  const sb = BPP[sf], db = BPP[df];
  for (let r = 0; r < h; r++) {
    const sy = sy0 + r, dy = dy0 + r;
    if (sy < 0 || dy < 0) continue;
    if (sy >= sh || dy >= dh) break;
    for (let c = 0; c < w; c++) {
      const sx = sx0 + c, dx = dx0 + c;
      if (sx < 0 || dx < 0) continue;
      if (sx >= sw || dx >= dw) break;
      const so = (sx + sy * sw) * sb, dof = (dx + dy * dw) * db;
      let col = toRGBA(sf, getRaw(s, so, sf));
      if (bl) col = blend(col, toRGBA(df, getRaw(d, dof, df)));
      setRaw(d, dof, df, toFormat(df, col));
    }
  }
}

function nearest(s, sw, sh, sf, d, dw, dh, df, sx0, sy0, sww, shh, dx0, dy0, dww, dhh, bl) {
  const sb = BPP[sf], db = BPP[df];
  const xr = Math.floor((sww << 16) / dww) + 1, yr = Math.floor((shh << 16) / dhh) + 1;
  for (let i = 0; i < dhh; i++) {
    const sy = Math.floor((i * yr) / 65536) + sy0, dy = i + dy0;
    if (sy < 0 || dy < 0) continue;
    if (sy >= sh || dy >= dh) break;
    for (let j = 0; j < dww; j++) {
      const sx = Math.floor((j * xr) / 65536) + sx0, dx = j + dx0;
      if (sx < 0 || dx < 0) continue;
      if (sx >= sw || dx >= dw) break;
      const so = (sx + sy * sw) * sb, dof = (dx + dy * dw) * db;
      let col = toRGBA(sf, getRaw(s, so, sf));
      if (bl) col = blend(col, toRGBA(df, getRaw(d, dof, df)));
      setRaw(d, dof, df, toFormat(df, col));
    }
  }
}

function bilinear(s, sw, sh, sf, d, dw, dh, df, sx0, sy0, sww, shh, dx0, dy0, dww, dhh, bl) {
  const sb = BPP[sf], db = BPP[df], sp = sb * sw;
  const xr = (sww - 1) / dww, yr = (shh - 1) / dhh;
  for (let i = 0; i < dhh; i++) {
    const sy = Math.floor(i * yr) + sy0, dy = i + dy0;
    const ydiff = (yr * i + sy0) - sy;
    if (sy < 0 || dy < 0) continue;
    if (sy >= sh || dy >= dh) break;
    for (let j = 0; j < dww; j++) {
      const sx = Math.floor(j * xr) + sx0, dx = j + dx0;
      const xdiff = (xr * j + sx0) - sx;
      if (sx < 0 || dx < 0) continue;
      if (sx >= sw || dx >= dw) break;
      const so = sx * sb + sy * sp, dof = (dx + dy * dw) * db;
      const c1 = toRGBA(sf, getRaw(s, so, sf));
      const c2 = sx + 1 < sww ? toRGBA(sf, getRaw(s, so + sb, sf)) : c1;
      const c3 = sy + 1 < shh ? toRGBA(sf, getRaw(s, so + sp, sf)) : c1;
      const c4 = sx + 1 < sww && sy + 1 < shh ? toRGBA(sf, getRaw(s, so + sp + sb, sf)) : c1;
      const ta = (1 - xdiff) * (1 - ydiff), tb = xdiff * (1 - ydiff), tc = (1 - xdiff) * ydiff, td = xdiff * ydiff;
      const ch = (sh2) => (((c1 >>> sh2) & 0xff) * ta + ((c2 >>> sh2) & 0xff) * tb + ((c3 >>> sh2) & 0xff) * tc + ((c4 >>> sh2) & 0xff) * td) & 0xff;
      let col = ((ch(24) << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)) >>> 0;
      if (bl) col = blend(col, toRGBA(df, getRaw(d, dof, df)));
      setRaw(d, dof, df, toFormat(df, col));
    }
  }
}

P.drawPixmap = function (s, sw, sh, sf, d, dw, dh, df, sx, sy, sww, shh, dx, dy, dww, dhh, bl, sc) {
  if (sww === dww && shh === dhh) sameSize(s, sw, sh, sf, d, dw, dh, df, sx, sy, dx, dy, sww, shh, bl);
  else if (sc === 0) nearest(s, sw, sh, sf, d, dw, dh, df, sx, sy, sww, shh, dx, dy, dww, dhh, bl);
  else bilinear(s, sw, sh, sf, d, dw, dh, df, sx, sy, sww, shh, dx, dy, dww, dhh, bl);
};

self.STSPix = P;
})();
