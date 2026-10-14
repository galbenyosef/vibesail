// assets__GoogleTilesLoader-Ba1pGT7V 05 — getuint32
// Lines 1599-1934 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
function nt(e, t, n, r, i, a) {
  let o;
  switch (r) {
    case `SCALAR`:
      o = 1;
      break;
    case `VEC2`:
      o = 2;
      break;
    case `VEC3`:
      o = 3;
      break;
    case `VEC4`:
      o = 4;
      break;
    default:
      throw Error(`FeatureTable : Feature type not provided for "${a}".`);
  }
  let s,
    c = n * o;
  switch (i) {
    case `BYTE`:
      s = new Int8Array(e, t, c);
      break;
    case `UNSIGNED_BYTE`:
      s = new Uint8Array(e, t, c);
      break;
    case `SHORT`:
      s = new Int16Array(e, t, c);
      break;
    case `UNSIGNED_SHORT`:
      s = new Uint16Array(e, t, c);
      break;
    case `INT`:
      s = new Int32Array(e, t, c);
      break;
    case `UNSIGNED_INT`:
      s = new Uint32Array(e, t, c);
      break;
    case `FLOAT`:
      s = new Float32Array(e, t, c);
      break;
    case `DOUBLE`:
      s = new Float64Array(e, t, c);
      break;
    default:
      throw Error(
        `FeatureTable : Feature component type not provided for "${a}".`,
      );
  }
  return s;
}
var rt = class {
    constructor(e, t, n, r) {
      ((this.buffer = e), (this.binOffset = t + n), (this.binLength = r));
      let i = null;
      if (n !== 0) {
        let r = new Uint8Array(e, t, n);
        i = JSON.parse(me(r));
      } else i = {};
      this.header = i;
    }
    getKeys() {
      return Object.keys(this.header).filter((e) => e !== `extensions`);
    }
    getData(e, t, n = null, r = null) {
      let i = this.header;
      if (!(e in i)) return null;
      let a = i[e];
      if (a instanceof Object) {
        if (Array.isArray(a)) return a;
        {
          let { buffer: i, binOffset: o, binLength: s } = this,
            c = a.byteOffset || 0,
            l = a.type || r,
            u = a.componentType || n;
          if (`type` in a && r && a.type !== r)
            throw Error(
              `FeatureTable: Specified type does not match expected type.`,
            );
          let d = o + c,
            f = nt(i, d, t, l, u, e);
          if (d + f.byteLength > o + s)
            throw Error(
              `FeatureTable: Feature data read outside binary body length.`,
            );
          return f;
        }
      } else return a;
    }
    getBuffer(e, t) {
      let { buffer: n, binOffset: r } = this;
      return n.slice(r + e, r + e + t);
    }
  },
  it = class {
    constructor(e) {
      this.batchTable = e;
      let t = e.header.extensions[`3DTILES_batch_table_hierarchy`];
      this.classes = t.classes;
      for (let e of this.classes) {
        let t = e.instances;
        for (let n in t)
          e.instances[n] = this._parseProperty(t[n], e.length, n);
      }
      if (
        ((this.instancesLength = t.instancesLength),
        (this.classIds = this._parseProperty(
          t.classIds,
          this.instancesLength,
          `classIds`,
        )),
        t.parentCounts
          ? (this.parentCounts = this._parseProperty(
              t.parentCounts,
              this.instancesLength,
              `parentCounts`,
            ))
          : (this.parentCounts = Array(this.instancesLength).fill(1)),
        t.parentIds)
      ) {
        let e = this.parentCounts.reduce((e, t) => e + t, 0);
        this.parentIds = this._parseProperty(t.parentIds, e, `parentIds`);
      } else this.parentIds = null;
      this.instancesIds = [];
      let n = {};
      for (let e of this.classIds)
        ((n[e] = n[e] ?? 0), this.instancesIds.push(n[e]), n[e]++);
    }
    _parseProperty(e, t, n) {
      if (Array.isArray(e)) return e;
      {
        let { buffer: r, binOffset: i } = this.batchTable,
          a = e.byteOffset,
          o = e.componentType || `UNSIGNED_SHORT`;
        return nt(r, i + a, t, `SCALAR`, o, n);
      }
    }
    getDataFromId(e, t = {}) {
      let n = this.parentCounts[e];
      if (this.parentIds && n > 0) {
        let r = 0;
        for (let t = 0; t < e; t++) r += this.parentCounts[t];
        for (let i = 0; i < n; i++) {
          let n = this.parentIds[r + i];
          n !== e && this.getDataFromId(n, t);
        }
      }
      let r = this.classIds[e],
        i = this.classes[r].instances,
        a = this.classes[r].name,
        o = this.instancesIds[e];
      for (let e in i) ((t[a] = t[a] || {}), (t[a][e] = i[e][o]));
      return t;
    }
  },
  at = class extends rt {
    get batchSize() {
      return (
        console.warn(
          `BatchTable.batchSize has been deprecated and replaced with BatchTable.count.`,
        ),
        this.count
      );
    }
    constructor(e, t, n, r, i) {
      (super(e, n, r, i), (this.count = t), (this.extensions = {}));
      let a = this.header.extensions;
      a &&
        a[`3DTILES_batch_table_hierarchy`] &&
        (this.extensions[`3DTILES_batch_table_hierarchy`] = new it(this));
    }
    getData(e, t = null, n = null) {
      return (
        console.warn(
          `BatchTable: BatchTable.getData is deprecated. Use BatchTable.getDataFromId to get allproperties for an id or BatchTable.getPropertyArray for getting an array of value for a property.`,
        ),
        super.getData(e, this.count, t, n)
      );
    }
    getDataFromId(e, t = {}) {
      if (e < 0 || e >= this.count)
        throw Error(
          `BatchTable: id value "${e}" out of bounds for "${this.count}" features number.`,
        );
      for (let n of this.getKeys()) t[n] = super.getData(n, this.count)[e];
      for (let n in this.extensions) {
        let r = this.extensions[n];
        r.getDataFromId instanceof Function &&
          ((t[n] = t[n] || {}), r.getDataFromId(e, t[n]));
      }
      return t;
    }
    getPropertyArray(e) {
      return super.getData(e, this.count);
    }
  },
  ot = class extends ge {
    parse(e) {
      let t = new DataView(e),
        n = w(t);
      console.assert(n === `b3dm`);
      let r = t.getUint32(4, !0);
      console.assert(r === 1);
      let i = t.getUint32(8, !0);
      console.assert(i === e.byteLength);
      let a = t.getUint32(12, !0),
        o = t.getUint32(16, !0),
        s = t.getUint32(20, !0),
        c = t.getUint32(24, !0),
        l = new rt(e.slice(28, 28 + a + o), 0, a, o),
        u = 28 + a + o,
        d = new at(e.slice(u, u + s + c), l.getData(`BATCH_LENGTH`), 0, s, c),
        f = u + s + c;
      return {
        version: r,
        featureTable: l,
        batchTable: d,
        glbBytes: new Uint8Array(e, f, i - f),
      };
    }
  },
  st = class extends ge {
    parse(e) {
      let t = new DataView(e),
        n = w(t);
      console.assert(n === `i3dm`);
      let r = t.getUint32(4, !0);
      console.assert(r === 1);
      let i = t.getUint32(8, !0);
      console.assert(i === e.byteLength);
      let a = t.getUint32(12, !0),
        o = t.getUint32(16, !0),
        s = t.getUint32(20, !0),
        c = t.getUint32(24, !0),
        l = t.getUint32(28, !0),
        u = new rt(e.slice(32, 32 + a + o), 0, a, o),
        d = 32 + a + o,
        f = new at(
          e.slice(d, d + s + c),
          u.getData(`INSTANCES_LENGTH`),
          0,
          s,
          c,
        ),
        p = d + s + c,
        m = new Uint8Array(e, p, i - p),
        h = null,
        g = null,
        _ = null;
      if (l) ((h = m), (g = Promise.resolve()));
      else {
        let e = this.resolveExternalURL(me(m));
        ((_ = he(e)),
          (g = fetch(e, this.fetchOptions)
            .then((t) => {
              if (!t.ok)
                throw Error(
                  `I3DMLoaderBase : Failed to load file "${e}" with status ${t.status} : ${t.statusText}`,
                );
              return t.arrayBuffer();
            })
            .then((e) => {
              h = new Uint8Array(e);
            })));
      }
      return g.then(() => ({
        version: r,
        featureTable: u,
        batchTable: f,
        glbBytes: h,
        gltfWorkingPath: _,
      }));
    }
  },
  ct = class extends ge {
    parse(e) {
      let t = new DataView(e),
        n = w(t);
      console.assert(n === `pnts`);
      let r = t.getUint32(4, !0);
      console.assert(r === 1);
      let i = t.getUint32(8, !0);
      console.assert(i === e.byteLength);
      let a = t.getUint32(12, !0),
        o = t.getUint32(16, !0),
        s = t.getUint32(20, !0),
        c = t.getUint32(24, !0),
        l = new rt(e.slice(28, 28 + a + o), 0, a, o),
        u = 28 + a + o,
        d = new at(
          e.slice(u, u + s + c),
          l.getData(`BATCH_LENGTH`) || l.getData(`POINTS_LENGTH`),
          0,
          s,
          c,
        );
      return Promise.resolve({ version: r, featureTable: l, batchTable: d });
    }
  },
  lt = class extends ge {
    parse(e) {
      let t = new DataView(e),
        n = w(t);
      console.assert(n === `cmpt`, `CMPTLoader: The magic bytes equal "cmpt".`);
      let r = t.getUint32(4, !0);
      console.assert(
        r === 1,
        `CMPTLoader: The version listed in the header is "1".`,
      );
      let i = t.getUint32(8, !0);
      console.assert(
        i === e.byteLength,
        `CMPTLoader: The contents buffer length listed in the header matches the file.`,
      );
      let a = t.getUint32(12, !0),
        o = [],
        s = 16;
      for (let t = 0; t < a; t++) {
        let t = new DataView(e, s, 12),
          n = w(t),
          r = t.getUint32(4, !0),
          i = t.getUint32(8, !0),
          a = new Uint8Array(e, s, i);
        (o.push({ type: n, buffer: a, version: r }), (s += i));
      }
      return { version: r, tiles: o };
    }
  };
function ut(e) {
  let { x: t, y: n, z: r } = e;
  ((e.x = r), (e.y = t), (e.z = n));
}
function dt(e) {
  return -e + Math.PI / 2;
}
