export class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new TypeError('Shape — абстрактний клас, створіть його нащадка');
    }
    this.x1 = 0; this.y1 = 0;
    this.x2 = 0; this.y2 = 0;
    this.stroke = 'black'; 
    this.fill = null;      
  }

  set(x1, y1, x2, y2) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }

  path(ctx) {
    throw new Error('Метод path() не реалізовано');
  }
  show(ctx) {
    throw new Error('Метод show() не реалізовано');
  }

  showRubber(ctx) {
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    ctx.stroke();
    ctx.restore();
  }
}

export class PointShape extends Shape {
  path(ctx) {
    ctx.moveTo(this.x1 + 2, this.y1);
    ctx.arc(this.x1, this.y1, 2, 0, Math.PI * 2);
  }
  show(ctx) {
    ctx.save();
    ctx.fillStyle = this.stroke;
    ctx.beginPath();
    this.path(ctx);
    ctx.fill();
    ctx.restore();
  }
  showRubber(ctx) {}
}

export class LineShape extends Shape {
  path(ctx) {
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
  }
  show(ctx) {
    ctx.save();
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    ctx.stroke();
    ctx.restore();
  }
}

export class RectShape extends Shape {
  set(x1, y1, x2, y2) {
    super.set(x1, y1, x2, y2);
    this.left = Math.min(x1, x2);
    this.top = Math.min(y1, y2);
    this.width = Math.abs(x2 - x1);
    this.height = Math.abs(y2 - y1);
  }
  path(ctx) {
    ctx.rect(this.left, this.top, this.width, this.height);
  }
  show(ctx) {
    ctx.save();
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
    ctx.stroke();
    ctx.restore();
  }
}

export class EllipseShape extends Shape {
  constructor() {
    super();
    this.fill = 'gray';
  }
  set(x1, y1, x2, y2) {
    super.set(x1, y1, x2, y2);
    this.cx = x1;
    this.cy = y1;
    this.rx = Math.abs(x2 - x1);
    this.ry = Math.abs(y2 - y1);
  }
  path(ctx) {
    ctx.moveTo(this.cx + this.rx, this.cy);
    ctx.ellipse(this.cx, this.cy, this.rx, this.ry, 0, 0, Math.PI * 2);
  }
  show(ctx) {
    ctx.save();
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = 1;
    ctx.beginPath();
    this.path(ctx);
    if (this.fill) {
      ctx.fillStyle = this.fill;
      ctx.fill();
    }
    ctx.stroke();
    ctx.restore();
  }
}

export class CompositeShape extends Shape {
  constructor() {
    super();
    if (new.target === CompositeShape) {
      throw new TypeError('CompositeShape — абстрактний клас, створіть його нащадка');
    }
    this.parts = [];
  }
  path(ctx) {
    for (const part of this.parts) {
      part.path(ctx);
    }
  }
  show(ctx) {
    for (const part of this.parts) {
      part.show(ctx);
    }
  }
}

export class LineWithCirclesShape extends CompositeShape {
  constructor() {
    super();
    this.radius = 6;
    this.line = new LineShape();
    this.circle1 = new EllipseShape();
    this.circle2 = new EllipseShape();

    this.line.stroke = '#1b7f3b';
    for (const circle of [this.circle1, this.circle2]) {
      circle.stroke = '#1b7f3b';
      circle.fill = '#a8e6b9';
    }
    this.parts = [this.line, this.circle1, this.circle2];
  }
  set(x1, y1, x2, y2) {
    super.set(x1, y1, x2, y2);
    this.line.set(x1, y1, x2, y2);
    this.circle1.set(x1, y1, x1 + this.radius, y1 + this.radius);
    this.circle2.set(x2, y2, x2 + this.radius, y2 + this.radius);
  }
}

export class CubeShape extends CompositeShape {
  constructor() {
    super();
    this.back = new RectShape();
    this.front = new RectShape();
    this.edges = [new LineShape(), new LineShape(), new LineShape(), new LineShape()];

    for (const part of [this.back, this.front, ...this.edges]) {
      part.stroke = '#1f4e9c';
    }
    this.parts = [this.back, ...this.edges, this.front];
  }
  set(x1, y1, x2, y2) {
    super.set(x1, y1, x2, y2);
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const right = Math.max(x1, x2);
    const bottom = Math.max(y1, y2);
    const depth = Math.min(right - left, bottom - top) * 0.3;

    this.front.set(left, top + depth, right - depth, bottom);
    this.back.set(left + depth, top, right, bottom - depth);

    this.edges[0].set(left, top + depth, left + depth, top);
    this.edges[1].set(right - depth, top + depth, right, top);
    this.edges[2].set(left, bottom, left + depth, bottom - depth);
    this.edges[3].set(right - depth, bottom, right, bottom - depth);
  }
}