// Game 25 — boat
// Lines 9559-9907 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
function za(e) {
  let t = Number(e);
  return Number.isFinite(t) ? Math.round(t / GameUi) : 0;
}
var Ba = class {
  constructor(e, t) {
    ((this.scene = e),
      (this.world = t),
      (this.ghosts = []),
      (this._visualOptions = {
        opacityOverride: null,
        opacityResolver: null,
        fadeInEnabled: !0,
        useNormalBoatColors: !1,
        hideFinishedBoats: !1,
        rankMarkersEnabled: !0,
      }));
  }
  getRankColors(e = 0) {
    return e === 0
      ? {
          hull: 16766720,
          deck: 14329120,
          sail: 16775388,
          jib: 16775885,
          labelColor: `#FFFFFF`,
          opacity: 0.5,
        }
      : e === 1
        ? {
            hull: 12632256,
            deck: 11053224,
            sail: 15263976,
            jib: 15790320,
            labelColor: `#FFFFFF`,
            opacity: 0.45,
          }
        : e === 2
          ? {
              hull: 14708768,
              deck: 13395490,
              sail: 16764057,
              jib: 16768460,
              labelColor: `#FFFFFF`,
              opacity: 0.4,
            }
          : {
              hull: 8965375,
              deck: 11184810,
              sail: 13426158,
              jib: 14544639,
              labelColor: `#FFFFFF`,
              opacity: 0.3,
            };
  }
  getGhostVisualOptions() {
    return { ...this._visualOptions };
  }
  setGhostVisualOptions(e = {}) {
    let t = { ...this._visualOptions };
    if (Object.prototype.hasOwnProperty.call(e, `opacityOverride`)) {
      let n = e.opacityOverride;
      if (n == null || n === ``) t.opacityOverride = null;
      else {
        let e = Number(n);
        Number.isFinite(e) && (t.opacityOverride = Math.min(1, Math.max(0, e)));
      }
    }
    (Object.prototype.hasOwnProperty.call(e, `opacityResolver`) &&
      (t.opacityResolver =
        typeof e.opacityResolver == `function` ? e.opacityResolver : null),
      Object.prototype.hasOwnProperty.call(e, `fadeInEnabled`) &&
        (t.fadeInEnabled = !!e.fadeInEnabled),
      Object.prototype.hasOwnProperty.call(e, `useNormalBoatColors`) &&
        (t.useNormalBoatColors = !!e.useNormalBoatColors),
      Object.prototype.hasOwnProperty.call(e, `hideFinishedBoats`) &&
        (t.hideFinishedBoats = !!e.hideFinishedBoats),
      Object.prototype.hasOwnProperty.call(e, `rankMarkersEnabled`) &&
        (t.rankMarkersEnabled = !!e.rankMarkersEnabled),
      (this._visualOptions = t),
      this._syncLoadedGhostOpacity());
  }
  _getTargetOpacity(e = null) {
    if (typeof this._visualOptions.opacityResolver == `function`) {
      let t = this._visualOptions.opacityResolver(e),
        n = Number(t);
      if (t != null && Number.isFinite(n)) return Math.min(1, Math.max(0, n));
    }
    if (Number.isFinite(this._visualOptions.opacityOverride))
      return this._visualOptions.opacityOverride;
    let t = Math.max(1, Number(e?.rank || 1));
    return this.getRankColors(t - 1).opacity;
  }
  _buildGhostAppearanceOverride(e) {
    return this._visualOptions.useNormalBoatColors
      ? {}
      : {
          appearance: {
            hull: { tint: e.hull },
            mast: { color: e.hull },
            boom: { color: e.hull },
            sails: {
              main: { color: e.sail, text: `` },
              jib: { color: e.jib, text: `` },
            },
          },
        };
  }
  _syncLoadedGhostOpacity() {
    this.ghosts.forEach((e) => {
      e?.boat?.model?.setOpacity &&
        e.boat.model.setOpacity(this._getTargetOpacity(e));
    });
  }
  _setGhostVisibility(e, t) {
    let n = !!t;
    (e?.boat?.model?.boatGroup && (e.boat.model.boatGroup.visible = n),
      e?.label && (e.label.visible = n));
  }
  _resolveGhostBoatIdentity(e = null) {
    return Kt(e?.boatIdentity, Ut());
  }
  _buildGhostBoat(e, t, n = null) {
    let r = this._resolveGhostBoatIdentity(n),
      i = r.presetId || Ut(),
      a = r.variantId || null,
      o = {
        ...(a ? { hull: { modelVariant: a } } : {}),
        ...this._buildGhostAppearanceOverride(t),
      };
    try {
      let t = Gt(
        i,
        { flagCode: e.country || null, isRemoteBoat: !0, isGhost: !0 },
        o,
      );
      return new xt(this.scene, this.world, t);
    } catch (e) {
      console.warn(
        `[GhostManager] Failed to build ghost boat "${i}"${a ? ` variant "${a}"` : ``}. Falling back to default preset.`,
        e,
      );
    }
    let s = Gt(
      Ut(),
      { flagCode: e.country || null, isRemoteBoat: !0, isGhost: !0 },
      this._buildGhostAppearanceOverride(t),
    );
    return new xt(this.scene, this.world, s);
  }
  loadGhosts(e) {
    if ((this.clearGhosts(), !e || !Array.isArray(e))) return;
    console.debug(`Starting to load ${e.length} ghosts...`);
    let t = performance.now();
    for (let t = 0; t < e.length; t++) {
      let n = e[t];
      if (!n.ghost_data) continue;
      let r, i;
      try {
        let e = Ht(n.ghost_data, n.ghost_version);
        ((r = e.frames), (i = e.metadata || null));
      } catch (e) {
        console.warn(`Failed to parse ghost data`, e);
        continue;
      }
      if (!Array.isArray(r) || r.length === 0) continue;
      let a = this.getRankColors(t),
        o = this._buildGhostBoat(n, a, i),
        s = t + 1;
      if (o.model && o.model.setOpacity) {
        let e = this._visualOptions.fadeInEnabled
          ? 0
          : this._getTargetOpacity({ rank: s });
        o.model.setOpacity(e);
      }
      let c = n.player_name || `Ghost`,
        l = this.createNameLabel(c, s, a.labelColor);
      (this.scene.add(l),
        this.ghosts.push({
          boat: o,
          data: r,
          currentIndex: 0,
          playerName: c,
          rank: s,
          metadata: i || null,
          label: l,
          finished: !1,
        }));
    }
    (this.positionAtStart(),
      console.info(
        `Loaded ${this.ghosts.length} ghosts in ${(performance.now() - t).toFixed(1)}ms`,
      ));
  }
  positionAtStart() {
    this.ghosts.forEach((e) => {
      e.data &&
        e.data.length > 0 &&
        (this.applyState(e.boat, e.data[0]),
        e.boat.update(0),
        this._setGhostVisibility(e, !0),
        yt(e.label, e.boat));
    });
  }
  _ghostCursor(e, t, n) {
    let r = e?.metadata?.sim?.sampleTicks;
    return Number.isInteger(n) &&
      Array.isArray(r) &&
      r.length === e?.data?.length
      ? { useTicks: !0, cursor: n, valueAt: (e, t) => Number(r[t]) }
      : { useTicks: !1, cursor: t, valueAt: (e) => Number(e?.[0]) };
  }
  update(e, t = null) {
    this.ghosts.length !== 0 &&
      this.ghosts.forEach((n) => {
        let r = n.data,
          i = this._ghostCursor(n, e, t),
          a = i.cursor,
          o = Array.isArray(r) && r.length > 0 ? r[r.length - 1] : null,
          s = i.valueAt(o, r.length - 1);
        if (
          (n.finished &&
            Number.isFinite(s) &&
            a < s &&
            ((n.finished = !1), (n.currentIndex = 0)),
          n.finished)
        ) {
          this._setGhostVisibility(n, !this._visualOptions.hideFinishedBoats);
          return;
        }
        let c = n.currentIndex;
        for (
          c > 0 && i.valueAt(r[c], c) > a && (c = 0);
          c < r.length - 1 && i.valueAt(r[c + 1], c + 1) < a;
        )
          c++;
        if (((n.currentIndex = c), c >= r.length - 1)) {
          ((n.finished = !0),
            this.applyState(n.boat, r[r.length - 1]),
            this._setGhostVisibility(
              n,
              !this._visualOptions.hideFinishedBoats,
            ));
          return;
        }
        this._setGhostVisibility(n, !0);
        let l = r[c],
          u = r[c + 1],
          d = i.valueAt(l, c),
          f = i.valueAt(u, c + 1);
        if (f <= d) {
          this.applyState(n.boat, l);
          return;
        }
        let p = Math.min(1, Math.max(0, (a - d) / (f - d)));
        (this.interpolateAndApply(n.boat, l, u, p), n.boat.update(0));
        let m = i.valueAt(r[0], 0),
          h = i.useTicks ? (a - m) / 60 : a - m,
          g = this._getTargetOpacity(n);
        if (
          this._visualOptions.fadeInEnabled &&
          h < 3 &&
          n.boat.model &&
          n.boat.model.setOpacity
        ) {
          let e = Math.max(0, h / 3);
          n.boat.model.setOpacity(g * e);
        } else
          n.boat.model && n.boat.model.setOpacity && n.boat.model.setOpacity(g);
        yt(n.label, n.boat);
      });
  }
  sampleSurfaceY(e, t) {
    let n =
      typeof this.world?.getHeightAt == `function`
        ? this.world.getHeightAt
        : null;
    if (n) {
      let r = n.call(this.world, e, t);
      if (Number.isFinite(r)) return r;
    }
    let r =
      typeof this.world?.water?.getHeightAt == `function`
        ? this.world.water.getHeightAt
        : null;
    if (r) {
      let n = r.call(this.world.water, e, t);
      if (Number.isFinite(n)) return n;
    }
    return 0;
  }
  applyState(e, t) {
    let n = St.fromArray(t),
      r = this.sampleSurfaceY(n.position.x, n.position.z);
    (e.setPosition(n.position.x, r, n.position.z),
      e.setRotation(0, n.rotation, 0),
      e.setSailAngle(n.sailAngle),
      e.setHeelAngle(n.heelAngle),
      e.dynamics &&
        (n.rudderAngle !== void 0 && (e.dynamics.rudderAngle = n.rudderAngle),
        n.sheetLimit !== void 0 && (e.dynamics.sheetLimit = n.sheetLimit)));
  }
  interpolateAndApply(e, t, n, r) {
    let i = St.fromArray(t),
      a = St.fromArray(n),
      o = i.position.x + (a.position.x - i.position.x) * r,
      s = i.position.z + (a.position.z - i.position.z) * r,
      c = this.sampleSurfaceY(o, s);
    e.setPosition(o, c, s);
    let l = a.rotation - i.rotation;
    (l > Math.PI && (l -= Math.PI * 2), l < -Math.PI && (l += Math.PI * 2));
    let u = i.rotation + l * r;
    e.setRotation(0, u, 0);
    let d = i.sailAngle + (a.sailAngle - i.sailAngle) * r;
    e.setSailAngle(d);
    let f = i.heelAngle + (a.heelAngle - i.heelAngle) * r;
    (e.setHeelAngle(f),
      e.dynamics &&
        (i.rudderAngle !== void 0 &&
          a.rudderAngle !== void 0 &&
          (e.dynamics.rudderAngle =
            i.rudderAngle + (a.rudderAngle - i.rudderAngle) * r),
        i.sheetLimit !== void 0 &&
          a.sheetLimit !== void 0 &&
          (e.dynamics.sheetLimit =
            i.sheetLimit + (a.sheetLimit - i.sheetLimit) * r)));
  }
  resetPlayback() {
    (this.ghosts.forEach((e) => {
      ((e.currentIndex = 0), (e.finished = !1));
    }),
      this.positionAtStart());
  }
  clearGhosts() {
    (this.ghosts.forEach((e) => {
      (e.boat && e.boat.dispose(), wt(e.label, this.scene));
    }),
      (this.ghosts = []));
  }
  buildLabelText(e, t, n = 200, r = ``) {
    return vt(e || `Ghost`, t, n, r);
  }
  createNameLabel(e, t, n) {
    let r = Number(t),
      i = Number.isFinite(r) && r > 0 ? Math.floor(r) : 1,
      a = this._visualOptions.rankMarkersEnabled ? `#${i}` : ``;
    return Ct({ name: e || `Ghost`, prefix: a, color: n || `#ffffff` });
  }
};
