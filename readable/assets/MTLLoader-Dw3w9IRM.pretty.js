import {
  Dt as e,
  F as t,
  It as n,
  J as r,
  M as i,
  Ot as a,
  Pt as o,
  S as s,
  X as c,
  Xt as l,
  _ as u,
  at as d,
  ft as f,
  in as p,
  j as m,
  lt as h,
  nt as g,
  rn as _,
  tt as v,
  u as y,
  v as b,
} from "./three.module-BgyKfsEV.js";
var x = /^[og]\s*(.+)?/,
  S = /^mtllib /,
  C = /^usemtl /,
  w = /^usemap /,
  T = /\s+/,
  E = new p(),
  D = new p(),
  O = new p(),
  k = new p(),
  A = new p(),
  j = new u();
function M() {
  let e = {
    objects: [],
    object: {},
    vertices: [],
    normals: [],
    colors: [],
    uvs: [],
    materials: {},
    materialLibraries: [],
    startObject: function (e, t) {
      if (this.object && this.object.fromDeclaration === !1) {
        ((this.object.name = e), (this.object.fromDeclaration = t !== !1));
        return;
      }
      let n =
        this.object && typeof this.object.currentMaterial == `function`
          ? this.object.currentMaterial()
          : void 0;
      if (
        (this.object &&
          typeof this.object._finalize == `function` &&
          this.object._finalize(!0),
        (this.object = {
          name: e || ``,
          fromDeclaration: t !== !1,
          geometry: {
            vertices: [],
            normals: [],
            colors: [],
            uvs: [],
            hasUVIndices: !1,
          },
          materials: [],
          smooth: !0,
          startMaterial: function (e, t) {
            let n = this._finalize(!1);
            n &&
              (n.inherited || n.groupCount <= 0) &&
              this.materials.splice(n.index, 1);
            let r = {
              index: this.materials.length,
              name: e || ``,
              mtllib: Array.isArray(t) && t.length > 0 ? t[t.length - 1] : ``,
              smooth: n === void 0 ? this.smooth : n.smooth,
              groupStart: n === void 0 ? 0 : n.groupEnd,
              groupEnd: -1,
              groupCount: -1,
              inherited: !1,
              clone: function (e) {
                let t = {
                  index: typeof e == `number` ? e : this.index,
                  name: this.name,
                  mtllib: this.mtllib,
                  smooth: this.smooth,
                  groupStart: 0,
                  groupEnd: -1,
                  groupCount: -1,
                  inherited: !1,
                };
                return ((t.clone = this.clone.bind(t)), t);
              },
            };
            return (this.materials.push(r), r);
          },
          currentMaterial: function () {
            if (this.materials.length > 0)
              return this.materials[this.materials.length - 1];
          },
          _finalize: function (e) {
            let t = this.currentMaterial();
            if (
              (t &&
                t.groupEnd === -1 &&
                ((t.groupEnd = this.geometry.vertices.length / 3),
                (t.groupCount = t.groupEnd - t.groupStart),
                (t.inherited = !1)),
              e && this.materials.length > 1)
            )
              for (let e = this.materials.length - 1; e >= 0; e--)
                this.materials[e].groupCount <= 0 &&
                  this.materials.splice(e, 1);
            return (
              e &&
                this.materials.length === 0 &&
                this.materials.push({ name: ``, smooth: this.smooth }),
              t
            );
          },
        }),
        n && n.name && typeof n.clone == `function`)
      ) {
        let e = n.clone(0);
        ((e.inherited = !0), this.object.materials.push(e));
      }
      this.objects.push(this.object);
    },
    finalize: function () {
      this.object &&
        typeof this.object._finalize == `function` &&
        this.object._finalize(!0);
    },
    parseVertexIndex: function (e, t) {
      let n = parseInt(e, 10);
      return (n >= 0 ? n - 1 : n + t / 3) * 3;
    },
    parseNormalIndex: function (e, t) {
      let n = parseInt(e, 10);
      return (n >= 0 ? n - 1 : n + t / 3) * 3;
    },
    parseUVIndex: function (e, t) {
      let n = parseInt(e, 10);
      return (n >= 0 ? n - 1 : n + t / 2) * 2;
    },
    addVertex: function (e, t, n) {
      let r = this.vertices,
        i = this.object.geometry.vertices;
      (i.push(r[e + 0], r[e + 1], r[e + 2]),
        i.push(r[t + 0], r[t + 1], r[t + 2]),
        i.push(r[n + 0], r[n + 1], r[n + 2]));
    },
    addVertexPoint: function (e) {
      let t = this.vertices;
      this.object.geometry.vertices.push(t[e + 0], t[e + 1], t[e + 2]);
    },
    addVertexLine: function (e) {
      let t = this.vertices;
      this.object.geometry.vertices.push(t[e + 0], t[e + 1], t[e + 2]);
    },
    addNormal: function (e, t, n) {
      let r = this.normals,
        i = this.object.geometry.normals;
      (i.push(r[e + 0], r[e + 1], r[e + 2]),
        i.push(r[t + 0], r[t + 1], r[t + 2]),
        i.push(r[n + 0], r[n + 1], r[n + 2]));
    },
    addFaceNormal: function (e, t, n) {
      let r = this.vertices,
        i = this.object.geometry.normals;
      (E.fromArray(r, e),
        D.fromArray(r, t),
        O.fromArray(r, n),
        A.subVectors(O, D),
        k.subVectors(E, D),
        A.cross(k),
        A.normalize(),
        i.push(A.x, A.y, A.z),
        i.push(A.x, A.y, A.z),
        i.push(A.x, A.y, A.z));
    },
    addColor: function (e, t, n) {
      let r = this.colors,
        i = this.object.geometry.colors;
      (r[e] !== void 0 && i.push(r[e + 0], r[e + 1], r[e + 2]),
        r[t] !== void 0 && i.push(r[t + 0], r[t + 1], r[t + 2]),
        r[n] !== void 0 && i.push(r[n + 0], r[n + 1], r[n + 2]));
    },
    addUV: function (e, t, n) {
      let r = this.uvs,
        i = this.object.geometry.uvs;
      (i.push(r[e + 0], r[e + 1]),
        i.push(r[t + 0], r[t + 1]),
        i.push(r[n + 0], r[n + 1]));
    },
    addDefaultUV: function () {
      let e = this.object.geometry.uvs;
      (e.push(0, 0), e.push(0, 0), e.push(0, 0));
    },
    addUVLine: function (e) {
      let t = this.uvs;
      this.object.geometry.uvs.push(t[e + 0], t[e + 1]);
    },
    addFace: function (e, t, n, r, i, a, o, s, c) {
      let l = this.vertices.length,
        u = this.parseVertexIndex(e, l),
        d = this.parseVertexIndex(t, l),
        f = this.parseVertexIndex(n, l);
      if (
        (this.addVertex(u, d, f),
        this.addColor(u, d, f),
        o !== void 0 && o !== ``)
      ) {
        let e = this.normals.length;
        ((u = this.parseNormalIndex(o, e)),
          (d = this.parseNormalIndex(s, e)),
          (f = this.parseNormalIndex(c, e)),
          this.addNormal(u, d, f));
      } else this.addFaceNormal(u, d, f);
      if (r !== void 0 && r !== ``) {
        let e = this.uvs.length;
        ((u = this.parseUVIndex(r, e)),
          (d = this.parseUVIndex(i, e)),
          (f = this.parseUVIndex(a, e)),
          this.addUV(u, d, f),
          (this.object.geometry.hasUVIndices = !0));
      } else this.addDefaultUV();
    },
    addPointGeometry: function (e) {
      this.object.geometry.type = `Points`;
      let t = this.vertices.length;
      for (let n = 0, r = e.length; n < r; n++) {
        let r = this.parseVertexIndex(e[n], t);
        (this.addVertexPoint(r), this.addColor(r));
      }
    },
    addLineGeometry: function (e, t) {
      this.object.geometry.type = `Line`;
      let n = this.vertices.length,
        r = this.uvs.length;
      for (let t = 0, r = e.length; t < r; t++)
        this.addVertexLine(this.parseVertexIndex(e[t], n));
      for (let e = 0, n = t.length; e < n; e++)
        this.addUVLine(this.parseUVIndex(t[e], r));
    },
  };
  return (e.startObject(``, !1), e);
}
var N = class extends v {
    constructor(e) {
      (super(e), (this.materials = null));
    }
    load(e, t, n, r) {
      let i = this,
        a = new m(this.manager);
      (a.setPath(this.path),
        a.setRequestHeader(this.requestHeader),
        a.setWithCredentials(this.withCredentials),
        a.load(
          e,
          function (n) {
            try {
              t(i.parse(n));
            } catch (t) {
              (r ? r(t) : console.error(t), i.manager.itemError(e));
            }
          },
          n,
          r,
        ));
    }
    setMaterials(e) {
      return ((this.materials = e), this);
    }
    parse(o) {
      let s = new M();
      (o.indexOf(`\r
`) !== -1 &&
        (o = o.replace(
          /\r\n/g,
          `
`,
        )),
        o.indexOf(`\\
`) !== -1 && (o = o.replace(/\\\n/g, ``)));
      let l = o.split(`
`),
        u = [];
      for (let e = 0, t = l.length; e < t; e++) {
        let t = l[e].trimStart();
        if (t.length === 0) continue;
        let r = t.charAt(0);
        if (r !== `#`)
          if (r === `v`) {
            let e = t.split(T);
            switch (e[0]) {
              case `v`:
                (s.vertices.push(
                  parseFloat(e[1]),
                  parseFloat(e[2]),
                  parseFloat(e[3]),
                ),
                  e.length >= 7
                    ? (j.setRGB(
                        parseFloat(e[4]),
                        parseFloat(e[5]),
                        parseFloat(e[6]),
                        n,
                      ),
                      s.colors.push(j.r, j.g, j.b))
                    : s.colors.push(void 0, void 0, void 0));
                break;
              case `vn`:
                s.normals.push(
                  parseFloat(e[1]),
                  parseFloat(e[2]),
                  parseFloat(e[3]),
                );
                break;
              case `vt`:
                s.uvs.push(parseFloat(e[1]), parseFloat(e[2]));
                break;
            }
          } else if (r === `f`) {
            let e = t.slice(1).trim().split(T),
              n = [];
            for (let t = 0, r = e.length; t < r; t++) {
              let r = e[t];
              if (r.length > 0) {
                let e = r.split(`/`);
                n.push(e);
              }
            }
            let r = n[0];
            for (let e = 1, t = n.length - 1; e < t; e++) {
              let t = n[e],
                i = n[e + 1];
              s.addFace(r[0], t[0], i[0], r[1], t[1], i[1], r[2], t[2], i[2]);
            }
          } else if (r === `l`) {
            let e = t.substring(1).trim().split(` `),
              n = [],
              r = [];
            if (t.indexOf(`/`) === -1) n = e;
            else
              for (let t = 0, i = e.length; t < i; t++) {
                let i = e[t].split(`/`);
                (i[0] !== `` && n.push(i[0]), i[1] !== `` && r.push(i[1]));
              }
            s.addLineGeometry(n, r);
          } else if (r === `p`) {
            let e = t.slice(1).trim().split(` `);
            s.addPointGeometry(e);
          } else if ((u = x.exec(t)) !== null) {
            let e = (` ` + u[0].slice(1).trim()).slice(1);
            s.startObject(e);
          } else if (C.test(t))
            s.object.startMaterial(t.substring(7).trim(), s.materialLibraries);
          else if (S.test(t)) s.materialLibraries.push(t.substring(7).trim());
          else if (w.test(t))
            console.warn(
              `THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.`,
            );
          else if (r === `s`) {
            if (((u = t.split(` `)), u.length > 1)) {
              let e = u[1].trim().toLowerCase();
              s.object.smooth = e !== `0` && e !== `off`;
            } else s.object.smooth = !0;
            let e = s.object.currentMaterial();
            e && (e.smooth = s.object.smooth);
          } else {
            if (t === `\0`) continue;
            console.warn(`THREE.OBJLoader: Unexpected line: "` + t + `"`);
          }
      }
      s.finalize();
      let p = new t();
      if (
        ((p.materialLibraries = [].concat(s.materialLibraries)),
        !(
          s.objects.length === 1 && s.objects[0].geometry.vertices.length === 0
        ))
      )
        for (let t = 0, n = s.objects.length; t < n; t++) {
          let n = s.objects[t],
            o = n.geometry,
            l = n.materials,
            u = o.type === `Line`,
            m = o.type === `Points`,
            g = !1;
          if (o.vertices.length === 0) continue;
          let _ = new y();
          (_.setAttribute(`position`, new i(o.vertices, 3)),
            o.normals.length > 0 &&
              _.setAttribute(`normal`, new i(o.normals, 3)),
            o.colors.length > 0 &&
              ((g = !0), _.setAttribute(`color`, new i(o.colors, 3))),
            o.hasUVIndices === !0 && _.setAttribute(`uv`, new i(o.uvs, 2)));
          let v = [];
          for (let e = 0, t = l.length; e < t; e++) {
            let t = l[e],
              n = t.name + `_` + t.smooth + `_` + g,
              i = s.materials[n];
            if (this.materials !== null) {
              if (
                ((i = this.materials.create(t.name)),
                u && i && !(i instanceof r))
              ) {
                let e = new r();
                (d.prototype.copy.call(e, i), e.color.copy(i.color), (i = e));
              } else if (m && i && !(i instanceof a)) {
                let e = new a({ size: 10, sizeAttenuation: !1 });
                (d.prototype.copy.call(e, i),
                  e.color.copy(i.color),
                  (e.map = i.map),
                  (i = e));
              }
            }
            (i === void 0 &&
              ((i = u
                ? new r()
                : m
                  ? new a({ size: 1, sizeAttenuation: !1 })
                  : new f()),
              (i.name = t.name),
              (i.flatShading = !t.smooth),
              (i.vertexColors = g),
              (s.materials[n] = i)),
              v.push(i));
          }
          let b;
          if (v.length > 1) {
            for (let e = 0, t = l.length; e < t; e++) {
              let t = l[e];
              _.addGroup(t.groupStart, t.groupCount, e);
            }
            b = u ? new c(_, v) : m ? new e(_, v) : new h(_, v);
          } else b = u ? new c(_, v[0]) : m ? new e(_, v[0]) : new h(_, v[0]);
          ((b.name = n.name), p.add(b));
        }
      else if (s.vertices.length > 0) {
        let t = new a({ size: 1, sizeAttenuation: !1 }),
          n = new y();
        (n.setAttribute(`position`, new i(s.vertices, 3)),
          s.colors.length > 0 &&
            s.colors[0] !== void 0 &&
            (n.setAttribute(`color`, new i(s.colors, 3)),
            (t.vertexColors = !0)));
        let r = new e(n, t);
        p.add(r);
      }
      return p;
    }
  },
  P = class extends v {
    constructor(e) {
      super(e);
    }
    load(e, t, n, r) {
      let i = this,
        a = this.path === `` ? g.extractUrlBase(e) : this.path,
        o = new m(this.manager);
      (o.setPath(this.path),
        o.setRequestHeader(this.requestHeader),
        o.setWithCredentials(this.withCredentials),
        o.load(
          e,
          function (n) {
            try {
              t(i.parse(n, a));
            } catch (t) {
              (r ? r(t) : console.error(t), i.manager.itemError(e));
            }
          },
          n,
          r,
        ));
    }
    setMaterialOptions(e) {
      return ((this.materialOptions = e), this);
    }
    parse(e, t) {
      let n = e.split(`
`),
        r = {},
        i = /\s+/,
        a = {};
      for (let e = 0; e < n.length; e++) {
        let t = n[e];
        if (((t = t.trim()), t.length === 0 || t.charAt(0) === `#`)) continue;
        let o = t.indexOf(` `),
          s = o >= 0 ? t.substring(0, o) : t;
        s = s.toLowerCase();
        let c = o >= 0 ? t.substring(o + 1) : ``;
        if (((c = c.trim()), s === `newmtl`)) ((r = { name: c }), (a[c] = r));
        else if (s === `ka` || s === `kd` || s === `ks` || s === `ke`) {
          let e = c.split(i, 3);
          r[s] = [parseFloat(e[0]), parseFloat(e[1]), parseFloat(e[2])];
        } else r[s] = c;
      }
      let o = new F(this.resourcePath || t, this.materialOptions);
      return (
        o.setCrossOrigin(this.crossOrigin),
        o.setManager(this.manager),
        o.setMaterials(a),
        o
      );
    }
  },
  F = class {
    constructor(e = ``, t = {}) {
      ((this.baseUrl = e),
        (this.options = t),
        (this.materialsInfo = {}),
        (this.materials = {}),
        (this.materialsArray = []),
        (this.nameLookup = {}),
        (this.crossOrigin = `anonymous`),
        (this.side = this.options.side === void 0 ? 0 : this.options.side),
        (this.wrap = this.options.wrap === void 0 ? o : this.options.wrap));
    }
    setCrossOrigin(e) {
      return ((this.crossOrigin = e), this);
    }
    setManager(e) {
      this.manager = e;
    }
    setMaterials(e) {
      ((this.materialsInfo = this.convert(e)),
        (this.materials = {}),
        (this.materialsArray = []),
        (this.nameLookup = {}));
    }
    convert(e) {
      if (!this.options) return e;
      let t = {};
      for (let n in e) {
        let r = e[n],
          i = {};
        t[n] = i;
        for (let e in r) {
          let t = !0,
            n = r[e],
            a = e.toLowerCase();
          switch (a) {
            case `kd`:
            case `ka`:
            case `ks`:
              (this.options &&
                this.options.normalizeRGB &&
                (n = [n[0] / 255, n[1] / 255, n[2] / 255]),
                this.options &&
                  this.options.ignoreZeroRGBs &&
                  n[0] === 0 &&
                  n[1] === 0 &&
                  n[2] === 0 &&
                  (t = !1));
              break;
            default:
              break;
          }
          t && (i[a] = n);
        }
      }
      return t;
    }
    preload() {
      for (let e in this.materialsInfo) this.create(e);
    }
    getIndex(e) {
      return this.nameLookup[e];
    }
    getAsArray() {
      let e = 0;
      for (let t in this.materialsInfo)
        ((this.materialsArray[e] = this.create(t)),
          (this.nameLookup[t] = e),
          e++);
      return this.materialsArray;
    }
    create(e) {
      return (
        this.materials[e] === void 0 && this.createMaterial_(e),
        this.materials[e]
      );
    }
    createMaterial_(e) {
      let t = this,
        r = this.materialsInfo[e],
        i = { name: e, side: this.side };
      function a(e, t) {
        return typeof t != `string` || t === ``
          ? ``
          : /^https?:\/\//i.test(t)
            ? t
            : e + t;
      }
      function o(e, r) {
        if (i[e]) return;
        let o = t.getTextureParams(r, i),
          s = t.loadTexture(a(t.baseUrl, o.url));
        (s.repeat.copy(o.scale),
          s.offset.copy(o.offset),
          (s.wrapS = t.wrap),
          (s.wrapT = t.wrap),
          (e === `map` || e === `emissiveMap`) && (s.colorSpace = n),
          (i[e] = s));
      }
      for (let e in r) {
        let t = r[e],
          a;
        if (t !== ``)
          switch (e.toLowerCase()) {
            case `kd`:
              i.color = b.colorSpaceToWorking(new u().fromArray(t), n);
              break;
            case `ks`:
              i.specular = b.colorSpaceToWorking(new u().fromArray(t), n);
              break;
            case `ke`:
              i.emissive = b.colorSpaceToWorking(new u().fromArray(t), n);
              break;
            case `map_kd`:
              o(`map`, t);
              break;
            case `map_ks`:
              o(`specularMap`, t);
              break;
            case `map_ke`:
              o(`emissiveMap`, t);
              break;
            case `norm`:
              o(`normalMap`, t);
              break;
            case `map_bump`:
            case `bump`:
              o(`bumpMap`, t);
              break;
            case `disp`:
              o(`displacementMap`, t);
              break;
            case `map_d`:
              (o(`alphaMap`, t), (i.transparent = !0));
              break;
            case `ns`:
              i.shininess = parseFloat(t);
              break;
            case `d`:
              ((a = parseFloat(t)),
                a < 1 && ((i.opacity = a), (i.transparent = !0)));
              break;
            case `tr`:
              ((a = parseFloat(t)),
                this.options && this.options.invertTrProperty && (a = 1 - a),
                a > 0 && ((i.opacity = 1 - a), (i.transparent = !0)));
              break;
            default:
              break;
          }
      }
      return ((this.materials[e] = new f(i)), this.materials[e]);
    }
    getTextureParams(e, t) {
      let n = { scale: new _(1, 1), offset: new _(0, 0) },
        r = e.split(/\s+/),
        i;
      return (
        (i = r.indexOf(`-bm`)),
        i >= 0 && ((t.bumpScale = parseFloat(r[i + 1])), r.splice(i, 2)),
        (i = r.indexOf(`-mm`)),
        i >= 0 &&
          ((t.displacementBias = parseFloat(r[i + 1])),
          (t.displacementScale = parseFloat(r[i + 2])),
          r.splice(i, 3)),
        (i = r.indexOf(`-s`)),
        i >= 0 &&
          (n.scale.set(parseFloat(r[i + 1]), parseFloat(r[i + 2])),
          r.splice(i, 4)),
        (i = r.indexOf(`-o`)),
        i >= 0 &&
          (n.offset.set(parseFloat(r[i + 1]), parseFloat(r[i + 2])),
          r.splice(i, 4)),
        (n.url = r.join(` `).trim()),
        n
      );
    }
    loadTexture(e, t, n, r, i) {
      let a = this.manager === void 0 ? s : this.manager,
        o = a.getHandler(e);
      (o === null && (o = new l(a)),
        o.setCrossOrigin && o.setCrossOrigin(this.crossOrigin));
      let c = o.load(e, n, r, i);
      return (t !== void 0 && (c.mapping = t), c);
    }
  };
export { N as n, P as t };
