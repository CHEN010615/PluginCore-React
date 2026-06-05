import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { registerIPCHandlers, setMainWindow } from './api'
import { createTray } from './tray'

function createWindow(): BrowserWindow {
  const isMac = process.platform === 'darwin'
  const win = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 960,
    minHeight: 600,
    ...(isMac
      ? {
          titleBarStyle: 'hiddenInset' as const,
          trafficLightPosition: { x: 14, y: 12 }
        }
      : {
          frame: false
        }),
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
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    // win.webContents.openDevTools();
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
