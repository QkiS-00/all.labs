const N = 124;

export class MyEditor {
  constructor(canvas, registry) {
    this.canvas = canvas;
    this.registry = registry;
    this.ctx = canvas.getContext('2d');

    this.pcshape = null;
    this.count = 0;
    this.allocate();

    this.currentType = registry.firstId();
    this.rubber = null;

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('beforeunload', () => this.onUnload());

    this.onResize();
  }

  allocate() {
    this.pcshape = new Array(N).fill(null);
    this.count = 0;
  }

  release() {
    this.pcshape = null;
    this.count = 0;
  }
  onNotify(type) {
    if (this.registry.has(type)) this.currentType = type;
  }

  pos(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  onMouseDown(e) {
    if (e.button !== 0 || !this.pcshape) return;
    const p = this.pos(e);
    this.rubber = this.registry.create(this.currentType);
    this.rubber.set(p.x, p.y, p.x, p.y);
    this.repaint();
  }

  onMouseMove(e) {
    if (!this.rubber) return;
    const p = this.pos(e);
    this.rubber.set(this.rubber.x1, this.rubber.y1, p.x, p.y);
    this.repaint();
  }

  onMouseUp(e) {
    if (!this.rubber) return;
    const p = this.pos(e);
    this.rubber.set(this.rubber.x1, this.rubber.y1, p.x, p.y);
    if (this.pcshape && this.count < N) {
      this.pcshape[this.count++] = this.rubber;
    }
    this.rubber = null;
    this.repaint();
  }

  onResize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.repaint();
  }

  onUnload() {
    this.release();
  }

  repaint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.pcshape) return;
    for (let i = 0; i < this.count; i++) {
      this.pcshape[i].show(this.ctx);
    }
    if (this.rubber) {
      this.rubber.showRubber(this.ctx);
    }
  }
}