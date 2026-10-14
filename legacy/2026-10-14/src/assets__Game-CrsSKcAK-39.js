// assets__Game-CrsSKcAK 39 — pos
// Lines 19849-20461 of readable/assets__Game-CrsSKcAK.pretty.js (statement-aligned).
var Nc = class extends q.Circle {
    constructor(e, t, n) {
      (super(mc(e), t),
        (this.offsetCopy = { x: 0, y: 0 }),
        (this.dirty = !1),
        (this.isConvex = !0),
        (this.type = Bs.Circle),
        (this.typeGroup = Y.Circle),
        (this.isCentered = !0),
        vc(this, n),
        (this.unscaledRadius = t));
    }
    get x() {
      return this.pos.x;
    }
    set x(e) {
      ((this.pos.x = e), this.markAsDirty());
    }
    get y() {
      return this.pos.y;
    }
    set y(e) {
      ((this.pos.y = e), this.markAsDirty());
    }
    get scale() {
      return this.r / this.unscaledRadius;
    }
    set scale(e) {
      this.setScale(e);
    }
    get scaleX() {
      return this.scale;
    }
    get scaleY() {
      return this.scale;
    }
    get group() {
      return this._group;
    }
    set group(e) {
      this._group = jc(e);
    }
    move(e = 1, t = !0) {
      return (Mc(this, e, t), this);
    }
    setPosition(e, t, n = !0) {
      return ((this.pos.x = e), (this.pos.y = t), this.markAsDirty(n), this);
    }
    setScale(e, t = e, n = !0) {
      return (
        (this.r = this.unscaledRadius * Math.abs(e)),
        this.markAsDirty(n),
        this
      );
    }
    setAngle(e, t = !0) {
      this.angle = e;
      let { x: n, y: r } = this.getOffsetWithAngle();
      return (
        (this.offset.x = n),
        (this.offset.y = r),
        this.markAsDirty(t),
        this
      );
    }
    setOffset(e, t = !0) {
      ((this.offsetCopy.x = e.x), (this.offsetCopy.y = e.y));
      let { x: n, y: r } = this.getOffsetWithAngle();
      return (
        (this.offset.x = n),
        (this.offset.y = r),
        this.markAsDirty(t),
        this
      );
    }
    getAABBAsBBox() {
      let e = this.pos.x + this.offset.x,
        t = this.pos.y + this.offset.y;
      return {
        minX: e - this.r,
        maxX: e + this.r,
        minY: t - this.r,
        maxY: t + this.r,
      };
    }
    draw(e) {
      let t = this.pos.x + this.offset.x,
        n = this.pos.y + this.offset.y,
        r = Math.abs(this.r);
      if (this.isTrigger) {
        let r = Math.max(8, this.r);
        for (let i = 0; i < r; i++) {
          let a = (i / r) * 2 * Math.PI,
            o = ((i - 1) / r) * 2 * Math.PI;
          Dc(
            e,
            t + Math.cos(o) * this.r,
            n + Math.sin(o) * this.r,
            t + Math.cos(a) * this.r,
            n + Math.sin(a) * this.r,
          );
        }
      } else (e.moveTo(t + r, n), e.arc(t, n, r, 0, Math.PI * 2));
    }
    drawBVH(e) {
      kc(e, this);
    }
    updateBody(e = this.dirty) {
      e && (this.system?.insert(this), (this.dirty = !1));
    }
    markAsDirty(e = !1) {
      e ? this.updateBody(!0) : (this.dirty = !0);
    }
    getOffsetWithAngle() {
      if ((!this.offsetCopy.x && !this.offsetCopy.y) || !this.angle)
        return this.offsetCopy;
      let e = Math.sin(this.angle),
        t = Math.cos(this.angle);
      return {
        x: this.offsetCopy.x * t - this.offsetCopy.y * e,
        y: this.offsetCopy.x * e + this.offsetCopy.y * t,
      };
    }
  },
  Pc = class extends q.Polygon {
    constructor(e, t, n) {
      if (
        (super(mc(e), hc(t)),
        (this.dirty = !1),
        (this.type = Bs.Polygon),
        (this.typeGroup = Y.Polygon),
        (this.centered = !1),
        (this.scaleVector = { x: 1, y: 1 }),
        !t.length)
      )
        throw Error(`No points in polygon`);
      vc(this, n);
    }
    set isCentered(e) {
      if (this.centered === e) return;
      let t;
      this.runWithoutRotation(() => {
        t = this.getCentroid();
      });
      let n = e ? -t.x : -this.points[0].x,
        r = e ? -t.y : -this.points[0].y;
      (this.setPoints(
        Gs(this.points, ({ x: e, y: t }) => new q.Vector(e + n, t + r)),
      ),
        (this.centered = e));
    }
    get isCentered() {
      return this.centered;
    }
    get x() {
      return this.pos.x;
    }
    set x(e) {
      ((this.pos.x = e), this.markAsDirty());
    }
    get y() {
      return this.pos.y;
    }
    set y(e) {
      ((this.pos.y = e), this.markAsDirty());
    }
    get scaleX() {
      return this.scaleVector.x;
    }
    get scaleY() {
      return this.scaleVector.y;
    }
    get scale() {
      return (this.scaleVector.x + this.scaleVector.y) / 2;
    }
    set scale(e) {
      this.setScale(e);
    }
    get group() {
      return this._group;
    }
    set group(e) {
      this._group = jc(e);
    }
    move(e = 1, t = !0) {
      return (Mc(this, e, t), this);
    }
    setPosition(e, t, n = !0) {
      return ((this.pos.x = e), (this.pos.y = t), this.markAsDirty(n), this);
    }
    setScale(e, t = e, n = !0) {
      return (
        (this.scaleVector.x = Math.abs(e)),
        (this.scaleVector.y = Math.abs(t)),
        super.setPoints(
          Gs(
            this.points,
            (e, t) =>
              new q.Vector(
                this.pointsBackup[t].x * this.scaleVector.x,
                this.pointsBackup[t].y * this.scaleVector.y,
              ),
          ),
        ),
        this.updateConvex(),
        this.markAsDirty(n),
        this
      );
    }
    setAngle(e, t = !0) {
      return (super.setAngle(e), this.markAsDirty(t), this);
    }
    setOffset(e, t = !0) {
      return (super.setOffset(e), this.markAsDirty(t), this);
    }
    getAABBAsBBox() {
      let { pos: e, w: t, h: n } = this.getAABBAsBox();
      return { minX: e.x, minY: e.y, maxX: e.x + t, maxY: e.y + n };
    }
    getEdge(e) {
      let { x: t, y: n } = this.calcPoints[e],
        r = this.calcPoints[(e + 1) % this.calcPoints.length];
      return {
        start: { x: this.x + t, y: this.y + n },
        end: { x: this.x + r.x, y: this.y + r.y },
      };
    }
    draw(e) {
      Oc(e, this, this.isTrigger);
    }
    drawBVH(e) {
      kc(e, this);
    }
    setPoints(e) {
      return (
        super.setPoints(e),
        this.updateConvex(),
        (this.pointsBackup = Cc(e)),
        this
      );
    }
    translate(e, t) {
      return (
        super.translate(e, t),
        (this.pointsBackup = Cc(this.points)),
        this
      );
    }
    rotate(e) {
      return (super.rotate(e), (this.pointsBackup = Cc(this.points)), this);
    }
    isSimple() {
      return Is(Gs(this.calcPoints, wc));
    }
    updateBody(e = this.dirty) {
      e &&
        (this.updateConvexPolygonPositions(),
        this.system?.insert(this),
        (this.dirty = !1));
    }
    runWithoutRotation(e) {
      let t = this.angle;
      (this.setAngle(0, !1), e(), this.setAngle(t, !1));
    }
    markAsDirty(e = !1) {
      e ? this.updateBody(!0) : (this.dirty = !0);
    }
    updateConvexPolygonPositions() {
      this.isConvex ||
        !this.convexPolygons ||
        Vs(this.convexPolygons, (e) => {
          ((e.pos.x = this.pos.x),
            (e.pos.y = this.pos.y),
            e.angle !== this.angle && e.setAngle(this.angle));
        });
    }
    getConvex() {
      return (this.typeGroup && this.typeGroup !== Y.Polygon) ||
        this.points.length < 4
        ? []
        : Rs(Gs(this.calcPoints, wc));
    }
    updateConvexPolygons(e = this.getConvex()) {
      this.isConvex ||
        (this.convexPolygons || (this.convexPolygons = []),
        Vs(e, (e, t) => {
          (this.convexPolygons[t] || (this.convexPolygons[t] = new q.Polygon()),
            (this.convexPolygons[t].pos.x = this.pos.x),
            (this.convexPolygons[t].pos.y = this.pos.y),
            (this.convexPolygons[t].angle = this.angle),
            this.convexPolygons[t].setPoints(hc(Gs(e, Tc))));
        }),
        (this.convexPolygons.length = e.length));
    }
    updateConvex() {
      let e = this.getConvex();
      ((this.isConvex = e.length <= 1), this.updateConvexPolygons(e));
    }
  },
  Fc = class extends Pc {
    constructor(e, t, n = t, r = (t + n) / Math.PI, i) {
      (super(e, fc(t, n, r), i),
        (this.type = Bs.Ellipse),
        (this.typeGroup = Y.Ellipse),
        (this.isConvex = !0),
        (this._radiusX = t),
        (this._radiusY = n),
        (this._step = r));
    }
    set isCentered(e) {}
    get isCentered() {
      return !0;
    }
    get step() {
      return this._step;
    }
    set step(e) {
      ((this._step = e),
        this.setPoints(fc(this._radiusX, this._radiusY, this._step)));
    }
    get radiusX() {
      return this._radiusX;
    }
    set radiusX(e) {
      ((this._radiusX = e),
        this.setPoints(fc(this._radiusX, this._radiusY, this._step)));
    }
    get radiusY() {
      return this._radiusY;
    }
    set radiusY(e) {
      ((this._radiusY = e),
        this.setPoints(fc(this._radiusX, this._radiusY, this._step)));
    }
    center() {}
    updateConvex() {}
  },
  Ic = class extends Pc {
    constructor(e, t, n, r) {
      (super(e, pc(t, n), r),
        (this.type = Bs.Box),
        (this.typeGroup = Y.Box),
        (this.isConvex = !0),
        (this._width = t),
        (this._height = n));
    }
    get width() {
      return this._width;
    }
    set width(e) {
      ((this._width = e), this.afterUpdateSize());
    }
    get height() {
      return this._height;
    }
    set height(e) {
      ((this._height = e), this.afterUpdateSize());
    }
    afterUpdateSize() {
      this.setPoints(pc(this._width, this._height));
    }
    updateConvex() {}
  },
  Lc = class extends Ic {
    constructor(e, t) {
      (super(mc(e), 0.001, 0.001, t),
        (this.type = Bs.Point),
        (this.typeGroup = Y.Point));
    }
  },
  Rc = class extends Pc {
    constructor(e, t, n) {
      if (
        (super(
          e,
          [
            { x: 0, y: 0 },
            { x: t.x - e.x, y: t.y - e.y },
          ],
          n,
        ),
        (this.type = Bs.Line),
        (this.typeGroup = Y.Line),
        (this.isConvex = !0),
        this.calcPoints.length === 1 || !t)
      )
        throw (
          console.error({ start: e, end: t }),
          Error(`No end point for line provided`)
        );
    }
    get start() {
      return {
        x: this.x + this.calcPoints[0].x,
        y: this.y + this.calcPoints[0].y,
      };
    }
    set start({ x: e, y: t }) {
      ((this.x = e), (this.y = t));
    }
    get end() {
      return {
        x: this.x + this.calcPoints[1].x,
        y: this.y + this.calcPoints[1].y,
      };
    }
    set end({ x: e, y: t }) {
      ((this.points[1].x = e - this.start.x),
        (this.points[1].y = t - this.start.y),
        this.setPoints(this.points));
    }
    getCentroid() {
      return new q.Vector(
        (this.end.x - this.start.x) / 2,
        (this.end.y - this.start.y) / 2,
      );
    }
    updateConvex() {}
  },
  zc = class extends ds {
    createPoint(e, t, n) {
      let r = new (n || Lc)(e, t);
      return (this.insert(r), r);
    }
    createLine(e, t, n, r) {
      let i = new (r || Rc)(e, t, n);
      return (this.insert(i), i);
    }
    createCircle(e, t, n, r) {
      let i = new (r || Nc)(e, t, n);
      return (this.insert(i), i);
    }
    createBox(e, t, n, r, i) {
      let a = new (i || Ic)(e, t, n, r);
      return (this.insert(a), a);
    }
    createEllipse(e, t, n = t, r, i, a) {
      let o = new (a || Fc)(e, t, n, r, i);
      return (this.insert(o), o);
    }
    createPolygon(e, t, n, r) {
      let i = new (r || Pc)(e, t, n);
      return (this.insert(i), i);
    }
    insert(e) {
      if (((e.bbox = e.getAABBAsBBox()), e.system)) {
        if (!yc(e)) return this;
        e.system.remove(e);
      }
      return (
        (e.minX = e.bbox.minX - e.padding),
        (e.minY = e.bbox.minY - e.padding),
        (e.maxX = e.bbox.maxX + e.padding),
        (e.maxY = e.bbox.maxY + e.padding),
        super.insert(e)
      );
    }
    updateBody(e) {
      e.updateBody();
    }
    update() {
      Vs(this.all(), (e) => {
        this.updateBody(e);
      });
    }
    draw(e) {
      Vs(this.all(), (t) => {
        t.draw(e);
      });
    }
    drawBVH(e, t = !0) {
      let n = (r) => {
        (kc(e, r, t), r.children && Vs(r.children, n));
      };
      Vs(this.data.children, n);
    }
    remove(e, t) {
      return ((e.system = void 0), super.remove(e, t));
    }
    getPotentials(e) {
      return Ws(this.search(e), (t) => t !== e);
    }
    traverse(e, { children: t } = this.data) {
      return t?.find((n, r) => {
        if (!n) return !1;
        if (n.typeGroup && e(n, t, r)) return !0;
        n.children && this.traverse(e, n);
      });
    }
  },
  Bc = class extends zc {
    constructor() {
      (super(...arguments), (this.response = new q.Response()));
    }
    insert(e) {
      let t = super.insert(e);
      return ((e.system = this), t);
    }
    separate(e = Ac, t = this.response) {
      Vs(this.all(), (n) => {
        this.separateBody(n, e, t);
      });
    }
    separateBody(e, t = Ac, n = this.response) {
      if (e.isStatic && !e.isTrigger) return;
      let r = { x: 0, y: 0 };
      (this.checkOne(
        e,
        (n) => {
          t(n) &&
            !e.isTrigger &&
            !n.b.isTrigger &&
            ((r.x += n.overlapV.x), (r.y += n.overlapV.y));
        },
        n,
      ),
        (r.x || r.y) && e.setPosition(e.x - r.x, e.y - r.y));
    }
    checkOne(e, t = Ac, n = this.response) {
      return e.isStatic && !e.isTrigger
        ? !1
        : Hs(this.search(e), (r) => {
            if (r !== e && this.checkCollision(e, r, n)) return t(n);
          });
    }
    checkArea(e, t = Ac, n = this.response) {
      return Hs(this.search(e), (e) => this.checkOne(e, t, n));
    }
    checkAll(e = Ac, t = this.response) {
      return Hs(this.all(), (n) => this.checkOne(n, e, t));
    }
    checkCollision(e, t, n = this.response) {
      let { bbox: r, padding: i } = e,
        { bbox: a, padding: o } = t;
      if (!r || !a || !xc(e, t) || ((i || o) && bc(r, a))) return !1;
      let s = Ec(e, t);
      if (e.isConvex && t.isConvex) return (n.clear(), s(e, t, n));
      let c = qs(e),
        l = qs(t),
        u = 0,
        d = 0,
        f = !1;
      if (
        (Vs(c, (e) => {
          Vs(l, (t) => {
            (n.clear(),
              s(e, t, n) &&
                ((f = !0), (u += n.overlapV.x), (d += n.overlapV.y)));
          });
        }),
        f)
      ) {
        let r = new q.Vector(u, d);
        ((n.a = e),
          (n.b = t),
          (n.overlapV.x = u),
          (n.overlapV.y = d),
          (n.overlapN = r.normalize()),
          (n.overlap = r.len()),
          (n.aInB = Sc(e, t)),
          (n.bInA = Sc(t, e)));
      }
      return f;
    }
    raycast(e, t, n = Ac) {
      let r = 1 / 0,
        i;
      return (
        this.ray
          ? ((this.ray.start = e), (this.ray.end = t))
          : (this.ray = new Rc(e, t, { isTrigger: !0 })),
        this.insert(this.ray),
        this.checkOne(this.ray, ({ b: t }) => {
          if (!n(t, this.ray)) return !1;
          Vs(
            t.typeGroup === Y.Circle ? $s(this.ray, t) : tc(this.ray, t),
            (n) => {
              let a = gc(e, n);
              a < r && ((r = a), (i = { point: n, body: t }));
            },
          );
        }),
        this.remove(this.ray),
        i
      );
    }
    getCollisionPoints(e, t) {
      let n = [];
      if (
        (e.typeGroup === Y.Circle &&
          t.typeGroup === Y.Circle &&
          n.push(...nc(e, t)),
        e.typeGroup === Y.Circle && t.typeGroup !== Y.Circle)
      )
        for (let r = 0; r < t.calcPoints.length; r++) {
          let i = t.getEdge(r);
          n.push(...$s(i, e));
        }
      if (e.typeGroup !== Y.Circle)
        for (let r = 0; r < e.calcPoints.length; r++) {
          let i = e.getEdge(r);
          if (t.typeGroup === Y.Circle) n.push(...$s(i, t));
          else
            for (let e = 0; e < t.calcPoints.length; e++) {
              let r = ec(i, t.getEdge(e));
              r && n.push(r);
            }
        }
      return n.filter(
        ({ x: e, y: t }, r) => r === n.findIndex((n) => dc(n, { x: e, y: t })),
      );
    }
  };
