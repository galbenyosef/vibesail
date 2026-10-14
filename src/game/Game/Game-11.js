// Game 11 — getdocks
// Lines 5321-5328 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
(He(WorldBuilder, `showGrid`, !1),
  (WorldBuilder.prototype.getDocks = function () {
    try {
      return this.islandGenerator?.getDocks?.() || [];
    } catch {
      return [];
    }
  }));
