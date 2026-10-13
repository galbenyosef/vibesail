// assets__GoogleTilesLoader-Ba1pGT7V 09 — getdata
// Lines 2667-2967 of readable/assets__GoogleTilesLoader-Ba1pGT7V.pretty.js (statement-aligned).
var Xt = class extends st {
    constructor(e = f) {
      (super(),
        (this.manager = e),
        (this.adjustmentTransform = new g()),
        (this.ellipsoid = Ct.clone()));
    }
    resolveExternalURL(e) {
      return this.manager.resolveURL(super.resolveExternalURL(e));
    }
    parse(e) {
      return super.parse(e).then((e) => {
        let { featureTable: t, batchTable: n } = e,
          i = e.glbBytes.slice().buffer;
        return new Promise((a, o) => {
          let s = this.fetchOptions,
            c = this.manager,
            l = c.getHandler(`path.gltf`) || new ae(c);
          (s.credentials === `include` &&
            s.mode === `cors` &&
            l.setCrossOrigin(`use-credentials`),
            `credentials` in s &&
              l.setWithCredentials(s.credentials === `include`),
            s.headers && l.setRequestHeader(s.headers));
          let u = e.gltfWorkingPath ?? this.workingPath;
          /[\\/]$/.test(u) || (u += `/`);
          let d = this.adjustmentTransform;
          l.parse(
            i,
            u,
            (e) => {
              let i = t.getData(`INSTANCES_LENGTH`),
                o = t.getData(`POSITION`, i, `FLOAT`, `VEC3`),
                s = t.getData(
                  `POSITION_QUANTIZED`,
                  i,
                  `UNSIGNED_SHORT`,
                  `VEC3`,
                ),
                c = t.getData(`QUANTIZED_VOLUME_OFFSET`, 1, `FLOAT`, `VEC3`),
                l = t.getData(`QUANTIZED_VOLUME_SCALE`, 1, `FLOAT`, `VEC3`),
                u = t.getData(`NORMAL_UP`, i, `FLOAT`, `VEC3`),
                f = t.getData(`NORMAL_RIGHT`, i, `FLOAT`, `VEC3`),
                p = t.getData(`NORMAL_UP_OCT32P`, i, `UNSIGNED_SHORT`, `VEC2`),
                m = t.getData(
                  `NORMAL_RIGHT_OCT32P`,
                  i,
                  `UNSIGNED_SHORT`,
                  `VEC2`,
                ),
                h = t.getData(`SCALE_NON_UNIFORM`, i, `FLOAT`, `VEC3`),
                g = t.getData(`SCALE`, i, `FLOAT`, `SCALAR`),
                v = t.getData(`RTC_CENTER`, 1, `FLOAT`, `VEC3`),
                y = t.getData(`EAST_NORTH_UP`);
              if (!o && s) {
                o = new Float32Array(i * 3);
                for (let e = 0; e < i; e++)
                  ((o[e * 3 + 0] = c[0] + (s[e * 3 + 0] / 65535) * l[0]),
                    (o[e * 3 + 1] = c[1] + (s[e * 3 + 1] / 65535) * l[1]),
                    (o[e * 3 + 2] = c[2] + (s[e * 3 + 2] / 65535) * l[2]));
              }
              let b = new _();
              for (let e = 0; e < i; e++)
                ((b.x += o[e * 3 + 0] / i),
                  (b.y += o[e * 3 + 1] / i),
                  (b.z += o[e * 3 + 2] / i));
              let x = [],
                S = [];
              (e.scene.updateMatrixWorld(),
                e.scene.traverse((e) => {
                  if (e.isMesh) {
                    S.push(e);
                    let { geometry: t, material: n } = e,
                      a = new r(t, n, i);
                    (a.position.copy(b),
                      v &&
                        ((a.position.x += v[0]),
                        (a.position.y += v[1]),
                        (a.position.z += v[2])),
                      x.push(a));
                  }
                }));
              for (let e = 0; e < i; e++) {
                (Vt.set(
                  o[e * 3 + 0] - b.x,
                  o[e * 3 + 1] - b.y,
                  o[e * 3 + 2] - b.z,
                ),
                  Ht.identity(),
                  u && f
                    ? (W.set(u[e * 3 + 0], u[e * 3 + 1], u[e * 3 + 2]),
                      G.set(f[e * 3 + 0], f[e * 3 + 1], f[e * 3 + 2]),
                      Bt.crossVectors(G, W).normalize(),
                      K.makeBasis(G, W, Bt),
                      Ht.setFromRotationMatrix(K))
                    : p &&
                      m &&
                      (Yt(p[e * 2 + 0], p[e * 2 + 1], 65535, W),
                      Yt(m[e * 2 + 0], m[e * 2 + 1], 65535, G),
                      Bt.crossVectors(G, W).normalize(),
                      K.makeBasis(G, W, Bt),
                      Ht.setFromRotationMatrix(K)),
                  Ut.set(1, 1, 1),
                  h && Ut.set(h[e * 3 + 0], h[e * 3 + 1], h[e * 3 + 2]),
                  g && Ut.multiplyScalar(g[e]));
                for (let t = 0, n = x.length; t < n; t++) {
                  let n = x[t];
                  (qt.copy(Ht),
                    y &&
                      (n.updateMatrixWorld(),
                      Gt.copy(Vt).applyMatrix4(n.matrixWorld),
                      this.ellipsoid.getPositionToCartographic(Gt, Jt),
                      this.ellipsoid.getEastNorthUpFrame(Jt.lat, Jt.lon, Kt),
                      qt.setFromRotationMatrix(Kt)),
                    K.compose(Vt, qt, Ut).multiply(d));
                  let r = S[t];
                  (Wt.multiplyMatrices(K, r.matrixWorld), n.setMatrixAt(e, Wt));
                }
              }
              (e.scene.clear(),
                e.scene.add(...x),
                (e.batchTable = n),
                (e.featureTable = t),
                (e.scene.batchTable = n),
                (e.scene.featureTable = t),
                a(e));
            },
            o,
          );
        });
      });
    }
  },
  Zt = class extends lt {
    constructor(e = f) {
      (super(),
        (this.manager = e),
        (this.adjustmentTransform = new g()),
        (this.ellipsoid = Ct.clone()));
    }
    parse(e) {
      let t = super.parse(e),
        { manager: n, ellipsoid: r, adjustmentTransform: i } = this,
        o = [];
      for (let e in t.tiles) {
        let { type: a, buffer: s } = t.tiles[e];
        switch (a) {
          case `b3dm`: {
            let e = s.slice(),
              t = new Ft(n);
            ((t.workingPath = this.workingPath),
              (t.fetchOptions = this.fetchOptions),
              t.adjustmentTransform.copy(i));
            let r = t.parse(e.buffer);
            o.push(r);
            break;
          }
          case `pnts`: {
            let e = s.slice(),
              t = new zt(n);
            ((t.workingPath = this.workingPath),
              (t.fetchOptions = this.fetchOptions));
            let r = t.parse(e.buffer);
            o.push(r);
            break;
          }
          case `i3dm`: {
            let e = s.slice(),
              t = new Xt(n);
            ((t.workingPath = this.workingPath),
              (t.fetchOptions = this.fetchOptions),
              t.ellipsoid.copy(r),
              t.adjustmentTransform.copy(i));
            let a = t.parse(e.buffer);
            o.push(a);
            break;
          }
        }
      }
      return Promise.all(o).then((e) => {
        let t = new a();
        return (
          e.forEach((e) => {
            t.add(e.scene);
          }),
          { tiles: e, scene: t }
        );
      });
    }
  },
  q = new g(),
  Qt = class extends a {
    constructor(e) {
      (super(),
        (this.isTilesGroup = !0),
        (this.name = `TilesRenderer.TilesGroup`),
        (this.tilesRenderer = e),
        (this.matrixWorldInverse = new g()));
    }
    raycast(e, t) {
      return this.tilesRenderer.optimizeRaycast
        ? (this.tilesRenderer.raycast(e, t), !1)
        : !0;
    }
    updateMatrixWorld(e) {
      if (
        (this.matrixAutoUpdate && this.updateMatrix(),
        this.matrixWorldNeedsUpdate || e)
      ) {
        (this.parent === null
          ? q.copy(this.matrix)
          : q.multiplyMatrices(this.parent.matrixWorld, this.matrix),
          (this.matrixWorldNeedsUpdate = !1));
        let e = q.elements,
          t = this.matrixWorld.elements,
          n = !1;
        for (let r = 0; r < 16; r++) {
          let i = e[r],
            a = t[r];
          if (Math.abs(i - a) > 2 ** -52) {
            n = !0;
            break;
          }
        }
        if (n) {
          (this.matrixWorld.copy(q), this.matrixWorldInverse.copy(q).invert());
          let e = this.children;
          for (let t = 0, n = e.length; t < n; t++) e[t].updateMatrixWorld();
        }
      }
    }
    updateWorldMatrix(e, t) {
      (this.parent && e && this.parent.updateWorldMatrix(e, !1),
        this.updateMatrixWorld(!0));
    }
  },
  $t = new s(),
  en = new _(),
  tn = [];
