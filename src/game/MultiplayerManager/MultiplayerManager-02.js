// MultiplayerManager 02 — math
// Lines 12-541 of readable/assets/MultiplayerManager-DyxhSkD5.pretty.js (statement-aligned).
var d = 4e3,
  SEND_FAILED_EVENT = `send_failed`,
  p = 2,
  m = class {
    constructor(e, t, n, r = {}) {
      ((this.scene = e),
        (this.world = t),
        (this.playerBoat = n),
        (this.boatPresetId = r.boatPresetId || null),
        (this.boatVariantId = r.boatVariantId || null),
        (this.resolvePlayerName =
          typeof r.resolvePlayerName == `function`
            ? r.resolvePlayerName
            : null),
        (this.socket = null),
        (this.remoteBoats = {}),
        (this.connected = !1),
        (this.flagCode = null),
        (this.lastUpdateTime = 0),
        (this.updateInterval = 0.33),
        (this.interpolationDelay = 0.05),
        (this.maxExtrapolationTime = 0.2),
        (this.smoothingFactor = 0.4),
        (this.positionLerpSpeed = 15),
        (this.rotationLerpSpeed = 10),
        (this.maxTurnRate = Math.PI * 0.8),
        (this.turnAcceleration = Math.PI * 2),
        (this.minTurnSpeed = Math.PI * 0.1),
        (this.teleportThreshold = 50),
        (this.staleBoatTimeout = 10),
        (this.disableInterpolation = !1),
        (this.interpolationDisableTime = 0),
        (this.interpolationDisableDuration = 1),
        (this.lastSentAppearanceKey = null));
    }
    connect(e) {
      if (this.socket) return;
      (console.info(`Connecting to multiplayer server: ${e}`),
        (this.serverUrl = e));
      let t = new WebSocket(e);
      ((this.socket = t),
        (t.onopen = (e) => this.handleOpen(e, t)),
        (t.onclose = (e) => this.handleClose(e, t)),
        (t.onerror = (e) => this.handleError(e, t)),
        (t.onmessage = (e) => this.handleMessage(e, t)));
    }
    handleOpen(e = null, t = this.socket) {
      t === this.socket &&
        (console.info(`Connected to multiplayer server`),
        (this.connected = !0),
        this.playerBoat &&
          !this.flagCode &&
          (this.flagCode = this.playerBoat.getFlagCode()),
        this.sendAppearanceUpdate(!0),
        this.sendBoatUpdate());
    }
    setBoatPresetId(e) {
      ((this.boatPresetId = e || null), this.sendAppearanceUpdate());
    }
    setBoatVariantId(e) {
      ((this.boatVariantId = e || null), this.sendAppearanceUpdate());
    }
    syncPlayerName() {
      this.sendAppearanceUpdate(!0);
    }
    _resolveLocalPlayerName() {
      if (typeof this.resolvePlayerName != `function`) return ``;
      try {
        return e(this.resolvePlayerName()) || ``;
      } catch {
        return ``;
      }
    }
    handleClose(e, t = this.socket) {
      t === this.socket &&
        (console.info(`Disconnected from server: ${e.code} ${e.reason}`),
        (this.connected = !1),
        (this.socket = null),
        this.removeAllRemoteBoats());
    }
    handleError(e, t = this.socket) {
      t === this.socket &&
        console.warn(
          `WebSocket connection failed. Continuing in single-player mode.`,
        );
    }
    handleMessage(e, t = this.socket) {
      if (t === this.socket)
        try {
          let t = JSON.parse(e.data);
          switch (t.type) {
            case `appearance_update`:
              this.handleAppearanceUpdate(t.client_id, t.appearance);
              break;
            case `boat_update`:
              this.handleBoatUpdate(t.client_id, t.boat_data);
              break;
            case `boat_disconnected`:
              this.handleBoatDisconnected(t.client_id);
              break;
            default:
              console.warn(`Unknown message type:`, t.type);
          }
        } catch (e) {
          console.error(`Error processing message:`, e);
        }
    }
    handleAppearanceUpdate(e, t) {
      let n = o.decodeAppearance(t);
      if (!this.remoteBoats[e]) {
        this.createRemoteBoat(e, n);
        return;
      }
      let r = this.remoteBoats[e],
        i = r.multiplayerBoatIdentity || { presetId: null, variantId: null };
      if (
        (n.boatPresetId && n.boatPresetId !== i.presetId) ||
        (n.boatVariantId && n.boatVariantId !== i.variantId)
      ) {
        (this.removeRemoteBoat(e), this.createRemoteBoat(e, n));
        return;
      }
      (this._syncRemoteBoatNameLabel(r, n.playerName),
        n.flagCode !== void 0 &&
          n.flagCode !== null &&
          (typeof r.getFlagCode == `function` ? r.getFlagCode() : null) !==
            n.flagCode &&
          r.setFlagCode(n.flagCode));
    }
    handleBoatUpdate(e, t) {
      let n = o.decodePosition(t);
      if (!n) {
        console.warn(`Received invalid boat update:`, t);
        return;
      }
      (this.remoteBoats[e] ||
        this.createRemoteBoat(e, {
          flagCode: null,
          boatPresetId: null,
          boatVariantId: null,
        }),
        this.updateRemoteBoat(e, n));
    }
    handleBoatDisconnected(e) {
      (console.info(`Boat disconnected: ${e}`), this.removeRemoteBoat(e));
    }
    createRemoteBoat(e, t) {
      console.debug(`Creating remote boat for client: ${e}`);
      let n = t.flagCode,
        r =
          n === `pirate`
            ? {
                appearance: {
                  sails: {
                    main: { color: 0, text: `` },
                    jib: { color: 0, text: `` },
                  },
                },
              }
            : {},
        a = t.boatPresetId || this.boatPresetId || l(),
        o = t.boatVariantId || null,
        s;
      try {
        s = u(
          a,
          { flagCode: n, isRemoteBoat: !0 },
          { ...(o ? { hull: { modelVariant: o } } : {}), ...r },
        );
      } catch (t) {
        console.warn(
          `[Multiplayer] Unknown boat preset "${a}" for remote boat ${e}.`,
          t,
        );
        return;
      }
      let c = new i(this.scene, this.world, s);
      ((c.model.boatGroup.visible = !1),
        c.model.setOpacity?.(0),
        (c.multiplayerSpawnFade = {
          startedAt: null,
          duration: p,
          complete: !1,
        }),
        (c.createdAt = performance.now() / 1e3),
        (this.remoteBoats[e] = c),
        (c.multiplayerBoatIdentity = { presetId: a, variantId: o }),
        (c.multiplayerClientId = e),
        this._syncRemoteBoatNameLabel(c, t.playerName),
        c.nameLabel && (c.nameLabel.visible = !1));
    }
    _syncRemoteBoatNameLabel(e, n) {
      if (!e) return;
      let i = t(n);
      e.multiplayerPlayerName !== i &&
        (s(e.nameLabel, this.scene),
        (e.nameLabel = null),
        (e.multiplayerPlayerName = i),
        i &&
          ((e.nameLabel = a({ name: i, color: `#ffffff` })),
          (e.nameLabel.visible = !!e.model?.boatGroup?.visible),
          this.scene?.add?.(e.nameLabel),
          r(e.nameLabel, e)));
    }
    _positionRemoteBoatLabel(e) {
      e?.nameLabel &&
        ((e.nameLabel.visible =
          !!e.model?.boatGroup?.visible && this.isRemoteBoatCollisionReady(e)),
        r(e.nameLabel, e));
    }
    _updateRemoteBoatSpawnFade(e, t) {
      let n = e?.multiplayerSpawnFade;
      if (!n || n.complete || !e.currentState || !e.targetState) return;
      Number.isFinite(n.startedAt) || (n.startedAt = t);
      let r = Math.max(0, n.duration || 0),
        i = r === 0 ? 1 : Math.min(1, Math.max(0, (t - n.startedAt) / r));
      (e.model?.setOpacity?.(i),
        i >= 1 && ((n.complete = !0), e.model?.setOpacity?.(1)));
    }
    isRemoteBoatCollisionReady(e) {
      let t = e?.multiplayerSpawnFade;
      return !t || t.complete === !0;
    }
    updateRemoteBoat(e, t) {
      let r = this.remoteBoats[e];
      if (!r) return;
      let i = performance.now() / 1e3,
        a = (e) => (typeof e == `number` ? e : (e?.y ?? 0)),
        o = (e) => e?.x ?? 0,
        s = (e) => (e?.z === void 0 ? (e?.y ?? 0) : e.z),
        c = a(t.rotation),
        l = o(t.position),
        u = s(t.position);
      if (
        (r.currentTurnRate || ((r.currentTurnRate = 0), (r.lastRotationY = c)),
        !r.lastState)
      ) {
        ((r.lastState = {
          position: new n(l, 0, u),
          rotation: new n(0, c, 0),
          sailAngle: t.sailAngle,
          heelAngle: t.heelAngle,
          timestamp: i,
          visualPressure: t.visualPressure || 0,
          visualLuffing: t.visualLuffing || 0,
        }),
          (r.currentState = {
            position: r.lastState.position.clone(),
            rotation: r.lastState.rotation.clone(),
            sailAngle: r.lastState.sailAngle,
            heelAngle: r.lastState.heelAngle,
            timestamp: i,
            visualPressure: r.lastState.visualPressure,
            visualLuffing: r.lastState.visualLuffing,
          }),
          (r.targetState = {
            position: r.lastState.position.clone(),
            rotation: r.lastState.rotation.clone(),
            sailAngle: r.lastState.sailAngle,
            heelAngle: r.lastState.heelAngle,
            timestamp: i,
            visualPressure: r.lastState.visualPressure,
            visualLuffing: r.lastState.visualLuffing,
          }),
          (r.velocity = new n()),
          (r.angularVelocity = new n()),
          r.setPosition(l, 0, u),
          r.setRotation(0, c, 0),
          (r.model.boatGroup.visible = !0),
          this._updateRemoteBoatSpawnFade(r, i),
          this._positionRemoteBoatLabel(r),
          (r.currentTurnRate = 0),
          (r.lastRotationY = c));
        return;
      }
      let d = r.targetState ? r.targetState.rotation.y : r.lastRotationY;
      ((r.lastState = r.currentState),
        (r.currentState = r.targetState),
        (r.targetState = {
          position: new n(l, 0, u),
          rotation: new n(0, c, 0),
          sailAngle: t.sailAngle,
          heelAngle: t.heelAngle,
          timestamp: i,
          visualPressure: t.visualPressure || 0,
          visualLuffing: t.visualLuffing || 0,
        }));
      let f = this.getShortestRotationDelta(d, c),
        p = i - r.lastState.timestamp;
      if (p > 0) {
        let e = f / p,
          t = this.turnAcceleration * p,
          n = e - r.currentTurnRate;
        ((r.currentTurnRate += Math.sign(n) * Math.min(Math.abs(n), t)),
          (r.currentTurnRate =
            Math.sign(r.currentTurnRate) *
            Math.min(Math.abs(r.currentTurnRate), this.maxTurnRate)));
      }
      r.lastRotationY = c;
      let m = i - r.lastState.timestamp;
      if (m > 0) {
        let e = new n()
          .subVectors(r.targetState.position, r.currentState.position)
          .divideScalar(m);
        r.velocity.lerp(e, 1 - this.smoothingFactor);
        let t = r.targetState.rotation.y - r.currentState.rotation.y,
          i;
        ((i =
          t > Math.PI
            ? (t - 2 * Math.PI) / m
            : t < -Math.PI
              ? (t + 2 * Math.PI) / m
              : t / m),
          (r.angularVelocity.y +=
            (i - r.angularVelocity.y) * (1 - this.smoothingFactor)));
      }
      ((r.targetSailAngle = t.sailAngle), (r.targetHeelAngle = t.heelAngle));
    }
    getShortestRotationDelta(e, t) {
      let n = t - e;
      for (; n > Math.PI;) n -= Math.PI * 2;
      for (; n < -Math.PI;) n += Math.PI * 2;
      return n;
    }
    removeRemoteBoat(e) {
      let t = this.remoteBoats[e];
      t &&
        (s(t.nameLabel, this.scene), t.dispose(), delete this.remoteBoats[e]);
    }
    removeAllRemoteBoats() {
      for (let e in this.remoteBoats) this.removeRemoteBoat(e);
    }
    sendBoatUpdate() {
      if (!this.connected || !this.playerBoat) return;
      let e = c.fromBoat(this.playerBoat);
      Number.isInteger(this.playerBoat.simTick) &&
        (e.tick = this.playerBoat.simTick);
      let t = o.encodePosition(e);
      this._sendSocketMessage({ t: `u`, d: t }, `boat update`);
    }
    setFlagCode(e) {
      ((this.flagCode = e),
        this.playerBoat && this.playerBoat.setFlagCode(e),
        this.connected && this.sendAppearanceUpdate());
    }
    sendAppearanceUpdate(e = !1) {
      if (!this.connected) return !1;
      let t = this._resolveLocalPlayerName(),
        n = `${this.flagCode || ``}:${this.boatPresetId || ``}:${this.boatVariantId || ``}:${t || ``}`;
      if (!e && n === this.lastSentAppearanceKey) return !1;
      let r = o.encodeAppearance(
          this.flagCode,
          this.boatPresetId,
          this.boatVariantId,
          t || null,
        ),
        i = this._sendSocketMessage({ t: `a`, d: r }, `appearance update`);
      return (i && (this.lastSentAppearanceKey = n), i);
    }
    _getWebSocketOpenState() {
      return typeof WebSocket < `u` && typeof WebSocket.OPEN == `number`
        ? WebSocket.OPEN
        : 1;
    }
    _canSendSocketMessage() {
      return !this.connected ||
        !this.socket ||
        typeof this.socket.send != `function`
        ? !1
        : this.socket.readyState === this._getWebSocketOpenState();
    }
    _sendSocketMessage(e, t = `message`) {
      if (!this._canSendSocketMessage()) return !1;
      try {
        return (this.socket.send(JSON.stringify(e)), !0);
      } catch (e) {
        let n = this.socket;
        if (
          ((this.connected = !1),
          (this.socket = null),
          this.removeAllRemoteBoats(),
          n && typeof n.close == `function`)
        )
          try {
            n.close(d, SEND_FAILED_EVENT);
          } catch {}
        return (
          console.warn(
            `[Multiplayer] Failed to send ${t}. Disabling live updates until reconnect.`,
            e,
          ),
          !1
        );
      }
    }
    temporarilyDisableInterpolation(e = 1) {
      ((this.disableInterpolation = !0),
        (this.interpolationDisableTime = performance.now() / 1e3),
        (this.interpolationDisableDuration = e));
    }
    noteSimTick(e) {
      ((this._sendClockOnSim = !0), this._accumulateSendClock(e));
    }
    _accumulateSendClock(e) {
      !this.connected ||
        !this.playerBoat ||
        ((this.lastUpdateTime += e),
        this.lastUpdateTime >= this.updateInterval &&
          (this.sendBoatUpdate(), (this.lastUpdateTime = 0)));
    }
    update(e) {
      if (!this.connected) return;
      let t = performance.now() / 1e3;
      (this.disableInterpolation &&
        t - this.interpolationDisableTime > this.interpolationDisableDuration &&
        (this.disableInterpolation = !1),
        this._sendClockOnSim || this._accumulateSendClock(e));
      for (let r in this.remoteBoats) {
        let i = this.remoteBoats[r];
        if (!i.targetState || !i.currentState) {
          i.createdAt &&
            t - i.createdAt > this.staleBoatTimeout &&
            this.removeRemoteBoat(r);
          continue;
        }
        let a = t - i.currentState.timestamp,
          o = i.targetState.timestamp - i.currentState.timestamp,
          s = i.getPosition(),
          c = i.targetState.position,
          l = new n().subVectors(c, s).length();
        if (this.disableInterpolation || l > this.teleportThreshold) {
          (i.setPosition(c.x, c.y, c.z),
            i.setRotation(
              i.targetState.rotation.x,
              i.targetState.rotation.y,
              i.targetState.rotation.z,
            ),
            i.setSailAngle(i.targetState.sailAngle),
            i.setHeelAngle(i.targetState.heelAngle),
            (i.dynamics.visualPressure = i.targetState.visualPressure),
            (i.dynamics.visualLuffing = i.targetState.visualLuffing),
            i.velocity.set(0, 0, 0),
            i.angularVelocity.set(0, 0, 0),
            this._updateRemoteBoatSpawnFade(i, t),
            this._positionRemoteBoatLabel(i));
          continue;
        }
        let u = this.positionLerpSpeed * e,
          d = Math.min(l / 10, 2);
        if (o > 0) {
          let t = Math.min(a / o, 1);
          t **= +(1 + this.smoothingFactor);
          let r = i.currentState.position
            .clone()
            .lerp(i.targetState.position, t);
          if (t >= 1) {
            let e = Math.min(a - o, this.maxExtrapolationTime);
            r.add(
              i.velocity
                .clone()
                .multiplyScalar(e)
                .multiplyScalar(Math.max(0, 1 - e / this.maxExtrapolationTime)),
            );
          }
          let c = new n().subVectors(r, s),
            l = c.length();
          if (l > 0) {
            c.normalize().multiplyScalar(Math.min(l, u * d));
            let e = s.clone().add(c);
            i.setPosition(e.x, e.y, e.z);
          }
          let f = i.getRotation(),
            p = i.targetState.rotation.clone(),
            m = this.getShortestRotationDelta(f.y, p.y),
            h = Math.sign(m),
            g = Math.abs(i.currentTurnRate) * e;
          (Math.abs(m) > 0.01 && (g = Math.max(g, this.minTurnSpeed * e)),
            (g = Math.min(g, Math.abs(m))));
          let _ = f.y + h * g;
          if (
            (i.setRotation(f.x, _, f.z),
            Math.abs(m) < 0.1 && (i.currentTurnRate *= 0.95),
            i.targetSailAngle !== void 0)
          ) {
            let t = i.getSailAngle(),
              n = i.targetSailAngle - t,
              r = Math.PI * e,
              a = Math.sign(n) * Math.min(Math.abs(n), r);
            i.setSailAngle(t + a);
          }
          if (i.targetHeelAngle !== void 0) {
            let t = i.getHeelAngle(),
              n = i.targetHeelAngle - t,
              r = Math.PI * 0.5 * e,
              a = Math.sign(n) * Math.min(Math.abs(n), r);
            i.setHeelAngle(t + a);
          }
          (i.targetState.visualPressure !== void 0 &&
            (i.dynamics.visualPressure = i.targetState.visualPressure),
            i.targetState.visualLuffing !== void 0 &&
              (i.dynamics.visualLuffing = i.targetState.visualLuffing));
        }
        (i.update(e),
          this._updateRemoteBoatSpawnFade(i, t),
          this._positionRemoteBoatLabel(i));
      }
    }
    disconnect() {
      let e = this.socket;
      ((this.socket = null),
        (this.connected = !1),
        this.removeAllRemoteBoats(),
        e && typeof e.close == `function` && e.close(1e3, `client_disconnect`));
    }
    reconnect() {
      this.serverUrl &&
        !this.connected &&
        !this.socket &&
        this.connect(this.serverUrl);
    }
    isConnectionActive() {
      return !!(this.socket || this.connected);
    }
    isConnected() {
      return this.connected;
    }
    getRemoteBoats() {
      return this.remoteBoats;
    }
  };
