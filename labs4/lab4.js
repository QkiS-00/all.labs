const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_NAME = 'Lab4';
const MAX_SHAPES = 32;

class EditorApp {
  constructor() {
    this.win = null;
    this.shapes = [];     
    this.current = null;  
    this.shapeItems = [];  
  }

  start() {
    app.whenReady().then(() => this.createWindow());
    app.on('window-all-closed', () => app.quit());
  }

  createWindow() {
    const preload = path.join(__dirname, 'editorPreload.js');
    if (!fs.existsSync(preload)) {
      throw new Error('Не знайдено файл editorPreload.js поруч з lab4.js: ' + preload);
    }

    this.win = new BrowserWindow({
      width: 900,
      height: 600,
      title: APP_NAME,
      webPreferences: {
        preload,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    });
    this.win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    this.win.webContents.on('will-navigate', (event) => event.preventDefault());

    ipcMain.on('shapes:register', (event, list) => this.onRegisterShapes(event, list));
    ipcMain.on('toolbar:select', (event, id) => this.onToolbarSelect(event, id));

    Menu.setApplicationMenu(null);
    this.win.loadFile('index.html');
  }

  validateShapes(list) {
    if (!Array.isArray(list) || list.length === 0 || list.length > MAX_SHAPES) return null;
    const ids = new Set();
    const result = [];
    for (const item of list) {
      if (!item || typeof item.id !== 'string' || typeof item.label !== 'string') return null;
      if (!/^[a-z][a-z0-9_-]{0,31}$/.test(item.id) || ids.has(item.id)) return null;
      if (item.label.length === 0 || item.label.length > 40) return null;
      ids.add(item.id);
      result.push({ id: item.id, label: item.label });
    }
    return result;
  }

  onRegisterShapes(event, list) {
    if (!this.win || event.sender !== this.win.webContents) return;
    const shapes = this.validateShapes(list);
    if (!shapes) return;
    this.shapes = shapes;
    this.current = shapes[0].id;
    this.createMenu();
    this.notifyPage();
  }

  createMenu() {
    const template = [
      {
        label: 'Файл',
        submenu: [{ label: 'Вийти', role: 'quit' }]
      },
      {
        label: 'Об’єкти',
        submenu: this.shapes.map((shape) => ({
          id: shape.id,
          label: shape.label,
          type: 'radio',
          checked: shape.id === this.current,
          click: () => this.onMenuSelect(shape.id)
        }))
      },
      {
        label: 'Довідка',
        submenu: [{ label: 'Про програму', click: () => this.onAbout() }]
      }
    ];

    const menu = Menu.buildFromTemplate(template);
    const objectsMenu = menu.items[1].submenu;
    this.shapeItems = objectsMenu.items;
    objectsMenu.on('menu-will-show', () => this.onInitMenuPopup());
    Menu.setApplicationMenu(menu);
  }

  onMenuSelect(id) {
    this.selectShape(id);
  }

  onToolbarSelect(event, id) {
    if (!this.win || event.sender !== this.win.webContents) return;
    this.selectShape(id);
  }

  onAbout() {
    dialog.showMessageBox(this.win, {
      type: 'info',
      title: 'Про програму',
      message: 'Lab4 — графічний редактор об’єктів',
      detail: 'Оберіть тип об’єкта в меню «Об’єкти» або на панелі інструментів і малюйте мишею.'
    });
  }

  onInitMenuPopup() {
    const item = this.shapeItems.find((i) => i.id === this.current);
    if (item) item.checked = true;
  }

  selectShape(id) {
    if (!this.shapes.some((shape) => shape.id === id)) return;
    this.current = id;
    this.onInitMenuPopup();
    this.notifyPage();
  }

  notifyPage() {
    if (this.win && !this.win.isDestroyed() && this.current) {
      this.win.webContents.send('set-shape', this.current);
    }
  }
}

new EditorApp().start();