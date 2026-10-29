import { g as e } from "./routeContext-D1HYUwP9.js";
import { $t as t } from "./three.module-CUNolavI.js";
var n = new Map();
function r(r, { configure: i } = {}) {
  let a = e(r);
  if (!n.has(a)) {
    let e = new t(),
      r = new Promise((t, r) => {
        e.load(a, t, void 0, (e) => {
          (n.delete(a), r(e));
        });
      });
    n.set(a, r);
  }
  return n.get(a).then((e) => (typeof i == `function` && i(e), e));
}
export { r as t };
