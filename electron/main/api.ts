import { ipcMain, BrowserWindow } from 'electron'
import os from 'os'
import { execSync } from 'child_process'
import { CHANNELS } from '../common/channels'

const Store = require('electron-store').default
const store = new Store()

let mainWindow: BrowserWindow | null = null
let previousNetworkSample: { rxBytes: number; txBytes: number; timestamp: number } | null = null
let previousCpuTimes: Array<{ idle: number; total: number }> | null = null

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
    const cpuUsage = getCpuUsage(cpus)
    const networkSample = getNetworkSample()
    const networkRate = getNetworkRate(networkSample)
    
    return {
      hostname: os.hostname(),
      cpu: {
        model: cpus[0]?.model || 'Unknown',
        speed: cpus[0]?.speed || 0,
        cores: cpus.length,
        usage: cpuUsage
      },
      memory: {
        total: totalmem,
        free: freemem,
        used: usedmem,
        usagePercent: ((usedmem / totalmem) * 100).toFixed(2)
      },
      network: {
        interfaces: Object.keys(os.networkInterfaces()),
        rxBytesPerSec: networkRate.rxBytesPerSec,
        txBytesPerSec: networkRate.txBytesPerSec
      },
      storage: getStorageDevices(),
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

function getCpuUsage(cpus: os.CpuInfo[]) {
  const currentCpuTimes = cpus.map(cpu => {
    const total = cpu.times.idle + cpu.times.user + cpu.times.nice + cpu.times.irq + cpu.times.sys

    return { idle: cpu.times.idle, total }
  })

  if (!previousCpuTimes) {
    previousCpuTimes = currentCpuTimes

    return cpus.map(cpu => {
      const total = cpu.times.idle + cpu.times.user + cpu.times.nice + cpu.times.irq + cpu.times.sys
      return ((total - cpu.times.idle) / total * 100).toFixed(2)
    })
  }

  const usage = currentCpuTimes.map((current, index) => {
    const previous = previousCpuTimes?.[index]

    if (!previous) {
      return '0.00'
    }

    const totalDelta = current.total - previous.total
    const idleDelta = current.idle - previous.idle

    if (totalDelta <= 0) {
      return '0.00'
    }

    return (((totalDelta - idleDelta) / totalDelta) * 100).toFixed(2)
  })

  previousCpuTimes = currentCpuTimes

  return usage
}

function getNetworkSample() {
  if (process.platform === 'darwin') {
    return getDarwinNetworkSample()
  }

  if (process.platform === 'linux') {
    return getLinuxNetworkSample()
  }

  return { rxBytes: 0, txBytes: 0, timestamp: Date.now() }
}

function getNetworkRate(sample: { rxBytes: number; txBytes: number; timestamp: number }) {
  if (!previousNetworkSample) {
    previousNetworkSample = sample
    return { rxBytesPerSec: 0, txBytesPerSec: 0 }
  }

  const elapsedSeconds = Math.max((sample.timestamp - previousNetworkSample.timestamp) / 1000, 1)
  const rxBytesPerSec = Math.max(0, (sample.rxBytes - previousNetworkSample.rxBytes) / elapsedSeconds)
  const txBytesPerSec = Math.max(0, (sample.txBytes - previousNetworkSample.txBytes) / elapsedSeconds)

  previousNetworkSample = sample

  return { rxBytesPerSec, txBytesPerSec }
}

function getDarwinNetworkSample() {
  try {
    const output = execSync('netstat -ibn', { encoding: 'utf8' })
    const rows = output.trim().split('\n').slice(1)
    const totals = rows.reduce(
      (acc, row) => {
        const columns = row.trim().split(/\s+/)
        const iface = columns[0]
        const ibytes = Number(columns[6])
        const obytes = Number(columns[9])

        if (!iface?.startsWith('lo') && Number.isFinite(ibytes) && Number.isFinite(obytes)) {
          acc.rxBytes += ibytes
          acc.txBytes += obytes
        }

        return acc
      },
      { rxBytes: 0, txBytes: 0 }
    )

    return { ...totals, timestamp: Date.now() }
  } catch {
    return { rxBytes: 0, txBytes: 0, timestamp: Date.now() }
  }
}

function getLinuxNetworkSample() {
  try {
    const output = execSync('cat /proc/net/dev', { encoding: 'utf8' })
    const rows = output.trim().split('\n').slice(2)
    const totals = rows.reduce(
      (acc, row) => {
        const [ifaceRaw, dataRaw] = row.split(':')
        const iface = ifaceRaw.trim()
        const columns = dataRaw.trim().split(/\s+/).map(Number)

        if (!iface.startsWith('lo') && Number.isFinite(columns[0]) && Number.isFinite(columns[8])) {
          acc.rxBytes += columns[0]
          acc.txBytes += columns[8]
        }

        return acc
      },
      { rxBytes: 0, txBytes: 0 }
    )

    return { ...totals, timestamp: Date.now() }
  } catch {
    return { rxBytes: 0, txBytes: 0, timestamp: Date.now() }
  }
}

function getStorageDevices() {
  if (process.platform === 'darwin' || process.platform === 'linux') {
    try {
      const output = execSync('df -kP', { encoding: 'utf8' })

      return output
        .trim()
        .split('\n')
        .slice(1)
        .filter(row => row.includes(' /'))
        .map(row => {
          const columns = row.trim().split(/\s+/)
          const total = Number(columns[1]) * 1024
          const used = Number(columns[2]) * 1024
          const mount = columns[5]

          return {
            name: mount === '/' ? 'System Disk' : mount,
            total,
            used,
            usagePercent: total > 0 ? (used / total) * 100 : 0
          }
        })
        .filter(device => device.total > 0)
    } catch {
      return []
    }
  }

  return []
}
