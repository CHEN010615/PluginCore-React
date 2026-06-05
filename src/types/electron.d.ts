import type { Channels } from '@electron/common/channels'

export interface ElectronAPI {
  platform: string

  // IPC 通信方法
  invoke: (channel: Channels, ...args: unknown[]) => Promise<unknown>
  send: (channel: Channels, ...args: unknown[]) => void
  on: (channel: Channels, callback: (...args: unknown[]) => void) => () => void
  once: (channel: Channels, callback: (...args: unknown[]) => void) => void
  removeListener: (channel: Channels, callback: (...args: unknown[]) => void) => void
  removeAllListeners: (channel: Channels) => void

  // 窗口控制
  minimize: () => void
  maximize: () => void
  unmaximize: () => void
  isMaximized: () => Promise<boolean>
  close: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
