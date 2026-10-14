// Game 40 — events
// Lines 20462-20487 of readable/assets/Game-CrsSKcAK.pretty.js (statement-aligned).
(new (class {
  constructor(e = 0) {
    ((this.events = []),
      (this.delay = e),
      (this.toc = () => {
        this.events.length &&
          (this.events.forEach((e) => {
            e();
          }),
          this.tic());
      }));
  }
  tic() {
    this.events.length && setTimeout(this.toc, this.delay);
  }
  add(e) {
    (this.events.push(e), this.events.length === 1 && this.tic());
  }
  clear() {
    for (; this.events.length;) this.events.pop();
  }
})(),
  q.Response,
  q.Circle,
  q.Polygon,
  q.Vector);
