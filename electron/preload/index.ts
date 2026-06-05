import { contextBridge, ipcRenderer } from 'electron'
import type { Channels } from '../common/channels'

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  // IPC 通信方法
  invoke: (channel: Channels, ...args: unknown[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  send: (channel: Channels, ...args: unknown[]) => {
    ipcRenderer.send(channel, ...args)
  },
  on: (channel: Channels, callback: (...args: unknown[]) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args)
    ipcRenderer.on(channel, subscription)
    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
  once: (channel: Channels, callback: (...args: unknown[]) => void) => {
    ipcRenderer.once(channel, (_event: Electron.IpcRendererEvent, ...args: unknown[]) => callback(...args))
  },
  removeListener: (channel: Channels, callback: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, callback)
  },
  removeAllListeners: (channel: Channels) => {
    ipcRenderer.removeAllListeners(channel)
  },

  // 窗口控制方法
  minimize: () => {
    ipcRenderer.send('window:minimize' as Channels)
  },
  maximize: () => {
    ipcRenderer.send('window:maximize' as Channels)
  },
  unmaximize: () => {
    ipcRenderer.send('window:unmaximize' as Channels)
  },
  isMaximized: (): Promise<boolean> => {
    return ipcRenderer.invoke('window:is-maximized' as Channels)
  },
  close: () => {
    ipcRenderer.send('window:close' as Channels)
  }
})
