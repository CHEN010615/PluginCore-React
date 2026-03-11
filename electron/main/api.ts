import { ipcMain } from 'electron'
import { release } from 'os'

const API = {
  system: {
    os: {
      getInfo: async () => {
        return {
          platform: process.platform,
          version: release(),
          arch: process.arch
        }
      }
    },
    node: {
      getInfo: async () => {
        return {
          version: process.version,
          nodeVersion: process.versions.node,
          v8Version: process.versions.v8,
          uvVersion: process.versions.uv
        }
      }
    }
  }
}

type APIHandler = (...args: any[]) => Promise<any>

function isHandler(func: any): func is APIHandler {
  return typeof func === 'function'
}

function registerHandlers(obj: Record<string, any>, path: string[] = []) {
  Object.entries(obj).forEach(([key, value]) => {
    if (isHandler(value)) {
      const channel = [...path, key].join(':')
      ipcMain.handle(channel, value)
    } else if (typeof value === 'object' && value !== null) {
      registerHandlers(value, [...path, key])
    }
  })
}

export function registerIPCHandlers() {
  registerHandlers(API)
}
