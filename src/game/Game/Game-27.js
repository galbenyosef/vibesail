// Game 27 — mesh
// Lines 10097-10451 of readable/assets/Game-BK-SaWAR.pretty.js (statement-aligned).
var lo = class {
    constructor({ centerLat: e, centerLon: t, scale: n = 1 }) {
      ((this.centerLat = e),
        (this.centerLon = t),
        (this.scale = n),
        (this._rot = oo(e, t)));
      let r = io(e, t),
        i = so(this._rot, r);
      this._baseOffset = { x: -i.x, y: -i.y, z: -i.z };
    }
    latLonToGameWorld(e, t) {
      let n = io(e, t),
        r = so(this._rot, n);
      return {
        x: (r.x + this._baseOffset.x) * this.scale,
        z: (r.z + this._baseOffset.z) * this.scale,
      };
    }
    gameWorldToLatLon(e, t) {
      let n = e / this.scale - this._baseOffset.x,
        r = -this._baseOffset.y,
        i = t / this.scale - this._baseOffset.z,
        a = co(this._rot, { x: n, y: r, z: i });
      return ao(a.x, a.y, a.z);
    }
    distanceInGameUnits(e, t, n, r) {
      let i = this.latLonToGameWorld(e, t),
        a = this.latLonToGameWorld(n, r),
        o = a.x - i.x,
        s = a.z - i.z;
      return Math.sqrt(o * o + s * s);
    }
    static realDistanceMeters(e, t, n, r) {
      return jt(e, t, n, r);
    }
    convertWaypoints(e) {
      return e.map((e) => this.latLonToGameWorld(e.lat, e.lon));
    }
  },
  uo = 20,
  fo = class {
    constructor({ centerLat: e, centerLon: t, scale: n = 1 }) {
      this.converter = new lo({ centerLat: e, centerLon: t, scale: n });
    }
    buildCheckpoints(e) {
      return e.length < 2 ? [] : this.converter.convertWaypoints(e.slice(1));
    }
    getGeoCourseConfig() {
      return { checkpointRadius: uo };
    }
  },
  po = class {
    constructor(e, t = {}) {
      this.scene = e;
      let n = {
        color: 65450,
        opacity: 0.8,
        width: 4,
        yOffset: 1.2,
        pulseSpeed: 8,
        pulseFreq: 0.2,
        startFadeMaxDistance: 10,
        surfaceHeightSampler: null,
      };
      ((this.options = { ...n, ...t }),
        (this.surfaceHeightSampler =
          typeof this.options.surfaceHeightSampler == `function`
            ? this.options.surfaceHeightSampler
            : null),
        (this.color = new P(this.options.color)),
        (this.currentOpacity = this.options.opacity),
        (this.mesh = null),
        (this.material = null),
        (this.uniforms = null),
        (this.isVisible = !1),
        (this._basePositions = null),
        (this._vertexCount = 0),
        (this._tmpLocal = new N()),
        (this._tmpWorld = new N()),
        this.init());
    }
    _sampleSurfaceY(e, t, n = 0) {
      if (!this.surfaceHeightSampler) return n;
      try {
        let r = this.surfaceHeightSampler(e, t);
        return Number.isFinite(r) ? r : n;
      } catch {
        return n;
      }
    }
    init() {
      if (!this.scene) return;
      let e = new E(1, 1, 1, 32);
      (e.rotateX(-Math.PI / 2),
        e.translate(0, 0, -0.5),
        (this._basePositions = Float32Array.from(e.attributes.position.array)),
        (this._vertexCount = e.attributes.position.count),
        (this.uniforms = {
          uTime: { value: 0 },
          uColor: { value: this.color },
          uLength: { value: 0 },
          uStartFadeMaxDistance: { value: this.options.startFadeMaxDistance },
          uOpacity: { value: this.currentOpacity },
        }),
        (this.material = new ve({
          uniforms: this.uniforms,
          transparent: !0,
          blending: 2,
          depthWrite: !1,
          depthTest: !0,
          side: 2,
          vertexShader: `
                varying vec2 vUv;
                varying float vDist;
                uniform float uLength;

                void main() {
                    vUv = uv;
                    vDist = vUv.y * uLength;
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `,
          fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor;
                uniform float uLength;
                uniform float uStartFadeMaxDistance;
                uniform float uOpacity;

                varying vec2 vUv;

                void main() {
                    // 1. Edge fading
                    float edgeFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
                    edgeFade = smoothstep(0.0, 0.4, edgeFade);

                    // 2. Arrow Shape Logic (Chevron ">>")
                    // Offset distance based on X to create V-shape pointing forward
                    float arrowSharpness = 3.0;
                    float effectiveDist = (vUv.y * uLength) + abs(vUv.x - 0.5) * arrowSharpness;

                    // 3. Pulse / Dash Pattern
                    float pulseSpeed = 8.0;
                    float freq = 0.2;

                    // Moving wave
                    float wave = sin(effectiveDist * freq - uTime * pulseSpeed);

                    // Sharpen to create distinct arrow bands
                    float arrow = smoothstep(0.8, 0.95, wave);

                    // 4. Distance Fading. Keep the near-boat fade short on long routes.
                    float pathDistance = vUv.y * uLength;
                    float startFadeDistance = min(uLength * 0.1, uStartFadeMaxDistance);
                    float startFade = smoothstep(0.0, max(startFadeDistance, 0.001), pathDistance);
                    float endFade = smoothstep(1.0, 0.9, vUv.y);

                    // 5. Combine (Additive blending, no baseline)
                    float alpha = arrow * edgeFade * startFade * endFade * uOpacity;

                    gl_FragColor = vec4(uColor, alpha);
                }
            `,
        })),
        (this.mesh = new Ee(e, this.material)),
        (this.mesh.position.y = this.options.yOffset),
        (this.mesh.visible = !1),
        (this.mesh.renderOrder = ot.NAVIGATION_PATH),
        this.scene.add(this.mesh));
    }
    update(e, t, n) {
      if (!this.mesh) return;
      let r = t.x - e.x,
        i = t.z - e.z,
        a = Math.sqrt(r * r + i * i),
        o = this._sampleSurfaceY(e.x, e.z, 0);
      (this.mesh.position.set(e.x, o + this.options.yOffset, e.z),
        (this.mesh.rotation.y = Math.atan2(r, i) + Math.PI),
        this.mesh.scale.set(this.options.width, 1, a),
        this._updateSurfaceFollow(o),
        (this.uniforms.uLength.value = a),
        (this.uniforms.uTime.value += n),
        (this.uniforms.uColor.value = this.color),
        (this.uniforms.uStartFadeMaxDistance.value =
          this.options.startFadeMaxDistance),
        (this.uniforms.uOpacity.value = this.currentOpacity));
    }
    _updateSurfaceFollow(e) {
      let t = this.mesh?.geometry?.attributes?.position;
      if (!(!t || !this._basePositions)) {
        if (!this.surfaceHeightSampler) {
          for (let e = 0; e < this._vertexCount; e++)
            t.setY(e, this._basePositions[e * 3 + 1]);
          t.needsUpdate = !0;
          return;
        }
        this.mesh.updateMatrixWorld(!0);
        for (let n = 0; n < this._vertexCount; n++) {
          let r = n * 3;
          (this._tmpLocal.set(
            this._basePositions[r],
            this._basePositions[r + 1],
            this._basePositions[r + 2],
          ),
            this._tmpWorld
              .copy(this._tmpLocal)
              .applyMatrix4(this.mesh.matrixWorld));
          let i = this._sampleSurfaceY(this._tmpWorld.x, this._tmpWorld.z, e);
          t.setY(n, i - e);
        }
        t.needsUpdate = !0;
      }
    }
    setVisible(e) {
      ((this.isVisible = e), this.mesh && (this.mesh.visible = e));
    }
    setColor(e) {
      this.color.setHex(e);
    }
    setOpacity(e) {
      this.currentOpacity = e;
    }
    dispose() {
      this.mesh &&
        (this.scene.remove(this.mesh),
        this.material && this.material.dispose(),
        this.mesh.geometry && this.mesh.geometry.dispose());
    }
  },
  mo = 3718648,
  ho = 14856302,
  go = 65450,
  _o = 3718648,
  vo = class {
    constructor({
      scene: e,
      boat: t,
      world: n,
      checkpoints: r,
      checkpointRadius: i = 20,
      onNavigationEnd: a,
    }) {
      ((this.scene = e),
        (this.boat = t),
        (this.world = n),
        (this._checkpoints = r),
        (this._active = !1),
        (this._completed = !1),
        (this._startTime = null),
        (this._onNavigationEnd = a || null));
      let o = new kt();
      ((o.checkpointPositions = r),
        (o.checkpointRadius = i),
        (o.checkpointColor = mo),
        (o.finalCheckpointColor = ho),
        (o.surfaceHeightSampler = this._getSurfaceHeight.bind(this)),
        (this.checkpointManager = new Ai(e, o)),
        (this.config = o));
      let s = this._getSurfaceHeight.bind(this);
      ((this._primaryTrail = new po(e, {
        color: go,
        opacity: 0.8,
        surfaceHeightSampler: s,
      })),
        (this._secondaryTrail = new po(e, {
          color: _o,
          opacity: 0.4,
          surfaceHeightSampler: s,
        })));
    }
    _getSurfaceHeight(e, t) {
      return this.world?.water &&
        typeof this.world.water.getHeightAt == `function`
        ? this.world.water.getHeightAt(e, t)
        : 0;
    }
    start() {
      this._checkpoints.length !== 0 &&
        ((this._active = !0),
        (this._completed = !1),
        (this._startTime = Date.now()),
        this.checkpointManager.reset());
    }
    stop() {
      (this._active && this._notifyEnd(!1),
        (this._active = !1),
        this.checkpointManager.removeCheckpoints(),
        this._primaryTrail.setVisible(!1),
        this._secondaryTrail.setVisible(!1));
    }
    get isActive() {
      return this._active;
    }
    get isCompleted() {
      return this._completed;
    }
    getTargetPosition() {
      if (!this._active) return null;
      let e = this.checkpointManager.getCurrentCheckpointIndex();
      return e >= this._checkpoints.length ? null : this._checkpoints[e];
    }
    update(e) {
      if (!this._active) return;
      let t = this.boat.getPosition
        ? this.boat.getPosition()
        : this.boat.dynamics?.position;
      if (!t) return;
      if (
        this.checkpointManager.checkBoatCollision(t) &&
        !this.checkpointManager.progressToNextCheckpoint()
      ) {
        (this._notifyEnd(!0),
          (this._completed = !0),
          (this._active = !1),
          this._primaryTrail.setVisible(!1),
          this._secondaryTrail.setVisible(!1),
          console.info(`[GeoCourse] Navigation complete!`));
        return;
      }
      this.checkpointManager.updateAnimations(e);
      let n = this.checkpointManager.getCurrentCheckpointIndex(),
        r = this._checkpoints;
      if (n < r.length) {
        let i = r[n],
          a = n === r.length - 1;
        (this._primaryTrail.setColor(a ? ho : go),
          this._primaryTrail.setVisible(!0),
          this._primaryTrail.update(t, i, e));
        let o = n + 1;
        o < r.length
          ? (this._secondaryTrail.setColor(_o),
            this._secondaryTrail.setVisible(!0),
            this._secondaryTrail.update(i, r[o], e))
          : this._secondaryTrail.setVisible(!1);
      } else
        (this._primaryTrail.setVisible(!1),
          this._secondaryTrail.setVisible(!1));
    }
    _notifyEnd(e) {
      if (!this._startTime) return;
      let t = Math.round((Date.now() - this._startTime) / 1e3);
      ((this._startTime = null),
        this._onNavigationEnd?.({
          durationSeconds: t,
          waypointCount: this._checkpoints.length,
          completed: e,
        }));
    }
    dispose() {
      (this.stop(),
        this._primaryTrail.dispose(),
        this._secondaryTrail.dispose());
    }
  };
