// GoogleTilesLoader 04 — pos
// Lines 3978-4312 of readable/assets/GoogleTilesLoader-DfxqQWNC.pretty.js (statement-aligned).
function dr(e, t) {
  let n = [];
  for (let r = 0, i = e.length - 1; r < e.length; i = r, r += 1) {
    let a = e[i].z,
      o = e[r].z;
    if (a > t == o > t) continue;
    let s = (t - a) / (o - a || 2 ** -52);
    n.push(e[i].x + (e[r].x - e[i].x) * s);
  }
  return (n.sort((e, t) => e - t), n);
}
function fr(e, t) {
  let n = 0,
    r = e.length;
  for (; n < r;) {
    let i = (n + r) >> 1;
    e[i] < t ? (n = i + 1) : (r = i);
  }
  let i = 1 / 0;
  return (
    n < e.length && (i = Math.abs(e[n] - t)),
    n > 0 && (i = Math.min(i, Math.abs(e[n - 1] - t))),
    i
  );
}
function pr(e, t) {
  let n = Math.max(-1, Math.min(1, e / t));
  return Math.max(0, Math.min(255, Math.round((n * 0.5 + 0.5) * 255)));
}
function mr(e, t, n, r, i, a) {
  let o = [];
  for (let e = 0; e < t.length; e += 1) o.push(...dr(t[e], n));
  o.sort((e, t) => e - t);
  for (let t = 0; t + 1 < o.length; t += 2) {
    let n = Math.max(0, Math.floor(((o[t] - r.minX) / r.sizeX) * i)),
      a = Math.min(i - 1, Math.ceil(((o[t + 1] - r.minX) / r.sizeX) * i) - 1);
    for (let t = n; t <= a; t += 1) e[t] = 1;
  }
  a.push(...o);
}
function hr(e, t, n) {
  let r = Math.max(1, Math.floor(n)),
    i = new Uint8Array(r * r),
    a = (t.sizeX / r) * 2,
    o = Array.isArray(e) ? e : [],
    s = [];
  for (let e = 0; e < o.length; e += 1) {
    let t = o[e]?.rings;
    if (!Array.isArray(t)) continue;
    let n = t.filter((e) => Array.isArray(e) && e.length >= 3);
    n.length > 0 && s.push(n);
  }
  let c = new Uint8Array(r);
  for (let e = 0; e < r; e += 1) {
    let n = t.minZ + ((e + 0.5) / r) * t.sizeZ,
      o = [];
    c.fill(0);
    for (let e = 0; e < s.length; e += 1) mr(c, s[e], n, t, r, o);
    o.sort((e, t) => e - t);
    let l = e * r;
    for (let e = 0; e < r; e += 1) {
      let n = t.minX + ((e + 0.5) / r) * t.sizeX,
        s = c[e] ? 1 : -1,
        u = o.length > 0 ? fr(o, n) : a;
      i[l + e] = pr(s * u, a);
    }
  }
  return i;
}
function gr(e) {
  let t = e?.data,
    n = e?.bounds,
    r = e?.resolution;
  if (!t || !n || !r) return [];
  let i = [],
    a = (e, n) => t[n * r + e] >= 128;
  for (let e = 0; e < r; e += 1)
    for (let t = 0; t < r; t += 1) {
      let o = a(t, e);
      if (t + 1 < r && o !== a(t + 1, e)) {
        let a = n.minX + ((t + 1) / r) * n.sizeX,
          o = n.minZ + (e / r) * n.sizeZ,
          s = n.minZ + ((e + 1) / r) * n.sizeZ;
        i.push(a, o, a, s);
      }
      if (e + 1 < r && o !== a(t, e + 1)) {
        let a = n.minZ + ((e + 1) / r) * n.sizeZ,
          o = n.minX + (t / r) * n.sizeX,
          s = n.minX + ((t + 1) / r) * n.sizeX;
        i.push(o, a, s, a);
      }
    }
  return i;
}
function _r(e, t) {
  let n = e?.rings || [];
  for (let e = 0; e < n.length; e += 1) {
    let r = n[e];
    for (let e = 0; e < r.length; e += 1) {
      let n = r[e];
      if (n.x >= t.minX && n.x <= t.maxX && n.z >= t.minZ && n.z <= t.maxZ)
        return !1;
    }
  }
  return n.length > 0;
}
var vr = 65536 * 65536;
1 / vr;
var yr = 12,
  br = typeof TextDecoder > `u` ? null : new TextDecoder(`utf-8`),
  xr = 0,
  Sr = 1,
  Cr = 2,
  wr = 5,
  Tr = class {
    constructor(e) {
      ((this.buf = ArrayBuffer.isView(e) ? e : new Uint8Array(e)),
        (this.dataView = new DataView(
          this.buf.buffer,
          this.buf.byteOffset,
          this.buf.byteLength,
        )),
        (this.pos = 0),
        (this.type = 0),
        (this._valueStart = -1),
        (this.length = this.buf.length));
    }
    readFields(e, t, n = this.length) {
      let r;
      for (; (r = this.nextField(n));) e(r, t, this);
      return t;
    }
    readMessage(e, t) {
      return this.readFields(e, t, this.readVarint() + this.pos);
    }
    readFixed32() {
      let e = this.dataView.getUint32(this.pos, !0);
      return ((this.pos += 4), e);
    }
    readSFixed32() {
      let e = this.dataView.getInt32(this.pos, !0);
      return ((this.pos += 4), e);
    }
    readFixed64() {
      let e =
        this.dataView.getUint32(this.pos, !0) +
        this.dataView.getUint32(this.pos + 4, !0) * vr;
      return ((this.pos += 8), e);
    }
    readSFixed64() {
      let e =
        this.dataView.getUint32(this.pos, !0) +
        this.dataView.getInt32(this.pos + 4, !0) * vr;
      return ((this.pos += 8), e);
    }
    readFloat() {
      let e = this.dataView.getFloat32(this.pos, !0);
      return ((this.pos += 4), e);
    }
    readDouble() {
      let e = this.dataView.getFloat64(this.pos, !0);
      return ((this.pos += 8), e);
    }
    readVarint(e) {
      let t = this.buf,
        n = t[this.pos++];
      if (n < 128) return n;
      let r = n & 127,
        i;
      return (
        (i = t[this.pos++]),
        (r |= (i & 127) << 7),
        i < 128 ||
        ((i = t[this.pos++]), (r |= (i & 127) << 14), i < 128) ||
        ((i = t[this.pos++]), (r |= (i & 127) << 21), i < 128)
          ? r
          : ((i = t[this.pos]), (r |= (i & 15) << 28), Er(r, e, this))
      );
    }
    readSVarint() {
      let e = this.readVarint();
      return e % 2 == 1 ? (e + 1) / -2 : e / 2;
    }
    readBoolean() {
      return !!this.readVarint();
    }
    readString() {
      let e = this.readVarint() + this.pos,
        t = this.pos;
      return (
        (this.pos = e),
        e - t >= yr && br
          ? br.decode(this.buf.subarray(t, e))
          : Or(this.buf, t, e)
      );
    }
    readBytes() {
      let e = this.readVarint() + this.pos,
        t = this.buf.subarray(this.pos, e);
      return ((this.pos = e), t);
    }
    readPackedVarint(e = [], t) {
      let n = this.readPackedEnd();
      for (; this.pos < n;) e.push(this.readVarint(t));
      return e;
    }
    readPackedSVarint(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readSVarint());
      return e;
    }
    readPackedBoolean(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readBoolean());
      return e;
    }
    readPackedFloat(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readFloat());
      return e;
    }
    readPackedDouble(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readDouble());
      return e;
    }
    readPackedFixed32(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readFixed32());
      return e;
    }
    readPackedSFixed32(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readSFixed32());
      return e;
    }
    readPackedFixed64(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readFixed64());
      return e;
    }
    readPackedSFixed64(e = []) {
      let t = this.readPackedEnd();
      for (; this.pos < t;) e.push(this.readSFixed64());
      return e;
    }
    readPackedEnd() {
      return this.type === Cr ? this.readVarint() + this.pos : this.pos + 1;
    }
    nextField(e = this.length) {
      if (
        (this.pos === this._valueStart && this.skip(this.type), this.pos >= e)
      )
        return 0;
      let t = this.readVarint();
      return ((this.type = t & 7), (this._valueStart = this.pos), t >>> 3);
    }
    skip(e) {
      let t = e & 7;
      if (t === xr) for (; this.buf[this.pos++] > 127;);
      else if (t === Cr) this.pos = this.readVarint() + this.pos;
      else if (t === wr) this.pos += 4;
      else if (t === Sr) this.pos += 8;
      else throw Error(`Unimplemented type: ${t}`);
    }
  };
