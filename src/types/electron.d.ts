export interface ElectronAPI {
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
  on: (channel: string, callback: (...args: unknown[]) => void) => (() => void) | undefined
  once: (channel: string, callback: (...args: unknown[]) => void) => void
  off: (channel: string, callback?: (...args: unknown[]) => void) => void
  system: {
    os: {
      getInfo: () => Promise<{
        platform: string
        version: string
        arch: string
      }>
    }
    node: {
      getInfo: () => Promise<{
        version: string
        nodeVersion: string
        v8Version: string
        uvVersion: string
      }>
    }
  }
  platform: string
  isDev: boolean
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
