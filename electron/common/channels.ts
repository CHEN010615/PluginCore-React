// IPC 通道配置
export const CHANNELS = {
  // electron-store
  STORE_GET: 'electron-store:get',
  STORE_SET: 'electron-store:set',
  STORE_DELETE: 'electron-store:delete',
  
  // electron-updater
  UPDATER_CHECK: 'electron-updater:check',
  UPDATER_INSTALL: 'electron-updater:install',
  
  // 系统信息
  SYSTEM_OS: 'system:os',
  SYSTEM_NODE: 'system:node',
  SYSTEM_PERFORMANCE: 'system:performance',

  // 窗口控制
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_UNMAXIMIZE: 'window:unmaximize',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized',
  WINDOW_STATE_CHANGED: 'window:state-changed',
  WINDOW_CLOSE: 'window:close'
} as const

// 从 CHANNELS 对象提取通道类型
export type Channels = typeof CHANNELS[keyof typeof CHANNELS]