function Er(e, t, n) {
  let r = n.buf,
    i,
    a;
  if (
    ((a = r[n.pos++]),
    (i = (a & 112) >> 4),
    a < 128 ||
      ((a = r[n.pos++]), (i |= (a & 127) << 3), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 127) << 10), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 127) << 17), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 127) << 24), a < 128) ||
      ((a = r[n.pos++]), (i |= (a & 1) << 31), a < 128))
  )
    return Dr(e, i, t);
  throw Error(`Expected varint not more than 10 bytes`);
}
function Dr(e, t, n) {
  return n ? t * 4294967296 + (e >>> 0) : (t >>> 0) * 4294967296 + (e >>> 0);
}
function Or(e, t, n) {
  let r = ``,
    i = t;
  for (; i < n;) {
    let t = e[i],
      a = null,
      o = t > 239 ? 4 : t > 223 ? 3 : t > 191 ? 2 : 1;
    if (i + o > n) break;
    let s, c, l;
    (o === 1
      ? t < 128 && (a = t)
      : o === 2
        ? ((s = e[i + 1]),
          (s & 192) == 128 &&
            ((a = ((t & 31) << 6) | (s & 63)), a <= 127 && (a = null)))
        : o === 3
          ? ((s = e[i + 1]),
            (c = e[i + 2]),
            (s & 192) == 128 &&
              (c & 192) == 128 &&
              ((a = ((t & 15) << 12) | ((s & 63) << 6) | (c & 63)),
              (a <= 2047 || (a >= 55296 && a <= 57343)) && (a = null)))
          : o === 4 &&
            ((s = e[i + 1]),
            (c = e[i + 2]),
            (l = e[i + 3]),
            (s & 192) == 128 &&
              (c & 192) == 128 &&
              (l & 192) == 128 &&
              ((a =
                ((t & 15) << 18) |
                ((s & 63) << 12) |
                ((c & 63) << 6) |
                (l & 63)),
              (a <= 65535 || a >= 1114112) && (a = null))),
      a === null
        ? ((a = 65533), (o = 1))
        : a > 65535 &&
          ((a -= 65536),
          (r += String.fromCharCode(((a >>> 10) & 1023) | 55296)),
          (a = 56320 | (a & 1023))),
      (r += String.fromCharCode(a)),
      (i += o));
  }
  return r;
}
function dracoLoader(e, t) {
  ((this.x = e), (this.y = t));
}
