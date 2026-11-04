import {
  PointShape, LineShape, RectShape, EllipseShape, LineWithCirclesShape, CubeShape
} from './shapes.js';

export function registerAllShapes(registry) {
  registry.register({
    id: 'point',
    label: 'Крапка',
    create: () => new PointShape(),
    icon: [['circle', { cx: 12, cy: 12, r: 3.5, fill: '#000' }]]
  });

  registry.register({
    id: 'line',
    label: 'Лінія',
    create: () => new LineShape(),
    icon: [['line', { x1: 4, y1: 20, x2: 20, y2: 4, stroke: '#000', 'stroke-width': 2 }]]
  });

  registry.register({
    id: 'rect',
    label: 'Прямокутник',
    create: () => new RectShape(),
    icon: [['rect', { x: 4, y: 6, width: 16, height: 12, fill: 'none', stroke: '#000', 'stroke-width': 2 }]]
  });

  registry.register({
    id: 'ellipse',
    label: 'Еліпс',
    create: () => new EllipseShape(),
    icon: [['ellipse', { cx: 12, cy: 12, rx: 9, ry: 6, fill: '#808080', stroke: '#000', 'stroke-width': 2 }]]
  });

  registry.register({
    id: 'linecircles',
    label: 'Лінія з кружечками',
    create: () => new LineWithCirclesShape(),
    icon: [
      ['line', { x1: 6, y1: 18, x2: 18, y2: 6, stroke: '#1b7f3b', 'stroke-width': 2 }],
      ['circle', { cx: 6, cy: 18, r: 3.5, fill: '#a8e6b9', stroke: '#1b7f3b', 'stroke-width': 1.5 }],
      ['circle', { cx: 18, cy: 6, r: 3.5, fill: '#a8e6b9', stroke: '#1b7f3b', 'stroke-width': 1.5 }]
    ]
  });

  registry.register({
    id: 'cube',
    label: 'Каркас куба',
    create: () => new CubeShape(),
    icon: [
      ['rect', { x: 8, y: 3, width: 12, height: 12, fill: 'none', stroke: '#1f4e9c', 'stroke-width': 1.5 }],
      ['rect', { x: 3, y: 8, width: 12, height: 12, fill: 'none', stroke: '#1f4e9c', 'stroke-width': 1.5 }],
      ['line', { x1: 3, y1: 8, x2: 8, y2: 3, stroke: '#1f4e9c', 'stroke-width': 1.5 }],
      ['line', { x1: 15, y1: 8, x2: 20, y2: 3, stroke: '#1f4e9c', 'stroke-width': 1.5 }],
      ['line', { x1: 3, y1: 20, x2: 8, y2: 15, stroke: '#1f4e9c', 'stroke-width': 1.5 }],
      ['line', { x1: 15, y1: 20, x2: 20, y2: 15, stroke: '#1f4e9c', 'stroke-width': 1.5 }]
    ]
  });
}