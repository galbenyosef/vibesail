// LogisticsManager 02 — state
// Lines 267-763 of readable/assets/LogisticsManager-DugCgbD8.pretty.js (statement-aligned).
var y = class {
  constructor(e, t, r = {}) {
    ((this.scene = e),
      (this.world = t),
      (this.options = r),
      (this._tmpDockCenter = new n()),
      (this.state = {
        docking: {
          insideDockingZone: !1,
          canDock: !1,
          locked: !1,
          nearestDistance: 1 / 0,
          nearestCenter: new n(),
        },
        mission: { activeMission: null, targetPosition: null },
        balance: 0,
      }),
      (this._storageKey = `sail_balance_v2`),
      this._loadBalance(),
      (this.targetColumn = null),
      (this.listeners = {
        "docking:changed": [],
        "mission:changed": [],
        "mission:progress": [],
        "mission:completed": [],
        "mission:aborted": [],
        "mission:payload_dropped": [],
        "balance:changed": [],
      }),
      (this._missionRuntime = null),
      (this._lastDockingEmit = {
        inside: null,
        canDock: null,
        locked: null,
        isDocked: null,
      }),
      this._emit(`balance:changed`, this.state.balance));
    let i =
      typeof this.world?.getHeightAt == `function`
        ? (e, t) => this.world.getHeightAt(e, t)
        : this.world?.water && typeof this.world.water.getHeightAt == `function`
          ? (e, t) => this.world.water.getHeightAt(e, t)
          : null;
    ((this.navigationPath = new a(this.scene, {
      color: 65450,
      opacity: 0.8,
      surfaceHeightSampler: i,
    })),
      (this.missionGenerator = new p(this.world, {
        seed: r.missionSeed ?? v(),
        missionsPerDock: 3,
        excludeSameIsland: !0,
      })));
  }
  update(e, t) {
    if (!e) return;
    let n = e.getPosition(),
      i = (e.isDocked && e.isDocked()) || !1;
    if (this.state.mission.activeMission && this.state.mission.targetPosition) {
      let e = this.state.mission.targetPosition;
      (this.navigationPath.setVisible(!0),
        this.navigationPath.update(n, e, t || 0.016));
    } else this.navigationPath.setVisible(!1);
    (this._updateDockingState(e, n),
      this._updateMissionRuntime(e, n, t || 0.016),
      this._checkMissionCompletion(e, n, i),
      this._updateDockingCircleVisibility(n),
      this._emitDockingChangedIfNeeded(i));
    let a = this.state.mission.activeMission,
      o = this.state.mission.targetPosition;
    if (a && o) {
      let t = this._computeDistanceMeters(n, o),
        i = this._resolveMissionPayload(a),
        s = Number(e?.getHeelAngle?.()) || 0,
        c = Math.abs(s);
      this._emit(`mission:progress`, {
        distanceMeters: t,
        reward: Number(a.reward) || 0,
        finalReward: this._resolveMissionReward(a),
        contractType: a.contractType || null,
        contractLabel: a.contractLabel || null,
        payload: i,
        payloadDropped: this._missionRuntime?.payloadDropped === !0,
        heelDegrees: r.radToDeg(c),
        heelSignedDegrees: r.radToDeg(s),
        heelThresholdDegrees: i?.heelDropDegrees ?? g,
        overHeelSeconds: this._missionRuntime?.overHeelSeconds || 0,
        heelDropSeconds: i?.heelDropSeconds ?? _,
        elapsedSeconds: this._missionRuntime?.elapsedSeconds || 0,
        targetPosition: { ...o },
      });
    }
  }
  _updateDockingState(e, t = e?.getPosition?.()) {
    let n = i?.docking?.DOCKING_RADIUS ?? 30,
      r = !1,
      a = 1 / 0,
      o = this.world?.getDocks?.() || [];
    if (Array.isArray(o) && o.length > 0)
      for (let e of o) {
        let i = e?.dockingCircle;
        if (!i || typeof i.getWorldPosition != `function`) continue;
        i.getWorldPosition(this._tmpDockCenter);
        let o = (this._tmpDockCenter.x || 0) - t.x,
          s = (this._tmpDockCenter.z || 0) - t.z,
          c = Math.sqrt(o * o + s * s);
        (c < a &&
          ((a = c), this.state.docking.nearestCenter.copy(this._tmpDockCenter)),
          c <= n && (r = !0));
      }
    else
      this.scene?.traverse &&
        (this.scene.traverse((e) => {
          if (
            e?.userData?.kind !== `dock_docking_circle` ||
            typeof e.getWorldPosition != `function`
          )
            return;
          e.getWorldPosition(this._tmpDockCenter);
          let i = (this._tmpDockCenter.x || 0) - t.x,
            o = (this._tmpDockCenter.z || 0) - t.z,
            s = Math.sqrt(i * i + o * o);
          (s < a &&
            ((a = s),
            this.state.docking.nearestCenter.copy(this._tmpDockCenter)),
            s <= n && (r = !0));
        }),
        Number.isFinite(a) || (a = 1 / 0));
    ((this.state.docking.insideDockingZone = r),
      (this.state.docking.nearestDistance = a));
    let s = e.getSpeedInKnots(),
      c = i?.docking?.minSpeedToDock ?? 3;
    ((this.state.docking.locked = !!e.competitiveRestrictionsActive),
      (this.state.docking.canDock = !this.state.docking.locked && r && s < c));
  }
  _emitDockingChangedIfNeeded(e) {
    let t = { ...this.getDockingStatus(), isDocked: !!e };
    (t.inside === this._lastDockingEmit.inside &&
      t.canDock === this._lastDockingEmit.canDock &&
      t.locked === this._lastDockingEmit.locked &&
      t.isDocked === this._lastDockingEmit.isDocked) ||
      ((this._lastDockingEmit = {
        inside: t.inside,
        canDock: t.canDock,
        locked: t.locked,
        isDocked: t.isDocked,
      }),
      this._emit(`docking:changed`, t));
  }
  _updateDockingCircleVisibility(e) {
    let t = this.world?.getDocks?.() || [];
    if (!e || t.length === 0) return;
    let r = i?.docking?.debugCircleFadeMaxDistance ?? 100,
      a = new n();
    for (let n of t) {
      let t = n?.dockingCircle;
      if (!t || !t.getWorldPosition) continue;
      t.getWorldPosition(a);
      let i = (a.x || 0) - e.x,
        o = (a.z || 0) - e.z,
        s = Math.sqrt(i * i + o * o),
        c = t.material,
        l = t.userData?.baseOpacity || 0.8;
      if (!c || typeof c.opacity != `number`) continue;
      let u = 1 - Math.min(1, Math.max(0, s / r));
      ((t.visible = u > 0), (c.opacity = l * u));
    }
  }
  getDockingStatus() {
    return {
      inside: this.state.docking.insideDockingZone,
      canDock: this.state.docking.canDock,
      locked: this.state.docking.locked,
      nearestDistance: this.state.docking.nearestDistance,
    };
  }
  setActiveMission(e, t = {}) {
    let n = this.state.mission.activeMission;
    ((this.state.mission.activeMission = e || null),
      (this._missionRuntime = e ? this._createMissionRuntime(e) : null),
      e
        ? this._syncBoatPayloadVisual(e)
        : (this.clearTarget(),
          t.preserveDroppedCargo !== !0 && this._clearBoatPayloadVisual()),
      this._emit(`mission:changed`, {
        previous: n,
        current: this.state.mission.activeMission,
      }));
  }
  getActiveMission() {
    return this.state.mission.activeMission;
  }
  getTargetPosition() {
    let e = this.state.mission.targetPosition;
    return e ? { x: e.x, y: e.y, z: e.z } : null;
  }
  clearMission(e = `aborted`, t = {}) {
    let n = t.mission || this.state.mission.activeMission || null,
      r =
        t.payloadDropped === !0 || this._missionRuntime?.payloadDropped === !0;
    (this.setActiveMission(null, {
      preserveDroppedCargo: t.preserveDroppedCargo === !0,
    }),
      this._emit(`mission:aborted`, {
        reason: e || `aborted`,
        mission: n,
        payload: t.payload || null,
        dropPosition: t.dropPosition || null,
        payloadDropped: r,
      }));
  }
  getBalance() {
    return this.state.balance;
  }
  addReward(e) {
    let t = Math.max(0, Number(e) || 0);
    return (
      (this.state.balance += t),
      this._persistBalance(),
      this._emit(`balance:changed`, this.state.balance),
      t
    );
  }
  spend(e) {
    let t = Math.max(0, Number(e) || 0);
    return t <= 0 || this.state.balance < t
      ? !1
      : ((this.state.balance -= t),
        this._persistBalance(),
        this._emit(`balance:changed`, this.state.balance),
        !0);
  }
  refund(e) {
    let t = Math.max(0, Number(e) || 0);
    return t <= 0
      ? 0
      : ((this.state.balance += t),
        this._persistBalance(),
        this._emit(`balance:changed`, this.state.balance),
        t);
  }
  _loadBalance() {
    let e = l.getWithTTL(this._storageKey),
      t = this._isDevMode();
    if (typeof e == `number` && e >= 0) {
      ((this.state.balance = t ? Math.max(e, h) : e), this._persistBalance());
      return;
    }
    try {
      ((this.state.balance = t ? h : 0), this._persistBalance());
    } catch {
      this.state.balance = 0;
    }
  }
  _persistBalance() {
    try {
      l.setWithTTL(this._storageKey, this.state.balance, m);
    } catch (e) {
      console.warn(`Failed to persist balance:`, e);
    }
  }
  _isDevMode() {
    return typeof this.options?.isDevMode == `boolean`
      ? this.options.isDevMode
      : t();
  }
  setTargetPosition(e) {
    ((this.state.mission.targetPosition = e
      ? { x: e.x, y: e.y, z: e.z }
      : null),
      this.targetColumn &&
        (this.state.mission.targetPosition
          ? this.targetColumn.createAt(this.state.mission.targetPosition)
          : this.targetColumn.dispose()),
      this._emit(`mission:changed`, {
        current: this.state.mission.activeMission,
        targetPosition: this.state.mission.targetPosition,
      }));
  }
  attachTargetColumn(e) {
    ((this.targetColumn = e),
      this.state.mission.targetPosition &&
        this.targetColumn &&
        this.targetColumn.createAt(this.state.mission.targetPosition));
  }
  clearTarget() {
    ((this.state.mission.targetPosition = null),
      this.targetColumn && this.targetColumn.dispose());
  }
  _createMissionRuntime(e) {
    return {
      missionId: e?.id || null,
      elapsedSeconds: 0,
      overHeelSeconds: 0,
      payloadDropped: !1,
    };
  }
  _resolveMissionPayload(e = this.state.mission.activeMission) {
    if (!e) return null;
    if (e.payload === !1) return { visible: !1 };
    let t =
      e.payload && typeof e.payload == `object` && !Array.isArray(e.payload)
        ? e.payload
        : {};
    return {
      visible: t.visible !== !1,
      kind: t.kind || e.contractType || `standard`,
      droppable: t.droppable === !0,
      heelDropDegrees: Number.isFinite(t.heelDropDegrees)
        ? t.heelDropDegrees
        : g,
      heelDropSeconds: Number.isFinite(t.heelDropSeconds)
        ? t.heelDropSeconds
        : _,
      abortsMission: t.abortsMission !== !1,
    };
  }
  _syncBoatPayloadVisual(e = this.state.mission.activeMission) {
    let t = this._getBoatReference(),
      n = this._resolveMissionPayload(e);
    if (!t || !n?.visible) {
      this._clearBoatPayloadVisual();
      return;
    }
    t.setCargoPayloadVisible?.(!0, {
      ...n,
      contractType: e?.contractType || null,
    });
  }
  _clearBoatPayloadVisual() {
    this._getBoatReference()?.clearCargoPayload?.();
  }
  _updateMissionRuntime(e, t, n) {
    let i = this.state.mission.activeMission;
    if (!i || !this._missionRuntime) return;
    let a = Math.max(0, Math.min(0.25, Number(n) || 0));
    this._missionRuntime.elapsedSeconds += a;
    let o = this._resolveMissionPayload(i);
    !o?.visible ||
      !o.droppable ||
      this._missionRuntime.payloadDropped ||
      (Math.abs(Number(e?.getHeelAngle?.()) || 0) >=
      r.degToRad(o.heelDropDegrees)
        ? (this._missionRuntime.overHeelSeconds += a)
        : (this._missionRuntime.overHeelSeconds = Math.max(
            0,
            this._missionRuntime.overHeelSeconds - a,
          )),
      this._missionRuntime.overHeelSeconds >= o.heelDropSeconds &&
        this._dropMissionPayload(e, t, i, o));
  }
  _dropMissionPayload(e, t, n, r) {
    if (!this._missionRuntime || this._missionRuntime.payloadDropped) return;
    ((this._missionRuntime.payloadDropped = !0),
      (this._missionRuntime.overHeelSeconds = 0));
    let i = t ? { x: t.x, y: t.y, z: t.z } : null;
    (e?.dropCargoPayload?.(i, { ...r, contractType: n?.contractType || null }),
      this._emit(`mission:payload_dropped`, {
        mission: n,
        payload: r,
        reward: 0,
        dropPosition: i,
        aborted: !0,
        reason: `payload_dropped`,
      }),
      this.clearMission(`payload_dropped`, {
        mission: n,
        payload: r,
        dropPosition: i,
        payloadDropped: !0,
        preserveDroppedCargo: !0,
      }));
  }
  _resolveMissionReward(e = this.state.mission.activeMission) {
    return Number(e?.reward) || 0;
  }
  _checkMissionCompletion(
    e,
    t = e?.getPosition?.(),
    n = e?.isDocked && e.isDocked(),
  ) {
    if (
      !this.state.mission.activeMission ||
      !this.state.mission.targetPosition ||
      !n
    )
      return;
    let r = this.state.mission.targetPosition;
    if (this._computeDistanceMeters(t, r) <= 30) {
      let e = this.state.mission.activeMission,
        t = this._resolveMissionReward(e);
      (console.log(
        `🎉 Mission completed! "${e.name}" - Reward: $${t} - New balance: $${this.state.balance + t}`,
      ),
        this.addReward(t),
        this._emit(`mission:completed`, {
          mission: e,
          reward: t,
          baseReward: Number(e.baseReward) || 0,
          payloadDropped: this._missionRuntime?.payloadDropped === !0,
        }),
        this.clearMission(`completed`),
        this.clearTarget());
    }
  }
  _computeDistanceMeters(e, t) {
    let n = (e?.x || 0) - (t?.x || 0),
      r = (e?.z || 0) - (t?.z || 0);
    return Math.sqrt(n * n + r * r);
  }
  getMissionsForDockNear(e) {
    try {
      return this.missionGenerator?.getMissionsForDockNear(e) || [];
    } catch {
      return [];
    }
  }
  chooseDeterministicDestination(e) {
    try {
      let t = this.getMissionsForDockNear(e),
        n = (t && t.length > 0 ? t[0] : null)?.targetPosition;
      return n ? { x: n.x, y: n.y, z: n.z } : null;
    } catch {
      return null;
    }
  }
  dockBoat(e) {
    if (!e) return !1;
    try {
      return e.setDockedMode(!0) !== !1;
    } catch (e) {
      return (console.warn(`Failed to dock boat:`, e), !1);
    }
  }
  undockBoat(e) {
    if (!e) return !1;
    try {
      return (e.setDockedMode(!1), !0);
    } catch (e) {
      return (console.warn(`Failed to undock boat:`, e), !1);
    }
  }
  requestDocking() {
    if (!this.state.docking.canDock)
      return (
        console.log(`Cannot dock - not in docking zone or speed too high`),
        !1
      );
    let e = this._getBoatReference();
    return e
      ? this.dockBoat(e)
      : (console.warn(`Cannot dock - no boat reference available`), !1);
  }
  requestUndocking() {
    let e = this._getBoatReference();
    return e
      ? !e.isDocked || !e.isDocked()
        ? (console.log(`Cannot undock - boat is not docked`), !1)
        : this.undockBoat(e)
      : (console.warn(`Cannot undock - no boat reference available`), !1);
  }
  setBoatReference(e) {
    ((this._boat = e),
      this.state.mission.activeMission &&
        this._missionRuntime?.payloadDropped !== !0 &&
        this._syncBoatPayloadVisual(this.state.mission.activeMission));
  }
  _getBoatReference() {
    return this._boat;
  }
  on(e, t) {
    (this.listeners[e] || (this.listeners[e] = []),
      typeof t == `function` && this.listeners[e].push(t));
  }
  off(e, t) {
    if (!this.listeners[e]) return;
    let n = this.listeners[e].indexOf(t);
    n > -1 && this.listeners[e].splice(n, 1);
  }
  _emit(e, t) {
    (this.listeners[e] || []).forEach((n) => {
      try {
        n(t);
      } catch (t) {
        console.warn(`Event handler error for '${e}':`, t);
      }
    });
  }
  dispose() {
    (this.clearTarget(),
      this.navigationPath && this.navigationPath.dispose(),
      (this.listeners = {}),
      this._onInputAction &&
        (s.removeActionListener(this._onInputAction),
        (this._onInputAction = null)));
  }
};
