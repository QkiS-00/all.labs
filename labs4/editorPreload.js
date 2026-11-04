const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('editorApi', {
  onSetShape: (callback) => {
    ipcRenderer.on('set-shape', (_event, type) => callback(String(type)));
  },
  selectShape: (type) => {
    ipcRenderer.send('toolbar:select', String(type));
  },
  registerShapes: (list) => {
    const plain = Array.from(list, (item) => ({ id: String(item.id), label: String(item.label) }));
    ipcRenderer.send('shapes:register', plain);
  }
});