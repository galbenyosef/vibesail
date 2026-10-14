// Birds 02 — math
// Lines 270-1036 of readable/assets/Birds-DHEcQo9w.pretty.js (statement-aligned).
var y = new r(),
  b = new r(),
  x = new r(),
  S = new r(0, -1, 0),
  C = 500,
  w = 900,
  T = 480,
  E = 3,
  D = 62,
  O = 60,
  k = 200,
  A = 240,
  j = A,
  M = 55,
  N = 180,
  P = 18,
  F = P * 0.8,
  I = P * 1.2,
  L = P,
  R = 0.35,
  z = 0.08,
  B = 2,
  V = 70,
  H = 60,
  U = 0.2,
  W = 8,
  G = 22,
  K = 6,
  q = 0.25,
  J = 200,
  Y = 3,
  X = J * 0.75,
  Z = J * 1.3,
  Q = 0.9,
  $ = 2.1,
  ee = class n {
    constructor(e, n = new r(), i = new r(1, 0, 0), a = {}) {
      ((this.scene = e),
        (this.position = n),
        (this.direction = i.clone().normalize()),
        (this.speed = P),
        (this.flocks = []),
        (this.height = 50),
        (this.centerTarget = null),
        (this.models = { black: _(), seagull: v() }),
        (this.waterBirds = []),
        (this.cloudFlocks = []),
        (this.islandSurfaceBirds = []),
        (this.billboardBirds = []),
        (this.billboardTargets = []),
        (this.billboardOrderedIds = []),
        (this.islandSurfaceOrderedIds = []),
        (this.scratchNearbyBirdSigns = []),
        (this.scratchSeenBirdIds = new Set()),
        (this.birdSignsById = new Map()),
        (this.islandSurfaceActiveIds = new Set()),
        (this.boatPosition = new r()),
        (this.hasBoatPosition = !1),
        (this.waterHeightSampler =
          typeof a.waterHeightSampler == `function`
            ? a.waterHeightSampler
            : null),
        (this.raycaster = new t()),
        (this.billboardTime = 0),
        a.boatPosition && this.setBoatPosition(a.boatPosition),
        this.init());
    }
    setCenterTarget(e) {
      this.centerTarget = e;
    }
    setBoatPosition(e) {
      if (
        !e ||
        !Number.isFinite(e.x) ||
        !Number.isFinite(e.y) ||
        !Number.isFinite(e.z)
      ) {
        this.hasBoatPosition = !1;
        return;
      }
      (this.boatPosition.copy(e), (this.hasBoatPosition = !0));
    }
    setWaterHeightSampler(e) {
      this.waterHeightSampler = typeof e == `function` ? e : null;
    }
    sampleWaterHeight(e, t) {
      if (!this.waterHeightSampler) return 0;
      let n = this.waterHeightSampler(e, t);
      return Number.isFinite(n) ? n : 0;
    }
    getPlayerAnchorPosition() {
      return this.hasBoatPosition
        ? this.boatPosition
        : this.centerTarget?.position
          ? this.centerTarget.position
          : this.position || null;
    }
    collectNearbyBirdSignsWithHysteresis() {
      let e = this.scratchNearbyBirdSigns;
      e.length = 0;
      let t = this.billboardOrderedIds,
        n = this.getPlayerAnchorPosition(),
        r = this.islandSurfaceActiveIds;
      if (!n) {
        for (let n = 0; n < t.length; n++) {
          let i = t[n],
            a = this.birdSignsById.get(i);
          a?.position && (r.add(i), e.push(a));
        }
        return e;
      }
      let i = k * k,
        a = A * A;
      for (let o = 0; o < t.length; o++) {
        let s = t[o],
          c = this.birdSignsById.get(s);
        if (!c?.position) continue;
        let l = c.position.x - n.x,
          u = c.position.z - n.z,
          d = l * l + u * u;
        if (r.has(s) ? d <= a : d <= i) {
          (r.add(s), e.push(c));
          continue;
        }
        r.delete(s);
      }
      return e;
    }
    updateBirdSignMembership(e = []) {
      let t = this.scratchSeenBirdIds;
      t.clear();
      let n = !1;
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        i &&
          i.userData?.companyName === `Bird` &&
          i.position &&
          (t.add(i.uuid),
          this.birdSignsById.has(i.uuid) || (n = !0),
          this.birdSignsById.set(i.uuid, i));
      }
      for (let e of this.birdSignsById.keys())
        t.has(e) || (this.birdSignsById.delete(e), (n = !0));
      return n;
    }
    rebuildSortedBirdIds() {
      this.billboardOrderedIds.length = 0;
      for (let e of this.birdSignsById.keys()) this.billboardOrderedIds.push(e);
      this.billboardOrderedIds.sort();
    }
    pruneIslandSurfaceActiveIds() {
      for (let e of this.islandSurfaceActiveIds)
        this.birdSignsById.has(e) || this.islandSurfaceActiveIds.delete(e);
    }
    syncOrderedIds(e, t) {
      let n = t.length !== e.length;
      for (let r = 0; r < e.length; r++) {
        let i = e[r].uuid;
        t[r] !== i && (n = !0);
      }
      if (!n) return !1;
      t.length = e.length;
      for (let n = 0; n < e.length; n++) t[n] = e[n].uuid;
      return !0;
    }
    updateBillboardTargetTransforms() {
      this.billboardTargets.length = this.billboardOrderedIds.length;
      for (let e = 0; e < this.billboardOrderedIds.length; e++) {
        let t = this.billboardOrderedIds[e],
          n = this.birdSignsById.get(t);
        if (!n?.position) continue;
        let i = this.billboardTargets[e];
        (!i || i.id !== t) &&
          ((i = { id: t, sign: n, point: new r(), rotationY: 0 }),
          (this.billboardTargets[e] = i));
        let a = n.children?.[0]?.geometry?.parameters?.height ?? 12;
        ((i.sign = n),
          i.point.copy(n.position),
          (i.point.y += a * 0.5 + 0.8),
          (i.rotationY = n.rotation?.y ?? 0));
      }
    }
    setBillboardTargets(e = []) {
      let t = Array.isArray(e) ? e : [],
        n = this.updateBirdSignMembership(t);
      (n && (this.rebuildSortedBirdIds(), this.pruneIslandSurfaceActiveIds()),
        this.updateBillboardTargetTransforms(),
        n && this.reconcileBillboardBirds());
      let r = this.collectNearbyBirdSignsWithHysteresis();
      this.syncOrderedIds(r, this.islandSurfaceOrderedIds) &&
        this.reconcileIslandSurfaceBirds(r);
    }
    init() {
      (this.createDefaultFlocks().forEach((e) => this.createFlock(e)),
        this.createWaterBirdSystem());
    }
    createDefaultFlocks() {
      return [
        {
          birdCount: 10,
          startPosition: new r(300, this.height, 0),
          species: `black`,
        },
        {
          birdCount: 8,
          startPosition: new r(-250, this.height, 250),
          species: `black`,
        },
        {
          birdCount: 9,
          startPosition: new r(250, this.height, 250),
          species: `black`,
        },
        {
          birdCount: 7,
          startPosition: new r(-200, this.height, -300),
          species: `seagull`,
        },
        {
          birdCount: 8,
          startPosition: new r(0, this.height, -350),
          species: `seagull`,
        },
      ];
    }
    createWaterBirdSystem(e = E) {
      let t = this.getPlayerAnchorPosition() || this.position || new r();
      for (let n = 0; n < e; n++) {
        let e = this.createBird(this.models.seagull, `seagull`);
        this.models.seagull.setMode(e, p.WATER);
        let n = Math.random() * Math.PI * 2,
          i = M + Math.random() * (N - M),
          a = t.x + Math.sin(n) * i,
          o = t.z + Math.cos(n) * i,
          s = this.sampleWaterHeight(a, o) + R;
        (e.position.set(a, s, o),
          this.scene.add(e),
          this.waterBirds.push({
            bird: e,
            model: this.models.seagull,
            state: p.WATER,
            timer: 6 + Math.random() * 8,
            fleeTimer: 0,
            fleeStartPoint: e.position.clone(),
            waterline: s,
            startleRadius: D * (0.85 + Math.random() * 0.35),
            velocity: new r(),
            orbitDirection: Math.random() < 0.5 ? -1 : 1,
            phase: Math.random() * Math.PI * 2,
          }));
      }
    }
    sampleAirSpeed() {
      return F + Math.random() * (I - F);
    }
    sampleLocalWaterPosition(e, t = b) {
      let n = Math.random() * Math.PI * 2,
        r = M + Math.random() * (N - M);
      return (t.set(e.x + Math.sin(n) * r, 0, e.z + Math.cos(n) * r), t);
    }
    placeWaterBirdOnSurface(e, t, n) {
      let { bird: r } = e;
      r.position.set(t, 0, n);
      let i = this.sampleWaterHeight(t, n) + R;
      ((e.waterline = i), (r.position.y = i));
    }
    respawnWaterBirdNearCenter(e, t) {
      let n = this.sampleLocalWaterPosition(t, x);
      (this.placeWaterBirdOnSurface(e, n.x, n.z),
        (e.state = p.WATER),
        e.model.setMode(e.bird, p.WATER),
        e.velocity.set(0, 0, 0));
    }
    tryStartleBirdFromBoat(e, t, n) {
      if (e.state === p.FLYING || !this.hasBoatPosition) return !1;
      let r = e.bird;
      return r.position.distanceToSquared(this.boatPosition) >=
        e.startleRadius * e.startleRadius
        ? !1
        : ((e.state = p.FLYING),
          (e.fleeTimer = 0),
          e.fleeStartPoint.copy(r.position),
          e.model.setMode(r, p.FLYING),
          b.copy(r.position).sub(this.boatPosition),
          b.lengthSq() < 0.01 &&
            b.set(Math.random() - 0.5, 0, Math.random() - 0.5),
          b.normalize(),
          e.velocity.copy(b).multiplyScalar(this.sampleAirSpeed()),
          (e.velocity.y = t + Math.random() * n),
          !0);
    }
    createBillboardBirdEntry(e = 0) {
      let t = this.createBird(this.models.black, `black`);
      return (
        t.scale.multiplyScalar(0.8 + Math.random() * 0.12),
        this.models.black.setMode(t, p.PERCHED),
        this.scene.add(t),
        {
          bird: t,
          model: this.models.black,
          state: p.PERCHED,
          currentIndex: e,
          destinationIndex: e,
          timer: 4 + Math.random() * 7,
          progress: 0,
          duration: 0,
          arcHeight: 0,
          startPoint: new r(),
          endPoint: new r(),
        }
      );
    }
    createIslandSurfaceBirdEntry(e, t = 0) {
      let n = this.createBird(this.models.seagull, `seagull`);
      (n.scale.multiplyScalar(0.9 + Math.random() * 0.12),
        this.models.seagull.setMode(n, p.PERCHED));
      let i = this.computeIslandSurfacePerchPoint(e, t);
      return (
        n.position.copy(i),
        (n.rotation.y = Math.random() * Math.PI * 2),
        this.scene.add(n),
        {
          bird: n,
          model: this.models.seagull,
          sign: e,
          homePoint: i,
          state: p.PERCHED,
          timer: 6 + Math.random() * 8,
          fleeTimer: 0,
          fleeStartPoint: i.clone(),
          startleRadius: V * (0.85 + Math.random() * 0.35),
          velocity: new r(),
          orbitDirection: Math.random() < 0.5 ? -1 : 1,
          phase: Math.random() * Math.PI * 2,
        }
      );
    }
    sampleIslandSurfacePoint(e, t, n) {
      let i = e?.userData?.islandRef;
      if (i) {
        let r = this.scene?.getObjectByProperty?.(`uuid`, i);
        if (r) {
          (r.updateWorldMatrix(!0, !1),
            b.set(t, Math.max(e.position.y + 120, 80), n),
            this.raycaster.set(b, S));
          let i = this.raycaster.intersectObject(r, !1);
          if (i.length > 0 && i[0].point) {
            let e = i[0].point.clone();
            return ((e.y += U), e);
          }
        }
      }
      return new r(t, this.sampleWaterHeight(t, n) + q, n);
    }
    computeIslandSurfacePerchPoint(e, t = 0) {
      if (!e?.position) return new r(0, q, 0);
      let n = (t / B) * Math.PI * 2;
      for (let t = 0; t < K; t++) {
        let r = W + Math.random() * (G - W),
          i = n + (t / K) * Math.PI * 2,
          a = e.position.x + Math.cos(i) * r,
          o = e.position.z + Math.sin(i) * r,
          s = this.sampleIslandSurfacePoint(e, a, o);
        if (s) return s;
      }
      return this.sampleIslandSurfacePoint(e, e.position.x, e.position.z);
    }
    reconcileIslandSurfaceBirds(e = []) {
      (this.islandSurfaceBirds.forEach((e) => this.scene.remove(e.bird)),
        (this.islandSurfaceBirds = []),
        (Array.isArray(e) ? e : []).forEach((e) => {
          if (e?.position)
            for (let t = 0; t < B; t++)
              this.islandSurfaceBirds.push(
                this.createIslandSurfaceBirdEntry(e, t),
              );
        }));
    }
    reconcileBillboardBirds() {
      let e = this.billboardTargets.length;
      for (; this.billboardBirds.length > e;) {
        let e = this.billboardBirds.pop();
        this.scene.remove(e.bird);
      }
      if (e !== 0) {
        for (let t = this.billboardBirds.length; t < e; t++)
          this.billboardBirds.push(this.createBillboardBirdEntry(t));
        this.billboardBirds.forEach((t, n) => {
          e <= 0 ||
            ((t.currentIndex = ((t.currentIndex % e) + e) % e),
            (t.destinationIndex = ((t.destinationIndex % e) + e) % e),
            (t.state !== p.FLYING || e === 1) &&
              (this.placeBillboardBird(
                t,
                Math.min(t.currentIndex, e - 1),
                p.PERCHED,
              ),
              e === 1 && (t.timer = 6 + Math.random() * 8)),
            this.billboardTargets[t.currentIndex] ||
              this.placeBillboardBird(t, n % e, p.PERCHED));
        });
      }
    }
    createFlock({ birdCount: t, startPosition: n, species: r = `black` } = {}) {
      let i = this.models[r] || this.models.black,
        a = this.sampleAirSpeed(),
        o = {
          group: new e(),
          birds: [],
          species: r,
          model: i,
          position: n.clone(),
          direction: this.direction.clone(),
          angle: Math.random() * Math.PI * 2,
          speed: a,
          cruiseSpeed: a,
          targetSpeed: this.speed,
          mode: p.FLYING,
          targetHeight: this.height,
          orbitDirection: Math.random() < 0.5 ? -1 : 1,
          orbitRadius: 260 + Math.random() * 210,
        };
      o.targetSpeed = o.cruiseSpeed;
      for (let e = 0; e < t; e++) {
        let t = this.createBird(i, r);
        if (e === 0) t.position.set(0, 0, 0);
        else {
          let n = e % 2 == 0 ? 1 : -1,
            r = Math.ceil(e / 2);
          t.position.set(n * r * 3, r * 0.5, -r * 5);
        }
        (o.birds.push(t), o.group.add(t));
      }
      (o.group.position.copy(o.position),
        this.rotateFlockToDirection(o),
        this.scene.add(o.group),
        (o.group.userData = o.group.userData || {}),
        (o.group.userData.kind = `bird`),
        (o.group.userData.skipWaterCapture = !0),
        this.flocks.push(o));
    }
    createBird(e, t = `black`) {
      let n =
        t === `seagull`
          ? {
              flapSpeedMin: 3.4,
              flapSpeedMax: 5.2,
              flapAmplitudeDegMin: 10,
              flapAmplitudeDegMax: 18,
              wingRestDegMin: 6,
              wingRestDegMax: 10,
              scaleMin: 0.95,
              scaleMax: 1.2,
            }
          : {};
      return e.createInstance(n);
    }
    placeBillboardBird(e, t, n = p.PERCHED) {
      let r = this.billboardTargets[t];
      r &&
        ((e.currentIndex = t),
        (e.destinationIndex = t),
        (e.state = n),
        e.model.setMode(e.bird, n),
        e.bird.position.copy(r.point),
        e.bird.rotation.set(0, r.rotationY + Math.PI, 0),
        n === p.PERCHED &&
          (e.bird.rotation.z = Math.sin(this.billboardTime + t) * 0.04));
    }
    pickBillboardDestination(e, t) {
      return t <= 1 ? e : (e + (1 + Math.floor(Math.random() * (t - 1)))) % t;
    }
    animateSingleBirdWings(e, t, n = 1) {
      let r = e.userData.leftWingPivot,
        i = e.userData.rightWingPivot;
      if (!r || !i || e.userData.mode !== p.FLYING) return;
      e.userData.flapAngle += t * e.userData.flapSpeed;
      let a = Math.sin(e.userData.flapAngle) * e.userData.flapAmplitude,
        o =
          Math.sin(e.userData.flapAngle * 0.45 + e.userData.glidePhase) *
          0.07 *
          n,
        s = e.userData.wingRest + a;
      ((r.rotation.z = s),
        (i.rotation.z = -s),
        (r.rotation.y = -o),
        (i.rotation.y = o),
        (e.rotation.x = Math.sin(e.userData.flapAngle * 0.5) * 0.05));
    }
    updateEscapeVelocity(e, t, n, r) {
      if (!this.hasBoatPosition) return;
      b.copy(t.position).sub(this.boatPosition);
      let i = b.length();
      if (
        (i < 0.001 && b.set(Math.random() - 0.5, 0, Math.random() - 0.5),
        b.normalize(),
        e.fleeTimer < Y || i < X)
      )
        x.copy(b).multiplyScalar(P);
      else {
        let t = e.orbitDirection === -1 ? -1 : 1;
        if ((x.set(-b.z * t, 0, b.x * t).multiplyScalar(P * Q), i > Z)) {
          let e = Math.min(1, (i - Z) / Z);
          x.addScaledVector(b, -(P * (0.35 + e * 0.65)));
        }
      }
      ((x.y = r), e.velocity.lerp(x, Math.min(1, n * 2)));
    }
    updateWaterBirds(e) {
      let t = this.getPlayerAnchorPosition() || this.position || new r(),
        n = j * j,
        i = A * A;
      this.waterBirds.forEach((r) => {
        let { bird: a } = r;
        r.phase += e;
        let o = a.position.x - t.x,
          s = a.position.z - t.z;
        if (
          (o * o + s * s > i &&
            r.state !== p.FLYING &&
            (this.respawnWaterBirdNearCenter(r, t),
            (r.timer = 4 + Math.random() * 8)),
          this.tryStartleBirdFromBoat(r, 3.2, 1.8),
          r.state === p.FLYING)
        ) {
          ((r.fleeTimer += e),
            this.updateEscapeVelocity(r, a, e, 3.6),
            a.position.addScaledVector(r.velocity, e),
            this.animateSingleBirdWings(a, e, 1.1),
            b.set(r.velocity.x, 0, r.velocity.z),
            b.lengthSq() > 0.01 && (a.rotation.y = Math.atan2(b.x, b.z)));
          let t = a.position.distanceTo(r.fleeStartPoint);
          if (r.fleeTimer > O && t >= J) {
            ((r.state = p.WATER),
              (r.timer = 5 + Math.random() * 8),
              r.model.setMode(a, p.WATER),
              r.velocity.multiplyScalar(0.2),
              (a.rotation.y += (Math.random() - 0.5) * 0.6));
            let e = this.sampleWaterHeight(a.position.x, a.position.z) + R;
            ((r.waterline = e), (a.position.y = e));
          }
        } else {
          ((r.timer -= e),
            r.timer <= 0 &&
              ((r.timer = 4 + Math.random() * 8),
              b
                .set(Math.random() - 0.5, 0, Math.random() - 0.5)
                .normalize()
                .multiplyScalar(1.6),
              r.velocity.lerp(b, 0.5)),
            r.velocity.multiplyScalar(Math.max(0, 1 - e * 0.6)),
            a.position.addScaledVector(r.velocity, e));
          let t = this.sampleWaterHeight(a.position.x, a.position.z) + R;
          ((r.waterline = t),
            (a.position.y = t + Math.sin(r.phase * 1.5) * z),
            (a.rotation.z = Math.sin(r.phase * 1.2) * 0.03));
        }
        let c = a.position.x - t.x,
          l = a.position.z - t.z;
        if (c * c + l * l > n) {
          if (r.state === p.FLYING && r.fleeTimer < O) {
            (b.set(c, 0, l).normalize(),
              a.position.set(
                t.x + b.x * (j - 30),
                Math.max(a.position.y, r.waterline + 6),
                t.z + b.z * (j - 30),
              ),
              r.velocity.addScaledVector(b, -21.599999999999998));
            return;
          }
          this.respawnWaterBirdNearCenter(r, t);
        }
      });
    }
    updateIslandSurfaceBirds(e) {
      this.islandSurfaceBirds.length &&
        this.islandSurfaceBirds.forEach((t, n) => {
          let { bird: r } = t;
          if (((t.phase += e), t.state !== p.FLYING)) {
            (r.position.lerp(t.homePoint, Math.min(1, e * 4)),
              (r.rotation.z = Math.sin(t.phase * 0.8 + n) * 0.02),
              (t.timer -= e),
              this.tryStartleBirdFromBoat(t, 3, 1.6));
            return;
          }
          ((t.fleeTimer += e),
            this.updateEscapeVelocity(t, r, e, 3.2),
            r.position.addScaledVector(t.velocity, e),
            this.animateSingleBirdWings(r, e, 1.05),
            b.set(t.velocity.x, 0, t.velocity.z),
            b.lengthSq() > 0.001 && (r.rotation.y = Math.atan2(b.x, b.z)));
          let i = r.position.distanceTo(t.fleeStartPoint);
          t.fleeTimer > H &&
            i >= J &&
            ((t.state = p.PERCHED),
            (t.timer = 6 + Math.random() * 8),
            t.model.setMode(r, p.PERCHED),
            r.position.copy(t.homePoint),
            t.velocity.set(0, 0, 0));
        });
    }
    updateBillboardBirds(e) {
      this.billboardTargets.length === 0 ||
        this.billboardBirds.length === 0 ||
        this.billboardBirds.forEach((t, n) => {
          if (t.state === p.FLYING) {
            t.progress = Math.min(
              1,
              t.progress + e / Math.max(0.001, t.duration),
            );
            let n = t.progress;
            (t.bird.position.lerpVectors(t.startPoint, t.endPoint, n),
              (t.bird.position.y += Math.sin(Math.PI * n) * t.arcHeight),
              b.copy(t.endPoint).sub(t.startPoint),
              b.lengthSq() > 0.001 &&
                (t.bird.rotation.y = Math.atan2(b.x, b.z)),
              this.animateSingleBirdWings(t.bird, e, 0.9),
              n >= 1 &&
                (this.placeBillboardBird(t, t.destinationIndex, p.PERCHED),
                (t.timer = 4 + Math.random() * 8)));
            return;
          }
          let r =
            this.billboardTargets[t.currentIndex] ||
            this.billboardTargets[n % this.billboardTargets.length];
          if (
            !r ||
            (t.bird.position.copy(r.point),
            (t.bird.rotation.y = r.rotationY + Math.PI),
            (t.bird.rotation.z =
              Math.sin(this.billboardTime * 1.3 + n) * 0.035),
            t.bird.userData.mode !== p.PERCHED &&
              t.model.setMode(t.bird, p.PERCHED),
            (t.timer -= e),
            t.timer > 0 || this.billboardTargets.length <= 1)
          )
            return;
          t.destinationIndex = this.pickBillboardDestination(
            t.currentIndex,
            this.billboardTargets.length,
          );
          let i = this.billboardTargets[t.destinationIndex];
          if (!i) {
            t.timer = 3 + Math.random() * 4;
            return;
          }
          ((t.state = p.FLYING),
            t.model.setMode(t.bird, p.FLYING),
            (t.progress = 0),
            t.startPoint.copy(r.point),
            t.endPoint.copy(i.point));
          let a = t.startPoint.distanceTo(t.endPoint);
          ((t.duration = Math.max(5.5, a / L)), (t.arcHeight = 5 + a * 0.05));
        });
    }
    rotateFlockToDirection(e) {
      let t = Math.atan2(e.direction.x, e.direction.z);
      e.group.rotation.y = t;
    }
    updateFlockDirection(e, t) {
      let n = this.centerTarget?.position || this.position || new r();
      b.set(e.position.x - n.x, 0, e.position.z - n.z);
      let i = b.length();
      (i < 0.001 && (b.set(1, 0, 0), (i = 1)),
        b.multiplyScalar(1 / i),
        x.set(-b.z * e.orbitDirection, 0, b.x * e.orbitDirection));
      let a = o.clamp((e.orbitRadius - i) / Math.max(80, e.orbitRadius), -1, 1);
      if ((x.addScaledVector(b, a * 0.9), i > C)) {
        let t = o.clamp((i - C) / C, 0, 1.2);
        (x.addScaledVector(b, -(1.1 + t * 2.4)),
          i > C * 1.15 &&
            (y.set(-b.z * e.orbitDirection, 0, b.x * e.orbitDirection),
            x.copy(b).multiplyScalar(-1.7).addScaledVector(y, 0.35)));
      }
      x.lengthSq() > 1e-4 &&
        (x.normalize(),
        e.direction.lerp(x, Math.min(1, t * $)),
        e.direction.normalize());
    }
    update(e) {
      ((this.billboardTime += e),
        this.flocks.forEach((t) => {
          (this.updateFlockDirection(t, e),
            this.rotateFlockToDirection(t),
            (t.speed = o.lerp(t.speed, t.targetSpeed, Math.min(1, e * 1.8))),
            (t.position.y = o.lerp(
              t.position.y,
              t.targetHeight,
              Math.min(1, e * 1.5),
            )),
            y.copy(t.direction).multiplyScalar(t.speed * e),
            t.position.add(y),
            t.group.position.copy(t.position),
            (t.angle += e * 2),
            (t.group.position.y += Math.sin(t.angle) * 0.5),
            this.checkWorldBounds(t),
            this.animateBirdWings(t, e));
        }),
        this.updateWaterBirds(e),
        this.updateIslandSurfaceBirds(e),
        this.updateBillboardBirds(e));
    }
    animateBirdWings(e, t) {
      e.birds.forEach((n) => {
        if (n.userData.mode !== p.FLYING) {
          ((n.rotation.x = 0),
            (n.rotation.z =
              n.userData.mode === p.WATER
                ? Math.sin(e.angle * 0.9 + n.userData.glidePhase) * 0.03
                : 0));
          return;
        }
        this.animateSingleBirdWings(n, t, 1);
      });
    }
    checkWorldBounds(e) {
      let t = this.centerTarget
          ? this.centerTarget.position
          : this.position || new r(),
        n = e.position.x - t.x,
        i = e.position.z - t.z;
      if (n * n + i * i > w * w) {
        let n = Math.random() * Math.PI * 2,
          r = Math.min(T, C * (0.8 + Math.random() * 0.2)),
          i = t.x + Math.sin(n) * r,
          a = t.z + Math.cos(n) * r;
        (e.position.set(i, this.height, a),
          (e.mode = p.FLYING),
          (e.speed = e.cruiseSpeed),
          (e.targetSpeed = e.cruiseSpeed),
          (e.targetHeight = this.height),
          e.birds.forEach((t) => e.model.setMode(t, p.FLYING)),
          this.rotateFlockToDirection(e));
      }
    }
    dispose() {
      (this.flocks.forEach((e) => {
        this.scene.remove(e.group);
      }),
        this.waterBirds.forEach((e) => {
          this.scene.remove(e.bird);
        }),
        this.islandSurfaceBirds.forEach((e) => {
          this.scene.remove(e.bird);
        }),
        this.billboardBirds.forEach((e) => {
          this.scene.remove(e.bird);
        }),
        (this.flocks = []),
        (this.waterBirds = []),
        (this.cloudFlocks = []),
        (this.islandSurfaceBirds = []),
        (this.billboardBirds = []),
        (this.billboardTargets = []),
        (this.billboardOrderedIds = []),
        (this.islandSurfaceOrderedIds = []),
        this.birdSignsById.clear(),
        this.scratchSeenBirdIds.clear(),
        this.islandSurfaceActiveIds.clear(),
        (this.waterHeightSampler = null),
        Object.values(this.models).forEach((e) => e?.dispose?.()),
        (this.models = {}));
    }
    static createBirds(e, t = new r(1, 0, 0), i = {}) {
      return new n(e, new r(0, 0, 0), t, i);
    }
  };
