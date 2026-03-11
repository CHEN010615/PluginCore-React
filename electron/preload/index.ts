/**
 * 预加载脚本
 * 通过 contextBridge 向渲染进程暴露安全的 API
 */
import { contextBridge, ipcRenderer } from 'electron'

/**
 * 用于 invoke 操作的有效 IPC 通道
 */
const validInvokeChannels = [
  // 系统
  'system:os:getInfo',
  'system:node:getInfo',
] as const

/**
 * 用于事件监听的有效 IPC 通道
 */
const validEventChannels = [
  // 系统事件
  'system:ready',
  'system:notification',
] as const

/**
 * 暴露给渲染进程的 IPC 渲染器方法
 */
const electronAPI = {
  /**
   * IPC 调用（请求 - 响应模式）
   */
  invoke: async (channel: string, ...args: unknown[]) => {
    if (validInvokeChannels.includes(channel as any)) {
      return ipcRenderer.invoke(channel, ...args)
    }
    throw new Error(`无效的 IPC 通道：${channel}`)
  },

  /**
   * 监听来自主进程的事件
   */
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    if (validEventChannels.includes(channel as any)) {
      const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => {
        callback(...args)
      }
      ipcRenderer.on(channel, subscription)

      // 返回取消订阅函数
      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    }
    throw new Error(`无效的 IPC 通道：${channel}`)
  },

  /**
   * 监听单次事件（来自渲染进程）
   */
  once: (channel: string, callback: (...args: unknown[]) => void) => {
    if (validEventChannels.includes(channel as any)) {
      ipcRenderer.once(channel, (_event, ...args) => callback(...args))
      return
    }
    throw new Error(`无效的 IPC 通道：${channel}`)
  },

  /**
   * 移除通道的所有监听器
   */
  off: (channel: string, callback?: (...args: unknown[]) => void) => {
    if (callback) {
      ipcRenderer.removeListener(channel, callback as any)
    } else {
      ipcRenderer.removeAllListeners(channel)
    }
  },

  /**
   * 系统 API
   */
  system: {
    os: {
      getInfo: () => electronAPI.invoke('system:os:getInfo')
    },
    node: {
      getInfo: () => electronAPI.invoke('system:node:getInfo')
    }
  },

  /**
   * 获取当前平台
   */
  platform: process.platform,

  /**
   * 检查是否在开发模式下运行
   */
  isDev: process.env.NODE_ENV === 'development' || !!process.env.VITE_DEV_SERVER_URL,
}

// 向渲染进程暴露 API
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// 类型声明
export type ElectronAPI = typeof electronAPI

