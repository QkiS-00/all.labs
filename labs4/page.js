import { MyEditor } from './editor.js';
import { Toolbar } from './toolbar.js';
import { ShapeRegistry } from './registry.js';
import { registerAllShapes } from './shapeTypes.js';

const registry = new ShapeRegistry();
registerAllShapes(registry);

const myEditor = new MyEditor(document.getElementById('canvas'), registry);

class EditorPage {
  constructor(editor, shapes) {
    this.editor = editor;
    this.toolbar = new Toolbar(
      document.getElementById('toolbar'),
      shapes,
      (type) => window.editorApi.selectShape(type)
    );
    window.editorApi.onSetShape((type) => this.onNotify(type));
    window.editorApi.registerShapes(shapes.describe());
  }

  onNotify(type) {
    this.editor.onNotify(type);
    this.toolbar.onNotify(type);
  }
}

new EditorPage(myEditor, registry);