function nn(e, t) {
  return e.distance - t.distance;
}
function rn(e, t, n, r) {
  let { scene: i } = e.engineData;
  n.invokeOnePlugin((n) => n.raycastTile && n.raycastTile(e, i, t, r)) ||
    t.intersectObject(i, !0, r);
}
function an(e, t, n) {
  (rn(e, t, n, tn), tn.sort(nn));
  let r = tn[0] || null;
  return ((tn.length = 0), r);
}
function on(e) {
  return `traversal` in e;
}
function sn(e, t, n, r = null) {
  let { group: i, activeTiles: a } = e;
  r === null && ((r = $t), r.copy(n.ray).applyMatrix4(i.matrixWorldInverse));
  let o = [],
    s = t.children;
  for (let e = 0, t = s.length; e < t; e++) {
    let t = s[e];
    !on(t) ||
      !t.traversal.used ||
      (t.engineData.boundingVolume.intersectRay(r, en) !== null &&
        (en.applyMatrix4(i.matrixWorld),
        o.push({ distance: en.distanceToSquared(n.ray.origin), tile: t })));
  }
  o.sort(nn);
  let c = null,
    l = 1 / 0;
  if (a.has(t)) {
    let r = an(t, n, e);
    r && ((c = r), (l = r.distance * r.distance));
  }
  for (let t = 0, i = o.length; t < i; t++) {
    let i = o[t],
      a = i.distance,
      s = i.tile;
    if (a > l) break;
    let u = sn(e, s, n, r);
    if (u) {
      let e = u.distance * u.distance;
      e < l && ((c = u), (l = e));
    }
  }
  return c;
}
function cn(e, t, n, r, i = null) {
  if (!on(t)) return;
  let { group: a, activeTiles: o } = e,
    { boundingVolume: s } = t.engineData;
  if (
    (i === null && ((i = $t), i.copy(n.ray).applyMatrix4(a.matrixWorldInverse)),
    !t.traversal.used || !s.intersectsRay(i))
  )
    return;
  o.has(t) && rn(t, n, e, r);
  let c = t.children;
  for (let t = 0, a = c.length; t < a; t++) cn(e, c[t], n, r, i);
}
