// SharedTextureLoader 01 — configure
// Lines 1-16 of readable/assets/SharedTextureLoader-BkelxMVX.pretty.js (statement-aligned).
import { g as e } from "./routeContext-D1HYUwP9.js";
import { Xt as t } from "./three.module-BgyKfsEV.js";
var textureCache = new Map();
function r(r, { configure: i } = {}) {
  let a = e(r);
  if (!textureCache.has(a)) {
    let e = new t(),
      r = new Promise((t, r) => {
        e.load(a, t, void 0, (e) => {
          (textureCache.delete(a), r(e));
        });
      });
    textureCache.set(a, r);
  }
  return textureCache.get(a).then((e) => (typeof i == `function` && i(e), e));
}
