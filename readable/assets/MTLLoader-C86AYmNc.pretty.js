import {
  $t as e,
  At as t,
  L as n,
  Lt as r,
  N as i,
  P as a,
  Q as o,
  X as s,
  dt as c,
  it as l,
  kt as u,
  mt as d,
  on as f,
  rt as p,
  sn as m,
  st as h,
  u as g,
  v as _,
  w as v,
  y,
  zt as b,
} from "./three.module-CUNolavI.js";
var x = /^[og]\s*(.+)?/,
  S = /^mtllib /,
  C = /^usemtl /,
  w = /^usemap /,
  T = /\s+/,
  E = new m(),
  D = new m(),
  O = new m(),
  k = new m(),
  A = new m(),
  j = new _();
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
var N = class extends p {
    constructor(e) {
      (super(e), (this.materials = null));
    }
    load(e, t, n, r) {
      let a = this,
        o = new i(this.manager);
      (o.setPath(this.path),
        o.setRequestHeader(this.requestHeader),
        o.setWithCredentials(this.withCredentials),
        o.load(
          e,
          function (n) {
            try {
              t(a.parse(n));
            } catch (t) {
              (r ? r(t) : console.error(t), a.manager.itemError(e));
            }
          },
          n,
          r,
        ));
    }
    setMaterials(e) {
      return ((this.materials = e), this);
    }
    parse(e) {
      let r = new M();
      (e.indexOf(`\r
`) !== -1 &&
        (e = e.replace(
          /\r\n/g,
          `
`,
        )),
        e.indexOf(`\\
`) !== -1 && (e = e.replace(/\\\n/g, ``)));
      let i = e.split(`
`),
        l = [];
      for (let e = 0, t = i.length; e < t; e++) {
        let t = i[e].trimStart();
        if (t.length === 0) continue;
        let n = t.charAt(0);
        if (n !== `#`)
          if (n === `v`) {
            let e = t.split(T);
            switch (e[0]) {
              case `v`:
                (r.vertices.push(
                  parseFloat(e[1]),
                  parseFloat(e[2]),
                  parseFloat(e[3]),
                ),
                  e.length >= 7
                    ? (j.setRGB(
                        parseFloat(e[4]),
                        parseFloat(e[5]),
                        parseFloat(e[6]),
                        b,
                      ),
                      r.colors.push(j.r, j.g, j.b))
                    : r.colors.push(void 0, void 0, void 0));
                break;
              case `vn`:
                r.normals.push(
                  parseFloat(e[1]),
                  parseFloat(e[2]),
                  parseFloat(e[3]),
                );
                break;
              case `vt`:
                r.uvs.push(parseFloat(e[1]), parseFloat(e[2]));
                break;
            }
          } else if (n === `f`) {
            let e = t.slice(1).trim().split(T),
              n = [];
            for (let t = 0, r = e.length; t < r; t++) {
              let r = e[t];
              if (r.length > 0) {
                let e = r.split(`/`);
                n.push(e);
              }
            }
            let i = n[0];
            for (let e = 1, t = n.length - 1; e < t; e++) {
              let t = n[e],
                a = n[e + 1];
              r.addFace(i[0], t[0], a[0], i[1], t[1], a[1], i[2], t[2], a[2]);
            }
          } else if (n === `l`) {
            let e = t.substring(1).trim().split(` `),
              n = [],
              i = [];
            if (t.indexOf(`/`) === -1) n = e;
            else
              for (let t = 0, r = e.length; t < r; t++) {
                let r = e[t].split(`/`);
                (r[0] !== `` && n.push(r[0]), r[1] !== `` && i.push(r[1]));
              }
            r.addLineGeometry(n, i);
          } else if (n === `p`) {
            let e = t.slice(1).trim().split(` `);
            r.addPointGeometry(e);
          } else if ((l = x.exec(t)) !== null) {
            let e = (` ` + l[0].slice(1).trim()).slice(1);
            r.startObject(e);
          } else if (C.test(t))
            r.object.startMaterial(t.substring(7).trim(), r.materialLibraries);
          else if (S.test(t)) r.materialLibraries.push(t.substring(7).trim());
          else if (w.test(t))
            console.warn(
              `THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.`,
            );
          else if (n === `s`) {
            if (((l = t.split(` `)), l.length > 1)) {
              let e = l[1].trim().toLowerCase();
              r.object.smooth = e !== `0` && e !== `off`;
            } else r.object.smooth = !0;
            let e = r.object.currentMaterial();
            e && (e.smooth = r.object.smooth);
          } else {
            if (t === `\0`) continue;
            console.warn(`THREE.OBJLoader: Unexpected line: "` + t + `"`);
          }
      }
      r.finalize();
      let f = new n();
      if (
        ((f.materialLibraries = [].concat(r.materialLibraries)),
        !(
          r.objects.length === 1 && r.objects[0].geometry.vertices.length === 0
        ))
      )
        for (let e = 0, n = r.objects.length; e < n; e++) {
          let n = r.objects[e],
            i = n.geometry,
            l = n.materials,
            p = i.type === `Line`,
            m = i.type === `Points`,
            _ = !1;
          if (i.vertices.length === 0) continue;
          let v = new g();
          (v.setAttribute(`position`, new a(i.vertices, 3)),
            i.normals.length > 0 &&
              v.setAttribute(`normal`, new a(i.normals, 3)),
            i.colors.length > 0 &&
              ((_ = !0), v.setAttribute(`color`, new a(i.colors, 3))),
            i.hasUVIndices === !0 && v.setAttribute(`uv`, new a(i.uvs, 2)));
          let y = [];
          for (let e = 0, n = l.length; e < n; e++) {
            let n = l[e],
              i = n.name + `_` + n.smooth + `_` + _,
              a = r.materials[i];
            if (this.materials !== null) {
              if (
                ((a = this.materials.create(n.name)),
                p && a && !(a instanceof s))
              ) {
                let e = new s();
                (h.prototype.copy.call(e, a), e.color.copy(a.color), (a = e));
              } else if (m && a && !(a instanceof t)) {
                let e = new t({ size: 10, sizeAttenuation: !1 });
                (h.prototype.copy.call(e, a),
                  e.color.copy(a.color),
                  (e.map = a.map),
                  (a = e));
              }
            }
            (a === void 0 &&
              ((a = p
                ? new s()
                : m
                  ? new t({ size: 1, sizeAttenuation: !1 })
                  : new d()),
              (a.name = n.name),
              (a.flatShading = !n.smooth),
              (a.vertexColors = _),
              (r.materials[i] = a)),
              y.push(a));
          }
          let b;
          if (y.length > 1) {
            for (let e = 0, t = l.length; e < t; e++) {
              let t = l[e];
              v.addGroup(t.groupStart, t.groupCount, e);
            }
            b = p ? new o(v, y) : m ? new u(v, y) : new c(v, y);
          } else b = p ? new o(v, y[0]) : m ? new u(v, y[0]) : new c(v, y[0]);
          ((b.name = n.name), f.add(b));
        }
      else if (r.vertices.length > 0) {
        let e = new t({ size: 1, sizeAttenuation: !1 }),
          n = new g();
        (n.setAttribute(`position`, new a(r.vertices, 3)),
          r.colors.length > 0 &&
            r.colors[0] !== void 0 &&
            (n.setAttribute(`color`, new a(r.colors, 3)),
            (e.vertexColors = !0)));
        let i = new u(n, e);
        f.add(i);
      }
      return f;
    }
  },
  P = class extends p {
    constructor(e) {
      super(e);
    }
    load(e, t, n, r) {
      let a = this,
        o = this.path === `` ? l.extractUrlBase(e) : this.path,
        s = new i(this.manager);
      (s.setPath(this.path),
        s.setRequestHeader(this.requestHeader),
        s.setWithCredentials(this.withCredentials),
        s.load(
          e,
          function (n) {
            try {
              t(a.parse(n, o));
            } catch (t) {
              (r ? r(t) : console.error(t), a.manager.itemError(e));
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
        (this.wrap = this.options.wrap === void 0 ? r : this.options.wrap));
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
        n = this.materialsInfo[e],
        r = { name: e, side: this.side };
      function i(e, t) {
        return typeof t != `string` || t === ``
          ? ``
          : /^https?:\/\//i.test(t)
            ? t
            : e + t;
      }
      function a(e, n) {
        if (r[e]) return;
        let a = t.getTextureParams(n, r),
          o = t.loadTexture(i(t.baseUrl, a.url));
        (o.repeat.copy(a.scale),
          o.offset.copy(a.offset),
          (o.wrapS = t.wrap),
          (o.wrapT = t.wrap),
          (e === `map` || e === `emissiveMap`) && (o.colorSpace = b),
          (r[e] = o));
      }
      for (let e in n) {
        let t = n[e],
          i;
        if (t !== ``)
          switch (e.toLowerCase()) {
            case `kd`:
              r.color = y.colorSpaceToWorking(new _().fromArray(t), b);
              break;
            case `ks`:
              r.specular = y.colorSpaceToWorking(new _().fromArray(t), b);
              break;
            case `ke`:
              r.emissive = y.colorSpaceToWorking(new _().fromArray(t), b);
              break;
            case `map_kd`:
              a(`map`, t);
              break;
            case `map_ks`:
              a(`specularMap`, t);
              break;
            case `map_ke`:
              a(`emissiveMap`, t);
              break;
            case `norm`:
              a(`normalMap`, t);
              break;
            case `map_bump`:
            case `bump`:
              a(`bumpMap`, t);
              break;
            case `disp`:
              a(`displacementMap`, t);
              break;
            case `map_d`:
              (a(`alphaMap`, t), (r.transparent = !0));
              break;
            case `ns`:
              r.shininess = parseFloat(t);
              break;
            case `d`:
              ((i = parseFloat(t)),
                i < 1 && ((r.opacity = i), (r.transparent = !0)));
              break;
            case `tr`:
              ((i = parseFloat(t)),
                this.options && this.options.invertTrProperty && (i = 1 - i),
                i > 0 && ((r.opacity = 1 - i), (r.transparent = !0)));
              break;
            default:
              break;
          }
      }
      return ((this.materials[e] = new d(r)), this.materials[e]);
    }
    getTextureParams(e, t) {
      let n = { scale: new f(1, 1), offset: new f(0, 0) },
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
    loadTexture(t, n, r, i, a) {
      let o = this.manager === void 0 ? v : this.manager,
        s = o.getHandler(t);
      (s === null && (s = new e(o)),
        s.setCrossOrigin && s.setCrossOrigin(this.crossOrigin));
      let c = s.load(t, r, i, a);
      return (n !== void 0 && (c.mapping = n), c);
    }
  };
export { N as n, P as t };
