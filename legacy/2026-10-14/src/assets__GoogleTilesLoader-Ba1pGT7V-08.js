// assets__GoogleTilesLoader-Ba1pGT7V 08 — getdata
// Lines 2519-2666 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
function Lt(e, t, n = new _()) {
  (U.set(e, t).divideScalar(256).multiplyScalar(2).subScalar(1),
    n.set(U.x, U.y, 1 - Math.abs(U.x) - Math.abs(U.y)));
  let r = b.clamp(-n.z, 0, 1);
  return (
    n.x >= 0 ? n.setX(n.x - r) : n.setX(n.x + r),
    n.y >= 0 ? n.setY(n.y - r) : n.setY(n.y + r),
    n.normalize(),
    n
  );
}
var Rt = { RGB: `color`, POSITION: `position` },
  zt = class extends ct {
    constructor(e = f) {
      (super(), (this.manager = e));
    }
    parse(e) {
      return super.parse(e).then(async (e) => {
        let { featureTable: t, batchTable: n } = e,
          r = new u(),
          a = t.header.extensions,
          o = new _(),
          s;
        if (a && a[`3DTILES_draco_point_compression`]) {
          let {
              byteOffset: e,
              byteLength: n,
              properties: i,
            } = a[`3DTILES_draco_point_compression`],
            o = this.manager.getHandler(`draco.drc`);
          if (o == null) throw Error(`PNTSLoader: dracoLoader not available.`);
          let c = {};
          for (let e in i)
            if (e in Rt && e in i) {
              let t = Rt[e];
              c[t] = i[e];
            }
          let l = {
              attributeIDs: c,
              attributeTypes: { position: `Float32Array`, color: `Uint8Array` },
              useUniqueIDs: !0,
            },
            u = t.getBuffer(e, n);
          ((s = await o.decodeGeometry(u, l)),
            s.attributes.color && (r.vertexColors = !0));
        } else {
          let e = t.getData(`POINTS_LENGTH`),
            n = t.getData(`POSITION`, e, `FLOAT`, `VEC3`),
            i = t.getData(`NORMAL`, e, `FLOAT`, `VEC3`),
            a = t.getData(`NORMAL`, e, `UNSIGNED_BYTE`, `VEC2`),
            c = t.getData(`RGB`, e, `UNSIGNED_BYTE`, `VEC3`),
            l = t.getData(`RGBA`, e, `UNSIGNED_BYTE`, `VEC4`),
            u = t.getData(`RGB565`, e, `UNSIGNED_SHORT`, `SCALAR`),
            d = t.getData(`CONSTANT_RGBA`, e, `UNSIGNED_BYTE`, `VEC4`),
            f = t.getData(`POSITION_QUANTIZED`, e, `UNSIGNED_SHORT`, `VEC3`),
            p = t.getData(`QUANTIZED_VOLUME_SCALE`, e, `FLOAT`, `VEC3`),
            m = t.getData(`QUANTIZED_VOLUME_OFFSET`, e, `FLOAT`, `VEC3`);
          if (((s = new ne()), f)) {
            let t = new Float32Array(e * 3);
            for (let n = 0; n < e; n++)
              for (let e = 0; e < 3; e++) {
                let r = 3 * n + e;
                t[r] = (f[r] / 65535) * p[e];
              }
            ((o.x = m[0]),
              (o.y = m[1]),
              (o.z = m[2]),
              s.setAttribute(`position`, new y(t, 3, !1)));
          } else s.setAttribute(`position`, new y(n, 3, !1));
          if (i !== null) s.setAttribute(`normal`, new y(i, 3, !1));
          else if (a !== null) {
            let t = new Float32Array(e * 3),
              n = new _();
            for (let r = 0; r < e; r++) {
              let e = a[r * 2],
                i = a[r * 2 + 1],
                o = Lt(e, i, n);
              ((t[r * 3] = o.x), (t[r * 3 + 1] = o.y), (t[r * 3 + 2] = o.z));
            }
            s.setAttribute(`normal`, new y(t, 3, !1));
          }
          if (l !== null)
            (s.setAttribute(`color`, new y(l, 4, !0)),
              (r.vertexColors = !0),
              (r.transparent = !0),
              (r.depthWrite = !1));
          else if (c !== null)
            (s.setAttribute(`color`, new y(c, 3, !0)), (r.vertexColors = !0));
          else if (u !== null) {
            let t = new Uint8Array(e * 3);
            for (let n = 0; n < e; n++) {
              let e = It(u[n]);
              for (let r = 0; r < 3; r++) {
                let i = 3 * n + r;
                t[i] = e[r];
              }
            }
            (s.setAttribute(`color`, new y(t, 3, !0)), (r.vertexColors = !0));
          } else if (d !== null) {
            r.color = new h(d[0], d[1], d[2]);
            let e = d[3] / 255;
            e < 1 &&
              ((r.opacity = e), (r.transparent = !0), (r.depthWrite = !1));
          }
        }
        let c = new i(s, r);
        (c.position.copy(o),
          (e.scene = c),
          (e.scene.featureTable = t),
          (e.scene.batchTable = n));
        let l = t.getData(`RTC_CENTER`, 1, `FLOAT`, `VEC3`);
        return (
          l &&
            ((e.scene.position.x += l[0]),
            (e.scene.position.y += l[1]),
            (e.scene.position.z += l[2])),
          e
        );
      });
    }
  },
  Bt = new _(),
  W = new _(),
  G = new _(),
  Vt = new _(),
  Ht = new n(),
  Ut = new _(),
  K = new g(),
  Wt = new g(),
  Gt = new _(),
  Kt = new g(),
  qt = new n(),
  Jt = {};
function Yt(e, t, n, r) {
  if (
    ((e = (e / n) * 2 - 1),
    (t = (t / n) * 2 - 1),
    (r.x = e),
    (r.y = t),
    (r.z = 1 - Math.abs(e) - Math.abs(t)),
    r.z < 0)
  ) {
    let e = r.x;
    ((r.x = (1 - Math.abs(r.y)) * (e >= 0 ? 1 : -1)),
      (r.y = (1 - Math.abs(e)) * (r.y >= 0 ? 1 : -1)));
  }
  return (r.normalize(), r);
}
