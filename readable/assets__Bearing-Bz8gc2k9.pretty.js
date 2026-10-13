var e = 0.5,
  t = Object.freeze({
    windSpeed: 6,
    windDirection: -135,
    choppiness: 0.8,
    waveScale: 1,
  }),
  n = (e) => (e * 180) / Math.PI,
  r = (e) => (e * Math.PI) / 180,
  i = (e) => {
    let t = e % 360;
    return (t < 0 && (t += 360), t === 360 ? 0 : t);
  },
  a = (e, t) => i(n(Math.atan2(e, t))),
  o = (e) => a(e?.x || 0, e?.z || 0),
  s = (e, t) => i(t - e),
  c = (e, t) => {
    let n = i(t - e);
    return (n > 180 && (n -= 360), n);
  },
  l = (e) => i(o(e) + 180),
  u = (e) => i(360 - i(e));
export {
  c as a,
  l as c,
  s as i,
  t as l,
  u as n,
  r as o,
  i as r,
  a as s,
  o as t,
  e as u,
};
