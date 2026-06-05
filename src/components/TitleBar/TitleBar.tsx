import { useState, useEffect } from 'react'
import { Remove, CropSquare, Close } from '@mui/icons-material'
import { CHANNELS } from '@electron/common/channels'
import styles from './TitleBar.module.scss'

type WindowState = {
  isMaximized: boolean
  isFullScreen: boolean
}

const isWindowState = (value: unknown): value is WindowState => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const state = value as Partial<Record<keyof WindowState, unknown>>

  return (
    typeof state.isMaximized === 'boolean' &&
    typeof state.isFullScreen === 'boolean'
  )
}

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false)
  const api = window.electronAPI
  const isMac = api.platform === 'darwin'

  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const maxed = await api.isMaximized()
        setIsMaximized(maxed)
      } catch {
        // ignore
      }
    }
    checkMaximized()

    const removeWindowStateListener = api.on(CHANNELS.WINDOW_STATE_CHANGED, (state) => {
      if (isWindowState(state)) {
        setIsMaximized(state.isMaximized || state.isFullScreen)
      }
    })

    return removeWindowStateListener
  }, [api])

  const handleMinimize = () => api.minimize()
  const handleMaximizeToggle = () => {
    if (isMaximized) {
      api.unmaximize()
    } else {
      api.maximize()
    }
  }
  const handleClose = () => api.close()

  return (
    <header className={`${styles.titlebar} ${isMac ? styles.titlebarMac : ''}`}>
      <div className={styles.dragRegion}>
        <div className={styles.titleContent}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.appName}>帕鲁指挥部</span>
          <span className={styles.version}>v0.0.1</span>
        </div>
      </div>
      {!isMac && (
        <div className={styles.windowControls}>
          <button className={`${styles.ctrlBtn} ${styles.btnMinimize}`} onClick={handleMinimize} title="最小化">
            <Remove sx={{ fontSize: 14 }} />
          </button>
          <button className={`${styles.ctrlBtn} ${styles.btnMaximize}`} onClick={handleMaximizeToggle} title="最大化">
            <CropSquare sx={{ fontSize: 12 }} />
          </button>
          <button className={`${styles.ctrlBtn} ${styles.btnClose}`} onClick={handleClose} title="关闭">
            <Close sx={{ fontSize: 14 }} />
          </button>
        </div>
      )}
    </header>
  )
}

export default TitleBar
