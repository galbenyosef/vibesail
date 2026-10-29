// Game 16 — getdocks
// Lines 6569-6576 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
(Xe(Oi, `showGrid`, !1),
  (Oi.prototype.getDocks = function () {
    try {
      return this.islandGenerator?.getDocks?.() || [];
    } catch {
      return [];
    }
  }));
