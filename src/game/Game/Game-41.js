// Game 41 — push
// Lines 20062-20535 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function Fc() {
  return Pc
    ? Mc.exports
    : ((Pc = 1),
      (function (e, t) {
        (function (t, n) {
          e.exports = n();
        })(Nc, function () {
          var e = {};
          function t(e, t) {
            ((this.x = e || 0), (this.y = t || 0));
          }
          ((e.Vector = t),
            (e.V = t),
            (t.prototype.copy = t.prototype.copy =
              function (e) {
                return ((this.x = e.x), (this.y = e.y), this);
              }),
            (t.prototype.clone = t.prototype.clone =
              function () {
                return new t(this.x, this.y);
              }),
            (t.prototype.perp = t.prototype.perp =
              function () {
                var e = this.x;
                return ((this.x = this.y), (this.y = -e), this);
              }),
            (t.prototype.rotate = t.prototype.rotate =
              function (e) {
                var t = this.x,
                  n = this.y;
                return (
                  (this.x = t * Math.cos(e) - n * Math.sin(e)),
                  (this.y = t * Math.sin(e) + n * Math.cos(e)),
                  this
                );
              }),
            (t.prototype.reverse = t.prototype.reverse =
              function () {
                return ((this.x = -this.x), (this.y = -this.y), this);
              }),
            (t.prototype.normalize = t.prototype.normalize =
              function () {
                var e = this.len();
                return (e > 0 && ((this.x /= e), (this.y /= e)), this);
              }),
            (t.prototype.add = t.prototype.add =
              function (e) {
                return ((this.x += e.x), (this.y += e.y), this);
              }),
            (t.prototype.sub = t.prototype.sub =
              function (e) {
                return ((this.x -= e.x), (this.y -= e.y), this);
              }),
            (t.prototype.scale = t.prototype.scale =
              function (e, t) {
                return ((this.x *= e), (this.y *= t === void 0 ? e : t), this);
              }),
            (t.prototype.project = t.prototype.project =
              function (e) {
                var t = this.dot(e) / e.len2();
                return ((this.x = t * e.x), (this.y = t * e.y), this);
              }),
            (t.prototype.projectN = t.prototype.projectN =
              function (e) {
                var t = this.dot(e);
                return ((this.x = t * e.x), (this.y = t * e.y), this);
              }),
            (t.prototype.reflect = t.prototype.reflect =
              function (e) {
                var t = this.x,
                  n = this.y;
                return (
                  this.project(e).scale(2),
                  (this.x -= t),
                  (this.y -= n),
                  this
                );
              }),
            (t.prototype.reflectN = t.prototype.reflectN =
              function (e) {
                var t = this.x,
                  n = this.y;
                return (
                  this.projectN(e).scale(2),
                  (this.x -= t),
                  (this.y -= n),
                  this
                );
              }),
            (t.prototype.dot = t.prototype.dot =
              function (e) {
                return this.x * e.x + this.y * e.y;
              }),
            (t.prototype.len2 = t.prototype.len2 =
              function () {
                return this.dot(this);
              }),
            (t.prototype.len = t.prototype.len =
              function () {
                return Math.sqrt(this.len2());
              }));
          function n(e, n) {
            ((this.pos = e || new t()),
              (this.r = n || 0),
              (this.offset = new t()));
          }
          ((e.Circle = n),
            (n.prototype.getAABBAsBox = n.prototype.getAABBAsBox =
              function () {
                var e = this.r;
                return new i(
                  this.pos.clone().add(this.offset).sub(new t(e, e)),
                  e * 2,
                  e * 2,
                );
              }),
            (n.prototype.getAABB = n.prototype.getAABB =
              function () {
                return this.getAABBAsBox().toPolygon();
              }),
            (n.prototype.setOffset = n.prototype.setOffset =
              function (e) {
                return ((this.offset = e), this);
              }));
          function r(e, n) {
            ((this.pos = e || new t()),
              (this.angle = 0),
              (this.offset = new t()),
              this.setPoints(n || []));
          }
          ((e.Polygon = r),
            (r.prototype.setPoints = r.prototype.setPoints =
              function (e) {
                if (!this.points || this.points.length !== e.length) {
                  var n,
                    r = (this.calcPoints = []),
                    i = (this.edges = []),
                    a = (this.normals = []);
                  for (n = 0; n < e.length; n++) {
                    var o = e[n],
                      s = n < e.length - 1 ? e[n + 1] : e[0];
                    if (o !== s && o.x === s.x && o.y === s.y) {
                      (e.splice(n, 1), --n);
                      continue;
                    }
                    (r.push(new t()), i.push(new t()), a.push(new t()));
                  }
                }
                return ((this.points = e), this._recalc(), this);
              }),
            (r.prototype.setAngle = r.prototype.setAngle =
              function (e) {
                return ((this.angle = e), this._recalc(), this);
              }),
            (r.prototype.setOffset = r.prototype.setOffset =
              function (e) {
                return ((this.offset = e), this._recalc(), this);
              }),
            (r.prototype.rotate = r.prototype.rotate =
              function (e) {
                for (var t = this.points, n = t.length, r = 0; r < n; r++)
                  t[r].rotate(e);
                return (this._recalc(), this);
              }),
            (r.prototype.translate = r.prototype.translate =
              function (e, t) {
                for (var n = this.points, r = n.length, i = 0; i < r; i++)
                  ((n[i].x += e), (n[i].y += t));
                return (this._recalc(), this);
              }),
            (r.prototype._recalc = function () {
              var e = this.calcPoints,
                t = this.edges,
                n = this.normals,
                r = this.points,
                i = this.offset,
                a = this.angle,
                o = r.length,
                s;
              for (s = 0; s < o; s++) {
                var c = e[s].copy(r[s]);
                ((c.x += i.x), (c.y += i.y), a !== 0 && c.rotate(a));
              }
              for (s = 0; s < o; s++) {
                var l = e[s],
                  u = s < o - 1 ? e[s + 1] : e[0],
                  d = t[s].copy(u).sub(l);
                n[s].copy(d).perp().normalize();
              }
              return this;
            }),
            (r.prototype.getAABBAsBox = r.prototype.getAABBAsBox =
              function () {
                for (
                  var e = this.calcPoints,
                    n = e.length,
                    r = e[0].x,
                    a = e[0].y,
                    o = e[0].x,
                    s = e[0].y,
                    c = 1;
                  c < n;
                  c++
                ) {
                  var l = e[c];
                  (l.x < r ? (r = l.x) : l.x > o && (o = l.x),
                    l.y < a ? (a = l.y) : l.y > s && (s = l.y));
                }
                return new i(this.pos.clone().add(new t(r, a)), o - r, s - a);
              }),
            (r.prototype.getAABB = r.prototype.getAABB =
              function () {
                return this.getAABBAsBox().toPolygon();
              }),
            (r.prototype.getCentroid = r.prototype.getCentroid =
              function () {
                for (
                  var e = this.calcPoints,
                    n = e.length,
                    r = 0,
                    i = 0,
                    a = 0,
                    o = 0;
                  o < n;
                  o++
                ) {
                  var s = e[o],
                    c = o === n - 1 ? e[0] : e[o + 1],
                    l = s.x * c.y - c.x * s.y;
                  ((r += (s.x + c.x) * l), (i += (s.y + c.y) * l), (a += l));
                }
                return ((a *= 3), (r /= a), (i /= a), new t(r, i));
              }));
          function i(e, n, r) {
            ((this.pos = e || new t()), (this.w = n || 0), (this.h = r || 0));
          }
          ((e.Box = i),
            (i.prototype.toPolygon = i.prototype.toPolygon =
              function () {
                var e = this.pos,
                  n = this.w,
                  i = this.h;
                return new r(new t(e.x, e.y), [
                  new t(),
                  new t(n, 0),
                  new t(n, i),
                  new t(0, i),
                ]);
              }));
          function a() {
            ((this.a = null),
              (this.b = null),
              (this.overlapN = new t()),
              (this.overlapV = new t()),
              this.clear());
          }
          ((e.Response = a),
            (a.prototype.clear = a.prototype.clear =
              function () {
                return (
                  (this.aInB = !0),
                  (this.bInA = !0),
                  (this.overlap = Number.MAX_VALUE),
                  this
                );
              }));
          for (var o = [], s = 0; s < 10; s++) o.push(new t());
          for (var c = [], s = 0; s < 5; s++) c.push([]);
          var l = new a(),
            u = new i(new t(), 1e-6, 1e-6).toPolygon();
          function d(e, t, n) {
            for (
              var r = Number.MAX_VALUE,
                i = -Number.MAX_VALUE,
                a = e.length,
                o = 0;
              o < a;
              o++
            ) {
              var s = e[o].dot(t);
              (s < r && (r = s), s > i && (i = s));
            }
            ((n[0] = r), (n[1] = i));
          }
          function f(e, t, n, r, i, a) {
            var s = c.pop(),
              l = c.pop(),
              u = o.pop().copy(t).sub(e),
              f = u.dot(i);
            if (
              (d(n, i, s),
              d(r, i, l),
              (l[0] += f),
              (l[1] += f),
              s[0] > l[1] || l[0] > s[1])
            )
              return (o.push(u), c.push(s), c.push(l), !0);
            if (a) {
              var p = 0;
              if (s[0] < l[0])
                if (((a.aInB = !1), s[1] < l[1]))
                  ((p = s[1] - l[0]), (a.bInA = !1));
                else {
                  var m = s[1] - l[0],
                    h = l[1] - s[0];
                  p = m < h ? m : -h;
                }
              else if (((a.bInA = !1), s[1] > l[1]))
                ((p = s[0] - l[1]), (a.aInB = !1));
              else {
                var m = s[1] - l[0],
                  h = l[1] - s[0];
                p = m < h ? m : -h;
              }
              var g = Math.abs(p);
              g < a.overlap &&
                ((a.overlap = g),
                a.overlapN.copy(i),
                p < 0 && a.overlapN.reverse());
            }
            return (o.push(u), c.push(s), c.push(l), !1);
          }
          e.isSeparatingAxis = f;
          function p(e, t) {
            var n = e.len2(),
              r = t.dot(e);
            return r < 0 ? m : r > n ? g : h;
          }
          var m = -1,
            h = 0,
            g = 1;
          function _(e, t) {
            var n = o.pop().copy(e).sub(t.pos).sub(t.offset),
              r = t.r * t.r,
              i = n.len2();
            return (o.push(n), i <= r);
          }
          e.pointInCircle = _;
          function v(e, t) {
            (u.pos.copy(e), l.clear());
            var n = S(u, t, l);
            return (n && (n = l.aInB), n);
          }
          e.pointInPolygon = v;
          function y(e, t, n) {
            var r = o.pop().copy(t.pos).add(t.offset).sub(e.pos).sub(e.offset),
              i = e.r + t.r,
              a = i * i,
              s = r.len2();
            if (s > a) return (o.push(r), !1);
            if (n) {
              var c = Math.sqrt(s);
              ((n.a = e),
                (n.b = t),
                (n.overlap = i - c),
                n.overlapN.copy(r.normalize()),
                n.overlapV.copy(r).scale(n.overlap),
                (n.aInB = e.r <= t.r && c <= t.r - e.r),
                (n.bInA = t.r <= e.r && c <= e.r - t.r));
            }
            return (o.push(r), !0);
          }
          e.testCircleCircle = y;
          function b(e, t, n) {
            for (
              var r = o.pop().copy(t.pos).add(t.offset).sub(e.pos),
                i = t.r,
                a = i * i,
                s = e.calcPoints,
                c = s.length,
                l = o.pop(),
                u = o.pop(),
                d = 0;
              d < c;
              d++
            ) {
              var f = d === c - 1 ? 0 : d + 1,
                h = d === 0 ? c - 1 : d - 1,
                _ = 0,
                v = null;
              (l.copy(e.edges[d]),
                u.copy(r).sub(s[d]),
                n && u.len2() > a && (n.aInB = !1));
              var y = p(l, u);
              if (y === m) {
                l.copy(e.edges[h]);
                var b = o.pop().copy(r).sub(s[h]);
                if (((y = p(l, b)), y === g)) {
                  var x = u.len();
                  if (x > i)
                    return (o.push(r), o.push(l), o.push(u), o.push(b), !1);
                  n && ((n.bInA = !1), (v = u.normalize()), (_ = i - x));
                }
                o.push(b);
              } else if (y === g) {
                if (
                  (l.copy(e.edges[f]),
                  u.copy(r).sub(s[f]),
                  (y = p(l, u)),
                  y === m)
                ) {
                  var x = u.len();
                  if (x > i) return (o.push(r), o.push(l), o.push(u), !1);
                  n && ((n.bInA = !1), (v = u.normalize()), (_ = i - x));
                }
              } else {
                var S = l.perp().normalize(),
                  x = u.dot(S);
                if (x > 0 && Math.abs(x) > i)
                  return (o.push(r), o.push(S), o.push(u), !1);
                n &&
                  ((v = S),
                  (_ = i - x),
                  (x >= 0 || _ < 2 * i) && (n.bInA = !1));
              }
              v &&
                n &&
                Math.abs(_) < Math.abs(n.overlap) &&
                ((n.overlap = _), n.overlapN.copy(v));
            }
            return (
              n &&
                ((n.a = e),
                (n.b = t),
                n.overlapV.copy(n.overlapN).scale(n.overlap)),
              o.push(r),
              o.push(l),
              o.push(u),
              !0
            );
          }
          e.testPolygonCircle = b;
          function x(e, t, n) {
            var r = b(t, e, n);
            if (r && n) {
              var i = n.a,
                a = n.aInB;
              (n.overlapN.reverse(),
                n.overlapV.reverse(),
                (n.a = n.b),
                (n.b = i),
                (n.aInB = n.bInA),
                (n.bInA = a));
            }
            return r;
          }
          e.testCirclePolygon = x;
          function S(e, t, n) {
            for (
              var r = e.calcPoints,
                i = r.length,
                a = t.calcPoints,
                o = a.length,
                s = 0;
              s < i;
              s++
            )
              if (f(e.pos, t.pos, r, a, e.normals[s], n)) return !1;
            for (var s = 0; s < o; s++)
              if (f(e.pos, t.pos, r, a, t.normals[s], n)) return !1;
            return (
              n &&
                ((n.a = e),
                (n.b = t),
                n.overlapV.copy(n.overlapN).scale(n.overlap)),
              !0
            );
          }
          return ((e.testPolygonPolygon = S), e);
        });
      })(Mc),
      Mc.exports);
}
