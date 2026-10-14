// assets__auto-CBo2XcXh 28 — width
// Lines 9714-9897 of readable/assets__auto-CBo2XcXh.pretty.js (statement-aligned).
function Ec(e, t) {
  let n = e.chart.ctx,
    { body: r, footer: i, title: a } = e,
    { boxWidth: o, boxHeight: s } = t,
    c = q(t.bodyFont),
    l = q(t.titleFont),
    u = q(t.footerFont),
    d = a.length,
    f = i.length,
    p = r.length,
    m = K(t.padding),
    h = m.height,
    g = 0,
    _ = r.reduce(
      (e, t) => e + t.before.length + t.lines.length + t.after.length,
      0,
    );
  if (
    ((_ += e.beforeBody.length + e.afterBody.length),
    d &&
      (h += d * l.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom),
    _)
  ) {
    let e = t.displayColors ? Math.max(s, c.lineHeight) : c.lineHeight;
    h += p * e + (_ - p) * c.lineHeight + (_ - 1) * t.bodySpacing;
  }
  f && (h += t.footerMarginTop + f * u.lineHeight + (f - 1) * t.footerSpacing);
  let v = 0,
    y = function (e) {
      g = Math.max(g, n.measureText(e).width + v);
    };
  return (
    n.save(),
    (n.font = l.string),
    I(e.title, y),
    (n.font = c.string),
    I(e.beforeBody.concat(e.afterBody), y),
    (v = t.displayColors ? o + 2 + t.boxPadding : 0),
    I(r, (e) => {
      (I(e.before, y), I(e.lines, y), I(e.after, y));
    }),
    (v = 0),
    (n.font = u.string),
    I(e.footer, y),
    n.restore(),
    (g += m.width),
    { width: g, height: h }
  );
}
function Dc(e, t) {
  let { y: n, height: r } = t;
  return n < r / 2 ? `top` : n > e.height - r / 2 ? `bottom` : `center`;
}
function Oc(e, t, n, r) {
  let { x: i, width: a } = r,
    o = n.caretSize + n.caretPadding;
  if ((e === `left` && i + a + o > t.width) || (e === `right` && i - a - o < 0))
    return !0;
}
function kc(e, t, n, r) {
  let { x: i, width: a } = n,
    {
      width: o,
      chartArea: { left: s, right: c },
    } = e,
    l = `center`;
  return (
    r === `center`
      ? (l = i <= (s + c) / 2 ? `left` : `right`)
      : i <= a / 2
        ? (l = `left`)
        : i >= o - a / 2 && (l = `right`),
    Oc(l, e, t, n) && (l = `center`),
    l
  );
}
function Ac(e, t, n) {
  let r = n.yAlign || t.yAlign || Dc(e, n);
  return { xAlign: n.xAlign || t.xAlign || kc(e, t, n, r), yAlign: r };
}
function jc(e, t) {
  let { x: n, width: r } = e;
  return (t === `right` ? (n -= r) : t === `center` && (n -= r / 2), n);
}
function Mc(e, t, n) {
  let { y: r, height: i } = e;
  return (
    t === `top` ? (r += n) : t === `bottom` ? (r -= i + n) : (r -= i / 2),
    r
  );
}
function Nc(e, t, n, r) {
  let { caretSize: i, caretPadding: a, cornerRadius: o } = e,
    { xAlign: s, yAlign: c } = n,
    l = i + a,
    { topLeft: u, topRight: d, bottomLeft: f, bottomRight: p } = dn(o),
    m = jc(t, s),
    h = Mc(t, c, l);
  return (
    c === `center`
      ? s === `left`
        ? (m += l)
        : s === `right` && (m -= l)
      : s === `left`
        ? (m -= Math.max(u, f) + i)
        : s === `right` && (m += Math.max(d, p) + i),
    { x: U(m, 0, r.width - t.width), y: U(h, 0, r.height - t.height) }
  );
}
function Pc(e, t, n) {
  let r = K(n.padding);
  return t === `center`
    ? e.x + e.width / 2
    : t === `right`
      ? e.x + e.width - r.right
      : e.x + r.left;
}
function Fc(e) {
  return Cc([], wc(e));
}
function Ic(e, t, n) {
  return mn(e, { tooltip: t, tooltipItems: n, type: `tooltip` });
}
function Lc(e, t) {
  let n = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
  return n ? e.override(n) : e;
}
var Rc = {
  beforeTitle: _e,
  title(e) {
    if (e.length > 0) {
      let t = e[0],
        n = t.chart.data.labels,
        r = n ? n.length : 0;
      if (this && this.options && this.options.mode === `dataset`)
        return t.dataset.label || ``;
      if (t.label) return t.label;
      if (r > 0 && t.dataIndex < r) return n[t.dataIndex];
    }
    return ``;
  },
  afterTitle: _e,
  beforeBody: _e,
  beforeLabel: _e,
  label(e) {
    if (this && this.options && this.options.mode === `dataset`)
      return e.label + `: ` + e.formattedValue || e.formattedValue;
    let t = e.dataset.label || ``;
    t && (t += `: `);
    let n = e.formattedValue;
    return (k(n) || (t += n), t);
  },
  labelColor(e) {
    let t = e.chart
      .getDatasetMeta(e.datasetIndex)
      .controller.getStyle(e.dataIndex);
    return {
      borderColor: t.borderColor,
      backgroundColor: t.backgroundColor,
      borderWidth: t.borderWidth,
      borderDash: t.borderDash,
      borderDashOffset: t.borderDashOffset,
      borderRadius: 0,
    };
  },
  labelTextColor() {
    return this.options.bodyColor;
  },
  labelPointStyle(e) {
    let t = e.chart
      .getDatasetMeta(e.datasetIndex)
      .controller.getStyle(e.dataIndex);
    return { pointStyle: t.pointStyle, rotation: t.rotation };
  },
  afterLabel: _e,
  afterBody: _e,
  beforeFooter: _e,
  footer: _e,
  afterFooter: _e,
};
function Q(e, t, n, r) {
  let i = e[t].call(n, r);
  return i === void 0 ? Rc[t].call(n, r) : i;
}
