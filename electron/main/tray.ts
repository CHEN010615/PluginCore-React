import { Tray, Menu, BrowserWindow, app } from 'electron'
import { join } from 'path'

let tray: Tray | null = null
let isQuitting = false

/**
 * 创建系统托盘
 * @param window - 主窗口实例
 */
export function createTray(window: BrowserWindow): void {
  // 开发环境下不创建托盘
  if (process.env.VITE_DEV_SERVER_URL) {
    return
  }

  // 只在 Windows 下支持最小化到托盘功能
  if (process.platform !== 'win32') {
    return
  }

  // 设置托盘图标路径
  const iconPath = join(__dirname, '../../resources/default/256x256.png')
  
  // 创建托盘实例
  tray = new Tray(iconPath)

  // 创建右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: app.getName(),
      enabled: false
    },
    {
      type: 'separator'
    },
    {
      label: '显示窗口',
      click: () => {
        showWindow(window)
      }
    },
    {
      type: 'separator'
    },
    {
      label: '退出',
      click: () => {
        isQuitting = true
        app.quit()
      }
    }
  ])

  // 设置托盘右键菜单
  tray.setContextMenu(contextMenu)

  // 设置托盘提示文本
  tray.setToolTip(app.getName())

  // 单击托盘图标（不执行任何操作，要求双击才能显示窗口）
  tray.on('click', () => {
    // 单击不响应
  })

  // 双击托盘图标显示窗口
  tray.on('double-click', () => {
    showWindow(window)
  })

  // 窗口关闭时隐藏窗口而不是退出
  window.on('close', (event) => {
    if (isQuitting) {
      tray?.destroy()
      return
    }
    
    event.preventDefault()
    window.hide()
    return false
  })
}

/**
 * 显示窗口
 * @param window - 主窗口实例
 */
function showWindow(window: BrowserWindow): void {
  if (window.isMinimized()) {
    window.restore()
  }
  
  window.show()
  window.focus()
}

/**
 * 销毁托盘
 */
export function destroyTray(): void {
  if (tray) {
    tray.destroy()
    tray = null
  }
}
