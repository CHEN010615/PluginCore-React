import { Search, Notifications, Settings } from '@mui/icons-material'
import styles from './TopBar.module.scss'
import logoImg from '@/static/img/common/logo.png'

interface TopBarProps {
  activeTab?: string
}

const TopBar = ({ activeTab = 'wiki' }: TopBarProps) => {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <div className={styles.avatar}>
          <img src={logoImg} alt="Profile" className={styles.avatarImg} />
        </div>
        <div className={styles.searchWrap}>
          <Search sx={{ fontSize: 20 }} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="搜索帕鲁名称或编号..."
            type="text"
          />
        </div>
        <nav className={styles.tabs}>
          <a
            className={`${styles.tab} ${activeTab === 'wiki' ? styles.tabActive : ''}`}
            href="#"
          >
            维基
          </a>
          <a className={styles.tab} href="#">
            更新日志
          </a>
        </nav>
      </div>
      <div className={styles.right}>
        <button className={styles.iconBtn}>
          <Notifications sx={{ fontSize: 22 }} />
        </button>
        <button className={styles.iconBtn}>
          <Settings sx={{ fontSize: 22 }} />
        </button>
        <button className={styles.startBtn}>开始游戏</button>
      </div>
    </header>
  )
}

export default TopBar
