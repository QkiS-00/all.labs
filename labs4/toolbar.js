const SVG_NS = 'http://www.w3.org/2000/svg';

export class Toolbar {
  constructor(element, registry, onSelect) {
    this.element = element;
    this.registry = registry;
    this.onSelect = onSelect;
    this.buttons = [];
    this.build();
    element.addEventListener('click', (e) => this.onClick(e));
  }

  build() {
    for (const type of this.registry.list()) {
      const button = document.createElement('button');
      button.dataset.shape = type.id;
      button.dataset.tooltip = type.label;
      button.setAttribute('aria-label', type.label);
      button.setAttribute('aria-pressed', 'false');
      button.appendChild(this.createIcon(type.icon));
      this.element.appendChild(button);
      this.buttons.push(button);
    }
  }

  createIcon(parts) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    for (const [tag, attributes] of parts) {
      const element = document.createElementNS(SVG_NS, tag);
      for (const [name, value] of Object.entries(attributes)) {
        element.setAttribute(name, String(value));
      }
      svg.appendChild(element);
    }
    return svg;
  }

  onClick(event) {
    const button = event.target.closest('button[data-shape]');
    if (!button || !this.element.contains(button)) return;
    this.onSelect(button.dataset.shape);
  }

  onNotify(type) {
    for (const button of this.buttons) {
      const active = button.dataset.shape === type;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
  }
}