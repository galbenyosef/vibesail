// assets__WorldDefinitionBuilder-CjRtTnhK 02 — next
// Lines 95-850 of readable/assets__WorldDefinitionBuilder-CjRtTnhK.pretty.js (statement-aligned).
var p = [
    {
      category: `front-line`,
      config: {
        layout: `ring`,
        seed: `sponsor-ring-v2`,
        slotCount: 14,
        radius: 550,
        radialJitter: 12,
        positionJitter: 8,
        angleJitterDegrees: 2,
        startAngleDegrees: -98,
      },
      islands: [
        { size: 1.1, trees: 10, sponsor: `VibeSail` },
        { size: 0.85, trees: 5 },
        { size: 1.15, trees: 6, sponsor: `FerrySimulator` },
        { size: 1, trees: 10, sponsor: `VibeTapper` },
        { size: 0.85, trees: 5 },
        { size: 1.05, trees: 11 },
        { size: 1.2, trees: 10, sponsor: `VibeSail` },
        { size: 0.9, trees: 5 },
        { size: 0.85, trees: 5 },
        { size: 1, trees: 10, sponsor: `VibeSail` },
        { size: 0.75, trees: 5 },
        { size: 1, trees: 10, sponsor: `ThreeJsEval` },
        { size: 0.9, trees: 5 },
        { size: 0.8, trees: 4 },
      ],
    },
    {
      category: `procedural-horizon`,
      islands: [],
      config: {
        layout: `natural`,
        seed: 733,
        minRadius: 820,
        maxRadius: 3650,
        islandCount: 116,
        minSize: 1.05,
        maxSize: 12.2,
        minTrees: 2,
        maxTrees: 34,
        minDistanceBetweenIslands: 140,
        sizeDistanceScale: 42,
        footprintMinDistance: 18,
        footprintDistanceScale: 78,
        reservedMinDistanceBetweenIslands: 110,
        reservedSizeDistanceScale: 82,
        reservedFootprintMinDistance: 28,
        reservedFootprintDistanceScale: 104,
        radiusBias: 0.82,
        radialBands: [
          {
            name: `outer-ring-reefs`,
            count: 42,
            minRadius: 820,
            maxRadius: 1620,
            minSize: 1.1,
            maxSize: 5.4,
            minTrees: 2,
            maxTrees: 20,
            minDistanceBetweenIslands: 92,
            sizeDistanceScale: 34,
            footprintMinDistance: 12,
            footprintDistanceScale: 100,
            reservedMinDistanceBetweenIslands: 115,
            reservedSizeDistanceScale: 88,
            reservedFootprintMinDistance: 30,
            reservedFootprintDistanceScale: 110,
            maxAttempts: 2e4,
            radiusBias: 1.15,
            terrainWeights: [
              { profile: `ridge`, weight: 0.28 },
              { profile: `atoll`, weight: 0.2 },
              { profile: `mountain`, weight: 0.18 },
              { profile: `default`, weight: 0.14 },
              { profile: `harbor`, weight: 0.12 },
              { profile: `sandbar`, weight: 0.08 },
            ],
          },
          {
            name: `near-horizon-islands`,
            count: 40,
            minRadius: 1550,
            maxRadius: 2450,
            minSize: 1.15,
            maxSize: 7.4,
            minTrees: 3,
            maxTrees: 26,
            minDistanceBetweenIslands: 116,
            sizeDistanceScale: 38,
            footprintMinDistance: 14,
            footprintDistanceScale: 100,
            maxAttempts: 2e4,
            radiusBias: 0.96,
          },
          {
            name: `far-exploration-islands`,
            count: 34,
            minRadius: 2350,
            maxRadius: 3650,
            minSize: 1.2,
            maxSize: 12.2,
            minTrees: 5,
            maxTrees: 34,
            minDistanceBetweenIslands: 150,
            sizeDistanceScale: 45,
            footprintMinDistance: 14,
            footprintDistanceScale: 100,
            maxAttempts: 2e4,
            radiusBias: 0.82,
          },
        ],
        volcanoCount: 0,
        castleCount: 6,
        castleMaxRadius: 2850,
        townCount: 18,
        portCount: 15,
        beaconCount: 3,
      },
    },
  ],
  m = [
    {
      id: `AISuitup`,
      centerX: 0,
      centerZ: 0,
      initialAngle: 3.14,
      radius: 610,
      speed: 0.015,
      modelPath: `/assets/models/yatch_aisuitup.obj/`,
      objFile: `e3923a77-4251-4342-93a7-c5d628d337d3.obj`,
      mtlFile: `e3923a77-4251-4342-93a7-c5d628d337d3.mtl`,
      scale: 0.25,
    },
  ],
  h = t((e, t) => {
    (function (e, t, n) {
      function r(e) {
        var t = this,
          n = o();
        ((t.next = function () {
          var e = 2091639 * t.s0 + t.c * 23283064365386963e-26;
          return ((t.s0 = t.s1), (t.s1 = t.s2), (t.s2 = e - (t.c = e | 0)));
        }),
          (t.c = 1),
          (t.s0 = n(` `)),
          (t.s1 = n(` `)),
          (t.s2 = n(` `)),
          (t.s0 -= n(e)),
          t.s0 < 0 && (t.s0 += 1),
          (t.s1 -= n(e)),
          t.s1 < 0 && (t.s1 += 1),
          (t.s2 -= n(e)),
          t.s2 < 0 && (t.s2 += 1),
          (n = null));
      }
      function i(e, t) {
        return ((t.c = e.c), (t.s0 = e.s0), (t.s1 = e.s1), (t.s2 = e.s2), t);
      }
      function a(e, t) {
        var n = new r(e),
          a = t && t.state,
          o = n.next;
        return (
          (o.int32 = function () {
            return (n.next() * 4294967296) | 0;
          }),
          (o.double = function () {
            return o() + ((o() * 2097152) | 0) * 11102230246251565e-32;
          }),
          (o.quick = o),
          a &&
            (typeof a == `object` && i(a, n),
            (o.state = function () {
              return i(n, {});
            })),
          o
        );
      }
      function o() {
        var e = 4022871197;
        return function (t) {
          t = String(t);
          for (var n = 0; n < t.length; n++) {
            e += t.charCodeAt(n);
            var r = 0.02519603282416938 * e;
            ((e = r >>> 0),
              (r -= e),
              (r *= e),
              (e = r >>> 0),
              (r -= e),
              (e += r * 4294967296));
          }
          return (e >>> 0) * 23283064365386963e-26;
        };
      }
      t && t.exports
        ? (t.exports = a)
        : n && n.amd
          ? n(function () {
              return a;
            })
          : (this.alea = a);
    })(e, typeof t == `object` && t, typeof define == `function` && define);
  }),
  g = t((e, t) => {
    (function (e, t, n) {
      function r(e) {
        var t = this,
          n = ``;
        ((t.x = 0),
          (t.y = 0),
          (t.z = 0),
          (t.w = 0),
          (t.next = function () {
            var e = t.x ^ (t.x << 11);
            return (
              (t.x = t.y),
              (t.y = t.z),
              (t.z = t.w),
              (t.w ^= (t.w >>> 19) ^ e ^ (e >>> 8))
            );
          }),
          e === (e | 0) ? (t.x = e) : (n += e));
        for (var r = 0; r < n.length + 64; r++)
          ((t.x ^= n.charCodeAt(r) | 0), t.next());
      }
      function i(e, t) {
        return ((t.x = e.x), (t.y = e.y), (t.z = e.z), (t.w = e.w), t);
      }
      function a(e, t) {
        var n = new r(e),
          a = t && t.state,
          o = function () {
            return (n.next() >>> 0) / 4294967296;
          };
        return (
          (o.double = function () {
            do
              var e =
                ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
            while (e === 0);
            return e;
          }),
          (o.int32 = n.next),
          (o.quick = o),
          a &&
            (typeof a == `object` && i(a, n),
            (o.state = function () {
              return i(n, {});
            })),
          o
        );
      }
      t && t.exports
        ? (t.exports = a)
        : n && n.amd
          ? n(function () {
              return a;
            })
          : (this.xor128 = a);
    })(e, typeof t == `object` && t, typeof define == `function` && define);
  }),
  _ = t((e, t) => {
    (function (e, t, n) {
      function r(e) {
        var t = this,
          n = ``;
        ((t.next = function () {
          var e = t.x ^ (t.x >>> 2);
          return (
            (t.x = t.y),
            (t.y = t.z),
            (t.z = t.w),
            (t.w = t.v),
            ((t.d = (t.d + 362437) | 0) +
              (t.v = t.v ^ (t.v << 4) ^ (e ^ (e << 1)))) |
              0
          );
        }),
          (t.x = 0),
          (t.y = 0),
          (t.z = 0),
          (t.w = 0),
          (t.v = 0),
          e === (e | 0) ? (t.x = e) : (n += e));
        for (var r = 0; r < n.length + 64; r++)
          ((t.x ^= n.charCodeAt(r) | 0),
            r == n.length && (t.d = (t.x << 10) ^ (t.x >>> 4)),
            t.next());
      }
      function i(e, t) {
        return (
          (t.x = e.x),
          (t.y = e.y),
          (t.z = e.z),
          (t.w = e.w),
          (t.v = e.v),
          (t.d = e.d),
          t
        );
      }
      function a(e, t) {
        var n = new r(e),
          a = t && t.state,
          o = function () {
            return (n.next() >>> 0) / 4294967296;
          };
        return (
          (o.double = function () {
            do
              var e =
                ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
            while (e === 0);
            return e;
          }),
          (o.int32 = n.next),
          (o.quick = o),
          a &&
            (typeof a == `object` && i(a, n),
            (o.state = function () {
              return i(n, {});
            })),
          o
        );
      }
      t && t.exports
        ? (t.exports = a)
        : n && n.amd
          ? n(function () {
              return a;
            })
          : (this.xorwow = a);
    })(e, typeof t == `object` && t, typeof define == `function` && define);
  }),
  v = t((e, t) => {
    (function (e, t, n) {
      function r(e) {
        var t = this;
        t.next = function () {
          var e = t.x,
            n = t.i,
            r = e[n],
            i;
          return (
            (r ^= r >>> 7),
            (i = r ^ (r << 24)),
            (r = e[(n + 1) & 7]),
            (i ^= r ^ (r >>> 10)),
            (r = e[(n + 3) & 7]),
            (i ^= r ^ (r >>> 3)),
            (r = e[(n + 4) & 7]),
            (i ^= r ^ (r << 7)),
            (r = e[(n + 7) & 7]),
            (r ^= r << 13),
            (i ^= r ^ (r << 9)),
            (e[n] = i),
            (t.i = (n + 1) & 7),
            i
          );
        };
        function n(e, t) {
          var n,
            r = [];
          if (t === (t | 0)) r[0] = t;
          else
            for (t = `` + t, n = 0; n < t.length; ++n)
              r[n & 7] =
                (r[n & 7] << 15) ^ ((t.charCodeAt(n) + r[(n + 1) & 7]) << 13);
          for (; r.length < 8;) r.push(0);
          for (n = 0; n < 8 && r[n] === 0; ++n);
          for (
            n == 8 ? (r[7] = -1) : r[n], e.x = r, e.i = 0, n = 256;
            n > 0;
            --n
          )
            e.next();
        }
        n(t, e);
      }
      function i(e, t) {
        return ((t.x = e.x.slice()), (t.i = e.i), t);
      }
      function a(e, t) {
        e ?? (e = +new Date());
        var n = new r(e),
          a = t && t.state,
          o = function () {
            return (n.next() >>> 0) / 4294967296;
          };
        return (
          (o.double = function () {
            do
              var e =
                ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
            while (e === 0);
            return e;
          }),
          (o.int32 = n.next),
          (o.quick = o),
          a &&
            (a.x && i(a, n),
            (o.state = function () {
              return i(n, {});
            })),
          o
        );
      }
      t && t.exports
        ? (t.exports = a)
        : n && n.amd
          ? n(function () {
              return a;
            })
          : (this.xorshift7 = a);
    })(e, typeof t == `object` && t, typeof define == `function` && define);
  }),
  y = t((e, t) => {
    (function (e, t, n) {
      function r(e) {
        var t = this;
        t.next = function () {
          var e = t.w,
            n = t.X,
            r = t.i,
            i,
            a;
          return (
            (t.w = e = (e + 1640531527) | 0),
            (a = n[(r + 34) & 127]),
            (i = n[(r = (r + 1) & 127)]),
            (a ^= a << 13),
            (i ^= i << 17),
            (a ^= a >>> 15),
            (i ^= i >>> 12),
            (a = n[r] = a ^ i),
            (t.i = r),
            (a + (e ^ (e >>> 16))) | 0
          );
        };
        function n(e, t) {
          var n,
            r,
            i,
            a,
            o,
            s = [],
            c = 128;
          for (
            t === (t | 0)
              ? ((r = t), (t = null))
              : ((t += `\0`), (r = 0), (c = Math.max(c, t.length))),
              i = 0,
              a = -32;
            a < c;
            ++a
          )
            (t && (r ^= t.charCodeAt((a + 32) % t.length)),
              a === 0 && (o = r),
              (r ^= r << 10),
              (r ^= r >>> 15),
              (r ^= r << 4),
              (r ^= r >>> 13),
              a >= 0 &&
                ((o = (o + 1640531527) | 0),
                (n = s[a & 127] ^= r + o),
                (i = n == 0 ? i + 1 : 0)));
          for (
            i >= 128 && (s[((t && t.length) || 0) & 127] = -1),
              i = 127,
              a = 512;
            a > 0;
            --a
          )
            ((r = s[(i + 34) & 127]),
              (n = s[(i = (i + 1) & 127)]),
              (r ^= r << 13),
              (n ^= n << 17),
              (r ^= r >>> 15),
              (n ^= n >>> 12),
              (s[i] = r ^ n));
          ((e.w = o), (e.X = s), (e.i = i));
        }
        n(t, e);
      }
      function i(e, t) {
        return ((t.i = e.i), (t.w = e.w), (t.X = e.X.slice()), t);
      }
      function a(e, t) {
        e ?? (e = +new Date());
        var n = new r(e),
          a = t && t.state,
          o = function () {
            return (n.next() >>> 0) / 4294967296;
          };
        return (
          (o.double = function () {
            do
              var e =
                ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
            while (e === 0);
            return e;
          }),
          (o.int32 = n.next),
          (o.quick = o),
          a &&
            (a.X && i(a, n),
            (o.state = function () {
              return i(n, {});
            })),
          o
        );
      }
      t && t.exports
        ? (t.exports = a)
        : n && n.amd
          ? n(function () {
              return a;
            })
          : (this.xor4096 = a);
    })(e, typeof t == `object` && t, typeof define == `function` && define);
  }),
  b = t((e, t) => {
    (function (e, t, n) {
      function r(e) {
        var t = this,
          n = ``;
        ((t.next = function () {
          var e = t.b,
            n = t.c,
            r = t.d,
            i = t.a;
          return (
            (e = (e << 25) ^ (e >>> 7) ^ n),
            (n = (n - r) | 0),
            (r = (r << 24) ^ (r >>> 8) ^ i),
            (i = (i - e) | 0),
            (t.b = e = (e << 20) ^ (e >>> 12) ^ n),
            (t.c = n = (n - r) | 0),
            (t.d = (r << 16) ^ (n >>> 16) ^ i),
            (t.a = (i - e) | 0)
          );
        }),
          (t.a = 0),
          (t.b = 0),
          (t.c = -1640531527),
          (t.d = 1367130551),
          e === Math.floor(e)
            ? ((t.a = (e / 4294967296) | 0), (t.b = e | 0))
            : (n += e));
        for (var r = 0; r < n.length + 20; r++)
          ((t.b ^= n.charCodeAt(r) | 0), t.next());
      }
      function i(e, t) {
        return ((t.a = e.a), (t.b = e.b), (t.c = e.c), (t.d = e.d), t);
      }
      function a(e, t) {
        var n = new r(e),
          a = t && t.state,
          o = function () {
            return (n.next() >>> 0) / 4294967296;
          };
        return (
          (o.double = function () {
            do
              var e =
                ((n.next() >>> 11) + (n.next() >>> 0) / 4294967296) / (1 << 21);
            while (e === 0);
            return e;
          }),
          (o.int32 = n.next),
          (o.quick = o),
          a &&
            (typeof a == `object` && i(a, n),
            (o.state = function () {
              return i(n, {});
            })),
          o
        );
      }
      t && t.exports
        ? (t.exports = a)
        : n && n.amd
          ? n(function () {
              return a;
            })
          : (this.tychei = a);
    })(e, typeof t == `object` && t, typeof define == `function` && define);
  }),
  x = t((e, t) => {
    t.exports = {};
  }),
  S = t((e, t) => {
    (function (e, n, r) {
      var i = 256,
        a = 6,
        o = 52,
        s = `random`,
        c = r.pow(i, a),
        l = r.pow(2, o),
        u = l * 2,
        d = i - 1,
        f;
      function p(e, t, o) {
        var d = [];
        t = t == 1 ? { entropy: !0 } : t || {};
        var f = _(g(t.entropy ? [e, y(n)] : (e ?? v()), 3), d),
          p = new m(d),
          b = function () {
            for (var e = p.g(a), t = c, n = 0; e < l;)
              ((e = (e + n) * i), (t *= i), (n = p.g(1)));
            for (; e >= u;) ((e /= 2), (t /= 2), (n >>>= 1));
            return (e + n) / t;
          };
        return (
          (b.int32 = function () {
            return p.g(4) | 0;
          }),
          (b.quick = function () {
            return p.g(4) / 4294967296;
          }),
          (b.double = b),
          _(y(p.S), n),
          (
            t.pass ||
            o ||
            function (e, t, n, i) {
              return (
                i &&
                  (i.S && h(i, p),
                  (e.state = function () {
                    return h(p, {});
                  })),
                n ? ((r[s] = e), t) : e
              );
            }
          )(b, f, `global` in t ? t.global : this == r, t.state)
        );
      }
      function m(e) {
        var t,
          n = e.length,
          r = this,
          a = 0,
          o = (r.i = r.j = 0),
          s = (r.S = []);
        for (n || (e = [n++]); a < i;) s[a] = a++;
        for (a = 0; a < i; a++)
          ((s[a] = s[(o = d & (o + e[a % n] + (t = s[a])))]), (s[o] = t));
        (r.g = function (e) {
          for (var t, n = 0, a = r.i, o = r.j, s = r.S; e--;)
            ((t = s[(a = d & (a + 1))]),
              (n =
                n * i + s[d & ((s[a] = s[(o = d & (o + t))]) + (s[o] = t))]));
          return ((r.i = a), (r.j = o), n);
        })(i);
      }
      function h(e, t) {
        return ((t.i = e.i), (t.j = e.j), (t.S = e.S.slice()), t);
      }
      function g(e, t) {
        var n = [],
          r = typeof e,
          i;
        if (t && r == `object`)
          for (i in e)
            try {
              n.push(g(e[i], t - 1));
            } catch {}
        return n.length ? n : r == `string` ? e : e + `\0`;
      }
      function _(e, t) {
        for (var n = e + ``, r, i = 0; i < n.length;)
          t[d & i] = d & ((r ^= t[d & i] * 19) + n.charCodeAt(i++));
        return y(t);
      }
      function v() {
        try {
          var t;
          return (
            f && (t = f.randomBytes)
              ? (t = t(i))
              : ((t = new Uint8Array(i)),
                (e.crypto || e.msCrypto).getRandomValues(t)),
            y(t)
          );
        } catch {
          var r = e.navigator,
            a = r && r.plugins;
          return [+new Date(), e, a, e.screen, y(n)];
        }
      }
      function y(e) {
        return String.fromCharCode.apply(0, e);
      }
      if ((_(r.random(), n), typeof t == `object` && t.exports)) {
        t.exports = p;
        try {
          f = x();
        } catch {}
      } else
        typeof define == `function` && define.amd
          ? define(function () {
              return p;
            })
          : (r[`seed` + s] = p);
    })(typeof self < `u` ? self : e, [], Math);
  }),
  C = t((e, t) => {
    var n = h(),
      r = g(),
      i = _(),
      a = v(),
      o = y(),
      s = b(),
      c = S();
    ((c.alea = n),
      (c.xor128 = r),
      (c.xorwow = i),
      (c.xorshift7 = a),
      (c.xor4096 = o),
      (c.tychei = s),
      (t.exports = c));
  }),
  w = e(C(), 1),
  T = [
    `Cay`,
    `Reef`,
    `Point`,
    `Atoll`,
    `Lagoon`,
    `Shoal`,
    `Beacon`,
    `Sound`,
    `Mooring`,
    `Breakwater`,
  ],
  E = [
    `Outer Wilds`,
    `Bluewater Reach`,
    `Drift Isles`,
    `Mistward Sea`,
    `Ember Coast`,
    `Open Horizon`,
  ],
  D = [
    { profile: `harbor`, weight: 0.18 },
    { profile: `ridge`, weight: 0.18 },
    { profile: `atoll`, weight: 0.16 },
    { profile: `sandbar`, weight: 0.14 },
    { profile: `spire`, weight: 0.14 },
    { profile: `mountain`, weight: 0.12 },
    { profile: `default`, weight: 0.08 },
  ];
