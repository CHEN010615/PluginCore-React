import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { registerIPCHandlers, setMainWindow } from './api'
import { createTray } from './tray'

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: false,
    frame: false,
    transparent: false,
    backgroundColor: '#081425',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webviewTag: true
    }
  });

  setMainWindow(win)

  win.show();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools();
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(__dirname, '../../dist/index.html'));
  }

  return win;
}

// 注册 IPC 处理器
registerIPCHandlers()

app.whenReady().then(() => {
  const window = createWindow();
  // 创建系统托盘
  createTray(window);
});

app.on("activate", () => {
  if (!BrowserWindow.getAllWindows().length) {
    createWindow();
  }
}).on("window-all-closed", () => {
  app.quit();
});
