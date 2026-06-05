import { ipcMain, BrowserWindow } from 'electron'
import os from 'os'
import { CHANNELS } from '../common/channels'

const Store = require('electron-store').default
const store = new Store()

let mainWindow: BrowserWindow | null = null

export function setMainWindow(win: BrowserWindow) {
  mainWindow = win

  const sendWindowState = () => {
    if (win.isDestroyed()) {
      return
    }

    win.webContents.send(CHANNELS.WINDOW_STATE_CHANGED, {
      isMaximized: win.isMaximized(),
      isFullScreen: win.isFullScreen()
    })
  }

  win.webContents.once('did-finish-load', sendWindowState)
  win.on('maximize', sendWindowState)
  win.on('unmaximize', sendWindowState)
  win.on('enter-full-screen', sendWindowState)
  win.on('leave-full-screen', sendWindowState)
}

// 注册所有 IPC 处理器
export function registerIPCHandlers() {
  // electron-store 相关
  ipcMain.handle(CHANNELS.STORE_GET, (_, key: string) => {
    return store.get(key)
  })

  ipcMain.handle(CHANNELS.STORE_SET, (_, key: string, value: unknown) => {
    store.set(key, value)
  })

  ipcMain.handle(CHANNELS.STORE_DELETE, (_, key: string) => {
    store.delete(key)
  })

  // electron-updater 相关
  ipcMain.handle(CHANNELS.UPDATER_CHECK, () => {
    return 'check'
  })

  // 系统信息相关
  ipcMain.handle(CHANNELS.SYSTEM_OS, () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: os.version(),
      release: os.release(),
      type: os.type()
    }
  })

  ipcMain.handle(CHANNELS.SYSTEM_NODE, () => {
    return {
      version: process.versions.node,
      electron: process.versions.electron,
      v8: process.versions.v8,
      uv: process.versions.uv,
      zlib: process.versions.zlib,
      openssl: process.versions.openssl
    }
  })

  // 系统性能相关
  ipcMain.handle(CHANNELS.SYSTEM_PERFORMANCE, () => {
    const cpus = os.cpus()
    const totalmem = os.totalmem()
    const freemem = os.freemem()
    const usedmem = totalmem - freemem
    
    return {
      hostname: os.hostname(),
      cpu: {
        model: cpus[0]?.model || 'Unknown',
        speed: cpus[0]?.speed || 0,
        cores: cpus.length,
        usage: cpus.map(cpu => {
          const total = cpu.times.idle + cpu.times.user + cpu.times.nice + cpu.times.irq + cpu.times.sys
          const idle = cpu.times.idle
          return ((total - idle) / total * 100).toFixed(2)
        })
      },
      memory: {
        total: totalmem,
        free: freemem,
        used: usedmem,
        usagePercent: ((usedmem / totalmem) * 100).toFixed(2)
      },
      network: {
        interfaces: Object.keys(os.networkInterfaces())
      },
      uptime: os.uptime(),
      loadavg: os.loadavg()
    }
  })

  // 窗口控制相关
  ipcMain.on(CHANNELS.WINDOW_MINIMIZE, () => {
    mainWindow?.minimize()
  })

  ipcMain.on(CHANNELS.WINDOW_MAXIMIZE, () => {
    mainWindow?.maximize()
  })

  ipcMain.on(CHANNELS.WINDOW_UNMAXIMIZE, () => {
    mainWindow?.unmaximize()
  })

  ipcMain.handle(CHANNELS.WINDOW_IS_MAXIMIZED, () => {
    return mainWindow?.isMaximized() ?? false
  })

  ipcMain.on(CHANNELS.WINDOW_CLOSE, () => {
    mainWindow?.close()
  })
}
