// assets__Game-CrsSKcAK 36 — math
// Lines 19020-19364 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
var q = ss();
function cs(e, t, n = 0, r = e.length - 1, i = us) {
  for (; r > n;) {
    if (r - n > 600) {
      let a = r - n + 1,
        o = t - n + 1,
        s = Math.log(a),
        c = 0.5 * Math.exp((2 * s) / 3),
        l = 0.5 * Math.sqrt((s * c * (a - c)) / a) * (o - a / 2 < 0 ? -1 : 1);
      cs(
        e,
        t,
        Math.max(n, Math.floor(t - (o * c) / a + l)),
        Math.min(r, Math.floor(t + ((a - o) * c) / a + l)),
        i,
      );
    }
    let a = e[t],
      o = n,
      s = r;
    for (ls(e, n, t), i(e[r], a) > 0 && ls(e, n, r); o < s;) {
      for (ls(e, o, s), o++, s--; i(e[o], a) < 0;) o++;
      for (; i(e[s], a) > 0;) s--;
    }
    (i(e[n], a) === 0 ? ls(e, n, s) : (s++, ls(e, s, r)),
      s <= t && (n = s + 1),
      t <= s && (r = s - 1));
  }
}
function ls(e, t, n) {
  let r = e[t];
  ((e[t] = e[n]), (e[n] = r));
}
function us(e, t) {
  return e < t ? -1 : +(e > t);
}
var ds = class {
  constructor(e = 9) {
    ((this._maxEntries = Math.max(4, e)),
      (this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4))),
      this.clear());
  }
  all() {
    return this._all(this.data, []);
  }
  search(e) {
    let t = this.data,
      n = [];
    if (!Cs(e, t)) return n;
    let r = this.toBBox,
      i = [];
    for (; t;) {
      for (let a = 0; a < t.children.length; a++) {
        let o = t.children[a],
          s = t.leaf ? r(o) : o;
        Cs(e, s) &&
          (t.leaf ? n.push(o) : Ss(e, s) ? this._all(o, n) : i.push(o));
      }
      t = i.pop();
    }
    return n;
  }
  collides(e) {
    let t = this.data;
    if (!Cs(e, t)) return !1;
    let n = [];
    for (; t;) {
      for (let r = 0; r < t.children.length; r++) {
        let i = t.children[r],
          a = t.leaf ? this.toBBox(i) : i;
        if (Cs(e, a)) {
          if (t.leaf || Ss(e, a)) return !0;
          n.push(i);
        }
      }
      t = n.pop();
    }
    return !1;
  }
  load(e) {
    if (!(e && e.length)) return this;
    if (e.length < this._minEntries) {
      for (let t = 0; t < e.length; t++) this.insert(e[t]);
      return this;
    }
    let t = this._build(e.slice(), 0, e.length - 1, 0);
    if (!this.data.children.length) this.data = t;
    else if (this.data.height === t.height) this._splitRoot(this.data, t);
    else {
      if (this.data.height < t.height) {
        let e = this.data;
        ((this.data = t), (t = e));
      }
      this._insert(t, this.data.height - t.height - 1, !0);
    }
    return this;
  }
  insert(e) {
    return (e && this._insert(e, this.data.height - 1), this);
  }
  clear() {
    return ((this.data = ws([])), this);
  }
  remove(e, t) {
    if (!e) return this;
    let n = this.data,
      r = this.toBBox(e),
      i = [],
      a = [],
      o,
      s,
      c;
    for (; n || i.length;) {
      if (
        (n || ((n = i.pop()), (s = i[i.length - 1]), (o = a.pop()), (c = !0)),
        n.leaf)
      ) {
        let r = fs(e, n.children, t);
        if (r !== -1)
          return (n.children.splice(r, 1), i.push(n), this._condense(i), this);
      }
      !c && !n.leaf && Ss(n, r)
        ? (i.push(n), a.push(o), (o = 0), (s = n), (n = n.children[0]))
        : s
          ? (o++, (n = s.children[o]), (c = !1))
          : (n = null);
    }
    return this;
  }
  toBBox(e) {
    return e;
  }
  compareMinX(e, t) {
    return e.minX - t.minX;
  }
  compareMinY(e, t) {
    return e.minY - t.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(e) {
    return ((this.data = e), this);
  }
  _all(e, t) {
    let n = [];
    for (; e;)
      (e.leaf ? t.push(...e.children) : n.push(...e.children), (e = n.pop()));
    return t;
  }
  _build(e, t, n, r) {
    let i = n - t + 1,
      a = this._maxEntries,
      o;
    if (i <= a) return ((o = ws(e.slice(t, n + 1))), ps(o, this.toBBox), o);
    (r ||
      ((r = Math.ceil(Math.log(i) / Math.log(a))),
      (a = Math.ceil(i / a ** (r - 1)))),
      (o = ws([])),
      (o.leaf = !1),
      (o.height = r));
    let s = Math.ceil(i / a),
      c = s * Math.ceil(Math.sqrt(a));
    Ts(e, t, n, c, this.compareMinX);
    for (let i = t; i <= n; i += c) {
      let t = Math.min(i + c - 1, n);
      Ts(e, i, t, s, this.compareMinY);
      for (let n = i; n <= t; n += s) {
        let i = Math.min(n + s - 1, t);
        o.children.push(this._build(e, n, i, r - 1));
      }
    }
    return (ps(o, this.toBBox), o);
  }
  _chooseSubtree(e, t, n, r) {
    for (; r.push(t), !(t.leaf || r.length - 1 === n);) {
      let n = 1 / 0,
        r = 1 / 0,
        i;
      for (let a = 0; a < t.children.length; a++) {
        let o = t.children[a],
          s = vs(o),
          c = bs(e, o) - s;
        c < r
          ? ((r = c), (n = s < n ? s : n), (i = o))
          : c === r && s < n && ((n = s), (i = o));
      }
      t = i || t.children[0];
    }
    return t;
  }
  _insert(e, t, n) {
    let r = n ? e : this.toBBox(e),
      i = [],
      a = this._chooseSubtree(r, this.data, t, i);
    for (
      a.children.push(e), hs(a, r);
      t >= 0 && i[t].children.length > this._maxEntries;
    )
      (this._split(i, t), t--);
    this._adjustParentBBoxes(r, i, t);
  }
  _split(e, t) {
    let n = e[t],
      r = n.children.length,
      i = this._minEntries;
    this._chooseSplitAxis(n, i, r);
    let a = this._chooseSplitIndex(n, i, r),
      o = ws(n.children.splice(a, n.children.length - a));
    ((o.height = n.height),
      (o.leaf = n.leaf),
      ps(n, this.toBBox),
      ps(o, this.toBBox),
      t ? e[t - 1].children.push(o) : this._splitRoot(n, o));
  }
  _splitRoot(e, t) {
    ((this.data = ws([e, t])),
      (this.data.height = e.height + 1),
      (this.data.leaf = !1),
      ps(this.data, this.toBBox));
  }
  _chooseSplitIndex(e, t, n) {
    let r,
      i = 1 / 0,
      a = 1 / 0;
    for (let o = t; o <= n - t; o++) {
      let t = ms(e, 0, o, this.toBBox),
        s = ms(e, o, n, this.toBBox),
        c = xs(t, s),
        l = vs(t) + vs(s);
      c < i
        ? ((i = c), (r = o), (a = l < a ? l : a))
        : c === i && l < a && ((a = l), (r = o));
    }
    return r || n - t;
  }
  _chooseSplitAxis(e, t, n) {
    let r = e.leaf ? this.compareMinX : gs,
      i = e.leaf ? this.compareMinY : _s;
    this._allDistMargin(e, t, n, r) < this._allDistMargin(e, t, n, i) &&
      e.children.sort(r);
  }
  _allDistMargin(e, t, n, r) {
    e.children.sort(r);
    let i = this.toBBox,
      a = ms(e, 0, t, i),
      o = ms(e, n - t, n, i),
      s = ys(a) + ys(o);
    for (let r = t; r < n - t; r++) {
      let t = e.children[r];
      (hs(a, e.leaf ? i(t) : t), (s += ys(a)));
    }
    for (let r = n - t - 1; r >= t; r--) {
      let t = e.children[r];
      (hs(o, e.leaf ? i(t) : t), (s += ys(o)));
    }
    return s;
  }
  _adjustParentBBoxes(e, t, n) {
    for (let r = n; r >= 0; r--) hs(t[r], e);
  }
  _condense(e) {
    for (let t = e.length - 1, n; t >= 0; t--)
      e[t].children.length === 0
        ? t > 0
          ? ((n = e[t - 1].children), n.splice(n.indexOf(e[t]), 1))
          : this.clear()
        : ps(e[t], this.toBBox);
  }
};
function fs(e, t, n) {
  if (!n) return t.indexOf(e);
  for (let r = 0; r < t.length; r++) if (n(e, t[r])) return r;
  return -1;
}
function ps(e, t) {
  ms(e, 0, e.children.length, t, e);
}
function ms(e, t, n, r, i) {
  (i || (i = ws(null)),
    (i.minX = 1 / 0),
    (i.minY = 1 / 0),
    (i.maxX = -1 / 0),
    (i.maxY = -1 / 0));
  for (let a = t; a < n; a++) {
    let t = e.children[a];
    hs(i, e.leaf ? r(t) : t);
  }
  return i;
}
function hs(e, t) {
  return (
    (e.minX = Math.min(e.minX, t.minX)),
    (e.minY = Math.min(e.minY, t.minY)),
    (e.maxX = Math.max(e.maxX, t.maxX)),
    (e.maxY = Math.max(e.maxY, t.maxY)),
    e
  );
}
function gs(e, t) {
  return e.minX - t.minX;
}
function _s(e, t) {
  return e.minY - t.minY;
}
function vs(e) {
  return (e.maxX - e.minX) * (e.maxY - e.minY);
}
function ys(e) {
  return e.maxX - e.minX + (e.maxY - e.minY);
}
function bs(e, t) {
  return (
    (Math.max(t.maxX, e.maxX) - Math.min(t.minX, e.minX)) *
    (Math.max(t.maxY, e.maxY) - Math.min(t.minY, e.minY))
  );
}
function xs(e, t) {
  let n = Math.max(e.minX, t.minX),
    r = Math.max(e.minY, t.minY),
    i = Math.min(e.maxX, t.maxX),
    a = Math.min(e.maxY, t.maxY);
  return Math.max(0, i - n) * Math.max(0, a - r);
}
function Ss(e, t) {
  return (
    e.minX <= t.minX && e.minY <= t.minY && t.maxX <= e.maxX && t.maxY <= e.maxY
  );
}
function Cs(e, t) {
  return (
    t.minX <= e.maxX && t.minY <= e.maxY && t.maxX >= e.minX && t.maxY >= e.minY
  );
}
function ws(e) {
  return {
    children: e,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0,
  };
}
