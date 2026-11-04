export class ShapeRegistry {
  constructor() {
    this.types = new Map();
  }
  register(type) {
    if (!type || typeof type.id !== 'string' || typeof type.label !== 'string' ||
        typeof type.create !== 'function') {
      throw new TypeError('Некоректний опис типу фігури');
    }
    if (this.types.has(type.id)) {
      throw new Error('Тип фігури вже зареєстровано: ' + type.id);
    }
    this.types.set(type.id, type);
  }

  has(id) {
    return this.types.has(id);
  }

  create(id) {
    return this.types.get(id).create();
  }

  firstId() {
    return this.types.keys().next().value;
  }

  list() {
    return Array.from(this.types.values());
  }
  
  describe() {
    return this.list().map((type) => ({ id: type.id, label: type.label }));
  }
}