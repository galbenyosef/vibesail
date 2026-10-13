// assets__auto-CBo2XcXh 16 — height
// Lines 4723-5064 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Hi(e) {
  let t = [],
    n,
    r,
    i,
    a,
    o,
    s;
  for (n = 0, r = (e || []).length; n < r; ++n)
    ((i = e[n]),
      ({
        position: a,
        options: { stack: o, stackWeight: s = 1 },
      } = i),
      t.push({
        index: n,
        box: i,
        pos: a,
        horizontal: i.isHorizontal(),
        weight: i.weight,
        stack: o && a + o,
        stackWeight: s,
      }));
  return t;
}
function Ui(e) {
  let t = {};
  for (let n of e) {
    let { stack: e, pos: r, stackWeight: i } = n;
    if (!e || !Ri.includes(r)) continue;
    let a = t[e] || (t[e] = { count: 0, placed: 0, weight: 0, size: 0 });
    (a.count++, (a.weight += i));
  }
  return t;
}
function Wi(e, t) {
  let n = Ui(e),
    { vBoxMaxWidth: r, hBoxMaxHeight: i } = t,
    a,
    o,
    s;
  for (a = 0, o = e.length; a < o; ++a) {
    s = e[a];
    let { fullSize: o } = s.box,
      c = n[s.stack],
      l = c && s.stackWeight / c.weight;
    s.horizontal
      ? ((s.width = l ? l * r : o && t.availableWidth), (s.height = i))
      : ((s.width = r), (s.height = l ? l * i : o && t.availableHeight));
  }
  return n;
}
function Gi(e) {
  let t = Hi(e),
    n = Vi(
      t.filter((e) => e.box.fullSize),
      !0,
    ),
    r = Vi(zi(t, `left`), !0),
    i = Vi(zi(t, `right`)),
    a = Vi(zi(t, `top`), !0),
    o = Vi(zi(t, `bottom`)),
    s = Bi(t, `x`),
    c = Bi(t, `y`);
  return {
    fullSize: n,
    leftAndTop: r.concat(a),
    rightAndBottom: i.concat(c).concat(o).concat(s),
    chartArea: zi(t, `chartArea`),
    vertical: r.concat(i).concat(c),
    horizontal: a.concat(o).concat(s),
  };
}
function Ki(e, t, n, r) {
  return Math.max(e[n], t[n]) + Math.max(e[r], t[r]);
}
function qi(e, t) {
  ((e.top = Math.max(e.top, t.top)),
    (e.left = Math.max(e.left, t.left)),
    (e.bottom = Math.max(e.bottom, t.bottom)),
    (e.right = Math.max(e.right, t.right)));
}
function Ji(e, t, n, r) {
  let { pos: i, box: a } = n,
    o = e.maxPadding;
  if (!j(i)) {
    n.size && (e[i] -= n.size);
    let t = r[n.stack] || { size: 0, count: 1 };
    ((t.size = Math.max(t.size, n.horizontal ? a.height : a.width)),
      (n.size = t.size / t.count),
      (e[i] += n.size));
  }
  a.getPadding && qi(o, a.getPadding());
  let s = Math.max(0, t.outerWidth - Ki(o, e, `left`, `right`)),
    c = Math.max(0, t.outerHeight - Ki(o, e, `top`, `bottom`)),
    l = s !== e.w,
    u = c !== e.h;
  return (
    (e.w = s),
    (e.h = c),
    n.horizontal ? { same: l, other: u } : { same: u, other: l }
  );
}
function Yi(e) {
  let t = e.maxPadding;
  function n(n) {
    let r = Math.max(t[n] - e[n], 0);
    return ((e[n] += r), r);
  }
  ((e.y += n(`top`)), (e.x += n(`left`)), n(`right`), n(`bottom`));
}
function Xi(e, t) {
  let n = t.maxPadding;
  function r(e) {
    let r = { left: 0, top: 0, right: 0, bottom: 0 };
    return (
      e.forEach((e) => {
        r[e] = Math.max(t[e], n[e]);
      }),
      r
    );
  }
  return r(e ? [`left`, `right`] : [`top`, `bottom`]);
}
function Zi(e, t, n, r) {
  let i = [],
    a,
    o,
    s,
    c,
    l,
    u;
  for (a = 0, o = e.length, l = 0; a < o; ++a) {
    ((s = e[a]),
      (c = s.box),
      c.update(s.width || t.w, s.height || t.h, Xi(s.horizontal, t)));
    let { same: o, other: d } = Ji(t, n, s, r);
    ((l |= o && i.length), (u = u || d), c.fullSize || i.push(s));
  }
  return (l && Zi(i, t, n, r)) || u;
}
function Qi(e, t, n, r, i) {
  ((e.top = n),
    (e.left = t),
    (e.right = t + r),
    (e.bottom = n + i),
    (e.width = r),
    (e.height = i));
}
function $i(e, t, n, r) {
  let i = n.padding,
    { x: a, y: o } = t;
  for (let s of e) {
    let e = s.box,
      c = r[s.stack] || { count: 1, placed: 0, weight: 1 },
      l = s.stackWeight / c.weight || 1;
    if (s.horizontal) {
      let r = t.w * l,
        a = c.size || e.height;
      (Ne(c.start) && (o = c.start),
        e.fullSize
          ? Qi(e, i.left, o, n.outerWidth - i.right - i.left, a)
          : Qi(e, t.left + c.placed, o, r, a),
        (c.start = o),
        (c.placed += r),
        (o = e.bottom));
    } else {
      let r = t.h * l,
        o = c.size || e.width;
      (Ne(c.start) && (a = c.start),
        e.fullSize
          ? Qi(e, a, i.top, o, n.outerHeight - i.bottom - i.top)
          : Qi(e, a, t.top + c.placed, o, r),
        (c.start = a),
        (c.placed += r),
        (a = e.right));
    }
  }
  ((t.x = a), (t.y = o));
}
var Y = {
    addBox(e, t) {
      (e.boxes || (e.boxes = []),
        (t.fullSize = t.fullSize || !1),
        (t.position = t.position || `top`),
        (t.weight = t.weight || 0),
        (t._layers =
          t._layers ||
          function () {
            return [
              {
                z: 0,
                draw(e) {
                  t.draw(e);
                },
              },
            ];
          }),
        e.boxes.push(t));
    },
    removeBox(e, t) {
      let n = e.boxes ? e.boxes.indexOf(t) : -1;
      n !== -1 && e.boxes.splice(n, 1);
    },
    configure(e, t, n) {
      ((t.fullSize = n.fullSize),
        (t.position = n.position),
        (t.weight = n.weight));
    },
    update(e, t, n, r) {
      if (!e) return;
      let i = K(e.options.layout.padding),
        a = Math.max(t - i.width, 0),
        o = Math.max(n - i.height, 0),
        s = Gi(e.boxes),
        c = s.vertical,
        l = s.horizontal;
      I(e.boxes, (e) => {
        typeof e.beforeLayout == `function` && e.beforeLayout();
      });
      let u =
          c.reduce(
            (e, t) =>
              t.box.options && t.box.options.display === !1 ? e : e + 1,
            0,
          ) || 1,
        d = Object.freeze({
          outerWidth: t,
          outerHeight: n,
          padding: i,
          availableWidth: a,
          availableHeight: o,
          vBoxMaxWidth: a / 2 / u,
          hBoxMaxHeight: o / 2,
        }),
        f = Object.assign({}, i);
      qi(f, K(r));
      let p = Object.assign(
          { maxPadding: f, w: a, h: o, x: i.left, y: i.top },
          i,
        ),
        m = Wi(c.concat(l), d);
      (Zi(s.fullSize, p, d, m),
        Zi(c, p, d, m),
        Zi(l, p, d, m) && Zi(c, p, d, m),
        Yi(p),
        $i(s.leftAndTop, p, d, m),
        (p.x += p.w),
        (p.y += p.h),
        $i(s.rightAndBottom, p, d, m),
        (e.chartArea = {
          left: p.left,
          top: p.top,
          right: p.left + p.w,
          bottom: p.top + p.h,
          height: p.h,
          width: p.w,
        }),
        I(s.chartArea, (t) => {
          let n = t.box;
          (Object.assign(n, e.chartArea),
            n.update(p.w, p.h, { left: 0, top: 0, right: 0, bottom: 0 }));
        }));
    },
  },
  ea = class {
    acquireContext(e, t) {}
    releaseContext(e) {
      return !1;
    }
    addEventListener(e, t, n) {}
    removeEventListener(e, t, n) {}
    getDevicePixelRatio() {
      return 1;
    }
    getMaximumSize(e, t, n, r) {
      return (
        (t = Math.max(0, t || e.width)),
        (n = n || e.height),
        { width: t, height: Math.max(0, r ? Math.floor(t / r) : n) }
      );
    }
    isAttached(e) {
      return !0;
    }
    updateConfig(e) {}
  },
  ta = class extends ea {
    acquireContext(e) {
      return (e && e.getContext && e.getContext(`2d`)) || null;
    }
    updateConfig(e) {
      e.options.animation = !1;
    }
  },
  na = `$chartjs`,
  ra = {
    touchstart: `mousedown`,
    touchmove: `mousemove`,
    touchend: `mouseup`,
    pointerenter: `mouseenter`,
    pointerdown: `mousedown`,
    pointermove: `mousemove`,
    pointerup: `mouseup`,
    pointerleave: `mouseout`,
    pointerout: `mouseout`,
  },
  ia = (e) => e === null || e === ``;
function aa(e, t) {
  let n = e.style,
    r = e.getAttribute(`height`),
    i = e.getAttribute(`width`);
  if (
    ((e[na] = {
      initial: {
        height: r,
        width: i,
        style: { display: n.display, height: n.height, width: n.width },
      },
    }),
    (n.display = n.display || `block`),
    (n.boxSizing = n.boxSizing || `border-box`),
    ia(i))
  ) {
    let t = or(e, `width`);
    t !== void 0 && (e.width = t);
  }
  if (ia(r))
    if (e.style.height === ``) e.height = e.width / (t || 2);
    else {
      let t = or(e, `height`);
      t !== void 0 && (e.height = t);
    }
  return e;
}
var oa = ar ? { passive: !0 } : !1;
function sa(e, t, n) {
  e && e.addEventListener(t, n, oa);
}
function ca(e, t, n) {
  e && e.canvas && e.canvas.removeEventListener(t, n, oa);
}
